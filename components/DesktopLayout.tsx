import React, { useState, useEffect } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { TaskBar } from './TaskBar';
import { TypewriterOverlay } from './TypewriterOverlay';
import { Problem } from './Problem';
import { Category } from './Category';
import { Experience } from './Experience';
import { Packages } from './Packages';
import { Contact } from './Contact';
import { Imprint } from './Imprint';
import { useOverlayStack, SectionId } from './OverlayStackContext';

const INITIAL_CASCADE_OFFSET = 32;
const WINDOW_APPEAR_DELAY = 200;

// Reverse the order so ai-stylist appears last (on top)
const WINDOW_ORDER: SectionId[] = [
  'credits',
  'imprint',
  'contact',
  'packages',
  'experience',
  'first',
  'problem',
  'ai-stylist'
];

interface MinimizedWindow {
  id: SectionId;
  label: string;
  icon: string;
}

export const DesktopLayout: React.FC = () => {
  const { openOverlay, closeOverlay, isOpen, activeOverlay, bringToFront } = useOverlayStack();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [windowsVisible, setWindowsVisible] = useState<Record<SectionId, boolean>>(() => {
    const initial: Record<SectionId, boolean> = {
      'ai-stylist': false,
      'problem': false,
      'first': false,
      'experience': false,
      'packages': false,
      'contact': false,
      'imprint': false,
      'credits': false
    };
    return initial;
  });
  const [minimizedWindows, setMinimizedWindows] = useState<MinimizedWindow[]>([]);

  useEffect(() => {
    // Initial cascade animation
    if (!hasInitialized) {
      WINDOW_ORDER.forEach((id, index) => {
        setTimeout(() => {
          openOverlay(id);
          setWindowsVisible(prev => ({ ...prev, [id]: true }));
        }, index * WINDOW_APPEAR_DELAY);
      });
      setHasInitialized(true);
    }
  }, [hasInitialized, openOverlay]);

  const handleIconClick = (id: SectionId) => {
    if (isOpen(id)) {
      bringToFront(id);
    } else {
      openOverlay(id);
      setWindowsVisible(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleMinimize = (id: SectionId, label: string, icon: string) => {
    setMinimizedWindows(prev => [...prev, { id, label, icon }]);
  };

  const handleRestore = (id: SectionId) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    bringToFront(id);
  };

  const getInitialPosition = (id: SectionId) => {
    // Center all windows with cascade offset
    const baseX = Math.max(0, (window.innerWidth - (id === 'ai-stylist' ? 800 : 600)) / 2);
    const baseY = Math.max(0, (window.innerHeight - (id === 'ai-stylist' ? 600 : 400)) / 2);
    const index = WINDOW_ORDER.indexOf(id);
    return {
      x: baseX + (INITIAL_CASCADE_OFFSET * index),
      y: baseY + (INITIAL_CASCADE_OFFSET * index)
    };
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent">
      {/* Desktop Icons */}
      <div className="fixed left-8 top-8 space-y-6">
        <DesktopIcon
          id="ai-stylist"
          icon="✨"
          label="AI Stylist"
          onClick={() => handleIconClick('ai-stylist')}
        />
        <DesktopIcon
          id="problem"
          icon="⚠️"
          label="The Problem"
          onClick={() => handleIconClick('problem')}
        />
        <DesktopIcon
          id="first"
          icon="👥"
          label="The First"
          onClick={() => handleIconClick('first')}
        />
        <DesktopIcon
          id="experience"
          icon="💡"
          label="The Experience"
          onClick={() => handleIconClick('experience')}
        />
        <DesktopIcon
          id="packages"
          icon="🛍️"
          label="Three Ways"
          onClick={() => handleIconClick('packages')}
        />
        <DesktopIcon
          id="contact"
          icon="✉️"
          label="Start Now"
          onClick={() => handleIconClick('contact')}
        />
        <DesktopIcon
          id="imprint"
          icon="ℹ️"
          label="Imprint"
          onClick={() => handleIconClick('imprint')}
        />
        <DesktopIcon
          id="credits"
          icon="❤️"
          label="Credits"
          onClick={() => handleIconClick('credits')}
        />
      </div>

      {/* Windows */}
      <TypewriterOverlay
        id="ai-stylist"
        title="AI Stylist"
        content={`Finally.
An AI expert who comes to YOUR place.
Not your office. Your home.
With pizza. And beer.
And zero corporate bullshit.

In a world where AI consultants treat you like a company,
I treat you like a human.

Because AI isn't about making businesses more efficient.
It's about making humans more powerful.`}
        stackIndex={WINDOW_ORDER.indexOf('ai-stylist')}
        isActive={activeOverlay === 'ai-stylist'}
        forceVisible={windowsVisible['ai-stylist']}
        initialPosition={getInitialPosition('ai-stylist')}
        showInitialContent={true}
        onMinimize={() => handleMinimize('ai-stylist', 'AI Stylist', '✨')}
        className="w-[800px] h-[600px]"
      />
      <Problem
        id="problem"
        stackIndex={WINDOW_ORDER.indexOf('problem')}
        isActive={activeOverlay === 'problem'}
        forceVisible={windowsVisible['problem']}
        initialPosition={getInitialPosition('problem')}
        showContent={activeOverlay === 'problem'}
        className="w-[600px] h-[400px]"
      />
      <Category
        id="first"
        stackIndex={WINDOW_ORDER.indexOf('first')}
        isActive={activeOverlay === 'first'}
        forceVisible={windowsVisible['first']}
        initialPosition={getInitialPosition('first')}
        showContent={activeOverlay === 'first'}
        className="w-[600px] h-[400px]"
      />
      <Experience
        id="experience"
        stackIndex={WINDOW_ORDER.indexOf('experience')}
        isActive={activeOverlay === 'experience'}
        forceVisible={windowsVisible['experience']}
        initialPosition={getInitialPosition('experience')}
        showContent={activeOverlay === 'experience'}
        className="w-[600px] h-[400px]"
      />
      <Packages
        id="packages"
        stackIndex={WINDOW_ORDER.indexOf('packages')}
        isActive={activeOverlay === 'packages'}
        forceVisible={windowsVisible['packages']}
        initialPosition={getInitialPosition('packages')}
        showContent={activeOverlay === 'packages'}
        className="w-[600px] h-[400px]"
      />
      <Contact
        id="contact"
        stackIndex={WINDOW_ORDER.indexOf('contact')}
        isActive={activeOverlay === 'contact'}
        forceVisible={windowsVisible['contact']}
        initialPosition={getInitialPosition('contact')}
        showContent={activeOverlay === 'contact'}
        className="w-[600px] h-[400px]"
      />
      <Imprint
        id="imprint"
        stackIndex={WINDOW_ORDER.indexOf('imprint')}
        isActive={activeOverlay === 'imprint'}
        forceVisible={windowsVisible['imprint']}
        initialPosition={getInitialPosition('imprint')}
        showContent={activeOverlay === 'imprint'}
        className="w-[600px] h-[400px]"
      />

      {/* Taskbar */}
      <TaskBar minimizedWindows={minimizedWindows} onRestore={handleRestore} />
    </div>
  );
}; 