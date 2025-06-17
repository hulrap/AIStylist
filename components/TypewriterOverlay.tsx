import React, { useState, useEffect } from 'react';
import { SectionId, useOverlayStack } from './OverlayStackContext';

interface TypewriterOverlayProps {
  id: SectionId;
  title: string;
  lines: string[];
  accentColor: string;
  bgGradient: string;
  borderColor: string;
  stackIndex?: number;
  isActive?: boolean;
  children?: React.ReactNode;
}

export const TypewriterOverlay: React.FC<TypewriterOverlayProps> = ({
  id,
  title,
  lines,
  accentColor,
  bgGradient,
  borderColor,
  stackIndex = 0,
  isActive = false,
  children
}) => {
  const { isOverlayOpen, closeOverlay, bringToFront } = useOverlayStack();
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState<string[]>(Array(lines.length).fill(''));
  const [isTyping, setIsTyping] = useState(true);
  const [titleTyped, setTitleTyped] = useState('');
  const [titleDone, setTitleDone] = useState(false);
  const [started, setStarted] = useState(false);

  // Start animation when isActive becomes true
  useEffect(() => {
    if (isActive && !started) {
      setStarted(true);
    }
  }, [isActive, started]);

  // Typewriter for title
  useEffect(() => {
    if (!started) return;
    if (!titleDone && titleTyped.length < title.length) {
      const timeout = setTimeout(() => {
        setTitleTyped(title.slice(0, titleTyped.length + 1));
      }, 24);
      return () => clearTimeout(timeout);
    } else if (!titleDone && started) {
      setTitleDone(true);
    }
  }, [titleTyped, titleDone, started, title]);

  // Typewriter for lines
  useEffect(() => {
    if (!started) return;
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
  }, [typed, currentLine, titleDone, started, lines]);

  if (!isOverlayOpen(id)) return null;

  // Offset for cascading effect
  const offset = stackIndex * 16;

  return (
    <div
      className="fixed z-[60] transition-all duration-500"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offset}px, ${offset}px)`,
        pointerEvents: isActive ? 'auto' : 'none',
        opacity: isActive ? 1 : 0.85,
        boxShadow: isActive
          ? '0 8px 32px 0 rgba(0,0,0,0.25)'
          : '0 2px 8px 0 rgba(0,0,0,0.10)',
        transition: 'box-shadow 0.3s, opacity 0.3s',
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        overflow: 'visible',
      }}
    >
      <div
        className={`w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border bg-white/5 backdrop-blur-lg relative overflow-auto ${bgGradient}`}
        style={{ borderColor: borderColor, maxHeight: '90vh' }}
      >
        {/* Window bar */}
        <div
          className="flex items-center h-10 px-4 bg-gradient-to-r from-[#23243a]/80 to-[#181926]/80 border-b"
          style={{ borderColor: borderColor }}
        >
          <span className="flex items-center gap-1 mr-4">
            <button
              onClick={() => closeOverlay(id)}
              className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors"
              aria-label="Close"
            />
            <button
              onClick={() => bringToFront(id)}
              className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 transition-colors"
              aria-label="Minimize"
            />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </span>
          <span className="text-xs text-[#b0b0c3] tracking-widest font-mono uppercase">{title}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-12 px-6 md:px-12 gap-4">
          <h2
            className="font-mono text-2xl md:text-3xl font-bold tracking-wide text-center mb-8"
            style={{ color: accentColor }}
          >
            {titleTyped}
            {!titleDone && started && (
              <span
                className="inline-block align-middle ml-1 animate-cursor w-2 h-6 rounded-sm"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </h2>

          {titleDone &&
            lines.map((line, idx) => (
              <div
                key={idx}
                className={`w-full max-w-xl flex items-center justify-center mb-2 transition-all duration-500 ${
                  idx > currentLine ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                <div
                  className={`flex items-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#23243a]/80 to-[#23243a]/60 border shadow-md font-mono text-lg md:text-xl tracking-tight transition-all duration-200 hover:scale-[1.03] cursor-default select-none`}
                  style={{
                    borderColor: borderColor,
                    '--hover-border-color': `${accentColor}60`,
                    '--hover-shadow-color': `${accentColor}10`,
                  } as React.CSSProperties}
                >
                  <span className="font-mono">{typed[idx]}</span>
                  {idx === currentLine && isTyping && started && (
                    <span
                      className="inline-block align-middle ml-1 animate-cursor w-2 h-6 rounded-sm"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
              </div>
            ))}

          {children}
        </div>
      </div>
    </div>
  );
}; 