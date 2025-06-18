import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface HeroProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

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
And I know a lot about AI and digital tools.
You can access my cognitive knowledge base.`.trim();

  const startTypewriter = useCallback(() => {
    let currentText = '';
    let currentIndex = 0;
    isTypingRef.current = true;

    const typeNextCharacter = () => {
      if (currentIndex < content.length) {
        currentText += content[currentIndex];
        setDisplayedContent(currentText);
        currentIndex++;
        typewriterTimeoutRef.current = setTimeout(typeNextCharacter, 50);
      } else {
        isTypingRef.current = false;
      }
    };

    typeNextCharacter();
  }, [content]);

  useEffect(() => {
    // Start typing when window becomes active
    if (isActive && !isTypingRef.current) {
      startTypewriter();
    }
    
    // Clear content when window becomes inactive
    if (!isActive) {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      setDisplayedContent('');
      isTypingRef.current = false;
    }

    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [isActive, startTypewriter]);

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
    />
  );
}; 