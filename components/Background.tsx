import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(/images/background.png)',
          filter: 'grayscale(100%) contrast(120%)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/90 via-[#1a1a1a]/70 to-[#1a1a1a]/90" />
      
      {/* Technical Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff08 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff08 1px, transparent 1px),
            linear-gradient(to right, #ffb36606 1px, transparent 1px),
            linear-gradient(to bottom, #ffb36606 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 250px 250px, 250px 250px'
        }}
      />
      
      {/* Fine Technical Grid Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff04 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #ffffff04 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(26, 26, 26, 0.4) 100%)'
        }}
      />
    </div>
  );
}; 