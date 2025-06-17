import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'THREE PATHS TO POWER';
const lines = [
  'THE AWAKENING — One evening at your place (90m), Discover your AI potential. Price: €180',
  'THE TRANSFORMATION — One week intensive (6x 90m), 2-3 days, Pizza, beer, and breakthroughs included. Price: €1,080',
  'THE PARTNERSHIP — Text support, Your personal AI advisor, Forever. Price: €50/month'
];

export const Packages: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean; onUserInteraction?: () => void }> = (props) => {
  return (
    <TypewriterOverlay
      id="packages"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 