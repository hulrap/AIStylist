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
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Position | null>(null);

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
      className={`fixed ${className} bg-black/30 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
        forceVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: `perspective(1000px) rotateX(${isDragging ? mousePosition.y * 0.05 : 0}deg) rotateY(${isDragging ? mousePosition.x * 0.05 : 0}deg)`,
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        zIndex: stackIndex
      }}
      onMouseMove={handleLocalMouseMove}
      onMouseDown={handleMouseDown}
    >
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
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
            />
          )}
          <button
            onClick={onUnmaximize}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Window Content */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100%-3rem)]">
        {displayedMessages.map((message, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg p-4 text-white/90 whitespace-pre-wrap"
          >
            {message}
          </div>
        ))}
        {isTyping && displayedContent && (
          <div className="bg-white/5 rounded-lg p-4 text-white/90 whitespace-pre-wrap">
            {displayedContent}
          </div>
        )}
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

      {/* Resize Handle */}
      <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
    </div>
  );
}; 