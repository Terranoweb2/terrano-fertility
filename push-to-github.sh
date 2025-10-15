
#!/bin/bash

# Script pour pousser l'application Terrano Fertility vers GitHub
# Usage: ./push-to-github.sh [votre-token-github]

REPO_NAME="terrano-fertility"
GITHUB_USERNAME="Terranoweb2"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Push vers GitHub - Terrano Fertility${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Vérifier si un token est fourni en argument
if [ -z "$1" ]; then
    echo -e "${YELLOW}Aucun token fourni.${NC}"
    echo ""
    echo -e "${YELLOW}Pour créer un Personal Access Token (PAT):${NC}"
    echo "1. Allez sur: https://github.com/settings/tokens/new"
    echo "2. Donnez un nom au token (ex: 'Terrano Fertility Deploy')"
    echo "3. Sélectionnez les permissions: 'repo' (accès complet aux dépôts)"
    echo "4. Cliquez sur 'Generate token'"
    echo "5. Copiez le token généré"
    echo ""
    echo -e "${YELLOW}Puis exécutez:${NC}"
    echo "./push-to-github.sh VOTRE_TOKEN"
    exit 1
fi

GITHUB_TOKEN="$1"

# Configurer Git
echo -e "${GREEN}Configuration de Git...${NC}"
cd /home/ubuntu/gestion_fertilite

# Supprimer l'ancien remote s'il existe
git remote remove origin 2>/dev/null

# Ajouter le nouveau remote avec le token
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Ajouter tous les fichiers (sauf ceux dans .gitignore)
echo -e "${GREEN}Ajout des fichiers...${NC}"
git add -A

# Vérifier s'il y a des changements à commiter
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Aucun changement à commiter.${NC}"
else
    # Créer un commit
    echo -e "${GREEN}Création du commit...${NC}"
    COMMIT_MSG="Mise à jour: Fonctionnalité changement de mot de passe - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
fi

# Pousser vers GitHub
echo -e "${GREEN}Push vers GitHub...${NC}"
if git push -u origin master 2>&1; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Code poussé avec succès vers GitHub!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Dépôt: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ Erreur lors du push vers GitHub${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "Vérifiez que:"
    echo "1. Le token a les permissions 'repo'"
    echo "2. Le dépôt existe sur GitHub"
    echo "3. Vous avez accès au dépôt"
    exit 1
fi
