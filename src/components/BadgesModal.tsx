import React from 'react';
import { Lock, X } from 'lucide-react';
import { BADGES, PERSONALIZATION } from '../data/birthdayContent';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedIds: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, earnedIds }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Birthday Achievement Badges"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-panel relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              {PERSONALIZATION.name}’s Adventure Badges
            </h2>
            <p className="mt-1 text-sm text-purple-100/75">
              Earned {earnedIds.length} of {BADGES.length} magical keepsakes · Includes 2 hidden Easter eggs!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close badges dialog"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const unlocked = earnedIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                  unlocked
                    ? 'border-amber-300/35 bg-gradient-to-br from-amber-300/15 to-pink-500/10'
                    : 'border-white/10 bg-white/5 opacity-70'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                    unlocked ? 'bg-amber-300/20' : 'bg-white/10 text-purple-200/50'
                  }`}
                >
                  {unlocked ? badge.emoji : <Lock className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {unlocked || !badge.isSecret ? badge.title : 'Secret Easter Egg'}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-purple-100/75">
                    {unlocked
                      ? badge.description
                      : badge.isSecret
                      ? 'Keep exploring! Try clicking special glowing details in the sky or header.'
                      : badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
