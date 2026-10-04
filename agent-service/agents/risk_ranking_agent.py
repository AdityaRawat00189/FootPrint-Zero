import os
import logging
from datetime import datetime
from typing import Dict, Any
from graph.state import CaseState, AgentStepLog

logger = logging.getLogger("FootprintZero.RiskRankingAgent")

CATEGORY_WEIGHTS = {
    "ssn": 30,
    "ssn_fragment": 25,
    "passwords": 25,
    "hashed_passwords": 20,
    "credit_rating_indicators": 20,
    "financial": 20,
    "financial_records": 20,
    "court_records": 18,
    "criminal_history": 18,
    "dates_of_birth": 15,
    "phone": 12,
    "phone_numbers": 12,
    "mobile_phone": 12,
    "physical_addresses": 10,
    "address_history": 10,
    "current_address": 10,
    "relatives": 8,
    "work_histories": 6,
    "email": 5,
    "email_addresses": 5,
}

def risk_ranking_agent_node(state: CaseState) -> Dict[str, Any]:
    """
    Risk Ranking Agent:
    Evaluates discovered breach vectors and data broker aggregations to calculate
    an objective sensitivity score (0-100) and identify priority removal targets.
    """
    breach_exposures = state.get("breach_exposures", [])
    broker_exposures = state.get("broker_exposures", [])
    all_categories = state.get("exposed_data_categories", [])
    
    logger.info(f"[RiskRankingAgent] Ranking risk for {len(breach_exposures)} breaches and {len(broker_exposures)} brokers")
    
    # Calculate category score
    category_score = 0
    matched_high_risk = []
    
    for cat in all_categories:
        cat_clean = cat.lower().replace(" ", "_")
        weight = CATEGORY_WEIGHTS.get(cat_clean, 4)
        category_score += weight
        if weight >= 15:
            matched_high_risk.append(cat.replace("_", " ").title())
            
    # Calculate volume score
    volume_score = (len(breach_exposures) * 12) + (len(broker_exposures) * 8)
    
    # Composite risk score bounded 0-100
    raw_score = min(98, max(15, int(category_score * 0.45 + volume_score * 0.55)))
    
    if raw_score >= 75:
        severity = "critical"
    elif raw_score >= 55:
        severity = "high"
    elif raw_score >= 35:
        severity = "medium"
    else:
        severity = "low"
        
    justification = (
        f"Assessed composite exposure footprint: {len(breach_exposures)} public security breaches and "
        f"{len(broker_exposures)} commercial data broker entries. "
        f"Identified {len(matched_high_risk)} critical sensitivity data vectors ({', '.join(matched_high_risk[:4]) if matched_high_risk else 'Contact Details & Identifiers'}) "
        f"warranting immediate statutory deletion filings."
    )
    
    step_log: AgentStepLog = {
        "step": "risk_ranking",
        "title": "Privacy Risk Ranked",
        "agentName": "Risk Ranking Agent",
        "status": "completed",
        "message": f"Assigned Risk Score {raw_score}/100 ({severity.upper()}). Identified {len(matched_high_risk)} elevated risk vector attributes.",
        "details": {
            "score": raw_score,
            "severity": severity,
            "highRiskAttributes": matched_high_risk,
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    existing_trail = state.get("agent_trail", []) or []
    
    return {
        "risk_score": float(raw_score),
        "risk_severity": severity,
        "risk_justification": justification,
        "sensitivity_factors": matched_high_risk,
        "current_step": "risk_ranking",
        "agent_trail": existing_trail + [step_log]
    }
