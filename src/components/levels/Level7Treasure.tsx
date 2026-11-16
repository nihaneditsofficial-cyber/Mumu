import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Anchor,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  CloudSun,
  Coffee,
  Compass,
  Crown,
  Feather,
  Flame,
  Flower2,
  Gem,
  Gift,
  Globe,
  Heart,
  Key,
  Moon,
  Music,
  Palette,
  PartyPopper,
  Rainbow,
  Rocket,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { PERSONALIZATION, TREASURE_WISHES } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level7TreasureProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Crown,
  Heart,
  Star,
  Sun,
  Music,
  Compass,
  Flower2,
  BookOpen,
  Smile,
  Gem,
  Feather,
  Camera,
  Moon,
  Award,
  Palette,
  ShieldCheck,
  Coffee,
  Rocket,
  Rainbow,
  Gift,
  Flame,
  Globe,
  Users,
  Zap,
  Anchor,
  CloudSun,
  Key,
  Wand2,
  PartyPopper,
};

export const Level7Treasure: React.FC<Level7TreasureProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [chestOpen, setChestOpen] = useState(false);

  const handleOpenChest = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (chestOpen) return;
    setChestOpen(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    audioEngine.playFanfare();
    effectsRef.current?.launchConfetti(90, cx, cy);
    effectsRef.current?.burstStars(cx, cy);
    effectsRef.current?.launchFirework(cx - 120, cy - 100);
    effectsRef.current?.launchFirework(cx + 120, cy - 100);
    onUnlockBadge('treasure');
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/85 uppercase">
          Level 7 · Treasure Chest
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          30 Radiant Wishes for {PERSONALIZATION.name}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
          {chestOpen
            ? `Every glowing gem holds a special birthday wish for your ${PERSONALIZATION.age}th year!`
            : 'Tap the enchanted treasure chest to burst open 30 shimmering birthday wishes.'}
        </p>
      </div>

      {!chestOpen ? (
        <div className="mt-12 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleOpenChest}
            aria-label="Open the magical treasure chest"
            className="animate-float-slow group relative flex cursor-pointer flex-col items-center rounded-3xl p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <div className="absolute inset-4 rounded-full bg-amber-400/25 blur-2xl transition-all group-hover:bg-amber-300/45" />

            {/* Stylized SVG Treasure Chest */}
            <svg
              width="210"
              height="175"
              viewBox="0 0 210 175"
              fill="none"
              className="relative drop-shadow-[0_18px_35px_rgba(251,191,36,0.35)] transition-transform duration-300 group-hover:scale-105"
            >
              {/* Chest Lid */}
              <path
                d="M25 78 C25 36, 185 36, 185 78 Z"
                fill="url(#chestWood)"
                stroke="#FCD34D"
                strokeWidth="5"
              />
              {/* Lid Ribbons */}
              <rect x="58" y="45" width="12" height="33" fill="#FBBF24" />
              <rect x="140" y="45" width="12" height="33" fill="#FBBF24" />
              {/* Chest Base */}
              <rect
                x="22"
                y="78"
                width="166"
                height="76"
                rx="14"
                fill="url(#chestBase)"
                stroke="#FCD34D"
                strokeWidth="5"
              />
              {/* Base Gold Trim */}
              <rect x="58" y="78" width="12" height="76" fill="#FBBF24" />
              <rect x="140" y="78" width="12" height="76" fill="#FBBF24" />
              {/* Keyhole Lock Plate */}
              <rect
                x="89"
                y="68"
                width="32"
                height="34"
                rx="8"
                fill="#FDE68A"
                stroke="#B45309"
                strokeWidth="3"
              />
              <circle cx="105" cy="82" r="4.5" fill="#78350F" />
              <path d="M103 85 L107 85 L108 94 L102 94 Z" fill="#78350F" />
              <defs>
                <linearGradient id="chestWood" x1="25" y1="38" x2="185" y2="78" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9D174D" />
                  <stop offset="1" stopColor="#581C87" />
                </linearGradient>
                <linearGradient id="chestBase" x1="22" y1="78" x2="188" y2="154" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#701A75" />
                  <stop offset="1" stopColor="#3B0764" />
                </linearGradient>
              </defs>
            </svg>

            <span className="mt-4 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg">
              Open Treasure Chest 💎
            </span>
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TREASURE_WISHES.map((item, idx) => {
              const IconComp = ICON_MAP[item.iconName] ?? Sparkles;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.75), duration: 0.35 }}
                  onClick={(e) => {
                    effectsRef.current?.burstSparkles(e.clientX, e.clientY);
                    audioEngine.playSparkle();
                  }}
                  className={`glass-card group cursor-pointer rounded-2xl bg-gradient-to-br ${item.glowColor} p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-amber-200/40`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-amber-200 transition-transform group-hover:scale-110">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-purple-200/70">
                        <span className="font-mono-num">#{item.id.toString().padStart(2, '0')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-amber-200">{item.title}</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-purple-50/95">
                        {item.wish}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => {
                audioEngine.playSparkle();
                onNext();
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-pink-500/30 transition-transform hover:scale-[1.03] sm:text-base"
            >
              <span>Light the 15th Birthday Cake</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
