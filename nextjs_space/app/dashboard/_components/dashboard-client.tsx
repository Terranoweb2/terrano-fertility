
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Calendar, 
  Thermometer, 
  Bell, 
  BookOpen, 
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Users,
  Baby,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DashboardStats {
  currentCycle: number | null;
  nextPeriodDays: number | null;
  fertileWindow: boolean;
  totalSymptoms: number;
  activeReminders: number;
}

export default function DashboardClient() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    currentCycle: null,
    nextPeriodDays: null,
    fertileWindow: false,
    totalSymptoms: 0,
    activeReminders: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                <img src="/logo.png" alt="Terrano Fertility" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-semibold text-gray-900">Terrano Fertility</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                  Bonjour, {session?.user?.name || 'Utilisatrice'} 👋
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Votre tableau de bord de fertilité
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Suivez votre cycle, enregistrez vos symptômes et obtenez des insights personnalisés 
            pour optimiser votre santé reproductive
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">Cycle actuel</CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">
                {isLoading ? '...' : (stats.currentCycle ? `Jour ${stats.currentCycle}` : 'N/A')}
              </div>
              <p className="text-xs text-pink-600 mt-1">
                {stats.fertileWindow ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Période fertile
                  </Badge>
                ) : 'Phase normale'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Prochaines règles</CardTitle>
              <Heart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {isLoading ? '...' : (stats.nextPeriodDays ? `${stats.nextPeriodDays} jours` : 'N/A')}
              </div>
              <p className="text-xs text-purple-600 mt-1">Estimation basée sur vos cycles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Symptômes</CardTitle>
              <Thermometer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {isLoading ? '...' : stats.totalSymptoms}
              </div>
              <p className="text-xs text-blue-600 mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Rappels actifs</CardTitle>
              <Bell className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {isLoading ? '...' : stats.activeReminders}
              </div>
              <p className="text-xs text-orange-600 mt-1">Notifications programmées</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
        >
          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-pink-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-pink-200 transition-colors flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Calendrier menstruel</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Enregistrez vos règles et suivez votre cycle
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-sm sm:text-base h-9 sm:h-10">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Nouvelle période
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/symptoms">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                    <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Symptômes quotidiens</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Enregistrez température, humeur et autres signes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base h-9 sm:h-10">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Ajouter symptômes
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/chat">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-colors flex-shrink-0">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span>Chatbot IA</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs px-1 sm:px-2 py-0">
                        NOUVEAU
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Posez vos questions sur la fertilité et la grossesse
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base h-9 sm:h-10">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Discuter maintenant
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/pregnancy">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-1.5 sm:p-2 rounded-lg group-hover:from-pink-600 group-hover:to-rose-600 transition-colors flex-shrink-0">
                    <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span>Suivi de Grossesse</span>
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-[10px] sm:text-xs px-1 sm:px-2 py-0">
                        NOUVEAU
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Suivez votre grossesse semaine par semaine
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm sm:text-base h-9 sm:h-10">
                  <Baby className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Voir mon suivi
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/statistics">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-purple-200 transition-colors flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Statistiques</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Visualisez vos données et tendances
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-sm sm:text-base h-9 sm:h-10">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Voir graphiques
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reminders">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-orange-200 transition-colors flex-shrink-0">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Rappels</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Gérez vos notifications personnalisées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-sm sm:text-base h-9 sm:h-10">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Nouveau rappel
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-green-200 transition-colors flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Éducation</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Apprenez sur la fertilité et votre corps
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-sm sm:text-base h-9 sm:h-10">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Lire articles
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">Communauté</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                      Connectez-vous avec d'autres femmes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-sm sm:text-base h-9 sm:h-10">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Rejoindre
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
