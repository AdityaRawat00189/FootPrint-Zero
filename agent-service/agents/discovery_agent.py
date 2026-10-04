import logging
from datetime import datetime
from typing import Dict, Any
from graph.state import CaseState, AgentStepLog
from tools.hibp_tool import scan_hibp_breaches
from tools.broker_db_tool import query_relevant_brokers

logger = logging.getLogger("FootprintZero.DiscoveryAgent")

def discovery_agent_node(state: CaseState) -> Dict[str, Any]:
    """
    Discovery Agent:
    Scans public exposure surfaces (HIBP breaches) and matches profile attributes
    against the CA Data Broker Registry to build a comprehensive exposure map.
    """
    user_email = state.get("user_email")
    user_state = state.get("user_state", "CA")
    user_name = state.get("user_name", "User")
    
    logger.info(f"[DiscoveryAgent] Initiating footprint scan for {user_email} (Jurisdiction: {user_state})")
    
    # 1. Query Breach intelligence
    breaches = scan_hibp_breaches(user_email)
    breach_exposures = []
    all_categories = set()
    
    for b in breaches:
        categories = [dc.lower().replace(" ", "_") for dc in b.get("DataClasses", [])]
        all_categories.update(categories)
        breach_exposures.append({
            "sourceType": "breach",
            "sourceName": b.get("Title", b.get("Name", "Data Breach")),
            "domain": b.get("Domain", ""),
            "exposedDataCategories": categories,
            "rawBreachDetails": {
                "breachDate": b.get("BreachDate"),
                "pwnCount": b.get("PwnCount", 0),
                "description": b.get("Description", ""),
                "isVerified": b.get("IsVerified", True),
                "isSensitive": b.get("IsSensitive", False),
                "dataClasses": b.get("DataClasses", [])
            },
            "discoveredAt": datetime.utcnow().isoformat()
        })
    
    # 2. Query Data Broker intelligence
    brokers = query_relevant_brokers(user_state=user_state)
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
    
    step_log: AgentStepLog = {
        "step": "discovery",
        "title": "Digital Footprint Discovered",
        "agentName": "Discovery Agent",
        "status": "completed",
        "message": f"Identified {len(breach_exposures)} breach exposures and {len(broker_exposures)} active broker profiles holding personal data categories: {', '.join(list(all_categories)[:5])}.",
        "details": {
            "breachCount": len(breach_exposures),
            "brokerCount": len(broker_exposures),
            "totalCategories": len(all_categories),
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    existing_trail = state.get("agent_trail", []) or []
    
    return {
        "breach_exposures": breach_exposures,
        "broker_exposures": broker_exposures,
        "exposed_data_categories": sorted(list(all_categories)),
        "current_step": "discovery",
        "agent_trail": existing_trail + [step_log]
    }
