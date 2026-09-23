'use client';

import React from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

export const StepDots: React.FC = () => {
  const stepProgress = useTwinStore((s) => s.stepProgress);
  const isSimulating = useTwinStore((s) => s.isSimulating);

  if (!isSimulating && Object.values(stepProgress).every((v) => v === 'idle')) {
    return null;
  }

  const steps = [
    { key: 'state', label: 'Reading current state' },
    { key: 'dependencies', label: 'Checking dependencies' },
    { key: 'simulation', label: 'Running simulation' },
    { key: 'evaluating', label: 'Evaluating impact' },
    { key: 'recommendation', label: 'Preparing recommendation' },
  ] as const;

  return (
    <div className="my-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3.5 backdrop-blur font-sans">
      <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-cyan-300 mb-2.5">
        <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
        <span>Agent Orchestration Pipeline</span>
      </div>

      <div className="space-y-2 font-sans">
        {steps.map((step) => {
          const status = stepProgress[step.key];
          const isDone = status === 'done';
          const isRunning = status === 'running';

          return (
            <div key={step.key} className="flex items-center space-x-2.5 text-xs font-sans">
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-twin-green shadow-[0_0_8px_#00f076]'
                    : isRunning
                    ? 'bg-twin-accent animate-pulse shadow-[0_0_8px_#00d2ff]'
                    : 'bg-slate-700'
                }`}
              />
              <span
                className={`${
                  isDone
                    ? 'text-twin-green font-medium'
                    : isRunning
                    ? 'text-cyan-200 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
