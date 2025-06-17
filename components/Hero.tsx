import React from 'react';
import { HiOutlineTerminal } from 'react-icons/hi';
import { TypewriterOverlay } from './TypewriterOverlay';
import { useOverlayStack } from './OverlayStackContext';

const lines = [
  'Finally.',
  "An AI expert who doesn't want to see your office.",
  'Who brings pizza to your kitchen table.',
  'Who speaks human, not corporate.',
  'Who cares about your Tuesday evening,',
  'not your quarterly targets.'
];

export const Hero: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean }> = (props) => {
  const { bringToFront } = useOverlayStack();

  return (
    <TypewriterOverlay
      id="hero"
      title="AI Stylist"
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#2d2e3e"
      {...props}
    >
      <div className="mt-4">
        <button
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#23243a]/90 to-[#181926]/90 border border-amber-400/40 shadow-md font-mono text-base text-amber-300 hover:bg-amber-400/10 hover:text-amber-400 transition-all duration-200"
          onClick={() => bringToFront('problem')}
        >
          <HiOutlineTerminal className="inline-block w-4 h-4 mr-2" />
          {'>'} Continue
        </button>
      </div>
    </TypewriterOverlay>
  );
}; 