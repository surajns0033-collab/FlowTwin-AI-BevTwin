'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight, Check, AlertCircle } from 'lucide-react';

interface DifferentialVectorGaugeProps {
  label: string;
  nominalValue: string;
  degradedValue: string;
  optimizedValue: string;
  deltaPct: string;
  direction: 'up' | 'down';
  severity: 'critical' | 'warning' | 'nominal';
  unit?: string;
}

export const DifferentialVectorGauge: React.FC<DifferentialVectorGaugeProps> = ({
  label,
  nominalValue,
  degradedValue,
  optimizedValue,
  deltaPct,
  direction,
  severity,
}) => {
  const isCritical = severity === 'critical';
  const isWarning = severity === 'warning';

  const accentColor = isCritical
    ? '#ff2a5f'
    : isWarning
    ? '#ffb703'
    : '#00f076';

  const strokeDashoffset = isCritical ? 60 : isWarning ? 110 : 30;

  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-twin-panelBorder bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-xl backdrop-blur">
      {/* Top Header */}
      <div className="flex items-center justify-between font-sans text-xs">
        <span className="text-slate-300 font-bold tracking-wider uppercase text-[11px]">{label}</span>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
            isCritical
              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
              : isWarning
              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {direction === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          {deltaPct}
        </span>
      </div>

      {/* Center Circular Radial Deviation Dial */}
      <div className="my-2.5 flex items-center justify-between">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1e293b"
              strokeWidth="6"
              fill="none"
            />
            {/* Deviation Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={accentColor}
              strokeWidth="7"
              fill="none"
              strokeDasharray={251.2}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 filter drop-shadow-[0_0_6px_rgba(0,210,255,0.4)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            {isCritical ? (
              <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : isWarning ? (
              <span className="text-xs font-mono font-bold text-amber-400">Δ</span>
            ) : (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
          </div>
        </div>

        {/* Numerical Differential Transition */}
        <div className="flex-1 pl-3 space-y-1 font-sans text-xs min-w-0">
          <div className="text-slate-300 flex items-center justify-between whitespace-nowrap">
            <span className="text-[11px]">Nominal:</span>
            <span className="font-mono text-slate-200 font-medium whitespace-nowrap ml-1">{nominalValue}</span>
          </div>
          <div className="text-xs font-bold flex items-center justify-between whitespace-nowrap" style={{ color: accentColor }}>
            <span className="text-[11px]">Degraded:</span>
            <span className="font-mono whitespace-nowrap ml-1">{degradedValue}</span>
          </div>
          <div className="text-[11px] text-twin-green pt-1 border-t border-slate-800/80 flex items-center justify-between whitespace-nowrap">
            <span>AI Target:</span>
            <span className="font-mono font-semibold whitespace-nowrap ml-1">{optimizedValue}</span>
          </div>
        </div>
      </div>

      {/* Cybernetic Status Micro-Beacon */}
      <div className="flex items-center justify-between text-xs font-sans border-t border-slate-800/60 pt-2 text-slate-300">
        <span>Impact Severity:</span>
        <span className="uppercase font-bold" style={{ color: accentColor }}>{severity}</span>
      </div>
    </div>
  );
};
