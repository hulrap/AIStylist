import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ExperienceProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  showContent?: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({
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
      const content = `This is not a business meeting.
This is personal mentoring and learning experience.

I come to your home.
We order pizza or I bring one (if you are close, I don't like cold pizza).
We open some beers or wine (if you want to), or brew some coffee or tea.
We sit comfortably in your comfort zone.
And I teach you to be a digital AI native.
Depending on how much time and experience you have.

No PowerPoints. No corporate jargon. No 'solutions.'
Just you, me, and the tools that will change your life.
I'm not a consultant. I'm your friend.
I would not even charge if I wouldn't have to earn a living too.

Text me when you have questions later.
No invoice for a 2-minute answer.
Because I'm your AI stylist, not your vendor.`;

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
      title="The Experience"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      initialSize={initialSize}
    />
  );
}; 