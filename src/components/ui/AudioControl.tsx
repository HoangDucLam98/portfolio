import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/audioEngine';

export function AudioControl() {
  const [muted, setMuted] = useState(soundManager.isMuted);

  useEffect(() => {
    setMuted(soundManager.isMuted);
  }, []);

  const handleToggle = () => {
    const nextState = soundManager.toggleMute();
    setMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute Procedural Audio SFX' : 'Mute Audio SFX'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer group shadow-lg shadow-cyan-950/40"
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline text-[11px] text-slate-400">AUDIO OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          {/* Animated sound bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-purple-400 rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-pink-400 rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="hidden sm:inline text-[11px] text-cyan-300">SFX ACTIVE</span>
        </>
      )}
    </button>
  );
}
