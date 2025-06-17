import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface FooterProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
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
I DON'T CARE ABOUT YOUR COMPANY'S ROI.
I CARE ABOUT YOUR PERSONAL FREEDOM.

AI is the biggest revolution in human history.
Most people are being left behind by corporate solutions
that don't actually help humans.

I believe every person deserves to be empowered,
not just every business.

I believe technology should serve humans,
not the other way around.

I believe learning should happen in your comfort zone,
not in some sterile office.

This is why I exist.
To keep you human while making you superhuman.
  `.trim();

  return (
    <TypewriterOverlay
      id="footer"
      title="The Manifesto"
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