"""
Deterministic Factory Model and State Manager for FlowTwin AI.
Loads synthetic datasets and provides graph topology for simulation modules.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

def load_factory_config() -> Dict[str, Any]:
    with open(DATA_DIR / "factory.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_machines() -> List[Dict[str, Any]]:
    with open(DATA_DIR / "machines.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_orders() -> List[Dict[str, Any]]:
    with open(DATA_DIR / "orders.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_telemetry() -> Dict[str, Any]:
    with open(DATA_DIR / "telemetry.json", "r", encoding="utf-8") as f:
        return json.load(f)

class FactoryState:
    def __init__(self):
        self.config = load_factory_config()
        self.machines = {m["id"]: m for m in load_machines()}
        self.orders = load_orders()
        self.telemetry = load_telemetry()

    def get_machine(self, machine_id: str) -> Optional[Dict[str, Any]]:
        return self.machines.get(machine_id)

    def get_line_machines(self, line_id: str) -> List[Dict[str, Any]]:
        return [m for m in self.machines.values() if m.get("line") == line_id]

    def get_downstream_path(self, start_id: str) -> List[str]:
        """Finds downstream nodes connected to start_id."""
        path = [start_id]
        if start_id in ["M01", "M02", "M03"]:
            path.extend(["L1", "QC01", "PACK01", "SHIP01"])
        elif start_id in ["M04", "M05", "M06"]:
            path.extend(["L2", "QC02", "PACK01", "SHIP01"])
        elif start_id in ["M07", "M08"]:
            path.extend(["L3", "QC01", "PACK01", "SHIP01"])
        return path

default_state = FactoryState()
