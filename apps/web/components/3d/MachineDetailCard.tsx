'use client';

import React, { useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import { MACHINE_KNOWLEDGE } from '@/lib/machineKnowledge';
import {
  X,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Info,
} from 'lucide-react';

export const MachineDetailCard: React.FC = () => {
  const selectedMachineId = useTwinStore((s) => s.selectedMachineId);
  const setSelectedMachineId = useTwinStore((s) => s.setSelectedMachineId);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const machines = useTwinStore((s) => s.machines);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const addMessage = useTwinStore((s) => s.addMessage);

  const [activeTab, setActiveTab] = useState<'subsystems' | 'process' | 'telemetry'>('subsystems');
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockPosition, setDockPosition] = useState<'left' | 'right'>('right'); // Default right to never cover M07/M08 on Line 3
  const [isGhost, setIsGhost] = useState(false);

  if (!selectedMachineId) return null;

  const machine = machines.find((m) => m.id === selectedMachineId);
  const knowledge = MACHINE_KNOWLEDGE[selectedMachineId] || {
    id: selectedMachineId,
    name: machine?.name || selectedMachineId,
    line: `Line ${machine?.line || 'Factory'}`,
    category: 'Industrial Production Cell',
    subsystems: [
      { name: 'Core Actuator & Drive Unit', spec: 'Precision Variable Servo Motor', role: 'Main kinematics drive' },
      { name: 'Micro-Telemetry Sensor Array', spec: 'Thermal & Vibro-acoustic probes', role: 'Condition monitoring' },
      { name: 'Safety Interlocking Enclosure', spec: 'OSHA/ISO compliant safety barrier', role: 'Operator physical safety' },
    ],
    operation: {
      title: 'Automated Beverage Packaging Stage',
      description: 'Executes synchronized mechanical bottling/canning operations in the factory production sequence.',
      workpiece: 'Beverage Container (Can / Bottle)',
      stageFlow: [
        '1. Ingests container from upstream sanitary conveyor.',
        '2. Seals, purges or fills container under isobaric/aseptic recipe.',
        '3. Inspects quality tolerance and seal integrity in-situ.',
        '4. Transfers container to downstream accumulation buffer.',
      ],
      liveDiagnostics: 'Operating under steady-state parameters.',
      actionableAdvice: 'Maintain nominal infeed velocity and sanitation schedule.',
    },
    telemetrySpec: {
      nominalTemp: 18,
      nominalPower: 35,
      nominalVib: 0.8,
      cycleTimeSec: 0.1,
    },
  };

  const isWarning = machine?.status === 'critical_warning' && !appliedPlan;
  const isConstrained = machine?.status === 'constrained' && !appliedPlan;

  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let badgeLabel = 'NOMINAL';
  if (isWarning) {
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    badgeLabel = 'VALVE LEAK / FOAMING ALERT';
  } else if (isConstrained) {
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    badgeLabel = 'LINE CONSTRAINED';
  } else if (appliedPlan) {
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    badgeLabel = 'AI OPTIMIZED';
  }

  const handleClose = () => {
    setSelectedMachineId(null);
    setFocusedTarget(null);
  };

  const handleAskAssistant = () => {
    addMessage({
      sender: 'user',
      text: `Provide engineering briefing and operational diagnosis for ${machine?.id} (${knowledge.name}).`,
    });
    setTimeout(() => {
      addMessage({
        sender: 'agent',
        text: `**Machine ${machine?.id} (${knowledge.name}) Technical Briefing:**\n\n- **Classification**: ${knowledge.category} on ${knowledge.line}\n- **Subsystems Architecture**: ${knowledge.subsystems.map((s) => s.name).join(', ')}.\n- **Process Dynamics**: ${knowledge.operation.description}\n- **Live Diagnosis**: ${knowledge.operation.liveDiagnostics}`,
        actions: ['Compare scenarios', 'Optimize Line 3', 'Show SOP Document'],
      });
    }, 450);
  };

  // Compact Minimized Banner Mode (Freeing 100% of the 3D factory floor)
  if (isMinimized) {
    return (
      <div
        className={`absolute top-14 ${
          dockPosition === 'right' ? 'right-4' : 'left-4'
        } z-30 flex items-center space-x-2.5 rounded-full border border-cyan-500/50 bg-slate-950/90 px-3.5 py-1.5 shadow-2xl backdrop-blur-md transition-all animate-in fade-in font-sans`}
      >
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300 border border-cyan-500/40">
          {machine?.id}
        </span>
        <span className="font-sans text-xs font-semibold text-slate-100 max-w-[150px] truncate">
          {knowledge.name}
        </span>
        <span className={`rounded border px-2 py-0.5 font-sans text-[10px] font-bold ${badgeColor}`}>
          {badgeLabel}
        </span>

        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-1 rounded bg-cyan-500/20 px-2.5 py-0.5 font-sans text-xs font-medium text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          title="Expand Details"
        >
          <span>Expand</span>
          <span>⤢</span>
        </button>

        <button
          onClick={handleClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`absolute top-12 bottom-14 ${
        dockPosition === 'right' ? 'right-4' : 'left-4'
      } z-30 flex w-80 md:w-96 flex-col overflow-hidden rounded-xl border border-cyan-500/40 ${
        isGhost ? 'bg-slate-950/60 backdrop-blur-sm' : 'bg-slate-950/90 backdrop-blur-xl'
      } p-3 shadow-2xl transition-all duration-300 font-sans`}
    >
      {/* 1. Header with Machine ID, Name, Status, Docking & Controls */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-2 shrink-0">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-cyan-950 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300 border border-cyan-500/50">
              {machine?.id}
            </span>
            <span className={`rounded border px-2 py-0.5 font-sans text-[10px] font-bold ${badgeColor}`}>
              {badgeLabel}
            </span>
          </div>
          <h2 className="mt-1 text-xs sm:text-sm font-bold text-white tracking-wide truncate" title={knowledge.name}>
            {knowledge.name}
          </h2>
          <p className="font-sans text-[11px] text-slate-300 truncate">
            {knowledge.line}
          </p>
        </div>

        {/* Toolbar: Dock Left/Right, Ghost Glass, Minimize, Close */}
        <div className="flex items-center space-x-1 text-slate-400 shrink-0">
          <button
            onClick={() => setDockPosition(dockPosition === 'left' ? 'right' : 'left')}
            className="rounded px-1.5 py-0.5 text-xs font-sans hover:bg-slate-800 hover:text-cyan-300 transition-colors"
            title={dockPosition === 'left' ? 'Dock to Right' : 'Dock to Left'}
          >
            {dockPosition === 'left' ? '⇥ Right' : '⇤ Left'}
          </button>
          <button
            onClick={() => setIsGhost(!isGhost)}
            className={`rounded px-1.5 py-0.5 text-xs font-sans hover:bg-slate-800 transition-colors ${
              isGhost ? 'text-cyan-300 bg-cyan-950/50' : 'text-slate-400'
            }`}
            title="Toggle Ghost Transparency"
          >
            {isGhost ? '👁 Clear' : '👁 Glass'}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Minimize to top pill"
          >
            <span className="text-sm font-bold">−</span>
          </button>
          <button
            onClick={handleClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Close / Reset Overview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="my-2 flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-xs font-sans shrink-0">
        <button
          onClick={() => setActiveTab('subsystems')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-md py-1 transition-colors text-xs font-medium ${
            activeTab === 'subsystems'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Subsystems</span>
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-md py-1 transition-colors text-xs font-medium ${
            activeTab === 'process'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Dynamics</span>
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 flex items-center justify-center space-x-1.5 rounded-md py-1 transition-colors text-xs font-medium ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Telemetry</span>
        </button>
      </div>

      {/* 3. Scrollable Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 text-xs space-y-2 scrollbar-thin">
        {/* TAB 1: SUBSYSTEMS (Hardware Architecture & Tooling) */}
        {activeTab === 'subsystems' && (
          <div className="space-y-2 font-sans">
            <div className="rounded border border-cyan-500/30 bg-cyan-950/30 p-2.5 text-xs text-cyan-300">
              <span className="font-bold">HARDWARE ARCHITECTURE:</span> Integrated electro-mechanical subsystems, tooling, and sensor instrumentation:
            </div>
            {knowledge.subsystems.map((sub, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3 hover:border-cyan-500/40 transition-colors space-y-1"
              >
                <div className="flex items-center space-x-2 text-white font-semibold text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="font-semibold text-cyan-200">{sub.name}</span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-cyan-400/80 bg-slate-950/80 rounded px-1.5 py-0.5 inline-block">
                  {sub.spec}
                </div>
                <div className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
                  {sub.role}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PROCESS DYNAMICS (Active Operations & Kinematic Flow) */}
        {activeTab === 'process' && (
          <div className="space-y-3 font-sans">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-1">
              <span className="font-sans text-xs uppercase tracking-wider text-cyan-400 font-bold">
                Active Process Specification
              </span>
              <h3 className="mt-1 text-sm font-bold text-white">{knowledge.operation.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {knowledge.operation.description}
              </p>
              <div className="mt-2 rounded border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-sans text-xs text-slate-300 flex items-center justify-between">
                <span className="text-slate-400">Target Workpiece:</span>
                <span className="text-cyan-300 font-medium">{knowledge.operation.workpiece}</span>
              </div>
            </div>

            {/* Step-by-Step Flow */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <span className="font-sans text-xs uppercase tracking-wider text-slate-300 font-bold">
                Beverage Process Flow Sequence
              </span>
              <div className="mt-2 space-y-2">
                {knowledge.operation.stageFlow.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <span className="mt-0.5 text-cyan-400 text-xs">▶</span>
                    <span className="leading-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Diagnosis */}
            <div
              className={`rounded-lg border p-3 text-xs leading-relaxed font-sans ${
                isWarning
                  ? 'border-rose-500/50 bg-rose-950/30 text-rose-100'
                  : isConstrained
                  ? 'border-amber-500/50 bg-amber-950/30 text-amber-100'
                  : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
              }`}
            >
              <div className="flex items-center space-x-2 font-sans text-xs font-bold uppercase tracking-wider">
                {isWarning ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span className="text-rose-400">Live Anomaly Diagnosis</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Live Operational State</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 leading-normal">{knowledge.operation.liveDiagnostics}</p>
              <div className="mt-2.5 font-sans text-xs opacity-95 border-t border-white/15 pt-2">
                <span className="font-bold text-white">Recommended Action:</span> {knowledge.operation.actionableAdvice}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & SENSORS */}
        {activeTab === 'telemetry' && (
          <div className="space-y-2.5 font-sans">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Temperature */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <div className="flex items-center justify-between text-xs font-sans font-medium text-slate-300">
                  <span>Operating Temp</span>
                  <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className={`mt-1 text-base font-bold font-mono ${isWarning ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                  {machine?.temperature_c}°C
                </div>
                <div className="text-[11px] font-sans text-slate-400">Nominal: &lt;{knowledge.telemetrySpec.nominalTemp}°C</div>
              </div>

              {/* Power */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <div className="flex items-center justify-between text-xs font-sans font-medium text-slate-300">
                  <span>Power Draw</span>
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="mt-1 text-base font-bold font-mono text-amber-300">
                  {machine?.power_kw} kW
                </div>
                <div className="text-[11px] font-sans text-slate-400">Baseline: {knowledge.telemetrySpec.nominalPower} kW</div>
              </div>

              {/* Vibration */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <div className="flex items-center justify-between text-xs font-sans font-medium text-slate-300">
                  <span>Vibration</span>
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className={`mt-1 text-base font-bold font-mono ${machine && machine.vibration_mms > 2.5 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {machine?.vibration_mms} mm/s
                </div>
                <div className="text-[11px] font-sans text-slate-400">Limit: 2.5 mm/s RMS</div>
              </div>

              {/* Utilization */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <div className="flex items-center justify-between text-xs font-sans font-medium text-slate-300">
                  <span>Utilization</span>
                  <Layers className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="mt-1 text-base font-bold font-mono text-emerald-300">
                  {machine ? Math.round(machine.utilization * 100) : 0}%
                </div>
                <div className="text-[11px] font-sans text-slate-400">Rate: {machine?.capacity_units_hr} u/h</div>
              </div>
            </div>

            {/* Health Score Progress */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="text-slate-300 font-medium">Machine Health Index</span>
                <span className={`font-mono font-bold text-sm ${machine && machine.health_score < 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {machine?.health_score}/100
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    machine && machine.health_score < 70 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${machine?.health_score || 0}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Footer */}
      <div className="mt-2 flex items-center space-x-2 border-t border-slate-800/80 pt-2 font-sans shrink-0">
        <button
          onClick={handleAskAssistant}
          className="flex-1 flex items-center justify-center space-x-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/50 py-1.5 text-xs font-sans font-semibold text-cyan-300 hover:bg-cyan-900/60 hover:text-white transition-colors shadow"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Ask Assistant</span>
        </button>
        <button
          onClick={handleClose}
          className="flex items-center justify-center space-x-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-sans font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Return camera to wide factory view"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Overview</span>
        </button>
      </div>
    </div>
  );
};
