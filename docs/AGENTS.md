# FlowTwin AI — Agent System Specification

## 1. 4 Logical Agents Architecture

```
                 ORCHESTRATOR (Gemini 3.8 Flash / 3.5 Flash-Lite)
                                       │
                ┌──────────────────────┼──────────────────────┐
                ↓                      ↓                      ↓
          OBSERVER AGENT      CAUSAL ANALYST AGENT    SIMULATOR AGENT
          (State Reader)      (Root Cause Finder)     (Simulation Runner)
                │                      │                      │
                └──────────────────────┼──────────────────────┘
                                       ↓
                                OPTIMIZER AGENT
                             (Multi-Objective Solver)
```

---

## 2. Agent Responsibilities & Models

### 1. Orchestrator Agent
- **Model:** Gemini 3.8 Flash (Heavy reasoning) / Gemini 3.5 Flash-Lite (Fast routing).
- **Function:** Parses user query, selects minimal required sub-agent chain, streams UI progress events (`● reading state ● checking dependencies ● running simulation ● evaluating impact ● preparing recommendation`), and compiles final concise response.

### 2. Observer Agent
- **Model:** Gemini 3.5 Flash-Lite.
- **Function:** Answers *"What's happening?"*. Extracts compact factory state (only changed entities, never full dump).

### 3. Causal Analyst Agent
- **Model:** Gemini 3.8 Flash.
- **Function:** Answers *"Why is it happening?"*. Traverses the machine dependency graph and pinpoints upstream root causes (e.g. bearing thermal expansion on M07 starving Line 3).

### 4. Simulator Agent
- **Model:** Python ADK execution wrapper.
- **Function:** Answers *"What happens if...?"*. Calls deterministic math functions in `simulation/` and packages deltas.

### 5. Optimizer Agent
- **Model:** Gemini 3.8 Flash + constraint optimizer.
- **Function:** Answers *"What can we change?"*. Formulates Pareto-optimal recommendations balancing:
  - Maximize: Production throughput
  - Minimize: Energy consumption, quality defects, shipment delay.

---

## 3. Token & Latency Efficiency Rules
1. **Never send entire factory state:** Send only entity deltas.
2. **Context Caching:** Cache static factory definitions, topology, and operating procedures.
3. **Structured Outputs:** Use JSON schema for event payloads.
4. **No LLM Graphics:** The LLM emits coordinates and IDs (`focus: "M07"`), frontend shaders render the visual effects.
