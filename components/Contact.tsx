import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'START YOUR TRANSFORMATION';
const lines = [
  'READY TO BECOME AN AI NATIVE?',
  'Text me: +43 XXX XXX XXXX',
  'Email me: hello@aistylist.at',
  'WhatsApp me: [QR code]',
  'No forms. No business inquiries. No corporate bullshit.',
  "Just message me like you'd message a friend:",
  "'I think I need an AI Stylist.'",
  "I'll come to you."
];

export const Contact: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean; onUserInteraction?: () => void }> = (props) => {
  return (
    <TypewriterOverlay
      id="contact"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 