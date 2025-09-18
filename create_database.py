#!/usr/bin/env python3
"""
Script d'initialisation de la base de données TerranoFertility
Crée toutes les tables nécessaires et insère des données de test
"""

import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
import os

def hash_password(password):
    """Hasher un mot de passe avec SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_database():
    """Créer la base de données et toutes les tables"""
    
    # Supprimer l'ancienne base si elle existe
    if os.path.exists('terranofertility.db'):
        os.remove('terranofertility.db')
        print("✅ Ancienne base de données supprimée")
    
    # Connexion à la base de données
    conn = sqlite3.connect('terranofertility.db')
    cursor = conn.cursor()
    
    print("🗄️ Création de la base de données TerranoFertility...")
    
    # Table Users
    cursor.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        birth_date DATE,
        average_cycle_length INTEGER DEFAULT 28,
        average_period_length INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    print("✅ Table 'users' créée")
    
    # Table Cycles
    cursor.execute('''
    CREATE TABLE cycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        cycle_length INTEGER,
        period_length INTEGER,
        ovulation_date DATE,
        is_current BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')
    print("✅ Table 'cycles' créée")
    
    # Table Daily Data
    cursor.execute('''
    CREATE TABLE daily_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cycle_id INTEGER,
        date DATE NOT NULL,
        basal_temperature REAL,
        cervical_mucus VARCHAR(50),
        mood VARCHAR(50),
        symptoms TEXT,
        flow_intensity VARCHAR(20),
        sexual_activity BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (cycle_id) REFERENCES cycles (id) ON DELETE SET NULL,
        UNIQUE(user_id, date)
    )
    ''')
    print("✅ Table 'daily_data' créée")
    
    # Table Predictions
    cursor.execute('''
    CREATE TABLE predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cycle_id INTEGER,
        prediction_date DATE NOT NULL,
        ovulation_date DATE,
        fertile_window_start DATE,
        fertile_window_end DATE,
        next_period_date DATE,
        fertility_score REAL,
        confidence_level REAL,
        algorithm_version VARCHAR(20) DEFAULT '1.0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (cycle_id) REFERENCES cycles (id) ON DELETE SET NULL
    )
    ''')
    print("✅ Table 'predictions' créée")
    
    # Table Chat History
    cursor.execute('''
    CREATE TABLE chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'general',
        ai_model VARCHAR(50) DEFAULT 'openrouter',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')
    print("✅ Table 'chat_history' créée")
    
    # Table Settings (pour les préférences utilisateur)
    cursor.execute('''
    CREATE TABLE user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, setting_key)
    )
    ''')
    print("✅ Table 'user_settings' créée")
    
    # Table Notifications
    cursor.execute('''
    CREATE TABLE notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        notification_type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        scheduled_for TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')
    print("✅ Table 'notifications' créée")
    
    # Index pour optimiser les performances
    cursor.execute('CREATE INDEX idx_users_email ON users(email)')
    cursor.execute('CREATE INDEX idx_cycles_user_id ON cycles(user_id)')
    cursor.execute('CREATE INDEX idx_daily_data_user_date ON daily_data(user_id, date)')
    cursor.execute('CREATE INDEX idx_predictions_user_id ON predictions(user_id)')
    cursor.execute('CREATE INDEX idx_chat_history_user_id ON chat_history(user_id)')
    print("✅ Index créés pour optimiser les performances")
    
    conn.commit()
    return conn, cursor

def insert_test_data(conn, cursor):
    """Insérer des données de test"""
    print("\n📊 Insertion des données de test...")
    
    # Utilisatrices de test
    test_users = [
        {
            'first_name': 'Sophie',
            'last_name': 'Martin',
            'email': 'sophie.martin@example.com',
            'password': 'MonMotDePasse123!',
            'birth_date': '1990-05-15',
            'cycle_length': 28,
            'period_length': 5
        },
        {
            'first_name': 'Marie',
            'last_name': 'Dupont',
            'email': 'marie.dupont@example.com',
            'password': 'MotDePasse456!',
            'birth_date': '1988-08-22',
            'cycle_length': 30,
            'period_length': 4
        },
        {
            'first_name': 'Emma',
            'last_name': 'Leroy',
            'email': 'emma.leroy@example.com',
            'password': 'Password789!',
            'birth_date': '1992-12-03',
            'cycle_length': 26,
            'period_length': 6
        }
    ]
    
    user_ids = []
    for user in test_users:
        cursor.execute('''
        INSERT INTO users (first_name, last_name, email, password_hash, birth_date, 
                          average_cycle_length, average_period_length)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user['first_name'], user['last_name'], user['email'],
            hash_password(user['password']), user['birth_date'],
            user['cycle_length'], user['period_length']
        ))
        user_ids.append(cursor.lastrowid)
        print(f"✅ Utilisatrice {user['first_name']} {user['last_name']} créée (ID: {cursor.lastrowid})")
    
    # Cycles de test pour Sophie (ID: 1)
    today = datetime.now().date()
    
    # Cycle actuel (en cours)
    current_cycle_start = today - timedelta(days=7)  # Commencé il y a 7 jours
    cursor.execute('''
    INSERT INTO cycles (user_id, start_date, cycle_length, period_length, is_current, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (1, current_cycle_start, 28, 5, True, "Cycle actuel en cours"))
    current_cycle_id = cursor.lastrowid
    print(f"✅ Cycle actuel créé (ID: {current_cycle_id})")
    
    # Cycles précédents
    for i in range(1, 4):  # 3 cycles précédents
        cycle_start = current_cycle_start - timedelta(days=28 * i)
        cycle_end = cycle_start + timedelta(days=28)
        ovulation_date = cycle_start + timedelta(days=14)
        
        cursor.execute('''
        INSERT INTO cycles (user_id, start_date, end_date, cycle_length, period_length, 
                           ovulation_date, is_current, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (1, cycle_start, cycle_end, 28, 5, ovulation_date, False, f"Cycle #{4-i}"))
        print(f"✅ Cycle précédent #{4-i} créé")
    
    # Données quotidiennes pour Sophie (7 derniers jours)
    moods = ['joyeuse', 'calme', 'energique', 'irritable', 'triste']
    symptoms_list = ['crampes', 'fatigue', 'maux-tete', 'ballonnements', 'sensibilite-seins']
    
    for i in range(7):
        date = today - timedelta(days=i)
        temperature = 36.2 + (i * 0.1) + (0.3 if i > 3 else 0)  # Simulation d'augmentation post-ovulation
        mood = moods[i % len(moods)]
        symptoms = symptoms_list[i % len(symptoms_list)] if i < 3 else None
        flow = 'leger' if i < 2 else None
        
        cursor.execute('''
        INSERT INTO daily_data (user_id, cycle_id, date, basal_temperature, mood, symptoms, 
                               flow_intensity, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (1, current_cycle_id, date, temperature, mood, symptoms, flow, 
              f"Données du {date.strftime('%d/%m/%Y')}"))
        print(f"✅ Données quotidiennes pour le {date.strftime('%d/%m/%Y')} créées")
    
    # Prédictions pour Sophie
    next_ovulation = current_cycle_start + timedelta(days=14)
    fertile_start = next_ovulation - timedelta(days=5)
    fertile_end = next_ovulation + timedelta(days=1)
    next_period = current_cycle_start + timedelta(days=28)
    
    cursor.execute('''
    INSERT INTO predictions (user_id, cycle_id, prediction_date, ovulation_date,
                            fertile_window_start, fertile_window_end, next_period_date,
                            fertility_score, confidence_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (1, current_cycle_id, today, next_ovulation, fertile_start, fertile_end,
          next_period, 25.5, 0.85))
    print("✅ Prédictions de fertilité créées")
    
    # Historique de chat pour Sophie
    chat_messages = [
        {
            'message': 'Comment puis-je améliorer ma fertilité naturellement ?',
            'response': 'Voici quelques conseils naturels pour améliorer votre fertilité : 1) Maintenez une alimentation équilibrée riche en acide folique, 2) Pratiquez une activité physique régulière mais modérée, 3) Gérez votre stress avec des techniques de relaxation, 4) Dormez suffisamment (7-8h par nuit), 5) Évitez le tabac et limitez l\'alcool. Vos données montrent un cycle régulier, c\'est un bon signe !',
            'type': 'fertility_advice'
        },
        {
            'message': 'Quand suis-je la plus fertile ce mois-ci ?',
            'response': f'Selon vos données, votre fenêtre de fertilité optimale se situe entre le {fertile_start.strftime("%d/%m/%Y")} et le {fertile_end.strftime("%d/%m/%Y")}, avec une ovulation prévue le {next_ovulation.strftime("%d/%m/%Y")}. C\'est le moment idéal pour concevoir !',
            'type': 'fertility_prediction'
        },
        {
            'message': 'Mes températures sont-elles normales ?',
            'response': 'Vos températures basales montrent un pattern normal avec une légère augmentation après l\'ovulation, ce qui indique un cycle ovulatoire sain. Continuez à prendre votre température chaque matin à la même heure pour des données précises.',
            'type': 'temperature_analysis'
        }
    ]
    
    for chat in chat_messages:
        cursor.execute('''
        INSERT INTO chat_history (user_id, message, response, message_type)
        VALUES (?, ?, ?, ?)
        ''', (1, chat['message'], chat['response'], chat['type']))
    print("✅ Historique de chat créé")
    
    # Paramètres utilisateur pour Sophie
    settings = [
        ('temperature_unit', 'celsius'),
        ('notifications_enabled', 'true'),
        ('reminder_time', '08:00'),
        ('language', 'fr'),
        ('theme', 'light')
    ]
    
    for key, value in settings:
        cursor.execute('''
        INSERT INTO user_settings (user_id, setting_key, setting_value)
        VALUES (?, ?, ?)
        ''', (1, key, value))
    print("✅ Paramètres utilisateur créés")
    
    # Notifications pour Sophie
    notifications = [
        {
            'title': 'Rappel température',
            'message': 'N\'oubliez pas de prendre votre température basale ce matin !',
            'type': 'reminder',
            'scheduled_for': datetime.now() + timedelta(hours=8)
        },
        {
            'title': 'Fenêtre fertile',
            'message': f'Votre fenêtre de fertilité commence demain ({fertile_start.strftime("%d/%m/%Y")}). Bonne chance !',
            'type': 'fertility_alert',
            'scheduled_for': fertile_start - timedelta(days=1)
        }
    ]
    
    for notif in notifications:
        cursor.execute('''
        INSERT INTO notifications (user_id, title, message, notification_type, scheduled_for)
        VALUES (?, ?, ?, ?, ?)
        ''', (1, notif['title'], notif['message'], notif['type'], notif['scheduled_for']))
    print("✅ Notifications créées")
    
    conn.commit()
    print(f"\n🎉 Base de données créée avec succès !")
    print(f"📍 Fichier : {os.path.abspath('terranofertility.db')}")

def display_database_info(cursor):
    """Afficher les informations de la base de données"""
    print("\n📊 RÉSUMÉ DE LA BASE DE DONNÉES:")
    print("=" * 50)
    
    # Compter les enregistrements dans chaque table
    tables = ['users', 'cycles', 'daily_data', 'predictions', 'chat_history', 'user_settings', 'notifications']
    
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"📋 {table.upper():<20} : {count:>3} enregistrements")
    
    print("\n👥 UTILISATRICES DE TEST:")
    cursor.execute("SELECT id, first_name, last_name, email FROM users")
    users = cursor.fetchall()
    for user in users:
        print(f"   • {user[1]} {user[2]} ({user[3]}) - ID: {user[0]}")
    
    print("\n🔑 MOTS DE PASSE DE TEST:")
    print("   • Sophie Martin: MonMotDePasse123!")
    print("   • Marie Dupont: MotDePasse456!")
    print("   • Emma Leroy: Password789!")
    
    print("\n🗄️ STRUCTURE DES TABLES:")
    for table in tables:
        cursor.execute(f"PRAGMA table_info({table})")
        columns = cursor.fetchall()
        print(f"\n📋 {table.upper()}:")
        for col in columns:
            print(f"   • {col[1]} ({col[2]})")

if __name__ == "__main__":
    print("🚀 Initialisation de la base de données TerranoFertility")
    print("=" * 60)
    
    # Créer la base de données
    conn, cursor = create_database()
    
    # Insérer les données de test
    insert_test_data(conn, cursor)
    
    # Afficher les informations
    display_database_info(cursor)
    
    # Fermer la connexion
    conn.close()
    
    print("\n✅ Script terminé avec succès !")
    print("🎯 Vous pouvez maintenant utiliser la base de données 'terranofertility.db'")

