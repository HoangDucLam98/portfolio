import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, LoaderCircle } from 'lucide-react';

export function LoadingScreen() {
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
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#8da178] via-[#ffd166] to-[#ff9e80]"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.3, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>

          {/* Percentage & Status */}
          <div className="w-full flex items-center justify-between font-mono text-xs text-[#786558] mb-4 font-bold">
            <span className="flex items-center gap-1.5 text-[#8da178]">
              <LoaderCircle className="w-3 h-3 animate-spin" />
              LOADING 3D STUDIO
            </span>
            <span className="text-[#38271e] text-sm">
              LOADING
            </span>
          </div>

          {/* Game Log Box */}
          <div className="w-full bg-[#fbf4eb] rounded-2xl p-3 border border-[#e6d8cb] text-left font-mono text-[11px] text-[#4a332d] min-h-[42px] flex items-center mb-6">
            <span className="text-[#8da178] mr-2">🍄</span>
            <span className="truncate">Preparing the interactive 3D studio...</span>
          </div>

          <div className="text-xs font-mono text-[#786558] flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff9e80] animate-ping" />
            Entering the studio automatically...
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
