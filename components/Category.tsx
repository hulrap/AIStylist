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
      const content = `Personal Stylist → Makes you look amazing
Personal Trainer → Makes you physically strong
Life Coach → Makes you mentally resilient
Singing Teacher → Makes you musically gifted
Language Tutor → Makes you multilingual
AI Stylist → Makes you technologically powerful
YOU ARE LOOKING AT THE FIRST PERSONAL AI STYLIST
Not for your company. Mentorship for YOU.`;

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