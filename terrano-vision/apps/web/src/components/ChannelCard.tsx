import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { Channel } from '../types';
import { Heart, Play, Tv } from 'lucide-react';
import { clsx } from 'clsx';

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
  const navigate = useNavigate();
  const { 
    isChannelFavorite, 
    addToFavorites, 
    removeFromFavorites,
    addToRecentlyWatched 
  } = useAppStore();
  
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const isFavorite = isChannelFavorite(channel.id);

  const handlePlay = () => {
    addToRecentlyWatched(channel.id);
    navigate(`/player/${channel.id}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(channel.id);
    } else {
      addToFavorites(channel.id);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="card overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Image Container */}
      <div className="relative aspect-video bg-dark-700 overflow-hidden">
        {!imageError && channel.logo ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="skeleton w-full h-full" />
              </div>
            )}
            <img
              src={channel.logo}
              alt={channel.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={clsx(
                'w-full h-full object-cover transition-opacity duration-300',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-dark-700 to-dark-800">
            <Tv className="w-8 h-8 text-dark-500" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg"
          >
            <Play className="w-6 h-6 ml-0.5" />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className={clsx(
            'absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200',
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-black/50 text-white hover:bg-black/70'
          )}
        >
          <Heart 
            className={clsx(
              'w-4 h-4 transition-all duration-200',
              isFavorite && 'fill-current'
            )} 
          />
        </button>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={clsx(
            'px-2 py-1 text-xs font-medium rounded-full',
            channel.type === 'hls' 
              ? 'bg-green-500/80 text-white' 
              : 'bg-blue-500/80 text-white'
          )}>
            {channel.type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary-400 transition-colors">
          {channel.name}
        </h3>
        {channel.group && (
          <p className="text-xs text-dark-400 line-clamp-1">
            {channel.group}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChannelCard;
