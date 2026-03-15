import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, FolderOpen, Database, Brain, Globe, Server, X } from 'lucide-react';

// --- DATA: FEATURED & RESEARCH PROJECTS ---
// These are your strongest projects based on the files provided.
const featuredProjects = [
  {
    title: "AutoClaim AI Agent",
    description: "Autonomous FNOL (First Notice of Loss) extraction system. Uses Gemini LLM to parse raw text/PDFs, validate mandatory fields, and automatically route insurance claims based on policy rules.",
    tags: ["TypeScript", "Gemini AI", "React", "Enterprise Logic"],
    links: {
      demo: "https://synapx-assignment.vercel.app",
      repo: "https://github.com/rahul420206/Synapx-Assignment"
    },
    icon: <Brain className="w-6 h-6 text-purple-400" />
  },
  {
    title: "RFP Manager (GenAI)",
    description: "Full-stack AI system that parses incoming emails via IMAP, uses GenAI to extract proposal details, and manages vendor bids. Features real SMTP email automation and PostgreSQL storage.",
    tags: ["Node.js", "PostgreSQL", "IMAP/SMTP", "AI Agents"],
    links: {
      repo: "https://github.com/rahul420206/RFP-Manager"
    },
    icon: <Database className="w-6 h-6 text-blue-400" />
  },
  {
    title: "Project & Task System",
    description: "Enterprise-grade management system built with Spring Boot and Oracle DB. Features cascading task deletion, strict schema validation, and project export capabilities.",
    tags: ["Java Spring Boot", "Oracle DB", "React", "Hibernate"],
    links: {
      repo: "https://github.com/rahul420206/Project-and-Task-Management-System"
    },
    icon: <Server className="w-6 h-6 text-green-400" />
  },
  {
    title: "LLM-Based RAG Search",
    description: "Retrieval-Augmented Generation system. Scrapes real-time web data, processes context, and feeds it to an LLM to generate accurate, cited answers via a Streamlit interface.",
    tags: ["Python", "LangChain", "Flask", "RAG"],
    links: {
      repo: "https://github.com/rahul420206/LLM-based-RAG-Search"
    },
    icon: <Brain className="w-6 h-6 text-pink-400" />
  }
];

// --- DATA: RESEARCH WORK ---
const researchWork = [
  {
    title: "Influence Maximization in Social Networks",
    description: "Deep dive into Graph Theory and Network Analysis. Implemented and optimized Greedy, CELF, and CELF++ algorithms to find influential nodes 300x faster than traditional methods.",
    tags: ["Python", "Graph Theory", "Algorithms", "NetworkX"],
    links: {
      repo: "https://github.com/rahul420206/Self-Aware-Fairness-Influence-Maximization/blob/main/Final%20Report.pdf" // You might want to link the PDF directly if hosted
    },
    type: "Research Paper"
  }
];

// --- DATA: THE ARCHIVE (Small/Hiring Projects) ---
// These are hidden by default and shown in the modal
const archivedProjects = [
  {
    title: "Event Manager (MERN)",
    desc: "Complete event booking system with Auth & MongoDB.",
    stack: "MERN Stack",
    link: "https://event-manager-git-main-rahuls-projects-6503ee86.vercel.app/"
  },
  {
    title: "Earthquake Visualizer",
    desc: "Real-time mapping of seismic activity using USGS API.",
    stack: "React + Leaflet",
    link: "https://5fspxp-5173.csb.app/"
  },
  {
    title: "DocuVault",
    desc: "Secure document versioning system using FastAPI.",
    stack: "Python FastAPI",
    link: "https://github.com/rahul420206/DocuVault"
  },
  {
    title: "Rule Engine (AST)",
    desc: "Abstract Syntax Tree logic evaluator for eligibility rules.",
    stack: "Python + AST",
    link: "https://github.com/rahul420206/Rule-Engine-with-AST"
  },
  {
    title: "Store Rating System",
    desc: "RBAC based rating system for store administration.",
    stack: "PostgreSQL + Express",
    link: "https://github.com/rahul420206/Store-Rating-System"
  },
  {
    title: "Dot-to-Square",
    desc: "Interactive geometry game logic in React.",
    stack: "React",
    link: "https://github.com/rahul420206/Dot-to-Square"
  }
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="p-6 relative z-10 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-purple-500/30 transition-colors">
          {project.icon}
        </div>
        <div className="flex gap-2">
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" 
               className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="Live Demo">
              <ExternalLink size={18} />
            </a>
          )}
          {project.links.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer"
               className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="View Code">
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
        {project.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag: string, i: number) => (
          <span key={i} className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const ArchiveModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-900/20"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="text-purple-400" /> 
                Project Archive
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Development challenges, experiments, and smaller applications.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedProjects.map((proj, i) => (
              <a 
                key={i} 
                href={proj.link} 
                target="_blank" 
                rel="noreferrer"
                className="block p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-200 group-hover:text-purple-300">{proj.title}</h3>
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                </div>
                <p className="text-xs text-purple-400/80 font-mono mt-1 mb-2">{proj.stack}</p>
                <p className="text-sm text-gray-400">{proj.desc}</p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Projects = () => {
  const [showArchive, setShowArchive] = useState(false);

  return (
    <section id="projects" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Selected Works
        </h2>
        <div className="h-1 w-20 bg-purple-500 rounded-full mb-6" />
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          A collection of high-impact projects focusing on AI Agents, Enterprise Systems, and Algorithmic Optimization.
        </p>
      </motion.div>

      {/* --- INSERT YOUR INTERNSHIP PROJECTS HERE --- */}
      {/* 
         You mentioned keeping your internship projects as is. 
         Add your existing <InternshipCard /> components or logic here. 
         Example structure:
         
         <div className="mb-16">
            <h3 className="text-2xl text-white mb-6 flex items-center gap-2"><Briefcase /> Professional Experience</h3>
            <YourInternshipComponents />
         </div>
      */}

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>

      {/* Research Highlight (Full Width) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-8 mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Globe size={120} />
        </div>
        <div className="relative z-10">
          <span className="text-purple-400 font-mono text-sm tracking-wider uppercase mb-2 block">Research & Algorithms</span>
          <h3 className="text-2xl font-bold text-white mb-3">{researchWork[0].title}</h3>
          <p className="text-gray-300 mb-6 max-w-3xl">{researchWork[0].description}</p>
          <a 
            href={researchWork[0].links.repo}
            target="_blank"
            rel="noreferrer" 
            className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <FolderOpen size={16} /> Read Report
          </a>
        </div>
      </motion.div>

      {/* Archive Trigger */}
      <div className="text-center">
        <button 
          onClick={() => setShowArchive(true)}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-300"
        >
          <FolderOpen size={18} className="group-hover:text-purple-400 transition-colors" />
          <span>View Project Archive</span>
        </button>
        <p className="text-xs text-gray-600 mt-4 font-mono">
          Includes experimental apps, hiring assessments, and utility tools.
        </p>
      </div>

      {/* Modal for Archive */}
      <ArchiveModal isOpen={showArchive} onClose={() => setShowArchive(false)} />

    </section>
  );
};

export default Projects;