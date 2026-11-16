/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BADGES, PERSONALIZATION } from './data/birthdayContent';
import { LevelId } from './types/game';
import { audioEngine } from './utils/audioEngine';
import { CanvasEffects, EffectsEngineHandle } from './components/CanvasEffects';
import { FloatingDecorations } from './components/FloatingDecorations';
import { LoadingScreen } from './components/LoadingScreen';
import { TopHud } from './components/TopHud';
import { BadgesModal } from './components/BadgesModal';
import { Level1Welcome } from './components/levels/Level1Welcome';
import { Level2Door } from './components/levels/Level2Door';
import { Level3Gifts } from './components/levels/Level3Gifts';
import { Level4Butterflies } from './components/levels/Level4Butterflies';
import { Level5Balloons } from './components/levels/Level5Balloons';
import { Level6Stars } from './components/levels/Level6Stars';
import { Level7Treasure } from './components/levels/Level7Treasure';
import { Level8Cake } from './components/levels/Level8Cake';
import { Level9Letter } from './components/levels/Level9Letter';
import { Level10Finale } from './components/levels/Level10Finale';

interface ToastMessage {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [highestUnlocked, setHighestUnlocked] = useState<LevelId>(1);
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(['welcome']);
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const effectsRef = useRef<EffectsEngineHandle | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = useCallback((emoji: string, title: string, subtitle: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: Date.now(), emoji, title, subtitle });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3600);
  }, []);

  const unlockBadge = useCallback(
    (badgeId: string) => {
      setEarnedBadges((prev) => {
        if (prev.includes(badgeId)) return prev;
        const badge = BADGES.find((b) => b.id === badgeId);
        if (badge) {
          showToast(badge.emoji, `Badge Unlocked: ${badge.title}`, badge.description);
        }
        return [...prev, badgeId];
      });
    },
    [showToast]
  );

  const goToLevel = useCallback((next: LevelId) => {
    setCurrentLevel(next);
    setHighestUnlocked((prev) => (next > prev ? next : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    audioEngine.setMusicEnabled(next);
  };

  const handleToggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    audioEngine.setSfxEnabled(next);
    if (next) {
      audioEngine.playSparkle();
    }
  };

  const handleEnableMusicFromStart = () => {
    if (!musicOn) {
      setMusicOn(true);
      audioEngine.setMusicEnabled(true);
    }
  };

  const handleTriggerSignatureEgg = () => {
    audioEngine.playSparkle();
    effectsRef.current?.burstHearts(120, 44);
    unlockBadge('easter-signature');
    showToast(
      '🪄',
      `Secret Note from ${PERSONALIZATION.createdBy}`,
      `“You deserve the happiest 15th birthday ever, ${PERSONALIZATION.name}!”`
    );
  };

  const handleTriggerMoonEgg = () => {
    unlockBadge('easter-moon');
  };

  const handleReplay = () => {
    setCurrentLevel(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global subtle click sparkle effect
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      effectsRef.current?.burstSparkles(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    return () => {
      audioEngine.setMusicEnabled(false);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0e0920] text-[#fdf8ff]">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Ambient Aurora & Floating Decorations */}
      <FloatingDecorations level={currentLevel} />

      {/* High-FPS Canvas Particle, Confetti & Fireworks Layer */}
      <CanvasEffects ref={effectsRef} />

      {/* Top HUD */}
      {!isLoading && (
        <TopHud
          currentLevel={currentLevel}
          highestUnlocked={highestUnlocked}
          onSelectLevel={goToLevel}
          musicOn={musicOn}
          onToggleMusic={handleToggleMusic}
          sfxOn={sfxOn}
          onToggleSfx={handleToggleSfx}
          earnedCount={earnedBadges.length}
          totalBadges={BADGES.length}
          onOpenBadges={() => setBadgesModalOpen(true)}
          onTriggerSignatureEgg={handleTriggerSignatureEgg}
        />
      )}

      {/* Achievement / Secret Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            className="glass-panel fixed top-20 right-4 left-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl sm:left-auto sm:right-6"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/20 text-xl">
              {toast.emoji}
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-bold text-amber-200">{toast.title}</p>
              <p className="text-xs text-purple-100/85">{toast.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Adventure Stage */}
      {!isLoading && (
        <main className="relative z-10 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLevel}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentLevel === 1 && (
                <Level1Welcome
                  effectsRef={effectsRef}
                  onStart={() => goToLevel(2)}
                  onEnableMusicHint={handleEnableMusicFromStart}
                />
              )}
              {currentLevel === 2 && (
                <Level2Door
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(3)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 3 && (
                <Level3Gifts
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(4)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 4 && (
                <Level4Butterflies
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(5)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 5 && (
                <Level5Balloons
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(6)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 6 && (
                <Level6Stars
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(7)}
                  onUnlockBadge={unlockBadge}
                  onTriggerMoonEgg={handleTriggerMoonEgg}
                />
              )}
              {currentLevel === 7 && (
                <Level7Treasure
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(8)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 8 && (
                <Level8Cake
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(9)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 9 && (
                <Level9Letter
                  effectsRef={effectsRef}
                  onNext={() => goToLevel(10)}
                  onUnlockBadge={unlockBadge}
                />
              )}
              {currentLevel === 10 && (
                <Level10Finale
                  effectsRef={effectsRef}
                  onReplay={handleReplay}
                  onOpenBadges={() => setBadgesModalOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* Achievement Badges Modal */}
      <BadgesModal
        isOpen={badgesModalOpen}
        onClose={() => setBadgesModalOpen(false)}
        earnedIds={earnedBadges}
      />
    </div>
  );
}
