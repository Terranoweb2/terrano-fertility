export interface Channel {
  id: string;
  name: string;
  url: string;
  type: 'hls' | 'dash';
  logo?: string;
  group?: string;
  ua?: string;
  ref?: string;
  vlcUA?: string;
  vlcRef?: string;
}

export interface ChannelGroup {
  name: string;
  channels: Channel[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality?: string;
  availableQualities: string[];
}

export interface AppState {
  channels: Channel[];
  favorites: string[];
  recentlyWatched: string[];
  searchQuery: string;
  selectedGroup: string | null;
  currentChannel: Channel | null;
  isLoading: boolean;
  error: string | null;
}

export interface M3UParseResult {
  channels: Channel[];
  errors: string[];
}

export interface ProxyRequest {
  url: string;
  ua?: string;
  ref?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
