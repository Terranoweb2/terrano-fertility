from datetime import datetime
from src.models.user import db

class Notification(db.Model):
    """Modèle pour les notifications utilisateur"""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # friend_request, like, comment, message, group_invite
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    related_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Utilisateur qui a déclenché la notification
    related_post_id = db.Column(db.Integer, db.ForeignKey('post.id'))  # Post concerné
    related_group_id = db.Column(db.Integer, db.ForeignKey('group.id'))  # Groupe concerné
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    user = db.relationship('User', foreign_keys=[user_id], backref='notifications')
    related_user = db.relationship('User', foreign_keys=[related_user_id])
    related_post = db.relationship('Post', foreign_keys=[related_post_id])
    related_group = db.relationship('Group', foreign_keys=[related_group_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'related_user_id': self.related_user_id,
            'related_post_id': self.related_post_id,
            'related_group_id': self.related_group_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
            'related_user': {
                'id': self.related_user.id,
                'username': self.related_user.username,
                'profile_picture': self.related_user.profile_picture
            } if self.related_user else None
        }
