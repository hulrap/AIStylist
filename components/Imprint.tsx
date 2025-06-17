import React from 'react';

export const Imprint: React.FC = () => {
  return (
    <>
      <section id="manifesto" className="w-full flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8] border-t border-[#ffb366]/20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
            THE HUMAN IMPERATIVE
          </h2>
          <div className="mb-8 space-y-2 text-lg md:text-xl text-[#f8f8f8]/90">
            <p>I DON'T CARE ABOUT YOUR COMPANY'S BOTTOM LINE.</p>
            <p>I CARE ABOUT YOUR LIFE'S BOTTOM LINE.</p>
            <p className="mt-4">AI is the most important revolution in human history.</p>
            <p>But it's being sold to you like accounting software.</p>
            <p>Boring. Corporate. Inhuman.</p>
            <p className="mt-4">I believe AI should feel like magic, not work.</p>
            <p>I believe learning should happen in comfort, not conference rooms.</p>
            <p>I believe technology should amplify your humanity, not replace it.</p>
            <p>I believe you deserve a personal guide through this revolution.</p>
            <p className="mt-4">Everyone else is trying to make AI more corporate.</p>
            <p>I'm trying to make it more human.</p>
            <p className="mt-4">This is why I exist.</p>
            <p>To keep you human while giving you superpowers.</p>
          </div>
          <div className="mt-8">
            <span className="inline-block bg-[#ffb366] text-[#1a1a1a] px-8 py-4 rounded-full text-lg font-semibold shadow hover:bg-[#ff9933] transition-all duration-200" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
              This is exactly what I need
            </span>
          </div>
        </div>
      </section>
      <section id="imprint" className="w-full flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8] border-t border-[#ffb366]/20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
            Imprint
          </h2>
          <div className="mb-4">
            <span className="font-semibold">Raw Fiction e.U.</span><br />
            Austrian corporation registered in Vienna<br />
            Address: Gusenleithnergasse 28/18, 1140 Wien, Österreich<br />
            Company Register Number: FN 519455f<br />
            Commercial Court: Handelsgericht Wien<br />
            Chamber Membership: Wirtschaftskammer Wien
          </div>
          <div className="mb-4">
            <span className="font-semibold">Contact:</span><br />
            office@rawfiction.xyz
          </div>
          <div className="text-sm text-[#f8f8f8]/60 mt-8">
            This website is operated by Raw Fiction e.U. All rights reserved.
          </div>
        </div>
      </section>
    </>
  );
}; 