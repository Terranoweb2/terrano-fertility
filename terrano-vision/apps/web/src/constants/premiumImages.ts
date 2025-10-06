// 🎨 PREMIUM IMAGES CONSTANTS - Auto-généré
// Images premium pour TerranoVision ultra-moderne

export const PREMIUM_IMAGES = {
  // 🦸 Images Hero
  HERO: {
    HERO_SUPERHERO: '/images/hero/hero_superhero.jpg',
    HERO_MANAGER: '/images/hero/hero_manager.webp',
  },

  // 🎯 CANAL
  CANAL: {
    CANAL_PREMIUM_1: '/images/canal/canal_premium_1.webp',
    CANAL_PREMIUM_2: '/images/canal/canal_premium_2.webp',
    CANAL_PREMIUM_3: '/images/canal/canal_premium_3.webp',
    CANAL_PREMIUM_4: '/images/canal/canal_premium_4.webp',
    CANAL_PREMIUM_5: '/images/canal/canal_premium_5.webp',
    CANAL_PREMIUM_6: '/images/canal/canal_premium_6.webp',
    CANAL_PREMIUM_7: '/images/canal/canal_premium_7.webp',
    CANAL_PREMIUM_8: '/images/canal/canal_premium_8.webp',
    CANAL_PREMIUM_9: '/images/canal/canal_premium_9.webp',
    CANAL_PREMIUM_10: '/images/canal/canal_premium_10.webp',
    CANAL_PREMIUM_11: '/images/canal/canal_premium_11.webp',
    CANAL_PREMIUM_12: '/images/canal/canal_premium_12.webp',
    CANAL_PREMIUM_13: '/images/canal/canal_premium_13.webp',
    CANAL_PREMIUM_14: '/images/canal/canal_premium_14.webp',
    CANAL_PREMIUM_15: '/images/canal/canal_premium_15.webp',
    CANAL_PREMIUM_16: '/images/canal/canal_premium_16.webp',
  },

  // 🎬 CONTENT
  CONTENT: {
    CONTENT_ACTION_1: '/images/content/content_action_1.avif',
    CONTENT_DRAMA_1: '/images/content/content_drama_1.avif',
  },

  // ⚽ SPORT
  SPORT: {
    SPORT_CONTENT_1: '/images/sport/sport_content_1.webp',
    SPORT_FOOTBALL_1: '/images/sport/sport_football_1.webp',
    SPORT_CONTENT_2: '/images/sport/sport_content_2.webp',
  },
};

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
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_1,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_2,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_3,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_4,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_5,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_6,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_7,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_8,
    PREMIUM_IMAGES.CONTENT.CONTENT_ACTION_1,
    PREMIUM_IMAGES.CONTENT.CONTENT_DRAMA_1,
  ],
};
