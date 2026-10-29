import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger("FootprintZero.BrokerDBTool")

def get_mongo_client():
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri or mongo_uri.startswith("<"):
        raise ValueError("MONGODB_URI not configured in agent-service/.env")
    from pymongo import MongoClient
    return MongoClient(mongo_uri)

def query_relevant_brokers(user_state: str = "DL", user_country: str = "IN") -> List[Dict[str, Any]]:
    """
    Finds active data brokers matching the user's jurisdiction (DPDPA for India, CCPA for US, GDPR for EU).
    """
    try:
        client = get_mongo_client()
        db = client.get_database("footprintzero")
        collection = db["brokers"]
        
        country = (user_country or "IN").upper()
        if country in ["IN", "INDIA"]:
            jurisdiction = "DPDPA"
        elif country == "US":
            jurisdiction = "CCPA"
        else:
            jurisdiction = "GDPR"
        
        query = {
            "verified": True,
            "jurisdictionsSupported": jurisdiction
        }
        
        cursor = collection.find(query).limit(12)
        brokers = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            brokers.append(doc)
            
        client.close()
        if brokers:
            logger.info(f"Retrieved {len(brokers)} matching data brokers for jurisdiction {jurisdiction}")
            return brokers
    except Exception as e:
        logger.error(f"Error querying brokers collection: {str(e)}")
        
    # High-quality in-memory defaults for India + Global platforms used in India
    logger.info("Using India & Global aggregator fallback dataset.")
    return [
        {
            "_id": "mock_truecaller_1",
            "name": "Truecaller India",
            "domain": "truecaller.com",
            "category": "People Search",
            "contactEmail": "privacy@truecaller.com",
            "dataTypesCollected": ["name", "phone", "email", "address_tags", "contacts"],
            "jurisdictionsSupported": ["DPDPA", "GDPR", "CCPA"],
            "removalDifficulty": "easy",
            "responseSlaDays": 30
        },
        {
            "_id": "mock_justdial_2",
            "name": "Justdial Limited",
            "domain": "justdial.com",
            "category": "People Search",
            "contactEmail": "grievance@justdial.com",
            "dataTypesCollected": ["name", "phone", "address", "business_name", "location"],
            "jurisdictionsSupported": ["DPDPA"],
            "removalDifficulty": "medium",
            "responseSlaDays": 30
        },
        {
            "_id": "mock_cibil_3",
            "name": "TransUnion CIBIL Limited",
            "domain": "transunioncibil.com",
            "category": "Financial & Credit",
            "contactEmail": "nodalofficer@transunioncibil.com",
            "dataTypesCollected": ["name", "pan", "phone", "address_history", "cibil_score"],
            "jurisdictionsSupported": ["DPDPA"],
            "removalDifficulty": "hard",
            "responseSlaDays": 30
        },
        {
            "_id": "mock_apollo_4",
            "name": "Apollo.io (ZenProspect)",
            "domain": "apollo.io",
            "category": "B2B & Sales Intelligence",
            "contactEmail": "privacy@apollo.io",
            "dataTypesCollected": ["work_email", "phone", "job_title", "company"],
            "jurisdictionsSupported": ["DPDPA", "CCPA", "GDPR"],
            "removalDifficulty": "easy",
            "responseSlaDays": 30
        },
        {
            "_id": "mock_naukri_5",
            "name": "Naukri / Info Edge India",
            "domain": "naukri.com",
            "category": "B2B & Sales Intelligence",
            "contactEmail": "privacy@infoedge.in",
            "dataTypesCollected": ["name", "resume_data", "phone", "work_histories", "salary"],
            "jurisdictionsSupported": ["DPDPA"],
            "removalDifficulty": "medium",
            "responseSlaDays": 30
        }
    ]
