import React, { useState, useEffect } from 'react';
import { Monitor, Zap, HardDrive, Clock, TrendingUp, X } from 'lucide-react';
import { imagePerformanceService } from '../services/imagePerformanceService';

interface PerformanceStats {
  loadTime: number;
  cacheHitRate: number;
  totalImages: number;
  cacheSize: number;
  memoryUsage: number;
  networkRequests: number;
}

/**
 * Composant de monitoring des performances en temps réel
 * Affiche les métriques de performance des images et de l'application
 */
export const PerformanceMonitor: React.FC<{
  isVisible: boolean;
  onClose: () => void;
}> = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState<PerformanceStats>({
    loadTime: 0,
    cacheHitRate: 0,
    totalImages: 0,
    cacheSize: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const cacheStats = imagePerformanceService.getCacheStats();
      const performanceMetrics = imagePerformanceService.getPerformanceMetrics();
      
      // Calculer le temps de chargement moyen
      const loadTimes = Array.from(performanceMetrics.values()).map(m => m.loadTime);
      const avgLoadTime = loadTimes.length > 0 
        ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
        : 0;

      // Estimer l'utilisation mémoire (approximative)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      setStats({
        loadTime: avgLoadTime,
        cacheHitRate: cacheStats.hitRate * 100,
        totalImages: cacheStats.totalImages,
        cacheSize: cacheStats.totalSize,
        memoryUsage: memoryUsage / 1024 / 1024, // en MB
        networkRequests: performanceMetrics.size
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
          >
            <Monitor className="w-5 h-5" />
            {isExpanded && <span className="font-medium">Performance</span>}
          </button>
          
          {isExpanded && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          )}
        </div>

        {/* Stats détaillées */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            
            {/* Métriques principales */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Temps de chargement */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white/70">Chargement</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {stats.loadTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-white/50">Temps moyen</div>
              </div>

              {/* Cache Hit Rate */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/70">Cache</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {stats.cacheHitRate.toFixed(0)}%
                </div>
                <div className="text-xs text-white/50">Taux de succès</div>
              </div>

              {/* Images en cache */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-white/70">Images</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {stats.totalImages}
                </div>
                <div className="text-xs text-white/50">En cache</div>
              </div>

              {/* Taille du cache */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-white/70">Taille</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {stats.cacheSize.toFixed(1)}MB
                </div>
                <div className="text-xs text-white/50">Cache total</div>
              </div>
            </div>

            {/* Barre de progression de la mémoire */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/70">Mémoire utilisée</span>
                <span className="text-xs text-white/50">
                  {stats.memoryUsage.toFixed(1)}MB
                </span>
              </div>
              <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-300"
                  style={{ 
                    width: `${Math.min((stats.memoryUsage / 100) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Indicateurs de performance */}
            <div className="space-y-2">
              <div className="text-xs text-white/70 font-medium">Indicateurs</div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Requêtes réseau</span>
                <span className="text-xs text-white font-medium">{stats.networkRequests}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Performance</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    stats.loadTime < 500 ? 'bg-green-400' :
                    stats.loadTime < 1000 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs text-white font-medium">
                    {stats.loadTime < 500 ? 'Excellent' :
                     stats.loadTime < 1000 ? 'Bon' : 'Lent'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Optimisation</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    stats.cacheHitRate > 80 ? 'bg-green-400' :
                    stats.cacheHitRate > 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs text-white font-medium">
                    {stats.cacheHitRate > 80 ? 'Optimale' :
                     stats.cacheHitRate > 60 ? 'Correcte' : 'Faible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  imagePerformanceService.clearCache();
                  setStats(prev => ({ ...prev, totalImages: 0, cacheSize: 0 }));
                }}
                className="w-full py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded-lg transition-colors duration-200 border border-red-500/30"
              >
                Vider le cache
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook pour surveiller les performances
 */
export const usePerformanceMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    if (!isMonitoring) return;

    const collectData = () => {
      const now = Date.now();
      const cacheStats = imagePerformanceService.getCacheStats();
      const performanceMetrics = imagePerformanceService.getPerformanceMetrics();
      
      const dataPoint = {
        timestamp: now,
        cacheSize: cacheStats.totalSize,
        totalImages: cacheStats.totalImages,
        hitRate: cacheStats.hitRate,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      };

      setPerformanceData(prev => {
        const newData = [...prev, dataPoint];
        // Garder seulement les 100 derniers points
        return newData.slice(-100);
      });
    };

    const interval = setInterval(collectData, 1000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);
  const clearData = () => setPerformanceData([]);

  return {
    isMonitoring,
    performanceData,
    startMonitoring,
    stopMonitoring,
    clearData
  };
};

export default PerformanceMonitor;
