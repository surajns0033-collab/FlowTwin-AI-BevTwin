# FlowTwin AI — Demo Guide & Evaluation Script

## 1. Demo User Journey 1: Anomaly Observation & Causal Trace
- **Step 1:** Open FlowTwin AI. Notice the 3D factory in idle motion with flowing particle field.
- **Step 2:** Factory alert highlights Line 3 in yellow/amber status.
- **Step 3:** Click or ask: *"Why is Line 3 slow?"*
- **Step 4:** Watch the Copilot step indicators:
  - ● Reading current state
  - ● Checking dependencies
  - ● Evaluating impact
- **Step 5:** 3D Camera automatically glides to Machine M07.
- **Step 6:** Causal Ribbon lights up: `M07 ──► Line 3 ──► QC01 ──► Shipping`.
- **Step 7:** Copilot outputs: *"M07 bearing thermal throttling at 84°C reduces Line 3 throughput by 22%."*

---

## 2. Demo User Journey 2: What-If Scenario Simulation
- **Step 1:** In the AI Copilot or What-If Scenario Lab, select *"Machine M07 Down 4h"*.
- **Step 2:** Observe the animated particle signature and simulation step dots.
- **Step 3:** Review the delta metrics:
  - **Output:** 10,000 → 8,200 units (-18%)
  - **QC Queue:** +34% pileup
  - **Shipment Delay:** +6 hours
  - **Energy:** -500 kWh
- **Step 4:** Click `[Show affected area]` → Camera targets Line 3 & QC buffer.
- **Step 5:** Click `[Optimize]` → AI evaluates re-routing options.

---

## 3. Demo User Journey 3: Sustainability & Decision Execution
- **Step 1:** Navigate to Sustainability screen or ask: *"Reduce energy without reducing output."*
- **Step 2:** Dynamic objective field simulates load shifting:
  - Baseline: 10,000 units @ 18,400 kWh
  - Optimized: 10,000 units @ 15,900 kWh (-13.6% energy reduction)
- **Step 3:** AI Recommendation tile appears:
  - *Recommendation: Shift non-critical staging pre-heat to off-peak tariff window & re-balance Line 1 speed.*
- **Step 4:** Click `[Apply Plan]`.
- **Step 5:** 3D Factory twin glows green, machine status returns to normal calm state.
