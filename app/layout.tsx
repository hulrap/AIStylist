import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Stylist - Your Personal AI Mentor',
  description: 'The first personal AI mentor who comes to your place. No corporate bullshit, just real help with AI.',
  keywords: 'AI mentor, personal AI, AI consultant, Vienna, Austria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: `${inter.style.fontFamily}, Poppins, sans-serif` }} className={inter.className + ' bg-[#1a1a1a] text-[#f8f8f8]'}>
        {children}
      </body>
    </html>
  );
} 