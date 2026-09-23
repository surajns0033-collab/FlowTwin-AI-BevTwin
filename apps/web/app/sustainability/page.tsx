'use client';

import React, { useState } from 'react';
import { FactoryNav } from '@/components/layout/FactoryNav';
import { ParticleField } from '@/components/particles/ParticleField';
import { ConcentricObjectiveRings } from '@/components/particles/ConcentricObjectiveRings';
import { useTwinStore } from '@/lib/store/twinStore';
import { Leaf, ArrowLeft, Zap, Sparkles, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';

const SustainabilityPage = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [applied, setApplied] = useState(false);
  const applyPlan = useTwinStore((s) => s.applyPlan);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setApplied(true);
      applyPlan();
    }, 800);
  };

  return (
    <div className="flex h-full w-full gap-3 overflow-hidden">
      <FactoryNav />

      <div className="flex flex-1 flex-col overflow-y-auto rounded-xl border border-twin-panelBorder bg-twin-panel/90 p-5 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-twin-panelBorder pb-4 font-sans">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 text-twin-green" />
                <h2 className="font-sans text-base font-bold uppercase tracking-wider text-white">
                  Sustainability Dynamic Objective Field
                </h2>
              </div>
              <p className="font-sans text-xs text-slate-300">
                Multi-objective Pareto optimization • Maximize output while minimizing energy, waste, and CO₂
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="rounded-md border border-twin-green/40 bg-emerald-950/60 px-3 py-1 font-sans text-xs font-semibold text-twin-green">
              Constraint Engine: Max(Output) - Min(Energy + Waste + CO₂)
            </span>
          </div>
        </div>

        {/* 1. Concentric Orbital Objective Rings */}
        <div className="mt-5">
          <ConcentricObjectiveRings applied={applied} />
        </div>

        {/* 2. Ambient Particle Field Visualization */}
        <div className="mt-5 font-sans">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-200">
              Entropy & Flow Field (Energy Shifting Grid)
            </span>
            <span className="font-mono text-xs font-semibold text-cyan-400">
              {applied ? 'State: Coherent (0.12 Entropy)' : 'State: Dissipative (0.68 Entropy)'}
            </span>
          </div>
          <div className="h-32 w-full rounded-xl border border-twin-panelBorder/80 bg-slate-950/80 p-2">
            <ParticleField height={110} density={applied ? 60 : 120} />
          </div>
        </div>

        {/* 3. AI Solver & Recommendations */}
        <div className="mt-5 rounded-xl border border-twin-panelBorder/80 bg-slate-950/85 p-5 font-sans">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-twin-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                AI Optimization Solver: &ldquo;Maintain Production but Reduce Energy&rdquo;
              </span>
            </div>
            <span className="text-xs font-bold text-twin-green border border-twin-green/40 bg-emerald-950/50 px-2.5 py-0.5 rounded">
              SOLVER STATUS: {applied ? 'OPTIMAL' : 'AVAILABLE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Current Baseline</span>
              <div className="text-sm font-bold text-slate-100 font-mono">
                350,000 cans & bottles • 18,400 kWh
              </div>
              <div className="text-xs text-slate-300 font-sans">
                CO₂: 7,360 kg • Peak Tariff Windows active (14:00 - 18:00)
              </div>
            </div>

            <div className="rounded-lg border border-twin-green/40 bg-emerald-950/30 p-3.5 space-y-1">
              <span className="text-twin-green text-xs uppercase font-bold tracking-wider">Optimized Target</span>
              <div className="text-sm font-bold text-twin-green font-mono">
                350,000 cans & bottles • 15,900 kWh
              </div>
              <div className="text-xs text-slate-200 font-sans">
                -2,500 kWh saved (-13.6%) • -1,000 kg CO₂ avoided • Output 100% maintained
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3.5">
            <div className="text-xs text-slate-300 max-w-[65%] leading-relaxed font-sans">
              {applied
                ? '✓ Flash pasteurization (M05) & CIP sanitation shifted to off-peak (22:00 - 04:00). Chiller idle cut by 35%.'
                : 'Clicking apply initiates deterministic thermal scheduling across Line 1, Line 2 pasteurizers, and Line 3 fillers.'}
            </div>
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || applied}
              className={`flex items-center space-x-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all ${
                applied
                  ? 'border border-twin-green/60 bg-emerald-950 text-twin-green'
                  : 'bg-twin-accent text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
              }`}
            >
              {isOptimizing ? (
                <span>Solving Pareto Frontier...</span>
              ) : applied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>OPTIMIZATION LOCKED</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Pareto Optimization</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;
