#!/usr/bin/env python3
"""
Utilitaire pour convertir les mots de passe de la base de données
de SHA-256 vers Werkzeug hash
"""

import sqlite3
import hashlib
from werkzeug.security import generate_password_hash

def convert_passwords():
    """Convertir les mots de passe SHA-256 vers Werkzeug hash"""
    
    # Connexion à la base de données
    conn = sqlite3.connect('/home/ubuntu/terranofertility-backend/src/database/app.db')
    cursor = conn.cursor()
    
    print("🔄 Conversion des mots de passe...")
    
    # Récupérer tous les utilisateurs
    cursor.execute("SELECT id, email, password_hash FROM users")
    users = cursor.fetchall()
    
    # Mots de passe de test connus
    test_passwords = {
        'sophie.martin@example.com': 'MonMotDePasse123!',
        'marie.dupont@example.com': 'MotDePasse456!',
        'emma.leroy@example.com': 'Password789!'
    }
    
    for user_id, email, current_hash in users:
        if email in test_passwords:
            # Générer le nouveau hash Werkzeug
            new_hash = generate_password_hash(test_passwords[email])
            
            # Mettre à jour dans la base
            cursor.execute("""
                UPDATE users SET password_hash = ? WHERE id = ?
            """, (new_hash, user_id))
            
            print(f"✅ Mot de passe converti pour {email}")
        else:
            print(f"⚠️ Utilisateur inconnu: {email}")
    
    conn.commit()
    conn.close()
    
    print("🎉 Conversion terminée !")

if __name__ == "__main__":
    convert_passwords()

