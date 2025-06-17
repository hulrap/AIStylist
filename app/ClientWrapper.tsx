'use client';

import React from 'react';
import { OverlayStackProvider } from '@/components/OverlayStackContext';
import { DesktopLayout } from '@/components/DesktopLayout';

export default function ClientWrapper() {
  return (
    <OverlayStackProvider>
      <main className="min-h-screen bg-[#181926] text-[#f8f8f8] overflow-hidden">
        <DesktopLayout />
      </main>
    </OverlayStackProvider>
  );
} 