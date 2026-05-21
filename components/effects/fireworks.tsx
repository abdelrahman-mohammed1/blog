"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

const COLORS = [
  "#a78bfa",
  "#818cf8",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f97316",
];

interface FireworksProps {
  active: boolean;
  durationMs?: number;
  className?: string;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function Fireworks({
  active,
  durationMs = 2800,
  className,
}: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const activeUntilRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    activeUntilRef.current = Date.now() + durationMs;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const launchRocket = (targetX?: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const x = targetX ?? Math.random() * w * 0.8 + w * 0.1;
      const targetY = h * (0.2 + Math.random() * 0.35);
      rocketsRef.current.push({
        x,
        y: h,
        targetY,
        vy: -(7 + Math.random() * 4),
        color: randomColor(),
        trail: [],
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 48 + Math.floor(Math.random() * 32);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 2 + Math.random() * 5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.5,
          color: Math.random() > 0.35 ? color : randomColor(),
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(() => launchRocket(), i * 180);
    }

    const tick = () => {
      const now = Date.now();
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (now < activeUntilRef.current && Math.random() < 0.04) {
        launchRocket();
      }

      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1 });
        if (rocket.trail.length > 12) rocket.trail.shift();
        rocket.trail.forEach((t) => {
          t.alpha *= 0.88;
        });

        rocket.y += rocket.vy;
        rocket.vy *= 0.98;

        rocket.trail.forEach((t) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = rocket.color;
          ctx.globalAlpha = t.alpha * 0.6;
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = rocket.color;
        ctx.fill();

        if (rocket.y <= rocket.targetY) {
          explode(rocket.x, rocket.y, rocket.color);
          return false;
        }
        return true;
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.98;
        p.life -= 0.016 / p.maxLife;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.life);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      if (
        now < activeUntilRef.current + 500 ||
        particlesRef.current.length > 0 ||
        rocketsRef.current.length > 0
      ) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        particlesRef.current = [];
        rocketsRef.current = [];
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
      rocketsRef.current = [];
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[100] bg-transparent",
        className
      )}
    />
  );
}
