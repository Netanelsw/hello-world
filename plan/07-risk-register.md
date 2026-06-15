# 07 — Risk Register

**Goal:** Surface what can sink the recovery and how each risk is owned and mitigated.
Compliance, platform dependence, and reporting trust are the headline categories.

## 7.1 Register
| Risk | Category | Likelihood | Impact | Owner | Mitigation | Status |
|------|----------|------------|--------|-------|------------|--------|
| Paid/boosted-ad disqualification hits Associates tags | Compliance | | High | | AM verification before any paid traffic touches tags | open |
| Associates + Attribution/pixel cross-contamination | Compliance | | High | | Hard separation of traffic paths | |
| Amazon cuts deeper / terminates programs | Platform dependence | | | | Diversification (04) | |
| CPC adoption stalls — partners won't migrate | Commercial | | | | POC proof points, pause/remove laggards | |
| Reporting-trust breakdown with partners | Reporting | | | | Portal as transparency asset, clean click data | |
| Single-marketplace concentration persists | Platform dependence | | | | Gated diversification sequence | |
| Solo dev/BI dependency (Daniel) | Operational | | | | | |
| Misrepresenting Amazon data as brand-direct | Compliance | | High | | Frame click data as Kibeeri-owned, never Amazon sales | |

## 7.2 Compliance hard lines (from CLAUDE.md §6)
- Never combine Associates tags with Attribution tags / external pixels on same traffic.
- No CPA/CPS billing outside US unless ASIN-level attribution defensible.
- Don't imply Kibeeri is Amazon; affiliate disclosure on every page.
- Paid/boosted-ad clause = gating item, AM-verified.

## 7.3 Output of this doc
A live register reviewed at each milestone in 08. Top 3 risks escalated to founders.
