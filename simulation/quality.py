"""
Deterministic Quality and Defect Simulation Engine for FlowTwin AI.
Calculates scrap rates, rework station bottlenecks, and yield impact.
"""

from typing import Dict, Any
from .factory import default_state

def simulate_quality_change(line_id: str, drift_percentage: float) -> Dict[str, Any]:
    """
    Simulates dimensional or thermal drift in tooling leading to scrap/rework.
    Example: simulate_quality_change("L3", 3.5)
    """
    baseline_yield = default_state.telemetry["quality_yield_rate"] # e.g. 0.968
    nominal_daily = default_state.config["nominal_daily_output"]
    
    # Impacted line production share (~35%)
    line_daily = nominal_daily * 0.35
    new_scrap_units = int(line_daily * (drift_percentage / 100.0))
    rework_units = int(new_scrap_units * 0.60) # 60% can be reworked
    discard_units = new_scrap_units - rework_units
    
    new_factory_yield = round(baseline_yield - (discard_units / nominal_daily), 3)
    rework_station_burden_hours = round(rework_units / 40.0, 1)

    return {
        "scenario": f"Quality Drift of +{drift_percentage}% on {line_id}",
        "line_id": line_id,
        "drift_percentage": drift_percentage,
        "baseline_yield": baseline_yield,
        "new_factory_yield": new_factory_yield,
        "scrap_units": new_scrap_units,
        "rework_units": rework_units,
        "rework_station_burden_hours": rework_station_burden_hours,
        "scrap_material_cost_usd": discard_units * 85,
        "affected_nodes": [line_id, "QC01", "PACK01"]
    }
