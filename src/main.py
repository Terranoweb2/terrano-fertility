import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from src.models.user import db
from src.models.post import Post
from src.models.friendship import Friendship
from src.models.reaction import Reaction
from src.models.comment import Comment
from src.models.message import Message
from src.models.group import Group, GroupMembership
from src.models.notification import Notification
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.post import post_bp
from src.routes.friendship import friendship_bp
from src.routes.reaction import reaction_bp
from src.routes.comment import comment_bp
from src.routes.message import message_bp
from src.routes.group import group_bp
from src.routes.notification import notification_bp
from src.routes.upload import upload_bp
from src.routes.ai import ai_bp
from src.routes.search import search_bp
from src.websocket_manager import websocket_manager
from flask_cors import CORS

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Configuration CORS
CORS(app, supports_credentials=True)

# Initialiser WebSocket
websocket_manager.init_app(app)

# Enregistrer tous les blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(post_bp, url_prefix='/api')
app.register_blueprint(friendship_bp, url_prefix='/api')
app.register_blueprint(reaction_bp, url_prefix='/api')
app.register_blueprint(comment_bp, url_prefix='/api')
app.register_blueprint(message_bp, url_prefix='/api')
app.register_blueprint(group_bp, url_prefix='/api')
app.register_blueprint(notification_bp, url_prefix='/api')
app.register_blueprint(upload_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api')
app.register_blueprint(search_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


@app.route('/api/health')
def health_check():
    return {
        'status': 'healthy',
        'message': 'Ami-Ami API is running!',
        'features': [
            'Authentication',
            'Posts & Comments',
            'Friends & Groups',
            'Real-time Messaging',
            'AI Integration',
            'File Upload',
            'Advanced Search',
            'Analytics Dashboard'
        ]
    }

if __name__ == '__main__':
    print("🚀 Démarrage d'Ami-Ami - Réseau Social avec IA")
    print("=" * 50)
    print("✅ Base de données: SQLite")
    print("✅ WebSocket: Activé")
    print("✅ IA: OpenRouter intégré")
    print("✅ Upload de fichiers: Activé")
    print("✅ Interface moderne: React + Tailwind")
    print("=" * 50)
    print("🌐 Application disponible sur: http://127.0.0.1:5000")
    print("📱 Interface mobile responsive")
    print("🤖 Fonctionnalités IA disponibles")
    print("=" * 50)
    
    # Démarrer l'application avec WebSocket
    websocket_manager.socketio.run(
        app, 
        debug=True, 
        host='0.0.0.0', 
        port=5000,
        allow_unsafe_werkzeug=True
    )
