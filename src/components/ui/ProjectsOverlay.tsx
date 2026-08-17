import { motion } from 'framer-motion';
import { Gamepad2, ChevronLeft, ChevronRight, Eye, Play } from 'lucide-react';
import { projectsData } from '../../data/portfolioData';
import type { ProjectItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';

interface ProjectsOverlayProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export function ProjectsOverlay({
  activeIndex,
  setActiveIndex,
  onSelectProject,
}: ProjectsOverlayProps) {
  const currentProject = projectsData[activeIndex];

  const handlePrev = () => {
    soundManager.playWhoosh();
    setActiveIndex((activeIndex - 1 + projectsData.length) % projectsData.length);
  };

  const handleNext = () => {
    soundManager.playWhoosh();
    setActiveIndex((activeIndex + 1) % projectsData.length);
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#e76f51] mb-3 shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>STATION 04 // 3D GAME SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#38271e] tracking-tight">
          LATEST{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e76f51] via-[#f4a261] to-[#8da178]">
            PROJECTS
          </span>
        </h2>
        <p className="text-sm text-[#5c4a3f] mt-2 font-medium">
          Interact with the 3D rotating cards directly in the scene or browse through featured games.
        </p>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left: Active Game Spotlight Card (7 cols) */}
        <div className="lg:col-span-7 pointer-events-auto">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-[#8da178] flex flex-col gap-5 shadow-2xl bg-white/95"
          >
            {/* Tag & Index */}
            <div className="flex items-center justify-between">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-heading font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: `${currentProject.color}25`,
                  color: currentProject.color,
                  border: `2px solid ${currentProject.color}60`,
                }}
              >
                ★ {currentProject.category} ★
              </span>
              <span className="text-xs font-mono text-[#786558] font-bold">
                0{activeIndex + 1} / 0{projectsData.length}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#38271e] mb-2">
                {currentProject.title}
              </h3>
              <p className="text-sm sm:text-base text-[#5c4a3f] leading-relaxed font-medium">
                {currentProject.description}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {currentProject.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl bg-[#f4ebe1] border border-[#e6d8cb] text-xs font-mono text-[#38271e] font-bold"
                >
                  {tech}
                </span>
              ))}
              {currentProject.techStack.length > 4 && (
                <span className="px-3 py-1 rounded-xl bg-white border border-[#e6d8cb] text-xs font-mono text-[#786558]">
                  +{currentProject.techStack.length - 4} more
                </span>
              )}
            </div>

            {/* Action Buttons (Matching Reference "VIEW PROJECT") */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t-2 border-[#e6d8cb]">
              <button
                onClick={() => {
                  soundManager.playOpenModal();
                  onSelectProject(currentProject);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#ffd166]" />
                <span>VIEW PROJECT SPECS</span>
              </button>

              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#ff9e80] text-[#38271e] font-heading font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current text-[#ff9e80]" />
                <span>Play WebGL Demo</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right: Carousel Navigation Switcher (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 pointer-events-auto items-start lg:items-end">
          <div className="flex items-center gap-3 p-3.5 rounded-3xl glass-panel border-2 border-[#e6d8cb] shadow-lg bg-white/95">
            <button
              onClick={handlePrev}
              onMouseEnter={() => soundManager.playHover()}
              title="Previous Game"
              className="p-3 rounded-2xl bg-[#f4ebe1] hover:bg-[#ff9e80]/30 hover:text-[#38271e] text-[#5c4a3f] border border-[#e6d8cb] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-2">
              {projectsData.map((_, i) => (
                <button
                  key={`dot-proj-${i}`}
                  onClick={() => {
                    soundManager.playWhoosh();
                    setActiveIndex(i);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`transition-all rounded-full cursor-pointer ${
                    i === activeIndex
                      ? 'w-8 h-3 bg-gradient-to-r from-[#e76f51] to-[#f4a261] shadow-md'
                      : 'w-3 h-3 bg-[#e6d8cb] hover:bg-[#ff9e80]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              onMouseEnter={() => soundManager.playHover()}
              title="Next Game"
              className="p-3 rounded-2xl bg-[#f4ebe1] hover:bg-[#ff9e80]/30 hover:text-[#38271e] text-[#5c4a3f] border border-[#e6d8cb] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
