import React, { useState, useEffect } from 'react';
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
}

export const Problem: React.FC<ProblemProps> = ({
  id,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  initialSize,
  showContent = false,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (showContent && !displayedContent) {
      const content = `EVERY AI 'CONSULTANT' IN AUSTRIA WANTS TO:
Optimize your business processes
Increase your company efficiency  
Save your organization money
Schedule meetings in conference rooms
Sell you enterprise solutions

I WANT TO:
Make you personally more powerful
Help you work fewer hours for same results
Keep you human in an AI world
Sit on your couch and actually help YOU
Give you superpowers, not software

This is the difference between a corporate consultant and a personal mentor.`;

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
  }, [showContent, displayedContent]);

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
    />
  );
}; 