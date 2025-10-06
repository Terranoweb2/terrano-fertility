import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Star, Zap, Crown, Gift, Shield, Clock, Users, QrCode, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PREMIUM_IMAGES, getRandomImage } from '../constants/premiumImages';

const SubscriptionPageWave: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

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

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  if (showPayment && selectedPlanData) {
    return (
      <div className="min-h-screen relative overflow-auto">
        {/* Background premium */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(1px)',
            }}
          />
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

        <div className="relative z-10 max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowPayment(false)}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Retour aux plans</span>
            </button>
          </div>

          {/* Paiement Wave */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
                Finaliser votre Abonnement
              </h1>
              <p className="text-white/80 text-lg">
                Plan sélectionné : <span className="text-primary-400 font-semibold">{selectedPlanData.name}</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Résumé de la commande */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Résumé de votre commande</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Plan {selectedPlanData.name}</span>
                    <span className="text-white font-medium">{selectedPlanData.price.toLocaleString()} XOF</span>
                  </div>
                  
                  {selectedPlanData.savings && (
                    <div className="flex justify-between items-center text-green-400">
                      <span>Économie</span>
                      <span>-{selectedPlanData.savings.toLocaleString()} XOF</span>
                    </div>
                  )}
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total à payer</span>
                      <span className="text-primary-400">{selectedPlanData.price.toLocaleString()} XOF</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Garanties incluses</span>
                  </div>
                  <ul className="text-green-200 text-sm space-y-1">
                    <li>• Activation immédiate</li>
                    <li>• Garantie 7 jours satisfait ou remboursé</li>
                    <li>• Support client 24/7</li>
                    <li>• Annulation facile à tout moment</li>
                  </ul>
                </div>
              </div>

              {/* Paiement Wave */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Paiement sécurisé avec Wave</h3>
                  
                  {/* Logo Wave */}
                  <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-2xl p-4 shadow-lg">
                    <img 
                      src="/images/payment/wavelogo.png" 
                      alt="Wave Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-white rounded-2xl p-4 shadow-lg">
                    <img 
                      src="/images/payment/WAVE.jpg" 
                      alt="QR Code Wave" 
                      className="w-48 h-48 object-contain mx-auto"
                    />
                  </div>
                  <p className="text-white/70 text-sm mt-4">
                    Scannez ce QR code avec votre application Wave
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <h4 className="text-blue-300 font-medium mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Instructions de paiement
                  </h4>
                  <ol className="text-blue-200 text-sm space-y-2">
                    <li>1. Ouvrez votre application Wave</li>
                    <li>2. Scannez le QR code ci-dessus</li>
                    <li>3. Confirmez le montant : <strong>{selectedPlanData.price.toLocaleString()} XOF</strong></li>
                    <li>4. Validez le paiement</li>
                    <li>5. Votre abonnement sera activé immédiatement</li>
                  </ol>
                </div>

                {/* Bouton de confirmation */}
                <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" />
                    J'ai effectué le paiement
                  </div>
                </button>

                <p className="text-white/60 text-xs text-center mt-4">
                  Après paiement, votre accès sera activé automatiquement dans les 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <button 
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-4 px-6 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  S'abonner avec Wave
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Wave uniquement */}
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              💳 Paiement Sécurisé avec Wave
            </h3>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-32 bg-white rounded-2xl p-4 shadow-lg">
                <img 
                  src="/images/payment/wavelogo.png" 
                  alt="Wave Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-white/80 text-lg mb-4">
                Paiement simple et sécurisé avec Wave
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-300">Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300">Activation instantanée</span>
                </div>
              </div>
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

export default SubscriptionPageWave;
