
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">FertiliCare</h1>
                <p className="text-sm text-gray-600">
                  Bonjour, {session?.user?.name || 'Utilisatrice'} 👋
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Votre tableau de bord de fertilité
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Suivez votre cycle, enregistrez vos symptômes et obtenez des insights personnalisés 
            pour optimiser votre santé reproductive
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-100 p-2 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <Calendar className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Calendrier menstruel</CardTitle>
                    <CardDescription>
                      Enregistrez vos règles et suivez votre cycle
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle période
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/symptoms">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Thermometer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Symptômes quotidiens</CardTitle>
                    <CardDescription>
                      Enregistrez température, humeur et autres signes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter symptômes
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/chat">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-colors">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Chatbot IA 
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        NOUVEAU
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Posez vos questions sur la fertilité et la grossesse
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discuter maintenant
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/pregnancy">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg group-hover:from-pink-600 group-hover:to-rose-600 transition-colors">
                    <Baby className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Suivi de Grossesse
                      <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs">
                        NOUVEAU
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Suivez votre grossesse semaine par semaine
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                  <Baby className="w-4 h-4 mr-2" />
                  Voir mon suivi
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/statistics">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                    <CardDescription>
                      Visualisez vos données et tendances
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Voir graphiques
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reminders">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Bell className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Rappels</CardTitle>
                    <CardDescription>
                      Gérez vos notifications personnalisées
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau rappel
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Éducation</CardTitle>
                    <CardDescription>
                      Apprenez sur la fertilité et votre corps
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lire articles
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Communauté</CardTitle>
                    <CardDescription>
                      Connectez-vous avec d'autres femmes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                  <Users className="w-4 h-4 mr-2" />
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
