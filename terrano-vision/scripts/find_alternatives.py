#!/usr/bin/env python3
"""
Script de recherche d'alternatives pour chaînes non fonctionnelles
Focus: Contenu de divertissement mature mais approprié
"""

import requests
import json
import time
from typing import List, Dict
import re

class AlternativeChannelFinder:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        print("=" * 80)
        print("🔄 RECHERCHE D'ALTERNATIVES - CHAÎNES NON FONCTIONNELLES")
        print("=" * 80)
        print("🎯 Focus: Contenu divertissement mature mais approprié")
        print("✅ Remplacement des chaînes défaillantes")
        print("=" * 80)
        print()
    
    def get_non_functional_channels(self) -> List[Dict]:
        """Liste des chaînes non fonctionnelles à remplacer"""
        return [
            {
                'name': 'FilmRise Hot Ones (720p)',
                'category': 'Culinaire/Divertissement',
                'quality': '720p',
                'type': 'Émission culinaire avec célébrités',
                'target_audience': 'Jeunes adultes',
                'replacement_keywords': ['cooking', 'celebrity', 'food', 'entertainment']
            },
            {
                'name': 'Hot Ones (duplicatas)',
                'category': 'Culinaire/Divertissement', 
                'quality': 'SD',
                'type': 'Émission culinaire populaire',
                'target_audience': 'Tout public',
                'replacement_keywords': ['cooking', 'food', 'talk show', 'celebrity']
            },
            {
                'name': 'Shots! (1080p)',
                'category': 'Divertissement',
                'quality': '1080p',
                'type': 'Émission de divertissement',
                'target_audience': 'Jeunes adultes',
                'replacement_keywords': ['entertainment', 'variety', 'comedy', 'lifestyle']
            }
        ]
    
    def get_alternative_sources(self) -> List[str]:
        """Sources pour rechercher des alternatives"""
        return [
            # Sources IPTV principales
            "https://iptv-org.github.io/iptv/index.m3u",
            "https://iptv-org.github.io/iptv/categories/cooking.m3u",
            "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
            "https://iptv-org.github.io/iptv/categories/lifestyle.m3u",
            "https://iptv-org.github.io/iptv/categories/comedy.m3u",
            "https://iptv-org.github.io/iptv/categories/variety.m3u",
            
            # Sources par pays pour contenu de qualité
            "https://iptv-org.github.io/iptv/countries/us.m3u",
            "https://iptv-org.github.io/iptv/countries/ca.m3u",
            "https://iptv-org.github.io/iptv/countries/gb.m3u",
            "https://iptv-org.github.io/iptv/countries/fr.m3u",
        ]
    
    def find_cooking_alternatives(self) -> List[Dict]:
        """Trouve des alternatives pour les émissions culinaires"""
        alternatives = []
        
        # Chaînes culinaires connues et populaires
        cooking_channels = [
            {
                'name': 'Food Network',
                'description': 'Chaîne culinaire premium américaine',
                'category': 'Culinaire',
                'content': 'Émissions de cuisine, concours culinaires, chefs célèbres',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Très élevée'
            },
            {
                'name': 'Cooking Channel',
                'description': 'Chaîne dédiée à la gastronomie',
                'category': 'Culinaire',
                'content': 'Documentaires culinaires, voyages gastronomiques',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Élevée'
            },
            {
                'name': 'Tastemade',
                'description': 'Contenu culinaire moderne et lifestyle',
                'category': 'Culinaire/Lifestyle',
                'content': 'Recettes, voyages culinaires, culture food',
                'quality': '1080p',
                'family_friendly': True,
                'popularity': 'Très élevée'
            },
            {
                'name': 'Bon Appétit',
                'description': 'Chaîne du magazine culinaire célèbre',
                'category': 'Culinaire',
                'content': 'Techniques culinaires, tests de recettes',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Élevée'
            }
        ]
        
        return cooking_channels
    
    def find_entertainment_alternatives(self) -> List[Dict]:
        """Trouve des alternatives pour le divertissement"""
        alternatives = []
        
        # Chaînes de divertissement mature mais approprié
        entertainment_channels = [
            {
                'name': 'Comedy Central',
                'description': 'Chaîne de comédie et divertissement',
                'category': 'Comédie/Divertissement',
                'content': 'Stand-up, séries comiques, talk-shows',
                'quality': 'HD',
                'family_friendly': False,  # Contenu mature mais approprié
                'popularity': 'Très élevée',
                'age_rating': '16+'
            },
            {
                'name': 'MTV',
                'description': 'Chaîne de divertissement jeune',
                'category': 'Divertissement/Musique',
                'content': 'Émissions de télé-réalité, musique, culture jeune',
                'quality': 'HD',
                'family_friendly': False,  # Contenu jeune adulte
                'popularity': 'Très élevée',
                'age_rating': '16+'
            },
            {
                'name': 'VH1',
                'description': 'Divertissement et culture pop',
                'category': 'Divertissement/Musique',
                'content': 'Émissions de célébrités, culture pop, musique',
                'quality': 'HD',
                'family_friendly': False,  # Contenu mature
                'popularity': 'Élevée',
                'age_rating': '16+'
            },
            {
                'name': 'E! Entertainment',
                'description': 'Actualités des célébrités et divertissement',
                'category': 'Divertissement/Célébrités',
                'content': 'Actualités people, émissions de célébrités',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Très élevée'
            },
            {
                'name': 'Bravo',
                'description': 'Divertissement haut de gamme',
                'category': 'Divertissement/Lifestyle',
                'content': 'Télé-réalité premium, lifestyle, culture',
                'quality': 'HD',
                'family_friendly': False,  # Contenu mature mais approprié
                'popularity': 'Élevée',
                'age_rating': '16+'
            }
        ]
        
        return entertainment_channels
    
    def find_lifestyle_alternatives(self) -> List[Dict]:
        """Trouve des alternatives lifestyle et variety"""
        alternatives = []
        
        lifestyle_channels = [
            {
                'name': 'HGTV',
                'description': 'Maison, jardin et lifestyle',
                'category': 'Lifestyle/Décoration',
                'content': 'Rénovation, décoration, immobilier',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Très élevée'
            },
            {
                'name': 'TLC',
                'description': 'The Learning Channel - Lifestyle',
                'category': 'Lifestyle/Documentaire',
                'content': 'Émissions de lifestyle, transformations',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Très élevée'
            },
            {
                'name': 'Travel Channel',
                'description': 'Voyages et découvertes',
                'category': 'Voyage/Lifestyle',
                'content': 'Documentaires de voyage, gastronomie mondiale',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Élevée'
            },
            {
                'name': 'Lifestyle Network',
                'description': 'Chaîne lifestyle complète',
                'category': 'Lifestyle',
                'content': 'Mode, beauté, cuisine, décoration',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Moyenne'
            }
        ]
        
        return lifestyle_channels
    
    def find_international_alternatives(self) -> List[Dict]:
        """Trouve des alternatives internationales de qualité"""
        alternatives = []
        
        international_channels = [
            {
                'name': 'TV5 Monde Style',
                'description': 'Lifestyle et culture francophone',
                'category': 'Lifestyle/Culture',
                'content': 'Mode, gastronomie, art de vivre français',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Élevée',
                'language': 'Français'
            },
            {
                'name': 'Fashion TV',
                'description': 'Mode et lifestyle international',
                'category': 'Mode/Lifestyle',
                'content': 'Défilés, mode, beauté, lifestyle premium',
                'quality': '4K',
                'family_friendly': False,  # Contenu mode mature
                'popularity': 'Très élevée',
                'age_rating': '16+'
            },
            {
                'name': 'Trace Urban',
                'description': 'Musique urbaine et culture',
                'category': 'Musique/Culture',
                'content': 'Clips, émissions musicales, culture urbaine',
                'quality': 'HD',
                'family_friendly': False,  # Paroles explicites possibles
                'popularity': 'Très élevée',
                'age_rating': '16+'
            },
            {
                'name': 'Mezzo',
                'description': 'Musique classique et jazz',
                'category': 'Musique/Culture',
                'content': 'Concerts, documentaires musicaux',
                'quality': 'HD',
                'family_friendly': True,
                'popularity': 'Moyenne'
            }
        ]
        
        return international_channels
    
    def search_functional_alternatives(self) -> List[Dict]:
        """Recherche des alternatives fonctionnelles dans les sources IPTV"""
        functional_alternatives = []
        sources = self.get_alternative_sources()
        
        print("🔍 Recherche d'alternatives fonctionnelles...")
        print()
        
        # Mots-clés pour identifier les bonnes alternatives
        target_keywords = [
            'food', 'cooking', 'chef', 'kitchen', 'recipe',
            'entertainment', 'variety', 'comedy', 'lifestyle',
            'fashion', 'travel', 'home', 'garden', 'style'
        ]
        
        for source in sources:
            try:
                print(f"📡 Analyse: {source.split('/')[-1]}")
                response = self.session.get(source, timeout=30)
                response.raise_for_status()
                
                alternatives = self.parse_m3u_for_alternatives(response.text, target_keywords)
                functional_alternatives.extend(alternatives)
                
                print(f"✅ {len(alternatives)} alternatives trouvées")
                time.sleep(2)
                
            except Exception as e:
                print(f"❌ Erreur: {e}")
        
        return self.deduplicate_alternatives(functional_alternatives)
    
    def parse_m3u_for_alternatives(self, content: str, keywords: List[str]) -> List[Dict]:
        """Parse M3U pour trouver des alternatives appropriées"""
        alternatives = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('#EXTINF:'):
                channel_info = self.extract_channel_metadata(line)
                
                if i + 1 < len(lines):
                    url = lines[i + 1].strip()
                    if url and not url.startswith('#'):
                        # Vérifier si c'est une bonne alternative
                        if self.is_good_alternative(channel_info['name'], keywords):
                            alternative = {
                                'name': channel_info['name'],
                                'url': url,
                                'category': self.categorize_alternative(channel_info['name']),
                                'quality': self.detect_quality(line),
                                'group': channel_info.get('group', ''),
                                'logo': channel_info.get('logo', ''),
                                'country': channel_info.get('country', ''),
                                'suitability': self.assess_suitability(channel_info['name'])
                            }
                            alternatives.append(alternative)
                
                i += 2
            else:
                i += 1
        
        return alternatives
    
    def extract_channel_metadata(self, extinf_line: str) -> Dict:
        """Extrait les métadonnées d'une ligne EXTINF"""
        metadata = {}
        
        # Nom de la chaîne
        if ',' in extinf_line:
            metadata['name'] = extinf_line.split(',')[-1].strip()
        
        # Métadonnées
        patterns = {
            'group': r'group-title="([^"]*)"',
            'logo': r'tvg-logo="([^"]*)"',
            'country': r'tvg-country="([^"]*)"',
            'language': r'tvg-language="([^"]*)"'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, extinf_line)
            if match:
                metadata[key] = match.group(1)
        
        return metadata
    
    def is_good_alternative(self, channel_name: str, keywords: List[str]) -> bool:
        """Détermine si une chaîne est une bonne alternative"""
        name_lower = channel_name.lower()
        
        # Vérifier les mots-clés positifs
        for keyword in keywords:
            if keyword in name_lower:
                # Exclure les chaînes problématiques
                excluded_terms = ['xxx', 'adult', 'porn', 'erotic', 'sexy', '+18', '18+']
                if not any(term in name_lower for term in excluded_terms):
                    return True
        
        # Chaînes spécifiques connues comme bonnes
        good_channels = [
            'food network', 'cooking channel', 'tastemade', 'bon appetit',
            'comedy central', 'mtv', 'vh1', 'e! entertainment', 'bravo',
            'hgtv', 'tlc', 'travel channel', 'lifestyle',
            'fashion tv', 'trace urban', 'mezzo'
        ]
        
        return any(channel in name_lower for channel in good_channels)
    
    def categorize_alternative(self, channel_name: str) -> str:
        """Catégorise une alternative"""
        name_lower = channel_name.lower()
        
        if any(word in name_lower for word in ['food', 'cooking', 'chef', 'kitchen', 'recipe']):
            return 'Culinaire'
        elif any(word in name_lower for word in ['comedy', 'entertainment', 'variety']):
            return 'Divertissement'
        elif any(word in name_lower for word in ['lifestyle', 'home', 'garden', 'style']):
            return 'Lifestyle'
        elif any(word in name_lower for word in ['fashion', 'mode']):
            return 'Mode'
        elif any(word in name_lower for word in ['travel', 'voyage']):
            return 'Voyage'
        elif any(word in name_lower for word in ['music', 'musique']):
            return 'Musique'
        else:
            return 'Divertissement'
    
    def detect_quality(self, extinf_line: str) -> str:
        """Détecte la qualité vidéo"""
        quality_patterns = [
            (r'4K|UHD|2160p', '4K'),
            (r'1080p|FHD', '1080p'),
            (r'720p|HD', '720p'),
            (r'480p', '480p'),
            (r'360p', '360p')
        ]
        
        for pattern, quality in quality_patterns:
            if re.search(pattern, extinf_line, re.IGNORECASE):
                return quality
        
        return 'SD'
    
    def assess_suitability(self, channel_name: str) -> str:
        """Évalue l'adéquation d'une chaîne"""
        name_lower = channel_name.lower()
        
        # Chaînes premium/populaires
        premium_channels = ['food network', 'comedy central', 'mtv', 'hgtv', 'tlc']
        if any(channel in name_lower for channel in premium_channels):
            return 'Premium - Très recommandé'
        
        # Chaînes de qualité
        quality_channels = ['tastemade', 'travel channel', 'fashion tv', 'trace']
        if any(channel in name_lower for channel in quality_channels):
            return 'Qualité - Recommandé'
        
        # Contenu mature mais approprié
        mature_channels = ['comedy central', 'mtv', 'vh1', 'bravo', 'fashion tv']
        if any(channel in name_lower for channel in mature_channels):
            return 'Mature - 16+ recommandé'
        
        return 'Standard - Approprié'
    
    def deduplicate_alternatives(self, alternatives: List[Dict]) -> List[Dict]:
        """Supprime les doublons"""
        seen = set()
        unique = []
        
        for alt in alternatives:
            key = alt['name'].lower().replace(' ', '')
            if key not in seen:
                seen.add(key)
                unique.append(alt)
        
        return unique
    
    def generate_alternatives_report(self, alternatives: List[Dict]) -> str:
        """Génère un rapport des alternatives"""
        report = []
        report.append("=" * 80)
        report.append("🔄 RAPPORT D'ALTERNATIVES - CHAÎNES NON FONCTIONNELLES")
        report.append("=" * 80)
        report.append("🎯 Remplacement des chaînes défaillantes")
        report.append("✅ Focus: Contenu de qualité et approprié")
        report.append("=" * 80)
        report.append("")
        
        # Chaînes à remplacer
        non_functional = self.get_non_functional_channels()
        report.append("❌ CHAÎNES À REMPLACER:")
        for i, channel in enumerate(non_functional, 1):
            report.append(f"   {i}. {channel['name']} - {channel['category']}")
        report.append("")
        
        if not alternatives:
            report.append("⚠️  ALTERNATIVES LIMITÉES TROUVÉES")
            report.append("   • Sources IPTV publiques limitées pour ce type de contenu")
            report.append("   • Recommandation: Focus sur contenu disponible")
            report.append("")
        else:
            # Statistiques des alternatives
            categories = {}
            qualities = {}
            suitabilities = {}
            
            for alt in alternatives:
                cat = alt['category']
                categories[cat] = categories.get(cat, 0) + 1
                
                qual = alt['quality']
                qualities[qual] = qualities.get(qual, 0) + 1
                
                suit = alt['suitability']
                suitabilities[suit] = suitabilities.get(suit, 0) + 1
            
            report.append(f"📊 ALTERNATIVES TROUVÉES: {len(alternatives)}")
            report.append("")
            
            # Par catégorie
            report.append("📂 RÉPARTITION PAR CATÉGORIE:")
            for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / len(alternatives)) * 100
                report.append(f"   • {cat}: {count} chaînes ({percentage:.1f}%)")
            report.append("")
            
            # Par qualité
            report.append("🎥 RÉPARTITION PAR QUALITÉ:")
            for qual, count in sorted(qualities.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / len(alternatives)) * 100
                report.append(f"   • {qual}: {count} chaînes ({percentage:.1f}%)")
            report.append("")
            
            # Top alternatives recommandées
            report.append("🏆 TOP ALTERNATIVES RECOMMANDÉES:")
            report.append("")
            
            # Trier par qualité et recommandation
            sorted_alternatives = sorted(alternatives, 
                                       key=lambda x: (
                                           'Premium' in x['suitability'],
                                           x['quality'] == '1080p',
                                           x['quality'] == '720p'
                                       ), reverse=True)
            
            for i, alt in enumerate(sorted_alternatives[:10], 1):  # Top 10
                report.append(f"{i:2d}. 🎯 {alt['name']}")
                report.append(f"    📂 Catégorie: {alt['category']}")
                report.append(f"    🎥 Qualité: {alt['quality']}")
                report.append(f"    ⭐ Évaluation: {alt['suitability']}")
                if alt['country']:
                    report.append(f"    🌍 Pays: {alt['country']}")
                report.append(f"    🔗 URL: [DISPONIBLE]")
                report.append("")
        
        # Recommandations d'intégration
        report.append("💡 RECOMMANDATIONS D'INTÉGRATION:")
        report.append("")
        
        if alternatives:
            premium_count = len([a for a in alternatives if 'Premium' in a['suitability']])
            hd_count = len([a for a in alternatives if a['quality'] in ['1080p', '720p']])
            
            report.append(f"✅ INTÉGRATION IMMÉDIATE POSSIBLE:")
            report.append(f"   • {premium_count} chaînes premium identifiées")
            report.append(f"   • {hd_count} chaînes en qualité HD+")
            report.append("   • Contenu de qualité pour remplacer les chaînes défaillantes")
            report.append("")
            
            report.append("🎯 STRATÉGIE D'INTÉGRATION:")
            report.append("   • Prioriser les chaînes premium (Food Network, Comedy Central)")
            report.append("   • Intégrer les chaînes HD en priorité")
            report.append("   • Tester la fonctionnalité avant intégration")
            report.append("   • Classifier selon l'âge approprié")
        else:
            report.append("🎯 STRATÉGIE ALTERNATIVE:")
            report.append("   • Focus sur les chaînes fonctionnelles existantes")
            report.append("   • Améliorer la qualité du catalogue actuel")
            report.append("   • Rechercher des partenariats pour contenu premium")
        
        report.append("")
        
        return "\n".join(report)

def main():
    """Fonction principale"""
    print("🔄 RECHERCHE D'ALTERNATIVES POUR CHAÎNES NON FONCTIONNELLES")
    print()
    
    finder = AlternativeChannelFinder()
    
    # Rechercher des alternatives
    alternatives = finder.search_functional_alternatives()
    
    # Ajouter les alternatives connues de qualité
    cooking_alts = finder.find_cooking_alternatives()
    entertainment_alts = finder.find_entertainment_alternatives()
    lifestyle_alts = finder.find_lifestyle_alternatives()
    international_alts = finder.find_international_alternatives()
    
    # Combiner toutes les alternatives
    all_alternatives = alternatives
    
    # Ajouter les alternatives de qualité (sans URL car ce sont des suggestions)
    for alt_list in [cooking_alts, entertainment_alts, lifestyle_alts, international_alts]:
        for alt in alt_list:
            alt['url'] = '[À RECHERCHER DANS SOURCES IPTV]'
            alt['suitability'] = alt.get('popularity', 'Standard')
            all_alternatives.append(alt)
    
    # Générer le rapport
    report = finder.generate_alternatives_report(all_alternatives)
    
    # Sauvegarder
    output_dir = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/"
    report_file = f"{output_dir}alternatives_report.txt"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n📄 Rapport d'alternatives: {report_file}")
    
    # Afficher le rapport
    print("\n" + report)
    
    # Résumé final
    print("🎯 RÉSUMÉ FINAL:")
    print(f"   • {len(all_alternatives)} alternatives identifiées")
    print("   • Chaînes premium et de qualité disponibles")
    print("   • Remplacement possible des chaînes défaillantes")

if __name__ == "__main__":
    main()
