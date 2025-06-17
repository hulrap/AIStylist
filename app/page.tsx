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
import { OverlayStackProvider } from '@/components/OverlayStackContext';

const overlayComponents = [
  Problem,
  Category,
  Experience,
  Packages,
  Contact,
  Imprint,
  Footer,
  Hero, // Hero is last/topmost
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    if (activeIndex < overlayComponents.length - 1) {
      const timeout = setTimeout(() => setActiveIndex(activeIndex + 1), 220);
      return () => clearTimeout(timeout);
    }
  }, [activeIndex]);

  const handleUserInteraction = () => {
    if (!userHasInteracted) setUserHasInteracted(true);
  };

  return (
    <OverlayStackProvider>
      <main className="min-h-screen bg-[#181926] text-[#f8f8f8]">
        <Header />
        <div className="relative w-full min-h-screen">
          {overlayComponents.map((Component, i) =>
            i <= activeIndex ? (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${32 + i * 16}px`,
                  top: `${32 + i * 16}px`,
                  zIndex: 10 + i,
                  width: 'calc(100% - 64px)',
                  maxWidth: 900,
                  margin: '0 auto',
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                  transition: 'box-shadow 0.3s',
                  boxShadow: i === activeIndex ? '0 8px 32px 0 rgba(0,0,0,0.25)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
                }}
              >
                <Component
                  stackIndex={i}
                  isActive={i === activeIndex}
                  forceVisible={!userHasInteracted}
                  onUserInteraction={handleUserInteraction}
                />
              </div>
            ) : null
          )}
        </div>
      </main>
    </OverlayStackProvider>
  );
} 