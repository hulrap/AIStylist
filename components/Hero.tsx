import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface HeroProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
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
Finally.
An AI expert who sees you.
And comes to YOUR place.
Not your office. Your home.
With pizza. And beer or wine if your want to.
And zero corporate bs.
I treat you like a human, not a company.
Because AI isn't about making businesses more efficient.
It's about making humans more powerful.
I'm not a consultant. I'm your friend.
And I know a lot about AI and digital tools.
You can access my cognitive knowledge base.
  `.trim();

  return (
    <TypewriterOverlay
      id="ai-stylist"
      title="AI Stylist"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
      showInitialContent={true}
    />
  );
}; 