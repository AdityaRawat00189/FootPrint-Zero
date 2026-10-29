LEGAL_KNOWLEDGE_BASE = [
    # --- INDIA: DIGITAL PERSONAL DATA PROTECTION ACT, 2023 (DPDPA 2023) ---
    {
        "id": "dpdpa_sec12_erasure",
        "framework": "DPDPA",
        "title": "DPDPA 2023 Section 12(1) & (3) - Right to Erasure of Personal Data",
        "content": (
            "Under Section 12 of the Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023), "
            "a Data Principal has the statutory right to the erasure of their personal data. As the Data Fiduciary "
            "or commercial Data Processor, you are legally mandated to erase all personal data, contact identifiers, "
            "financial profiles, and behavioral metadata concerning me that are no longer necessary for the purpose "
            "for which they were processed, and direct all downstream Data Processors to permanently purge the same."
        ),
        "tags": ["dpdpa", "section_12", "erasure", "india", "data_principal", "right_to_be_forgotten"]
    },
    {
        "id": "dpdpa_sec6_consent_revocation",
        "framework": "DPDPA",
        "title": "DPDPA 2023 Section 6(4) - Revocation of Processing Consent",
        "content": (
            "Pursuant to Section 6(4) of the Digital Personal Data Protection Act, 2023, I hereby exercise my "
            "unconditional right to withdraw all consent previously granted for the processing, collection, profiling, "
            "commercial indexing, or transmission of my personal data. Upon receipt of this notice, all processing "
            "by you and your downstream partners must immediately cease."
        ),
        "tags": ["dpdpa", "section_6", "consent", "revocation", "opt_out", "india"]
    },
    {
        "id": "dpdpa_sec13_grievance_sla",
        "framework": "DPDPA",
        "title": "DPDPA 2023 Section 13 - Mandatory Grievance Redressal & 30-Day SLA",
        "content": (
            "Under Section 13 of the DPDPA 2023, your designated Data Protection Officer / Grievance Redressal Officer "
            "is required to acknowledge this request and provide confirmation of completed erasure within thirty (30) "
            "calendar days. Failure to resolve this statutory demand will result in immediate complaint escalation "
            "to the Data Protection Board of India (DPBI)."
        ),
        "tags": ["dpdpa", "section_13", "grievance", "dpo", "dpbi", "deadline", "sla"]
    },
    {
        "id": "dpdpa_sec33_penalties",
        "framework": "DPDPA",
        "title": "DPDPA 2023 Section 33 & Schedule - Regulatory Fines up to ₹250 Crores",
        "content": (
            "Notice is hereby given that under Section 33 read with the Schedule of the DPDPA 2023, failure to implement "
            "adequate security safeguards or intentional non-compliance with Data Principal erasure and privacy rights "
            "empowers the Data Protection Board of India (DPBI) to impose financial penalties of up to INR 250 Crores "
            "(₹2,500,000,000)."
        ),
        "tags": ["dpdpa", "penalties", "dpbi", "enforcement", "fine"]
    },
    {
        "id": "trai_tcccpr_dnd",
        "framework": "DPDPA",
        "title": "TRAI TCCCPR Regulations - National Do Not Disturb (DND) Suppression",
        "content": (
            "In accordance with the Telecom Regulatory Authority of India (TRAI) Telecom Commercial Communications "
            "Customer Preference Regulations (TCCCPR), my registered telephone number must be scrubbed from all commercial "
            "telemarketing lists, outbound dialer datasets, and lead distribution networks."
        ),
        "tags": ["trai", "dnd", "telemarketing", "suppression", "india", "mobile"]
    },

    # --- USA: CALIFORNIA CONSUMER PRIVACY ACT (CCPA / CPRA / SB 362) ---
    {
        "id": "ccpa_1798_105_deletion",
        "framework": "CCPA",
        "title": "CCPA/CPRA Cal. Civ. Code § 1798.105 - Mandatory Deletion",
        "content": (
            "Pursuant to the California Consumer Privacy Act of 2018 as amended by the California Privacy "
            "Rights Act (CPRA), Cal. Civ. Code § 1798.105, I hereby demand that you permanently delete all personal "
            "information you have collected, aggregated, inferred, or maintained concerning me, and direct all service "
            "providers, contractors, and third-party recipients to delete my personal information from their records."
        ),
        "tags": ["deletion", "ccpa", "cpra", "california", "erasure"]
    },
    {
        "id": "ccpa_1798_120_optout",
        "framework": "CCPA",
        "title": "CCPA Cal. Civ. Code § 1798.120 - Do Not Sell or Share",
        "content": (
            "Under Cal. Civ. Code § 1798.120 and 16 CCR § 7026, I formally exercise my right to opt out of the sale, "
            "sharing, cross-context behavioral advertising, and profiling of my personal information. Please register "
            "a permanent opt-out flag across all matching identifier records."
        ),
        "tags": ["opt_out", "sale", "sharing", "ccpa", "advertising"]
    },
    {
        "id": "ccpa_1798_130_sla",
        "framework": "CCPA",
        "title": "CCPA Cal. Civ. Code § 1798.130 - 45-Day Statutory Deadline & Verification",
        "content": (
            "Under Cal. Civ. Code § 1798.130(a)(2), you are legally required to confirm receipt within 10 business days "
            "and fulfill this verifiable consumer deletion request within forty-five (45) calendar days free of charge. "
            "Failure to timely comply may result in statutory enforcement actions by the California Privacy Protection Agency (CPPA)."
        ),
        "tags": ["deadline", "sla", "enforcement", "cppa", "45_days"]
    },
    {
        "id": "ca_delete_act_sb362",
        "framework": "CCPA",
        "title": "California Senate Bill 362 (DELETE Act) Compliance Mandate",
        "content": (
            "As a registered Data Broker subject to California Civil Code § 1798.99.80 et seq., you are obligated to "
            "execute consumer deletion requests across all commercial data repositories and prevent future re-acquisition "
            "or re-indexing of consumer identifiers."
        ),
        "tags": ["data_broker", "registry", "sb362", "delete_act"]
    },

    # --- EUROPEAN UNION: GENERAL DATA PROTECTION REGULATION (GDPR) ---
    {
        "id": "gdpr_art17_erasure",
        "framework": "GDPR",
        "title": "GDPR Article 17 - Right to Erasure ('Right to be Forgotten')",
        "content": (
            "Pursuant to Article 17 of the General Data Protection Regulation (Regulation (EU) 2016/679 - GDPR), "
            "I hereby request the immediate and total erasure of all personal data concerning me held by your "
            "organization as the data controller, having withdrawn any implied consent and objecting to processing under Article 21."
        ),
        "tags": ["gdpr", "article_17", "erasure", "eu", "right_to_be_forgotten"]
    },
    {
        "id": "gdpr_art12_sla",
        "framework": "GDPR",
        "title": "GDPR Article 12(3) - One-Month Compliance Window",
        "content": (
            "In accordance with Article 12(3) GDPR, you are required to provide information on action taken on this request "
            "without undue delay and in any event within one month of receipt of the request."
        ),
        "tags": ["gdpr", "article_12", "deadline", "sla", "one_month"]
    }
]
