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
  isMaximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
}

export const TypewriterOverlay: React.FC<TypewriterOverlayProps> = ({
  id,
  title,
  content,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  isMaximized = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
}) => {
  const { closeOverlay, bringToFront, updatePosition, getPosition } = useOverlayStack();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(initialPosition || { x: 32, y: 32 });
  const [size, setSize] = useState<Size>({ width: 420, height: 540 });
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

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

  // Typewriter effect
  useEffect(() => {
    if (!forceVisible || isTyping) return;

    setIsTyping(true);
    setDisplayedContent('');

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [content, forceVisible]);

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

  const handleMouseMove = (e: MouseEvent) => {
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
    } else if (isResizing && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      const newWidth = Math.max(320, Math.min(e.clientX - rect.left, window.innerWidth - rect.left));
      const newHeight = Math.max(400, Math.min(e.clientY - rect.top, window.innerHeight - rect.top));
      
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    dragRef.current = null;
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset]);

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
      className={`fixed bg-[#1a1a1a]/90 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden transition-all duration-200 ${
        isActive ? 'z-[999]' : `z-[${10 + stackIndex}]`
      } ${forceVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        transform: `scale(${forceVisible ? 1 : 0.95})`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Titlebar */}
      <div className="window-titlebar flex items-center justify-between h-10 px-4 bg-white/5 border-b border-white/10">
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

      {/* Window Content */}
      <div className="p-6 text-white/90 whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {displayedContent}
      </div>

      {/* Chat Interface */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 border-t border-white/10">
        <div className="flex flex-col gap-4">
          {/* Chat History */}
          <div className="max-h-32 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-purple-500/20 text-purple-200'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Email Input */}
          {showEmailInput && !senderEmail && (
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          )}

          {/* Message Input */}
          <div className="flex items-center gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-white/5 rounded-lg text-white/80 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-10 leading-relaxed"
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

      {/* Resize Handle */}
      {!isMaximized && (
        <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
      )}
    </div>
  );
}; 