#!/usr/bin/env python3
"""
🎨 PREMIUM IMAGES DOWNLOADER - Téléchargement et Optimisation
================================================================================
Script pour télécharger et optimiser toutes les images premium pour TerranoVision
Crée une galerie d'images ultra-moderne pour l'interface
================================================================================
"""

import requests
import os
import json
from urllib.parse import urlparse
import time

class PremiumImagesDownloader:
    def __init__(self):
        self.images_dir = "apps/web/public/images"
        self.premium_images = [
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491200/the-super-hero-in-the-poster-1_5000x_whuwqd.jpg",
                "name": "hero_superhero",
                "category": "hero",
                "description": "Super-héros pour section hero principale"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491200/the-manager-in-the-poster-1_5000x_zycxok.webp",
                "name": "hero_manager",
                "category": "hero", 
                "description": "Manager pour section business/premium"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491200/php14pT6E_uuzhxe.avif",
                "name": "content_action_1",
                "category": "content",
                "description": "Contenu action/aventure"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491200/php2eCjHe_pqjczy.avif", 
                "name": "content_drama_1",
                "category": "content",
                "description": "Contenu dramatique"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491200/myCANAL_16x9_MEA_1920x1080-xSaC_xtozvf.webp",
                "name": "canal_premium_1",
                "category": "canal",
                "description": "Contenu Canal+ premium 1"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-vJYs_c9bqcn.webp",
                "name": "canal_premium_2", 
                "category": "canal",
                "description": "Contenu Canal+ premium 2"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-wb18_mayp4s.webp",
                "name": "canal_premium_3",
                "category": "canal",
                "description": "Contenu Canal+ premium 3"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-vhtL_vxhrhy.webp",
                "name": "canal_premium_4",
                "category": "canal", 
                "description": "Contenu Canal+ premium 4"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-tYAq_au7hyv.webp",
                "name": "canal_premium_5",
                "category": "canal",
                "description": "Contenu Canal+ premium 5"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-RHS9_y19b6v.webp",
                "name": "canal_premium_6",
                "category": "canal",
                "description": "Contenu Canal+ premium 6"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-Qo03_bwtrod.webp",
                "name": "canal_premium_7",
                "category": "canal",
                "description": "Contenu Canal+ premium 7"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-siRK_fkcfej.webp",
                "name": "canal_premium_8",
                "category": "canal",
                "description": "Contenu Canal+ premium 8"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491199/myCANAL_16x9_MEA_1920x1080-qt88_hikcze.webp",
                "name": "canal_premium_9",
                "category": "canal",
                "description": "Contenu Canal+ premium 9"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491165/myCANAL_16x9_MEA_1920x1080-mopm_1_kcqbma.webp",
                "name": "canal_premium_10",
                "category": "canal",
                "description": "Contenu Canal+ premium 10"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491165/myCANAL_16x9_MEA_1920x1080-nXnI_pkis3d.webp",
                "name": "canal_premium_11",
                "category": "canal",
                "description": "Contenu Canal+ premium 11"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491165/myCANAL_16x9_MEA_1920x1080-mopm_tjc1di.webp",
                "name": "canal_premium_12",
                "category": "canal",
                "description": "Contenu Canal+ premium 12"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491165/myCANAL_16x9_MEA_1920x1080-M1ef_yijbdx.webp",
                "name": "canal_premium_13",
                "category": "canal",
                "description": "Contenu Canal+ premium 13"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491164/myCANAL_16x9_MEA_1920x1080-i4C-_wfpusb.webp",
                "name": "canal_premium_14",
                "category": "canal",
                "description": "Contenu Canal+ premium 14"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491164/myCANAL_16x9_MEA_1920x1080-gp24_iqk0mt.webp",
                "name": "canal_premium_15",
                "category": "canal",
                "description": "Contenu Canal+ premium 15"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491163/myCANAL_16x9_MEA_1920x1080-9UIN_wow4cz.webp",
                "name": "canal_premium_16",
                "category": "canal",
                "description": "Contenu Canal+ premium 16"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491162/118509880_nmsayd.webp",
                "name": "sport_content_1",
                "category": "sport",
                "description": "Contenu sportif premium"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491162/Barcelone-PSG-zSRB_im660k.webp",
                "name": "sport_football_1",
                "category": "sport",
                "description": "Football Barcelone-PSG"
            },
            {
                "url": "https://res.cloudinary.com/dxy0fiahv/image/upload/v1759491161/121058786_dho4i1.webp",
                "name": "sport_content_2",
                "category": "sport", 
                "description": "Contenu sportif premium 2"
            }
        ]
        
        self.downloaded_images = []
    
    def create_directories(self):
        """Crée les dossiers nécessaires"""
        categories = ["hero", "canal", "content", "sport", "backgrounds", "thumbnails"]
        
        for category in categories:
            dir_path = os.path.join(self.images_dir, category)
            os.makedirs(dir_path, exist_ok=True)
            print(f"📁 Dossier créé: {dir_path}")
    
    def download_image(self, image_info):
        """Télécharge une image"""
        try:
            print(f"⬇️  Téléchargement: {image_info['name']}")
            
            response = requests.get(image_info['url'], timeout=30)
            response.raise_for_status()
            
            # Déterminer l'extension
            parsed_url = urlparse(image_info['url'])
            if '.webp' in parsed_url.path:
                ext = '.webp'
            elif '.avif' in parsed_url.path:
                ext = '.avif'
            elif '.jpg' in parsed_url.path:
                ext = '.jpg'
            else:
                ext = '.webp'  # Par défaut
            
            # Chemin de sauvegarde
            filename = f"{image_info['name']}{ext}"
            filepath = os.path.join(self.images_dir, image_info['category'], filename)
            
            # Sauvegarder l'image
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            # Mettre à jour les informations
            image_info['local_path'] = filepath
            image_info['filename'] = filename
            image_info['size'] = len(response.content)
            
            self.downloaded_images.append(image_info)
            print(f"✅ Téléchargé: {filename} ({len(response.content)} bytes)")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur téléchargement {image_info['name']}: {e}")
            return False
    
    def download_all_images(self):
        """Télécharge toutes les images"""
        print("🎨 TÉLÉCHARGEMENT DES IMAGES PREMIUM")
        print("=" * 60)
        
        self.create_directories()
        
        success_count = 0
        for image_info in self.premium_images:
            if self.download_image(image_info):
                success_count += 1
            time.sleep(0.5)  # Pause pour éviter la surcharge
        
        print(f"\n✅ {success_count}/{len(self.premium_images)} images téléchargées")
        return success_count
    
    def create_image_catalog(self):
        """Crée un catalogue des images téléchargées"""
        catalog = {
            "metadata": {
                "total_images": len(self.downloaded_images),
                "categories": {},
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "images": self.downloaded_images
        }
        
        # Compter par catégorie
        for img in self.downloaded_images:
            category = img['category']
            if category not in catalog["metadata"]["categories"]:
                catalog["metadata"]["categories"][category] = 0
            catalog["metadata"]["categories"][category] += 1
        
        # Sauvegarder le catalogue
        catalog_path = "data/premium_images_catalog.json"
        with open(catalog_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        
        print(f"📋 Catalogue créé: {catalog_path}")
        return catalog
    
    def generate_image_constants(self):
        """Génère un fichier de constantes pour React"""
        constants_content = """// 🎨 PREMIUM IMAGES CONSTANTS - Auto-généré
// Images premium pour TerranoVision ultra-moderne

export const PREMIUM_IMAGES = {
  // 🦸 Images Hero
  HERO: {
"""
        
        # Organiser par catégorie
        categories = {}
        for img in self.downloaded_images:
            if img['category'] not in categories:
                categories[img['category']] = []
            categories[img['category']].append(img)
        
        # Générer les constantes par catégorie
        for category, images in categories.items():
            category_name = category.upper()
            constants_content += f"  // 🎯 {category_name.title()}\n"
            constants_content += f"  {category_name}: {{\n"
            
            for img in images:
                const_name = img['name'].upper().replace('-', '_')
                path = f"/images/{img['category']}/{img['filename']}"
                constants_content += f"    {const_name}: '{path}',\n"
            
            constants_content += "  },\n\n"
        
        constants_content += """};

// 🎨 Fonction utilitaire pour obtenir une image aléatoire par catégorie
export const getRandomImage = (category: keyof typeof PREMIUM_IMAGES): string => {
  const categoryImages = Object.values(PREMIUM_IMAGES[category]);
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

// 🎯 Fonction pour obtenir toutes les images d'une catégorie
export const getCategoryImages = (category: keyof typeof PREMIUM_IMAGES): string[] => {
  return Object.values(PREMIUM_IMAGES[category]);
};

// 🌟 Images recommandées pour chaque section
export const RECOMMENDED_IMAGES = {
  HERO_BACKGROUND: PREMIUM_IMAGES.HERO.HERO_SUPERHERO,
  SUBSCRIPTION_BACKGROUND: PREMIUM_IMAGES.HERO.HERO_MANAGER,
  CANAL_SHOWCASE: [
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_1,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_2,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_3,
  ],
  SPORT_HIGHLIGHTS: [
    PREMIUM_IMAGES.SPORT.SPORT_FOOTBALL_1,
    PREMIUM_IMAGES.SPORT.SPORT_CONTENT_1,
    PREMIUM_IMAGES.SPORT.SPORT_CONTENT_2,
  ],
  CONTENT_CAROUSEL: [
    ...Object.values(PREMIUM_IMAGES.CANAL).slice(0, 8),
    ...Object.values(PREMIUM_IMAGES.CONTENT),
  ],
};
"""
        
        # Sauvegarder le fichier de constantes
        constants_path = "apps/web/src/constants/premiumImages.ts"
        with open(constants_path, 'w', encoding='utf-8') as f:
            f.write(constants_content)
        
        print(f"⚛️  Constantes React créées: {constants_path}")
        return constants_path

def main():
    """Fonction principale"""
    print("🎨 PREMIUM IMAGES DOWNLOADER")
    print("🎯 Téléchargement des images ultra-modernes pour TerranoVision")
    print("=" * 60)
    
    downloader = PremiumImagesDownloader()
    
    # Télécharger toutes les images
    success_count = downloader.download_all_images()
    
    if success_count > 0:
        # Créer le catalogue
        catalog = downloader.create_image_catalog()
        
        # Générer les constantes React
        constants_path = downloader.generate_image_constants()
        
        print("\n🎉 TÉLÉCHARGEMENT TERMINÉ!")
        print(f"✅ {success_count} images téléchargées")
        print(f"📋 Catalogue: data/premium_images_catalog.json")
        print(f"⚛️  Constantes: {constants_path}")
        print("\n🚀 Images prêtes pour intégration dans TerranoVision!")
    else:
        print("❌ Aucune image téléchargée")

if __name__ == "__main__":
    main()
