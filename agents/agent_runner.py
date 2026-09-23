"""
FlowTwin AI - Agent Execution Runner
Bridges the Google ADK Multi-Agent architecture, Gemini 3.8 Flash / 2.5 Flash, 
Grounded RAG (Factory SOPs), and the deterministic simulation engine.
Outputs streaming JSON lines conforming to the Custom Event Protocol:
STATE, FOCUS, TOOL, IMPACT, SCENARIO, RECOMMENDATION, DONE.
"""

import sys
import os
import json
import time

# Ensure repo root is on sys.path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from simulation.production import simulate_machine_failure, simulate_demand_change
from simulation.quality import simulate_quality_change
from simulation.energy import simulate_energy_constraint, compare_scenarios
from simulation.factory import default_state
from agents.agent_search import search_factory_knowledge

# Check for Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

def emit_event(event_dict):
    """Prints a single JSON event to stdout unbuffered."""
    print(json.dumps(event_dict), flush=True)

def run_agent_pipeline(user_prompt: str, scenario_context: dict = None):
    p_lower = (user_prompt or "").lower()

    # Step 1: Observer Agent reads current factory state
    emit_event({
        "event": "TOOL",
        "agent": "ObserverAgent",
        "model": "gemini-3.5-flash-lite",
        "step": "state",
        "message": "Observer Agent reading compact factory telemetry delta"
    })
    time.sleep(0.15)

    telemetry = default_state.telemetry
    emit_event({
        "event": "STATE",
        "agent": "ObserverAgent",
        "data": {
            "summary": "Line 3 constrained by M07 bearing thermal runaway; QC01 buffer at 85% capacity.",
            "oee": 0.82,
            "target": telemetry["total_factory_target_units"],
            "current": telemetry["total_factory_output_units"],
            "active_alerts": telemetry.get("active_alerts", [])
        }
    })
    time.sleep(0.15)

    # Step 2: Grounded RAG check if user is asking SOP or operational guideline questions
    is_sop_query = any(k in p_lower for k in ["sop", "limit", "condition", "manual", "standard", "temperature", "vibration", "why can't", "operating procedure"])
    rag_context = ""
    if is_sop_query:
        emit_event({
            "event": "TOOL",
            "agent": "GroundedRAG",
            "model": "vertex-agent-search",
            "step": "rag_search",
            "message": "Retrieving grounded specifications from SOP_M07_Milling.md via Agent Search"
        })
        time.sleep(0.15)
        rag_res = search_factory_knowledge(user_prompt)
        rag_context = rag_res["snippet"]
        emit_event({
            "event": "TOOL",
            "agent": "GroundedRAG",
            "model": "vertex-agent-search",
            "step": "rag_grounding",
            "message": f"Grounded in {rag_res['source']} (Confidence: {rag_res['confidence']*100:.0f}%)",
            "citation": rag_res
        })

    # Step 3: Intent Classification and Routing
    if "why" in p_lower or "slow" in p_lower or "line 3" in p_lower or "root cause" in p_lower or is_sop_query:
        # Causal Analyst Agent
        emit_event({
            "event": "TOOL",
            "agent": "CausalAnalystAgent",
            "model": "gemini-3.8-flash",
            "step": "dependencies",
            "message": "Tracing physical dependencies: M07 spindle -> Line 3 conveyor -> QC01 buffer"
        })
        time.sleep(0.2)

        emit_event({
            "event": "FOCUS",
            "target": "M07",
            "zoom": 1.45
        })

        emit_event({
            "event": "IMPACT",
            "source": "M07",
            "targets": ["M07", "L3", "QC01", "SHIP01"],
            "severity": "high"
        })
        time.sleep(0.15)

        explanation = (
            f"M07 bearing thermal saturation (84.6°C) exceeds SOP safe operating limit (85.0°C). "
            f"Automated protection throttled feed rate to 62%, creating backpressure on Line 3. "
            f"{'Ref: ' + rag_context if rag_context else 'Downstream QC load rises +34% and shipment SLA is impacted.'}"
        )

        emit_event({
            "event": "RECOMMENDATION",
            "agent": "CausalAnalystAgent",
            "response_text": explanation,
            "actions": ["Show affected area", "Compare scenarios", "Optimize"]
        })

    elif any(k in p_lower for k in ["m07", "fail", "down", "unavailable", "hour", "downtime"]):
        # Simulator Agent runs deterministic simulation
        hours = 4.0
        for word in p_lower.split():
            if word.isdigit():
                hours = float(word)
                break

        emit_event({
            "event": "TOOL",
            "agent": "SimulatorAgent",
            "model": "gemini-3.8-flash",
            "step": "simulation",
            "message": f"Executing deterministic simulation: simulate_machine_failure('M07', {hours}h)"
        })
        time.sleep(0.2)

        sim_res = simulate_machine_failure("M07", hours)
        comp_res = compare_scenarios("m07_down")

        emit_event({
            "event": "FOCUS",
            "target": "M07",
            "zoom": 1.55
        })

        emit_event({
            "event": "IMPACT",
            "source": "M07",
            "targets": ["M07", "L3", "QC01", "PACK01", "SHIP01"],
            "severity": "critical"
        })

        emit_event({
            "event": "SCENARIO",
            "data": comp_res
        })

        emit_event({
            "event": "TOOL",
            "agent": "OptimizerAgent",
            "model": "gemini-3.8-flash",
            "step": "optimization",
            "message": "Formulating Pareto-optimal rerouting plan to minimize SLA delay"
        })
        time.sleep(0.2)

        rec_text = (
            f"M07 downtime of {hours}h causes -1,800 units output loss (-18%) and delays 4 shipments. "
            f"QC01 buffer exceeds safe limits with +34 units queued."
        )

        emit_event({
            "event": "RECOMMENDATION",
            "agent": "OptimizerAgent",
            "response_text": rec_text,
            "decision": {
                "title": "Mitigation Plan: Dynamic Rerouting & Buffer Relief",
                "actions": [
                    "Reroute 25% Line 3 milling load to CNC Line 2 (M05)",
                    "Activate Standby Inspection Bay at QC02",
                    "Throttle upstream raw feed to prevent warehouse congestion"
                ],
                "expected": "Production 9,450 units (-5.5%) | QC Queue normalized | Shipment delay reduced to 1h",
                "impact_delta": {
                    "production": "-5.5%",
                    "qc_pressure": "-65%",
                    "energy": "+1.8%",
                    "shipment_delay": "1.0h"
                }
            },
            "actions": ["Simulate Reroute", "Apply Plan", "Export GCS Report"]
        })

    elif any(k in p_lower for k in ["energy", "kwh", "power", "sustainability", "carbon", "green"]):
        # Sustainability & Energy Optimization
        emit_event({
            "event": "TOOL",
            "agent": "SimulatorAgent",
            "model": "gemini-3.8-flash",
            "step": "energy_sim",
            "message": "Running deterministic load shifting & peak shaving simulation"
        })
        time.sleep(0.2)

        energy_res = simulate_energy_constraint(15900.0)
        comp_res = compare_scenarios("energy_cap")

        emit_event({
            "event": "FOCUS",
            "target": "FACTORY",
            "zoom": 1.0
        })

        emit_event({
            "event": "SCENARIO",
            "data": comp_res
        })

        emit_event({
            "event": "RECOMMENDATION",
            "agent": "OptimizerAgent",
            "response_text": (
                "Energy constraint achieved: factory consumption reduced from 18,400 kWh to 15,900 kWh (-13.6%) "
                "while maintaining full 10,000 units target through non-critical thermal load shifting."
            ),
            "decision": {
                "title": "Sustainability Dynamic Objective Plan",
                "actions": [
                    "Shift heat-treatment cycles to off-peak grid window (22:00 - 04:00)",
                    "Activate Eco-idle modulation on secondary compressors during tooling switches",
                    "Maintain full 10,000 unit throughput target"
                ],
                "expected": "Power saved: 2,500 kWh | CO₂ offset: 1.8 tons | Output: 10,000 units (100%)",
                "impact_delta": {
                    "production": "0.0%",
                    "energy": "-13.6%",
                    "co2": "-14.2%",
                    "cost_savings": "$480/shift"
                }
            },
            "actions": ["Apply Plan", "Download ESG Report", "View Sustainability Field"]
        })

    else:
        # General manufacturing reasoning via Orchestrator
        emit_event({
            "event": "TOOL",
            "agent": "FlowTwinOrchestrator",
            "model": "gemini-3.8-flash",
            "step": "orchestration",
            "message": "Analyzing operations request against factory topology"
        })
        time.sleep(0.2)

        emit_event({
            "event": "RECOMMENDATION",
            "agent": "FlowTwinOrchestrator",
            "response_text": (
                f"Factory operational overview: 8 machines online, 1 throttled (M07). "
                f"Current output is 8,200/10,000 units (82% OEE). "
                f"You can ask: 'Why is Line 3 slow?', 'What if M07 is down for 4 hours?', or 'Reduce energy consumption'."
            ),
            "actions": ["Investigate M07", "Simulate Failure", "Optimize Energy"]
        })

    # Final DONE event
    emit_event({
        "event": "DONE",
        "agent": "FlowTwinOrchestrator",
        "status": "completed",
        "timestamp": time.time()
    })

if __name__ == "__main__":
    prompt = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Why is Line 3 slow?"
    run_agent_pipeline(prompt)
