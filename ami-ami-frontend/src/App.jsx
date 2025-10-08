import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  Bell, 
  User, 
  Settings,
  BarChart3,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';

// Import des composants
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Navbar } from './components/Navbar';
import { Feed } from './components/Feed';
import CreatePost from './components/CreatePost';
import EnhancedPostCard from './components/EnhancedPostCard';
import { Friends } from './components/Friends';
import Messages from './components/Messages';
import Groups from './components/Groups';
import AIEnhancedGroups from './components/AIEnhancedGroups';
import AdvancedSearch from './components/AdvancedSearch';
import RealTimeNotifications from './components/RealTimeNotifications';
import { Profile } from './components/Profile';
import ModernInterface from './components/ModernInterface';
import AdvancedDashboard from './components/AdvancedDashboard';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(true);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      // Simuler le chargement des posts
      const mockPosts = [
        {
          id: 1,
          content: "Découvrez les nouvelles fonctionnalités IA d'Ami-Ami ! 🚀",
          author: { username: user?.username, profile_picture: user?.profile_picture },
          timestamp: new Date().toISOString(),
          reactions_count: 24,
          comments_count: 8,
          privacy: 'public',
          post_type: 'text'
        }
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ami-Ami</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ami-Ami
              </h1>
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown size={12} className="mr-1" />
                Premium
              </Badge>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              Le réseau social nouvelle génération avec IA intégrée
            </p>
            <div className="flex justify-center space-x-2 mb-6">
              {[
                { icon: Sparkles, text: 'IA Avancée' },
                { icon: Zap, text: 'Temps Réel' },
                { icon: Users, text: 'Communautés' },
                { icon: MessageCircle, text: 'Messagerie' }
              ].map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-white/50 backdrop-blur-sm"
                >
                  <feature.icon size={12} className="mr-1" />
                  {feature.text}
                </Badge>
              ))}
            </div>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <ModernInterface>
      <div className="max-w-7xl mx-auto">
        {/* Navigation principale */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm border border-gray-200/50">
              <TabsTrigger value="home" className="flex items-center space-x-2">
                <Home size={16} />
                <span className="hidden sm:inline">Accueil</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Search size={16} />
                <span className="hidden sm:inline">Recherche</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center space-x-2">
                <Users size={16} />
                <span className="hidden sm:inline">Amis</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center space-x-2">
                <Users size={16} />
                <span className="hidden sm:inline">Groupes</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User size={16} />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <div className="mt-6">
              <TabsContent value="home" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <CreatePost onPostCreated={handlePostCreated} />
                    <div className="space-y-4">
                      {posts.map(post => (
                        <EnhancedPostCard 
                          key={post.id} 
                          post={post} 
                          onPostUpdate={loadPosts}
                        />
                      ))}
                    </div>
                    <Feed />
                  </div>
                  <div className="space-y-6">
                    <RealTimeNotifications />
                    <Friends />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="search">
                <AdvancedSearch />
              </TabsContent>

              <TabsContent value="friends">
                <Friends />
              </TabsContent>

              <TabsContent value="groups">
                <AIEnhancedGroups />
              </TabsContent>

              <TabsContent value="messages">
                <Messages />
              </TabsContent>

              <TabsContent value="analytics">
                <AdvancedDashboard />
              </TabsContent>

              <TabsContent value="profile">
                <Profile />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Fonctionnalités Premium */}
        {showPremiumFeatures && (
          <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 z-40">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Crown size={20} className="text-yellow-400" />
                  <span className="font-semibold">Ami-Ami Premium</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPremiumFeatures(false)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-white/90 mb-3">
                Profitez de toutes les fonctionnalités IA avancées !
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="bg-white text-purple-600 hover:bg-white/90 flex-1"
                >
                  <Sparkles size={14} className="mr-1" />
                  Découvrir
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernInterface>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
