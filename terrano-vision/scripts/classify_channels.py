#!/usr/bin/env python3
"""
Script de classification détaillée des chaînes Canal+ par catégories
"""

import json
import re
from typing import Dict, List

class ChannelClassifier:
    def __init__(self):
        self.categories = {
            'sport': [],
            'documentaire': [],
            'cinema': [],
            'actualites': [],
            'jeunesse': [],
            'musique': [],
            'religieux': [],
            'educatif': [],
            'divertissement': [],
            'regional': [],
            'adulte': [],
            'general': []
        }
        
        # Mots-clés pour classification
        self.keywords = {
            'sport': [
                'sport', 'football', 'soccer', 'basket', 'tennis', 'rugby',
                'olympic', 'fifa', 'uefa', 'champions', 'league', 'match',
                'deportes', 'deportivo', 'espn', 'fox sports', 'bein'
            ],
            'documentaire': [
                'documentary', 'docu', 'discovery', 'national geographic',
                'nat geo', 'history', 'science', 'nature', 'wildlife',
                'planete', 'investigation', 'reportage', 'animal planet'
            ],
            'cinema': [
                'cinema', 'movie', 'film', 'cine', 'hollywood', 'bollywood',
                'movies', 'peliculas', 'action', 'drama', 'comedy', 'thriller'
            ],
            'actualites': [
                'news', 'noticias', 'info', 'actualite', 'journal', 'tv5',
                'france24', 'euronews', 'cnn', 'bbc', 'sky news', 'fox news'
            ],
            'jeunesse': [
                'kids', 'children', 'cartoon', 'disney', 'nickelodeon',
                'canal j', 'junior', 'enfant', 'jeunesse', 'baby', 'teen'
            ],
            'musique': [
                'music', 'mtv', 'vh1', 'musica', 'radio', 'hit', 'rock',
                'pop', 'jazz', 'classical', 'concert', 'festival'
            ],
            'religieux': [
                'religious', 'church', 'christian', 'catholic', 'gospel',
                'islam', 'jewish', 'buddhist', 'spiritual', 'faith',
                'adventista', 'catolica', 'evangelica'
            ],
            'educatif': [
                'education', 'educational', 'learning', 'university',
                'school', 'academic', 'science', 'cultura', 'savoir',
                'knowledge', 'teach'
            ],
            'adulte': [
                'adult', 'xxx', 'porn', 'erotic', 'sexy', '+18', '18+',
                'playboy', 'hustler', 'penthouse', 'adult swim'
            ],
            'regional': [
                'local', 'regional', 'city', 'provincia', 'departamento',
                'municipio', 'valle', 'norte', 'sur', 'este', 'oeste'
            ]
        }
    
    def load_channels(self) -> List[Dict]:
        """Charge les chaînes depuis le fichier JSON"""
        try:
            with open('/home/ubuntu/terrano-fertility/terrano-vision/playlists/canal_plus_channels.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def classify_channel(self, channel: Dict) -> str:
        """Classifie une chaîne selon son nom et groupe"""
        name = channel['name'].lower()
        group = channel.get('group', '').lower()
        combined_text = f"{name} {group}"
        
        # Vérifier chaque catégorie
        for category, keywords in self.keywords.items():
            if any(keyword in combined_text for keyword in keywords):
                return category
        
        # Classification par groupe si pas de mot-clé trouvé
        if 'sport' in group:
            return 'sport'
        elif 'movie' in group or 'cinema' in group:
            return 'cinema'
        elif 'news' in group:
            return 'actualites'
        elif 'kids' in group or 'family' in group:
            return 'jeunesse'
        elif 'music' in group:
            return 'musique'
        elif 'religious' in group:
            return 'religieux'
        elif 'education' in group:
            return 'educatif'
        elif 'entertainment' in group:
            return 'divertissement'
        
        return 'general'
    
    def classify_all_channels(self) -> Dict:
        """Classifie toutes les chaînes"""
        channels = self.load_channels()
        
        for channel in channels:
            category = self.classify_channel(channel)
            self.categories[category].append(channel)
        
        return self.categories
    
    def generate_classification_report(self) -> str:
        """Génère un rapport de classification détaillé"""
        categories = self.classify_all_channels()
        
        report = []
        report.append("=" * 80)
        report.append("📺 CLASSIFICATION DÉTAILLÉE DES CHAÎNES CANAL+")
        report.append("=" * 80)
        report.append("")
        
        # Statistiques générales
        total_channels = sum(len(channels) for channels in categories.values())
        report.append(f"📊 STATISTIQUES GÉNÉRALES:")
        report.append(f"   • Total chaînes classifiées: {total_channels}")
        report.append("")
        
        # Répartition par catégorie
        report.append("📈 RÉPARTITION PAR CATÉGORIE:")
        for category, channels in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
            if channels:  # Seulement les catégories non vides
                percentage = (len(channels) / total_channels) * 100
                report.append(f"   • {category.capitalize()}: {len(channels)} chaînes ({percentage:.1f}%)")
        report.append("")
        
        # Détail par catégorie
        category_icons = {
            'sport': '🏃',
            'documentaire': '📖',
            'cinema': '🎬',
            'actualites': '📰',
            'jeunesse': '👶',
            'musique': '🎵',
            'religieux': '⛪',
            'educatif': '🎓',
            'divertissement': '🎭',
            'regional': '🌍',
            'adulte': '🔞',
            'general': '📺'
        }
        
        for category, channels in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
            if not channels:
                continue
                
            icon = category_icons.get(category, '📺')
            report.append(f"{icon} {category.upper()} ({len(channels)} chaînes)")
            report.append("-" * 60)
            
            # Afficher les 10 premières chaînes de chaque catégorie
            for i, channel in enumerate(sorted(channels, key=lambda x: x['name'])[:10], 1):
                report.append(f"{i:2d}. {channel['name']}")
                report.append(f"    📡 Qualité: {channel['quality']}")
                report.append(f"    📂 Groupe: {channel['group']}")
                if channel.get('logo'):
                    report.append(f"    🖼️  Logo: Disponible")
                report.append(f"    🔗 URL: {channel['url'][:50]}...")
                report.append("")
            
            if len(channels) > 10:
                report.append(f"    ... et {len(channels) - 10} autres chaînes")
                report.append("")
            
            report.append("")
        
        # Recommandations par catégorie
        report.append("💡 RECOMMANDATIONS PAR CATÉGORIE:")
        report.append("")
        
        if categories['sport']:
            report.append("🏃 SPORT:")
            report.append("   • Idéal pour les abonnements Premium (12K-20K XOF)")
            report.append("   • Contenu à forte valeur ajoutée")
            report.append("   • Vérifier les droits de diffusion sportive")
            report.append("")
        
        if categories['documentaire']:
            report.append("📖 DOCUMENTAIRES:")
            report.append("   • Contenu éducatif premium")
            report.append("   • Parfait pour différenciation concurrentielle")
            report.append("   • Audience fidèle et engagée")
            report.append("")
        
        if categories['cinema']:
            report.append("🎬 CINÉMA:")
            report.append("   • Contenu premium à forte demande")
            report.append("   • Justifie les prix d'abonnement élevés")
            report.append("   • Attention aux droits de diffusion")
            report.append("")
        
        if categories['adulte']:
            report.append("🔞 CONTENU ADULTE:")
            report.append("   • Nécessite contrôle parental strict")
            report.append("   • Vérification d'âge obligatoire")
            report.append("   • Conformité légale selon juridiction")
            report.append("   • Séparation claire du contenu familial")
            report.append("")
        
        # Conclusion
        report.append("🎯 CONCLUSION:")
        report.append(f"   • {len(categories['sport'])} chaînes sport pour abonnements premium")
        report.append(f"   • {len(categories['documentaire'])} chaînes documentaires pour contenu éducatif")
        report.append(f"   • {len(categories['cinema'])} chaînes cinéma pour divertissement")
        report.append(f"   • {len(categories['adulte'])} chaîne(s) adulte nécessitant contrôle parental")
        report.append("")
        
        return "\n".join(report)
    
    def create_category_playlists(self):
        """Crée des playlists séparées par catégorie"""
        categories = self.classify_all_channels()
        
        for category, channels in categories.items():
            if not channels:
                continue
                
            playlist_content = "#EXTM3U\n\n"
            playlist_content += f"# ===== TERRANOVISION - {category.upper()} =====\n"
            playlist_content += f"# {len(channels)} chaînes {category}\n"
            playlist_content += f"# Généré automatiquement\n\n"
            
            for channel in sorted(channels, key=lambda x: x['name']):
                extinf = f"#EXTINF:-1"
                extinf += f' group-title="{category.capitalize()}"'
                extinf += f' tvg-country="{channel.get("country", "FR")}"'
                
                if channel.get('logo'):
                    extinf += f' tvg-logo="{channel["logo"]}"'
                
                extinf += f',{channel["name"]}\n'
                playlist_content += extinf
                playlist_content += f'{channel["url"]}\n\n'
            
            # Sauvegarder la playlist
            filename = f"/home/ubuntu/terrano-fertility/terrano-vision/playlists/category_{category}.m3u"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(playlist_content)
            
            print(f"✅ Playlist {category}: {filename}")

def main():
    """Fonction principale"""
    classifier = ChannelClassifier()
    
    print("🔍 Classification des chaînes par catégories...")
    
    # Générer le rapport
    report = classifier.generate_classification_report()
    
    # Sauvegarder le rapport
    report_file = "/home/ubuntu/terrano-fertility/terrano-vision/playlists/classification_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 Rapport de classification: {report_file}")
    
    # Créer les playlists par catégorie
    classifier.create_category_playlists()
    
    # Afficher le rapport
    print("\n" + report)
    
    print("🎉 Classification terminée !")

if __name__ == "__main__":
    main()
