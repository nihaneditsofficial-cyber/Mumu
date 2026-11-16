import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level2DoorProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

export const Level2Door: React.FC<Level2DoorProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [doorOpen, setDoorOpen] = useState(false);

  const handleOpenDoor = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (doorOpen) return;
    setDoorOpen(true);
    audioEngine.playDoorOpen();
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    effectsRef.current?.burstStars(cx, cy);
    effectsRef.current?.launchConfetti(60, cx, cy);
    onUnlockBadge('door');
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/85 uppercase">
          Level 2 · Threshold of Wonder
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-5xl text-balance">
          The Magical Birthday Door
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-purple-100/80 sm:text-base">
          {doorOpen
            ? `The door swung wide open for ${PERSONALIZATION.name}!`
            : `Tap the glowing enchanted door to step into your ${PERSONALIZATION.age}th birthday realm.`}
        </p>
      </div>

      {/* 3D Perspective Door Container */}
      <div className="relative flex flex-col items-center">
        <div
          className="relative h-[320px] w-[220px] sm:h-[360px] sm:w-[250px]"
          style={{ perspective: '1100px' }}
        >
          {/* Radiant golden portal behind the door */}
          <div
            className={`absolute inset-0 rounded-t-[125px] rounded-b-2xl border-4 border-amber-300/60 bg-gradient-to-b from-amber-100 via-pink-200 to-purple-300 shadow-[0_0_70px_rgba(251,191,36,0.55)] transition-opacity duration-700 ${
              doorOpen ? 'opacity-100' : 'opacity-25'
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center p-5 text-slate-900">
              <Sparkles className="h-9 w-9 text-amber-600 animate-pulse" />
              <p className="font-display mt-3 text-xl font-bold text-rose-900">
                Happy 15th, {PERSONALIZATION.name}!
              </p>
              <p className="mt-2 text-xs leading-relaxed font-medium text-purple-950/85">
                Welcome to a world built with sparkle, joy, and warm wishes just for you.
              </p>
            </div>
          </div>

          {/* Swinging Door Panel */}
          <button
            type="button"
            onClick={handleOpenDoor}
            aria-label="Open the magical birthday door"
            className={`group absolute inset-0 origin-left cursor-pointer rounded-t-[125px] rounded-b-2xl border-4 border-amber-300/80 bg-gradient-to-b from-[#4c1d95] via-[#6d28d9] to-[#831843] shadow-[0_0_45px_rgba(236,72,153,0.45)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300`}
            style={{
              transform: doorOpen ? 'rotateY(-108deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Ornate arch panels */}
            <div className="pointer-events-none flex h-full flex-col items-center justify-between p-6">
              <div className="mt-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-200/50 bg-amber-300/15 shadow-inner">
                <span className="font-display text-3xl font-bold text-amber-200">
                  {PERSONALIZATION.age}
                </span>
              </div>

              <div className="w-full space-y-2">
                <div className="mx-auto h-16 w-28 rounded-xl border border-amber-200/30 bg-white/5" />
              </div>

              <div className="flex w-full items-center justify-between px-2">
                <span className="text-xs font-medium tracking-wider text-amber-100/80 uppercase">
                  Tap to Open
                </span>
                {/* Door handle */}
                <span className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-md shadow-amber-300/60 group-hover:scale-125 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Personalized Reveal Card */}
        {doorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="glass-panel mt-8 max-w-xl rounded-3xl p-6 sm:p-8"
          >
            <h3 className="font-display text-2xl font-bold text-amber-200">
              A Royal Welcome for {PERSONALIZATION.name} ✨
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-purple-100/90 sm:text-base">
              You just unlocked the doorway to your 15th birthday celebration! Behind this portal
              wait treasures, flying wishes, glowing stars, and a heartfelt letter from{' '}
              <span className="font-semibold text-pink-200">{PERSONALIZATION.createdBy}</span>.
              Take your time and enjoy every surprise!
            </p>
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkle();
                onNext();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-pink-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-pink-500/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Enter the Gift Kingdom</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
