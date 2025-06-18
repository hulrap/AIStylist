import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ProblemProps {
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

export const Problem: React.FC<ProblemProps> = ({
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

  const content = `THE PROBLEM WITH AI EDUCATION:
It's all about companies.
Courses that teach you to be a prompt engineer.
Consultants that help your business automate.
Bootcamps that make you an AI developer.
But what about YOU?
What about YOUR life?
What about YOUR dreams?
What about YOUR potential?
Nobody teaches you how to use AI for yourself.
Nobody shows you how to enhance YOUR capabilities.
Nobody helps YOU become more powerful.
That's why I'm here.`;

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
      title="The Problem"
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