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
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      
      setPosition({ x: newX, y: newY });
      updatePosition(id, { x: newX, y: newY });
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
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Title Bar */}
      <div className="window-titlebar h-10 bg-[#1a1a1a]/80 backdrop-blur-sm flex items-center justify-between px-3 cursor-move">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
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
          <span className="text-sm font-medium text-white/80 ml-2">{title}</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex flex-col h-[calc(100%-2.5rem)]">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose prose-invert max-w-none">
            {content}
          </div>
          <div className="mt-6 space-y-4">
            {chatHistory.map((msg, i) => (
              <div 
                key={i} 
                className={`rounded-lg p-3 chat-message ${
                  msg.type === 'user' 
                    ? 'bg-white/10 ml-8' 
                    : 'bg-white/5 mr-8'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/10 bg-[#1a1a1a]/50">
          {showEmailInput && !senderEmail && (
            <div className="mb-4">
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-white/5 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={senderEmail ? "Type your message..." : "Send me a message..."}
              className="flex-1 bg-white/5 rounded-lg px-3 py-2 resize-none h-10 focus:outline-none focus:ring-1 focus:ring-white/20"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending}
              className={`w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ${
                isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              ) : (
                <HiOutlinePaperAirplane className="w-5 h-5 text-white/80" />
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