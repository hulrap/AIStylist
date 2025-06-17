import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

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
    }
  };

  return (
    <footer className={cn("bg-background/95 backdrop-blur-lg border-t border-primary-500/20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.h3 
              className="text-xl font-bold text-primary-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              AI Stylist
            </motion.h3>
            <motion.p 
              className="text-text/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              The First Personal AI Mentor
            </motion.p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <motion.h3 
              className="text-lg font-semibold text-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h3>
            <motion.nav 
              className="grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm text-text/70 hover:text-primary-500 transition-colors text-left"
                >
                  {section.title}
                </button>
              ))}
            </motion.nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <motion.h3 
              className="text-lg font-semibold text-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Contact
            </motion.h3>
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <a 
                href="mailto:hello@aistylist.at" 
                className="flex items-center space-x-2 text-text/70 hover:text-primary-500 transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5" />
                <span>hello@aistylist.at</span>
              </a>
              <a 
                href="tel:+43XXXXXXXXX" 
                className="flex items-center space-x-2 text-text/70 hover:text-primary-500 transition-colors"
              >
                <PhoneIcon className="h-5 w-5" />
                <span>+43 XXX XXX XXXX</span>
              </a>
              <div className="flex items-center space-x-2 text-text/70">
                <MapPinIcon className="h-5 w-5" />
                <span>Vienna, Austria</span>
              </div>
            </motion.div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <motion.h3 
              className="text-lg font-semibold text-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Legal
            </motion.h3>
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => scrollToSection('imprint')}
                className="text-sm text-text/70 hover:text-primary-500 transition-colors"
              >
                Imprint
              </button>
              <p className="text-sm text-text/50">
                © {currentYear} AI Stylist. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-12 pt-8 border-t border-primary-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-center text-sm text-text/50">
            The First Personal AI Mentor • Making you technologically powerful
          </p>
        </motion.div>
      </div>
    </footer>
  );
}; 