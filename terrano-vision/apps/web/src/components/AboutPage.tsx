import React from 'react';
import { AlertTriangle, Shield, Globe, Code, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
            TerranoVision
          </h1>
          <p className="text-dark-400">
            Application mobile de streaming moderne
          </p>
          <p className="text-sm text-dark-500 mt-1">
            Version 1.0.0
          </p>
        </div>

        {/* Features */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-500" />
            Fonctionnalités
          </h2>
          <ul className="space-y-3 text-dark-300">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Lecture de flux HLS (.m3u8) et DASH (.mpd)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Import et parsing de playlists M3U avec métadonnées complètes</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Système de favoris et historique des chaînes récentes</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Recherche et filtres par nom et groupe</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Interface mobile-first avec thème sombre</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <span>Progressive Web App (PWA) installable</span>
            </li>
          </ul>
        </div>

        {/* Technology */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            Technologies
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-white mb-2">Frontend</h3>
              <ul className="space-y-1 text-dark-300">
                <li>• React 19 + TypeScript</li>
                <li>• Vite + Tailwind CSS</li>
                <li>• Shaka Player</li>
                <li>• Zustand + Dexie</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Backend</h3>
              <ul className="space-y-1 text-dark-300">
                <li>• Node.js + Express</li>
                <li>• Proxy pour en-têtes</li>
                <li>• CORS + Helmet</li>
                <li>• TypeScript strict</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Warning */}
        <div className="card p-6 border-yellow-500/20 bg-yellow-500/5">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            Avertissement Légal
          </h2>
          <div className="space-y-3 text-sm text-yellow-200">
            <p>
              <strong>TerranoVision</strong> est un lecteur de flux de streaming. 
              L'utilisateur est entièrement responsable du contenu qu'il choisit de visionner.
            </p>
            <p>
              Vous devez vous assurer que :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Vous respectez les droits d'auteur et licences des contenus</li>
              <li>Vous vérifiez les autorisations géographiques</li>
              <li>Vous vous conformez aux lois locales en vigueur</li>
              <li>Vous utilisez uniquement des flux légaux et autorisés</li>
            </ul>
            <p className="font-medium">
              Les développeurs de TerranoVision ne sont pas responsables de l'utilisation 
              qui est faite de cette application.
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            Confidentialité
          </h2>
          <div className="space-y-3 text-sm text-dark-300">
            <p>
              TerranoVision respecte votre vie privée :
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Aucune donnée personnelle n'est collectée</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Les favoris et l'historique sont stockés localement</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Aucun tracking ou analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Code source ouvert et transparent</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Credits */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Crédits
          </h2>
          <div className="space-y-3 text-sm text-dark-300">
            <p>
              TerranoVision utilise les technologies open source suivantes :
            </p>
            <ul className="space-y-1">
              <li>• <strong>Shaka Player</strong> - Google (Apache 2.0)</li>
              <li>• <strong>React</strong> - Meta (MIT)</li>
              <li>• <strong>Tailwind CSS</strong> - Tailwind Labs (MIT)</li>
              <li>• <strong>Lucide Icons</strong> - Lucide (ISC)</li>
              <li>• <strong>Zustand</strong> - Poimandres (MIT)</li>
            </ul>
            <p className="pt-2 text-dark-400">
              Développé avec ❤️ par l'équipe TerranoVision
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-dark-500 pb-8">
          <p>© 2024 TerranoVision - Tous droits réservés</p>
          <p className="mt-1">
            Application de streaming mobile moderne et open source
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
