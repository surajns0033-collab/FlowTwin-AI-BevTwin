# Factory Standard — Dynamic Energy Peak Management & Carbon Optimization

## Baseline Parameters
- **Nominal Daily Quota:** 18,400 kWh
- **High-Tariff Window (On-Peak):** 13:00 – 19:00 ($0.22 / kWh)
- **Off-Peak Tariff Window:** 22:00 – 06:00 ($0.075 / kWh)
- **Grid Demand Response Trigger:** Cap factory at 15,900 kWh (-13.6%) during curtailment events.

## Zero-Throughput-Loss Curtailment Strategies
1. **Auxiliary Thermal Pre-Heating:**
   - Pre-heat annealing chambers during off-peak window.
   - Saves 1,100 kWh during peak grid demand without reducing cycle counts.
2. **Conveyor Frequency Smoothing:**
   - Synchronize continuous belt velocities between Line 1 and Line 2 to eliminate repetitive motor surge draw.
   - Saves 850 kWh.
3. **Spindle Idle Power Capping:**
   - Engage dynamic VFD sleep when buffer staging exceeds 4 minutes.
   - Saves 550 kWh.
