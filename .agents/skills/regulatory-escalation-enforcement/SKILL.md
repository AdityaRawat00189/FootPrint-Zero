---
name: regulatory-escalation-enforcement
description: Statutory compliance auditing and automated regulatory escalation procedures for overdue data broker deletion demands.
---

# Regulatory Escalation & Enforcement Skill

## Purpose
Directs the Follow-up Agent and daily `node-cron` scheduler to audit response windows and generate formal regulatory complaints against non-compliant entities.

## Escalation Triggers
1. **45-Day Statutory Window Elapsed**: Data controller failed to confirm complete erasure within the CCPA / GDPR SLA.
2. **Missing Downstream Propagation**: Lack of proof regarding vendor record purging.

## Regulatory Authorities Cited
- **California Privacy Protection Agency (CPPA)**: Administrative fines and statutory enforcement under SB 362 & Cal. Civ. Code § 1798.199.
- **Federal Trade Commission (FTC)**: Section 5 unfair and deceptive trade practices filings.
- **EU Data Protection Authorities (DPAs)**: Article 83 administrative fines under GDPR.

## Escalation Output
- Drafts an urgent formal notice giving the non-compliant broker **5 business days** before formal administrative filing.
- Increments audit history and updates case status to `escalated`.
