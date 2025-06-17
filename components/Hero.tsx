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

export const Hero: React.FC<{ stackIndex?: number; isActive?: boolean; forceVisible?: boolean; onUserInteraction?: () => void }> = (props) => {
  const { bringToFront } = useOverlayStack();

  return (
    <TypewriterOverlay
      id="hero"
      title="AI Stylist — Personal AI Mentor"
      lines={lines}
      accentColor="#fbbf24"
      bgGradient="bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a]"
      borderColor="#2d2e3e"
      {...props}
    >
      <button
        className="mt-10 w-full max-w-xl flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#23243a]/90 to-[#181926]/90 border border-amber-400/40 shadow-lg font-mono text-lg md:text-xl text-amber-300 hover:bg-amber-400/10 hover:text-amber-400 transition-all duration-200 animate-fade-in-up"
        onClick={() => bringToFront('problem')}
      >
        <HiOutlineTerminal className="w-6 h-6" />
        {'>'} Yes, this is what I've been looking for
      </button>
    </TypewriterOverlay>
  );
}; 