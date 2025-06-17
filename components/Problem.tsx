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

const mentorPoints = [
  'Transform your daily life',
  'Revolutionize your personal workflow',
  'Maximize your human potential',
  ",Meet you where you\'re comfortable",
  "Give you superpowers you\'ll actually use",
];

// Helper for SVG cubic Bezier path between two points
function getCurvedBezierPath(x1: number, y1: number, x2: number, y2: number) {
  // Control points: horizontally halfway, with vertical curve
  const midX = (x1 + x2) / 2;
  return `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
}

// Deterministic pseudo-random offset for each card
function getCardOffset(i: number, maxOffset = 120, yJitter = 0) {
  // Alternate left/right, with a fixed offset and a small vertical jitter
  const sign = i % 2 === 0 ? 1 : -1;
  const base = ((i * 73) % maxOffset) + 40; // 40-160px
  const x = sign * base;
  const y = yJitter ? ((i * 53) % yJitter) - yJitter / 2 : 0;
  return { x, y };
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
  const [consultantCardPositions, setConsultantCardPositions] = useState<{ x: number; y: number }[]>([]);

  // Calculate positions after render
  useEffect(() => {
    setTimeout(() => {
      setConsultantCardPositions(
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

  // --- Second section state ---
  const [visibleMentorCount, setVisibleMentorCount] = useState(1);
  const mentorSectionRef = useRef<HTMLDivElement>(null);
  const mentorCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mentorCardPositions, setMentorCardPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mentorSectionRef.current) return;
      const rect = mentorSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (rect.height + windowHeight * 0.2)));
      setVisibleMentorCount(Math.max(1, Math.ceil(progress * mentorPoints.length)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate positions after render
  useEffect(() => {
    setTimeout(() => {
      setMentorCardPositions(
        mentorCardRefs.current.map((ref, i) => {
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
  }, [visibleMentorCount]);

  return (
    <>
      {/* First Section */}
      <section
        id="problem"
        ref={sectionRef}
        className="relative min-h-[120vh] w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#181926] via-[#181926] to-[#13131a] text-[#f8f8f8] overflow-visible py-32"
      >
        <div className="absolute top-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(180deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
        <div className="w-full max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-left mb-12 px-2 md:px-0">
            <span className="text-[#f8f8f8]">EVERY AI CONSULTANT IN AUSTRIA PROMISES TO</span>
          </h2>
          <div className="relative flex flex-col gap-16 items-center min-h-[600px]">
            {/* SVG lines connecting cards */}
            <svg className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none z-0" width="100%" height="100%" fill="none" style={{ minHeight: 600 }}>
              {Array.from({ length: visibleCount - 1 }).map((_, i) => {
                if (!consultantCardPositions[i] || !consultantCardPositions[i + 1]) return null;
                const { x: x1, y: y1 } = consultantCardPositions[i];
                const { x: x2, y: y2 } = consultantCardPositions[i + 1];
                return (
                  <path
                    key={i}
                    d={getCurvedBezierPath(x1, y1, x2, y2)}
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
            {consultantPoints.map((point, i) => {
              const offset = getCardOffset(i, 120, 32);
              return (
                <div
                  key={point}
                  ref={el => { cardRefs.current[i] = el; }}
                  className={`relative z-10 w-full max-w-xl mx-auto px-8 py-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 ${i < visibleCount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} font-mono text-lg md:text-xl tracking-tight flex items-center gap-4`}
                  style={{
                    transitionDelay: `${i * 0.08}s`,
                    transform: `translateX(${offset.x}px) translateY(${offset.y}px)`
                  }}
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-400/70 mr-2" />
                  {point}
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(0deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
      </section>
      {/* Second Section */}
      <section
        id="promise"
        ref={mentorSectionRef}
        className="relative min-h-[120vh] w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#23243a] via-[#23243a] to-[#1a1a1a] text-[#f8f8f8] overflow-visible py-32"
      >
        <div className="absolute top-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(180deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
        <div className="w-full max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-left mb-12 px-2 md:px-0">
            <span className="text-amber-200">I PROMISE TO</span>
          </h2>
          <div className="relative flex flex-col gap-16 items-center min-h-[600px]">
            {/* SVG lines connecting cards */}
            <svg className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none z-0" width="100%" height="100%" fill="none" style={{ minHeight: 600 }}>
              {Array.from({ length: visibleMentorCount - 1 }).map((_, i) => {
                if (!mentorCardPositions[i] || !mentorCardPositions[i + 1]) return null;
                const { x: x1, y: y1 } = mentorCardPositions[i];
                const { x: x2, y: y2 } = mentorCardPositions[i + 1];
                return (
                  <path
                    key={i}
                    d={getCurvedBezierPath(x1, y1, x2, y2)}
                    stroke="#ffd699"
                    strokeWidth="3"
                    strokeDasharray="6 8"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 0 6px #ffd699cc)' }}
                  />
                );
              })}
            </svg>
            {/* Cards */}
            {mentorPoints.map((point, i) => {
              const offset = getCardOffset(i, 120, 32);
              return (
                <div
                  key={point}
                  ref={el => { mentorCardRefs.current[i] = el; }}
                  className={`relative z-10 w-full max-w-xl mx-auto px-8 py-7 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-100/10 shadow-xl transition-all duration-500 ${i < visibleMentorCount ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'} font-mono text-lg md:text-xl tracking-tight flex items-center gap-4`}
                  style={{
                    transitionDelay: `${i * 0.08}s`,
                    transform: `translateX(${offset.x}px) translateY(${offset.y}px)`
                  }}
                >
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-200/80 mr-2" />
                  {point}
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 z-10 pointer-events-none" style={{background: 'linear-gradient(0deg, #23243a 0%, rgba(35,36,58,0.0) 100%)'}} />
      </section>
    </>
  );
}; 