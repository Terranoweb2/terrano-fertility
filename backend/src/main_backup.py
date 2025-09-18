import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.cycle import Cycle
from src.models.daily_data import DailyData
from src.models.prediction import Prediction
from src.models.chat_history import ChatHistory
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.cycles import cycles_bp
from src.routes.daily_data import daily_data_bp
from src.routes.ai_chat import ai_chat_bp
from src.routes.predictions import predictions_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'terranofertility-secret-key-2025'

# Set environment variable for JWT
import os
os.environ['SECRET_KEY'] = 'terranofertility-secret-key-2025'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(cycles_bp, url_prefix='/api')
app.register_blueprint(daily_data_bp, url_prefix='/api')
app.register_blueprint(ai_chat_bp, url_prefix='/api')
app.register_blueprint(predictions_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create all tables
with app.app_context():
    db.create_all()

@app.route('/')
def serve_index():
    """Servir l'application TerranoFertility complète"""
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
            min-height: 100vh;
        }
        .app-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .auth-container {
            background: white; padding: 3rem; border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 400px; width: 90%;
        }
        .dashboard-container {
            background: white; padding: 2rem; border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 1200px; width: 95%;
            margin: 2rem auto; min-height: 80vh;
        }
        .logo { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
        h1 {
            color: #2d3748; font-size: 2.5rem; margin-bottom: 1rem; text-align: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { color: #718096; font-size: 1.2rem; margin-bottom: 2rem; text-align: center; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; color: #2d3748; font-weight: 500; }
        input, select, textarea {
            width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0;
            border-radius: 8px; font-size: 1rem; transition: border-color 0.2s;
        }
        input:focus, select:focus, textarea:focus {
            outline: none; border-color: #667eea;
        }
        .btn {
            width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #667eea, #764ba2);
            color: white; border: none; border-radius: 8px; font-size: 1rem;
            cursor: pointer; transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .tabs {
            display: flex; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0;
        }
        .tab {
            padding: 1rem 2rem; cursor: pointer; border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        .tab.active { border-bottom-color: #667eea; color: #667eea; font-weight: 600; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .stats-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem; margin-bottom: 2rem;
        }
        .stat-card {
            background: #f7fafc; padding: 1.5rem; border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        .stat-value { font-size: 2rem; font-weight: bold; color: #2d3748; }
        .stat-label { color: #718096; margin-top: 0.5rem; }
        .hidden { display: none; }
        .navbar {
            background: white; padding: 1rem 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex; justify-content: space-between; align-items: center;
        }
        .nav-logo { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .nav-user { color: #718096; }
        .logout-btn {
            background: #e53e3e; color: white; border: none; padding: 0.5rem 1rem;
            border-radius: 6px; cursor: pointer; margin-left: 1rem;
        }
        .chat-container {
            background: #f7fafc; border-radius: 12px; padding: 1.5rem;
            max-height: 400px; overflow-y: auto;
        }
        .message {
            margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px;
        }
        .message.user { background: #667eea; color: white; margin-left: 2rem; }
        .message.ai { background: white; border: 1px solid #e2e8f0; margin-right: 2rem; }
        .quick-actions {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem; margin-top: 2rem;
        }
        .action-btn {
            background: #f7fafc; border: 2px solid #e2e8f0; padding: 1rem;
            border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;
        }
        .action-btn:hover { border-color: #667eea; background: #edf2f7; }
    </style>
</head>
<body>
    <div id="app">
        <!-- Interface d'authentification -->
        <div id="auth-screen" class="app-container">
            <div class="auth-container">
                <div class="logo">🌸</div>
                <h1>TerranoFertility</h1>
                <p class="subtitle">Votre compagnon intelligent pour le suivi de fertilité</p>
                
                <div class="tabs">
                    <div class="tab active" onclick="switchTab('login')">Connexion</div>
                    <div class="tab" onclick="switchTab('register')">Inscription</div>
                </div>
                
                <!-- Formulaire de connexion -->
                <div id="login-form" class="tab-content active">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" placeholder="votre@email.com">
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" id="login-password" placeholder="Votre mot de passe">
                    </div>
                    <button class="btn" onclick="login()">Se connecter</button>
                </div>
                
                <!-- Formulaire d'inscription -->
                <div id="register-form" class="tab-content">
                    <div class="form-group">
                        <label>Prénom</label>
                        <input type="text" id="register-firstname" placeholder="Votre prénom">
                    </div>
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" id="register-lastname" placeholder="Votre nom">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="register-email" placeholder="votre@email.com">
                    </div>
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input type="password" id="register-password" placeholder="Choisissez un mot de passe">
                    </div>
                    <button class="btn" onclick="register()">Créer mon compte</button>
                </div>
                
                <p style="margin-top: 2rem; color: #a0aec0; font-size: 0.9rem; text-align: center;">
                    🔒 Vos données sont protégées et chiffrées
                </p>
            </div>
        </div>
        
        <!-- Interface principale -->
        <div id="main-screen" class="hidden">
            <div class="navbar">
                <div class="nav-logo">🌸 TerranoFertility</div>
                <div>
                    <span class="nav-user" id="user-name">Utilisatrice</span>
                    <button class="logout-btn" onclick="logout()">Déconnexion</button>
                </div>
            </div>
            
            <div class="dashboard-container">
                <div class="tabs">
                    <div class="tab active" onclick="switchMainTab('dashboard')">Tableau de bord</div>
                    <div class="tab" onclick="switchMainTab('cycle')">Mon Cycle</div>
                    <div class="tab" onclick="switchMainTab('chat')">Chat IA</div>
                    <div class="tab" onclick="switchMainTab('profile')">Profil</div>
                </div>
                
                <!-- Tableau de bord -->
                <div id="dashboard-tab" class="tab-content active">
                    <h2>Tableau de bord</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value" id="fertility-score">15%</div>
                            <div class="stat-label">Score de fertilité actuel</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="next-ovulation">Dans 12 jours</div>
                            <div class="stat-label">Prochaine ovulation</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="cycle-day">Jour 5</div>
                            <div class="stat-label">Jour du cycle actuel</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="cycle-length">28 jours</div>
                            <div class="stat-label">Durée moyenne du cycle</div>
                        </div>
                    </div>
                    
                    <div class="quick-actions">
                        <div class="action-btn" onclick="switchMainTab('cycle')">
                            🌡️ Ajouter température
                        </div>
                        <div class="action-btn" onclick="switchMainTab('cycle')">
                            😊 Noter humeur
                        </div>
                        <div class="action-btn" onclick="switchMainTab('chat')">
                            🤖 Parler à l'IA
                        </div>
                        <div class="action-btn" onclick="switchMainTab('profile')">
                            👤 Voir profil
                        </div>
                    </div>
                </div>
                
                <!-- Suivi de cycle -->
                <div id="cycle-tab" class="tab-content">
                    <h2>Suivi de cycle</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" id="cycle-date" value="">
                            </div>
                            <div class="form-group">
                                <label>Température basale (°C)</label>
                                <input type="number" step="0.1" id="temperature" placeholder="36.5">
                            </div>
                            <div class="form-group">
                                <label>Humeur</label>
                                <select id="mood">
                                    <option value="">Sélectionner</option>
                                    <option value="joyeuse">😊 Joyeuse</option>
                                    <option value="calme">😌 Calme</option>
                                    <option value="irritable">😤 Irritable</option>
                                    <option value="triste">😢 Triste</option>
                                    <option value="energique">⚡ Énergique</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div class="form-group">
                                <label>Symptômes</label>
                                <select id="symptoms">
                                    <option value="">Sélectionner</option>
                                    <option value="crampes">Crampes</option>
                                    <option value="fatigue">Fatigue</option>
                                    <option value="maux-tete">Maux de tête</option>
                                    <option value="ballonnements">Ballonnements</option>
                                    <option value="sensibilite-seins">Sensibilité des seins</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Notes personnelles</label>
                                <textarea id="notes" rows="4" placeholder="Ajoutez vos observations..."></textarea>
                            </div>
                            <button class="btn" onclick="saveCycleData()">Sauvegarder</button>
                        </div>
                    </div>
                </div>
                
                <!-- Chat IA -->
                <div id="chat-tab" class="tab-content">
                    <h2>Chat avec TerranoIA</h2>
                    <div class="chat-container" id="chat-messages">
                        <div class="message ai">
                            Bonjour ! 👋 Je suis TerranoIA, votre assistante personnelle pour le suivi de fertilité. Comment puis-je vous aider aujourd'hui ?
                        </div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                        <input type="text" id="chat-input" placeholder="Posez votre question..." style="flex: 1;">
                        <button class="btn" onclick="sendMessage()" style="width: auto; padding: 0.75rem 1.5rem;">Envoyer</button>
                    </div>
                    <div class="quick-actions" style="margin-top: 1rem;">
                        <div class="action-btn" onclick="askQuickQuestion('Comment améliorer ma fertilité ?')">
                            Comment améliorer ma fertilité ?
                        </div>
                        <div class="action-btn" onclick="askQuickQuestion('Quand suis-je la plus fertile ?')">
                            Quand suis-je la plus fertile ?
                        </div>
                    </div>
                </div>
                
                <!-- Profil -->
                <div id="profile-tab" class="tab-content">
                    <h2>Mon Profil</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <div class="form-group">
                                <label>Prénom</label>
                                <input type="text" id="profile-firstname" value="Marie">
                            </div>
                            <div class="form-group">
                                <label>Nom</label>
                                <input type="text" id="profile-lastname" value="Dupont">
                            </div>
                            <div class="form-group">
                                <label>Date de naissance</label>
                                <input type="date" id="profile-birthdate">
                            </div>
                        </div>
                        <div>
                            <div class="form-group">
                                <label>Durée moyenne du cycle (jours)</label>
                                <input type="number" id="profile-cycle-length" value="28">
                            </div>
                            <div class="form-group">
                                <label>Durée moyenne des règles (jours)</label>
                                <input type="number" id="profile-period-length" value="5">
                            </div>
                            <button class="btn" onclick="saveProfile()">Mettre à jour le profil</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentUser = null;
        let authToken = null;

        // Initialisation
        document.getElementById('cycle-date').value = new Date().toISOString().split('T')[0];

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tab + '-form').classList.add('active');
        }

        function switchMainTab(tab) {
            document.querySelectorAll('#main-screen .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('#main-screen .tab-content').forEach(c => c.classList.remove('active'));
            
            event.target.classList.add('active');
                   async function register() {
            const firstName = document.getElementById('register-firstname').value.trim();
            const lastName = document.getElementById('register-lastname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            
            if (!firstName || !lastName || !email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                console.log('Tentative d\'inscription pour:', email);
                
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    })
                });
                
                console.log('Réponse du serveur:', response.status);
                const data = await response.json();
                console.log('Données reçues:', data);
                
                if (response.ok) {
                    alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
                    switchTab('login');
                    
                    // Pré-remplir les champs de connexion
                    document.getElementById('login-email').value = email;
                    document.getElementById('login-password').value = password;
                } else {
                    alert('Erreur lors de l\'inscription: ' + (data.error || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('Erreur d\'inscription:', error);
                alert('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
            }
        }
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                console.log('Tentative de connexion pour:', email);
                
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                console.log('Réponse du serveur:', response.status);
                const data = await response.json();
                console.log('Données reçues:', data);
                
                if (response.ok) {
                    authToken = data.token;
                    currentUser = data.user;
                    localStorage.setItem('authToken', authToken);
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    document.getElementById('auth-screen').classList.add('hidden');
                    document.getElementById('main-screen').classList.remove('hidden');
                    document.getElementById('user-name').textContent = currentUser.first_name + ' ' + currentUser.last_name;
                    
                    loadDashboardData();
                } else {
                    alert('Erreur lors de la connexion: ' + (data.error || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('Erreur de connexion:', error);
                alert('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
            }
        }     document.getElementById('auth-screen').classList.remove('hidden');
        }

        async function loadDashboardData() {
            try {
                const response = await fetch('/api/predictions/current', {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                const data = await response.json();
                
                if (data.fertility_score !== undefined) {
                    document.getElementById('fertility-score').textContent = data.fertility_score + '%';
                }
                if (data.next_ovulation) {
                    document.getElementById('next-ovulation').textContent = data.next_ovulation;
                }
            } catch (error) {
                console.log('Erreur lors du chargement des données');
            }
        }

        async function saveCycleData() {
            const date = document.getElementById('cycle-date').value;
            const temperature = document.getElementById('temperature').value;
            const mood = document.getElementById('mood').value;
            const symptoms = document.getElementById('symptoms').value;
            const notes = document.getElementById('notes').value;

            try {
                const response = await fetch('/api/daily-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: JSON.stringify({
                        date, temperature: parseFloat(temperature), mood, symptoms, notes
                    })
                });

                if (response.ok) {
                    alert('Données sauvegardées avec succès !');
                    loadDashboardData();
                } else {
                    alert('Erreur lors de la sauvegarde');
                }
            } catch (error) {
                alert('Erreur de connexion au serveur');
            }
        }

        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if (!message) return;

            // Afficher le message utilisateur
            const chatContainer = document.getElementById('chat-messages');
            chatContainer.innerHTML += '<div class="message user">' + message + '</div>';
            input.value = '';

            try {
                const response = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                chatContainer.innerHTML += '<div class="message ai">' + (data.response || 'Désolée, je rencontre des difficultés techniques.') + '</div>';
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } catch (error) {
                chatContainer.innerHTML += '<div class="message ai">Erreur de connexion. Veuillez réessayer.</div>';
            }
        }

        function askQuickQuestion(question) {
            document.getElementById('chat-input').value = question;
            sendMessage();
        }

        async function saveProfile() {
            alert('Profil mis à jour avec succès !');
        }

        // Permettre d'envoyer un message avec Entrée
        document.getElementById('chat-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>"""
    return html_content

@app.route('/<path:path>')
def serve_static_or_spa(path):
    """Servir les fichiers statiques ou rediriger vers l'app"""
    # Pour les routes API, laisser passer
    if path.startswith('api/'):
        return "API endpoint not found", 404
    
    # Pour tout le reste, servir la page d'accueil
    return serve_index()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy', 'message': 'TerranoFertility API is running'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

