import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface FooterProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  showContent?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  id,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  showContent = false,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (!isActive) {
      setDisplayedContent('');
    }
  }, [isActive]);

  useEffect(() => {
    if (showContent && isActive && !displayedContent) {
      const content = `Made with ❤️ by:

Raphael Hulan
AI Stylist & Personal Mentor
Vienna, Austria
© 2025 AI Stylist
All rights reserved.`;

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
      id="credits"
      title="Credits"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
    />
  );
}; 