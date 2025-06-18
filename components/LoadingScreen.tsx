import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "I am not a software, I will visit you with pizza.";
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(prev => prev + fullText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Keep text visible for a moment after completion
        setTimeout(() => {
          setIsVisible(false);
        }, 1000);
      }
    }, 50);

    // Auto-complete after 3 seconds regardless of typing state
    const timeout = setTimeout(() => {
      clearInterval(typeInterval);
      setText(fullText);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 3000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Handle transition end to trigger onComplete
  const handleTransitionEnd = () => {
    if (!isVisible) {
      onComplete();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] backdrop-blur-xl bg-black/50 flex items-center justify-center transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center px-4 max-w-4xl">
        {text}
      </h1>
    </div>
  );
}; 