import React, { forwardRef } from 'react';
import { useImageOptimization } from '../hooks/useImageOptimization';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  preload?: boolean;
  fallback?: string;
  placeholder?: string;
  showProgress?: boolean;
  showRetry?: boolean;
  containerClassName?: string;
  loaderClassName?: string;
  errorClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Composant d'image optimisée avec lazy loading, gestion d'erreurs et indicateurs de progression
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    lazy = true,
    quality = 'high',
    preload = false,
    fallback,
    placeholder,
    showProgress = true,
    showRetry = true,
    containerClassName = '',
    loaderClassName = '',
    errorClassName = '',
    className = '',
    onLoad,
    onError,
    ...props
  }, ref) => {
    const {
      src: optimizedSrc,
      isLoading,
      isLoaded,
      hasError,
      progress,
      imgRef,
      retry
    } = useImageOptimization(src, {
      lazy,
      quality,
      preload,
      fallback,
      placeholder
    });

    // Combiner les refs
    const combinedRef = (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Gestionnaires d'événements
    const handleLoad = () => {
      onLoad?.();
    };

    const handleError = () => {
      onError?.();
    };

    const handleRetry = () => {
      retry();
    };

    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        {/* Image principale */}
        {optimizedSrc && (
          <img
            ref={combinedRef}
            src={optimizedSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}

        {/* Placeholder pendant le chargement */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
            {/* Skeleton loader */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-shimmer" />
            
            {/* Indicateur de chargement */}
            {isLoading && showProgress && (
              <div className={`relative z-10 flex flex-col items-center gap-3 ${loaderClassName}`}>
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                  <div className="absolute inset-0 w-8 h-8 border-2 border-primary-400/20 rounded-full" />
                </div>
                
                {/* Barre de progression */}
                <div className="w-24 h-1 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <span className="text-xs text-white/60 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            )}

            {/* Placeholder simple si pas de chargement */}
            {!isLoading && (
              <div className="flex items-center justify-center w-full h-full bg-dark-700/50">
                <div className="w-12 h-12 bg-dark-600 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-dark-500 rounded" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* État d'erreur */}
        {hasError && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-900/20 to-dark-900 ${errorClassName}`}>
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              
              <p className="text-sm text-red-300 mb-3">
                Erreur de chargement
              </p>
              
              {showRetry && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded-lg transition-colors duration-200 border border-red-500/30"
                >
                  <RotateCcw className="w-3 h-3" />
                  Réessayer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Overlay de chargement avec effet premium */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Composant d'image de fond optimisée
 */
export const OptimizedBackgroundImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
}> = ({
  src,
  alt,
  className = '',
  children,
  overlay = true,
  overlayClassName = 'bg-black/50',
  lazy = true,
  quality = 'high'
}) => {
  const { src: optimizedSrc, isLoaded, isLoading } = useImageOptimization(src, {
    lazy,
    quality,
    preload: !lazy
  });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image de fond */}
      {optimizedSrc && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${optimizedSrc})` }}
          role="img"
          aria-label={alt}
        />
      )}

      {/* Placeholder pendant le chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 animate-shimmer" />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {overlay && <div className={`absolute inset-0 ${overlayClassName}`} />}

      {/* Contenu */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Composant d'avatar optimisé
 */
export const OptimizedAvatar: React.FC<{
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}> = ({
  src,
  alt,
  size = 'md',
  className = '',
  fallback
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fallback={fallback}
        className="w-full h-full object-cover"
        containerClassName="w-full h-full"
        quality="medium"
        lazy={true}
      />
    </div>
  );
};

export default OptimizedImage;
