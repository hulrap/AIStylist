import React, { createContext, useContext, useState } from 'react';

export type SectionId = 
  | 'ai-stylist'
  | 'problem'
  | 'first'
  | 'experience'
  | 'packages'
  | 'contact'
  | 'imprint'
  | 'credits';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  label: string;
  icon: string;
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
}

const OverlayStackContext = createContext<OverlayStackContextType | undefined>(undefined);

const initialPositions: Record<SectionId, Position> = {
  'ai-stylist': { x: 0, y: 0 },
  'problem': { x: 0, y: 0 },
  'first': { x: 0, y: 0 },
  'experience': { x: 0, y: 0 },
  'packages': { x: 0, y: 0 },
  'contact': { x: 0, y: 0 },
  'imprint': { x: 0, y: 0 },
  'credits': { x: 0, y: 0 }
};

export const OverlayStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlayStack, setOverlayStack] = useState<SectionId[]>([]);
  const [positions, setPositions] = useState<Record<SectionId, Position>>(initialPositions);
  const [windowStates, setWindowStates] = useState<Record<SectionId, WindowState>>(() => {
    const initial: Record<SectionId, WindowState> = {
      'ai-stylist': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'problem': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'first': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'experience': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'packages': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'contact': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'imprint': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' },
      'credits': { isMinimized: false, isMaximized: false, isVisible: false, label: '', icon: '' }
    };
    return initial;
  });
  const [minimizedWindows, setMinimizedWindows] = useState<{ id: SectionId; label: string; icon: string }[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<SectionId | null>(null);

  const openOverlay = (id: SectionId) => {
    if (!overlayStack.includes(id)) {
      setOverlayStack(prev => [...prev, id]);
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          isMinimized: false,
          isMaximized: false,
          isVisible: true,
          label: '',
          icon: ''
        }
      }));
    }
  };

  const closeOverlay = (id: SectionId) => {
    setOverlayStack(prev => prev.filter(windowId => windowId !== id));
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    if (maximizedWindow === id) {
      setMaximizedWindow(null);
    }
    setWindowStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const bringToFront = (id: SectionId) => {
    setOverlayStack(prev => {
      const newStack = prev.filter(windowId => windowId !== id);
      return [...newStack, id];
    });
  };

  const updatePosition = (id: SectionId, position: Position) => {
    setPositions(prev => ({ ...prev, [id]: position }));
  };

  const getPosition = (id: SectionId) => positions[id];

  const isOpen = (id: SectionId) => overlayStack.includes(id);

  const minimizeWindow = (id: SectionId, label: string, icon: string) => {
    if (!minimizedWindows.some(w => w.id === id)) {
      setMinimizedWindows(prev => [...prev, { id, label, icon }]);
      setWindowStates(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
          isVisible: false,
          label,
          icon
        }
      }));
    }
  };

  const maximizeWindow = (id: SectionId) => {
    setMaximizedWindow(id);
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: true
      }
    }));
    bringToFront(id);
  };

  const unmaximizeWindow = (id: SectionId) => {
    setMaximizedWindow(null);
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: false
      }
    }));
  };

  const restoreWindow = (id: SectionId) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    setWindowStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        isVisible: true
      }
    }));
    bringToFront(id);
  };

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
    maximizedWindow
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