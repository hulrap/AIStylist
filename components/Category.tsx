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
      title="First Personal AI Instructor"
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