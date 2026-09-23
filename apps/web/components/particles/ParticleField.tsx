'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import { Zap, Activity, Radio, Cpu, RefreshCw } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  id: number;
  freq: number;
  line: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const ParticleField: React.FC<{
  density?: number;
  height?: number;
  isExpanded?: boolean;
}> = ({ density = 110, height = 140, isExpanded = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const impactSeverity = useTwinStore((s) => s.impactSeverity);
  const isSimulating = useTwinStore((s) => s.isSimulating);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);

  const [hoveredNode, setHoveredNode] = useState<{ id: number; freq: number; line: string; flux: number } | null>(null);
  const [pulseCount, setPulseCount] = useState(0);

  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const ripples = useRef<Ripple[]>([]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleCanvasMouseLeave = () => {
    mousePos.current.active = false;
    setHoveredNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger an expanding radiant shockwave
    ripples.current.push({
      x,
      y,
      radius: 4,
      maxRadius: isExpanded ? 180 : 90,
      alpha: 0.9,
    });
    setPulseCount((c) => c + 1);
  };

  const triggerManualPulse = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    ripples.current.push({
      x: w / 2,
      y: h / 2,
      radius: 5,
      maxRadius: isExpanded ? 240 : 120,
      alpha: 1.0,
    });
    setPulseCount((c) => c + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const updateSize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = isExpanded ? (canvas.parentElement?.clientHeight || 460) : height;
    };
    updateSize();

    const width = canvas.width;
    const h = canvas.height;
    const linesList = ['Line 1 (CSD)', 'Line 2 (Juices)', 'Line 3 (Kombucha)', 'Downstream QC'];

    const particles: Particle[] = [];
    for (let i = 0; i < density; i++) {
      particles.push({
        id: i + 1,
        x: Math.random() * width,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        freq: Math.floor(Math.random() * 180 + 60),
        line: linesList[i % linesList.length],
      });
    }

    const render = () => {
      const w = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, w, ch);

      // Background ambient gradient
      const currentHue = appliedPlan ? 145 : impactSeverity === 'critical' ? 345 : 195;
      const grad = ctx.createLinearGradient(0, 0, w, ch);
      grad.addColorStop(0, `hsla(${currentHue}, 80%, 30%, 0.03)`);
      grad.addColorStop(0.5, `hsla(${currentHue}, 90%, 40%, 0.08)`);
      grad.addColorStop(1, `hsla(${currentHue}, 80%, 30%, 0.03)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, ch);

      // 1. Update and draw ripples
      for (let r = ripples.current.length - 1; r >= 0; r--) {
        const rip = ripples.current[r];
        rip.radius += isExpanded ? 4.5 : 3.0;
        rip.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${currentHue}, 90%, 65%, ${rip.alpha})`;
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${currentHue}, 100%, 70%, ${rip.alpha})`;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (rip.alpha < 0.03 || rip.radius > rip.maxRadius) {
          ripples.current.splice(r, 1);
        }
      }

      // 2. Physics & Particle Drawing
      let nearestNode: { id: number; freq: number; line: string; flux: number } | null = null;
      let minMouseDist = 45;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Cursor interactive repulsion/attraction force
        if (mousePos.current.active) {
          const mdx = p1.x - mousePos.current.x;
          const mdy = p1.y - mousePos.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 95) {
            const force = (1 - mdist / 95) * 1.8;
            p1.x += (mdx / mdist) * force;
            p1.y += (mdy / mdist) * force;

            if (mdist < minMouseDist) {
              minMouseDist = mdist;
              nearestNode = {
                id: p1.id,
                freq: p1.freq,
                line: p1.line,
                flux: Math.round((1 - mdist / 95) * 100),
              };
            }
          }
        }

        // Ripple interaction
        for (const rip of ripples.current) {
          const rdx = p1.x - rip.x;
          const rdy = p1.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (Math.abs(rdist - rip.radius) < 20) {
            p1.x += (rdx / (rdist || 1)) * 1.2;
            p1.y += (rdy / (rdist || 1)) * 1.2;
            p1.alpha = Math.min(1, p1.alpha + 0.3);
          }
        }

        // Velocity update
        const speedMultiplier = isSimulating ? 2.8 : 1.0;
        p1.x += p1.vx * speedMultiplier;
        p1.y += p1.vy * speedMultiplier;

        if (p1.x < 0) p1.x = w;
        if (p1.x > w) p1.x = 0;
        if (p1.y < 0) p1.y = ch;
        if (p1.y > ch) p1.y = 0;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${currentHue}, 90%, 65%, ${p1.alpha})`;
        ctx.shadowBlur = p1.size * 3;
        ctx.shadowColor = `hsla(${currentHue}, 90%, 65%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles to form intelligence mesh
        const maxConnDist = isExpanded ? 85 : 62;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${currentHue}, 80%, 55%, ${
              (1 - dist / maxConnDist) * 0.28
            })`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (nearestNode) {
        setHoveredNode(nearestNode);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, height, impactSeverity, isSimulating, appliedPlan, isExpanded]);

  return (
    <div className={`relative w-full overflow-hidden rounded-lg border border-twin-panelBorder/60 bg-slate-950/90 ${isExpanded ? 'h-full flex flex-col' : ''}`}>
      {/* Top Header Overlay */}
      <div className="absolute top-2 left-3 z-10 flex items-center space-x-2 pointer-events-none font-sans">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
        <span className="font-sans text-xs uppercase tracking-wider text-cyan-300 font-bold">
          Sensor Telemetry & Entropy Field
        </span>
        <span className="rounded-md border border-cyan-500/30 bg-cyan-950/70 px-2 py-0.5 font-sans text-xs font-medium text-cyan-200">
          {appliedPlan ? '0.12 (Optimal Coherence)' : '0.68 (Elevated Harmonic)'}
        </span>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute top-2 right-3 z-20 flex items-center space-x-2 font-sans">
        <button
          onClick={triggerManualPulse}
          className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/80 px-2.5 py-1 font-sans text-xs font-medium text-cyan-200 hover:bg-cyan-900 hover:text-white transition-colors shadow"
          title="Send radiant acoustic pulse wave across sensor nodes"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Pulse Wave</span>
        </button>
      </div>

      {/* Hover Node Live Telemetry Badge */}
      {hoveredNode && (
        <div className="absolute bottom-2 left-3 z-20 pointer-events-none flex items-center space-x-2.5 rounded-lg border border-cyan-500/40 bg-slate-950/90 px-3 py-1.5 text-xs font-sans text-cyan-200 shadow-xl backdrop-blur">
          <Activity className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span>Sensor Probe #{hoveredNode.id}:</span>
          <span className="text-white font-bold">{hoveredNode.line}</span>
          <span className="text-amber-400 font-bold font-mono">{hoveredNode.freq} Hz</span>
          <span className="text-emerald-400 font-mono">Flux {hoveredNode.flux}%</span>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        onClick={handleCanvasClick}
        className="block w-full cursor-crosshair active:scale-[0.999] transition-transform"
        style={{ height: isExpanded ? '100%' : `${height}px` }}
      />
    </div>
  );
};
