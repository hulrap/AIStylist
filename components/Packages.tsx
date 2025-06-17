import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface PackagesProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Packages: React.FC<PackagesProps> = ({
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
THREE WAYS TO TRANSFORM:

THE DISCOVERY
90 minutes at your place
We explore what AI can do for YOUR life
€150

THE IMMERSION  
1 week intensive at your home
Daily sessions, pizza included
Complete AI transformation
€1,200

THE FRIENDSHIP
Ongoing text support
Questions answered immediately
Your AI buddy for life
€50/month
  `.trim();

  return (
    <TypewriterOverlay
      id="packages"
      title="Three Ways"
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