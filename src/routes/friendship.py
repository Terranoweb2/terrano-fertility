from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.models.friendship import Friendship

friendship_bp = Blueprint('friendship', __name__)

def require_auth():
    if 'user_id' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    return None

@friendship_bp.route('/friends', methods=['GET'])
def get_friends():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    
    # Récupérer toutes les amitiés acceptées
    friendships = Friendship.query.filter(
        ((Friendship.user_id1 == user_id) | (Friendship.user_id2 == user_id)) &
        (Friendship.status == 'accepted')
    ).all()
    
    friends = []
    for friendship in friendships:
        friend_id = friendship.user_id2 if friendship.user_id1 == user_id else friendship.user_id1
        friend = User.query.get(friend_id)
        if friend:
            friends.append(friend.to_dict())
    
    return jsonify(friends), 200

@friendship_bp.route('/friend-requests', methods=['GET'])
def get_friend_requests():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    
    # Récupérer les demandes d'amis reçues
    requests = Friendship.query.filter_by(user_id2=user_id, status='pending').all()
    
    return jsonify([request.to_dict() for request in requests]), 200

@friendship_bp.route('/friend-requests', methods=['POST'])
def send_friend_request():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    data = request.json
    user_id = session['user_id']
    target_user_id = data['user_id']
    
    # Vérifier que l'utilisateur cible existe
    target_user = User.query.get(target_user_id)
    if not target_user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Vérifier qu'il n'y a pas déjà une demande ou une amitié
    existing = Friendship.query.filter(
        ((Friendship.user_id1 == user_id) & (Friendship.user_id2 == target_user_id)) |
        ((Friendship.user_id1 == target_user_id) & (Friendship.user_id2 == user_id))
    ).first()
    
    if existing:
        return jsonify({'error': 'Demande d\'amitié déjà existante ou amitié déjà établie'}), 400
    
    # Créer la demande d'amitié
    friendship = Friendship(
        user_id1=user_id,
        user_id2=target_user_id,
        status='pending'
    )
    
    db.session.add(friendship)
    db.session.commit()
    
    return jsonify(friendship.to_dict()), 201

@friendship_bp.route('/friend-requests/<int:request_id>/accept', methods=['POST'])
def accept_friend_request(request_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    friendship = Friendship.query.get_or_404(request_id)
    
    # Vérifier que l'utilisateur est le destinataire de la demande
    if friendship.user_id2 != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    # Accepter la demande
    friendship.status = 'accepted'
    db.session.commit()
    
    return jsonify(friendship.to_dict()), 200

@friendship_bp.route('/friend-requests/<int:request_id>/reject', methods=['POST'])
def reject_friend_request(request_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    friendship = Friendship.query.get_or_404(request_id)
    
    # Vérifier que l'utilisateur est le destinataire de la demande
    if friendship.user_id2 != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    # Rejeter la demande (supprimer l'enregistrement)
    db.session.delete(friendship)
    db.session.commit()
    
    return '', 204

@friendship_bp.route('/friendships/<int:friendship_id>', methods=['DELETE'])
def remove_friend(friendship_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    friendship = Friendship.query.get_or_404(friendship_id)
    
    # Vérifier que l'utilisateur fait partie de cette amitié
    if friendship.user_id1 != user_id and friendship.user_id2 != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    db.session.delete(friendship)
    db.session.commit()
    
    return '', 204
