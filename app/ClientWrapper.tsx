'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Category } from '@/components/Category';
import { Experience } from '@/components/Experience';
import { Packages } from '@/components/Packages';
import { Imprint } from '@/components/Imprint';
import { Contact } from '@/components/Contact';

export default function ClientWrapper() {
  // Only for Hero CTA scroll
  const scrollToSection = (index: number) => {
    const sectionIds = [
      'hero',
      'problem',
      'category',
      'experience',
      'packages',
      'manifesto',
      'contact',
    ];
    const element = document.getElementById(sectionIds[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-[#f8f8f8] antialiased">
      <Header />
      <div className="pt-16">
        <Hero scrollToSection={scrollToSection} />
        <Problem />
        <Category />
        <Experience />
        <Packages />
        <Contact />
        <Imprint />
      </div>
      <Footer />
    </main>
  );
} 