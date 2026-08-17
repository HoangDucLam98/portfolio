import { useState, useEffect } from 'react';
import { SceneContainer } from './components/3d/SceneContainer';
import { NavigationHUD } from './components/ui/NavigationHUD';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WebGLCheck } from './components/ui/WebGLCheck';
import { HeroOverlay } from './components/ui/HeroOverlay';
import { AboutOverlay } from './components/ui/AboutOverlay';
import { SkillsOverlay } from './components/ui/SkillsOverlay';
import { ProjectsOverlay } from './components/ui/ProjectsOverlay';
import { ContactOverlay } from './components/ui/ContactOverlay';
import { ProjectModal } from './components/ui/ProjectModal';
import type { SkillItem, ProjectItem } from './types';
import { skillsData } from './data/skillsData';

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  // Skills state
  const [activeSkillCategory, setActiveSkillCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(skillsData[0]);

  // Projects state
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  // Contact state
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isContactSuccess, setIsContactSuccess] = useState(false);
  const [isContactFocused, setIsContactFocused] = useState(false);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
      setScrollProgress(progress);

      // Determine active section (5 stations: 0 to 4)
      const sectionIdx = Math.min(4, Math.floor(progress * 4.99));
      setActiveSection(sectionIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (index: number) => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];
    const el = document.getElementById(sectionIds[index]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#030712] text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* WebGL Support Validator */}
      <WebGLCheck />

      {/* Initial 3D Loading Screen */}
      {!isLoaded && <LoadingScreen onLoaded={() => setIsLoaded(true)} />}

      {/* Persistent Navigation HUD */}
      <NavigationHUD
        activeSection={activeSection}
        onNavigate={navigateToSection}
      />

      {/* 3D WebGL Canvas Layer (Fixed in background) */}
      <SceneContainer
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        activeSkillCategory={activeSkillCategory}
        selectedSkill={selectedSkill}
        onSelectSkill={setSelectedSkill}
        activeProjectIndex={activeProjectIndex}
        onSelectProject={setModalProject}
        onHoverProjectIndex={setActiveProjectIndex}
        isSubmittingContact={isSubmittingContact}
        isContactSuccess={isContactSuccess}
        isContactFocused={isContactFocused}
      />

      {/* Scrollytelling Content Overlays */}
      <main className="relative z-10">
        {/* Section 01: Hero */}
        <HeroOverlay
          onExplore={() => navigateToSection(1)}
          onOpenContact={() => navigateToSection(4)}
        />

        {/* Section 02: About & Terminal */}
        <AboutOverlay
          onGoToProjects={() => navigateToSection(3)}
          onGoToContact={() => navigateToSection(4)}
        />

        {/* Section 03: Skills Constellation */}
        <SkillsOverlay
          activeCategory={activeSkillCategory}
          setActiveCategory={setActiveSkillCategory}
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
        />

        {/* Section 04: 3D Projects Showcase */}
        <ProjectsOverlay
          activeIndex={activeProjectIndex}
          setActiveIndex={setActiveProjectIndex}
          onSelectProject={setModalProject}
        />

        {/* Section 05: Contact & Transmission */}
        <ContactOverlay
          isSubmitting={isSubmittingContact}
          setIsSubmitting={setIsSubmittingContact}
          isSuccess={isContactSuccess}
          setIsSuccess={setIsContactSuccess}
          setIsFocused={setIsContactFocused}
          onScrollToTop={() => navigateToSection(0)}
        />
      </main>

      {/* Project Inspection Modal */}
      <ProjectModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </div>
  );
}

export default App;
