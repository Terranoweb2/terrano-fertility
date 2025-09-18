# 🌸 TerranoFertility - Application Complète de Suivi de Fertilité avec IA

**TerranoFertility** est une application web révolutionnaire pour le suivi de fertilité, intégrant l'intelligence artificielle conversationnelle pour des conseils personnalisés et des prédictions d'ovulation avancées.

## 🚀 Aperçu de l'Application

### 🎯 **Mission**
Révolutionner le suivi de fertilité en combinant technologie moderne, intelligence artificielle et interface utilisateur intuitive pour aider les femmes à mieux comprendre leur cycle et optimiser leur fertilité.

### ✨ **Fonctionnalités Principales**

#### 🤖 **IA Conversationnelle TerranoIA**
- **Chat personnalisé** avec conseils de fertilité basés sur vos données
- **Intégration OpenRouter API** pour des réponses intelligentes et contextuelles
- **Questions rapides** prédéfinies pour un accès facile aux informations
- **Conseils adaptatifs** qui évoluent avec votre cycle

#### 📊 **Suivi de Fertilité Intelligent**
- **Calcul automatique** des fenêtres de fertilité optimales
- **Prédictions d'ovulation** avec niveaux de confiance scientifiques
- **Suivi de cycle** complet et personnalisé
- **Analyse de régularité** et détection d'anomalies

#### 📱 **Données Quotidiennes Complètes**
- **Température basale** avec graphiques de tendance
- **Humeur et bien-être** avec suivi émotionnel
- **Symptômes physiques** catalogués et analysés
- **Notes personnelles** pour contexte additionnel

#### 🔒 **Sécurité et Confidentialité**
- **Chiffrement des données** utilisateur de bout en bout
- **Authentification JWT** sécurisée avec tokens rotatifs
- **Base de données locale** pour contrôle total des données
- **Conformité RGPD** et protection de la vie privée

## 🏗️ Architecture Technique Complète

### **Backend Flask Robuste**
```
backend/
├── src/
│   ├── main.py                 # Serveur principal Flask
│   ├── models/                 # Modèles de données SQLAlchemy
│   │   ├── user.py            # Gestion utilisateurs
│   │   ├── cycle.py           # Cycles menstruels
│   │   ├── daily_data.py      # Données quotidiennes
│   │   ├── prediction.py      # Prédictions IA
│   │   └── chat_history.py    # Historique conversations
│   ├── routes/                # Routes API REST
│   │   ├── auth.py           # Authentification
│   │   ├── cycles.py         # Gestion cycles
│   │   ├── daily_data.py     # Données quotidiennes
│   │   ├── ai_chat.py        # Chat IA
│   │   └── predictions.py    # Prédictions
│   ├── services/             # Services métier
│   │   ├── ai_service.py     # Service IA OpenRouter
│   │   └── fertility_service.py # Calculs fertilité
│   └── database/             # Base de données
│       └── terranofertility.db # SQLite avec données
└── requirements.txt          # Dépendances Python
```

### **Frontend React Moderne**
```
frontend/
├── src/
│   ├── App.jsx               # Application principale
│   ├── components/           # Composants React
│   │   ├── Auth.jsx         # Authentification
│   │   ├── Dashboard.jsx    # Tableau de bord
│   │   ├── CycleTracker.jsx # Suivi de cycle
│   │   ├── AIChat.jsx       # Chat IA
│   │   └── Profile.jsx      # Profil utilisateur
│   ├── contexts/            # Contextes React
│   │   └── AuthContext.jsx  # Contexte authentification
│   └── services/            # Services API
│       └── api.js          # Client API REST
├── public/                  # Fichiers publics
└── package.json            # Dépendances Node.js
```

### **Base de Données Relationnelle**
```sql
-- 7 Tables principales avec relations
users              # Profils utilisateur
cycles             # Cycles menstruels
daily_data         # Données quotidiennes
predictions        # Prédictions IA
chat_history       # Conversations IA
user_settings      # Paramètres utilisateur
notifications      # Rappels et alertes
```

## 📦 Installation et Configuration

### **Prérequis Système**
```bash
Python 3.8+
Node.js 16+
SQLite3
Git
```

### **Installation Backend**
```bash
# Cloner le repository
git clone https://github.com/Terranoweb2/terrano-fertility.git
cd terrano-fertility/backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Initialiser base de données
cd ..
python create_database.py

# Démarrer serveur
cd backend
python src/main.py
```

### **Installation Frontend**
```bash
# Aller dans le dossier frontend
cd frontend

# Installer dépendances
npm install

# Démarrer serveur de développement
npm run dev

# Ou construire pour production
npm run build
```

### **Configuration Variables d'Environnement**
```bash
# Créer fichier .env
SECRET_KEY=votre-cle-secrete-ultra-securisee
OPENAI_API_KEY=votre-cle-openrouter-api
DATABASE_PATH=../terranofertility.db
FLASK_ENV=development
PORT=5000
```

## 🌐 API REST Complète

### **Endpoints d'Authentification**
```http
POST /api/auth/register     # Inscription utilisateur
POST /api/auth/login        # Connexion utilisateur
GET  /api/auth/profile      # Profil utilisateur
PUT  /api/auth/profile      # Mise à jour profil
```

### **Endpoints de Données**
```http
GET  /api/cycles           # Récupérer cycles
POST /api/cycles           # Créer nouveau cycle
GET  /api/daily-data       # Données quotidiennes
POST /api/daily-data       # Ajouter données jour
PUT  /api/daily-data/:id   # Modifier données
```

### **Endpoints IA et Prédictions**
```http
POST /api/ai/chat                    # Chat avec TerranoIA
GET  /api/predictions/current        # Prédictions actuelles
POST /api/predictions/generate       # Générer prédictions
GET  /api/predictions/history        # Historique prédictions
```

### **Endpoints Utilitaires**
```http
GET /api/health            # Vérification santé API
GET /api/stats             # Statistiques utilisateur
GET /api/export            # Export données utilisateur
```

## 👥 Utilisateurs de Test Inclus

### **Profils Complets avec Données Réalistes**

#### **Sophie Martin**
- **Email :** sophie.martin@example.com
- **Mot de passe :** MonMotDePasse123!
- **Profil :** Cycle régulier de 28 jours, données sur 3 mois
- **Données :** Températures, humeurs, symptômes, conversations IA

#### **Marie Dupont**
- **Email :** marie.dupont@example.com
- **Mot de passe :** MotDePasse456!
- **Profil :** Cycle irrégulier, recherche d'optimisation
- **Données :** Historique varié, prédictions adaptatives

#### **Emma Leroy**
- **Email :** emma.leroy@example.com
- **Mot de passe :** Password789!
- **Profil :** Nouveau utilisateur, cycle en cours d'analyse
- **Données :** Données récentes, apprentissage IA

## 🎨 Interface Utilisateur Moderne

### **Design System**
- **Couleurs :** Dégradé violet élégant (#667eea → #764ba2)
- **Logo :** Fleur rose 🌸 symbolisant la fertilité
- **Typographie :** Système de polices modernes et lisibles
- **Responsive :** Compatible mobile, tablette et desktop

### **Expérience Utilisateur**
- **Navigation intuitive** par onglets et menus contextuels
- **Formulaires validés** avec feedback en temps réel
- **Messages informatifs** et guides d'utilisation
- **Actions rapides** pour saisie quotidienne efficace
- **Graphiques interactifs** pour visualisation des données

## 🚀 Déploiement en Production

### **Plateformes Supportées**
- **Heroku** : Déploiement simple avec Procfile inclus
- **AWS EC2** : Configuration complète avec Nginx
- **DigitalOcean** : Guide détaillé avec Systemd
- **Google Cloud** : Compatible App Engine
- **Docker** : Containerisation complète disponible

### **Configuration Production**
```python
# Configuration Flask optimisée
app.config['DEBUG'] = False
app.config['TESTING'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

# Sécurité renforcée
CORS(app, origins=['https://votre-domaine.com'])
```

### **Monitoring et Logs**
```python
# Configuration logging production
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler('terrano-fertility.log'),
        logging.StreamHandler()
    ]
)
```

## 📊 Fonctionnalités Avancées

### **Algorithmes de Prédiction**
- **Machine Learning** pour prédictions personnalisées
- **Analyse de tendances** sur historique utilisateur
- **Détection d'anomalies** dans les cycles
- **Scores de confiance** pour chaque prédiction

### **IA Conversationnelle**
- **Traitement du langage naturel** avec OpenRouter
- **Contexte personnalisé** basé sur les données utilisateur
- **Apprentissage adaptatif** des préférences
- **Réponses multilingues** (français prioritaire)

### **Analyses et Statistiques**
- **Graphiques de température** avec courbes de tendance
- **Calendrier de fertilité** interactif
- **Rapports mensuels** automatisés
- **Comparaisons cycliques** pour suivi évolution

## 🔧 Scripts Utilitaires Inclus

### **Gestion Base de Données**
```bash
# Initialisation complète
python create_database.py

# Exploration interactive
python database_explorer.py

# Sauvegarde automatique
python database_backup.py
```

### **Maintenance et Monitoring**
```bash
# Vérification santé application
curl http://localhost:5000/api/health

# Export données utilisateur
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/api/export

# Statistiques système
curl http://localhost:5000/api/stats
```

## 📱 Roadmap et Évolutions Futures

### **Version Mobile Native**
- **React Native** pour iOS et Android
- **Notifications push** pour rappels
- **Synchronisation offline** avec cache local
- **Intégration wearables** (Apple Watch, Fitbit)

### **IA Avancée**
- **Modèles personnalisés** par utilisatrice
- **Prédictions nutritionnelles** et lifestyle
- **Analyse d'images** pour symptômes visuels
- **Intégration données médicales** externes

### **Fonctionnalités Communautaires**
- **Forums de discussion** modérés
- **Partage d'expériences** anonymisé
- **Conseils d'expertes** médicales
- **Groupes de soutien** thématiques

## 🤝 Contribution et Développement

### **Guide de Contribution**
1. **Fork** le repository
2. **Créer branche** feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir Pull Request** avec description détaillée

### **Standards de Code**
- **Python :** PEP 8 avec Black formatter
- **JavaScript :** ESLint avec Prettier
- **Tests :** Pytest pour backend, Jest pour frontend
- **Documentation :** Docstrings et commentaires explicatifs

### **Architecture de Tests**
```bash
# Tests backend
cd backend
pytest tests/ -v --coverage

# Tests frontend
cd frontend
npm test -- --coverage
```

## 📄 Licences et Conformité

### **Licence MIT**
Ce projet est sous licence MIT. Utilisation libre pour projets personnels et commerciaux avec attribution.

### **Conformité RGPD**
- **Consentement explicite** pour collecte données
- **Droit à l'oubli** avec suppression complète
- **Portabilité des données** avec export JSON
- **Chiffrement bout en bout** pour protection maximale

### **Sécurité des Données**
- **Hachage bcrypt** pour mots de passe
- **Tokens JWT** avec expiration automatique
- **Validation stricte** des entrées utilisateur
- **Audit logs** pour traçabilité complète

## 🌟 Remerciements et Crédits

### **Technologies Utilisées**
- **Flask** : Framework web Python robuste
- **React** : Bibliothèque UI moderne et réactive
- **SQLite** : Base de données légère et fiable
- **OpenRouter** : API IA conversationnelle avancée
- **JWT** : Authentification sécurisée stateless

### **Inspiration et Recherche**
Développé avec passion pour aider les femmes à mieux comprendre leur fertilité et prendre des décisions éclairées sur leur santé reproductive.

---

## 🎯 Démarrage Rapide

```bash
# 1. Cloner le repository
git clone https://github.com/Terranoweb2/terrano-fertility.git
cd terrano-fertility

# 2. Initialiser la base de données
python create_database.py

# 3. Démarrer le backend
cd backend
pip install -r requirements.txt
python src/main.py

# 4. Tester l'application
# Ouvrir http://localhost:5000
# Se connecter avec sophie.martin@example.com / MonMotDePasse123!
```

**🌸 TerranoFertility - Votre compagnon intelligent pour le suivi de fertilité 🌸**

*Révolutionnons ensemble la santé reproductive féminine avec l'intelligence artificielle !*

