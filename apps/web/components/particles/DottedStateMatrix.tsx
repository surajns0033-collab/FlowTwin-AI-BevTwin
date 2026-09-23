'use client';

import React from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface DottedStateMatrixProps {
  cols?: number;
  rows?: number;
  interactive?: boolean;
}

export const DottedStateMatrix: React.FC<DottedStateMatrixProps> = ({
  cols = 24,
  rows = 6,
  interactive = true,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const activeCausalChain = useTwinStore((s) => s.activeCausalChain);
  const focusedTarget = useTwinStore((s) => s.focusedTarget);

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-cyan-500/20 bg-slate-950/90 p-3.5 shadow-xl">
      <div className="flex items-center justify-between text-xs font-sans border-b border-slate-800/80 pb-2">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">
            Quantized State Matrix (FlowTwin Field)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Constrained
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Foaming Bottleneck
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-1.5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center justify-between gap-1">
            {Array.from({ length: cols }).map((_, c) => {
              // Row 0-1: Line 1 (Nominal)
              // Row 2-3: Line 2 (Nominal)
              // Row 4-5: Line 3 (M07 affected row unless appliedPlan)
              let dotColor = 'bg-cyan-500/80 border-cyan-400/50 shadow-[0_0_4px_rgba(0,210,255,0.4)]';

              if (r >= 4) {
                if (appliedPlan) {
                  dotColor = 'bg-emerald-400 border-emerald-300 shadow-[0_0_5px_rgba(0,240,118,0.5)]';
                } else if (c >= 6 && c <= 14) {
                  dotColor = 'bg-rose-500 border-rose-400 shadow-[0_0_7px_rgba(255,42,95,0.8)] animate-pulse';
                } else {
                  dotColor = 'bg-amber-400/90 border-amber-300 shadow-[0_0_5px_rgba(255,183,3,0.5)]';
                }
              } else if (r >= 2 && appliedPlan) {
                // Line 2 absorbed 20% load
                dotColor = 'bg-emerald-400/90 border-emerald-300';
              }

              // Random subtle entropy flicker for living UI feel
              const isIdle = (r + c) % 7 === 0;

              return (
                <div
                  key={c}
                  className={`h-2.5 flex-1 rounded-sm border transition-all duration-500 ${
                    isIdle
                      ? 'border-slate-800 bg-slate-900/30 opacity-40'
                      : dotColor
                  }`}
                  title={`Cell [L${Math.floor(r/2)+1}:${c}] • State: ${appliedPlan ? 'OPTIMIZED' : 'ACTIVE'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
