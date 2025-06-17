import React from 'react';

const professions = [
  { name: 'Personal Stylist', result: 'Your appearance' },
  { name: 'Personal Trainer', result: 'Your fitness' },
  { name: 'Life Coach', result: 'Your mindset' },
  { name: 'Therapist', result: 'Your emotional health' },
  { name: 'Financial Advisor', result: 'Your money' },
  { name: 'Language Tutor', result: 'Your communication' },
  { name: 'AI Stylist', result: 'Your digital superpowers', highlight: true }
];

export const Category: React.FC = () => {
  return (
    <section id="category" className="relative section-padding section-narrow min-h-screen flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <h2 className="heading-section">
        THE PERSONAL SERVICE ECONOMY
        <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
      </h2>
      <div className="card-grid max-w-5xl mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {professions.map((prof, idx) => (
          <div
            key={prof.name}
            className={`card-glass card-hover flex flex-col items-center justify-center p-6 transition-all duration-200 animate-fade-in-up ${prof.highlight ? 'card-accent scale-105 shadow-lg z-10' : ''}`}
            style={{ animationDelay: `${0.15 + idx * 0.07}s` }}
          >
            <span className={`text-base font-semibold mb-1 ${prof.highlight ? 'text-accent' : ''}`}>{prof.name}</span>
            <span className="text-sm text-muted text-center">{prof.result}</span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-2xl mx-auto text-center mt-8 space-y-2">
        <p className="text-lg md:text-xl text-muted animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          Every other aspect of your life has a personal expert.<br />Your relationship with AI shouldn't be different.
        </p>
        <p className="text-xl md:text-2xl font-medium text-accent animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          YOU ARE WITNESSING THE BIRTH OF PERSONAL AI MENTORING.<br />
          <span className="text-[var(--brand-fg)]">The last piece of the personal service puzzle.</span>
        </p>
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 