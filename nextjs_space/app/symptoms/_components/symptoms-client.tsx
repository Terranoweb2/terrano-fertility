
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Thermometer, 
  Heart, 
  Brain, 
  Activity,
  Droplets,
  Moon,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SymptomFormData {
  date: string;
  temperature: number | null;
  cervicalMucus: string;
  cramps: number;
  headache: number;
  breastTenderness: number;
  backPain: number;
  mood: string;
  energy: number;
  stress: number;
  flowHeaviness: string;
  flowColor: string;
  bloating: boolean;
  acne: boolean;
  foodCravings: string;
  sleep: number;
  notes: string;
}

export default function SymptomsClient() {
  const [formData, setFormData] = useState<SymptomFormData>({
    date: new Date().toISOString().split('T')[0],
    temperature: null,
    cervicalMucus: '',
    cramps: 1,
    headache: 1,
    breastTenderness: 1,
    backPain: 1,
    mood: '',
    energy: 5,
    stress: 5,
    flowHeaviness: '',
    flowColor: '',
    bloating: false,
    acne: false,
    foodCravings: '',
    sleep: 5,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState<any>(null);

  useEffect(() => {
    checkTodaySymptoms();
  }, []);

  const checkTodaySymptoms = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/symptoms?date=${today}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setTodaySymptoms(data[0]);
          // Populate form with existing data
          const symptoms = data[0];
          setFormData({
            date: symptoms.date?.split('T')[0] || today,
            temperature: symptoms.temperature || null,
            cervicalMucus: symptoms.cervicalMucus || '',
            cramps: symptoms.cramps || 1,
            headache: symptoms.headache || 1,
            breastTenderness: symptoms.breastTenderness || 1,
            backPain: symptoms.backPain || 1,
            mood: symptoms.mood || '',
            energy: symptoms.energy || 5,
            stress: symptoms.stress || 5,
            flowHeaviness: symptoms.flowHeaviness || '',
            flowColor: symptoms.flowColor || '',
            bloating: symptoms.bloating || false,
            acne: symptoms.acne || false,
            foodCravings: symptoms.foodCravings || '',
            sleep: symptoms.sleep || 5,
            notes: symptoms.notes || '',
          });
        }
      }
    } catch (error) {
      console.error('Error checking today symptoms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = todaySymptoms ? 'PUT' : 'POST';
      const url = todaySymptoms ? `/api/symptoms/${todaySymptoms.id}` : '/api/symptoms';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          temperature: formData.temperature || null,
        }),
      });

      if (response.ok) {
        toast.success(
          todaySymptoms 
            ? 'Symptômes mis à jour avec succès !' 
            : 'Symptômes enregistrés avec succès !'
        );
        checkTodaySymptoms();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Symptômes quotidiens</h1>
                <p className="text-sm text-gray-600">
                  {todaySymptoms ? 'Modifiez vos symptômes d\'aujourd\'hui' : 'Enregistrez vos symptômes d\'aujourd\'hui'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm">
                    <Label htmlFor="date">Date des symptômes</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Physical Symptoms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                    <span>Symptômes physiques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Température corporelle (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="35"
                        max="42"
                        value={formData.temperature || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          temperature: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                        placeholder="Ex: 36.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Glaire cervicale</Label>
                      <Select
                        value={formData.cervicalMucus}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cervicalMucus: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune</SelectItem>
                          <SelectItem value="dry">Sèche</SelectItem>
                          <SelectItem value="sticky">Collante</SelectItem>
                          <SelectItem value="creamy">Crémeuse</SelectItem>
                          <SelectItem value="watery">Aqueuse</SelectItem>
                          <SelectItem value="egg-white">Blanc d'œuf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pain Scale */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Intensité de la douleur (1-10)</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Crampes: {formData.cramps}</Label>
                        <Slider
                          value={[formData.cramps]}
                          onValueChange={([value]) => setFormData(prev => ({ ...prev, cramps: value }))}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Maux de tête: {formData.headache}</Label>
                        <Slider
                          value={[formData.headache]}
                          onValueChange={([value]) => setFormData(prev => ({ ...prev, headache: value }))}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Sensibilité des seins: {formData.breastTenderness}</Label>
                        <Slider
                          value={[formData.breastTenderness]}
                          onValueChange={([value]) => setFormData(prev => ({ ...prev, breastTenderness: value }))}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Douleurs dorsales: {formData.backPain}</Label>
                        <Slider
                          value={[formData.backPain]}
                          onValueChange={([value]) => setFormData(prev => ({ ...prev, backPain: value }))}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Flow Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-red-600" />
                    <span>Suivi des règles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Abondance du flux</Label>
                      <Select
                        value={formData.flowHeaviness}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, flowHeaviness: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="light">Léger</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="heavy">Abondant</SelectItem>
                          <SelectItem value="very-heavy">Très abondant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Couleur du flux</Label>
                      <Select
                        value={formData.flowColor}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, flowColor: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bright-red">Rouge vif</SelectItem>
                          <SelectItem value="dark-red">Rouge foncé</SelectItem>
                          <SelectItem value="brown">Marron</SelectItem>
                          <SelectItem value="pink">Rose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood and Energy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span>Humeur et énergie</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Humeur générale</Label>
                    <Select
                      value={formData.mood}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Comment vous sentez-vous ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">Heureuse</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="sad">Triste</SelectItem>
                        <SelectItem value="irritable">Irritable</SelectItem>
                        <SelectItem value="anxious">Anxieuse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Niveau d'énergie: {formData.energy}/10</Label>
                      <Slider
                        value={[formData.energy]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, energy: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Niveau de stress: {formData.stress}/10</Label>
                      <Slider
                        value={[formData.stress]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, stress: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Qualité du sommeil: {formData.sleep}/10</Label>
                      <Slider
                        value={[formData.sleep]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, sleep: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Other Symptoms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span>Autres symptômes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bloating">Ballonnements</Label>
                    <Switch
                      id="bloating"
                      checked={formData.bloating}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, bloating: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="acne">Acné/Problèmes de peau</Label>
                    <Switch
                      id="acne"
                      checked={formData.acne}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acne: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foodCravings">Envies alimentaires</Label>
                    <Input
                      id="foodCravings"
                      value={formData.foodCravings}
                      onChange={(e) => setFormData(prev => ({ ...prev, foodCravings: e.target.value }))}
                      placeholder="Ex: Chocolat, sucré, salé..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes personnelles</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ajoutez des notes sur votre journée, ressenti, événements particuliers..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-12"
              >
                {isSubmitting ? 'Enregistrement...' : (
                  todaySymptoms ? 'Mettre à jour' : 'Enregistrer les symptômes'
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </main>
    </div>
  );
}
