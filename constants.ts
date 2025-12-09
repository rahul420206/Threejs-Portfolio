import { Project, Experience, SkillCategory } from './types';
import { Github, Linkedin, Mail, FileText, Code2, Server, Globe } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Rahul Matta",
  role: "Full Stack Developer",
  tagline: "Building scalable, aesthetic, and intelligent web solutions.",
  email: "420206@student.nitandhra.ac.in", // Or generic email if preferred
  phone: "+91-8074126595",
  location: "India",
  social: [
    { name: "GitHub", icon: Github, url: "https://github.com/rahul420206" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/rahul-matta-a42585200/" },
    { name: "Email", icon: Mail, url: "mailto:420206@student.nitandhra.ac.in" },
    { name: "Resume", icon: FileText, url: "#resume" }, // Placeholder for actual resume link
  ]
};

export const SKILLS: SkillCategory[] = [
  {
    title: "Frontend Development",
    skills: ["React.js", "TypeScript", "JavaScript (ES6+)", "Redux", "HTML5/CSS3", "Tailwind CSS", "Material UI", "Bootstrap"]
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Express.js", "Python", "Flask", "Django", "Spring Boot", "Laravel", "RESTful APIs", "OAuth 2.0"]
  },
  {
    title: "Database & Cloud",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "AWS", "Git/GitHub", "Docker"]
  },
  {
    title: "Automation & Tools",
    skills: ["Selenium", "UiPath", "JIRA", "Agile/Scrum", "CI/CD Pipeline", "Machine Learning"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    company: "Codetru",
    role: "Software Intern",
    period: "Apr 2025 – Present",
    description: [
      "Contributing to front-end development and production support for enterprise platforms (Surf & Japfu).",
      "Improving UI responsiveness using React, TypeScript, Redux, and MUI.",
      "Handling API integrations and debugging performance issues in an Agile setup."
    ],
    technologies: ["React", "TypeScript", "Redux", "MUI"]
  },
  {
    company: "Adiquity Technologies",
    role: "Full Stack Developer Intern",
    period: "May 2024 – Nov 2024",
    description: [
      "Developed and optimized backend APIs using Flask and Laravel, reducing response time by 25%.",
      "Conducted automation and regression testing to identify critical bugs.",
      "Collaborated on feature scalability, code reviews, and security improvements."
    ],
    technologies: ["Flask", "Laravel", "Python", "Automation Testing"]
  }
];

export const PROJECTS: Project[] = [
  {
    title: "Surf: US Payroll Platform",
    description: "Built key UI components for a payroll platform, implementing full-stack OAuth 2.0 authentication (Google/Microsoft) and enhancing payroll accuracy with dynamic implementations.",
    tags: ["React", "TypeScript", "Redux", "MUI", "OAuth 2.0"],
    link: "https://codetru.com", // Placeholder
  },
  {
    title: "Japfu: Workforce Management",
    description: "Developed modules for timesheet management, onboarding, and billing. Designed intuitive UI components that streamlined administrative workflows.",
    tags: ["React", "MUI", "Enterprise"],
    link: "https://codetru.com",
  },
  {
    title: "Fairness Influence Maximization",
    description: "Implemented a fairness-aware algorithm using adversarial graph embeddings to ensure unbiased influence spread across social networks using PyTorch.",
    tags: ["Python", "PyTorch", "Graph Neural Networks", "AI/ML"],
    github: "https://github.com/rahul420206",
  },
  {
    title: "LLM Based RAG Search",
    description: "Built a retrieval-augmented generation (RAG) system integrating Cohere API, Flask, and Streamlit for intelligent document-based Q&A.",
    tags: ["LLM", "RAG", "Flask", "Streamlit"],
    github: "https://github.com/rahul420206",
  },
  {
    title: "Health Report Analyzer",
    description: "Created an AI-driven app to analyze health reports using Python, Pandas, and NLP to extract and summarize medical insights.",
    tags: ["NLP", "Python", "Pandas"],
    github: "https://github.com/rahul420206",
  }
];

export const EDUCATION = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    school: "National Institute of Technology (NIT), Andhra Pradesh",
    period: "Aug 2020 – May 2024",
    description: "Strong foundations in Data Structures, Algorithms, Machine Learning, and Full Stack Development."
  }
];
