'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FactoryNav } from '@/components/layout/FactoryNav';
import { CopilotPanel } from '@/components/agent-ui/CopilotPanel';
import { CausalRibbon } from '@/components/particles/CausalRibbon';
import { ParticleField } from '@/components/particles/ParticleField';
import { LiveInsightsModule } from '@/components/particles/LiveInsightsModule';
import { ScenarioWave } from '@/components/particles/ScenarioWave';
import { NavInspectorModal } from '@/components/layout/NavInspectorModal';
import { GoogleToolsHubModal } from '@/components/cloud/GoogleToolsHubModal';
import { NetworkIntelligenceStudio } from '@/components/networks/NetworkIntelligenceStudio';
import { useTwinStore } from '@/lib/store/twinStore';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Undo2,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';

// Dynamically import Three.js FactoryScene to prevent SSR WebGL errors
const FactoryScene = dynamic(
  () => import('@/components/3d/FactoryScene').then((mod) => mod.FactoryScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-twin-panelBorder bg-twin-panel font-mono text-xs text-cyan-400">
        Initializing 3D Twin Environment...
      </div>
    ),
  }
);

export default function HomePage() {
  const activeDecision = useTwinStore((s) => s.activeDecision);
  const activeScenario = useTwinStore((s) => s.activeScenario);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const setActiveCausalChain = useTwinStore((s) => s.setActiveCausalChain);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const primaryView = useTwinStore((s) => s.primaryView);
  const setPrimaryView = useTwinStore((s) => s.setPrimaryView);

  return (
    <div className="flex h-full w-full gap-3 overflow-hidden">
      {/* A. Left: Factory Navigation */}
      <FactoryNav />

      {/* Center & Bottom Main Operational Workspace */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        {/* ========================================================================= */}
        {/* TOP / PRIMARY VIEWPORT (Swappable between 3D Twin, Live Insights, etc.)   */}
        {/* ========================================================================= */}
        <div className="relative flex-1 overflow-hidden rounded-xl border border-twin-panelBorder bg-slate-950/80 shadow-2xl">
          {/* CASE 1: 3D LIVE TWIN PRIMARY */}
          {primaryView === '3d_twin' && (
            <div className="relative h-full w-full">
              <FactoryScene />
            </div>
          )}

          {/* CASE 2: LIVE INSIGHTS EXPANDED VIEW */}
          {primaryView === 'live_insights' && (
            <LiveInsightsModule isExpanded={true} />
          )}

          {/* CASE 3: WHAT-IF SCENARIOS EXPANDED VIEW */}
          {primaryView === 'what_if' && (
            <div className="flex h-full w-full flex-col bg-[#060a16] p-4 text-slate-200 font-sans">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-sans text-base font-bold text-white tracking-wide uppercase">
                        WHAT-IF MULTI-VARIABLE SCENARIO LAB
                      </h2>
                      <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                        MONTE CARLO ENGINE
                      </span>
                    </div>
                    <p className="font-sans text-xs text-slate-300">
                      Predictive bottleneck propagation and parameter boundary testing across gigafactory lines.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href="/scenarios"
                    className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-sans text-xs font-semibold text-cyan-300 hover:border-cyan-500 hover:text-white"
                  >
                    <span>Open Full Scenarios Workspace</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setPrimaryView('3d_twin')}
                    className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/60 bg-cyan-950/80 px-3.5 py-1.5 font-sans text-xs font-bold text-cyan-200 hover:bg-cyan-900 hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                  >
                    <Undo2 className="h-4 w-4" />
                    <span>Return 3D Twin to Main View</span>
                  </button>
                </div>
              </div>

              {/* Scenario Comparison Cards */}
              <div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-4 my-3 overflow-y-auto">
                {/* Scenario 1 */}
                <div
                  onClick={() => {
                    setFocusedTarget('M07');
                    setActiveCausalChain(['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'critical');
                  }}
                  className="cursor-pointer rounded-xl border border-twin-red/50 bg-slate-950/90 p-4 hover:border-twin-red transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-twin-red/20 px-2 py-0.5 font-sans text-xs font-bold text-twin-red">
                        BASELINE CRITICAL
                      </span>
                      <span className="font-mono text-xs text-twin-red font-bold">Delay: 5.5 hrs</span>
                    </div>
                    <h3 className="font-sans text-sm font-bold text-white mt-2">
                      M07 Rotary Filler Foaming Bottleneck
                    </h3>
                    <p className="font-sans text-xs text-slate-300 mt-1 leading-normal">
                      Beverage carbonation pressure imbalance causing severe headspace foaming on 330ml sleek cans.
                    </p>
                    <div className="mt-3">
                      <ScenarioWave type="failure" active={!appliedPlan} />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 font-sans text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Throughput Loss:</span>
                      <span className="text-twin-red font-bold font-mono">-3,400 cases</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Pallet Delivery Risk:</span>
                      <span className="text-twin-red font-bold">HIGH (Walmart Order #8921)</span>
                    </div>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div
                  onClick={() => {
                    setFocusedTarget('M05');
                    setActiveCausalChain(['M05', 'L2', 'QC01'], 'medium');
                  }}
                  className="cursor-pointer rounded-xl border border-cyan-500/50 bg-slate-950/90 p-4 hover:border-cyan-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-sans text-xs font-bold text-cyan-300">
                        RECOMMENDED MITIGATION
                      </span>
                      <span className="font-mono text-xs text-twin-green font-bold">Delay: 0.8 hrs</span>
                    </div>
                    <h3 className="font-sans text-sm font-bold text-white mt-2">
                      Dynamic Volume Re-Route to Line 2
                    </h3>
                    <p className="font-sans text-xs text-slate-300 mt-1 leading-normal">
                      Absorb 20% beverage batch flow through Line 2 Tunnel Pasteurizer while lowering M07 pump frequency by 12%.
                    </p>
                    <div className="mt-3">
                      <ScenarioWave type="energy" active={appliedPlan} />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 font-sans text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Recovered Output:</span>
                      <span className="text-twin-green font-bold font-mono">+2,800 cases</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Net Delay Reduction:</span>
                      <span className="text-twin-green font-bold">-4.7 hours</span>
                    </div>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div
                  onClick={() => {
                    setFocusedTarget('M02');
                    setActiveCausalChain(['M02', 'L1', 'QC01'], 'low');
                  }}
                  className="cursor-pointer rounded-xl border border-twin-green/50 bg-slate-950/90 p-4 hover:border-twin-green transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-twin-green/20 px-2 py-0.5 font-sans text-xs font-bold text-twin-green">
                        ENERGY ECO-MODE
                      </span>
                      <span className="font-mono text-xs text-twin-green font-bold">-15% kW Peak</span>
                    </div>
                    <h3 className="font-sans text-sm font-bold text-white mt-2">
                      CO2 Compression & Chiller Eco-Profile
                    </h3>
                    <p className="font-sans text-xs text-slate-300 mt-1 leading-normal">
                      Modulates chiller compressor cycles during peak tariff hours (14:00 - 18:00) with zero line stoppage.
                    </p>
                    <div className="mt-3">
                      <ScenarioWave type="energy" active={true} />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 font-sans text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Peak Power Savings:</span>
                      <span className="text-twin-green font-bold font-mono">-22.4 kW</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Daily Cost Delta:</span>
                      <span className="text-twin-green font-bold font-mono">-$1,480 / shift</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASE 4: AI DECISION ENGINE EXPANDED VIEW */}
          {primaryView === 'decision_engine' && (
            <div className="flex h-full w-full flex-col bg-[#060a16] p-4 text-slate-200">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-sans text-base font-bold text-white tracking-wide uppercase">
                        AUTONOMOUS AI DECISION MATRIX
                      </h2>
                      <span className="rounded bg-twin-green/20 px-2 py-0.5 font-sans text-xs font-bold text-twin-green border border-twin-green/40">
                        96.8% CONFIDENCE
                      </span>
                    </div>
                    <p className="font-sans text-xs text-slate-300">
                      Multi-agent supervisory causal reasoning and automated remediation dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      useTwinStore.getState().applyPlan();
                    }}
                    disabled={appliedPlan}
                    className={`rounded-lg px-4 py-1.5 font-sans text-xs font-bold transition-all ${
                      appliedPlan
                        ? 'border border-twin-green/50 bg-twin-green/20 text-twin-green'
                        : 'bg-twin-accent text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.5)] hover:scale-105'
                    }`}
                  >
                    {appliedPlan ? '✓ OPTIMIZATION ACTIVE' : '⚡ EXECUTE AI PLAN NOW'}
                  </button>
                  <button
                    onClick={() => setPrimaryView('3d_twin')}
                    className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/60 bg-cyan-950/80 px-3.5 py-1.5 font-sans text-xs font-bold text-cyan-200 hover:bg-cyan-900 hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.25)]"
                  >
                    <Undo2 className="h-4 w-4" />
                    <span>Return 3D Twin to Main View</span>
                  </button>
                </div>
              </div>

              {/* Diagnostic Flow Details */}
              <div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-4 my-3 overflow-y-auto">
                {/* Stage 1: Root Cause */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-sans space-y-3">
                  <div className="flex items-center space-x-2 text-twin-accent">
                    <AlertTriangle className="h-4 w-4 text-twin-red" />
                    <span className="font-bold text-sm text-white">1. Root-Cause Isolation</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">Trigger:</strong> High-frequency vibration sensor probe #107 on{' '}
                      <span className="text-cyan-400 font-semibold">M07 Rotary Isobaric Can Filler</span>.
                    </p>
                    <p>
                      <strong className="text-white">Symptom:</strong> Micro-foaming entrainment at 1,150 cans/min filling head.
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-white">Causal Node:</strong> Upstream beverage supply valve cavitation caused by 0.4 bar CO2 pressure fluctuation.
                    </p>
                  </div>
                </div>

                {/* Stage 2: Multi-Agent Consensus */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-sans space-y-3">
                  <div className="flex items-center space-x-2 text-twin-accent">
                    <Cpu className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-sm text-white">2. Supervisory Multi-Agent Consensus</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <div className="rounded bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-cyan-400 font-bold">[Hydraulic Agent]:</span> Recommends reducing M07 fill speed by 12% to suppress foam.
                    </div>
                    <div className="rounded bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-twin-green font-bold">[Routing Agent]:</span> Confirms Line 2 Pasteurizer has 25% surplus capacity.
                    </div>
                    <div className="rounded bg-slate-900 p-2.5 border border-slate-800">
                      <span className="text-cyan-300 font-bold">[QA Inspector Agent]:</span> Dissolved oxygen and net fill variance remain within 0.1% tolerance.
                    </div>
                  </div>
                </div>

                {/* Stage 3: Autonomous Actions */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-sans space-y-3">
                  <div className="flex items-center space-x-2 text-twin-accent">
                    <CheckCircle2 className="h-4 w-4 text-twin-green" />
                    <span className="font-bold text-sm text-white">3. Prescriptive Execution</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <div className="flex items-start space-x-2">
                      <span className="text-twin-green font-bold">✓</span>
                      <span>Modulate 3-way diverter valve DV-03 by +20% flow to Line 2.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-twin-green font-bold">✓</span>
                      <span>Adjust M07 de-aeration vacuum to -0.85 bar.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-twin-green font-bold">✓</span>
                      <span>Re-synchronize M08 Seamer timing belt to match damped inflow.</span>
                    </div>
                    <div className="mt-3 rounded border border-twin-green/40 bg-twin-green/10 p-2 text-center text-twin-green font-bold text-xs">
                      {appliedPlan ? 'ALL ACTIONS DEPLOYED TO PLC CONTROLLERS' : 'READY FOR ONE-CLICK EXECUTION'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASE 5: OPERATIONAL INTELLIGENCE NETWORKS STUDIO */}
          {primaryView === 'network_studio' && (
            <NetworkIntelligenceStudio />
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ROW (3 Tiles): Swaps dynamically so non-primary views live here    */}
        {/* ========================================================================= */}
        <div className="grid h-52 grid-cols-1 md:grid-cols-3 gap-3">
          {/* ----------------------------------------------------------------------- */}
          {/* SLOT 1: 3D Twin (if swapped out) OR Live Insights                       */}
          {/* ----------------------------------------------------------------------- */}
          {primaryView !== '3d_twin' ? (
            /* Mini 3D Live Twin Preview Tile (Clicking it swaps back to main area) */
            <div
              onClick={() => setPrimaryView('3d_twin')}
              className="relative flex flex-col rounded-xl border border-cyan-500/40 bg-twin-panel/90 shadow-lg backdrop-blur overflow-hidden cursor-pointer hover:border-cyan-400 group transition-all"
            >
              <FactoryScene isMini={true} onExpand={() => setPrimaryView('3d_twin')} />
            </div>
          ) : (
            /* Live Insights Relatable Operational Tile */
            <LiveInsightsModule
              isExpanded={false}
              onExpand={() => setPrimaryView('live_insights')}
            />
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* SLOT 2: What-If Scenarios (or Live Insights if what_if or decision_engine is primary) */}
          {/* ----------------------------------------------------------------------- */}
          {primaryView === 'what_if' || primaryView === 'decision_engine' ? (
            /* If what_if or decision_engine is in main area, slot 2 shows Live Insights */
            <LiveInsightsModule
              isExpanded={false}
              onExpand={() => setPrimaryView('live_insights')}
            />
          ) : (
            /* Default Slot 2: What-If Scenarios Tile */
            <div
              onClick={() => setPrimaryView('what_if')}
              className="group flex flex-col rounded-xl border border-twin-panelBorder bg-twin-panel/95 p-3 shadow-lg backdrop-blur cursor-pointer hover:border-cyan-400/80 transition-all font-sans"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-twin-accent" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                    What-If Scenarios
                  </span>
                </div>
                <span className="flex items-center space-x-1 rounded border border-cyan-500/40 bg-cyan-950/70 px-2 py-0.5 font-sans text-[10px] text-cyan-200 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors font-semibold">
                  <Maximize2 className="h-3 w-3" />
                  <span>Expand</span>
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pr-1 font-sans">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedTarget('M07');
                    setActiveCausalChain(['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'critical');
                  }}
                  className="rounded-lg border border-twin-panelBorder/80 bg-slate-950/80 p-2 hover:border-twin-red transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                    <span>M07 Filler Foaming (4h)</span>
                    <span className="text-twin-red font-bold font-mono">⚡⚡⚡</span>
                  </div>
                  <ScenarioWave type="failure" active={!appliedPlan} />
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedTarget('M02');
                    setActiveCausalChain(['M02', 'L1', 'QC01'], 'low');
                  }}
                  className="rounded-lg border border-twin-panelBorder/80 bg-slate-950/80 p-2 hover:border-twin-green transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                    <span>CO2 Chiller Cap -15%</span>
                    <span className="text-twin-green font-bold font-sans text-[11px]">-15% Peak kW</span>
                  </div>
                  <ScenarioWave type="energy" active={appliedPlan} />
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] font-sans text-slate-300 pt-1 border-t border-slate-800/80">
                <span>Monte Carlo Simulator</span>
                <span className="text-cyan-400 font-semibold">Click to expand ⤢</span>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* SLOT 3: AI Decision Engine (or What-If Scenarios if decision_engine is primary) */}
          {/* ----------------------------------------------------------------------- */}
          {primaryView === 'decision_engine' ? (
            /* If decision_engine is primary, slot 3 shows What-If Scenarios */
            <div
              onClick={() => setPrimaryView('what_if')}
              className="group flex flex-col rounded-xl border border-twin-panelBorder bg-twin-panel/95 p-3 shadow-lg backdrop-blur cursor-pointer hover:border-cyan-400/80 transition-all font-sans"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-twin-accent" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                    What-If Scenarios
                  </span>
                </div>
                <span className="flex items-center space-x-1 rounded border border-cyan-500/40 bg-cyan-950/70 px-2 py-0.5 font-sans text-[10px] text-cyan-200 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors font-semibold">
                  <Maximize2 className="h-3 w-3" />
                  <span>Expand</span>
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 font-sans">
                <div className="rounded-lg border border-twin-panelBorder/80 bg-slate-950/80 p-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                    <span>M07 Filler Foaming (4h)</span>
                    <span className="text-twin-red font-bold font-mono">⚡⚡⚡</span>
                  </div>
                  <ScenarioWave type="failure" active={!appliedPlan} />
                </div>
                <div className="rounded-lg border border-twin-panelBorder/80 bg-slate-950/80 p-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                    <span>CO2 Chiller Cap -15%</span>
                    <span className="text-twin-green font-bold font-sans text-[11px]">-15% Peak kW</span>
                  </div>
                  <ScenarioWave type="energy" active={appliedPlan} />
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] font-sans text-slate-300 pt-1 border-t border-slate-800/80">
                <span>Monte Carlo Simulator</span>
                <span className="text-cyan-400 font-semibold">Click to expand ⤢</span>
              </div>
            </div>
          ) : (
            /* Default Slot 3: AI Decision Action Tile */
            <div
              onClick={() => setPrimaryView('decision_engine')}
              className="group flex flex-col rounded-xl border border-twin-panelBorder bg-twin-panel/95 p-3 shadow-lg backdrop-blur cursor-pointer hover:border-cyan-400/80 transition-all font-sans"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-twin-accent" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-cyan-300 group-hover:text-white transition-colors">
                    AI Decision Engine
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="rounded bg-twin-green/20 px-2 py-0.5 font-sans text-[10px] font-bold text-twin-green border border-twin-green/40">
                    RECOMMENDED
                  </span>
                  <span className="flex items-center space-x-1 rounded border border-cyan-500/40 bg-cyan-950/70 px-2 py-0.5 font-sans text-[10px] text-cyan-200 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors font-semibold">
                    <Maximize2 className="h-3 w-3" />
                    <span>Expand</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between rounded-lg border border-twin-panelBorder/70 bg-slate-950/80 p-2.5 font-sans">
                <div className="space-y-1 text-xs">
                  <div className="text-slate-100 font-semibold leading-snug">
                    {appliedPlan
                      ? '✓ Volume Re-Balanced: Line 2 absorbing 20% beverage flow.'
                      : '⚡ Reroute 20% batch flow → Line 2 (M05 Pasteurizer)'}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-normal">
                    {appliedPlan
                      ? 'Fill queue normalized. Pallet delivery on schedule.'
                      : 'Target Output: 9,600 cases • Delay: 0.8h (down from 5.5h)'}
                  </div>
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimaryView('decision_engine');
                    }}
                    className="flex-1 rounded border border-cyan-500/40 bg-cyan-950/50 py-1.5 text-center text-xs font-sans font-semibold text-cyan-200 hover:bg-cyan-900/70 hover:text-white transition-colors"
                  >
                    View Flow
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      useTwinStore.getState().applyPlan();
                    }}
                    disabled={appliedPlan}
                    className={`flex-1 rounded py-1.5 text-center text-xs font-sans font-bold transition-all ${
                      appliedPlan
                        ? 'border border-twin-green/50 bg-twin-green/20 text-twin-green'
                        : 'bg-twin-accent text-slate-950 shadow-[0_0_12px_rgba(0,210,255,0.4)] hover:brightness-110'
                    }`}
                  >
                    {appliedPlan ? 'PLAN APPLIED' : 'Apply Plan'}
                  </button>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] font-sans text-slate-300 pt-1 border-t border-slate-800/80">
                <span>Autonomous Supervisory AI</span>
                <span className="text-cyan-400 font-semibold">Click to expand ⤢</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* C. Right: Operations Assistant Panel */}
      <div className="w-80 h-full overflow-hidden">
        <CopilotPanel />
      </div>

      {/* Nav Inspector Modal for all active tabs */}
      <NavInspectorModal />

      {/* Google Cloud & AI Platform Hub */}
      <GoogleToolsHubModal
        isOpen={useTwinStore((s) => s.isGoogleToolsHubOpen)}
        onClose={() => useTwinStore.getState().setIsGoogleToolsHubOpen(false)}
      />
    </div>
  );
}
