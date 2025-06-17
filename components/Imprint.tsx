import React, { useState, useEffect } from 'react';

const title = 'IMPRINT';
const lines = [
  'AI Stylist is operated by QUEER MEDIA LITERACY e.V.',
  'Austrian association registered in Vienna.',
  'ZVR Number: 1689372191',
  'Founded: 21.09.2024',
  'Address: c/o 1060 Wien, Mariahilfer Straße 49/15',
  'Jurisdiction: Landespolizeidirektion Wien',
  'Contact: admin@queer-alliance.com',
  'No phone number displayed.',
  'All rights reserved.'
];

export const Imprint: React.FC = () => {
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
    <section id="imprint" className="relative min-h-screen flex flex-col justify-center items-center section-padding bg-gradient-to-br from-[#23243a] via-[#1a1a1a] to-[#23243a] text-[#e0e6f7] overflow-hidden">
      <div className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border border-[#2d2e3e] bg-white/5 backdrop-blur-lg relative z-20 overflow-hidden">
        {/* Typewriter Title */}
        <div className="flex flex-col items-center justify-center py-12 px-6 md:px-12 gap-4">
          <h2 className="font-mono text-2xl md:text-3xl font-bold tracking-wide text-blue-200 text-center mb-8">
            {titleTyped}
            {!titleDone && <span className="inline-block align-middle ml-1 animate-cursor bg-blue-200 w-2 h-6 rounded-sm" />}
          </h2>
          {titleDone && lines.map((line, idx) => (
            <div
              key={idx}
              className={`w-full max-w-xl flex items-center justify-center mb-2 transition-all duration-500 ${idx > currentLine ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            >
              <div
                className={`flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#23243a]/80 to-[#23243a]/60 border border-[#2d2e3e] shadow-md font-mono text-lg md:text-xl tracking-tight transition-all duration-200 hover:scale-[1.03] hover:border-blue-200/60 hover:shadow-blue-200/10 cursor-default select-none`}
              >
                <span className="font-mono">{typed[idx]}</span>
                {idx === currentLine && isTyping && (
                  <span className="inline-block align-middle ml-1 animate-cursor bg-blue-200 w-2 h-6 rounded-sm" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl border-4 border-transparent bg-gradient-to-r from-blue-200/20 via-gray-300/10 to-purple-400/20 blur-[2px]" />
    </section>
  );
}; 