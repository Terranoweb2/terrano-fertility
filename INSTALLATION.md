# 🚀 Guide d'Installation TerranoFertility

Ce guide vous accompagne pas à pas pour installer et configurer TerranoFertility sur votre système.

## 📋 Prérequis Système

### **Logiciels Requis**
- **Python 3.8+** (recommandé : Python 3.9 ou 3.10)
- **Node.js 16+** et npm (pour le frontend React)
- **Git** pour cloner le repository
- **SQLite3** (généralement inclus avec Python)

### **Vérification des Prérequis**
```bash
# Vérifier Python
python --version
# ou
python3 --version

# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Git
git --version
```

## 📦 Installation Complète

### **1. Cloner le Repository**
```bash
# Cloner le projet
git clone https://github.com/Terranoweb2/terrano-fertility.git
cd terrano-fertility

# Vérifier le contenu
ls -la
```

### **2. Configuration Backend Flask**

#### **Créer l'Environnement Virtuel**
```bash
# Aller dans le dossier backend
cd backend

# Créer environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Linux/Mac :
source venv/bin/activate

# Sur Windows :
venv\Scripts\activate

# Vérifier l'activation (le prompt doit afficher (venv))
which python
```

#### **Installer les Dépendances Python**
```bash
# Installer toutes les dépendances
pip install -r requirements.txt

# Vérifier l'installation
pip list
```

#### **Configuration Variables d'Environnement**
```bash
# Créer fichier .env dans le dossier backend
cat > .env << EOF
SECRET_KEY=terrano-fertility-secret-key-ultra-secure-2024
OPENAI_API_KEY=your-openrouter-api-key-here
DATABASE_PATH=../terranofertility.db
FLASK_ENV=development
PORT=5000
EOF
```

### **3. Initialisation Base de Données**

#### **Créer la Base de Données avec Données de Test**
```bash
# Retourner au dossier racine
cd ..

# Exécuter le script d'initialisation
python create_database.py

# Vérifier que la base de données a été créée
ls -la terranofertility.db
```

#### **Explorer la Base de Données (Optionnel)**
```bash
# Lancer l'explorateur interactif
python database_explorer.py

# Suivre les instructions à l'écran pour explorer les données
```

### **4. Configuration Frontend React**

#### **Installer les Dépendances Node.js**
```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Ou avec yarn si vous préférez
yarn install
```

#### **Configuration API Frontend**
```bash
# Créer fichier de configuration API
cat > src/config.js << EOF
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://votre-domaine.com/api'
  : 'http://localhost:5000/api';

export { API_BASE_URL };
EOF
```

## 🚀 Démarrage de l'Application

### **Option 1 : Backend Seul (Recommandé pour Test)**

#### **Démarrer le Serveur Flask**
```bash
# Aller dans le dossier backend
cd backend

# Activer l'environnement virtuel si pas déjà fait
source venv/bin/activate

# Démarrer le serveur
python src/main.py
```

#### **Tester l'Application**
```bash
# Ouvrir votre navigateur à :
http://localhost:5000

# Ou tester l'API :
curl http://localhost:5000/api/health
```

### **Option 2 : Frontend + Backend Séparés**

#### **Terminal 1 : Backend**
```bash
cd backend
source venv/bin/activate
python src/main.py
```

#### **Terminal 2 : Frontend**
```bash
cd frontend
npm run dev
```

#### **Accès Application**
- **Frontend React :** http://localhost:3000
- **Backend API :** http://localhost:5000
- **Interface intégrée :** http://localhost:5000

## 👥 Comptes de Test

### **Utilisateurs Préconfigurés**
```
Sophie Martin
Email: sophie.martin@example.com
Mot de passe: MonMotDePasse123!

Marie Dupont  
Email: marie.dupont@example.com
Mot de passe: MotDePasse456!

Emma Leroy
Email: emma.leroy@example.com
Mot de passe: Password789!
```

## 🔧 Configuration Avancée

### **Configuration OpenRouter API (IA)**
```bash
# Obtenir une clé API sur https://openrouter.ai/
# Modifier le fichier .env :
OPENAI_API_KEY=sk-or-v1-your-actual-api-key-here
```

### **Configuration Base de Données Personnalisée**
```bash
# Pour utiliser une base de données différente
# Modifier DATABASE_PATH dans .env :
DATABASE_PATH=/chemin/vers/votre/base.db

# Puis réinitialiser :
python create_database.py
```

### **Configuration CORS pour Production**
```python
# Dans backend/src/main.py, modifier :
CORS(app, origins=['https://votre-domaine.com'])
```

## 🐳 Installation avec Docker (Optionnel)

### **Dockerfile Backend**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "backend/src/main.py"]
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  terrano-fertility:
    build: .
    ports:
      - "5000:5000"
    environment:
      - SECRET_KEY=your-secret-key
      - OPENAI_API_KEY=your-api-key
    volumes:
      - ./terranofertility.db:/app/terranofertility.db
```

### **Commandes Docker**
```bash
# Construire l'image
docker build -t terrano-fertility .

# Démarrer avec Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

## 🔍 Vérification Installation

### **Tests Backend**
```bash
# Test santé API
curl http://localhost:5000/api/health

# Test authentification
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sophie.martin@example.com","password":"MonMotDePasse123!"}'

# Test routes disponibles
curl http://localhost:5000/api/test
```

### **Tests Frontend**
```bash
# Dans le dossier frontend
npm test

# Ou lancer les tests en mode watch
npm test -- --watch
```

### **Vérification Base de Données**
```bash
# Compter les utilisateurs
python -c "
import sqlite3
conn = sqlite3.connect('terranofertility.db')
cursor = conn.cursor()
cursor.execute('SELECT COUNT(*) FROM users')
print(f'Utilisateurs: {cursor.fetchone()[0]}')
conn.close()
"
```

## 🛠️ Résolution de Problèmes

### **Erreurs Communes**

#### **"Module not found"**
```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
```

#### **"Port already in use"**
```bash
# Trouver le processus utilisant le port
lsof -i :5000

# Tuer le processus
kill -9 PID_NUMBER

# Ou changer le port dans .env
PORT=5001
```

#### **"Database locked"**
```bash
# Arrêter tous les processus utilisant la DB
pkill -f python

# Redémarrer l'application
python backend/src/main.py
```

#### **"CORS Error"**
```bash
# Vérifier la configuration CORS dans main.py
# S'assurer que l'origine frontend est autorisée
```

### **Logs de Débogage**
```bash
# Activer les logs détaillés
export FLASK_ENV=development
export FLASK_DEBUG=1

# Démarrer avec logs verbeux
python backend/src/main.py --debug
```

### **Réinitialisation Complète**
```bash
# Supprimer la base de données
rm terranofertility.db

# Supprimer l'environnement virtuel
rm -rf backend/venv

# Supprimer node_modules
rm -rf frontend/node_modules

# Recommencer l'installation
python create_database.py
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cd ../frontend && npm install
```

## 📚 Ressources Supplémentaires

### **Documentation API**
- **Swagger UI :** http://localhost:5000/api/docs (si configuré)
- **Endpoints :** Voir README.md pour la liste complète

### **Outils de Développement**
```bash
# Installer outils de développement
pip install pytest black flake8
npm install -g eslint prettier

# Formater le code
black backend/src/
prettier --write frontend/src/
```

### **Monitoring**
```bash
# Installer outils de monitoring
pip install flask-monitoring-dashboard

# Accéder au dashboard
http://localhost:5000/dashboard
```

## 🎯 Prochaines Étapes

1. **Tester toutes les fonctionnalités** avec les comptes de test
2. **Configurer l'API OpenRouter** pour l'IA conversationnelle
3. **Personnaliser l'interface** selon vos besoins
4. **Déployer en production** (voir DEPLOYMENT.md)
5. **Contribuer au projet** (voir guide de contribution)

---

**🌸 Félicitations ! TerranoFertility est maintenant installé et prêt à révolutionner le suivi de fertilité ! 🌸**

Pour toute question ou problème, consultez la documentation complète ou ouvrez une issue sur GitHub.

