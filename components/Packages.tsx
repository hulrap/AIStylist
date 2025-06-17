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
    <section id="packages" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8]">
      <h2 className="text-2xl md:text-4xl font-bold mb-12 text-[#ffb366] text-center" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
        THREE PATHS TO POWER
      </h2>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.title}
            className="flex flex-col items-center justify-between p-8 rounded-3xl border-2 border-[#ffb366]/30 bg-[#ffb366]/5 hover:bg-[#ffb366]/10 transition-all duration-300 shadow-md min-h-[340px]"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#ffb366] text-center" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>{pkg.title}</h3>
            <ul className="mb-6 space-y-2 text-base md:text-lg text-[#f8f8f8]/90 text-center">
              {pkg.details.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="text-2xl font-bold text-[#ffb366] mt-auto" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>{pkg.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}; 