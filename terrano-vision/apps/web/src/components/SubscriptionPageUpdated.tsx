import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Star, Zap, Crown, Gift, Shield, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PREMIUM_IMAGES, getRandomImage } from '../constants/premiumImages';

const SubscriptionPageUpdated: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const backgroundImages = [
    PREMIUM_IMAGES.HERO.HERO_MANAGER,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_1,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_2,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_3,
    PREMIUM_IMAGES.CANAL.CANAL_PREMIUM_4,
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const plans = [
    {
      id: 'monthly',
      name: 'Mensuel',
      price: 5000,
      period: 'mois',
      originalPrice: null,
      savings: null,
      popular: false,
      features: [
        'Accès à tous les films',
        'Plus de 2,674 chaînes premium',
        'Qualité 4K Ultra HD',
        'Streaming illimité',
        'Support 24/7',
        'Compatible tous appareils',
        'Pas d\'engagement',
        'Annulation facile'
      ],
      color: 'from-blue-500 to-blue-600',
      icon: Clock,
      badge: null
    },
    {
      id: 'quarterly',
      name: 'Trimestriel',
      price: 12000,
      period: '3 mois',
      originalPrice: 15000,
      savings: 3000,
      popular: true,
      features: [
        'Accès à tous les films',
        'Plus de 2,674 chaînes premium',
        'Qualité 4K Ultra HD',
        'Streaming illimité',
        'Support prioritaire 24/7',
        'Compatible tous appareils',
        'Téléchargement hors-ligne',
        'Contenu exclusif premium',
        'Économisez 3,000 XOF'
      ],
      color: 'from-purple-500 to-pink-500',
      icon: Star,
      badge: 'Plus populaire'
    },
    {
      id: 'biannual',
      name: 'Semestriel',
      price: 20000,
      period: '6 mois',
      originalPrice: 30000,
      savings: 10000,
      popular: false,
      features: [
        'Accès à tous les films',
        'Plus de 2,674 chaînes premium',
        'Qualité 8K & HDR',
        'Streaming illimité',
        'Support VIP dédié',
        'Compatible tous appareils',
        'Téléchargement illimité',
        'Contenu exclusif premium',
        'Accès anticipé nouveautés',
        'Économisez 10,000 XOF'
      ],
      color: 'from-orange-500 to-red-500',
      icon: Crown,
      badge: 'Meilleure valeur'
    }
  ];

  const paymentMethods = [
    { name: 'Orange Money', icon: '📱', color: 'bg-orange-500' },
    { name: 'MTN Mobile Money', icon: '💳', color: 'bg-yellow-500' },
    { name: 'Wave', icon: '🌊', color: 'bg-blue-500' },
    { name: 'Cartes Bancaires', icon: '💳', color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen relative overflow-auto">
      {/* Background premium avec images en rotation */}
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
        {[...Array(25)].map((_, i) => (
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

      <div className={`relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white font-medium">TerranoVision</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
            <Gift className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">Offre spéciale de lancement</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center px-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent mb-6">
            Choisissez votre Plan
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Accédez à <span className="text-primary-400 font-semibold">tous les films</span> et plus de 
            <span className="text-accent-400 font-semibold"> 2,674 chaînes premium</span> avec 
            Canal+, National Geographic, Discovery et bien plus
          </p>
          
          {/* Garanties */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { icon: Shield, text: 'Sans engagement' },
              { icon: Zap, text: 'Activation immédiate' },
              { icon: Users, text: 'Support 24/7' }
            ].map((guarantee, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <guarantee.icon className="w-5 h-5 text-green-400" />
                <span className="text-white/80">{guarantee.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans d'abonnement */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 ${
                  plan.popular ? 'ring-2 ring-primary-400/50' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold rounded-full shadow-lg">
                      ⭐ {plan.badge}
                    </div>
                  </div>
                )}

                {/* Icône du plan */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                </div>

                {/* Prix */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price.toLocaleString()}</span>
                    <div className="text-left">
                      <div className="text-sm text-white/60">XOF</div>
                      <div className="text-sm text-white/60">/{plan.period}</div>
                    </div>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg text-white/50 line-through">
                        {plan.originalPrice.toLocaleString()} XOF
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                        -{plan.savings?.toLocaleString()} XOF
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-white/60">
                    Soit {Math.round(plan.price / (plan.period === 'mois' ? 1 : plan.period === '3 mois' ? 3 : 6)).toLocaleString()} XOF par mois
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'abonnement */}
                <button className={`w-full py-4 px-6 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                  S'abonner maintenant
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Moyens de paiement */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              💳 Moyens de Paiement Acceptés
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 ${method.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                  <div className="text-white/80 text-sm font-medium">{method.name}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">
                  Garantie satisfait ou remboursé 7 jours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ / Informations supplémentaires */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              ℹ️ Informations Importantes
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-4">✅ Inclus dans tous les plans</h4>
                <ul className="space-y-2 text-white/80">
                  <li>• Accès immédiat après paiement</li>
                  <li>• Streaming illimité 24h/24</li>
                  <li>• Compatible mobile, tablette, TV</li>
                  <li>• Qualité jusqu'à 4K/8K selon le plan</li>
                  <li>• Support client réactif</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-accent-400 mb-4">💡 Pourquoi choisir TerranoVision ?</h4>
                <ul className="space-y-2 text-white/80">
                  <li>• Plus de 2,674 chaînes premium</li>
                  <li>• Catalogue de films complet</li>
                  <li>• Interface ultra-moderne</li>
                  <li>• Pas de publicité intrusive</li>
                  <li>• Mises à jour régulières</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center px-6 pb-16">
          <p className="text-white/60 mb-4">
            Tous nos abonnements incluent un accès immédiat, sans engagement et avec possibilité 
            d'annulation à tout moment. Support client disponible 24h/24 et 7j/7 pour vous accompagner.
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-white/60 ml-2">Plus de 10,000 utilisateurs satisfaits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPageUpdated;
