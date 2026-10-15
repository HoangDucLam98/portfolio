import { lazy, Suspense, useState, useEffect } from 'react';
import { HeroOverlay } from './components/ui/HeroOverlay';
import { AboutOverlay } from './components/ui/AboutOverlay';
import { SkillsOverlay } from './components/ui/SkillsOverlay';
import { ProjectsOverlay } from './components/ui/ProjectsOverlay';
import { ContactOverlay } from './components/ui/ContactOverlay';
import { NavigationHUD } from './components/ui/NavigationHUD';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WebGLCheck } from './components/ui/WebGLCheck';
import { AchievementToast } from './components/ui/AchievementToast';
import { achievementsManager } from './game/achievements';
import { soundManager } from './audio/audioEngine';
import type { SkillItem, ProjectItem, TimeOfDay } from './types';

const loadSceneContainer = () => import('./components/3d/SceneContainer');
const SceneContainer = lazy(() =>
  loadSceneContainer().then(({ SceneContainer }) => ({ default: SceneContainer }))
);
const ProjectModal = lazy(() =>
  import('./components/ui/ProjectModal').then(({ ProjectModal }) => ({ default: ProjectModal }))
);
const AchievementsModal = lazy(() =>
  import('./components/ui/AchievementsModal').then(({ AchievementsModal }) => ({ default: AchievementsModal }))
);
const MiniGameHUD = lazy(() =>
  import('./components/ui/MiniGameHUD').then(({ MiniGameHUD }) => ({ default: MiniGameHUD }))
);

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Advanced Feature States
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [dioramaMode, setDioramaMode] = useState(false);
  const [isMiniGamePlaying, setIsMiniGamePlaying] = useState(false);
  const [starsCollected, setStarsCollected] = useState(0);
  const [totalStars, setTotalStars] = useState(5);
  const [hasWonMiniGame, setHasWonMiniGame] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Skill Section State
  const [activeSkillCategory, setActiveSkillCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Project Section State
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  // Contact Section State
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isContactSuccess, setIsContactSuccess] = useState(false);
  const [isContactFocused, setIsContactFocused] = useState(false);

  // Scrollytelling scroll listener
  useEffect(() => {
    let scheduledFrame = 0;

    const handleScroll = () => {
      if (isMiniGamePlaying || scheduledFrame !== 0) return;

      scheduledFrame = window.requestAnimationFrame(() => {
        scheduledFrame = 0;
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
        const sectionIndex = Math.min(Math.floor(progress * 5), 4);
        setActiveSection((current) => current === sectionIndex ? current : sectionIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scheduledFrame !== 0) window.cancelAnimationFrame(scheduledFrame);
    };
  }, [isMiniGamePlaying]);

  // Global Key Shortcut [G] to launch mini-game, [ESC] to exit
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'KeyG' && !isMiniGamePlaying) {
        soundManager.playSuccess();
        setIsMiniGamePlaying(true);
        achievementsManager.unlock('handheld_gamer');
      } else if (e.code === 'Escape' && isMiniGamePlaying) {
        soundManager.playClick();
        setIsMiniGamePlaying(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isMiniGamePlaying]);

  const handleLoaded = () => {
    setIsEntering(true);
    void loadSceneContainer().then(() => {
      achievementsManager.unlock('first_steps');
      setIsLoading(false);
      setIsEntering(false);
    }).catch(() => {
      setIsEntering(false);
    });
  };

  const scrollToSection = (index: number) => {
    if (isMiniGamePlaying) {
      setIsMiniGamePlaying(false);
    }
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];
    const el = document.getElementById(sectionIds[index]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenProjectModal = (project: ProjectItem) => {
    setModalProject(project);
    achievementsManager.trackProjectView(project.id);
  };

  const handleStartMiniGame = () => {
    soundManager.playSuccess();
    setIsMiniGamePlaying(true);
    setHasWonMiniGame(false);
    setStarsCollected(0);
    achievementsManager.unlock('handheld_gamer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartMiniGame = () => {
    setHasWonMiniGame(false);
    setStarsCollected(0);
  };

  return (
    <WebGLCheck>
      {/* 3D Loading Screen */}
      {isLoading && <LoadingScreen onLoaded={handleLoaded} isEntering={isEntering} />}

      {/* Achievement Toast Banner */}
      <AchievementToast />

      {/* Achievements Showcase Modal */}
      {isAchievementsOpen && (
        <Suspense fallback={null}>
          <AchievementsModal
            isOpen
            onClose={() => setIsAchievementsOpen(false)}
          />
        </Suspense>
      )}

      {/* Playable 3D Mini-Game Overlay */}
      {isMiniGamePlaying && (
        <Suspense fallback={null}>
          <MiniGameHUD
            isPlaying
            starsCollected={starsCollected}
            totalStars={totalStars}
            hasWon={hasWonMiniGame}
            onExit={() => setIsMiniGamePlaying(false)}
            onRestart={handleRestartMiniGame}
          />
        </Suspense>
      )}

      {/* Fixed 3D WebGL Canvas Scene */}
      {!isLoading && (
        <Suspense fallback={null}>
          <SceneContainer
            activeSection={activeSection}
            timeOfDay={timeOfDay}
            dioramaMode={dioramaMode}
            isMiniGamePlaying={isMiniGamePlaying}
            onStarsCountChange={(count, total) => {
              setStarsCollected(count);
              setTotalStars(total);
            }}
            onMiniGameWin={() => setHasWonMiniGame(true)}
            activeSkillCategory={activeSkillCategory}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
            activeProjectIndex={activeProjectIndex}
            onSelectProject={handleOpenProjectModal}
            onHoverProjectIndex={setActiveProjectIndex}
            isSubmittingContact={isSubmittingContact}
            isContactSuccess={isContactSuccess}
            isContactFocused={isContactFocused}
          />
        </Suspense>
      )}

      {/* Top Floating Navigation HUD (Hidden during mini-game) */}
      {!isMiniGamePlaying && (
        <NavigationHUD
          activeSection={activeSection}
          onNavigate={scrollToSection}
          timeOfDay={timeOfDay}
          onTimeOfDayChange={setTimeOfDay}
          dioramaMode={dioramaMode}
          onToggleDiorama={() => setDioramaMode(!dioramaMode)}
          onOpenMiniGame={handleStartMiniGame}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />
      )}

      {/* Scrollytelling Content Overlays */}
      <main className={`relative z-10 w-full flex flex-col ${isMiniGamePlaying ? 'opacity-0 pointer-events-none' : ''}`}>
        {/* Section 01: Hero */}
        <HeroOverlay
          onExplore={() => scrollToSection(1)}
          onOpenContact={() => scrollToSection(4)}
        />

        {/* Section 02: About / CLI */}
        <AboutOverlay
          onGoToProjects={() => scrollToSection(3)}
          onGoToContact={() => scrollToSection(4)}
        />

        {/* Section 03: Skills Inventory */}
        <SkillsOverlay
          activeCategory={activeSkillCategory}
          setActiveCategory={setActiveSkillCategory}
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
        />

        {/* Section 04: Projects Carousel */}
        <ProjectsOverlay
          activeIndex={activeProjectIndex}
          setActiveIndex={setActiveProjectIndex}
          onSelectProject={handleOpenProjectModal}
        />

        {/* Section 05: Contact Campfire */}
        <ContactOverlay
          isSubmitting={isSubmittingContact}
          setIsSubmitting={setIsSubmittingContact}
          isSuccess={isContactSuccess}
          setIsSuccess={(val) => {
            setIsContactSuccess(val);
            if (val) {
              achievementsManager.unlock('carrier_pigeon');
            }
          }}
          setIsFocused={setIsContactFocused}
          onScrollToTop={() => scrollToSection(0)}
        />
      </main>

      {/* Project Details Modal */}
      {modalProject && (
        <Suspense fallback={null}>
          <ProjectModal
            project={modalProject}
            onClose={() => setModalProject(null)}
          />
        </Suspense>
      )}
    </WebGLCheck>
  );
}

export default App;
