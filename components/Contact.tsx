import React, { useState, useEffect, useCallback, useRef } from 'react';
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
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const content = `READY TO START?
Send me a message right here.
Tell me about yourself.
What are your goals?
What do you want to achieve?
How can AI help YOU?
I'll get back to you within 24 hours.
We'll find a time that works for you.
And we'll start your AI journey together.
No corporate bullshit.
Just real human connection.
And real AI superpowers.`;

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
      id={id}
      title="Start Now"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      initialSize={initialSize}
      showInitialContent={showContent}
    />
  );
}; 