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

export interface OverlayStackContextType {
  overlayStack: SectionId[];
  openOverlay: (id: SectionId) => void;
  closeOverlay: (id: SectionId) => void;
  bringToFront: (id: SectionId) => void;
  updatePosition: (id: SectionId, position: Position) => void;
  getPosition: (id: SectionId) => Position | undefined;
  isOpen: (id: SectionId) => boolean;
  activeOverlay: SectionId | null;
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

  const openOverlay = (id: SectionId) => {
    if (!overlayStack.includes(id)) {
      setOverlayStack(prev => [...prev, id]);
    }
  };

  const closeOverlay = (id: SectionId) => {
    setOverlayStack(prev => prev.filter(windowId => windowId !== id));
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

  const value: OverlayStackContextType = {
    overlayStack,
    openOverlay,
    closeOverlay,
    bringToFront,
    updatePosition,
    getPosition,
    isOpen,
    activeOverlay: overlayStack[overlayStack.length - 1] || null
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