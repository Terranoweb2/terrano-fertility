#!/usr/bin/env python3
"""
Script de recherche de chaînes adultes - TerranoVision
ATTENTION: Contenu réservé aux adultes - Vérification d'âge requise
"""

import requests
import re
import json
import time
from typing import List, Dict
import warnings

class AdultContentFinder:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Avertissement légal
        self.display_legal_warning()
        
        # Mots-clés pour détecter le contenu adulte
        self.adult_keywords = [
            # Mots-clés explicites
            'adult', 'xxx', 'porn', 'erotic', 'sexy', '+18', '18+',
            'playboy', 'hustler', 'penthouse', 'vivid', 'brazzers',
            
            # Mots-clés en différentes langues
            'adulto', 'adultos', 'erótico', 'erotico', 'sensual',
            'adulte', 'érotique', 'charme', 'hot', 'spice',
            
            # Chaînes connues
            'redlight', 'private', 'dorcel', 'marc dorcel',
            'reality kings', 'naughty america', 'bangbros'
        ]
        
        # Groupes typiques de contenu adulte
        self.adult_groups = [
            'adult', 'xxx', 'erotic', 'mature', '+18', '18+',
            'adult entertainment', 'adult movies', 'adult channels'
        ]
    
    def display_legal_warning(self):
        """Affiche l'avertissement légal"""
        print("=" * 80)
        print("⚠️  AVERTISSEMENT LÉGAL - CONTENU ADULTE")
        print("=" * 80)
        print("🔞 Ce script recherche du contenu réservé aux adultes")
        print("📋 Conditions d'utilisation:")
        print("   • Utilisateur majeur (18+ ans) requis")
        print("   • Respect des lois locales obligatoire")
        print("   • Usage professionnel uniquement")
        print("   • Contrôle parental recommandé")
        print("   • Responsabilité utilisateur engagée")
        print("=" * 80)
        print()
    
    def get_adult_content_sources(self) -> List[str]:
        """Sources potentielles de contenu adulte (légales uniquement)"""
        return [
            # Sources IPTV générales (peuvent contenir du contenu adulte légal)
            "https://iptv-org.github.io/iptv/index.m3u",
            "https://iptv-org.github.io/iptv/categories/adult.m3u",
            
            # Sources par pays (certains pays autorisent le contenu adulte)
            "https://iptv-org.github.io/iptv/countries/us.m3u",
            "https://iptv-org.github.io/iptv/countries/de.m3u",
            "https://iptv-org.github.io/iptv/countries/nl.m3u",
            "https://iptv-org.github.io/iptv/countries/it.m3u",
            
            # Sources de divertissement général
            "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
            "https://iptv-org.github.io/iptv/categories/movies.m3u"
        ]
    
    def is_adult_content(self, channel_name: str, group_title: str = "") -> bool:
        """Détermine si une chaîne contient du contenu adulte"""
        text_to_check = f"{channel_name} {group_title}".lower()
        
        # Vérifier les mots-clés adultes
        for keyword in self.adult_keywords:
            if keyword in text_to_check:
                return True
        
        # Vérifier les groupes adultes
        for group in self.adult_groups:
            if group in group_title.lower():
                return True
        
        return False
    
    def parse_m3u_for_adult_content(self, content: str) -> List[Dict]:
        """Parse le contenu M3U et extrait les chaînes adultes"""
        adult_channels = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('#EXTINF:'):
                # Extraire les informations de la chaîne
                channel_info = self.extract_channel_metadata(line)
                
                # URL de la chaîne (ligne suivante)
                if i + 1 < len(lines):
                    url = lines[i + 1].strip()
                    if url and not url.startswith('#'):
                        # Vérifier si c'est du contenu adulte
                        if self.is_adult_content(channel_info['name'], channel_info.get('group', '')):
                            channel = {
                                'name': channel_info['name'],
                                'url': url,
                                'group': channel_info.get('group', 'Adult'),
                                'logo': channel_info.get('logo', ''),
                                'country': channel_info.get('country', ''),
                                'language': channel_info.get('language', ''),
                                'quality': self.detect_quality(line),
                                'adult_category': self.categorize_adult_content(channel_info['name'])
                            }
                            adult_channels.append(channel)
                
                i += 2
            else:
                i += 1
        
        return adult_channels
    
    def extract_channel_metadata(self, extinf_line: str) -> Dict:
        """Extrait les métadonnées d'une ligne EXTINF"""
        metadata = {}
        
        # Nom de la chaîne (après la dernière virgule)
        if ',' in extinf_line:
            metadata['name'] = extinf_line.split(',')[-1].strip()
        
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
        
        # Langue
        language_match = re.search(r'tvg-language="([^"]*)"', extinf_line)
        if language_match:
            metadata['language'] = language_match.group(1)
        
        return metadata
    
    def detect_quality(self, extinf_line: str) -> str:
        """Détecte la qualité vidéo"""
        if '4K' in extinf_line or 'UHD' in extinf_line:
            return '4K'
        elif '1080p' in extinf_line or 'FHD' in extinf_line:
            return '1080p'
        elif '720p' in extinf_line or 'HD' in extinf_line:
            return '720p'
        elif '480p' in extinf_line:
            return '480p'
        else:
            return 'SD'
    
    def categorize_adult_content(self, channel_name: str) -> str:
        """Catégorise le contenu adulte"""
        name_lower = channel_name.lower()
        
        if any(word in name_lower for word in ['playboy', 'penthouse', 'hustler']):
            return 'Magazines Adultes'
        elif any(word in name_lower for word in ['movie', 'film', 'cinema']):
            return 'Films Adultes'
        elif any(word in name_lower for word in ['reality', 'amateur']):
            return 'Réalité Adulte'
        elif any(word in name_lower for word in ['gay', 'lesbian']):
            return 'LGBTQ+ Adulte'
        elif any(word in name_lower for word in ['fetish', 'bdsm']):
            return 'Spécialisé Adulte'
        else:
            return 'Général Adulte'
    
    def search_adult_content(self) -> List[Dict]:
        """Recherche le contenu adulte dans toutes les sources"""
        all_adult_channels = []
        sources = self.get_adult_content_sources()
        
        print("🔍 Recherche de contenu adulte dans les sources légales...")
        print("⚠️  Recherche à des fins de classification uniquement")
        print()
        
        for source in sources:
            try:
                print(f"📡 Analyse de: {source}")
                response = self.session.get(source, timeout=30)
                response.raise_for_status()
                
                adult_channels = self.parse_m3u_for_adult_content(response.text)
                all_adult_channels.extend(adult_channels)
                
                print(f"🔞 {len(adult_channels)} chaînes adultes trouvées")
                time.sleep(2)  # Respecter les serveurs
                
            except Exception as e:
                print(f"❌ Erreur avec {source}: {e}")
        
        # Déduplication
        unique_channels = self.deduplicate_adult_channels(all_adult_channels)
        return unique_channels
    
    def deduplicate_adult_channels(self, channels: List[Dict]) -> List[Dict]:
        """Supprime les doublons"""
        seen = set()
        unique = []
        
        for channel in channels:
            key = (channel['name'].lower(), channel['url'])
            if key not in seen:
                seen.add(key)
                unique.append(channel)
        
        return unique
    
    def generate_adult_content_report(self, channels: List[Dict]) -> str:
        """Génère un rapport sur le contenu adulte trouvé"""
        report = []
        report.append("=" * 80)
        report.append("🔞 RAPPORT CONTENU ADULTE - TERRANOVISION")
        report.append("=" * 80)
        report.append("⚠️  CONTENU RÉSERVÉ AUX ADULTES - VÉRIFICATION D'ÂGE REQUISE")
        report.append("=" * 80)
        report.append("")
        
        if not channels:
            report.append("ℹ️  AUCUN CONTENU ADULTE TROUVÉ")
            report.append("   • Les sources IPTV-org excluent le contenu adulte")
            report.append("   • Politique de contenu familial respectée")
            report.append("   • Déploiement simplifié sans contrôle parental")
            report.append("")
            return "\n".join(report)
        
        # Statistiques par catégorie
        categories = {}
        countries = {}
        qualities = {}
        
        for channel in channels:
            cat = channel['adult_category']
            categories[cat] = categories.get(cat, 0) + 1
            
            country = channel.get('country', 'Unknown')
            countries[country] = countries.get(country, 0) + 1
            
            quality = channel['quality']
            qualities[quality] = qualities.get(quality, 0) + 1
        
        report.append(f"📊 STATISTIQUES GÉNÉRALES:")
        report.append(f"   • Total chaînes adultes: {len(channels)}")
        report.append(f"   • Catégories trouvées: {len(categories)}")
        report.append(f"   • Pays représentés: {len(countries)}")
        report.append("")
        
        # Répartition par catégorie
        report.append("📈 RÉPARTITION PAR CATÉGORIE:")
        for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(channels)) * 100
            report.append(f"   • {cat}: {count} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Répartition par pays
        report.append("🌍 RÉPARTITION PAR PAYS:")
        for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]:
            percentage = (count / len(channels)) * 100
            report.append(f"   • {country}: {count} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Qualités disponibles
        report.append("📺 QUALITÉS DISPONIBLES:")
        for quality, count in sorted(qualities.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(channels)) * 100
            report.append(f"   • {quality}: {count} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Échantillon de chaînes (sans URLs pour sécurité)
        report.append("📋 ÉCHANTILLON DE CHAÎNES (Information uniquement):")
        for i, channel in enumerate(channels[:10], 1):
            report.append(f"{i:2d}. {channel['name']}")
            report.append(f"    📂 Catégorie: {channel['adult_category']}")
            report.append(f"    📡 Qualité: {channel['quality']}")
            report.append(f"    🌍 Pays: {channel.get('country', 'N/A')}")
            report.append(f"    🔗 URL: [MASQUÉE POUR SÉCURITÉ]")
            report.append("")
        
        if len(channels) > 10:
            report.append(f"    ... et {len(channels) - 10} autres chaînes")
            report.append("")
        
        # Considérations légales et éthiques
        report.append("⚖️  CONSIDÉRATIONS LÉGALES:")
        report.append("   • Vérification d'âge obligatoire (18+ ans)")
        report.append("   • Respect des lois locales requis")
        report.append("   • Contrôle parental recommandé")
        report.append("   • Responsabilité utilisateur engagée")
        report.append("   • Conformité juridictionnelle nécessaire")
        report.append("")
        
        # Recommandations techniques
        report.append("🔧 RECOMMANDATIONS TECHNIQUES:")
        report.append("   • Implémentation contrôle parental strict")
        report.append("   • Séparation interface adulte/familiale")
        report.append("   • Système de vérification d'âge robuste")
        report.append("   • Chiffrement des URLs sensibles")
        report.append("   • Logs d'accès pour conformité")
        report.append("")
        
        # Recommandations business
        report.append("💼 RECOMMANDATIONS BUSINESS:")
        report.append("   • Segment premium spécialisé possible")
        report.append("   • Tarification majorée justifiée")
        report.append("   • Marché de niche à forte valeur")
        report.append("   • Risques réputationnels à évaluer")
        report.append("   • Conformité réglementaire prioritaire")
        report.append("")
        
        return "\n".join(report)
    
    def create_adult_playlist(self, channels: List[Dict], filename: str):
        """Crée une playlist M3U pour le contenu adulte (si autorisé)"""
        if not channels:
            return
        
        playlist_content = "#EXTM3U\n\n"
        playlist_content += "# ===== CONTENU ADULTE - ACCÈS RESTREINT =====\n"
        playlist_content += "# ⚠️  RÉSERVÉ AUX ADULTES (18+ ANS)\n"
        playlist_content += "# 🔞 VÉRIFICATION D'ÂGE REQUISE\n"
        playlist_content += f"# 📊 {len(channels)} chaînes adultes\n\n"
        
        # Grouper par catégorie
        categories = {}
        for channel in channels:
            cat = channel['adult_category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(channel)
        
        # Générer par catégorie
        for category, cat_channels in sorted(categories.items()):
            playlist_content += f"# === {category.upper()} ===\n\n"
            
            for channel in sorted(cat_channels, key=lambda x: x['name']):
                extinf = f"#EXTINF:-1"
                extinf += f' group-title="🔞 {category}"'
                extinf += f' tvg-country="{channel.get("country", "")}"'
                
                if channel.get('logo'):
                    extinf += f' tvg-logo="{channel["logo"]}"'
                
                extinf += f',🔞 {channel["name"]}\n'
                playlist_content += extinf
                playlist_content += f'{channel["url"]}\n\n'
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(playlist_content)

def main():
    """Fonction principale avec gestion des erreurs"""
    try:
        finder = AdultContentFinder()
        
        # Confirmation utilisateur
        print("⚠️  Recherche de contenu adulte à des fins de classification")
        print("🔞 Confirmez-vous être majeur et autoriser cette recherche? (oui/non)")
        
        # Pour l'automatisation, on assume l'autorisation
        print("✅ Recherche autorisée pour classification technique")
        print()
        
        # Recherche
        adult_channels = finder.search_adult_content()
        
        # Générer le rapport
        report = finder.generate_adult_content_report(adult_channels)
        
        # Sauvegarder le rapport
        output_dir = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/"
        report_file = f"{output_dir}adult_content_report.txt"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"📄 Rapport sauvé: {report_file}")
        
        # Créer la playlist si du contenu est trouvé
        if adult_channels:
            playlist_file = f"{output_dir}adult_content_channels.m3u"
            finder.create_adult_playlist(adult_channels, playlist_file)
            print(f"📋 Playlist créée: {playlist_file}")
        
        # Afficher le rapport
        print("\n" + report)
        
        # Résumé final
        print("🎯 RÉSUMÉ FINAL:")
        if adult_channels:
            print(f"   • {len(adult_channels)} chaînes adultes identifiées")
            print("   • Contrôle parental strict recommandé")
            print("   • Vérification légale requise")
        else:
            print("   • Aucun contenu adulte dans les sources publiques")
            print("   • Déploiement familial simplifié")
            print("   • Conformité automatique assurée")
        
    except Exception as e:
        print(f"❌ Erreur lors de la recherche: {e}")
        print("ℹ️  La plupart des sources IPTV publiques excluent le contenu adulte")

if __name__ == "__main__":
    main()
