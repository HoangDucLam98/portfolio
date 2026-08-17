import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/audioEngine';

interface MiniGameHUDProps {
  isPlaying: boolean;
  starsCollected: number;
  totalStars: number;
  hasWon: boolean;
  onExit: () => void;
  onRestart: () => void;
}

export function MiniGameHUD({
  isPlaying,
  starsCollected,
  totalStars,
  hasWon,
  onExit,
  onRestart,
}: MiniGameHUDProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (hasWon) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd166', '#ff9e80', '#8da178', '#70b0d0', '#ffffff'],
      });
    }
  }, [hasWon]);

  // Mobile virtual joystick triggers synthetic keyboard events
  const sendKey = (code: string, isDown: boolean) => {
    const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code });
    window.dispatchEvent(event);
  };

  if (!isPlaying) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-4 sm:p-8">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Left: Star Counter */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/95 border-2 border-[#8da178] shadow-xl">
          <div className="flex items-center gap-1.5 text-lg font-heading font-black text-[#ffd166]">
            <span>⭐</span>
            <span className="text-[#38271e] text-base">{starsCollected} / {totalStars}</span>
          </div>
          <div className="w-[1px] h-5 bg-[#e6d8cb]" />
          <div className="font-mono text-xs text-[#786558] font-bold">
            ⏱ {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Center Title */}
        <div className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border-2 border-[#e6d8cb] shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8da178] animate-ping" />
          <span className="font-heading font-extrabold text-xs text-[#38271e] tracking-wider uppercase">
            🎮 Sproutling Desk Quest
          </span>
        </div>

        {/* Right: Exit Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-xs uppercase shadow-xl cursor-pointer pointer-events-auto transition-all"
        >
          <X className="w-4 h-4" />
          <span>Exit Game [ESC]</span>
        </button>
      </div>

      {/* Center Win Modal */}
      <AnimatePresence>
        {hasWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="self-center p-8 rounded-3xl bg-white border-2 border-[#8da178] shadow-2xl flex flex-col items-center text-center max-w-sm pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ffd166]/20 border-2 border-[#ffd166] flex items-center justify-center text-3xl mb-3 shadow-md">
              🏆
            </div>
            <h3 className="text-2xl font-extrabold font-heading text-[#38271e] mb-1">
              Quest Complete!
            </h3>
            <p className="text-xs text-[#5c4a3f] font-medium mb-4 leading-relaxed">
              You collected all 5 golden stars in {seconds} seconds! Unlocked the <b className="text-[#8da178]">Star Hunter</b> achievement badge!
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onRestart();
                }}
                className="flex-1 py-3 rounded-2xl bg-[#f4ebe1] hover:bg-[#e6d8cb] text-xs font-heading font-extrabold text-[#38271e] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onExit();
                }}
                className="flex-1 py-3 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Trophy className="w-3.5 h-3.5 text-[#ffd166]" />
                Return to Studio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls / Virtual D-Pad */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-auto">
        {/* Desktop Keyboard Controls Help */}
        <div className="hidden sm:flex items-center gap-2 p-3 rounded-2xl bg-white/95 border-2 border-[#e6d8cb] shadow-lg text-xs font-heading font-bold text-[#5c4a3f]">
          <span className="px-2 py-1 rounded-lg bg-[#f4ebe1] text-[#38271e] border border-[#e6d8cb] font-mono">WASD / Arrows</span>
          <span>to Move</span>
          <span className="px-2 py-1 rounded-lg bg-[#f4ebe1] text-[#38271e] border border-[#e6d8cb] font-mono ml-2">SPACE</span>
          <span>to Jump</span>
        </div>

        {/* Mobile Virtual D-Pad & Jump Button */}
        <div className="sm:hidden flex items-center justify-between w-full">
          {/* D-Pad */}
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-white/90 border-2 border-[#e6d8cb] shadow-xl">
            <div />
            <button
              onTouchStart={() => sendKey('KeyW', true)}
              onTouchEnd={() => sendKey('KeyW', false)}
              className="w-11 h-11 rounded-xl bg-[#f4ebe1] active:bg-[#ff9e80] flex items-center justify-center font-bold text-[#38271e]"
            >
              ▲
            </button>
            <div />
            <button
              onTouchStart={() => sendKey('KeyA', true)}
              onTouchEnd={() => sendKey('KeyA', false)}
              className="w-11 h-11 rounded-xl bg-[#f4ebe1] active:bg-[#ff9e80] flex items-center justify-center font-bold text-[#38271e]"
            >
              ◀
            </button>
            <button
              onTouchStart={() => sendKey('KeyS', true)}
              onTouchEnd={() => sendKey('KeyS', false)}
              className="w-11 h-11 rounded-xl bg-[#f4ebe1] active:bg-[#ff9e80] flex items-center justify-center font-bold text-[#38271e]"
            >
              ▼
            </button>
            <button
              onTouchStart={() => sendKey('KeyD', true)}
              onTouchEnd={() => sendKey('KeyD', false)}
              className="w-11 h-11 rounded-xl bg-[#f4ebe1] active:bg-[#ff9e80] flex items-center justify-center font-bold text-[#38271e]"
            >
              ▶
            </button>
          </div>

          {/* Jump Button */}
          <button
            onTouchStart={() => sendKey('Space', true)}
            onTouchEnd={() => sendKey('Space', false)}
            className="w-16 h-16 rounded-full bg-[#4a332d] active:bg-[#8da178] text-white font-heading font-black text-xs flex flex-col items-center justify-center shadow-xl uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#ffd166] mb-0.5" />
            JUMP
          </button>
        </div>
      </div>
    </div>
  );
}
