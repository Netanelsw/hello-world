# 06 — Financial Model

**Goal:** Directional, downside-first projection of the transition. Model the floor.
Every forward number is directional, **not a commitment** — insufficient historical
data points exist.

## 6.1 Modeling rules (read before building)
- **Downside-first.** Build the floor scenario before any upside.
- **PPC payback is non-linear** — do not map rate cuts linearly to volume. Account for
  long-tail vs. evergreen vs. event traffic and optimization loops.
- **Three scenarios:** floor / base / recovery. Lead with floor.
- **Separate the tracks** — Associates decline and brand-monetization ramp are different
  lines, never netted into one blended rate.
- Mark every assumption. Tie inputs to 01 (baseline + decline), 03 (recovery ramp),
  04 (new-marketplace ramp), 05 (cost base + breakeven).

## 6.2 Revenue bridge
From today's run-rate to the target state.

| Line | Today | M3 | M6 | M12 | Driver |
|------|-------|----|----|-----|--------|
| Associates (declining) | | | | | 01 |
| Brand-direct CPC | | | | | 03 |
| Fixed fee | | | | | 03 |
| ACC / Creator Connections (US) | | | | | 03 |
| MeLi | | | | | 04 |
| Bol | | | | | 04 |
| Walmart / Coupang | | | | | 04 |
| **Total** | | | | | |

## 6.3 P&L view
- [ ] Revenue (from 6.2) − cost base (from 05) = EBITDA path
- [ ] Months to breakeven under floor / base / recovery
- [ ] Cash position / runway implication if relevant

## 6.4 Sensitivities
- [ ] Amazon cuts deeper / faster than modeled
- [ ] CPC adoption slower than POC suggests
- [ ] MeLi ramp slips a quarter

## 6.5 Output of this doc
A floor-case EBITDA path with breakeven timing and the two upside scenarios bracketing it.
Headline caveat on every table: **directional, not a commitment.**
