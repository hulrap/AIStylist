import React from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';

export const Problem: React.FC<{
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
}> = ({ stackIndex, isActive, forceVisible, initialPosition }) => {
  const content = `
EVERY AI 'CONSULTANT' IN AUSTRIA WANTS TO:
- Optimize your business processes
- Increase your company efficiency  
- Save your organization money
- Schedule meetings in conference rooms
- Sell you enterprise solutions

I WANT TO:
- Make you personally more powerful
- Help you work fewer hours for same results
- Keep you human in an AI world
- Sit on your couch and actually help YOU
- Give you superpowers, not software

This is the difference between a corporate consultant
and a personal mentor.
  `.trim();

  return (
    <TypewriterOverlay
      id="problem"
      title="The Problem"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
    />
  );
}; 