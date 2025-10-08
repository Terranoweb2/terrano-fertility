from datetime import datetime
from src.models.user import db

class Group(db.Model):
    """Modèle pour les groupes d'amis"""
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cover_image = db.Column(db.String(255))
    is_private = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    creator = db.relationship('User', backref='created_groups')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'creator_id': self.creator_id,
            'cover_image': self.cover_image,
            'is_private': self.is_private,
            'created_at': self.created_at.isoformat(),
            'creator': {
                'id': self.creator.id,
                'username': self.creator.username
            } if self.creator else None,
            'member_count': len(self.members)
        }

class GroupMembership(db.Model):
    """Modèle pour l'appartenance aux groupes"""
    
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(20), default='member')  # member, admin, moderator
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    group = db.relationship('Group', backref='members')
    user = db.relationship('User', backref='group_memberships')
    
    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'user_id': self.user_id,
            'role': self.role,
            'joined_at': self.joined_at.isoformat(),
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'profile_picture': self.user.profile_picture
            } if self.user else None
        }
