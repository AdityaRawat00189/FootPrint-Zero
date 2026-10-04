---
name: data-breach-risk-assessment
description: Sensitivity matrix and composite risk scoring for credential leaks, PII breaches, and aggregated public exposure vectors.
---

# Data Breach Risk Assessment Skill

## Purpose
Quantifies consumer privacy vulnerability (0-100 score) across breach intelligence (HIBP) and commercial broker aggregations to prioritize statutory deletion targets.

## Sensitivity Weight Matrix
- **Critical Risk (Weight 25-30)**: Social Security Numbers, plaintext / hashed passwords, credit indicators, financial accounts.
- **High Risk (Weight 18-20)**: Court records, criminal history records, dates of birth.
- **Elevated Risk (Weight 10-15)**: Physical addresses, address history, mobile numbers, family/relatives.
- **Moderate Risk (Weight 5-8)**: Work history, job titles, public email addresses.

## Score Thresholds
- **Critical Severity (75-100)**: Immediate statutory erasure notices dispatched.
- **High Severity (55-74)**: Prioritized deletion queue with mandatory downstream vendor notice.
- **Moderate Severity (35-54)**: Standard opt-out and suppression list filings.
- **Low Severity (0-34)**: Baseline monitoring.
