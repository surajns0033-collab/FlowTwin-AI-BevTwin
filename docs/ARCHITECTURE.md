# FlowTwin AI — System Architecture

## 1. High-Level Architecture Diagram

```
                              USER / OPERATOR
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │          GOOGLE CLOUD RUN           │
                  │  ┌───────────────────────────────┐  │
                  │  │  Next.js 14 Frontend          │  │
                  │  │   • 3D Twin (Three.js / R3F)  │  │
                  │  │   • Particle Intelligence     │  │
                  │  │   • AI Copilot & Scenario Lab │  │
                  │  │   • Zustand Live Store        │  │
                  │  └───────────────┬───────────────┘  │
                  │                  │ API / SSE Stream │
                  │  ┌───────────────▼───────────────┐  │
                  │  │  API & Streaming Layer        │  │
                  │  └───────────────┬───────────────┘  │
                  └──────────────────┼──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │        GOOGLE AGENT RUNTIME         │
                  │  ┌───────────────────────────────┐  │
                  │  │     Google ADK Framework      │  │
                  │  │   • Orchestrator Agent        │  │
                  │  │   • Observer Agent            │  │
                  │  │   • Causal Analyst Agent      │  │
                  │  │   • Simulator Agent           │  │
                  │  │   • Optimizer Agent           │  │
                  │  └───────┬───────────────┬───────┘  │
                  └──────────┼───────────────┼──────────┘
                             │               │
                             ▼               ▼
                   ┌──────────────────┐ ┌────────────────┐
                   │  Gemini 3.8 /    │ │  Deterministic │
                   │  3.5 Flash-Lite  │ │  Sim Engine    │
                   └──────────────────┘ └────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ Google Firestore │
                   │ & Cloud Storage  │
                   └──────────────────┘
```

---

## 2. Component Breakdown

### A. Frontend Visual System
- **StateField:** Particle system reflecting factory entropy, operational frequency, and stability.
- **CausalRibbon:** Glowing 3D curve tracing the propagation path of constraints (e.g. M07 → Line 3 → QC01 → PACK01).
- **ImpactPulse:** Shockwave animation triggering at affected nodes.
- **FocusBeam:** Directed cone of light positioning overhead the focused machine.
- **ScenarioWave:** Dynamic particle wave representing scenario deviations.
- **DecisionTile:** Actionable recommendation card with interactive `[Apply Plan]` trigger.

### B. Custom Event Protocol
The agent communicates via Server-Sent Events (SSE) with compact JSON payloads:
1. `STATE`: Entity state delta (e.g. `{"machine": "M07", "status": "degraded"}`).
2. `FOCUS`: Target 3D camera node (e.g. `{"target": "M07", "zoom": 1.2}`).
3. `TOOL`: Active tool progress (e.g. `{"tool": "simulate_failure", "status": "running"}`).
4. `IMPACT`: Downstream propagation graph (e.g. `{"source": "M07", "targets": ["L3", "QC01", "PACK01"], "severity": "high"}`).
5. `SCENARIO`: Delta evaluation matrix (e.g. `{"output_delta": -1800, "energy_delta": -500, "delay_hrs": 6}`).
6. `RECOMMENDATION`: Action proposal with simulation tags.
7. `DONE`: Stream finished.

### C. Deterministic Simulation Engine
Separated from LLM logic to guarantee mathematical accuracy:
- `simulate_machine_failure(machine_id, hours)`
- `simulate_demand_change(delta_pct)`
- `simulate_supply_delay(material_id, days)`
- `simulate_quality_change(line_id, drift_pct)`
- `simulate_energy_constraint(max_kwh)`
- `simulate_shift(shift_params)`
- `compare_scenarios(baseline, scenario_a, scenario_b)`
