'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, User, Bell, Lock, Globe, Moon, Sun, Mail, Save, Trash2,
  Camera, Upload, Download, Shield, Calendar, Heart, MapPin, Languages
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SettingsClient() {
  const { data: session, update } = useSession();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ')[1] || '',
    email: session?.user?.email || '',
    dateOfBirth: '',
    averageCycleLength: '28',
    averagePeriodLength: '5',
    language: 'fr',
    country: '',
  });

  const [notifications, setNotifications] = useState({
    periodReminders: true,
    fertileWindowAlerts: true,
    symptomReminders: false,
    educationalContent: true,
    emailNotifications: false,
    pushNotifications: true,
    reminderTime: '09:00',
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    anonymousUsage: true,
    marketingEmails: false,
  });

  useEffect(() => {
    fetchProfileImage();
    fetchUserPreferences();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const response = await fetch('/api/profile/image');
      if (response.ok) {
        const data = await response.json();
        setProfileImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/profile/preferences');
      if (response.ok) {
        const data = await response.json();
        if (data.notifications) {
          setNotifications({ ...notifications, ...data.notifications });
        }
        if (data.privacy) {
          setPrivacy({ ...privacy, ...data.privacy });
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImageUrl(data.imageUrl);
        await update();
        toast.success('Photo de profil mise à jour !');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm('Voulez-vous vraiment supprimer votre photo de profil ?')) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/image', {
        method: 'DELETE',
      });

      if (response.ok) {
        setProfileImageUrl(null);
        await update();
        toast.success('Photo de profil supprimée');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await update();
        toast.success('Profil mis à jour avec succès !');
      } else {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications, privacy }),
      });

      if (response.ok) {
        toast.success('Préférences mises à jour !');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des préférences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `terrano-fertility-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Données exportées avec succès !');
      } else {
        toast.error('Erreur lors de l\'exportation');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'exportation des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mot de passe modifié avec succès !');
        setIsPasswordDialogOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return session?.user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-8 sm:h-10">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Paramètres</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 h-auto p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Profil</span>
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Santé</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Notifs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Confidentialité</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2 sm:py-2.5"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Photo de profil</CardTitle>
                <CardDescription className="text-sm">
                  Personnalisez votre photo de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                    <AvatarImage src={profileImageUrl || undefined} />
                    <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Changer la photo
                      </Button>
                      {profileImageUrl && (
                        <Button
                          variant="outline"
                          onClick={handleDeleteImage}
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                      JPG, PNG ou GIF. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Informations personnelles</CardTitle>
                <CardDescription className="text-sm">
                  Gérez vos informations de compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base" htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    L'adresse email ne peut pas être modifiée
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="language">
                      <Languages className="w-4 h-4 inline mr-1" />
                      Langue
                    </Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="country">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Pays
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="BE">Belgique</SelectItem>
                        <SelectItem value="CH">Suisse</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="US">États-Unis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Informations de santé</CardTitle>
                <CardDescription className="text-sm">
                  Paramètres liés à votre cycle et fertilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base" htmlFor="dateOfBirth">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de naissance
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="cycleLength">Durée moyenne du cycle (jours)</Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      min="21"
                      max="35"
                      value={formData.averageCycleLength}
                      onChange={(e) => setFormData({ ...formData, averageCycleLength: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Généralement entre 21 et 35 jours
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base" htmlFor="periodLength">Durée moyenne des règles (jours)</Label>
                    <Input
                      id="periodLength"
                      type="number"
                      min="2"
                      max="7"
                      value={formData.averagePeriodLength}
                      onChange={(e) => setFormData({ ...formData, averagePeriodLength: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Généralement entre 2 et 7 jours
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Préférences de notifications</CardTitle>
                <CardDescription className="text-sm">
                  Gérez comment vous souhaitez être notifiée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Rappels de période</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Recevez des notifications avant vos règles
                    </p>
                  </div>
                  <Switch
                    checked={notifications.periodReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, periodReminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Alertes de fenêtre fertile</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Notifications pendant votre période fertile
                    </p>
                  </div>
                  <Switch
                    checked={notifications.fertileWindowAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, fertileWindowAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Rappels de symptômes</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Rappels quotidiens pour enregistrer vos symptômes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.symptomReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, symptomReminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Contenu éducatif</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Articles et conseils sur la fertilité
                    </p>
                  </div>
                  <Switch
                    checked={notifications.educationalContent}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, educationalContent: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Notifications par email</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Recevez des emails pour les notifications importantes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base" htmlFor="reminderTime">Heure des rappels quotidiens</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={notifications.reminderTime}
                    onChange={(e) => setNotifications({ ...notifications, reminderTime: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Confidentialité des données</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Contrôlez comment vos données sont utilisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Partage de données</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Autoriser le partage anonyme des données pour la recherche
                    </p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, dataSharing: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Statistiques anonymes</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Aider à améliorer l'application avec des statistiques anonymes
                    </p>
                  </div>
                  <Switch
                    checked={privacy.anonymousUsage}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, anonymousUsage: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Emails marketing</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Recevoir des offres et actualités par email
                    </p>
                  </div>
                  <Switch
                    checked={privacy.marketingEmails}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, marketingEmails: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium text-sm sm:text-base">Exporter vos données</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Téléchargez une copie complète de toutes vos données
                  </p>
                  <Button 
                    onClick={handleExportData}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger mes données
                  </Button>
                </div>

                <Button 
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Apparence</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <Label className="text-sm sm:text-base">Mode sombre</Label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Activer le thème sombre
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                    <Moon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Sécurité du compte</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Gérez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Lock className="w-4 h-4 mr-2" />
                      Changer le mot de passe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Changer le mot de passe</DialogTitle>
                      <DialogDescription>
                        Entrez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base" htmlFor="current-password">
                          Mot de passe actuel
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Entrez votre mot de passe actuel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base" htmlFor="new-password">
                          Nouveau mot de passe
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Minimum 6 caractères"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm sm:text-base" htmlFor="confirm-password">
                          Confirmer le nouveau mot de passe
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirmez votre mot de passe"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsPasswordDialogOpen(false);
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          });
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      >
                        {isLoading ? 'Modification...' : 'Modifier'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm sm:text-base font-medium text-red-600">Zone dangereuse</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Supprimer définitivement votre compte et toutes vos données
                  </p>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                        toast.error('Fonctionnalité de suppression de compte à venir');
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
