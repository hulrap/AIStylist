import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

const title = 'IMPRINT';
const lines = [
  'AI Stylist is operated by QUEER MEDIA LITERACY e.V.',
  'Austrian association registered in Vienna.',
  'ZVR Number: 1689372191',
  'Founded: 21.09.2024',
  'Address: c/o 1060 Wien, Mariahilfer Straße 49/15',
  'Jurisdiction: Landespolizeidirektion Wien',
  'Contact: admin@queer-alliance.com',
  'No phone number displayed.',
  'All rights reserved.'
];

export const Imprint: React.FC<{ stackIndex?: number; isActive?: boolean }> = (props) => {
  return (
    <TypewriterOverlay
      id="imprint"
      title={title}
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#3a2d23"
      {...props}
    />
  );
}; 