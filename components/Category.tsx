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
    <section id="category" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8]">
      <h2 className="text-2xl md:text-4xl font-bold mb-12 text-[#ffb366] text-center" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
        THE PERSONAL SERVICE ECONOMY
      </h2>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-16">
        {professions.map((prof, idx) => (
          <div
            key={prof.name}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
              prof.highlight
                ? 'border-[#ffb366] bg-[#ffb366]/10 scale-105 shadow-lg' 
                : 'border-[#f8f8f8]/20 bg-[#f8f8f8]/5'
            }`}
          >
            <span className={`text-base font-semibold mb-1 ${prof.highlight ? 'text-[#ffb366]' : ''}`}>{prof.name}</span>
            <span className="text-sm text-[#f8f8f8]/80 text-center">{prof.result}</span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-2xl mx-auto text-center mt-8 space-y-2">
        <p className="text-lg md:text-xl text-[#f8f8f8]/90">Every other aspect of your life has a personal expert.<br />Your relationship with AI shouldn't be different.</p>
        <p className="text-xl md:text-2xl font-medium text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
          YOU ARE WITNESSING THE BIRTH OF PERSONAL AI MENTORING.<br />
          <span className="text-[#f8f8f8]">The last piece of the personal service puzzle.</span>
        </p>
      </div>
    </section>
  );
}; 