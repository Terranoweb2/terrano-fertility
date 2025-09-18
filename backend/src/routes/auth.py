from flask import Blueprint, request, jsonify
from src.models.user import User, db
from src.models.cycle import Cycle
from src.models.daily_data import DailyData
from src.models.prediction import Prediction
from src.models.chat_history import ChatHistory
from datetime import datetime, date
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"
    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une majuscule"
    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une minuscule"
    if not re.search(r'\d', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"
    return True, "Mot de passe valide"

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Validation de l'email
        if not validate_email(data['email']):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        # Vérifier si l'utilisateur existe déjà
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Un utilisateur avec cet email existe déjà'}), 409
        
        # Validation du mot de passe
        is_valid, message = validate_password(data['password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Créer le nouvel utilisateur
        user = User(
            email=data['email'].lower().strip(),
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            average_cycle_length=data.get('average_cycle_length', 28),
            average_period_length=data.get('average_period_length', 5)
        )
        
        # Traiter la date de naissance si fournie
        if data.get('birth_date'):
            try:
                user.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Générer le token
        token = user.generate_token()
        
        return jsonify({
            'message': 'Utilisateur créé avec succès',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création de l\'utilisateur: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email et mot de passe requis'}), 400
        
        user = User.query.filter_by(email=data['email'].lower().strip()).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
        
        token = user.generate_token()
        
        return jsonify({
            'message': 'Connexion réussie',
            'user': user.to_dict(),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la connexion: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        user = User.verify_token(token)
        if not user:
            return jsonify({'error': 'Token invalide ou expiré'}), 401
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération du profil: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user = User.verify_token(token)
        if not user:
            return jsonify({'error': 'Token invalide ou expiré'}), 401
        
        data = request.get_json()
        
        # Mettre à jour les champs autorisés
        if 'first_name' in data:
            user.first_name = data['first_name'].strip()
        if 'last_name' in data:
            user.last_name = data['last_name'].strip()
        if 'birth_date' in data and data['birth_date']:
            try:
                user.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        if 'average_cycle_length' in data:
            user.average_cycle_length = data['average_cycle_length']
        if 'average_period_length' in data:
            user.average_period_length = data['average_period_length']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profil mis à jour avec succès',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du profil: {str(e)}'}), 500

