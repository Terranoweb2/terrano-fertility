import React from 'react';
import { Channel } from '../types';
import ChannelCard from './ChannelCard';

interface ChannelGridProps {
  channels: Channel[];
}

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

export default ChannelGrid;
