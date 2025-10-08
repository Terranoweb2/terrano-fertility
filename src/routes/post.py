from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.models.post import Post
from src.models.friendship import Friendship

post_bp = Blueprint('post', __name__)

def require_auth():
    if 'user_id' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    return None

@post_bp.route('/posts', methods=['GET'])
def get_feed():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    
    # Récupérer les IDs des amis
    friends_query = db.session.query(Friendship).filter(
        ((Friendship.user_id1 == user_id) | (Friendship.user_id2 == user_id)) &
        (Friendship.status == 'accepted')
    )
    
    friend_ids = set()
    for friendship in friends_query:
        if friendship.user_id1 == user_id:
            friend_ids.add(friendship.user_id2)
        else:
            friend_ids.add(friendship.user_id1)
    
    # Ajouter l'utilisateur actuel pour voir ses propres posts
    friend_ids.add(user_id)
    
    # Récupérer les posts des amis et de l'utilisateur
    posts = Post.query.filter(Post.user_id.in_(friend_ids)).order_by(Post.timestamp.desc()).all()
    
    return jsonify([post.to_dict() for post in posts]), 200

@post_bp.route('/posts', methods=['POST'])
def create_post():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    data = request.json
    user_id = session['user_id']
    
    post = Post(
        content=data['content'],
        user_id=user_id
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

@post_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict()), 200

@post_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    post = Post.query.get_or_404(post_id)
    
    # Vérifier que l'utilisateur est le propriétaire du post
    if post.user_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    db.session.delete(post)
    db.session.commit()
    
    return '', 204

@post_bp.route('/users/<int:user_id>/posts', methods=['GET'])
def get_user_posts(user_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    posts = Post.query.filter_by(user_id=user_id).order_by(Post.timestamp.desc()).all()
    return jsonify([post.to_dict() for post in posts]), 200
