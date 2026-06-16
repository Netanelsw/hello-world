# 04 — Test 3: MeLi — First Marketplace

**Pass bar:** Positive contribution margin on MeLi traffic AND usable ASIN/product-level reporting — i.e., the measurement problem that broke Amazon doesn't exist or is manageable here.
**Decide by:** Week 6.
**Owners:** Adi (commercial, co-owns) + Aviran (technical).
**Dev needed:** Aviran — not Daniel. Runs fully in parallel with Tests 1 and 2.

---

## What this test proves

That marketplace diversification is viable — specifically that another platform can generate positive-margin affiliate revenue AND give us the product-level reporting granularity we've lost on Amazon. If MeLi has the same reporting blindness as post-March Amazon, this test fails regardless of margin, because we'd be rebuilding a broken engine on a smaller platform.

MeLi (Mercado Libre) is the right first marketplace: registration is already complete, commercial contacts are live, Adi co-owns it internally, and LATAM is not affected by the Amazon EU/US changes.

---

## 4.1 Current state

- Registration: complete
- Commercial contacts: Rafael Dal Arosa, Rodrigo de Araujo Freitas (intro via Nir Evron @ Google)
- Operational contacts: Erickson Henrique (ABM Capital Group)
- Internal owner: Adi (co-founder)
- Tech owner for this test: Aviran

---

## 4.2 The setup

**Step 1 — Define "live" for this test.**
Live = first product page set driving traffic to MeLi affiliate links, with at least 2 weeks of conversion data at ASIN/product level.

- [ ] Agree definition of "live" with Adi and Aviran `[Adi]`
- [ ] Confirm MeLi affiliate program reporting capabilities — do they provide product-level conversion data? `[Adi + Rafael/Rodrigo]`

**Step 2 — Select the test product cohort.**
Port a small set of products where:
- Strong existing demand signal in our traffic data (LATAM or globally relevant categories)
- MeLi has good inventory/pricing on those products
- Keeps the test narrow — don't try to port the whole catalog

- [ ] Identify 50–200 products for the pilot cohort `[Adi + Aviran]`
- [ ] Confirm those products exist on MeLi at competitive prices `[Adi]`

**Step 3 — Build affiliate link infrastructure.**
- [ ] MeLi affiliate tag setup and tracking `[Aviran]`
- [ ] Landing pages or redirects pointing to MeLi links (separate from Amazon pages) `[Aviran]`
- [ ] Traffic source: can existing PPC/social campaigns be targeted to LATAM? `[Shaked]`

**Step 4 — Drive traffic and read results.**
- [ ] Allocate a test traffic budget — suggest 5–10% of freed long-tail budget `[Shaked]`
- [ ] Run for 4 weeks minimum before reading

---

## 4.3 What to measure

| Metric | Amazon baseline (current) | MeLi target (Wk 6) |
|--------|--------------------------|---------------------|
| Product-level conversion reporting | Zero (post-March) | Full — per MeLi affiliate dashboard |
| Contribution margin (commissions minus ad spend) | `[VERIFY — current short-tail]` | Positive |
| Commission rate on equivalent GMV | `[VERIFY — Amazon blended]` | To be compared |
| LATAM traffic cost vs. US/EU | `[VERIFY]` | Likely lower — verify |

---

## 4.4 Pass / fail

**Pass:** Positive contribution margin AND product-level reporting available.
→ MeLi is a real diversification leg. Scale to a larger product cohort. Use this as the model for Bol and Allegro sequencing — but gate those behind MeLi actually working, not just registered.

**Fail — reporting blind:** MeLi affiliate reporting is aggregated or thresholded in a way that makes optimization impossible.
→ Kill this track regardless of margin. Same disease, smaller platform.

**Fail — margin negative:** Reporting is fine but the economics don't work (ad costs too high, commissions too low, LATAM pricing mismatch).
→ Reassess product selection and LATAM traffic strategy. One retry with a different product cohort before writing off MeLi entirely.

---

## 4.5 What comes after (if pass)

Next marketplace gates behind MeLi being live and profitable:
- **Bol** (NL/BE) — registration complete, outreach prepared. Similar traffic cost profile to EU.
- **Allegro** (PL) — assess when Bol is running.

Do not open Bol or Allegro in parallel with MeLi. One at a time after the model is proven.
