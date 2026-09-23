'use client';

import React, { useEffect, useRef } from 'react';

interface ScenarioWaveProps {
  type: 'surge' | 'failure' | 'energy' | 'quality' | 'delay';
  active?: boolean;
}

export const ScenarioWave: React.FC<ScenarioWaveProps> = ({ type, active = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let step = 0;
    const w = (canvas.width = canvas.parentElement?.clientWidth || 240);
    const h = (canvas.height = 36);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (type === 'failure') {
          // jagged electrical spark waveform
          y += Math.sin((x + step) * 0.15) * 8 + (Math.random() - 0.5) * 6;
          ctx.strokeStyle = '#ff2a5f';
        } else if (type === 'energy') {
          // smooth emerald sine wave
          y += Math.sin((x + step * 0.5) * 0.05) * 10;
          ctx.strokeStyle = '#00f076';
        } else if (type === 'surge') {
          // rising exponential pulse
          y += Math.sin((x + step) * 0.08) * 11;
          ctx.strokeStyle = '#00d2ff';
        } else {
          // amber wobble
          y += Math.cos((x + step * 0.7) * 0.06) * 9;
          ctx.strokeStyle = '#ffb703';
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += active ? 3.5 : 1.2;
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [type, active]);

  return <canvas ref={canvasRef} className="h-9 w-full opacity-85" />;
};
