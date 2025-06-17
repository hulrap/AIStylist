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

export interface TypewriterOverlayProps {
  id: SectionId;
  title: string;
  content: string;
  stackIndex: number;
  isActive: boolean;
  forceVisible?: boolean;
  initialPosition?: Position;
  showInitialContent?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onUnmaximize?: () => void;
  className?: string;
}

export const TypewriterOverlay: React.FC<TypewriterOverlayProps> = ({
  id,
  title,
  content,
  stackIndex,
  isActive,
  forceVisible = false,
  initialPosition,
  showInitialContent = false,
  onMinimize,
  onMaximize,
  onUnmaximize,
  className = 'w-[600px] h-[400px]'
}) => {
  const { closeOverlay, bringToFront, updatePosition, getPosition } = useOverlayStack();
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [position, setPosition] = useState<Position>(initialPosition || { x: 32, y: 32 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 600, height: 400 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Position | null>(null);
  const previousSize = useRef<Size | null>(null);
  const previousPosition = useRef<Position | null>(null);

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

  useEffect(() => {
    if ((isActive || showInitialContent) && displayedMessages.length === 0) {
      const messages = content.split('\n').filter(msg => msg.trim() !== '');
      let currentMessageIndex = 0;
      let currentText = '';
      let currentCharIndex = 0;

      setIsTyping(true);

      const typeNextCharacter = () => {
        if (currentMessageIndex < messages.length) {
          const currentMessage = messages[currentMessageIndex];
          if (currentCharIndex < currentMessage.length) {
            currentText += currentMessage[currentCharIndex];
            setDisplayedContent(currentText);
            currentCharIndex++;
            setTimeout(typeNextCharacter, 50);
          } else {
            setDisplayedMessages(prev => [...prev, currentText]);
            currentMessageIndex++;
            currentCharIndex = 0;
            currentText = '';
            if (currentMessageIndex < messages.length) {
              setTimeout(typeNextCharacter, 500); // Delay between messages
            } else {
              setIsTyping(false);
            }
          }
        }
      };

      typeNextCharacter();
    }
  }, [isActive, showInitialContent, content, displayedMessages.length]);

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
        if (isDragging && overlayRef.current) {
          const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - overlayRef.current.offsetWidth));
          const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - overlayRef.current.offsetHeight));
          
          if (!dragRef.current || 
              Math.abs(dragRef.current.x - newX) > 1 || 
              Math.abs(dragRef.current.y - newY) > 1) {
            dragRef.current = { x: newX, y: newY };
            requestAnimationFrame(() => {
              setPosition({ x: newX, y: newY });
              updatePosition(id, { x: newX, y: newY });
            });
          }

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
  }, [isDragging, isResizing, dragOffset, id, updatePosition]);

  const handleLocalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      previousSize.current = size;
      previousPosition.current = position;
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      if (previousSize.current && previousPosition.current) {
        setSize(previousSize.current);
        setPosition(previousPosition.current);
      }
    }
    setIsMaximized(!isMaximized);
    onMaximize?.();
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

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

      setChatHistory(prev => [
        ...prev,
        { text: message, type: 'user' },
        { text: "Message sent! I'll get back to you soon.", type: 'system' }
      ]);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showEmailInput) {
        if (senderEmail.includes('@')) {
          setShowEmailInput(false);
        }
      } else {
        handleSendMessage();
      }
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed ${className} bg-black/30 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
        forceVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      } ${isMaximized ? 'window-maximized' : ''}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? '100%' : size.height,
        transform: `perspective(1000px) rotateX(${isDragging ? mousePosition.y * 0.05 : 0}deg) rotateY(${isDragging ? mousePosition.x * 0.05 : 0}deg)`,
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        zIndex: stackIndex
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

      {/* Window Title Bar */}
      <div className="window-titlebar flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <h2 className="text-white/90 font-medium">{title}</h2>
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
            />
          )}
          <button
            onClick={handleMaximize}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
          />
          <button
            onClick={() => closeOverlay(id)}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Window Content */}
      <div className="flex flex-col h-[calc(100%-2.5rem)]">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {displayedMessages.map((message, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 text-white/90 whitespace-pre-wrap chat-message"
            >
              {message}
            </div>
          ))}
          {isTyping && displayedContent && (
            <div className="bg-white/5 rounded-lg p-4 text-white/90 whitespace-pre-wrap chat-message">
              {displayedContent}
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div
              key={`chat-${index}`}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-4 ${
                msg.type === 'user' ? 'bg-purple-500/20' : 'bg-white/5'
              } chat-message`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        {(id === 'contact' || showEmailInput) && (
          <div className="p-4 border-t border-white/10 bg-white/5">
            {showEmailInput ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email..."
                  className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  onClick={() => setShowEmailInput(false)}
                  disabled={!senderEmail.includes('@')}
                  className="px-4 py-2 bg-purple-500/20 rounded-lg text-white/90 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim()}
                  className="p-2 bg-purple-500/20 rounded-lg text-white/90 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                </button>
              </div>
            )}
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