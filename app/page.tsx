'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Problem } from '@/components/Problem';
import { Category } from '@/components/Category';
import { Experience } from '@/components/Experience';
import { Packages } from '@/components/Packages';
import { Contact } from '@/components/Contact';
import { Imprint } from '@/components/Imprint';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { OverlayStackProvider, useOverlayStack, SectionId } from '@/components/OverlayStackContext';

// Order of sections for initial cascade
const initialSections: SectionId[] = [
  'problem',
  'category',
  'experience',
  'packages',
  'contact',
  'imprint',
  'footer',
  'hero'
];

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

function OverlayStackRenderer() {
  const { overlayStack, openOverlay } = useOverlayStack();
  const [isInitializing, setIsInitializing] = useState(true);

  // Handle initial cascade animation
  useEffect(() => {
    if (!isInitializing) return;

    let timeoutId: NodeJS.Timeout;
    initialSections.forEach((section, index) => {
      timeoutId = setTimeout(() => {
        openOverlay(section);
        if (index === initialSections.length - 1) {
          setIsInitializing(false);
        }
      }, index * 100);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInitializing, openOverlay]);

  return (
    <div className="fixed inset-0 pt-16 pb-4 px-4 overflow-hidden">
      <div className="relative w-full h-full max-w-screen-xl mx-auto">
        {overlayStack.map((id, i) => {
          const Component = overlayComponentsMap[id];
          if (!Component) return null;
          
          // Calculate position for cascading effect
          const baseOffset = 32;
          const stackOffset = Math.min(i * 16, 120); // Cap the maximum offset

          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: `${baseOffset + stackOffset}px`,
                top: `${baseOffset}px`,
                width: '420px',
                height: '540px',
                maxWidth: 'calc(100vw - 64px)',
                maxHeight: 'calc(100vh - 96px)',
                zIndex: 10 + i,
                pointerEvents: i === overlayStack.length - 1 ? 'auto' : 'none',
                transition: 'all 0.3s ease-out',
                opacity: isInitializing ? 0.85 : (i === overlayStack.length - 1 ? 1 : 0.85),
                transform: `scale(${isInitializing ? 0.95 : 1})`,
              }}
            >
              <Component
                stackIndex={i}
                isActive={!isInitializing && i === overlayStack.length - 1}
                forceVisible={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <OverlayStackProvider>
      <main className="min-h-screen bg-[#181926] text-[#f8f8f8] overflow-hidden">
        <Header />
        <OverlayStackRenderer />
      </main>
    </OverlayStackProvider>
  );
} 