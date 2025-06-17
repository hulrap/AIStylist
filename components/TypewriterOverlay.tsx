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
      className={`fixed rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ${
        isMaximized ? 'window-maximized' : ''
      } ${isActive ? 'window-focused' : ''} window-transition window-appear`}
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex: stackIndex,
        display: !isActive && !forceVisible ? 'none' : 'block',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleLocalMouseMove}
    >
      {/* Window Title Bar */}
      <div className="window-titlebar bg-[#2a2a2a] text-white h-10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-4 text-sm">{title}</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="bg-[#1e1e1e] text-white p-6 h-[calc(100%-2.5rem)] overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={`${index}-${msg.text}`}
              className={`message-bubble ${msg.type} max-w-[80%] ${
                msg.type === 'user' ? 'ml-auto' : ''
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#2a2a2a]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send me a message..."
              className="flex-1 bg-[#3a3a3a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb366]"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className="bg-[#ffb366] text-black rounded-lg p-2 hover:bg-[#ff9933] transition-colors"
            >
              {isSending ? (
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <HiOutlinePaperAirplane className="w-6 h-6 transform rotate-90" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 