'use client';

import React from 'react';
import { OverlayStackProvider } from '@/components/OverlayStackContext';
import { DesktopLayout } from '@/components/DesktopLayout';
import { Background } from '@/components/Background';

const ClientWrapper: React.FC = () => {
  return (
    <OverlayStackProvider>
      <Background />
      <main className="relative min-h-screen text-[#f8f8f8] overflow-hidden">
        <DesktopLayout />
      </main>
    </OverlayStackProvider>
  );
};

export default ClientWrapper; 