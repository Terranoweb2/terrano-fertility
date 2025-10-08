from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.models.post import Post
from src.models.comment import Comment

comment_bp = Blueprint('comment', __name__)

def require_auth():
    if 'user_id' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    return None

@comment_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
    return jsonify([comment.to_dict() for comment in comments]), 200

@comment_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    data = request.json
    user_id = session['user_id']
    
    # Vérifier que le post existe
    post = Post.query.get_or_404(post_id)
    
    # Créer le commentaire
    comment = Comment(
        content=data['content'],
        user_id=user_id,
        post_id=post_id
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(comment.to_dict()), 201

@comment_bp.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    comment = Comment.query.get_or_404(comment_id)
    
    # Vérifier que l'utilisateur est le propriétaire du commentaire
    if comment.user_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    data = request.json
    comment.content = data['content']
    db.session.commit()
    
    return jsonify(comment.to_dict()), 200

@comment_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    comment = Comment.query.get_or_404(comment_id)
    
    # Vérifier que l'utilisateur est le propriétaire du commentaire
    if comment.user_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return '', 204
