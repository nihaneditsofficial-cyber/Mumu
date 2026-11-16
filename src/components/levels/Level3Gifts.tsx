import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Gift, Sparkles } from 'lucide-react';
import { GIFT_ITEMS, PERSONALIZATION } from '../../data/birthdayContent';
import { GiftItem } from '../../types/game';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level3GiftsProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

export const Level3Gifts: React.FC<Level3GiftsProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const [activeGift, setActiveGift] = useState<GiftItem | null>(null);

  const handleOpenGift = (gift: GiftItem, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (!openedIds.includes(gift.id)) {
      const next = [...openedIds, gift.id];
      setOpenedIds(next);
      if (next.length === GIFT_ITEMS.length) {
        onUnlockBadge('gifts');
        audioEngine.playFanfare();
      } else {
        audioEngine.playChime(0.9 + next.length * 0.05);
      }
    } else {
      audioEngine.playSparkle();
    }

    setActiveGift(gift);

    // Trigger unique surprise effect per gift
    switch (gift.effectType) {
      case 'hearts':
        effectsRef.current?.burstHearts(cx, cy);
        break;
      case 'stars':
      case 'gold':
        effectsRef.current?.burstStars(cx, cy);
        break;
      case 'firework':
        effectsRef.current?.launchFirework(cx, cy);
        break;
      case 'confetti':
      case 'prism':
        effectsRef.current?.launchConfetti(55, cx, cy);
        break;
      default:
        effectsRef.current?.burstSparkles(cx, cy);
        break;
    }
  };

  const allOpened = openedIds.length === GIFT_ITEMS.length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-200/85 uppercase">
          Level 3 · Gift Kingdom
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          10 Magical Gifts for {PERSONALIZATION.name}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
          Unwrap every floating gift box to reveal 10 unique {PERSONALIZATION.age}th birthday wishes—each with its own
          surprise sparkle!
        </p>

        <div className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-amber-200">
          <span className="font-mono-num">
            Gifts Opened: {openedIds.length} / {GIFT_ITEMS.length}
          </span>
        </div>
      </div>

      {/* Active Revealed Wish Banner */}
      {activeGift && (
        <motion.div
          key={activeGift.id}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-panel mx-auto mt-6 max-w-2xl rounded-2xl p-5 sm:p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-200 uppercase">
            <Sparkles className="h-4 w-4" />
            <span>
              Gift #{activeGift.id} · {activeGift.title}
            </span>
          </div>
          <p className="mt-2 text-base leading-relaxed font-medium text-white sm:text-lg">
            “{activeGift.wish}”
          </p>
        </motion.div>
      )}

      {/* 10 Floating Gift Boxes Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-5">
        {GIFT_ITEMS.map((gift, index) => {
          const isOpened = openedIds.includes(gift.id);
          const isSelected = activeGift?.id === gift.id;

          return (
            <button
              key={gift.id}
              type="button"
              onClick={(e) => handleOpenGift(gift, e)}
              style={{ animationDelay: `${index * 0.25}s` }}
              className={`group relative flex min-h-[145px] flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
                isOpened
                  ? isSelected
                    ? 'border-amber-300/70 bg-white/16 shadow-lg shadow-pink-500/20'
                    : 'border-white/20 bg-white/10 hover:bg-white/15'
                  : 'animate-float-slow border-white/18 bg-white/8 hover:-translate-y-1.5 hover:bg-white/14'
              }`}
            >
              {!isOpened ? (
                <>
                  {/* Wrapped 2D Gift Box */}
                  <div className="relative flex h-16 w-16 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    {/* Bow */}
                    <div className="absolute -top-2 flex gap-0.5">
                      <span className={`h-3 w-4 rounded-full ${gift.ribbonColor} -rotate-12`} />
                      <span className={`h-3 w-4 rounded-full ${gift.ribbonColor} rotate-12`} />
                    </div>
                    {/* Box body */}
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gift.boxColor} shadow-lg`}
                    >
                      <div className={`absolute inset-y-0 w-2.5 ${gift.ribbonColor} opacity-90`} />
                      <div className={`absolute inset-x-0 h-2.5 ${gift.ribbonColor} opacity-90`} />
                      <Gift className="relative z-10 h-5 w-5 text-slate-900/70" />
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-purple-100">
                    Gift #{gift.id}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-amber-200">{gift.title}</span>
                  <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-purple-100/75">
                    {gift.wish}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Progression Footer */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
        {allOpened ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={() => {
              audioEngine.playSparkle();
              onNext();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink-500/30 transition-transform hover:scale-[1.03]"
          >
            <span>Continue to Butterfly Meadow</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <p className="text-xs text-purple-200/70">
            Open all {GIFT_ITEMS.length - openedIds.length} remaining gifts to unlock Level 4!
          </p>
        )}
      </div>
    </section>
  );
};
