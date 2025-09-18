from flask import Blueprint, send_from_directory, current_app
import os

frontend_bp = Blueprint('frontend', __name__)

@frontend_bp.route('/')
def serve_index():
    """Servir la page d'accueil React"""
    return send_from_directory(current_app.static_folder, 'index.html')

@frontend_bp.route('/<path:path>')
def serve_static(path):
    """Servir les fichiers statiques React ou rediriger vers index.html pour le routing côté client"""
    static_file_path = os.path.join(current_app.static_folder, path)
    
    # Si le fichier existe, le servir
    if os.path.exists(static_file_path):
        return send_from_directory(current_app.static_folder, path)
    
    # Sinon, servir index.html pour le routing React
    return send_from_directory(current_app.static_folder, 'index.html')

