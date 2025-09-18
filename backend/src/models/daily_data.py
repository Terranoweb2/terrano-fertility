from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class DailyData(db.Model):
    __tablename__ = 'daily_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cycle_id = db.Column(db.Integer, db.ForeignKey('cycles.id'), nullable=True)
    date = db.Column(db.Date, nullable=False)
    temperature = db.Column(db.Float, nullable=True)
    cervical_mucus = db.Column(db.String(50), nullable=True)  # dry, sticky, creamy, watery, egg_white
    mood = db.Column(db.String(50), nullable=True)  # happy, sad, anxious, irritable, normal
    symptoms = db.Column(db.Text, nullable=True)  # JSON string of symptoms
    notes = db.Column(db.Text, nullable=True)
    flow_intensity = db.Column(db.String(20), nullable=True)  # none, light, medium, heavy
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', backref=db.backref('daily_data', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cycle_id': self.cycle_id,
            'date': self.date.isoformat() if self.date else None,
            'temperature': self.temperature,
            'cervical_mucus': self.cervical_mucus,
            'mood': self.mood,
            'symptoms': self.symptoms,
            'notes': self.notes,
            'flow_intensity': self.flow_intensity,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<DailyData {self.id}: User {self.user_id}, Date {self.date}>'

