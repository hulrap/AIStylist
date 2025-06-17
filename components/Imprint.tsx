import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface ImprintProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Imprint: React.FC<ImprintProps> = ({
  stackIndex,
  isActive,
  forceVisible,
  initialPosition,
  isMaximized,
  onMinimize,
  onMaximize,
  onUnmaximize,
}) => {
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
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
    />
  );
}; 