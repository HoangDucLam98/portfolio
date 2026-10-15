import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { soundManager } from '../../audio/audioEngine';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const LOG_MESSAGES = [
  'Loading Low-Poly Stylized Mesh Assets...',
  'Compiling Custom Cel-Shaders & Wind Displacement...',
  'Seeding Procedural Sky Islands & Botanical Flora...',
  'Initializing 3D Game Developer Workstation...',
  'Tuning 8-Bit & Acoustic Web Audio Engine...',
  'Calibrating Cinemachine Camera Path...',
  'World Generation Complete. Press Start to Begin!',
];

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 9) + 4;
        return next > 100 ? 100 : next;
      });
    }, 85);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentMsgIndex = Math.min(
      Math.floor((progress / 100) * LOG_MESSAGES.length),
      LOG_MESSAGES.length - 1
    );
    setLogIndex(currentMsgIndex);
  }, [progress]);

  const handleEnter = () => {
    soundManager.playSuccess();
    soundManager.startAmbient();
    onLoaded();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#dbeafe] bg-grid-cozy text-[#1e293b] overflow-hidden px-4"
      >
        {/* Background Warm Sunburst Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ffd166]/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ffb4a2]/25 rounded-full blur-[100px] pointer-events-none" />

        {/* Center Card */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl glass-panel-glow border-2 border-[#8da178] flex flex-col items-center text-center shadow-2xl bg-white/95">
          {/* Animated Cartoon Gamepad Icon */}
          <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#8da178]/40 animate-spin" style={{ animationDuration: '7s' }} />
            <div className="absolute inset-2 rounded-xl border-2 border-[#ff9e80]/40 -animate-spin" style={{ animationDuration: '5s' }} />
            <Gamepad2 className="w-9 h-9 text-[#8da178] animate-bounce" />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8da178]/15 border border-[#8da178]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8da178]" />
            <span className="text-xs font-mono text-[#8da178] font-bold uppercase tracking-widest">
              Sproutling Game Studio
            </span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-[#38271e] tracking-tight mb-1">
            HOANG DUC LAM
          </h2>
          <p className="text-xs text-[#786558] font-mono mb-6">
            GAMEPLAY PROGRAMMER & 3D ARTIST
          </p>

          {/* Progress Bar with Bright Pastel Gradient */}
          <div className="w-full bg-[#f4ebe1] rounded-full h-3.5 p-0.5 border border-[#e2d5c8] mb-4 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#8da178] via-[#ffd166] to-[#ff9e80]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          {/* Percentage & Status */}
          <div className="w-full flex items-center justify-between font-mono text-xs text-[#786558] mb-4 font-bold">
            <span className="flex items-center gap-1.5 text-[#8da178]">
              <Play className="w-3 h-3 fill-current" />
              GAME ENGINE BOOT
            </span>
            <span className="text-[#38271e] text-sm">
              {progress}%
            </span>
          </div>

          {/* Game Log Box */}
          <div className="w-full bg-[#fbf4eb] rounded-2xl p-3 border border-[#e6d8cb] text-left font-mono text-[11px] text-[#4a332d] min-h-[42px] flex items-center mb-6">
            <span className="text-[#8da178] mr-2">🍄</span>
            <span className="truncate">{LOG_MESSAGES[logIndex]}</span>
          </div>

          {/* Enter Button */}
          {isReady ? (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnter}
              className="w-full py-4 px-6 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-[#4a332d]/25 border border-[#4a332d] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#ffd166]" />
              Press Start // Enter Game
            </motion.button>
          ) : (
            <div className="text-xs font-mono text-[#786558] flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff9e80] animate-ping" />
              Generating cozy sunlit 3D studio...
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
