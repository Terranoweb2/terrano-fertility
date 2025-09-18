import os
import json
import requests
from datetime import datetime, date
from src.models.user import User
from src.models.cycle import Cycle
from src.models.daily_data import DailyData
from src.models.prediction import Prediction

class AIService:
    def __init__(self):
        # Configuration OpenRouter avec requests
        self.api_key = "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"
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = "anthropic/claude-3.5-sonnet"
    
    def get_user_context(self, user_id):
        """Récupérer le contexte utilisateur pour l'IA"""
        try:
            user = User.query.get(user_id)
            if not user:
                return None
            
            # Récupérer les cycles récents
            recent_cycles = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date.desc()).limit(3).all()
            
            # Récupérer les données quotidiennes récentes
            recent_data = DailyData.query.filter_by(user_id=user_id).order_by(DailyData.date.desc()).limit(30).all()
            
            # Récupérer les prédictions récentes
            recent_predictions = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).limit(3).all()
            
            context = {
                'user': {
                    'first_name': user.first_name,
                    'age': self._calculate_age(user.date_of_birth) if user.date_of_birth else None,
                    'average_cycle_length': user.average_cycle_length,
                    'average_period_length': user.average_period_length
                },
                'recent_cycles': [cycle.to_dict() for cycle in recent_cycles],
                'recent_daily_data': [data.to_dict() for data in recent_data],
                'recent_predictions': [pred.to_dict() for pred in recent_predictions]
            }
            
            return context
            
        except Exception as e:
            print(f"Erreur lors de la récupération du contexte utilisateur: {e}")
            return None
    
    def _calculate_age(self, birth_date):
        """Calculer l'âge à partir de la date de naissance"""
        if not birth_date:
            return None
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    def generate_system_prompt(self, user_context):
        """Générer le prompt système avec le contexte utilisateur"""
        base_prompt = """Tu es TerranoIA, l'assistante IA spécialisée en fertilité et santé reproductive féminine de l'application TerranoFertility. 

RÔLE ET EXPERTISE:
- Tu es une experte en fertilité, cycles menstruels, ovulation et santé reproductive
- Tu fournis des conseils personnalisés basés sur les données de l'utilisatrice
- Tu es empathique, professionnelle et rassurante
- Tu utilises un langage accessible mais scientifiquement précis

DONNÉES UTILISATEUR DISPONIBLES:"""
        
        if user_context:
            user_info = user_context.get('user', {})
            if user_info.get('first_name'):
                base_prompt += f"\n- Prénom: {user_info['first_name']}"
            if user_info.get('age'):
                base_prompt += f"\n- Âge: {user_info['age']} ans"
            if user_info.get('average_cycle_length'):
                base_prompt += f"\n- Durée moyenne du cycle: {user_info['average_cycle_length']} jours"
            if user_info.get('average_period_length'):
                base_prompt += f"\n- Durée moyenne des règles: {user_info['average_period_length']} jours"
            
            # Ajouter des informations sur les cycles récents
            recent_cycles = user_context.get('recent_cycles', [])
            if recent_cycles:
                base_prompt += f"\n- Nombre de cycles enregistrés: {len(recent_cycles)}"
                last_cycle = recent_cycles[0]
                if last_cycle.get('start_date'):
                    base_prompt += f"\n- Dernier cycle commencé le: {last_cycle['start_date']}"
            
            # Ajouter des informations sur les données récentes
            recent_data = user_context.get('recent_daily_data', [])
            if recent_data:
                base_prompt += f"\n- Données quotidiennes disponibles: {len(recent_data)} entrées récentes"
        
        base_prompt += """

INSTRUCTIONS:
1. Réponds toujours en français
2. Personnalise tes réponses avec le prénom si disponible
3. Base tes conseils sur les données fournies
4. Sois empathique et rassurante
5. Encourage le suivi régulier des données
6. Rappelle que tes conseils ne remplacent pas un avis médical
7. Utilise des émojis appropriés pour rendre la conversation plus chaleureuse
8. Fournis des conseils pratiques et actionnables

SUJETS D'EXPERTISE:
- Cycles menstruels et ovulation
- Fertilité et conception
- Symptômes et signes de fertilité
- Bien-être pendant le cycle
- Nutrition et mode de vie
- Gestion du stress
- Planification familiale

Si une question dépasse ton domaine d'expertise ou nécessite un avis médical, recommande de consulter un professionnel de santé."""
        
        return base_prompt
    
    def chat(self, user_id, message):
        """Générer une réponse de chat avec l'IA"""
        try:
            # Récupérer le contexte utilisateur
            user_context = self.get_user_context(user_id)
            
            # Générer le prompt système
            system_prompt = self.generate_system_prompt(user_context)
            
            # Préparer les messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
            
            # Appeler l'API OpenRouter avec requests
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": self.model,
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
            else:
                raise Exception(f"API Error: {response.status_code} - {response.text}")
            
            return {
                'success': True,
                'response': ai_response,
                'context_used': user_context is not None
            }
            
        except Exception as e:
            print(f"Erreur lors de la génération de la réponse IA: {e}")
            return {
                'success': False,
                'error': str(e),
                'response': "Désolée, je rencontre des difficultés techniques. Pouvez-vous réessayer dans quelques instants ? 😊"
            }
    
    def generate_fertility_insights(self, user_id):
        """Générer des insights personnalisés sur la fertilité"""
        try:
            user_context = self.get_user_context(user_id)
            if not user_context:
                return None
            
            insight_prompt = """Basé sur les données de cycle et les informations de l'utilisatrice, génère un insight personnalisé sur sa fertilité. 

Inclus:
1. Une analyse de ses patterns de cycle
2. Des conseils pour optimiser sa fertilité
3. Des recommandations personnalisées
4. Des encouragements positifs

Format: Un paragraphe de 3-4 phrases, chaleureux et informatif."""
            
            messages = [
                {"role": "system", "content": self.generate_system_prompt(user_context)},
                {"role": "user", "content": insight_prompt}
            ]
            
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "max_tokens": 300,
                    "temperature": 0.6
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                raise Exception(f"API Error: {response.status_code}")
            
        except Exception as e:
            print(f"Erreur lors de la génération d'insights: {e}")
            return None

