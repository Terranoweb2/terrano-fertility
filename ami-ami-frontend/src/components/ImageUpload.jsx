import React, { useState, useRef } from 'react';
import { apiService } from '../lib/api';

const ImageUpload = ({ onImageUploaded, className = '', children }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Utilisez PNG, JPEG, GIF ou WebP.');
      return;
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Fichier trop volumineux. Taille maximum : 5MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        onImageUploaded(data.file_url);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          cursor-pointer transition-all duration-200
          ${dragOver ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {uploading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Upload en cours...</span>
          </div>
        ) : (
          children || (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">Cliquez pour sélectionner une image</p>
              <p className="text-sm text-gray-400">ou glissez-déposez ici</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPEG, GIF, WebP (max 5MB)</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
