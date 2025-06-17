import React from 'react';
import { SectionId } from './OverlayStackContext';

interface DesktopIconProps {
  id: SectionId;
  icon: string;
  label: string;
  onClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div className="w-12 h-12 flex items-center justify-center text-2xl bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <span className="text-sm text-white/80 group-hover:text-white/90 transition-colors">
        {label}
      </span>
    </button>
  );
}; 