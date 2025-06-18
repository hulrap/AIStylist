import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ContactProps {
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

export const Contact: React.FC<ContactProps> = ({
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
  const content = `Ready to become more powerful?
Send me a message in any window.
I'll get back to you within 24 hours.
And we'll make you more powerful. Together.`.trim();

  return (
    <TypewriterOverlay
      id={id}
      title="Contact"
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