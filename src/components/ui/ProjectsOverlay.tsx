import { motion } from 'framer-motion';
import { Gamepad2, ChevronLeft, ChevronRight, Eye, Play, Sparkles, ExternalLink } from 'lucide-react';
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
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-4 sm:px-10 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Section Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#e76f51] mb-2 shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>STATION 04 // 3D GAME SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#38271e] tracking-tight">
          PUBLISHED{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e76f51] via-[#f4a261] to-[#8da178]">
            MOBILE GAMES
          </span>
        </h2>
        <p className="text-sm text-[#5c4a3f] mt-1 font-medium">
          Official in-game captures and technical architecture from real shipped mobile titles.
        </p>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Game Spotlight Card (7 cols) */}
        <div className="lg:col-span-7 pointer-events-auto">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="p-5 sm:p-7 rounded-3xl glass-panel-glow border-2 border-[#8da178] flex flex-col gap-4 shadow-2xl bg-white/95"
          >
            {/* Visual Game Cover Banner with High-Res Screenshot */}
            <div
              onClick={() => {
                soundManager.playOpenModal();
                onSelectProject(currentProject);
              }}
              className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#e6d8cb] shadow-md group cursor-pointer bg-[#f4ebe1]"
            >
              <img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-50 transition-opacity" />

              {/* Tag & Index Badge inside Image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-xl text-xs font-heading font-bold tracking-wider uppercase backdrop-blur-md shadow-sm"
                  style={{
                    backgroundColor: `${currentProject.color}ee`,
                    color: '#fff',
                  }}
                >
                  ★ {currentProject.category} ★
                </span>
              </div>

              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-mono text-white font-bold">
                0{activeIndex + 1} / 0{projectsData.length}
              </div>

              {/* Quick Play/Inspect Hover Badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-heading font-bold text-[#38271e] shadow-md group-hover:bg-[#ffd166] transition-colors">
                <Eye className="w-3.5 h-3.5 text-[#e76f51]" />
                <span>View Full Gallery & Specs</span>
              </div>
            </div>

            {/* Title & Official App Icon Row */}
            <div className="flex items-start gap-3.5">
              {currentProject.iconUrl && (
                <img
                  src={currentProject.iconUrl}
                  alt={`${currentProject.title} Icon`}
                  className="w-14 h-14 rounded-2xl shadow-md border-2 border-[#e6d8cb] shrink-0 object-cover bg-white"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#38271e] truncate">
                  {currentProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#e76f51] font-heading font-bold mb-1">
                  {currentProject.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[#5c4a3f] leading-relaxed font-medium line-clamp-2">
                  {currentProject.description}
                </p>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-lg bg-[#f4ebe1] border border-[#e6d8cb] text-[11px] font-mono text-[#38271e] font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t-2 border-[#e6d8cb]">
              <button
                onClick={() => {
                  soundManager.playOpenModal();
                  onSelectProject(currentProject);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#ffd166]" />
                <span>VIEW SPECS & GALLERY</span>
              </button>

              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#8da178] text-[#38271e] font-heading font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current text-[#8da178]" />
                <span>OFFICIAL STORE PAGE</span>
                <ExternalLink className="w-3 h-3 text-[#786558]" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right: Visual Thumbnails & Carousel Switcher (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 pointer-events-auto">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-3 rounded-2xl glass-panel border-2 border-[#e6d8cb] shadow-md bg-white/95">
            <span className="text-xs font-heading font-bold text-[#786558] flex items-center gap-1.5 ml-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
              SELECT GAME:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                onMouseEnter={() => soundManager.playHover()}
                title="Previous Game"
                className="p-2 rounded-xl bg-[#f4ebe1] hover:bg-[#ff9e80]/30 text-[#38271e] border border-[#e6d8cb] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                onMouseEnter={() => soundManager.playHover()}
                title="Next Game"
                className="p-2 rounded-xl bg-[#f4ebe1] hover:bg-[#ff9e80]/30 text-[#38271e] border border-[#e6d8cb] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Game Thumbnail List */}
          <div className="grid grid-cols-2 gap-3">
            {projectsData.map((project, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    soundManager.playWhoosh();
                    setActiveIndex(idx);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 shadow-sm ${
                    isSelected
                      ? 'border-[#e76f51] ring-4 ring-[#e76f51]/20 scale-[1.02] shadow-lg'
                      : 'border-[#e6d8cb] hover:border-[#8da178] opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-24 sm:h-28 overflow-hidden bg-[#f4ebe1] relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {project.iconUrl && (
                      <img
                        src={project.iconUrl}
                        alt="icon"
                        className="absolute bottom-1.5 left-1.5 w-7 h-7 rounded-lg border-2 border-white shadow-md object-cover bg-white"
                      />
                    )}
                  </div>

                  {/* Thumbnail Info Strip */}
                  <div className="p-2.5 bg-white flex flex-col justify-center">
                    <div className="text-xs font-heading font-extrabold text-[#38271e] truncate">
                      {project.title}
                    </div>
                    <div className="text-[10px] font-mono text-[#786558] truncate">
                      {project.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
