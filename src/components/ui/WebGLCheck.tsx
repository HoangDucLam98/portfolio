import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WebGLCheckProps {
  children?: React.ReactNode;
}

export function WebGLCheck({ children }: WebGLCheckProps) {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLAvailable(!!gl);
    } catch {
      setIsWebGLAvailable(false);
    }
  }, []);

  return (
    <>
      {isWebGLAvailable === false && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[90%] p-4 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 shadow-2xl backdrop-blur-md text-xs font-mono">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300 mb-1">WebGL 3D Acceleration Not Detected</h4>
              <p className="text-amber-200/80 mb-2">
                Your browser or device currently has hardware acceleration disabled. Enable WebGL in browser settings for full 60 FPS 3D interactive graphics.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
