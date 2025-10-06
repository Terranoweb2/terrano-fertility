import React, { useState } from 'react';
import { PlayerState } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  MoreVertical 
} from 'lucide-react';
import { clsx } from 'clsx';

interface PlayerControlsProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: (muted: boolean) => void;
  onQualityChange: (quality: string) => void;
  onFullscreenToggle: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onQualityChange,
  onFullscreenToggle
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * playerState.duration;
    onSeek(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    onVolumeChange(volume);
    if (volume > 0 && playerState.isMuted) {
      onMuteToggle(false);
    }
  };

  const togglePlayPause = () => {
    if (playerState.isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const toggleMute = () => {
    onMuteToggle(!playerState.isMuted);
  };

  const progress = playerState.duration > 0 
    ? (playerState.currentTime / playerState.duration) * 100 
    : 0;

  return (
    <div className="p-4 space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div 
          className="relative h-1 bg-white/30 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-primary-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-white/80">
          <span>{formatTime(playerState.currentTime)}</span>
          <span>{formatTime(playerState.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {playerState.isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>

          {/* Volume */}
          <div className="relative flex items-center">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            {/* Volume Slider */}
            {showVolumeSlider && (
              <div 
                className="absolute left-full ml-2 bg-black/80 rounded-lg p-2"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={playerState.isMuted ? 0 : playerState.volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quality Menu */}
          {playerState.availableQualities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
              
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2 min-w-[120px]">
                  <div className="px-3 py-1 text-xs text-white/60 font-medium">
                    Qualité
                  </div>
                  {playerState.availableQualities.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        onQualityChange(quality);
                        setShowQualityMenu(false);
                      }}
                      className={clsx(
                        'w-full px-3 py-2 text-left text-sm hover:bg-white/20 transition-colors',
                        playerState.quality === quality 
                          ? 'text-primary-400' 
                          : 'text-white'
                      )}
                    >
                      {quality}
                      {playerState.quality === quality && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onQualityChange('auto');
                      setShowQualityMenu(false);
                    }}
                    className={clsx(
                      'w-full px-3 py-2 text-left text-sm hover:bg-white/20 transition-colors',
                      !playerState.quality || playerState.quality === 'auto'
                        ? 'text-primary-400' 
                        : 'text-white'
                    )}
                  >
                    Auto
                    {(!playerState.quality || playerState.quality === 'auto') && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fullscreen */}
          <button
            onClick={onFullscreenToggle}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
