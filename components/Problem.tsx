import React from 'react';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8]">
      <h2 className="text-2xl md:text-4xl font-bold mb-12 text-[#ffb366] text-center" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
        THE GREAT DIVIDE
      </h2>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-16">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-red-400" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
            EVERY AI CONSULTANT IN AUSTRIA PROMISES TO:
          </h3>
          <ul className="space-y-4 text-lg md:text-xl text-red-300 pl-4">
            <li>→ Transform your business processes</li>
            <li>→ Revolutionize your company workflows</li>
            <li>→ Maximize your organizational efficiency</li>
            <li>→ Schedule you into conference room hell</li>
            <li>→ Sell you software that nobody understands</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-green-400" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
            I PROMISE TO:
          </h3>
          <ul className="space-y-4 text-lg md:text-xl text-green-300 pl-4">
            <li>→ Transform your daily life</li>
            <li>→ Revolutionize your personal workflow</li>
            <li>→ Maximize your human potential</li>
            <li>→ Meet you where you're comfortable</li>
            <li>→ Give you superpowers you'll actually use</li>
          </ul>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto text-center mt-8">
        <p className="text-xl md:text-2xl font-medium text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
          The difference?<br />
          They serve businesses that happen to employ humans.<br />
          I serve humans who happen to work for businesses.
        </p>
      </div>
    </section>
  );
}; 