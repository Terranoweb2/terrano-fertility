
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Calendar, Thermometer, Heart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Simple dynamic wrapper for recharts
const StatisticsCharts = dynamic(() => import('./statistics-charts'), { 
  ssr: false, 
  loading: () => <div className="h-64 flex items-center justify-center">Chargement des graphiques...</div> 
});

interface StatisticsData {
  temperatureData: Array<{ date: string; temperature: number }>;
  cycleLengthData: Array<{ cycle: string; length: number }>;
  moodData: Array<{ mood: string; count: number }>;
  painData: Array<{ type: string; average: number }>;
  monthlyStats: {
    averageCycleLength: number;
    averageTemperature: number;
    totalSymptoms: number;
    regularCycles: number;
  };
}

export default function StatisticsClient() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (response.ok) {
        const statisticsData = await response.json();
        setData(statisticsData);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const moodColors = ['#FF9149', '#60B5FF', '#FF6363', '#80D8C3', '#A19AD3'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Statistiques et graphiques</h1>
                <p className="text-sm text-gray-600">Visualisez vos données de fertilité</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Cycle moyen</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {data?.monthlyStats?.averageCycleLength || 0} jours
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-700">Température moyenne</CardTitle>
              <Thermometer className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">
                {data?.monthlyStats?.averageTemperature?.toFixed(1) || 0}°C
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Symptômes enregistrés</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {data?.monthlyStats?.totalSymptoms || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Cycles réguliers</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {data?.monthlyStats?.regularCycles || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {/* Temperature Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-pink-600" />
                  <span>Courbe de température corporelle basale</span>
                </CardTitle>
                <CardDescription>
                  Évolution de votre température au fil du temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatisticsCharts 
                  type="line" 
                  data={data?.temperatureData || []}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Cycle Length Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Durée des cycles menstruels</span>
                </CardTitle>
                <CardDescription>
                  Variation de la longueur de vos cycles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StatisticsCharts 
                  type="bar" 
                  data={data?.cycleLengthData || []}
                />
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span>Répartition des humeurs</span>
                  </CardTitle>
                  <CardDescription>
                    Distribution de vos états d'humeur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatisticsCharts 
                    type="pie" 
                    data={data?.moodData || []}
                    colors={moodColors}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Pain Levels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    <span>Niveaux de douleur moyens</span>
                  </CardTitle>
                  <CardDescription>
                    Intensité moyenne par type de douleur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatisticsCharts 
                    type="horizontal-bar" 
                    data={data?.painData || []}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Insights personnalisés</span>
                </CardTitle>
                <CardDescription>
                  Analyse de vos données de fertilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Régularité du cycle</h4>
                    <p className="text-sm text-purple-700">
                      {(data?.monthlyStats?.regularCycles || 0) > 0 
                        ? "Vos cycles semblent réguliers. Continuez le suivi pour des prédictions précises."
                        : "Continuez à enregistrer vos données pour analyser la régularité de vos cycles."
                      }
                    </p>
                  </div>
                  
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-900 mb-2">Température basale</h4>
                    <p className="text-sm text-pink-700">
                      {(data?.temperatureData?.length || 0) > 10
                        ? "Vos données de température sont riches en informations pour identifier l'ovulation."
                        : "Enregistrez votre température quotidiennement pour des insights plus précis."
                      }
                    </p>
                  </div>
                  
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Suivi des symptômes</h4>
                    <p className="text-sm text-blue-700">
                      {(data?.monthlyStats?.totalSymptoms || 0) > 15
                        ? "Excellent suivi ! Vos données permettent une analyse complète."
                        : "Continuez à enregistrer vos symptômes quotidiens pour une meilleure analyse."
                      }
                    </p>
                  </div>
                  
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Recommandation</h4>
                    <p className="text-sm text-green-700">
                      Pour optimiser votre fertilité, maintenez un suivi régulier et consultez un professionnel si nécessaire.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
