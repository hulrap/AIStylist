import React from 'react';
import { SectionId } from './OverlayStackContext';
import { getIconForSection } from './Icons';

interface TaskBarProps {
  minimizedWindows: { id: SectionId; label: string; icon: string }[];
  onRestore: (id: SectionId) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ minimizedWindows, onRestore }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/20 backdrop-blur-lg border-t border-white/20 flex items-center px-4 gap-2">
      {minimizedWindows.map((window) => {
        const Icon = getIconForSection(window.icon);
        return (
          <button
            key={window.id}
            onClick={() => onRestore(window.id)}
            className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 text-sm text-white/80"
          >
            <Icon className="w-4 h-4" />
            <span>{window.label}</span>
          </button>
        );
      })}
    </div>
  );
}; 