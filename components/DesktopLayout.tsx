import React, { useEffect, useState } from 'react';
import { useOverlayStack, SectionId } from './OverlayStackContext';
import { Problem } from './Problem';
import { Category } from './Category';
import { Experience } from './Experience';
import { Packages } from './Packages';
import { Contact } from './Contact';
import { Imprint } from './Imprint';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { DesktopIcon } from './DesktopIcon';
import { TaskBar } from './TaskBar';
import { HiOutlineSparkles, HiOutlineExclamation, HiOutlineUserGroup, 
         HiOutlineLightBulb, HiOutlineShoppingBag, HiOutlineMail, 
         HiOutlineInformationCircle, HiOutlineHeart } from 'react-icons/hi';
import { IconType } from 'react-icons';

// Desktop icons configuration
const desktopIcons = [
  { id: 'hero' as SectionId, icon: HiOutlineSparkles, label: 'AI Stylist', position: { x: 40, y: 40 } },
  { id: 'problem' as SectionId, icon: HiOutlineExclamation, label: 'The Problem', position: { x: 40, y: 120 } },
  { id: 'category' as SectionId, icon: HiOutlineUserGroup, label: 'The First', position: { x: 40, y: 200 } },
  { id: 'experience' as SectionId, icon: HiOutlineLightBulb, label: 'The Experience', position: { x: 40, y: 280 } },
  { id: 'packages' as SectionId, icon: HiOutlineShoppingBag, label: 'Three Ways', position: { x: 40, y: 360 } },
  { id: 'contact' as SectionId, icon: HiOutlineMail, label: 'Start Now', position: { x: 40, y: 440 } },
  { id: 'imprint' as SectionId, icon: HiOutlineInformationCircle, label: 'Imprint', position: { x: 40, y: 520 } },
  { id: 'footer' as SectionId, icon: HiOutlineHeart, label: 'Credits', position: { x: 40, y: 600 } },
];

// Order of sections for initial cascade
const initialSections: SectionId[] = [
  'hero',
  'problem',
  'category',
  'experience',
  'packages',
  'contact',
  'imprint',
  'footer'
];

interface MinimizedWindow {
  id: SectionId;
  label: string;
  icon: IconType;
}

const overlayComponentsMap = {
  problem: Problem,
  category: Category,
  experience: Experience,
  packages: Packages,
  contact: Contact,
  imprint: Imprint,
  footer: Footer,
  hero: Hero,
};

export const DesktopLayout: React.FC = () => {
  const { overlayStack, openOverlay, bringToFront } = useOverlayStack();
  const [isInitializing, setIsInitializing] = useState(true);
  const [minimizedWindows, setMinimizedWindows] = useState<MinimizedWindow[]>([]);
  const [maximizedWindow, setMaximizedWindow] = useState<SectionId | null>(null);
  const [visibleWindows, setVisibleWindows] = useState<Set<SectionId>>(new Set());

  // Handle initial cascade animation
  useEffect(() => {
    if (!isInitializing) return;

    let timeoutId: NodeJS.Timeout;
    initialSections.forEach((section, index) => {
      timeoutId = setTimeout(() => {        openOverlay(section);
        setVisibleWindows(prev => new Set([...prev, section]));
        if (index === initialSections.length - 1) {
          setTimeout(() => setIsInitializing(false), 500);
        }
      }, index * 150);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitializing, openOverlay]);

  const handleIconClick = (id: SectionId) => {
    if (minimizedWindows.find(w => w.id === id)) {
      handleRestore(id);
    } else if (!overlayStack.includes(id)) {
      openOverlay(id);
      setVisibleWindows(prev => new Set([...prev, id]));
    } else {
      bringToFront(id);
    }
  };

  const handleMinimize = (id: SectionId) => {
    const icon = desktopIcons.find(di => di.id === id);
    if (icon) {
      setMinimizedWindows(prev => [...prev, { id, label: icon.label, icon: icon.icon }]);
    }
  };

  const handleMaximize = (id: SectionId) => {
    setMaximizedWindow(id);
  };

  const handleRestore = (id: SectionId) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== id));
    bringToFront(id);
  };

  const handleUnmaximize = () => {
    setMaximizedWindow(null);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#181926]">
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            Icon={icon.icon}
            label={icon.label}
            position={icon.position}
            onClick={() => handleIconClick(icon.id)}
          />
        ))}
      </div>

      {/* Windows */}
      <div className="relative w-full h-[calc(100%-48px)]">
        {overlayStack.map((id, i) => {
          const Component = overlayComponentsMap[id];
          if (!Component) return null;

          // Calculate cascade offset
          const baseOffset = 32;
          const stackOffset = i * 24;

          return (
            <Component
              key={id}
              stackIndex={i}
              isActive={!isInitializing && i === overlayStack.length - 1}
              forceVisible={visibleWindows.has(id)}
              initialPosition={{ 
                x: baseOffset + stackOffset,
                y: baseOffset + stackOffset
              }}
              isMaximized={maximizedWindow === id}
              onMinimize={() => handleMinimize(id)}
              onMaximize={() => handleMaximize(id)}
              onUnmaximize={handleUnmaximize}
            />
          );
        })}
      </div>

      {/* Taskbar */}
      <TaskBar minimizedWindows={minimizedWindows} onRestore={handleRestore} />
    </div>
  );
}; 