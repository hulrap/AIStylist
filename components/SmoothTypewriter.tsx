import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SmoothTypewriterProps {
  content: string;
  isActive: boolean;
  onComplete?: () => void;
  speed?: number;
  className?: string;
}

interface TypedLine {
  text: string;
  isComplete: boolean;
  currentText: string;
}

export const SmoothTypewriter: React.FC<SmoothTypewriterProps> = ({
  content,
  isActive,
  onComplete,
  speed = 50,
  className = ''
}) => {
  const [lines, setLines] = useState<TypedLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCharIndexRef = useRef(0);

  // Split content into lines and initialize typing state
  const initializeLines = useCallback(() => {
    const contentLines = content.split('\n').filter(line => line.trim() !== '');
    const initialLines = contentLines.map(text => ({
      text: text.trim(),
      isComplete: false,
      currentText: ''
    }));
    setLines(initialLines);
    setCurrentLineIndex(0);
    currentCharIndexRef.current = 0;
  }, [content]);

  const startTyping = useCallback(() => {
    if (isTyping || lines.length === 0) return;
    
    setIsTyping(true);

    const typeNextCharacter = () => {
      if (currentLineIndex >= lines.length) {
        setIsTyping(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
        return;
      }

      const currentLine = lines[currentLineIndex];
      if (!currentLine || currentLine.isComplete) {
        // Move to next line
        setCurrentLineIndex(prev => prev + 1);
        currentCharIndexRef.current = 0;
        timeoutRef.current = setTimeout(typeNextCharacter, 300); // Pause between lines
        return;
      }

      if (currentCharIndexRef.current < currentLine.text.length) {
        const newText = currentLine.text.slice(0, currentCharIndexRef.current + 1);
        
        setLines(prev => prev.map((line, index) => 
          index === currentLineIndex 
            ? { ...line, currentText: newText }
            : line
        ));
        
        currentCharIndexRef.current++;
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        // Current line is complete
        setLines(prev => prev.map((line, index) => 
          index === currentLineIndex 
            ? { ...line, isComplete: true }
            : line
        ));
        
        setCurrentLineIndex(prev => prev + 1);
        currentCharIndexRef.current = 0;
        timeoutRef.current = setTimeout(typeNextCharacter, 500); // Longer pause after line completion
      }
    };

    typeNextCharacter();
  }, [lines, currentLineIndex, speed, onComplete, isTyping]);

  // Initialize lines when content changes
  useEffect(() => {
    if (content) {
      initializeLines();
    }
  }, [content, initializeLines]);

  // Start typing when component becomes active or content changes
  useEffect(() => {
    if (isActive && lines.length > 0 && !isTyping) {
      // Small delay to ensure proper state initialization
      setTimeout(() => {
        startTyping();
      }, 100);
    }
  }, [isActive, lines.length, startTyping, isTyping]);

  // Reset when becomes inactive
  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsTyping(false);
      setCurrentLineIndex(0);
      currentCharIndexRef.current = 0;
      setLines([]);
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
    setCurrentLineIndex(0);
    currentCharIndexRef.current = 0;
    initializeLines();
    setTimeout(() => startTyping(), 100);
  }, [startTyping, initializeLines]);

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const shouldShow = index <= currentLineIndex || line.isComplete;
        const displayText = line.isComplete ? line.text : line.currentText;
        const showCursor = index === currentLineIndex && !line.isComplete && isTyping;
        
        if (!shouldShow && !displayText) return null;
        
        return (
          <div 
            key={index}
            className={`bg-white/10 text-white/90 font-mono text-sm leading-relaxed px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/15 transition-colors ${className}`}
            onClick={handleClick}
          >
            {displayText}
            {showCursor && <span className="animate-pulse">|</span>}
          </div>
        );
      })}
    </div>
  );
}; 