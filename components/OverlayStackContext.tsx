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
}

export interface OverlayStackContextType {
  overlayStack: SectionId[];
  openOverlay: (id: SectionId) => void;
  closeOverlay: (id: SectionId) => void;
  bringToFront: (id: SectionId) => void;
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
      'ai-instructor': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'ai-instructor' },
      'problem': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'problem' },
      'first': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'first' },
      'experience': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'experience' },
      'packages': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'packages' },
      'contact': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'contact' },
      'imprint': { isMinimized: false, isMaximized: false, isVisible: false, isActive: false, transitionState: 'idle', label: '', icon: 'imprint' }
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
      startWindowTransition(id, 'opening');
      
      // Add to overlay stack
      setOverlayStack(prev => [...prev, id]);
      
      // Initialize window state if needed
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          label: '',
          icon: id
        }
      }));
    }
  }, [overlayStack, deactivateAllWindows, startWindowTransition]);

  const closeOverlay = useCallback((id: SectionId) => {
    // Start closing transition
    startWindowTransition(id, 'closing');
    
    // Remove from minimized windows if needed
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    
    // Remove from maximized window if needed
    if (maximizedWindow === id) {
      setMaximizedWindow(null);
    }
    
    // Remove from overlay stack
    setOverlayStack(prev => prev.filter(windowId => windowId !== id));
    
    // Complete the transition
    completeWindowTransition(id);
  }, [startWindowTransition, completeWindowTransition, maximizedWindow]);

  const bringToFront = useCallback((id: SectionId) => {
    // Deactivate all windows first
    deactivateAllWindows();
    
    // Start activation transition
    startWindowTransition(id, 'activating');
    
    // Reorder overlay stack
    setOverlayStack(prev => {
      const newStack = prev.filter(windowId => windowId !== id);
      return [...newStack, id];
    });
    
    // Complete the transition
    completeWindowTransition(id);
  }, [deactivateAllWindows, startWindowTransition, completeWindowTransition]);

  const updatePosition = (id: SectionId, position: Position) => {
    setPositions(prev => ({ ...prev, [id]: position }));
  };

  const getPosition = (id: SectionId) => positions[id];

  const isOpen = (id: SectionId) => overlayStack.includes(id);

  const minimizeWindow = useCallback((id: SectionId, label: string, icon: string) => {
    if (!minimizedWindows.some(w => w.id === id)) {
      // Start minimizing transition
      startWindowTransition(id, 'minimizing');
      
      // Add to minimized windows
      setMinimizedWindows(prev => [...prev, { id, label, icon }]);
      
      // Remove from overlay stack
      setOverlayStack(prev => prev.filter(windowId => windowId !== id));
      
      // Complete the transition
      completeWindowTransition(id);
    }
  }, [minimizedWindows, startWindowTransition, completeWindowTransition]);

  const maximizeWindow = useCallback((id: SectionId) => {
    // Start maximizing transition
    startWindowTransition(id, 'maximizing');
    
    // Set as maximized window
    setMaximizedWindow(id);
    
    // Bring to front
    bringToFront(id);
    
    // Complete the transition
    completeWindowTransition(id);
  }, [startWindowTransition, bringToFront, completeWindowTransition]);

  const unmaximizeWindow = useCallback((id: SectionId) => {
    // Start restoring transition (unmaximize is essentially restoring)
    startWindowTransition(id, 'restoring');
    
    // Clear maximized window state
    setMaximizedWindow(null);
    
    // Complete the transition
    completeWindowTransition(id);
  }, [startWindowTransition, completeWindowTransition]);

  const restoreWindow = useCallback((id: SectionId) => {
    // Start restoring transition
    startWindowTransition(id, 'restoring');
    
    // Remove from minimized windows
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    
    // Bring to front
    bringToFront(id);
    
    // Complete the transition
    completeWindowTransition(id);
  }, [startWindowTransition, bringToFront, completeWindowTransition]);

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