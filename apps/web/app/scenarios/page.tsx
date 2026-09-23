'use client';

import React, { useState } from 'react';
import { FactoryNav } from '@/components/layout/FactoryNav';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';
import { DeltaMatrix } from '@/components/scenarios/DeltaMatrix';
import { getDeterministicScenarioComparison } from '@/lib/simulation/simEngine';
import { useTwinStore } from '@/lib/store/twinStore';
import { SlidersHorizontal, ArrowLeft, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ScenariosPage = () => {
  const [selectedScenario, setSelectedScenario] = useState<'m07_down' | 'demand_surge' | 'energy_cap' | 'raw_delay' | 'quality_drift'>('m07_down');
  const [simState, setSimState] = useState<'idle' | 'simulating' | 'done'>('done');
  const comparison = getDeterministicScenarioComparison(selectedScenario === 'energy_cap' ? 'sustainability' : 'm07_down');
  const applyPlan = useTwinStore((s) => s.applyPlan);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);

  const handleSelectScenario = (key: typeof selectedScenario) => {
    setSelectedScenario(key);
    setSimState('simulating');
    setTimeout(() => {
      setSimState('done');
    }, 450);
  };

  return (
    <div className="flex h-full w-full gap-3 overflow-hidden">
      <FactoryNav />

      <div className="flex flex-1 flex-col overflow-y-auto rounded-xl border border-twin-panelBorder bg-twin-panel/90 p-5 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-twin-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-twin-accent" />
                <h2 className="font-sans text-base font-bold uppercase tracking-wider text-white">
                  What-If Scenario Lab
                </h2>
              </div>
              <p className="font-sans text-xs text-slate-300">
                Deterministic mathematical simulation engine • Real-time side-by-side delta matrices
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="rounded-lg border border-cyan-500/40 bg-cyan-950/60 px-3 py-1 font-sans text-xs font-medium text-cyan-300">
              Pipeline: BASELINE ──► SCENARIO ──► SIMULATION ──► DELTA TILES
            </span>
          </div>
        </div>

        {/* 1. Scenario Selector Cards (Point 23) */}
        <div className="mt-5 font-sans">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Select Active Scenario:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <ScenarioCard
              title="M07 Filler Foaming 4h"
              subtitle="Isobaric valve #7 seal leak & pressure drop"
              type="failure"
              active={selectedScenario === 'm07_down'}
              onSelect={() => handleSelectScenario('m07_down')}
            />
            <ScenarioCard
              title="Increase Demand +20%"
              subtitle="Surge in sparkling cold-brew & kombucha cans"
              type="surge"
              active={selectedScenario === 'demand_surge'}
              onSelect={() => handleSelectScenario('demand_surge')}
            />
            <ScenarioCard
              title="CO2 Chiller Cap -15%"
              subtitle="Grid peak-tariff chiller compressor modulation"
              type="energy"
              active={selectedScenario === 'energy_cap'}
              onSelect={() => handleSelectScenario('energy_cap')}
            />
            <ScenarioCard
              title="Can & Preform Delay"
              subtitle="3-day delay in 330ml aluminum can supply"
              type="delay"
              active={selectedScenario === 'raw_delay'}
              onSelect={() => handleSelectScenario('raw_delay')}
            />
            <ScenarioCard
              title="Quality Drift"
              subtitle="+3.5% underfill & low carbonation reject risk"
              type="quality"
              active={selectedScenario === 'quality_drift'}
              onSelect={() => handleSelectScenario('quality_drift')}
            />
          </div>
        </div>

        {/* 2. Simulation Execution & Delta Matrix Output */}
        <div className="mt-6 flex-1 font-sans">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-200">
              Comparative Simulation Matrix (Deltas vs Nominal Baseline)
            </h3>
            <span className="font-sans text-xs font-semibold text-cyan-400">
              Status: {simState === 'simulating' ? 'Simulating...' : 'Deterministic Result Computed'}
            </span>
          </div>

          <DeltaMatrix comparison={comparison} />

          {/* Actionable Prescribed Plan from Optimizer Agent */}
          <div className="mt-6 rounded-xl border border-twin-accent/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 p-5 shadow-lg font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-twin-accent" />
                <h4 className="font-sans text-sm font-bold uppercase text-white">
                  {comparison.optimized.name}
                </h4>
              </div>
              <span className="rounded bg-twin-green/20 px-2.5 py-0.5 font-sans text-xs font-bold text-twin-green border border-twin-green/40">
                PARETO-OPTIMAL
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {comparison.optimized.actions.map((act, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2.5 rounded-lg border border-twin-panelBorder bg-slate-950/70 p-3 text-xs font-sans text-slate-200"
                >
                  <span className="text-cyan-400 font-bold font-mono">0{i + 1}.</span>
                  <span className="leading-normal">{act}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-end space-x-3">
              <button
                onClick={() => applyPlan()}
                disabled={appliedPlan}
                className={`flex items-center space-x-2 rounded-lg px-6 py-2.5 text-xs font-sans font-bold transition-all ${
                  appliedPlan
                    ? 'border border-twin-green/50 bg-twin-green/20 text-twin-green'
                    : 'bg-twin-accent text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:brightness-110'
                }`}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{appliedPlan ? 'PLAN APPLIED TO 3D TWIN' : 'APPLY PLAN TO 3D TWIN'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenariosPage;
