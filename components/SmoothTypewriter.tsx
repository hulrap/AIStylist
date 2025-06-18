import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SmoothTypewriterProps {
  content: string;
  isActive: boolean;
  onComplete?: () => void;
  speed?: number;
  className?: string;
}

export const SmoothTypewriter: React.FC<SmoothTypewriterProps> = ({
  content,
  isActive,
  onComplete,
  speed = 50,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const startTyping = useCallback(() => {
    if (isTyping || !content) return;
    
    setIsTyping(true);
    setDisplayedText('');
    indexRef.current = 0;

    const typeNextCharacter = () => {
      if (indexRef.current < content.length) {
        setDisplayedText(content.slice(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        setIsTyping(false);
        if (onComplete) {
          setTimeout(onComplete, 500); // Small delay before calling completion
        }
      }
    };

    typeNextCharacter();
  }, [content, speed, onComplete, isTyping]);

  // Start typing when component becomes active
  useEffect(() => {
    if (isActive && content && !isTyping && indexRef.current === 0) {
      startTyping();
    }
  }, [isActive, content, startTyping, isTyping]);

  // Reset when content changes or becomes inactive
  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsTyping(false);
      setDisplayedText('');
      indexRef.current = 0;
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Restart typing on click
  const handleClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
    indexRef.current = 0;
    setTimeout(() => startTyping(), 100);
  }, [startTyping]);

  if (!displayedText && !isTyping) {
    return null;
  }

  return (
    <div 
      className={`bg-white/10 text-white/90 font-mono text-sm leading-relaxed px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/15 transition-colors ${className}`}
      onClick={handleClick}
    >
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}; 