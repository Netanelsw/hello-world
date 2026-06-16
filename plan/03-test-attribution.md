# 03 — Test 2: Amazon Attribution (US Brands)

**Pass bar:** Brand payout via Attribution ≥ 1.5× Associates commission rate on equivalent traffic; measurement granularity is restored at the ASIN/campaign level.
**Decide by:** Week 6.
**Owners:** Daniel (technical setup) + Mark G (brand sales).
**Dev needed:** Daniel — Attribution tag implementation and click/conversion tracking.

---

## What this test proves

Two things simultaneously:
1. **Measurement comes back.** Amazon Attribution runs on a separate rail from Associates and provides ASIN/campaign-level conversion data — the granularity Amazon's reporting changes destroyed.
2. **Brands pay more.** In the US, brands using Attribution typically offer higher effective payouts than Associates commission rates because they're paying for measurable lower-funnel performance.

If both are true, Attribution is the bridge that restores the optimization engine AND improves economics.

---

## 3.1 How Attribution differs from Associates

| | Associates | Amazon Attribution |
|-|------------|-------------------|
| Who pays | Amazon (commission on sale) | Brand (performance fee for traffic/sales) |
| Reporting | Post-March: aggregated, thresholded, no ASIN level | Full ASIN/campaign/traffic-source granularity |
| Traffic requirement | Any | External traffic (non-Amazon) — fits our PPC/social model exactly |
| Tag mixing | Associates tags | Attribution tags — **must never be combined with Associates tags on same traffic path** |
| US availability | Yes | Yes — primary market for this test |

**Hard rule:** Attribution tags and Associates tags are never on the same page or traffic path. Separate landing pages, separate campaigns, separate tracking. Non-negotiable.

---

## 3.2 The setup

**Step 1 — Land 2–3 US brand partners willing to test Attribution.**
Target: brands already in the partner portfolio or warm outreach via Mark G. Criteria:
- US brand with Amazon presence
- Willing to pay performance fee on Attribution-measured traffic
- Category where our existing content/traffic is strong

- [ ] Identify 5–6 candidate brands `[Mark G]`
- [ ] Pitch: "We drive external traffic to your Amazon listings via Attribution links. You pay on measured performance. You get ASIN-level data. We get higher effective payout." `[Mark G]`
- [ ] Get 2–3 signed to a 6-week pilot

**Step 2 — Build Attribution landing pages (separate from Associates pages).**
- [ ] Set up Amazon Attribution accounts/tags for each brand `[Daniel]`
- [ ] Build or designate landing pages that drive to Attribution links only — no Associates tags on these pages `[Daniel]`
- [ ] Set up campaign-level tracking to confirm separation `[Daniel]`

**Step 3 — Drive traffic.**
Use existing PPC/social capabilities. The traffic model is identical to what we already do — the difference is where the click goes (Attribution link vs. Associates link) and who pays (brand vs. Amazon).

- [ ] Allocate a test traffic budget — suggest 10–15% of current short-tail spend `[Shaked]`
- [ ] Run for 4 weeks before reading results

---

## 3.3 What to measure

| Metric | Associates baseline | Attribution target (Wk 6) |
|--------|---------------------|--------------------------|
| Effective payout per click | `[VERIFY — current blended CPC equiv]` | ≥ 1.5× baseline |
| ASIN-level conversion visibility | Zero (post-March) | Full — per Attribution |
| Campaign-level ROAS measurability | Dark | Measurable |
| Tag separation compliance | n/a | 100% — zero cross-contamination |

---

## 3.4 Pass / fail

**Pass:** Attribution payout ≥ 1.5× Associates and measurement is restored.
→ Expand Attribution to all US short-tail inventory. This becomes the primary US monetization model. Feeds the agency play (Test 4) — Attribution is the measurement rail that makes running a brand's full funnel defensible.

**Fail:** Payout isn't meaningfully better, or setup friction/brand sales is too slow to justify the switch.
→ Attribution is a marginal improvement, not a structural shift. Fall back to Test 1 as the US model; deprioritize the agency build.

---

## 3.5 Dependency note

Test 4 (agency/brand-direct) depends on this test. A brand-direct agency offering is far more credible and priceable if you can show Attribution-based measurement of full-funnel performance. Don't launch Test 4 at scale before Test 2 has a read-out.
