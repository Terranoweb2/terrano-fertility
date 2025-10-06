import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { useShakaPlayer } from '../hooks/useShakaPlayer';
import PlayerControls from './PlayerControls';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, AlertCircle, RotateCcw } from 'lucide-react';

const PlayerPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { channels, addToRecentlyWatched } = useAppStore();
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);

  const channel = channels.find(c => c.id === channelId);

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

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleRetry = () => {
    if (channel) {
      clearError();
      loadChannel(channel);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Chaîne introuvable</h2>
        <p className="text-dark-400 mb-4">
          La chaîne demandée n'existe pas ou a été supprimée
        </p>
        <button onClick={handleBack} className="btn-primary px-6 py-2">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative h-full bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Video Container */}
      <div className="video-container h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          controls={false}
          autoPlay
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-white">Chargement de {channel.name}...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Erreur de lecture
              </h3>
              <p className="text-gray-300 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="btn-primary px-6 py-2 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réessayer
                </button>
                <button
                  onClick={handleBack}
                  className="btn-secondary px-6 py-2"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {showControls && !error && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="btn-ghost p-2 rounded-full text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h1 className="text-white font-semibold">{channel.name}</h1>
                {channel.group && (
                  <p className="text-gray-300 text-sm">{channel.group}</p>
                )}
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0">
              <PlayerControls
                playerState={playerState}
                onPlay={play}
                onPause={pause}
                onSeek={seekTo}
                onVolumeChange={setVolume}
                onMuteToggle={setMuted}
                onQualityChange={setQuality}
                onFullscreenToggle={toggleFullscreen}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;
