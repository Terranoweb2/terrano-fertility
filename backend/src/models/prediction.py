from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cycle_id = db.Column(db.Integer, db.ForeignKey('cycles.id'), nullable=True)
    ovulation_date = db.Column(db.Date, nullable=True)
    fertile_window_start = db.Column(db.Date, nullable=True)
    fertile_window_end = db.Column(db.Date, nullable=True)
    next_period_date = db.Column(db.Date, nullable=True)
    confidence_level = db.Column(db.Float, nullable=True)  # 0.0 to 1.0
    algorithm_version = db.Column(db.String(20), default='1.0')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', backref=db.backref('predictions', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cycle_id': self.cycle_id,
            'ovulation_date': self.ovulation_date.isoformat() if self.ovulation_date else None,
            'fertile_window_start': self.fertile_window_start.isoformat() if self.fertile_window_start else None,
            'fertile_window_end': self.fertile_window_end.isoformat() if self.fertile_window_end else None,
            'next_period_date': self.next_period_date.isoformat() if self.next_period_date else None,
            'confidence_level': self.confidence_level,
            'algorithm_version': self.algorithm_version,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Prediction {self.id}: User {self.user_id}, Ovulation {self.ovulation_date}>'

