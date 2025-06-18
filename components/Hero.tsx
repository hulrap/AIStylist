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
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const contentRef = useRef('');
  const { getWindowState } = useOverlayStack();

  const content = `Finally.
An AI expert who sees you.
And comes to YOUR place.
Not your office. Your home.
With pizza. And beer or wine if your want to.
And zero corporate bs.
I treat you like a human, not a company.
Because AI isn't about making businesses more efficient.
It's about making humans more powerful.
I'm not a consultant. I'm your friend.
I know a lot about AI and digital tools.
And you can access it.`.trim();

  const startTypewriter = useCallback(() => {
    if (isTypingRef.current) return;
    
    isTypingRef.current = true;
    contentRef.current = '';
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (!isTypingRef.current) return;

      if (currentIndex < content.length) {
        contentRef.current += content[currentIndex];
        setDisplayedContent(contentRef.current);
        currentIndex++;
        typewriterTimeoutRef.current = setTimeout(typeNextCharacter, 50);
      } else {
        isTypingRef.current = false;
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    };

    typeNextCharacter();
  }, [content, onTypingComplete]);

  useEffect(() => {
    if (isActive && !isTypingRef.current) {
      startTypewriter();
    }

    // Only clear typing state if the window becomes inactive AND is not in transition
    if (!isActive) {
      const windowState = getWindowState(id);
      // Don't clear state if window is in transition
      if (windowState?.isMinimizing) {
        return;
      }

      const timeoutId = setTimeout(() => {
        isTypingRef.current = false;
        if (typewriterTimeoutRef.current) {
          clearTimeout(typewriterTimeoutRef.current);
          typewriterTimeoutRef.current = null;
        }
        contentRef.current = '';
        setDisplayedContent('');
      }, 200); // Increased delay to ensure proper sequencing

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
        typewriterTimeoutRef.current = null;
      }
    };
  }, [isActive, startTypewriter, id, getWindowState]);

  return (
    <TypewriterOverlay
      id="ai-instructor"
      title="AI Instructor"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
      showInitialContent={true}
      onTypingComplete={onTypingComplete}
    />
  );
}; 