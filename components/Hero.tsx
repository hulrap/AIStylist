import React, { useState, useEffect } from 'react';
import { HiOutlineTerminal } from 'react-icons/hi';

interface HeroProps {
  scrollToSection: (index: number) => void;
}

const lines = [
  'Finally.',
  "An AI expert who doesn't want to see your office.",
  'Who brings pizza to your kitchen table.',
  'Who speaks human, not corporate.',
  'Who cares about your Tuesday evening,',
  'not your quarterly targets.'
];

export const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState<string[]>(Array(lines.length).fill(''));
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentLine < lines.length) {
      if (typed[currentLine].length < lines[currentLine].length) {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setTyped(prev => {
            const updated = [...prev];
            updated[currentLine] = lines[currentLine].slice(0, prev[currentLine].length + 1);
            return updated;
          });
        }, 32);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        if (currentLine < lines.length - 1) {
          const nextTimeout = setTimeout(() => {
            setCurrentLine(currentLine + 1);
          }, 500);
          return () => clearTimeout(nextTimeout);
        }
      }
    }
  }, [typed, currentLine]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center section-padding bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a] text-[#f8f8f8] overflow-hidden">
      {/* Floating dev-tool window */}
      <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border border-[#2d2e3e] bg-white/5 backdrop-blur-lg relative z-20 overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center h-10 px-4 bg-gradient-to-r from-[#23243a]/80 to-[#181926]/80 border-b border-[#2d2e3e]">
          <span className="flex items-center gap-1 mr-4">
            <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
          </span>
          <span className="text-xs text-[#b0b0c3] tracking-widest font-mono uppercase">AI Stylist — Personal AI Mentor</span>
        </div>
        {/* Content */}
        <div className="flex flex-col items-center justify-center py-16 px-6 md:px-12 gap-4">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`w-full max-w-xl flex items-center justify-center mb-2 transition-all duration-500 ${idx > currentLine ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            >
              <div
                className={`flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#23243a]/80 to-[#23243a]/60 border border-[#2d2e3e] shadow-md font-mono text-lg md:text-xl tracking-tight transition-all duration-200 hover:scale-[1.03] hover:border-amber-400/60 hover:shadow-amber-400/10 cursor-default select-none`}
              >
                <span className="font-mono">{typed[idx]}</span>
                {idx === currentLine && isTyping && (
                  <span className="inline-block align-middle ml-1 animate-cursor bg-amber-400 w-2 h-6 rounded-sm" />
                )}
              </div>
            </div>
          ))}
          {currentLine === lines.length - 1 && !isTyping && (
            <button
              className="mt-10 w-full max-w-xl flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#23243a]/90 to-[#181926]/90 border border-amber-400/40 shadow-lg font-mono text-lg md:text-xl text-amber-300 hover:bg-amber-400/10 hover:text-amber-400 transition-all duration-200 animate-fade-in-up"
              onClick={() => scrollToSection(6)}
            >
              <HiOutlineTerminal className="w-6 h-6" />
              {'>'} Yes, this is what I\'ve been looking for
            </button>
          )}
        </div>
      </div>
      {/* Animated border glow */}
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl border-4 border-transparent bg-gradient-to-r from-amber-400/20 via-purple-600/10 to-amber-400/20 blur-[2px]" />
    </section>
  );
}; 