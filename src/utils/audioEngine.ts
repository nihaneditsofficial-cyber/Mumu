// Synthesized Web Audio API engine for gentle music-box melodies and crisp sound effects

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private musicEnabled = false;
  private sfxEnabled = true;
  private musicTimer: number | null = null;
  private noteIndex = 0;

  // Gentle music box "Happy Birthday" + dreamy arpeggio progression (Hz)
  private readonly melodyNotes: Array<{ freq: number; dur: number }> = [
    { freq: 523.25, dur: 0.35 }, // C5
    { freq: 523.25, dur: 0.25 }, // C5
    { freq: 587.33, dur: 0.55 }, // D5
    { freq: 523.25, dur: 0.55 }, // C5
    { freq: 698.46, dur: 0.55 }, // F5
    { freq: 659.25, dur: 0.95 }, // E5

    { freq: 523.25, dur: 0.35 }, // C5
    { freq: 523.25, dur: 0.25 }, // C5
    { freq: 587.33, dur: 0.55 }, // D5
    { freq: 523.25, dur: 0.55 }, // C5
    { freq: 783.99, dur: 0.55 }, // G5
    { freq: 698.46, dur: 0.95 }, // F5

    { freq: 523.25, dur: 0.35 }, // C5
    { freq: 523.25, dur: 0.25 }, // C5
    { freq: 1046.5, dur: 0.55 }, // C6
    { freq: 880.0, dur: 0.55 },  // A5
    { freq: 698.46, dur: 0.55 }, // F5
    { freq: 659.25, dur: 0.55 }, // E5
    { freq: 587.33, dur: 0.85 }, // D5

    { freq: 932.33, dur: 0.35 }, // Bb5
    { freq: 932.33, dur: 0.25 }, // Bb5
    { freq: 880.0, dur: 0.55 },  // A5
    { freq: 698.46, dur: 0.55 }, // F5
    { freq: 783.99, dur: 0.55 }, // G5
    { freq: 698.46, dur: 1.15 }, // F5
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusicLoop();
    } else {
      this.stopMusicLoop();
    }
  }

  private startMusicLoop() {
    this.stopMusicLoop();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const scheduleNext = () => {
      if (!this.musicEnabled) return;
      const note = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
      this.playMusicBoxTone(note.freq, note.dur);
      this.noteIndex += 1;
      this.musicTimer = window.setTimeout(scheduleNext, note.dur * 1000);
    };

    scheduleNext();
  }

  private stopMusicLoop() {
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playMusicBoxTone(freq: number, duration: number) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(freq * 2, now);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.015, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0005, now + duration * 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration * 1.15);

    osc.connect(gain);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    shimmer.start(now);
    osc.stop(now + duration * 1.2);
    shimmer.stop(now + duration * 1.2);
  }

  public playSparkle() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [880, 1174.66, 1396.91, 1760];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.045);
      gain.gain.setValueAtTime(0.001, now + idx * 0.045);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.045 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.045 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.28);
    });
  }

  public playPop() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(860, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playChime(pitchMultiplier = 1) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(987.77 * pitchMultiplier, now + 0.16);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playDoorOpen() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [392.0, 493.88, 587.33, 783.99, 987.77];
    chord.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.95);
    });
  }

  public playCandleLight() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playFanfare() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfare = [
      { f: 523.25, t: 0, d: 0.18 },
      { f: 659.25, t: 0.14, d: 0.18 },
      { f: 783.99, t: 0.28, d: 0.18 },
      { f: 1046.5, t: 0.42, d: 0.65 },
    ];
    fanfare.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.001, now + t);
      gain.gain.linearRampToValueAtTime(0.11, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + t + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + d + 0.05);
    });
  }

  public playTypeClick() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(920 + Math.random() * 160, now);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }
}

export const audioEngine = new BirthdayAudioEngine();
