import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineOfficeBuilding, HiOutlineExclamationCircle, HiOutlineSparkles, HiOutlineHeart, HiOutlineUser, HiOutlineHome, HiOutlineLightningBolt } from 'react-icons/hi';

const leftPromises = [
  { icon: <HiOutlineBriefcase className="w-6 h-6 text-amber-400/80" />, text: 'Transform your business processes' },
  { icon: <HiOutlineChartBar className="w-6 h-6 text-amber-400/80" />, text: 'Revolutionize your company workflows' },
  { icon: <HiOutlineOfficeBuilding className="w-6 h-6 text-amber-400/80" />, text: 'Maximize your organizational efficiency' },
  { icon: <HiOutlineExclamationCircle className="w-6 h-6 text-amber-400/80" />, text: 'Schedule you into conference room hell' },
  { icon: <HiOutlineUserGroup className="w-6 h-6 text-amber-400/80" />, text: 'Sell you software that nobody understands' },
];

const rightPromises = [
  { icon: <HiOutlineSparkles className="w-6 h-6 text-amber-400/80" />, text: 'Transform your daily life' },
  { icon: <HiOutlineUser className="w-6 h-6 text-amber-400/80" />, text: 'Revolutionize your personal workflow' },
  { icon: <HiOutlineHeart className="w-6 h-6 text-amber-400/80" />, text: 'Maximize your human potential' },
  { icon: <HiOutlineHome className="w-6 h-6 text-amber-400/80" />, text: ",Meet you where you\'re comfortable" },
  { icon: <HiOutlineLightningBolt className="w-6 h-6 text-amber-400/80" />, text: "Give you superpowers you\'ll actually use" },
];

const consultantPoints = [
  'Transform your business processes',
  'Revolutionize your company workflows',
  'Maximize your organizational efficiency',
  'Schedule you into conference room hell',
  'Sell you software that nobody understands',
];

// Helper for SVG path with 90deg curve
function getCurvedPath(y1: number, y2: number, x: number) {
  // Start at (x, y1), curve to (x+40, y2) with a 90deg smooth curve
  const curve = 40;
  return `M${x},${y1} Q${x},${y1 + curve} ${x + curve},${y1 + curve} V${y2 - curve} Q${x + curve},${y2} ${x + 2 * curve},${y2}`;
}

export const Problem: React.FC = () => {
  // Track which cards are visible based on scroll
  const [visibleCount, setVisibleCount] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Reveal next card every ~20% of section scrolled
      const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (rect.height + windowHeight * 0.2)));
      setVisibleCount(Math.max(1, Math.ceil(progress * consultantPoints.length)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card vertical positions for SVG lines
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardCenters, setCardCenters] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setCardCenters(
        cardRefs.current.map(ref => {
          if (!ref) return { x: 0, y: 0 };
          const rect = ref.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 + window.scrollY,
          };
        })
      );
    }, 100);
  }, [visibleCount]);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative min-h-[120vh] w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#181926] via-[#181926] to-[#13131a] text-[#f8f8f8] overflow-visible py-32"
    >
      <div className="w-full max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-left mb-12 px-2 md:px-0">
          <span className="text-[#f8f8f8]">EVERY AI CONSULTANT IN AUSTRIA PROMISES TO</span>
        </h2>
        <div className="relative flex flex-col gap-16 items-center min-h-[600px]">
          {/* SVG lines connecting cards */}
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-full pointer-events-none z-0" width="128" height="100%" fill="none" style={{ minHeight: 600 }}>
            {Array.from({ length: visibleCount - 1 }).map((_, i) => {
              if (!cardCenters[i] || !cardCenters[i + 1]) return null;
              const y1 = (cardCenters[i].y - cardCenters[0].y) + 60;
              const y2 = (cardCenters[i + 1].y - cardCenters[0].y) - 60;
              return (
                <path
                  key={i}
                  d={getCurvedPath(64, y2, 64)}
                  stroke="#b6b6d6"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 6px #b6b6d6cc)' }}
                />
              );
            })}
          </svg>
          {/* Cards */}
          {consultantPoints.map((point, i) => (
            <div
              key={point}
              ref={el => { cardRefs.current[i] = el; }}
              className={`relative z-10 w-full max-w-xl mx-auto px-8 py-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 ${i < visibleCount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} font-mono text-lg md:text-xl tracking-tight flex items-center gap-4`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400/70 mr-2" />
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 