import React from 'react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="relative section-padding section-narrow min-h-screen flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <div className="w-full max-w-3xl mx-auto text-center mb-12 relative z-20">
        <h2 className="heading-section">
          THE ANTI-MEETING
          <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
        </h2>
        <div className="space-y-4 text-lg md:text-xl mb-8">
          <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>FORGET EVERYTHING YOU KNOW ABOUT AI CONSULTING.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>This isn't a meeting. It's a mentoring session.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>This isn't your office. It's your living room.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>This isn't PowerPoint. It's pizza and conversation.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>This isn't corporate training. It's personal transformation.</p>
        </div>
        <div className="space-y-2 text-base md:text-lg text-muted mb-8">
          <p className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>I don't present to you.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>I sit with you.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>I don't sell you solutions.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>I give you superpowers.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '1.0s' }}>I don't leave you with a proposal.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>I leave you with abilities.</p>
        </div>
        <div className="mt-10 space-y-3 text-lg md:text-xl text-accent">
          <p className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>And when you text me at 9 PM with a question?</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '1.3s' }}>I text back. Because that's what friends do.</p>
        </div>
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 