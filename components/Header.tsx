import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', title: 'Home' },
    { id: 'problem', title: 'Problem' },
    { id: 'category', title: 'Category' },
    { id: 'experience', title: 'Experience' },
    { id: 'packages', title: 'Packages' },
    { id: 'contact', title: 'Contact' },
    { id: 'imprint', title: 'Imprint' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-lg" : "bg-transparent",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold text-primary-500"
            >
              AI Stylist
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  "text-text/70 hover:text-primary-500"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {section.title}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      "text-text/70 hover:text-primary-500 hover:bg-primary-500/10"
                    )}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Menu.Button>

                  <Transition
                    show={isMobileMenuOpen}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-in"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items
                      static
                      className={cn(
                        "absolute right-0 mt-2 w-48 origin-top-right rounded-lg",
                        "bg-background/95 backdrop-blur-lg border border-primary-500/20",
                        "shadow-lg focus:outline-none"
                      )}
                    >
                      <div className="py-1">
                        {sections.map((section) => (
                          <Menu.Item key={section.id}>
                            {({ active }) => (
                              <button
                                onClick={() => scrollToSection(section.id)}
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
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}; 