import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface HeroProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  showContent?: boolean;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
  onTypingComplete?: () => void;
  stopAutoSequence?: () => void;
  isMobile?: boolean;
  className?: string;
  'data-stack'?: string;
}

export const Hero: React.FC<HeroProps> = ({
  id,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  initialSize,
  showContent = false,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
  onTypingComplete,
  stopAutoSequence,
  isMobile,
  className,
  'data-stack': dataStack,
}) => {
  const content = `Finally.
An AI expert who sees you and comes to your place instead of your office.
With pizza. And coffee, tea, beer, or wine if you want to. And zero corporate vibes.
I treat you like a human, not a company.
Because AI isn't about making businesses more efficient.
It's about making YOU more powerful.`.trim();

  return (
    <TypewriterOverlay
      id={id}
      title="AI Instructor"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      initialSize={initialSize}
      showInitialContent={showContent}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
      onTypingComplete={onTypingComplete}
      stopAutoSequence={stopAutoSequence}
      isMobile={isMobile}
      className={className}
      data-stack={dataStack}
    />
  );
}; 