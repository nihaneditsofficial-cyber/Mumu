import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { PERSONALIZATION } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level8CakeProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

const TOTAL_CANDLES = PERSONALIZATION.age; // 16 candles for Mumu's 16th birthday!

export const Level8Cake: React.FC<Level8CakeProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [litCandles, setLitCandles] = useState<number[]>([]);
  const [celebrating, setCelebrating] = useState(false);

  const handleLightCandle = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (litCandles.includes(index)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + 8;

    audioEngine.playCandleLight();
    effectsRef.current?.burstSparkles(cx, cy, ['#FDE68A', '#FBBF24', '#FB7185', '#FFFFFF']);

    const next = [...litCandles, index];
    setLitCandles(next);

    if (next.length === TOTAL_CANDLES) {
      setCelebrating(true);
      onUnlockBadge('cake');
      audioEngine.playFanfare();
      effectsRef.current?.launchConfetti(110, window.innerWidth / 2, window.innerHeight * 0.4);
      [0, 350, 700, 1100, 1500].forEach((delay) => {
        window.setTimeout(() => {
          effectsRef.current?.launchFirework();
        }, delay);
      });
    }
  };

  const allLit = litCandles.length === TOTAL_CANDLES;

  // Arrange 16 candles cleanly: 7 on top tier, 9 on wider bottom tier
  const topRow = Array.from({ length: 7 }, (_, i) => i);
  const bottomRow = Array.from({ length: 9 }, (_, i) => i + 7);

  const renderCandle = (candleIdx: number) => {
    const isLit = litCandles.includes(candleIdx);
    const stripeColors = [
      'from-pink-400 to-rose-500',
      'from-violet-400 to-purple-500',
      'from-amber-300 to-orange-400',
      'from-sky-400 to-indigo-400',
    ];
    const colorClass = stripeColors[candleIdx % stripeColors.length];

    return (
      <button
        key={candleIdx}
        type="button"
        onClick={(e) => handleLightCandle(candleIdx, e)}
        aria-label={isLit ? `Candle ${candleIdx + 1} is lit` : `Light candle ${candleIdx + 1}`}
        className="group relative flex h-16 w-8 cursor-pointer flex-col items-center justify-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-lg sm:w-9"
      >
        {/* Flame or unlit spark hint */}
        {isLit ? (
          <div className="relative mb-0.5 flex flex-col items-center">
            <span className="absolute -inset-2 rounded-full bg-amber-300/50 blur-md" />
            <div className="animate-flicker relative h-5 w-3 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(251,191,36,0.95)]" />
          </div>
        ) : (
          <div className="mb-1 flex h-4 items-end justify-center">
            <span className="h-2.5 w-0.5 rounded-full bg-slate-300 group-hover:bg-amber-200 transition-colors" />
            <span className="absolute top-1 h-2.5 w-2.5 rounded-full bg-amber-200/35 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Candle stick */}
        <div
          className={`h-9 w-3.5 rounded-t-sm rounded-b-xs bg-gradient-to-b ${colorClass} shadow-md ring-1 ring-white/25 transition-transform group-hover:scale-110`}
        />
      </button>
    );
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/85 uppercase">
        Level 8 · Birthday Cake
      </p>
      <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
        Light All {TOTAL_CANDLES} Candles for {PERSONALIZATION.name}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
        {allLit
          ? `Every single candle is glowing! Make your sweetest ${PERSONALIZATION.age}th birthday wish!`
          : 'Tap each candle on the cake to light it up and launch the birthday celebration.'}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3 text-sm font-semibold text-amber-200">
        <Flame className="h-4 w-4 text-amber-300" />
        <span className="font-mono-num">
          Candles Lit: {litCandles.length} / {TOTAL_CANDLES}
        </span>
      </div>

      {/* Interactive Layered Birthday Cake */}
      <div className="relative mx-auto mt-8 flex max-w-xl flex-col items-center">
        {/* Glow aura behind cake when all lit */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 ${
            celebrating ? 'bg-amber-400/35 opacity-100' : 'bg-pink-500/15 opacity-60'
          }`}
        />

        {/* Cake Topper "16" */}
        <div className="relative z-10 mb-1 flex h-12 w-16 items-center justify-center rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-400/30">
          <span className="font-display text-2xl font-bold">{PERSONALIZATION.age}</span>
        </div>

        {/* Top Tier Candles (7) */}
        <div className="relative z-10 -mb-1 flex items-end justify-center gap-1.5 sm:gap-2.5">
          {topRow.map(renderCandle)}
        </div>

        {/* Top Cake Tier */}
        <div className="relative z-10 h-20 w-[250px] overflow-hidden rounded-t-3xl border-b-4 border-rose-300/40 bg-gradient-to-b from-pink-200 via-pink-300 to-rose-400 shadow-xl sm:w-[300px]">
          {/* Frosting Drip */}
          <div className="flex justify-around">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-8 rounded-b-full bg-white/90 shadow-sm"
                style={{ height: i % 2 === 0 ? '24px' : '16px' }}
              />
            ))}
          </div>
          <p className="font-display mt-2 text-sm font-bold text-rose-950/80">
            Sweet {PERSONALIZATION.age}
          </p>
        </div>

        {/* Lower Tier Candles (9) */}
        <div className="relative z-10 -mt-3 -mb-1 flex items-end justify-center gap-1 sm:gap-2.5">
          {bottomRow.map(renderCandle)}
        </div>

        {/* Bottom Cake Tier */}
        <div className="relative z-10 flex h-24 w-[320px] flex-col items-center justify-between overflow-hidden rounded-t-3xl rounded-b-xl bg-gradient-to-b from-violet-300 via-purple-400 to-fuchsia-600 shadow-2xl sm:w-[410px]">
          <div className="flex w-full justify-around">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-9 rounded-b-full bg-pink-100/95 shadow-sm"
                style={{ height: i % 2 === 0 ? '26px' : '18px' }}
              />
            ))}
          </div>
          <div className="pb-3 text-center">
            <span className="font-display text-lg font-bold text-white drop-shadow">
              ✨ {PERSONALIZATION.name} ✨
            </span>
          </div>
        </div>

        {/* Cake Stand Plate */}
        <div className="relative z-10 h-4 w-[350px] rounded-full bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 shadow-xl sm:w-[450px]" />
        <div className="h-6 w-28 rounded-b-2xl bg-gradient-to-b from-amber-300 to-amber-500/80" />
      </div>

      {/* Celebration Banner & Next Step */}
      {allLit && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mx-auto mt-8 max-w-xl rounded-3xl p-6"
        >
          <div className="flex items-center justify-center gap-2 text-amber-200 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Make a Wish, {PERSONALIZATION.name}!</span>
          </div>
          <p className="mt-2 text-sm text-purple-100/90 sm:text-base">
            All {TOTAL_CANDLES} candles are shining bright for you! One final treasure awaits before the grand
            finale—a secret letter written from the heart.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkle();
                effectsRef.current?.launchFirework();
                effectsRef.current?.launchConfetti(60);
              }}
              className="rounded-xl border border-amber-300/40 bg-amber-300/15 px-4 py-2.5 text-xs font-semibold text-amber-100 hover:bg-amber-300/25"
            >
              Launch More Fireworks 🎆
            </button>
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkle();
                onNext();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
            >
              <span>Open Your Secret Letter</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};
