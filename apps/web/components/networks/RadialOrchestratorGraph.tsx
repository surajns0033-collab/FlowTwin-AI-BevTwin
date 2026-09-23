'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  angle: number;
  color: string;
  activeColor: string;
  status: string;
  task: string;
}

const AGENTS: AgentNode[] = [
  {
    id: 'observer',
    name: 'Observer',
    role: 'Sense',
    angle: -Math.PI / 2, // Top (12 o'clock)
    color: '#00d2ff',
    activeColor: '#00f076',
    status: 'Active',
    task: 'Ingesting 4.2 kHz Line 3 telemetry & vibration signals',
  },
  {
    id: 'simulator',
    name: 'Simulator',
    role: 'Predict',
    angle: -Math.PI / 6, // 2 o'clock
    color: '#38bdf8',
    activeColor: '#00f076',
    status: 'Running',
    task: 'Monte Carlo forecasting of Line 2 volume diversion',
  },
  {
    id: 'executor',
    name: 'Executor',
    role: 'Act',
    angle: Math.PI / 6, // 4 o'clock
    color: '#ff2a5f',
    activeColor: '#00f076',
    status: 'Standby',
    task: 'Awaiting PLC trigger to modulate diverter valve DV-03',
  },
  {
    id: 'memory',
    name: 'Memory',
    role: 'Learn',
    angle: Math.PI / 2, // 6 o'clock
    color: '#3b82f6',
    activeColor: '#00f076',
    status: 'Ready',
    task: 'Grounded in HACCP, CIP sanitization & SOP M07 specs',
  },
  {
    id: 'optimizer',
    name: 'Optimizer',
    role: 'Improve',
    angle: (5 * Math.PI) / 6, // 8 o'clock
    color: '#10b981',
    activeColor: '#00f076',
    status: 'Optimizing',
    task: 'Pareto frontier balancing: +1,400 cases/hr vs energy cost',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    role: 'Reason',
    angle: -(5 * Math.PI) / 6, // 10 o'clock
    color: '#a855f7',
    activeColor: '#00f076',
    status: 'Alert',
    task: 'Diagnosed +10.8°C thermal delta inducing CO2 foam flashing',
  },
];

interface RadialProps {
  height?: number;
  isMini?: boolean;
}

export const RadialOrchestratorGraph: React.FC<RadialProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredAgent, setHoveredAgent] = useState<AgentNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Particle bursts travelling along radial lines
    const particles: Array<{ agentIndex: number; progress: number; speed: number }> = [];
    for (let i = 0; i < 18; i++) {
      particles.push({
        agentIndex: i % AGENTS.length,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const h = (canvas.height = canvas.parentElement?.clientHeight || height);

      ctx.clearRect(0, 0, w, h);
      time += 0.03;

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * (isMini ? 0.35 : 0.29);

      // 1. Concentric orbital energy wave rings
      ctx.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        const ringR = radius * (r / 3);
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 210, 255, ${0.06 + Math.sin(time + r) * 0.03})`;
        ctx.stroke();
      }

      // 2. Radiant sunburst light rays matching Card 3 in reference image
      ctx.save();
      ctx.translate(cx, cy);
      const numRays = 48;
      for (let i = 0; i < numRays; i++) {
        const rayAngle = (i / numRays) * Math.PI * 2 + time * 0.05;
        const rayLen = radius * (0.55 + Math.sin(i * 3 + time * 2) * 0.18);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
        const alpha = 0.08 + (i % 3 === 0 ? 0.18 : 0.04);
        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
        ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.8;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Radial arms & connecting lines
      AGENTS.forEach((agent, idx) => {
        const ax = cx + Math.cos(agent.angle) * radius;
        const ay = cy + Math.sin(agent.angle) * radius;

        // Radial beam
        const isAlert = !appliedPlan && (agent.id === 'analyst' || agent.id === 'executor');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = isAlert
          ? 'rgba(255, 42, 95, 0.45)'
          : appliedPlan
          ? 'rgba(0, 240, 118, 0.35)'
          : 'rgba(0, 210, 255, 0.3)';
        ctx.lineWidth = isAlert ? 1.8 : 1.2;
        ctx.stroke();

        // Cross-conduits between adjacent satellite agents
        const nextAgent = AGENTS[(idx + 1) % AGENTS.length];
        const nx = cx + Math.cos(nextAgent.angle) * radius;
        const ny = cy + Math.sin(nextAgent.angle) * radius;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Photonic data packets travelling back and forth
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const agent = AGENTS[p.agentIndex];
        const ax = cx + Math.cos(agent.angle) * radius;
        const ay = cy + Math.sin(agent.angle) * radius;

        const px = cx + (ax - cx) * p.progress;
        const py = cy + (ay - cy) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, isMini ? 1.5 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = appliedPlan
          ? '#00f076'
          : !appliedPlan && agent.id === 'analyst'
          ? '#ff2a5f'
          : '#00d2ff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Central Supervisory Coordinator Core
      const coreRadius = isMini ? 14 : 20;
      const corePulse = Math.sin(time * 3) * (isMini ? 1.5 : 2.5);

      // Outer glow halo
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 2);
      grad.addColorStop(0, appliedPlan ? 'rgba(0, 240, 118, 0.8)' : 'rgba(0, 210, 255, 0.8)');
      grad.addColorStop(0.5, appliedPlan ? 'rgba(0, 240, 118, 0.2)' : 'rgba(0, 210, 255, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Central core orb
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius + corePulse, 0, Math.PI * 2);
      ctx.fillStyle = appliedPlan ? '#00f076' : '#00d2ff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner iris
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#050813';
      ctx.fill();

      // 6. Draw 6 Satellite Agent Nodes with labels
      AGENTS.forEach((agent) => {
        const ax = cx + Math.cos(agent.angle) * radius;
        const ay = cy + Math.sin(agent.angle) * radius;
        const nodeR = isMini ? 7 : 10;
        const isHovered = hoveredAgent?.id === agent.id;
        const isAlert = !appliedPlan && (agent.id === 'analyst' || agent.id === 'executor');

        // Node circle
        ctx.beginPath();
        ctx.arc(ax, ay, nodeR + (isHovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fillStyle = appliedPlan ? '#00f076' : isAlert ? '#ff2a5f' : agent.color;
        ctx.shadowBlur = isHovered ? 15 : 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node center pip
        ctx.beginPath();
        ctx.arc(ax, ay, nodeR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Node label
        if (!isMini) {
          ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Position label outside the node circle with clear clearance
          const textDist = radius + 22;
          const lx = cx + Math.cos(agent.angle) * textDist;
          const isTop = Math.sin(agent.angle) < -0.2;
          const isBottom = Math.sin(agent.angle) > 0.2;
          const ly = cy + Math.sin(agent.angle) * textDist + (isTop ? -6 : isBottom ? 6 : 0);

          ctx.fillText(agent.name, lx, ly - 5);

          ctx.font = '500 10px Inter, -apple-system, sans-serif';
          ctx.fillStyle = appliedPlan ? '#00f076' : isAlert ? '#ff5a7f' : '#38bdf8';
          ctx.fillText(agent.role, lx, ly + 8);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height, hoveredAgent]);

  // Handle canvas mouse move to detect hovered agent node
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * (isMini ? 0.36 : 0.38);

    const hit = AGENTS.find((agent) => {
      const ax = cx + Math.cos(agent.angle) * radius;
      const ay = cy + Math.sin(agent.angle) * radius;
      const d = Math.hypot(x - ax, y - ay);
      return d <= 22;
    });

    setHoveredAgent(hit || null);
  };

  return (
    <div className="relative h-full w-full overflow-hidden select-none font-sans">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredAgent(null)}
        className="block h-full w-full cursor-crosshair"
      />



      {/* Hover Information Tooltip */}
      {hoveredAgent && (
        <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg border border-cyan-500/40 bg-slate-950/95 p-2.5 text-xs backdrop-blur shadow-2xl z-30 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>{hoveredAgent.name} Agent</span>
              <span className="text-xs text-cyan-300 font-medium">[{hoveredAgent.role}]</span>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                appliedPlan
                  ? 'bg-twin-green/20 text-twin-green border border-twin-green/40'
                  : hoveredAgent.id === 'analyst'
                  ? 'bg-twin-red/20 text-twin-red border border-twin-red/40'
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {appliedPlan ? 'SYNCHRONIZED' : hoveredAgent.status}
            </span>
          </div>
          <div className="text-xs text-slate-200 leading-normal">
            {hoveredAgent.task}
          </div>
        </div>
      )}
    </div>
  );
};
