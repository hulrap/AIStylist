import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'EVERY AI CONSULTANT IN AUSTRIA PROMISES TO';
const lines = [
  'Transform your business processes.',
  'Revolutionize your company workflows.',
  'Maximize your organizational efficiency.',
  'Schedule you into conference room hell.',
  'Sell you software that nobody understands.'
];

export const Problem: React.FC<{ stackIndex?: number; isActive?: boolean }> = (props) => {
  return (
    <TypewriterOverlay
      id="problem"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 