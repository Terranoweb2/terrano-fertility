import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Eye, 
  Clock, 
  Target,
  Zap,
  Star,
  Award,
  Calendar,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../lib/api';

export default function AdvancedDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Données simulées pour la démonstration
  const engagementData = [
    { name: 'Lun', likes: 45, comments: 12, shares: 8, views: 234 },
    { name: 'Mar', likes: 52, comments: 18, shares: 12, views: 287 },
    { name: 'Mer', likes: 38, comments: 9, shares: 6, views: 198 },
    { name: 'Jeu', likes: 67, comments: 24, shares: 15, views: 345 },
    { name: 'Ven', likes: 89, comments: 31, shares: 22, views: 456 },
    { name: 'Sam', likes: 76, comments: 28, shares: 19, views: 398 },
    { name: 'Dim', likes: 54, comments: 16, shares: 11, views: 267 }
  ];

  const audienceData = [
    { name: '18-24', value: 35, color: '#3b82f6' },
    { name: '25-34', value: 28, color: '#8b5cf6' },
    { name: '35-44', value: 22, color: '#ec4899' },
    { name: '45-54', value: 10, color: '#10b981' },
    { name: '55+', value: 5, color: '#f59e0b' }
  ];

  const contentPerformance = [
    { type: 'Photos', posts: 45, engagement: 89, reach: 2340 },
    { type: 'Texte', posts: 67, engagement: 72, reach: 1890 },
    { type: 'Vidéos', posts: 23, engagement: 156, reach: 3450 },
    { type: 'Liens', posts: 12, engagement: 34, reach: 890 }
  ];

  const friendsGrowth = [
    { month: 'Jan', friends: 120, active: 89 },
    { month: 'Fév', friends: 145, active: 102 },
    { month: 'Mar', friends: 167, active: 118 },
    { month: 'Avr', friends: 189, active: 134 },
    { month: 'Mai', friends: 234, active: 167 },
    { month: 'Jun', friends: 267, active: 189 }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics({
        totalPosts: 156,
        totalLikes: 2847,
        totalComments: 456,
        totalShares: 189,
        totalViews: 12456,
        engagementRate: 8.7,
        reachGrowth: 23.5,
        activeFollowers: 189
      });
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const StatCard = ({ icon: Icon, title, value, change, color, trend }) => (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(value)}</p>
            {change && (
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className={`mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {change}% vs période précédente
                </span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-full bg-gradient-to-r ${color} transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableau de Bord Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analysez vos performances et votre engagement sur Ami-Ami
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Heart}
          title="Total J'aime"
          value={analytics?.totalLikes || 0}
          change={23.5}
          trend="up"
          color="from-pink-500 to-rose-500"
        />
        <StatCard
          icon={MessageCircle}
          title="Commentaires"
          value={analytics?.totalComments || 0}
          change={12.8}
          trend="up"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Share2}
          title="Partages"
          value={analytics?.totalShares || 0}
          change={8.2}
          trend="up"
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Eye}
          title="Vues"
          value={analytics?.totalViews || 0}
          change={15.7}
          trend="up"
          color="from-purple-500 to-violet-500"
        />
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Engagement au fil du temps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorLikes)"
                  name="J'aime"
                />
                <Area
                  type="monotone"
                  dataKey="comments"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorComments)"
                  name="Commentaires"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon size={20} />
              <span>Audience par âge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Activity size={16} />
            <span>Contenu</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users size={16} />
            <span>Amis</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Target size={16} />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Zap size={16} />
            <span>Insights IA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance par type de contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{item.type[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{item.type}</h3>
                        <p className="text-sm text-gray-600">{item.posts} publications</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-bold">{item.engagement}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Portée</p>
                          <p className="font-bold">{formatNumber(item.reach)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Croissance des amis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={friendsGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="friends" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Total amis"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Amis actifs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award size={20} className="text-yellow-500" />
                  <span>Score d'engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">8.7/10</div>
                  <p className="text-sm text-gray-600">Excellent engagement</p>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock size={20} className="text-blue-500" />
                  <span>Meilleur moment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-2">18h-20h</div>
                  <p className="text-sm text-gray-600">Pic d'activité</p>
                  <Badge variant="secondary" className="mt-2">Vendredi soir</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star size={20} className="text-purple-500" />
                  <span>Post populaire</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-2">156</div>
                  <p className="text-sm text-gray-600">J'aime sur votre dernier post</p>
                  <Badge variant="secondary" className="mt-2">+45% vs moyenne</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap size={20} className="text-yellow-500" />
                <span>Insights générés par IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'Recommandation',
                    title: 'Optimisez vos horaires de publication',
                    description: 'Vos posts entre 18h-20h obtiennent 45% plus d\'engagement. Planifiez plus de contenu à ces heures.',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    type: 'Tendance',
                    title: 'Contenu vidéo en hausse',
                    description: 'Vos vidéos génèrent 2.3x plus d\'engagement que les photos. Considérez créer plus de contenu vidéo.',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    type: 'Opportunité',
                    title: 'Audience jeune très engagée',
                    description: 'Les 18-24 ans représentent 35% de votre audience et sont très actifs. Adaptez votre contenu à cette tranche.',
                    color: 'from-purple-500 to-pink-500'
                  }
                ].map((insight, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${insight.color}`}>
                        <Zap size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{insight.type}</Badge>
                        </div>
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
