import React, { useEffect, useRef, useState } from 'react';
import { useOverlayStack, SectionId } from './OverlayStackContext';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

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
}) => {
  const { closeOverlay, bringToFront, updatePosition, getPosition } = useOverlayStack();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(initialPosition || { x: 32, y: 32 });
  const [size, setSize] = useState<Size>(initialSize || { width: 420, height: 540 });
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentLineRef = useRef<number>(0);

  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Reset state when window becomes inactive
  useEffect(() => {
    if (!isActive) {
      setHasStartedTyping(false);
      setChatHistory([]);
      currentLineRef.current = 0;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [isActive]);

  // Start typing when window becomes active or initially visible
  useEffect(() => {
    if ((isActive || showInitialContent) && !hasStartedTyping && content) {
      setHasStartedTyping(true);
      // Clear any existing history before starting
      setChatHistory([]);
      currentLineRef.current = 0;
      startTyping();
    }
  }, [isActive, showInitialContent, content]);

  const startTyping = () => {
    if (!content) return;
    
    setIsTyping(true);
    const lines = content.split('\n').filter(line => line.trim());
    let currentCharIndex = 0;
    let currentText = '';
    
    const typeNextCharacter = () => {
      // If we've finished all lines, stop typing
      if (currentLineRef.current >= lines.length) {
        setIsTyping(false);
        return;
      }

      const currentLine = lines[currentLineRef.current];
      
      if (currentCharIndex < currentLine.length) {
        // Still typing current line
        currentText = currentLine.substring(0, currentCharIndex + 1);
        setChatHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length <= currentLineRef.current) {
            newHistory.push({ text: currentText, type: 'system' });
          } else {
            newHistory[currentLineRef.current] = { text: currentText, type: 'system' };
          }
          return newHistory;
        });
        
        currentCharIndex++;
        typingTimeoutRef.current = setTimeout(typeNextCharacter, 25);
      } else {
        // Move to next line
        currentLineRef.current++;
        currentCharIndex = 0;
        currentText = '';
        typingTimeoutRef.current = setTimeout(typeNextCharacter, 250);
      }
    };

    typeNextCharacter();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    
    if (e.target instanceof HTMLElement) {
      const isResizeHandle = e.target.closest('.resize-handle');
      const isTitlebar = e.target.closest('.window-titlebar');

      if (isResizeHandle) {
        setIsResizing(true);
        e.preventDefault();
      } else if (isTitlebar) {
        setIsDragging(true);
        const rect = overlayRef.current?.getBoundingClientRect();
        if (rect) {
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
        bringToFront(id);
      }
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isMaximized) return;

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
  }, [isDragging, isResizing, dragOffset, isMaximized, id, updatePosition]);

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

    // If we don't have the sender's email yet, show the email input
    if (!senderEmail) {
      setShowEmailInput(true);
      setChatHistory(prev => [...prev, {
        text: "Please enter your email address so I can get back to you!",
        type: 'system'
      }]);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          senderEmail,
          section: title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Add message to chat history
      setChatHistory(prev => [
        ...prev,
        { text: message, type: 'user' },
        { text: "Message sent! I'll get back to you soon.", type: 'system' }
      ]);

      // Clear input
      setMessage('');
    } catch (error) {
      setChatHistory(prev => [...prev, {
        text: "Failed to send message. Please try again.",
        type: 'system'
      }]);
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

  return (
    <div
      ref={overlayRef}
      className={`fixed backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-all duration-200 group ${
        isActive ? 'z-[999]' : `z-[${10 + stackIndex}]`
      } ${forceVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        transform: `${isMaximized ? '' : 'perspective(1000px)'} rotateX(${isDragging ? mousePosition.y * 0.05 : 0}deg) rotateY(${isDragging ? mousePosition.x * 0.05 : 0}deg)`,
        transition: isDragging ? 'none' : 'all 0.2s ease-out'
      }}
      onMouseMove={handleLocalMouseMove}
      onMouseDown={handleMouseDown}
    >
      {/* Light Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`
        }}
      />

      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      {/* Window Titlebar */}
      <div className="window-titlebar relative flex items-center justify-between h-10 px-4 bg-black/20 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => closeOverlay(id)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={isMaximized ? onUnmaximize : onMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            />
          </div>
          <span className="text-sm text-white/80 ml-2">{title}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col h-[calc(100%-2.5rem)]">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Chat Messages */}
          <div className="space-y-4">
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
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Interface */}
        {(isActive || showInitialContent) && (
          <div className="p-4 bg-black/30 border-t border-white/20">
            <div className="flex flex-col gap-4">
              {/* Chat History */}
              <div className="max-h-32 overflow-y-auto space-y-2">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-purple-500/30 text-purple-100'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Email Input */}
              {showEmailInput && (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 px-4 py-2 bg-white/10 rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button
                    onClick={() => {
                      if (senderEmail && senderEmail.includes('@')) {
                        setShowEmailInput(false);
                        setChatHistory(prev => [...prev, {
                          text: `Email set to: ${senderEmail}`,
                          type: 'system'
                        }]);
                        handleSendMessage();
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-colors"
                  >
                    Set Email
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={senderEmail ? "Type a message..." : "Send me a message..."}
                  className="flex-1 px-4 py-2 bg-white/10 rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-10 leading-relaxed"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="p-2 rounded-lg bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-purple-200/20 border-t-purple-200 rounded-full animate-spin" />
                  ) : (
                    <HiOutlinePaperAirplane className="w-5 h-5 transform rotate-90" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
      )}
    </div>
  );
}; 