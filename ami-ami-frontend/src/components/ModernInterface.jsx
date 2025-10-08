import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Zap,
  Star,
  Crown,
  Flame
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function ModernInterface({ children }) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Modern Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo avec animation */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                  <Sparkles size={20} className="text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-ping" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ami-Ami
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown size={12} className="mr-1" />
                Premium
              </Badge>
            </div>

            {/* Search Bar Moderne */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative group">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Rechercher avec l'IA..."
                  className="pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 rounded-full focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles size={16} className="text-purple-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              <Button variant="ghost" size="sm" className="relative">
                <Bell size={18} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </Button>

              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 hover:ring-blue-500/50 transition-all cursor-pointer">
                <AvatarImage src={user?.profile_picture} alt={user?.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 relative z-10" ref={containerRef}>
        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Amis', value: '1.2k', color: 'from-blue-500 to-cyan-500', trend: '+12%' },
              { icon: MessageCircle, label: 'Messages', value: '847', color: 'from-green-500 to-emerald-500', trend: '+8%' },
              { icon: Heart, label: 'J\'aime', value: '3.4k', color: 'from-pink-500 to-rose-500', trend: '+24%' },
              { icon: TrendingUp, label: 'Engagement', value: '94%', color: 'from-purple-500 to-violet-500', trend: '+5%' }
            ].map((stat, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-xs text-green-500">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} transform group-hover:rotate-12 transition-transform duration-300`}>
                      <stat.icon size={20} className="text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Features Showcase */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown size={24} className="text-yellow-400" />
                    <h2 className="text-2xl font-bold">Fonctionnalités Premium</h2>
                  </div>
                  <p className="text-white/80 mb-4">
                    Découvrez les capacités avancées d'Ami-Ami avec l'IA intégrée
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Sparkles, text: 'Suggestions IA' },
                      { icon: Zap, text: 'Réponses instantanées' },
                      { icon: Star, text: 'Contenu personnalisé' },
                      { icon: Flame, text: 'Tendances en temps réel' }
                    ].map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors"
                      >
                        <feature.icon size={12} className="mr-1" />
                        {feature.text}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Sparkles size={48} className="text-yellow-400 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col space-y-3">
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <MessageCircle size={24} />
            </Button>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <Heart size={24} />
            </Button>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <Share2 size={24} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>

        {/* Particle Effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
