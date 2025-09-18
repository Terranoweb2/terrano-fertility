from flask import Blueprint, request, jsonify
from src.models.user import User, db
from src.models.daily_data import DailyData
from src.models.cycle import Cycle
from datetime import datetime, date
import json

daily_data_bp = Blueprint('daily_data', __name__)

def get_current_user():
    """Get current user from token"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    return User.verify_token(token)

@daily_data_bp.route('/daily-data', methods=['GET'])
def get_daily_data():
    """Get daily data for the current user"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        # Paramètres de requête optionnels
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', type=int)
        
        query = DailyData.query.filter_by(user_id=user.id)
        
        if start_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                query = query.filter(DailyData.date >= start_date)
            except ValueError:
                return jsonify({'error': 'Format de date de début invalide (YYYY-MM-DD attendu)'}), 400
        
        if end_date:
            try:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                query = query.filter(DailyData.date <= end_date)
            except ValueError:
                return jsonify({'error': 'Format de date de fin invalide (YYYY-MM-DD attendu)'}), 400
        
        query = query.order_by(DailyData.date.desc())
        
        if limit:
            query = query.limit(limit)
        
        daily_data = query.all()
        
        return jsonify({
            'daily_data': [data.to_dict() for data in daily_data]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des données: {str(e)}'}), 500

@daily_data_bp.route('/daily-data', methods=['POST'])
def create_daily_data():
    """Create or update daily data"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        data = request.get_json()
        
        if not data.get('date'):
            return jsonify({'error': 'La date est requise'}), 400
        
        try:
            data_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        
        # Vérifier si des données existent déjà pour cette date
        existing_data = DailyData.query.filter_by(
            user_id=user.id,
            date=data_date
        ).first()
        
        if existing_data:
            # Mettre à jour les données existantes
            daily_data = existing_data
        else:
            # Créer de nouvelles données
            daily_data = DailyData(
                user_id=user.id,
                date=data_date
            )
        
        # Trouver le cycle correspondant
        cycle = Cycle.query.filter_by(user_id=user.id).filter(
            Cycle.start_date <= data_date
        ).filter(
            (Cycle.end_date.is_(None)) | (Cycle.end_date >= data_date)
        ).first()
        
        if cycle:
            daily_data.cycle_id = cycle.id
        
        # Mettre à jour les champs
        if 'temperature' in data:
            daily_data.temperature = data['temperature']
        if 'cervical_mucus' in data:
            daily_data.cervical_mucus = data['cervical_mucus']
        if 'mood' in data:
            daily_data.mood = data['mood']
        if 'symptoms' in data:
            # Convertir la liste de symptômes en JSON
            if isinstance(data['symptoms'], list):
                daily_data.symptoms = json.dumps(data['symptoms'])
            else:
                daily_data.symptoms = data['symptoms']
        if 'notes' in data:
            daily_data.notes = data['notes']
        if 'flow_intensity' in data:
            daily_data.flow_intensity = data['flow_intensity']
        
        daily_data.updated_at = datetime.utcnow()
        
        if not existing_data:
            db.session.add(daily_data)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Données enregistrées avec succès',
            'daily_data': daily_data.to_dict()
        }), 201 if not existing_data else 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de l\'enregistrement des données: {str(e)}'}), 500

@daily_data_bp.route('/daily-data/<int:data_id>', methods=['PUT'])
def update_daily_data(data_id):
    """Update specific daily data"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        daily_data = DailyData.query.filter_by(id=data_id, user_id=user.id).first()
        if not daily_data:
            return jsonify({'error': 'Données non trouvées'}), 404
        
        data = request.get_json()
        
        # Mettre à jour les champs
        if 'temperature' in data:
            daily_data.temperature = data['temperature']
        if 'cervical_mucus' in data:
            daily_data.cervical_mucus = data['cervical_mucus']
        if 'mood' in data:
            daily_data.mood = data['mood']
        if 'symptoms' in data:
            if isinstance(data['symptoms'], list):
                daily_data.symptoms = json.dumps(data['symptoms'])
            else:
                daily_data.symptoms = data['symptoms']
        if 'notes' in data:
            daily_data.notes = data['notes']
        if 'flow_intensity' in data:
            daily_data.flow_intensity = data['flow_intensity']
        
        daily_data.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Données mises à jour avec succès',
            'daily_data': daily_data.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour des données: {str(e)}'}), 500

@daily_data_bp.route('/daily-data/<int:data_id>', methods=['DELETE'])
def delete_daily_data(data_id):
    """Delete daily data"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        daily_data = DailyData.query.filter_by(id=data_id, user_id=user.id).first()
        if not daily_data:
            return jsonify({'error': 'Données non trouvées'}), 404
        
        db.session.delete(daily_data)
        db.session.commit()
        
        return jsonify({
            'message': 'Données supprimées avec succès'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression des données: {str(e)}'}), 500

@daily_data_bp.route('/daily-data/date/<date_str>', methods=['GET'])
def get_daily_data_by_date(date_str):
    """Get daily data for a specific date"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        try:
            data_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        
        daily_data = DailyData.query.filter_by(
            user_id=user.id,
            date=data_date
        ).first()
        
        if not daily_data:
            return jsonify({'daily_data': None}), 200
        
        return jsonify({
            'daily_data': daily_data.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des données: {str(e)}'}), 500

