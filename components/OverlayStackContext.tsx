import React, { createContext, useContext, useState, useCallback } from 'react';

export type SectionId = 'hero' | 'problem' | 'category' | 'experience' | 'packages' | 'contact' | 'imprint' | 'footer';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  id: SectionId;
  position: Position;
  isOpen: boolean;
}

interface OverlayStackContextType {
  overlayStack: SectionId[];
  openOverlay: (id: SectionId) => void;
  closeOverlay: (id: SectionId) => void;
  bringToFront: (id: SectionId) => void;
  updatePosition: (id: SectionId, position: Position) => void;
  getPosition: (id: SectionId) => Position | undefined;
}

const OverlayStackContext = createContext<OverlayStackContextType | undefined>(undefined);

export const OverlayStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overlayStack, setOverlayStack] = useState<SectionId[]>([]);
  const [windowStates, setWindowStates] = useState<Map<SectionId, WindowState>>(new Map());

  const openOverlay = useCallback((id: SectionId) => {
    setOverlayStack(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    setWindowStates(prev => {
      const newMap = new Map(prev);
      const existingState = newMap.get(id);
      newMap.set(id, {
        id,
        position: existingState?.position || { x: 32, y: 32 },
        isOpen: true
      });
      return newMap;
    });
  }, []);

  const closeOverlay = useCallback((id: SectionId) => {
    setOverlayStack(prev => prev.filter(item => item !== id));
    setWindowStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(id);
      if (state) {
        newMap.set(id, { ...state, isOpen: false });
      }
      return newMap;
    });
  }, []);

  const bringToFront = useCallback((id: SectionId) => {
    setOverlayStack(prev => {
      const filtered = prev.filter(item => item !== id);
      return [...filtered, id];
    });
  }, []);

  const updatePosition = useCallback((id: SectionId, position: Position) => {
    setWindowStates(prev => {
      const newMap = new Map(prev);
      const state = newMap.get(id);
      if (state) {
        newMap.set(id, { ...state, position });
      } else {
        newMap.set(id, { id, position, isOpen: true });
      }
      return newMap;
    });
  }, []);

  const getPosition = useCallback((id: SectionId) => {
    return windowStates.get(id)?.position;
  }, [windowStates]);

  return (
    <OverlayStackContext.Provider value={{
      overlayStack,
      openOverlay,
      closeOverlay,
      bringToFront,
      updatePosition,
      getPosition,
    }}>
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