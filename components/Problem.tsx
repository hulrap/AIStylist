import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const lines = [
  'Transform your business processes.',
  'Revolutionize your company workflows.',
  'Maximize your organizational efficiency.',
  'Schedule you into conference room hell.',
  'Sell you software that nobody understands.'
];

export const Problem: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean }> = (props) => {
  return (
    <TypewriterOverlay
      id="problem"
      title="The Problem"
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 