#!/usr/bin/env python3
"""
Script de test pour l'API Ami-Ami
Teste toutes les fonctionnalités principales de l'application
"""

import requests
import json
import sys

BASE_URL = "http://127.0.0.1:5000/api"

class AmiAmiTester:
    def __init__(self):
        self.session = requests.Session()
        self.user_id = None
        self.post_id = None
        
    def test_registration(self):
        """Test d'inscription d'un nouvel utilisateur"""
        print("🧪 Test d'inscription...")
        data = {
            "username": "testuser2",
            "email": "test2@example.com",
            "password": "password123"
        }
        
        response = self.session.post(f"{BASE_URL}/auth/register", json=data)
        if response.status_code == 201:
            result = response.json()
            self.user_id = result['user']['id']
            print(f"✅ Inscription réussie - ID utilisateur: {self.user_id}")
            return True
        else:
            print(f"❌ Échec inscription: {response.status_code} - {response.text}")
            return False
    
    def test_login(self):
        """Test de connexion"""
        print("🧪 Test de connexion...")
        data = {
            "email": "test2@example.com",
            "password": "password123"
        }
        
        response = self.session.post(f"{BASE_URL}/auth/login", json=data)
        if response.status_code == 200:
            print("✅ Connexion réussie")
            return True
        else:
            print(f"❌ Échec connexion: {response.status_code} - {response.text}")
            return False
    
    def test_get_current_user(self):
        """Test de récupération de l'utilisateur actuel"""
        print("🧪 Test récupération utilisateur actuel...")
        response = self.session.get(f"{BASE_URL}/auth/me")
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Utilisateur récupéré: {user['username']}")
            return True
        else:
            print(f"❌ Échec récupération utilisateur: {response.status_code}")
            return False
    
    def test_create_post(self):
        """Test de création d'un post"""
        print("🧪 Test création de post...")
        data = {
            "content": "Ceci est un post de test automatisé ! 🤖"
        }
        
        response = self.session.post(f"{BASE_URL}/posts", json=data)
        if response.status_code == 201:
            result = response.json()
            self.post_id = result['id']
            print(f"✅ Post créé - ID: {self.post_id}")
            return True
        else:
            print(f"❌ Échec création post: {response.status_code} - {response.text}")
            return False
    
    def test_get_feed(self):
        """Test de récupération du fil d'actualité"""
        print("🧪 Test récupération du fil d'actualité...")
        response = self.session.get(f"{BASE_URL}/posts")
        if response.status_code == 200:
            posts = response.json()
            print(f"✅ Fil d'actualité récupéré - {len(posts)} posts")
            return True
        else:
            print(f"❌ Échec récupération fil: {response.status_code}")
            return False
    
    def test_add_reaction(self):
        """Test d'ajout de réaction"""
        if not self.post_id:
            print("❌ Pas de post pour tester les réactions")
            return False
            
        print("🧪 Test ajout de réaction...")
        data = {"reaction_type": "like"}
        
        response = self.session.post(f"{BASE_URL}/posts/{self.post_id}/reactions", json=data)
        if response.status_code in [200, 201]:
            print("✅ Réaction ajoutée")
            return True
        else:
            print(f"❌ Échec ajout réaction: {response.status_code} - {response.text}")
            return False
    
    def test_add_comment(self):
        """Test d'ajout de commentaire"""
        if not self.post_id:
            print("❌ Pas de post pour tester les commentaires")
            return False
            
        print("🧪 Test ajout de commentaire...")
        data = {"content": "Commentaire de test automatisé !"}
        
        response = self.session.post(f"{BASE_URL}/posts/{self.post_id}/comments", json=data)
        if response.status_code == 201:
            print("✅ Commentaire ajouté")
            return True
        else:
            print(f"❌ Échec ajout commentaire: {response.status_code} - {response.text}")
            return False
    
    def test_get_users(self):
        """Test de récupération de la liste des utilisateurs"""
        print("🧪 Test récupération liste utilisateurs...")
        response = self.session.get(f"{BASE_URL}/users")
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Liste utilisateurs récupérée - {len(users)} utilisateurs")
            return True
        else:
            print(f"❌ Échec récupération utilisateurs: {response.status_code}")
            return False
    
    def test_logout(self):
        """Test de déconnexion"""
        print("🧪 Test de déconnexion...")
        response = self.session.post(f"{BASE_URL}/auth/logout")
        if response.status_code == 200:
            print("✅ Déconnexion réussie")
            return True
        else:
            print(f"❌ Échec déconnexion: {response.status_code}")
            return False
    
    def run_all_tests(self):
        """Exécute tous les tests"""
        print("🚀 Démarrage des tests de l'API Ami-Ami\n")
        
        tests = [
            self.test_registration,
            self.test_get_current_user,
            self.test_create_post,
            self.test_get_feed,
            self.test_add_reaction,
            self.test_add_comment,
            self.test_get_users,
            self.test_logout
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Ligne vide entre les tests
        
        print(f"📊 Résultats des tests: {passed}/{total} réussis")
        
        if passed == total:
            print("🎉 Tous les tests sont passés avec succès !")
            return True
        else:
            print("⚠️ Certains tests ont échoué")
            return False

if __name__ == "__main__":
    tester = AmiAmiTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
