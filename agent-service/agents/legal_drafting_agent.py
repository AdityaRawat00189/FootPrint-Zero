import os
import logging
from datetime import datetime
from typing import Dict, Any
from graph.state import CaseState, AgentStepLog
from rag.vector_store import get_legal_rag_store

logger = logging.getLogger("FootprintZero.LegalDraftingAgent")

def generate_legal_letter_text(
    user_name: str,
    user_email: str,
    user_phone: str,
    user_state: str,
    target_broker_name: str,
    target_broker_email: str,
    framework: str,
    categories: list,
    clauses: list,
    rejection_reason: str = None
) -> tuple[str, str, list]:
    
    subject = f"FORMAL NOTICE: Consumer Personal Data Erasure & Opt-Out Request ({framework}) - {user_name}"
    
    clause_titles = [c.get("title", "") for c in clauses]
    citations_text = "\n\n".join([f"• {c.get('content', '')}" for c in clauses])
    categories_str = ", ".join(categories) if categories else "All commercial identifiers, contact information, and profiling metadata"
    
    revision_notice = ""
    if rejection_reason:
        revision_notice = f"\n[REVISED DRAFT PER USER SPECIFICATIONS: {rejection_reason}]\n"
        
    date_str = datetime.utcnow().strftime("%B %d, %Y")

    if framework == "DPDPA":
        subject = f"FORMAL NOTICE: Statutory Personal Data Erasure & Consent Revocation (DPDPA 2023) - {user_name}"
        body = f"""DATE: {date_str}
TO: Data Protection Officer / Grievance Redressal Officer
ENTITY: {target_broker_name} <{target_broker_email}>
FROM: {user_name} <{user_email}>
LOCATION: {user_state}, India

SUBJECT: FORMAL DEMAND FOR PERMANENT PERSONAL DATA ERASURE & REVOCATION OF PROCESSING CONSENT UNDER THE DIGITAL PERSONAL DATA PROTECTION ACT, 2023
{revision_notice}
Dear Grievance Redressal Officer,

I am writing to formally exercise my statutory rights as a Data Principal under the Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023 - DPDPA).

I formally demand that {target_broker_name} immediately execute the following statutory actions across all active, backup, and downstream databases:

1. PERMANENT ERASURE OF PERSONAL DATA (SECTION 12):
Permanently and completely delete all personal data, contact records, location history, and profiling attributes associated with me, including:
- Primary Data Principal Identifiers: {user_name}, {user_email}, {user_phone if user_phone else '[Associated Mobile Records]'}
- Discovered Categories: {categories_str}

2. UNCONDITIONAL REVOCATION OF CONSENT (SECTION 6(4)):
I hereby withdraw and revoke all consent previously granted for processing, collecting, commercializing, or transferring my personal data. All processing by your organization and commercial affiliates must cease immediately.

3. DOWNSTREAM PROCESSOR & THIRD-PARTY PURGING:
Direct all commercial partners, data buyers, telemarketers, and cloud data processors who received my personal data to permanently purge these records.

4. TELECOM & COMMERCIAL SCRUBBING (TRAI TCCCPR):
Ensure my registered mobile number is scrubbed from all telemarketing lists, lead aggregations, and outbound dialer queues.

APPLICABLE STATUTORY CITATIONS:
{citations_text}

STATUTORY COMPLIANCE DEADLINE:
Under Section 13 of the DPDPA 2023, you are required to acknowledge receipt and provide written confirmation of completed data erasure within thirty (30) calendar days. Failure to timely execute this request will result in a formal complaint filed directly with the Data Protection Board of India (DPBI), which is empowered to levy statutory penalties of up to INR 250 Crores under Section 33.

Please confirm compliance via email to {user_email}.

Sincerely,

{user_name}
Data Principal (India)
Email: {user_email}
"""
    else:
        subject = f"FORMAL NOTICE: Consumer Personal Data Erasure & Opt-Out Request ({framework}) - {user_name}"
        body = f"""DATE: {date_str}
TO: Data Protection / Privacy Compliance Officer
ENTITY: {target_broker_name} <{target_broker_email}>
FROM: {user_name} <{user_email}>
LOCATION: {user_state}, United States

SUBJECT: FORMAL DEMAND FOR PERMANENT PERSONAL DATA ERASURE AND DO-NOT-SELL/SHARE DIRECTIVE UNDER {framework}
{revision_notice}
Dear Privacy Compliance Team,

I am writing to formally exercise my statutory privacy rights under the {framework} (including applicable provisions of California Civil Code § 1798.100 et seq. / Regulation (EU) 2016/679).

I demand that {target_broker_name} immediately take the following actions regarding all records, profiles, and datasets associated with me:

1. PERMANENT DELETION & ERASURE:
Permanently and completely delete all personal information, consumer records, demographic profiles, and inferred data attributes associated with me, including but not limited to:
- Primary Identifiers: {user_name}, {user_email}, {user_phone if user_phone else '[Associated Phone Records]'}
- Discovered Categories: {categories_str}

2. MANDATORY DOWNSTREAM PROPAGATION:
Direct all service providers, contractors, data partners, and commercial affiliates with whom you have shared or sold my data to permanently purge these records from their active and archival databases.

3. PERMANENT 'DO NOT SELL OR SHARE' OPT-OUT:
Record an irrevocable opt-out directive against my identifiers to prevent future scraping, aggregation, commercial profiling, or indexing.

APPLICABLE STATUTORY CITATIONS:
{citations_text}

STATUTORY COMPLIANCE TIMELINE:
Under applicable law, you are required to acknowledge receipt within 10 business days and fully execute this verified deletion request within 45 calendar days.

Please provide written confirmation of completed erasure and confirmation of downstream vendor notices to {user_email}.

Sincerely,

{user_name}
Consumer & Verified Data Subject
Email: {user_email}
"""
    return subject, body, clause_titles

def legal_drafting_agent_node(state: CaseState) -> Dict[str, Any]:
    """
    Legal Drafting Agent:
    RAG-powered synthesis of enforceable statutory deletion notices (CCPA/GDPR)
    referencing retrieved legal clauses and specific exposure vectors.
    """
    user_name = state.get("user_name", "Valued User")
    user_email = state.get("user_email", "")
    user_phone = state.get("user_phone", "")
    user_state = state.get("user_state", "CA")
    broker_name = state.get("broker_name", "Data Broker Compliance Team")
    broker_email = state.get("broker_email", "privacy@broker.com")
    framework = state.get("legal_framework", "DPDPA")
    categories = state.get("exposed_data_categories", [])
    rejection_reason = state.get("rejection_reason")
    
    logger.info(f"[LegalDraftingAgent] Drafting {framework} letter for {broker_name} (Subject: {user_name})")
    
    # 1. Retrieve statutory clauses via ChromaDB RAG
    rag_store = get_legal_rag_store()
    clauses = rag_store.retrieve_clauses(framework=framework, query=f"{framework} deletion opt-out broker demand", top_k=3)
    
    # 2. Check for Gemini / OpenAI / Anthropic key
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip() or os.getenv("GOOGLE_API_KEY", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    
    body = None
    subject = None
    clause_titles = [c.get("title", "") for c in clauses]
    
    if gemini_key and not gemini_key.startswith("<"):
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""You are a certified privacy attorney and Data Protection Officer drafting a formal, legally enforceable data erasure and opt-out demand letter under {framework} (India's Digital Personal Data Protection Act 2023 / CCPA / GDPR).
            
User Information:
- Name: {user_name}
- Email: {user_email}
- Phone: {user_phone or '[On File]'}
- State/Jurisdiction: {user_state}, {'India' if framework == 'DPDPA' else 'United States'}

Target Entity / Broker:
- Entity: {broker_name}
- Contact Email: {broker_email}

Discovered Exposed Categories: {', '.join(categories)}

Statutory Citations to Include:
{chr(10).join([c.get('content', '') for c in clauses])}

User Revision Notes (if any): {rejection_reason or 'None'}

Draft the full formal legal notice demanding complete data erasure, downstream vendor purging, and irrevocable opt-out. For DPDPA (India), mandate 30-day compliance and cite the Data Protection Board of India (DPBI) with penalties up to ₹250 Crores. For CCPA/GDPR, mandate statutory 45/30-day compliance. Output ONLY the raw letter text ready to dispatch."""

            response = model.generate_content(prompt)
            if response and response.text:
                body = response.text.strip()
                subject = f"FORMAL NOTICE: Statutory Personal Data Erasure Request ({framework}) - {user_name}"
                logger.info("Successfully synthesized legal letter using Google Gemini LLM.")
        except Exception as e:
            logger.warning(f"Gemini LLM generation fallback: {str(e)}")

    if not body:
        subject, body, clause_titles = generate_legal_letter_text(
            user_name=user_name,
            user_email=user_email,
            user_phone=user_phone,
            user_state=user_state,
            target_broker_name=broker_name,
            target_broker_email=broker_email,
            framework=framework,
            categories=categories,
            clauses=clauses,
            rejection_reason=rejection_reason
        )
    
    step_log: AgentStepLog = {
        "step": "legal_drafting",
        "title": "Enforceable Legal Demand Drafted",
        "agentName": "Legal Drafting Agent",
        "status": "completed",
        "message": f"Generated formal {framework} statutory deletion notice referencing {len(clause_titles)} statutory provisions. Ready for human review.",
        "details": {
            "framework": framework,
            "targetBroker": broker_name,
            "clausesUsed": clause_titles,
            "isRevision": bool(rejection_reason)
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    
    existing_trail = state.get("agent_trail", []) or []
    
    return {
        "drafted_letter": {
            "subject": subject,
            "body": body,
            "legal_clauses": clause_titles,
            "generatedAt": datetime.utcnow().isoformat()
        },
        "approved": None, # Reset approval status so human approval gate pauses execution
        "current_step": "legal_drafting",
        "agent_trail": existing_trail + [step_log]
    }
