'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Problem } from '@/components/Problem';
import { Category } from '@/components/Category';
import { Experience } from '@/components/Experience';
import { Packages } from '@/components/Packages';
import { Imprint } from '@/components/Imprint';
import { CustomCursor } from '@/components/CustomCursor';
import { Contact } from '@/components/Contact';
import { Navigation } from '@/components/Navigation';

interface MousePosition {
  x: number;
  y: number;
}

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: 'hero', title: 'The Revelation' },
  { id: 'problem', title: 'The Problem' },
  { id: 'category', title: 'The First' },
  { id: 'experience', title: 'The Experience' },
  { id: 'packages', title: 'Three Ways' },
  { id: 'manifesto', title: 'The Manifesto' },
  { id: 'contact', title: 'Start Now' }
];

export default function ClientWrapper() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(index);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text antialiased">
      <Header />
      
      {/* Add padding-top to account for fixed header */}
      <div className="pt-16">
        <CustomCursor mousePosition={mousePosition} />
        <Navigation currentSection={currentSection} scrollToSection={scrollToSection} sections={sections} />
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