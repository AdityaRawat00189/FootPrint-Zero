import os
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

from graph.build_graph import get_compiled_graph
from graph.state import CaseState
from tools.hibp_tool import scan_hibp_breaches
from tools.broker_db_tool import query_relevant_brokers

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("FootprintZero.APIService")

app = FastAPI(
    title="FootprintZero Multi-Agent Intelligence Service",
    version="1.0.0",
    description="FastAPI LangGraph Multi-Agent Privacy & Erasure Pipeline"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class ScanRequest(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    user_phone: Optional[str] = ""
    user_state: Optional[str] = "CA"
    user_country: Optional[str] = "US"

class CaseStartRequest(BaseModel):
    case_number: str
    user_id: str
    user_name: str
    user_email: str
    user_phone: Optional[str] = ""
    user_state: Optional[str] = "CA"
    broker_id: Optional[str] = ""
    broker_name: str
    broker_email: str
    broker_category: Optional[str] = "People Search"
    legal_framework: Optional[str] = "CCPA"
    exposed_data_categories: Optional[List[str]] = []

class CaseResumeRequest(BaseModel):
    thread_id: str
    approved: bool
    user_edited_body: Optional[str] = None
    rejection_reason: Optional[str] = None

class FollowupRequest(BaseModel):
    thread_id: Optional[str] = None
    case_number: str
    broker_name: str
    broker_email: str
    user_name: str
    user_email: str
    legal_framework: Optional[str] = "CCPA"
    followup_count: Optional[int] = 0

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "FootprintZero Python Agent Service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/scan")
def run_discovery_scan(payload: ScanRequest):
    """
    Direct scan endpoint: Invokes Discovery + Risk Ranking agents for an individual user footprint.
    """
    try:
        logger.info(f"Executing discovery scan for user {payload.user_email}")
        
        # 1. Breach scan
        breaches = scan_hibp_breaches(payload.user_email)
        
        # 2. Broker scan
        brokers = query_relevant_brokers(user_state=payload.user_state or "CA", user_country=payload.user_country or "US")
        
        # 3. Categorize & Score
        all_categories = set()
        breach_exposures = []
        for b in breaches:
            cats = [dc.lower().replace(" ", "_") for dc in b.get("DataClasses", [])]
            all_categories.update(cats)
            breach_exposures.append({
                "sourceType": "breach",
                "sourceName": b.get("Title", b.get("Name", "Data Breach")),
                "domain": b.get("Domain", ""),
                "exposedDataCategories": cats,
                "rawBreachDetails": b,
                "discoveredAt": datetime.utcnow().isoformat()
            })
            
        broker_exposures = []
        for br in brokers:
            cats = br.get("dataTypesCollected", ["name", "email", "address"])
            all_categories.update(cats)
            broker_exposures.append({
                "sourceType": "broker",
                "sourceName": br.get("name"),
                "brokerId": br.get("_id"),
                "domain": br.get("domain"),
                "category": br.get("category"),
                "contactEmail": br.get("contactEmail"),
                "optOutUrl": br.get("optOutUrl"),
                "removalDifficulty": br.get("removalDifficulty", "medium"),
                "exposedDataCategories": cats,
                "responseSlaDays": br.get("responseSlaDays", 45),
                "discoveredAt": datetime.utcnow().isoformat()
            })
            
        # Calculate composite risk score
        cat_count = len(all_categories)
        raw_score = min(96, max(24, int(len(breach_exposures) * 14 + len(broker_exposures) * 6 + cat_count * 3)))
        severity = "critical" if raw_score >= 75 else "high" if raw_score >= 55 else "medium" if raw_score >= 35 else "low"
        
        return {
            "success": True,
            "data": {
                "overallRiskScore": raw_score,
                "severity": severity,
                "totalExposures": len(breach_exposures) + len(broker_exposures),
                "breachExposures": breach_exposures,
                "brokerExposures": broker_exposures,
                "exposedDataCategories": sorted(list(all_categories)),
                "scannedAt": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        logger.error(f"Discovery scan error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pipeline/start-case")
def start_case_pipeline(payload: CaseStartRequest):
    """
    Initializes a LangGraph StateGraph pipeline run for a targeted broker case.
    Executes through Discovery, Risk Ranking, and Legal Drafting, then pauses at Human Approval.
    """
    try:
        thread_id = f"thread_{payload.case_number}_{uuid.uuid4().hex[:8]}"
        config = {"configurable": {"thread_id": thread_id}}
        graph = get_compiled_graph()
        
        initial_state: CaseState = {
            "case_id": None,
            "case_number": payload.case_number,
            "user_id": payload.user_id,
            "user_name": payload.user_name,
            "user_email": payload.user_email,
            "user_phone": payload.user_phone,
            "user_state": payload.user_state or "CA",
            "user_city": "",
            "broker_id": payload.broker_id,
            "broker_name": payload.broker_name,
            "broker_email": payload.broker_email,
            "broker_category": payload.broker_category or "People Search",
            "legal_framework": payload.legal_framework or "CCPA",
            "breach_exposures": [],
            "broker_exposures": [],
            "exposed_data_categories": payload.exposed_data_categories or ["name", "email", "address", "phone"],
            "risk_score": 0.0,
            "risk_severity": "medium",
            "risk_justification": "",
            "sensitivity_factors": [],
            "drafted_letter": {},
            "user_edited_body": None,
            "approved": None,
            "rejection_reason": None,
            "approval_timestamp": None,
            "dispatched": False,
            "dispatch_metadata": None,
            "response_deadline": None,
            "followup_count": 0,
            "overdue": False,
            "escalation_letter": None,
            "agent_trail": [],
            "current_step": "init"
        }
        
        # Run graph until pause (interrupt_before=["executor_agent"])
        result = graph.invoke(initial_state, config=config)
        
        return {
            "success": True,
            "threadId": thread_id,
            "state": result
        }
    except Exception as e:
        logger.error(f"Pipeline start error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pipeline/resume")
def resume_case_pipeline(payload: CaseResumeRequest):
    """
    Resumes a paused case thread after human approval / rejection / customization.
    """
    try:
        config = {"configurable": {"thread_id": payload.thread_id}}
        graph = get_compiled_graph()
        
        updates = {
            "approved": payload.approved,
            "user_edited_body": payload.user_edited_body,
            "rejection_reason": payload.rejection_reason,
            "approval_timestamp": datetime.utcnow().isoformat()
        }
        
        # Update state and resume execution
        graph.update_state(config, updates)
        result = graph.invoke(None, config=config)
        
        return {
            "success": True,
            "threadId": payload.thread_id,
            "state": result
        }
    except Exception as e:
        logger.error(f"Pipeline resume error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pipeline/followup")
def run_followup_audit(payload: FollowupRequest):
    """
    Executes the Follow-up Agent node to audit response windows and draft escalation.
    """
    try:
        from agents.followup_agent import followup_agent_node
        
        dummy_state: CaseState = {
            "case_number": payload.case_number,
            "broker_name": payload.broker_name,
            "broker_email": payload.broker_email,
            "user_name": payload.user_name,
            "user_email": payload.user_email,
            "legal_framework": payload.legal_framework or "CCPA",
            "followup_count": payload.followup_count or 0,
            "agent_trail": []
        } # type: ignore
        
        res = followup_agent_node(dummy_state)
        return {
            "success": True,
            "data": res
        }
    except Exception as e:
        logger.error(f"Followup audit error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
