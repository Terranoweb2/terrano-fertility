# Base de Données TerranoFertility 🗄️

## 📋 Vue d'ensemble

La base de données TerranoFertility est une base SQLite complète conçue pour stocker toutes les données nécessaires au suivi de fertilité intelligent avec IA. Elle contient 7 tables principales avec des relations bien définies et des index optimisés.

## 🗂️ Structure des Tables

### 1. **users** - Profils utilisatrices
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- first_name (VARCHAR(50)) - Prénom
- last_name (VARCHAR(50)) - Nom de famille
- email (VARCHAR(100) UNIQUE) - Adresse email (unique)
- password_hash (VARCHAR(255)) - Mot de passe hashé (SHA-256)
- birth_date (DATE) - Date de naissance
- average_cycle_length (INTEGER) - Durée moyenne du cycle (défaut: 28)
- average_period_length (INTEGER) - Durée moyenne des règles (défaut: 5)
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de mise à jour
```

### 2. **cycles** - Cycles menstruels
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- start_date (DATE) - Date de début du cycle
- end_date (DATE) - Date de fin du cycle (NULL si en cours)
- cycle_length (INTEGER) - Durée du cycle en jours
- period_length (INTEGER) - Durée des règles en jours
- ovulation_date (DATE) - Date d'ovulation
- is_current (BOOLEAN) - Cycle actuel (défaut: FALSE)
- notes (TEXT) - Notes personnelles
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de mise à jour
```

### 3. **daily_data** - Données quotidiennes
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- cycle_id (INTEGER) - Référence vers cycles
- date (DATE) - Date des données
- basal_temperature (REAL) - Température basale en °C
- cervical_mucus (VARCHAR(50)) - Type de glaire cervicale
- mood (VARCHAR(50)) - Humeur (joyeuse, calme, irritable, etc.)
- symptoms (TEXT) - Symptômes (crampes, fatigue, etc.)
- flow_intensity (VARCHAR(20)) - Intensité du flux (leger, moyen, fort)
- sexual_activity (BOOLEAN) - Activité sexuelle (défaut: FALSE)
- notes (TEXT) - Notes personnelles
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de mise à jour
```

### 4. **predictions** - Prédictions IA
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- cycle_id (INTEGER) - Référence vers cycles
- prediction_date (DATE) - Date de la prédiction
- ovulation_date (DATE) - Ovulation prédite
- fertile_window_start (DATE) - Début fenêtre fertile
- fertile_window_end (DATE) - Fin fenêtre fertile
- next_period_date (DATE) - Prochaines règles prédites
- fertility_score (REAL) - Score de fertilité (0-100)
- confidence_level (REAL) - Niveau de confiance (0-1)
- algorithm_version (VARCHAR(20)) - Version de l'algorithme
- created_at (TIMESTAMP) - Date de création
```

### 5. **chat_history** - Historique des conversations IA
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- message (TEXT) - Message de l'utilisatrice
- response (TEXT) - Réponse de l'IA
- message_type (VARCHAR(20)) - Type de message (general, fertility_advice, etc.)
- ai_model (VARCHAR(50)) - Modèle IA utilisé (défaut: openrouter)
- created_at (TIMESTAMP) - Date de création
```

### 6. **user_settings** - Paramètres utilisateur
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- setting_key (VARCHAR(100)) - Clé du paramètre
- setting_value (TEXT) - Valeur du paramètre
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de mise à jour
```

### 7. **notifications** - Notifications et rappels
```sql
- id (INTEGER PRIMARY KEY) - Identifiant unique
- user_id (INTEGER) - Référence vers users
- title (VARCHAR(200)) - Titre de la notification
- message (TEXT) - Contenu de la notification
- notification_type (VARCHAR(50)) - Type (info, reminder, alert)
- is_read (BOOLEAN) - Lu/non lu (défaut: FALSE)
- scheduled_for (TIMESTAMP) - Programmée pour
- created_at (TIMESTAMP) - Date de création
```

## 🔗 Relations entre Tables

```
users (1) ←→ (N) cycles
users (1) ←→ (N) daily_data
users (1) ←→ (N) predictions
users (1) ←→ (N) chat_history
users (1) ←→ (N) user_settings
users (1) ←→ (N) notifications
cycles (1) ←→ (N) daily_data
cycles (1) ←→ (N) predictions
```

## 📊 Données de Test Incluses

### Utilisatrices de Test
1. **Sophie Martin** (sophie.martin@example.com)
   - Mot de passe: `MonMotDePasse123!`
   - Cycle: 28 jours, Règles: 5 jours
   - Données complètes avec historique

2. **Marie Dupont** (marie.dupont@example.com)
   - Mot de passe: `MotDePasse456!`
   - Cycle: 30 jours, Règles: 4 jours

3. **Emma Leroy** (emma.leroy@example.com)
   - Mot de passe: `Password789!`
   - Cycle: 26 jours, Règles: 6 jours

### Données Complètes pour Sophie Martin
- ✅ 4 cycles (1 actuel + 3 précédents)
- ✅ 7 jours de données quotidiennes récentes
- ✅ Prédictions de fertilité avec IA
- ✅ Historique de chat avec TerranoIA
- ✅ Paramètres personnalisés
- ✅ Notifications programmées

## 🛠️ Scripts Utilitaires

### 1. `create_database.py`
**Création et initialisation complète**
```bash
python3 create_database.py
```
- Crée toutes les tables avec contraintes
- Insère les données de test
- Affiche un résumé complet

### 2. `database_explorer.py`
**Exploration interactive des données**
```bash
python3 database_explorer.py
```
- Menu interactif pour explorer les données
- Profils utilisatrices détaillés
- Statistiques globales
- Export de données
- Requêtes SQL personnalisées

### 3. `database_backup.py`
**Sauvegarde et restauration**
```bash
python3 database_backup.py
```
- Sauvegarde complète (DB + SQL + JSON)
- Restauration depuis sauvegarde
- Vérification d'intégrité
- Archives ZIP compressées

## 📈 Optimisations

### Index Créés
```sql
- idx_users_email ON users(email)
- idx_cycles_user_id ON cycles(user_id)
- idx_daily_data_user_date ON daily_data(user_id, date)
- idx_predictions_user_id ON predictions(user_id)
- idx_chat_history_user_id ON chat_history(user_id)
```

### Contraintes d'Intégrité
- Clés étrangères avec CASCADE DELETE
- Contraintes UNIQUE sur email et (user_id, date)
- Valeurs par défaut appropriées
- Types de données optimisés

## 🔧 Utilisation avec l'Application

### Connexion à la Base
```python
import sqlite3
conn = sqlite3.connect('terranofertility.db')
cursor = conn.cursor()
```

### Authentification
```python
# Vérifier les identifiants
cursor.execute("""
    SELECT id, first_name, last_name FROM users 
    WHERE email = ? AND password_hash = ?
""", (email, hash_password(password)))
```

### Récupérer les Données de Cycle
```python
# Cycle actuel
cursor.execute("""
    SELECT * FROM cycles 
    WHERE user_id = ? AND is_current = 1
""", (user_id,))
```

### Prédictions de Fertilité
```python
# Dernières prédictions
cursor.execute("""
    SELECT * FROM predictions 
    WHERE user_id = ? 
    ORDER BY prediction_date DESC LIMIT 1
""", (user_id,))
```

## 📁 Fichiers Générés

- `terranofertility.db` (77 KB) - Base de données principale
- `backup_YYYYMMDD_HHMMSS.zip` - Archives de sauvegarde
- Scripts Python pour gestion et exploration

## 🎯 Prêt pour Production

La base de données est complètement configurée et prête à être utilisée avec l'application TerranoFertility. Elle contient :

✅ **Structure complète** avec toutes les tables nécessaires  
✅ **Données de test réalistes** pour 3 utilisatrices  
✅ **Relations et contraintes** bien définies  
✅ **Index optimisés** pour les performances  
✅ **Scripts de gestion** complets  
✅ **Sauvegarde automatique** configurée  

La base peut être directement intégrée dans l'application Flask pour un fonctionnement immédiat !

