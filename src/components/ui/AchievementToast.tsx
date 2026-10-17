import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { achievementsManager, type Achievement } from '../../game/achievements';
import { soundManager } from '../../audio/audioEngine';

export function AchievementToast() {
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    const unsubscribe = achievementsManager.subscribe((achievement) => {
      soundManager.playAchievement();
      setCurrent(achievement);
      setTimeout(() => {
        setCurrent(null);
      }, 4500);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div aria-live="polite" role="status">
      <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div className="flex items-center gap-3.5 p-3.5 pr-6 rounded-3xl bg-white border-2 border-[#8da178] shadow-2xl shadow-[#8da178]/25 min-w-[320px] max-w-md">
            {/* Animated Trophy Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ffd166] to-[#ff9e80] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl">
                {current.icon}
              </div>
            </div>

            {/* Achievement Text */}
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-heading font-extrabold text-[#526545] uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-[#ffd166]" />
                QUEST ACHIEVED!
              </div>
              <div className="text-sm font-heading font-extrabold text-[#38271e]">
                {current.title}
              </div>
              <div className="text-xs text-[#5c4a3f] font-medium leading-tight">
                {current.description}
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-[#ffd166] animate-pulse" />
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
