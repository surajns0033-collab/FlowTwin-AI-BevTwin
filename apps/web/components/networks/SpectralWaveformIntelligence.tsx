'use client';

import React, { useEffect, useRef } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface LayerDef {
  name: string;
  color: string;
  freq: number;
  phase: number;
  amp: number;
}

const LAYERS: LayerDef[] = [
  { name: 'Perception', color: '#00d2ff', freq: 1.8, phase: 0.0, amp: 22 },
  { name: 'Reasoning', color: '#a855f7', freq: 2.4, phase: 1.2, amp: 26 },
  { name: 'Simulation', color: '#ec4899', freq: 3.1, phase: 2.5, amp: 24 },
  { name: 'Optimization', color: '#f59e0b', freq: 2.0, phase: 3.8, amp: 20 },
  { name: 'Execution', color: '#00f076', freq: 1.5, phase: 5.0, amp: 18 },
];

interface WaveformProps {
  height?: number;
  isMini?: boolean;
}

export const SpectralWaveformIntelligence: React.FC<WaveformProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Multi-tier point particles representing the spectral wave
    const numColumns = isMini ? 40 : 65;
    const particlesPerColumn = isMini ? 8 : 12;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const h = (canvas.height = canvas.parentElement?.clientHeight || height);

      ctx.clearRect(0, 0, w, h);
      time += 0.028;

      const midY = h * 0.52;
      const stepX = w / (numColumns - 1);

      // 1. Draw continuous harmonic waveform ribbons for each processing layer
      LAYERS.forEach((layer, lIdx) => {
        const isFaultSensitive = !appliedPlan && (layer.name === 'Reasoning' || layer.name === 'Simulation');
        const layerColor = appliedPlan ? '#00f076' : isFaultSensitive ? '#ff2a5f' : layer.color;

        ctx.beginPath();
        for (let col = 0; col < numColumns; col++) {
          const x = col * stepX;
          const normX = col / (numColumns - 1);

          // Combined sine harmonic wave
          const baseWave = Math.sin(normX * Math.PI * layer.freq + time * 1.5 + layer.phase);
          const subWave = Math.cos(normX * Math.PI * 4 + time * 2) * 0.4;
          const envelope = Math.sin(normX * Math.PI); // Taper at edges

          // Agitation spike if bottleneck active
          const agitation = isFaultSensitive ? Math.sin(time * 12 + col * 0.8) * (isMini ? 8 : 14) : 0;

          const y = midY + (baseWave + subWave) * (layer.amp * envelope * (isMini ? 0.6 : 1.0)) + agitation;

          if (col === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = layerColor + (isMini ? '44' : '66');
        ctx.lineWidth = isFaultSensitive ? 1.8 : 1.2;
        ctx.stroke();
      });

      // 2. Draw particle point cloud matrix along the waveforms
      for (let col = 0; col < numColumns; col++) {
        const x = col * stepX;
        const normX = col / (numColumns - 1);
        const envelope = Math.sin(normX * Math.PI);

        for (let p = 0; p < particlesPerColumn; p++) {
          const pRatio = p / (particlesPerColumn - 1); // 0 (top layer) to 1 (bottom layer)
          const lIdx = Math.floor(pRatio * (LAYERS.length - 1));
          const layer = LAYERS[lIdx];

          const isFaultSensitive = !appliedPlan && (layer.name === 'Reasoning' || layer.name === 'Simulation');
          const layerColor = appliedPlan ? '#00f076' : isFaultSensitive ? '#ff2a5f' : layer.color;

          // Vertical offset between layers with jitter
          const baseWave = Math.sin(normX * Math.PI * layer.freq + time * 1.5 + layer.phase);
          const agitation = isFaultSensitive ? Math.sin(time * 10 + col * 0.8) * 10 : 0;
          const verticalSpread = (pRatio - 0.5) * (isMini ? 24 : 45);

          const y = midY + baseWave * (layer.amp * envelope * (isMini ? 0.6 : 1.0)) + verticalSpread + agitation;

          // Particle drawing
          const pSize = isMini ? 1.2 : 1.6 + Math.sin(normX * 10 + time * 3) * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, pSize, 0, Math.PI * 2);
          ctx.fillStyle = layerColor;
          ctx.globalAlpha = 0.65 + envelope * 0.35;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height]);

  return (
    <div className="relative h-full w-full overflow-hidden select-none font-sans">
      <canvas ref={canvasRef} className="block h-full w-full cursor-crosshair" />

      {/* Card Header and Stratified Legend (only in full view) */}
      {!isMini && (
        <>


          <div className="pointer-events-none absolute top-2.5 right-3 hidden sm:flex flex-col items-end space-y-1 text-xs text-slate-300 font-sans">
            {LAYERS.map((l) => (
              <span key={l.name} className="flex items-center space-x-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: appliedPlan ? '#00f076' : l.color }}
                />
                <span className="text-slate-200 font-medium">{l.name}</span>
              </span>
            ))}
          </div>
        </>
      )}

      {/* Bottom Progress Indicator matching Card 9 */}
      <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 border-t border-slate-800/80 pt-1 font-sans">
        <span className="text-slate-300 font-medium">Time →</span>
        <div className="flex items-center space-x-2">
          <div className="h-1.5 w-24 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,210,255,0.8)]" />
          </div>
          <span className="text-slate-300 font-medium">Processing...</span>
        </div>
      </div>
    </div>
  );
};
