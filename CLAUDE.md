# CLAUDE.md — Kibeeri Recovery Plan

> Context file for Claude Code. Loaded automatically at session start.
> Owner: Netanel Weiss, GM Discovery. Last updated: June 2026.

---

## 0. What this project is

A recovery plan for Kibeeri's core business unit (Discovery) in response to structural changes by Amazon that have degraded the primary revenue engine. This repo is the working space for diagnosing what broke, running four parallel proof-of-concept tests, and scaling what clears the bar.

**This is internal strategy work.** Output is for the founders and the pod, not Amazon or partners.

---

## 1. Business snapshot

- **Model:** Amazon Associates affiliate publishing. Traffic (PPC + social) → product comparison/ranking pages → Amazon via affiliate links → commission on sales.
- **Scale:** ~50M+ structured product pages, 46+ country domains, 10+ GEOs (US, UK, DE, FR, IT, ES, CA, JP, AU +)
- **Financials (pre-crisis):** ~$1–2M/mo net profit; ~$15–30M/mo GMV driven to Amazon; ~$1–3M/mo ad spend. `[VERIFY from Hex]`
- **Traffic model:** Long-tail primarily — both search campaigns and social. Arbitraging ad spend against affiliate commissions.
- **Marketplace:** Amazon only. No marketplace diversification exists today.
- **Partnerships:** Small, secondary component. Not the primary revenue driver.

---

## 2. What broke

Amazon made three categories of change. The reporting collapse is the most damaging — it broke the optimization engine, not just the margin.

**Reporting collapse (primary damage):**
- ASIN-level and user-level reporting removed — US Mar 9, EU Mar 18 2026
- New reporting thresholds make the entire long tail invisible
- Result: cannot identify which campaigns, products, or traffic sources are profitable. Long-tail spend is now blind.

**Rate cuts:** Commission rates reduced across categories. Direct margin compression on every sale.

**Policy changes (May 14 2026 OA):**
- Paid/boosted-ad disqualification — highest immediate compliance risk
- Onsite commission narrowing
- Original-content requirements for thin pages

---

## 3. Recovery structure — four parallel tests

All four run simultaneously, starting Week 1. Pass bar defined before each test starts. Kill losers fast. Hire behind the winners.

**Pre-test funding move (Week 1):** Cut all long-tail campaigns below reporting thresholds immediately. This spend is blind and carries compliance risk. The freed budget funds the tests.

| # | Test | Pass bar | Owners | Decide by |
|---|------|----------|--------|-----------|
| 1 | Short-tail + dual monetization | Margin/page ≥ old blended; dual layer adds ≥15% rev | Shaked + Netanel | Wk 4 |
| 2 | Amazon Attribution (US brands) | Brand payout ≥ 1.5× Associates; measurement restored | Daniel + Mark G | Wk 6 |
| 3 | MeLi | Positive margin + usable product-level reporting | Adi + Aviran | Wk 6 |
| 4 | Brand-direct / agency | Full-funnel margin ≥ affiliate contribution margin | Netanel → dedicated hire | Wk 8 |

Tests 2 and 3 run on separate dev resources (Daniel vs. Aviran) — no bottleneck.

---

## 4. Org & people

- **Adi Mizrahi** — co-founder / CEO. Co-owns MeLi track internally.
- **Elad Ifergan** — co-founder
- **Netanel Weiss** — GM, Discovery (this account). Owns Tests 1, 4, and Amazon AM track.
- **Mark Gurevich** — partnerships manager. Owns brand sales for Test 2.
- **Daniel** — solo developer + BI. Owns Attribution technical setup (Test 2). Single point of failure — watch.
- **Shaked** — performance / PPC. Owns traffic for Tests 1–3.
- **Aviran** — technical. Owns MeLi infrastructure (Test 3).
- **Eliran, Vadim** — technical support.

After tests: dedicated agency/account lead hired if Test 4 passes. No pre-hiring.

---

## 5. Hard constraints — do not violate

- **Associates tags and Attribution tags are never on the same traffic path.** Separate pages, separate campaigns, separate links.
- **Paid traffic near Associates tags requires AM sign-off.** Hard gate — pause first, verify second.
- **No CPS/CPA billing outside the US** unless product-level attribution is fully defensible. The reporting collapse makes this impossible in most GEOs.
- **Never fabricate metrics.** Flag uncertainty. Do not fill plausible numbers.
- **Projections are directional, not commitments** — insufficient historical data. Caveat on every forward-looking table.
- **PPC payback is non-linear** — cutting spend doesn't map linearly to lost revenue. Model this correctly.
- **Kill signals are pre-committed** — see 00-README. Do not rationalize keeping a failing test.

---

## 6. Open questions to resolve before Week 1

- Exact monthly commissions earned (not GMV) — pull from Hex
- Long-tail ad spend % that is now below reporting thresholds — threshold audit
- MeLi affiliate reporting quality — confirm with Rafael/Rodrigo before Aviran builds
- Breakeven definition for the pod

---

## 7. How to work here

- **Tone:** direct, senior-operator, scannable. Short paragraphs, bold headers. No fluff.
- **Model the floor, not the upside.** Every forward-looking table leads with the worst-credible case.
- **Pull real numbers.** Sources: Hex dashboard, partners.kibeeri.com, Amazon reporting portal, Gmail AM threads.
- **Own errors directly.** No partial acknowledgment. Correct in full.
- **Independent pushback is wanted.** Not validation.
