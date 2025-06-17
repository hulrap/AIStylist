import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface ExperienceProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({
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
THIS IS NOT A BUSINESS MEETING.
THIS IS PERSONAL MENTORING.

I come to your home.
We order pizza.
We open some beers.
We sit comfortably.
And I teach you to be an AI native.

No PowerPoints.
No corporate jargon.
No 'solutions.'
Just you, me, and the tools that will change your life.

Text me when you have questions later.
No invoice for a 2-minute answer.
Because I'm your AI buddy, not your vendor.
  `.trim();

  return (
    <TypewriterOverlay
      id="experience"
      title="The Experience"
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