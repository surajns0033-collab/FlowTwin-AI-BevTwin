'use client';

import React from 'react';
import { ScenarioWave } from '../particles/ScenarioWave';
import { Play } from 'lucide-react';

interface ScenarioCardProps {
  title: string;
  subtitle: string;
  type: 'surge' | 'failure' | 'energy' | 'quality' | 'delay';
  active?: boolean;
  onSelect: () => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  title,
  subtitle,
  type,
  active = false,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
        active
          ? 'border-twin-accent bg-cyan-950/40 shadow-[0_0_20px_rgba(0,210,255,0.25)]'
          : 'border-twin-panelBorder bg-twin-panel/70 hover:border-slate-500 hover:bg-twin-panel'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-sans text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </h4>
          <p className="mt-1 font-sans text-xs text-slate-300 leading-normal">{subtitle}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 transition-transform group-hover:scale-110 shadow">
          <Play className="h-4 w-4 fill-current" />
        </button>
      </div>

      {/* Animated particle signature wave */}
      <div className="mt-3">
        <ScenarioWave type={type} active={active} />
      </div>
    </div>
  );
};
