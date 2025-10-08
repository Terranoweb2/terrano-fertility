from flask import Blueprint, request, jsonify, session
import os
import openai
from src.models.user import db, User
from src.models.post import Post
from src.models.group import Group

ai_bp = Blueprint('ai', __name__)

# Configuration OpenRouter
openai.api_key = "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"
openai.api_base = "https://openrouter.ai/api/v1"

@ai_bp.route('/ai/suggestions', methods=['POST'])
def generate_suggestions():
    """Générer des suggestions de contenu avec l'IA"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    content = data.get('content', '')
    context = data.get('context', 'general')
    group_id = data.get('group_id')
    
    if not content.strip():
        return jsonify({'suggestions': []})
    
    try:
        # Construire le prompt selon le contexte
        if context == 'group_post' and group_id:
            group = Group.query.get(group_id)
            prompt = f"""
            Tu es un assistant IA pour un réseau social. L'utilisateur écrit un post dans le groupe "{group.name if group else 'Inconnu'}" 
            avec la description: "{group.description if group else ''}"
            
            Contenu actuel: "{content}"
            
            Génère 3 suggestions d'amélioration ou de continuation de ce post qui seraient pertinentes pour ce groupe.
            Les suggestions doivent être engageantes, respectueuses et encourager l'interaction.
            
            Réponds uniquement avec les 3 suggestions, une par ligne, sans numérotation.
            """
        else:
            prompt = f"""
            Tu es un assistant IA pour un réseau social. L'utilisateur écrit: "{content}"
            
            Génère 3 suggestions d'amélioration ou de continuation de ce post.
            Les suggestions doivent être engageantes, respectueuses et encourager l'interaction.
            
            Réponds uniquement avec les 3 suggestions, une par ligne, sans numérotation.
            """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un assistant IA spécialisé dans l'amélioration de contenu pour réseaux sociaux."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        suggestions_text = response.choices[0].message.content.strip()
        suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
        
        return jsonify({'suggestions': suggestions[:3]})
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        return jsonify({'suggestions': []})

@ai_bp.route('/ai/optimize-description', methods=['POST'])
def optimize_description():
    """Optimiser la description d'un groupe avec l'IA"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    description = data.get('description', '')
    
    if not description.strip():
        return jsonify({'optimized_description': description})
    
    try:
        prompt = f"""
        Tu es un expert en communication pour réseaux sociaux. 
        Optimise cette description de groupe pour la rendre plus attrayante et engageante:
        
        "{description}"
        
        Améliore-la en:
        - Rendant le langage plus engageant
        - Clarifiant l'objectif du groupe
        - Encourageant les gens à rejoindre
        - Gardant un ton amical et inclusif
        - Restant concis (maximum 200 caractères)
        
        Réponds uniquement avec la description optimisée.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un expert en communication et marketing pour réseaux sociaux."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        optimized = response.choices[0].message.content.strip()
        
        return jsonify({'optimized_description': optimized})
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        return jsonify({'optimized_description': description})

@ai_bp.route('/ai/moderate-content', methods=['POST'])
def moderate_content():
    """Modérer le contenu avec l'IA"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    content = data.get('content', '')
    
    if not content.strip():
        return jsonify({'is_appropriate': True, 'confidence': 1.0})
    
    try:
        prompt = f"""
        Tu es un modérateur IA pour un réseau social familial et respectueux.
        Analyse ce contenu et détermine s'il est approprié:
        
        "{content}"
        
        Vérifie s'il contient:
        - Langage offensant ou haineux
        - Contenu violent ou inapproprié
        - Spam ou contenu promotionnel excessif
        - Désinformation évidente
        - Harcèlement ou intimidation
        
        Réponds avec un JSON contenant:
        - "is_appropriate": true/false
        - "confidence": score de 0.0 à 1.0
        - "reason": raison si inapproprié (optionnel)
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un modérateur IA expert en détection de contenu inapproprié."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parser la réponse JSON
        try:
            import json
            result = json.loads(result_text)
        except:
            # Fallback si le parsing JSON échoue
            result = {
                'is_appropriate': True,
                'confidence': 0.5,
                'reason': 'Erreur de parsing'
            }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        return jsonify({'is_appropriate': True, 'confidence': 0.0})

@ai_bp.route('/ai/recommend-groups', methods=['GET'])
def recommend_groups():
    """Recommander des groupes basés sur les intérêts de l'utilisateur"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'recommendations': []})
    
    try:
        # Analyser les intérêts de l'utilisateur basés sur ses posts et groupes
        user_posts = Post.query.filter_by(user_id=user_id).limit(10).all()
        user_groups = [membership.group for membership in user.group_memberships]
        
        # Construire le profil d'intérêts
        posts_content = ' '.join([post.content for post in user_posts])
        groups_info = ' '.join([f"{group.name}: {group.description}" for group in user_groups])
        
        # Récupérer tous les groupes publics que l'utilisateur n'a pas rejoint
        joined_group_ids = [group.id for group in user_groups]
        available_groups = Group.query.filter(
            Group.is_private == False,
            ~Group.id.in_(joined_group_ids)
        ).limit(20).all()
        
        if not available_groups:
            return jsonify({'recommendations': []})
        
        groups_list = '\n'.join([
            f"ID: {group.id}, Nom: {group.name}, Description: {group.description}, Catégorie: {group.category or 'Non spécifiée'}"
            for group in available_groups
        ])
        
        prompt = f"""
        Tu es un système de recommandation IA pour un réseau social.
        
        Profil utilisateur:
        - Posts récents: "{posts_content[:500]}"
        - Groupes actuels: "{groups_info[:300]}"
        
        Groupes disponibles:
        {groups_list}
        
        Recommande les 3 groupes les plus pertinents pour cet utilisateur.
        Base tes recommandations sur les intérêts apparents et la compatibilité.
        
        Réponds avec uniquement les IDs des groupes recommandés, séparés par des virgules.
        Exemple: 1,5,8
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un expert en recommandation de contenu et analyse d'intérêts."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.5
        )
        
        recommended_ids_text = response.choices[0].message.content.strip()
        
        try:
            recommended_ids = [int(id.strip()) for id in recommended_ids_text.split(',') if id.strip().isdigit()]
        except:
            recommended_ids = []
        
        # Récupérer les groupes recommandés
        recommended_groups = []
        for group_id in recommended_ids:
            group = Group.query.get(group_id)
            if group:
                recommended_groups.append(group.to_dict())
        
        return jsonify({'recommendations': recommended_groups})
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        # Fallback: recommander des groupes populaires
        popular_groups = Group.query.filter(
            Group.is_private == False
        ).limit(3).all()
        
        return jsonify({'recommendations': [group.to_dict() for group in popular_groups]})

@ai_bp.route('/ai/generate-hashtags', methods=['POST'])
def generate_hashtags():
    """Générer des hashtags pertinents pour un post"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    content = data.get('content', '')
    
    if not content.strip():
        return jsonify({'hashtags': []})
    
    try:
        prompt = f"""
        Tu es un expert en réseaux sociaux. Génère 5 hashtags pertinents pour ce post:
        
        "{content}"
        
        Les hashtags doivent être:
        - Pertinents au contenu
        - Populaires mais pas trop génériques
        - En français
        - Sans le symbole # (juste le mot)
        
        Réponds avec les hashtags séparés par des virgules.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un expert en marketing digital et hashtags."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        hashtags_text = response.choices[0].message.content.strip()
        hashtags = [tag.strip() for tag in hashtags_text.split(',') if tag.strip()]
        
        return jsonify({'hashtags': hashtags[:5]})
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        return jsonify({'hashtags': []})

@ai_bp.route('/ai/sentiment-analysis', methods=['POST'])
def analyze_sentiment():
    """Analyser le sentiment d'un post"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    content = data.get('content', '')
    
    if not content.strip():
        return jsonify({'sentiment': 'neutral', 'confidence': 0.0})
    
    try:
        prompt = f"""
        Analyse le sentiment de ce texte:
        
        "{content}"
        
        Détermine si le sentiment est:
        - positive
        - negative  
        - neutral
        
        Réponds avec un JSON contenant:
        - "sentiment": "positive"/"negative"/"neutral"
        - "confidence": score de 0.0 à 1.0
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "Tu es un expert en analyse de sentiment."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content.strip()
        
        try:
            import json
            result = json.loads(result_text)
        except:
            result = {'sentiment': 'neutral', 'confidence': 0.5}
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Erreur IA: {e}")
        return jsonify({'sentiment': 'neutral', 'confidence': 0.0})
