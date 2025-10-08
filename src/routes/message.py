from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from src.models.message import Message
from src.models.notification import Notification
from datetime import datetime

message_bp = Blueprint('message', __name__)

@message_bp.route('/messages', methods=['GET'])
def get_conversations():
    """Récupérer toutes les conversations de l'utilisateur"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    # Récupérer toutes les conversations (derniers messages avec chaque utilisateur)
    conversations = db.session.query(Message).filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).order_by(Message.created_at.desc()).all()
    
    # Grouper par utilisateur
    user_conversations = {}
    for message in conversations:
        other_user_id = message.receiver_id if message.sender_id == user_id else message.sender_id
        if other_user_id not in user_conversations:
            user_conversations[other_user_id] = message
    
    # Convertir en liste avec informations utilisateur
    result = []
    for other_user_id, last_message in user_conversations.items():
        other_user = User.query.get(other_user_id)
        if other_user:
            # Compter les messages non lus
            unread_count = Message.query.filter(
                Message.sender_id == other_user_id,
                Message.receiver_id == user_id,
                Message.is_read == False
            ).count()
            
            result.append({
                'user': other_user.to_dict(),
                'last_message': last_message.to_dict(),
                'unread_count': unread_count
            })
    
    return jsonify(result)

@message_bp.route('/messages/<int:user_id>', methods=['GET'])
def get_messages_with_user(user_id):
    """Récupérer tous les messages avec un utilisateur spécifique"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    current_user_id = session['user_id']
    
    # Vérifier que l'utilisateur existe
    other_user = User.query.get(user_id)
    if not other_user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Récupérer tous les messages entre les deux utilisateurs
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.created_at.asc()).all()
    
    # Marquer les messages reçus comme lus
    Message.query.filter(
        Message.sender_id == user_id,
        Message.receiver_id == current_user_id,
        Message.is_read == False
    ).update({'is_read': True})
    db.session.commit()
    
    return jsonify([message.to_dict() for message in messages])

@message_bp.route('/messages', methods=['POST'])
def send_message():
    """Envoyer un nouveau message"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    sender_id = session['user_id']
    receiver_id = data.get('receiver_id')
    content = data.get('content')
    message_type = data.get('message_type', 'text')
    file_url = data.get('file_url')
    
    if not receiver_id or not content:
        return jsonify({'error': 'Destinataire et contenu requis'}), 400
    
    # Vérifier que le destinataire existe
    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({'error': 'Destinataire non trouvé'}), 404
    
    # Créer le message
    message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content,
        message_type=message_type,
        file_url=file_url
    )
    
    db.session.add(message)
    
    # Créer une notification pour le destinataire
    sender = User.query.get(sender_id)
    notification = Notification(
        user_id=receiver_id,
        type='message',
        title='Nouveau message',
        message=f'{sender.username} vous a envoyé un message',
        related_user_id=sender_id
    )
    
    db.session.add(notification)
    db.session.commit()
    
    return jsonify(message.to_dict()), 201

@message_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
def mark_message_read(message_id):
    """Marquer un message comme lu"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    message = Message.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message non trouvé'}), 404
    
    if message.receiver_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    message.is_read = True
    db.session.commit()
    
    return jsonify({'success': True})

@message_bp.route('/messages/unread-count', methods=['GET'])
def get_unread_count():
    """Récupérer le nombre total de messages non lus"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    unread_count = Message.query.filter(
        Message.receiver_id == user_id,
        Message.is_read == False
    ).count()
    
    return jsonify({'unread_count': unread_count})
