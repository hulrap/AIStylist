import React, { useState, useEffect } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ImprintProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  showContent?: boolean;
}

export const Imprint: React.FC<ImprintProps> = ({
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
      const content = `Raw Fiction e.U.
An Austrian company registered in Vienna

Founded: 03.10.2019
Address: Gusenleithnergasse 28/18, 1140 Wien
Jurisdiction: Landespolizeidirektion Wien

Contact: hulanraphael@gmail.com

Privacy Policy:
We collect only technical data necessary for security and functionality.
All data is hosted in the EU (Frankfurt fra1 region).
Age restriction: 18+

Consent Collection:
1. Allow direct contact - for opportunities inside the queer alliance
2. Newsletter - for information (not marketing)
3. Organizational representative - for direct organizational contact`;

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
      initialSize={initialSize}
    />
  );
}; 