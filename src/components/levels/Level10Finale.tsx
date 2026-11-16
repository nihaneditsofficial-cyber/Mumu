import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, PartyPopper, RotateCcw, Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level10FinaleProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onReplay: () => void;
  onOpenBadges: () => void;
}

export const Level10Finale: React.FC<Level10FinaleProps> = ({
  effectsRef,
  onReplay,
  onOpenBadges,
}) => {
  useEffect(() => {
    audioEngine.playFanfare();
    effectsRef.current?.launchConfetti(120, window.innerWidth * 0.5, window.innerHeight * 0.35);
    effectsRef.current?.launchFirework(window.innerWidth * 0.25, window.innerHeight * 0.25);
    effectsRef.current?.launchFirework(window.innerWidth * 0.75, window.innerHeight * 0.25);

    const fireworkInterval = window.setInterval(() => {
      effectsRef.current?.launchFirework();
    }, 1150);

    const confettiInterval = window.setInterval(() => {
      effectsRef.current?.launchConfetti(
        40,
        window.innerWidth * (0.2 + Math.random() * 0.6),
        window.innerHeight * 0.2
      );
    }, 2800);

    return () => {
      window.clearInterval(fireworkInterval);
      window.clearInterval(confettiInterval);
    };
  }, [effectsRef]);

  const handleSuperFireworks = () => {
    audioEngine.playFanfare();
    effectsRef.current?.launchConfetti(110);
    [0, 180, 360, 540].forEach((delay) => {
      window.setTimeout(() => effectsRef.current?.launchFirework(), delay);
    });
  };

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Extra floating finale decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-balloon absolute top-[10%] left-[6%] text-3xl opacity-85">🎈</div>
        <div
          className="animate-balloon absolute top-[16%] right-[8%] text-3xl opacity-85"
          style={{ animationDelay: '1.1s' }}
        >
          🎈
        </div>
        <div
          className="animate-float-sway absolute bottom-[18%] left-[10%] text-3xl opacity-80"
          style={{ animationDelay: '0.5s' }}
        >
          🦋
        </div>
        <div
          className="animate-float-sway absolute right-[12%] bottom-[22%] text-3xl opacity-80"
          style={{ animationDelay: '1.5s' }}
        >
          💖
        </div>
        <div
          className="animate-float-slow absolute top-[45%] left-[5%] text-2xl opacity-75"
          style={{ animationDelay: '0.9s' }}
        >
          ⭐
        </div>
        <div
          className="animate-float-slow absolute top-[42%] right-[6%] text-2xl opacity-75"
          style={{ animationDelay: '2.0s' }}
        >
          ✨
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 w-full max-w-3xl rounded-[2.25rem] px-6 py-10 shadow-[0_0_90px_rgba(236,72,153,0.35)] sm:px-12 sm:py-14"
      >
        <p className="text-xs font-semibold tracking-[0.22em] text-amber-200 uppercase sm:text-sm">
          Grand Finale · Sweet {PERSONALIZATION.age} Celebration
        </p>

        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_25px_rgba(244,114,182,0.55)] sm:text-6xl text-balance">
          🎉 HAPPY BIRTHDAY! 🎂✨
        </h1>

        <p className="font-display mt-3 text-2xl font-semibold bg-gradient-to-r from-pink-300 via-amber-200 to-violet-300 bg-clip-text text-transparent sm:text-3xl">
          Happy 15th Birthday, {PERSONALIZATION.name}!
        </p>

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-purple-50/95 sm:text-lg">
          <p>
            Today we celebrate everything that makes you so extraordinary, {PERSONALIZATION.name}.
            As you step into 15, may your life overflow with{' '}
            <span className="font-semibold text-pink-200">boundless happiness</span>,{' '}
            <span className="font-semibold text-amber-200">proud success</span>, and{' '}
            <span className="font-semibold text-emerald-200">vibrant good health</span>.
          </p>
          <p>
            May every new month bring{' '}
            <span className="font-semibold text-sky-200">exciting adventures</span>,{' '}
            <span className="font-semibold text-purple-200">beautiful memories</span>,{' '}
            <span className="font-semibold text-rose-200">unshakeable confidence</span>, and a{' '}
            <span className="font-semibold text-amber-200">bright, sparkling future</span> that
            shines as wonderfully as you do.
          </p>
          <p className="font-display pt-2 text-lg text-amber-200">
            Made with love & celebration by {PERSONALIZATION.createdBy} 💖
          </p>
        </div>

        {/* Interactive Finale Controls */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSuperFireworks}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink-500/35 transition-transform hover:scale-[1.04] active:scale-[0.98]"
          >
            <PartyPopper className="h-4 w-4" />
            <span>Launch Grand Fireworks 🎆</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              audioEngine.playSparkle();
              const rect = e.currentTarget.getBoundingClientRect();
              effectsRef.current?.burstHearts(rect.left + rect.width / 2, rect.top);
              effectsRef.current?.launchConfetti(80);
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-pink-300/35 bg-pink-400/15 px-5 py-3.5 text-sm font-semibold text-pink-100 transition-colors hover:bg-pink-400/25"
          >
            <Sparkles className="h-4 w-4" />
            <span>Extra Sparkle Shower</span>
          </button>

          <button
            type="button"
            onClick={onOpenBadges}
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/35 bg-amber-400/15 px-5 py-3.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-400/25"
          >
            <Award className="h-4 w-4" />
            <span>View Badges</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioEngine.playSparkle();
              onReplay();
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Adventure</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
