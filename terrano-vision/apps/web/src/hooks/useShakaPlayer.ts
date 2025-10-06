import { useEffect, useRef, useState, useCallback } from 'react';
import { Channel, PlayerState } from '../types';

// Types pour Shaka Player
declare global {
  interface Window {
    shaka: any;
  }
}

interface UseShakaPlayerOptions {
  onError?: (error: any) => void;
  onStateChange?: (state: Partial<PlayerState>) => void;
}

export const useShakaPlayer = (options: UseShakaPlayerOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    quality: undefined,
    availableQualities: []
  });

  // Initialize Shaka Player
  const initializePlayer = useCallback(async () => {
    if (!videoRef.current || playerRef.current) return;

    try {
      // Load Shaka Player if not already loaded
      if (!window.shaka) {
        await loadShakaPlayer();
      }

      // Install polyfills
      window.shaka.polyfill.installAll();

      // Check browser support
      if (!window.shaka.Player.isBrowserSupported()) {
        throw new Error('Browser not supported by Shaka Player');
      }

      // Create player
      const player = new window.shaka.Player(videoRef.current);
      playerRef.current = player;

      // Configure player
      player.configure({
        streaming: {
          retryParameters: {
            timeout: 30000,
            maxAttempts: 3,
            baseDelay: 1000,
            backoffFactor: 2,
            fuzzFactor: 0.5
          },
          bufferingGoal: 30,
          rebufferingGoal: 5
        },
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 1000000
        }
      });

      // Error handling
      player.addEventListener('error', (event: any) => {
        const error = event.detail;
        console.error('Shaka Player Error:', error);
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        options.onError?.(error);
      });

      // Track loading state
      player.addEventListener('loading', () => setIsLoading(true));
      player.addEventListener('loaded', () => setIsLoading(false));

      console.log('✅ Shaka Player initialized');
    } catch (err) {
      console.error('❌ Failed to initialize Shaka Player:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize player');
    }
  }, [options]);

  // Load a channel
  const loadChannel = useCallback(async (channel: Channel) => {
    if (!playerRef.current || !videoRef.current) {
      console.error('Player not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let streamUrl = channel.url;

      // Use proxy if headers are required
      if (channel.ua || channel.ref) {
        const proxyUrl = new URL('/proxy', window.location.origin.replace('3000', '3001'));
        proxyUrl.searchParams.set('url', channel.url);
        if (channel.ua) proxyUrl.searchParams.set('ua', channel.ua);
        if (channel.ref) proxyUrl.searchParams.set('ref', channel.ref);
        streamUrl = proxyUrl.toString();
      }

      console.log(`🎥 Loading channel: ${channel.name}`);
      console.log(`📡 Stream URL: ${streamUrl}`);

      await playerRef.current.load(streamUrl);
      
      // Update available qualities
      updateAvailableQualities();
      
      console.log('✅ Channel loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load channel:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stream';
      setError(errorMessage);
      
      // Retry logic
      setTimeout(() => {
        console.log('🔄 Retrying stream load...');
        loadChannel(channel);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update available video qualities
  const updateAvailableQualities = useCallback(() => {
    if (!playerRef.current) return;

    try {
      const tracks = playerRef.current.getVariantTracks();
      const qualities = tracks
        .map((track: any) => `${track.height}p`)
        .filter((quality: string, index: number, arr: string[]) => arr.indexOf(quality) === index)
        .sort((a: string, b: string) => parseInt(b) - parseInt(a));

      setPlayerState(prev => ({
        ...prev,
        availableQualities: qualities
      }));
    } catch (err) {
      console.warn('Failed to get available qualities:', err);
    }
  }, []);

  // Player controls
  const play = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const setQuality = useCallback((quality: string) => {
    if (!playerRef.current) return;

    try {
      const tracks = playerRef.current.getVariantTracks();
      const targetTrack = tracks.find((track: any) => `${track.height}p` === quality);
      
      if (targetTrack) {
        playerRef.current.selectVariantTrack(targetTrack, true);
        setPlayerState(prev => ({ ...prev, quality }));
      }
    } catch (err) {
      console.warn('Failed to set quality:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  }, []);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateState = () => {
      const newState: Partial<PlayerState> = {
        isPlaying: !video.paused,
        currentTime: video.currentTime,
        duration: video.duration || 0,
        volume: video.volume,
        isMuted: video.muted
      };
      
      setPlayerState(prev => ({ ...prev, ...newState }));
      options.onStateChange?.(newState);
    };

    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement === video;
      setPlayerState(prev => ({ ...prev, isFullscreen }));
    };

    // Add event listeners
    video.addEventListener('play', updateState);
    video.addEventListener('pause', updateState);
    video.addEventListener('timeupdate', updateState);
    video.addEventListener('durationchange', updateState);
    video.addEventListener('volumechange', updateState);
    video.addEventListener('loadedmetadata', updateState);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('play', updateState);
      video.removeEventListener('pause', updateState);
      video.removeEventListener('timeupdate', updateState);
      video.removeEventListener('durationchange', updateState);
      video.removeEventListener('volumechange', updateState);
      video.removeEventListener('loadedmetadata', updateState);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [options]);

  // Initialize player on mount
  useEffect(() => {
    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initializePlayer]);

  return {
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
    clearError: () => setError(null)
  };
};

// Helper function to load Shaka Player
const loadShakaPlayer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.shaka) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/shaka-player/4.7.5/shaka-player.compiled.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Shaka Player'));
    document.head.appendChild(script);
  });
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  const errorCode = error?.code;
  
  switch (errorCode) {
    case 1001:
      return 'Erreur réseau - Vérifiez votre connexion internet';
    case 1002:
      return 'Erreur HTTP - Le serveur ne répond pas';
    case 2001:
      return 'Format de média non supporté';
    case 3001:
      return 'Erreur de décodage vidéo';
    case 4001:
      return 'Clé de chiffrement manquante';
    case 6001:
      return 'Erreur de lecture - Flux corrompu';
    default:
      return error?.message || 'Erreur de lecture inconnue';
  }
};
