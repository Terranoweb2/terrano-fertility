import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { useShakaPlayer } from '../hooks/useShakaPlayer';
import PlayerControls from './PlayerControls';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, AlertCircle, RotateCcw, Star, Heart, Share2, Settings, Maximize2 } from 'lucide-react';
import { PREMIUM_IMAGES, getRandomImage } from '../constants/premiumImages';

const PlayerPagePremium: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { channels, addToRecentlyWatched, favorites, toggleFavorite } = useAppStore();
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  const channel = channels.find(c => c.id === channelId);
  const isFavorite = channel ? favorites.includes(channel.id) : false;

  const {
    videoRef,
    playerState,
    isLoading,
    error,
    loadChannel,
    play,
    pause,
    setVolume,
    setMuted,
    seekTo,
    setQuality,
    toggleFullscreen,
    clearError
  } = useShakaPlayer({
    onError: (error) => {
      console.error('Player error:', error);
    },
    onStateChange: (state) => {
      // Handle state changes if needed
    }
  });

  // Load channel when component mounts or channel changes
  useEffect(() => {
    if (channel) {
      loadChannel(channel);
      addToRecentlyWatched(channel.id);
      // Set a random background image based on channel category
      const categoryImages = Object.values(PREMIUM_IMAGES.CANAL);
      setBackgroundImage(categoryImages[Math.floor(Math.random() * categoryImages.length)]);
    }
  }, [channel, loadChannel, addToRecentlyWatched]);

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }

    if (showControls && playerState.isPlaying) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }

    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showControls, playerState.isPlaying]);

  const handleVideoClick = () => {
    setShowControls(!showControls);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    if (channel) {
      clearError();
      loadChannel(channel);
    }
  };

  const handleToggleFavorite = () => {
    if (channel) {
      toggleFavorite(channel.id);
    }
  };

  if (!channel) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Chaîne introuvable</h2>
          <p className="text-dark-400 mb-6">La chaîne demandée n'existe pas ou a été supprimée.</p>
          <button
            onClick={handleBack}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden bg-black">
      {/* Background premium avec image dynamique */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-20 blur-sm"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* Particules animées */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Video Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header avec contrôles premium */}
        <div className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}>
          <div className="bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                
                <div className="flex items-center gap-3">
                  {channel.logo && (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-10 h-10 rounded-lg object-cover border border-white/20"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h1 className="text-lg font-bold text-white">{channel.name}</h1>
                    {channel.group && (
                      <p className="text-sm text-white/70">{channel.group}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 relative" onClick={handleVideoClick}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            playsInline
            controls={false}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-4 text-lg">Chargement de {channel.name}...</p>
                <div className="mt-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <p className="text-white/70 text-sm">Connexion au flux premium...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Erreur de lecture</h3>
                <p className="text-white/70 mb-6 leading-relaxed">{error}</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRetry}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Réessayer
                  </button>
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {showControls && !isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                {playerState.isPlaying ? (
                  <div className="w-6 h-6 flex gap-1">
                    <div className="w-2 h-6 bg-white rounded-sm" />
                    <div className="w-2 h-6 bg-white rounded-sm" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}>
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
            <PlayerControls
              playerState={playerState}
              onPlay={play}
              onPause={pause}
              onVolumeChange={setVolume}
              onMutedChange={setMuted}
              onSeek={seekTo}
              onQualityChange={setQuality}
              onFullscreen={toggleFullscreen}
            />
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-20 right-4 z-30 w-80 max-h-96 overflow-auto">
            <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Informations</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/70">✕</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70">Nom de la chaîne</label>
                  <p className="text-white font-medium">{channel.name}</p>
                </div>
                
                {channel.group && (
                  <div>
                    <label className="text-sm text-white/70">Catégorie</label>
                    <p className="text-white font-medium">{channel.group}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm text-white/70">URL du flux</label>
                  <p className="text-white/80 text-sm break-all font-mono bg-white/10 p-2 rounded-lg">
                    {channel.url}
                  </p>
                </div>
                
                {playerState.currentTime > 0 && (
                  <div>
                    <label className="text-sm text-white/70">Temps de lecture</label>
                    <p className="text-white font-medium">
                      {Math.floor(playerState.currentTime / 60)}:{String(Math.floor(playerState.currentTime % 60)).padStart(2, '0')}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>Qualité premium garantie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPagePremium;
