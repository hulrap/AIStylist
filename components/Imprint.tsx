import React from 'react';

export const Imprint: React.FC = () => {
  return (
    <>
      <section id="manifesto" className="relative section-padding section-narrow flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
        {/* Top blurred divider */}
        <div className="divider-blur absolute top-0 left-0 w-full z-10" />
        {/* Soft radial background for depth */}
        <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
        <h2 className="heading-section z-20">
          THE HUMAN IMPERATIVE
          <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
        </h2>
        <div className="mb-8 space-y-2 text-lg md:text-xl relative z-20">
          <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>I DON'T CARE ABOUT YOUR COMPANY'S BOTTOM LINE.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>I CARE ABOUT YOUR LIFE'S BOTTOM LINE.</p>
          <p className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>AI is the most important revolution in human history.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>But it's being sold to you like accounting software.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Boring. Corporate. Inhuman.</p>
          <p className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>I believe AI should feel like magic, not work.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>I believe learning should happen in comfort, not conference rooms.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>I believe technology should amplify your humanity, not replace it.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>I believe you deserve a personal guide through this revolution.</p>
          <p className="mt-4 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>Everyone else is trying to make AI more corporate.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>I'm trying to make it more human.</p>
          <p className="mt-4 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>This is why I exist.</p>
          <p className="animate-fade-in-up" style={{ animationDelay: '1.3s' }}>To keep you human while giving you superpowers.</p>
        </div>
        <div className="mt-8 relative z-20">
          <button className="btn-primary btn-animated animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            This is exactly what I need
          </button>
        </div>
        {/* Bottom blurred divider */}
        <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
      </section>
      
      <section id="imprint" className="relative section-padding section-narrow flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden border-t border-[var(--brand-accent)]/20">
        {/* Soft radial background for depth */}
        <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
        <h2 className="heading-section z-20">
          Imprint
          <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
        </h2>
        <div className="mb-4 text-lg md:text-xl relative z-20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="font-semibold text-gradient">Raw Fiction e.U.</span><br />
          Austrian corporation registered in Vienna<br />
          Address: Gusenleithnergasse 28/18, 1140 Wien, Österreich<br />
          Company Register Number: FN 519455f<br />
          Commercial Court: Handelsgericht Wien<br />
          Chamber Membership: Wirtschaftskammer Wien
        </div>
        <div className="mb-4 text-lg md:text-xl relative z-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="font-semibold text-gradient">Contact:</span><br />
          office@rawfiction.xyz
        </div>
        <div className="text-sm text-muted mt-8 relative z-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          This website is operated by Raw Fiction e.U. All rights reserved.
        </div>
        {/* Bottom blurred divider */}
        <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
      </section>
    </>
  );
}; 