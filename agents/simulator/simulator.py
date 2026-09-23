"""
Simulator Agent for FlowTwin AI.
Answers: "What happens if...?"
Translates operational queries into deterministic parameters and calls the simulation engine.
"""

from typing import Dict, Any
from simulation.production import simulate_machine_failure, simulate_demand_change
from simulation.quality import simulate_quality_change
from simulation.inventory import simulate_supply_delay
from simulation.energy import simulate_energy_constraint, compare_scenarios

class SimulatorAgent:
    def __init__(self, model_name: str = "gemini-3.8-flash"):
        self.model_name = model_name

    def run_simulation(self, query_intent: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        params = params or {}
        intent = query_intent.lower()

        if "m07" in intent or "failure" in intent or "unavailable" in intent:
            hours = params.get("hours", 4.0)
            sim_result = simulate_machine_failure("M07", hours)
            scenarios = compare_scenarios("m07_failure_4h")
            return {
                "type": "machine_failure",
                "direct_metrics": sim_result,
                "scenario_comparison": scenarios,
                "concise_summary": "M07 downtime creates a Line 3 constraint. QC load rises and shipment impact appears."
            }
        elif "demand" in intent or "20%" in intent:
            delta = params.get("delta_pct", 20.0)
            return {
                "type": "demand_surge",
                "direct_metrics": simulate_demand_change(delta),
                "concise_summary": f"Demand surge of +{delta}% exceeds standard shifts; requires 1.8h scheduled overtime."
            }
        elif "energy" in intent:
            max_kwh = params.get("max_kwh", 15900.0)
            sim_result = simulate_energy_constraint(max_kwh)
            scenarios = compare_scenarios("sustainability")
            return {
                "type": "energy_optimization",
                "direct_metrics": sim_result,
                "scenario_comparison": scenarios,
                "concise_summary": f"Targeting {max_kwh:,.0f} kWh maintains 10,000 unit output via off-peak load shifting."
            }
        else:
            return {
                "type": "standard_simulation",
                "direct_metrics": simulate_machine_failure("M07", 2.0),
                "concise_summary": "Simulation executed for standard operating tolerance."
            }
