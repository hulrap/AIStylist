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
  const contentRef = useRef('');

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
      }
    };

    typeNextCharacter();
  }, [content]);

  useEffect(() => {
    if (isActive && !isTypingRef.current) {
      startTypewriter();
    }

    if (!isActive) {
      isTypingRef.current = false;
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
        typewriterTimeoutRef.current = null;
      }
      contentRef.current = '';
      setDisplayedContent('');
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