import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ExperienceProps {
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

export const Experience: React.FC<ExperienceProps> = ({
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
  const content = `What to expect?
I come to your place, we sit on your couch or at your work desk.
I will listen to your pain points, and goals and we will try to fit as much as we can into the time we have.
No efficiency metrics. Just individualized instruction and mentoring. And real AI superpowers.`.trim();

  return (
    <TypewriterOverlay
      id={id}
      title="The Experience"
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