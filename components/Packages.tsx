import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/solid';

export const Packages = () => {
  const packages = [
    {
      name: 'Basic',
      price: '€99',
      description: 'Perfect for getting started with AI',
      features: [
        '1-hour initial consultation',
        'Basic AI tools introduction',
        'Email support',
        'Resource library access'
      ]
    },
    {
      name: 'Pro',
      price: '€299',
      description: 'For those ready to dive deep',
      features: [
        '3-hour personalized session',
        'Advanced AI tools training',
        'Priority email support',
        'Custom resource library',
        'Monthly check-in calls',
        'Community access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for your needs',
      features: [
        'Unlimited consultation hours',
        'Full AI suite access',
        '24/7 priority support',
        'Custom training programs',
        'Weekly progress reviews',
        'Dedicated success manager'
      ]
    }
  ];

  return (
    <section id="packages" className="relative min-h-screen flex items-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary-950/20 to-background" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          className="heading-2 text-center mb-16 text-primary-500"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          CHOOSE YOUR PACKAGE
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              className={cn(
                "card group relative",
                pkg.popular && "border-primary-500/50 bg-primary-500/5"
              )}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium mb-2 text-primary-500">{pkg.name}</h3>
                <div className="text-4xl font-bold mb-2">{pkg.price}</div>
                <p className="text-text/70">{pkg.description}</p>
              </div>
              
              <ul className="space-y-4">
                {pkg.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckIcon className="w-5 h-5 text-primary-500 mr-2" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              <motion.button
                className={cn(
                  "w-full mt-8 py-3 px-6 rounded-lg font-medium transition-colors",
                  pkg.popular
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "bg-primary-500/10 text-primary-500 hover:bg-primary-500/20"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}; 