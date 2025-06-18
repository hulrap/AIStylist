import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Background } from '@/components/Background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Instructor - Your Personal AI Mentor',
  description: 'The first personal AI mentor who comes to your place. No corporate bullshit, just real help with AI.',
  keywords: 'AI mentor, personal AI, AI consultant, Vienna, Austria',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} bg-[var(--brand-bg)] text-[var(--brand-fg)]`}>
        <Background />
        {children}
      </body>
    </html>
  );
} 