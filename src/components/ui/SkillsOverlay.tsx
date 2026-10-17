import { motion } from 'framer-motion';
import { Gamepad2, CheckCircle } from 'lucide-react';
import { skillsData } from '../../data/skillsData';
import type { SkillItem } from '../../types';
import { soundManager } from '../../audio/audioEngine';

interface SkillsOverlayProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Abilities' },
  { id: 'gameplay', label: 'Gameplay & Physics' },
  { id: 'engine', label: 'Game Engines' },
  { id: 'graphics', label: 'Cel-Shaders & 3D Art' },
  { id: 'audio-design', label: 'Audio & Level Design' },
];

export function SkillsOverlay({
  activeCategory,
  setActiveCategory,
  selectedSkill,
  onSelectSkill,
}: SkillsOverlayProps) {
  const activeSkill = selectedSkill || skillsData[0];

  return (
    <section
      id="skills"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#526545] mb-3 shadow-sm">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>STATION 03 // GAME DEV INVENTORY & SKILL TREE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#38271e] tracking-tight">
          DEVELOPER{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8da178] via-[#e76f51] to-[#f4a261]">
            INVENTORY
          </span>
        </h2>
        <p className="text-sm text-[#5c4a3f] mt-2 font-medium">
          Select skill orbs floating in the 3D scene or choose an ability node from your inventory matrix.
        </p>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 pointer-events-auto">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => soundManager.playHover()}
              className={`px-4 py-2 rounded-2xl font-heading font-bold text-xs tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#4a332d] text-white shadow-md'
                  : 'bg-white text-[#5c4a3f] hover:text-[#38271e] border-2 border-[#e6d8cb] shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 2-Column Inventory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Matrix Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 pointer-events-auto">
          {skillsData
            .filter((s) => activeCategory === 'all' || s.category === activeCategory)
            .map((skill) => {
              const isSelected = activeSkill.id === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => {
                    soundManager.playSkillSelect();
                    onSelectSkill(skill);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`p-4 rounded-3xl text-left transition-all cursor-pointer flex flex-col justify-between min-h-[100px] ${
                    isSelected
                      ? 'bg-white border-2 border-[#8da178] shadow-lg ring-4 ring-[#8da178]/20'
                      : 'bg-white/90 border-2 border-[#e6d8cb] hover:border-[#ff9e80] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="text-[11px] font-mono text-[#bc4b2d] font-bold">
                      LVL {skill.level}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-heading font-extrabold text-[#38271e] truncate">
                      {skill.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#786558] capitalize">
                      {skill.category.replace('-', ' ')}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Right Column: Selected Ability Telemetry Card (5 cols) */}
        <div className="lg:col-span-5 pointer-events-auto">
          <motion.div
            key={activeSkill.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-[#8da178] flex flex-col gap-5 shadow-xl bg-white/95"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="inline-block px-3 py-1 rounded-xl text-[10px] font-heading font-bold uppercase mb-1.5"
                  style={{
                    backgroundColor: `${activeSkill.color}25`,
                    color: '#3d3328',
                  }}
                >
                  {activeSkill.category.toUpperCase()}
                </span>
                <h3 className="text-2xl font-extrabold font-heading text-[#38271e]">
                  {activeSkill.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black font-heading text-[#e76f51]">
                  {activeSkill.level}%
                </span>
                <div className="text-[10px] font-mono text-[#786558] font-bold">EXP PROFICIENCY</div>
              </div>
            </div>

            {/* XP Gauge Bar */}
            <div className="w-full bg-[#f4ebe1] rounded-full h-3 overflow-hidden border border-[#e6d8cb]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeSkill.level}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, #8da178, ${activeSkill.color})`,
                }}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-[#5c4a3f] leading-relaxed font-medium">
              {activeSkill.description}
            </p>

            {/* Metrics */}
            <div className="pt-4 border-t-2 border-[#e6d8cb] flex items-center justify-between text-xs font-heading font-bold text-[#786558]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#8da178]" />
                {activeSkill.projectsCount}+ Shipped Mechanics
              </span>
              <span className="text-[#a63e24]">NODE ACTIVE</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
