import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-light mb-16 text-[#ffb366]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          READY TO BECOME AN AI NATIVE?
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { 
              icon: <MessageCircle className="w-12 h-12" />, 
              method: "Text me", 
              contact: "+43 XXX XXX XXXX",
              description: "For quick questions and initial contact"
            },
            { 
              icon: <Mail className="w-12 h-12" />, 
              method: "Email me", 
              contact: "hello@aistylist.at",
              description: "For detailed inquiries and scheduling"
            },
            { 
              icon: <Phone className="w-12 h-12" />, 
              method: "WhatsApp me", 
              contact: "[QR code]",
              description: "For ongoing support and quick help"
            }
          ].map((item, index) => (
            <motion.div
              key={item.method}
              className="p-8 rounded-3xl border-2 border-[#ffb366]/30 bg-[#ffb366]/5 hover:bg-[#ffb366]/10 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
            >
              <div className="text-[#ffb366] mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-medium mb-2">{item.method}</h3>
              <p className="text-[#ffb366] mb-2">{item.contact}</p>
              <p className="text-sm text-[#f8f8f8]/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="space-y-6 text-xl mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-red-400">
            No forms.<br />
            No 'business inquiries.'<br />
            No corporate bullshit.
          </p>
          
          <p>Just message me like you'd message a friend:</p>
          
          <p className="text-[#ffb366] text-2xl font-medium">
            'I think I need an AI Stylist.'
          </p>
          
          <p className="text-[#ffb366] text-2xl font-light">
            I'll come to you.
          </p>
        </motion.div>
        
        <motion.div
          className="text-sm text-[#f8f8f8]/50 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
        >
          Vienna, Austria • The First Personal AI Mentor
        </motion.div>
      </div>
    </section>
  );
}; 