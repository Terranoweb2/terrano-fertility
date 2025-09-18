import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calendar, 
  Heart, 
  TrendingUp, 
  MessageCircle, 
  Droplets,
  Thermometer,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react'

const Dashboard = () => {
  const { user, apiCall } = useAuth()
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Récupérer la prédiction actuelle
      const predictionData = await apiCall('/predictions/current')
      setCurrentPrediction(predictionData)
      
      // Récupérer les insights IA
      const insightsData = await apiCall('/ai/insights')
      setInsights(insightsData.insights)
      
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFertilityStatusColor = (status) => {
    switch (status) {
      case 'ovulation':
        return 'bg-gradient-ovulation text-white'
      case 'fertile':
        return 'bg-gradient-fertility text-white'
      case 'approaching_fertile':
        return 'bg-yellow-500 text-white'
      case 'not_fertile':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getFertilityIcon = (status) => {
    switch (status) {
      case 'ovulation':
        return <Sun className="h-5 w-5" />
      case 'fertile':
        return <Heart className="h-5 w-5" />
      case 'approaching_fertile':
        return <TrendingUp className="h-5 w-5" />
      case 'not_fertile':
        return <Moon className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const fertilityStatus = currentPrediction?.fertility_status
  const cycleDay = currentPrediction?.cycle_day
  const prediction = currentPrediction?.current_prediction

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour {user?.first_name} ! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici votre suivi de fertilité aujourd'hui
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Fertility Status */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              {getFertilityIcon(fertilityStatus?.status)}
              <span>Statut de fertilité</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge 
                className={`${getFertilityStatusColor(fertilityStatus?.status)} px-3 py-1`}
              >
                {fertilityStatus?.message || 'Calcul en cours...'}
              </Badge>
              {fertilityStatus?.fertility_score && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score de fertilité</span>
                    <span className="font-medium">{fertilityStatus.fertility_score}%</span>
                  </div>
                  <Progress value={fertilityStatus.fertility_score} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cycle Day */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Jour du cycle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {cycleDay?.cycle_day || '?'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {cycleDay?.cycle_start ? 
                  `Cycle commencé le ${new Date(cycleDay.cycle_start).toLocaleDateString('fr-FR')}` :
                  'Aucun cycle actif'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Ovulation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Prochaine ovulation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {prediction?.ovulation_date ? (
                <>
                  <div className="text-lg font-semibold">
                    {new Date(prediction.ovulation_date).toLocaleDateString('fr-FR')}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dans {Math.ceil((new Date(prediction.ovulation_date) - new Date()) / (1000 * 60 * 60 * 24))} jours
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Calcul en cours...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fertile Window */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Fenêtre fertile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prediction?.fertile_window_start && prediction?.fertile_window_end ? (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Du:</span> {new Date(prediction.fertile_window_start).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Au:</span> {new Date(prediction.fertile_window_end).toLocaleDateString('fr-FR')}
                </div>
                <Badge variant="outline" className="mt-2">
                  {Math.ceil((new Date(prediction.fertile_window_end) - new Date(prediction.fertile_window_start)) / (1000 * 60 * 60 * 24)) + 1} jours
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">Calcul en cours...</p>
            )}
          </CardContent>
        </Card>

        {/* Confidence Level */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Précision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {prediction?.confidence_level ? Math.round(prediction.confidence_level * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Niveau de confiance
                </p>
              </div>
              {prediction?.confidence_level && (
                <Progress value={prediction.confidence_level * 100} className="h-2" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Thermometer className="h-4 w-4 mr-2" />
              Ajouter température
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Droplets className="h-4 w-4 mr-2" />
              Noter symptômes
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Parler à l'IA
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Conseils personnalisés de TerranoIA</span>
            </CardTitle>
            <CardDescription>
              Basés sur vos données de cycle et votre profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{insights}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

