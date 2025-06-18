import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId, useOverlayStack } from './OverlayStackContext';

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
}) => {
  const { getWindowState } = useOverlayStack();

  const content = `WHAT TO EXPECT:
I come to your place, we sit on your couch. I bring pizza, coffee, tea, beer or wine if you want to.
And we make YOU more powerful.
No corporate bs, No efficiency metrics.
Just real human connection and real AI superpowers.
For YOUR life, or YOUR goals, or YOUR dreams.
This is personal AI instruction.`.trim();

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
    />
  );
}; 