export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Indie Game' | 'Gameplay & Physics' | '3D & Shaders' | 'Cozy Sim';
  description: string;
  longDescription: string;
  metrics: ProjectMetric[];
  features: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  color: string;
  glowColor?: string;
  imageUrl: string;
  modelType: 'star' | 'potion' | 'gem' | 'cartridge';
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'gameplay' | 'engine' | 'graphics' | 'audio-design';
  level: number;
  iconName: string;
  color: string;
  description: string;
  projectsCount: number;
  position: [number, number, number];
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  experience: {
    period: string;
    role: string;
    company: string;
    description: string;
  }[];
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    discord: string;
    email: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
}
