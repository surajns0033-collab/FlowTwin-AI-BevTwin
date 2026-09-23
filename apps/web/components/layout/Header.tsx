'use client';

import React from 'react';
import Link from 'next/link';
import { useTwinStore } from '@/lib/store/twinStore';
import { Activity, Cpu, RotateCcw, Sparkles, Network } from 'lucide-react';

export const Header: React.FC = () => {
  const telemetry = useTwinStore((s) => s.telemetry);
  const resetToNominal = useTwinStore((s) => s.resetToNominal);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const primaryView = useTwinStore((s) => s.primaryView);
  const setPrimaryView = useTwinStore((s) => s.setPrimaryView);

  return (
    <header className="flex items-center justify-between border-b border-twin-panelBorder bg-twin-panel/95 px-6 py-2.5 shadow-lg backdrop-blur-xl">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-twin-accent/40 bg-cyan-950/70 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
          <Sparkles className="h-5 w-5 text-twin-accent" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-sans text-base font-bold tracking-tight text-white">
              FlowTwin AI
            </h1>
            <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
              v2.0
            </span>
          </div>
          <p className="font-sans text-xs text-slate-300 font-normal">
            AI-Native Industrial Operations Twin • Gemini 3.8 Flash
          </p>
        </div>
      </div>

      {/* Real-Time Telemetry Bar */}
      <div className="hidden lg:flex items-center space-x-5 rounded-lg border border-twin-panelBorder/80 bg-slate-950/85 px-4 py-1.5 shadow-inner whitespace-nowrap shrink-0">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-400">Output:</span>
          <span className="font-mono text-xs font-bold text-cyan-300 tracking-wide whitespace-nowrap">
            {telemetry.total_factory_output_units.toLocaleString()} / 10,000 u
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-700/80 shrink-0" />

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-400">Power:</span>
          <span className="font-mono text-xs font-bold text-amber-400 tracking-wide whitespace-nowrap">
            {telemetry.current_power_consumption_kw} kW
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-700/80 shrink-0" />

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-400">OEE:</span>
          <span className="font-mono text-xs font-bold text-twin-green tracking-wide whitespace-nowrap">
            {Math.round(telemetry.overall_equipment_effectiveness * 100)}%
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-700/80 shrink-0" />

        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span
            className={`h-2.5 w-2.5 rounded-full shrink-0 ${
              appliedPlan ? 'bg-twin-green shadow-[0_0_8px_#00f076]' : 'bg-twin-red animate-ping'
            }`}
          />
          <span className="font-sans text-xs font-semibold tracking-wide text-slate-200 whitespace-nowrap">
            {appliedPlan ? 'OPTIMIZED RUN' : 'ACTIVE CONSTRAINT'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => {
            setPrimaryView(primaryView === 'network_studio' ? '3d_twin' : 'network_studio');
          }}
          className={`flex items-center space-x-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-sans font-semibold transition-all ${
            primaryView === 'network_studio'
              ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,210,255,0.5)]'
              : 'border-cyan-500/50 bg-cyan-950/70 text-cyan-300 hover:bg-cyan-900/80 shadow-[0_0_10px_rgba(0,210,255,0.2)]'
          }`}
          title="Open 6 Dynamic Operational Intelligence Networks"
        >
          <Network className="h-4 w-4 text-cyan-400" />
          <span>Intelligence Networks (6)</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        </button>

        <button
          onClick={() => useTwinStore.getState().setIsGoogleToolsHubOpen(true)}
          className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-3 py-1.5 text-xs font-sans font-medium text-cyan-200 hover:bg-cyan-900/70 hover:text-white shadow-[0_0_10px_rgba(0,210,255,0.15)] transition-all"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Google Architecture Hub</span>
        </button>

        {appliedPlan ? (
          <button
            onClick={resetToNominal}
            className="flex items-center space-x-1.5 rounded-lg border border-twin-accent/40 bg-twin-panel px-3 py-1.5 text-xs font-sans font-medium text-cyan-300 hover:bg-cyan-950 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Factory State</span>
          </button>
        ) : (
          <button
            onClick={() => useTwinStore.getState().setActiveNavTab('Machines')}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-sans font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Cpu className="h-4 w-4 text-twin-accent" />
            <span>Inspect 8 Machines</span>
          </button>
        )}
      </div>
    </header>
  );
};
