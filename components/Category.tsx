import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface CategoryProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Category: React.FC<CategoryProps> = ({
  stackIndex,
  isActive,
  forceVisible,
  initialPosition,
  isMaximized,
  onMinimize,
  onMaximize,
  onUnmaximize,
}) => {
  const content = `
PERSONAL SERVICES THAT ALREADY EXIST:

Personal Stylist → Makes you look amazing
Personal Trainer → Makes you physically strong  
Life Coach → Makes you mentally resilient
Singing Teacher → Makes you musically gifted
Language Tutor → Makes you multilingual

AI Stylist → Makes you technologically powerful

YOU ARE LOOKING AT THE FIRST PERSONAL AI MENTOR.
Not for your company. For YOU.
  `.trim();

  return (
    <TypewriterOverlay
      id="category"
      title="The First"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
    />
  );
}; 