import React from 'react';
import { Award, Music, Volume2, VolumeX } from 'lucide-react';
import { LEVELS, PERSONALIZATION } from '../data/birthdayContent';
import { LevelId } from '../types/game';

interface TopHudProps {
  currentLevel: LevelId;
  highestUnlocked: LevelId;
  onSelectLevel: (level: LevelId) => void;
  musicOn: boolean;
  onToggleMusic: () => void;
  sfxOn: boolean;
  onToggleSfx: () => void;
  earnedCount: number;
  totalBadges: number;
  onOpenBadges: () => void;
  onTriggerSignatureEgg: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  currentLevel,
  highestUnlocked,
  onSelectLevel,
  musicOn,
  onToggleMusic,
  sfxOn,
  onToggleSfx,
  earnedCount,
  totalBadges,
  onOpenBadges,
  onTriggerSignatureEgg,
}) => {
  const activeMeta = LEVELS.find((l) => l.id === currentLevel) ?? LEVELS[0];
  const progressPct = Math.round((currentLevel / LEVELS.length) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-white/12 bg-[#120b29]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand / Birthday Title */}
        <button
          type="button"
          onClick={onTriggerSignatureEgg}
          title="Click for a hidden birthday sparkle from Nihan"
          className="group flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-lg px-1 py-0.5"
        >
          <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg group-hover:text-pink-200 transition-colors">
            {PERSONALIZATION.name} · 15
          </span>
          <span className="hidden sm:inline text-xs text-purple-200/70">
            by {PERSONALIZATION.createdBy}
          </span>
        </button>

        {/* Center Level Progress & Chapter Stepper */}
        <div className="flex flex-1 max-w-md flex-col items-center gap-1 px-2">
          <div className="flex w-full items-center justify-between text-xs text-purple-100/85">
            <span className="truncate font-medium">
              {activeMeta.emoji} Level {currentLevel}: {activeMeta.title}
            </span>
            <span className="font-mono-num ml-2 shrink-0 text-pink-200">
              {currentLevel}/{LEVELS.length}
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-amber-300 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Quick unlocked level dots on tablet/desktop */}
          <div className="hidden md:flex items-center gap-1.5 pt-0.5">
            {LEVELS.map((lvl) => {
              const unlocked = lvl.id <= highestUnlocked;
              const isCurrent = lvl.id === currentLevel;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && onSelectLevel(lvl.id)}
                  title={
                    unlocked
                      ? `Go to Level ${lvl.id}: ${lvl.title}`
                      : `Unlock Level ${lvl.id} by playing`
                  }
                  aria-label={`Level ${lvl.id}: ${lvl.title}`}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
                    isCurrent
                      ? 'w-5 bg-amber-300'
                      : unlocked
                      ? 'w-2 bg-pink-300/70 hover:bg-pink-200 cursor-pointer'
                      : 'w-2 bg-white/15 cursor-not-allowed'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Audio & Badges Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleMusic}
            aria-pressed={musicOn}
            title={musicOn ? 'Turn Background Music Off' : 'Turn Background Music On'}
            className={`flex h-10 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-medium transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
              musicOn
                ? 'bg-pink-500/25 text-pink-100 border border-pink-300/40'
                : 'bg-white/8 text-purple-200/80 border border-white/12 hover:bg-white/15'
            }`}
          >
            <Music className="h-4 w-4" />
            <span className="hidden sm:inline">{musicOn ? 'Music On' : 'Music Off'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            aria-pressed={sfxOn}
            title={sfxOn ? 'Turn Sound Effects Off' : 'Turn Sound Effects On'}
            className={`flex h-10 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-medium transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
              sfxOn
                ? 'bg-violet-500/25 text-violet-100 border border-violet-300/40'
                : 'bg-white/8 text-purple-200/80 border border-white/12 hover:bg-white/15'
            }`}
          >
            {sfxOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden lg:inline">{sfxOn ? 'SFX On' : 'SFX Off'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenBadges}
            title="View Achievement Badges"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-amber-300/35 bg-amber-400/15 px-2.5 sm:px-3 text-xs font-semibold text-amber-100 transition-all hover:bg-amber-400/25 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Award className="h-4 w-4 text-amber-300" />
            <span className="font-mono-num">
              {earnedCount}/{totalBadges}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
