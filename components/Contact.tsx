import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

export const Contact: React.FC<{
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
}> = ({ stackIndex, isActive, forceVisible, initialPosition }) => {
  const content = `
READY TO BECOME AN AI NATIVE?

Text me: +43 XXX XXX XXXX
Email me: hello@aistylist.at
WhatsApp me: [QR code]

No forms.
No 'business inquiries.'
No corporate bullshit.

Just message me like you'd message a friend:
'I think I need an AI Stylist.'

I'll come to you.
  `.trim();

  return (
    <TypewriterOverlay
      id="contact"
      title="Start Now"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
    />
  );
}; 