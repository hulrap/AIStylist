import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Problem = () => {
  return (
    <section id="problem" className="relative min-h-screen flex items-center px-6 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 via-background to-background" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card">
            <h2 className="heading-2 mb-8 text-primary-500">
              EVERY AI 'CONSULTANT' IN AUSTRIA WANTS TO:
            </h2>
            <ul className="space-y-4 text-xl text-red-400 mb-8">
              {[
                "Optimize your business processes",
                "Increase your company efficiency",
                "Save your organization money",
                "Schedule meetings in conference rooms",
                "Sell you enterprise solutions"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 10 }} 
                  className="flex items-center"
                >
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-4"></span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="card">
            <h2 className="heading-2 mb-8 text-primary-500">
              I WANT TO:
            </h2>
            <ul className="space-y-4 text-xl text-green-400 mb-8">
              {[
                "Make you personally more powerful",
                "Help you work fewer hours for same results",
                "Keep you human in an AI world",
                "Sit on your couch and actually help YOU",
                "Give you superpowers, not software"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 10 }} 
                  className="flex items-center"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-4"></span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="heading-3 text-primary-500">
            This is the difference between a corporate consultant<br />
            and a personal mentor.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}; 