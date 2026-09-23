# FlowTwin AI (BevTwin) — AI-Native Beverage Operations Twin

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js%20%2F%20R3F-0.168-049ef4?style=for-the-badge&logo=three.js&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Gemini](https://img.shields.io/badge/Gemini%203.8%20Flash-ADK%20Orchestrator-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud%20Run-Serverless-2496ED?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Domain](https://img.shields.io/badge/Domain-High--Speed%20Beverage%20Canning%20%26%20Bottling-00f076?style=for-the-badge)](https://aibuildercup.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

**An AI-native 3D Digital Twin for High-Speed Beverage Bottling, Canning & Packaging plants. Autonomous Google ADK agents monitor real-time isobaric filling pressures, carbonation levels, and pasteurization thermal loops — pinpointing causal bottlenecks, simulating what-if scenarios, and executing dynamic load-balancing recovery plans.**

</div>

---

## 🏭 Industrial Beverage Plant Topology

FlowTwin AI models an end-to-end multi-line industrial beverage canning and bottling facility (`BEVTWIN-AUSTIN-01`) producing Carbonated Soft Drinks (CSD), Sparkling Seltzers, Aseptic Juices, and Cold Brew Kombuchas at up to 350,000 cans/bottles per day:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       BEVTWIN INDUSTRIAL OPERATIONS FLOOR (3D R3F)                                     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                        │
│  LINE 1: CSD & SPARKLING SELTZERS (CANNING)                                                                            │
│  [M01: Syrup Blender] ──► [M02: Isobaric CO2 Carbonator] ──► [M03: Ionized Air Can Rinser] ────┐                        │
│                                                                                                 │                      │
│  LINE 2: ASEPTIC JUICES & WELLNESS (BOTTLING)                                                   │                      │
│  [M04: Micro-Homogenizer] ──► [M05: UHT Flash Pasteurizer] ──► [M06: Aseptic PET Sterilizer] ──┼──► [QC INSPECTION]   │
│                                                                                                 │   QC01: Gamma Fill   │
│  LINE 3: COLD BREW & KOMBUCHA (CANNING) — [HERO BOTTLENECK]                                     │   QC02: Acoustic Seam│
│  [M07: 64-Head Rotary Isobaric Filler] ──► [M08: Rotary Can Seamer & N2 Dosing] ───────────────┘           │          │
│   ▲ (Valve #7 Dynamic Seal Micro-Leak | 14.8°C Spindle Overheat | Violent Foaming Eruption)                 ▼          │
│                                                                                                 [PACK01: Packaging]    │
│  DISPATCH & LOGISTICS                                                                           Sleeve Labeler, Tray-  │
│  [SHIP01: Cold-Chain Logistics Bay] ◄────────────────────────────────────────────────────────── Packer & Palletizer   │
│                                                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💡 Core Philosophy

```
┌─────────────────────────┐       ┌───────────────────────────────┐       ┌──────────────────────────────┐
│        AI THINKS        │  ──►  │        CODE CALCULATES        │  ──►  │     FRONTEND VISUALIZES      │
│ Gemini 3.8 Flash + ADK  │       │  Deterministic Physics Engine │       │  Three.js / R3F Beverage     │
│ Reasons over telemetry  │       │  Mass balance, delta kinetics │       │  3D Twin, Causal Ribbon,     │
│ & HACCP/ISO standards   │       │  & thermodynamic simulation   │       │  Particles & Decision Tiles  │
└─────────────────────────┘       └───────────────────────────────┘       └──────────────────────────────┘
```

Beverage manufacturing operations operate at blinding line velocities (1,200+ cans/minute). Unplanned downtime, dissolved CO2 boil-off, or thermal pasteurization drift cost thousands of dollars per minute in spoiled batch product and retailer SLA penalties.

**FlowTwin AI** guarantees **Zero Generative Hallucinations**:
- **AI (Gemini 3.8 Flash & Google ADK)** interprets operator queries, diagnoses equipment root causes against beverage SOPs, and orchestrates remediation strategies.
- **Code (Deterministic Simulation Engine)** calculates fluid dynamics, buffer starvation, quality rejection percentages, and peak electrical loads with absolute mathematical precision.
- **Frontend (Three.js & React Three Fiber)** renders real-time 330ml beverage cans and PET bottles gliding on dynamic conveyors, overhead status orbs, glowing causal propagation ribbons, and particle entropy fields.

---

## 🌟 Key Engineering Innovations

### 1. Interactive 3D Beverage Factory Twin
- **Dynamic Packaging Conveyors:** Renders high-speed moving 330ml aluminum cans and PET bottles with authentic metallic lacquer finishes and backpressure accumulation.
- **Specialized Beverage Machinery Meshes:**
  - **M01**: Continuous Syrup & Flavor Micro-Blender (agitation impellers, ratio dosing manifold).
  - **M02**: Chilled Isobaric CO2 Carbonator (saturation injection chamber, refrigeration jacket).
  - **M03**: Rotary Ionized-Air Can Rinser (gravity twist cage, ionized de-dusting nozzles).
  - **M04**: Vacuum Deaerator & High-Pressure Homogenizer (shear cavitation block, degas dome).
  - **M05**: Tubular UHT Flash Pasteurizer & Heat Exchanger (sanitary stainless tubes, steam injection).
  - **M06**: Aseptic Electron-Beam Bottle Sterilization Tunnel (H2O2 vapor misting, UV/E-beam).
  - **M07**: 64-Head Rotary Isobaric Counter-Pressure Filler (revolving central carousel, valve #7 anomaly indicators).
  - **M08**: Rotary Can Seamer & Liquid Nitrogen Dosing Unit (dual-roller seam chucks, cryogenic doser).
  - **QC01 & QC02**: High-Speed Machine Vision, Gamma-Ray Fill-Level Scanner & Ultrasonic Can Seam Flaw Detector.
  - **PACK01**: Automated Shrink Sleeve Steam Tunnel, Corrugated Tray Packer & 6-Axis Palletizer.
- **Intelligent Camera Rig:** Smoothly glides across 3D coordinates to focus on bottleneck machinery (`M07`) with custom zoom and pitch.

### 2. Sensory AI Visuals (No Generic 2D Charts)
- **Causal Propagation Ribbon:** 3D glowing spline tracing real-time constraint cascades:
  $$\text{M07 (Isobaric Leak)} \longrightarrow \text{Line 3 Conveyor (Choked to 68\%)} \longrightarrow \text{QC01 (6.4\% Underfill Rejects)} \longrightarrow \text{SHIP01 (Walmart SLA Risk)}$$
- **State Intelligence Field:** Dynamic particle network reflecting system operational entropy, foaming risk, and pacing stability.
- **Scenario Waveforms:** Fluid animated waveforms contrasting baseline throughput against simulated failure states.

### 3. Google ADK Multi-Agent Architecture
FlowTwin AI implements a 4-agent hierarchical multi-agent cluster built with the **Google Agent Development Kit (ADK)**:

| Agent | Model | Specialized Role in Beverage Operations |
| :--- | :--- | :--- |
| **FlowTwin Orchestrator** | `Gemini 3.8 Flash` | Query classification, sub-agent routing, and compact event compilation. |
| **Observer Agent** | `Gemini 3.5 Flash-Lite` | Reads compact telemetry deltas (filling valve temps, carbonation volumes, buffer tank levels). |
| **Causal Analyst Agent** | `Gemini 3.8 Flash` | Traverses machine dependency graphs; diagnoses root causes (e.g., valve #7 seal micro-leakage causing dissolved CO2 flashing). |
| **Simulator Agent** | `Gemini 3.8 Flash` | Executes deterministic physics tools: downtime impact, quality reject rates, buffer starvation. |
| **Optimizer Agent** | `Gemini 3.8 Flash` | Multi-objective Pareto solver balancing throughput, energy peak shaving, and HACCP compliance. |

---

## ⚡ Grounded Enterprise Knowledge Base

The agents ground their reasoning in industrial beverage operating procedures located in [`knowledge/factory-docs/`](file:///c:/Users/SURAJ/Desktop/GENAIJPAC/knowledge/factory-docs/):
- **`SOP_M07_Isobaric_Filler.md`**: 64-head rotary counter-pressure filler operations, dynamic bellow seal micro-leakage protocols, isobaric chamber thresholds (2.80 bar nominal, 2.45 bar alarm), and CIP cycle bypass.
- **`HACCP_Beverage_Sanitation_Standard.md`**: Hazard Analysis and Critical Control Points (CCP-1 pasteurization kill step $\ge 72^\circ\text{C}$ for 15s; CCP-2 fill-level gamma inspection).
- **`Energy_Management_Standard.md`**: ISO 50001 compliance, peak-tariff load shifting for energy-intensive UHT pasteurization and chillers without throughput reduction.

---

## 📡 Custom Server-Sent Events (SSE) Protocol

The Agent Runtime microservice streams structured JSON events directly to the Next.js frontend:

```json
data: {"event": "TOOL", "agent": "ObserverAgent", "step": "state", "message": "Observer reading compact beverage telemetry"}
data: {"event": "STATE", "agent": "ObserverAgent", "data": {"summary": "Line 3 constrained by M07 isobaric foaming; QC01 underfills +34 units.", "oee": 0.82, "target": 10000, "current": 8200}}
data: {"event": "FOCUS", "target": "M07", "zoom": 1.45}
data: {"event": "IMPACT", "source": "M07", "targets": ["M07", "L3", "QC01", "SHIP01"], "severity": "critical"}
data: {"event": "SCENARIO", "data": {"production_delta_units": -541, "shipment_delay_hours": 3.2, "financial_risk_usd": 4800}}
data: {"event": "RECOMMENDATION", "agent": "OptimizerAgent", "response_text": "M07 Valve #7 seal leak throttles Line 3. Rerouting 20% beverage flow to Line 2 (M05 Tubular Pasteurizer holding tanks) restores throughput to 9,600 units.", "decision": {"title": "Dynamic Batch Rerouting Plan", "actions": ["Reroute 20% beverage flow → Line 2", "Activate secondary buffer tank B02"]}, "actions": ["Apply Plan", "Compare scenarios"]}
data: {"event": "DONE", "status": "completed"}
```

---

## 📂 Repository Structure

```
FlowTwin-AI/
├── apps/
│   └── web/                         # Next.js 14 Beverage Twin Web Application
│       ├── app/                     # App Router (Live Twin, Scenarios, Sustainability)
│       │   ├── api/agent/stream/    # SSE streaming endpoint for AI Copilot
│       │   ├── globals.css          # Cyber-industrial dark theme styling
│       │   ├── layout.tsx           # Application layout shell
│       │   └── page.tsx             # Main Twin Operations Cockpit
│       ├── components/              # 3D Visual System & UI
│       │   ├── 3d/                  # 3D Beverage Cans, Bottles, Carousel Fillers, Conveyors
│       │   ├── agent-ui/            # Copilot panel, step dots, decision cards
│       │   ├── networks/            # Causal force graph & intelligence studios
│       │   ├── particles/           # State field, causal ribbon, objective rings
│       │   └── scenarios/           # What-if delta matrices & differential vector gauges
│       └── lib/                     # Zustand twinStore, beverage equipment catalog, types
├── agents/                          # Google ADK Multi-Agent System
│   ├── adk_factory_agent.py         # Official Google ADK Agent declarations
│   ├── agent_runner.py              # Agent CLI & microservice runner
│   ├── agent_search.py              # Grounded RAG search over factory SOPs
│   ├── evaluate_agents.py           # Verification & test suite (100% pass)
│   ├── causal/                      # Causal graph traversal logic
│   ├── observer/                    # Telemetry delta scanner
│   ├── optimizer/                   # Multi-objective Pareto solver
│   └── simulator/                   # Deterministic simulation bridge
├── simulation/                      # Deterministic Python Simulation Engine
│   ├── factory.py                   # Factory topology & state manager
│   ├── production.py                # Machine failure & demand simulation
│   ├── quality.py                   # Quality drift & defect modeling
│   ├── inventory.py                 # Syrup/can inventory buffer modeling
│   └── energy.py                    # Energy peak shaving & scenario comparison
├── cloud/                           # Cloud Run & Deployment
│   ├── agent-runtime/               # Agent Runtime microservice (FastAPI + SSE)
│   ├── cloud-run/                   # Dockerfile & Cloud Run deployment scripts
│   ├── firestore_sync.py            # Real-time telemetry sync with Google Firestore
│   └── storage_manager.py           # Google Cloud Storage batch report export
├── data/                            # Machine specs, line topology, baseline orders
├── knowledge/                       # Beverage SOPs, HACCP standards, ISO 50001
├── Dockerfile                       # Production multi-stage container
└── requirements.txt                 # Python dependencies
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: `v18.17.0+`
- **Python**: `3.10+` (3.11 recommended)
- **Package Managers**: `npm` and `pip`

---

### 1. Web Application & 3D Twin

```bash
# Navigate to web application directory
cd apps/web

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Python Simulation Engine & Agent Runtime

```bash
# Install Python dependencies from repository root
pip install -r requirements.txt

# Run deterministic simulation test
python -c "from simulation.production import simulate_machine_failure; print(simulate_machine_failure('M07', 4.0))"

# Start the Agent Runtime microservice
python cloud/agent-runtime/app.py
```

Microservice will start at `http://localhost:8001` with streaming SSE enabled on `/api/agent/stream`.

---

### 3. Agent Evaluation & Automated Testing

Run the automated agent verification suite to validate routing, deterministic tools, and SOP grounding:

```bash
python agents/evaluate_agents.py
```

Expected output:
```
============================================================
FlowTwin AI - Google Agents CLI Evaluation Suite
Platform: Google Gemini Enterprise Agent Platform / ADK
============================================================

[TC01] Testing Root Cause & Grounded RAG Retrieval...
  [PASS] Grounded RAG retrieval accurate from SOP_M07_Milling.md

[TC02] Testing Deterministic Simulation Tool (M07 failure 4h)...
  [PASS] Tool simulate_machine_failure returned exact delta: -541 units (Severity: critical)

[TC03] Testing Sustainability Optimization Tool (Energy Cap 15,900 kWh)...
  [PASS] Tool simulate_energy_constraint achieved: -2500.0 kWh with 0 production loss

============================================================
Evaluation Summary: 3/3 PASSED (100%) in 0.002s
All agents and deterministic tools verified compliant with Google ADK spec.
============================================================
```

---

## 🐳 Docker & Google Cloud Run Deployment

FlowTwin AI is containerized for seamless deployment to Google Cloud Run:

```bash
# Build multi-stage production container
docker build -t flowtwin-bevtwin:latest .

# Run container locally on port 8080
docker run -p 8080:8080 flowtwin-bevtwin:latest
```

### One-Click Cloud Run Deployment

```bash
# Deploy to Google Cloud Run
gcloud run deploy flowtwin-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🧪 Beverage Scenarios Simulated

1. **M07 Isobaric Valve #7 Seal Micro-Leakage (4h Downtime):**
   - Counter-pressure chamber drops from 2.80 bar to 2.45 bar. Product temperature rises to 14.8°C causing dissolved CO2 flashing and can foaming brim overflow.
   - Deterministic engine calculates $-541$ cases lost, $+34\%$ QC01 queue backlog, and evaluates batch rerouting to Line 2 UHT buffer tanks.
2. **Promotional Demand Spike (+20% Summer Volume):**
   - Analyzes syrup blending buffer constraints and schedules overtime on Line 1 high-speed can seamer.
3. **Dynamic Energy Peak Shaving (-15% Tariff Window):**
   - Identifies non-critical chilling loops and clean-in-place (CIP) wash cycles to postpone during peak grid hours, saving $2,500\text{ kWh}$ with 0% throughput reduction.
4. **Liquid CO2 / Aluminum Can Supply Delay (3 Days):**
   - Evaluates on-site buffer inventories and triggers adaptive batch rescheduling.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
