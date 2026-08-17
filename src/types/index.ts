export type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'contact';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Indie Game' | 'Gameplay & Physics' | '3D & Shaders' | 'Cozy Sim';
  description: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  liveUrl: string;
  githubUrl: string;
  color: string;
  glowColor: string;
  modelType: 'star' | 'gem' | 'potion' | 'cartridge';
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'gameplay' | 'engine' | 'graphics' | 'audio-design';
  level: number; // 0 to 100
  iconName: string;
  color: string;
  description: string;
  projectsCount: number;
  position: [number, number, number];
}

export interface StationConfig {
  id: SectionId;
  name: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  fov: number;
}
