import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Shield,
  Settings,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    average_cycle_length: 28,
    average_period_length: 5
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        date_of_birth: user.date_of_birth || '',
        average_cycle_length: user.average_cycle_length || 28,
        average_period_length: user.average_period_length || 5
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await updateProfile(profileData)
      
      if (result.success) {
        setMessage('Profil mis à jour avec succès !')
      } else {
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const getMembershipDuration = () => {
    if (!user?.created_at) return null
    const created = new Date(user.created_at)
    const now = new Date()
    const diffTime = Math.abs(now - created)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} mois`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} an${years > 1 ? 's' : ''}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <User className="h-8 w-8 text-primary" />
            <span>Mon Profil</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Résumé du profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-fertility rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-semibold text-lg">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Âge</span>
                <span className="text-sm font-medium">
                  {calculateAge(user?.date_of_birth) || 'Non renseigné'} ans
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Membre depuis</span>
                <span className="text-sm font-medium">
                  {getMembershipDuration() || 'Nouveau'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cycle moyen</span>
                <Badge variant="outline">
                  {user?.average_cycle_length || 28} jours
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Règles moyennes</span>
                <Badge variant="outline">
                  {user?.average_period_length || 5} jours
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Informations personnelles</span>
            </CardTitle>
            <CardDescription>
              Mettez à jour vos informations pour des conseils plus personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  required
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié pour des raisons de sécurité
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date de naissance</span>
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) => setProfileData({...profileData, date_of_birth: e.target.value})}
                />
              </div>

              {/* Cycle Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Paramètres de cycle</span>
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cycle_length">Durée moyenne du cycle (jours)</Label>
                    <Input
                      id="cycle_length"
                      type="number"
                      min="21"
                      max="40"
                      value={profileData.average_cycle_length}
                      onChange={(e) => setProfileData({...profileData, average_cycle_length: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Entre 21 et 40 jours (moyenne: 28 jours)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="period_length">Durée moyenne des règles (jours)</Label>
                    <Input
                      id="period_length"
                      type="number"
                      min="2"
                      max="10"
                      value={profileData.average_period_length}
                      onChange={(e) => setProfileData({...profileData, average_period_length: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Entre 2 et 10 jours (moyenne: 5 jours)
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('succès') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Sécurité et confidentialité</span>
          </CardTitle>
          <CardDescription>
            Vos données sont protégées et chiffrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Données chiffrées</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes vos données sont sécurisées
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Sauvegarde automatique</h3>
                <p className="text-sm text-muted-foreground">
                  Vos données sont sauvegardées en temps réel
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">IA personnalisée</h3>
                <p className="text-sm text-muted-foreground">
                  Conseils basés uniquement sur vos données
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile

