import React, { createContext, useContext, useState, useCallback } from 'react';

export type SectionId = 'hero' | 'problem' | 'category' | 'experience' | 'packages' | 'contact' | 'imprint' | 'footer';

interface Position {
  x: number;
  y: number;
}

interface OverlayStackContextType {
  overlayStack: SectionId[];
  positions: Record<SectionId, Position>;
  isOverlayOpen: (id: SectionId) => boolean;
  isOverlayTop: (id: SectionId) => boolean;
  openOverlay: (id: SectionId) => void;
  closeOverlay: (id: SectionId) => void;
  bringToFront: (id: SectionId) => void;
  updatePosition: (id: SectionId, position: Position) => void;
}

const OverlayStackContext = createContext<OverlayStackContextType | undefined>(undefined);

export const useOverlayStack = () => {
  const context = useContext(OverlayStackContext);
  if (!context) {
    throw new Error('useOverlayStack must be used within an OverlayStackProvider');
  }
  return context;
};

export const OverlayStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlayStack, setOverlayStack] = useState<SectionId[]>(['hero']);
  const [positions, setPositions] = useState<Record<SectionId, Position>>({
    hero: { x: 32, y: 32 },
    problem: { x: 32, y: 32 },
    category: { x: 32, y: 32 },
    experience: { x: 32, y: 32 },
    packages: { x: 32, y: 32 },
    contact: { x: 32, y: 32 },
    imprint: { x: 32, y: 32 },
    footer: { x: 32, y: 32 },
  });

  const isOverlayOpen = useCallback((id: SectionId) => {
    return overlayStack.includes(id);
  }, [overlayStack]);

  const isOverlayTop = useCallback((id: SectionId) => {
    return overlayStack[overlayStack.length - 1] === id;
  }, [overlayStack]);

  const openOverlay = useCallback((id: SectionId) => {
    setOverlayStack(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const closeOverlay = useCallback((id: SectionId) => {
    setOverlayStack(prev => prev.filter(overlayId => overlayId !== id));
  }, []);

  const bringToFront = useCallback((id: SectionId) => {
    setOverlayStack(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return [...prev.filter(overlayId => overlayId !== id), id];
    });
  }, []);

  const updatePosition = useCallback((id: SectionId, position: Position) => {
    setPositions(prev => ({
      ...prev,
      [id]: position
    }));
  }, []);

  return (
    <OverlayStackContext.Provider
      value={{
        overlayStack,
        positions,
        isOverlayOpen,
        isOverlayTop,
        openOverlay,
        closeOverlay,
        bringToFront,
        updatePosition,
      }}
    >
      {children}
    </OverlayStackContext.Provider>
  );
}; 