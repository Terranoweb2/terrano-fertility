#!/usr/bin/env python3
"""
Script de test complet pour toutes les fonctionnalités avancées d'Ami-Ami
"""

import requests
import json
import time
import os
from datetime import datetime

class AmiAmiTester:
    def __init__(self, base_url="http://127.0.0.1:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.user_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Enregistrer le résultat d'un test"""
        result = {
            'test': test_name,
            'success': success,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def test_health_check(self):
        """Test de santé de l'API"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                data = response.json()
                features = data.get('features', [])
                self.log_test("Health Check", True, f"API active avec {len(features)} fonctionnalités")
                return True
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Erreur: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test d'inscription utilisateur"""
        try:
            user_data = {
                'username': f'testuser_{int(time.time())}',
                'email': f'test_{int(time.time())}@amiami.com',
                'password': 'testpass123',
                'confirm_password': 'testpass123'
            }
            
            response = self.session.post(f"{self.base_url}/api/auth/register", json=user_data)
            if response.status_code == 201:
                self.log_test("User Registration", True, f"Utilisateur {user_data['username']} créé")
                return user_data
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}")
                return None
        except Exception as e:
            self.log_test("User Registration", False, f"Erreur: {str(e)}")
            return None
    
    def test_user_login(self, user_data):
        """Test de connexion utilisateur"""
        try:
            login_data = {
                'email': user_data['email'],
                'password': user_data['password']
            }
            
            response = self.session.post(f"{self.base_url}/api/auth/login", json=login_data)
            if response.status_code == 200:
                self.log_test("User Login", True, "Connexion réussie")
                return True
            else:
                self.log_test("User Login", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("User Login", False, f"Erreur: {str(e)}")
            return False
    
    def test_post_creation(self):
        """Test de création de post"""
        try:
            post_data = {
                'content': f'Test post créé le {datetime.now().strftime("%Y-%m-%d %H:%M:%S")} 🚀',
                'privacy': 'public'
            }
            
            response = self.session.post(f"{self.base_url}/api/posts", json=post_data)
            if response.status_code == 201:
                data = response.json()
                post_id = data.get('post', {}).get('id')
                self.log_test("Post Creation", True, f"Post {post_id} créé")
                return post_id
            else:
                self.log_test("Post Creation", False, f"Status: {response.status_code}")
                return None
        except Exception as e:
            self.log_test("Post Creation", False, f"Erreur: {str(e)}")
            return None
    
    def test_post_reaction(self, post_id):
        """Test de réaction à un post"""
        try:
            reaction_data = {
                'post_id': post_id,
                'reaction_type': 'like'
            }
            
            response = self.session.post(f"{self.base_url}/api/reactions", json=reaction_data)
            if response.status_code == 201:
                self.log_test("Post Reaction", True, f"Réaction ajoutée au post {post_id}")
                return True
            else:
                self.log_test("Post Reaction", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Post Reaction", False, f"Erreur: {str(e)}")
            return False
    
    def test_comment_creation(self, post_id):
        """Test de création de commentaire"""
        try:
            comment_data = {
                'post_id': post_id,
                'content': f'Commentaire de test - {datetime.now().strftime("%H:%M:%S")}'
            }
            
            response = self.session.post(f"{self.base_url}/api/comments", json=comment_data)
            if response.status_code == 201:
                data = response.json()
                comment_id = data.get('comment', {}).get('id')
                self.log_test("Comment Creation", True, f"Commentaire {comment_id} créé")
                return comment_id
            else:
                self.log_test("Comment Creation", False, f"Status: {response.status_code}")
                return None
        except Exception as e:
            self.log_test("Comment Creation", False, f"Erreur: {str(e)}")
            return None
    
    def test_posts_feed(self):
        """Test du fil d'actualité"""
        try:
            response = self.session.get(f"{self.base_url}/api/posts")
            if response.status_code == 200:
                data = response.json()
                posts = data.get('posts', [])
                self.log_test("Posts Feed", True, f"{len(posts)} posts récupérés")
                return True
            else:
                self.log_test("Posts Feed", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Posts Feed", False, f"Erreur: {str(e)}")
            return False
    
    def test_user_search(self):
        """Test de recherche d'utilisateurs"""
        try:
            response = self.session.get(f"{self.base_url}/api/users")
            if response.status_code == 200:
                data = response.json()
                users = data.get('users', [])
                self.log_test("User Search", True, f"{len(users)} utilisateurs trouvés")
                return users
            else:
                self.log_test("User Search", False, f"Status: {response.status_code}")
                return []
        except Exception as e:
            self.log_test("User Search", False, f"Erreur: {str(e)}")
            return []
    
    def test_friendship_request(self, users):
        """Test de demande d'amitié"""
        if not users or len(users) < 2:
            self.log_test("Friendship Request", False, "Pas assez d'utilisateurs pour tester")
            return False
            
        try:
            target_user = users[0]  # Premier utilisateur trouvé
            friend_data = {
                'friend_id': target_user.get('id')
            }
            
            response = self.session.post(f"{self.base_url}/api/friendships", json=friend_data)
            if response.status_code in [201, 409]:  # 409 si déjà amis
                self.log_test("Friendship Request", True, f"Demande envoyée à {target_user.get('username')}")
                return True
            else:
                self.log_test("Friendship Request", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Friendship Request", False, f"Erreur: {str(e)}")
            return False
    
    def test_notifications(self):
        """Test du système de notifications"""
        try:
            response = self.session.get(f"{self.base_url}/api/notifications")
            if response.status_code == 200:
                data = response.json()
                notifications = data.get('notifications', [])
                self.log_test("Notifications", True, f"{len(notifications)} notifications")
                return True
            else:
                self.log_test("Notifications", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Notifications", False, f"Erreur: {str(e)}")
            return False
    
    def test_advanced_search(self):
        """Test de recherche avancée"""
        try:
            search_params = {
                'q': 'test',
                'type': 'posts'
            }
            
            response = self.session.get(f"{self.base_url}/api/search", params=search_params)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                self.log_test("Advanced Search", True, f"{len(results)} résultats trouvés")
                return True
            else:
                self.log_test("Advanced Search", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Advanced Search", False, f"Erreur: {str(e)}")
            return False
    
    def test_groups_functionality(self):
        """Test des fonctionnalités de groupes"""
        try:
            # Créer un groupe
            group_data = {
                'name': f'Groupe Test {int(time.time())}',
                'description': 'Groupe créé pour les tests automatisés',
                'privacy': 'public'
            }
            
            response = self.session.post(f"{self.base_url}/api/groups", json=group_data)
            if response.status_code == 201:
                data = response.json()
                group_id = data.get('group', {}).get('id')
                self.log_test("Group Creation", True, f"Groupe {group_id} créé")
                
                # Lister les groupes
                response = self.session.get(f"{self.base_url}/api/groups")
                if response.status_code == 200:
                    data = response.json()
                    groups = data.get('groups', [])
                    self.log_test("Groups List", True, f"{len(groups)} groupes listés")
                    return True
                else:
                    self.log_test("Groups List", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Group Creation", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Groups Functionality", False, f"Erreur: {str(e)}")
            return False
    
    def test_ai_features(self):
        """Test des fonctionnalités IA (simulation)"""
        try:
            # Test de génération de contenu IA
            ai_data = {
                'prompt': 'Génère une suggestion de post pour un réseau social',
                'type': 'content_generation'
            }
            
            response = self.session.post(f"{self.base_url}/api/ai/generate", json=ai_data)
            if response.status_code in [200, 501]:  # 501 si non implémenté
                self.log_test("AI Content Generation", True, "Endpoint IA accessible")
                
                # Test de recommandations
                response = self.session.get(f"{self.base_url}/api/ai/recommendations")
                if response.status_code in [200, 501]:
                    self.log_test("AI Recommendations", True, "Endpoint recommandations accessible")
                    return True
                else:
                    self.log_test("AI Recommendations", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("AI Content Generation", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("AI Features", False, f"Erreur: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Exécuter tous les tests"""
        print("🚀 Démarrage des tests Ami-Ami Advanced Features")
        print("=" * 60)
        
        # Tests de base
        if not self.test_health_check():
            print("❌ Impossible de continuer - API non accessible")
            return
        
        # Tests d'authentification
        user_data = self.test_user_registration()
        if user_data:
            self.test_user_login(user_data)
        
        # Tests de contenu
        post_id = self.test_post_creation()
        if post_id:
            self.test_post_reaction(post_id)
            self.test_comment_creation(post_id)
        
        # Tests de social
        self.test_posts_feed()
        users = self.test_user_search()
        self.test_friendship_request(users)
        
        # Tests de fonctionnalités avancées
        self.test_notifications()
        self.test_advanced_search()
        self.test_groups_functionality()
        self.test_ai_features()
        
        # Résumé des résultats
        self.print_summary()
    
    def print_summary(self):
        """Afficher le résumé des tests"""
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total des tests: {total_tests}")
        print(f"✅ Réussis: {passed_tests}")
        print(f"❌ Échoués: {failed_tests}")
        print(f"📈 Taux de réussite: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ Tests échoués:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n🎉 Tests terminés!")
        
        # Sauvegarder les résultats
        with open('test_results.json', 'w') as f:
            json.dump(self.test_results, f, indent=2)
        print("📄 Résultats sauvegardés dans test_results.json")

if __name__ == "__main__":
    # Vérifier si le serveur est en cours d'exécution
    import sys
    
    base_url = "http://127.0.0.1:5000"
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    
    tester = AmiAmiTester(base_url)
    tester.run_all_tests()
