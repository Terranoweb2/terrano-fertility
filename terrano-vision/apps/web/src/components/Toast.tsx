import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

const Toast: React.FC = () => {
  const { error, clearError } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      clearError();
    }, 300); // Wait for animation to complete
  };

  if (!error) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-4 right-4 z-50 transform transition-all duration-300 ease-in-out',
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      )}
    >
      <div className="pwa-toast flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium">Erreur</p>
          <p className="text-dark-300 text-sm">{error}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-dark-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
