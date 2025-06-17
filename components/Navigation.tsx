import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface Section {
  id: string;
  title: string;
}

interface NavigationProps {
  currentSection: number;
  scrollToSection: (index: number) => void;
  sections: Section[];
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentSection, 
  scrollToSection,
  sections 
}) => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-[#ffb366]/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div 
          className="text-2xl font-bold text-[#ffb366]"
          whileHover={{ scale: 1.05 }}
        >
          AI Stylist
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(index)}
              className={`text-sm transition-colors ${
                currentSection === index ? 'text-[#ffb366]' : 'text-[#f8f8f8]/70 hover:text-[#ffb366]'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {section.title}
            </motion.button>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Menu as="div" className="relative">
            <Menu.Button className="text-text/70 hover:text-primary-500">
              <Bars3Icon className="w-6 h-6" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-background border border-primary-500/20 shadow-lg focus:outline-none">
              <div className="p-2 space-y-1">
                {sections.map((section) => (
                  <Menu.Item key={section.id}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          const element = document.getElementById(section.id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm rounded-md transition-colors",
                          active ? "bg-primary-500/10 text-primary-500" : "text-text/70 hover:text-primary-500"
                        )}
                      >
                        {section.title}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </motion.nav>
  );
}; 