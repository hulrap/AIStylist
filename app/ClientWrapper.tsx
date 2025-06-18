'use client';

import React, { useState } from 'react';
import { OverlayStackProvider } from '@/components/OverlayStackContext';
import { DesktopLayout } from '@/components/DesktopLayout';
import { Background } from '@/components/Background';
import { LoadingScreen } from '@/components/LoadingScreen';

const ClientWrapper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <OverlayStackProvider>
        <Background />
        <main className={`relative min-h-screen text-[#f8f8f8] overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <DesktopLayout />
        </main>
      </OverlayStackProvider>
    </>
  );
};

export default ClientWrapper; 