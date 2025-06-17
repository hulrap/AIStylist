import React from 'react';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="relative section-padding section-wide flex flex-col justify-center items-center bg-[var(--brand-bg)] text-[var(--brand-fg)] overflow-hidden">
      {/* Top blurred divider */}
      <div className="divider-blur absolute top-0 left-0 w-full z-10" />
      {/* Soft radial background for depth */}
      <div className="bg-radial absolute inset-0 pointer-events-none z-0" />
      <h2 className="heading-main mb-8 z-20">
        THE GREAT DIVIDE
        <div className="divider-gradient mx-auto mt-4 animate-shimmer" />
      </h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-20 relative z-20">
        {/* Left Card */}
        <div className="card-red card-hover flex flex-col items-start">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-red-400 tracking-tight">
            EVERY AI CONSULTANT IN AUSTRIA PROMISES TO:
          </h3>
          <ul className="space-y-4 text-lg md:text-xl text-red-200 font-medium">
            {[
              '→ Transform your business processes',
              '→ Revolutionize your company workflows',
              '→ Maximize your organizational efficiency',
              '→ Schedule you into conference room hell',
              '→ Sell you software that nobody understands',
            ].map((item, i) => (
              <li
                key={item}
                className="animate-fade-in-up transition-card hover:scale-105 hover:text-red-300"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* Right Card */}
        <div className="card-green card-hover flex flex-col items-start">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-green-400 tracking-tight">
            I PROMISE TO:
          </h3>
          <ul className="space-y-4 text-lg md:text-xl text-green-200 font-medium">
            {[
              '→ Transform your daily life',
              '→ Revolutionize your personal workflow',
              '→ Maximize your human potential',
              "→ Meet you where you're comfortable",
              "→ Give you superpowers you'll actually use",
            ].map((item, i) => (
              <li
                key={item}
                className="animate-fade-in-up transition-card hover:scale-105 hover:text-green-300"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* The difference statement */}
      <div className="w-full max-w-2xl mx-auto text-center mt-8 relative z-20">
        <p className="text-2xl md:text-3xl font-bold text-gradient drop-shadow-lg animate-fade-in-up">
          The difference?<br />
          <span className="text-muted">They serve businesses that happen to employ humans.<br /></span>
          <span className="text-muted">I serve humans who happen to work for businesses.</span>
        </p>
      </div>
      {/* Bottom blurred divider */}
      <div className="divider-blur absolute bottom-0 left-0 w-full z-10" />
    </section>
  );
}; 