'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Category } from '@/components/Category';
import { Experience } from '@/components/Experience';
import { Packages } from '@/components/Packages';
import { Contact } from '@/components/Contact';
import { Imprint } from '@/components/Imprint';
import { Footer } from '@/components/Footer';
import { OverlayStackProvider } from '@/components/OverlayStackContext';

export default function Home() {
  return (
    <OverlayStackProvider>
      <main className="min-h-screen bg-[#181926] text-[#f8f8f8]">
        <Header />
        <Hero />
        <Problem />
        <Category />
        <Experience />
        <Packages />
        <Contact />
        <Imprint />
        <Footer />
      </main>
    </OverlayStackProvider>
  );
} 