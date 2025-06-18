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
        // Start fade out after text is complete
        setTimeout(() => {
          setIsVisible(false);
          // Call onComplete after fade animation
          setTimeout(onComplete, 500);
        }, 1000);
      }
    }, 50);

    // Auto-complete after 3 seconds regardless of typing state
    const timeout = setTimeout(() => {
      clearInterval(typeInterval);
      setText(fullText);
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] backdrop-blur-xl bg-black/50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center px-4 max-w-4xl">
        {text}
      </h1>
    </div>
  );
}; 