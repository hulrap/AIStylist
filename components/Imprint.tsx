import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';

interface ImprintProps {
  id: SectionId;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  showContent?: boolean;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
  onTypingComplete?: () => void;
}

export const Imprint: React.FC<ImprintProps> = ({
  id,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  initialSize,
  showContent = false,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
  onTypingComplete,
}) => {
  const content = `LEGAL INFORMATION

AI Instructor
Raphael Hulan
Raw Fiction e.U.
Wien, Austria

Email: info@ai-instructor.me
Phone: +43 670 606 6149

Business Registration: FN 519455f
VAT ID: ATU81854646

© 2025 Raw Fiction e.U. All rights reserved.`.trim();

  return (
    <TypewriterOverlay
      id={id}
      title="Imprint"
      content={content}
      stackIndex={stackIndex}
      isActive={isActive}
      forceVisible={forceVisible}
      initialPosition={initialPosition}
      initialSize={initialSize}
      showInitialContent={showContent}
      isMaximized={isMaximized}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onUnmaximize={onUnmaximize}
      onTypingComplete={onTypingComplete}
    />
  );
}; 