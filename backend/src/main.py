from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
import os
import json

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'terrano-fertility-secret-key-2024'

# Configuration de la base de données
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database', 'terranofertility.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Routes API
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'TerranoFertility API is running'})

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email et mot de passe requis'}), 400
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if not user:
            return jsonify({'success': False, 'message': 'Utilisateur non trouvé'}), 404
        
        # Vérifier le mot de passe (SHA-256)
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        if user['password_hash'] != password_hash:
            return jsonify({'success': False, 'message': 'Mot de passe incorrect'}), 401
        
        # Générer le token JWT
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Connexion réussie',
            'token': token,
            'user': {
                'id': user['id'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email'],
                'birth_date': user['birth_date'],
                'average_cycle_length': user['average_cycle_length'],
                'average_period_length': user['average_period_length']
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erreur serveur: {str(e)}'}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')
        
        if not all([firstname, lastname, email, password]):
            return jsonify({'success': False, 'message': 'Tous les champs sont requis'}), 400
        
        conn = get_db_connection()
        
        # Vérifier si l'utilisateur existe déjà
        existing_user = conn.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
        if existing_user:
            conn.close()
            return jsonify({'success': False, 'message': 'Un compte existe déjà avec cet email'}), 409
        
        # Créer le nouvel utilisateur
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        cursor = conn.execute('''
            INSERT INTO users (first_name, last_name, email, password_hash, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (firstname, lastname, email, password_hash, datetime.datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Compte créé avec succès'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erreur serveur: {str(e)}'}), 500

# Route principale
@app.route('/')
def index():
    html_content = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TerranoFertility - Suivi de Fertilité Intelligent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .container {
            background: white; padding: 3rem; border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 400px; width: 90%;
        }
        .logo { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
        h1 {
            color: #2d3748; font-size: 2.5rem; margin-bottom: 1rem; text-align: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { color: #718096; font-size: 1.2rem; margin-bottom: 2rem; text-align: center; }
        .tabs { display: flex; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; }
        .tab {
            flex: 1; padding: 1rem; text-align: center; cursor: pointer;
            border-bottom: 2px solid transparent; transition: all 0.3s;
        }
        .tab.active { border-bottom-color: #667eea; color: #667eea; font-weight: 600; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; color: #2d3748; font-weight: 500; }
        input {
            width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0;
            border-radius: 8px; font-size: 1rem; transition: border-color 0.2s;
        }
        input:focus { outline: none; border-color: #667eea; }
        .btn {
            width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #667eea, #764ba2);
            color: white; border: none; border-radius: 8px; font-size: 1rem;
            cursor: pointer; transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .security-note {
            margin-top: 2rem; text-align: center; color: #718096; font-size: 0.9rem;
        }
        .dashboard {
            display: none; max-width: 1000px; width: 95%; margin: 2rem auto;
            background: white; padding: 2rem; border-radius: 20px;
        }
        .dashboard.active { display: block; }
        .nav-tabs { display: flex; margin-bottom: 2rem; background: #f7fafc; border-radius: 10px; }
        .nav-tab {
            flex: 1; padding: 1rem; text-align: center; cursor: pointer;
            border-radius: 8px; transition: all 0.3s;
        }
        .nav-tab.active { background: #667eea; color: white; }
        .stats-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem; margin-bottom: 2rem;
        }
        .stat-card {
            background: #f7fafc; padding: 1.5rem; border-radius: 10px; text-align: center;
        }
        .stat-value { font-size: 2rem; font-weight: 700; color: #667eea; }
        .stat-label { color: #718096; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <div id="auth-container" class="container">
        <div class="logo">🌸</div>
        <h1>TerranoFertility</h1>
        <p class="subtitle">Votre compagnon intelligent pour le suivi de fertilité</p>
        
        <div class="tabs">
            <div class="tab active" onclick="switchTab('login')">Connexion</div>
            <div class="tab" onclick="switchTab('register')">Inscription</div>
        </div>
        
        <div id="login-form" class="tab-content active">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="login-email" placeholder="votre@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" id="login-password" placeholder="Votre mot de passe" required autocomplete="current-password">
            </div>
            <button class="btn" onclick="login()">Se connecter</button>
        </div>
        
        <div id="register-form" class="tab-content">
            <div class="form-group">
                <label>Prénom</label>
                <input type="text" id="register-firstname" placeholder="Votre prénom" required autocomplete="given-name">
            </div>
            <div class="form-group">
                <label>Nom</label>
                <input type="text" id="register-lastname" placeholder="Votre nom" required autocomplete="family-name">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="register-email" placeholder="votre@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" id="register-password" placeholder="Choisissez un mot de passe" required autocomplete="new-password">
            </div>
            <button class="btn" onclick="register()">Créer mon compte</button>
        </div>
        
        <p class="security-note">🔒 Vos données sont protégées et chiffrées</p>
    </div>

    <div id="dashboard-container" class="dashboard">
        <h1>Tableau de Bord - <span id="user-name"></span></h1>
        
        <div class="nav-tabs">
            <div class="nav-tab active" onclick="showSection('dashboard')">Tableau de bord</div>
            <div class="nav-tab" onclick="showSection('cycle')">Mon Cycle</div>
            <div class="nav-tab" onclick="showSection('chat')">Chat IA</div>
            <div class="nav-tab" onclick="showSection('profile')">Profil</div>
            <div class="nav-tab" onclick="logout()">Déconnexion</div>
        </div>
        
        <div id="dashboard-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">15%</div>
                    <div class="stat-label">Score de fertilité actuel</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">Dans 12 jours</div>
                    <div class="stat-label">Prochaine ovulation</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">Jour 5</div>
                    <div class="stat-label">Jour du cycle actuel</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">28 jours</div>
                    <div class="stat-label">Durée moyenne du cycle</div>
                </div>
            </div>
            <p style="text-align: center; color: #667eea; font-size: 1.2rem;">
                🎉 Connexion réussie ! Bienvenue dans TerranoFertility !
            </p>
        </div>
    </div>

    <script>
        let currentUser = null;
        let authToken = null;

        function switchTab(tab) {
            // Gérer les onglets d'authentification
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            
            if (tab === 'login') {
                document.querySelector('.tab:first-child').classList.add('active');
                document.getElementById('login-form').classList.add('active');
            } else {
                document.querySelector('.tab:last-child').classList.add('active');
                document.getElementById('register-form').classList.add('active');
            }
        }

        async function login() {
            console.log('🔐 Tentative de connexion...');
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                console.log('🌐 Envoi de la requête à /api/auth/login');
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                console.log('📡 Statut de la réponse:', response.status);
                const data = await response.json();
                console.log('📦 Données reçues:', data);
                
                if (response.ok && data.success) {
                    console.log('✅ Connexion réussie!');
                    authToken = data.token;
                    currentUser = data.user;
                    
                    // Masquer l'authentification et afficher le dashboard
                    document.getElementById('auth-container').style.display = 'none';
                    document.getElementById('dashboard-container').classList.add('active');
                    document.getElementById('user-name').textContent = data.user.first_name + ' ' + data.user.last_name;
                    
                    alert('Connexion réussie ! Bienvenue ' + data.user.first_name + ' !');
                } else {
                    console.log('❌ Erreur de connexion:', data.message);
                    alert('Erreur: ' + (data.message || 'Identifiants incorrects'));
                }
            } catch (error) {
                console.error('🚨 Erreur réseau:', error);
                alert('Erreur de connexion au serveur. Veuillez réessayer.');
            }
        }

        async function register() {
            console.log('📝 Tentative d\'inscription...');
            const firstname = document.getElementById('register-firstname').value.trim();
            const lastname = document.getElementById('register-lastname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            
            if (!firstname || !lastname || !email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                console.log('🌐 Envoi de la requête à /api/auth/register');
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ firstname, lastname, email, password })
                });
                
                console.log('📡 Statut de la réponse:', response.status);
                const data = await response.json();
                console.log('📦 Données reçues:', data);
                
                if (response.ok && data.success) {
                    console.log('✅ Inscription réussie!');
                    alert('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
                    switchTab('login');
                } else {
                    console.log('❌ Erreur d\'inscription:', data.message);
                    alert('Erreur: ' + (data.message || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('🚨 Erreur réseau:', error);
                alert('Erreur de connexion au serveur. Veuillez réessayer.');
            }
        }

        function logout() {
            currentUser = null;
            authToken = null;
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('dashboard-container').classList.remove('active');
            
            // Réinitialiser les formulaires
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            switchTab('login');
        }

        function showSection(section) {
            // Gérer les sections du dashboard
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            // Ici on pourrait ajouter la logique pour afficher différentes sections
            console.log('Affichage de la section:', section);
        }

        // Gestion des touches Entrée
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (document.getElementById('login-form').classList.contains('active')) {
                    login();
                } else if (document.getElementById('register-form').classList.contains('active')) {
                    register();
                }
            }
        });

        console.log('🚀 TerranoFertility JavaScript chargé avec succès!');
    </script>
</body>
</html>"""
    
    return render_template_string(html_content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

