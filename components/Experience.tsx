import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Experience = () => {
  const experiences = [
    {
      title: 'AI Stylist',
      description: 'Your personal AI mentor for style and fashion',
      icon: '👔',
      features: [
        'Personalized style recommendations',
        'Outfit coordination',
        'Trend analysis',
        'Shopping guidance'
      ]
    },
    {
      title: 'AI Trainer',
      description: 'Your personal AI fitness coach',
      icon: '💪',
      features: [
        'Custom workout plans',
        'Form correction',
        'Progress tracking',
        'Nutrition advice'
      ]
    },
    {
      title: 'AI Tutor',
      description: 'Your personal AI language teacher',
      icon: '🗣️',
      features: [
        'Personalized lessons',
        'Pronunciation practice',
        'Grammar correction',
        'Cultural insights'
      ]
    }
  ];

  return (
    <section id="experience" className="relative min-h-screen flex items-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-950/20 to-background" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          className="heading-2 text-center mb-16 text-primary-500"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          EXPERIENCE THE POWER OF AI
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              className="card group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{exp.icon}</div>
              <h3 className="text-xl font-medium mb-2 text-primary-500">{exp.title}</h3>
              <p className="text-text/70 mb-6">{exp.description}</p>
              <ul className="space-y-3">
                {exp.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}; 