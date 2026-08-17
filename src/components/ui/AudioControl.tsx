import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/audioEngine';

export function AudioControl() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const nextState = soundManager.toggleMute();
    setMuted(nextState);
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute Procedural Audio SFX' : 'Mute Audio SFX'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 border-2 border-[#e6d8cb] hover:border-[#8da178] text-xs font-heading font-bold text-[#38271e] transition-all cursor-pointer shadow-sm"
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#ff8a80]" />
          <span className="hidden sm:inline text-[11px] text-[#786558]">MUTED</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#8da178] animate-pulse" />
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-[#8da178] rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-[#ffd166] rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-[#ff9e80] rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="hidden sm:inline text-[11px] text-[#8da178]">SFX ON</span>
        </>
      )}
    </button>
  );
}
