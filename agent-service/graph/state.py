from typing import Annotated, Dict, List, Optional, Any
from typing_extensions import TypedDict
import operator

class AgentStepLog(TypedDict):
    step: str
    title: str
    agentName: str
    status: str
    message: str
    details: Dict[str, Any]
    timestamp: str

class CaseState(TypedDict):
    case_id: Optional[str]
    case_number: Optional[str]
    user_id: str
    user_name: str
    user_email: str
    user_phone: Optional[str]
    user_state: Optional[str]
    user_city: Optional[str]
    
    # Target Broker / Entity
    broker_id: Optional[str]
    broker_name: str
    broker_email: str
    broker_category: str
    legal_framework: str # 'CCPA' or 'GDPR'
    
    # Discovery data
    breach_exposures: List[Dict[str, Any]]
    broker_exposures: List[Dict[str, Any]]
    exposed_data_categories: List[str]
    
    # Risk Ranking
    risk_score: float
    risk_severity: str # 'low', 'medium', 'high', 'critical'
    risk_justification: str
    sensitivity_factors: List[str]
    
    # Legal Drafting
    drafted_letter: Dict[str, Any] # {'subject': str, 'body': str, 'legal_clauses': List[str]}
    user_edited_body: Optional[str]
    
    # Human Approval Gate
    approved: Optional[bool]
    rejection_reason: Optional[str]
    approval_timestamp: Optional[str]
    
    # Execution
    dispatched: bool
    dispatch_metadata: Optional[Dict[str, Any]]
    response_deadline: Optional[str]
    
    # Follow-up & Escalation
    followup_count: int
    overdue: bool
    escalation_letter: Optional[Dict[str, Any]]
    
    # Audit Trail (Annotated with operator.add or list replacement)
    agent_trail: List[AgentStepLog]
    current_step: str
