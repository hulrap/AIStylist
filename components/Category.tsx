import React, { useRef, useEffect, useState } from 'react';

const professions = [
  { name: 'Personal Stylist', result: 'Your appearance' },
  { name: 'Personal Trainer', result: 'Your fitness' },
  { name: 'Life Coach', result: 'Your mindset' },
  { name: 'Therapist', result: 'Your emotional health' },
  { name: 'Financial Advisor', result: 'Your money' },
  { name: 'Language Tutor', result: 'Your communication' },
  { name: 'AI Stylist', result: 'Your digital superpowers', highlight: true }
];

// Helper for SVG cubic Bezier path between two points
function getCurvedBezierPath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
}

function getCardOffset(i: number, maxOffset = 120, yJitter = 0) {
  const sign = i % 2 === 0 ? 1 : -1;
  const base = ((i * 73) % maxOffset) + 40;
  const x = sign * base;
  const y = yJitter ? ((i * 53) % yJitter) - yJitter / 2 : 0;
  return { x, y };
}

export const Category: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (rect.height + windowHeight * 0.2)));
      setVisibleCount(Math.max(1, Math.ceil(progress * professions.length)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCardPositions(
        cardRefs.current.map((ref, i) => {
          if (!ref) return { x: 0, y: 0 };
          const rect = ref.getBoundingClientRect();
          const offset = getCardOffset(i, 120, 32);
          return {
            x: rect.left + rect.width / 2 + offset.x,
            y: rect.top + rect.height / 2 + window.scrollY + offset.y,
          };
        })
      );
    }, 100);
  }, [visibleCount]);

  return (
    <section
      id="category"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#181926] via-[#181926] to-[#13131a] text-[#f8f8f8] overflow-visible py-32"
    >
      <div className="w-full max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 px-2 md:px-0">
          <span className="text-[#f8f8f8]">THE PERSONAL SERVICE ECONOMY</span>
        </h2>
        <div className="relative flex flex-col gap-16 items-center min-h-[600px]">
          {/* SVG lines connecting cards */}
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full pointer-events-none z-0" width="100%" height="100%" fill="none" style={{ minHeight: 600 }}>
            {Array.from({ length: visibleCount - 1 }).map((_, i) => {
              if (!cardPositions[i] || !cardPositions[i + 1]) return null;
              const { x: x1, y: y1 } = cardPositions[i];
              const { x: x2, y: y2 } = cardPositions[i + 1];
              return (
                <path
                  key={i}
                  d={getCurvedBezierPath(x1, y1, x2, y2)}
                  stroke={professions[i + 1].highlight ? '#ffb366' : '#b6b6d6'}
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  fill="none"
                  style={{ filter: professions[i + 1].highlight ? 'drop-shadow(0 0 8px #ffb366cc)' : 'drop-shadow(0 0 6px #b6b6d6cc)' }}
                />
              );
            })}
          </svg>
          {/* Cards */}
          {professions.map((prof, i) => {
            const offset = getCardOffset(i, 120, 32);
            return (
              <div
                key={prof.name}
                ref={el => { cardRefs.current[i] = el; }}
                className={`relative z-10 w-full max-w-xl mx-auto px-8 py-7 rounded-2xl ${prof.highlight ? 'bg-amber-100/10 border-amber-200/40 shadow-amber-400/30' : 'bg-white/5 border-white/10'} backdrop-blur-md border shadow-xl transition-all duration-500 ${i < visibleCount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} font-mono text-lg md:text-xl tracking-tight flex flex-col items-center justify-center text-center`}
                style={{
                  transitionDelay: `${i * 0.08}s`,
                  transform: `translateX(${offset.x}px) translateY(${offset.y}px)`
                }}
              >
                <span className={`inline-block w-3 h-3 rounded-full mb-2 ${prof.highlight ? 'bg-amber-400/80' : 'bg-amber-200/60'}`} />
                <span className={`text-base font-semibold mb-1 ${prof.highlight ? 'text-amber-300' : 'text-[#f8f8f8]'}`}>{prof.name}</span>
                <span className="text-sm text-[#b6b6d6] text-center font-mono">{prof.result}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto text-center mt-8 space-y-2">
        <p className="text-lg md:text-xl text-[#b6b6d6] animate-fade-in-up">
          Every other aspect of your life has a personal expert.<br />Your relationship with AI shouldn't be different.
        </p>
        <p className="text-xl md:text-2xl font-medium text-amber-300 animate-fade-in-up">
          YOU ARE WITNESSING THE BIRTH OF PERSONAL AI MENTORING.<br />
          <span className="text-[#f8f8f8]">The last piece of the personal service puzzle.</span>
        </p>
      </div>
    </section>
  );
}; 