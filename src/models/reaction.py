from src.models.user import db
from datetime import datetime

class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    reaction_type = db.Column(db.String(20), nullable=False)  # 'like', 'love', 'laugh', etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', backref='reactions')
    
    # Contrainte unique pour éviter les réactions multiples du même utilisateur sur le même post
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id', name='unique_user_post_reaction'),)
    
    def __repr__(self):
        return f'<Reaction {self.user_id}-{self.post_id}: {self.reaction_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'reaction_type': self.reaction_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict() if self.user else None
        }
