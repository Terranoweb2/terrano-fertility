from flask import Blueprint, request, jsonify, session
import os
import uuid
from werkzeug.utils import secure_filename
import base64
import imghdr

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_upload_folder():
    """Créer et retourner le dossier d'upload"""
    upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder

@upload_bp.route('/upload/image', methods=['POST'])
def upload_image():
    """Upload d'une image"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    # Vérifier si un fichier a été envoyé
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Type de fichier non autorisé'}), 400
    
    # Vérifier la taille du fichier
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'error': 'Fichier trop volumineux (max 5MB)'}), 400
    
    # Générer un nom de fichier unique
    file_extension = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{file_extension}"
    
    # Sauvegarder le fichier
    upload_folder = get_upload_folder()
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)
    
    # Retourner l'URL du fichier
    file_url = f"/uploads/{filename}"
    
    return jsonify({
        'success': True,
        'file_url': file_url,
        'filename': filename
    })

@upload_bp.route('/upload/base64', methods=['POST'])
def upload_base64():
    """Upload d'une image en base64"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    data = request.get_json()
    base64_data = data.get('image')
    
    if not base64_data:
        return jsonify({'error': 'Données image manquantes'}), 400
    
    try:
        # Décoder les données base64
        if ',' in base64_data:
            header, base64_data = base64_data.split(',', 1)
        
        image_data = base64.b64decode(base64_data)
        
        # Vérifier la taille
        if len(image_data) > MAX_FILE_SIZE:
            return jsonify({'error': 'Image trop volumineuse (max 5MB)'}), 400
        
        # Détecter le type d'image
        image_type = imghdr.what(None, h=image_data)
        if image_type not in ['png', 'jpeg', 'gif', 'webp']:
            return jsonify({'error': 'Type d\'image non supporté'}), 400
        
        # Générer un nom de fichier unique
        filename = f"{uuid.uuid4().hex}.{image_type}"
        
        # Sauvegarder le fichier
        upload_folder = get_upload_folder()
        file_path = os.path.join(upload_folder, filename)
        
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        # Retourner l'URL du fichier
        file_url = f"/uploads/{filename}"
        
        return jsonify({
            'success': True,
            'file_url': file_url,
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors du traitement de l\'image'}), 400

@upload_bp.route('/upload/profile-picture', methods=['POST'])
def upload_profile_picture():
    """Upload d'une photo de profil"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    
    from src.models.user import User
    
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    # Utiliser la fonction d'upload d'image existante
    result = upload_image()
    
    if result[1] == 200:  # Si l'upload a réussi
        response_data = result[0].get_json()
        file_url = response_data['file_url']
        
        # Mettre à jour la photo de profil de l'utilisateur
        user.profile_picture = file_url
        from src.models.user import db
        db.session.commit()
        
        return jsonify({
            'success': True,
            'file_url': file_url,
            'user': user.to_dict()
        })
    
    return result

@upload_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    """Servir les fichiers uploadés"""
    from flask import send_from_directory
    upload_folder = get_upload_folder()
    return send_from_directory(upload_folder, filename)
