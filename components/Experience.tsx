import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EXPERIENCE, EDUCATION } from '../constants';
import { Briefcase, GraduationCap } from 'lucide-react';

const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for the specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to height (0% to 100%)
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-white"
        >
          Work <span className="text-primary">History</span>
        </motion.h2>

        <div className="relative space-y-12">
          
          {/* --- Interactive Timeline Line (Desktop) --- */}
          {/* Background Grey Line */}
          <div className="hidden md:block absolute left-[30%] top-2 bottom-0 w-[2px] bg-white/10" />
          
          {/* Filled Violet Line (Animated) */}
          <motion.div 
            style={{ height: lineHeight }}
            className="hidden md:block absolute left-[30%] top-2 w-[2px] bg-gradient-to-b from-primary to-secondary shadow-[0_0_10px_rgba(139,92,246,0.5)] origin-top" 
          />
          {/* ------------------------------------------- */}

          {EXPERIENCE.map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-0 group"
            >
              {/* Dot on the timeline */}
              <div className="hidden md:block absolute left-[30%] top-6 -translate-x-[5px] w-3 h-3 rounded-full bg-[#050505] border-2 border-primary z-10 group-hover:scale-125 group-hover:bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />

              <div className="md:flex gap-12 items-start">
                {/* Left: Date & Company */}
                <div className="md:w-[30%] md:text-right md:pr-12 mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">{job.company}</h3>
                  <div className="text-primary font-mono mt-1 text-sm">{job.period}</div>
                </div>

                {/* Right: Details */}
                <div className="md:w-[70%] bg-card backdrop-blur-sm border border-white/5 p-8 rounded-2xl group-hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Briefcase size={20} className="text-primary" />
                    <h4 className="text-xl font-semibold text-gray-100">{job.role}</h4>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {job.description.map((desc, i) => (
                      <li key={i} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map(tech => (
                      <span key={tech} className="text-xs font-mono text-gray-500 border border-white/5 px-2 py-1 rounded group-hover:border-primary/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.h3 
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           className="text-3xl font-bold mt-24 mb-12 text-white flex items-center gap-3"
        >
          <GraduationCap className="text-primary" /> Education
        </motion.h3>

        {EDUCATION.map((edu, idx) => (
           <motion.div
           key={idx}
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.5 }}
           className="bg-card backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300"
         >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <h4 className="text-xl font-bold text-white">{edu.school}</h4>
              <span className="text-primary font-mono text-sm">{edu.period}</span>
            </div>
            <div className="text-lg text-gray-300 mb-2">{edu.degree}</div>
            <p className="text-gray-400 text-sm">{edu.description}</p>
         </motion.div>
        ))}

      </div>
    </section>
  );
};

export default Experience;
