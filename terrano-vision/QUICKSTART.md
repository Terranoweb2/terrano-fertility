# 🚀 Guide de Démarrage Rapide - TerranoVision

## Installation Rapide

```bash
# 1. Extraire l'archive
tar -xzf terrano-vision-final.tar.gz
cd terrano-vision

# 2. Installer les dépendances
npm install

# 3. Installer les dépendances des sous-projets
cd apps/web && npm install --legacy-peer-deps
cd ../server && npm install --legacy-peer-deps
cd ../..

# 4. Démarrer en mode développement
npm run dev
```

## URLs de Développement

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Build de Production

```bash
# Build complet
npm run build

# Build séparé
npm run -C apps/web build
npm run -C apps/server build
```

## Déploiement

### Frontend (Vercel/Netlify)
```bash
cd apps/web
npm run build
# Déployer le dossier dist/
```

### Backend (Render/Railway/Fly.io)
```bash
cd apps/server
npm run build
npm start
```

## Variables d'Environnement

### Backend (.env)
```bash
PORT=3001
NODE_ENV=production
DEFAULT_UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

## Fonctionnalités Principales

✅ **Lecteur Shaka Player** - Support HLS et DASH  
✅ **Parseur M3U avancé** - Métadonnées complètes  
✅ **Proxy pour en-têtes** - User-Agent et Referer  
✅ **Interface mobile-first** - Thème sombre moderne  
✅ **PWA** - Installable sur mobile  
✅ **Favoris et historique** - Stockage local  
✅ **Recherche et filtres** - Par nom et groupe  

## Structure du Projet

```
terrano-vision/
├── apps/
│   ├── web/          # Frontend React + TypeScript
│   └── server/       # Backend Node.js + Express
├── package.json      # Scripts monorepo
└── README.md         # Documentation complète
```

## Dépannage

### Erreurs de dépendances
```bash
npm install --legacy-peer-deps
```

### Erreurs de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules apps/*/node_modules
npm install
```

### Problèmes de CORS
Vérifier que le serveur backend est démarré sur le port 3001.

## Support

Pour plus d'informations, consulter le README.md complet.

---
**TerranoVision** - Streaming moderne et accessible 🎥
