'use client';

import React from 'react';

interface DottedMatrixGaugeProps {
  value: number; // 0 to 100 or actual count
  max?: number; // default 100
  totalDots?: number; // total dots to render, e.g. 24 or 30
  rows?: number; // e.g. 1 or 2
  color?: 'cyan' | 'green' | 'amber' | 'red' | 'purple';
  label?: string;
  valueDisplay?: string;
  statusText?: string;
  warningThreshold?: number; // above or below which it turns red/amber
  isCritical?: boolean;
}

export const DottedMatrixGauge: React.FC<DottedMatrixGaugeProps> = ({
  value,
  max = 100,
  totalDots = 24,
  rows = 1,
  color = 'cyan',
  label,
  valueDisplay,
  statusText,
  isCritical = false,
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const activeCount = Math.round((percentage / 100) * totalDots);

  // Color mappings for glowing active dots
  const activeColors = {
    cyan: 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_rgba(0,210,255,0.75)]',
    green: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(0,240,118,0.75)]',
    amber: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(255,183,3,0.75)]',
    red: 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(255,42,95,0.85)] animate-pulse',
    purple: 'bg-purple-400 border-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.75)]',
  };

  const selectedColor = isCritical ? activeColors.red : activeColors[color] || activeColors.cyan;

  // Render dots in grid rows
  const dotsPerRow = Math.ceil(totalDots / rows);

  return (
    <div className="space-y-1.5 font-sans">
      {(label || valueDisplay) && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-200 tracking-wide font-medium">{label}</span>
            {statusText && (
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                isCritical
                  ? 'border-rose-500/40 text-rose-300 bg-rose-950/40'
                  : 'border-slate-700 text-slate-300 bg-slate-900/80'
              }`}>
                {statusText}
              </span>
            )}
          </div>
          <span className="font-mono font-bold text-slate-100">{valueDisplay || `${Math.round(percentage)}%`}</span>
        </div>
      )}

      {/* Dotted Matrix Grid Array */}
      <div className="flex flex-col gap-1 rounded-lg border border-slate-800/80 bg-slate-950/80 p-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between gap-1">
            {Array.from({ length: dotsPerRow }).map((_, dIdx) => {
              const globalIndex = rIdx * dotsPerRow + dIdx;
              if (globalIndex >= totalDots) return null;
              const isActive = globalIndex < activeCount;

              return (
                <div
                  key={dIdx}
                  className={`h-2.5 flex-1 rounded-sm border transition-all duration-300 ${
                    isActive
                      ? selectedColor
                      : 'border-slate-800 bg-slate-900/40 opacity-30'
                  }`}
                  title={`${percentage.toFixed(1)}%`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
