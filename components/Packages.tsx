import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId, useOverlayStack } from './OverlayStackContext';

interface PackagesProps {
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

export const Packages: React.FC<PackagesProps> = ({
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
  const [displayedContent, setDisplayedContent] = useState('');
  const { getWindowState } = useOverlayStack();

  const content = `THREE WAYS TO TRANSFORM YOUR LIFE:

THE DISCOVERY:
90 minutes at your place, we explore what AI can do for YOUR life, for €180.

THE IMMERSION:
6x90 minutes at your place, one week, one day, two days, up to you, complete AI transformation, for €1,080

THE FRIENDSHIP:
Ongoing text support, questions answered immediately, your AI instructor for as long as you need refining, for €50/month`.trim();

  useEffect(() => {
    const windowState = getWindowState(id);
    
    if (windowState?.transitionState === 'typing') {
      setDisplayedContent(content);
      if (onTypingComplete) {
        onTypingComplete();
      }
    } else if (!isActive && windowState?.transitionState !== 'minimizing' && windowState?.transitionState !== 'closing') {
      setDisplayedContent('');
    }
  }, [isActive, content, id, getWindowState, onTypingComplete]);

  return (
    <TypewriterOverlay
      id={id}
      title="Packages"
      content={displayedContent}
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