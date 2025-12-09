import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Download, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { useSound } from '../utils/sound';

const Hero = () => {
  const { playHover, playClick } = useSound();

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

          <div className="flex flex-wrap items-center gap-6 pt-8">
            {/* Social Icons */}
            <a 
              href={PERSONAL_INFO.social[0].url} 
              target="_blank" 
              rel="noreferrer"
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300 backdrop-blur-sm"
            >
              <Github size={24} />
            </a>
            <a 
              href={PERSONAL_INFO.social[1].url} 
              target="_blank" 
              rel="noreferrer"
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300 backdrop-blur-sm"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href={PERSONAL_INFO.social[2].url} 
              onMouseEnter={playHover}
              className="p-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300 backdrop-blur-sm"
            >
              <Mail size={24} />
            </a>

            {/* --- FUTURISTIC RESUME BUTTON --- */}
            <a 
              href="https://drive.google.com/file/d/1ytg8Qm2kMZ2_iNlhw0-3m_Po19yupGB5/view" // REPLACE THIS WITH YOUR ACTUAL RESUME PATH
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              className="group relative px-6 py-3 rounded-full bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
            >
              {/* Shimmer Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
              
              <div className="relative z-10 flex items-center gap-3">
                <FileText size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                <span className="font-mono text-sm font-bold tracking-widest text-gray-200 group-hover:text-white transition-colors uppercase">
                  Resume
                </span>
                <Download 
                  size={18} 
                  className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-y-1 duration-300" 
                />
              </div>
            </a>
            {/* -------------------------------- */}

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