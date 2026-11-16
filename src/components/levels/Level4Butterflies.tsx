import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BUTTERFLY_MESSAGES, PERSONALIZATION } from '../../data/birthdayContent';
import { ButterflyMessage } from '../../types/game';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level4ButterfliesProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

interface FlyingButterfly {
  uid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  primaryColor: string;
  secondaryColor: string;
  scale: number;
}

const BUTTERFLY_COLORS = [
  { p: '#F472B6', s: '#FBCFE8' },
  { p: '#C084FC', s: '#E9D5FF' },
  { p: '#38BDF8', s: '#BAE6FD' },
  { p: '#FB7185', s: '#FDE68A' },
  { p: '#34D399', s: '#A7F3D0' },
  { p: '#FBBF24', s: '#FDE68A' },
];

const TARGET_CATCHES = 8;

function createButterfly(uid: number): FlyingButterfly {
  const palette = BUTTERFLY_COLORS[uid % BUTTERFLY_COLORS.length];
  return {
    uid,
    x: 12 + Math.random() * 76,
    y: 16 + Math.random() * 68,
    vx: (Math.random() > 0.5 ? 1 : -1) * (0.28 + Math.random() * 0.25),
    vy: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.24),
    primaryColor: palette.p,
    secondaryColor: palette.s,
    scale: 0.92 + Math.random() * 0.28,
  };
}

export const Level4Butterflies: React.FC<Level4ButterfliesProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [butterflies, setButterflies] = useState<FlyingButterfly[]>(() =>
    Array.from({ length: 6 }, (_, i) => createButterfly(i + 1))
  );
  const [caughtCount, setCaughtCount] = useState(0);
  const [unlockedMsg, setUnlockedMsg] = useState<ButterflyMessage | null>(null);
  const [nextUid, setNextUid] = useState(10);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setButterflies((prev) =>
        prev.map((b) => {
          let nx = b.x + b.vx;
          let ny = b.y + b.vy;
          let nvx = b.vx;
          let nvy = b.vy;

          if (nx < 8 || nx > 88) {
            nvx = -nvx;
            nx = Math.max(8, Math.min(88, nx));
          }
          if (ny < 12 || ny > 82) {
            nvy = -nvy;
            ny = Math.max(12, Math.min(82, ny));
          }

          return {
            ...b,
            x: nx,
            y: ny,
            vx: nvx + (Math.random() - 0.5) * 0.04,
            vy: nvy + (Math.random() - 0.5) * 0.04,
          };
        })
      );
    }, 35);

    return () => window.clearInterval(interval);
  }, []);

  const handleCatch = (uid: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    effectsRef.current?.burstSparkles(cx, cy, ['#F472B6', '#C084FC', '#FDE68A', '#7DD3FC']);
    audioEngine.playChime(1.05);

    const newCount = caughtCount + 1;
    setCaughtCount(newCount);

    const msg = BUTTERFLY_MESSAGES[(newCount - 1) % BUTTERFLY_MESSAGES.length];
    setUnlockedMsg(msg);

    if (newCount >= TARGET_CATCHES) {
      onUnlockBadge('butterflies');
      if (newCount === TARGET_CATCHES) {
        audioEngine.playFanfare();
        effectsRef.current?.launchConfetti(60, cx, cy);
      }
    }

    // Replace caught butterfly with a fresh one
    setNextUid((prevUid) => {
      const spawned = createButterfly(prevUid);
      setButterflies((prev) => prev.map((b) => (b.uid === uid ? spawned : b)));
      return prevUid + 1;
    });
  };

  const completed = caughtCount >= TARGET_CATCHES;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-purple-200/85 uppercase">
          Level 4 · Butterfly Challenge
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          Catch the Enchanted Butterflies
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
          Tap {TARGET_CATCHES} fluttering butterflies to unlock hidden birthday wishes and sweet
          compliments for {PERSONALIZATION.name}!
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-sm">
          <span className="font-mono-num font-bold text-amber-200">
            Score: {caughtCount} / {TARGET_CATCHES} Caught
          </span>
          {completed && (
            <span className="font-semibold text-emerald-300">Challenge Complete!</span>
          )}
        </div>
      </div>

      {/* Unlocked Message Banner */}
      <div className="mx-auto mt-5 min-h-[82px] max-w-xl">
        {unlockedMsg ? (
          <motion.div
            key={caughtCount}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl px-5 py-4 text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-pink-200 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{unlockedMsg.title}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-white sm:text-base">
              {unlockedMsg.message}
            </p>
          </motion.div>
        ) : (
          <div className="glass-card flex h-[82px] items-center justify-center rounded-2xl px-5 text-sm text-purple-200/70">
            Tap any flying butterfly below to reveal its secret message!
          </div>
        )}
      </div>

      {/* Interactive Butterfly Meadow Arena */}
      <div className="glass-card relative mt-5 h-[340px] w-full overflow-hidden rounded-3xl sm:h-[400px]">
        {butterflies.map((b) => (
          <button
            key={b.uid}
            type="button"
            onClick={(e) => handleCatch(b.uid, e)}
            aria-label="Catch flying butterfly"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: `translate(-50%, -50%) scale(${b.scale})`,
            }}
            className="absolute flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
          >
            {/* Animated SVG Butterfly */}
            <svg width="46" height="40" viewBox="0 0 46 40" fill="none">
              <g className="animate-wing-left">
                <path
                  d="M22 20 C14 4, 2 6, 4 17 C6 25, 16 24, 22 21 Z"
                  fill={b.primaryColor}
                />
                <path
                  d="M22 22 C15 24, 7 32, 12 36 C16 39, 21 31, 22 24 Z"
                  fill={b.secondaryColor}
                />
              </g>
              <g className="animate-wing-right">
                <path
                  d="M24 20 C32 4, 44 6, 42 17 C40 25, 30 24, 24 21 Z"
                  fill={b.primaryColor}
                />
                <path
                  d="M24 22 C31 24, 39 32, 34 36 C30 39, 25 31, 24 24 Z"
                  fill={b.secondaryColor}
                />
              </g>
              <rect x="21.5" y="13" width="3" height="15" rx="1.5" fill="#FFFBEB" />
            </svg>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-6 flex justify-center">
        {completed ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={() => {
              audioEngine.playSparkle();
              onNext();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink-500/30 transition-transform hover:scale-[1.03]"
          >
            <span>Float to Balloon World</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <p className="text-xs text-purple-200/70">
            Catch {TARGET_CATCHES - caughtCount} more {TARGET_CATCHES - caughtCount === 1 ? 'butterfly' : 'butterflies'} to unlock Level 5!
          </p>
        )}
      </div>
    </section>
  );
};
