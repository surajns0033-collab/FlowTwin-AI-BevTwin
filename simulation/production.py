"""
Deterministic Production and Capacity Simulation Engine for FlowTwin AI.
Calculates throughput, bottleneck shifting, buffer starvation, and shipment impacts.
"""

from typing import Dict, Any, List
from .factory import default_state

def simulate_machine_failure(machine_id: str, downtime_hours: float) -> Dict[str, Any]:
    """
    Simulates the deterministic impact of an unplanned machine downtime.
    Example: simulate_machine_failure("M07", 4.0)
    """
    machine = default_state.get_machine(machine_id)
    if not machine:
        raise ValueError(f"Machine {machine_id} not found in factory registry.")

    nominal_rate = machine["capacity_units_hr"]
    line_id = machine["line"]
    
    # Lost capacity on the specific machine
    direct_lost_units = int(nominal_rate * downtime_hours * machine["utilization"])
    
    # Cascade bottleneck effect onto the line
    line_machines = default_state.get_line_machines(line_id)
    bottleneck_rate = min(m["capacity_units_hr"] for m in line_machines)
    
    # Overall factory production delta
    nominal_daily = default_state.config["nominal_daily_output"]
    production_delta_units = -int(direct_lost_units * 1.15) # factoring in starvation & ramp-up loss
    production_delta_pct = round((production_delta_units / nominal_daily) * 100, 1)

    # Downstream QC buffer pileup / mismatch
    qc_queue_delta_pct = +34 if line_id == "L3" else +18
    
    # Order SLA delay estimation
    affected_orders = [o for o in default_state.orders if o["allocated_line"] == line_id]
    shipment_delay_hours = round(downtime_hours * 1.5, 1)

    # Downstream causal propagation path
    affected = default_state.get_downstream_path(machine_id)

    return {
        "scenario": f"Failure of {machine_id} for {downtime_hours}h",
        "machine_id": machine_id,
        "downtime_hours": downtime_hours,
        "direct_lost_units": direct_lost_units,
        "production_delta_units": production_delta_units,
        "production_delta_pct": production_delta_pct,
        "new_estimated_output": max(0, nominal_daily + production_delta_units),
        "qc_queue_delta_pct": qc_queue_delta_pct,
        "shipment_delay_hours": shipment_delay_hours,
        "affected_nodes": affected,
        "financial_risk_usd": int(sum(o.get("penalty_per_hour_usd", 1500) * shipment_delay_hours for o in affected_orders)),
        "severity": "critical" if downtime_hours >= 3.0 else "warning"
    }

def simulate_demand_change(delta_percentage: float) -> Dict[str, Any]:
    """
    Simulates sudden demand surge or contraction.
    Example: delta_percentage = +20 (+20%)
    """
    baseline_target = default_state.config["nominal_daily_output"]
    new_target = int(baseline_target * (1 + delta_percentage / 100))
    
    # Check lines max capacity
    total_factory_capacity = sum(line["capacity_per_hour"] * 24 for line in default_state.config["lines"])
    capacity_deficit = max(0, new_target - total_factory_capacity)
    
    overtime_needed_hours = round(max(0, (new_target - baseline_target) / (total_factory_capacity / 24)), 1)
    energy_delta_kwh = int((new_target - baseline_target) * 1.84) # 1.84 kWh per unit

    return {
        "scenario": f"Demand Shift of {delta_percentage:+}%",
        "delta_percentage": delta_percentage,
        "baseline_units": baseline_target,
        "target_units": new_target,
        "capacity_deficit_units": capacity_deficit,
        "overtime_needed_hours": overtime_needed_hours,
        "energy_delta_kwh": energy_delta_kwh,
        "line_utilization_forecast": {
            "L1": min(1.0, round(0.92 * (1 + delta_percentage / 100), 2)),
            "L2": min(1.0, round(0.88 * (1 + delta_percentage / 100), 2)),
            "L3": min(1.0, round(0.65 * (1 + delta_percentage / 100), 2))
        },
        "feasibility": "feasible_with_overtime" if capacity_deficit == 0 else "capacity_breach"
    }
