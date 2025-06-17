import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'THE ANTI-MEETING';
const lines = [
  'FORGET EVERYTHING YOU KNOW ABOUT AI CONSULTING.',
  "This isn't a meeting. It's a mentoring session.",
  "This isn't your office. It's your living room.",
  "This isn't PowerPoint. It's pizza and conversation.",
  "This isn't corporate training. It's personal transformation.",
  "I don't present to you.",
  "I sit with you.",
  "I don't sell you solutions.",
  "I give you superpowers.",
  "I don't leave you with a proposal.",
  "I leave you with abilities.",
  "And when you text me at 9 PM with a question?",
  "I text back. Because that's what friends do."
];

export const Experience: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean; onUserInteraction?: () => void }> = (props) => {
  return (
    <TypewriterOverlay
      id="experience"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 