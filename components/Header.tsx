import React, { useState } from 'react';
import { useOverlayStack, SectionId } from './OverlayStackContext';

const sections: { id: SectionId; title: string }[] = [
  { id: 'hero', title: 'The Revelation' },
  { id: 'problem', title: 'The Problem' },
  { id: 'category', title: 'The First' },
  { id: 'experience', title: 'The Experience' },
  { id: 'packages', title: 'Three Ways' },
  { id: 'contact', title: 'Start Now' },
  { id: 'imprint', title: 'Imprint' }
];

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOverlayOpen, openOverlay, bringToFront } = useOverlayStack();

  const handleNavigation = (id: SectionId) => {
    openOverlay(id);
    bringToFront(id);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] glass-nav border-b border-accent shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-2xl md:text-3xl font-bold brand-gradient tracking-tight select-none font-brand">
          AI Stylist
        </span>
        <nav className="hidden md:flex space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavigation(section.id)}
              className={`nav-link ${isOverlayOpen(section.id) ? 'nav-link-active' : ''}`}
            >
              {section.title}
            </button>
          ))}
        </nav>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <span className={`block w-6 h-0.5 bg-[var(--brand-accent)] mb-1 transition-all duration-300 rounded group-hover:scale-x-110 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[var(--brand-accent)] mb-1 transition-all duration-300 rounded ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[var(--brand-accent)] transition-all duration-300 rounded ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#23243a]/95 backdrop-blur-lg border-b border-accent">
          <nav className="flex flex-col py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigation(section.id)}
                className={`px-6 py-3 text-left hover:bg-white/5 transition-colors ${
                  isOverlayOpen(section.id) ? 'text-[var(--brand-accent)]' : 'text-[#b0b0c3]'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}; 