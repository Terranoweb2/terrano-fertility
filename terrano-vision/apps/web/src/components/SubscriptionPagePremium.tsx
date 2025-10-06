import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { PREMIUM_IMAGES, RECOMMENDED_IMAGES } from '../constants/premiumImages';

const SubscriptionPagePremium: React.FC = () => {
  const navigate = useNavigate();
  const { updateSubscription } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const backgroundImages = [
    RECOMMENDED_IMAGES.SUBSCRIPTION_BACKGROUND,
    ...RECOMMENDED_IMAGES.CANAL_SHOWCASE.slice(0, 5),
    ...RECOMMENDED_IMAGES.CONTENT_CAROUSEL.slice(0, 3)
  ];

  // Rotation automatique des backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const plans = [
    {
      id: 'basic',
      name: 'Basique',
      price: '2,000',
      period: 'mois',
      channels: '15+',
      quality: 'HD',
      devices: '1',
      features: [
        '15+ chaînes premium',
        'Qualité HD (720p)',
        '1 appareil simultané',
        'Support par email',
        'Accès mobile et web'
      ],
      popular: false,
      color: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-500/30',
      bgImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[0]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '12,000',
      period: 'mois',
      channels: '50+',
      quality: '4K',
      devices: '3',
      features: [
        '50+ chaînes premium',
        'Qualité 4K Ultra HD',
        '3 appareils simultanés',
        'Canal+, National Geographic',
        'Discovery, MTV inclus',
        'Support prioritaire 24/7',
        'Téléchargement hors-ligne',
        'Accès anticipé nouveautés'
      ],
      popular: true,
      color: 'from-blue-600 to-purple-600',
      borderColor: 'border-blue-400/50',
      bgImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[1]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '20,000',
      period: 'mois',
      channels: '100+',
      quality: '8K',
      devices: '5',
      features: [
        '100+ chaînes premium',
        'Qualité 8K & HDR',
        '5 appareils simultanés',
        'Toutes les chaînes Canal+',
        'Contenu exclusif premium',
        'Support VIP dédié',
        'Téléchargement illimité',
        'Accès beta nouvelles fonctions',
        'Streaming multi-langues'
      ],
      popular: false,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-400/50',
      bgImage: RECOMMENDED_IMAGES.CANAL_SHOWCASE[2]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    // Simulation du processus de paiement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedPlanData = plans.find(p => p.id === planId);
    if (selectedPlanData) {
      updateSubscription({
        plan: planId as 'basic' | 'premium' | 'ultimate',
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        startDate: new Date().toISOString()
      });
      
      // Redirection vers l'accueil après succès
      navigate('/');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Premium avec Images */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-5000 ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImages[currentBgImage]})`,
            filter: 'brightness(0.3) contrast(1.3)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/70 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-transparent to-black/60" />
        
        {/* Particules Premium */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${3 + Math.random() * 6}px`,
                height: `${3 + Math.random() * 6}px`,
                background: `linear-gradient(45deg, 
                  ${['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'][Math.floor(Math.random() * 5)]}, 
                  ${['#1D4ED8', '#7C3AED', '#D97706', '#059669', '#DC2626'][Math.floor(Math.random() * 5)]})`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TerranoVision
                </h1>
                <p className="text-xs text-gray-400">Retour à l'accueil</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full">
                <span className="text-green-400 font-bold text-sm">✨ Offre spéciale de lancement</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            {/* Titre Principal */}
            <div className="mb-16">
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight animate-fade-in-up">
                Choisissez votre Abonnement
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Accédez aux meilleures chaînes premium avec 
                <span className="text-yellow-400 font-bold"> Canal+</span>, 
                <span className="text-blue-400 font-bold"> National Geographic</span>, 
                <span className="text-green-400 font-bold"> Discovery</span> et bien plus
              </p>

              {/* Badges de Confiance */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm font-medium">Sans engagement</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm font-medium">Annulation facile</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-white text-sm font-medium">Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Plans d'Abonnement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative group cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    plan.popular ? 'lg:-mt-8 lg:mb-8' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Badge Populaire */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-sm rounded-full shadow-lg">
                        ⭐ Plus populaire
                      </div>
                    </div>
                  )}

                  {/* Carte Plan */}
                  <div className={`relative h-full bg-white/5 backdrop-blur-xl border ${plan.borderColor} rounded-3xl overflow-hidden group-hover:bg-white/10 transition-all duration-500`}>
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${plan.bgImage})` }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-60`} />
                    </div>

                    {/* Contenu */}
                    <div className="relative z-10 p-8">
                      {/* Header Plan */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-black text-white">{plan.price}</span>
                          <span className="text-gray-400 ml-2">XOF/{plan.period}</span>
                        </div>
                        <div className="flex justify-center space-x-4 text-sm">
                          <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300">
                            {plan.channels} chaînes
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300">
                            {plan.quality}
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300">
                            {plan.devices} appareils
                          </span>
                        </div>
                      </div>

                      {/* Fonctionnalités */}
                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bouton d'Action */}
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isProcessing}
                        className={`w-full py-4 bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isProcessing && selectedPlan === plan.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Traitement...
                          </div>
                        ) : (
                          'S\'abonner maintenant'
                        )}
                      </button>

                      {/* Prix par chaîne */}
                      <div className="text-center mt-4">
                        <span className="text-xs text-gray-400">
                          Soit {(parseInt(plan.price.replace(',', '')) / parseInt(plan.channels.replace('+', ''))).toFixed(1)} XOF par chaîne
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section Moyens de Paiement */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8">💳 Moyens de Paiement Acceptés</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">OM</span>
                  </div>
                  <span className="text-white font-medium">Orange Money</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">MTN</span>
                  </div>
                  <span className="text-white font-medium">MTN Mobile</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">W</span>
                  </div>
                  <span className="text-white font-medium">Wave</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.63 0 4.658.58 5.504 1.686.897 1.173.663 2.017-.675 2.804l-.038.022c-.675.37-1.596.621-2.75.753 1.527.127 2.687.621 3.273 1.686.897 1.686.663 3.23-.675 4.776-.675.779-1.527 1.264-2.63 1.517l2.17 8.291a.641.641 0 0 1-.633.74H12.1a.641.641 0 0 1-.633-.74l-1.527-6.097H7.709l-1.266 6.097a.641.641 0 0 1-.633.74z"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium">Cartes Bancaires</span>
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-400/30 rounded-full mb-8">
                <svg className="w-6 h-6 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-bold">Garantie satisfait ou remboursé 7 jours</span>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                Tous nos abonnements incluent un accès immédiat, sans engagement et avec possibilité d'annulation à tout moment. 
                Support client disponible 24h/24 et 7j/7 pour vous accompagner.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400 text-sm">
              © 2024 TerranoVision. Streaming premium pour l'Afrique. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SubscriptionPagePremium;
