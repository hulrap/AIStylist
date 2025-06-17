import React from 'react';
import { SectionId } from './OverlayStackContext';

interface MinimizedWindow {
  id: SectionId;
  label: string;
  icon: string;
}

interface TaskBarProps {
  minimizedWindows: MinimizedWindow[];
  onRestore: (id: SectionId) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ minimizedWindows, onRestore }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/30 backdrop-blur-md border-t border-white/20">
      <div className="flex items-center h-full px-4 gap-2">
        {minimizedWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onRestore(window.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">{window.icon}</span>
            <span className="text-sm text-white/80">{window.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 