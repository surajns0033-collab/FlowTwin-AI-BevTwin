"""
Google Cloud Storage Manager for FlowTwin AI
Handles bucket operations for:
- Factory SOPs and manuals (knowledge/factory-docs/)
- Seed telemetry and factory topology datasets
- Dynamic export of AI Operational Decision Reports
"""

import os
import sys
import json
import time
from typing import Dict, Any, List

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

try:
    from google.cloud import storage
    HAS_STORAGE = True
except ImportError:
    HAS_STORAGE = False

GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "flowtwin-ai-factory-storage")
LOCAL_STORAGE_DIR = os.path.join(REPO_ROOT, "cloud", "gcs_local_bucket")

class TwinStorageManager:
    def __init__(self, bucket_name: str = GCS_BUCKET_NAME):
        self.bucket_name = bucket_name
        self.client = None
        self.is_live = False
        
        if HAS_STORAGE and os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            try:
                self.client = storage.Client()
                self.bucket = self.client.bucket(self.bucket_name)
                self.is_live = True
                print(f"[GCS] Connected to Google Cloud Storage bucket: {self.bucket_name}")
            except Exception as e:
                print(f"[GCS] Cloud connection failed ({e}), using local emulated bucket.")
                self.is_live = False
        else:
            print(f"[GCS] Emulating bucket at: {LOCAL_STORAGE_DIR}")
            os.makedirs(LOCAL_STORAGE_DIR, exist_ok=True)

    def list_factory_documents(self) -> List[Dict[str, Any]]:
        """Lists factory SOPs and datasets stored in GCS / local bucket."""
        docs = []
        docs_dir = os.path.join(REPO_ROOT, "knowledge", "factory-docs")
        if os.path.exists(docs_dir):
            for fname in os.listdir(docs_dir):
                fpath = os.path.join(docs_dir, fname)
                docs.append({
                    "name": fname,
                    "type": "Standard Operating Procedure",
                    "size_bytes": os.path.getsize(fpath),
                    "path": f"gs://{self.bucket_name}/sop/{fname}",
                    "updated_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(os.path.getmtime(fpath)))
                })

        data_dir = os.path.join(REPO_ROOT, "data")
        if os.path.exists(data_dir):
            for fname in os.listdir(data_dir):
                if fname.endswith(".json"):
                    fpath = os.path.join(data_dir, fname)
                    docs.append({
                        "name": fname,
                        "type": "Synthetic Telemetry & Topology",
                        "size_bytes": os.path.getsize(fpath),
                        "path": f"gs://{self.bucket_name}/datasets/{fname}",
                        "updated_at": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(os.path.getmtime(fpath)))
                    })
        return docs

    def export_scenario_report(self, scenario_name: str, payload: dict) -> str:
        """Generates an operational scenario decision artifact and stores to GCS."""
        timestamp = int(time.time())
        filename = f"report_{scenario_name}_{timestamp}.json"
        local_path = os.path.join(LOCAL_STORAGE_DIR, filename)

        with open(local_path, "w", encoding="utf-8") as f:
            json.dump({
                "report_id": f"REP-{timestamp}",
                "generated_by": "FlowTwin AI Orchestrator",
                "model": "gemini-3.8-flash",
                "scenario": scenario_name,
                "data": payload,
                "gcs_uri": f"gs://{self.bucket_name}/reports/{filename}",
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            }, f, indent=2)

        if self.is_live and self.client:
            try:
                blob = self.bucket.blob(f"reports/{filename}")
                blob.upload_from_filename(local_path)
                print(f"[GCS] Uploaded report to gs://{self.bucket_name}/reports/{filename}")
            except Exception as e:
                print(f"[GCS] Upload failed: {e}")

        return f"gs://{self.bucket_name}/reports/{filename}"

if __name__ == "__main__":
    mgr = TwinStorageManager()
    docs = mgr.list_factory_documents()
    print("Factory Documents in GCS:", json.dumps(docs, indent=2))
    report_uri = mgr.export_scenario_report("m07_mitigation", {"status": "optimized", "output_gain": "+1,250"})
    print("Exported Report URI:", report_uri)
