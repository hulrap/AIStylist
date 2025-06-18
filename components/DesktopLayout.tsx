import React, { useState, useEffect } from 'react';
import { DesktopIcon } from './DesktopIcon';

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

const WINDOW_APPEAR_DELAY = 150;
const MOBILE_WINDOW_APPEAR_DELAY = 50;

// Base window sizes (will be adjusted per window)
const BASE_WINDOW_WIDTH = 520;
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
  const [isAutoSequenceActive, setIsAutoSequenceActive] = useState(false);
  const [hasCompletedAutoSequence, setHasCompletedAutoSequence] = useState(false);
  const [processedCompletions, setProcessedCompletions] = useState<Set<SectionId>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add mobile body class when windows are open
  useEffect(() => {
    if (isMobile && overlayStack.length > 0) {
      document.body.classList.add('mobile-no-scroll');
    } else {
      document.body.classList.remove('mobile-no-scroll');
    }
    
    return () => {
      document.body.classList.remove('mobile-no-scroll');
    };
  }, [isMobile, overlayStack.length]);

  // Function to stop automatic sequence when user interacts
  const stopAutoSequence = () => {
    if (isAutoSequenceActive) {
      setIsAutoSequenceActive(false);
      setHasCompletedAutoSequence(true); // Mark as completed to prevent it from ever restarting
      console.log('Auto sequence stopped due to user interaction - will never restart');
    }
  };

  useEffect(() => {
    // Only start cascade animation when isReady is true and hasn't initialized yet
    // CRITICAL: Never start if auto-sequence has already been completed
    if (isReady && !hasInitialized && !hasCompletedAutoSequence) {
      console.log('Starting initial auto-sequence - this will only happen once');
      // Pre-calculate positions for desktop only (mobile uses stacking CSS)
      const positions: Record<SectionId, Position> = isMobile ? {} as Record<SectionId, Position> : CASCADE_ORDER.reduce((acc, id) => {
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
          
          // Update position only for desktop (mobile uses CSS positioning)
          if (!isMobile && positions[id]) {
            updatePosition(id, positions[id]);
          }
          
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
              setIsAutoSequenceActive(true); // Start the automatic typing sequence
              setWindowStates(prev => ({
                ...prev,
                [id]: {
                  ...prev[id],
                  transitionState: 'typing'
                }
              }));
            }, isMobile ? 125 : 187); // Shorter delay on mobile for better responsiveness
          }
          
          // Schedule next window
          currentIndex++;
          if (currentIndex < CASCADE_ORDER.length) {
            setTimeout(activateNextWindow, isMobile ? MOBILE_WINDOW_APPEAR_DELAY : WINDOW_APPEAR_DELAY);
          }
        }
      };

      // Start the cascade
      activateNextWindow();
      setHasInitialized(true);
    } else if (isReady && !hasInitialized && hasCompletedAutoSequence) {
      console.log('Auto-sequence already completed - skipping initialization');
      setHasInitialized(true);
    }
  }, [isReady, hasInitialized, hasCompletedAutoSequence, updatePosition, setWindowStates]);

  const handleTypingComplete = (id: SectionId) => {
    // CRITICAL: Only process automatic sequence windows during the initial sequence
    if (!isAutoSequenceActive || !TYPING_SEQUENCE.includes(id) || hasCompletedAutoSequence) {
      console.log(`Ignoring typing completion for ${id}: autoSequenceActive=${isAutoSequenceActive}, inSequence=${TYPING_SEQUENCE.includes(id)}, completed=${hasCompletedAutoSequence}`);
      return; // Ignore typing completion for manually opened windows or when sequence is not active/already completed
    }
    
    // CRITICAL: Prevent processing the same completion multiple times
    if (processedCompletions.has(id)) {
      console.log(`DUPLICATE: Already processed completion for ${id} - ignoring`);
      return;
    }
    
    console.log(`Processing auto-sequence typing completion for: ${id}`);
    
    // Mark as processed immediately
    setProcessedCompletions(prev => new Set(prev).add(id));

    // Mark this window as having completed its auto-sequence typing
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        hasCompletedAutoSequenceTyping: true
      }
    }));

    // Special handling for Contact window - end the automatic sequence FOREVER
    if (id === 'contact') {
      console.log('Auto-sequence completed at contact window - this will never run again');
      setIsAutoSequenceActive(false); // End the automatic typing sequence
      setHasCompletedAutoSequence(true); // Mark as permanently completed
      return;
    }

    // Find the next window in the typing sequence
    const currentIndex = TYPING_SEQUENCE.indexOf(id);
    const nextIndex = currentIndex + 1;
    
    console.log(`Current window: ${id} (index ${currentIndex}), Next index: ${nextIndex}`);
    
    if (nextIndex < TYPING_SEQUENCE.length) {
      const nextId = TYPING_SEQUENCE[nextIndex];
      console.log(`Transitioning from ${id} to ${nextId}`);
      
      // Start minimizing current window
      startWindowTransition(id, 'minimizing');
      
              // Use a timeout to ensure state updates happen in sequence
        setTimeout(() => {
          // CRITICAL: Double-check that auto-sequence is still active before proceeding
          if (!isAutoSequenceActive || hasCompletedAutoSequence) {
            console.log(`ABORT: Auto-sequence transition blocked - active: ${isAutoSequenceActive}, completed: ${hasCompletedAutoSequence}`);
            return;
          }
          
          // Single state update to minimize current and activate next window
          setWindowStates(prevStates => {
            const newStates = { ...prevStates };
            
            // First minimize the current window and mark it as completed
            newStates[id] = {
              ...newStates[id],
              isActive: false,
              isMinimized: true,
              transitionState: 'idle',
              isVisible: true, // Keep the window visible in the background
              hasCompletedAutoSequenceTyping: true // CRITICAL: Mark as completed to prevent reactivation
            };
            
            // Deactivate all other windows to prevent conflicts
            Object.keys(newStates).forEach(windowId => {
              const winId = windowId as SectionId;
              if (winId !== id && winId !== nextId && newStates[winId].isActive) {
                newStates[winId] = {
                  ...newStates[winId],
                  isActive: false
                };
              }
            });
            
            // Then activate the next window ONLY if it hasn't completed auto-sequence
            if (!newStates[nextId]?.hasCompletedAutoSequenceTyping) {
              newStates[nextId] = {
                ...newStates[nextId],
                isVisible: true,
                isActive: true,
                isMinimized: false,
                transitionState: 'typing'
              };
            } else {
              console.log(`SKIP: ${nextId} already completed auto-sequence typing`);
            }
            
            return newStates;
          });
        
        // Add to minimized windows list
        minimizeWindow(id, getLabelForSection(id), id);

        // Update overlay stack to bring next window to front
        setTimeout(() => {
          setOverlayStack(prev => {
            const newStack = prev.filter(windowId => windowId !== nextId);
            return [...newStack, nextId];
          });
        }, 50); // Small delay to ensure state is consistent
        
      }, isMobile ? 150 : 300); // Faster transitions on mobile for better UX
    }
  };

  const handleIconClick = (id: SectionId) => {
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
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
              transitionState: 'typing',
              hasCompletedAutoSequenceTyping: false // Reset to allow typing when manually restored
            }
          }));
        }, isMobile ? 50 : 75);
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
          transitionState: 'opening',
          hasCompletedAutoSequenceTyping: false // Reset to allow typing for manually opened windows
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
      }, isMobile ? 50 : 75);
    }
  };

  const handleMinimize = (id: SectionId) => {
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
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
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
    const windowState = getWindowState(id);
    if (!windowState?.isMaximized) {
      maximizeWindow(id);
    }
  };

  const handleUnmaximize = (id: SectionId) => {
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
    const windowState = getWindowState(id);
    if (windowState?.isMaximized) {
      unmaximizeWindow(id);
    }
  };

  const handleRestore = (id: SectionId) => {
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
    const windowState = getWindowState(id);
    if (windowState?.isMinimized) {
      restoreWindow(id);
          // Start typing when restored
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          transitionState: 'typing',
          hasCompletedAutoSequenceTyping: false // Reset to allow typing when manually restored
        }
      }));
    }, isMobile ? 50 : 75);
    }
  };

  const handleClose = (id: SectionId) => {
    stopAutoSequence(); // Stop automatic sequence on user interaction
    
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
      {/* Mobile Window Tabs - Only show on mobile when windows are open */}
      {isMobile && overlayStack.length > 0 && (
        <div className="mobile-window-tabs">
          {overlayStack.map((id) => {
            const windowState = getWindowState(id);
            const isActive = id === activeOverlay;
            return (
              <div
                key={id}
                className={`mobile-window-tab ${isActive ? 'active' : ''}`}
                onClick={() => bringToFront(id, stopAutoSequence)}
              >
                {getLabelForSection(id)}
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop Icons - Different layout for mobile vs desktop */}
      {isMobile ? (
        // Mobile Icon Grid
        <div className="mobile-icon-grid">
          {CASCADE_ORDER.map((id) => (
            <button
              key={id}
              className="mobile-desktop-icon"
              onClick={() => handleIconClick(id)}
            >
              <div className="icon-container">
                {React.createElement(getIconForSection(id), { className: 'text-white/80' })}
              </div>
              <span className="text-white/80">{getLabelForSection(id)}</span>
            </button>
          ))}
        </div>
      ) : (
        // Desktop Icon Grid
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
      )}

      {/* Windows */}
      {CASCADE_ORDER.map((id) => {
        const isActive = id === activeOverlay;
        const windowState = getWindowState(id);
        const isVisible = windowState?.isVisible ?? false;
        const isMaximized = windowState?.isMaximized ?? false;
        const stackIndex = overlayStack.indexOf(id);

        if (!isOpen(id)) return null;

        // Mobile-specific window props
        const mobileProps = isMobile ? {
          className: `mobile-window-stack ${isActive ? 'active' : ''}`,
          'data-stack': stackIndex.toString(),
        } : {};

        const commonProps = {
          key: id,
          id,
          stackIndex,
          isActive,
          forceVisible: isVisible,
          initialPosition: isMobile ? { x: 10, y: 20 } : getInitialPosition(id),
          initialSize: isMobile ? { width: window.innerWidth - 20, height: window.innerHeight - 120 } : getInitialSize(id),
          isMaximized,
          onMinimize: () => handleMinimize(id),
          onMaximize: () => handleMaximize(id),
          onUnmaximize: () => handleUnmaximize(id),
          onTypingComplete: () => handleTypingComplete(id),
          stopAutoSequence,
          isMobile,
          ...mobileProps
        };

        switch (id) {
          case 'ai-instructor':
            return React.createElement(Hero, commonProps);
          case 'problem':
            return React.createElement(Problem, { ...commonProps, showContent: isActive });
          case 'first':
            return React.createElement(Category, { ...commonProps, showContent: isActive });
          case 'experience':
            return React.createElement(Experience, { ...commonProps, showContent: isActive });
          case 'packages':
            return React.createElement(Packages, { ...commonProps, showContent: isActive });
          case 'contact':
            return React.createElement(Contact, { ...commonProps, showContent: isActive });
          case 'imprint':
            return React.createElement(Imprint, { ...commonProps, showContent: isActive });
          default:
            return null;
        }
      })}


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