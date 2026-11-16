import React from 'react';
import { LevelId } from '../types/game';

interface FloatingDecorationsProps {
  level: LevelId;
}

const TWINKLE_STARS = [
  { top: '8%', left: '12%', delay: '0s', size: 12 },
  { top: '14%', left: '78%', delay: '0.7s', size: 16 },
  { top: '24%', left: '91%', delay: '1.3s', size: 10 },
  { top: '36%', left: '7%', delay: '0.4s', size: 14 },
  { top: '58%', left: '88%', delay: '1.8s', size: 12 },
  { top: '74%', left: '14%', delay: '1.1s', size: 15 },
  { top: '84%', left: '80%', delay: '0.3s', size: 11 },
  { top: '19%', left: '42%', delay: '1.5s', size: 9 },
];

export const FloatingDecorations: React.FC<FloatingDecorationsProps> = ({ level }) => {
  const isNightSky = level === 6 || level === 8;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dynamic Aurora Gradient Layers */}
      <div
        className={`animate-aurora absolute -top-1/4 -left-1/4 h-[80vh] w-[80vw] rounded-full blur-[120px] transition-colors duration-1000 ${
          isNightSky
            ? 'bg-indigo-700/30'
            : level === 10
            ? 'bg-pink-500/35'
            : 'bg-fuchsia-600/25'
        }`}
      />
      <div
        className={`animate-aurora absolute -right-1/4 -bottom-1/4 h-[85vh] w-[85vw] rounded-full blur-[130px] transition-colors duration-1000 ${
          isNightSky
            ? 'bg-violet-800/30'
            : level === 5
            ? 'bg-sky-500/25'
            : 'bg-rose-500/25'
        }`}
        style={{ animationDelay: '-7s' }}
      />
      <div
        className="animate-aurora absolute top-1/3 left-1/3 h-[55vh] w-[55vw] rounded-full bg-amber-400/10 blur-[110px]"
        style={{ animationDelay: '-12s' }}
      />

      {/* Subtle twinkling stars */}
      {TWINKLE_STARS.map((s, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          className="animate-twinkle absolute text-amber-200/75"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
          fill="currentColor"
        >
          <path d="M12 1L14.8 8.7L22.5 11.5L14.8 14.3L12 22L9.2 14.3L1.5 11.5L9.2 8.7L12 1Z" />
        </svg>
      ))}

      {/* Ambient Floating Hearts on Welcome, Letter, Finale */}
      {(level === 1 || level === 9 || level === 10) && (
        <>
          <div className="animate-float-sway absolute top-[22%] left-[6%] text-2xl opacity-55">
            💖
          </div>
          <div
            className="animate-float-slow absolute top-[68%] right-[8%] text-2xl opacity-50"
            style={{ animationDelay: '1.2s' }}
          >
            ✨
          </div>
          <div
            className="animate-float-sway absolute bottom-[18%] left-[12%] text-xl opacity-45"
            style={{ animationDelay: '2.1s' }}
          >
            🌸
          </div>
        </>
      )}

      {/* Ambient Floating Butterflies on Welcome & Finale */}
      {(level === 1 || level === 10) && (
        <>
          <div
            className="animate-float-sway absolute top-[18%] right-[11%] opacity-75"
            style={{ animationDelay: '0.6s' }}
          >
            <span className="text-2xl">🦋</span>
          </div>
          <div
            className="animate-float-slow absolute bottom-[24%] right-[16%] opacity-70"
            style={{ animationDelay: '1.9s' }}
          >
            <span className="text-xl">🎈</span>
          </div>
        </>
      )}
    </div>
  );
};
