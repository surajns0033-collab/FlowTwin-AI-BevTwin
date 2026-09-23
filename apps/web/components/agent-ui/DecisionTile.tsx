'use client';

import React from 'react';
import { DecisionAction } from '@/lib/types';
import { useTwinStore } from '@/lib/store/twinStore';
import { CheckCircle2, Play, Sparkles } from 'lucide-react';

export const DecisionTile: React.FC<{ decision: DecisionAction }> = ({ decision }) => {
  const applyPlan = useTwinStore((s) => s.applyPlan);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const addMessage = useTwinStore((s) => s.addMessage);

  const handleApply = () => {
    applyPlan();
    addMessage({
      sender: 'agent',
      text: 'SIMULATION COMPLETE. Plan executed: 20% load shifted to Line 2, QC02 online. Factory state returning to calm.',
    });
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-twin-accent/60 bg-gradient-to-b from-twin-panel to-slate-950 p-4 shadow-[0_0_24px_rgba(0,210,255,0.15)]">
      <div className="flex items-center justify-between border-b border-twin-panelBorder pb-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-twin-accent shrink-0" />
          <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-cyan-300">
            {decision.title}
          </h4>
        </div>
        <span className="rounded bg-cyan-950/90 px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-300 border border-cyan-500/30">
          Confidence: {Math.round(decision.confidence * 100)}%
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <span className="font-sans text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Prescribed Actions:
        </span>
        {decision.actions.map((act, i) => (
          <div key={i} className="flex items-start space-x-2 text-xs font-sans text-slate-200 leading-relaxed">
            <span className="text-twin-accent font-bold">↳</span>
            <span>{act}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-twin-panelBorder bg-slate-900/80 p-2.5 text-center">
        <div>
          <div className="text-[11px] font-sans font-medium text-slate-400">Output</div>
          <div className="text-xs font-bold text-twin-green font-mono tracking-wide">
            {decision.expected.production}
          </div>
        </div>
        {decision.expected.qc_queue && (
          <div>
            <div className="text-[11px] font-sans font-medium text-slate-400">QC Queue</div>
            <div className="text-xs font-bold text-cyan-300 font-mono tracking-wide">
              {decision.expected.qc_queue}
            </div>
          </div>
        )}
        {decision.expected.shipment_delay && (
          <div>
            <div className="text-[11px] font-sans font-medium text-slate-400">Shipment</div>
            <div className="text-xs font-bold text-amber-400 font-mono tracking-wide">
              {decision.expected.shipment_delay}
            </div>
          </div>
        )}
        {decision.expected.energy && (
          <div>
            <div className="text-[11px] font-sans font-medium text-slate-400">Energy</div>
            <div className="text-xs font-bold text-twin-green font-mono tracking-wide">
              {decision.expected.energy}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center space-x-2.5">
        <button
          onClick={() => alert('Running comparative simulation...')}
          className="flex-1 rounded-lg border border-cyan-500/40 bg-cyan-950/50 py-2 text-xs font-sans font-semibold text-cyan-200 transition-colors hover:bg-cyan-900/70 hover:text-white"
        >
          Simulate
        </button>
        <button
          onClick={handleApply}
          disabled={appliedPlan}
          className={`flex flex-1 items-center justify-center space-x-1.5 rounded-lg py-2 text-xs font-sans font-bold transition-all ${
            appliedPlan
              ? 'bg-twin-green/20 text-twin-green border border-twin-green/50 cursor-default'
              : 'bg-twin-accent text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)] hover:brightness-110'
          }`}
        >
          {appliedPlan ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>PLAN APPLIED</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Apply Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
