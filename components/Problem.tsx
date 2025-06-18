import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';
import { useOverlayStack } from './OverlayStackContext';

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
  onTypingComplete?: () => void;
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
  onTypingComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const contentRef = useRef('');
  const { getWindowState } = useOverlayStack();

  const content = `THE PROBLEM:
AI is not about making businesses more efficient.
It's about making humans more powerful.
But most AI experts treat you like a company.
They want to optimize your processes.
They want to make you more productive.
They want to make you more efficient.
But they don't want to make you more powerful.
They don't want to make you more creative.
They don't want to make you more human.
I do.`;

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
      title="The Problem"
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