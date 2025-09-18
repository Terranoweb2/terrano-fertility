from datetime import datetime, date, timedelta
from src.models.user import User
from src.models.cycle import Cycle
from src.models.daily_data import DailyData
from src.models.prediction import Prediction, db
import statistics

class FertilityService:
    def __init__(self):
        pass
    
    def calculate_cycle_statistics(self, user_id):
        """Calculer les statistiques des cycles d'une utilisatrice"""
        try:
            cycles = Cycle.query.filter_by(user_id=user_id).filter(
                Cycle.cycle_length.isnot(None)
            ).all()
            
            if not cycles:
                return None
            
            cycle_lengths = [cycle.cycle_length for cycle in cycles if cycle.cycle_length]
            period_lengths = [cycle.period_length for cycle in cycles if cycle.period_length]
            
            stats = {
                'total_cycles': len(cycles),
                'average_cycle_length': round(statistics.mean(cycle_lengths)) if cycle_lengths else 28,
                'cycle_length_std': round(statistics.stdev(cycle_lengths), 1) if len(cycle_lengths) > 1 else 0,
                'average_period_length': round(statistics.mean(period_lengths)) if period_lengths else 5,
                'shortest_cycle': min(cycle_lengths) if cycle_lengths else None,
                'longest_cycle': max(cycle_lengths) if cycle_lengths else None,
                'cycle_regularity': self._assess_cycle_regularity(cycle_lengths)
            }
            
            return stats
            
        except Exception as e:
            print(f"Erreur lors du calcul des statistiques: {e}")
            return None
    
    def _assess_cycle_regularity(self, cycle_lengths):
        """Évaluer la régularité des cycles"""
        if not cycle_lengths or len(cycle_lengths) < 3:
            return "insufficient_data"
        
        std_dev = statistics.stdev(cycle_lengths)
        
        if std_dev <= 2:
            return "very_regular"
        elif std_dev <= 4:
            return "regular"
        elif std_dev <= 7:
            return "somewhat_irregular"
        else:
            return "irregular"
    
    def predict_ovulation(self, user_id):
        """Prédire l'ovulation pour l'utilisatrice"""
        try:
            user = User.query.get(user_id)
            if not user:
                return None
            
            # Récupérer les statistiques des cycles
            stats = self.calculate_cycle_statistics(user_id)
            
            # Utiliser les données historiques ou les valeurs par défaut
            if stats and stats['total_cycles'] >= 2:
                avg_cycle_length = stats['average_cycle_length']
                confidence_base = min(0.9, 0.5 + (stats['total_cycles'] * 0.1))
                
                # Ajuster la confiance selon la régularité
                regularity_factor = {
                    'very_regular': 1.0,
                    'regular': 0.9,
                    'somewhat_irregular': 0.7,
                    'irregular': 0.5,
                    'insufficient_data': 0.3
                }.get(stats['cycle_regularity'], 0.3)
                
                confidence = confidence_base * regularity_factor
            else:
                avg_cycle_length = user.average_cycle_length
                confidence = 0.3  # Faible confiance sans données historiques
            
            # Trouver le dernier cycle ou créer une prédiction basée sur la date actuelle
            last_cycle = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date.desc()).first()
            
            if last_cycle and last_cycle.start_date:
                # Prédiction basée sur le dernier cycle
                cycle_start = last_cycle.start_date
                
                # Si le cycle n'est pas terminé, utiliser la date de début
                if not last_cycle.end_date:
                    next_period_date = cycle_start + timedelta(days=avg_cycle_length)
                else:
                    next_period_date = last_cycle.end_date + timedelta(days=1)
                    cycle_start = last_cycle.end_date + timedelta(days=1)
            else:
                # Pas de cycle enregistré, utiliser la date actuelle comme référence
                today = date.today()
                cycle_start = today
                next_period_date = today + timedelta(days=avg_cycle_length)
            
            # Calculer l'ovulation (généralement 14 jours avant les prochaines règles)
            ovulation_date = next_period_date - timedelta(days=14)
            
            # Calculer la fenêtre de fertilité (5 jours avant + jour d'ovulation + 1 jour après)
            fertile_window_start = ovulation_date - timedelta(days=5)
            fertile_window_end = ovulation_date + timedelta(days=1)
            
            # Créer ou mettre à jour la prédiction
            existing_prediction = Prediction.query.filter_by(
                user_id=user_id,
                cycle_id=last_cycle.id if last_cycle else None
            ).first()
            
            if existing_prediction:
                prediction = existing_prediction
                prediction.updated_at = datetime.utcnow()
            else:
                prediction = Prediction(
                    user_id=user_id,
                    cycle_id=last_cycle.id if last_cycle else None
                )
            
            prediction.ovulation_date = ovulation_date
            prediction.fertile_window_start = fertile_window_start
            prediction.fertile_window_end = fertile_window_end
            prediction.next_period_date = next_period_date
            prediction.confidence_level = round(confidence, 2)
            
            if not existing_prediction:
                db.session.add(prediction)
            
            db.session.commit()
            
            return {
                'prediction': prediction.to_dict(),
                'statistics': stats,
                'confidence_explanation': self._get_confidence_explanation(confidence, stats)
            }
            
        except Exception as e:
            print(f"Erreur lors de la prédiction d'ovulation: {e}")
            db.session.rollback()
            return None
    
    def _get_confidence_explanation(self, confidence, stats):
        """Expliquer le niveau de confiance de la prédiction"""
        if confidence >= 0.8:
            return "Prédiction très fiable basée sur vos cycles réguliers"
        elif confidence >= 0.6:
            return "Prédiction fiable basée sur vos données historiques"
        elif confidence >= 0.4:
            return "Prédiction modérée - continuez à enregistrer vos cycles pour plus de précision"
        else:
            return "Prédiction approximative - plus de données sont nécessaires pour une meilleure précision"
    
    def get_cycle_day(self, user_id, target_date=None):
        """Obtenir le jour du cycle pour une date donnée"""
        try:
            if not target_date:
                target_date = date.today()
            
            # Trouver le cycle correspondant à la date
            cycle = Cycle.query.filter_by(user_id=user_id).filter(
                Cycle.start_date <= target_date
            ).filter(
                (Cycle.end_date.is_(None)) | (Cycle.end_date >= target_date)
            ).first()
            
            if cycle:
                cycle_day = (target_date - cycle.start_date).days + 1
                return {
                    'cycle_day': cycle_day,
                    'cycle_id': cycle.id,
                    'cycle_start': cycle.start_date.isoformat()
                }
            
            return None
            
        except Exception as e:
            print(f"Erreur lors du calcul du jour de cycle: {e}")
            return None
    
    def get_fertility_status(self, user_id, target_date=None):
        """Obtenir le statut de fertilité pour une date donnée"""
        try:
            if not target_date:
                target_date = date.today()
            
            # Récupérer la dernière prédiction
            prediction = Prediction.query.filter_by(user_id=user_id).order_by(
                Prediction.created_at.desc()
            ).first()
            
            if not prediction:
                return {
                    'status': 'unknown',
                    'message': 'Aucune prédiction disponible'
                }
            
            # Déterminer le statut basé sur la fenêtre de fertilité
            if (prediction.fertile_window_start <= target_date <= prediction.fertile_window_end):
                if target_date == prediction.ovulation_date:
                    return {
                        'status': 'ovulation',
                        'message': 'Jour d\'ovulation prévu',
                        'fertility_score': 100
                    }
                else:
                    days_to_ovulation = (prediction.ovulation_date - target_date).days
                    if days_to_ovulation > 0:
                        return {
                            'status': 'fertile',
                            'message': f'Période fertile - ovulation dans {days_to_ovulation} jour(s)',
                            'fertility_score': 80
                        }
                    else:
                        return {
                            'status': 'fertile',
                            'message': 'Période fertile',
                            'fertility_score': 70
                        }
            else:
                days_to_fertile = (prediction.fertile_window_start - target_date).days
                if days_to_fertile > 0 and days_to_fertile <= 7:
                    return {
                        'status': 'approaching_fertile',
                        'message': f'Période fertile dans {days_to_fertile} jour(s)',
                        'fertility_score': 30
                    }
                else:
                    return {
                        'status': 'not_fertile',
                        'message': 'Période non fertile',
                        'fertility_score': 10
                    }
            
        except Exception as e:
            print(f"Erreur lors du calcul du statut de fertilité: {e}")
            return {
                'status': 'error',
                'message': 'Erreur lors du calcul'
            }

