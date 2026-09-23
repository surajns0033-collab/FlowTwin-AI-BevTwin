"""
Official Google ADK (Agent Development Kit) Multi-Agent Architecture for FlowTwin AI.
Uses google.adk to define 4 logical agents with Gemini 3.8 Flash & Gemini 3.5 Flash-Lite:
- ObserverAgent
- CausalAnalystAgent
- SimulatorAgent (with deterministic python tools)
- OptimizerAgent
- FlowTwinOrchestrator
"""

from typing import Dict, Any, List
import json
import os
import sys

# Ensure repository root is on sys.path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

try:
    import google.adk as adk
    HAS_ADK = True
except ImportError:
    HAS_ADK = False

from simulation.production import simulate_machine_failure, simulate_demand_change
from simulation.quality import simulate_quality_change
from simulation.energy import simulate_energy_constraint, compare_scenarios
from simulation.factory import default_state

# ADK Deterministic Tools
def get_factory_telemetry() -> str:
    """Returns the real-time compact factory telemetry delta and active alerts."""
    alerts = default_state.telemetry.get("active_alerts", [])
    return json.dumps({
        "status": "Line 3 constrained by M07 thermal runaway",
        "alerts": alerts,
        "output": default_state.telemetry["total_factory_output_units"],
        "target": default_state.telemetry["total_factory_target_units"],
        "power_kw": default_state.telemetry["current_power_consumption_kw"]
    })

def run_failure_simulation(machine_id: str, hours: float) -> str:
    """Deterministic simulation of machine downtime impact on output, QC queue, and shipping."""
    res = simulate_machine_failure(machine_id, hours)
    return json.dumps(res)

def run_energy_optimization_simulation(target_kwh: float) -> str:
    """Deterministic simulation of load shifting and peak shaving without output loss."""
    res = simulate_energy_constraint(target_kwh)
    return json.dumps(res)

# 1. Observer Agent (Gemini 3.5 Flash-Lite)
observer_agent = adk.Agent(
    name="ObserverAgent",
    model="gemini-3.5-flash-lite",
    instruction="""You are the Observer Agent of FlowTwin AI.
Your job is to read compact factory telemetry, identify active machine alerts, and output structured entity states without voluminous data dumps.
Focus on anomalies and changed entities.""",
    tools=[get_factory_telemetry]
)

# 2. Causal Analyst Agent (Gemini 3.8 Flash)
causal_agent = adk.Agent(
    name="CausalAnalystAgent",
    model="gemini-3.8-flash",
    instruction="""You are the Causal Analyst Agent of FlowTwin AI.
When an anomaly is reported (e.g. Line 3 is slow), analyze physical machine connections and telemetry to identify the root cause.
Trace the exact causal path (e.g. M07 -> Line 3 -> QC01 -> Shipping)."""
)

# 3. Simulator Agent (Gemini 3.8 Flash)
simulator_agent = adk.Agent(
    name="SimulatorAgent",
    model="gemini-3.8-flash",
    instruction="""You are the Simulator Agent of FlowTwin AI.
When the operator asks what-if questions (e.g. machine failure, demand change, energy cap),
call the deterministic simulation tools. NEVER guess numbers; rely strictly on tool outputs.""",
    tools=[run_failure_simulation, run_energy_optimization_simulation]
)

# 4. Optimizer Agent (Gemini 3.8 Flash)
optimizer_agent = adk.Agent(
    name="OptimizerAgent",
    model="gemini-3.8-flash",
    instruction="""You are the Optimizer Agent of FlowTwin AI.
Formulate Pareto-optimal operational recommendations:
maximize: production
minimizing: energy waste, quality loss, and shipment delay.
Output crisp, structured decision tiles."""
)

# 5. Root Orchestrator Agent (Gemini 3.8 Flash)
orchestrator_agent = adk.Agent(
    name="FlowTwinOrchestrator",
    model="gemini-3.8-flash",
    instruction="""You are FlowTwin AI Orchestrator.
Route operator queries to the minimal required sub-agent (Observer, Causal, Simulator, Optimizer).
Emit compact events for the frontend: STATE, FOCUS, TOOL, IMPACT, SCENARIO, RECOMMENDATION, DONE.
Never return boring dashboards; keep explanations concise and actionable.""",
    sub_agents=[observer_agent, causal_agent, simulator_agent, optimizer_agent]
)

if __name__ == "__main__":
    print(f"FlowTwin AI ADK Agents configured successfully:")
    print(f" - Orchestrator: {orchestrator_agent.name} ({orchestrator_agent.model})")
    print(f" - Sub-Agents: {[a.name for a in orchestrator_agent.sub_agents]}")
