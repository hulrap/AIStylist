import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  scrollToSection: (index: number) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const [isTyping, setIsTyping] = useState(true);
  const typingText = `I'm not here to optimize your business.\nI'm here to make you powerful.\nI'm not your AI consultant.\nI'm your AI mentor.`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary-950/20" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          className="heading-1 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {typingText.split('\n').map((line, index) => (
            <div key={index} className="mb-4">
              {line}
              {index === typingText.split('\n').length - 1 && isTyping && (
                <motion.span
                  className="inline-block w-1 h-16 bg-primary-500 ml-2"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          ))}
        </motion.div>
        
        <AnimatePresence>
          {!isTyping && (
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "btn-primary",
                "text-lg px-12 py-4",
                "hover:scale-105 transform transition-all duration-300"
              )}
              onClick={() => scrollToSection(6)}
            >
              I need this human approach
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-primary-500" />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}; 