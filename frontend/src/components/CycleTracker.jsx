import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calendar, 
  Plus, 
  Thermometer, 
  Droplets, 
  Heart, 
  Smile,
  Frown,
  Meh,
  Save,
  TrendingUp
} from 'lucide-react'

const CycleTracker = () => {
  const { apiCall } = useAuth()
  const [cycles, setCycles] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [currentData, setCurrentData] = useState({
    temperature: '',
    cervical_mucus: '',
    mood: '',
    symptoms: [],
    notes: '',
    flow_intensity: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const moodOptions = [
    { value: 'happy', label: 'Joyeuse', icon: Smile, color: 'text-green-500' },
    { value: 'normal', label: 'Normale', icon: Meh, color: 'text-blue-500' },
    { value: 'sad', label: 'Triste', icon: Frown, color: 'text-gray-500' },
    { value: 'anxious', label: 'Anxieuse', icon: Heart, color: 'text-yellow-500' },
    { value: 'irritable', label: 'Irritable', icon: TrendingUp, color: 'text-red-500' }
  ]

  const mucusOptions = [
    { value: 'dry', label: 'Sèche' },
    { value: 'sticky', label: 'Collante' },
    { value: 'creamy', label: 'Crémeuse' },
    { value: 'watery', label: 'Aqueuse' },
    { value: 'egg_white', label: 'Blanc d\'œuf' }
  ]

  const flowOptions = [
    { value: 'none', label: 'Aucun' },
    { value: 'light', label: 'Léger' },
    { value: 'medium', label: 'Moyen' },
    { value: 'heavy', label: 'Abondant' }
  ]

  const symptomsList = [
    'Crampes', 'Ballonnements', 'Sensibilité des seins', 'Maux de tête',
    'Fatigue', 'Nausées', 'Acné', 'Changements d\'appétit',
    'Troubles du sommeil', 'Douleurs lombaires'
  ]

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchDailyDataForDate(selectedDate)
  }, [selectedDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [cyclesData, dailyDataResponse] = await Promise.all([
        apiCall('/cycles'),
        apiCall('/daily-data?limit=30')
      ])
      
      setCycles(cyclesData.cycles || [])
      setDailyData(dailyDataResponse.daily_data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDailyDataForDate = async (date) => {
    try {
      const response = await apiCall(`/daily-data/date/${date}`)
      if (response.daily_data) {
        setCurrentData({
          temperature: response.daily_data.temperature || '',
          cervical_mucus: response.daily_data.cervical_mucus || '',
          mood: response.daily_data.mood || '',
          symptoms: response.daily_data.symptoms ? JSON.parse(response.daily_data.symptoms) : [],
          notes: response.daily_data.notes || '',
          flow_intensity: response.daily_data.flow_intensity || ''
        })
      } else {
        // Réinitialiser pour une nouvelle date
        setCurrentData({
          temperature: '',
          cervical_mucus: '',
          mood: '',
          symptoms: [],
          notes: '',
          flow_intensity: ''
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données quotidiennes:', error)
    }
  }

  const handleSaveDailyData = async () => {
    try {
      setSaving(true)
      await apiCall('/daily-data', {
        method: 'POST',
        body: JSON.stringify({
          date: selectedDate,
          ...currentData,
          temperature: currentData.temperature ? parseFloat(currentData.temperature) : null
        })
      })
      
      // Actualiser les données
      await fetchData()
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSymptomToggle = (symptom) => {
    setCurrentData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const startNewCycle = async () => {
    try {
      await apiCall('/cycles', {
        method: 'POST',
        body: JSON.stringify({
          start_date: selectedDate,
          period_length: 5
        })
      })
      
      // Actualiser les données
      await fetchData()
      
    } catch (error) {
      console.error('Erreur lors de la création du cycle:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Suivi de cycle</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suivi de cycle</h1>
          <p className="text-muted-foreground mt-1">
            Enregistrez vos données quotidiennes pour un suivi précis
          </p>
        </div>
        <Button onClick={startNewCycle} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau cycle</span>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Date Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Date sélectionnée</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
            <div className="mt-4 text-sm text-muted-foreground">
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Data Entry */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Données du jour</CardTitle>
            <CardDescription>
              Enregistrez vos observations pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temperature */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span>Température basale (°C)</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                min="35"
                max="42"
                placeholder="36.5"
                value={currentData.temperature}
                onChange={(e) => setCurrentData({...currentData, temperature: e.target.value})}
              />
            </div>

            {/* Cervical Mucus */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Droplets className="h-4 w-4" />
                <span>Glaire cervicale</span>
              </Label>
              <Select
                value={currentData.cervical_mucus}
                onValueChange={(value) => setCurrentData({...currentData, cervical_mucus: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  {mucusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Flow Intensity */}
            <div className="space-y-2">
              <Label>Intensité du flux</Label>
              <Select
                value={currentData.flow_intensity}
                onValueChange={(value) => setCurrentData({...currentData, flow_intensity: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez l'intensité" />
                </SelectTrigger>
                <SelectContent>
                  {flowOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label>Humeur</Label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map(mood => {
                  const Icon = mood.icon
                  const isSelected = currentData.mood === mood.value
                  return (
                    <Button
                      key={mood.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentData({...currentData, mood: mood.value})}
                      className="flex flex-col items-center space-y-1 h-auto py-3"
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? '' : mood.color}`} />
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label>Symptômes</Label>
              <div className="grid grid-cols-2 gap-2">
                {symptomsList.map(symptom => (
                  <Button
                    key={symptom}
                    variant={currentData.symptoms.includes(symptom) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSymptomToggle(symptom)}
                    className="justify-start"
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes personnelles</Label>
              <Textarea
                placeholder="Ajoutez vos observations..."
                value={currentData.notes}
                onChange={(e) => setCurrentData({...currentData, notes: e.target.value})}
                rows={3}
              />
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSaveDailyData} 
              disabled={saving}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder les données'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>Cycles récents</CardTitle>
          <CardDescription>
            Historique de vos derniers cycles menstruels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cycles.length > 0 ? (
            <div className="space-y-3">
              {cycles.slice(0, 5).map(cycle => (
                <div key={cycle.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      Cycle du {new Date(cycle.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cycle.end_date ? (
                        <>
                          Terminé le {new Date(cycle.end_date).toLocaleDateString('fr-FR')} 
                          • Durée: {cycle.cycle_length} jours
                        </>
                      ) : (
                        'Cycle en cours'
                      )}
                    </div>
                  </div>
                  <Badge variant={cycle.end_date ? "secondary" : "default"}>
                    {cycle.end_date ? 'Terminé' : 'En cours'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun cycle enregistré</p>
              <p className="text-sm">Commencez par créer votre premier cycle</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CycleTracker

