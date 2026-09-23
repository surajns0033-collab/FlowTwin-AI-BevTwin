'use client';

import React, { useEffect, useState } from 'react';

interface ConcentricObjectiveRingsProps {
  applied: boolean;
}

export const ConcentricObjectiveRings: React.FC<ConcentricObjectiveRingsProps> = ({ applied }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 0.8) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Targets & Metrics
  // Ring 1 (Radius 160): Output (100% maintained)
  // Ring 2 (Radius 125): Energy (100% nominal -> 86.4% optimized)
  // Ring 3 (Radius 90): Carbon Footprint (100% -> 86.4%)
  // Ring 4 (Radius 55): Material Scrap (75% standard -> 38% cut)

  const outputCircumference = 2 * Math.PI * 160;
  const energyCircumference = 2 * Math.PI * 125;
  const carbonCircumference = 2 * Math.PI * 90;
  const scrapCircumference = 2 * Math.PI * 55;

  const energyProgress = applied ? 0.864 : 1.0;
  const carbonProgress = applied ? 0.864 : 1.0;
  const scrapProgress = applied ? 0.38 : 0.75;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
      {/* 1. Multi-Ring Orbital Concentric Gyroscope */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 380 380">
          <defs>
            <linearGradient id="cyanRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="energyRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={applied ? '#00f076' : '#ffb703'} />
              <stop offset="100%" stopColor={applied ? '#10b981' : '#f59e0b'} />
            </linearGradient>
            <linearGradient id="carbonRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="scrapRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={applied ? '#38bdf8' : '#ff2a5f'} />
              <stop offset="100%" stopColor={applied ? '#0284c7' : '#e11d48'} />
            </linearGradient>
          </defs>

          {/* Background Track Rings */}
          <circle cx="190" cy="190" r="160" stroke="#1e293b" strokeWidth="6" fill="none" opacity="0.4" />
          <circle cx="190" cy="190" r="125" stroke="#1e293b" strokeWidth="6" fill="none" opacity="0.4" />
          <circle cx="190" cy="190" r="90" stroke="#1e293b" strokeWidth="6" fill="none" opacity="0.4" />
          <circle cx="190" cy="190" r="55" stroke="#1e293b" strokeWidth="6" fill="none" opacity="0.4" />

          {/* Glowing Active Orbital Arcs */}
          {/* Ring 1: Output */}
          <circle
            cx="190"
            cy="190"
            r="160"
            stroke="url(#cyanRing)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={outputCircumference}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]"
          />

          {/* Ring 2: Energy */}
          <circle
            cx="190"
            cy="190"
            r="125"
            stroke="url(#energyRing)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={energyCircumference}
            strokeDashoffset={energyCircumference * (1 - energyProgress)}
            strokeLinecap="round"
            className="transition-all duration-1000 filter drop-shadow-[0_0_8px_rgba(0,240,118,0.7)]"
          />

          {/* Ring 3: Carbon */}
          <circle
            cx="190"
            cy="190"
            r="90"
            stroke="url(#carbonRing)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={carbonCircumference}
            strokeDashoffset={carbonCircumference * (1 - carbonProgress)}
            strokeLinecap="round"
            className="transition-all duration-1000 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
          />

          {/* Ring 4: Scrap */}
          <circle
            cx="190"
            cy="190"
            r="55"
            stroke="url(#scrapRing)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={scrapCircumference}
            strokeDashoffset={scrapCircumference * (1 - scrapProgress)}
            strokeLinecap="round"
            className="transition-all duration-1000 filter drop-shadow-[0_0_8px_rgba(255,42,95,0.7)]"
          />
        </svg>

        {/* Center Orbital Core */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <div className="h-10 w-10 rounded-full border border-cyan-400 bg-cyan-950/80 flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.6)]">
            <span className="text-xs font-mono font-bold text-cyan-300">
              {applied ? '99.2%' : '82.0%'}
            </span>
          </div>
          <span className="text-[10px] font-sans font-semibold uppercase text-slate-300 mt-1">
            {applied ? 'Equilibrium' : 'Off-Balance'}
          </span>
        </div>
      </div>

      {/* 2. Concentric Ring Telemetry Badges */}
      <div className="flex-1 space-y-3 font-sans">
        <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-white tracking-wider">Orbital Objective Telemetry</span>
          <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${
            applied ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' : 'border-amber-500/40 text-amber-300 bg-amber-950/40'
          }`}>
            {applied ? 'Harmonic Lock' : 'Peak Dissipation Required'}
          </span>
        </div>

        {/* Ring 1 Label */}
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_6px_#00d2ff]" />
            <span className="text-xs font-semibold text-cyan-300">Outer Ring: Throughput</span>
          </div>
          <span className="text-xs font-bold text-white font-mono">10,000 u (100% Preserved)</span>
        </div>

        {/* Ring 2 Label */}
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className={`h-3 w-3 rounded-full ${applied ? 'bg-emerald-400 shadow-[0_0_6px_#00f076]' : 'bg-amber-400 shadow-[0_0_6px_#ffb703]'}`} />
            <span className="text-xs font-semibold text-slate-200">Middle Ring: Energy Draw</span>
          </div>
          <span className={`text-xs font-bold font-mono ${applied ? 'text-emerald-400' : 'text-amber-400'}`}>
            {applied ? '15,900 kWh (-13.6% Off-Peak)' : '18,400 kWh (Peak Window)'}
          </span>
        </div>

        {/* Ring 3 Label */}
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span className="text-xs font-semibold text-emerald-300">Inner Ring: Carbon Offset</span>
          </div>
          <span className="text-xs font-bold text-white font-mono">
            {applied ? '6,360 kg (-1,000 kg Saved)' : '7,360 kg (Baseline)'}
          </span>
        </div>

        {/* Ring 4 Label */}
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className={`h-3 w-3 rounded-full ${applied ? 'bg-cyan-400 shadow-[0_0_6px_#00d2ff]' : 'bg-rose-500 shadow-[0_0_6px_#ff2a5f]'}`} />
            <span className="text-xs font-semibold text-slate-200">Core Ring: Material Scrap</span>
          </div>
          <span className={`text-xs font-bold font-mono ${applied ? 'text-cyan-300' : 'text-rose-400'}`}>
            {applied ? '1.8% (-42% Defect Waste)' : '3.2% Standard'}
          </span>
        </div>
      </div>
    </div>
  );
};
