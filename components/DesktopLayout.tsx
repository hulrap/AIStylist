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
const WINDOW_WIDTH = 420; // Default window width
const WINDOW_HEIGHT = 540; // Default window height
const INITIAL_X_OFFSET = 120; // Starting X position for cascade
const INITIAL_Y_OFFSET = 60; // Starting Y position for cascade

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
    const index = WINDOW_ORDER.indexOf(id);
    
    // Get window dimensions
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    // Calculate center position
    const centerX = (windowWidth - WINDOW_WIDTH) / 2;
    const centerY = (windowHeight - WINDOW_HEIGHT) / 2;
    
    // Apply cascade offset
    return {
      x: centerX + (INITIAL_CASCADE_OFFSET * index) - (INITIAL_X_OFFSET * (WINDOW_ORDER.length - 1) / 2),
      y: centerY + (INITIAL_CASCADE_OFFSET * index) - (INITIAL_Y_OFFSET * (WINDOW_ORDER.length - 1) / 2)
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
        content="Finally.\nAn AI expert who comes to YOUR place.\nNot your office. Your home.\nWith pizza. And beer.\nAnd zero corporate bullshit."
        stackIndex={WINDOW_ORDER.indexOf('ai-stylist')}
        isActive={activeOverlay === 'ai-stylist'}
        forceVisible={windowsVisible['ai-stylist']}
        initialPosition={getInitialPosition('ai-stylist')}
        showInitialContent={true}
        onMinimize={() => handleMinimize('ai-stylist', 'AI Stylist', '✨')}
      />
      <Problem
        id="problem"
        stackIndex={WINDOW_ORDER.indexOf('problem')}
        isActive={activeOverlay === 'problem'}
        forceVisible={windowsVisible['problem']}
        initialPosition={getInitialPosition('problem')}
        showContent={activeOverlay === 'problem'}
      />
      <Category
        id="first"
        stackIndex={WINDOW_ORDER.indexOf('first')}
        isActive={activeOverlay === 'first'}
        forceVisible={windowsVisible['first']}
        initialPosition={getInitialPosition('first')}
        showContent={activeOverlay === 'first'}
      />
      <Experience
        id="experience"
        stackIndex={WINDOW_ORDER.indexOf('experience')}
        isActive={activeOverlay === 'experience'}
        forceVisible={windowsVisible['experience']}
        initialPosition={getInitialPosition('experience')}
        showContent={activeOverlay === 'experience'}
      />
      <Packages
        id="packages"
        stackIndex={WINDOW_ORDER.indexOf('packages')}
        isActive={activeOverlay === 'packages'}
        forceVisible={windowsVisible['packages']}
        initialPosition={getInitialPosition('packages')}
        showContent={activeOverlay === 'packages'}
      />
      <Contact
        id="contact"
        stackIndex={WINDOW_ORDER.indexOf('contact')}
        isActive={activeOverlay === 'contact'}
        forceVisible={windowsVisible['contact']}
        initialPosition={getInitialPosition('contact')}
        showContent={activeOverlay === 'contact'}
      />
      <Imprint
        id="imprint"
        stackIndex={WINDOW_ORDER.indexOf('imprint')}
        isActive={activeOverlay === 'imprint'}
        forceVisible={windowsVisible['imprint']}
        initialPosition={getInitialPosition('imprint')}
        showContent={activeOverlay === 'imprint'}
      />

      {/* Taskbar */}
      <TaskBar minimizedWindows={minimizedWindows} onRestore={handleRestore} />
    </div>
  );
}; 