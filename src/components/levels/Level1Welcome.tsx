import React from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level1WelcomeProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onStart: () => void;
  onEnableMusicHint: () => void;
}

export const Level1Welcome: React.FC<Level1WelcomeProps> = ({
  effectsRef,
  onStart,
  onEnableMusicHint,
}) => {
  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    effectsRef.current?.launchConfetti(80, rect.left + rect.width / 2, rect.top + rect.height / 2);
    effectsRef.current?.burstStars(rect.left + rect.width / 2, rect.top + rect.height / 2);
    audioEngine.playFanfare();
    onEnableMusicHint();
    onStart();
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-10 text-center">
      {/* Floating Illustrated SVG Butterflies & Balloons specific to Welcome */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-balloon absolute top-[12%] left-[8%] opacity-85 sm:left-[14%]">
          <svg width="46" height="68" viewBox="0 0 46 68" fill="none">
            <ellipse cx="23" cy="24" rx="18" ry="22" fill="url(#welBalloon1)" />
            <ellipse cx="16" cy="17" rx="5" ry="8" fill="white" fillOpacity="0.28" transform="rotate(-18 16 17)" />
            <path d="M23 46 Q27 56 21 67" stroke="#F9A8D4" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="welBalloon1" x1="5" y1="2" x2="41" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB7185" />
                <stop offset="1" stopColor="#DB2777" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className="animate-balloon absolute top-[18%] right-[9%] opacity-85 sm:right-[15%]"
          style={{ animationDelay: '1.4s' }}
        >
          <svg width="44" height="66" viewBox="0 0 46 68" fill="none">
            <ellipse cx="23" cy="24" rx="17" ry="21" fill="url(#welBalloon2)" />
            <ellipse cx="16" cy="17" rx="4.5" ry="7" fill="white" fillOpacity="0.3" transform="rotate(-18 16 17)" />
            <path d="M23 45 Q19 55 25 67" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="welBalloon2" x1="5" y1="2" x2="41" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C084FC" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className="animate-balloon absolute bottom-[14%] left-[12%] hidden opacity-75 md:block"
          style={{ animationDelay: '0.8s' }}
        >
          <svg width="38" height="58" viewBox="0 0 46 68" fill="none">
            <ellipse cx="23" cy="24" rx="16" ry="20" fill="url(#welBalloon3)" />
            <path d="M23 44 Q25 56 22 67" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="welBalloon3" x1="5" y1="2" x2="41" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 w-full max-w-2xl rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-fuchsia-400 to-amber-300 text-slate-950 shadow-xl shadow-pink-500/30">
          <Sparkles className="h-8 w-8" />
        </div>

        <p className="text-xs font-semibold tracking-[0.2em] text-pink-200/90 uppercase sm:text-sm">
          Chapter 01 · A Special 15th Birthday Quest
        </p>

        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl text-balance">
          Welcome,{' '}
          <span className="bg-gradient-to-r from-pink-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
            {PERSONALIZATION.name}!
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-purple-100/90 sm:text-lg">
          Today is all about celebrating your{' '}
          <span className="font-semibold text-amber-200">{PERSONALIZATION.age}th Birthday</span>!{' '}
          {PERSONALIZATION.createdBy} built a 9-level magical adventure filled with hidden gifts,
          fluttering butterflies, wishes in the stars, and a secret letter waiting just for you.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-purple-200/75 sm:text-sm">
          <span>9 Interactive Levels</span>
          <span aria-hidden="true">·</span>
          <span>40+ Personalized Wishes</span>
          <span aria-hidden="true">·</span>
          <span>Estimated 3–5 Min Journey</span>
        </div>

        <div className="mt-9 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            className="animate-pulse-glow group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-pink-500/40 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/60 sm:text-lg"
          >
            <Gift className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            <span>Start the Surprise 🎁</span>
          </button>
          <p className="text-xs text-purple-200/65">
            Starting begins the gentle birthday music box melody (toggle anytime in the top bar)
          </p>
        </div>
      </motion.div>
    </section>
  );
};
