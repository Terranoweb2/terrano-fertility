from src.models.user import db
from datetime import datetime

class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id1 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_id2 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # 'pending', 'accepted', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    requester = db.relationship('User', foreign_keys=[user_id1], backref='sent_requests')
    receiver = db.relationship('User', foreign_keys=[user_id2], backref='received_requests')
    
    def __repr__(self):
        return f'<Friendship {self.user_id1}-{self.user_id2}: {self.status}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id1': self.user_id1,
            'user_id2': self.user_id2,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'requester': self.requester.to_dict() if self.requester else None,
            'receiver': self.receiver.to_dict() if self.receiver else None
        }
