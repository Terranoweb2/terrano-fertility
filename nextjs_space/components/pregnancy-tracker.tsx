
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Baby, Calendar, Heart, TrendingUp, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PregnancyTracking {
  id: string;
  dueDate: string;
  lastPeriodDate: string;
  currentWeek: number | null;
  currentDay: number | null;
  weightStart: number | null;
  bloodType: string | null;
  notes: string | null;
  isActive: boolean;
  appointments: PregnancyAppointment[];
  weeklyProgress: PregnancyWeeklyProgress[];
}

interface PregnancyAppointment {
  id: string;
  appointmentType: string;
  scheduledDate: string;
  doctorName: string | null;
  location: string | null;
  notes: string | null;
  completed: boolean;
}

interface PregnancyWeeklyProgress {
  id: string;
  weekNumber: number;
  weight: number | null;
  bloodPressure: string | null;
  babyMovements: number | null;
  symptoms: string[];
  mood: string | null;
  notes: string | null;
}

export function PregnancyTracker() {
  const [pregnancies, setPregnancies] = useState<PregnancyTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [formData, setFormData] = useState({
    lastPeriodDate: '',
    weightStart: '',
    bloodType: '',
    notes: '',
  });

  const activePregnancy = pregnancies.find((p) => p.isActive);

  useEffect(() => {
    loadPregnancies();
  }, []);

  const loadPregnancies = async () => {
    try {
      const response = await fetch('/api/pregnancy');
      if (response.ok) {
        const data = await response.json();
        setPregnancies(data.pregnancies || []);
      }
    } catch (error) {
      console.error('Error loading pregnancies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPregnancy = async () => {
    try {
      const response = await fetch('/api/pregnancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadPregnancies();
        setShowNewDialog(false);
        setFormData({ lastPeriodDate: '', weightStart: '', bloodType: '', notes: '' });
      }
    } catch (error) {
      console.error('Error creating pregnancy:', error);
    }
  };

  const calculatePregnancyWeek = (lastPeriodDate: string) => {
    const weeks = differenceInWeeks(new Date(), new Date(lastPeriodDate));
    const days = differenceInDays(new Date(), new Date(lastPeriodDate)) % 7;
    return { weeks, days };
  };

  const getWeekInfo = (week: number) => {
    const weekInfo: { [key: number]: { trimester: string; size: string; development: string } } = {
      4: { trimester: '1er', size: 'Graine de pavot', development: 'Implantation dans l\'utérus' },
      8: { trimester: '1er', size: 'Framboise', development: 'Tous les organes commencent à se former' },
      12: { trimester: '1er', size: 'Citron', development: 'Fin de l\'organogenèse' },
      16: { trimester: '2ème', size: 'Avocat', development: 'Mouvements actifs, sexe visible' },
      20: { trimester: '2ème', size: 'Banane', development: 'Vous ressentez les mouvements' },
      24: { trimester: '2ème', size: 'Maïs', development: 'Viabilité atteinte' },
      28: { trimester: '3ème', size: 'Aubergine', development: 'Yeux s\'ouvrent' },
      32: { trimester: '3ème', size: 'Ananas', development: 'Position céphalique' },
      36: { trimester: '3ème', size: 'Melon', development: 'Poumons matures' },
      40: { trimester: '3ème', size: 'Pastèque', development: 'Prêt à naître !' },
    };

    const closestWeek = Math.floor(week / 4) * 4;
    return weekInfo[closestWeek] || { trimester: '3ème', size: 'Pastèque', development: 'Bébé prêt à naître' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Baby className="w-8 h-8 animate-pulse mx-auto mb-2 text-pink-500" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activePregnancy) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-6 h-6 text-pink-500" />
            Suivi de Grossesse
          </CardTitle>
          <CardDescription>
            Suivez votre grossesse semaine par semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Baby className="w-12 h-12 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Commencez votre suivi de grossesse</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Félicitations pour cette belle aventure ! Commencez à suivre votre grossesse 
              et recevez des informations personnalisées chaque semaine.
            </p>
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Démarrer le suivi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle grossesse</DialogTitle>
                  <DialogDescription>
                    Entrez les informations de base pour commencer le suivi
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriodDate">Date des dernières règles *</Label>
                    <Input
                      id="lastPeriodDate"
                      type="date"
                      value={formData.lastPeriodDate}
                      onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightStart">Poids de départ (kg)</Label>
                    <Input
                      id="weightStart"
                      type="number"
                      step="0.1"
                      value={formData.weightStart}
                      onChange={(e) => setFormData({ ...formData, weightStart: e.target.value })}
                      placeholder="65.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Groupe sanguin</Label>
                    <Input
                      id="bloodType"
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      placeholder="A+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Informations supplémentaires..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={createPregnancy} disabled={!formData.lastPeriodDate}>
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { weeks, days } = calculatePregnancyWeek(activePregnancy.lastPeriodDate);
  const weekInfo = getWeekInfo(weeks);
  const daysUntilDue = differenceInDays(new Date(activePregnancy.dueDate), new Date());

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-6 h-6 text-pink-500" />
            Votre grossesse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Week Display */}
            <div className="text-center">
              <div className="inline-flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold text-pink-600">{weeks}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-muted-foreground">semaines</p>
                  <p className="text-sm text-muted-foreground">{days} jours</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {weekInfo.trimester} trimestre
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium mb-1">Taille du bébé</p>
                <p className="text-2xl font-semibold text-pink-600">{weekInfo.size}</p>
                <p className="text-xs text-muted-foreground mt-2">{weekInfo.development}</p>
              </div>
            </div>

            {/* Due Date & Info */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <p className="font-medium">Date prévue d'accouchement</p>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  {format(new Date(activePregnancy.dueDate), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Dans {daysUntilDue} jours
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {activePregnancy.weightStart && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Poids de départ</p>
                    <p className="text-lg font-semibold">{activePregnancy.weightStart} kg</p>
                  </div>
                )}
                {activePregnancy.bloodType && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Groupe sanguin</p>
                    <p className="text-lg font-semibold">{activePregnancy.bloodType}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" />
              Rendez-vous médicaux
            </CardTitle>
            <Button size="sm" onClick={() => setShowAppointmentDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activePregnancy.appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucun rendez-vous programmé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePregnancy.appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    apt.completed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  {apt.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{apt.appointmentType}</p>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(apt.scheduledDate), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    {apt.doctorName && (
                      <p className="text-sm text-muted-foreground">Dr. {apt.doctorName}</p>
                    )}
                    {apt.location && (
                      <p className="text-sm text-muted-foreground">{apt.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              Suivi hebdomadaire
            </CardTitle>
            <Button size="sm" onClick={() => setShowProgressDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activePregnancy.weeklyProgress.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Commencez à enregistrer vos progrès hebdomadaires</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePregnancy.weeklyProgress.map((progress) => (
                <div key={progress.id} className="p-3 rounded-lg border bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Semaine {progress.weekNumber}</p>
                    {progress.weight && (
                      <span className="text-sm font-medium">{progress.weight} kg</span>
                    )}
                  </div>
                  {progress.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {progress.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                  {progress.notes && (
                    <p className="text-sm text-muted-foreground">{progress.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
