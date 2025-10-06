import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { PREMIUM_IMAGES, RECOMMENDED_IMAGES } from '../constants/premiumImages';

const HomePageSimple: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, channels } = useAppStore();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const heroImages = [
    PREMIUM_IMAGES.HERO.HERO_SUPERHERO,
    PREMIUM_IMAGES.HERO.HERO_MANAGER,
    ...RECOMMENDED_IMAGES.CANAL_SHOWCASE.slice(0, 4)
  ];

  // Rotation automatique des images hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const isSubscribed = subscription?.isActive || false;
  const channelCount = channels.length || 2674;

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
          <div className="max-w-7xl mx-auto text-center">
            {/* Titre Principal */}
            <div className="mb-12">
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
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-3xl font-black text-blue-400 mb-2">{channelCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-300">Chaînes Premium</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-3xl font-black text-green-400 mb-2">100%</div>
                  <div className="text-sm text-gray-300">Avec Logos HD</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-3xl font-black text-purple-400 mb-2">4K</div>
                  <div className="text-sm text-gray-300">Qualité Ultra HD</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <div className="text-3xl font-black text-yellow-400 mb-2">7.5</div>
                  <div className="text-sm text-gray-300">XOF par chaîne</div>
                </div>
              </div>

              {/* Barre de Recherche Premium */}
              <div className="max-w-2xl mx-auto mb-8">
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

              {/* Boutons d'Action */}
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

            {/* Carousel de Contenu Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {RECOMMENDED_IMAGES.CANAL_SHOWCASE.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => !isSubscribed && navigate('/subscription')}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image}
                      alt={`Contenu premium ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Badge Premium */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                        PREMIUM
                      </span>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-2">Contenu Exclusif</h3>
                      <p className="text-gray-300 text-sm">Découvrez nos programmes premium en qualité 4K</p>
                    </div>
                  </div>
                </div>
              ))}
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

export default HomePageSimple;
