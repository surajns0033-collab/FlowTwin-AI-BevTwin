"""
Deterministic Supply and Inventory Simulation Engine for FlowTwin AI.
Calculates stockout horizon and buffer depletion timelines.
"""

from typing import Dict, Any
from .factory import default_state

def simulate_supply_delay(material_id: str, delay_days: float) -> Dict[str, Any]:
    """
    Simulates inbound raw material delivery postponement.
    Example: simulate_supply_delay("RAW-ALUM-BILLET", 3.0)
    """
    # Current buffer inventory covers 2.5 days of nominal production
    buffer_days_on_hand = 2.5
    hours_to_starvation = max(0.0, round((buffer_days_on_hand - delay_days) * 24.0, 1))
    
    if delay_days > buffer_days_on_hand:
        starvation_days = delay_days - buffer_days_on_hand
        unproduced_units = int(starvation_days * (default_state.config["nominal_daily_output"] * 0.40))
        severity = "critical"
    else:
        unproduced_units = 0
        severity = "warning"

    return {
        "scenario": f"Inbound Supply Delay of {delay_days} days for {material_id}",
        "material_id": material_id,
        "delay_days": delay_days,
        "buffer_days_on_hand": buffer_days_on_hand,
        "hours_to_starvation": hours_to_starvation,
        "unproduced_units": unproduced_units,
        "recommended_buffer_release": "Transfer 350 safety stock units from Secondary Depot B",
        "severity": severity,
        "affected_nodes": ["RAW_DOCK", "M01", "M04"]
    }
