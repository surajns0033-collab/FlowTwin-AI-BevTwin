"""
Google Cloud Firestore Live State Sync for FlowTwin AI
Synchronizes factory digital twin state to the 9 specified Firestore collections:
1. factories
2. machines
3. production_state
4. inventory_state
5. quality_state
6. energy_state
7. scenarios
8. agent_sessions
9. alerts

Supports both authenticated Google Cloud Firestore and local deterministic offline storage.
"""

import os
import sys
import json
import time
from typing import Dict, Any, List

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

# Try importing official google-cloud-firestore
try:
    from google.cloud import firestore
    HAS_FIRESTORE = True
except ImportError:
    HAS_FIRESTORE = False

LOCAL_STATE_FILE = os.path.join(REPO_ROOT, "cloud", "firestore_local_cache.json")

class FirestoreTwinSync:
    def __init__(self, project_id: str = None):
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT", "flowtwin-ai-prod")
        self.client = None
        self.is_live = False
        
        # Check credentials
        if HAS_FIRESTORE and os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            try:
                self.client = firestore.Client(project=self.project_id)
                self.is_live = True
                print(f"[Firestore] Connected to Google Cloud Firestore project: {self.project_id}")
            except Exception as e:
                print(f"[Firestore] Cloud connection failed ({e}), using local emulated twin cache.")
                self.is_live = False
        else:
            print("[Firestore] Running with local twin state cache (Set GOOGLE_APPLICATION_CREDENTIALS for live GCP sync).")

    def seed_all_collections(self) -> Dict[str, Any]:
        """Seeds or refreshes the 9 collections from synthetic data."""
        with open(os.path.join(REPO_ROOT, "data", "machines.json"), "r") as f:
            machines_data = json.load(f)
        with open(os.path.join(REPO_ROOT, "data", "factory.json"), "r") as f:
            factory_data = json.load(f)
        with open(os.path.join(REPO_ROOT, "data", "telemetry.json"), "r") as f:
            telemetry_data = json.load(f)

        collections_payload = {
            "factories": {
                "factory_primary": {
                    "id": "FAC-01",
                    "name": "Precision Industrial Facility Alpha",
                    "location": "Sector 4, Industrial Zone",
                    "status": "OPERATIONAL",
                    "lines": ["Line 1", "Line 2", "Line 3"],
                    "updated_at": time.time()
                }
            },
            "machines": {m["id"]: m for m in machines_data},
            "production_state": {
                "current_shift": {
                    "output_units": telemetry_data["total_factory_output_units"],
                    "target_units": telemetry_data["total_factory_target_units"],
                    "oee": 0.82,
                    "active_bottleneck": "M07",
                    "updated_at": time.time()
                }
            },
            "inventory_state": {
                "raw_feed": {"level": 84, "unit": "%", "status": "OPTIMAL"},
                "wip_buffer": {"level": 62, "unit": "%", "status": "ELEVATED"},
                "finished_goods": {"level": 91, "unit": "%", "status": "OPTIMAL"}
            },
            "quality_state": {
                "qc01": {"pass_rate": 0.942, "inspected_hr": 140, "defect_rate": 0.058},
                "qc02": {"pass_rate": 0.985, "inspected_hr": 95, "defect_rate": 0.015}
            },
            "energy_state": {
                "current_kwh": telemetry_data["current_power_consumption_kw"],
                "shift_total_kwh": 18400,
                "target_kwh": 16000,
                "carbon_intensity_kg": 7360,
                "power_factor": 0.94
            },
            "scenarios": {
                "baseline": {"name": "Current Line 3 Constraint", "output": 8200, "oee": 0.82},
                "m07_down_4h": {"name": "M07 Down 4h", "output": 6400, "delay_hours": 6},
                "load_reroute": {"name": "AI Dynamic Reroute", "output": 9450, "delay_hours": 1}
            },
            "agent_sessions": {
                "session_latest": {
                    "model": "gemini-3.8-flash",
                    "last_query": "Why is Line 3 slow?",
                    "causal_path": ["M07", "Line 3", "QC01", "Shipment"],
                    "timestamp": time.time()
                }
            },
            "alerts": {
                f"alert_{i}": a for i, a in enumerate(telemetry_data.get("active_alerts", []))
            }
        }

        # If live Google Cloud Firestore is connected, push documents
        if self.is_live and self.client:
            try:
                for coll_name, docs in collections_payload.items():
                    for doc_id, doc_data in docs.items():
                        self.client.collection(coll_name).document(str(doc_id)).set(doc_data)
                print("[Firestore] Successfully synced 9 collections to Google Cloud Firestore.")
            except Exception as e:
                print(f"[Firestore] Error uploading to GCP Firestore: {e}")

        # Always save local cache for instantaneous local twin access
        os.makedirs(os.path.dirname(LOCAL_STATE_FILE), exist_ok=True)
        with open(LOCAL_STATE_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "mode": "Google Cloud Firestore" if self.is_live else "Local Firestore Emulated Cache",
                "project_id": self.project_id,
                "collections": collections_payload,
                "synced_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            }, f, indent=2)

        return {
            "status": "success",
            "is_live_gcp": self.is_live,
            "project_id": self.project_id,
            "collections_count": len(collections_payload),
            "synced_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        }

def get_firestore_summary() -> Dict[str, Any]:
    """Returns the synced state from local cache or GCP."""
    if os.path.exists(LOCAL_STATE_FILE):
        with open(LOCAL_STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    sync = FirestoreTwinSync()
    sync.seed_all_collections()
    with open(LOCAL_STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    sync = FirestoreTwinSync()
    res = sync.seed_all_collections()
    print("Firestore Seed Result:", json.dumps(res, indent=2))
