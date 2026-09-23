'use client';

import React from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import {
  X,
  Cpu,
  Boxes,
  ShieldCheck,
  Package,
  Zap,
  Truck,
  AlertTriangle,
  Play,
  ArrowUpRight,
} from 'lucide-react';
import { DottedMatrixGauge } from '@/components/particles/DottedMatrixGauge';

export const NavInspectorModal: React.FC = () => {
  const activeNavTab = useTwinStore((s) => s.activeNavTab);
  const setActiveNavTab = useTwinStore((s) => s.setActiveNavTab);
  const machines = useTwinStore((s) => s.machines);
  const telemetry = useTwinStore((s) => s.telemetry);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const setSelectedMachineId = useTwinStore((s) => s.setSelectedMachineId);
  const setActiveCausalChain = useTwinStore((s) => s.setActiveCausalChain);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);

  if (activeNavTab === 'Overview' || activeNavTab === 'Intelligence Hub' || !activeNavTab) return null;

  const handleFocusMachine = (machineId: string) => {
    setFocusedTarget(machineId);
    setSelectedMachineId(machineId);
    setActiveNavTab('Overview'); // Return to 3D view with camera focused on chosen machine
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-twin-accent/40 bg-slate-950 p-6 shadow-[0_0_40px_rgba(0,210,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            {activeNavTab === 'Machines' && <Cpu className="h-5 w-5 text-twin-accent" />}
            {activeNavTab === 'Production' && <Boxes className="h-5 w-5 text-cyan-400" />}
            {activeNavTab === 'Quality' && <ShieldCheck className="h-5 w-5 text-twin-green" />}
            {activeNavTab === 'Inventory' && <Package className="h-5 w-5 text-amber-400" />}
            {activeNavTab === 'Energy' && <Zap className="h-5 w-5 text-twin-green" />}
            {activeNavTab === 'Supply' && <Truck className="h-5 w-5 text-cyan-300" />}
            {activeNavTab === 'Alerts' && <AlertTriangle className="h-5 w-5 text-twin-red" />}

            <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
              {activeNavTab} Telemetry & Status Inspector
            </h3>
          </div>

          <button
            onClick={() => setActiveNavTab('Overview')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content based on selected tab */}
        <div className="mt-4 max-h-[65vh] overflow-y-auto pr-1 font-sans">
          {/* 1. MACHINES TAB */}
          {activeNavTab === 'Machines' && (
            <div className="space-y-3 font-sans">
              <p className="text-xs text-slate-300 font-medium">
                Click any machine below to immediately fly the 3D twin camera onto it:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {machines.map((m) => {
                  const isProblem = m.status === 'critical_warning' && !appliedPlan;
                  const isConstrained = m.status === 'constrained' && !appliedPlan;

                  return (
                    <div
                      key={m.id}
                      onClick={() => handleFocusMachine(m.id)}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                        isProblem
                          ? 'border-twin-red/80 bg-twin-red/10 hover:bg-twin-red/20'
                          : isConstrained
                          ? 'border-amber-500/60 bg-amber-950/20 hover:bg-amber-900/30'
                          : 'border-slate-800 bg-slate-900/70 hover:border-twin-accent hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {m.id}
                          </span>
                          <span className="font-sans text-xs font-semibold text-slate-100 group-hover:text-cyan-200">
                            • {m.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
                          <span>Temp: <strong className="text-white">{m.temperature_c}°C</strong></span>
                          <span>OEE: <strong className="text-white">{Math.round(m.utilization * 100)}%</strong></span>
                          <span><strong className="text-amber-300">{m.power_kw} kW</strong></span>
                        </div>
                      </div>

                      <button className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-sans font-medium text-cyan-300 group-hover:bg-twin-accent group-hover:text-slate-950 transition-colors">
                        <span>Focus 3D</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. PRODUCTION TAB */}
          {activeNavTab === 'Production' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3.5">
                <div className="text-slate-300 font-bold uppercase text-xs tracking-wider">
                  Beverage Bottling & Canning Lines Capacity:
                </div>
                <DottedMatrixGauge
                  label="Line 1 (M01-M03) — CSD & Seltzers Canning"
                  value={92}
                  totalDots={24}
                  color="green"
                  valueDisplay="92% (550 cans/min)"
                  statusText="NOMINAL"
                />
                <DottedMatrixGauge
                  label="Line 2 (M04-M06) — Aseptic Juices & Wellness Bottling"
                  value={88}
                  totalDots={24}
                  color="cyan"
                  valueDisplay="88% (420 bottles/min)"
                  statusText="BALANCED"
                />
                <DottedMatrixGauge
                  label="Line 3 (M07-M08) — Cold Brew & Kombucha Canning"
                  value={appliedPlan ? 94 : 65}
                  totalDots={24}
                  color={appliedPlan ? 'green' : 'red'}
                  valueDisplay={appliedPlan ? '94% (Flow Restored via L2 M05)' : '65% (Foaming Bottleneck on M07)'}
                  statusText={appliedPlan ? 'OPTIMIZED' : 'THROTTLED'}
                  isCritical={!appliedPlan}
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="text-slate-300 mb-2.5 font-bold uppercase text-xs tracking-wider">
                  Active Beverage Batch Orders:
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-200">ORD-2026-901 (Cold Brew Coffee 330ml Can • L3)</span>
                    <span className={appliedPlan ? 'text-twin-green font-bold' : 'text-twin-red font-bold'}>
                      {appliedPlan ? 'SLA Restored (1h delay)' : 'SLA At Risk (6h delay)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-200">ORD-2026-902 (Sparkling Lime Seltzer 330ml • L1)</span>
                    <span className="text-twin-green font-bold">On Track (12h buffer)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-200">ORD-2026-903 (Cold-Pressed Citrus 500ml PET • L2)</span>
                    <span className="text-twin-green font-bold">On Track (18h buffer)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. QUALITY TAB */}
          {activeNavTab === 'Quality' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                  <div className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    QC01 Vision & Gamma Fill Inspector
                  </div>
                  <div className="text-base font-bold text-amber-400">
                    {appliedPlan ? 'Fill Accuracy: 99.4% (Normal)' : 'Fill Variance: High (Underfill Warning)'}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Throughput: 600 cpm • Fill-height ±0.5mm & liquid nitrogen headspace check
                  </div>
                  <button
                    onClick={() => handleFocusMachine('QC01')}
                    className="mt-3 w-full rounded-lg border border-cyan-500/30 bg-cyan-950/40 py-2 text-center text-xs font-sans font-semibold text-cyan-300 hover:bg-cyan-900/50 hover:text-white transition-colors"
                  >
                    Focus QC01 in 3D Twin
                  </button>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                  <div className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    QC02 Acoustic & CO2 Leak Detector
                  </div>
                  <div className="text-base font-bold text-twin-green">
                    {appliedPlan ? 'Status: Active (Online)' : 'Status: Standby (54% Load)'}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Capacity: 600 cpm • Acoustic can resonance & seam hermetic seal scan
                  </div>
                  <button
                    onClick={() => handleFocusMachine('QC02')}
                    className="mt-3 w-full rounded-lg border border-cyan-500/30 bg-cyan-950/40 py-2 text-center text-xs font-sans font-semibold text-cyan-300 hover:bg-cyan-900/50 hover:text-white transition-colors"
                  >
                    Focus QC02 in 3D Twin
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <DottedMatrixGauge
                  label="Beverage First Pass Yield (Fill, Carbonation & Seam Spec)"
                  value={96.8}
                  totalDots={32}
                  color="green"
                  valueDisplay="96.8% In-Spec Yield"
                  statusText="SIX SIGMA"
                />
              </div>
            </div>
          )}

          {/* 4. INVENTORY & SUPPLY TAB */}
          {(activeNavTab === 'Inventory' || activeNavTab === 'Supply') && (
            <div className="space-y-4 font-sans text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3.5">
                <div className="text-slate-300 font-bold uppercase text-xs tracking-wider">
                  Quantized Staging Buffers & Ingredient Silos:
                </div>
                <DottedMatrixGauge
                  label="Raw Material Staging (Aluminum Cans & PET Preforms)"
                  value={83}
                  totalDots={24}
                  color="green"
                  valueDisplay="2.5 Days Run Buffer (83%)"
                  statusText="OPTIMAL"
                />
                <DottedMatrixGauge
                  label="Syrup, Juices & Concentrate Silos (M01/M04 Feed)"
                  value={68}
                  totalDots={24}
                  color="cyan"
                  valueDisplay="3,400 Gal Staged (68%)"
                  statusText="STEADY"
                />
                <DottedMatrixGauge
                  label="Line 3 Buffer (Cold-Brew Kegs Upstream M07 Filler)"
                  value={appliedPlan ? 55 : 92}
                  totalDots={24}
                  color={appliedPlan ? 'green' : 'amber'}
                  valueDisplay={appliedPlan ? '55% (Flowing Normal)' : '92% (Infeed Congestion Warning)'}
                  statusText={appliedPlan ? 'BALANCED' : 'CONGESTED'}
                  isCritical={!appliedPlan}
                />
                <DottedMatrixGauge
                  label="Cryogenic Bulk CO2 Tank Buffer"
                  value={88}
                  totalDots={24}
                  color="green"
                  valueDisplay="18.5 Metric Tons (88% Level)"
                  statusText="NOMINAL"
                />
                <DottedMatrixGauge
                  label="Finished Goods Packaging Buffer (PACK01 Trays)"
                  value={72}
                  totalDots={24}
                  color="green"
                  valueDisplay="1,200 Cartons Staged (72%)"
                  statusText="READY"
                />
              </div>
            </div>
          )}

          {/* 5. ENERGY TAB */}
          {activeNavTab === 'Energy' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-slate-300 text-xs uppercase font-bold tracking-wider">Total Factory Draw</div>
                  <div className="mt-1 text-xl font-bold font-mono text-amber-400">
                    {appliedPlan ? '412.0 kW' : `${telemetry.current_power_consumption_kw} kW`}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Quota: 550 kW ceiling</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-slate-300 text-xs uppercase font-bold tracking-wider">Daily Consumption</div>
                  <div className="mt-1 text-xl font-bold font-mono text-cyan-300">
                    {appliedPlan ? '15,900 kWh' : '17,890 kWh'}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-twin-green">
                    {appliedPlan ? 'Saved: 2,500 kWh (-13.6%)' : 'Nominal budget: 18,400 kWh'}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                <DottedMatrixGauge
                  label="Peak Grid Demand Load (kW)"
                  value={appliedPlan ? 74 : 83}
                  totalDots={28}
                  rows={2}
                  color={appliedPlan ? 'green' : 'amber'}
                  valueDisplay={appliedPlan ? '412.0 kW (Off-Peak Level)' : '456.2 kW (Near Peak)'}
                  statusText={appliedPlan ? 'OPTIMIZED' : 'HIGH DRAW'}
                />
              </div>
            </div>
          )}

          {/* 6. ALERTS TAB */}
          {activeNavTab === 'Alerts' && (
            <div className="space-y-3.5 font-sans text-xs">
              <div className="rounded-xl border border-twin-red/80 bg-twin-red/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">ALT-M07-FOAM: Counter-Pressure Loss & Excessive Foaming</span>
                  <span className="rounded bg-twin-red px-2 py-0.5 text-xs font-bold text-white">CRITICAL</span>
                </div>
                <div className="text-slate-200 text-xs leading-relaxed">
                  M07 Rotary Isobaric Filler valve head #7 dynamic seal micro-leakage causing 0.35 bar CO2 pressure loss and 18% fill volume displacement.
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => {
                      handleFocusMachine('M07');
                      setActiveCausalChain(['M07', 'L3', 'QC01', 'SHIP01'], 'critical');
                    }}
                    className="flex-1 rounded-lg bg-twin-red py-2 text-center text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg"
                  >
                    [Investigate & Focus M07 in 3D]
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/80 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200 text-sm">ALT-QC01-REJ: High Fill-Level Variance</span>
                  <span className="rounded bg-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-200 border border-amber-500/40">WARNING</span>
                </div>
                <div className="text-slate-200 text-xs leading-relaxed">
                  Vision and gamma fill inspector rejecting 4.2% of Line 3 cans due to short fills caused by upstream M07 foam collapse.
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleFocusMachine('QC01')}
                    className="w-full rounded-lg border border-amber-500/40 bg-amber-950/50 py-2 text-center text-amber-300 font-semibold text-xs hover:bg-amber-900/60 hover:text-white transition-colors"
                  >
                    Focus QC01 in 3D
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
