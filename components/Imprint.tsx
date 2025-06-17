import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImprintProps {}

export const Imprint: React.FC<ImprintProps> = () => {
  return (
    <section id="imprint" className="relative min-h-screen flex items-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-950/20 to-background" />
      
      <div className="relative max-w-4xl mx-auto">
        <motion.h1
          className="heading-1 text-center mb-16 text-primary-500"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Imprint
        </motion.h1>

        <motion.div
          className="card space-y-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl font-medium mb-4 text-primary-500">Company Information</h2>
            <p className="text-text/70">
              Raw Fiction e.U.<br />
              Owner: Raphael Hulan<br />
              Address: Gusenleithnergasse 28/18, 1140 Wien, Österreich<br />
              Company Register Number: FN 519455f<br />
              Commercial Court: Handelsgericht Wien<br />
              Chamber Membership: Wirtschaftskammer Wien
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4 text-primary-500">Contact</h2>
            <p className="text-text/70">
              Phone: +43 670 6066149<br />
              Email: office@rawfiction.xyz
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4 text-primary-500">Business Information</h2>
            <p className="text-text/70">
              Business License: Werbung und Marktkommunikation, Organisation von Veranstaltungen, Märkten und Messen (Eventmanagement)<br />
              Supervisory Authority: Magistratisches Bezirksamt für den 14. Bezirk
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}; 