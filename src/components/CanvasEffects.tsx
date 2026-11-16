import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface EffectsEngineHandle {
  burstSparkles: (x: number, y: number, colors?: string[]) => void;
  launchConfetti: (count?: number, originX?: number, originY?: number) => void;
  launchFirework: (targetX?: number, targetY?: number) => void;
  burstHearts: (x: number, y: number) => void;
  burstStars: (x: number, y: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  color: string;
  shape: 'circle' | 'rect' | 'star' | 'heart' | 'spark';
  rotation: number;
  vRot: number;
  trail?: Array<{ x: number; y: number }>;
}

const DEFAULT_PALETTE = [
  '#FF7EB6',
  '#F472B6',
  '#C084FC',
  '#FBBF24',
  '#38BDF8',
  '#FB7185',
  '#A78BFA',
  '#FDE68A',
];

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  const s = size * 0.6;
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(s * 0.5, -s * 0.4, s * 1.4, s * 0.3, 0, s * 1.2);
  ctx.bezierCurveTo(-s * 1.4, s * 0.3, -s * 0.5, -s * 0.4, 0, s * 0.35);
  ctx.closePath();
  ctx.fill();
}

export const CanvasEffects = forwardRef<EffectsEngineHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ambientRef = useRef<Array<{ x: number; y: number; r: number; vy: number; a: number; phase: number }>>([]);

  useImperativeHandle(ref, () => ({
    burstSparkles(x: number, y: number, colors = DEFAULT_PALETTE) {
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.35;
        const speed = 1.6 + Math.random() * 4.2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2 + Math.random() * 3.5,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.015,
          gravity: 0.04,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: i % 3 === 0 ? 'star' : 'spark',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.14,
        });
      }
    },

    launchConfetti(count = 75, originX?: number, originY?: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ox = originX ?? w * 0.5;
      const oy = originY ?? h * 0.35;

      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const speed = 4 + Math.random() * 9;
        particlesRef.current.push({
          x: ox + (Math.random() - 0.5) * 80,
          y: oy + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: 5 + Math.random() * 6,
          alpha: 1,
          decay: 0.007 + Math.random() * 0.005,
          gravity: 0.16,
          color: DEFAULT_PALETTE[Math.floor(Math.random() * DEFAULT_PALETTE.length)],
          shape: i % 5 === 0 ? 'star' : 'rect',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
        });
      }
    },

    launchFirework(targetX?: number, targetY?: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fx = targetX ?? w * (0.18 + Math.random() * 0.64);
      const fy = targetY ?? h * (0.16 + Math.random() * 0.34);
      const baseColor = DEFAULT_PALETTE[Math.floor(Math.random() * DEFAULT_PALETTE.length)];
      const secondColor = DEFAULT_PALETTE[Math.floor(Math.random() * DEFAULT_PALETTE.length)];

      const count = 48;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
        const speed = 2.2 + Math.random() * 5.6;
        particlesRef.current.push({
          x: fx,
          y: fy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.4 + Math.random() * 2.8,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.01,
          gravity: 0.06,
          color: i % 2 === 0 ? baseColor : secondColor,
          shape: i % 6 === 0 ? 'star' : 'circle',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
          trail: [],
        });
      }
    },

    burstHearts(x: number, y: number) {
      const colors = ['#FB7185', '#F472B6', '#FDA4AF', '#E879F9', '#FBBF24'];
      for (let i = 0; i < 20; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const speed = 2.2 + Math.random() * 4.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 6,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.008,
          gravity: 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: 'heart',
          rotation: (Math.random() - 0.5) * 0.5,
          vRot: (Math.random() - 0.5) * 0.04,
        });
      }
    },

    burstStars(x: number, y: number) {
      const colors = ['#FDE68A', '#FBBF24', '#F472B6', '#C084FC', '#7DD3FC'];
      for (let i = 0; i < 24; i++) {
        const angle = (Math.PI * 2 * i) / 24;
        const speed = 2 + Math.random() * 5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 5,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.008,
          gravity: 0.05,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: 'star',
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
        });
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize ambient floating stardust
    ambientRef.current = Array.from({ length: 42 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.8 + Math.random() * 2,
      vy: 0.15 + Math.random() * 0.35,
      a: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let rafId = 0;
    let frameCount = 0;

    const render = () => {
      frameCount += 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Ambient drifting stardust
      if (!prefersReducedMotion) {
        for (const dot of ambientRef.current) {
          dot.y -= dot.vy;
          dot.x += Math.sin(frameCount * 0.01 + dot.phase) * 0.18;
          if (dot.y < -10) {
            dot.y = h + 10;
            dot.x = Math.random() * w;
          }
          const twinkle = 0.5 + 0.5 * Math.sin(frameCount * 0.04 + dot.phase);
          ctx.globalAlpha = dot.a * twinkle;
          ctx.fillStyle = '#FDE68A';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Active burst particles
      const nextParticles: Particle[] = [];
      for (const p of particlesRef.current) {
        if (p.trail) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 5) p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02 || p.y > h + 80) continue;

        if (p.trail && p.trail.length > 1) {
          ctx.save();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, p.size * 0.65);
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.6);
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.shape === 'spark') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        nextParticles.push(p);
      }

      // Cap particle array for silky 60fps mobile performance
      particlesRef.current = nextParticles.slice(-360);
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
});

CanvasEffects.displayName = 'CanvasEffects';
