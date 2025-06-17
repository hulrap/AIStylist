import React from 'react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative section-padding section-narrow min-h-screen flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <div className="w-full max-w-2xl mx-auto text-center relative z-20">
        <h2 className="heading-section">
          START YOUR REVOLUTION
          <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
        </h2>
        <div className="mb-10 space-y-4 text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p>READY TO JOIN THE PERSONAL AI REVOLUTION?</p>
          <div><span className="font-semibold text-accent">Text me:</span> +43 XXX XXX XXXX</div>
          <div><span className="font-semibold text-accent">Email me:</span> hello@aistylist.at</div>
          <div><span className="font-semibold text-accent">WhatsApp me:</span> [Personal QR code]</div>
        </div>
        <div className="mb-8 space-y-2 text-lg md:text-xl text-muted animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p>No contact forms.</p>
          <p>No 'discovery calls.'</p>
          <p>No corporate theater.</p>
        </div>
        <div className="mb-8 text-lg md:text-xl text-muted animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Just message me like you'd message any friend:
        </div>
        <div className="mb-8 text-2xl font-semibold text-accent animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          'I think I need an AI Stylist.'
        </div>
        <div className="text-xl text-accent space-y-1 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p>I'll bring the pizza.</p>
          <p>You bring the curiosity.</p>
          <p>We'll build your superpowers together.</p>
        </div>
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 