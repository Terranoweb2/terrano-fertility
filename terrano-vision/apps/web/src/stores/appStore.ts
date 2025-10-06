import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Channel, AppState } from '../types';

interface Subscription {
  planId: string;
  planName: string;
  price: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  plan?: 'basic' | 'premium' | 'ultimate' | 'adult';
  expiryDate?: string;
}

interface AppStore extends AppState {
  subscription: Subscription | null;
  filteredChannels: Channel[];
  selectedFilter: string;
  
  // Actions
  setChannels: (channels: Channel[]) => void;
  addToFavorites: (channelId: string) => void;
  removeFromFavorites: (channelId: string) => void;
  addToRecentlyWatched: (channelId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (group: string | null) => void;
  setSelectedFilter: (filter: string) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSubscription: (subscription: Subscription) => void;
  updateSubscription: (subscription: Partial<Subscription>) => void;
  clearSubscription: () => void;
  isSubscribed: () => boolean;
  loadChannels: () => Promise<void>;
  
  // Computed
  getFilteredChannels: () => Channel[];
  getFavoriteChannels: () => Channel[];
  getRecentChannels: () => Channel[];
  getChannelsByGroup: (group: string) => Channel[];
  isChannelFavorite: (channelId: string) => boolean;
  getAvailableChannels: () => Channel[];
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      channels: [],
      favorites: [],
      recentlyWatched: [],
      searchQuery: '',
      selectedGroup: null,
      currentChannel: null,
      isLoading: false,
      error: null,
      subscription: null,
      filteredChannels: [],
      selectedFilter: 'all',

      // Actions
      setChannels: (channels) => set({ channels }),
      
      addToFavorites: (channelId) => set((state) => ({
        favorites: state.favorites.includes(channelId) 
          ? state.favorites 
          : [...state.favorites, channelId]
      })),
      
      removeFromFavorites: (channelId) => set((state) => ({
        favorites: state.favorites.filter(id => id !== channelId)
      })),
      
      addToRecentlyWatched: (channelId) => set((state) => {
        const filtered = state.recentlyWatched.filter(id => id !== channelId);
        return {
          recentlyWatched: [channelId, ...filtered].slice(0, 20) // Keep last 20
        };
      }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedGroup: (group) => set({ selectedGroup: group }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setCurrentChannel: (channel) => set({ currentChannel: channel }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Subscription actions
      setSubscription: (subscription) => set({ subscription }),
      updateSubscription: (updates) => set((state) => ({
        subscription: state.subscription ? { ...state.subscription, ...updates } : null
      })),
      clearSubscription: () => set({ subscription: null }),
      
      // Load channels action
      loadChannels: async () => {
        set({ isLoading: true });
        try {
          // Simulation du chargement des chaînes
          const response = await fetch('/api/channels');
          if (response.ok) {
            const channels = await response.json();
            set({ channels, filteredChannels: channels });
          }
        } catch (error) {
          set({ error: 'Erreur lors du chargement des chaînes' });
        } finally {
          set({ isLoading: false });
        }
      },
      isSubscribed: () => {
        const { subscription } = get();
        if (!subscription) return false;
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        return subscription.isActive && endDate > now;
      },

      // Computed getters
      getAvailableChannels: () => {
        const { channels, subscription } = get();
        const isSubscribed = get().isSubscribed();
        
        if (!isSubscribed) {
          // Mode gratuit : seulement 5 chaînes
          return channels.slice(0, 5);
        }
        
        // Filtrer selon le plan d'abonnement
        if (subscription?.planId === 'basic') {
          return channels.slice(0, 15);
        } else if (subscription?.planId === 'premium') {
          return channels.slice(0, 50);
        } else if (subscription?.planId === 'ultimate') {
          return channels; // Toutes les chaînes
        }
        
        return channels.slice(0, 5); // Fallback
      },

      getFilteredChannels: () => {
        const { searchQuery, selectedGroup } = get();
        let filtered = get().getAvailableChannels();

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(channel => 
            channel.name.toLowerCase().includes(query) ||
            (channel.group && channel.group.toLowerCase().includes(query))
          );
        }

        // Filter by selected group
        if (selectedGroup) {
          if (selectedGroup === 'favorites') {
            const { favorites } = get();
            filtered = filtered.filter(channel => favorites.includes(channel.id));
          } else if (selectedGroup === 'recent') {
            const { recentlyWatched } = get();
            filtered = filtered.filter(channel => recentlyWatched.includes(channel.id));
          } else {
            filtered = filtered.filter(channel => channel.group === selectedGroup);
          }
        }

        return filtered;
      },

      getFavoriteChannels: () => {
        const availableChannels = get().getAvailableChannels();
        const { favorites } = get();
        return availableChannels.filter(channel => favorites.includes(channel.id));
      },

      getRecentChannels: () => {
        const availableChannels = get().getAvailableChannels();
        const { recentlyWatched } = get();
        return recentlyWatched
          .map(id => availableChannels.find(channel => channel.id === id))
          .filter(Boolean) as Channel[];
      },

      getChannelsByGroup: (group) => {
        const availableChannels = get().getAvailableChannels();
        return availableChannels.filter(channel => channel.group === group);
      },

      isChannelFavorite: (channelId) => {
        const { favorites } = get();
        return favorites.includes(channelId);
      }
    }),
    {
      name: 'terrano-vision-store',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyWatched: state.recentlyWatched,
        channels: state.channels,
        subscription: state.subscription
      })
    }
  )
);
