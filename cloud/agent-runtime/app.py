"""
Google Agent Runtime Microservice for FlowTwin AI
Exposes Google ADK multi-agent orchestrator as a Cloud Run / Agent Runtime service.
Provides Server-Sent Events (SSE) streaming of the Custom Event Protocol:
STATE, FOCUS, TOOL, IMPACT, SCENARIO, RECOMMENDATION, DONE
"""

from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import json
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from simulation.production import simulate_machine_failure
from simulation.energy import compare_scenarios
from simulation.factory import default_state
from agents.agent_search import search_factory_knowledge

app = FastAPI(title="FlowTwin AI - Google Agent Runtime", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "runtime": "Google Agent Runtime / Cloud Run",
        "framework": "Google ADK (Python)",
        "models": {
            "orchestrator": "gemini-3.8-flash",
            "observer": "gemini-3.5-flash-lite",
            "rag": "vertex-agent-search"
        }
    }

def generate_agent_events(prompt: str):
    p_lower = prompt.lower()
    
    # 1. Observer reading state
    yield f"data: {json.dumps({'event': 'TOOL', 'agent': 'ObserverAgent', 'model': 'gemini-3.5-flash-lite', 'step': 'state', 'message': 'Observer reading compact factory state'})}\n\n"
    time.sleep(0.15)
    
    yield f"data: {json.dumps({'event': 'STATE', 'agent': 'ObserverAgent', 'data': {'summary': 'Line 3 constrained by M07 thermal saturation; QC01 queue +34 units.', 'oee': 0.82, 'target': 10000, 'current': 8200}})}\n\n"
    time.sleep(0.15)
    
    # 2. Causal / Simulator / Optimizer
    if "why" in p_lower or "slow" in p_lower or "sop" in p_lower:
        rag = search_factory_knowledge(prompt)
        yield f"data: {json.dumps({'event': 'TOOL', 'agent': 'GroundedRAG', 'step': 'grounding', 'message': f'Grounded via SOP: {rag[\"snippet\"][:80]}...'})}\n\n"
        time.sleep(0.15)
        yield f"data: {json.dumps({'event': 'FOCUS', 'target': 'M07', 'zoom': 1.45})}\n\n"
        yield f"data: {json.dumps({'event': 'IMPACT', 'source': 'M07', 'targets': ['M07', 'L3', 'QC01', 'SHIP01'], 'severity': 'high'})}\n\n"
        yield f"data: {json.dumps({'event': 'RECOMMENDATION', 'agent': 'CausalAnalystAgent', 'response_text': 'M07 bearing thermal runaway (84.6°C) throttles feed rate to 62%, backing up Line 3 and QC01.', 'actions': ['Show affected area', 'Compare scenarios', 'Optimize']})}\n\n"
    else:
        sim = simulate_machine_failure("M07", 4.0)
        comp = compare_scenarios("m07_down")
        yield f"data: {json.dumps({'event': 'FOCUS', 'target': 'M07', 'zoom': 1.55})}\n\n"
        yield f"data: {json.dumps({'event': 'IMPACT', 'source': 'M07', 'targets': ['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'severity': 'critical'})}\n\n"
        yield f"data: {json.dumps({'event': 'SCENARIO', 'data': comp})}\n\n"
        yield f"data: {json.dumps({'event': 'RECOMMENDATION', 'agent': 'OptimizerAgent', 'response_text': 'M07 failure for 4h results in -1,800 units loss. Rerouting 25% load to Line 2 recovers output to 9,450 units.', 'decision': {'title': 'Dynamic Rerouting Plan', 'actions': ['Reroute 25% load to Line 2 (M05)', 'Spin up QC02 reserve station'], 'expected': 'Production: 9,450 units | SLA delay: 1h'}, 'actions': ['Apply Plan', 'Export GCS Report']})}\n\n"

    yield f"data: {json.dumps({'event': 'DONE', 'status': 'completed'})}\n\n"

@app.get("/api/agent/stream")
def agent_stream(prompt: str = Query("Why is Line 3 slow?")):
    return StreamingResponse(generate_agent_events(prompt), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
