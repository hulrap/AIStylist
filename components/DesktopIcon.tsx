import React from 'react';
import { IconType } from 'react-icons';
import { useOverlayStack, SectionId } from './OverlayStackContext';

interface DesktopIconProps {
  id: SectionId;
  Icon: IconType;
  label: string;
  position: { x: number; y: number };
  onClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, Icon, label, position, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center group"
      style={{
        left: position.x,
        top: position.y,
        width: '80px',
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
        <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-200" />
      </div>
      <span className="mt-2 text-xs text-white/80 group-hover:text-white text-center font-medium transition-colors duration-200">
        {label}
      </span>
    </button>
  );
}; 