import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { achievementsManager, type Achievement } from '../../game/achievements';
import { soundManager } from '../../audio/audioEngine';
import { useModalA11y } from '../../hooks/useModalA11y';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const handleClose = () => {
    soundManager.playCloseModal();
    onClose();
  };

  const containerRef = useModalA11y<HTMLDivElement>(isOpen, handleClose);

  useEffect(() => {
    if (isOpen) {
      setAchievements(achievementsManager.getAchievements());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          ref={containerRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Studio achievements"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass-panel-glow border-2 border-[#8da178] p-6 sm:p-8 shadow-2xl bg-white text-[#38271e] flex flex-col gap-6 outline-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#e6d8cb] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/20 border-2 border-[#ffd166] flex items-center justify-center text-[#e76f51] shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold font-heading text-[#38271e]">
                  STUDIO ACHIEVEMENTS
                </h2>
                <p className="text-xs text-[#786558] font-mono">
                  {unlockedCount} of {achievements.length} Quests Mastered ({progressPercent}%)
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              aria-label="Close achievements"
              className="p-2.5 rounded-2xl bg-[#f4ebe1] hover:bg-[#e6d8cb] border border-[#e6d8cb] text-[#38271e] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#f4ebe1] rounded-full h-3 overflow-hidden border border-[#e6d8cb]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#8da178] via-[#ffd166] to-[#ff9e80]"
            />
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  item.unlocked
                    ? 'bg-[#fbf4eb] border-[#8da178] shadow-sm'
                    : 'bg-[#f8f5f0]/60 border-[#e6d8cb] opacity-60'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    item.unlocked ? 'bg-white border-2 border-[#8da178]' : 'bg-[#e6d8cb] text-slate-400'
                  }`}
                >
                  {item.unlocked ? item.icon : <Lock className="w-4 h-4 text-[#786558]" />}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-heading font-extrabold text-[#38271e]">
                      {item.title}
                    </span>
                    {item.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8da178]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#5c4a3f] leading-snug font-medium">
                    {item.description}
                  </p>
                  {item.unlockedAt && (
                    <div className="text-[9px] font-mono text-[#8da178] mt-1 font-bold">
                      UNLOCKED AT {item.unlockedAt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Tip */}
          <div className="pt-3 border-t-2 border-[#e6d8cb] flex items-center justify-between text-xs font-heading font-bold text-[#786558]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffd166]" />
              Explore the 3D room, play the mini-game & run commands to unlock all!
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
