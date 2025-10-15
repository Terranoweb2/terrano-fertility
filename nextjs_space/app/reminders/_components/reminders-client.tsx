
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Bell, 
  Plus, 
  Clock, 
  Calendar,
  Thermometer,
  Heart,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: string;
  scheduledDate: string;
  isActive: boolean;
  isRecurring: boolean;
  recurringType?: string;
}

interface ReminderFormData {
  title: string;
  description: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  isRecurring: boolean;
  recurringType: string;
}

export default function RemindersClient() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    description: '',
    type: '',
    scheduledDate: '',
    scheduledTime: '',
    isRecurring: false,
    recurringType: '',
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Erreur lors du chargement des rappels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scheduledDate: scheduledDateTime.toISOString(),
        }),
      });

      if (response.ok) {
        toast.success('Rappel créé avec succès !');
        setFormData({
          title: '',
          description: '',
          type: '',
          scheduledDate: '',
          scheduledTime: '',
          isRecurring: false,
          recurringType: '',
        });
        setShowForm(false);
        fetchReminders();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReminder = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(isActive ? 'Rappel désactivé' : 'Rappel activé');
        fetchReminders();
      }
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Êtes-vous sûre de vouloir supprimer ce rappel ?')) return;

    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Rappel supprimé');
        fetchReminders();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'period':
        return <Heart className="w-4 h-4 text-pink-600" />;
      case 'ovulation':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'period':
        return 'Règles';
      case 'ovulation':
        return 'Ovulation';
      case 'temperature':
        return 'Température';
      case 'medication':
        return 'Médicament';
      case 'appointment':
        return 'Rendez-vous';
      default:
        return 'Général';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Rappels</h1>
                <p className="text-sm text-gray-600">Gérez vos notifications personnalisées</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau rappel
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Reminder Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-orange-600" />
                  <span>Créer un nouveau rappel</span>
                </CardTitle>
                <CardDescription>
                  Configurez un rappel personnalisé pour ne rien oublier
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Titre du rappel"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type de rappel</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="period">Règles</SelectItem>
                          <SelectItem value="ovulation">Ovulation</SelectItem>
                          <SelectItem value="temperature">Température</SelectItem>
                          <SelectItem value="medication">Médicament</SelectItem>
                          <SelectItem value="appointment">Rendez-vous</SelectItem>
                          <SelectItem value="general">Général</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du rappel (optionnel)"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDate">Date *</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Heure *</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isRecurring">Rappel récurrent</Label>
                      <Switch
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                      />
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-2">
                        <Label>Fréquence</Label>
                        <Select
                          value={formData.recurringType}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, recurringType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez la fréquence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Quotidien</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      {isSubmitting ? 'Création...' : 'Créer le rappel'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Reminders List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Mes rappels</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Chargement...</p>
            </div>
          ) : reminders?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun rappel configuré</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre premier rappel pour ne rien oublier d'important
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Premier rappel
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reminders?.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-md transition-shadow ${reminder.isActive ? '' : 'opacity-60'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            {getTypeIcon(reminder.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {getTypeLabel(reminder.type)}
                              </span>
                              {reminder.isRecurring && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Récurrent
                                </span>
                              )}
                            </div>
                            {reminder.description && (
                              <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(reminder.scheduledDate)}</span>
                              </div>
                              {reminder.isRecurring && (
                                <span className="text-blue-600">
                                  {reminder.recurringType === 'daily' ? 'Quotidien' :
                                   reminder.recurringType === 'weekly' ? 'Hebdomadaire' :
                                   reminder.recurringType === 'monthly' ? 'Mensuel' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={reminder.isActive}
                            onCheckedChange={() => toggleReminder(reminder.id, reminder.isActive)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
