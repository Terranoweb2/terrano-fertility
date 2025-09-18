#!/usr/bin/env python3
"""
Explorateur de base de données TerranoFertility
Permet de visualiser et interroger les données
"""

import sqlite3
import json
from datetime import datetime
import pandas as pd

def connect_database():
    """Se connecter à la base de données"""
    try:
        conn = sqlite3.connect('terranofertility.db')
        conn.row_factory = sqlite3.Row  # Pour avoir des résultats sous forme de dictionnaire
        return conn
    except sqlite3.Error as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        return None

def show_user_profile(conn, user_id):
    """Afficher le profil complet d'une utilisatrice"""
    cursor = conn.cursor()
    
    # Informations utilisateur
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        print(f"❌ Utilisatrice avec ID {user_id} non trouvée")
        return
    
    print(f"\n👤 PROFIL DE {user['first_name'].upper()} {user['last_name'].upper()}")
    print("=" * 60)
    print(f"📧 Email: {user['email']}")
    print(f"🎂 Date de naissance: {user['birth_date']}")
    print(f"📊 Cycle moyen: {user['average_cycle_length']} jours")
    print(f"🩸 Règles moyennes: {user['average_period_length']} jours")
    print(f"📅 Inscrite le: {user['created_at']}")
    
    # Cycles
    cursor.execute("""
        SELECT * FROM cycles WHERE user_id = ? ORDER BY start_date DESC
    """, (user_id,))
    cycles = cursor.fetchall()
    
    print(f"\n🔄 CYCLES ({len(cycles)} cycles enregistrés):")
    for cycle in cycles:
        status = "🟢 ACTUEL" if cycle['is_current'] else "⚪ Terminé"
        print(f"   • Cycle #{cycle['id']} - {status}")
        print(f"     📅 Du {cycle['start_date']} au {cycle['end_date'] or 'En cours'}")
        if cycle['ovulation_date']:
            print(f"     🥚 Ovulation: {cycle['ovulation_date']}")
        if cycle['notes']:
            print(f"     📝 Notes: {cycle['notes']}")
    
    # Données quotidiennes récentes
    cursor.execute("""
        SELECT * FROM daily_data WHERE user_id = ? 
        ORDER BY date DESC LIMIT 10
    """, (user_id,))
    daily_data = cursor.fetchall()
    
    print(f"\n📊 DONNÉES QUOTIDIENNES RÉCENTES ({len(daily_data)} entrées):")
    for data in daily_data:
        print(f"   • {data['date']}:")
        if data['basal_temperature']:
            print(f"     🌡️ Température: {data['basal_temperature']}°C")
        if data['mood']:
            print(f"     😊 Humeur: {data['mood']}")
        if data['symptoms']:
            print(f"     🤒 Symptômes: {data['symptoms']}")
        if data['flow_intensity']:
            print(f"     🩸 Flux: {data['flow_intensity']}")
        if data['notes']:
            print(f"     📝 Notes: {data['notes']}")
    
    # Prédictions
    cursor.execute("""
        SELECT * FROM predictions WHERE user_id = ? 
        ORDER BY prediction_date DESC LIMIT 5
    """, (user_id,))
    predictions = cursor.fetchall()
    
    print(f"\n🔮 PRÉDICTIONS RÉCENTES ({len(predictions)} prédictions):")
    for pred in predictions:
        print(f"   • Prédiction du {pred['prediction_date']}:")
        print(f"     🥚 Ovulation prévue: {pred['ovulation_date']}")
        print(f"     💕 Fenêtre fertile: {pred['fertile_window_start']} → {pred['fertile_window_end']}")
        print(f"     🩸 Prochaines règles: {pred['next_period_date']}")
        print(f"     📊 Score fertilité: {pred['fertility_score']}%")
        print(f"     🎯 Confiance: {pred['confidence_level']*100:.1f}%")
    
    # Historique de chat
    cursor.execute("""
        SELECT * FROM chat_history WHERE user_id = ? 
        ORDER BY created_at DESC LIMIT 5
    """, (user_id,))
    chats = cursor.fetchall()
    
    print(f"\n💬 HISTORIQUE DE CHAT RÉCENT ({len(chats)} messages):")
    for chat in chats:
        print(f"   • {chat['created_at']} ({chat['message_type']}):")
        print(f"     ❓ Question: {chat['message'][:100]}...")
        print(f"     🤖 Réponse: {chat['response'][:100]}...")
    
    # Paramètres
    cursor.execute("""
        SELECT * FROM user_settings WHERE user_id = ?
    """, (user_id,))
    settings = cursor.fetchall()
    
    print(f"\n⚙️ PARAMÈTRES ({len(settings)} paramètres):")
    for setting in settings:
        print(f"   • {setting['setting_key']}: {setting['setting_value']}")

def show_database_stats(conn):
    """Afficher les statistiques globales de la base de données"""
    cursor = conn.cursor()
    
    print("\n📊 STATISTIQUES GLOBALES DE LA BASE DE DONNÉES")
    print("=" * 60)
    
    # Nombre total d'utilisatrices
    cursor.execute("SELECT COUNT(*) as count FROM users")
    user_count = cursor.fetchone()['count']
    print(f"👥 Utilisatrices: {user_count}")
    
    # Nombre total de cycles
    cursor.execute("SELECT COUNT(*) as count FROM cycles")
    cycle_count = cursor.fetchone()['count']
    print(f"🔄 Cycles: {cycle_count}")
    
    # Nombre de données quotidiennes
    cursor.execute("SELECT COUNT(*) as count FROM daily_data")
    daily_count = cursor.fetchone()['count']
    print(f"📊 Données quotidiennes: {daily_count}")
    
    # Nombre de prédictions
    cursor.execute("SELECT COUNT(*) as count FROM predictions")
    pred_count = cursor.fetchone()['count']
    print(f"🔮 Prédictions: {pred_count}")
    
    # Nombre de messages de chat
    cursor.execute("SELECT COUNT(*) as count FROM chat_history")
    chat_count = cursor.fetchone()['count']
    print(f"💬 Messages de chat: {chat_count}")
    
    # Température moyenne
    cursor.execute("SELECT AVG(basal_temperature) as avg_temp FROM daily_data WHERE basal_temperature IS NOT NULL")
    avg_temp = cursor.fetchone()['avg_temp']
    if avg_temp:
        print(f"🌡️ Température basale moyenne: {avg_temp:.2f}°C")
    
    # Durée moyenne des cycles
    cursor.execute("SELECT AVG(cycle_length) as avg_cycle FROM cycles WHERE cycle_length IS NOT NULL")
    avg_cycle = cursor.fetchone()['avg_cycle']
    if avg_cycle:
        print(f"📅 Durée moyenne des cycles: {avg_cycle:.1f} jours")
    
    # Score de fertilité moyen
    cursor.execute("SELECT AVG(fertility_score) as avg_score FROM predictions WHERE fertility_score IS NOT NULL")
    avg_score = cursor.fetchone()['avg_score']
    if avg_score:
        print(f"💕 Score de fertilité moyen: {avg_score:.1f}%")

def export_user_data(conn, user_id, format='json'):
    """Exporter toutes les données d'une utilisatrice"""
    cursor = conn.cursor()
    
    # Récupérer toutes les données
    data = {}
    
    # Profil utilisateur
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if not user:
        print(f"❌ Utilisatrice avec ID {user_id} non trouvée")
        return
    
    data['user'] = dict(user)
    
    # Cycles
    cursor.execute("SELECT * FROM cycles WHERE user_id = ?", (user_id,))
    data['cycles'] = [dict(row) for row in cursor.fetchall()]
    
    # Données quotidiennes
    cursor.execute("SELECT * FROM daily_data WHERE user_id = ?", (user_id,))
    data['daily_data'] = [dict(row) for row in cursor.fetchall()]
    
    # Prédictions
    cursor.execute("SELECT * FROM predictions WHERE user_id = ?", (user_id,))
    data['predictions'] = [dict(row) for row in cursor.fetchall()]
    
    # Chat
    cursor.execute("SELECT * FROM chat_history WHERE user_id = ?", (user_id,))
    data['chat_history'] = [dict(row) for row in cursor.fetchall()]
    
    # Paramètres
    cursor.execute("SELECT * FROM user_settings WHERE user_id = ?", (user_id,))
    data['settings'] = [dict(row) for row in cursor.fetchall()]
    
    # Notifications
    cursor.execute("SELECT * FROM notifications WHERE user_id = ?", (user_id,))
    data['notifications'] = [dict(row) for row in cursor.fetchall()]
    
    # Exporter
    filename = f"user_{user_id}_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    
    print(f"✅ Données exportées vers: {filename}")
    return filename

def interactive_menu():
    """Menu interactif pour explorer la base de données"""
    conn = connect_database()
    if not conn:
        return
    
    while True:
        print("\n" + "="*60)
        print("🗄️ EXPLORATEUR DE BASE DE DONNÉES TERRANOFERTILITY")
        print("="*60)
        print("1. 📊 Statistiques globales")
        print("2. 👤 Profil utilisatrice (Sophie Martin - ID: 1)")
        print("3. 👤 Profil utilisatrice (Marie Dupont - ID: 2)")
        print("4. 👤 Profil utilisatrice (Emma Leroy - ID: 3)")
        print("5. 📤 Exporter données utilisatrice")
        print("6. 🔍 Requête SQL personnalisée")
        print("0. ❌ Quitter")
        
        choice = input("\n🎯 Votre choix: ").strip()
        
        if choice == '0':
            print("👋 Au revoir !")
            break
        elif choice == '1':
            show_database_stats(conn)
        elif choice in ['2', '3', '4']:
            user_id = int(choice) - 1
            show_user_profile(conn, user_id)
        elif choice == '5':
            user_id = input("ID de l'utilisatrice à exporter: ").strip()
            try:
                export_user_data(conn, int(user_id))
            except ValueError:
                print("❌ ID invalide")
        elif choice == '6':
            query = input("Requête SQL: ").strip()
            try:
                cursor = conn.cursor()
                cursor.execute(query)
                results = cursor.fetchall()
                print(f"\n📊 Résultats ({len(results)} lignes):")
                for row in results:
                    print(dict(row))
            except sqlite3.Error as e:
                print(f"❌ Erreur SQL: {e}")
        else:
            print("❌ Choix invalide")
        
        input("\n⏸️ Appuyez sur Entrée pour continuer...")
    
    conn.close()

if __name__ == "__main__":
    interactive_menu()

