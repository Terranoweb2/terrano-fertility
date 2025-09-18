# Architecture TerranoFertility

## Vue d'ensemble
TerranoFertility est une application web moderne de suivi de fertilité avec IA conversationnelle, développée avec une architecture frontend/backend séparée.

## Stack Technologique

### Frontend
- **Framework**: React 18 avec Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router DOM

### Backend
- **Framework**: Flask (Python)
- **Base de données**: SQLite
- **IA**: OpenRouter API
- **Authentification**: JWT
- **CORS**: Flask-CORS

## Architecture de la base de données

### Tables principales

#### Users
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- date_of_birth
- created_at
- updated_at

#### Cycles
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- start_date
- end_date
- cycle_length
- period_length
- created_at

#### DailyData
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- cycle_id (FOREIGN KEY)
- date
- temperature
- cervical_mucus
- mood
- symptoms
- notes
- created_at

#### Predictions
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- cycle_id (FOREIGN KEY)
- ovulation_date
- fertile_window_start
- fertile_window_end
- confidence_level
- created_at

#### ChatHistory
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- message
- response
- timestamp

## API Endpoints

### Authentification
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/profile

### Cycles
- GET /api/cycles
- POST /api/cycles
- PUT /api/cycles/:id
- DELETE /api/cycles/:id

### Données quotidiennes
- GET /api/daily-data
- POST /api/daily-data
- PUT /api/daily-data/:id
- DELETE /api/daily-data/:id

### Prédictions
- GET /api/predictions
- POST /api/predictions/calculate

### IA Conversationnelle
- POST /api/ai/chat
- GET /api/ai/history

## Fonctionnalités clés

### 1. IA Conversationnelle
- Chat en temps réel avec conseils personnalisés
- Analyse des données utilisateur pour des recommandations
- Historique des conversations

### 2. Prédictions avancées
- Calcul automatique de l'ovulation
- Fenêtre de fertilité personnalisée
- Niveau de confiance des prédictions

### 3. Interface moderne
- Design responsive mobile-first
- Mode sombre/clair
- Animations fluides
- Graphiques interactifs

### 4. Sécurité
- Authentification JWT
- Chiffrement des mots de passe
- Protection RGPD
- Validation des données

## Déploiement
- Frontend et backend déployés ensemble
- Base de données SQLite intégrée
- Configuration CORS pour l'interaction frontend/backend

