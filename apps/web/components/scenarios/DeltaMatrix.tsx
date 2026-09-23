'use client';

import React from 'react';
import { ScenarioComparison } from '@/lib/types';
import { DifferentialVectorGauge } from './DifferentialVectorGauge';

export const DeltaMatrix: React.FC<{ comparison: ScenarioComparison }> = ({ comparison }) => {
  const { baseline, degraded, optimized } = comparison;

  const outputDelta = -Math.round(((baseline.output_units - degraded.output_units) / baseline.output_units) * 100);
  const qualityDelta = -(baseline.quality_yield_pct - degraded.quality_yield_pct).toFixed(1);
  const energyDelta = -Math.round(((baseline.energy_kwh - degraded.energy_kwh) / baseline.energy_kwh) * 100);
  const delayHours = degraded.shipment_delay_hours ?? 6;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
      {/* 1. Output Radial Vector Gauge */}
      <DifferentialVectorGauge
        label="Output Throughput"
        nominalValue={`${baseline.output_units.toLocaleString()} u`}
        degradedValue={`${degraded.output_units.toLocaleString()} u`}
        optimizedValue={`${optimized.output_units.toLocaleString()} u`}
        deltaPct={`${outputDelta}%`}
        direction="down"
        severity={outputDelta <= -15 ? 'critical' : 'warning'}
      />

      {/* 2. Quality Radial Vector Gauge */}
      <DifferentialVectorGauge
        label="Quality First-Pass"
        nominalValue={`${baseline.quality_yield_pct}%`}
        degradedValue={`${degraded.quality_yield_pct}%`}
        optimizedValue={`${optimized.quality_yield_pct}%`}
        deltaPct={`${qualityDelta}%`}
        direction="down"
        severity={Number(qualityDelta) <= -3 ? 'critical' : 'warning'}
      />

      {/* 3. Energy Radial Vector Gauge */}
      <DifferentialVectorGauge
        label="Energy Consumption"
        nominalValue={`${baseline.energy_kwh.toLocaleString()} kWh`}
        degradedValue={`${degraded.energy_kwh.toLocaleString()} kWh`}
        optimizedValue={`${optimized.energy_kwh.toLocaleString()} kWh`}
        deltaPct={`${energyDelta}%`}
        direction={energyDelta < 0 ? 'down' : 'up'}
        severity="nominal"
      />

      {/* 4. Shipment SLA Delay Vector Gauge */}
      <DifferentialVectorGauge
        label="Shipment SLA Delay"
        nominalValue={`${baseline.shipment_delay_hours ?? 0}h`}
        degradedValue={`${delayHours}h`}
        optimizedValue={`${optimized.shipment_delay_hours ?? 1}h`}
        deltaPct={`+${delayHours}h`}
        direction="up"
        severity={delayHours >= 4 ? 'critical' : 'warning'}
      />
    </div>
  );
};
