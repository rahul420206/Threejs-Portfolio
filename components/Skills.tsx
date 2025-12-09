import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';
import { useSound } from '../utils/sound';

const Skills = () => {
  const { playHover } = useSound();

  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-white"
        >
          Technical <span className="text-primary">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILLS.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-card backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
              onMouseEnter={playHover}
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-100 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-gray-300 font-mono hover:bg-white/10 hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
