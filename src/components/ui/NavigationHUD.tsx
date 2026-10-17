import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Gamepad2, Trophy, Sun, Sunset, Moon, Focus } from 'lucide-react';
import { AudioControl } from './AudioControl';
import { soundManager } from '../../audio/audioEngine';
import { achievementsManager } from '../../game/achievements';
import type { TimeOfDay } from '../../types';

interface NavigationHUDProps {
  activeSection: number;
  onNavigate: (sectionIndex: number) => void;
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (time: TimeOfDay) => void;
  dioramaMode: boolean;
  onToggleDiorama: () => void;
  onOpenMiniGame: () => void;
  onOpenAchievements: () => void;
}

const NAV_ITEMS = [
  { label: '01. STUDIO', name: 'Studio', index: 0 },
  { label: '02. LORE & DEV', name: 'Lore', index: 1 },
  { label: '03. INVENTORY', name: 'Inventory', index: 2 },
  { label: '04. GAMES', name: 'Games', index: 3 },
  { label: '05. CAMPFIRE', name: 'Campfire', index: 4 },
];

export function NavigationHUD({
  activeSection,
  onNavigate,
  timeOfDay,
  onTimeOfDayChange,
  dioramaMode,
  onToggleDiorama,
  onOpenMiniGame,
  onOpenAchievements,
}: NavigationHUDProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const unlockedBadges = achievementsManager.getUnlockedCount();

  const handleNavClick = (idx: number) => {
    soundManager.playClick();
    onNavigate(idx);
    setMobileOpen(false);
  };

  const handleTimeSwitch = (time: TimeOfDay) => {
    soundManager.playClick();
    onTimeOfDayChange(time);
    if (time === 'night') {
      achievementsManager.unlock('night_owl');
    }
  };

  return (
    <>
      {/* Top Floating Glass HUD */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNavClick(0)}
          className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border-2 border-[#e6d8cb] hover:border-[#8da178] cursor-pointer transition-all group shadow-lg bg-white/90"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8da178] via-[#ffd166] to-[#ff9e80] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-[#fbf4eb] rounded-[9px] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-[#38271e] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-heading font-extrabold text-sm text-[#38271e] tracking-wider flex items-center gap-1.5">
              SPROUTLING GAMES
              <span className="w-2 h-2 rounded-full bg-[#8da178] animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-[#526545] font-bold tracking-tight">
              HOANG DUC LAM // GAME DEV
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full glass-panel border-2 border-[#e6d8cb] shadow-md bg-white/90">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.index;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.index)}
                onMouseEnter={() => soundManager.playHover()}
                className={`relative px-4 py-1.5 rounded-full font-heading font-bold text-xs tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#38271e]'
                    : 'text-[#786558] hover:text-[#38271e]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-[#ffb4a2]/35 border-2 border-[#ff9e80] rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: TimeOfDay, Diorama, Mini-Game, Achievements, Audio */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
          {/* Time of Day Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-white/90 border-2 border-[#e6d8cb] shadow-sm">
            <button
              onClick={() => handleTimeSwitch('day')}
              title="Day Mode"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                timeOfDay === 'day'
                  ? 'bg-[#ffd166] text-[#38271e] shadow-sm'
                  : 'text-[#786558] hover:text-[#38271e]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleTimeSwitch('sunset')}
              title="Sunset Mode"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                timeOfDay === 'sunset'
                  ? 'bg-[#ff9e80] text-white shadow-sm'
                  : 'text-[#786558] hover:text-[#38271e]'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleTimeSwitch('night')}
              title="Cozy Night Mode"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                timeOfDay === 'night'
                  ? 'bg-[#4a332d] text-[#ffd166] shadow-sm'
                  : 'text-[#786558] hover:text-[#38271e]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Diorama Lens Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleDiorama();
            }}
            title="Toggle Tilt-Shift Diorama Focus"
            className={`p-2 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
              dioramaMode
                ? 'bg-[#8da178] border-[#8da178] text-white'
                : 'bg-white/90 border-[#e6d8cb] text-[#5c4a3f] hover:text-[#38271e]'
            }`}
          >
            <Focus className="w-4 h-4" />
          </button>

          {/* Achievements Badge */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            title="View Achievements"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 border-2 border-[#e6d8cb] hover:border-[#ffd166] text-[#38271e] text-xs font-heading font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-[#ffd166]" />
            <span className="hidden sm:inline">{unlockedBadges}/8</span>
          </button>

          {/* Play Mini-Game CTA */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenMiniGame();
            }}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#ff9e80] hover:bg-[#ff8a80] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mini-Game [G]</span>
          </button>

          <AudioControl />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-2xl glass-panel border-2 border-[#e6d8cb] text-[#38271e] hover:text-[#8da178] transition-colors cursor-pointer bg-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Right-Side Station Indicator */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-auto">
        <div className="w-[2px] h-12 bg-gradient-to-b from-transparent to-[#8da178]/40" />
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.index;
          return (
            <button
              key={`dot-${item.name}`}
              onClick={() => handleNavClick(item.index)}
              onMouseEnter={() => soundManager.playHover()}
              title={item.name}
              className="group relative flex items-center justify-center cursor-pointer p-1"
            >
              <span className="absolute right-8 px-3 py-1 rounded-xl bg-white border-2 border-[#e6d8cb] text-[11px] font-heading font-bold text-[#38271e] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                {item.label}
              </span>
              <span
                className={`transition-all rounded-full ${
                  isActive
                    ? 'w-4 h-4 bg-[#ff9e80] ring-4 ring-[#ff9e80]/30 shadow-md'
                    : 'w-2.5 h-2.5 bg-[#c8b6a6] hover:bg-[#ff9e80]'
                }`}
              />
            </button>
          );
        })}
        <div className="w-[2px] h-12 bg-gradient-to-t from-transparent to-[#8da178]/40" />
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 p-6 rounded-3xl glass-panel-glow border-2 border-[#8da178] lg:hidden flex flex-col gap-3 shadow-2xl bg-white/95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e6d8cb]">
              <span className="text-xs font-heading font-bold text-[#8da178] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                GAME WORLD SITEMAP
              </span>
              <span className="text-xs font-mono text-[#786558]">ZONE 0{activeSection + 1}</span>
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.index;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.index)}
                  className={`w-full py-3.5 px-4 rounded-2xl text-left font-heading font-bold text-sm tracking-wider flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#ffb4a2]/30 text-[#38271e] border-2 border-[#ff9e80]'
                      : 'text-[#4a332d] hover:bg-[#fbf4eb]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#ff9e80]" />}
                </button>
              );
            })}

            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenMiniGame();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ff9e80] text-white font-heading font-extrabold text-xs uppercase flex items-center justify-center gap-2 mt-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Launch 3D Mini-Game</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
