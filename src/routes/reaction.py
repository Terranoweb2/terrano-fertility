from flask import Blueprint, jsonify, request, session
from src.models.user import User, db
from src.models.post import Post
from src.models.reaction import Reaction

reaction_bp = Blueprint('reaction', __name__)

def require_auth():
    if 'user_id' not in session:
        return jsonify({'error': 'Non connecté'}), 401
    return None

@reaction_bp.route('/posts/<int:post_id>/reactions', methods=['GET'])
def get_post_reactions(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    reactions = Reaction.query.filter_by(post_id=post_id).all()
    return jsonify([reaction.to_dict() for reaction in reactions]), 200

@reaction_bp.route('/posts/<int:post_id>/reactions', methods=['POST'])
def add_reaction(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    data = request.json
    user_id = session['user_id']
    
    # Vérifier que le post existe
    post = Post.query.get_or_404(post_id)
    
    # Vérifier si l'utilisateur a déjà réagi à ce post
    existing_reaction = Reaction.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if existing_reaction:
        # Mettre à jour la réaction existante
        existing_reaction.reaction_type = data['reaction_type']
        db.session.commit()
        return jsonify(existing_reaction.to_dict()), 200
    else:
        # Créer une nouvelle réaction
        reaction = Reaction(
            user_id=user_id,
            post_id=post_id,
            reaction_type=data['reaction_type']
        )
        
        db.session.add(reaction)
        db.session.commit()
        
        return jsonify(reaction.to_dict()), 201

@reaction_bp.route('/posts/<int:post_id>/reactions', methods=['DELETE'])
def remove_reaction(post_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    user_id = session['user_id']
    
    # Trouver la réaction de l'utilisateur pour ce post
    reaction = Reaction.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if not reaction:
        return jsonify({'error': 'Aucune réaction trouvée'}), 404
    
    db.session.delete(reaction)
    db.session.commit()
    
    return '', 204
