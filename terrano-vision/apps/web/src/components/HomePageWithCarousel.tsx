import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { PREMIUM_IMAGES, RECOMMENDED_IMAGES } from '../constants/premiumImages';

interface PopularChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  quality: string;
  viewers: string;
  isLive?: boolean;
  description: string;
  backgroundImage: string;
}

const HomePageWithCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, channels } = useAppStore();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const heroImages = [
    PREMIUM_IMAGES.HERO.HERO_SUPERHERO,
    PREMIUM_IMAGES.HERO.HERO_MANAGER,
    ...RECOMMENDED_IMAGES.CANAL_SHOWCASE.slice(0, 4)
  ];

  // Chaînes populaires avec vos images premium
  const popularChannels: PopularChannel[] = [
    {
      id: 'canal-plus',
      name: 'Canal+',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Canal%2B.svg/512px-Canal%2B.svg.png',
      category: 'Cinéma & Séries',
      quality: '4K',
      viewers: '2.1M',
      isLive: true,
      description: 'Films exclusifs, séries premium et sport en direct',
      backgroundImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[0]
    },
    {
      id: 'national-geo',
      name: 'National Geographic',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Natgeologo.svg/512px-Natgeologo.svg.png',
      category: 'Documentaires',
      quality: 'HD',
      viewers: '1.8M',
      isLive: true,
      description: 'Documentaires nature et sciences en haute définition',
      backgroundImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[1]
    },
    {
      id: 'france24',
      name: 'France 24',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/France24.png/512px-France24.png',
      category: 'Actualités',
      quality: 'HD',
      viewers: '1.5M',
      isLive: true,
      description: 'Actualités internationales 24h/24 en français',
      backgroundImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[2]
    },
    {
      id: 'discovery',
      name: 'Discovery Channel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_-_Logo_2019.svg/512px-Discovery_Channel_-_Logo_2019.svg.png',
      category: 'Sciences & Tech',
      quality: '4K',
      viewers: '1.3M',
      isLive: true,
      description: 'Sciences, technologie et découvertes fascinantes',
      backgroundImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[3]
    },
    {
      id: 'mtv',
      name: 'MTV',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/MTV-2021.svg/512px-MTV-2021.svg.png',
      category: 'Musique & Divertissement',
      quality: 'HD',
      viewers: '1.1M',
      isLive: true,
      description: 'Musique, clips et divertissement pour les jeunes',
      backgroundImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[4]
    },
    {
      id: 'eurosport',
      name: 'Eurosport',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Eurosport_1_logo.svg/512px-Eurosport_1_logo.svg.png',
      category: 'Sport',
      quality: '4K',
      viewers: '2.5M',
      isLive: true,
      description: 'Tous les sports en direct et en haute qualité',
      backgroundImage: RECOMMENDED_IMAGES.SPORT_HIGHLIGHTS[0]
    }
  ];

  // Rotation automatique des images hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-scroll du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % popularChannels.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [popularChannels.length]);

  const isSubscribed = subscription?.isActive || false;
  const channelCount = channels.length || 2674;

  const nextChannel = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % popularChannels.length);
  };

  const prevChannel = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + popularChannels.length) % popularChannels.length);
  };

  const goToChannel = (index: number) => {
    setCurrentCarouselIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Hero avec Images Premium */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-3000 ease-in-out"
          style={{
            backgroundImage: `url(${heroImages[currentHeroImage]})`,
            filter: 'brightness(0.4) contrast(1.2)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50" />
        
        {/* Particules Premium */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: `linear-gradient(45deg, 
                  ${['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'][Math.floor(Math.random() * 4)]}, 
                  ${['#1D4ED8', '#7C3AED', '#D97706', '#059669'][Math.floor(Math.random() * 4)]})`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TerranoVision
              </h1>
              <span className="ml-4 px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-bold">
                ✨ {channelCount.toLocaleString()} chaînes
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isSubscribed && (
                <button
                  onClick={() => navigate('/subscription')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  S'abonner
                </button>
              )}
              <button
                onClick={() => navigate('/about')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300"
              >
                À propos
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Titre Principal */}
            <div className="text-center mb-12">
              <h2 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight animate-fade-in-up">
                Streaming Premium
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Découvrez les meilleures chaînes avec 
                <span className="text-yellow-400 font-bold"> Canal+</span>, 
                <span className="text-blue-400 font-bold"> National Geographic</span>, 
                <span className="text-green-400 font-bold"> Discovery</span> et bien plus
              </p>

              {/* Statistiques Impressionnantes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-black text-blue-400 mb-2">{channelCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Chaînes Premium</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-black text-green-400 mb-2">100%</div>
                  <div className="text-sm text-gray-300">Avec Logos HD</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-black text-purple-400 mb-2">4K</div>
                  <div className="text-sm text-gray-300">Qualité Ultra HD</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-black text-yellow-400 mb-2">7.5</div>
                  <div className="text-sm text-gray-300">XOF par chaîne</div>
                </div>
              </div>

              {/* Barre de Recherche Premium */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une chaîne ou un programme..."
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Carrousel de Chaînes Populaires */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-white">🔥 Chaînes Populaires</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={prevChannel}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextChannel}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Carrousel Principal */}
              <div className="relative overflow-hidden rounded-3xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                >
                  {popularChannels.map((channel, index) => (
                    <div key={channel.id} className="w-full flex-shrink-0 relative">
                      <div className="relative h-96 md:h-[500px] overflow-hidden">
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${channel.backgroundImage})`,
                            filter: 'brightness(0.6) contrast(1.1)',
                          }}
                        />
                        
                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                          <div className="max-w-7xl mx-auto px-6 w-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                              {/* Left Content */}
                              <div className="space-y-6">
                                {/* Channel Logo & Info */}
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                                    <img 
                                      src={channel.logo} 
                                      alt={channel.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-3xl font-black text-white">{channel.name}</h4>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-bold">
                                        {channel.category}
                                      </span>
                                      <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-green-300 text-sm font-bold">
                                        {channel.quality}
                                      </span>
                                      {channel.isLive && (
                                        <span className="flex items-center px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full text-red-300 text-sm font-bold">
                                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                                          LIVE
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="text-xl text-gray-300 leading-relaxed">
                                  {channel.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center text-gray-400">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    {channel.viewers} spectateurs
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4">
                                  <button
                                    onClick={() => !isSubscribed ? navigate('/subscription') : navigate(`/player/${channel.id}`)}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                                  >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                    {isSubscribed ? 'Regarder' : 'S\'abonner pour regarder'}
                                  </button>
                                  <button className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 transition-all duration-300">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Favoris
                                  </button>
                                </div>
                              </div>

                              {/* Right Content - Preview */}
                              <div className="hidden lg:block">
                                <div className="relative">
                                  <div className="aspect-video bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                                    <div 
                                      className="w-full h-full bg-cover bg-center"
                                      style={{ backgroundImage: `url(${channel.backgroundImage})` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {popularChannels.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToChannel(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentCarouselIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Boutons d'Action Principaux */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!isSubscribed ? (
                  <>
                    <button
                      onClick={() => navigate('/subscription')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    >
                      🚀 Commencer maintenant
                    </button>
                    <button
                      onClick={() => navigate('/subscription')}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl border border-white/30 transition-all duration-300"
                    >
                      📺 Voir les plans
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/channels')}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                  >
                    🎬 Regarder maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400 text-sm">
              © 2024 TerranoVision. La meilleure expérience de streaming en Afrique.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePageWithCarousel;
