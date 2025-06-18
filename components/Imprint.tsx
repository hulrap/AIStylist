import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ImprintProps {
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

export const Imprint: React.FC<ImprintProps> = ({
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

  const content = `QUEER MEDIA LITERACY e.V.
ZVR Number: 1689372191
Founded: 21.09.2024
Address: c/o 1060 Wien, Mariahilfer Straße 49/15
Jurisdiction: Landespolizeidirektion Wien
Contact: admin@queer-alliance.com`;

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
      title="Imprint"
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