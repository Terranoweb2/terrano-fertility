from flask import Blueprint, jsonify, request, session
from src.models.user import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Vérifier si l'utilisateur existe déjà
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilisé'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Nom d\'utilisateur déjà pris'}), 400
    
    # Créer un nouvel utilisateur
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Connecter automatiquement l'utilisateur
    session['user_id'] = user.id
    
    return jsonify({
        'message': 'Inscription réussie',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Trouver l'utilisateur par email
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({
            'message': 'Connexion réussie',
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Déconnexion réussie'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    return jsonify(user.to_dict()), 200
