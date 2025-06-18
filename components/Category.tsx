import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId, useOverlayStack } from './OverlayStackContext';

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
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const contentRef = useRef('');
  const { getWindowState } = useOverlayStack();

  const content = `YOU ARE LOOKING AT THE FIRST PERSONAL AI INSTRUCTOR.
Not software. Not a course.
A real person who comes to you.
A Fitness Instructor, teaches your body to be strong.
A Piano Instructor, teaches your fingers to make music.
A Driving Instructor, teaches your mind to navigate roads.
A Cooking Instructor, teaches your hands to create meals.
A Dance Instructor, teaches your body to move with rhythm and a Swimming Instructor, teaches you to master water.
An AI Instructor, teaches you to master the digital future.
Not for your company. Personal instruction for YOU.`.trim();

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
      id={id}
      title="First Steps"
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