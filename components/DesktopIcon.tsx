import React from 'react';
import { SectionId } from './OverlayStackContext';
import { getIconForSection } from './Icons';

interface DesktopIconProps {
  id: SectionId;
  icon: React.FC<{ className?: string }> | string;
  label: string;
  onClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  icon,
  label,
  onClick,
}) => {
  const Icon = typeof icon === 'string' ? getIconForSection(icon) : icon;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-white/80" />
      </div>
      <span className="text-sm text-white/80 text-center max-w-[96px] line-clamp-2">{label}</span>
    </button>
  );
}; 