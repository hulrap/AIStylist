import React, { useState, useEffect } from 'react';

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
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timer = setTimeout(() => setVisibleLines(visibleLines + 1), 900);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center section-padding bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <div className="w-full max-w-3xl mx-auto text-center relative z-20">
        <div className="flex flex-col items-center justify-center">
          {lines.map((line, idx) => (
            <h1
              key={idx}
              className={`heading-hero mb-4 animate-fade-in-up transition-opacity duration-500 ${visibleLines > idx ? 'opacity-100' : 'opacity-0'}`}
              style={{ animationDelay: `${0.15 * idx}s` }}
            >
              {line}
              {visibleLines === idx && visibleLines < lines.length && (
                <span className="inline-block align-middle ml-2 animate-cursor bg-[var(--brand-accent)] w-2 h-8 rounded-sm" />
              )}
            </h1>
          ))}
        </div>
        {visibleLines === lines.length && (
          <button
            className="mt-12 btn-primary btn-animated animate-fade-in-up"
            style={{ animationDelay: `${0.15 * lines.length}s` }}
            onClick={() => scrollToSection(6)}
          >
            Yes, this is what I've been looking for
          </button>
        )}
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 