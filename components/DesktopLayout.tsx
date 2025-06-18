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
import { useOverlayStack, SectionId, WindowState } from './OverlayStackContext';
import { Hero } from './Hero';
import { getIconForSection } from './Icons';

interface Position {
  x: number;
  y: number;
}

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
  center: { x: 0.5, y: 0.45 },
  topCenter: { x: 0.5, y: 0.3 }
};

// Size multipliers for different windows (1 = base size)
const WINDOW_SIZE_MULTIPLIERS: Record<SectionId, { width: number; height: number }> = {
  'ai-instructor': { width: 1.5, height: 1.5 }, // Largest window
  'problem': { width: 1.2, height: 1.2 },
  'first': { width: 1.1, height: 1.1 },
  'experience': { width: 1, height: 1 },
  'packages': { width: 1.1, height: 1.1 },
  'contact': { width: 1, height: 1 },
  'imprint': { width: 0.9, height: 0.9 }
};

// Window positions mapping
const WINDOW_POSITIONS: Record<SectionId, { x: number; y: number }> = {
  'ai-instructor': SCREEN_SECTIONS.center,
  'problem': SCREEN_SECTIONS.topLeft,
  'first': SCREEN_SECTIONS.topRight,
  'experience': SCREEN_SECTIONS.centerLeft,
  'packages': SCREEN_SECTIONS.centerRight,
  'contact': SCREEN_SECTIONS.bottomLeft,
  'imprint': SCREEN_SECTIONS.bottomRight
};

// Cascade order - windows appear in this order, ai-instructor opens last
const CASCADE_ORDER: SectionId[] = [
  'imprint',
  'contact', 
  'packages',
  'experience',
  'first',
  'problem',
  'ai-instructor' // Opens last
];

// Typing sequence - starts with ai-instructor, then goes backwards through the list
const TYPING_SEQUENCE: SectionId[] = [
  'ai-instructor',
  'problem',
  'first', 
  'experience',
  'packages',
  'contact' // Final window, doesn't minimize after typing
];

interface DesktopLayoutProps {
  isReady: boolean;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ isReady }) => {
  const { 
    openOverlay, 
    closeOverlay,
    isOpen, 
    activeOverlay, 
    bringToFront, 
    updatePosition, 
    overlayStack,
    minimizeWindow,
    maximizeWindow,
    unmaximizeWindow,
    restoreWindow,
    getWindowState,
    minimizedWindows,
    maximizedWindow,
    setOverlayStack,
    setWindowStates,
    startWindowTransition
  } = useOverlayStack();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only start cascade animation when isReady is true and hasn't initialized yet
    if (isReady && !hasInitialized) {
      // Pre-calculate all positions to ensure consistency
      const positions = CASCADE_ORDER.reduce((acc, id) => {
        acc[id] = getInitialPosition(id);
        return acc;
      }, {} as Record<SectionId, Position>);

      // Initialize all windows as visible but inactive
      setWindowStates(prev => {
        const newStates = { ...prev };
        CASCADE_ORDER.forEach(id => {
          newStates[id] = {
            ...newStates[id],
            isVisible: false, // Start invisible for cascade effect
            isActive: false,
            isMinimized: false, // All windows start unminimized
            transitionState: 'idle'
          };
        });
        return newStates;
      });

      // Start the cascade sequence from first to last in CASCADE_ORDER
      let currentIndex = 0;
      
      const activateNextWindow = () => {
        if (currentIndex < CASCADE_ORDER.length) {
          const id = CASCADE_ORDER[currentIndex];
          
          // Update position first
          updatePosition(id, positions[id]);
          
          // Then update window state
          setWindowStates(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              isVisible: true,
              isActive: currentIndex === CASCADE_ORDER.length - 1, // Only ai-instructor (last) starts as active
              isMinimized: false,
              transitionState: 'idle' // Start with idle, will be set to typing separately
            }
          }));

          // Add to overlay stack in correct order for layering
          setOverlayStack(prev => [...prev, id]);
          
          // For AI instructor, start typing after window is fully visible
          if (currentIndex === CASCADE_ORDER.length - 1) {
            setTimeout(() => {
              setWindowStates(prev => ({
                ...prev,
                [id]: {
                  ...prev[id],
                  transitionState: 'typing'
                }
              }));
            }, 500); // Longer delay to ensure window is fully rendered
          }
          
          // Schedule next window
          currentIndex++;
          if (currentIndex < CASCADE_ORDER.length) {
            setTimeout(activateNextWindow, WINDOW_APPEAR_DELAY);
          }
        }
      };

      // Start the cascade
      activateNextWindow();
      setHasInitialized(true);
    }
  }, [isReady, hasInitialized, updatePosition, setWindowStates]);

  const handleTypingComplete = (id: SectionId) => {
    // Special handling for Contact window - don't minimize, it's the final destination
    if (id === 'contact') {
      return;
    }

    // Find the next window in the typing sequence
    const currentIndex = TYPING_SEQUENCE.indexOf(id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < TYPING_SEQUENCE.length) {
      const nextId = TYPING_SEQUENCE[nextIndex];
      
      // Start minimizing current window
      startWindowTransition(id, 'minimizing');
      
      // Use a timeout to ensure state updates happen in sequence
      setTimeout(() => {
        // First minimize the current window
        setWindowStates(prevStates => ({
          ...prevStates,
          [id]: {
            ...prevStates[id],
            isActive: false,
            isMinimized: true,
            transitionState: 'idle',
            isVisible: true // Keep the window visible in the background
          }
        }));
        
        // Add to minimized windows list
        minimizeWindow(id, getLabelForSection(id), id);
        
        // Then after a short delay, activate the next window
        setTimeout(() => {
          // Update window states in correct order
          setWindowStates(prevStates => ({
            ...prevStates,
            [nextId]: {
              ...prevStates[nextId],
              isVisible: true,
              isActive: true,
              isMinimized: false,
              transitionState: 'typing'
            }
          }));

          // Bring next window to front
          bringToFront(nextId);
        }, 100); // Small delay to ensure proper transition
      }, 200); // Delay to allow minimization animation to start
    }
  };

  const handleIconClick = (id: SectionId) => {
    const windowState = getWindowState(id);
    
    if (isOpen(id)) {
      if (windowState?.isMinimized) {
        // If window is minimized, restore it and start typing
        restoreWindow(id);
        setTimeout(() => {
          setWindowStates(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              transitionState: 'typing'
            }
          }));
        }, 100);
      } else {
        // If window is open and visible, close it (toggle behavior)
        closeOverlay(id);
      }
    } else {
      // If window is not open, open it
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isVisible: true,
          isActive: true,
          isMinimized: false,
          transitionState: 'opening'
        }
      }));
      
      // Add to overlay stack
      setOverlayStack(prev => [...prev, id]);
      
      // Start typing immediately after opening
      setTimeout(() => {
        setWindowStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            transitionState: 'typing'
          }
        }));
      }, 100);
    }
  };

  const handleMinimize = (id: SectionId) => {
    const windowState = getWindowState(id);
    if (!windowState?.isMinimized) {
      // Keep the window visible but minimized
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
          isActive: false,
          // Keep it visible
          isVisible: true,
          transitionState: 'idle'
        }
      }));
      minimizeWindow(id, getLabelForSection(id), id);
    }
  };

  const handleMaximize = (id: SectionId) => {
    const windowState = getWindowState(id);
    if (!windowState?.isMaximized) {
      maximizeWindow(id);
    }
  };

  const handleUnmaximize = (id: SectionId) => {
    const windowState = getWindowState(id);
    if (windowState?.isMaximized) {
      unmaximizeWindow(id);
    }
  };

  const handleRestore = (id: SectionId) => {
    const windowState = getWindowState(id);
    if (windowState?.isMinimized) {
      restoreWindow(id);
      // Start typing when restored
      setTimeout(() => {
        setWindowStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            transitionState: 'typing'
          }
        }));
      }, 100);
    }
  };

  const handleClose = (id: SectionId) => {
    closeOverlay(id);
  };

  const getInitialPosition = (id: SectionId) => {
    // Get window dimensions with fallback
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Get size multiplier for this window
    const sizeMultiplier = WINDOW_SIZE_MULTIPLIERS[id];
    const windowWidth = BASE_WINDOW_WIDTH * sizeMultiplier.width;
    const windowHeight = BASE_WINDOW_HEIGHT * sizeMultiplier.height;

    // Ensure AI Instructor doesn't exceed 2/3 of screen size
    const maxWidth = screenWidth * 0.66;
    const maxHeight = screenHeight * 0.66;
    
    const finalWidth = id === 'ai-instructor' ? Math.min(windowWidth, maxWidth) : windowWidth;
    const finalHeight = id === 'ai-instructor' ? Math.min(windowHeight, maxHeight) : windowHeight;

    // Get position ratio for this window
    const position = WINDOW_POSITIONS[id];
    
    // Reduced randomness for more consistent positioning (±2% of screen size)
    const randomOffset = () => (Math.random() - 0.5) * 0.02;

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

    // Ensure AI Instructor doesn't exceed 2/3 of screen size
    if (id === 'ai-instructor') {
      return {
        width: Math.min(width, screenWidth * 0.66),
        height: Math.min(height, screenHeight * 0.66)
      };
    }

    return { width, height };
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] auto-rows-[120px] gap-1">
        {CASCADE_ORDER.map((id) => (
          <DesktopIcon
            key={id}
            id={id}
            label={getLabelForSection(id)}
            icon={id}
            onClick={() => handleIconClick(id)}
          />
        ))}
      </div>

      {/* Windows */}
      {CASCADE_ORDER.map((id) => {
        const isActive = id === activeOverlay;
        const windowState = getWindowState(id);
        const isVisible = windowState?.isVisible ?? false;
        const isMaximized = windowState?.isMaximized ?? false;
        const stackIndex = overlayStack.indexOf(id);

        if (!isOpen(id)) return null;

        switch (id) {
          case 'ai-instructor':
            return (
              <Hero
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'problem':
            return (
              <Problem
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'first':
            return (
              <Category
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'experience':
            return (
              <Experience
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'packages':
            return (
              <Packages
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'contact':
            return (
              <Contact
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          case 'imprint':
            return (
              <Imprint
                key={id}
                id={id}
                stackIndex={stackIndex}
                isActive={isActive}
                forceVisible={isVisible}
                initialPosition={getInitialPosition(id)}
                initialSize={getInitialSize(id)}
                showContent={isActive}
                isMaximized={isMaximized}
                onMinimize={() => handleMinimize(id)}
                onMaximize={() => handleMaximize(id)}
                onUnmaximize={() => handleUnmaximize(id)}
                onTypingComplete={() => handleTypingComplete(id)}
              />
            );
          default:
            return null;
        }
      })}

      {/* Taskbar */}
      <TaskBar
        minimizedWindows={minimizedWindows}
        onRestore={handleRestore}
      />
    </div>
  );
};

// Helper function to get label for each section
const getLabelForSection = (id: SectionId): string => {
  switch (id) {
    case 'ai-instructor': return 'AI Instructor';
    case 'problem': return 'The Problem';
    case 'first': return 'The First';
    case 'experience': return 'The Experience';
    case 'packages': return 'Three Ways';
    case 'contact': return 'Start Now';
    case 'imprint': return 'Imprint';
    default: return id;
  }
}; 