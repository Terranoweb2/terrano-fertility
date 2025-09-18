from flask import Blueprint, request, jsonify
from src.models.user import User, db
from src.models.chat_history import ChatHistory
from src.services.ai_service import AIService
from datetime import datetime
import json

ai_chat_bp = Blueprint('ai_chat', __name__)
ai_service = AIService()

def get_current_user():
    """Get current user from token"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    return User.verify_token(token)

@ai_chat_bp.route('/ai/chat', methods=['POST'])
def chat_with_ai():
    """Chat avec l'IA TerranoIA"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message requis'}), 400
        
        # Générer la réponse IA
        ai_result = ai_service.chat(user.id, message)
        
        if not ai_result['success']:
            return jsonify({
                'error': 'Erreur lors de la génération de la réponse',
                'details': ai_result.get('error', 'Erreur inconnue')
            }), 500
        
        ai_response = ai_result['response']
        
        # Sauvegarder dans l'historique
        try:
            chat_entry = ChatHistory(
                user_id=user.id,
                message=message,
                response=ai_response,
                context_data=json.dumps({
                    'context_used': ai_result.get('context_used', False),
                    'timestamp': datetime.utcnow().isoformat()
                })
            )
            db.session.add(chat_entry)
            db.session.commit()
        except Exception as e:
            print(f"Erreur lors de la sauvegarde de l'historique: {e}")
            # Continue même si la sauvegarde échoue
        
        return jsonify({
            'message': message,
            'response': ai_response,
            'timestamp': datetime.utcnow().isoformat(),
            'context_used': ai_result.get('context_used', False)
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors du chat: {str(e)}'
        }), 500

@ai_chat_bp.route('/ai/history', methods=['GET'])
def get_chat_history():
    """Récupérer l'historique des conversations"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Paramètres de pagination
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Limiter le nombre d'entrées
        if limit > 100:
            limit = 100
        
        chat_history = ChatHistory.query.filter_by(user_id=user.id)\
            .order_by(ChatHistory.timestamp.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()
        
        return jsonify({
            'history': [entry.to_dict() for entry in chat_history],
            'total': ChatHistory.query.filter_by(user_id=user.id).count()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la récupération de l\'historique: {str(e)}'
        }), 500

@ai_chat_bp.route('/ai/insights', methods=['GET'])
def get_fertility_insights():
    """Obtenir des insights personnalisés sur la fertilité"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Générer des insights personnalisés
        insights = ai_service.generate_fertility_insights(user.id)
        
        if not insights:
            return jsonify({
                'insights': "Continuez à enregistrer vos données quotidiennes pour recevoir des conseils personnalisés ! 📊✨"
            }), 200
        
        return jsonify({
            'insights': insights,
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la génération d\'insights: {str(e)}'
        }), 500

@ai_chat_bp.route('/ai/quick-questions', methods=['GET'])
def get_quick_questions():
    """Obtenir des questions rapides suggérées"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Questions suggérées basées sur le contexte utilisateur
        quick_questions = [
            "Comment puis-je améliorer ma fertilité naturellement ?",
            "Quels sont les signes d'ovulation à surveiller ?",
            "Comment interpréter mes données de cycle ?",
            "Quels aliments favorisent la fertilité ?",
            "Comment gérer le stress pendant la conception ?",
            "Quand est ma période la plus fertile ?",
            "Comment optimiser mes chances de conception ?",
            "Que signifient mes symptômes actuels ?"
        ]
        
        return jsonify({
            'questions': quick_questions
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la récupération des questions: {str(e)}'
        }), 500

@ai_chat_bp.route('/ai/health-check', methods=['GET'])
def ai_health_check():
    """Vérifier le statut du service IA"""
    try:
        # Test simple de l'API
        test_result = ai_service.chat(1, "Test de connexion")
        
        return jsonify({
            'status': 'healthy' if test_result['success'] else 'degraded',
            'message': 'Service IA opérationnel',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

