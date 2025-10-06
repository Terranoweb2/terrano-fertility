import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageOptimizationOptions {
  lazy?: boolean;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high';
  preload?: boolean;
  fallback?: string;
}

interface ImageState {
  src: string | null;
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  progress: number;
}

/**
 * Hook personnalisé pour l'optimisation du chargement des images
 * Inclut lazy loading, preloading, gestion d'erreurs et indicateurs de progression
 */
export const useImageOptimization = (
  imageSrc: string,
  options: ImageOptimizationOptions = {}
) => {
  const {
    lazy = true,
    placeholder = '',
    quality = 'high',
    preload = false,
    fallback = '/images/placeholder.jpg'
  } = options;

  const [imageState, setImageState] = useState<ImageState>({
    src: lazy ? placeholder : null,
    isLoading: false,
    isLoaded: false,
    hasError: false,
    progress: 0
  });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour charger l'image avec gestion de progression
  const loadImage = useCallback((src: string) => {
    if (!src) return;

    setImageState(prev => ({ ...prev, isLoading: true, hasError: false, progress: 0 }));

    const img = new Image();
    
    // Simulation de progression pour les images (approximative)
    const progressInterval = setInterval(() => {
      setImageState(prev => {
        if (prev.progress < 90) {
          return { ...prev, progress: prev.progress + 10 };
        }
        return prev;
      });
    }, 100);

    img.onload = () => {
      clearInterval(progressInterval);
      setImageState({
        src,
        isLoading: false,
        isLoaded: true,
        hasError: false,
        progress: 100
      });
    };

    img.onerror = () => {
      clearInterval(progressInterval);
      console.warn(`Failed to load image: ${src}, using fallback: ${fallback}`);
      
      // Essayer de charger l'image de fallback
      if (src !== fallback) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageState({
            src: fallback,
            isLoading: false,
            isLoaded: true,
            hasError: true,
            progress: 100
          });
        };
        fallbackImg.onerror = () => {
          setImageState({
            src: null,
            isLoading: false,
            isLoaded: false,
            hasError: true,
            progress: 0
          });
        };
        fallbackImg.src = fallback;
      } else {
        setImageState({
          src: null,
          isLoading: false,
          isLoaded: false,
          hasError: true,
          progress: 0
        });
      }
    };

    // Timeout pour éviter les chargements trop longs
    loadTimeoutRef.current = setTimeout(() => {
      clearInterval(progressInterval);
      img.onerror?.(new Event('timeout'));
    }, 10000); // 10 secondes timeout

    img.src = src;
  }, [fallback]);

  // Fonction pour optimiser la qualité de l'image selon les paramètres
  const getOptimizedSrc = useCallback((src: string) => {
    if (!src) return src;
    
    // Si l'image est déjà optimisée ou si c'est une URL externe, la retourner telle quelle
    if (src.includes('?') || src.startsWith('http')) {
      return src;
    }

    // Ajouter des paramètres d'optimisation pour les images locales
    const params = new URLSearchParams();
    
    switch (quality) {
      case 'low':
        params.set('q', '60');
        params.set('w', '400');
        break;
      case 'medium':
        params.set('q', '80');
        params.set('w', '800');
        break;
      case 'high':
      default:
        params.set('q', '95');
        params.set('w', '1200');
        break;
    }

    return `${src}?${params.toString()}`;
  }, [quality]);

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !imageState.isLoaded && !imageState.isLoading) {
            const optimizedSrc = getOptimizedSrc(imageSrc);
            loadImage(optimizedSrc);
          }
        });
      },
      {
        rootMargin: '50px', // Commencer à charger 50px avant que l'image soit visible
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, imageSrc, imageState.isLoaded, imageState.isLoading, loadImage, getOptimizedSrc]);

  // Preload pour les images importantes
  useEffect(() => {
    if (preload && !lazy) {
      const optimizedSrc = getOptimizedSrc(imageSrc);
      loadImage(optimizedSrc);
    }
  }, [preload, lazy, imageSrc, loadImage, getOptimizedSrc]);

  // Chargement immédiat si pas de lazy loading
  useEffect(() => {
    if (!lazy && imageSrc && !imageState.isLoaded && !imageState.isLoading) {
      const optimizedSrc = getOptimizedSrc(imageSrc);
      loadImage(optimizedSrc);
    }
  }, [lazy, imageSrc, imageState.isLoaded, imageState.isLoading, loadImage, getOptimizedSrc]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Fonction pour retry le chargement
  const retry = useCallback(() => {
    const optimizedSrc = getOptimizedSrc(imageSrc);
    loadImage(optimizedSrc);
  }, [imageSrc, loadImage, getOptimizedSrc]);

  return {
    ...imageState,
    imgRef,
    retry,
    optimizedSrc: getOptimizedSrc(imageSrc)
  };
};

/**
 * Hook pour précharger plusieurs images
 */
export const useImagePreloader = (imageSources: string[]) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  const preloadImages = useCallback(async () => {
    if (imageSources.length === 0) return;

    setIsPreloading(true);
    setPreloadProgress(0);

    const promises = imageSources.map((src, index) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, src]));
          setPreloadProgress((index + 1) / imageSources.length * 100);
          resolve(src);
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          setPreloadProgress((index + 1) / imageSources.length * 100);
          reject(new Error(`Failed to load ${src}`));
        };
        
        img.src = src;
      });
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [imageSources]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return {
    preloadedImages,
    isPreloading,
    preloadProgress,
    preloadImages
  };
};

/**
 * Hook pour la gestion du cache des images
 */
export const useImageCache = () => {
  const cacheRef = useRef<Map<string, string>>(new Map());

  const getCachedImage = useCallback((src: string): string | null => {
    return cacheRef.current.get(src) || null;
  }, []);

  const setCachedImage = useCallback((src: string, cachedSrc: string) => {
    cacheRef.current.set(src, cachedSrc);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const getCacheSize = useCallback(() => {
    return cacheRef.current.size;
  }, []);

  return {
    getCachedImage,
    setCachedImage,
    clearCache,
    getCacheSize
  };
};
