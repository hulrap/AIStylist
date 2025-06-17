import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'CREDITS';
const lines = [
  'AI Stylist',
  'The First Personal AI Mentor – Making you technologically powerful.',
  `© ${new Date().getFullYear()} AI Stylist. All rights reserved.`
];

export const Footer: React.FC = () => {
  return (
    <TypewriterOverlay
      id="footer"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
    />
  );
}; 