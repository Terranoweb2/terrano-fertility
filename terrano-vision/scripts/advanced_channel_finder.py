#!/usr/bin/env python3
"""
Script de recherche avancée pour TerranoVision
Recherche les chaînes Canal+ complètes et chaînes spécialisées
"""

import requests
import re
import json
import time
from urllib.parse import urlparse, urljoin
from typing import List, Dict, Set
import concurrent.futures
from dataclasses import dataclass

@dataclass
class Channel:
    name: str
    url: str
    group: str
    logo: str = ""
    country: str = ""
    language: str = ""
    category: str = ""
    quality: str = ""
    adult: bool = False

class AdvancedChannelFinder:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.found_channels = []
        self.canal_plus_channels = []
        self.adult_channels = []
        
    def search_iptv_sources(self) -> List[str]:
        """Recherche les sources IPTV publiques"""
        sources = [
            # Sources IPTV officielles
            "https://iptv-org.github.io/iptv/index.m3u",
            "https://iptv-org.github.io/iptv/countries/fr.m3u",
            "https://iptv-org.github.io/iptv/categories/movies.m3u",
            "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
            
            # Sources Canal+ spécifiques
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_france.m3u8",
            "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/fr.m3u",
            
            # Sources internationales
            "https://iptv-org.github.io/iptv/countries/be.m3u",
            "https://iptv-org.github.io/iptv/countries/ch.m3u",
            "https://iptv-org.github.io/iptv/countries/ca.m3u",
            
            # Sources spécialisées
            "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/fr_premium.m3u",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_premium.m3u8"
        ]
        return sources
    
    def parse_m3u_content(self, content: str) -> List[Channel]:
        """Parse le contenu M3U et extrait les chaînes"""
        channels = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('#EXTINF:'):
                # Extraire les métadonnées
                channel_info = self.extract_channel_info(line)
                
                # URL de la chaîne (ligne suivante)
                if i + 1 < len(lines):
                    url = lines[i + 1].strip()
                    if url and not url.startswith('#'):
                        channel = Channel(
                            name=channel_info.get('name', 'Unknown'),
                            url=url,
                            group=channel_info.get('group', 'General'),
                            logo=channel_info.get('logo', ''),
                            country=channel_info.get('country', ''),
                            language=channel_info.get('language', ''),
                            category=channel_info.get('category', ''),
                            quality=channel_info.get('quality', 'HD'),
                            adult=channel_info.get('adult', False)
                        )
                        channels.append(channel)
                i += 2
            else:
                i += 1
                
        return channels
    
    def extract_channel_info(self, extinf_line: str) -> Dict:
        """Extrait les informations d'une ligne EXTINF"""
        info = {}
        
        # Nom de la chaîne (après la dernière virgule)
        if ',' in extinf_line:
            info['name'] = extinf_line.split(',')[-1].strip()
        
        # Groupe
        group_match = re.search(r'group-title="([^"]*)"', extinf_line)
        if group_match:
            info['group'] = group_match.group(1)
        
        # Logo
        logo_match = re.search(r'tvg-logo="([^"]*)"', extinf_line)
        if logo_match:
            info['logo'] = logo_match.group(1)
        
        # ID
        id_match = re.search(r'tvg-id="([^"]*)"', extinf_line)
        if id_match:
            info['id'] = id_match.group(1)
        
        # Pays
        country_match = re.search(r'tvg-country="([^"]*)"', extinf_line)
        if country_match:
            info['country'] = country_match.group(1)
        
        # Langue
        language_match = re.search(r'tvg-language="([^"]*)"', extinf_line)
        if language_match:
            info['language'] = language_match.group(1)
        
        # Détection contenu adulte
        name_lower = info.get('name', '').lower()
        group_lower = info.get('group', '').lower()
        
        adult_keywords = ['adult', 'xxx', 'porn', 'erotic', 'sexy', '+18', '18+']
        info['adult'] = any(keyword in name_lower or keyword in group_lower 
                           for keyword in adult_keywords)
        
        return info
    
    def is_canal_plus_channel(self, channel: Channel) -> bool:
        """Vérifie si c'est une chaîne Canal+"""
        canal_keywords = [
            'canal+', 'canal plus', 'canalplus', 'canal ',
            'c+', 'csat', 'canal sport', 'canal cinema',
            'canal series', 'canal family', 'canal decale'
        ]
        
        name_lower = channel.name.lower()
        return any(keyword in name_lower for keyword in canal_keywords)
    
    def test_stream_url(self, url: str, timeout: int = 10) -> bool:
        """Teste si une URL de stream fonctionne"""
        try:
            response = self.session.head(url, timeout=timeout, allow_redirects=True)
            return response.status_code == 200
        except:
            return False
    
    def search_channels_from_source(self, source_url: str) -> List[Channel]:
        """Recherche les chaînes depuis une source"""
        try:
            print(f"🔍 Recherche depuis: {source_url}")
            response = self.session.get(source_url, timeout=30)
            response.raise_for_status()
            
            channels = self.parse_m3u_content(response.text)
            print(f"✅ Trouvé {len(channels)} chaînes")
            
            return channels
            
        except Exception as e:
            print(f"❌ Erreur avec {source_url}: {e}")
            return []
    
    def filter_canal_plus_channels(self, channels: List[Channel]) -> List[Channel]:
        """Filtre les chaînes Canal+"""
        canal_channels = []
        
        for channel in channels:
            if self.is_canal_plus_channel(channel):
                canal_channels.append(channel)
        
        return canal_channels
    
    def filter_adult_channels(self, channels: List[Channel]) -> List[Channel]:
        """Filtre les chaînes adultes (pour information seulement)"""
        adult_channels = []
        
        for channel in channels:
            if channel.adult:
                adult_channels.append(channel)
        
        return adult_channels
    
    def search_all_sources(self) -> Dict:
        """Recherche dans toutes les sources"""
        sources = self.search_iptv_sources()
        all_channels = []
        
        print("🚀 Début de la recherche avancée...")
        
        # Recherche parallèle
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_source = {
                executor.submit(self.search_channels_from_source, source): source 
                for source in sources
            }
            
            for future in concurrent.futures.as_completed(future_to_source):
                source = future_to_source[future]
                try:
                    channels = future.result()
                    all_channels.extend(channels)
                except Exception as e:
                    print(f"❌ Erreur avec {source}: {e}")
        
        # Déduplication
        unique_channels = self.deduplicate_channels(all_channels)
        
        # Classification
        canal_channels = self.filter_canal_plus_channels(unique_channels)
        adult_channels = self.filter_adult_channels(unique_channels)
        
        return {
            'total_channels': len(unique_channels),
            'canal_plus_channels': canal_channels,
            'adult_channels': adult_channels,
            'all_channels': unique_channels
        }
    
    def deduplicate_channels(self, channels: List[Channel]) -> List[Channel]:
        """Supprime les doublons"""
        seen_urls = set()
        unique_channels = []
        
        for channel in channels:
            if channel.url not in seen_urls:
                seen_urls.add(channel.url)
                unique_channels.append(channel)
        
        return unique_channels
    
    def generate_m3u_playlist(self, channels: List[Channel], filename: str):
        """Génère une playlist M3U"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('#EXTM3U\n\n')
            
            for channel in channels:
                # Ligne EXTINF
                extinf = f'#EXTINF:-1'
                
                if channel.group:
                    extinf += f' group-title="{channel.group}"'
                if channel.logo:
                    extinf += f' tvg-logo="{channel.logo}"'
                if channel.country:
                    extinf += f' tvg-country="{channel.country}"'
                if channel.language:
                    extinf += f' tvg-language="{channel.language}"'
                
                extinf += f',{channel.name}\n'
                f.write(extinf)
                f.write(f'{channel.url}\n\n')
    
    def generate_report(self, results: Dict) -> str:
        """Génère un rapport de recherche"""
        report = []
        report.append("=" * 80)
        report.append("🔍 RAPPORT DE RECHERCHE AVANCÉE - TERRANOVISION")
        report.append("=" * 80)
        report.append("")
        
        # Statistiques générales
        report.append(f"📊 STATISTIQUES GÉNÉRALES:")
        report.append(f"   • Total chaînes trouvées: {results['total_channels']}")
        report.append(f"   • Chaînes Canal+: {len(results['canal_plus_channels'])}")
        report.append(f"   • Chaînes spécialisées adultes: {len(results['adult_channels'])}")
        report.append("")
        
        # Chaînes Canal+
        if results['canal_plus_channels']:
            report.append("📺 CHAÎNES CANAL+ TROUVÉES:")
            for i, channel in enumerate(results['canal_plus_channels'][:20], 1):
                report.append(f"   {i:2d}. {channel.name}")
                report.append(f"       Groupe: {channel.group}")
                report.append(f"       URL: {channel.url[:80]}...")
                report.append("")
        
        # Chaînes adultes (information seulement)
        if results['adult_channels']:
            report.append("🔞 CHAÎNES SPÉCIALISÉES ADULTES (Information):")
            report.append(f"   • Nombre total: {len(results['adult_channels'])}")
            report.append("   • Ces chaînes nécessitent une vérification d'âge")
            report.append("   • Conformité légale requise selon juridiction")
            report.append("")
        
        # Recommandations
        report.append("💡 RECOMMANDATIONS:")
        report.append("   • Tester la fonctionnalité des URLs avant intégration")
        report.append("   • Vérifier les droits de diffusion")
        report.append("   • Implémenter un contrôle parental pour contenu sensible")
        report.append("   • Respecter les réglementations locales")
        report.append("")
        
        return "\n".join(report)

def main():
    """Fonction principale"""
    finder = AdvancedChannelFinder()
    
    print("🚀 Démarrage de la recherche avancée TerranoVision...")
    print("🔍 Recherche des chaînes Canal+ et spécialisées...")
    
    # Recherche
    results = finder.search_all_sources()
    
    # Génération des playlists
    output_dir = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/"
    
    # Canal+
    if results['canal_plus_channels']:
        canal_file = f"{output_dir}canal_plus_complete.m3u"
        finder.generate_m3u_playlist(results['canal_plus_channels'], canal_file)
        print(f"✅ Playlist Canal+ générée: {canal_file}")
    
    # Chaînes spécialisées (information seulement)
    if results['adult_channels']:
        adult_file = f"{output_dir}specialized_channels_info.m3u"
        finder.generate_m3u_playlist(results['adult_channels'], adult_file)
        print(f"ℹ️  Liste informative générée: {adult_file}")
    
    # Rapport
    report = finder.generate_report(results)
    report_file = f"{output_dir}search_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("\n" + report)
    print(f"📄 Rapport complet sauvé: {report_file}")
    
    return results

if __name__ == "__main__":
    main()
