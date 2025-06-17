import React from 'react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8]">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
          START YOUR REVOLUTION
        </h2>
        <div className="mb-10 space-y-4 text-lg md:text-xl text-[#f8f8f8]/90">
          <p>READY TO JOIN THE PERSONAL AI REVOLUTION?</p>
          <div><span className="font-semibold text-[#ffb366]">Text me:</span> +43 XXX XXX XXXX</div>
          <div><span className="font-semibold text-[#ffb366]">Email me:</span> hello@aistylist.at</div>
          <div><span className="font-semibold text-[#ffb366]">WhatsApp me:</span> [Personal QR code]</div>
        </div>
        <div className="mb-8 space-y-2 text-lg md:text-xl text-[#f8f8f8]/90">
          <p>No contact forms.</p>
          <p>No 'discovery calls.'</p>
          <p>No corporate theater.</p>
        </div>
        <div className="mb-8 text-lg md:text-xl text-[#f8f8f8]/90">
          Just message me like you'd message any friend:
        </div>
        <div className="mb-8 text-2xl font-semibold text-[#ffb366]">
          'I think I need an AI Stylist.'
        </div>
        <div className="text-xl text-[#ffb366] space-y-1">
          <p>I'll bring the pizza.</p>
          <p>You bring the curiosity.</p>
          <p>We'll build your superpowers together.</p>
        </div>
      </div>
    </section>
  );
}; 