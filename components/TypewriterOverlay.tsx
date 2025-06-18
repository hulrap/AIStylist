import React, { useEffect, useRef, useState } from 'react';
import { useOverlayStack, SectionId } from './OverlayStackContext';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { SmoothTypewriter } from './SmoothTypewriter';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ChatMessage {
  text: string;
  type: 'user' | 'system';
  email?: string;
}

interface TypewriterOverlayProps {
  id: SectionId;
  title: string;
  content: string;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: Position;
  initialSize?: Size;
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
  showInitialContent?: boolean;
  onTypingComplete?: () => void;
  stopAutoSequence?: () => void;
  isMobile?: boolean;
  className?: string;
  'data-stack'?: string;
}

export const TypewriterOverlay: React.FC<TypewriterOverlayProps> = ({
  id,
  title,
  content,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  initialSize,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
  showInitialContent = false,
  onTypingComplete,
  stopAutoSequence,
  isMobile,
  className,
  'data-stack': dataStack,
}) => {
  const { 
    closeOverlay, 
    bringToFront, 
    updatePosition, 
    getPosition,
    minimizeWindow,
    maximizeWindow,
    unmaximizeWindow,
    getWindowState
  } = useOverlayStack();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(initialPosition || { x: 32, y: 32 });
  const [size, setSize] = useState<Size>(initialSize || { width: 420, height: 540 });
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldShowTypewriter, setShouldShowTypewriter] = useState(false);
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
  const [isAnimatingRestore, setIsAnimatingRestore] = useState(false);
  const [hasCompletedTyping, setHasCompletedTyping] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const windowState = getWindowState(id);
  const isWindowMaximized = windowState?.isMaximized || false;
  const isMinimized = windowState?.isMinimized || false;
  const wasMinimized = useRef(isMinimized);

  useEffect(() => {
    const savedPosition = getPosition(id);
    if (savedPosition) {
      setPosition(savedPosition);
    } else if (initialPosition) {
      setPosition(initialPosition);
      updatePosition(id, initialPosition);
    }
  }, [id, initialPosition, getPosition, updatePosition]);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (chatHistory.length > 0) {
      handleTypewriterScroll();
    }
  }, [chatHistory]);

  // Handle typewriter display logic
  useEffect(() => {
    const windowState = getWindowState(id);
    
    console.log(`TypewriterOverlay useEffect - ${id}: transitionState=${windowState?.transitionState}, isActive=${isActive}, shouldShow=${shouldShowTypewriter}, hasCompleted=${hasCompletedTyping}, autoSeqCompleted=${windowState?.hasCompletedAutoSequenceTyping}`);
    
    if (windowState?.transitionState === 'typing' && content) {
      console.log(`Setting shouldShowTypewriter=true for ${id}`);
      setShouldShowTypewriter(true);
    } else if (!isActive && windowState?.transitionState !== 'minimizing' && windowState?.transitionState !== 'closing') {
      console.log(`Window ${id} became inactive, resetting typewriter state`);
      setShouldShowTypewriter(false);
      
      // CRITICAL: Only reset completion state if window hasn't completed auto-sequence
      // This prevents the endless loop issue
      if (!windowState?.hasCompletedAutoSequenceTyping) {
        setHasCompletedTyping(false); // Reset when window becomes inactive
        completionCalledRef.current = false; // Reset ref as well
      } else {
        console.log(`NOT resetting completion state for ${id} - auto-sequence already completed`);
      }
    }
    
    // If window has completed auto-sequence typing and is now active, show the completed content
    if (windowState?.hasCompletedAutoSequenceTyping && isActive && !shouldShowTypewriter && !hasCompletedTyping) {
      console.log(`Showing completed content for ${id} (auto-sequence already completed)`);
      setHasCompletedTyping(true);
    }
  }, [isActive, content, id, getWindowState, shouldShowTypewriter, hasCompletedTyping]);

  // Force trigger typewriter when window becomes active and has typing state
  useEffect(() => {
    const windowState = getWindowState(id);
    
    if (isActive && windowState?.transitionState === 'typing' && content && !shouldShowTypewriter) {
      setShouldShowTypewriter(true);
    }
  }, [isActive, content, id, getWindowState, shouldShowTypewriter]);

  // Reset typing completion state when window opens (for manual interactions)
  useEffect(() => {
    const windowState = getWindowState(id);
    
    if (windowState?.transitionState === 'opening') {
      console.log(`Resetting completion state for manually opened window: ${id}`);
      setHasCompletedTyping(false);
      completionCalledRef.current = false; // Reset ref for manual interactions
    }
  }, [id, getWindowState]);

  // Handle minimize/restore animations
  useEffect(() => {
    const previouslyMinimized = wasMinimized.current;
    const currentlyMinimized = isMinimized;
    
    if (!previouslyMinimized && currentlyMinimized) {
      // Window is being minimized
      setIsAnimatingMinimize(true);
      setIsAnimatingRestore(false);
      
      // Stop animation after it completes
      setTimeout(() => {
        setIsAnimatingMinimize(false);
      }, 600); // Match animation duration
      
    } else if (previouslyMinimized && !currentlyMinimized) {
      // Window is being restored
      setIsAnimatingRestore(true);
      setIsAnimatingMinimize(false);
      
      // Stop animation after it completes
      setTimeout(() => {
        setIsAnimatingRestore(false);
      }, 450); // Match animation duration
    }
    
    // Update the ref for next comparison
    wasMinimized.current = currentlyMinimized;
  }, [isMinimized]);

  // Handle typing completion - USE REF TO PREVENT MULTIPLE CALLS
  const completionCalledRef = useRef(false);
  
  const handleTypingComplete = () => {
    console.log(`TypewriterOverlay: Typing completed for ${id}, hasCompletedTyping: ${hasCompletedTyping}, alreadyCalled: ${completionCalledRef.current}`);
    
    // Prevent multiple calls to onTypingComplete for the same completion using REF
    if (hasCompletedTyping || completionCalledRef.current) {
      console.log(`TypewriterOverlay: Ignoring duplicate typing completion for ${id}`);
      return;
    }
    
    // Mark as called IMMEDIATELY to prevent race conditions
    completionCalledRef.current = true;
    setHasCompletedTyping(true); // Mark as completed to prevent restarts
    
    if (onTypingComplete) {
      console.log(`TypewriterOverlay: Calling onTypingComplete for ${id} - ONLY ONCE`);
      onTypingComplete();
    }
  };

  // Cleanup on unmount or window close
  useEffect(() => {
    return () => {
      const windowState = getWindowState(id);
      if (windowState?.transitionState === 'closing') {
        setChatHistory([]);
        setShouldShowTypewriter(false);
        setShowEmailField(false); // Reset email field visibility
      }
    };
  }, [id, getWindowState]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWindowMaximized) return;
    
    if (e.target instanceof HTMLElement) {
      const isInput = e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea';
      const isButton = e.target.tagName.toLowerCase() === 'button' || e.target.closest('button');

      if (isInput || isButton) {
        // Don't initiate dragging for input fields or buttons
        return;
      }

      // Only allow dragging from titlebar
      setIsDragging(true);
      const rect = overlayRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      e.preventDefault(); // Prevent text selection while dragging
    }
  };

  // Separate handler for resize handle
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWindowMaximized) return;
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to parent
  };



  useEffect(() => {
    if (isDragging || isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isWindowMaximized) return;

        if (isDragging && overlayRef.current) {
          const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - overlayRef.current.offsetWidth));
          const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - overlayRef.current.offsetHeight));
          
          // Use requestAnimationFrame for smoother dragging
          if (!dragRef.current || 
              Math.abs(dragRef.current.x - newX) > 1 || 
              Math.abs(dragRef.current.y - newY) > 1) {
            dragRef.current = { x: newX, y: newY };
            requestAnimationFrame(() => {
              setPosition({ x: newX, y: newY });
              updatePosition(id, { x: newX, y: newY });
            });
          }

          // Update light effect position
          if (overlayRef.current) {
            const rect = overlayRef.current.getBoundingClientRect();
            setMousePosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }
        } else if (isResizing && overlayRef.current) {
          const rect = overlayRef.current.getBoundingClientRect();
          const newWidth = Math.max(320, Math.min(e.clientX - rect.left, window.innerWidth - rect.left));
          const newHeight = Math.max(400, Math.min(e.clientY - rect.top, window.innerHeight - rect.top));
          
          setSize({ width: newWidth, height: newHeight });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        dragRef.current = null;
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, id, isWindowMaximized, updatePosition]);

  const handleLocalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Show email field if not already shown
    if (!showEmailField) {
      setShowEmailField(true);
      return;
    }

    // Check if user has provided their email
    if (!senderEmail.trim()) {
      setChatHistory(prev => [
        ...prev,
        { text: 'Please provide your email address so I can get back to you.', type: 'system' }
      ]);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      setChatHistory(prev => [
        ...prev,
        { text: 'Please provide a valid email address.', type: 'system' }
      ]);
      return;
    }

    setIsSending(true);
    setChatHistory(prev => [...prev, { text: message, type: 'user', email: senderEmail }]);
    setMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          senderEmail,
          section: title, // Pass the window title as section
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setChatHistory(prev => [
        ...prev,
        { text: 'Message sent! I will get back to you within 24 hours.', type: 'system' }
      ]);
      // Keep email field visible and populated for easier follow-up messages
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { text: 'Failed to send message. Please try again.', type: 'system' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMaximize = () => {
    if (isWindowMaximized) {
      if (onUnmaximize) {
        onUnmaximize();
      }
    } else {
      if (onMaximize) {
        onMaximize();
      }
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleClose = () => {
    if (closeOverlay) {
      closeOverlay(id);
    }
  };

  const zIndex = stackIndex * 10;

  // Auto-scroll callback for typewriter
  const handleTypewriterScroll = () => {
    if (scrollAreaRef.current) {
      // Use requestAnimationFrame for better performance and reliability
      requestAnimationFrame(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // Show window during animations, hide only when fully minimized and not animating
  if (isMinimized && !isAnimatingMinimize && !isAnimatingRestore) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-all duration-200 group ${
        isActive ? 'z-[999]' : `z-[${zIndex}]`
      } ${forceVisible || !windowState?.isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${
        isAnimatingMinimize ? 'window-minimizing' : ''
      } ${
        isAnimatingRestore ? 'window-restoring' : ''
      } ${className || ''}`}
      style={{
        // Only apply desktop positioning when NOT in mobile mode
        ...(isMobile ? {} : {
          left: isWindowMaximized ? 0 : position.x,
          top: isWindowMaximized ? 0 : position.y,
          width: isWindowMaximized ? '100%' : size.width,
          height: isWindowMaximized ? '100%' : size.height,
        }),
        // Apply mobile styles only when in mobile mode
        ...(isMobile && isWindowMaximized ? {
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        } : {}),
        transform: (isAnimatingMinimize || isAnimatingRestore) ? 'none' : `${isWindowMaximized ? '' : 'perspective(1000px)'} rotateX(${isDragging ? mousePosition.y * 0.05 : 0}deg) rotateY(${isDragging ? mousePosition.x * 0.05 : 0}deg)`,
        transition: (isDragging || isAnimatingMinimize || isAnimatingRestore) ? 'none' : 'all 0.2s ease-out'
      }}
      onMouseMove={handleLocalMouseMove}
      onClick={(e) => {
        e.stopPropagation();
        if (stopAutoSequence) stopAutoSequence();
        
        // Only reset completion state if window hasn't completed auto-sequence typing
        const windowState = getWindowState(id);
        if (!windowState?.hasCompletedAutoSequenceTyping) {
          setHasCompletedTyping(false); // Reset completion state to allow restart
        }
        
        bringToFront(id, stopAutoSequence);
      }}
      data-stack={dataStack}
    >
      {/* Light Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 70%)`
        }}
      />

      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 pointer-events-none" />

      {/* Window Titlebar */}
      <div 
        className="window-titlebar relative flex items-center justify-between h-10 px-4 bg-white/5 border-b border-white/10"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 ${isMobile ? 'mobile-window-controls' : ''}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (stopAutoSequence) stopAutoSequence();
                handleClose();
              }}
              className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group`}
            >
              <span className={`text-red-900 opacity-0 group-hover:opacity-100 ${isMobile ? 'text-xs' : 'text-[8px]'} font-bold`}>×</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (stopAutoSequence) stopAutoSequence();
                handleMinimize();
              }}
              className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group`}
            >
              <span className={`text-yellow-900 opacity-0 group-hover:opacity-100 ${isMobile ? 'text-xs' : 'text-[8px]'} font-bold`}>−</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (stopAutoSequence) stopAutoSequence();
                handleMaximize();
              }}
              className={`${isMobile ? 'w-5 h-5' : 'w-3 h-3'} rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group`}
            >
              <span className={`text-green-900 opacity-0 group-hover:opacity-100 ${isMobile ? 'text-xs' : 'text-[8px]'} font-bold`}>{isWindowMaximized ? '□' : '+'}</span>
            </button>
          </div>
          <span className="text-sm text-white/80 ml-2">{title}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex flex-col h-[calc(100%-2.5rem)] ${isMobile ? 'window-content-container' : ''}`} style={{ minHeight: 0 }}>
        <div 
          ref={scrollAreaRef} 
          className="flex-1 p-6 overflow-y-scroll window-scroll window-content-area"
          style={{ 
            userSelect: 'text',
            minHeight: 0,
            maxHeight: '100%'
          }}
          onClick={(e) => {
            // Only trigger typing if clicking in the content area (not in input fields)
            const target = e.target as HTMLElement;
            const isInput = target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea';
            const isButton = target.tagName.toLowerCase() === 'button' || target.closest('button');
            
            if (!isInput && !isButton) {
              e.stopPropagation();
              if (stopAutoSequence) stopAutoSequence();
              
              // Only reset completion state if window hasn't completed auto-sequence typing
              const windowState = getWindowState(id);
              if (!windowState?.hasCompletedAutoSequenceTyping) {
                setHasCompletedTyping(false); // Reset completion state to allow restart
              }
              
              bringToFront(id, stopAutoSequence);
            }
          }}
        >
          {/* Smooth Typewriter Content */}
          <div className="space-y-4">
            {(shouldShowTypewriter || hasCompletedTyping) && content && (
              <div className="flex justify-start w-full">
                <SmoothTypewriter
                  content={content}
                  isActive={shouldShowTypewriter || hasCompletedTyping}
                  onComplete={handleTypingComplete}
                  speed={80}
                  className={isMobile ? "w-full" : "max-w-[90%]"}
                  onScroll={handleTypewriterScroll}
                />
              </div>
            )}
            
            {/* User chat messages */}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-purple-500/30 text-purple-100'
                      : 'bg-white/10 text-white/90 font-mono text-sm leading-relaxed'
                  }`}
                >
                  {msg.email && msg.type === 'user' && (
                    <div className="text-xs text-purple-200/70 mb-1">{msg.email}</div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Interface */}
        {(isActive || showInitialContent) && (
          <div className="p-4 bg-white/5 border-t border-white/10 space-y-3">
            {/* Email field - only show when user starts typing */}
            {showEmailField && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-xs text-white/70">Your email (so I can get back to you):</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  onFocus={() => {
                    if (stopAutoSequence) stopAutoSequence();
                  }}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stopAutoSequence) stopAutoSequence();
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  // Show email field when user starts typing
                  if (e.target.value.length > 0 && !showEmailField) {
                    setShowEmailField(true);
                  }
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (stopAutoSequence) stopAutoSequence();
                  // Show email field when user focuses on message input and has content
                  if (message.length > 0 && !showEmailField) {
                    setShowEmailField(true);
                  }
                }}
                placeholder="Send me a message..."
                className="flex-1 px-4 py-2 bg-white/10 rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (stopAutoSequence) stopAutoSequence();
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (stopAutoSequence) stopAutoSequence();
                  handleSendMessage();
                }}
                disabled={isSending || !message.trim() || (showEmailField && !senderEmail.trim())}
                className="p-2 rounded-lg bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-purple-200/20 border-t-purple-200 rounded-full animate-spin" />
                ) : (
                  <HiOutlinePaperAirplane className="w-5 h-5 transform rotate-90" />
                )}
              </button>
            </div>
            
            {showEmailField && (
              <div className="text-xs text-white/50 animate-fade-in">
                This sends a real email to me and I will get back to you within 24 hours.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isWindowMaximized && (
        <div 
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" 
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}; 