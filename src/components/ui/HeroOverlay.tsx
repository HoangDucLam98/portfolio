import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Play, BookOpen, Layers, FileDown } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../audio/audioEngine';

const baseUrl = import.meta.env.BASE_URL || '/';
const cvUrl = `${baseUrl}HoangDucLam_CV.pdf`;

interface HeroOverlayProps {
  onExplore: () => void;
  onOpenContact: () => void;
}

export function HeroOverlay({ onExplore, onOpenContact }: HeroOverlayProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Top Main Hero Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pt-8 sm:pt-12">
        {/* Left / Main Text & CTAs */}
        <div className="max-w-2xl">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#526545] mb-6 shadow-sm pointer-events-auto"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8da178] animate-ping" />
            <span>{personalInfo.availability}</span>
          </motion.div>

          {/* Hero Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-[#38271e] tracking-tight leading-[1.08] mb-6"
          >
            CRAFTING{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8da178] via-[#e76f51] to-[#f4a261]">
              WHIMSICAL 3D
            </span>{' '}
            GAME WORLDS
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5c4a3f] max-w-2xl leading-relaxed mb-8 font-medium"
          >
            {personalInfo.tagline}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pointer-events-auto"
          >
            <button
              onClick={() => {
                soundManager.playClick();
                onExplore();
              }}
              onMouseEnter={() => soundManager.playHover()}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-[#4a332d]/20 transition-all cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-current text-[#ffd166] group-hover:scale-110 transition-transform" />
              <span>Explore 3D Games</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenContact();
              }}
              onMouseEnter={() => soundManager.playHover()}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#8da178] text-[#38271e] font-heading font-extrabold text-sm tracking-wider uppercase transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#ff9e80]" />
              <span>Visit Campfire</span>
            </button>

            <a
              href={cvUrl}
              download="HoangDucLam_CV.pdf"
              onClick={() => soundManager.playClick()}
              onMouseEnter={() => soundManager.playHover()}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#8da178] text-[#38271e] font-heading font-extrabold text-sm tracking-wider uppercase transition-all cursor-pointer shadow-md"
            >
              <FileDown className="w-4 h-4 text-[#70b0d0]" />
              <span>Download CV</span>
            </a>
          </motion.div>
        </div>

        {/* Quick Nav Chips (Matching Reference Image) */}
        <div className="hidden lg:flex flex-col gap-3 pointer-events-auto mt-6">
          <button
            onClick={() => {
              soundManager.playClick();
              const el = document.getElementById('projects');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#ff9e80] shadow-sm hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffb4a2]/30 flex items-center justify-center text-[#e76f51] group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xs text-[#38271e] uppercase">RECENT WORK</div>
              <div className="text-[11px] font-mono text-[#786558]">4 Shipped Games</div>
            </div>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              const el = document.getElementById('skills');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border-2 border-[#e6d8cb] hover:border-[#8da178] shadow-sm hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8da178]/25 flex items-center justify-center text-[#8da178] group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xs text-[#38271e] uppercase">TECH STACK</div>
              <div className="text-[11px] font-mono text-[#786558]">Unity, Shaders, Godot</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Game Metrics Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-12"
      >
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto pointer-events-auto">
          {personalInfo.stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-white border-2 border-[#e6d8cb] flex flex-col shadow-sm"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-[#e76f51]">
                {stat.value}
              </span>
              <span className="text-[11px] font-mono text-[#786558] uppercase font-bold tracking-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3D Desk Tip & Scroll Prompt */}
        <div className="flex items-center gap-4 text-xs font-heading font-bold text-[#5c4a3f] pointer-events-auto">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-[#e6d8cb] shadow-sm">
            <Gamepad2 className="w-4 h-4 text-[#8da178]" />
            <span>Click Switch console, plant & coffee cup</span>
          </div>

          <div
            onClick={onExplore}
            className="flex items-center gap-2 cursor-pointer text-[#38271e] hover:text-[#8da178] transition-colors"
          >
            <span className="hidden sm:inline font-mono">SCROLL TO EXPLORE</span>
            <div className="w-5 h-8 rounded-full border-2 border-[#8da178] flex items-start justify-center p-1 bg-white">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-2 rounded-full bg-[#ff9e80]"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
