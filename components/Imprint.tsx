import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

export const Imprint: React.FC<{
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
}> = ({ stackIndex, isActive, forceVisible, initialPosition }) => {
  const content = `
QUEER MEDIA LITERACY e.V.
ZVR Number: 1689372191
Founded: 21.09.2024

Address:
c/o 1060 Wien
Mariahilfer Straße 49/15

Jurisdiction:
Landespolizeidirektion Wien

Contact:
admin@queer-alliance.com

© ${new Date().getFullYear()} AI Stylist
All rights reserved.
  `.trim();

  return (
    <TypewriterOverlay
      id="imprint"
      title="Imprint"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
    />
  );
}; 