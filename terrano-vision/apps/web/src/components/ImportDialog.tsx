import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { parseM3U, validateM3UContent } from '../utils/m3uParser';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ImportDialogProps {
  onClose: () => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ onClose }) => {
  const { setChannels, setError } = useAppStore();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    channelCount: number;
    errors: string[];
  } | null>(null);

  const handleContentChange = (value: string) => {
    setContent(value);
    setValidationError(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!content.trim()) {
      setValidationError('Veuillez coller le contenu de votre playlist M3U');
      return;
    }

    if (!validateM3UContent(content)) {
      setValidationError('Le contenu ne semble pas être une playlist M3U valide');
      return;
    }

    setIsLoading(true);
    setValidationError(null);

    try {
      const result = parseM3U(content);
      
      if (result.channels.length === 0) {
        setValidationError('Aucune chaîne trouvée dans la playlist');
        return;
      }

      setChannels(result.channels);
      setImportResult({
        success: true,
        channelCount: result.channels.length,
        errors: result.errors
      });

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Import error:', error);
      setValidationError(
        error instanceof Error 
          ? error.message 
          : 'Erreur lors de l\'importation de la playlist'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleContentChange(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold">Importer une playlist M3U</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Choisir un fichier M3U
            </label>
            <input
              type="file"
              accept=".m3u,.m3u8"
              onChange={handleFileUpload}
              className="input"
            />
          </div>

          <div className="text-center text-dark-400 mb-6">
            <span>ou</span>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Coller le contenu M3U
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="#EXTM3U&#10;#EXTINF:-1 tvg-logo=&quot;logo.png&quot; group-title=&quot;News&quot;,Channel Name&#10;https://example.com/stream.m3u8"
              className="input min-h-[200px] resize-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Erreur de validation</p>
                <p className="text-red-300 text-sm">{validationError}</p>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">Import réussi !</p>
                <p className="text-green-300 text-sm">
                  {importResult.channelCount} chaînes importées
                </p>
                {importResult.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-yellow-400 text-sm cursor-pointer">
                      {importResult.errors.length} avertissements
                    </summary>
                    <ul className="mt-1 text-yellow-300 text-xs space-y-1">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {importResult.errors.length > 5 && (
                        <li>• ... et {importResult.errors.length - 5} autres</li>
                      )}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-700">
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-2"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || !content.trim()}
            className="btn-primary px-6 py-2 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Importation...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Importer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportDialog;
