from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Cycle(db.Model):
    __tablename__ = 'cycles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    cycle_length = db.Column(db.Integer, nullable=True)
    period_length = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', backref=db.backref('cycles', lazy=True))
    daily_data = db.relationship('DailyData', backref='cycle', lazy=True, cascade='all, delete-orphan')
    predictions = db.relationship('Prediction', backref='cycle', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'cycle_length': self.cycle_length,
            'period_length': self.period_length,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Cycle {self.id}: User {self.user_id}, Start {self.start_date}>'

