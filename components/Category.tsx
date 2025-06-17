import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Category = () => {
  const services = [
    { name: 'Personal Stylist', result: 'Makes you look amazing', icon: '👔' },
    { name: 'Personal Trainer', result: 'Makes you physically strong', icon: '💪' },
    { name: 'Language Tutor', result: 'Makes you multilingual', icon: '🗣️' },
    { name: 'AI Stylist', result: 'Makes you technologically powerful', icon: '🤖', highlight: true }
  ];

  return (
    <section id="category" className="relative min-h-screen flex items-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-950/20 to-background" />
      
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2
          className="heading-2 mb-16 text-primary-500"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          PERSONAL SERVICES THAT ALREADY EXIST:
        </motion.h2>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className={cn(
                "card",
                service.highlight && "border-primary-500/50 bg-primary-500/5"
              )}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className={cn(
                "text-lg font-medium mb-2",
                service.highlight ? "text-primary-500" : "text-text"
              )}>
                {service.name}
              </h3>
              <p className="text-sm text-text/70">→ {service.result}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="heading-2 text-primary-500"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          YOU ARE LOOKING AT THE FIRST PERSONAL AI MENTOR.<br />
          <span className="text-text">Not for your company. For YOU.</span>
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