# FlowTwin AI — Product Requirements Document (PRD)

## 1. Product Overview
**FlowTwin AI** is an AI-native Industrial Operations Twin designed for the Manufacturing theme (*Intelligent Operations & Industrial Efficiency*). It replaces static traditional dashboards with an interactive 3D factory twin paired with a real-time particle/dotted intelligence field where AI continuously observes factory state, investigates anomalies, simulates what-if scenarios, and recommends actionable operational decisions.

### Core Philosophy
> **"AI thinks. Code calculates. Frontend visualizes."**

- **AI (Gemini 3.8 Flash / 3.5 Flash-Lite & Google ADK):** Understands requests, reasons over telemetry, diagnoses root cause, orchestrates simulations, recommends actions.
- **Code (Deterministic Simulation Engine):** Executes exact mathematical calculations for production delta, quality changes, queue bottlenecks, inventory stockout, energy loads.
- **Frontend (Three.js & React Three Fiber):** Renders the 3D twin, animated material & energy flows, dynamic particle intelligence fields, causal ribbons, and high-impact decision tiles.

---

## 2. Core User Flows
1. **Live Twin Observation:**
   - Real-time 3D factory view with machines M01–M08, conveyors, QC inspection stations, packaging, and shipping bay.
   - Overhead status orbs: 🟢 Normal, 🟡 Constraint / Warning, 🔴 Critical Bottleneck / Downtime.
   - Dynamic particle field reflecting system entropy and throughput pace.
2. **Causal Anomaly Investigation:**
   - Proactive alert: *"Line 3 constraint detected."*
   - User asks: *"Why is Line 3 slow?"*
   - Causal Ribbon animates: `M07 ──► Line 3 ──► QC ──► Shipping`.
   - Copilot answers with concise root cause without overwhelming walls of text.
3. **What-If Scenario Simulation Lab:**
   - Pre-configured & custom scenario triggers:
     - Increase Demand +20%
     - Machine M07 Down 4h
     - Energy Cap -15%
     - Raw Material Delay
     - Quality Drift
   - Simulation pipeline: `BASELINE ──► SCENARIO ──► SIMULATION ──► IMPACT FIELD ──► AI ANALYSIS`.
   - Side-by-side delta metrics (Output, Quality %, Energy kWh, Shipment Delay hrs).
4. **Actionable AI Decision & Plan Execution:**
   - AI generates concrete actionable recommendation tiles:
     - `[Show affected area]` (Camera pans directly to bottleneck equipment)
     - `[Compare scenarios]` (Visual delta matrix)
     - `[Optimize]` (Runs multi-objective constraint solver)
     - `[Apply Plan]` (Visually transitions 3D twin from degraded to optimized state)
5. **Dynamic Sustainability Objective Field:**
   - Balances multi-objective trade-offs: `maximize(production) while minimizing(energy, quality_loss, delay)`.
   - Fluid particle rings illustrating optimal operating points.

---

## 3. Technology Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Zustand, Lucide Icons.
- **3D Engine:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **AI Stack:** Google ADK (Python), Gemini 3.8 Flash (Orchestration & Reasoning), Gemini 3.5 Flash-Lite (Routing & Classification).
- **Backend / Deployment:** Google Cloud Run (Next.js & API), Google Agent Runtime (ADK).
- **State & Data:** Firestore (Factory, Machines, Telemetry, Scenarios), Cloud Storage (Seed data, SOPs, Specs).
