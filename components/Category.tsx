import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'THE PERSONAL SERVICE ECONOMY';
const lines = [
  'Personal Stylist — Your appearance.',
  'Personal Trainer — Your fitness.',
  'Life Coach — Your mindset.',
  'Therapist — Your emotional health.',
  'Financial Advisor — Your money.',
  'Language Tutor — Your communication.',
  'AI Stylist — Your digital superpowers.'
];

export const Category: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean; onUserInteraction?: () => void }> = (props) => {
  return (
    <TypewriterOverlay
      id="category"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 