# TerranoVision 📺

Application mobile de streaming moderne développée avec React, TypeScript et Node.js. TerranoVision permet de lire des flux de streaming HLS et DASH à partir de playlists M3U, avec support des en-têtes personnalisés via un serveur proxy.

## 🚀 Fonctionnalités

### Frontend (React + TypeScript)
- **Interface mobile-first** avec thème sombre moderne
- **Lecteur vidéo Shaka Player** (HLS .m3u8 + DASH .mpd)
- **Gestion des playlists M3U** avec parsing complet des métadonnées
- **Système de favoris** et historique des chaînes récentes
- **Recherche et filtres** par nom et groupe
- **PWA (Progressive Web App)** avec support offline
- **Stockage local** avec IndexedDB (Dexie)

### Backend (Node.js + Express)
- **Serveur proxy** pour injection d'en-têtes User-Agent et Referer
- **Support du streaming** avec gestion des requêtes Range
- **CORS configuré** pour le développement et la production
- **Gestion d'erreurs** robuste avec timeouts

### Parsing M3U Avancé
- Support des attributs `tvg-id`, `tvg-logo`, `group-title`
- Gestion des en-têtes `user-agent`, `referrer`
- Support des options VLC (`#EXTVLCOPT:http-user-agent`, `#EXTVLCOPT:http-referrer`)
- Détection automatique du type de flux (HLS/DASH)

## 📁 Structure du Projet

```
terrano-vision/
├── apps/
│   ├── web/                 # Frontend React + TypeScript
│   │   ├── src/
│   │   │   ├── components/  # Composants React
│   │   │   ├── stores/      # État Zustand
│   │   │   ├── utils/       # Utilitaires (parseur M3U)
│   │   │   ├── types/       # Types TypeScript
│   │   │   └── data/        # Playlist initiale
│   │   ├── public/          # Assets statiques
│   │   └── dist/            # Build de production
│   └── server/              # Backend Node.js + Express
│       ├── src/
│       │   └── index.ts     # Serveur proxy
│       └── dist/            # Build de production
├── package.json             # Configuration monorepo
├── pnpm-workspace.yaml      # Configuration pnpm
└── README.md
```

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+ 
- pnpm 8+

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd terrano-vision

# Installer les dépendances
pnpm install
```

### Développement
```bash
# Démarrer le serveur de développement (frontend + backend)
pnpm dev

# Ou démarrer séparément :
pnpm -C apps/server dev    # Backend sur http://localhost:3001
pnpm -C apps/web dev       # Frontend sur http://localhost:3000
```

### Build de Production
```bash
# Build complet
pnpm build

# Build séparé
pnpm -C apps/web build     # Frontend
pnpm -C apps/server build  # Backend
```

### Tests
```bash
# Lancer les tests
pnpm test

# Linting
pnpm lint
```

## 🚀 Déploiement

### Frontend (Statique)
Le frontend peut être déployé sur n'importe quelle plateforme de hosting statique :

**Vercel :**
```bash
# Build et déploiement automatique via Git
vercel --prod
```

**Netlify :**
```bash
# Build et déploiement
netlify deploy --prod --dir=apps/web/dist
```

### Backend (API Proxy)
Le serveur proxy peut être déployé sur :

**Render :**
```bash
# Connecter le repository et configurer :
# Build Command: pnpm -C apps/server build
# Start Command: pnpm -C apps/server start
```

**Railway :**
```bash
railway login
railway link
railway up
```

**Fly.io :**
```bash
flyctl deploy
```

### Serveur Unique (Fullstack)
Pour un déploiement simplifié, le serveur Node.js peut servir le frontend :

```typescript
// Dans apps/server/src/index.ts
import path from 'path';
app.use(express.static(path.join(__dirname, '../../web/dist')));
```

## ⚙️ Variables d'Environnement

### Backend (.env)
```bash
PORT=3001
NODE_ENV=production
DEFAULT_UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

### Frontend
Les variables sont configurées au build time via Vite.

## 🔧 Configuration

### Proxy Backend
L'endpoint `/proxy` accepte les paramètres suivants :
- `url` (obligatoire) : URL du flux à proxifier
- `ua` (optionnel) : User-Agent personnalisé
- `ref` (optionnel) : Referer personnalisé

Exemple :
```
GET /proxy?url=https://example.com/stream.m3u8&ua=CustomUA&ref=https://example.com
```

### Format M3U Supporté
```m3u
#EXTM3U
#EXTINF:-1 tvg-id="channel1" tvg-logo="logo.png" group-title="News" user-agent="CustomUA" referrer="https://example.com",Channel Name
#EXTVLCOPT:http-user-agent=VLC_UA
#EXTVLCOPT:http-referrer=https://vlc-ref.com
https://example.com/stream.m3u8
```

## 🎯 Utilisation

1. **Import de Playlist** : Coller une playlist M3U via le modal d'import
2. **Navigation** : Rechercher et filtrer les chaînes par nom ou groupe
3. **Lecture** : Cliquer sur une chaîne pour lancer la lecture
4. **Favoris** : Ajouter/retirer des chaînes des favoris
5. **Historique** : Accéder aux chaînes récemment regardées

## 🔒 Limitations et Avertissements

### Techniques
- **En-têtes HTTP** : Les navigateurs ne permettent pas de modifier User-Agent et Referer côté client, d'où la nécessité du proxy
- **CORS** : Certains serveurs de streaming bloquent les requêtes cross-origin
- **Géo-restrictions** : Certains flux peuvent être limités géographiquement

### Légales
⚠️ **Important** : Cette application est un lecteur de flux de streaming. L'utilisateur est responsable de :
- Respecter les droits d'auteur et licences des contenus
- Vérifier les autorisations géographiques
- S'assurer de la légalité des flux utilisés

## 🛡️ Sécurité

- Validation des URLs côté serveur
- Timeout des requêtes (12s)
- Headers de sécurité (Helmet.js)
- Validation des paramètres d'entrée

## 📱 PWA (Progressive Web App)

L'application peut être installée sur mobile comme une app native :
- Manifest configuré
- Service Worker avec cache intelligent
- Support offline pour l'interface
- Exclusion du cache pour les segments vidéo

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier les logs du serveur et du navigateur
2. Tester l'endpoint `/health` du serveur
3. Vérifier la configuration CORS
4. Consulter la documentation des APIs utilisées

---

**TerranoVision** - Streaming moderne et accessible 🚀
