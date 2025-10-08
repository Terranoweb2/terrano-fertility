import json
import threading
from flask import session
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from src.models.user import db, User
from src.models.notification import Notification

class WebSocketManager:
    def __init__(self, app=None):
        self.socketio = None
        self.connected_users = {}  # user_id -> session_id
        self.user_rooms = {}  # user_id -> [room_ids]
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        self.socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')
        self.setup_handlers()
    
    def setup_handlers(self):
        @self.socketio.on('connect')
        def handle_connect():
            if 'user_id' not in session:
                disconnect()
                return False
            
            user_id = session['user_id']
            self.connected_users[user_id] = session.sid
            
            # Rejoindre la room personnelle de l'utilisateur
            join_room(f'user_{user_id}')
            
            # Rejoindre les rooms des groupes de l'utilisateur
            user = User.query.get(user_id)
            if user:
                for membership in user.group_memberships:
                    join_room(f'group_{membership.group_id}')
                    
                    if user_id not in self.user_rooms:
                        self.user_rooms[user_id] = []
                    self.user_rooms[user_id].append(f'group_{membership.group_id}')
            
            emit('connected', {'status': 'success', 'user_id': user_id})
            print(f'Utilisateur {user_id} connecté via WebSocket')
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            if 'user_id' in session:
                user_id = session['user_id']
                
                # Quitter toutes les rooms
                leave_room(f'user_{user_id}')
                if user_id in self.user_rooms:
                    for room in self.user_rooms[user_id]:
                        leave_room(room)
                    del self.user_rooms[user_id]
                
                # Supprimer de la liste des utilisateurs connectés
                if user_id in self.connected_users:
                    del self.connected_users[user_id]
                
                print(f'Utilisateur {user_id} déconnecté du WebSocket')
        
        @self.socketio.on('join_group')
        def handle_join_group(data):
            if 'user_id' not in session:
                return
            
            user_id = session['user_id']
            group_id = data.get('group_id')
            
            if group_id:
                room_name = f'group_{group_id}'
                join_room(room_name)
                
                if user_id not in self.user_rooms:
                    self.user_rooms[user_id] = []
                if room_name not in self.user_rooms[user_id]:
                    self.user_rooms[user_id].append(room_name)
                
                emit('joined_group', {'group_id': group_id})
        
        @self.socketio.on('leave_group')
        def handle_leave_group(data):
            if 'user_id' not in session:
                return
            
            user_id = session['user_id']
            group_id = data.get('group_id')
            
            if group_id:
                room_name = f'group_{group_id}'
                leave_room(room_name)
                
                if user_id in self.user_rooms and room_name in self.user_rooms[user_id]:
                    self.user_rooms[user_id].remove(room_name)
                
                emit('left_group', {'group_id': group_id})
        
        @self.socketio.on('typing')
        def handle_typing(data):
            if 'user_id' not in session:
                return
            
            user_id = session['user_id']
            conversation_id = data.get('conversation_id')
            is_typing = data.get('is_typing', False)
            
            if conversation_id:
                # Notifier l'autre utilisateur dans la conversation
                emit('user_typing', {
                    'user_id': user_id,
                    'conversation_id': conversation_id,
                    'is_typing': is_typing
                }, room=f'user_{conversation_id}')
    
    def send_notification(self, user_id, notification_data):
        """Envoyer une notification en temps réel à un utilisateur"""
        if self.socketio and user_id in self.connected_users:
            self.socketio.emit('new_notification', notification_data, room=f'user_{user_id}')
    
    def send_message_notification(self, receiver_id, message_data):
        """Envoyer une notification de nouveau message"""
        if self.socketio and receiver_id in self.connected_users:
            self.socketio.emit('new_message', message_data, room=f'user_{receiver_id}')
    
    def send_group_notification(self, group_id, notification_data):
        """Envoyer une notification à tous les membres d'un groupe"""
        if self.socketio:
            self.socketio.emit('group_notification', notification_data, room=f'group_{group_id}')
    
    def send_friend_request_notification(self, user_id, request_data):
        """Envoyer une notification de demande d'ami"""
        if self.socketio and user_id in self.connected_users:
            self.socketio.emit('friend_request', request_data, room=f'user_{user_id}')
    
    def send_post_notification(self, user_id, post_data):
        """Envoyer une notification de nouveau post d'un ami"""
        if self.socketio and user_id in self.connected_users:
            self.socketio.emit('friend_post', post_data, room=f'user_{user_id}')
    
    def broadcast_online_status(self, user_id, is_online):
        """Diffuser le statut en ligne d'un utilisateur à ses amis"""
        if self.socketio:
            user = User.query.get(user_id)
            if user:
                # Récupérer la liste des amis
                friends = []
                for friendship in user.friendships:
                    if friendship.status == 'accepted':
                        friend_id = friendship.friend_id if friendship.user_id == user_id else friendship.user_id
                        friends.append(friend_id)
                
                # Notifier chaque ami en ligne
                for friend_id in friends:
                    if friend_id in self.connected_users:
                        self.socketio.emit('friend_status_change', {
                            'user_id': user_id,
                            'username': user.username,
                            'is_online': is_online
                        }, room=f'user_{friend_id}')
    
    def get_online_users(self):
        """Retourner la liste des utilisateurs en ligne"""
        return list(self.connected_users.keys())
    
    def is_user_online(self, user_id):
        """Vérifier si un utilisateur est en ligne"""
        return user_id in self.connected_users

# Instance globale du gestionnaire WebSocket
websocket_manager = WebSocketManager()
