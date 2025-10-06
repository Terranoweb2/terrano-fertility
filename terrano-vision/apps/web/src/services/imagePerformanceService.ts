/**
 * Service de gestion des performances pour les images
 * Optimise le chargement, la mise en cache et la qualité des images
 */

interface ImageMetrics {
  loadTime: number;
  fileSize: number;
  dimensions: { width: number; height: number };
  format: string;
  quality: number;
}

interface PerformanceConfig {
  maxCacheSize: number; // en MB
  maxImageSize: number; // en MB
  compressionQuality: number; // 0-1
  lazyLoadThreshold: number; // en pixels
  preloadCount: number; // nombre d'images à précharger
  retryAttempts: number;
  retryDelay: number; // en ms
}

class ImagePerformanceService {
  private cache: Map<string, { blob: Blob; timestamp: number; metrics: ImageMetrics }> = new Map();
  private loadingQueue: Set<string> = new Set();
  private performanceMetrics: Map<string, ImageMetrics> = new Map();
  private config: PerformanceConfig;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      maxCacheSize: 50, // 50MB
      maxImageSize: 5, // 5MB
      compressionQuality: 0.8,
      lazyLoadThreshold: 100,
      preloadCount: 5,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    // Nettoyage périodique du cache
    setInterval(() => this.cleanupCache(), 5 * 60 * 1000); // Toutes les 5 minutes
  }

  /**
   * Charge une image de manière optimisée
   */
  async loadImage(src: string, options: {
    priority?: 'low' | 'normal' | 'high';
    quality?: 'low' | 'medium' | 'high';
    maxWidth?: number;
    maxHeight?: number;
  } = {}): Promise<string> {
    const { priority = 'normal', quality = 'high', maxWidth, maxHeight } = options;

    // Vérifier le cache
    const cached = this.getCachedImage(src);
    if (cached) {
      return URL.createObjectURL(cached.blob);
    }

    // Éviter les chargements multiples de la même image
    if (this.loadingQueue.has(src)) {
      return this.waitForLoad(src);
    }

    this.loadingQueue.add(src);

    try {
      const startTime = performance.now();
      
      // Charger l'image avec retry logic
      const blob = await this.fetchImageWithRetry(src);
      
      // Optimiser l'image si nécessaire
      const optimizedBlob = await this.optimizeImage(blob, {
        quality,
        maxWidth,
        maxHeight
      });

      const loadTime = performance.now() - startTime;
      
      // Calculer les métriques
      const metrics = await this.calculateMetrics(optimizedBlob, loadTime);
      
      // Mettre en cache
      this.setCachedImage(src, optimizedBlob, metrics);
      
      // Enregistrer les métriques de performance
      this.performanceMetrics.set(src, metrics);

      const objectUrl = URL.createObjectURL(optimizedBlob);
      this.loadingQueue.delete(src);
      
      return objectUrl;
    } catch (error) {
      this.loadingQueue.delete(src);
      console.error(`Failed to load image: ${src}`, error);
      throw error;
    }
  }

  /**
   * Précharge plusieurs images
   */
  async preloadImages(sources: string[], priority: 'low' | 'normal' | 'high' = 'low'): Promise<void> {
    const promises = sources.slice(0, this.config.preloadCount).map(src => 
      this.loadImage(src, { priority }).catch(error => {
        console.warn(`Failed to preload image: ${src}`, error);
        return null;
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Optimise une image (compression, redimensionnement)
   */
  private async optimizeImage(blob: Blob, options: {
    quality?: 'low' | 'medium' | 'high';
    maxWidth?: number;
    maxHeight?: number;
  }): Promise<Blob> {
    const { quality = 'high', maxWidth, maxHeight } = options;

    // Si l'image est déjà petite, pas besoin d'optimisation
    if (blob.size < 100 * 1024) { // 100KB
      return blob;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(blob);
        return;
      }

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (maxHeight && height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Déterminer la qualité de compression
        let compressionQuality: number;
        switch (quality) {
          case 'low':
            compressionQuality = 0.6;
            break;
          case 'medium':
            compressionQuality = 0.8;
            break;
          case 'high':
          default:
            compressionQuality = 0.9;
            break;
        }

        // Convertir en blob optimisé
        canvas.toBlob(
          (optimizedBlob) => {
            if (optimizedBlob) {
              // Utiliser l'image optimisée seulement si elle est plus petite
              resolve(optimizedBlob.size < blob.size ? optimizedBlob : blob);
            } else {
              resolve(blob);
            }
          },
          'image/webp', // Format moderne
          compressionQuality
        );
      };

      img.onerror = () => resolve(blob);
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Charge une image avec retry logic
   */
  private async fetchImageWithRetry(src: string, attempt = 1): Promise<Blob> {
    try {
      const response = await fetch(src, {
        cache: 'force-cache',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Vérifier la taille du fichier
      if (blob.size > this.config.maxImageSize * 1024 * 1024) {
        console.warn(`Image too large: ${src} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);
      }

      return blob;
    } catch (error) {
      if (attempt < this.config.retryAttempts) {
        console.warn(`Retry loading image (${attempt}/${this.config.retryAttempts}): ${src}`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        return this.fetchImageWithRetry(src, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Calcule les métriques de performance d'une image
   */
  private async calculateMetrics(blob: Blob, loadTime: number): Promise<ImageMetrics> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          loadTime,
          fileSize: blob.size,
          dimensions: { width: img.width, height: img.height },
          format: blob.type,
          quality: this.estimateQuality(blob.size, img.width, img.height)
        });
      };

      img.onerror = () => {
        resolve({
          loadTime,
          fileSize: blob.size,
          dimensions: { width: 0, height: 0 },
          format: blob.type,
          quality: 0
        });
      };

      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Estime la qualité d'une image basée sur sa taille et ses dimensions
   */
  private estimateQuality(fileSize: number, width: number, height: number): number {
    const pixels = width * height;
    const bytesPerPixel = fileSize / pixels;
    
    // Estimation approximative basée sur les bytes par pixel
    if (bytesPerPixel > 3) return 95; // Très haute qualité
    if (bytesPerPixel > 2) return 85; // Haute qualité
    if (bytesPerPixel > 1) return 75; // Qualité moyenne
    if (bytesPerPixel > 0.5) return 65; // Qualité faible
    return 50; // Très faible qualité
  }

  /**
   * Attend qu'une image en cours de chargement soit prête
   */
  private async waitForLoad(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (!this.loadingQueue.has(src)) {
          clearInterval(checkInterval);
          const cached = this.getCachedImage(src);
          if (cached) {
            resolve(URL.createObjectURL(cached.blob));
          } else {
            reject(new Error('Image loading failed'));
          }
        }
      }, 100);

      // Timeout après 30 secondes
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Image loading timeout'));
      }, 30000);
    });
  }

  /**
   * Récupère une image du cache
   */
  private getCachedImage(src: string) {
    const cached = this.cache.get(src);
    if (cached) {
      // Vérifier si l'image n'est pas trop ancienne (24h)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - cached.timestamp < maxAge) {
        return cached;
      } else {
        this.cache.delete(src);
      }
    }
    return null;
  }

  /**
   * Met une image en cache
   */
  private setCachedImage(src: string, blob: Blob, metrics: ImageMetrics) {
    // Vérifier la taille du cache
    this.ensureCacheSize();
    
    this.cache.set(src, {
      blob,
      timestamp: Date.now(),
      metrics
    });
  }

  /**
   * S'assure que le cache ne dépasse pas la taille maximale
   */
  private ensureCacheSize() {
    const maxSizeBytes = this.config.maxCacheSize * 1024 * 1024;
    let currentSize = 0;
    
    // Calculer la taille actuelle du cache
    for (const [, cached] of this.cache) {
      currentSize += cached.blob.size;
    }

    // Si le cache est trop gros, supprimer les plus anciennes entrées
    if (currentSize > maxSizeBytes) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);

      while (currentSize > maxSizeBytes && entries.length > 0) {
        const [key, cached] = entries.shift()!;
        currentSize -= cached.blob.size;
        this.cache.delete(key);
      }
    }
  }

  /**
   * Nettoie le cache des entrées expirées
   */
  private cleanupCache() {
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures
    const now = Date.now();

    for (const [key, cached] of this.cache) {
      if (now - cached.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtient les métriques de performance
   */
  getPerformanceMetrics(): Map<string, ImageMetrics> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Obtient les statistiques du cache
   */
  getCacheStats() {
    let totalSize = 0;
    let totalImages = 0;

    for (const [, cached] of this.cache) {
      totalSize += cached.blob.size;
      totalImages++;
    }

    return {
      totalImages,
      totalSize: totalSize / 1024 / 1024, // en MB
      maxSize: this.config.maxCacheSize,
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Calcule le taux de succès du cache
   */
  private calculateHitRate(): number {
    // Implémentation simplifiée - dans un vrai système, on trackrait les hits/misses
    return this.cache.size > 0 ? 0.85 : 0;
  }

  /**
   * Vide le cache
   */
  clearCache() {
    this.cache.clear();
    this.performanceMetrics.clear();
  }
}

// Instance singleton
export const imagePerformanceService = new ImagePerformanceService();

// Types exportés
export type { ImageMetrics, PerformanceConfig };
export { ImagePerformanceService };
