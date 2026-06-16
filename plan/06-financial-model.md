# 06 — Financial Model

**Goal:** Directional floor-case model across all four test tracks. Every forward number is directional — not a commitment. Fill from real data as tests produce results.

---

## 6.1 Modeling rules

- **Floor-first.** Build the worst-credible case before any upside.
- **Separate the tracks.** Associates decline and new-revenue ramps are different lines — never net them.
- **PPC payback is non-linear.** Cutting long-tail ad spend doesn't map 1:1 to lost revenue — a portion was unprofitable or unmeasurable. The freed budget going to short-tail may recover more than it costs.
- **Mark every assumption.** Tie inputs to the diagnosis (01) and each test doc (02–05).
- **Projections are directional, not commitments** — this caveat applies to every table below.

---

## 6.2 Current state baseline (fill from Hex)

| Line | Monthly (current) | Source |
|------|-------------------|--------|
| Associates commissions earned | `[VERIFY]` | Hex / Amazon reporting |
| Ad spend (PPC + social) | ~$1–3M | internal |
| Other operating costs | `[VERIFY]` | internal |
| Net profit | ~$1–2M | internal |
| GMV driven to Amazon | ~$15–30M | internal |

---

## 6.3 Impact of the reporting collapse (floor case)

The immediate floor is not the rate cuts — it's the spend that must be cut because it's unmeasurable.

| Item | Impact |
|------|--------|
| Long-tail spend paused (blind campaigns) | -$X/mo ad spend saved | `[VERIFY from threshold audit]` |
| Long-tail commission revenue lost (was this spend profitable?) | -$Y/mo revenue | `[VERIFY — may be near zero if it was already dark]` |
| Net P&L impact of spend cut | +$Z/mo if spend > revenue it generated | `[VERIFY]` |

**Key question for 01:** Was the long-tail spend profitable before March? If not, cutting it improves P&L immediately. If it was, cutting it hurts.

---

## 6.4 Revenue bridge — tests to outcomes (directional)

> All figures below are illustrative structure. Fill with real numbers as tests produce data.
> Every number marked `[TBD — test output]` must come from a real test result, not an assumption.

| Revenue line | Today | Wk 4 | Wk 8 | M6 | M12 | Driver |
|--------------|-------|-------|------|-----|------|--------|
| Associates — short-tail survivors | `[VERIFY]` | `[TBD — Test 1]` | | | | 02 |
| Creator Connections / dual layer | $0 | `[TBD — Test 1]` | | | | 02 |
| Amazon Attribution (US brands) | $0 | — | `[TBD — Test 2]` | | | 03 |
| MeLi | $0 | — | `[TBD — Test 3]` | | | 04 |
| Brand-direct / agency | $0 | — | `[TBD — Test 4]` | | | 05 |
| Associates — long-tail (to be cut) | `[VERIFY]` | $0 | $0 | $0 | $0 | cut |
| **Total** | | | | | | |
| **Ad spend** | ~$1–3M | | | | | |
| **Net profit** | ~$1–2M | | | | | |

---

## 6.5 Scenarios (post Week-8 test results)

Run three scenarios based on which tests pass:

| Scenario | Tests that pass | M12 net profit | Key assumption |
|----------|----------------|----------------|----------------|
| Floor | Test 1 only | `[TBD]` | Short-tail holds; others fail to prove |
| Base | Tests 1 + 2 or 1 + 3 | `[TBD]` | One new track proves at meaningful scale |
| Recovery | Tests 1 + 2 + 3 + 4 all pass | `[TBD]` | All tracks work; dedicated hire + scale |

Lead with the floor scenario. The others bracket it.

---

## 6.6 Cost structure (fill from internal data)

| Cost line | Monthly | Notes |
|-----------|---------|-------|
| Headcount — current team | `[VERIFY]` | |
| Ad spend (post-cut) | `[TBD — test 1 output]` | Will drop once long-tail is cut |
| Infra / hosting | `[VERIFY]` | 50M+ pages — not trivial |
| Tools / data / BI | `[VERIFY]` | |
| New hires (post-test, conditional) | $0 now | Activate only on passing tests |

---

## 6.7 Breakeven

- [ ] Define breakeven for the pod (needed for comp structure reference)
- [ ] Current distance to breakeven under the floor scenario

**Source:** Internal cost data + Hex revenue data. Do not estimate — pull real figures.
