import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Layers, Gamepad2, Sparkles, Code2, Play, ExternalLink, ImageIcon, Film } from 'lucide-react';
import type { ProjectItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';
import { useModalA11y } from '../../hooks/useModalA11y';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function resolveTrailer(trailerUrl: string): { kind: 'iframe' | 'video'; src: string } {
  const youtubeMatch = trailerUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (youtubeMatch) {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}` };
  }
  return { kind: 'video', src: trailerUrl };
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState<'screenshots' | 'trailer'>('screenshots');

  const handleClose = () => {
    soundManager.playCloseModal();
    onClose();
  };

  const containerRef = useModalA11y<HTMLDivElement>(Boolean(project), handleClose);

  useEffect(() => {
    setActiveImgIndex(0);
    setMediaTab('screenshots');
  }, [project]);

  if (!project) return null;

  const gallery = project.galleryUrls && project.galleryUrls.length > 0
    ? project.galleryUrls
    : [project.imageUrl];

  const currentDisplayImage = gallery[activeImgIndex] || project.imageUrl;
  const trailer = project.trailerUrl ? resolveTrailer(project.trailerUrl) : null;
  const showTrailer = trailer !== null && mediaTab === 'trailer';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          ref={containerRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project details`}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel-glow border-2 border-[#8da178] p-6 sm:p-8 shadow-2xl bg-white text-[#38271e] flex flex-col gap-6 outline-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#e6d8cb] pb-4">
            <div className="flex items-start gap-4">
              {project.iconUrl && (
                <img
                  src={project.iconUrl}
                  alt={`${project.title} Icon`}
                  decoding="async"
                  className="w-16 h-16 rounded-2xl shadow-md border-2 border-[#e6d8cb] shrink-0 object-cover bg-white"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-3 py-0.5 rounded-full text-xs font-heading font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: `${project.color}25`,
                      color: '#3d3328',
                      border: `2px solid ${project.color}60`,
                    }}
                  >
                    ★ {project.category} ★
                  </span>
                  <span className="text-xs font-mono text-[#786558] font-bold">
                    // OFFICIAL STORE SHIPPED TITLE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#38271e] tracking-tight">
                  {project.title}
                </h2>
                <p className="text-sm sm:text-base text-[#e76f51] font-heading font-bold mt-0.5">
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close project details"
              className="p-2.5 rounded-2xl bg-[#f4ebe1] hover:bg-[#e6d8cb] border border-[#e6d8cb] text-[#38271e] transition-colors cursor-pointer shrink-0 ml-3"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media: Screenshots / Trailer */}
          <div className="flex flex-col gap-3">
            {trailer && (
              <div className="flex items-center gap-2" role="tablist" aria-label="Project media">
                <button
                  role="tab"
                  aria-selected={mediaTab === 'screenshots'}
                  onClick={() => {
                    soundManager.playClick();
                    setMediaTab('screenshots');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                    mediaTab === 'screenshots'
                      ? 'bg-[#4a332d] text-white shadow-sm'
                      : 'bg-[#f4ebe1] text-[#786558] border border-[#e6d8cb] hover:bg-[#e6d8cb]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Screenshots
                </button>
                <button
                  role="tab"
                  aria-selected={mediaTab === 'trailer'}
                  onClick={() => {
                    soundManager.playClick();
                    setMediaTab('trailer');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                    mediaTab === 'trailer'
                      ? 'bg-[#4a332d] text-white shadow-sm'
                      : 'bg-[#f4ebe1] text-[#786558] border border-[#e6d8cb] hover:bg-[#e6d8cb]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  Trailer
                </button>
              </div>
            )}

            {showTrailer ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#e6d8cb] shadow-md bg-black">
                {trailer.kind === 'iframe' ? (
                  <iframe
                    src={trailer.src}
                    title={`${project.title} Trailer`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={trailer.src}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              <>
                <div className="relative w-full h-56 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#e6d8cb] shadow-md bg-[#f4ebe1]">
                  <img
                    src={currentDisplayImage}
                    alt={`${project.title} Gameplay Screenshot ${activeImgIndex + 1}`}
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ffd166]" />
                    Official Store Gameplay Capture {activeImgIndex + 1} / {gallery.length}
                  </div>
                </div>

                {/* Interactive Thumbnail Gallery Strip */}
                {gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={`thumb-${idx}`}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveImgIndex(idx);
                        }}
                        className={`relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                          activeImgIndex === idx
                            ? 'border-[#e76f51] ring-2 ring-[#e76f51]/40 scale-105 shadow-md'
                            : 'border-[#e6d8cb] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Key Game Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="p-3.5 rounded-2xl bg-[#fbf4eb] border-2 border-[#e6d8cb] flex items-center justify-between shadow-sm"
              >
                <span className="text-xs font-mono text-[#786558] font-bold">{m.label}</span>
                <span className="text-sm font-heading font-extrabold text-[#e76f51]">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Deep Architectural Breakdown */}
          <div>
            <h3 className="text-xs font-heading font-extrabold text-[#526545] uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4" />
              GAMEPLAY MECHANICS & ARCHITECTURE
            </h3>
            <p className="text-sm sm:text-base text-[#5c4a3f] leading-relaxed font-medium">
              {project.longDescription}
            </p>
          </div>

          {/* Core Technical Highlights */}
          <div>
            <h3 className="text-xs font-heading font-extrabold text-[#bc4b2d] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              KEY GAMEPLAY FEATURES & SHADERS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div
                  key={`feat-${i}`}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#fbf4eb] border border-[#e6d8cb] text-xs sm:text-sm text-[#38271e] font-medium shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#8da178] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div>
            <h3 className="text-xs font-heading font-extrabold text-[#786558] uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              GAME ENGINE & PIPELINE
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f4ebe1] border border-[#e6d8cb] text-xs font-mono font-bold text-[#38271e]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-[#e6d8cb]">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#ffd166]" />
                  <span>VISIT APP STORE / GOOGLE PLAY</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#8da178] text-[#38271e] font-heading font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-[#8da178]" />
                  <span>VIEW SOURCE CODE</span>
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
