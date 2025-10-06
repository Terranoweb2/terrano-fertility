import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { parseM3U } from './utils/m3uParser';
import HomePageWithCarousel from './components/HomePageWithCarousel';
import PlayerPagePremium from './components/PlayerPagePremium';
import AboutPageUltraPremium from './components/AboutPageUltraPremium';
import SubscriptionPageWave from './components/SubscriptionPageWave';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import initialPlaylistContent from './data/initialPlaylist.m3u?raw';

function App() {
  const { channels, setChannels, setLoading, setError } = useAppStore();

  useEffect(() => {
    // Load initial playlist if no channels are present
    if (channels.length === 0) {
      setLoading(true);
      try {
        const result = parseM3U(initialPlaylistContent);
        if (result.channels.length > 0) {
          setChannels(result.channels);
          console.log(`✅ Loaded ${result.channels.length} channels from initial playlist`);
        }
        if (result.errors.length > 0) {
          console.warn('⚠️ Parsing errors:', result.errors);
        }
      } catch (error) {
        console.error('❌ Failed to load initial playlist:', error);
        setError('Erreur lors du chargement de la playlist initiale');
      } finally {
        setLoading(false);
      }
    }
  }, [channels.length, setChannels, setLoading, setError]);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Router>
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePageWithCarousel />} />
              <Route path="/player/:channelId" element={<PlayerPagePremium />} />
              <Route path="/about" element={<AboutPageUltraPremium />} />
              <Route path="/subscription" element={<SubscriptionPageWave />} />
            </Routes>
          </main>
          <Navigation />
        </div>
      </Router>
      <Toast />
    </div>
  );
}

export default App;
