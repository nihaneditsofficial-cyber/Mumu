import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../data/birthdayContent';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1450;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(onComplete, 260);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e0920] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-aurora absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-pink-500/25 blur-[110px]" />
        <div className="animate-aurora absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-violet-500/25 blur-[110px]" />
      </div>

      <div className="glass-panel relative w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-fuchsia-400 to-amber-300 text-slate-950 shadow-lg shadow-pink-500/30">
          <Sparkles className="h-8 w-8" />
        </div>

        <p className="text-xs font-medium tracking-widest text-pink-200/80 uppercase">
          A Magical 16th Birthday Surprise
        </p>
        <h1 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
          Preparing {PERSONALIZATION.name}’s Adventure
        </h1>
        <p className="mt-2 text-sm text-purple-100/75">
          Wrapped with stardust, wishes, and love by {PERSONALIZATION.createdBy}
        </p>

        <div className="mt-7">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-amber-300 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-purple-200/75">
            <span>Lighting the birthday sparkles</span>
            <span className="font-mono-num font-semibold text-pink-200">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
