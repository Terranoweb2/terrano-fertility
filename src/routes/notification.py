from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from src.models.notification import Notification
from datetime import datetime

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/notifications', methods=['GET'])
def get_notifications():
    """Récupérer toutes les notifications de l'utilisateur"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    notifications = Notification.query.filter_by(user_id=user_id)\
        .order_by(Notification.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'notifications': [notification.to_dict() for notification in notifications.items],
        'total': notifications.total,
        'pages': notifications.pages,
        'current_page': page
    })

@notification_bp.route('/notifications/unread', methods=['GET'])
def get_unread_notifications():
    """Récupérer les notifications non lues"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    notifications = Notification.query.filter_by(
        user_id=user_id,
        is_read=False
    ).order_by(Notification.created_at.desc()).limit(10).all()
    
    return jsonify([notification.to_dict() for notification in notifications])

@notification_bp.route('/notifications/count', methods=['GET'])
def get_notification_count():
    """Récupérer le nombre de notifications non lues"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    unread_count = Notification.query.filter_by(
        user_id=user_id,
        is_read=False
    ).count()
    
    return jsonify({'unread_count': unread_count})

@notification_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Marquer une notification comme lue"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'error': 'Notification non trouvée'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'success': True})

@notification_bp.route('/notifications/mark-all-read', methods=['PUT'])
def mark_all_notifications_read():
    """Marquer toutes les notifications comme lues"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    Notification.query.filter_by(
        user_id=user_id,
        is_read=False
    ).update({'is_read': True})
    
    db.session.commit()
    
    return jsonify({'success': True})

@notification_bp.route('/notifications/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    """Supprimer une notification"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    notification = Notification.query.get(notification_id)
    
    if not notification:
        return jsonify({'error': 'Notification non trouvée'}), 404
    
    if notification.user_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    db.session.delete(notification)
    db.session.commit()
    
    return jsonify({'success': True})

def create_notification(user_id, notification_type, title, message, related_user_id=None, related_post_id=None, related_group_id=None):
    """Fonction utilitaire pour créer une notification"""
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        related_user_id=related_user_id,
        related_post_id=related_post_id,
        related_group_id=related_group_id
    )
    
    db.session.add(notification)
    return notification
