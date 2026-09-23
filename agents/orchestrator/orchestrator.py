"""
Orchestrator Agent for FlowTwin AI.
Routes user query to minimal sub-agents and emits custom streaming event protocol:
STATE, FOCUS, TOOL, IMPACT, SCENARIO, RECOMMENDATION, DONE.
"""

from typing import Dict, Any, Generator
import json
import time

from agents.observer.observer import ObserverAgent
from agents.causal.causal import CausalAnalystAgent
from agents.simulator.simulator import SimulatorAgent
from agents.optimizer.optimizer import OptimizerAgent

class OrchestratorAgent:
    def __init__(self):
        self.observer = ObserverAgent(model_name="gemini-3.5-flash-lite")
        self.causal = CausalAnalystAgent(model_name="gemini-3.8-flash")
        self.simulator = SimulatorAgent(model_name="gemini-3.8-flash")
        self.optimizer = OptimizerAgent(model_name="gemini-3.8-flash")

    def process_query_stream(self, user_prompt: str) -> Generator[Dict[str, Any], None, None]:
        """
        Emits token-efficient structured events for the frontend.
        """
        prompt = user_prompt.lower()

        # Step 1: Reading current state
        yield {
            "event": "TOOL",
            "step": "state",
            "message": "Reading current factory state"
        }
        state_delta = self.observer.inspect_current_state()
        yield {
            "event": "STATE",
            "data": state_delta
        }

        # Branch A: Anomaly Inquiry ("Why is Line 3 slow?")
        if "why" in prompt or "slow" in prompt or "line 3" in prompt or "constraint" in prompt:
            yield {
                "event": "TOOL",
                "step": "dependencies",
                "message": "Checking physical and telemetry dependencies"
            }
            causal_res = self.causal.analyze_root_cause("Line 3")

            yield {
                "event": "FOCUS",
                "target": "M07",
                "zoom": 1.4,
                "tilt": 0.3
            }

            yield {
                "event": "IMPACT",
                "source": "M07",
                "targets": causal_res["causal_chain"],
                "severity": causal_res["severity"]
            }

            yield {
                "event": "RECOMMENDATION",
                "response_text": (
                    "M07 bearing thermal saturation (84.6°C) has throttled feed rate to 62%. "
                    "This creates a Line 3 constraint, causing downstream QC01 buffer buildup and jeopardizing outbound shipping SLAs."
                ),
                "actions": ["Show affected area", "Compare scenarios", "Optimize"],
                "decision": None
            }

        # Branch B: Simulation / What-If ("M07 unavailable for 4 hours", "What if M07 fails?")
        elif "m07" in prompt or "hour" in prompt or "unavailable" in prompt or "fail" in prompt or "down" in prompt:
            yield {
                "event": "TOOL",
                "step": "dependencies",
                "message": "Checking upstream buffers and downstream dependencies"
            }
            yield {
                "event": "TOOL",
                "step": "simulation",
                "message": "Running deterministic failure simulation"
            }
            sim_res = self.simulator.run_simulation("m07 failure", {"hours": 4.0})

            yield {
                "event": "FOCUS",
                "target": "M07",
                "zoom": 1.5,
                "tilt": 0.4
            }

            yield {
                "event": "IMPACT",
                "source": "M07",
                "targets": ["M07", "L3", "QC01", "PACK01", "SHIP01"],
                "severity": "critical"
            }

            yield {
                "event": "SCENARIO",
                "data": sim_res["scenario_comparison"]
            }

            yield {
                "event": "TOOL",
                "step": "evaluating",
                "message": "Evaluating operational impact & SLA penalties"
            }
            yield {
                "event": "TOOL",
                "step": "recommendation",
                "message": "Preparing Pareto-optimal recommendation"
            }

            decision = self.optimizer.optimize_action_plan("m07_down")
            yield {
                "event": "RECOMMENDATION",
                "response_text": "M07 downtime creates a Line 3 constraint. QC load rises and shipment impact appears.",
                "actions": ["Show affected area", "Compare scenarios", "Optimize"],
                "decision": decision
            }

        # Branch C: Sustainability & Energy Optimization ("Reduce energy without reducing output")
        elif "energy" in prompt or "sustainability" in prompt or "co2" in prompt or "power" in prompt:
            yield {
                "event": "TOOL",
                "step": "simulation",
                "message": "Simulating thermal & conveyor load profiles"
            }
            sim_res = self.simulator.run_simulation("energy", {"max_kwh": 15900.0})

            yield {
                "event": "FOCUS",
                "target": "M02",
                "zoom": 1.2,
                "tilt": 0.2
            }

            yield {
                "event": "SCENARIO",
                "data": sim_res["scenario_comparison"]
            }

            yield {
                "event": "TOOL",
                "step": "evaluating",
                "message": "Evaluating off-peak shift feasibility"
            }
            yield {
                "event": "TOOL",
                "step": "recommendation",
                "message": "Preparing energy efficiency schedule"
            }

            decision = self.optimizer.optimize_action_plan("energy")
            yield {
                "event": "RECOMMENDATION",
                "response_text": "Targeting 15,900 kWh maintains 10,000 units daily throughput with 1,000 kg CO2 avoided.",
                "actions": ["Show affected area", "Compare scenarios", "Optimize"],
                "decision": decision
            }

        # Branch D: General query / Fallback
        else:
            yield {
                "event": "TOOL",
                "step": "evaluating",
                "message": "Evaluating standard operating envelope"
            }
            yield {
                "event": "RECOMMENDATION",
                "response_text": "FlowTwin AI is monitoring 8 machines across 3 lines. Line 3 has an active constraint on M07.",
                "actions": ["Show affected area", "Compare scenarios", "Optimize"],
                "decision": None
            }

        # End of stream
        yield {
            "event": "DONE"
        }
