import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useSound } from '../utils/sound';

const Hero = () => {
  const { playHover } = useSound();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative px-6 pt-20">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-primary font-mono text-lg tracking-wide">Hello, I'm</h2>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-tight">
            {PERSONAL_INFO.name}
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-400">
            {PERSONAL_INFO.role}
          </h2>
          <p className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed">
            {PERSONAL_INFO.tagline}
          </p>

          <div className="flex gap-6 pt-8">
            <a 
              href={PERSONAL_INFO.social[0].url} 
              target="_blank" 
              rel="noreferrer"
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a 
              href={PERSONAL_INFO.social[1].url} 
              target="_blank" 
              rel="noreferrer"
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={PERSONAL_INFO.social[2].url} 
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default Hero;
