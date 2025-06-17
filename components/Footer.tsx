import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#1a1a1a] border-t border-[#ffb366]/20 py-12 px-4 flex flex-col items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold text-[#ffb366] mb-2" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
        AI Stylist
      </div>
      <div className="text-base md:text-lg text-[#f8f8f8]/80 mb-2" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
        The First Personal AI Mentor – Making you technologically powerful.
      </div>
      <div className="text-sm text-[#f8f8f8]/50 mt-2">
        © {currentYear} AI Stylist. All rights reserved.
      </div>
    </footer>
  );
}; 