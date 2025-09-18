from flask import Blueprint, request, jsonify
from src.models.user import User
from src.models.prediction import Prediction
from src.services.fertility_service import FertilityService
from datetime import datetime, date

predictions_bp = Blueprint('predictions', __name__)
fertility_service = FertilityService()

def get_current_user():
    """Get current user from token"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    return User.verify_token(token)

@predictions_bp.route('/predictions', methods=['GET'])
def get_predictions():
    """Récupérer les prédictions de l'utilisatrice"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        predictions = Prediction.query.filter_by(user_id=user.id).order_by(
            Prediction.created_at.desc()
        ).limit(10).all()
        
        return jsonify({
            'predictions': [pred.to_dict() for pred in predictions]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la récupération des prédictions: {str(e)}'
        }), 500

@predictions_bp.route('/predictions/calculate', methods=['POST'])
def calculate_predictions():
    """Calculer de nouvelles prédictions d'ovulation"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Calculer les prédictions
        result = fertility_service.predict_ovulation(user.id)
        
        if not result:
            return jsonify({
                'error': 'Impossible de calculer les prédictions. Assurez-vous d\'avoir enregistré au moins un cycle.'
            }), 400
        
        return jsonify({
            'message': 'Prédictions calculées avec succès',
            'prediction': result['prediction'],
            'statistics': result['statistics'],
            'confidence_explanation': result['confidence_explanation']
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors du calcul des prédictions: {str(e)}'
        }), 500

@predictions_bp.route('/predictions/current', methods=['GET'])
def get_current_prediction():
    """Récupérer la prédiction actuelle"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Récupérer la prédiction la plus récente
        prediction = Prediction.query.filter_by(user_id=user.id).order_by(
            Prediction.created_at.desc()
        ).first()
        
        if not prediction:
            # Calculer une nouvelle prédiction si aucune n'existe
            result = fertility_service.predict_ovulation(user.id)
            if result:
                prediction = result['prediction']
            else:
                return jsonify({
                    'current_prediction': None,
                    'message': 'Aucune prédiction disponible. Enregistrez vos cycles pour obtenir des prédictions.'
                }), 200
        
        # Obtenir le statut de fertilité actuel
        fertility_status = fertility_service.get_fertility_status(user.id)
        
        # Obtenir le jour du cycle actuel
        cycle_day_info = fertility_service.get_cycle_day(user.id)
        
        return jsonify({
            'current_prediction': prediction.to_dict() if hasattr(prediction, 'to_dict') else prediction,
            'fertility_status': fertility_status,
            'cycle_day': cycle_day_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la récupération de la prédiction actuelle: {str(e)}'
        }), 500

@predictions_bp.route('/predictions/fertility-status', methods=['GET'])
def get_fertility_status():
    """Obtenir le statut de fertilité pour une date donnée"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Paramètre de date optionnel
        date_str = request.args.get('date')
        target_date = date.today()
        
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        
        fertility_status = fertility_service.get_fertility_status(user.id, target_date)
        cycle_day_info = fertility_service.get_cycle_day(user.id, target_date)
        
        return jsonify({
            'date': target_date.isoformat(),
            'fertility_status': fertility_status,
            'cycle_day': cycle_day_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la récupération du statut de fertilité: {str(e)}'
        }), 500

@predictions_bp.route('/predictions/statistics', methods=['GET'])
def get_cycle_statistics():
    """Obtenir les statistiques des cycles"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        stats = fertility_service.calculate_cycle_statistics(user.id)
        
        if not stats:
            return jsonify({
                'statistics': None,
                'message': 'Pas assez de données pour calculer les statistiques. Enregistrez au moins 2 cycles complets.'
            }), 200
        
        return jsonify({
            'statistics': stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors du calcul des statistiques: {str(e)}'
        }), 500

@predictions_bp.route('/predictions/calendar', methods=['GET'])
def get_fertility_calendar():
    """Obtenir un calendrier de fertilité pour un mois donné"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Paramètres de date
        year = request.args.get('year', date.today().year, type=int)
        month = request.args.get('month', date.today().month, type=int)
        
        # Valider les paramètres
        if not (1 <= month <= 12):
            return jsonify({'error': 'Mois invalide (1-12)'}), 400
        
        # Générer le calendrier pour le mois
        calendar_data = []
        
        # Premier jour du mois
        first_day = date(year, month, 1)
        
        # Dernier jour du mois
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)
        
        current_date = first_day
        while current_date <= last_day:
            fertility_status = fertility_service.get_fertility_status(user.id, current_date)
            cycle_day_info = fertility_service.get_cycle_day(user.id, current_date)
            
            calendar_data.append({
                'date': current_date.isoformat(),
                'fertility_status': fertility_status,
                'cycle_day': cycle_day_info
            })
            
            current_date += timedelta(days=1)
        
        return jsonify({
            'year': year,
            'month': month,
            'calendar': calendar_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la génération du calendrier: {str(e)}'
        }), 500

