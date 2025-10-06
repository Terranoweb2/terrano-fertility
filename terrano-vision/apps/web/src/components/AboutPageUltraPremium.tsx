import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Globe, Code, Heart, Star, Zap, Award, Users } from 'lucide-react';
import { PREMIUM_IMAGES, getRandomImage } from '../constants/premiumImages';

const AboutPageUltraPremium: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const backgroundImages = [
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_1,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_2,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_3,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_4,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_5,
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="h-full overflow-auto relative">
      {/* Background avec images premium en rotation */}
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(1px)',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/95 via-dark-800/90 to-primary-900/80" />
      </div>

      {/* Particules animées */}
      <div className="fixed inset-0 z-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 max-w-4xl mx-auto p-6 space-y-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header Premium */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-xl" />
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-lg opacity-50" />
                <div className="relative w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent mb-4">
              TerranoVision
            </h1>
            <p className="text-xl text-white/80 mb-2">
              Plateforme de streaming premium ultra-moderne
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg font-semibold">Version 2.0 Premium</span>
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        </div>

        {/* Stats Premium */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Chaînes', value: '2,674+', color: 'from-blue-400 to-blue-600' },
            { icon: Globe, label: 'Pays', value: '150+', color: 'from-green-400 to-green-600' },
            { icon: Award, label: 'Qualité', value: '4K HDR', color: 'from-purple-400 to-purple-600' },
            { icon: Zap, label: 'Vitesse', value: 'Ultra', color: 'from-orange-400 to-orange-600' },
          ].map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Fonctionnalités Premium */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Fonctionnalités Premium
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Streaming Ultra HD',
                description: 'Lecture de flux HLS (.m3u8) et DASH (.mpd) en qualité 4K HDR',
                icon: '🎬',
              },
              {
                title: 'Intelligence Artificielle',
                description: 'Recommandations personnalisées avec IA avancée',
                icon: '🤖',
              },
              {
                title: 'Catalogue Premium',
                description: '2,674+ chaînes premium avec contenu exclusif',
                icon: '⭐',
              },
              {
                title: 'Multi-Plateforme',
                description: 'Compatible tous appareils avec synchronisation cloud',
                icon: '📱',
              },
              {
                title: 'Contrôle Parental',
                description: 'Système avancé de protection et filtrage',
                icon: '🛡️',
              },
              {
                title: 'Expérience Immersive',
                description: 'Interface ultra-moderne avec effets visuels premium',
                icon: '✨',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Premium */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Stack Technologique
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                Frontend Premium
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'React 19', desc: 'Framework moderne avec Concurrent Features' },
                  { name: 'TypeScript', desc: 'Typage strict pour une robustesse maximale' },
                  { name: 'Vite', desc: 'Build ultra-rapide avec HMR avancé' },
                  { name: 'Tailwind CSS', desc: 'Design system premium personnalisé' },
                  { name: 'Shaka Player', desc: 'Lecteur vidéo professionnel Google' },
                ].map((tech, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-white">{tech.name}</div>
                      <div className="text-sm text-white/60">{tech.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full" />
                Backend & Infrastructure
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Node.js', desc: 'Runtime haute performance' },
                  { name: 'Express', desc: 'API REST optimisée' },
                  { name: 'WebSocket', desc: 'Communication temps réel' },
                  { name: 'CDN Global', desc: 'Distribution mondiale ultra-rapide' },
                  { name: 'Cloud Native', desc: 'Architecture scalable et résiliente' },
                ].map((tech, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div className="w-2 h-2 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full mt-2" />
                    <div>
                      <div className="font-medium text-white">{tech.name}</div>
                      <div className="text-sm text-white/60">{tech.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avertissement Légal Premium */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-400">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            Avertissement Légal
          </h2>
          
          <div className="space-y-4 text-yellow-100">
            <p className="text-lg leading-relaxed">
              <strong className="text-yellow-300">TerranoVision</strong> est une plateforme de streaming premium. 
              L'utilisateur est entièrement responsable du contenu qu'il choisit de visionner.
            </p>
            
            <div className="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="font-semibold text-yellow-300 mb-3">Responsabilités de l'utilisateur :</h3>
              <ul className="space-y-2">
                {[
                  'Respecter les droits d\'auteur et licences des contenus',
                  'Vérifier les autorisations géographiques',
                  'Se conformer aux lois locales en vigueur',
                  'Utiliser uniquement des flux légaux et autorisés',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="font-medium text-yellow-200 text-center p-4 bg-yellow-500/10 rounded-xl">
              Les développeurs de TerranoVision ne sont pas responsables de l'utilisation 
              qui est faite de cette application.
            </p>
          </div>
        </div>

        {/* Confidentialité Premium */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-green-400">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Confidentialité & Sécurité
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Zéro Collecte',
                description: 'Aucune donnée personnelle collectée',
                icon: '🔒',
              },
              {
                title: 'Stockage Local',
                description: 'Favoris et historique en local uniquement',
                icon: '💾',
              },
              {
                title: 'Pas de Tracking',
                description: 'Aucun analytics ou suivi comportemental',
                icon: '🚫',
              },
              {
                title: 'Open Source',
                description: 'Code transparent et vérifiable',
                icon: '📖',
              },
            ].map((privacy, index) => (
              <div key={index} className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{privacy.icon}</span>
                  <h3 className="font-semibold text-green-300">{privacy.title}</h3>
                </div>
                <p className="text-green-100 text-sm">{privacy.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crédits Premium */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-red-400">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            Crédits & Remerciements
          </h2>
          
          <div className="space-y-4">
            <p className="text-red-100 text-lg">
              TerranoVision utilise les meilleures technologies open source :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Shaka Player', author: 'Google', license: 'Apache 2.0' },
                { name: 'React', author: 'Meta', license: 'MIT' },
                { name: 'Tailwind CSS', author: 'Tailwind Labs', license: 'MIT' },
                { name: 'Lucide Icons', author: 'Lucide', license: 'ISC' },
                { name: 'Zustand', author: 'Poimandres', license: 'MIT' },
                { name: 'Vite', author: 'Evan You', license: 'MIT' },
              ].map((credit, index) => (
                <div key={index} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-300">{credit.name}</div>
                  <div className="text-sm text-red-200">{credit.author} • {credit.license}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl border border-red-500/30">
              <p className="text-red-200 text-lg">
                Développé avec ❤️ par l'équipe TerranoVision
              </p>
              <p className="text-red-300 text-sm mt-2">
                Innovation • Performance • Excellence
              </p>
            </div>
          </div>
        </div>

        {/* Footer Premium */}
        <div className="text-center py-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/80 text-lg mb-2">© 2024 TerranoVision - Tous droits réservés</p>
            <p className="text-white/60">
              Plateforme de streaming premium ultra-moderne • Version 2.0
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-white/60 ml-2">Excellence garantie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageUltraPremium;
