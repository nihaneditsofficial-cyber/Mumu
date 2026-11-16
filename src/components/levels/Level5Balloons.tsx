import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BALLOON_COMPLIMENTS, PERSONALIZATION } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level5BalloonsProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

interface FloatingBalloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  swayOffset: number;
  topColor: string;
  bottomColor: string;
  compliment: string;
}

const BALLOON_THEMES = [
  { top: '#FB7185', bottom: '#E11D48' },
  { top: '#F472B6', bottom: '#DB2777' },
  { top: '#C084FC', bottom: '#7C3AED' },
  { top: '#38BDF8', bottom: '#0284C7' },
  { top: '#FBBF24', bottom: '#D97706' },
  { top: '#34D399', bottom: '#059669' },
  { top: '#A78BFA', bottom: '#6D28D9' },
];

const TARGET_POPS = 8;

function makeBalloon(id: number, startRandomY = false): FloatingBalloon {
  const theme = BALLOON_THEMES[id % BALLOON_THEMES.length];
  return {
    id,
    x: 10 + Math.random() * 80,
    y: startRandomY ? 18 + Math.random() * 68 : 96 + Math.random() * 14,
    speed: 0.22 + Math.random() * 0.25,
    swayOffset: Math.random() * Math.PI * 2,
    topColor: theme.top,
    bottomColor: theme.bottom,
    compliment: BALLOON_COMPLIMENTS[Math.floor(Math.random() * BALLOON_COMPLIMENTS.length)],
  };
}

export const Level5Balloons: React.FC<Level5BalloonsProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [balloons, setBalloons] = useState<FloatingBalloon[]>(() =>
    Array.from({ length: 12 }, (_, i) => makeBalloon(i + 1, true))
  );
  const [poppedCount, setPoppedCount] = useState(0);
  const [lastCompliment, setLastCompliment] = useState<string | null>(null);
  const [nextId, setNextId] = useState(20);

  useEffect(() => {
    let tick = 0;
    const timer = window.setInterval(() => {
      tick += 0.06;
      setBalloons((prev) =>
        prev.map((b) => {
          const nextY = b.y - b.speed;
          const nextX = b.x + Math.sin(tick + b.swayOffset) * 0.14;
          if (nextY < -14) {
            return {
              ...b,
              y: 106,
              x: 10 + Math.random() * 80,
            };
          }
          return {
            ...b,
            y: nextY,
            x: Math.max(7, Math.min(93, nextX)),
          };
        })
      );
    }, 35);

    return () => window.clearInterval(timer);
  }, []);

  const handlePop = (balloon: FloatingBalloon, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    audioEngine.playPop();
    effectsRef.current?.burstSparkles(cx, cy, [balloon.topColor, '#FDE68A', '#FFFFFF']);
    effectsRef.current?.launchConfetti(28, cx, cy);

    const nextPop = poppedCount + 1;
    setPoppedCount(nextPop);
    setLastCompliment(balloon.compliment);

    if (nextPop >= TARGET_POPS) {
      onUnlockBadge('balloons');
      if (nextPop === TARGET_POPS) {
        audioEngine.playFanfare();
      }
    }

    setNextId((id) => {
      const fresh = makeBalloon(id, false);
      setBalloons((prev) => prev.map((b) => (b.id === balloon.id ? fresh : b)));
      return id + 1;
    });
  };

  const unlockedNext = poppedCount >= TARGET_POPS;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-sky-200/85 uppercase">
          Level 5 · Balloon World
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          Pop the Floating Balloons
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-purple-100/80 sm:text-base">
          Click any floating balloon to pop it and reveal bright compliments made for{' '}
          {PERSONALIZATION.name}!
        </p>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <span className="font-mono-num font-bold text-amber-200">
            Balloons Popped: {poppedCount} {unlockedNext ? '· Ready for Next Level!' : `/ ${TARGET_POPS}`}
          </span>
        </div>
      </div>

      {/* Compliment Display */}
      <div className="mx-auto mt-5 min-h-[70px] max-w-lg">
        {lastCompliment ? (
          <motion.div
            key={poppedCount}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl px-6 py-4 text-center"
          >
            <p className="font-display text-xl font-bold text-amber-100 sm:text-2xl">
              {lastCompliment}
            </p>
          </motion.div>
        ) : (
          <div className="glass-card flex h-[70px] items-center justify-center rounded-2xl px-6 text-sm text-purple-200/70">
            Tap a colorful balloon below to pop it!
          </div>
        )}
      </div>

      {/* Balloon Sky Arena */}
      <div className="glass-card relative mt-5 h-[360px] w-full overflow-hidden rounded-3xl sm:h-[420px]">
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={(e) => handlePop(b, e)}
            aria-label="Pop floating birthday balloon"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="group absolute cursor-pointer p-1 transition-transform hover:scale-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-full"
          >
            <svg width="56" height="86" viewBox="0 0 56 86" fill="none">
              <defs>
                <linearGradient id={`bal-${b.id}`} x1="12" y1="6" x2="46" y2="54" gradientUnits="userSpaceOnUse">
                  <stop stopColor={b.topColor} />
                  <stop offset="1" stopColor={b.bottomColor} />
                </linearGradient>
              </defs>
              <ellipse cx="28" cy="29" rx="22" ry="27" fill={`url(#bal-${b.id})`} />
              <ellipse
                cx="19"
                cy="20"
                rx="5.5"
                ry="9"
                fill="white"
                fillOpacity="0.32"
                transform="rotate(-18 19 20)"
              />
              <polygon points="28,55 24,60 32,60" fill={b.bottomColor} />
              <path
                d="M28 60 Q33 70 25 84"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex justify-center">
        {unlockedNext ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={() => {
              audioEngine.playSparkle();
              onNext();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-fuchsia-500 to-pink-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-fuchsia-500/30 transition-transform hover:scale-[1.03]"
          >
            <span>Enter the Starry Night Sky</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <p className="text-xs text-purple-200/70">
            Pop {TARGET_POPS - poppedCount} more {TARGET_POPS - poppedCount === 1 ? 'balloon' : 'balloons'} to unlock Level 6!
          </p>
        )}
      </div>
    </section>
  );
};
