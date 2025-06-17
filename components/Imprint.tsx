import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ImprintProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  showContent?: boolean;
  className?: string;
}

export const Imprint: React.FC<ImprintProps> = ({
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
      const content = `LEGAL INFORMATION

AI Stylist
Philipp Krüger
Mariahilfer Straße 49/15
1060 Vienna, Austria

Contact:
Email: hello@aistylist.at

VAT ID: ATU12345678
Commercial Register: FN 123456a
Commercial Court: Vienna

Chamber Membership:
Austrian Chamber of Commerce (WKO)
Professional Group: Personal Service Providers

Regulatory Authority:
Municipal Authority MA 63
1010 Vienna

Online Dispute Resolution:
https://ec.europa.eu/consumers/odr

This imprint applies to:
aistylist.at
instagram.com/aistylist.at`;

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
      title="Imprint"
      content={displayedContent}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      className={className}
    />
  );
}; 