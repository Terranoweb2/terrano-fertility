import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  Shield, 
  Star,
  Infinity,
  Play,
  Download,
  Users,
  Headphones,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  CreditCard,
  Globe
} from 'lucide-react';

interface PlanFeature {
  icon: React.ComponentType<any>;
  text: string;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  borderGradient: string;
  popular?: boolean;
  channels: string;
  quality: string;
  features: PlanFeature[];
  badge?: string;
  savings?: string;
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSubscription } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basique',
      price: 2000,
      period: 'mois',
      description: 'Parfait pour découvrir',
      icon: Play,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      borderGradient: 'from-slate-400 to-slate-600',
      channels: '15+',
      quality: 'HD',
      features: [
        { icon: Play, text: '15 chaînes premium' },
        { icon: Monitor, text: 'Qualité HD (1080p)' },
        { icon: Smartphone, text: 'Mobile & Desktop' },
        { icon: Wifi, text: 'Streaming fluide' },
        { icon: Users, text: '1 appareil simultané' }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 12000,
      period: 'mois',
      description: 'Le plus populaire',
      icon: Crown,
      gradient: 'from-blue-600 via-purple-600 to-indigo-700',
      borderGradient: 'from-blue-400 via-purple-400 to-indigo-400',
      popular: true,
      channels: '50+',
      quality: '4K',
      badge: 'Recommandé',
      savings: 'Économisez 40%',
      features: [
        { icon: Crown, text: '50+ chaînes premium', highlight: true },
        { icon: Sparkles, text: 'Qualité 4K Ultra HD', highlight: true },
        { icon: Star, text: 'Canal+, Nat Geo, Discovery' },
        { icon: Download, text: 'Téléchargement hors ligne' },
        { icon: Users, text: '3 appareils simultanés' },
        { icon: Headphones, text: 'Support prioritaire' }
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 20000,
      period: 'mois',
      description: 'Expérience complète',
      icon: Zap,
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      borderGradient: 'from-purple-400 via-pink-400 to-red-400',
      channels: '100+',
      quality: '8K',
      badge: 'VIP',
      features: [
        { icon: Infinity, text: '100+ chaînes premium', highlight: true },
        { icon: Zap, text: 'Qualité 8K & HDR', highlight: true },
        { icon: Crown, text: 'Toutes les chaînes Canal+' },
        { icon: Star, text: 'Contenu exclusif' },
        { icon: Infinity, text: 'Streaming illimité' },
        { icon: Shield, text: 'Support VIP 24/7' },
        { icon: Sparkles, text: 'Accès anticipé nouveautés' }
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    // Simulation du processus de paiement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const subscription = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      };
      
      setSubscription(subscription);
      navigate('/');
    }
    
    setIsProcessing(false);
  };

  // Animation des particules flottantes
  useEffect(() => {
    const particles = document.querySelectorAll('.floating-particle');
    particles.forEach((particle, index) => {
      const element = particle as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particules flottantes animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient overlay animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x" />

      {/* Header avec glassmorphism */}
      <div className="relative z-10 p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Retour</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                TerranoVision
              </h1>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section avec animations */}
      <div className="relative z-10 text-center py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-white/90 font-medium">Offre spéciale de lancement</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Choisissez votre
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              expérience
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Accédez aux meilleures chaînes premium avec 
            <span className="text-blue-400 font-semibold"> Canal+</span>,
            <span className="text-green-400 font-semibold"> National Geographic</span>,
            <span className="text-purple-400 font-semibold"> Discovery</span> et bien plus encore.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-white/60">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Activation instantanée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="w-5 h-5 text-blue-400" />
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans avec glassmorphism avancé */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transition-all duration-500 transform ${
                  hoveredPlan === plan.id ? 'scale-105 z-20' : ''
                } ${selectedPlan === plan.id ? 'scale-102 z-10' : ''}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${plan.borderGradient} rounded-3xl blur opacity-0 group-hover:opacity-75 transition-all duration-500`} />
                
                {/* Card principale */}
                <div className={`relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden ${
                  selectedPlan === plan.id ? 'ring-2 ring-blue-400/50' : ''
                } ${plan.popular ? 'lg:scale-110 lg:z-10' : ''}`}>
                  
                  {/* Badge populaire */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        ⭐ {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Badge savings */}
                  {plan.savings && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {plan.savings}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icône et nom */}
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-white/60">{plan.description}</p>
                    </div>

                    {/* Prix avec animation */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="text-white/60 font-medium">XOF</span>
                      </div>
                      <p className="text-white/60 mt-1">par {plan.period}</p>
                    </div>

                    {/* Stats rapides */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-2xl font-bold text-white">{plan.channels}</div>
                        <div className="text-xs text-white/60">Chaînes</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-2xl font-bold text-white">{plan.quality}</div>
                        <div className="text-xs text-white/60">Qualité</div>
                      </div>
                    </div>

                    {/* Fonctionnalités */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                            feature.highlight ? 'bg-white/10 border border-white/20' : ''
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            feature.highlight 
                              ? `bg-gradient-to-r ${plan.gradient}` 
                              : 'bg-white/10'
                          }`}>
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className={`text-sm ${
                            feature.highlight ? 'text-white font-medium' : 'text-white/80'
                          }`}>
                            {feature.text}
                          </span>
                          {feature.highlight && (
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bouton d'abonnement */}
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessing}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                        selectedPlan === plan.id
                          ? `bg-gradient-to-r ${plan.gradient} hover:shadow-2xl`
                          : 'bg-white/10 hover:bg-white/20 border border-white/20'
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Traitement...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>S'abonner maintenant</span>
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section de confiance avec glassmorphism */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Moyens de paiement acceptés</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'Mobile Money', icon: Smartphone, color: 'from-green-500 to-emerald-600' },
                  { name: 'Orange Money', icon: CreditCard, color: 'from-orange-500 to-red-600' },
                  { name: 'Wave', icon: Zap, color: 'from-blue-500 to-purple-600' },
                  { name: 'Cartes bancaires', icon: Lock, color: 'from-gray-500 to-gray-700' }
                ].map((payment, index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${payment.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <payment.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white/80 text-sm font-medium">{payment.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center text-white/60 space-y-2">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Paiement sécurisé SSL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Satisfaction garantie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Service mondial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SubscriptionPage;
