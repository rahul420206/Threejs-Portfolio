import { ReactNode } from 'react';

export interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}
