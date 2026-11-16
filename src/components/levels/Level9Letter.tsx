import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, MailOpen, RotateCcw } from 'lucide-react';
import { PERSONALIZATION, SECRET_LETTER_PARAGRAPHS } from '../../data/birthdayContent';
import { EffectsEngineHandle } from '../CanvasEffects';
import { audioEngine } from '../../utils/audioEngine';

interface Level9LetterProps {
  effectsRef: React.RefObject<EffectsEngineHandle | null>;
  onNext: () => void;
  onUnlockBadge: (id: string) => void;
}

const FULL_TEXT = SECRET_LETTER_PARAGRAPHS.join('\n\n');

export const Level9Letter: React.FC<Level9LetterProps> = ({
  effectsRef,
  onNext,
  onUnlockBadge,
}) => {
  const [opened, setOpened] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!opened || typingDone) return;

    const timer = window.setInterval(() => {
      setCharCount((prev) => {
        const next = prev + 2;
        if (next % 10 === 0) {
          audioEngine.playTypeClick();
        }
        if (next >= FULL_TEXT.length) {
          setTypingDone(true);
          window.clearInterval(timer);
          return FULL_TEXT.length;
        }
        return next;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [opened, typingDone]);

  const handleOpenEnvelope = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (opened) return;
    setOpened(true);
    const rect = e.currentTarget.getBoundingClientRect();
    effectsRef.current?.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    audioEngine.playDoorOpen();
    onUnlockBadge('letter');
  };

  const handleRevealAll = () => {
    setCharCount(FULL_TEXT.length);
    setTypingDone(true);
    audioEngine.playSparkle();
  };

  const handleReplayTyping = () => {
    setCharCount(0);
    setTypingDone(false);
  };

  const visibleText = FULL_TEXT.slice(0, charCount);
  const paragraphs = visibleText.split('\n\n');

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-pink-200/85 uppercase">
          Level 9 · Secret Letter
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">
          A Heartfelt Note for {PERSONALIZATION.name}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-purple-100/80 sm:text-base">
          {opened
            ? `Written with warmth and appreciation by ${PERSONALIZATION.createdBy}.`
            : 'Break the golden wax seal on the magical envelope to read your personal letter.'}
        </p>
      </div>

      {!opened ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleOpenEnvelope}
            aria-label="Open secret birthday letter envelope"
            className="animate-float-slow group relative w-full max-w-sm cursor-pointer rounded-3xl border border-pink-200/35 bg-gradient-to-br from-rose-200/20 via-pink-300/15 to-purple-400/20 p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300"
          >
            {/* Envelope Flap Triangle Visual */}
            <div className="mx-auto flex h-44 flex-col items-center justify-center rounded-2xl border border-white/25 bg-gradient-to-b from-rose-100/15 to-purple-900/30 p-6 backdrop-blur-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-300 text-slate-950 shadow-xl shadow-rose-500/40 transition-transform group-hover:scale-110">
                <Heart className="h-7 w-7 fill-rose-700 text-rose-800" />
              </div>
              <p className="font-display mt-4 text-xl font-bold text-white">
                For {PERSONALIZATION.name}
              </p>
              <p className="mt-1 text-xs text-pink-200/85">
                From {PERSONALIZATION.createdBy} · Tap seal to open 💌
              </p>
            </div>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="glass-panel mt-8 rounded-3xl p-6 sm:p-10"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-pink-200 uppercase">
              <MailOpen className="h-4 w-4" />
              <span>{PERSONALIZATION.age}th Birthday Keepsake Letter</span>
            </div>
            <div className="flex items-center gap-2">
              {!typingDone ? (
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-white/20"
                >
                  Read All Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReplayTyping}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-white/20"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Replay</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 text-left text-base leading-relaxed text-purple-50/95 sm:text-lg">
            {paragraphs.map((para, idx) => {
              const isGreeting = idx === 0;
              const isSignoff = idx >= SECRET_LETTER_PARAGRAPHS.length - 2;
              return (
                <p
                  key={idx}
                  className={
                    isGreeting || isSignoff
                      ? 'font-display text-xl font-semibold text-amber-200 sm:text-2xl'
                      : ''
                  }
                >
                  {para}
                  {idx === paragraphs.length - 1 && !typingDone && (
                    <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-pink-300 align-middle" />
                  )}
                </p>
              );
            })}
          </div>

          {typingDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center border-t border-white/12 pt-6"
            >
              <button
                type="button"
                onClick={() => {
                  audioEngine.playFanfare();
                  onNext();
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-pink-500/30 transition-transform hover:scale-[1.03] sm:text-base"
              >
                <span>Enter the Grand Finale Celebration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
};
