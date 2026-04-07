'use client';

// Thematic particle animation effects for month transitions.
// Each month has a unique particle effect that plays during navigation.

import React, { useEffect, useRef } from 'react';

interface MonthTransitionEffectProps {
  month: number; // 0-indexed
  active: boolean;
  direction: 'next' | 'prev';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  color?: string;
  type?: string;
}

// Month effect config
const MONTH_EFFECTS: Record<number, {
  name: string;
  emoji: string;
  particleCount: number;
  colors: string[];
  type: 'wind' | 'rain' | 'snow' | 'petals' | 'leaves' | 'none';
}> = {
  0:  { name: 'frost',   emoji: '❄️', particleCount: 30, colors: ['#BAE6FD','#E0F2FE','#F0F9FF'], type: 'snow' },
  1:  { name: 'hearts',  emoji: '💕', particleCount: 0,  colors: [],                               type: 'none' },
  2:  { name: 'petals',  emoji: '🌸', particleCount: 28, colors: ['#FBCFE8','#F9A8D4','#FDF2F8','#FCE7F3'], type: 'petals' },
  3:  { name: 'petals',  emoji: '🌸', particleCount: 32, colors: ['#FBCFE8','#F9A8D4','#FDF2F8','#FEE2E2'], type: 'petals' },
  4:  { name: 'breeze',  emoji: '🌿', particleCount: 0,  colors: [],                               type: 'none' },
  5:  { name: 'wind',    emoji: '🌬️', particleCount: 20, colors: ['rgba(186,230,253,0.6)','rgba(224,242,254,0.5)','rgba(240,249,255,0.4)'], type: 'wind' },
  6:  { name: 'rain',    emoji: '🌧️', particleCount: 50, colors: ['rgba(147,197,253,0.7)','rgba(96,165,250,0.6)','rgba(59,130,246,0.5)'], type: 'rain' },
  7:  { name: 'sun',     emoji: '☀️', particleCount: 0,  colors: [],                               type: 'none' },
  8:  { name: 'breeze',  emoji: '🍃', particleCount: 0,  colors: [],                               type: 'none' },
  9:  { name: 'leaves',  emoji: '🍂', particleCount: 30, colors: ['#DC2626','#EA580C','#D97706','#B45309','#92400E','#F59E0B'], type: 'leaves' },
  10: { name: 'leaves',  emoji: '🍁', particleCount: 20, colors: ['#B45309','#92400E','#78350F','#D97706'], type: 'leaves' },
  11: { name: 'snow',    emoji: '❄️', particleCount: 45, colors: ['#FFFFFF','#E0F2FE','#BAE6FD','#F0F9FF'], type: 'snow' },
};

export default function MonthTransitionEffect({ month, active, direction }: MonthTransitionEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  const config = MONTH_EFFECTS[month] ?? MONTH_EFFECTS[0];

  useEffect(() => {
    if (!active || config.type === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Spawn particles
    particles.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const maxLife = 60 + Math.random() * 80;

      let p: Particle;

      if (config.type === 'rain') {
        p = {
          x: Math.random() * W,
          y: -10 - Math.random() * H * 0.5,
          vx: direction === 'next' ? 0.5 + Math.random() * 0.5 : -(0.5 + Math.random() * 0.5),
          vy: 4 + Math.random() * 4,
          size: 1 + Math.random() * 1.5,
          opacity: 0.5 + Math.random() * 0.4,
          rotation: 0,
          rotationSpeed: 0,
          life: 0,
          maxLife,
          color,
          type: 'rain',
        };
      } else if (config.type === 'snow') {
        p = {
          x: Math.random() * W,
          y: -10 - Math.random() * 40,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 0.8 + Math.random() * 1.5,
          size: 2 + Math.random() * 4,
          opacity: 0.6 + Math.random() * 0.4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          life: 0,
          maxLife,
          color,
          type: 'snow',
        };
      } else if (config.type === 'wind') {
        p = {
          x: direction === 'next' ? -20 : W + 20,
          y: Math.random() * H,
          vx: direction === 'next' ? 3 + Math.random() * 4 : -(3 + Math.random() * 4),
          vy: (Math.random() - 0.5) * 1.5,
          size: 1 + Math.random() * 2,
          opacity: 0.3 + Math.random() * 0.5,
          rotation: 0,
          rotationSpeed: 0,
          life: 0,
          maxLife: 40 + Math.random() * 40,
          color,
          type: 'wind',
        };
      } else if (config.type === 'petals') {
        p = {
          x: Math.random() * W,
          y: -10 - Math.random() * 30,
          vx: (Math.random() - 0.5) * 2 + (direction === 'next' ? 0.5 : -0.5),
          vy: 1 + Math.random() * 2,
          size: 4 + Math.random() * 5,
          opacity: 0.7 + Math.random() * 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          life: 0,
          maxLife,
          color,
          type: 'petal',
        };
      } else {
        // leaves
        p = {
          x: Math.random() * W,
          y: -10 - Math.random() * 30,
          vx: (Math.random() - 0.5) * 2.5 + (direction === 'next' ? 1 : -1),
          vy: 1.5 + Math.random() * 2.5,
          size: 5 + Math.random() * 7,
          opacity: 0.8 + Math.random() * 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          life: 0,
          maxLife,
          color,
          type: 'leaf',
        };
      }

      // Stagger spawn
      p.life = -Math.floor(Math.random() * 60);
      particles.current.push(p);
    }

    function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 0.15;
      ctx.translate(x, y);
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size);
        ctx.stroke();
        // Small branches
        ctx.beginPath();
        ctx.moveTo(0, size * 0.4);
        ctx.lineTo(size * 0.25, size * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, size * 0.4);
        ctx.lineTo(-size * 0.25, size * 0.6);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, rotation: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Petal vein
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.7);
      ctx.stroke();
      ctx.restore();
    }

    function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, rotation: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.5, size * 0.3, 0, size * 0.7);
      ctx.bezierCurveTo(-size * 0.5, size * 0.3, -size * 0.5, -size * 0.3, 0, -size * 0.7);
      ctx.fillStyle = color;
      ctx.fill();
      // Leaf vein
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(0, size * 0.7);
      ctx.stroke();
      ctx.restore();
    }

    function drawWindLine(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (direction === 'next' ? size * 8 : -size * 8), y + (Math.random() - 0.5) * 4);
      ctx.stroke();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      let allDone = true;

      particles.current.forEach(p => {
        if (p.life < 0) {
          p.life++;
          return;
        }

        allDone = false;
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wind: add sinusoidal drift
        if (p.type === 'wind') {
          p.vy += Math.sin(p.life * 0.1) * 0.05;
        }

        // Snow: gentle sway
        if (p.type === 'snow') {
          p.vx += Math.sin(p.life * 0.05) * 0.03;
        }

        // Fade out near end of life
        const lifeRatio = p.life / p.maxLife;
        const fadeOpacity = lifeRatio > 0.7 ? p.opacity * (1 - (lifeRatio - 0.7) / 0.3) : p.opacity;

        if (p.life >= p.maxLife || p.y > H + 20 || p.x < -20 || p.x > W + 20) {
          return; // done
        }

        if (p.type === 'snow') {
          drawSnowflake(ctx, p.x, p.y, p.size, p.color ?? '#fff', fadeOpacity);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.color ?? '#FBCFE8', fadeOpacity, p.rotation);
        } else if (p.type === 'leaf') {
          drawLeaf(ctx, p.x, p.y, p.size, p.color ?? '#D97706', fadeOpacity, p.rotation);
        } else if (p.type === 'wind') {
          drawWindLine(ctx, p.x, p.y, p.size, p.color ?? 'rgba(186,230,253,0.5)', fadeOpacity);
        } else if (p.type === 'rain') {
          ctx.save();
          ctx.globalAlpha = fadeOpacity;
          ctx.strokeStyle = p.color ?? 'rgba(147,197,253,0.7)';
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      if (!allDone) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, W, H, 0);
    };
  }, [active, month, direction]);

  if (config.type === 'none' || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={700}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 30,
        borderRadius: 'inherit',
      }}
      aria-hidden="true"
    />
  );
}
