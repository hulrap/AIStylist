import React from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

interface CustomCursorProps {
  mousePosition: MousePosition;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mousePosition }) => {
  return (
    <motion.div
      className="fixed w-6 h-6 bg-[#ffb366] rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}; 