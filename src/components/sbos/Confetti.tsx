import { useEffect, useRef } from 'react';

/**
 * One-shot canvas confetti for the post-purchase page.
 *
 * Hand-rolled rather than pulled from a package so it can carry the brand
 * palette instead of a default rainbow, and so the page stays dependency free
 * if it ever moves to its own domain.
 *
 * It fires two cannons from the bottom corners, then a softer centre pop a
 * beat later, and tears the loop down once the last piece leaves the screen.
 * It stays silent for anyone on reduced motion.
 */

const COLORS = [
  '#C25E44', // terracotta
  '#B45309', // burnt orange
  '#D98E3A', // amber
  '#EDE7DE', // sand
  '#F5F5F0', // warm cream
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  w: number;
  h: number;
  color: string;
  flutter: number;
  vflutter: number;
  life: number;
};

const GRAVITY = 0.28;
const DRAG = 0.994;

export default function Confetti({ duration = 4200 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Never celebrate over someone who asked for stillness.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // The page promotes itself out of the checkout overlay iframe on mount.
    // Firing in the frame too would burn the moment on a view nobody keeps.
    if (window.top && window.self !== window.top) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const particles: Particle[] = [];

    const burst = (
      originX: number,
      originY: number,
      count: number,
      angle: number,
      spread: number,
      power: number,
    ) => {
      for (let i = 0; i < count; i++) {
        const a = angle + rand(-spread, spread);
        const speed = rand(power * 0.5, power);
        const long = Math.random() > 0.35;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          rot: rand(0, Math.PI * 2),
          vrot: rand(-0.24, 0.24),
          w: long ? rand(7, 12) : rand(5, 8),
          h: long ? rand(10, 16) : rand(5, 8),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          flutter: rand(0, Math.PI * 2),
          vflutter: rand(0.08, 0.2),
          life: 1,
        });
      }
    };

    // Scale the volume to the viewport so a phone is not buried in paper.
    const density = Math.min(1, width / 1100);
    const cannon = Math.round(70 * density) + 30;

    burst(0, height * 0.98, cannon, -Math.PI / 3.1, 0.42, rand(19, 23));
    burst(width, height * 0.98, cannon, (-Math.PI * 2) / 3 - 0.06, 0.42, rand(19, 23));

    let centrePopped = false;
    let raf = 0;
    let last = performance.now();
    const started = last;

    const frame = (now: number) => {
      const elapsed = now - started;
      // Clamp so a backgrounded tab does not teleport everything off screen.
      const dt = Math.min(32, now - last) / 16.667;
      last = now;

      if (!centrePopped && elapsed > 260) {
        centrePopped = true;
        burst(width / 2, height * 0.42, Math.round(46 * density) + 18, -Math.PI / 2, Math.PI, rand(9, 13));
      }

      ctx.clearRect(0, 0, width, height);

      const fading = elapsed > duration - 900;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vy += GRAVITY * dt;
        p.vx *= DRAG ** dt;
        p.vy *= DRAG ** dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        p.flutter += p.vflutter * dt;
        if (fading) p.life -= 0.022 * dt;

        if (p.y > height + 60 || p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Squashing on one axis reads as a piece tumbling through its own plane.
        ctx.scale(Math.cos(p.flutter), 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (particles.length === 0 || elapsed > duration + 2500) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}
