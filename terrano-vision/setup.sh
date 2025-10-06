#!/bin/bash
echo "🚀 Configuration de TerranoVision..."

# Installation des dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Installation des dépendances spécifiques
echo "📦 Installation des dépendances web..."
cd apps/web && pnpm install

echo "📦 Installation des dépendances serveur..."
cd ../server && pnpm install

cd ../..

echo "✅ TerranoVision configuré avec succès!"
echo ""
echo "🎯 Commandes disponibles:"
echo "  pnpm dev          - Démarrer en mode développement"
echo "  pnpm build        - Build de production"
echo "  pnpm start        - Démarrer en production"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
