import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypewriterOverlay } from './TypewriterOverlay';
import { SectionId } from './OverlayStackContext';
import { useOverlayStack } from './OverlayStackContext';

interface ProblemProps {
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

export const Problem: React.FC<ProblemProps> = ({
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
  const { getWindowState } = useOverlayStack();

  const content = `THE PROBLEM:
AI is not about making businesses more efficient.
It's about making humans more powerful.
But most AI experts treat you like a company.
They want to optimize your processes.
They want to make you more productive.
They want to make you more efficient.
But they don't want to make you more powerful.
They don't want to make you more creative.
They don't want to make you more human.
I do.`;

  return (
    <TypewriterOverlay
      id={id}
      title="The Problem"
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