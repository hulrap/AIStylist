import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ContactProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  showContent?: boolean;
  className?: string;
}

export const Contact: React.FC<ContactProps> = ({
  id,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  showContent = false,
  className
}) => {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (showContent && !displayedContent) {
      const content = `READY TO BECOME AN AI NATIVE?

Text me: +43 XXX XXX XXXX
Email me: hello@aistylist.at
WhatsApp me: [QR code]

No forms.
No 'business inquiries.'
No corporate bullshit.

Just message me like you'd message a friend:
"I think I need an AI Stylist."

I'll come to you.`;

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
      title="Start Now"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      className={className}
    />
  );
}; 