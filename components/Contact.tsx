import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

interface ContactProps {
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const Contact: React.FC<ContactProps> = ({
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
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
    />
  );
}; 