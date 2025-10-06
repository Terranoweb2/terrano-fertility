#!/usr/bin/env python3
import json

def display_channels():
    # Charger les chaînes Canal+
    try:
        with open('playlists/canal_plus_channels.json', 'r', encoding='utf-8') as f:
            canal_channels = json.load(f)
    except:
        canal_channels = []
    
    print("=" * 80)
    print("📺 CHAÎNES CANAL+ ET SPÉCIALISÉES TROUVÉES")
    print("=" * 80)
    print()
    
    # Grouper par catégorie
    categories = {}
    for channel in canal_channels:
        cat = channel['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(channel)
    
    # Afficher par catégorie
    for category, channels in sorted(categories.items()):
        print(f"🎯 {category.upper()} ({len(channels)} chaînes)")
        print("-" * 60)
        
        for i, channel in enumerate(sorted(channels, key=lambda x: x['name']), 1):
            print(f"{i:2d}. {channel['name']}")
            print(f"    📡 Qualité: {channel['quality']}")
            print(f"    🌍 Pays: {channel['country']}")
            print(f"    📂 Groupe: {channel['group']}")
            if channel['logo']:
                print(f"    🖼️  Logo: Disponible")
            print(f"    🔗 URL: {channel['url'][:60]}...")
            print()
        
        print()
    
    # Statistiques finales
    print("📊 STATISTIQUES FINALES:")
    print(f"   • Total chaînes trouvées: {len(canal_channels)}")
    for cat, channels in sorted(categories.items()):
        print(f"   • {cat}: {len(channels)} chaînes")
    print()
    
    # Top 10 chaînes de qualité
    quality_channels = [ch for ch in canal_channels if any(domain in ch['url'] for domain in ['infomaniak.com', 'netplus.ch', 'cootel.com'])]
    
    print("🏆 TOP 10 CHAÎNES DE QUALITÉ (URLs fiables):")
    print("-" * 60)
    for i, channel in enumerate(quality_channels[:10], 1):
        print(f"{i:2d}. {channel['name']} ({channel['quality']})")
        print(f"    🔗 {channel['url'][:60]}...")
        print()

if __name__ == "__main__":
    display_channels()
