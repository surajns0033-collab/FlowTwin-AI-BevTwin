'use client';

import React, { useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import { RadialOrchestratorGraph } from './RadialOrchestratorGraph';
import { AdaptiveIntelligenceMesh } from './AdaptiveIntelligenceMesh';
import { DomainClusterNetwork } from './DomainClusterNetwork';
import { CognitiveFlowGraph } from './CognitiveFlowGraph';
import { CausalForceGraph } from './CausalForceGraph';
import { SpectralWaveformIntelligence } from './SpectralWaveformIntelligence';
import {
  Network,
  Maximize2,
  Minimize2,
  Undo2,
  Zap,
  Activity,
  Layers,
  Cpu,
  Share2,
  SlidersHorizontal,
  Workflow,
} from 'lucide-react';

type NetworkMode =
  | 'all'
  | 'radial'
  | 'mesh'
  | 'clusters'
  | 'flow'
  | 'force'
  | 'waveform';

export const NetworkIntelligenceStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<NetworkMode>('all');
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const applyPlan = useTwinStore((s) => s.applyPlan);
  const setPrimaryView = useTwinStore((s) => s.setPrimaryView);

  return (
    <div className="flex h-full w-full flex-col bg-[#050813] p-3 text-slate-200 overflow-hidden select-none font-sans">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/30 pb-2 gap-2 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/50 bg-cyan-950/70 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.35)]">
            <Network className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-sans text-xs font-bold text-white tracking-wider uppercase">
                DYNAMIC VISUAL NETWORKS
              </h2>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border ${
                  appliedPlan
                    ? 'border-twin-green/40 bg-twin-green/20 text-twin-green'
                    : 'border-twin-red/40 bg-twin-red/20 text-twin-red animate-pulse'
                }`}
              >
                {appliedPlan ? 'ALL NETWORKS SYNCHRONIZED' : 'FAULT PROPAGATION DETECTED'}
              </span>
              <span className="rounded bg-cyan-950/70 px-2 py-0.5 text-[10px] text-cyan-200 border border-cyan-500/30 font-medium">
                Live Interactive Models • State Synchronized
              </span>
            </div>
            <p className="font-sans text-xs text-slate-300 mt-0.5">
              Procedural dynamic visual networks for multi-agent collaboration, factory domains, process flow, and cause-effect relationships.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-2">
          {!appliedPlan && (
            <button
              onClick={() => applyPlan()}
              className="flex items-center space-x-1.5 rounded bg-twin-accent px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Apply Mitigation Plan</span>
            </button>
          )}

          <button
            onClick={() => setPrimaryView('3d_twin')}
            className="flex items-center space-x-1.5 rounded border border-cyan-500/60 bg-cyan-950/80 px-3.5 py-1.5 text-xs font-bold text-cyan-200 hover:bg-cyan-900 hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.25)]"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Return 3D Twin to Main View</span>
          </button>
        </div>
      </div>

      {/* Network Mode Switcher Tabs */}
      <div className="flex items-center justify-between my-2 border-b border-slate-800 pb-2 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5 font-sans">
          <button
            onClick={() => setActiveMode('all')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All 6 Networks (Matrix)</span>
          </button>

          <button
            onClick={() => setActiveMode('radial')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'radial'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Radial Intelligence Graph</span>
          </button>

          <button
            onClick={() => setActiveMode('mesh')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'mesh'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>3D Operations Mesh</span>
          </button>

          <button
            onClick={() => setActiveMode('clusters')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'clusters'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Cluster Network</span>
          </button>

          <button
            onClick={() => setActiveMode('flow')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'flow'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>Flow Graph</span>
          </button>

          <button
            onClick={() => setActiveMode('force')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'force'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Force-Directed Graph</span>
          </button>

          <button
            onClick={() => setActiveMode('waveform')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMode === 'waveform'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Waveform Intelligence</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Click any card to view full workbench</span>
        </div>
      </div>

      {/* Main Viewport Body */}
      {activeMode === 'all' ? (
        /* ========================================================================= */
        /* MODE A: 6-UP MATRIX GRID (Exact Match to User's Reference Image)         */
        /* ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 overflow-y-auto pr-1 font-sans">
          {/* Card 1: Radial Intelligence Graph (Card 3 in Reference Image) */}
          <div
            onClick={() => setActiveMode('radial')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  3. Radial Intelligence Graph
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Multi-agent collaboration</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <RadialOrchestratorGraph isMini={true} height={140} />
            </div>
          </div>

          {/* Card 2: 3D Operations Mesh (Card 5 in Reference Image) */}
          <div
            onClick={() => setActiveMode('mesh')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  5. 3D Operations Mesh
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Real-time adaptive network</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <AdaptiveIntelligenceMesh isMini={true} height={140} />
            </div>
          </div>

          {/* Card 3: Cluster Network (Card 6 in Reference Image) */}
          <div
            onClick={() => setActiveMode('clusters')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  6. Cluster Network
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Intelligent grouping</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <DomainClusterNetwork isMini={true} height={140} />
            </div>
          </div>

          {/* Card 4: Flow Graph (Card 7 in Reference Image) */}
          <div
            onClick={() => setActiveMode('flow')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  7. Flow Graph
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Process flow with AI reasoning</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <CognitiveFlowGraph isMini={true} height={140} />
            </div>
          </div>

          {/* Card 5: Force-Directed Graph (Card 8 in Reference Image) */}
          <div
            onClick={() => setActiveMode('force')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  8. Force-Directed Graph
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Dynamic relationships</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <CausalForceGraph isMini={true} height={140} />
            </div>
          </div>

          {/* Card 6: Waveform Intelligence (Card 9 in Reference Image) */}
          <div
            onClick={() => setActiveMode('waveform')}
            className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-3 hover:border-cyan-400/80 transition-all cursor-pointer shadow-lg min-h-[190px]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  9. Waveform Intelligence
                </h3>
                <p className="text-[11px] text-slate-300 font-normal">Live processing/activity state</p>
              </div>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="relative flex-1 w-full rounded-lg border border-slate-900 bg-[#030611] overflow-hidden min-h-[140px]">
              <SpectralWaveformIntelligence isMini={true} height={140} />
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE B: FOCUSED WORKBENCH VIEW                                            */
        /* ========================================================================= */
        <div className="flex flex-col flex-1 rounded-xl border border-cyan-500/40 bg-slate-950/95 p-3 overflow-hidden shadow-2xl min-h-0 font-sans">
          <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                {activeMode === 'radial' && '3. Radial Intelligence Graph (Multi-agent collaboration)'}
                {activeMode === 'mesh' && '5. 3D Operations Mesh (Real-time adaptive network)'}
                {activeMode === 'clusters' && '6. Cluster Network (Intelligent grouping)'}
                {activeMode === 'flow' && '7. Flow Graph (Process flow with AI reasoning)'}
                {activeMode === 'force' && '8. Force-Directed Graph (Dynamic relationships)'}
                {activeMode === 'waveform' && '9. Waveform Intelligence (Live processing/activity state)'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Interactive visual network workbench • Live operational synchronization
              </p>
            </div>

            <button
              onClick={() => setActiveMode('all')}
              className="flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-cyan-200 hover:border-cyan-400 hover:text-white transition-colors"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Back to 6-Network Matrix</span>
            </button>
          </div>

          <div className="relative flex-1 w-full rounded-lg border border-slate-800 bg-[#030611] overflow-hidden min-h-0">
            {activeMode === 'radial' && <RadialOrchestratorGraph isMini={false} height={340} />}
            {activeMode === 'mesh' && <AdaptiveIntelligenceMesh isMini={false} height={340} />}
            {activeMode === 'clusters' && <DomainClusterNetwork isMini={false} height={340} />}
            {activeMode === 'flow' && <CognitiveFlowGraph isMini={false} height={340} />}
            {activeMode === 'force' && <CausalForceGraph isMini={false} height={340} />}
            {activeMode === 'waveform' && <SpectralWaveformIntelligence isMini={false} height={340} />}
          </div>
        </div>
      )}
    </div>
  );
};
