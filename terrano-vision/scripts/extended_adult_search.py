#!/usr/bin/env python3
"""
Script de recherche étendue pour contenu adulte - Sources alternatives
ATTENTION: Contenu réservé aux adultes - Usage professionnel uniquement
"""

import requests
import re
import json
import time
from typing import List, Dict

class ExtendedAdultSearch:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Mots-clés étendus pour contenu adulte
        self.extended_keywords = [
            # Mots-clés explicites
            'adult', 'xxx', 'porn', 'erotic', 'sexy', '+18', '18+',
            'playboy', 'hustler', 'penthouse', 'vivid', 'brazzers',
            'dorcel', 'marc dorcel', 'private', 'redlight',
            
            # Termes en différentes langues
            'adulto', 'adultos', 'erótico', 'erotico', 'sensual',
            'adulte', 'érotique', 'charme', 'hot', 'spice',
            'porno', 'sexo', 'caliente', 'picante',
            
            # Chaînes et studios connus
            'reality kings', 'naughty america', 'bangbros',
            'digital playground', 'wicked pictures', 'evil angel',
            'kink', 'burning angel', 'girlfriends films',
            
            # Termes spécialisés
            'fetish', 'bdsm', 'milf', 'teen', 'amateur',
            'lesbian', 'gay', 'trans', 'shemale', 'bisexual'
        ]
    
    def get_alternative_sources(self) -> List[str]:
        """Sources alternatives pour recherche étendue"""
        return [
            # Sources IPTV alternatives (légales)
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_adult.m3u8",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_xxx.m3u8",
            
            # Sources par régions (certaines autorisent le contenu adulte)
            "https://iptv-org.github.io/iptv/languages/en.m3u",
            "https://iptv-org.github.io/iptv/languages/es.m3u",
            "https://iptv-org.github.io/iptv/languages/fr.m3u",
            "https://iptv-org.github.io/iptv/languages/de.m3u",
            
            # Sources de divertissement nocturne
            "https://iptv-org.github.io/iptv/categories/classic.m3u",
            "https://iptv-org.github.io/iptv/categories/comedy.m3u",
            "https://iptv-org.github.io/iptv/categories/series.m3u"
        ]
    
    def is_adult_content_extended(self, channel_name: str, group_title: str = "") -> bool:
        """Détection étendue du contenu adulte"""
        text_to_check = f"{channel_name} {group_title}".lower()
        
        # Vérifier les mots-clés étendus
        for keyword in self.extended_keywords:
            if keyword in text_to_check:
                return True
        
        # Patterns spéciaux
        adult_patterns = [
            r'\b(xxx|18\+|\+18)\b',
            r'\b(adult|porn|erotic)\b',
            r'\b(playboy|hustler|penthouse)\b',
            r'\b(hot|sexy|spice)\s+(tv|channel)\b'
        ]
        
        for pattern in adult_patterns:
            if re.search(pattern, text_to_check, re.IGNORECASE):
                return True
        
        return False
    
    def categorize_adult_content_extended(self, channel_name: str) -> str:
        """Catégorisation étendue du contenu adulte"""
        name_lower = channel_name.lower()
        
        # Catégories spécialisées
        if any(word in name_lower for word in ['playboy', 'penthouse', 'hustler']):
            return 'Magazines Premium'
        elif any(word in name_lower for word in ['dorcel', 'marc dorcel', 'private']):
            return 'Studios Européens'
        elif any(word in name_lower for word in ['brazzers', 'reality kings', 'naughty america']):
            return 'Studios Américains'
        elif any(word in name_lower for word in ['gay', 'lesbian', 'trans']):
            return 'LGBTQ+ Adulte'
        elif any(word in name_lower for word in ['fetish', 'bdsm', 'kink']):
            return 'Spécialisé/Fétiche'
        elif any(word in name_lower for word in ['amateur', 'homemade']):
            return 'Amateur/Réalité'
        elif any(word in name_lower for word in ['milf', 'mature']):
            return 'Mature/MILF'
        elif any(word in name_lower for word in ['teen', 'young']):
            return 'Jeunes Adultes'
        elif any(word in name_lower for word in ['movie', 'film', 'cinema']):
            return 'Films Adultes'
        elif any(word in name_lower for word in ['live', 'cam', 'webcam']):
            return 'Live/Webcam'
        else:
            return 'Général Adulte'
    
    def search_extended_adult_content(self) -> List[Dict]:
        """Recherche étendue dans sources alternatives"""
        all_adult_channels = []
        sources = self.get_alternative_sources()
        
        print("🔍 Recherche étendue de contenu adulte...")
        print("⚠️  Sources alternatives et spécialisées")
        print()
        
        for source in sources:
            try:
                print(f"📡 Analyse étendue: {source}")
                response = self.session.get(source, timeout=30)
                response.raise_for_status()
                
                adult_channels = self.parse_m3u_extended(response.text)
                all_adult_channels.extend(adult_channels)
                
                print(f"🔞 {len(adult_channels)} chaînes adultes trouvées")
                time.sleep(2)
                
            except Exception as e:
                print(f"❌ Erreur avec {source}: {e}")
        
        return self.deduplicate_channels(all_adult_channels)
    
    def parse_m3u_extended(self, content: str) -> List[Dict]:
        """Parse M3U avec détection étendue"""
        adult_channels = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('#EXTINF:'):
                channel_info = self.extract_metadata_extended(line)
                
                if i + 1 < len(lines):
                    url = lines[i + 1].strip()
                    if url and not url.startswith('#'):
                        if self.is_adult_content_extended(channel_info['name'], channel_info.get('group', '')):
                            channel = {
                                'name': channel_info['name'],
                                'url': url,
                                'group': channel_info.get('group', 'Adult'),
                                'logo': channel_info.get('logo', ''),
                                'country': channel_info.get('country', ''),
                                'language': channel_info.get('language', ''),
                                'quality': self.detect_quality_extended(line),
                                'adult_category': self.categorize_adult_content_extended(channel_info['name']),
                                'rating': self.estimate_content_rating(channel_info['name'])
                            }
                            adult_channels.append(channel)
                
                i += 2
            else:
                i += 1
        
        return adult_channels
    
    def extract_metadata_extended(self, extinf_line: str) -> Dict:
        """Extraction étendue des métadonnées"""
        metadata = {}
        
        # Nom de la chaîne
        if ',' in extinf_line:
            metadata['name'] = extinf_line.split(',')[-1].strip()
        
        # Métadonnées étendues
        patterns = {
            'group': r'group-title="([^"]*)"',
            'logo': r'tvg-logo="([^"]*)"',
            'country': r'tvg-country="([^"]*)"',
            'language': r'tvg-language="([^"]*)"',
            'id': r'tvg-id="([^"]*)"'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, extinf_line)
            if match:
                metadata[key] = match.group(1)
        
        return metadata
    
    def detect_quality_extended(self, extinf_line: str) -> str:
        """Détection étendue de la qualité"""
        quality_patterns = [
            (r'8K|4320p', '8K'),
            (r'4K|UHD|2160p', '4K'),
            (r'1080p|FHD', '1080p'),
            (r'720p|HD', '720p'),
            (r'480p', '480p'),
            (r'360p', '360p'),
            (r'240p', '240p')
        ]
        
        for pattern, quality in quality_patterns:
            if re.search(pattern, extinf_line, re.IGNORECASE):
                return quality
        
        return 'SD'
    
    def estimate_content_rating(self, channel_name: str) -> str:
        """Estime la classification du contenu"""
        name_lower = channel_name.lower()
        
        if any(word in name_lower for word in ['extreme', 'hardcore', 'xxx']):
            return 'XXX'
        elif any(word in name_lower for word in ['soft', 'glamour', 'sensual']):
            return 'Soft'
        elif any(word in name_lower for word in ['fetish', 'bdsm', 'kink']):
            return 'Spécialisé'
        else:
            return 'Standard'
    
    def deduplicate_channels(self, channels: List[Dict]) -> List[Dict]:
        """Supprime les doublons avec logique étendue"""
        seen = set()
        unique = []
        
        for channel in channels:
            # Clé basée sur nom normalisé et domaine URL
            name_normalized = re.sub(r'[^a-zA-Z0-9]', '', channel['name'].lower())
            url_domain = re.search(r'https?://([^/]+)', channel['url'])
            domain = url_domain.group(1) if url_domain else 'unknown'
            
            key = (name_normalized, domain)
            if key not in seen:
                seen.add(key)
                unique.append(channel)
        
        return unique
    
    def generate_extended_report(self, channels: List[Dict]) -> str:
        """Génère un rapport étendu"""
        report = []
        report.append("=" * 80)
        report.append("🔞 RAPPORT ÉTENDU CONTENU ADULTE - TERRANOVISION")
        report.append("=" * 80)
        report.append("⚠️  RECHERCHE ÉTENDUE - SOURCES ALTERNATIVES")
        report.append("=" * 80)
        report.append("")
        
        if not channels:
            report.append("ℹ️  RÉSULTAT DE LA RECHERCHE ÉTENDUE:")
            report.append("   • Aucun contenu adulte supplémentaire trouvé")
            report.append("   • Sources alternatives également limitées")
            report.append("   • Politique de contenu familial généralisée")
            report.append("   • Recommandation: Focus sur contenu familial")
            report.append("")
            return "\n".join(report)
        
        # Statistiques étendues
        categories = {}
        ratings = {}
        qualities = {}
        languages = {}
        
        for channel in channels:
            # Catégories
            cat = channel['adult_category']
            categories[cat] = categories.get(cat, 0) + 1
            
            # Classifications
            rating = channel['rating']
            ratings[rating] = ratings.get(rating, 0) + 1
            
            # Qualités
            quality = channel['quality']
            qualities[quality] = qualities.get(quality, 0) + 1
            
            # Langues
            lang = channel.get('language', 'Unknown')
            languages[lang] = languages.get(lang, 0) + 1
        
        report.append(f"📊 STATISTIQUES ÉTENDUES:")
        report.append(f"   • Total chaînes adultes: {len(channels)}")
        report.append(f"   • Catégories spécialisées: {len(categories)}")
        report.append(f"   • Classifications: {len(ratings)}")
        report.append(f"   • Langues détectées: {len(languages)}")
        report.append("")
        
        # Répartition par catégorie spécialisée
        report.append("🎯 CATÉGORIES SPÉCIALISÉES:")
        for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(channels)) * 100
            report.append(f"   • {cat}: {count} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Classifications de contenu
        report.append("🔞 CLASSIFICATIONS DE CONTENU:")
        for rating, count in sorted(ratings.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(channels)) * 100
            report.append(f"   • {rating}: {count} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Recommandations business étendues
        report.append("💼 RECOMMANDATIONS BUSINESS ÉTENDUES:")
        report.append("   • Segment premium adulte viable")
        report.append("   • Tarification spécialisée possible")
        report.append("   • Contrôles d'accès renforcés nécessaires")
        report.append("   • Séparation complète interface familiale")
        report.append("   • Conformité légale stricte requise")
        report.append("")
        
        return "\n".join(report)

def main():
    """Fonction principale de recherche étendue"""
    print("🔍 RECHERCHE ÉTENDUE DE CONTENU ADULTE")
    print("⚠️  Sources alternatives et spécialisées")
    print()
    
    searcher = ExtendedAdultSearch()
    
    # Recherche étendue
    extended_channels = searcher.search_extended_adult_content()
    
    # Générer rapport étendu
    extended_report = searcher.generate_extended_report(extended_channels)
    
    # Sauvegarder
    output_dir = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/"
    extended_report_file = f"{output_dir}extended_adult_report.txt"
    
    with open(extended_report_file, 'w', encoding='utf-8') as f:
        f.write(extended_report)
    
    print(f"📄 Rapport étendu: {extended_report_file}")
    
    # Afficher résultats
    print("\n" + extended_report)
    
    # Résumé final
    print("🎯 RÉSUMÉ RECHERCHE ÉTENDUE:")
    if extended_channels:
        print(f"   • {len(extended_channels)} chaînes adultes supplémentaires")
        print("   • Contenu spécialisé identifié")
        print("   • Contrôles renforcés recommandés")
    else:
        print("   • Aucun contenu adulte supplémentaire trouvé")
        print("   • Sources publiques maintiennent politique familiale")
        print("   • Recommandation: Focus sur contenu premium familial")

if __name__ == "__main__":
    main()
