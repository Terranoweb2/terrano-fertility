#!/usr/bin/env python3
"""
Script d'intégration finale pour TerranoVision
Intègre toutes les chaînes trouvées dans l'application
"""

import json
import re
from typing import List, Dict

class TerranoVisionIntegrator:
    def __init__(self):
        self.base_path = "/home/ubuntu/terrano-fertility/terrano-vision"
        
    def load_canal_channels(self) -> List[Dict]:
        """Charge les chaînes Canal+ trouvées"""
        try:
            with open(f"{self.base_path}/playlists/canal_plus_channels.json", 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def filter_working_channels(self, channels: List[Dict]) -> List[Dict]:
        """Filtre les chaînes les plus susceptibles de fonctionner"""
        working_channels = []
        
        # Priorités par qualité d'URL
        priority_domains = [
            'infomaniak.com',
            'vedge.infomaniak.com',
            'streamhispanatv.net',
            'cootel.com',
            'savoir.media',
            'freecaster.com'
        ]
        
        # Filtrer les chaînes françaises authentiques
        french_canal_keywords = [
            'canal+', 'canal plus', 'canalplus',
            'canal j', 'canal sport', 'canal cinema',
            'canal series', 'canal family'
        ]
        
        for channel in channels:
            name_lower = channel['name'].lower()
            
            # Vérifier si c'est vraiment une chaîne Canal+ française
            is_french_canal = any(keyword in name_lower for keyword in french_canal_keywords)
            
            # Vérifier la qualité de l'URL
            has_priority_domain = any(domain in channel['url'] for domain in priority_domains)
            
            # Exclure les chaînes non françaises
            exclude_keywords = ['adventista', 'parlamento', 'alsacias', 'artv']
            is_excluded = any(keyword in name_lower for keyword in exclude_keywords)
            
            if (is_french_canal or has_priority_domain) and not is_excluded:
                working_channels.append(channel)
        
        return working_channels
    
    def create_premium_playlist(self) -> str:
        """Crée la playlist premium finale"""
        canal_channels = self.load_canal_channels()
        working_channels = self.filter_working_channels(canal_channels)
        
        # Chaînes premium de base (déjà testées)
        base_premium = [
            {
                'name': 'France 24',
                'url': 'https://static.france24.com/live/F24_FR_HI_HLS/live_web.m3u8',
                'group': 'Actualités',
                'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/France24.png/512px-France24.png',
                'country': 'FR',
                'quality': '1080p',
                'category': 'News'
            },
            {
                'name': 'NRJ 12',
                'url': 'https://nrj12.nrjaudio.fm/hls/live/2038374/nrj_12/master.m3u8',
                'group': 'Divertissement',
                'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/NRJ12_logo_2015.svg/749px-NRJ12_logo_2015.svg.png',
                'country': 'FR',
                'quality': '1080p',
                'category': 'Entertainment'
            },
            {
                'name': 'Euronews Français',
                'url': 'https://rakuten-euronews-1-gb.samsung.wurl.tv/playlist.m3u8',
                'group': 'Actualités',
                'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Euronews_2016_logo.svg/512px-Euronews_2016_logo.svg.png',
                'country': 'FR',
                'quality': 'HD',
                'category': 'News'
            }
        ]
        
        # Ajouter les meilleures chaînes Canal+ trouvées
        premium_canal = []
        for channel in working_channels[:10]:  # Top 10
            premium_canal.append({
                'name': channel['name'],
                'url': channel['url'],
                'group': 'Canal+',
                'logo': channel.get('logo', ''),
                'country': channel.get('country', 'FR'),
                'quality': channel.get('quality', 'HD'),
                'category': 'Premium'
            })
        
        all_channels = base_premium + premium_canal
        
        # Générer la playlist M3U
        playlist = "#EXTM3U\n\n"
        playlist += "# ===== TERRANOVISION PREMIUM PLAYLIST =====\n"
        playlist += "# Chaînes premium avec Canal+ intégré\n"
        playlist += "# Généré automatiquement\n\n"
        
        for channel in all_channels:
            extinf = f"#EXTINF:-1"
            extinf += f' group-title="{channel["group"]}"'
            extinf += f' tvg-country="{channel["country"]}"'
            
            if channel['logo']:
                extinf += f' tvg-logo="{channel["logo"]}"'
            
            extinf += f',{channel["name"]}\n'
            playlist += extinf
            playlist += f'{channel["url"]}\n\n'
        
        return playlist
    
    def update_app_playlist(self):
        """Met à jour la playlist de l'application"""
        premium_playlist = self.create_premium_playlist()
        
        # Sauvegarder la nouvelle playlist
        playlist_path = f"{self.base_path}/apps/web/src/data/initialPlaylist.m3u"
        with open(playlist_path, 'w', encoding='utf-8') as f:
            f.write(premium_playlist)
        
        print(f"✅ Playlist mise à jour: {playlist_path}")
    
    def generate_integration_report(self) -> str:
        """Génère un rapport d'intégration"""
        canal_channels = self.load_canal_channels()
        working_channels = self.filter_working_channels(canal_channels)
        
        report = []
        report.append("=" * 80)
        report.append("🚀 RAPPORT D'INTÉGRATION TERRANOVISION")
        report.append("=" * 80)
        report.append("")
        
        report.append("📊 STATISTIQUES D'INTÉGRATION:")
        report.append(f"   • Chaînes Canal+ trouvées: {len(canal_channels)}")
        report.append(f"   • Chaînes filtrées (qualité): {len(working_channels)}")
        report.append(f"   • Chaînes intégrées: {min(10, len(working_channels)) + 3}")
        report.append("")
        
        report.append("🎯 CHAÎNES CANAL+ INTÉGRÉES:")
        for i, channel in enumerate(working_channels[:10], 1):
            report.append(f"   {i:2d}. {channel['name']}")
            report.append(f"       Qualité: {channel['quality']}")
            report.append(f"       URL: {channel['url'][:60]}...")
        report.append("")
        
        report.append("✅ CHAÎNES DE BASE INCLUSES:")
        report.append("   • France 24 (Actualités)")
        report.append("   • NRJ 12 (Divertissement)")
        report.append("   • Euronews Français (Actualités)")
        report.append("")
        
        report.append("🔧 PROCHAINES ÉTAPES:")
        report.append("   1. Tester les nouvelles chaînes dans l'application")
        report.append("   2. Vérifier la qualité de streaming")
        report.append("   3. Ajuster les métadonnées si nécessaire")
        report.append("   4. Déployer la nouvelle version")
        report.append("")
        
        report.append("💡 RECOMMANDATIONS:")
        report.append("   • Surveiller la disponibilité des flux")
        report.append("   • Implémenter un système de fallback")
        report.append("   • Ajouter plus de chaînes progressivement")
        report.append("   • Respecter les droits de diffusion")
        report.append("")
        
        return "\n".join(report)

def main():
    """Fonction principale"""
    integrator = TerranoVisionIntegrator()
    
    print("🚀 Intégration des chaînes dans TerranoVision...")
    
    # Mettre à jour la playlist de l'app
    integrator.update_app_playlist()
    
    # Générer le rapport
    report = integrator.generate_integration_report()
    report_path = f"{integrator.base_path}/playlists/integration_report.txt"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"📄 Rapport d'intégration: {report_path}")
    print("\n" + report)
    
    print("🎉 Intégration terminée ! TerranoVision est prêt avec les nouvelles chaînes.")

if __name__ == "__main__":
    main()
