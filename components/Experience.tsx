import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const contentRef = useRef('');

  const content = `WHAT TO EXPECT:
I come to your place, we sit on your couch. I bring pizza, coffee, tea, beer or wine if you want to.
And we make YOU more powerful.
No corporate bs, No efficiency metrics.
Just real human connection and real AI superpowers.
For YOUR life, or YOUR goals, or YOUR dreams.
This is personal AI instruction.`.trim();

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

    // Only clear typing state if the window becomes inactive AND is not minimizing
    if (!isActive) {
      const timeoutId = setTimeout(() => {
        isTypingRef.current = false;
        if (typewriterTimeoutRef.current) {
          clearTimeout(typewriterTimeoutRef.current);
          typewriterTimeoutRef.current = null;
        }
        contentRef.current = '';
        setDisplayedContent('');
      }, 150); // Delay clearing the state to allow for transitions

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
  }, [isActive, startTypewriter]);

  return (
    <TypewriterOverlay
      id={id}
      title="Experience"
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