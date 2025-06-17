import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full glass-footer border-t border-accent py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Shimmering divider above footer */}
      <div className="divider-gradient animate-shimmer absolute top-0 left-0 w-full" />
      <div className="text-2xl md:text-3xl font-bold brand-gradient font-brand mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        AI Stylist
      </div>
      <div className="text-base md:text-lg text-[var(--brand-fg-muted)] mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        The First Personal AI Mentor – Making you technologically powerful.
      </div>
      <div className="text-sm text-muted mt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        © {currentYear} AI Stylist. All rights reserved.
      </div>
    </footer>
  );
}; 