# 01 — Diagnosis

**Goal:** Establish what broke, what it costs in real numbers, and what is still measurable vs. permanently dark. Everything downstream sizes off this.

Do not propose solutions here — just establish the truth.

---

## 1.1 Business baseline (pre-crisis)

| Metric | Figure | Source | Verified? |
|--------|--------|--------|-----------|
| Monthly revenue/commissions earned | `[VERIFY]` | Hex | |
| Monthly ad spend (PPC + social) | ~$1–3M | internal | rough |
| Monthly net profit | ~$1–2M | internal | rough |
| GMV driven to Amazon monthly | ~$15–30M | internal | rough |
| Primary marketplace | Amazon only | — | confirmed |
| Traffic model | Long-tail, PPC + social → affiliate links | — | confirmed |
| GEOs active | US, UK, DE, FR, IT, ES, CA, JP, AU + others | — | confirmed |

**Key figure to pin:** Monthly earned commissions (not GMV). That's the actual revenue line. Pull trailing 6–12 months from Hex.

---

## 1.2 What Amazon changed — and the actual damage mechanism

| Change | Date | Direct damage |
|--------|------|---------------|
| ASIN-level reporting removed | US Mar 9 2026, EU Mar 18 2026 | **Killed the optimization loop.** Can no longer identify which products/campaigns are profitable at the ASIN level. Long-tail spend is now effectively blind. |
| User-level data removed | Same | Cannot attribute conversion to traffic source/user. Retargeting and lookalike modeling degraded. |
| Reporting thresholds | Same | Low-volume ASINs drop below visibility entirely. The tail vanishes from reporting even when it converts. |
| Commission rate cuts | Ongoing | Direct margin compression on every sale that still gets reported. |
| OA paid/boosted-ad disqualification | May 14 2026 | Paid traffic that touches Associates tags risks disqualification of commissions. Hard gate on PPC-to-affiliate paths. |
| Original-content requirement | May 14 2026 | Thin programmatic pages at risk of being excluded from commission eligibility. |

**The headline:** The reporting collapse is more damaging than the rate cuts. Rate cuts compress margin linearly. Loss of ASIN/user data broke the engine — you cannot optimize spend you cannot measure.

---

## 1.3 Revenue at risk — quantify by segment

### What's measurable vs. dark
- [ ] What % of monthly campaigns have volume above the new reporting thresholds? `[pull from Hex]`
- [ ] What % of ad spend is in long-tail campaigns now below measurement visibility? `[pull from Hex]`
- [ ] What's the current actual commission rate blended across categories? `[pull from Amazon reporting]`

### By GEO
| GEO | Monthly commissions earned | At-risk % (reporting-dark or rate-cut) | Notes |
|-----|--------------------------|----------------------------------------|-------|
| US | `[VERIFY]` | | Paid/ad disqualification risk is primary |
| UK | `[VERIFY]` | | EU changes hit hard |
| DE | `[VERIFY]` | | EU changes hit hard |
| FR | `[VERIFY]` | | |
| IT | `[VERIFY]` | | |
| ES | `[VERIFY]` | | |
| CA | `[VERIFY]` | | |
| JP | `[VERIFY]` | | |
| AU | `[VERIFY]` | | |
| Other | `[VERIFY]` | | |

### What's structurally dead vs. recoverable
- **Structurally dead:** Long-tail campaigns below the new reporting thresholds. Cannot be optimized and carry disqualification risk if paid traffic is in the mix. Cut immediately.
- **Potentially recoverable:** Short-tail, higher-volume campaigns that still clear thresholds and have measurable ASIN-level conversion.
- **Unknown:** Mid-tail — needs a threshold audit to classify.

---

## 1.4 The spend audit (do this week)

Run a threshold audit across all active campaigns:
1. Pull all active campaigns from the last 30 days.
2. Flag any campaign where reported conversions fell to zero or dropped >80% post-March 9/18.
3. That's the blind spend. Pause it. Calculate the freed monthly budget.
4. What remains is the base for Test 1 (short-tail + dual monetization).

**Sources:** Hex (Kibeeri Activity Data Dashboard), Amazon Associates reporting portal, PPC platform dashboards.

---

## 1.5 Output of this doc

Two numbers:
1. **Monthly revenue at risk** — the commissions earned on traffic that is now unmeasurable or disqualified.
2. **Monthly ad spend that can be freed immediately** — the blind long-tail campaigns.

These two numbers set the floor for the financial model (06) and define the budget available for the four tests.
