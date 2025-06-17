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

const title = 'EVERY AI CONSULTANT IN AUSTRIA PROMISES TO';
const lines = [
  'Transform your business processes.',
  'Revolutionize your company workflows.',
  'Maximize your organizational efficiency.',
  'Schedule you into conference room hell.',
  'Sell you software that nobody understands.'
];

export const Problem: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState<string[]>(Array(lines.length).fill(''));
  const [isTyping, setIsTyping] = useState(true);
  const [titleTyped, setTitleTyped] = useState('');
  const [titleDone, setTitleDone] = useState(false);

  // Typewriter for title
  useEffect(() => {
    if (!titleDone && titleTyped.length < title.length) {
      const timeout = setTimeout(() => {
        setTitleTyped(title.slice(0, titleTyped.length + 1));
      }, 24);
      return () => clearTimeout(timeout);
    } else if (!titleDone) {
      setTitleDone(true);
    }
  }, [titleTyped, titleDone]);

  // Typewriter for lines
  useEffect(() => {
    if (titleDone && currentLine < lines.length) {
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
  }, [typed, currentLine, titleDone]);

  return (
    <section id="problem" className="relative min-h-screen flex flex-col justify-center items-center section-padding bg-gradient-to-br from-[#23243a] via-[#181926] to-[#1a1a1a] text-[#ffe6c7] overflow-hidden">
      <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border border-[#3a2d23] bg-white/5 backdrop-blur-lg relative z-20 overflow-hidden">
        {/* Typewriter Title */}
        <div className="flex flex-col items-center justify-center py-12 px-6 md:px-12 gap-4">
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-wide text-amber-400 text-center mb-8">
            {titleTyped}
            {!titleDone && <span className="inline-block align-middle ml-1 animate-cursor bg-amber-400 w-2 h-6 rounded-sm" />}
          </h2>
          {titleDone && lines.map((line, idx) => (
            <div
              key={idx}
              className={`w-full max-w-xl flex items-center justify-center mb-2 transition-all duration-500 ${idx > currentLine ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            >
              <div
                className={`flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#23243a]/80 to-[#23243a]/60 border border-[#3a2d23] shadow-md font-mono text-lg md:text-xl tracking-tight transition-all duration-200 hover:scale-[1.03] hover:border-amber-400/60 hover:shadow-amber-400/10 cursor-default select-none`}
              >
                <span className="font-mono">{typed[idx]}</span>
                {idx === currentLine && isTyping && (
                  <span className="inline-block align-middle ml-1 animate-cursor bg-amber-400 w-2 h-6 rounded-sm" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl border-4 border-transparent bg-gradient-to-r from-amber-400/20 via-purple-600/10 to-amber-400/20 blur-[2px]" />
    </section>
  );
}; 