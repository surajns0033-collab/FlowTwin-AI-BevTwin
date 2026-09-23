'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  detail: string;
  prompt: string;
  result: string;
}

const STAGES: Stage[] = [
  {
    id: 'input',
    title: 'Input',
    subtitle: 'Understand',
    color: '#00d2ff',
    detail: 'High-frequency telemetry ingestion (4.2 kHz) across Lines 1-3 + Operator inquiry.',
    prompt: 'Query: "Line 3 throughput dropped to 68%. Detect root-cause anomaly."',
    result: 'Telemetry verified: Inflow 1,150 cans/min, fill temp 14.8°C, reject rate 6.4%.',
  },
  {
    id: 'analyze',
    title: 'Analyze',
    subtitle: 'Detect',
    color: '#a855f7',
    detail: 'Causal anomaly isolation: Valve #7 seal leak causes CO2 depressurization & foaming.',
    prompt: 'Causal Graph: Trace temperature anomaly to downstream fill volume variance.',
    result: 'Anomaly isolated: M07 Rotary Filler Valve #7 counter-pressure micro-leak.',
  },
  {
    id: 'simulate',
    title: 'Simulate',
    subtitle: 'Explore',
    color: '#ec4899',
    detail: 'Monte Carlo digital twin evaluation: 3 alternative routing & pacing scenarios tested.',
    prompt: 'Monte Carlo 10,000 runs: Scenario A (Throttle M07) vs Scenario B (Reroute 20% to L2).',
    result: 'Scenario B wins: Rerouting 20% to L2 recovers 9,600 cases/hr with 0.0h delay.',
  },
  {
    id: 'decide',
    title: 'Decide',
    subtitle: 'Optimize',
    color: '#f59e0b',
    detail: 'Pareto-optimal consensus: 96.8% confidence ranking across multi-agent swarm.',
    prompt: 'Orchestrator consensus: Hydraulic Agent + Routing Agent + QA Agent voting.',
    result: 'Action Plan generated: Modulate diverter valve DV-03 by +20% & adjust vacuum.',
  },
  {
    id: 'output',
    title: 'Output',
    subtitle: 'Act',
    color: '#00f076',
    detail: 'Prescriptive PLC dispatch: Diverter valve modulated & line synchronized.',
    prompt: 'PLC Dispatch command: SET_VALVE(DV-03, +20%); SYNC_TIMING(M08_SEAMER).',
    result: 'Executed successfully: Packaging queue restored, Walmart batch on schedule.',
  },
];

interface FlowProps {
  height?: number;
  isMini?: boolean;
}

export const CognitiveFlowGraph: React.FC<FlowProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedStage, setSelectedStage] = useState<Stage>(STAGES[1]); // Default to 'Analyze'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Moving particles along the ribbon curve
    const particles: Array<{ t: number; speed: number; offset: number; size: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        offset: (Math.random() - 0.5) * (isMini ? 10 : 18),
        size: 1.2 + Math.random() * 1.5,
      });
    }

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 440);
      const h = (canvas.height = canvas.parentElement?.clientHeight || height);

      ctx.clearRect(0, 0, w, h);
      time += 0.025;

      const numStages = STAGES.length;
      const startX = w * 0.1;
      const endX = w * 0.9;
      const stepX = (endX - startX) / (numStages - 1);
      const midY = h * 0.48;
      const waveAmp = isMini ? 18 : 28;

      // Mathematical function for the S-curve ribbon
      const getCurvePoint = (tVal: number) => {
        const x = startX + (endX - startX) * tVal;
        // Sinusoidal wave through milestone nodes
        const y = midY + Math.sin(tVal * Math.PI * 2 + 0.3) * waveAmp;
        return { x, y };
      };

      // 1. Draw multi-pass undulating ribbon background
      for (let pass = -3; pass <= 3; pass++) {
        ctx.beginPath();
        const passOffset = pass * (isMini ? 2 : 3.5);
        for (let i = 0; i <= 60; i++) {
          const t = i / 60;
          const pt = getCurvePoint(t);
          const y = pt.y + passOffset + Math.sin(time * 3 + t * 6 + pass) * 2;
          if (i === 0) ctx.moveTo(pt.x, y);
          else ctx.lineTo(pt.x, y);
        }

        const grad = ctx.createLinearGradient(startX, midY, endX, midY);
        grad.addColorStop(0, 'rgba(0, 210, 255, 0.15)');
        grad.addColorStop(0.3, 'rgba(168, 85, 247, 0.2)');
        grad.addColorStop(0.6, 'rgba(236, 72, 153, 0.2)');
        grad.addColorStop(0.8, 'rgba(245, 158, 11, 0.2)');
        grad.addColorStop(1, 'rgba(0, 240, 118, 0.35)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Draw flowing particles along the curve
      particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const pt = getCurvePoint(p.t);
        const px = pt.x;
        const py = pt.y + p.offset + Math.sin(time * 4 + p.t * 8) * 3;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);

        // Gradient coloring based on position along curve
        if (p.t < 0.25) ctx.fillStyle = '#00d2ff';
        else if (p.t < 0.5) ctx.fillStyle = '#c084fc';
        else if (p.t < 0.75) ctx.fillStyle = '#f59e0b';
        else ctx.fillStyle = '#00f076';

        ctx.shadowBlur = 4;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw 5 Milestone Orbs
      STAGES.forEach((stage, idx) => {
        const tVal = idx / (numStages - 1);
        const pt = getCurvePoint(tVal);
        const isSelected = selectedStage.id === stage.id;
        const isCompleted = appliedPlan || idx <= 3;

        // Outer pulsating glow halo
        const haloRadius = (isMini ? 12 : 18) + (isSelected ? 3 : 0);
        const haloGrad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, haloRadius);
        haloGrad.addColorStop(0, stage.color + 'aa');
        haloGrad.addColorStop(0.6, stage.color + '22');
        haloGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Main node circle
        const nodeRadius = isMini ? 7 : 10;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = stage.color;
        ctx.shadowBlur = isSelected ? 14 : 6;
        ctx.shadowColor = stage.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Labels
        if (!isMini) {
          ctx.font = isSelected ? 'bold 12px Inter, -apple-system, sans-serif' : 'bold 11px Inter, -apple-system, sans-serif';
          ctx.fillStyle = isSelected ? '#ffffff' : '#f1f5f9';
          ctx.textAlign = 'center';

          // Text placement alternating slightly or directly below
          const textY = pt.y > midY ? pt.y + 24 : pt.y - 22;
          ctx.fillText(stage.title, pt.x, textY);

          ctx.font = '600 10px Inter, -apple-system, sans-serif';
          ctx.fillStyle = stage.color;
          ctx.fillText(stage.subtitle, pt.x, textY + 12);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height, selectedStage]);

  // Click on milestone orb
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;
    const numStages = STAGES.length;
    const startX = w * 0.1;
    const endX = w * 0.9;
    const midY = h * 0.48;
    const waveAmp = isMini ? 18 : 28;

    for (let i = 0; i < numStages; i++) {
      const tVal = i / (numStages - 1);
      const x = startX + (endX - startX) * tVal;
      const y = midY + Math.sin(tVal * Math.PI * 2 + 0.3) * waveAmp;

      if (Math.hypot(mx - x, my - y) < 24) {
        setSelectedStage(STAGES[i]);
        break;
      }
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden select-none font-sans">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block h-full w-full cursor-pointer"
      />

      {/* Interactive Step Details Drawer (only in full view) */}
      {!isMini && (
        <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg border border-cyan-500/40 bg-slate-950/95 p-2.5 text-xs backdrop-blur shadow-2xl z-30 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedStage.color }}
                />
                <span>Stage: {selectedStage.title}</span>
                <span className="text-xs font-medium" style={{ color: selectedStage.color }}>
                  [{selectedStage.subtitle}]
                </span>
              </span>
              <span className="text-[10px] text-slate-400">Click any milestone to inspect</span>
            </div>
            <div className="text-xs text-slate-200 leading-tight">
              <strong>Logic:</strong> {selectedStage.detail}
            </div>
            <div className="text-xs text-cyan-300 mt-1 font-bold truncate">
              <strong>Data:</strong> {selectedStage.result}
            </div>
          </div>
      )}
    </div>
  );
};
