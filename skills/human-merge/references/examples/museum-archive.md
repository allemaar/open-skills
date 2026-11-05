Companion to [human-merge](../../SKILL.md). References below to "this file" and its lists mean that parent. The example values are illustrative.

## Worked example — a museum archive

The frozen inputs first, so every figure below can be checked against them.

### The inputs, as received

```
  R1  Conservation, 2026-02-10
      Surveyed 4 of the 11 archive rooms, taking own readings:
      rooms 3, 5, 7, 9. Relative humidity above the 60 per cent
      ceiling in rooms 3, 5 and 7. The other 7 rooms were locked.

  R2  Finance, 2026-03-06
      Keep on site: new climate plant, EUR 610,000 to install and
      EUR 48,000 a year to run. Move off site: EUR 90,000 removals
      once, EUR 71,000 a year to lease. Lease price quoted by the
      store operator; both capital figures from the same 2025
      outline pricing note. Assumes the EUR 55,000 annual
      conservation grant continues.

  R3  Registrar, 2026-04-14
      The store operator states its halls hold 55 per cent relative
      humidity year round. Basis: the operator's brochure.

  R4  Reader services, 2026-05-08
      1,240 reader visits in 2025; 380 of those consulted archive
      material. Off-site retrieval adds 2 working days per request.

  R5  Building surveyor, 2026-05-20
      Water ingress through the north range roof recorded in rooms
      5 and 7 during February 2026. Own inspection.

  R6  Finance addendum, 2026-06-30
      The EUR 55,000 conservation grant was not renewed for 2027.
      The 2027 budget submission was filed on 2026-04-30, carries the
      grant as income, and is the standing submission; no revision
      has been filed. Basis for the non-renewal: not stated.
```

### The merged surface

> **Moving off site is cheaper by EUR 290,000 over ten years but dearer for
> ever after year 22.6, and no report says how long the museum intends to hold
> this archive — so the ten-year frame may be the wrong one and the EUR
> 290,000 with it. Two of the three damp rooms also have a leaking roof that
> neither option fixes and that no report prices, and the standing 2027 budget
> still counts a
> EUR 55,000 grant that Finance now says was not renewed. Do not sign the
> lease on these reports.**
>
> **Decision needed before the 2027 budget is reopened:** refile the budget
> without the grant, and commission an independent humidity reading at the
> store. Both are prerequisites, not alternatives.
>
> **No longer true: the EUR 55,000 grant — on Finance's own unattributed
> word.** R2 assumed the grant continues; R6 says it was not renewed for 2027.
> R6 also says the 2027 submission was filed on 2026-04-30, carries the grant
> as income, and is still the standing submission with no revision filed. The
> non-renewal was reported on 2026-06-30, two months after the submission.
> When it was first known is unstated. The live document still counts money
> Finance says is gone. That is the verdict of this merge — and
> it rests on one source. (Estimate; the test is the next paragraph.)
>
> **Why that is an estimate and not "confirmed, R2 and R6".** Two reports, so
> run the five keys. R6 is titled a *Finance addendum* and R2 is the Finance
> report — same author function and same corpus, so key 3 matches on the face
> of it; and an addendum to a corpus is written with that corpus in hand,
> which is key 4 (an inference from the title, not a stated fact, and it is
> not what decides this). The counterfactual: could R2
> have been wrong about the grant while R6 stayed right? Not independently.
> They are one source, and their agreement adds nothing. R6 also states no
> basis for the non-renewal, and an unattributed claim reaches estimate at
> best however much else points the same way. Both rules bind and the weaker
> wins. Confirming it is one telephone call to the grant body, and it is the
> highest-value check in this set. (R2 and R6.)
>
> R6 does not say the non-renewal falls differently on the two options, and
> this merge does not assume that it does. It bears on whether either option
> is affordable, not on which one is cheaper.
>
> **Together: the ten-year cost, which no report states.** The ten-year window
> is this merge's own choice and appears in no report; it is here only because
> it is the conventional frame, and the crossover below is what actually
> decides. Keep on site is
> EUR 610,000 plus ten years at EUR 48,000, so EUR 610,000 + EUR 480,000 =
> EUR 1,090,000. Move off site is EUR 90,000 plus ten years at EUR 71,000, so
> EUR 90,000 + EUR 710,000 = EUR 800,000. The gap is EUR 1,090,000 -
> EUR 800,000 = EUR 290,000. (Arithmetic on R2.)

```
  Ten-year cost, one cell = EUR 50,000

  Keep on site   ######################   EUR 1,090,000
  Move off site  ################         EUR   800,000

  Staying is dearer until year 22.6, then cheaper for ever after.
```

> **The crossover, so the ten-year window is not doing the arguing.** Moving
> is EUR 610,000 - EUR 90,000 = EUR 520,000 cheaper to start, and costs
> EUR 71,000 - EUR 48,000 = EUR 23,000 more each year. EUR 520,000 divided by
> EUR 23,000 is 22.6 years. If the museum expects to hold this archive longer
> than that, the cheaper option reverses. No report says how long it expects
> to hold it. (Arithmetic on R2; estimate — see the label below.)
>
> **The cost comparison is an estimate because pricing is preliminary and
> the relevant holding period is unresolved.** R2’s EUR 610,000 and EUR 90,000
> share one 2025 outline pricing note. Count that source once; one source is
> not itself a reason to downgrade a confirmed fact. Access could confirm
> what the note says, while its outline estimates and the unknown time
> horizon still limit the decision. The arithmetic does not remove those
> uncertainties. (R2.)
>
> **The damp is two problems, not one — but that split is itself an
> estimate.** R1 measured rooms 3, 5 and 7 over the ceiling. R5 recorded roof
> ingress in rooms 5 and 7. Two of the three overlap; room 3 is over the
> ceiling with no ingress reported. A climate plant does not stop water
> entering through a roof, so the plant and the roof are separate spends.
> R1 and R5 each measured or inspected the thing themselves, but both use
> the same room numbering and neither says whether the surveyor had R1 in
> hand. *Independence not established* — counted as one source for the
> room-matching claim, which is therefore an estimate. (R1 and R5.)
>
> **The retrieval delay matters only because of the move — and it cannot be
> sized from these reports.** R4's 380 archive consultations a year are
> unremarkable alone; against R2's off-site option they become the reader cost
> of moving. R4 is the load, R2 is what makes it heavy. **But the two figures
> do not multiply.** R4 counts 380 *consultations* and prices 2 working days
> per *retrieval request* — different units. No report says how many requests
> a consultation raises, or whether one request serves several, so 380 x 2 is
> a number with no parent. It becomes combinable when someone states the
> requests-per-consultation ratio, or R4 recounts in one unit. Until then the
> delay is real, unpriced, and not 760 days. (R4 counted its own visits;
> parked as non-combining.)
>
> **Does not combine: the store's 55 per cent.** R3 passes on the operator's
> brochure — an interested party on its own condition, so judgement at best —
> about a different building; R1 measured this one itself. Different building
> and different basis: netting them would produce a number with no parent. It
> becomes combinable when someone takes an independent reading inside the
> store's halls.
>
> **Two reports carry a figure that favours the store; behind both is one
> source, and it is the party being paid.** R2's lease price and R3's humidity
> figure both come from the store operator. Neither report states a view on
> whether the store is suitable — that reading is this merge's, and it is why
> the two figures are counted once.

```
  claim: "the off-site store is a suitable home for the archive"

  R2 finance    lease EUR 71,000 a year --.
                                           +-- store operator -> 1 source
  R3 registrar  55 per cent humidity    --'

  R1 conservation  own readings, 4 of 11 rooms -> 1 source, this building

  reports carrying a figure that favours the store: 2
  independent sources behind them: 1
  and that one source is the party being paid
```

> **No contradiction anywhere in the set.** No two reports state incompatible
> values for the same subject, attribute and scope. The apparent humidity
> clash is a scope mismatch (two buildings) and the grant is vintage.
>
> **Nobody checked, pooled across all six:** what it costs to repair the north
> range roof — the fact the verdict rests on, and no report gives a figure or
> was asked for one; whether the lease has a break clause; the reader cost of
> off-site retrieval, which cannot be sized from R4 as written; how long the
> museum expects to hold this archive, which decides whether year 22.6 falls
> inside the horizon or outside it; and the condition of the 7 rooms R1 found
> locked, on which no report in this set reports. Each author's own gap
> list omits all five, because none of the five sits inside one report's
> scope.
>
> *Merged 6 reports; source counts are per claim and given beside each — 2
> reports collapse to 1 source on store suitability, 2 reports to 1 source on
> the grant, 2 capital figures to 1 costing note. 0 contradictions. 1
> superseded figure with a live document resting on it. 2 items parked as
> non-combining. 3 claims left at estimate — the grant, the cost comparison,
> the room match. 5 pooled gaps.*

### The numeral trace

Every numeral above falls into one of four classes: verbatim from the frozen
block; arithmetic on numbers that are; a count of the merge's own items or of
this file's own lists; or — in exactly one case, flagged as such — a frame
this merge chose. Every one of them is in the table. Shown longhand:

| Figure in the merge | Where it comes from |
|---|---|
| 11 rooms, 4 surveyed, 7 not surveyed | R1, verbatim |
| rooms 3, 5, 7, 9; 60 per cent | R1, verbatim |
| EUR 610,000 / 48,000 / 90,000 / 71,000 / 55,000 | R2, verbatim |
| 55 per cent (the store) | R3, verbatim |
| 1,240 visits, 380 consultations, 2 days | R4, verbatim |
| rooms 5 and 7, February 2026 | R5, verbatim |
| 2026-04-30 and 2026-06-30 | R6, verbatim |
| EUR 1,090,000 | 610,000 + (10 x 48,000) = 610,000 + 480,000 |
| EUR 800,000 | 90,000 + (10 x 71,000) = 90,000 + 710,000 |
| EUR 290,000 | 1,090,000 - 800,000 |
| EUR 520,000 | 610,000 - 90,000 |
| EUR 23,000 | 71,000 - 48,000 |
| 22.6 years | 520,000 / 23,000 |
| two months | 2026-04-30 to 2026-06-30 |
| 760 working days | 380 x 2 — **shown only to reject it**; the units differ |
| 22 cells | 1,090,000 / 50,000 = 21.8, drawn as 22, rounded up |
| 16 cells | 800,000 / 50,000 = 16, exact |
| 2 of 3 rooms overlap | rooms 5, 7 in both lists; room 3 in one |
| 2027 (x3) | R6, verbatim — the budget year |
| 2025 (visits) | R4, verbatim. 2025 (pricing note): R2, verbatim |
| keys 3 and 4 | positions in this file's five-key list, not a report figure |
| 6 reports; the collapses (2 to 1, three times); 0, 1, 2, 3, 5 in the ledger line | counts of the merge's own items, each countable above |
| **ten years** | **no report states it.** This merge's chosen frame — see below |

**One number in the merge comes from no report: the ten-year horizon.** It is a
frame this merge picked, not a finding, and it is labelled as one where it is
first used — which is why the crossover at year 22.6 is printed beside it
rather than below it. Change the horizon and the EUR 290,000 changes with it;
the crossover does not.

No date, deadline, headcount or threshold was invented, and no input's
confidence was raised: the two figures resting on a single costing note are
labelled estimate even though the arithmetic on them is exact.

Notice what the merge did **not** do. It did not average anything. It did not
say "three reports agree the store is fine". It did not resolve the humidity
question, because the reports cannot. It did not multiply two figures whose
units differ merely because both were to hand. And it did not invent a fact to
demonstrate a feature — the live decision resting on the dead figure is the
2027 budget submission, and each element of it (the filing date, the grant
carried as income, the submission still standing) is **stated in R6** rather
than inferred from R6 and R2 together. Where this merge did reason across two
reports, it said so and dropped the label to estimate.

