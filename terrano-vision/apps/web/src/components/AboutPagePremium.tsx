import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PREMIUM_IMAGES, RECOMMENDED_IMAGES } from '../constants/premiumImages';

const AboutPagePremium: React.FC = () => {
  const navigate = useNavigate();
  const [currentBgImage, setCurrentBgImage] = useState(0);

  const backgroundImages = [
    RECOMMENDED_IMAGES.HERO_BACKGROUND,
    ...RECOMMENDED_IMAGES.CANAL_SHOWCASE,
    ...RECOMMENDED_IMAGES.SPORT_HIGHLIGHTS
  ];

  // Rotation automatique des backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const features = [
    {
      icon: '📺',
      title: '2,674 Chaînes Premium',
      description: 'Le plus grand catalogue de chaînes en Afrique avec Canal+, National Geographic, Discovery et bien plus.',
      image: RECOMMENDED_IMAGES.CANAL_SHOWCASE[0]
    },
    {
      icon: '🎯',
      title: 'Qualité 4K & 8K',
      description: 'Streaming en ultra haute définition avec support HDR pour une expérience visuelle exceptionnelle.',
      image: RECOMMENDED_IMAGES.CANAL_SHOWCASE[1]
    },
    {
      icon: '📱',
      title: 'Multi-Appareils',
      description: 'Regardez sur smartphone, tablette, ordinateur, Smart TV. Synchronisation parfaite entre tous vos appareils.',
      image: RECOMMENDED_IMAGES.CANAL_SHOWCASE[2]
    },
    {
      icon: '🌍',
      title: 'Contenu Africain',
      description: 'Chaînes locales et internationales adaptées au marché africain francophone.',
      image: RECOMMENDED_IMAGES.SPORT_HIGHLIGHTS[0]
    },
    {
      icon: '⚡',
      title: 'Streaming Rapide',
      description: 'Infrastructure optimisée pour l\'Afrique avec serveurs locaux et CDN performant.',
      image: RECOMMENDED_IMAGES.SPORT_HIGHLIGHTS[1]
    },
    {
      icon: '💰',
      title: 'Prix Abordables',
      description: 'Tarification adaptée au marché africain avec paiements mobiles (Orange Money, MTN, Wave).',
      image: RECOMMENDED_IMAGES.SPORT_HIGHLIGHTS[2]
    }
  ];

  const technologies = [
    {
      category: 'Frontend',
      items: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'PWA'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Streaming',
      items: ['Shaka Player', 'HLS', 'DASH', 'WebRTC', 'CDN'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'WebSocket', 'Redis', 'MongoDB'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { number: '2,674', label: 'Chaînes Premium', icon: '📺' },
    { number: '150+', label: 'Pays Couverts', icon: '🌍' },
    { number: '99.9%', label: 'Disponibilité', icon: '⚡' },
    { number: '24/7', label: 'Support Client', icon: '🛟' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Premium Rotatif */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[12000ms] ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImages[currentBgImage]})`,
            filter: 'brightness(0.25) contrast(1.4)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/80 to-black/98" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-black/70" />
        
        {/* Mesh Gradient Animé */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-pink-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        {/* Particules Premium */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `linear-gradient(45deg, 
                  ${['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'][Math.floor(Math.random() * 6)]}, 
                  ${['#1D4ED8', '#7C3AED', '#D97706', '#059669', '#DC2626', '#0891B2'][Math.floor(Math.random() * 6)]})`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TerranoVision
                </h1>
                <p className="text-sm text-gray-400">Retour à l'accueil</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full">
                <span className="text-blue-300 font-bold">Version 1.0.0</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-20">
              <h2 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight animate-fade-in-up">
                À Propos de TerranoVision
              </h2>
              <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12">
                La première plateforme de streaming premium 
                <span className="text-yellow-400 font-bold"> conçue pour l'Afrique</span>, 
                avec le plus grand catalogue de chaînes du continent
              </p>

              {/* Statistiques Impressionnantes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="group">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-105">
                      <div className="text-4xl mb-4">{stat.icon}</div>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                      <div className="text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fonctionnalités avec Images */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🚀 Fonctionnalités Premium
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden group-hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                    {/* Image de Fonctionnalité */}
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url(${feature.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="p-8">
                      <h4 className="text-xl font-bold text-white mb-4">{feature.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              💻 Technologies de Pointe
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {technologies.map((tech, index) => (
                <div key={index} className="group">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-6">{tech.category}</h4>
                    <div className="space-y-3">
                      {tech.items.map((item, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Mission */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Notre Mission</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed text-center">
                  Démocratiser l'accès au divertissement premium en Afrique en proposant 
                  le plus grand catalogue de chaînes internationales à des prix abordables, 
                  avec une technologie de pointe adaptée aux réalités du continent.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🌟</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Notre Vision</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed text-center">
                  Devenir la plateforme de référence du streaming en Afrique francophone, 
                  en connectant les communautés à travers un contenu de qualité mondiale 
                  tout en valorisant la richesse culturelle africaine.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Avertissements Légaux */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-3xl p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-amber-400 mb-6">⚖️ Avertissement Légal</h3>
              </div>
              <div className="text-amber-200 leading-relaxed space-y-4">
                <p>
                  <strong>TerranoVision</strong> est une plateforme technologique qui agrège des flux IPTV publics disponibles sur Internet. 
                  Nous ne sommes pas propriétaires du contenu diffusé et ne stockons aucun fichier multimédia sur nos serveurs.
                </p>
                <p>
                  Les utilisateurs sont responsables de vérifier la légalité du contenu dans leur juridiction. 
                  Nous encourageons le respect des droits d'auteur et recommandons l'utilisation de services officiels lorsque disponibles.
                </p>
                <p>
                  Pour toute réclamation concernant le contenu, veuillez nous contacter à : <strong>legal@terranovision.tv</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-4xl font-black mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📞 Besoin d'Aide ?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Support 24/7</h4>
                <p className="text-gray-400">Assistance technique disponible jour et nuit pour tous nos abonnés premium.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Email</h4>
                <p className="text-gray-400">support@terranovision.tv</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Chat Live</h4>
                <p className="text-gray-400">Assistance instantanée via notre chat intégré dans l'application.</p>
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
              <h4 className="text-3xl font-black text-white mb-6">Prêt à Découvrir TerranoVision ?</h4>
              <p className="text-blue-100 text-xl mb-8 max-w-3xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui font déjà confiance à TerranoVision 
                pour leur divertissement premium quotidien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/subscription')}
                  className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Commencer Maintenant
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  📺 Voir les Chaînes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <p className="text-gray-400 text-sm">
                  © 2024 TerranoVision. La révolution du streaming en Afrique.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Conditions</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Confidentialité</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPagePremium;
