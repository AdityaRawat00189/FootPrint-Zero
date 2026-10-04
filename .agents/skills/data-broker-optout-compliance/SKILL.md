---
name: data-broker-optout-compliance
description: Verification workflows and opt-out registry standards under California SB 362 (DELETE Act) and Cal. Civ. Code § 1798.120.
---

# Data Broker Opt-Out & Registry Compliance Skill

## Purpose
Directs autonomous multi-agent identification and removal requests targeting registered commercial data brokers, people-search engines, and credit/marketing data aggregators.

## Key Statutory Mechanisms
1. **California Data Broker Registry (OAG / CPPA)**:
   - Data brokers registered under California Civ. Code § 1798.99.80 must maintain accessible consumer opt-out mechanisms.
2. **California DELETE Act (SB 362)**:
   - Requires registered brokers to continuously execute deletion requests and cease re-indexing consumer profiles every 45 days.
3. **Opt-Out of Sale / Sharing (§ 1798.120)**:
   - Demands irrevocable suppression flags across both online behavioral trackers and offline compiled datasets.

## Agent Execution Pattern
- Cross-reference discovered user attributes against verified broker list (e.g. Acxiom, LexisNexis, Whitepages, Apollo.io).
- Prioritize entities by `removalDifficulty` and statutory response SLAs.
