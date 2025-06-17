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
import { OverlayStackProvider, useOverlayStack } from '@/components/OverlayStackContext';

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
  const { overlayStack } = useOverlayStack();
  return (
    <div className="relative w-full min-h-screen">
      {overlayStack.map((id, i) => {
        const Component = overlayComponentsMap[id];
        if (!Component) return null;
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${32 + i * 16}px`,
              top: `${32 + i * 16}px`,
              zIndex: 10 + i,
              width: 420,
              height: 540,
              maxWidth: '90vw',
              maxHeight: '90vh',
              pointerEvents: i === overlayStack.length - 1 ? 'auto' : 'none',
              transition: 'box-shadow 0.3s',
              boxShadow: i === overlayStack.length - 1 ? '0 8px 32px 0 rgba(0,0,0,0.25)' : '0 2px 8px 0 rgba(0,0,0,0.10)',
            }}
          >
            <Component
              stackIndex={i}
              isActive={i === overlayStack.length - 1}
              forceVisible={true}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <OverlayStackProvider>
      <main className="min-h-screen bg-[#181926] text-[#f8f8f8]">
        <Header />
        <OverlayStackRenderer />
      </main>
    </OverlayStackProvider>
  );
} 