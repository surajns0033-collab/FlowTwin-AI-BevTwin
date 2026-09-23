'use client';

import React, { useEffect, useRef } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  color: string;
  targetColor: string;
  size: number;
  alpha: number;
  targetAlpha: number;
  isFoam?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface DotMatrixProps {
  isExpanded?: boolean;
  height?: number;
  shapeMode: 'cans' | 'valves' | 'symbol';
}

export const DotMatrixVisualizer: React.FC<DotMatrixProps> = ({
  isExpanded = false,
  height,
  shapeMode = 'cans',
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const ripples = useRef<Ripple[]>([]);
  const dotsRef = useRef<Dot[]>([]);

  // Handle cursor interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripples.current.push({
      x,
      y,
      radius: 4,
      maxRadius: isExpanded ? 150 : 70,
      alpha: 1.0,
    });
  };

  // Main canvas animation and morphing engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Number of dots in matrix
    const numDots = isExpanded ? 240 : 120;

    // Initialize dots if needed
    if (dotsRef.current.length !== numDots) {
      dotsRef.current = [];
      for (let i = 0; i < numDots; i++) {
        dotsRef.current.push({
          x: Math.random() * 400,
          y: Math.random() * 100,
          vx: 0,
          vy: 0,
          tx: 0,
          ty: 0,
          color: '#00d2ff',
          targetColor: '#00d2ff',
          size: isExpanded ? 2.8 : 1.9,
          alpha: 0.8,
          targetAlpha: 0.8,
        });
      }
    }

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const h = (canvas.height = canvas.parentElement?.clientHeight || (height || 60));

      ctx.clearRect(0, 0, w, h);
      time += 0.035;

      // Draw faint matrix background guide grid
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      const dotSpacing = isExpanded ? 20 : 13;
      for (let gx = dotSpacing / 2; gx < w; gx += dotSpacing) {
        for (let gy = dotSpacing / 2; gy < h; gy += dotSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Compute target positions (tx, ty) based on current shapeMode
      const dots = dotsRef.current;

      if (shapeMode === 'cans') {
        // =========================================================================
        // SHAPE 1: BEVERAGE CANS ON LINE & VALVE #7 FOAMING ERUPTION
        // =========================================================================
        const numCans = isExpanded ? 7 : 5;
        const canWidth = isExpanded ? 32 : 18;
        const canHeight = isExpanded ? 58 : 26;
        const spacing = w / (numCans + 1);
        const baseY = isExpanded ? h * 0.86 : h * 0.88;

        let dotIndex = 0;
        const foamDotsCount = isExpanded ? 45 : 20;
        const dotsPerCan = Math.floor((numDots - foamDotsCount) / numCans);

        // Problematic valve 7 station index
        const valve7CanIndex = isExpanded ? 4 : 3;

        for (let c = 0; c < numCans; c++) {
          const cx = spacing * (c + 1);
          const isValve7 = c === valve7CanIndex;

          const rows = Math.floor(Math.sqrt(dotsPerCan * 1.5));
          const cols = Math.ceil(dotsPerCan / rows);

          for (let r = 0; r < rows && dotIndex < (numDots - foamDotsCount); r++) {
            for (let col = 0; col < cols && dotIndex < (numDots - foamDotsCount); col++) {
              const d = dots[dotIndex];
              const normalizedCol = cols > 1 ? col / (cols - 1) - 0.5 : 0;
              const normalizedRow = rows > 1 ? r / (rows - 1) : 0;

              d.tx = cx + normalizedCol * canWidth;
              d.ty = baseY - normalizedRow * canHeight;

              if (isValve7) {
                if (appliedPlan) {
                  d.targetColor = '#00f076'; // Stabilized green
                  d.targetAlpha = 0.9;
                } else {
                  d.targetColor = '#ff2a5f'; // Fault crimson
                  d.targetAlpha = 1.0;
                  // Thermal/vibrational jitter on valve 7 can body
                  d.tx += Math.sin(time * 16 + r * 2) * 1.6;
                }
              } else {
                d.targetColor = c % 2 === 0 ? '#00d2ff' : '#38bdf8';
                d.targetAlpha = 0.8;
              }
              d.size = isExpanded ? 2.8 : 1.9;
              d.isFoam = false;
              dotIndex++;
            }
          }
        }

        // Foam dots: foam bubbling above Valve #7 can
        const foamCanX = spacing * (valve7CanIndex + 1);
        const foamCanTop = baseY - canHeight;

        while (dotIndex < numDots) {
          const d = dots[dotIndex];
          d.isFoam = true;

          if (appliedPlan) {
            // Plan applied: Foam settled smoothly inside can rim into calm meniscus
            const fIdx = dotIndex % 20;
            const spread = (fIdx % 5 - 2) * (isExpanded ? 4.2 : 2.2);
            d.tx = foamCanX + spread;
            d.ty = foamCanTop + Math.sin(time * 3 + fIdx) * (isExpanded ? 2.5 : 1.2);
            d.targetColor = '#00f076';
            d.targetAlpha = 0.6;
            d.size = isExpanded ? 2.2 : 1.5;
          } else {
            // Bottleneck active: Agitated foam cloud violently erupting upward!
            const fSeed = dotIndex * 1.618;
            const bubbleSpread = (Math.sin(fSeed * 2.3) * 0.5 + 0.5) * (isExpanded ? 30 : 16);
            const riseProgress = ((time * 1.8 + fSeed * 0.7) % 1);
            const bubbleHeight = riseProgress * (isExpanded ? 46 : 20);

            d.tx = foamCanX + (Math.cos(fSeed * 3.7) * bubbleSpread);
            d.ty = foamCanTop - bubbleHeight;
            // Hot foamy carbonation bubbles: alternating crimson & amber-white
            d.targetColor = dotIndex % 3 === 0 ? '#ffffff' : (dotIndex % 2 === 0 ? '#ff2a5f' : '#ff7900');
            d.targetAlpha = 0.95 * (1 - riseProgress * 0.5);
            d.size = (isExpanded ? 2.6 : 1.8) * (1 - riseProgress * 0.3);
          }
          dotIndex++;
        }

        // Draw conveyor track line dots at bottom
        ctx.fillStyle = 'rgba(0, 210, 255, 0.25)';
        for (let trackX = 8; trackX < w; trackX += 14) {
          ctx.fillRect(trackX, baseY + 3, 7, 1.2);
        }

        // Draw callout tag on Valve #7 in expanded view
        if (isExpanded) {
          ctx.fillStyle = appliedPlan ? 'rgba(0, 240, 118, 0.15)' : 'rgba(255, 42, 95, 0.2)';
          ctx.strokeStyle = appliedPlan ? '#00f076' : '#ff2a5f';
          ctx.lineWidth = 1;
          const boxW = 140;
          const boxH = 20;
          const boxX = Math.min(w - boxW - 10, Math.max(10, foamCanX - boxW / 2));
          const boxY = Math.max(8, foamCanTop - 54);

          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.strokeRect(boxX, boxY, boxW, boxH);

          ctx.fillStyle = appliedPlan ? '#00f076' : '#ff5a7f';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            appliedPlan ? 'VALVE #7: NOMINAL MENISCUS' : 'VALVE #7: FOAM ERUPTION',
            boxX + boxW / 2,
            boxY + 13
          );

          // Indicator arrow pointing down to can top
          ctx.beginPath();
          ctx.moveTo(boxX + boxW / 2, boxY + boxH);
          ctx.lineTo(foamCanX, foamCanTop - (appliedPlan ? 4 : 14));
          ctx.strokeStyle = appliedPlan ? '#00f076' : '#ff2a5f';
          ctx.stroke();
        }
      } else if (shapeMode === 'valves') {
        // =========================================================================
        // SHAPE 2: ROTARY VALVE CAROUSEL (24 Rotary Isobaric Filling Heads)
        // =========================================================================
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) * (isExpanded ? 0.38 : 0.35);

        const numValves = 24;
        const dotsPerValve = Math.floor(numDots / numValves);

        for (let i = 0; i < numDots; i++) {
          const d = dots[i];
          const valveIndex = Math.floor(i / Math.max(1, dotsPerValve));
          const subIndex = i % Math.max(1, dotsPerValve);

          const angle = (valveIndex / numValves) * Math.PI * 2 + time * 0.35;
          const rOffset = (subIndex - dotsPerValve / 2) * (isExpanded ? 4 : 2.2);

          const isValve7 = valveIndex === 7;

          let r = radius + rOffset;
          if (isValve7 && !appliedPlan) {
            r += Math.sin(time * 18 + i) * (isExpanded ? 8 : 3.5);
            d.targetColor = '#ff2a5f';
            d.targetAlpha = 1.0;
            d.size = isExpanded ? 3.5 : 2.4;
          } else {
            d.targetColor = appliedPlan ? '#00f076' : '#00d2ff';
            d.targetAlpha = isValve7 && appliedPlan ? 1.0 : 0.75;
            d.size = isExpanded ? 2.8 : 1.9;
          }

          d.tx = centerX + Math.cos(angle) * r;
          d.ty = centerY + Math.sin(angle) * r;
          d.isFoam = false;
        }

        // Draw center rotary hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, isExpanded ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = appliedPlan ? '#00f076' : '#00d2ff';
        ctx.fill();
      } else {
        // =========================================================================
        // SHAPE 3: SYMBOL (Warning Triangle ⚠️ vs Checkmark ✓)
        // =========================================================================
        const cx = w / 2;
        const cy = h / 2;
        const size = Math.min(w, h) * (isExpanded ? 0.44 : 0.38);

        if (!appliedPlan) {
          // Warning Triangle ⚠️
          for (let i = 0; i < numDots; i++) {
            const d = dots[i];
            const p = i / numDots;

            d.targetColor = '#ff2a5f';
            d.targetAlpha = 0.9;
            d.size = isExpanded ? 2.8 : 1.9;
            d.isFoam = false;

            if (p < 0.33) {
              const t = p / 0.33;
              d.tx = cx - size * (1 - t);
              d.ty = cy + size * 0.7 - t * size * 1.5;
            } else if (p < 0.66) {
              const t = (p - 0.33) / 0.33;
              d.tx = cx + size * t;
              d.ty = cy - size * 0.8 + t * size * 1.5;
            } else if (p < 0.88) {
              const t = (p - 0.66) / 0.22;
              d.tx = cx + size - t * size * 2;
              d.ty = cy + size * 0.7;
            } else {
              const t = (p - 0.88) / 0.12;
              d.tx = cx;
              d.ty = cy - size * 0.3 + t * size * 0.7;
              d.targetColor = '#ffffff';
              d.targetAlpha = 1.0;
            }
          }
        } else {
          // Checkmark ✓
          for (let i = 0; i < numDots; i++) {
            const d = dots[i];
            const p = i / numDots;

            d.targetColor = '#00f076';
            d.targetAlpha = 0.95;
            d.size = isExpanded ? 2.8 : 1.9;
            d.isFoam = false;

            if (p < 0.35) {
              const t = p / 0.35;
              d.tx = cx - size * 0.8 + t * size * 0.6;
              d.ty = cy + t * size * 0.7;
            } else {
              const t = (p - 0.35) / 0.65;
              d.tx = cx - size * 0.2 + t * size * 1.1;
              d.ty = cy + size * 0.7 - t * size * 1.4;
            }
          }
        }
      }

      // Update and draw user interaction ripples
      for (let r = ripples.current.length - 1; r >= 0; r--) {
        const rip = ripples.current[r];
        rip.radius += isExpanded ? 4.5 : 2.5;
        rip.alpha *= 0.93;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 210, 255, ${rip.alpha * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.current.splice(r, 1);
        }
      }

      // Update dots with spring physics & draw
      const spring = 0.085;
      const damping = 0.82;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // 1. Spring toward target (tx, ty)
        const ax = (d.tx - d.x) * spring;
        const ay = (d.ty - d.y) * spring;
        d.vx = (d.vx + ax) * damping;
        d.vy = (d.vy + ay) * damping;

        // 2. Cursor repulsion
        if (mousePos.current.active) {
          const mdx = d.x - mousePos.current.x;
          const mdy = d.y - mousePos.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const repRadius = isExpanded ? 70 : 35;

          if (mdist < repRadius && mdist > 0) {
            const force = (1 - mdist / repRadius) * (isExpanded ? 5.0 : 2.8);
            d.vx += (mdx / mdist) * force;
            d.vy += (mdy / mdist) * force;
          }
        }

        // 3. Shockwave perturbation
        for (const rip of ripples.current) {
          const rdx = d.x - rip.x;
          const rdy = d.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (Math.abs(rdist - rip.radius) < 18) {
            const force = (1 - Math.abs(rdist - rip.radius) / 18) * 3.5 * rip.alpha;
            d.vx += (rdx / (rdist || 1)) * force;
            d.vy += (rdy / (rdist || 1)) * force;
          }
        }

        d.x += d.vx;
        d.y += d.vy;

        // Draw dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.targetColor;
        ctx.globalAlpha = d.targetAlpha;
        ctx.shadowBlur = d.isFoam && !appliedPlan ? 8 : (isExpanded ? 4 : 2);
        ctx.shadowColor = d.targetColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isExpanded, shapeMode, height]);

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
        className="block h-full w-full cursor-crosshair"
      />

      {/* Contextual Subtitle Label */}
      <div className="pointer-events-none absolute bottom-1.5 left-2 flex items-center space-x-1.5 text-[10px] font-sans font-medium text-slate-200 bg-slate-950/85 px-2 py-0.5 rounded-md border border-slate-700/80 shadow">
        <span
          className={`h-2 w-2 rounded-full ${
            appliedPlan ? 'bg-twin-green' : 'bg-twin-red animate-ping'
          }`}
        />
        <span className="truncate max-w-[260px]">
          {shapeMode === 'cans' &&
            (appliedPlan
              ? 'Matrix: Can Stream • Valve #7 Stabilized'
              : 'Matrix: Valve #7 Foam Eruption on Cans')}
          {shapeMode === 'valves' &&
            (appliedPlan
              ? 'Matrix: 24-Head Carousel • Synchronized'
              : 'Matrix: Head #7 Seal Leak Flashing Red')}
          {shapeMode === 'symbol' &&
            (appliedPlan ? 'Matrix: Production Nominal ✓' : 'Matrix: Bottleneck Critical ⚠️')}
        </span>
      </div>
    </div>
  );
};
