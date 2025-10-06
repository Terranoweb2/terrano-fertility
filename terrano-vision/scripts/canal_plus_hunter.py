#!/usr/bin/env python3
"""
Script spécialisé pour rechercher toutes les chaînes Canal+ françaises
Recherche approfondie dans les sources spécialisées
"""

import requests
import re
import json
from typing import List, Dict
import time

class CanalPlusHunter:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def search_canal_plus_sources(self) -> List[str]:
        """Sources spécialisées pour Canal+"""
        return [
            # Sources françaises spécialisées
            "https://iptv-org.github.io/iptv/countries/fr.m3u",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_france.m3u8",
            
            # Sources Canal+ spécifiques
            "https://iptv-org.github.io/iptv/categories/movies.m3u",
            "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
            "https://iptv-org.github.io/iptv/categories/sports.m3u",
            
            # Sources francophones
            "https://iptv-org.github.io/iptv/countries/be.m3u",
            "https://iptv-org.github.io/iptv/countries/ch.m3u",
            "https://iptv-org.github.io/iptv/countries/ca.m3u",
            
            # Sources premium
            "https://iptv-org.github.io/iptv/index.m3u"
        ]
    
    def get_canal_plus_keywords(self) -> List[str]:
        """Mots-clés pour identifier les chaînes Canal+"""
        return [
            # Canal+ principal
            'canal+', 'canal plus', 'canalplus', 'canal ',
            
            # Déclinaisons Canal+
            'canal+ cinema', 'canal+ sport', 'canal+ series',
            'canal+ family', 'canal+ decale', 'canal+ docs',
            
            # Variantes
            'c+', 'csat', 'canal sport', 'canal cinema',
            'canal series', 'canal family', 'canal decale',
            
            # Chaînes du groupe
            'cine+', 'infosport+', 'planete+',
            
            # Anciennes dénominations
            'tps', 'multithematiques'
        ]
    
    def extract_canal_channels(self, m3u_content: str) -> List[Dict]:
        """Extrait spécifiquement les chaînes Canal+"""
        channels = []
        lines = m3u_content.strip().split('\n')
        keywords = self.get_canal_plus_keywords()
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('#EXTINF:'):
                # Extraire le nom de la chaîne
                if ',' in line:
                    channel_name = line.split(',')[-1].strip()
                    
                    # Vérifier si c'est une chaîne Canal+
                    name_lower = channel_name.lower()
                    is_canal = any(keyword in name_lower for keyword in keywords)
                    
                    if is_canal and i + 1 < len(lines):
                        url = lines[i + 1].strip()
                        if url and not url.startswith('#'):
                            # Extraire les métadonnées
                            info = self.extract_metadata(line)
                            
                            channel = {
                                'name': channel_name,
                                'url': url,
                                'group': info.get('group', 'Canal+'),
                                'logo': info.get('logo', ''),
                                'country': info.get('country', 'FR'),
                                'quality': info.get('quality', 'HD'),
                                'category': self.categorize_canal_channel(channel_name)
                            }
                            channels.append(channel)
                
                i += 2
            else:
                i += 1
        
        return channels
    
    def extract_metadata(self, extinf_line: str) -> Dict:
        """Extrait les métadonnées d'une ligne EXTINF"""
        metadata = {}
        
        # Groupe
        group_match = re.search(r'group-title="([^"]*)"', extinf_line)
        if group_match:
            metadata['group'] = group_match.group(1)
        
        # Logo
        logo_match = re.search(r'tvg-logo="([^"]*)"', extinf_line)
        if logo_match:
            metadata['logo'] = logo_match.group(1)
        
        # Pays
        country_match = re.search(r'tvg-country="([^"]*)"', extinf_line)
        if country_match:
            metadata['country'] = country_match.group(1)
        
        # Qualité (détection dans le nom)
        if '1080p' in extinf_line or 'FHD' in extinf_line:
            metadata['quality'] = '1080p'
        elif '720p' in extinf_line or 'HD' in extinf_line:
            metadata['quality'] = '720p'
        elif '4K' in extinf_line or 'UHD' in extinf_line:
            metadata['quality'] = '4K'
        else:
            metadata['quality'] = 'HD'
        
        return metadata
    
    def categorize_canal_channel(self, name: str) -> str:
        """Catégorise une chaîne Canal+"""
        name_lower = name.lower()
        
        if any(word in name_lower for word in ['cinema', 'cine', 'movie']):
            return 'Cinéma'
        elif any(word in name_lower for word in ['sport', 'foot', 'rugby']):
            return 'Sport'
        elif any(word in name_lower for word in ['series', 'serie']):
            return 'Séries'
        elif any(word in name_lower for word in ['family', 'junior', 'kid']):
            return 'Famille'
        elif any(word in name_lower for word in ['docs', 'docu', 'planete']):
            return 'Documentaires'
        elif any(word in name_lower for word in ['decale', 'decalé']):
            return 'Divertissement'
        else:
            return 'Général'
    
    def search_all_canal_sources(self) -> List[Dict]:
        """Recherche dans toutes les sources Canal+"""
        all_channels = []
        sources = self.search_canal_plus_sources()
        
        print("🔍 Recherche approfondie des chaînes Canal+...")
        
        for source in sources:
            try:
                print(f"📡 Analyse de: {source}")
                response = self.session.get(source, timeout=30)
                response.raise_for_status()
                
                channels = self.extract_canal_channels(response.text)
                all_channels.extend(channels)
                
                print(f"✅ {len(channels)} chaînes Canal+ trouvées")
                time.sleep(1)  # Éviter la surcharge
                
            except Exception as e:
                print(f"❌ Erreur avec {source}: {e}")
        
        # Déduplication
        unique_channels = self.deduplicate_channels(all_channels)
        return unique_channels
    
    def deduplicate_channels(self, channels: List[Dict]) -> List[Dict]:
        """Supprime les doublons"""
        seen = set()
        unique = []
        
        for channel in channels:
            key = (channel['name'].lower(), channel['url'])
            if key not in seen:
                seen.add(key)
                unique.append(channel)
        
        return unique
    
    def generate_canal_playlist(self, channels: List[Dict]) -> str:
        """Génère une playlist M3U pour Canal+"""
        playlist = "#EXTM3U\n\n"
        
        # Grouper par catégorie
        categories = {}
        for channel in channels:
            cat = channel['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(channel)
        
        # Générer par catégorie
        for category, cat_channels in sorted(categories.items()):
            playlist += f"# === {category.upper()} ===\n\n"
            
            for channel in sorted(cat_channels, key=lambda x: x['name']):
                extinf = f"#EXTINF:-1"
                extinf += f' group-title="{category}"'
                
                if channel['logo']:
                    extinf += f' tvg-logo="{channel["logo"]}"'
                if channel['country']:
                    extinf += f' tvg-country="{channel["country"]}"'
                
                extinf += f',{channel["name"]}\n'
                playlist += extinf
                playlist += f'{channel["url"]}\n\n'
        
        return playlist
    
    def generate_detailed_report(self, channels: List[Dict]) -> str:
        """Génère un rapport détaillé"""
        report = []
        report.append("=" * 80)
        report.append("📺 RAPPORT DÉTAILLÉ - CHAÎNES CANAL+ TROUVÉES")
        report.append("=" * 80)
        report.append("")
        
        # Statistiques par catégorie
        categories = {}
        for channel in channels:
            cat = channel['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        report.append("📊 RÉPARTITION PAR CATÉGORIE:")
        for cat, count in sorted(categories.items()):
            report.append(f"   • {cat}: {count} chaînes")
        report.append("")
        
        # Liste détaillée
        report.append("📋 LISTE COMPLÈTE DES CHAÎNES:")
        for i, channel in enumerate(sorted(channels, key=lambda x: x['name']), 1):
            report.append(f"{i:3d}. {channel['name']}")
            report.append(f"     Catégorie: {channel['category']}")
            report.append(f"     Qualité: {channel['quality']}")
            report.append(f"     Pays: {channel['country']}")
            if channel['logo']:
                report.append(f"     Logo: Disponible")
            report.append(f"     URL: {channel['url'][:60]}...")
            report.append("")
        
        # Recommandations
        report.append("💡 RECOMMANDATIONS D'INTÉGRATION:")
        report.append("   • Tester chaque URL avant ajout à la playlist")
        report.append("   • Vérifier les droits de diffusion")
        report.append("   • Organiser par catégories dans l'interface")
        report.append("   • Implémenter un système de favoris")
        report.append("")
        
        return "\n".join(report)

def main():
    """Fonction principale"""
    hunter = CanalPlusHunter()
    
    # Recherche
    channels = hunter.search_all_canal_sources()
    
    if not channels:
        print("❌ Aucune chaîne Canal+ trouvée")
        return
    
    print(f"\n🎉 {len(channels)} chaînes Canal+ uniques trouvées !")
    
    # Génération des fichiers
    output_dir = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/"
    
    # Playlist M3U
    playlist_content = hunter.generate_canal_playlist(channels)
    playlist_file = f"{output_dir}canal_plus_complete_detailed.m3u"
    with open(playlist_file, 'w', encoding='utf-8') as f:
        f.write(playlist_content)
    print(f"✅ Playlist détaillée: {playlist_file}")
    
    # Rapport
    report = hunter.generate_detailed_report(channels)
    report_file = f"{output_dir}canal_plus_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"📄 Rapport détaillé: {report_file}")
    
    # JSON pour intégration
    json_file = f"{output_dir}canal_plus_channels.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(channels, f, indent=2, ensure_ascii=False)
    print(f"💾 Données JSON: {json_file}")
    
    print("\n" + "=" * 50)
    print("🎯 RÉSUMÉ CANAL+ HUNTER")
    print("=" * 50)
    
    # Statistiques finales
    categories = {}
    for channel in channels:
        cat = channel['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in sorted(categories.items()):
        print(f"📺 {cat}: {count} chaînes")
    
    print(f"\n🏆 Total: {len(channels)} chaînes Canal+ prêtes pour TerranoVision !")

if __name__ == "__main__":
    main()
