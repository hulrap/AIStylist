import React, { useRef, useEffect, useState } from 'react';

const meetingPoints = [
  'FORGET EVERYTHING YOU KNOW ABOUT AI CONSULTING.',
  
  
  
  "This isn't a meeting. It's a mentoring session.",
  "This isn't your office. It's your living room.",
  "This isn't PowerPoint. It's pizza and conversation.",
  "This isn't corporate training. It's personal transformation.",
  
  
  
  "I don't present to you.",
  "I sit with you.",
  "I don't sell you solutions.",
  "I give you superpowers.",
  "I don't leave you with a proposal.",
  "I leave you with abilities.",
  
  
  
  "And when you text me at 9 PM with a question?",
  "I text back. Because that's what friends do."
];

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

export const Experience: React.FC = () => {
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
      setVisibleCount(Math.max(1, Math.ceil(progress * meetingPoints.length)));
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
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#181926] via-[#181926] to-[#13131a] text-[#f8f8f8] overflow-visible py-32"
    >
      <div className="absolute top-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(180deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
      <div className="w-full max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 px-2 md:px-0 text-amber-400">
          THE ANTI-MEETING
        </h2>
        <div className="relative flex flex-col gap-16 items-center min-h-[600px]">
          {/* SVG lines connecting cards */}
          <svg className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none z-0" width="100%" height="100%" fill="none" style={{ minHeight: 600 }}>
            {Array.from({ length: visibleCount - 1 }).map((_, i) => {
              if (!cardPositions[i] || !cardPositions[i + 1]) return null;
              const { x: x1, y: y1 } = cardPositions[i];
              const { x: x2, y: y2 } = cardPositions[i + 1];
              return (
                <path
                  key={i}
                  d={getCurvedBezierPath(x1, y1, x2, y2)}
                  stroke="#ffb366"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px #ffb366cc)' }}
                />
              );
            })}
          </svg>
          {/* Cards */}
          {meetingPoints.map((point, i) => {
            const offset = getCardOffset(i, 120, 32);
            return (
              <div
                key={point + i}
                ref={el => { cardRefs.current[i] = el; }}
                className={`relative z-10 w-full max-w-xl mx-auto px-8 py-7 rounded-2xl bg-white/5 border border-amber-100/10 backdrop-blur-md shadow-xl transition-all duration-500 ${i < visibleCount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} font-mono text-lg md:text-xl tracking-tight flex flex-col items-center justify-center text-center`}
                style={{
                  transitionDelay: `${i * 0.08}s`,
                  transform: `translateX(${offset.x}px) translateY(${offset.y}px)`
                }}
              >
                <span className="inline-block w-3 h-3 rounded-full mb-2 bg-amber-400/80" />
                <span className="text-base font-semibold mb-1 text-[#f8f8f8]">{point}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(0deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
    </section>
  );
}; 