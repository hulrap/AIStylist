import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface Position {
  x: number;
  y: number;
}

interface HeroProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: Position;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  stackIndex,
  isActive,
  forceVisible,
  initialPosition,
  onMinimize,
  onMaximize,
  onUnmaximize,
  className = 'w-[800px] h-[600px]'
}) => {
  const content = `Finally.
An AI expert who comes to YOUR place.
Not your office. Your home.
With pizza. And beer.
And zero corporate bullshit.

In a world where AI consultants treat you like a company,
I treat you like a human.

Because AI isn't about making businesses more efficient.
It's about making humans more powerful.`;

  return (
    <TypewriterOverlay
      id="ai-stylist"
      title="AI Stylist"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      showInitialContent={true}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
      className={className}
    />
  );
}; 