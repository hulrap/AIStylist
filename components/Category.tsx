import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface CategoryProps {
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

export const Category: React.FC<CategoryProps> = ({
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
  const content = `YOU ARE LOOKING AT THE FIRST PERSONAL AI INSTRUCTOR.
Not software, not a course, not some agentic AI, a real person who comes to you.
A Fitness Instructor teaches you how to be fit, a Piano Instructor teaches you how to play the piano.
An AI Instructor teaches you how to master the digital future. For you personally.`.trim();

  return (
    <TypewriterOverlay
      id={id}
      title="First Personal AI Instructor"
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