import React from 'react';
import { SectionId } from './OverlayStackContext';
import { IconType } from 'react-icons';

interface MinimizedWindow {
  id: SectionId;
  label: string;
  icon: IconType;
}

interface TaskBarProps {
  minimizedWindows: MinimizedWindow[];
  onRestore: (id: SectionId) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({ minimizedWindows, onRestore }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#1a1a1a]/90 backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center h-full px-4 gap-2">
        {minimizedWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onRestore(window.id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            <window.icon className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80">{window.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 