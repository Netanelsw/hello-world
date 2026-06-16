# 07 — Risk Register

**Goal:** Surface what can sink the recovery, who owns each risk, and what the mitigation is. Review at each milestone in 08.

---

## 7.1 Register

| Risk | Category | Likelihood | Impact | Owner | Mitigation | Status |
|------|----------|------------|--------|-------|------------|--------|
| Paid traffic touches Associates tags → commissions disqualified (May 14 OA) | Compliance | High | High | Shaked + Netanel | AM verification before any paid campaign runs to Associates pages. Hard gate — pause first, verify second. | Open |
| Associates + Attribution tag cross-contamination | Compliance | Medium | High | Daniel | Strict separation: different landing pages, different campaigns, different tracking. Verified by Daniel before Test 2 launches. | Open |
| Long-tail cut reveals the short-tail core is too thin to sustain the business | Commercial | Medium | High | Netanel | This is what Test 1 determines. If it fails, Tests 2–4 become the primary plan, not the parallel bet. Accelerate those timelines. | Open — Test 1 |
| MeLi reporting is as blind as post-March Amazon | Platform | Medium | High | Adi | Verify MeLi affiliate reporting capabilities before building infrastructure. If reporting is aggregated/thresholded, do not scale. Kill signal defined in 04. | Open — Test 3 |
| Attribution brand payout doesn't beat Associates meaningfully | Commercial | Medium | Medium | Mark G | Pass bar is 1.5× — if brands won't pay that, Attribution is a marginal upgrade not a model shift. Kill signal defined in 03. | Open — Test 2 |
| Daniel is a single point of failure (solo dev + BI) | Operational | High | High | Netanel | Tests 2 and 3 use different dev resources (Daniel vs. Aviran) to distribute load. Aviran takes MeLi. Still: Daniel's capacity gates Attribution (Test 2) and financial model data pulls. | Open |
| Amazon cuts rates further or restricts programs more | Platform | Medium | High | Netanel | Diversification (Tests 3, 4) is the answer. Accelerate if another Amazon cut is signaled. Don't wait for it to happen. | Open |
| Test 4 (agency) launched before Test 2 (Attribution) is proven | Sequencing | Medium | Medium | Netanel | Don't pitch full-funnel brand management without Attribution measurement ready. The sell depends on it. Defined in 05. | Open |
| Spending on all four tests simultaneously dilutes execution quality | Operational | Medium | Medium | Netanel | Tests 1 and 4 need no dev. Tests 2 and 3 use different developers. Risk is management bandwidth, not dev capacity. Weekly check-in on all four. | Open |
| Brand partner misrepresents Attribution data as Amazon sales guarantee | Compliance | Low | High | Netanel + Mark G | All brand contracts must frame Attribution as measurement tool for Kibeeri-driven traffic, not a performance guarantee on Amazon outcomes. Legal review before deal #1 signs. | Open |

---

## 7.2 Hard compliance lines

These are non-negotiable regardless of commercial pressure:

1. **Associates tags and Attribution tags are never on the same traffic path.** Different pages, different campaigns, different links.
2. **Paid/boosted traffic near Associates tags requires AM verification before launch.** This is not a "check the policy" item — get it in writing from the AM.
3. **No CPS/CPA billing to partners outside the US** unless product-level attribution can be fully defended. The reporting collapse makes this impossible in most GEOs right now.
4. **Do not imply Kibeeri has access to Amazon user data or sales guarantees** in any brand pitch or contract.

---

## 7.3 Review cadence

Review the full register at:
- End of Week 4 (Test 1 decision)
- End of Week 6 (Tests 2 and 3 decisions)
- End of Week 8 (Test 4 decision)
- Monthly thereafter for any track in scale mode

Top 3 risks escalated to Adi at each milestone.
