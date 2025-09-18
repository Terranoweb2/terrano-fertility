from flask import Blueprint, request, jsonify
from src.models.user import User, db
from src.models.cycle import Cycle
from src.models.daily_data import DailyData
from datetime import datetime, date

cycles_bp = Blueprint('cycles', __name__)

def get_current_user():
    """Get current user from token"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    return User.verify_token(token)

@cycles_bp.route('/cycles', methods=['GET'])
def get_cycles():
    """Get all cycles for the current user"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        cycles = Cycle.query.filter_by(user_id=user.id).order_by(Cycle.start_date.desc()).all()
        
        return jsonify({
            'cycles': [cycle.to_dict() for cycle in cycles]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des cycles: {str(e)}'}), 500

@cycles_bp.route('/cycles', methods=['POST'])
def create_cycle():
    """Create a new cycle"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        data = request.get_json()
        
        if not data.get('start_date'):
            return jsonify({'error': 'La date de début est requise'}), 400
        
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Format de date invalide (YYYY-MM-DD attendu)'}), 400
        
        # Vérifier qu'il n'y a pas déjà un cycle pour cette date
        existing_cycle = Cycle.query.filter_by(
            user_id=user.id,
            start_date=start_date
        ).first()
        
        if existing_cycle:
            return jsonify({'error': 'Un cycle existe déjà pour cette date'}), 409
        
        cycle = Cycle(
            user_id=user.id,
            start_date=start_date,
            period_length=data.get('period_length', user.average_period_length)
        )
        
        if data.get('end_date'):
            try:
                end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
                cycle.end_date = end_date
                cycle.cycle_length = (end_date - start_date).days + 1
            except ValueError:
                return jsonify({'error': 'Format de date de fin invalide (YYYY-MM-DD attendu)'}), 400
        
        db.session.add(cycle)
        db.session.commit()
        
        return jsonify({
            'message': 'Cycle créé avec succès',
            'cycle': cycle.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création du cycle: {str(e)}'}), 500

@cycles_bp.route('/cycles/<int:cycle_id>', methods=['PUT'])
def update_cycle(cycle_id):
    """Update a cycle"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        cycle = Cycle.query.filter_by(id=cycle_id, user_id=user.id).first()
        if not cycle:
            return jsonify({'error': 'Cycle non trouvé'}), 404
        
        data = request.get_json()
        
        if 'start_date' in data:
            try:
                cycle.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Format de date de début invalide (YYYY-MM-DD attendu)'}), 400
        
        if 'end_date' in data:
            if data['end_date']:
                try:
                    cycle.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
                    if cycle.start_date:
                        cycle.cycle_length = (cycle.end_date - cycle.start_date).days + 1
                except ValueError:
                    return jsonify({'error': 'Format de date de fin invalide (YYYY-MM-DD attendu)'}), 400
            else:
                cycle.end_date = None
                cycle.cycle_length = None
        
        if 'period_length' in data:
            cycle.period_length = data['period_length']
        
        cycle.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Cycle mis à jour avec succès',
            'cycle': cycle.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour du cycle: {str(e)}'}), 500

@cycles_bp.route('/cycles/<int:cycle_id>', methods=['DELETE'])
def delete_cycle(cycle_id):
    """Delete a cycle"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        cycle = Cycle.query.filter_by(id=cycle_id, user_id=user.id).first()
        if not cycle:
            return jsonify({'error': 'Cycle non trouvé'}), 404
        
        db.session.delete(cycle)
        db.session.commit()
        
        return jsonify({
            'message': 'Cycle supprimé avec succès'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression du cycle: {str(e)}'}), 500

@cycles_bp.route('/cycles/current', methods=['GET'])
def get_current_cycle():
    """Get the current active cycle"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'Token d\'authentification requis'}), 401
        
        today = date.today()
        
        # Chercher un cycle en cours (sans date de fin ou avec date de fin future)
        current_cycle = Cycle.query.filter_by(user_id=user.id).filter(
            (Cycle.end_date.is_(None)) | (Cycle.end_date >= today)
        ).order_by(Cycle.start_date.desc()).first()
        
        if not current_cycle:
            return jsonify({'current_cycle': None}), 200
        
        return jsonify({
            'current_cycle': current_cycle.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération du cycle actuel: {str(e)}'}), 500

