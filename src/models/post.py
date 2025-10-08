from src.models.user import db
from datetime import datetime

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Nouvelles fonctionnalités
    image_url = db.Column(db.String(255))  # URL de l'image attachée
    post_type = db.Column(db.String(20), default='text')  # text, image, video, link
    privacy = db.Column(db.String(20), default='friends')  # public, friends, private
    location = db.Column(db.String(100))  # Localisation optionnelle
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))  # Post dans un groupe
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    reactions = db.relationship('Reaction', backref='post', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Post {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'post_type': self.post_type,
            'privacy': self.privacy,
            'location': self.location,
            'group_id': self.group_id,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'author': self.author.to_dict() if self.author else None,
            'reactions_count': len(self.reactions),
            'comments_count': len(self.comments)
        }
