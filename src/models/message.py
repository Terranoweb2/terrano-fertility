from datetime import datetime
from src.models.user import db

class Message(db.Model):
    """Modèle pour les messages privés entre utilisateurs"""
    
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # text, image, file
    file_url = db.Column(db.String(255))  # Pour les fichiers/images
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages')
    
    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'message_type': self.message_type,
            'file_url': self.file_url,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
            'sender': {
                'id': self.sender.id,
                'username': self.sender.username,
                'profile_picture': self.sender.profile_picture
            } if self.sender else None
        }
