'use client';

import React, { useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import { DotMatrixVisualizer } from './DotMatrixVisualizer';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Gauge,
  Zap,
  Undo2,
  Maximize2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LiveInsightsProps {
  isExpanded?: boolean;
  onExpand?: () => void;
}

export const LiveInsightsModule: React.FC<LiveInsightsProps> = ({
  isExpanded = false,
  onExpand,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const setPrimaryView = useTwinStore((s) => s.setPrimaryView);
  const applyPlan = useTwinStore((s) => s.applyPlan);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);

  // Shape state: 'cans' (Cans & foaming valve #7), 'valves' (24-head carousel), 'symbol' (⚠️ / ✓)
  const [shapeMode, setShapeMode] = useState<'cans' | 'valves' | 'symbol'>('cans');

  // =========================================================================
  // VIEW A: COMPACT VIEW (Bottom Row Tile in Overview)
  // =========================================================================
  if (!isExpanded) {
    return (
      <div
        onClick={onExpand}
        className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-twin-panelBorder bg-twin-panel/95 p-2 shadow-lg backdrop-blur transition-all duration-200 hover:border-cyan-400/80 cursor-pointer select-none"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                appliedPlan ? 'bg-twin-green animate-pulse' : 'bg-twin-red animate-ping'
              }`}
            />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              Live Insights
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Morph Shape Pills */}
            <div className="flex items-center space-x-1 mr-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShapeMode('cans')}
                className={`px-2 py-0.5 rounded font-sans text-[10px] font-semibold transition-colors ${
                  shapeMode === 'cans'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Cans & Foaming Valve #7"
              >
                Cans
              </button>
              <button
                onClick={() => setShapeMode('valves')}
                className={`px-2 py-0.5 rounded font-sans text-[10px] font-semibold transition-colors ${
                  shapeMode === 'valves'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Rotary Valve Ring"
              >
                Ring
              </button>
              <button
                onClick={() => setShapeMode('symbol')}
                className={`px-2 py-0.5 rounded font-sans text-[10px] font-semibold transition-colors ${
                  shapeMode === 'symbol'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Status Signal"
              >
                {appliedPlan ? 'Status' : 'Alert'}
              </button>
            </div>

            <span
              className="flex items-center space-x-1 rounded border border-cyan-500/40 bg-cyan-950/70 px-2 py-0.5 font-sans text-[10px] font-semibold text-cyan-200 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow"
              title="Expand Live Insights to Main View"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Expand</span>
            </span>
          </div>
        </div>

        {/* Primary Relatable Insight Message */}
        <div
          className={`my-1 rounded-lg border px-2.5 py-1.5 font-sans transition-colors ${
            appliedPlan
              ? 'border-twin-green/40 bg-twin-green/10 text-slate-100'
              : 'border-twin-red/50 bg-twin-red/15 text-slate-100'
          }`}
        >
          {appliedPlan ? (
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-1.5 text-twin-green font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Line 3 Stabilized: Volume Rerouted to Line 2</span>
              </div>
              <span className="text-slate-300 font-mono text-[11px]">0.0h delay</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-1.5 text-twin-red font-bold">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>M07 Rotary Filler: Severe Foaming at Valve #7</span>
              </div>
              <span className="text-twin-red font-bold font-mono text-[11px]">Delay: 5.5h</span>
            </div>
          )}
        </div>

        {/* 3 Relatable Beverage Process Metrics */}
        <div className="grid grid-cols-3 gap-1.5 font-sans my-0.5">
          {/* Fill Temp */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-1">
            <div className="flex items-center justify-between text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
              <span>TEMP</span>
              <Thermometer className="h-2.5 w-2.5 text-cyan-400" />
            </div>
            <div
              className={`font-bold font-mono text-sm leading-tight my-0.5 ${
                appliedPlan ? 'text-twin-green' : 'text-twin-red'
              }`}
            >
              {appliedPlan ? '4.1°C' : '14.8°C'}
            </div>
            <div className="text-[10px] font-sans text-slate-400 font-medium">Target: 4.0°C</div>
          </div>

          {/* Pressure */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-1">
            <div className="flex items-center justify-between text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
              <span>PRESSURE</span>
              <Gauge className="h-2.5 w-2.5 text-cyan-400" />
            </div>
            <div
              className={`font-bold font-mono text-sm leading-tight my-0.5 ${
                appliedPlan ? 'text-cyan-300' : 'text-amber-400'
              }`}
            >
              {appliedPlan ? '4.2 bar' : '3.8 bar'}
            </div>
            <div className="text-[10px] font-sans text-slate-400 font-medium">Target: 4.2 bar</div>
          </div>

          {/* Can Speed */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-1">
            <div className="flex items-center justify-between text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
              <span>SPEED</span>
              <Activity className="h-2.5 w-2.5 text-cyan-400" />
            </div>
            <div
              className={`font-bold font-mono text-sm leading-tight my-0.5 ${
                appliedPlan ? 'text-twin-green' : 'text-twin-red'
              }`}
            >
              {appliedPlan ? '1,180/m' : '820/m'}
            </div>
            <div className="text-[10px] font-sans text-slate-400 font-medium">Rated: 1.2k</div>
          </div>
        </div>

        {/* Dynamic Morphing Dot-Matrix Can & Foam Stream */}
        <div className="relative h-[56px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950 my-0.5">
          <DotMatrixVisualizer isExpanded={false} height={56} shapeMode={shapeMode} />
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-[10px] font-sans font-medium text-slate-300 border-t border-slate-800/80 pt-1">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-cyan-400" />
            <span>Dot-Matrix Telemetry</span>
          </span>
          <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5 font-semibold">
            <span>Expand to Studio ⤢</span>
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: EXPANDED VIEW (Main Large Center Area View)
  // =========================================================================
  return (
    <div className="flex h-full w-full flex-col bg-[#050813] p-3 text-slate-200 overflow-hidden select-none font-sans">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/30 pb-2 gap-2 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.35)]">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-sans text-xs font-bold text-white tracking-wider uppercase">
                OPERATIONAL INTELLIGENCE & TELEMETRY STUDIO
              </h2>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border ${
                  appliedPlan
                    ? 'border-twin-green/40 bg-twin-green/20 text-twin-green'
                    : 'border-twin-red/40 bg-twin-red/20 text-twin-red animate-pulse'
                }`}
              >
                {appliedPlan ? 'OPTIMIZATION ACTIVE' : 'ACTIVE BOTTLENECK DETECTED'}
              </span>
            </div>
            <p className="font-sans text-xs text-slate-300">
              High-frequency multi-sensor telemetry: isobaric counter-pressure, temperature, and line pacing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!appliedPlan && (
            <button
              onClick={() => applyPlan()}
              className="flex items-center space-x-1.5 rounded bg-twin-accent px-3 py-1.5 font-sans text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Apply Mitigation Plan</span>
            </button>
          )}

          <button
            onClick={() => setPrimaryView('3d_twin')}
            className="flex items-center space-x-1.5 rounded border border-cyan-500/60 bg-cyan-950/80 px-3 py-1.5 font-sans text-xs font-semibold text-cyan-200 hover:bg-cyan-900 hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.25)]"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Return 3D Twin to Main View</span>
          </button>
        </div>
      </div>

      {/* Relatable Executive Operational Story Banner */}
      <div
        className={`my-2 rounded-lg border px-3 py-2 font-sans transition-all shrink-0 ${
          appliedPlan
            ? 'border-twin-green/40 bg-twin-green/10 text-slate-100 shadow-[0_0_15px_rgba(0,240,118,0.1)]'
            : 'border-twin-red/50 bg-twin-red/10 text-slate-100 shadow-[0_0_15px_rgba(255,42,95,0.15)]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            {appliedPlan ? (
              <CheckCircle2 className="h-5 w-5 text-twin-green shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-twin-red animate-bounce shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">
                {appliedPlan
                  ? 'Active Mitigation: Line 3 Stabilized via Line 2 Absorption'
                  : 'Operational Bottleneck: M07 Rotary Filler Valve #7 Severe Foaming'}
              </h3>
              <p className="text-xs text-slate-300 leading-normal mt-0.5">
                {appliedPlan
                  ? '20% flow diverted to Line 2 (M05). Chilling equalized at 4.1°C, canning speed 1,180/min, Walmart #8921 on schedule.'
                  : 'Liquid arrived at 14.8°C (setpoint 4.0°C). Dissolved CO2 flashing into foam at Valve #7. Speed throttled to 820/min.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-sans">
            <span className="text-slate-300">
              Station:{' '}
              <span
                onClick={() => {
                  setFocusedTarget('M07');
                  setPrimaryView('3d_twin');
                }}
                className="text-cyan-300 underline cursor-pointer hover:text-white font-bold"
              >
                M07 Rotary Filler
              </span>
            </span>
            <span className="text-slate-300">
              Impact:{' '}
              <strong className={appliedPlan ? 'text-twin-green font-bold' : 'text-twin-red font-bold'}>
                {appliedPlan ? '0.0h delay' : '5.5h delay risk'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Centerpiece: Dot Matrix Studio (Left) + Telemetry & Event Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden min-h-0">
        {/* Left Column (7 cols): Prominent Dot Matrix Studio */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-2.5 font-sans overflow-hidden">
          <div className="flex items-center justify-between mb-1.5 border-b border-slate-800/80 pb-1.5">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                DOT-MATRIX TELEMETRY STUDIO
              </span>
            </div>

            {/* Shape Switcher Tabs in Panel Header */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setShapeMode('cans')}
                className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
                  shapeMode === 'cans'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Can silhouettes with foaming eruption at valve #7"
              >
                Cans & Foam
              </button>

              <button
                onClick={() => setShapeMode('valves')}
                className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
                  shapeMode === 'valves'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="24-head rotary carousel with head #7 seal leak"
              >
                Rotary Valve Ring
              </button>

              <button
                onClick={() => setShapeMode('symbol')}
                className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
                  shapeMode === 'symbol'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Hazard Alert ⚠️ vs Nominal Status ✓"
              >
                {appliedPlan ? 'Status ✓' : 'Alert ⚠️'}
              </button>
            </div>
          </div>

          {/* Explanation note why dot-matrix is used */}
          <div className="mb-1.5 rounded bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 text-xs text-cyan-200 flex items-center justify-between shrink-0 font-sans">
            <span>
              Physical Dot Matrix: Morphs into can silhouettes, foaming bubbles, and rotary carousel heads so plant operators instantly see physical machine anomalies.
            </span>
            <span className="text-slate-400 text-[11px] shrink-0 ml-2">
              Hover: repel • Click: ripple
            </span>
          </div>

          {/* Dot Matrix Canvas Box */}
          <div className="relative flex-1 w-full rounded-lg border border-slate-800/80 bg-slate-950 overflow-hidden min-h-[140px]">
            <DotMatrixVisualizer isExpanded={true} shapeMode={shapeMode} />
          </div>
        </div>

        {/* Right Column (5 cols): 4 Key Process Cards + Telemetry Event Stream */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 overflow-hidden font-sans">
          {/* 4 Process Telemetry Cards (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {/* Metric 1: Product Temperature */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                <span>FILL TEMP</span>
                <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div
                className={`text-lg font-bold font-mono leading-tight my-0.5 ${
                  appliedPlan ? 'text-twin-green' : 'text-twin-red'
                }`}
              >
                {appliedPlan ? '4.1 °C' : '14.8 °C'}
              </div>
              <div className="text-xs text-slate-300 font-sans">
                Setpoint: <strong className="font-semibold text-white">4.0 °C</strong>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 border-t border-slate-800/80 pt-1 truncate">
                {appliedPlan ? '✓ Nominal chilling' : '⚠️ +10.8°C flashes foam'}
              </div>
            </div>

            {/* Metric 2: Counter-Pressure Head */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                <span>PRESSURE</span>
                <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div
                className={`text-lg font-bold font-mono leading-tight my-0.5 ${
                  appliedPlan ? 'text-cyan-300' : 'text-amber-400'
                }`}
              >
                {appliedPlan ? '4.20 bar' : '3.82 bar'}
              </div>
              <div className="text-xs text-slate-300 font-sans">
                Target: <strong className="font-semibold text-white">4.20 bar</strong>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 border-t border-slate-800/80 pt-1 truncate">
                {appliedPlan ? '✓ Seal pressure locked' : '⚠️ Micro-leak Valve #7'}
              </div>
            </div>

            {/* Metric 3: Line 3 Canning Speed */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                <span>THROUGHPUT</span>
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div
                className={`text-lg font-bold font-mono leading-tight my-0.5 ${
                  appliedPlan ? 'text-twin-green' : 'text-twin-red'
                }`}
              >
                {appliedPlan ? '1,180 cpm' : '820 cpm'}
              </div>
              <div className="text-xs text-slate-300 font-sans">
                Rated: <strong className="font-semibold text-white">1,200 cpm</strong>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 border-t border-slate-800/80 pt-1 truncate">
                {appliedPlan ? '✓ 98.3% rated speed' : '⚠️ Throttled by 31.7%'}
              </div>
            </div>

            {/* Metric 4: Reject Rate at QC01 */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                <span>QC REJECTS</span>
                <AlertTriangle className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div
                className={`text-lg font-bold font-mono leading-tight my-0.5 ${
                  appliedPlan ? 'text-twin-green' : 'text-twin-red'
                }`}
              >
                {appliedPlan ? '0.12 %' : '6.40 %'}
              </div>
              <div className="text-xs text-slate-300 font-sans">
                Limit: <strong className="font-semibold text-white">&lt; 0.20%</strong>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 border-t border-slate-800/80 pt-1 truncate">
                {appliedPlan ? '✓ Pass rate nominal' : '⚠️ Under-fill level rejects'}
              </div>
            </div>
          </div>

          {/* Live Chronological Factory Incident & Telemetry Stream */}
          <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-2.5 font-sans overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 border-b border-slate-800 pb-1.5 shrink-0">
              <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE TELEMETRY LOG</span>
              <span className="rounded bg-cyan-950/70 px-2 py-0.5 text-[10px] text-cyan-300 font-mono border border-cyan-500/30">
                4.2 kHz Stream
              </span>
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-xs">
              {appliedPlan ? (
                <>
                  <div className="rounded border border-twin-green/30 bg-twin-green/10 p-2">
                    <div className="flex items-center justify-between text-twin-green font-bold text-xs">
                      <span>M07 Rotary Filler</span>
                      <span className="text-[11px] text-slate-400">Just now</span>
                    </div>
                    <div className="text-xs text-slate-200 mt-0.5">
                      Foam sensor threshold cleared. Pressure settled to 4.2 bar.
                    </div>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                    <div className="flex items-center justify-between text-cyan-300 font-bold text-xs">
                      <span>M05 Tubular Pasteurizer</span>
                      <span className="text-[11px] text-slate-400">1m ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Absorbing +20% flow. Heat exchange delta within 0.2°C target.
                    </div>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                    <div className="flex items-center justify-between text-slate-200 font-bold text-xs">
                      <span>QC01 Vision Inspector</span>
                      <span className="text-[11px] text-slate-400">2m ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Underfill reject rate dropped from 6.4% to 0.12%.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded border border-twin-red/40 bg-twin-red/10 p-2">
                    <div className="flex items-center justify-between text-twin-red font-bold text-xs">
                      <span>M07 Rotary Filler (Valve #7)</span>
                      <span className="text-[11px] text-slate-400">Just now</span>
                    </div>
                    <div className="text-xs text-slate-200 mt-0.5">
                      Severe foaming detected. Canning speed throttled from 1,200 to 820 cpm.
                    </div>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                    <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                      <span>M08 Can Seamer</span>
                      <span className="text-[11px] text-slate-400">1m ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Starwheel starvation alert. Downstream packaging queue stalled.
                    </div>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-900/60 p-2">
                    <div className="flex items-center justify-between text-twin-red font-bold text-xs">
                      <span>QC01 Vision Inspector</span>
                      <span className="text-[11px] text-slate-400">3m ago</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Reject spike: 18 consecutive cans rejected for underfill.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
