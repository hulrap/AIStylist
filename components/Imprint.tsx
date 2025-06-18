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
  onTypingComplete?: () => void;
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
  onTypingComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const contentRef = useRef('');

  const content = `LEGAL INFORMATION

AI Stylist
123 Fashion Street
New York, NY 10001
United States

Email: contact@aistylist.com
Phone: +1 (555) 123-4567

Business Registration: NY12345
VAT ID: US987654321

© 2024 AI Stylist. All rights reserved.`;

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
      title="Imprint"
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