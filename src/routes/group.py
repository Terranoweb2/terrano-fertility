from flask import Blueprint, request, jsonify, session
from src.models.user import db, User
from src.models.group import Group, GroupMembership
from src.models.notification import Notification
from datetime import datetime

group_bp = Blueprint('group', __name__)

@group_bp.route('/groups', methods=['GET'])
def get_groups():
    """Récupérer tous les groupes de l'utilisateur"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    # Récupérer les groupes dont l'utilisateur est membre
    memberships = GroupMembership.query.filter_by(user_id=user_id).all()
    groups = [membership.group.to_dict() for membership in memberships]
    
    return jsonify(groups)

@group_bp.route('/groups', methods=['POST'])
def create_group():
    """Créer un nouveau groupe"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    creator_id = session['user_id']
    name = data.get('name')
    description = data.get('description', '')
    is_private = data.get('is_private', True)
    
    if not name:
        return jsonify({'error': 'Nom du groupe requis'}), 400
    
    # Créer le groupe
    group = Group(
        name=name,
        description=description,
        creator_id=creator_id,
        is_private=is_private
    )
    
    db.session.add(group)
    db.session.flush()  # Pour obtenir l'ID du groupe
    
    # Ajouter le créateur comme membre admin
    membership = GroupMembership(
        group_id=group.id,
        user_id=creator_id,
        role='admin'
    )
    
    db.session.add(membership)
    db.session.commit()
    
    return jsonify(group.to_dict()), 201

@group_bp.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    """Récupérer les détails d'un groupe"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    # Vérifier que l'utilisateur est membre du groupe
    membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Accès non autorisé'}), 403
    
    # Récupérer tous les membres
    members = GroupMembership.query.filter_by(group_id=group_id).all()
    group_data = group.to_dict()
    group_data['members'] = [member.to_dict() for member in members]
    group_data['user_role'] = membership.role
    
    return jsonify(group_data)

@group_bp.route('/groups/<int:group_id>/members', methods=['POST'])
def add_member():
    """Ajouter un membre au groupe"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    user_id = session['user_id']
    group_id = group_id
    new_member_id = data.get('user_id')
    
    if not new_member_id:
        return jsonify({'error': 'ID utilisateur requis'}), 400
    
    # Vérifier que l'utilisateur actuel est admin du groupe
    membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()
    
    if not membership or membership.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Permissions insuffisantes'}), 403
    
    # Vérifier que le nouvel utilisateur existe
    new_user = User.query.get(new_member_id)
    if not new_user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Vérifier que l'utilisateur n'est pas déjà membre
    existing_membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=new_member_id
    ).first()
    
    if existing_membership:
        return jsonify({'error': 'Utilisateur déjà membre'}), 400
    
    # Ajouter le membre
    new_membership = GroupMembership(
        group_id=group_id,
        user_id=new_member_id,
        role='member'
    )
    
    db.session.add(new_membership)
    
    # Créer une notification
    group = Group.query.get(group_id)
    notification = Notification(
        user_id=new_member_id,
        type='group_invite',
        title='Invitation à un groupe',
        message=f'Vous avez été ajouté au groupe "{group.name}"',
        related_user_id=user_id,
        related_group_id=group_id
    )
    
    db.session.add(notification)
    db.session.commit()
    
    return jsonify(new_membership.to_dict()), 201

@group_bp.route('/groups/<int:group_id>/members/<int:member_id>', methods=['DELETE'])
def remove_member(group_id, member_id):
    """Retirer un membre du groupe"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    # Vérifier que l'utilisateur actuel est admin du groupe ou se retire lui-même
    membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Non membre du groupe'}), 403
    
    if user_id != member_id and membership.role not in ['admin', 'moderator']:
        return jsonify({'error': 'Permissions insuffisantes'}), 403
    
    # Trouver le membre à retirer
    member_membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=member_id
    ).first()
    
    if not member_membership:
        return jsonify({'error': 'Membre non trouvé'}), 404
    
    # Ne pas permettre au créateur de se retirer s'il est le seul admin
    group = Group.query.get(group_id)
    if member_id == group.creator_id:
        admin_count = GroupMembership.query.filter_by(
            group_id=group_id,
            role='admin'
        ).count()
        if admin_count <= 1:
            return jsonify({'error': 'Le créateur ne peut pas quitter le groupe'}), 400
    
    db.session.delete(member_membership)
    db.session.commit()
    
    return jsonify({'success': True})

@group_bp.route('/groups/discover', methods=['GET'])
def discover_groups():
    """Découvrir des groupes publics"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    
    # Récupérer les groupes publics dont l'utilisateur n'est pas membre
    user_group_ids = db.session.query(GroupMembership.group_id).filter_by(user_id=user_id).subquery()
    
    public_groups = Group.query.filter(
        Group.is_private == False,
        ~Group.id.in_(user_group_ids)
    ).limit(20).all()
    
    return jsonify([group.to_dict() for group in public_groups])

@group_bp.route('/groups/<int:group_id>/join', methods=['POST'])
def join_group(group_id):
    """Rejoindre un groupe public"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    group = Group.query.get(group_id)
    
    if not group:
        return jsonify({'error': 'Groupe non trouvé'}), 404
    
    if group.is_private:
        return jsonify({'error': 'Groupe privé - invitation requise'}), 403
    
    # Vérifier que l'utilisateur n'est pas déjà membre
    existing_membership = GroupMembership.query.filter_by(
        group_id=group_id,
        user_id=user_id
    ).first()
    
    if existing_membership:
        return jsonify({'error': 'Déjà membre du groupe'}), 400
    
    # Ajouter le membre
    membership = GroupMembership(
        group_id=group_id,
        user_id=user_id,
        role='member'
    )
    
    db.session.add(membership)
    db.session.commit()
    
    return jsonify(membership.to_dict()), 201
