from flask import Blueprint, request, jsonify, session
from sqlalchemy import or_, and_, func, desc
from src.models.user import db, User
from src.models.post import Post
from src.models.group import Group, GroupMembership
from src.models.friendship import Friendship
from datetime import datetime, timedelta
import re

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/users', methods=['GET'])
def search_users():
    """Recherche avancée d'utilisateurs"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    query = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    limit = min(int(request.args.get('limit', 20)), 50)
    
    if not query:
        return jsonify([])
    
    # Construire la requête de base
    search_query = User.query
    
    # Recherche par nom d'utilisateur ou email
    search_conditions = [
        User.username.ilike(f'%{query}%'),
        User.email.ilike(f'%{query}%')
    ]
    
    if hasattr(User, 'bio'):
        search_conditions.append(User.bio.ilike(f'%{query}%'))
    
    search_query = search_query.filter(or_(*search_conditions))
    
    # Filtrer par localisation si spécifiée
    if location and hasattr(User, 'location'):
        search_query = search_query.filter(User.location.ilike(f'%{location}%'))
    
    # Exclure l'utilisateur actuel
    current_user_id = session['user_id']
    search_query = search_query.filter(User.id != current_user_id)
    
    # Ordonner par pertinence (nom exact en premier)
    search_query = search_query.order_by(
        func.length(User.username).asc(),
        User.username.asc()
    )
    
    users = search_query.limit(limit).all()
    
    # Ajouter les informations de statut d'amitié
    result = []
    for user in users:
        user_data = user.to_dict()
        
        # Vérifier le statut d'amitié
        friendship = Friendship.query.filter(
            or_(
                and_(Friendship.user_id == current_user_id, Friendship.friend_id == user.id),
                and_(Friendship.user_id == user.id, Friendship.friend_id == current_user_id)
            )
        ).first()
        
        if friendship:
            user_data['friendship_status'] = friendship.status
        else:
            user_data['friendship_status'] = None
        
        result.append(user_data)
    
    return jsonify(result)

@search_bp.route('/search/posts', methods=['GET'])
def search_posts():
    """Recherche avancée de posts"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    query = request.args.get('q', '').strip()
    date_range = request.args.get('date_range', 'all')
    post_type = request.args.get('post_type', 'all')
    location = request.args.get('location', '').strip()
    limit = min(int(request.args.get('limit', 20)), 50)
    
    if not query:
        return jsonify([])
    
    # Construire la requête de base
    search_query = Post.query.join(User, Post.user_id == User.id)
    
    # Recherche dans le contenu
    search_query = search_query.filter(Post.content.ilike(f'%{query}%'))
    
    # Filtrer par type de post
    if post_type != 'all':
        search_query = search_query.filter(Post.post_type == post_type)
    
    # Filtrer par localisation
    if location:
        search_query = search_query.filter(Post.location.ilike(f'%{location}%'))
    
    # Filtrer par date
    if date_range != 'all':
        now = datetime.utcnow()
        if date_range == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif date_range == 'week':
            start_date = now - timedelta(days=7)
        elif date_range == 'month':
            start_date = now - timedelta(days=30)
        elif date_range == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = None
        
        if start_date:
            search_query = search_query.filter(Post.timestamp >= start_date)
    
    # Filtrer par confidentialité (seulement posts publics ou d'amis)
    current_user_id = session['user_id']
    
    # Récupérer les IDs des amis
    friend_ids_query = db.session.query(Friendship.friend_id).filter(
        Friendship.user_id == current_user_id,
        Friendship.status == 'accepted'
    ).union(
        db.session.query(Friendship.user_id).filter(
            Friendship.friend_id == current_user_id,
            Friendship.status == 'accepted'
        )
    )
    friend_ids = [row[0] for row in friend_ids_query.all()]
    
    # Filtrer les posts visibles
    visibility_conditions = [
        Post.privacy == 'public',
        and_(Post.privacy == 'friends', Post.user_id.in_(friend_ids)),
        Post.user_id == current_user_id  # Ses propres posts
    ]
    
    search_query = search_query.filter(or_(*visibility_conditions))
    
    # Ordonner par pertinence et date
    search_query = search_query.order_by(desc(Post.timestamp))
    
    posts = search_query.limit(limit).all()
    
    return jsonify([post.to_dict() for post in posts])

@search_bp.route('/search/groups', methods=['GET'])
def search_groups():
    """Recherche avancée de groupes"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    query = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    only_public = request.args.get('only_public', 'false').lower() == 'true'
    limit = min(int(request.args.get('limit', 20)), 50)
    
    if not query:
        return jsonify([])
    
    # Construire la requête de base
    search_query = Group.query
    
    # Recherche dans le nom et la description
    search_conditions = [
        Group.name.ilike(f'%{query}%'),
        Group.description.ilike(f'%{query}%')
    ]
    
    search_query = search_query.filter(or_(*search_conditions))
    
    # Filtrer par catégorie
    if category:
        search_query = search_query.filter(Group.category == category)
    
    # Filtrer par visibilité
    if only_public:
        search_query = search_query.filter(Group.is_private == False)
    
    # Ordonner par nombre de membres (popularité)
    search_query = search_query.outerjoin(GroupMembership)\
        .group_by(Group.id)\
        .order_by(desc(func.count(GroupMembership.id)))
    
    groups = search_query.limit(limit).all()
    
    # Ajouter les informations de membership
    current_user_id = session['user_id']
    result = []
    
    for group in groups:
        group_data = group.to_dict()
        
        # Vérifier si l'utilisateur est membre
        membership = GroupMembership.query.filter_by(
            group_id=group.id,
            user_id=current_user_id
        ).first()
        
        group_data['is_member'] = membership is not None
        if membership:
            group_data['user_role'] = membership.role
        
        result.append(group_data)
    
    return jsonify(result)

@search_bp.route('/search/hashtags', methods=['GET'])
def search_hashtags():
    """Recherche de hashtags populaires"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    query = request.args.get('q', '').strip()
    limit = min(int(request.args.get('limit', 10)), 20)
    
    # Extraire les hashtags des posts récents
    recent_posts = Post.query.filter(
        Post.timestamp >= datetime.utcnow() - timedelta(days=30)
    ).all()
    
    hashtag_counts = {}
    hashtag_pattern = r'#(\w+)'
    
    for post in recent_posts:
        hashtags = re.findall(hashtag_pattern, post.content, re.IGNORECASE)
        for hashtag in hashtags:
            hashtag_lower = hashtag.lower()
            if not query or query.lower() in hashtag_lower:
                hashtag_counts[hashtag_lower] = hashtag_counts.get(hashtag_lower, 0) + 1
    
    # Trier par popularité
    sorted_hashtags = sorted(hashtag_counts.items(), key=lambda x: x[1], reverse=True)
    
    result = []
    for hashtag, count in sorted_hashtags[:limit]:
        result.append({
            'hashtag': hashtag,
            'count': count,
            'trending': count > 5  # Considéré comme trending si utilisé plus de 5 fois
        })
    
    return jsonify(result)

@search_bp.route('/search/suggestions', methods=['GET'])
def get_search_suggestions():
    """Obtenir des suggestions de recherche"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    query = request.args.get('q', '').strip()
    
    if len(query) < 2:
        return jsonify([])
    
    suggestions = []
    
    # Suggestions d'utilisateurs
    users = User.query.filter(
        User.username.ilike(f'{query}%')
    ).limit(3).all()
    
    for user in users:
        suggestions.append({
            'type': 'user',
            'text': user.username,
            'subtitle': f'@{user.username}',
            'id': user.id
        })
    
    # Suggestions de groupes
    groups = Group.query.filter(
        Group.name.ilike(f'{query}%')
    ).limit(3).all()
    
    for group in groups:
        suggestions.append({
            'type': 'group',
            'text': group.name,
            'subtitle': f'{group.member_count} membres',
            'id': group.id
        })
    
    # Suggestions de hashtags
    recent_posts = Post.query.filter(
        Post.timestamp >= datetime.utcnow() - timedelta(days=7)
    ).all()
    
    hashtag_pattern = r'#(\w+)'
    hashtags = set()
    
    for post in recent_posts:
        found_hashtags = re.findall(hashtag_pattern, post.content, re.IGNORECASE)
        for hashtag in found_hashtags:
            if hashtag.lower().startswith(query.lower()):
                hashtags.add(hashtag.lower())
    
    for hashtag in list(hashtags)[:3]:
        suggestions.append({
            'type': 'hashtag',
            'text': f'#{hashtag}',
            'subtitle': 'Hashtag',
            'id': hashtag
        })
    
    return jsonify(suggestions[:10])

@search_bp.route('/recommendations/users', methods=['GET'])
def recommend_users():
    """Recommander des utilisateurs à suivre"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    current_user_id = session['user_id']
    limit = min(int(request.args.get('limit', 10)), 20)
    
    # Récupérer les amis actuels
    current_friends_query = db.session.query(Friendship.friend_id).filter(
        Friendship.user_id == current_user_id,
        Friendship.status == 'accepted'
    ).union(
        db.session.query(Friendship.user_id).filter(
            Friendship.friend_id == current_user_id,
            Friendship.status == 'accepted'
        )
    )
    current_friend_ids = [row[0] for row in current_friends_query.all()]
    
    # Trouver des amis d'amis
    friends_of_friends_query = db.session.query(Friendship.friend_id).filter(
        Friendship.user_id.in_(current_friend_ids),
        Friendship.status == 'accepted',
        Friendship.friend_id != current_user_id,
        ~Friendship.friend_id.in_(current_friend_ids)
    ).union(
        db.session.query(Friendship.user_id).filter(
            Friendship.friend_id.in_(current_friend_ids),
            Friendship.status == 'accepted',
            Friendship.user_id != current_user_id,
            ~Friendship.user_id.in_(current_friend_ids)
        )
    )
    
    # Compter les connexions mutuelles
    friends_of_friends = {}
    for row in friends_of_friends_query.all():
        user_id = row[0]
        friends_of_friends[user_id] = friends_of_friends.get(user_id, 0) + 1
    
    # Trier par nombre de connexions mutuelles
    sorted_recommendations = sorted(friends_of_friends.items(), key=lambda x: x[1], reverse=True)
    
    # Récupérer les utilisateurs recommandés
    recommended_users = []
    for user_id, mutual_count in sorted_recommendations[:limit]:
        user = User.query.get(user_id)
        if user:
            user_data = user.to_dict()
            user_data['mutual_friends_count'] = mutual_count
            user_data['recommendation_reason'] = f'{mutual_count} ami(s) en commun'
            recommended_users.append(user_data)
    
    # Si pas assez de recommandations, ajouter des utilisateurs populaires
    if len(recommended_users) < limit:
        excluded_ids = current_friend_ids + [current_user_id] + [u['id'] for u in recommended_users]
        
        popular_users = User.query.filter(
            ~User.id.in_(excluded_ids)
        ).limit(limit - len(recommended_users)).all()
        
        for user in popular_users:
            user_data = user.to_dict()
            user_data['mutual_friends_count'] = 0
            user_data['recommendation_reason'] = 'Utilisateur populaire'
            recommended_users.append(user_data)
    
    return jsonify(recommended_users)

@search_bp.route('/recommendations/groups', methods=['GET'])
def recommend_groups():
    """Recommander des groupes à rejoindre"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    current_user_id = session['user_id']
    limit = min(int(request.args.get('limit', 10)), 20)
    
    # Récupérer les groupes actuels de l'utilisateur
    current_groups = db.session.query(GroupMembership.group_id).filter_by(
        user_id=current_user_id
    ).all()
    current_group_ids = [row[0] for row in current_groups]
    
    # Trouver des groupes similaires basés sur les catégories
    user_group_categories = db.session.query(Group.category).filter(
        Group.id.in_(current_group_ids),
        Group.category.isnot(None)
    ).distinct().all()
    
    categories = [row[0] for row in user_group_categories]
    
    recommended_groups = []
    
    if categories:
        # Recommander des groupes dans les mêmes catégories
        similar_groups = Group.query.filter(
            Group.category.in_(categories),
            ~Group.id.in_(current_group_ids),
            Group.is_private == False
        ).outerjoin(GroupMembership)\
        .group_by(Group.id)\
        .order_by(desc(func.count(GroupMembership.id)))\
        .limit(limit).all()
        
        for group in similar_groups:
            group_data = group.to_dict()
            group_data['recommendation_reason'] = f'Catégorie: {group.category}'
            recommended_groups.append(group_data)
    
    # Si pas assez de recommandations, ajouter des groupes populaires
    if len(recommended_groups) < limit:
        excluded_ids = current_group_ids + [g['id'] for g in recommended_groups]
        
        popular_groups = Group.query.filter(
            ~Group.id.in_(excluded_ids),
            Group.is_private == False
        ).outerjoin(GroupMembership)\
        .group_by(Group.id)\
        .order_by(desc(func.count(GroupMembership.id)))\
        .limit(limit - len(recommended_groups)).all()
        
        for group in popular_groups:
            group_data = group.to_dict()
            group_data['recommendation_reason'] = 'Groupe populaire'
            recommended_groups.append(group_data)
    
    return jsonify(recommended_groups)

@search_bp.route('/trending', methods=['GET'])
def get_trending():
    """Obtenir le contenu tendance"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    # Posts tendance (beaucoup de réactions récemment)
    trending_posts = db.session.query(Post)\
        .join(User, Post.user_id == User.id)\
        .filter(Post.timestamp >= datetime.utcnow() - timedelta(days=7))\
        .filter(Post.privacy == 'public')\
        .order_by(desc(Post.reactions_count))\
        .limit(5).all()
    
    # Hashtags tendance
    recent_posts = Post.query.filter(
        Post.timestamp >= datetime.utcnow() - timedelta(days=3)
    ).all()
    
    hashtag_counts = {}
    hashtag_pattern = r'#(\w+)'
    
    for post in recent_posts:
        hashtags = re.findall(hashtag_pattern, post.content, re.IGNORECASE)
        for hashtag in hashtags:
            hashtag_lower = hashtag.lower()
            hashtag_counts[hashtag_lower] = hashtag_counts.get(hashtag_lower, 0) + 1
    
    trending_hashtags = sorted(hashtag_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Groupes populaires
    trending_groups = Group.query.filter(Group.is_private == False)\
        .outerjoin(GroupMembership)\
        .group_by(Group.id)\
        .order_by(desc(func.count(GroupMembership.id)))\
        .limit(5).all()
    
    return jsonify({
        'posts': [post.to_dict() for post in trending_posts],
        'hashtags': [{'hashtag': tag, 'count': count} for tag, count in trending_hashtags],
        'groups': [group.to_dict() for group in trending_groups]
    })
