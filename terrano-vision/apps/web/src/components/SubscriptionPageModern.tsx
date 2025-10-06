import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { PREMIUM_IMAGES, RECOMMENDED_IMAGES, getRandomImage } from '../constants/premiumImages';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  channels: number;
  features: string[];
  popular?: boolean;
  savings?: string;
  badge?: string;
}

const SubscriptionPageModern: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, updateSubscription } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(RECOMMENDED_IMAGES.SUBSCRIPTION_BACKGROUND);

  // Rotation automatique du background
  useEffect(() => {
    const backgrounds = [
      PREMIUM_IMAGES.HERO.HERO_MANAGER,
      PREMIUM_IMAGES.HERO.HERO_SUPERHERO,
      ...RECOMMENDED_IMAGES.CANAL_SHOWCASE.slice(0, 3)
    ];
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      setBackgroundImage(backgrounds[randomIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basique',
      price: 2000,
      channels: 500,
      features: [
        '500+ chaînes premium',
        'Qualité HD (720p)',
        'Support mobile & desktop',
        'Historique de visionnage',
        'Recherche avancée',
        'Support par email'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 12000,
      channels: 1500,
      popular: true,
      savings: 'Économisez 40%',
      badge: 'Plus populaire',
      features: [
        '1,500+ chaînes premium',
        'Qualité 4K & HDR',
        'Canal+, National Geographic',
        'Discovery, MTV, ESPN',
        'Téléchargement hors ligne',
        '3 appareils simultanés',
        'Support prioritaire 24/7',
        'Contenu exclusif'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 20000,
      channels: 2674,
      savings: 'Tout inclus',
      badge: 'Meilleure valeur',
      features: [
        '2,674 chaînes (catalogue complet)',
        'Qualité 8K & HDR10+',
        'Toutes les chaînes Canal+',
        'Sports premium en direct',
        'Documentaires 4K exclusifs',
        '5 appareils simultanés',
        'Support VIP dédié',
        'Accès anticipé nouveautés',
        'Contenu original exclusif'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulation du processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        
        updateSubscription({
          isActive: true,
          plan: planId as 'basic' | 'premium' | 'ultimate',
          planName: plan.name,
          expiryDate: expiryDate.toISOString(),
          price: plan.price
        });
        
        // Redirection vers l'accueil avec succès
        navigate('/', { state: { subscriptionSuccess: true } });
      }
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Ultra-Moderne avec Parallax */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-3000 ease-in-out transform scale-110"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: 'brightness(0.3) contrast(1.3) saturate(1.2)',
          }}
        />
        
        {/* Overlays Sophistiqués */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50" />
        
        {/* Particules Flottantes Premium */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
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
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Mesh Gradient Animé */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500 to-pink-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </button>
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="max-w-7xl mx-auto w-full">
            {/* Titre Principal */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-2 mb-6 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full backdrop-blur-md">
                <span className="text-yellow-400 font-bold text-sm">🎉 Offre de Lancement Spéciale</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight">
                Choisissez Votre Plan
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Accédez aux meilleures chaînes premium d'Afrique avec 
                <span className="text-yellow-400 font-bold"> Canal+</span>, 
                <span className="text-blue-400 font-bold"> National Geographic</span>, 
                <span className="text-green-400 font-bold"> Discovery</span> et 2,674 chaînes au total
              </p>

              {/* Badges de Confiance */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white text-sm">Sans engagement</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white text-sm">Annulation facile</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white text-sm">Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Plans d'Abonnement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    selectedPlan === plan.id ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Badge Populaire */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className={`px-4 py-1 rounded-full text-xs font-bold text-white ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                      }`}>
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Card Glassmorphism */}
                  <div className={`relative h-full p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                    selectedPlan === plan.id
                      ? 'bg-white/20 border-white/40 shadow-2xl shadow-blue-500/25'
                      : plan.popular
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/30 hover:border-blue-400/50'
                      : 'bg-white/10 border-white/20 hover:border-white/30'
                  }`}>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                      selectedPlan === plan.id ? 'opacity-100' : 'opacity-0'
                    } ${
                      plan.popular 
                        ? 'shadow-2xl shadow-blue-500/30' 
                        : 'shadow-2xl shadow-purple-500/30'
                    }`} />

                    <div className="relative z-10">
                      {/* Header du Plan */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        {plan.savings && (
                          <div className="text-sm text-yellow-400 font-medium mb-4">{plan.savings}</div>
                        )}
                        
                        <div className="mb-4">
                          <span className="text-4xl font-black text-white">{plan.price.toLocaleString()}</span>
                          <span className="text-lg text-gray-300 ml-2">XOF/mois</span>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {plan.channels.toLocaleString()} chaînes • {(plan.price / plan.channels).toFixed(1)} XOF/chaîne
                        </div>
                      </div>

                      {/* Fonctionnalités */}
                      <div className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-3 mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bouton d'Abonnement */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(plan.id);
                        }}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25'
                            : selectedPlan === plan.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                        }`}
                      >
                        {isProcessing && selectedPlan === plan.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Traitement...
                          </div>
                        ) : (
                          `S'abonner maintenant`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Moyens de Paiement */}
            <div className="text-center mt-16">
              <h3 className="text-xl font-bold text-white mb-6">Moyens de Paiement Acceptés</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-orange-400 text-2xl mr-2">📱</span>
                  <span className="text-white text-sm">Orange Money</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-yellow-400 text-2xl mr-2">📱</span>
                  <span className="text-white text-sm">MTN Mobile Money</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-blue-400 text-2xl mr-2">💳</span>
                  <span className="text-white text-sm">Wave</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-green-400 text-2xl mr-2">💳</span>
                  <span className="text-white text-sm">Visa/Mastercard</span>
                </div>
              </div>
            </div>

            {/* Footer Légal */}
            <div className="text-center mt-12 text-gray-400 text-sm max-w-2xl mx-auto">
              <p>
                En vous abonnant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité. 
                Annulation possible à tout moment. Aucun engagement de durée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPageModern;
