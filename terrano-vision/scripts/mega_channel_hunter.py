#!/usr/bin/env python3
"""
🔍 MEGA CHANNEL HUNTER - Recherche Ultra-Approfondie 2500+ Chaînes
================================================================================
Script ultra-avancé pour découvrir 2500+ chaînes IPTV avec logos et icônes
Utilise les sources les plus complètes d'internet avec recherche parallèle
================================================================================
"""

import requests
import json
import re
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse
import os
from datetime import datetime

class MegaChannelHunter:
    def __init__(self):
        self.channels = []
        self.logos_found = 0
        self.sources_processed = 0
        self.total_channels_target = 2500
        
        # Sources IPTV ultra-complètes découvertes
        self.mega_sources = [
            # Sources principales avec 1000+ chaînes chacune
            "https://iptv-org.github.io/iptv/index.m3u",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_world.m3u8",
            "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/all.m3u",
            
            # Sources spécialisées par région (500+ chaînes chacune)
            "https://iptv-org.github.io/iptv/countries/us.m3u",
            "https://iptv-org.github.io/iptv/countries/uk.m3u", 
            "https://iptv-org.github.io/iptv/countries/fr.m3u",
            "https://iptv-org.github.io/iptv/countries/de.m3u",
            "https://iptv-org.github.io/iptv/countries/it.m3u",
            "https://iptv-org.github.io/iptv/countries/es.m3u",
            "https://iptv-org.github.io/iptv/countries/ca.m3u",
            "https://iptv-org.github.io/iptv/countries/au.m3u",
            "https://iptv-org.github.io/iptv/countries/br.m3u",
            "https://iptv-org.github.io/iptv/countries/mx.m3u",
            "https://iptv-org.github.io/iptv/countries/ar.m3u",
            "https://iptv-org.github.io/iptv/countries/in.m3u",
            "https://iptv-org.github.io/iptv/countries/jp.m3u",
            "https://iptv-org.github.io/iptv/countries/kr.m3u",
            "https://iptv-org.github.io/iptv/countries/cn.m3u",
            "https://iptv-org.github.io/iptv/countries/ru.m3u",
            
            # Sources par catégorie (200+ chaînes chacune)
            "https://iptv-org.github.io/iptv/categories/news.m3u",
            "https://iptv-org.github.io/iptv/categories/sports.m3u",
            "https://iptv-org.github.io/iptv/categories/movies.m3u",
            "https://iptv-org.github.io/iptv/categories/entertainment.m3u",
            "https://iptv-org.github.io/iptv/categories/kids.m3u",
            "https://iptv-org.github.io/iptv/categories/music.m3u",
            "https://iptv-org.github.io/iptv/categories/documentary.m3u",
            "https://iptv-org.github.io/iptv/categories/education.m3u",
            "https://iptv-org.github.io/iptv/categories/lifestyle.m3u",
            "https://iptv-org.github.io/iptv/categories/cooking.m3u",
            "https://iptv-org.github.io/iptv/categories/travel.m3u",
            "https://iptv-org.github.io/iptv/categories/business.m3u",
            "https://iptv-org.github.io/iptv/categories/science.m3u",
            "https://iptv-org.github.io/iptv/categories/weather.m3u",
            "https://iptv-org.github.io/iptv/categories/religious.m3u",
            
            # Sources alternatives ultra-complètes
            "https://raw.githubusercontent.com/hosseinpourziyaie/IPTV-IRAN/main/IPTV-IRAN.m3u",
            "https://raw.githubusercontent.com/AqFad2811/myiptv/main/indonesia.m3u",
            "https://raw.githubusercontent.com/Sphinxroot/Iptv-free-direct/main/playlist.m3u8",
            "https://raw.githubusercontent.com/benmoose39/YouTube_to_m3u/main/youtube.m3u",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_africa.m3u8",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_asia.m3u8",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_europe.m3u8",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_america.m3u8",
            "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_oceania.m3u8",
            
            # Sources spécialisées premium
            "https://raw.githubusercontent.com/davidmuma/Canales_dobleM/master/playlist.m3u8",
            "https://raw.githubusercontent.com/guiworldtv/MEU-IPTV-FULL/main/VideoOFFAir.m3u8",
            "https://raw.githubusercontent.com/ChurroLoco/Tv-Gratis/main/TvGratis.m3u",
            "https://raw.githubusercontent.com/LaneSh4d0w/IPTV_Exception/master/channels/ve.m3u",
            "https://raw.githubusercontent.com/Sphinxroot/Iptv-free-direct/main/playlist.m3u8",
        ]
        
        # Sources de logos haute qualité
        self.logo_sources = [
            "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/",
            "https://github.com/tv-logo/tv-logos/tree/main/countries/",
            "https://upload.wikimedia.org/wikipedia/commons/",
            "https://upload.wikimedia.org/wikipedia/en/",
            "https://logos-world.net/wp-content/uploads/",
            "https://seeklogo.com/images/",
            "https://logoeps.com/wp-content/uploads/",
            "https://1000logos.net/wp-content/uploads/",
        ]
        
    def fetch_playlist(self, url, timeout=30):
        """Télécharge une playlist M3U avec gestion d'erreurs avancée"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/plain,application/x-mpegURL,*/*',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
            
            response = requests.get(url, headers=headers, timeout=timeout, verify=False)
            response.raise_for_status()
            
            # Détecter l'encodage
            if response.encoding is None:
                response.encoding = 'utf-8'
                
            return response.text
            
        except Exception as e:
            print(f"❌ Erreur téléchargement {url}: {e}")
            return None
    
    def parse_m3u_advanced(self, content, source_url=""):
        """Parse M3U avec extraction avancée des métadonnées"""
        channels = []
        lines = content.split('\n')
        
        current_channel = {}
        
        for i, line in enumerate(lines):
            line = line.strip()
            
            if line.startswith('#EXTINF:'):
                # Extraction des métadonnées avancées
                current_channel = self.extract_extinf_metadata(line)
                current_channel['source'] = source_url
                
            elif line.startswith('#EXTVLCOPT:'):
                # Options VLC (User-Agent, Referer, etc.)
                if 'http-user-agent' in line:
                    current_channel['user_agent'] = line.split('=', 1)[1] if '=' in line else ''
                elif 'http-referrer' in line:
                    current_channel['referrer'] = line.split('=', 1)[1] if '=' in line else ''
                    
            elif line.startswith('#EXTGRP:'):
                # Groupe de chaîne
                current_channel['group'] = line.replace('#EXTGRP:', '').strip()
                
            elif line and not line.startswith('#') and current_channel:
                # URL de la chaîne
                current_channel['url'] = line
                current_channel['id'] = self.generate_channel_id(current_channel.get('name', ''), line)
                
                # Recherche de logo automatique
                current_channel['logo'] = self.find_logo_for_channel(current_channel.get('name', ''))
                
                channels.append(current_channel.copy())
                current_channel = {}
                
        return channels
    
    def extract_extinf_metadata(self, extinf_line):
        """Extraction avancée des métadonnées EXTINF"""
        channel = {
            'name': '',
            'logo': '',
            'group': '',
            'country': '',
            'language': '',
            'quality': '',
            'type': 'HLS'
        }
        
        # Extraction du nom de chaîne (après la dernière virgule)
        if ',' in extinf_line:
            channel['name'] = extinf_line.split(',')[-1].strip()
        
        # Extraction des attributs tvg-*
        patterns = {
            'logo': r'tvg-logo="([^"]*)"',
            'group': r'group-title="([^"]*)"',
            'country': r'tvg-country="([^"]*)"',
            'language': r'tvg-language="([^"]*)"',
            'id': r'tvg-id="([^"]*)"',
            'name_alt': r'tvg-name="([^"]*)"'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, extinf_line, re.IGNORECASE)
            if match:
                channel[key] = match.group(1)
        
        # Détection de la qualité dans le nom
        quality_patterns = [
            (r'4K|UHD|2160p', '4K'),
            (r'1080p|FHD|Full HD', '1080p'),
            (r'720p|HD', '720p'),
            (r'480p|SD', '480p'),
            (r'360p', '360p')
        ]
        
        name_upper = channel['name'].upper()
        for pattern, quality in quality_patterns:
            if re.search(pattern, name_upper):
                channel['quality'] = quality
                break
        
        # Détection du type de flux
        if '.m3u8' in extinf_line.lower():
            channel['type'] = 'HLS'
        elif '.mpd' in extinf_line.lower():
            channel['type'] = 'DASH'
        elif 'youtube.com' in extinf_line.lower():
            channel['type'] = 'YouTube'
        elif 'dailymotion.com' in extinf_line.lower():
            channel['type'] = 'Dailymotion'
        
        return channel
    
    def find_logo_for_channel(self, channel_name):
        """Recherche automatique de logo pour une chaîne"""
        if not channel_name:
            return ""
        
        # Nettoyage du nom pour la recherche
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', channel_name).strip()
        clean_name = re.sub(r'\s+', '_', clean_name).lower()
        
        # Patterns de logos courants
        logo_patterns = [
            f"https://upload.wikimedia.org/wikipedia/commons/thumb/*/512px-{clean_name}_logo.png",
            f"https://upload.wikimedia.org/wikipedia/en/thumb/*/512px-{clean_name}_logo.png",
            f"https://logos-world.net/wp-content/uploads/2020/*/512px-{clean_name}-Logo.png",
            f"https://seeklogo.com/images/{clean_name[0]}/{clean_name}-logo-*.png",
        ]
        
        # Logos spécifiques pour chaînes connues
        known_logos = {
            'france24': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/France24.png/512px-France24.png',
            'cnn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png',
            'bbc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/512px-BBC_Logo_2021.svg.png',
            'mtv': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/MTV-2021.svg/512px-MTV-2021.svg.png',
            'discovery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_logo.svg/512px-Discovery_Channel_logo.svg.png',
            'nationalgeographic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/512px-Natgeologo.svg.png',
            'euronews': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Euronews_logo.svg/512px-Euronews_logo.svg.png',
            'aljazeera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Al_Jazeera_English_newlogo.svg/512px-Al_Jazeera_English_newlogo.svg.png',
        }
        
        if clean_name in known_logos:
            return known_logos[clean_name]
        
        # Recherche par mots-clés
        for keyword, logo_url in known_logos.items():
            if keyword in clean_name or clean_name in keyword:
                return logo_url
        
        # Logo par défaut basé sur la première lettre
        first_letter = clean_name[0].upper() if clean_name else 'T'
        return f"https://via.placeholder.com/512x512/1e293b/ffffff?text={first_letter}"
    
    def generate_channel_id(self, name, url):
        """Génère un ID unique pour la chaîne"""
        import hashlib
        unique_string = f"{name}_{url}_{int(time.time())}"
        return hashlib.md5(unique_string.encode()).hexdigest()[:12]
    
    def process_source_parallel(self, source_url):
        """Traite une source en parallèle"""
        print(f"🔍 Traitement: {source_url}")
        
        content = self.fetch_playlist(source_url)
        if not content:
            return []
        
        channels = self.parse_m3u_advanced(content, source_url)
        
        print(f"✅ {len(channels)} chaînes trouvées dans {source_url}")
        self.sources_processed += 1
        
        return channels
    
    def hunt_mega_channels(self):
        """Recherche ultra-approfondie de 2500+ chaînes"""
        print("🚀 DÉMARRAGE MEGA CHANNEL HUNTER")
        print("=" * 80)
        print(f"🎯 Objectif: {self.total_channels_target}+ chaînes avec logos")
        print(f"📡 Sources à analyser: {len(self.mega_sources)}")
        print("=" * 80)
        
        start_time = time.time()
        
        # Traitement parallèle de toutes les sources
        with ThreadPoolExecutor(max_workers=10) as executor:
            future_to_source = {
                executor.submit(self.process_source_parallel, source): source 
                for source in self.mega_sources
            }
            
            for future in as_completed(future_to_source):
                source = future_to_source[future]
                try:
                    channels = future.result()
                    self.channels.extend(channels)
                    
                    # Mise à jour du compteur de logos
                    logos_in_batch = sum(1 for ch in channels if ch.get('logo') and not ch['logo'].startswith('https://via.placeholder.com'))
                    self.logos_found += logos_in_batch
                    
                    print(f"📊 Progression: {len(self.channels)} chaînes | {self.logos_found} logos | {self.sources_processed}/{len(self.mega_sources)} sources")
                    
                except Exception as e:
                    print(f"❌ Erreur traitement {source}: {e}")
        
        # Déduplication avancée
        print("\n🔄 Déduplication des chaînes...")
        self.deduplicate_channels()
        
        # Enrichissement des logos manquants
        print("🎨 Enrichissement des logos manquants...")
        self.enrich_missing_logos()
        
        # Statistiques finales
        end_time = time.time()
        duration = end_time - start_time
        
        print("\n" + "=" * 80)
        print("🏆 MEGA CHANNEL HUNTER - RÉSULTATS FINAUX")
        print("=" * 80)
        print(f"📺 Total chaînes découvertes: {len(self.channels)}")
        print(f"🎨 Chaînes avec logos: {self.logos_found}")
        print(f"📊 Taux de logos: {(self.logos_found/len(self.channels)*100):.1f}%")
        print(f"⏱️  Temps de traitement: {duration:.1f} secondes")
        print(f"🎯 Objectif atteint: {'✅ OUI' if len(self.channels) >= self.total_channels_target else '❌ NON'}")
        
        return self.channels
    
    def deduplicate_channels(self):
        """Déduplication avancée des chaînes"""
        seen_urls = set()
        seen_names = set()
        unique_channels = []
        
        for channel in self.channels:
            url = channel.get('url', '')
            name = channel.get('name', '').lower().strip()
            
            # Critères de déduplication
            url_key = url.split('?')[0]  # Ignorer les paramètres URL
            name_key = re.sub(r'[^a-zA-Z0-9]', '', name)  # Nom nettoyé
            
            if url_key not in seen_urls and name_key not in seen_names:
                seen_urls.add(url_key)
                seen_names.add(name_key)
                unique_channels.append(channel)
        
        removed = len(self.channels) - len(unique_channels)
        print(f"🗑️  {removed} doublons supprimés")
        
        self.channels = unique_channels
    
    def enrich_missing_logos(self):
        """Enrichit les logos manquants avec recherche avancée"""
        channels_without_logos = [ch for ch in self.channels if not ch.get('logo') or ch['logo'].startswith('https://via.placeholder.com')]
        
        print(f"🔍 Recherche de logos pour {len(channels_without_logos)} chaînes...")
        
        for i, channel in enumerate(channels_without_logos):
            if i % 100 == 0:
                print(f"📊 Progression logos: {i}/{len(channels_without_logos)}")
            
            # Recherche de logo améliorée
            logo_url = self.advanced_logo_search(channel.get('name', ''))
            if logo_url:
                channel['logo'] = logo_url
                self.logos_found += 1
    
    def advanced_logo_search(self, channel_name):
        """Recherche avancée de logo avec multiple sources"""
        if not channel_name:
            return None
        
        # Nettoyage du nom
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', channel_name).strip()
        
        # Base de données de logos étendues
        logo_databases = {
            # Chaînes françaises
            'tf1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/TF1_logo_2013.svg/512px-TF1_logo_2013.svg.png',
            'france2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/France_2_logo_2018.svg/512px-France_2_logo_2018.svg.png',
            'm6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/M6_logo_2009.svg/512px-M6_logo_2009.svg.png',
            'arte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Arte_Logo_2017.svg/512px-Arte_Logo_2017.svg.png',
            'canal+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Canal%2B.svg/512px-Canal%2B.svg.png',
            
            # Chaînes internationales
            'cnn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/512px-CNN.svg.png',
            'bbc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/512px-BBC_Logo_2021.svg.png',
            'fox': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Fox_Broadcasting_Company_Logo.svg/512px-Fox_Broadcasting_Company_Logo.svg.png',
            'nbc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_logo.svg/512px-NBC_logo.svg.png',
            'abc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ABC-2021-LOGO.svg/512px-ABC-2021-LOGO.svg.png',
            
            # Chaînes de divertissement
            'mtv': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/MTV-2021.svg/512px-MTV-2021.svg.png',
            'vh1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/VH1_logonew.svg/512px-VH1_logonew.svg.png',
            'comedy central': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Comedy_Central_2018.svg/512px-Comedy_Central_2018.svg.png',
            
            # Chaînes documentaires
            'discovery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_logo.svg/512px-Discovery_Channel_logo.svg.png',
            'national geographic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/512px-Natgeologo.svg.png',
            'history': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/History_%282021%29.svg/512px-History_%282021%29.svg.png',
            
            # Chaînes sport
            'espn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/512px-ESPN_wordmark.svg.png',
            'eurosport': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Eurosport_logo.svg/512px-Eurosport_logo.svg.png',
        }
        
        # Recherche par correspondance exacte
        clean_lower = clean_name.lower()
        for key, logo_url in logo_databases.items():
            if key in clean_lower or clean_lower in key:
                return logo_url
        
        return None
    
    def save_results(self):
        """Sauvegarde les résultats dans multiple formats"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Création des dossiers
        os.makedirs("playlists", exist_ok=True)
        os.makedirs("data", exist_ok=True)
        
        # Sauvegarde M3U
        m3u_path = f"playlists/mega_channels_{timestamp}.m3u"
        self.save_m3u_playlist(m3u_path)
        
        # Sauvegarde JSON
        json_path = f"data/mega_channels_{timestamp}.json"
        self.save_json_data(json_path)
        
        # Rapport détaillé
        report_path = f"playlists/mega_channels_report_{timestamp}.txt"
        self.save_detailed_report(report_path)
        
        print(f"\n💾 Résultats sauvegardés:")
        print(f"📺 Playlist M3U: {m3u_path}")
        print(f"📊 Données JSON: {json_path}")
        print(f"📋 Rapport détaillé: {report_path}")
    
    def save_m3u_playlist(self, filepath):
        """Sauvegarde la playlist M3U complète"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("#EXTM3U\n")
            f.write(f"# MEGA CHANNEL HUNTER - {len(self.channels)} chaînes découvertes\n")
            f.write(f"# Généré le {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"# TerranoVision - Catalogue Ultra-Complet\n\n")
            
            for channel in self.channels:
                # Ligne EXTINF avec métadonnées complètes
                extinf = f"#EXTINF:-1"
                
                if channel.get('id'):
                    extinf += f' tvg-id="{channel["id"]}"'
                if channel.get('logo'):
                    extinf += f' tvg-logo="{channel["logo"]}"'
                if channel.get('group'):
                    extinf += f' group-title="{channel["group"]}"'
                if channel.get('country'):
                    extinf += f' tvg-country="{channel["country"]}"'
                if channel.get('language'):
                    extinf += f' tvg-language="{channel["language"]}"'
                
                extinf += f',{channel.get("name", "Chaîne Inconnue")}'
                
                f.write(extinf + "\n")
                
                # Options VLC si disponibles
                if channel.get('user_agent'):
                    f.write(f"#EXTVLCOPT:http-user-agent={channel['user_agent']}\n")
                if channel.get('referrer'):
                    f.write(f"#EXTVLCOPT:http-referrer={channel['referrer']}\n")
                
                # URL de la chaîne
                f.write(f"{channel.get('url', '')}\n\n")
    
    def save_json_data(self, filepath):
        """Sauvegarde les données JSON structurées"""
        data = {
            "metadata": {
                "total_channels": len(self.channels),
                "channels_with_logos": self.logos_found,
                "logo_percentage": round(self.logos_found/len(self.channels)*100, 1) if self.channels else 0,
                "generated_at": datetime.now().isoformat(),
                "sources_processed": self.sources_processed,
                "target_achieved": len(self.channels) >= self.total_channels_target
            },
            "channels": self.channels,
            "statistics": self.generate_statistics()
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def save_detailed_report(self, filepath):
        """Sauvegarde un rapport détaillé"""
        stats = self.generate_statistics()
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("🔍 MEGA CHANNEL HUNTER - RAPPORT DÉTAILLÉ\n")
            f.write("=" * 80 + "\n\n")
            
            f.write(f"📊 STATISTIQUES GÉNÉRALES\n")
            f.write(f"Total chaînes découvertes: {len(self.channels)}\n")
            f.write(f"Chaînes avec logos: {self.logos_found}\n")
            f.write(f"Taux de logos: {(self.logos_found/len(self.channels)*100):.1f}%\n")
            f.write(f"Sources traitées: {self.sources_processed}\n")
            f.write(f"Objectif 2500+ atteint: {'✅ OUI' if len(self.channels) >= 2500 else '❌ NON'}\n\n")
            
            f.write(f"📺 RÉPARTITION PAR QUALITÉ\n")
            for quality, count in stats['by_quality'].items():
                f.write(f"{quality}: {count} chaînes\n")
            f.write("\n")
            
            f.write(f"🌍 RÉPARTITION PAR PAYS (TOP 10)\n")
            for country, count in list(stats['by_country'].items())[:10]:
                f.write(f"{country}: {count} chaînes\n")
            f.write("\n")
            
            f.write(f"📂 RÉPARTITION PAR CATÉGORIE (TOP 10)\n")
            for category, count in list(stats['by_category'].items())[:10]:
                f.write(f"{category}: {count} chaînes\n")
            f.write("\n")
            
            f.write(f"🔗 RÉPARTITION PAR TYPE DE FLUX\n")
            for stream_type, count in stats['by_type'].items():
                f.write(f"{stream_type}: {count} chaînes\n")
    
    def generate_statistics(self):
        """Génère des statistiques détaillées"""
        stats = {
            'by_quality': {},
            'by_country': {},
            'by_category': {},
            'by_type': {}
        }
        
        for channel in self.channels:
            # Par qualité
            quality = channel.get('quality', 'Unknown')
            stats['by_quality'][quality] = stats['by_quality'].get(quality, 0) + 1
            
            # Par pays
            country = channel.get('country', 'Unknown')
            stats['by_country'][country] = stats['by_country'].get(country, 0) + 1
            
            # Par catégorie
            category = channel.get('group', 'Unknown')
            stats['by_category'][category] = stats['by_category'].get(category, 0) + 1
            
            # Par type
            stream_type = channel.get('type', 'Unknown')
            stats['by_type'][stream_type] = stats['by_type'].get(stream_type, 0) + 1
        
        # Tri par ordre décroissant
        for key in stats:
            stats[key] = dict(sorted(stats[key].items(), key=lambda x: x[1], reverse=True))
        
        return stats

def main():
    """Fonction principale"""
    print("🚀 MEGA CHANNEL HUNTER - RECHERCHE ULTRA-APPROFONDIE")
    print("🎯 Objectif: 2500+ chaînes avec logos et icônes")
    print("=" * 80)
    
    hunter = MegaChannelHunter()
    
    # Lancement de la recherche mega
    channels = hunter.hunt_mega_channels()
    
    # Sauvegarde des résultats
    hunter.save_results()
    
    print("\n🎉 MISSION ACCOMPLIE!")
    print(f"📺 {len(channels)} chaînes découvertes")
    print(f"🎨 {hunter.logos_found} logos trouvés")
    print(f"🎯 Objectif 2500+: {'✅ ATTEINT' if len(channels) >= 2500 else '❌ NON ATTEINT'}")

if __name__ == "__main__":
    main()
