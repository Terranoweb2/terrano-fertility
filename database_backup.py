#!/usr/bin/env python3
"""
Script de sauvegarde et restauration de la base de données TerranoFertility
"""

import sqlite3
import json
import os
import shutil
from datetime import datetime
import zipfile

def backup_database():
    """Créer une sauvegarde complète de la base de données"""
    if not os.path.exists('terranofertility.db'):
        print("❌ Base de données non trouvée")
        return None
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = f"backup_{timestamp}"
    os.makedirs(backup_dir, exist_ok=True)
    
    print(f"💾 Création de la sauvegarde dans {backup_dir}/")
    
    # 1. Copie du fichier de base de données
    db_backup = os.path.join(backup_dir, 'terranofertility.db')
    shutil.copy2('terranofertility.db', db_backup)
    print("✅ Fichier de base de données copié")
    
    # 2. Export SQL
    conn = sqlite3.connect('terranofertility.db')
    sql_backup = os.path.join(backup_dir, 'terranofertility_dump.sql')
    with open(sql_backup, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            f.write('%s\n' % line)
    print("✅ Dump SQL créé")
    
    # 3. Export JSON de toutes les données
    cursor = conn.cursor()
    json_backup = os.path.join(backup_dir, 'terranofertility_data.json')
    
    data = {}
    tables = ['users', 'cycles', 'daily_data', 'predictions', 'chat_history', 'user_settings', 'notifications']
    
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        data[table] = [dict(zip(columns, row)) for row in rows]
    
    with open(json_backup, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    print("✅ Export JSON créé")
    
    # 4. Informations de sauvegarde
    info_file = os.path.join(backup_dir, 'backup_info.txt')
    with open(info_file, 'w', encoding='utf-8') as f:
        f.write(f"Sauvegarde TerranoFertility\n")
        f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Taille DB: {os.path.getsize('terranofertility.db')} bytes\n")
        
        # Statistiques
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            f.write(f"Table {table}: {count} enregistrements\n")
    
    conn.close()
    print("✅ Informations de sauvegarde créées")
    
    # 5. Créer une archive ZIP
    zip_file = f"{backup_dir}.zip"
    with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(backup_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, backup_dir)
                zipf.write(file_path, arcname)
    
    print(f"✅ Archive ZIP créée: {zip_file}")
    
    # Nettoyer le dossier temporaire
    shutil.rmtree(backup_dir)
    
    print(f"🎉 Sauvegarde terminée: {zip_file}")
    return zip_file

def restore_database(backup_file):
    """Restaurer la base de données depuis une sauvegarde"""
    if not os.path.exists(backup_file):
        print(f"❌ Fichier de sauvegarde non trouvé: {backup_file}")
        return False
    
    print(f"🔄 Restauration depuis {backup_file}")
    
    # Extraire l'archive
    extract_dir = "restore_temp"
    with zipfile.ZipFile(backup_file, 'r') as zipf:
        zipf.extractall(extract_dir)
    
    # Sauvegarder la base actuelle si elle existe
    if os.path.exists('terranofertility.db'):
        backup_current = f"terranofertility_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        shutil.copy2('terranofertility.db', backup_current)
        print(f"✅ Base actuelle sauvegardée: {backup_current}")
    
    # Restaurer la base de données
    restored_db = os.path.join(extract_dir, 'terranofertility.db')
    if os.path.exists(restored_db):
        shutil.copy2(restored_db, 'terranofertility.db')
        print("✅ Base de données restaurée")
    else:
        print("❌ Fichier de base de données non trouvé dans la sauvegarde")
        return False
    
    # Nettoyer
    shutil.rmtree(extract_dir)
    
    print("🎉 Restauration terminée avec succès")
    return True

def list_backups():
    """Lister toutes les sauvegardes disponibles"""
    backups = [f for f in os.listdir('.') if f.startswith('backup_') and f.endswith('.zip')]
    
    if not backups:
        print("📁 Aucune sauvegarde trouvée")
        return []
    
    print(f"📁 Sauvegardes disponibles ({len(backups)}):")
    for i, backup in enumerate(sorted(backups), 1):
        size = os.path.getsize(backup)
        mtime = datetime.fromtimestamp(os.path.getmtime(backup))
        print(f"   {i}. {backup}")
        print(f"      📅 {mtime.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"      📦 {size:,} bytes")
    
    return sorted(backups)

def verify_database():
    """Vérifier l'intégrité de la base de données"""
    if not os.path.exists('terranofertility.db'):
        print("❌ Base de données non trouvée")
        return False
    
    print("🔍 Vérification de l'intégrité de la base de données...")
    
    try:
        conn = sqlite3.connect('terranofertility.db')
        cursor = conn.cursor()
        
        # Vérification de l'intégrité SQLite
        cursor.execute("PRAGMA integrity_check")
        result = cursor.fetchone()[0]
        
        if result == 'ok':
            print("✅ Intégrité SQLite: OK")
        else:
            print(f"❌ Problème d'intégrité: {result}")
            return False
        
        # Vérification des tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        expected_tables = ['users', 'cycles', 'daily_data', 'predictions', 'chat_history', 'user_settings', 'notifications']
        
        missing_tables = set(expected_tables) - set(tables)
        if missing_tables:
            print(f"❌ Tables manquantes: {missing_tables}")
            return False
        
        print(f"✅ Toutes les tables présentes ({len(tables)} tables)")
        
        # Vérification des données
        for table in expected_tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   📋 {table}: {count} enregistrements")
        
        conn.close()
        print("🎉 Base de données vérifiée avec succès")
        return True
        
    except sqlite3.Error as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False

def main():
    """Menu principal"""
    while True:
        print("\n" + "="*60)
        print("💾 GESTIONNAIRE DE SAUVEGARDE TERRANOFERTILITY")
        print("="*60)
        print("1. 💾 Créer une sauvegarde")
        print("2. 🔄 Restaurer depuis une sauvegarde")
        print("3. 📁 Lister les sauvegardes")
        print("4. 🔍 Vérifier l'intégrité de la base")
        print("5. 📊 Informations sur la base actuelle")
        print("0. ❌ Quitter")
        
        choice = input("\n🎯 Votre choix: ").strip()
        
        if choice == '0':
            print("👋 Au revoir !")
            break
        elif choice == '1':
            backup_file = backup_database()
            if backup_file:
                print(f"✅ Sauvegarde créée: {backup_file}")
        elif choice == '2':
            backups = list_backups()
            if backups:
                try:
                    idx = int(input("Numéro de la sauvegarde à restaurer: ")) - 1
                    if 0 <= idx < len(backups):
                        restore_database(backups[idx])
                    else:
                        print("❌ Numéro invalide")
                except ValueError:
                    print("❌ Numéro invalide")
        elif choice == '3':
            list_backups()
        elif choice == '4':
            verify_database()
        elif choice == '5':
            if os.path.exists('terranofertility.db'):
                size = os.path.getsize('terranofertility.db')
                mtime = datetime.fromtimestamp(os.path.getmtime('terranofertility.db'))
                print(f"📊 Base de données actuelle:")
                print(f"   📦 Taille: {size:,} bytes")
                print(f"   📅 Modifiée: {mtime.strftime('%Y-%m-%d %H:%M:%S')}")
                verify_database()
            else:
                print("❌ Aucune base de données trouvée")
        else:
            print("❌ Choix invalide")
        
        input("\n⏸️ Appuyez sur Entrée pour continuer...")

if __name__ == "__main__":
    main()

