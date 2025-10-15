
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Users, 
  MessageCircle, 
  Heart,
  Star,
  BookOpen,
  Calendar,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CommunityClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Communauté</h1>
                <p className="text-sm text-gray-600">Connectez-vous avec d'autres femmes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Rejoignez notre communauté bienveillante
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partagez votre parcours, posez vos questions et soutenez-vous mutuellement 
            dans votre cheminement vers une meilleure compréhension de votre fertilité.
          </p>
        </motion.div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-pink-100 p-3 rounded-full w-fit mb-4">
                  <MessageCircle className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Forums de discussion</CardTitle>
                <CardDescription>
                  Échangez sur différents sujets liés à la fertilité, au cycle menstruel, 
                  et partagez vos expériences avec d'autres femmes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Suivi du cycle menstruel</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-pink-500" />
                    <span>Conception et grossesse</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-pink-500" />
                    <span>Questions & réponses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Événements & Ateliers</CardTitle>
                <CardDescription>
                  Participez à des webinaires, ateliers et événements virtuels 
                  animés par des experts en fertilité et santé reproductive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span>Webinaires mensuels</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Groupes de soutien</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span>Ateliers éducatifs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader className="text-center pb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-indigo-900">Bientôt disponible !</CardTitle>
              <CardDescription className="text-indigo-700">
                La section communauté sera bientôt lancée avec toutes ses fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white/60 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-indigo-900 mb-4">Ce qui vous attend :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                    <span>Forums de discussion thématiques</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Groupes privés et publics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-indigo-600" />
                    <span>Système de soutien mutuel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Calendrier d'événements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Partage de ressources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-indigo-600" />
                    <span>Conseils d'expertes</span>
                  </div>
                </div>
              </div>
              
              <p className="text-indigo-700 mb-6">
                En attendant, continuez à utiliser vos outils de suivi et n'hésitez pas 
                à consulter notre section éducative pour approfondir vos connaissances !
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/education">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Découvrir les articles
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au tableau de bord
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
