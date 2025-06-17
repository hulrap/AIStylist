import React from 'react';

const packages = [
  {
    title: 'THE AWAKENING',
    details: [
      'One evening at your place (90m)',
      'Discover your AI potential',
    ],
    price: '€180',
  },
  {
    title: 'THE TRANSFORMATION',
    details: [
      'One week intensive (6x 90m)',
      '2-3 days',
      'Pizza, beer, and breakthroughs included',
    ],
    price: '€1,080',
  },
  {
    title: 'THE PARTNERSHIP',
    details: [
      'Text support',
      'Your personal AI advisor',
      'Forever',
    ],
    price: '€50/month',
  },
];

export const Packages: React.FC = () => {
  return (
    <section id="packages" className="relative section-padding section-wide flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <h2 className="heading-section z-20">
        THREE PATHS TO POWER
        <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
      </h2>
      <div className="card-grid w-full max-w-5xl mx-auto mb-8 relative z-20">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.title}
            className="card-glass card-accent card-hover flex flex-col items-center justify-between min-h-[340px] animate-fade-in-up transition-card"
            style={{ animationDelay: `${0.1 + idx * 0.12}s` }}
          >
            <h3 className="heading-card">{pkg.title}</h3>
            <ul className="mb-6 space-y-2 text-base md:text-lg text-[var(--brand-fg)]/90 text-center">
              {pkg.details.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="text-3xl md:text-4xl font-extrabold text-gradient mt-auto drop-shadow-lg animate-pop">
              {pkg.price}
            </div>
          </div>
        ))}
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 