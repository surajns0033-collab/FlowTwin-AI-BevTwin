"""
Observer Agent for FlowTwin AI.
Answers: "What's happening?"
Reads compact factory telemetry and flags anomalies without sending bulky dumps.
"""

from typing import Dict, Any, List
from simulation.factory import default_state

class ObserverAgent:
    def __init__(self, model_name: str = "gemini-3.5-flash-lite"):
        self.model_name = model_name

    def inspect_current_state(self) -> Dict[str, Any]:
        """Returns compact factory health delta."""
        degraded_machines = [
            {
                "id": m["id"],
                "name": m["name"],
                "line": m["line"],
                "status": m["status"],
                "health_score": m["health_score"],
                "warning": m.get("warning_details")
            }
            for m in default_state.machines.values()
            if m["status"] != "nominal"
        ]

        active_alerts = default_state.telemetry.get("active_alerts", [])

        return {
            "summary": "Line 3 constrained by M07 thermal saturation; QC01 buffer near threshold.",
            "overall_oee": default_state.telemetry["overall_equipment_effectiveness"],
            "degraded_machines": degraded_machines,
            "alerts": active_alerts,
            "current_output": default_state.telemetry["total_factory_output_units"],
            "nominal_target": default_state.telemetry["total_factory_target_units"]
        }
