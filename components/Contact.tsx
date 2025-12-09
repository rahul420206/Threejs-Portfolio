import React from 'react';
import { motion } from 'framer-motion';
import { PERSONAL_INFO } from '../constants';
import { Mail, ArrowRight } from 'lucide-react';
import { useSound } from '../utils/sound';

const Contact = () => {
  const { playClick, playHover } = useSound();

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Let's Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">The Future</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Open for collaborations, freelance opportunities, or just a chat about technology.
          </p>

          <a 
            href={`mailto:${PERSONAL_INFO.email}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-all duration-300 group"
          >
            <Mail size={20} />
            Get In Touch
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
        </motion.div>

        <footer className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Rahul Matta. Built with React & Three.js.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             {PERSONAL_INFO.social.map(s => (
               <a key={s.name} href={s.url} className="hover:text-primary transition-colors">{s.name}</a>
             ))}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
