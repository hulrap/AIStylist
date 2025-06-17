import React from 'react';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-24 bg-[#1a1a1a] text-[#f8f8f8]">
      <div className="w-full max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 text-[#ffb366]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
          THE ANTI-MEETING
        </h2>
        <div className="space-y-4 text-lg md:text-xl text-[#f8f8f8]/90 mb-8">
          <p>FORGET EVERYTHING YOU KNOW ABOUT AI CONSULTING.</p>
          <p>This isn't a meeting. It's a mentoring session.</p>
          <p>This isn't your office. It's your living room.</p>
          <p>This isn't PowerPoint. It's pizza and conversation.</p>
          <p>This isn't corporate training. It's personal transformation.</p>
        </div>
        <div className="space-y-2 text-base md:text-lg text-[#f8f8f8]/80 mb-8">
          <p>I don't present to you.</p>
          <p>I sit with you.</p>
          <p>I don't sell you solutions.</p>
          <p>I give you superpowers.</p>
          <p>I don't leave you with a proposal.</p>
          <p>I leave you with abilities.</p>
        </div>
        <div className="mt-10 space-y-3 text-lg md:text-xl text-[#ffb366]">
          <p>And when you text me at 9 PM with a question?</p>
          <p>I text back. Because that's what friends do.</p>
        </div>
      </div>
    </section>
  );
}; 