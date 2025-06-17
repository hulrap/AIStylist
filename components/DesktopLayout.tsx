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

interface Position {
  x: number;
  y: number;
}

const INITIAL_CASCADE_OFFSET = 32;
const WINDOW_APPEAR_DELAY = 200;

// Base window sizes (will be adjusted per window)
const BASE_WINDOW_WIDTH = 420;
const BASE_WINDOW_HEIGHT = 540;

const TITLE_BAR_HEIGHT = 40; // Height of the window title bar
const SCREEN_PADDING = 20; // Padding from screen edges

// Screen section divisions for scattering - adjusted to ensure visibility
const SCREEN_SECTIONS = {
  topLeft: { x: 0.25, y: 0.25 },
  topRight: { x: 0.75, y: 0.25 },
  centerLeft: { x: 0.25, y: 0.5 },
  centerRight: { x: 0.75, y: 0.5 },
  bottomLeft: { x: 0.25, y: 0.75 },
  bottomRight: { x: 0.75, y: 0.75 },
  center: { x: 0.5, y: 0.5 },
  topCenter: { x: 0.5, y: 0.3 }
};

// Size multipliers for different windows (1 = base size)
const WINDOW_SIZE_MULTIPLIERS: Record<SectionId, { width: number; height: number }> = {
  'ai-stylist': { width: 1.5, height: 1.5 }, // Largest window
  'problem': { width: 1.2, height: 1.2 },
  'first': { width: 1.1, height: 1.1 },
  'experience': { width: 1, height: 1 },
  'packages': { width: 1.1, height: 1.1 },
  'contact': { width: 1, height: 1 },
  'imprint': { width: 0.9, height: 0.9 },
  'credits': { width: 0.8, height: 0.8 }
};

// Window positions mapping
const WINDOW_POSITIONS: Record<SectionId, { x: number; y: number }> = {
  'ai-stylist': SCREEN_SECTIONS.center,
  'problem': SCREEN_SECTIONS.topLeft,
  'first': SCREEN_SECTIONS.topRight,
  'experience': SCREEN_SECTIONS.centerLeft,
  'packages': SCREEN_SECTIONS.centerRight,
  'contact': SCREEN_SECTIONS.bottomLeft,
  'imprint': SCREEN_SECTIONS.bottomRight,
  'credits': SCREEN_SECTIONS.topCenter
};

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
  const { openOverlay, closeOverlay, isOpen, activeOverlay, bringToFront, updatePosition } = useOverlayStack();
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
      // Pre-calculate all positions to ensure consistency
      const positions = WINDOW_ORDER.reduce((acc, id) => {
        acc[id] = getInitialPosition(id);
        return acc;
      }, {} as Record<SectionId, Position>);

      // Open windows with pre-calculated positions
      WINDOW_ORDER.forEach((id, index) => {
        setTimeout(() => {
          updatePosition(id, positions[id]);
          openOverlay(id);
          setWindowsVisible(prev => ({ ...prev, [id]: true }));
        }, index * WINDOW_APPEAR_DELAY);
      });
      
      setHasInitialized(true);
    }
  }, [hasInitialized, openOverlay, updatePosition]);

  const handleIconClick = (id: SectionId) => {
    if (isOpen(id)) {
      bringToFront(id);
    } else {
      openOverlay(id);
      setWindowsVisible(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleMinimize = (id: SectionId, label: string, icon: string) => {
    // First check if window is already minimized to prevent duplicates
    if (!minimizedWindows.some(w => w.id === id)) {
      setMinimizedWindows(prev => [...prev, { id, label, icon }]);
      // Hide the window but keep it in overlay stack
      setWindowsVisible(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRestore = (id: SectionId) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    setWindowsVisible(prev => ({ ...prev, [id]: true }));
    bringToFront(id);
  };

  const getInitialPosition = (id: SectionId) => {
    // Get window dimensions with fallback
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Get size multiplier for this window
    const sizeMultiplier = WINDOW_SIZE_MULTIPLIERS[id];
    const windowWidth = BASE_WINDOW_WIDTH * sizeMultiplier.width;
    const windowHeight = BASE_WINDOW_HEIGHT * sizeMultiplier.height;

    // Ensure AI Stylist doesn't exceed 2/3 of screen size
    const maxWidth = screenWidth * 0.66;
    const maxHeight = screenHeight * 0.66;
    
    const finalWidth = id === 'ai-stylist' ? Math.min(windowWidth, maxWidth) : windowWidth;
    const finalHeight = id === 'ai-stylist' ? Math.min(windowHeight, maxHeight) : windowHeight;

    // Get position ratio for this window
    const position = WINDOW_POSITIONS[id];
    
    // Add some randomness to the position (±5% of screen size)
    const randomOffset = () => (Math.random() - 0.5) * 0.05;

    // Calculate position ensuring window is fully visible
    const x = Math.max(
      SCREEN_PADDING,
      Math.min(
        screenWidth - finalWidth - SCREEN_PADDING,
        (screenWidth * position.x) - (finalWidth / 2) + (screenWidth * randomOffset())
      )
    );

    const y = Math.max(
      SCREEN_PADDING + TITLE_BAR_HEIGHT,
      Math.min(
        screenHeight - finalHeight - SCREEN_PADDING,
        (screenHeight * position.y) - (finalHeight / 2) + (screenHeight * randomOffset())
      )
    );
    
    return { x, y };
  };

  const getInitialSize = (id: SectionId) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    const sizeMultiplier = WINDOW_SIZE_MULTIPLIERS[id];
    const width = BASE_WINDOW_WIDTH * sizeMultiplier.width;
    const height = BASE_WINDOW_HEIGHT * sizeMultiplier.height;

    // Ensure AI Stylist doesn't exceed 2/3 of screen size
    if (id === 'ai-stylist') {
      return {
        width: Math.min(width, screenWidth * 0.66),
        height: Math.min(height, screenHeight * 0.66)
      };
    }

    return { width, height };
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
        initialSize={getInitialSize('ai-stylist')}
        showInitialContent={true}
        onMinimize={() => handleMinimize('ai-stylist', 'AI Stylist', '✨')}
      />
      <Problem
        id="problem"
        stackIndex={WINDOW_ORDER.indexOf('problem')}
        isActive={activeOverlay === 'problem'}
        forceVisible={windowsVisible['problem']}
        initialPosition={getInitialPosition('problem')}
        initialSize={getInitialSize('problem')}
        showContent={activeOverlay === 'problem'}
      />
      <Category
        id="first"
        stackIndex={WINDOW_ORDER.indexOf('first')}
        isActive={activeOverlay === 'first'}
        forceVisible={windowsVisible['first']}
        initialPosition={getInitialPosition('first')}
        initialSize={getInitialSize('first')}
        showContent={activeOverlay === 'first'}
      />
      <Experience
        id="experience"
        stackIndex={WINDOW_ORDER.indexOf('experience')}
        isActive={activeOverlay === 'experience'}
        forceVisible={windowsVisible['experience']}
        initialPosition={getInitialPosition('experience')}
        initialSize={getInitialSize('experience')}
        showContent={activeOverlay === 'experience'}
      />
      <Packages
        id="packages"
        stackIndex={WINDOW_ORDER.indexOf('packages')}
        isActive={activeOverlay === 'packages'}
        forceVisible={windowsVisible['packages']}
        initialPosition={getInitialPosition('packages')}
        initialSize={getInitialSize('packages')}
        showContent={activeOverlay === 'packages'}
      />
      <Contact
        id="contact"
        stackIndex={WINDOW_ORDER.indexOf('contact')}
        isActive={activeOverlay === 'contact'}
        forceVisible={windowsVisible['contact']}
        initialPosition={getInitialPosition('contact')}
        initialSize={getInitialSize('contact')}
        showContent={activeOverlay === 'contact'}
      />
      <Imprint
        id="imprint"
        stackIndex={WINDOW_ORDER.indexOf('imprint')}
        isActive={activeOverlay === 'imprint'}
        forceVisible={windowsVisible['imprint']}
        initialPosition={getInitialPosition('imprint')}
        initialSize={getInitialSize('imprint')}
        showContent={activeOverlay === 'imprint'}
      />

      {/* Taskbar */}
      <TaskBar minimizedWindows={minimizedWindows} onRestore={handleRestore} />
    </div>
  );
}; 