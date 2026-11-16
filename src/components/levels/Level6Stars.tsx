import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Moon, Sparkles } from 'lucide-react';
import { PERSONALIZATION, STAR_WISHES } from '../../data/birthdayContent';
import { StarWish } from '../../types/game';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level6StarsProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
  onTriggerMoonEgg: () => void;
}

export const Level6Stars: React.FC<Level6StarsProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
  onTriggerMoonEgg,
}) => {
  const [collectedIds, setCollectedIds] = useState<number[]>([]);
  const [activeStar, setActiveStar] = useState<StarWish | null>(null);
  const [moonNoteVisible, setMoonNoteVisible] = useState(false);

  const handleCollectStar = (star: StarWish, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    effectsRef.current?.burstStars(cx, cy);

    if (!collectedIds.includes(star.id)) {
      const next = [...collectedIds, star.id];
      setCollectedIds(next);
      if (next.length === STAR_WISHES.length) {
        audioEngine.playFanfare();
        effectsRef.current?.launchConfetti(65, cx, cy);
        onUnlockBadge('stars');
      } else {
        audioEngine.playChime(0.95 + next.length * 0.1);
      }
    } else {
      audioEngine.playSparkle();
    }

    setActiveStar(star);
  };

  const handleMoonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    effectsRef.current?.burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, [
      '#FDE68A',
      '#E9D5FF',
      '#FFFFFF',
    ]);
    audioEngine.playSparkle();
    setMoonNoteVisible(true);
    onTriggerMoonEgg();
  };

  const allCollected = collectedIds.length === STAR_WISHES.length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/85 uppercase">
          Level 6 · Star Collection
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          Mumu’s 15th Birthday Constellation
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
          Search the midnight sky and tap all 5 glowing stars to weave {PERSONALIZATION.name}’s
          constellation and reveal their wishes.
        </p>

        <p className="font-mono-num mt-3 text-sm font-bold text-amber-200">
          Stars Collected: {collectedIds.length} / {STAR_WISHES.length}
        </p>
      </div>

      {/* Night Sky Canvas Box */}
      <div className="relative mt-6 h-[360px] w-full overflow-hidden rounded-3xl border border-indigo-300/25 bg-gradient-to-b from-[#070518] via-[#130d33] to-[#231249] shadow-2xl sm:h-[410px]">
        {/* Constellation connecting lines */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {STAR_WISHES.map((star, index) => {
            if (index === 0) return null;
            const prev = STAR_WISHES[index - 1];
            const bothCollected =
              collectedIds.includes(star.id) && collectedIds.includes(prev.id);
            return (
              <line
                key={star.id}
                x1={prev.xPercent}
                y1={prev.yPercent}
                x2={star.xPercent}
                y2={star.yPercent}
                stroke={bothCollected ? '#FDE68A' : 'rgba(255,255,255,0.12)'}
                strokeWidth={bothCollected ? '0.6' : '0.3'}
                strokeDasharray={bothCollected ? 'none' : '1.5 1.5'}
                className="transition-all duration-700"
              />
            );
          })}
        </svg>

        {/* Secret Crescent Moon Easter Egg */}
        <button
          type="button"
          onClick={handleMoonClick}
          title="A quiet glowing crescent moon..."
          aria-label="Glowing crescent moon"
          className="absolute top-6 right-7 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-amber-200/10 text-amber-200 shadow-[0_0_25px_rgba(253,230,138,0.35)] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Moon className="h-6 w-6 fill-amber-200/70" />
        </button>

        {moonNoteVisible && (
          <div className="glass-panel absolute top-20 right-5 z-20 max-w-xs rounded-2xl p-3 text-left text-xs text-amber-100">
            🌙 Secret Moon Wish: “Even on quiet nights, Mumu, you always shine like starlight!” —{' '}
            {PERSONALIZATION.createdBy}
          </div>
        )}

        {/* Background static pinprick stars */}
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="animate-twinkle pointer-events-none absolute h-1 w-1 rounded-full bg-white/70"
            style={{
              left: `${(i * 37 + 11) % 95}%`,
              top: `${(i * 23 + 9) % 88}%`,
              animationDelay: `${(i % 6) * 0.5}s`,
            }}
          />
        ))}

        {/* 5 Collectible Glowing Stars */}
        {STAR_WISHES.map((star) => {
          const collected = collectedIds.includes(star.id);
          return (
            <button
              key={star.id}
              type="button"
              onClick={(e) => handleCollectStar(star, e)}
              aria-label={`Collect ${star.name}`}
              style={{
                left: `${star.xPercent}%`,
                top: `${star.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="group absolute flex h-14 w-14 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <span
                className={`absolute inset-1 rounded-full blur-md transition-all ${
                  collected
                    ? 'bg-amber-300/60 scale-110'
                    : 'animate-pulse-glow bg-amber-200/45 group-hover:bg-amber-300/80'
                }`}
              />
              <svg
                viewBox="0 0 32 32"
                className={`relative h-9 w-9 transition-transform duration-300 group-hover:scale-125 ${
                  collected ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'text-amber-100'
                }`}
                fill="currentColor"
              >
                <path d="M16 2 L19.8 11.2 L29.8 12 L22.2 18.6 L24.6 28.4 L16 23.2 L7.4 28.4 L9.8 18.6 L2.2 12 L12.2 11.2 Z" />
              </svg>
              {collected && (
                <span className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-slate-950 shadow">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}

        {/* Bottom Horizon Silhouette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-purple-950/80 to-transparent"
        />
      </div>

      {/* Star Message Card */}
      <div className="mx-auto mt-5 min-h-[96px] max-w-2xl">
        {activeStar ? (
          <motion.div
            key={activeStar.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-5 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider text-amber-200 uppercase">
              <Sparkles className="h-4 w-4" />
              <span>{activeStar.name}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-white sm:text-base">
              {activeStar.message}
            </p>
          </motion.div>
        ) : (
          <div className="glass-card flex h-[96px] items-center justify-center rounded-2xl px-6 text-sm text-purple-200/75">
            Tap any of the 5 glowing stars in the sky to reveal its birthday wish!
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex justify-center">
        {allCollected ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={() => {
              audioEngine.playSparkle();
              onNext();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-amber-400/25 transition-transform hover:scale-[1.03]"
          >
            <span>Unlock the Treasure Chest</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <p className="text-xs text-purple-200/70">
            Collect {STAR_WISHES.length - collectedIds.length} more{' '}
            {STAR_WISHES.length - collectedIds.length === 1 ? 'star' : 'stars'} to unlock Level 7!
          </p>
        )}
      </div>
    </section>
  );
};
