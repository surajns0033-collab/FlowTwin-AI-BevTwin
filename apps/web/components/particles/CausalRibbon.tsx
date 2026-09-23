'use client';

import React from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

export const CausalRibbon: React.FC = () => {
  const activeCausalChain = useTwinStore((s) => s.activeCausalChain);
  const impactSeverity = useTwinStore((s) => s.impactSeverity);

  if (!activeCausalChain || activeCausalChain.length === 0) return null;

  return (
    <div className="relative flex items-center rounded-lg border border-twin-panelBorder bg-slate-950/90 px-3 py-1 shadow-lg backdrop-blur-md">
      <div className="flex items-center space-x-1.5 mr-2">
        <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
          Causal Flow:
        </span>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto py-1">
        {activeCausalChain.map((node, index) => {
          const isSource = index === 0;
          const isLast = index === activeCausalChain.length - 1;

          return (
            <React.Fragment key={node}>
              <div
                className={`relative flex items-center space-x-1.5 rounded-lg px-3 py-1 text-xs font-mono font-bold transition-all duration-300 ${
                  isSource
                    ? 'border border-twin-red/90 bg-twin-red/25 text-white shadow-[0_0_15px_rgba(255,42,95,0.4)]'
                    : isLast
                    ? 'border border-amber-500/80 bg-amber-500/25 text-amber-200'
                    : 'border border-cyan-500/50 bg-cyan-950/60 text-cyan-200'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSource
                      ? 'bg-twin-red animate-ping'
                      : isLast
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                />
                <span>{node}</span>
              </div>

              {!isLast && (
                <div className="relative flex items-center text-xs text-cyan-400 font-bold px-0.5">
                  <span>→</span>
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] text-cyan-300/80 font-sans font-medium uppercase tracking-widest">
                    flow
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
