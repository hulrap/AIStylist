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
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#1a1a1a] text-[#f8f8f8]">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="flex flex-col items-center justify-center">
          {lines.map((line, idx) => (
            <h1
              key={idx}
              className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 transition-opacity duration-500 ${visibleLines > idx ? 'opacity-100' : 'opacity-0'}`}
              style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
            >
              {line}
              {visibleLines === idx && visibleLines < lines.length && (
                <span className="inline-block w-2 h-8 bg-[#ffb366] align-middle animate-pulse ml-1" />
              )}
            </h1>
          ))}
        </div>
        {visibleLines === lines.length && (
          <button
            className="mt-12 bg-[#ffb366] text-[#1a1a1a] px-8 py-4 rounded-full text-lg font-semibold shadow hover:bg-[#ff9933] transition-all duration-200"
            onClick={() => scrollToSection(6)}
            style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
          >
            Yes, this is what I've been looking for
          </button>
        )}
      </div>
    </section>
  );
}; 