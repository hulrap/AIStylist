import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

export const Hero: React.FC<{
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
}> = ({ stackIndex, isActive, forceVisible, initialPosition }) => {
  const content = `
Finally.
An AI expert who comes to YOUR place.
Not your office. Your home.
With pizza. And beer.
And zero corporate bullshit.

In a world where AI consultants treat you like a company,
I treat you like a human.

Because AI isn't about making businesses more efficient.
It's about making humans more powerful.
  `.trim();

  return (
    <TypewriterOverlay
      id="hero"
      title="AI Stylist"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
    />
  );
}; 