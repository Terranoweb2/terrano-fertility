
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, ChevronLeft, ArrowLeft, Plus, Heart, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CycleData {
  id: string;
  startDate: string;
  endDate?: string;
  periodLength?: number;
  notes?: string;
}

export default function CalendarClient() {
  const router = useRouter();
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [showNewCycleForm, setShowNewCycleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const response = await fetch('/api/cycles');
      if (response.ok) {
        const data = await response.json();
        setCycles(data);
      }
    } catch (error) {
      console.error('Error fetching cycles:', error);
      toast.error('Erreur lors du chargement des cycles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Cycle enregistré avec succès !');
        setFormData({ startDate: '', endDate: '', notes: '' });
        setShowNewCycleForm(false);
        fetchCycles();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Calendrier menstruel</h1>
                <p className="text-sm text-gray-600">Suivez vos cycles et prédictions</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowNewCycleForm(true)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle période
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Cycle Form */}
        {showNewCycleForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-pink-600" />
                  <span>Enregistrer une nouvelle période</span>
                </CardTitle>
                <CardDescription>
                  Ajoutez les dates de début et fin de vos règles
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        min={formData.startDate}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ajoutez des notes sur ce cycle..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewCycleForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Cycles History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Historique des cycles</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Chargement...</p>
            </div>
          ) : cycles?.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun cycle enregistré</h3>
                <p className="text-gray-600 mb-4">
                  Commencez par enregistrer votre première période pour débuter le suivi
                </p>
                <Button 
                  onClick={() => setShowNewCycleForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Première période
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {cycles?.map((cycle, index) => (
                <motion.div
                  key={cycle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-pink-100 p-3 rounded-full">
                            <Droplets className="w-6 h-6 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {formatDate(cycle.startDate)}
                              {cycle.endDate && ` - ${formatDate(cycle.endDate)}`}
                            </h3>
                            {cycle.periodLength && (
                              <p className="text-sm text-gray-600">
                                Durée: {cycle.periodLength} jours
                              </p>
                            )}
                            {cycle.notes && (
                              <p className="text-sm text-gray-600 mt-1 italic">
                                {cycle.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-gray-500">
                          Cycle #{cycles.length - index}
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
