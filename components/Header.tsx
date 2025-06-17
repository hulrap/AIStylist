import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', title: 'The Revelation' },
  { id: 'problem', title: 'The Problem' },
  { id: 'category', title: 'The First' },
  { id: 'experience', title: 'The Experience' },
  { id: 'packages', title: 'Three Ways' },
  { id: 'manifesto', title: 'The Manifesto' },
  { id: 'contact', title: 'Start Now' }
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let found = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          found = i;
        }
      }
      setCurrentSection(found);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(index);
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/90 backdrop-blur border-b border-[#ffb366]/20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-2xl md:text-3xl font-bold text-[#ffb366] tracking-tight select-none" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
          AI Stylist
        </span>
        <div className="hidden md:flex space-x-8">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(idx)}
              className={`text-base font-medium transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb366] ${
                currentSection === idx ? 'text-[#ffb366]' : 'text-[#f8f8f8]/80 hover:text-[#ffb366]'
              }`}
              style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
            >
              {section.title}
            </button>
          ))}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <span className={`block w-6 h-0.5 bg-[#ffb366] mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#ffb366] mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#ffb366] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#1a1a1a]/95 flex flex-col items-center justify-center z-50 transition-all">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(idx)}
              className={`text-2xl font-bold mb-8 tracking-tight transition-colors px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ffb366] ${
                currentSection === idx ? 'text-[#ffb366]' : 'text-[#f8f8f8]/90 hover:text-[#ffb366]'
              }`}
              style={{ fontFamily: 'Inter, Poppins, sans-serif' }}
            >
              {section.title}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}; 