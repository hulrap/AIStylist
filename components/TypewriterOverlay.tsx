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
  forceVisible?: boolean;
  onUserInteraction?: () => void;
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
  forceVisible = false,
  onUserInteraction,
  children
}) => {
  const { isOverlayOpen, closeOverlay, bringToFront } = useOverlayStack();
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState<string[]>(Array(lines.length).fill(''));
  const [isTyping, setIsTyping] = useState(true);
  const [started, setStarted] = useState(false);

  // Start animation only when isActive is true
  useEffect(() => {
    if (isActive && !started) {
      setStarted(true);
    }
    if (!isActive) {
      setStarted(false);
      setCurrentLine(0);
      setTyped(Array(lines.length).fill(''));
      setIsTyping(true);
    }
  }, [isActive, started, lines.length]);

  // Typewriter for lines
  useEffect(() => {
    if (!started || !isActive) return;
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
  }, [typed, currentLine, started, lines, isActive]);

  // Handler wrappers to notify parent
  const handleClose = () => {
    if (onUserInteraction) onUserInteraction();
    closeOverlay(id);
  };
  const handleBringToFront = () => {
    if (onUserInteraction) onUserInteraction();
    bringToFront(id);
  };

  if (!forceVisible && !isOverlayOpen(id)) return null;

  // Offset for cascading effect (top-left only)
  const offset = stackIndex * 16;

  return (
    <div
      className="fixed z-[60] transition-all duration-500"
      style={{
        left: `${offset + 32}px`,
        top: `${offset + 32}px`,
        width: 420,
        height: 540,
        maxWidth: '90vw',
        maxHeight: '90vh',
        pointerEvents: isActive ? 'auto' : 'none',
        opacity: isActive ? 1 : 0.85,
        boxShadow: isActive
          ? '0 8px 32px 0 rgba(0,0,0,0.25)'
          : '0 2px 8px 0 rgba(0,0,0,0.10)',
        transition: 'box-shadow 0.3s, opacity 0.3s',
      }}
    >
      <div
        className={`w-full h-full flex flex-col rounded-2xl shadow-2xl border bg-white/5 backdrop-blur-lg relative overflow-hidden ${bgGradient}`}
        style={{ borderColor: borderColor }}
      >
        {/* Window bar */}
        <div
          className="flex items-center h-10 px-4 bg-gradient-to-r from-[#23243a]/80 to-[#181926]/80 border-b"
          style={{ borderColor: borderColor }}
        >
          <span className="flex items-center gap-1 mr-4">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors"
              aria-label="Close"
            />
            <button
              onClick={handleBringToFront}
              className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 transition-colors"
              aria-label="Minimize"
            />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </span>
          <span className="text-xs text-[#b0b0c3] tracking-widest font-mono uppercase">{title}</span>
        </div>

        {/* Content area, scrollable, chat-like */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`w-full flex items-start mb-1 transition-all duration-500 ${
                idx > currentLine ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <div
                className={`flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#23243a]/80 to-[#23243a]/60 border shadow-md font-mono text-base tracking-tight transition-all duration-200 hover:scale-[1.03] cursor-default select-none`}
                style={{
                  borderColor: borderColor,
                  '--hover-border-color': `${accentColor}60`,
                  '--hover-shadow-color': `${accentColor}10`,
                } as React.CSSProperties}
              >
                <span className="font-mono">{isActive ? typed[idx] : lines[idx]}</span>
                {idx === currentLine && isTyping && isActive && (
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