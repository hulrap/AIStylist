import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId, useOverlayStack } from './OverlayStackContext';

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
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const { getWindowState } = useOverlayStack();

  const content = `Finally.
An AI expert who sees you.
And comes to YOUR place.
Not your office. Your home.
With pizza. And beer or wine if your want to.
And zero corporate bs.
I treat you like a human, not a company.
Because AI isn't about making businesses more efficient.`.trim();

  useEffect(() => {
    const windowState = getWindowState(id);
    
    if (windowState?.transitionState === 'typing') {
      setDisplayedContent(content);
    } else if (!isActive && windowState?.transitionState !== 'minimizing' && windowState?.transitionState !== 'closing') {
      setDisplayedContent('');
    }
  }, [isActive, content, id, getWindowState]);

  return (
    <TypewriterOverlay
      id={id}
      title="AI Instructor"
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