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
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [preMaximizeState, setPreMaximizeState] = useState<{ position: Position; size: Size } | null>(null);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const windowState = getWindowState(id);
  const isWindowMaximized = windowState?.isMaximized || false;
  const isMinimized = windowState?.isMinimized || false;

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

  // Update chat history when content changes
  useEffect(() => {
    if (content) {
      const lines = content.split('\n');
      setChatHistory(lines.map(line => ({ text: line, type: 'system' })));
    } else {
      setChatHistory([]);
    }
  }, [content]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWindowMaximized) return;
    
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
      }
      // Always bring to front on any click inside the window
      bringToFront(id);
    }
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

    setIsSending(true);
    setChatHistory(prev => [...prev, { text: message, type: 'user' }]);
    setMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          email: senderEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setChatHistory(prev => [
        ...prev,
        { text: 'Message sent! I will get back to you within 24 hours.', type: 'system' }
      ]);
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
    if (!isWindowMaximized) {
      setPreMaximizeState({ position, size });
      maximizeWindow(id);
      if (onMaximize) onMaximize();
    } else {
      if (preMaximizeState) {
        setPosition(preMaximizeState.position);
        setSize(preMaximizeState.size);
        updatePosition(id, preMaximizeState.position);
      }
      unmaximizeWindow(id);
      if (onUnmaximize) onUnmaximize();
    }
  };

  const handleMinimize = () => {
    minimizeWindow(id, title, 'window');
    if (onMinimize) onMinimize();
  };

  const handleClose = () => {
    closeOverlay(id);
  };

  const zIndex = stackIndex * 10;

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed bg-black/80 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden shadow-2xl transition-transform ${
        isActive ? 'shadow-purple-500/20' : ''
      }`}
      style={{
        width: isWindowMaximized ? '100%' : size.width,
        height: isWindowMaximized ? '100%' : size.height,
        transform: isWindowMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        zIndex,
        opacity: forceVisible || isActive ? 1 : 0.7,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleLocalMouseMove}
    >
      {/* Window Title Bar */}
      <div className="window-titlebar h-10 px-3 flex items-center justify-between bg-black/50 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            />
          </div>
          <span className="text-white/60 text-sm font-medium ml-2">{title}</span>
        </div>
      </div>

      {/* Window Content */}
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
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send me a message..."
                className="flex-1 px-4 py-2 bg-white/10 rounded-lg text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
        )}
      </div>

      {/* Resize Handle */}
      {!isWindowMaximized && (
        <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
      )}
    </div>
  );
}; 