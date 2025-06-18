import React, { createContext, useContext, useState, useCallback } from 'react';

export type SectionId = 
  | 'ai-instructor'
  | 'problem'
  | 'first'
  | 'experience'
  | 'packages'
  | 'contact'
  | 'imprint';

export type WindowTransitionState = 
  | 'idle' 
  | 'typing'
  | 'minimizing'
  | 'maximizing'
  | 'restoring'
  | 'closing'
  | 'opening'
  | 'activating';

interface Position {
  x: number;
  y: number;
}

export interface WindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  isActive: boolean;
  transitionState: WindowTransitionState;
  label: string;
  icon: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  hasCompletedAutoSequenceTyping?: boolean;
}

export interface OverlayStackContextType {
  overlayStack: SectionId[];
  openOverlay: (id: SectionId) => void;
  closeOverlay: (id: SectionId) => void;
  bringToFront: (id: SectionId, stopAutoSequence?: () => void) => void;
  updatePosition: (id: SectionId, position: Position) => void;
  getPosition: (id: SectionId) => Position | undefined;
  isOpen: (id: SectionId) => boolean;
  activeOverlay: SectionId | null;
  minimizeWindow: (id: SectionId, label: string, icon: string) => void;
  maximizeWindow: (id: SectionId) => void;
  unmaximizeWindow: (id: SectionId) => void;
  restoreWindow: (id: SectionId) => void;
  getWindowState: (id: SectionId) => WindowState | undefined;
  minimizedWindows: { id: SectionId; label: string; icon: string }[];
  maximizedWindow: SectionId | null;
  setOverlayStack: (updater: (prev: SectionId[]) => SectionId[]) => void;
  setWindowStates: (updater: (prev: Record<SectionId, WindowState>) => Record<SectionId, WindowState>) => void;
  startWindowTransition: (id: SectionId, transition: WindowTransitionState) => void;
  completeWindowTransition: (id: SectionId) => void;
  deactivateAllWindows: () => void;
}

const OverlayStackContext = createContext<OverlayStackContextType | undefined>(undefined);

const initialPositions: Record<SectionId, Position> = {
  'ai-instructor': { x: 0, y: 0 },
  'problem': { x: 0, y: 0 },
  'first': { x: 0, y: 0 },
  'experience': { x: 0, y: 0 },
  'packages': { x: 0, y: 0 },
  'contact': { x: 0, y: 0 },
  'imprint': { x: 0, y: 0 }
};

export const OverlayStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlayStack, setOverlayStack] = useState<SectionId[]>([]);
  const [positions, setPositions] = useState<Record<SectionId, Position>>(initialPositions);
  const [windowStates, setWindowStates] = useState<Record<SectionId, WindowState>>(() => {
    const initial: Record<SectionId, WindowState> = {
      'ai-instructor': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'ai-instructor', hasCompletedAutoSequenceTyping: false },
      'problem': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'problem', hasCompletedAutoSequenceTyping: false },
      'first': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'first', hasCompletedAutoSequenceTyping: false },
      'experience': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'experience', hasCompletedAutoSequenceTyping: false },
      'packages': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'packages', hasCompletedAutoSequenceTyping: false },
      'contact': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'contact', hasCompletedAutoSequenceTyping: false },
      'imprint': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'imprint', hasCompletedAutoSequenceTyping: false }
    };
    return initial;
  });
  const [minimizedWindows, setMinimizedWindows] = useState<{ id: SectionId; label: string; icon: string }[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<SectionId | null>(null);

  const startWindowTransition = useCallback((id: SectionId, transition: WindowTransitionState) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        transitionState: transition
      }
    }));
  }, []);

  const completeWindowTransition = useCallback((id: SectionId) => {
    setWindowStates(prev => {
      const window = prev[id];
      if (!window) return prev;

      const newState = { ...window };

      // Apply final state based on transition
      switch (window.transitionState) {
        case 'minimizing':
          newState.isMinimized = true;
          newState.isVisible = false;
          newState.isActive = false;
          break;
        case 'maximizing':
          newState.isMaximized = true;
          newState.isActive = true;
          newState.isVisible = true;
          break;
        case 'restoring':
          newState.isMinimized = false;
          newState.isMaximized = false;
          newState.isVisible = true;
          newState.isActive = true;
          break;
        case 'closing':
          newState.isVisible = false;
          newState.isActive = false;
          newState.isMinimized = false;
          newState.isMaximized = false;
          break;
        case 'opening':
          newState.isVisible = true;
          newState.isActive = true;
          newState.isMinimized = false;
          newState.transitionState = 'typing'; // Transition to typing state
          return prev; // Don't complete transition yet
        case 'activating':
          newState.isActive = true;
          newState.isVisible = true;
          break;
      }

      newState.transitionState = 'idle';
      return {
        ...prev,
        [id]: newState
      };
    });
  }, []);

  const deactivateAllWindows = useCallback(() => {
    setWindowStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(windowId => {
        if (newStates[windowId as SectionId].isActive) {
          newStates[windowId as SectionId] = {
            ...newStates[windowId as SectionId],
            isActive: false
          };
        }
      });
      return newStates;
    });
  }, []);

  const openOverlay = useCallback((id: SectionId) => {
    if (!overlayStack.includes(id)) {
      // Deactivate all other windows first
      deactivateAllWindows();
      
      // Start opening transition
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          transitionState: 'opening',
          isVisible: true,
          isActive: true,
          label: '',
          icon: id
        }
      }));
      
      // Add to overlay stack
      setOverlayStack(prev => [...prev, id]);
      
      // Transition to typing state after a short delay
      setTimeout(() => {
        setWindowStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            transitionState: 'typing'
          }
        }));
      }, 75);
    }
  }, [overlayStack, deactivateAllWindows]);

  const closeOverlay = useCallback((id: SectionId) => {
    // Start closing transition
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        transitionState: 'closing',
        isActive: false,
        isVisible: false
      }
    }));
    
    // Remove from minimized windows if needed
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    
    // Remove from maximized window if needed
    if (maximizedWindow === id) {
      setMaximizedWindow(null);
    }
    
    // Remove from stack immediately
    setOverlayStack(prev => prev.filter(windowId => windowId !== id));
    
    // Reset window state after a short delay
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isVisible: false,
          isActive: false,
          isMinimized: false,
          isMaximized: false,
          transitionState: 'idle'
        }
      }));
    }, 75);
  }, [maximizedWindow]);

  const bringToFront = useCallback((id: SectionId, stopAutoSequence?: () => void) => {
    // Stop automatic sequence if user is interacting
    if (stopAutoSequence) {
      stopAutoSequence();
    }
    
    // Deactivate all windows first
    deactivateAllWindows();
    
    // Start activation transition
    startWindowTransition(id, 'activating');
    
    // Reorder overlay stack
    setOverlayStack(prev => {
      const newStack = prev.filter(windowId => windowId !== id);
      return [...newStack, id];
    });
    
    // Update window state - only set to typing if not already completed auto-sequence typing
    setWindowStates(prev => {
      const currentWindow = prev[id];
      const shouldStartTyping = !currentWindow?.hasCompletedAutoSequenceTyping;
      
      console.log(`bringToFront: ${id}, shouldStartTyping: ${shouldStartTyping}, hasCompleted: ${currentWindow?.hasCompletedAutoSequenceTyping}`);
      
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isVisible: true,
          isActive: true,
          transitionState: shouldStartTyping ? 'typing' : 'idle'
        }
      };
    });
  }, [deactivateAllWindows, startWindowTransition]);

  const updatePosition = (id: SectionId, position: Position) => {
    setPositions(prev => ({ ...prev, [id]: position }));
  };

  const getPosition = (id: SectionId) => positions[id];

  const isOpen = (id: SectionId) => overlayStack.includes(id);

  const minimizeWindow = useCallback((id: SectionId, label: string, icon: string) => {
    if (!minimizedWindows.some(w => w.id === id)) {
      // Add to minimized windows immediately
      setMinimizedWindows(prev => [...prev, { id, label, icon }]);
      
      // Update window state to minimized
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
          isActive: false,
          isVisible: false, // Hide visually but keep in stack
          transitionState: 'idle'
        }
      }));
    }
  }, [minimizedWindows]);

  const maximizeWindow = useCallback((id: SectionId) => {
    // Start maximizing transition
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        transitionState: 'maximizing',
        isActive: true,
        isVisible: true
      }
    }));
    
    // Set as maximized window
    setMaximizedWindow(id);
    
    // Bring to front
    setOverlayStack(prev => {
      const newStack = prev.filter(windowId => windowId !== id);
      return [...newStack, id];
    });
    
    // Complete the transition after animation
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMaximized: true,
          transitionState: 'idle'
        }
      }));
    }, 225);
  }, []);

  const unmaximizeWindow = useCallback((id: SectionId) => {
    // Start restoring transition
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        transitionState: 'restoring',
        isActive: true,
        isVisible: true
      }
    }));
    
    // Clear maximized window state
    setMaximizedWindow(null);
    
    // Complete the transition after animation
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMaximized: false,
          transitionState: 'idle'
        }
      }));
    }, 225);
  }, []);

  const restoreWindow = useCallback((id: SectionId) => {
    // Start restoring transition
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        transitionState: 'restoring',
        isActive: true,
        isVisible: true
      }
    }));
    
    // Remove from minimized windows
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    
    // Bring to front
    setOverlayStack(prev => {
      const newStack = prev.filter(windowId => windowId !== id);
      return [...newStack, id];
    });
    
    // Transition to typing state after restore animation
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: false,
          transitionState: 'typing',
          hasCompletedAutoSequenceTyping: false // Reset to allow typing when restored
        }
      }));
    }, 225);
  }, []);

  const getWindowState = (id: SectionId) => windowStates[id];

  const value: OverlayStackContextType = {
    overlayStack,
    openOverlay,
    closeOverlay,
    bringToFront,
    updatePosition,
    getPosition,
    isOpen,
    activeOverlay: overlayStack[overlayStack.length - 1] || null,
    minimizeWindow,
    maximizeWindow,
    unmaximizeWindow,
    restoreWindow,
    getWindowState,
    minimizedWindows,
    maximizedWindow,
    setOverlayStack,
    setWindowStates,
    startWindowTransition,
    completeWindowTransition,
    deactivateAllWindows
  };

  return (
    <OverlayStackContext.Provider value={value}>
      {children}
    </OverlayStackContext.Provider>
  );
};

export const useOverlayStack = () => {
  const context = useContext(OverlayStackContext);
  if (!context) {
    throw new Error('useOverlayStack must be used within an OverlayStackProvider');
  }
  return context;
}; 