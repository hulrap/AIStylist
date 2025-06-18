import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

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
}) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (!isActive) {
      setDisplayedContent('');
    }
  }, [isActive]);

  useEffect(() => {
    if (showContent && isActive && !displayedContent) {
      const content = `YOU ARE LOOKING AT THE FIRST PERSONAL AI INSTRUCTOR.
Not software. Not a course. A real person who comes to you.
A Fitness Instructor → Teaches your body to be strong
A Piano Instructor → Teaches your fingers to make music  
A Driving Instructor → Teaches your mind to navigate roads
A Cooking Instructor → Teaches your hands to create meals
A Dance Instructor → Teaches your body to move with rhythm
A Swimming Instructor → Teaches you to master water
An AI Instructor → Teaches you to master the digital future
Not for your company. Personal instruction for YOU.`;

      let currentText = '';
      let currentIndex = 0;

      const typeNextCharacter = () => {
        if (currentIndex < content.length) {
          currentText += content[currentIndex];
          setDisplayedContent(currentText);
          currentIndex++;
          setTimeout(typeNextCharacter, 50);
        }
      };

      typeNextCharacter();
    }
  }, [showContent, isActive, displayedContent]);

  return (
    <TypewriterOverlay
      id={id}
      title="The First"
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