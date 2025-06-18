import React from 'react';
import { SectionId, useOverlayStack } from './OverlayStackContext';
import { getIconForSection } from './Icons';

interface TaskBarProps {
  minimizedWindows: { id: SectionId; label: string; icon: string }[];
  onRestore: (id: SectionId) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ minimizedWindows, onRestore }) => {
  const { overlayStack, getWindowState } = useOverlayStack();

  // Get all visible windows (both minimized and normal)
  const allWindows = overlayStack.map(id => {
    const state = getWindowState(id);
    return {
      id,
      label: state?.label || '',
      icon: state?.icon || id,
      isMinimized: state?.isMinimized || false,
      isActive: state?.isActive || false
    };
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-lg border-t border-white/20 flex items-center px-4 gap-2">
      {allWindows.map((window) => {
        const Icon = getIconForSection(window.icon);
        return (
          <button
            key={window.id}
            onClick={() => window.isMinimized ? onRestore(window.id) : null}
            className={`h-8 px-3 rounded-lg transition-colors flex items-center gap-2 text-sm ${
              window.isActive 
                ? 'bg-white/30 text-white' 
                : window.isMinimized
                ? 'bg-white/10 hover:bg-white/20 text-white/80'
                : 'bg-white/20 hover:bg-white/25 text-white/90'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{window.label || window.id}</span>
          </button>
        );
      })}
    </div>
  );
}; 