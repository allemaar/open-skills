---
name: human-merge
description: >
  Takes several separate reports — from several agents, several sources, or several documents — and returns one surface a person can decide from. Each report may be individually fine; the pile is what defeats the reader, and the relations between reports are invisible to every author who wrote one. Collapses reports that share an upstream source into the single source they are, names what is now superseded and whether a live decision rests on the dead figure, classifies conflicts instead of averaging them away, and pools coverage so a gap no single report had becomes visible. Works on any subject: research, legal, finance, operations, conservation, code. Trigger phrases: "/human-merge", "merge these reports", "combine what the agents found", "what do all of these add up to", "the sub-agents all came back", "did anything here contradict anything else". Not /human-output (the writing contract, which this skill links to rather than restates) or /human-rewrite (repairs one existing text and explicitly refuses several) — human-merge governs the pass across many.
visibility: public
self-improvable: true
triggers:
  - "/human-merge"
  - "merge these reports"
  - "combine what the agents found"
  - "what do all of these add up to"
  - "the sub-agents all came back"
  - "did anything here contradict anything else"
next-skills:
  - skill: human-output
    phrase: "/human-output"
    why: "The writing contract the merged surface is written to. Load it before drafting the merge, not after."
  - skill: human-draw
    phrase: "/human-draw"
    why: "The source structure or the joint figure turned out relational or proportional — it wants a picture."
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "One input is unreadable on its own and needs repair before it can be read into the merge."
  - skill: double-check
    phrase: "/double-check"
    why: "The merge exposed one live conflict that governs the decision — go re-verify that claim against its source."
---

# /human-merge

**Many reports in, one decidable surface out.** Each input may be excellent.
The pile is still undecidable, because the reader cannot tell which claims are
corroborated, which rest on one source wearing four hats, and which two reports
quietly disagree.

> **The style rules are not in this file.** Verdict-first ordering, sentence and
> paragraph shape, acronym expansion, item counts, confidence labels, the
> length-versus-fidelity ruling — all of it lives in **`human-output/SKILL.md`**.
> Read it and apply it. Family doctrine, including the stopping-point rule and
> the checker contract, lives in **`human-spec/human-contract.md`**. This file
> carries only what exists *because there is more than one report*.

## The four operations

These are the whole skill. Each has no single-input analogue, which is why
nobody who wrote one of the inputs could have done it.

1. **Collapse correlated reports to one source.** Reports are not sources.
2. **Name what is superseded** — and whether a live decision already rests on
   the dead figure.
3. **Classify each conflict** before touching it. Most are not contradictions.
4. **Pool coverage.** A hole no single report had appears only at merge time.

Anything else you are tempted to add is `human-output` restated. Leave it out.

## The order the work happens

The sections below are reference, not a running order. Executed top to bottom
they would grade confidence before counting sources, which is the error this
skill exists to prevent. Run these ten steps in order. Three of the
dependencies are load-bearing and named where they bite.

1. **Inventory.** List every input: author, date, and the basis it states for
   each claim. **Nothing else can start until this exists** — every later step
   reads from it, and a report whose basis you never asked for gets graded
   generously by default.
2. **Reconcile definitions.** One word meaning two things manufactures both
   false agreement and false conflict. **Before any comparison**, or steps 3
   and 6 both run on sand.
3. **Same or different.** Dedupe claims, so you are comparing findings rather
   than sentences.
4. **Count sources, not reports.** Run the five-key test per claim.
   **Independence before confidence** — the label in step 7 is capped by the
   number this step returns, so doing it later means relabelling everything.
5. **Order the supersessions.** Within one subject, attribute and scope only.
   Then ask what already rests on the superseded figure.
6. **Classify each conflict.** After steps 2 and 3, because most apparent
   conflicts dissolve into a definition or a scope.
7. **Grade and label.** Now, and only now, assign confirmed, judgement or
   estimate.
8. **Combine, or park.** The joint arithmetic, longhand; and the items that do
   not combine, each with what would make it combinable.
9. **Pool the coverage.** Walk the decision. Last, because the gap list has to
   catch anything steps 1 to 8 named without a figure.
10. **Write it.** Verdict, ledger, numeral trace.

## The five relations

Every merge names each of these or says it does not apply. A merge that skips
one is a summary, and a summary of six reports is a seventh report.

**1. Superseded.** Name the earlier report, its figure, the new figure, and the
delta. Then the part everyone omits: say whether a decision already rests on
the old figure. If one does, that is the verdict of the whole merge.

**2. Same or different.** Two reports naming one thing are not two findings.
Say which it is. If they are one, drop the double count. If they are two, say
whether fixing one fixes the other — two problems counted as one is how a fix
gets under-sized.

**3. Load-bearing.** One report matters only because of another. A lease clause
is dull until a payback period runs past it. Say which is the carrier and which
is the load, and file the pair rather than the clause alone.

**4. Together.** The joint figure none of them states. Show the arithmetic from
named inputs, longhand.

**5. Does not combine.** Different clock, different population, different unit,
different confidence class. Park it, labelled, and say what would make it
combinable. Forcing a fit is this skill's failure mode.

## Independence: count sources, not reports

Two reports corroborate only if either could have been wrong while the other
stayed right. Run the test **on the claim, not on the report** — one report can
be independent on its first claim and derivative on its second.

Ask each report what its basis actually was, then match on five keys:

1. They quote the same document.
2. They interviewed the same person.
3. They inherited the same brief, or the same corpus.
4. One of them read the other.
5. They are sibling agents run over one shared context.

The fifth key is the trap in agent fan-out. Siblings over one context are
**correlated by construction**: their agreement carries no confirming weight
and looks identical to genuine corroboration.

Then apply the counterfactual, in words: *could report A have been wrong while
report B stayed right?* If no, they are one source.

**If you dispatched the workers, their briefs are your best independence
evidence.** Read the briefs before the reports. Two workers sent the same
context and the same question will agree, and the reports will not say so.

**Self-merge.** If you wrote some of the inputs, you are not independent of
them. Say so in the ledger, and do not count your own report as corroborating
your own conclusion.

**The fallback, when independence cannot be resolved.** Do not guess and do not
count optimistically. Declare independence unknown, count those inputs as
**one** source, cap the merged claim at **estimate**, and print the line:

> *independence not established*

**Unknown independence is not independence.** That sentence is the rule.

## Access caps the label — it is not a second ladder

**There is one ladder: the contract's confirmed, judgement, estimate.** How a
reporter knew a thing does not get its own scale beside that one; it sets a
**ceiling** on where the claim can land. Two ladders is decode work, and the
reader should never hold both.

| What the report states as its basis | Highest label the claim may reach |
|---|---|
| Observed or measured it themselves | confirmed |
| Worked from primary records it did not produce, and names them | confirmed |
| Worked from records it does not name | judgement |
| Passing on what an interested party said about itself | judgement |
| No stated basis | estimate, and never evidence on its own |

Print the basis in the same breath as the label — *"(Confirmed; R5 inspected
it)"* — rather than in a legend the reader must scroll back to.

**No numeric score.** A single number invites averaging, and averaging is the
failure this skill exists to prevent. A derived or modelled claim **inherits
its weakest parent's ceiling and adds nothing**, so there is nothing left for a
second scale to say.

As-of dates and scope boundaries travel with every value here as they do
everywhere — that rule is `human-output`'s, not restated. What is this file's:
**most false conflicts are two true claims about different scopes**, which is
why scope is a row in the conflict table below.

## Merged confidence is a minimum, never an average

- **Capped by the weakest input the conclusion actually rests on.** Trace which
  inputs it rests on. Strong inputs on other questions do not lift it.
- **Agreement between dependent inputs raises nothing.** Only independent
  methods arriving at the same place raise the label a step.
- **One unresolved reversing input caps the merge at estimate**, however strong
  everything else is.
- **Coverage is part of confidence.** Unexamined is not the same as fine.

Use the contract's three labels: confirmed, judgement, estimate.

## Three forbidden moves

- **Never average two numbers that disagree.** The mean of a right answer and a
  wrong one is a wrong answer with no author.
- **Never drop the outlier.** A lone dissent from the only Direct source is
  often the most valuable report in the pile.
- **Never attribute a claim to "the reports" collectively.** That launders one
  source's guess into the voice of all of them.

## Classify the conflict before you touch it

| Type | Signature | What the merge does |
|---|---|---|
| Contradiction | Same subject, attribute and scope; incompatible values | Keep both. Name the resolving check. Never pick the confident one. |
| Scope mismatch | Different site, period, population or wing | Not a conflict. Print both with their scopes attached. |
| Vintage | Same claim, different as-of dates | Not a conflict. Lead with the newer; say the older existed and when it changed. |
| Claim-type mismatch | One reports a quote, promise or plan; the other an observation | Not a conflict. The observed value drives the decision. |
| Confidence-only | Same value, different certainty | Carry the lower confidence, and say which source was surer and on what access. |
| Definitional | Same word, different meaning between reports | Not yet a conflict. Fix the definition, then re-compare. |

**Order of arrival is evidence only within the same subject, attribute and
scope.** Later beats earlier when a newer reading replaces an older one about
the same thing. Across different scopes, arrival order is not vintage at all —
it is a scope mismatch wearing a date, and treating it as supersession
overwrites a true claim with an unrelated one.

**A live conflict belongs in the verdict sentence.** If the reader would act
differently depending on which report is right, that is the finding.

## Pool the coverage

Walk the decision, not the reports, and ask which parts no input addressed.
Each author saw their own gap and none saw the union. Print the union.
Silence is not assent: a report that was never asked about a topic is a gap,
not a vote, and the two must stay apart in every count you print. For the same
reason, never write that nobody has *ever* done a thing when what you have is
nobody in this set reporting it — absence of a report is not evidence of
absence, and the phrasing has to say which one you hold.

**The verdict test, and it is a hard one.** *Every fact named in the verdict
either carries a figure or appears in the gap list.* No exceptions. A fact
strong enough to reach the verdict sentence and weak enough to have no number
is precisely the one the reader will assume somebody priced. The merge's own
central fact is the likeliest thing to be missing from a gap list assembled by
walking the inputs, because it belongs to no single input — walk the verdict
too, clause by clause, after the verdict is written.

## The queue: reports that arrive over days

Inputs rarely land at once, and the reader acts mid-stream. So every merge
after the first has a second job: **say what the new report does to a decision
already taken.**

Three outcomes, and you must choose one out loud:

- **Confirms it.** Say so in one line and stop.
- **Narrows it.** The decision stands, its scope or its margin changes.
- **Invalidates it.** Lead with that. *"The figure your Wednesday decision
  rested on is now wrong"* is the verdict, not a footnote to it.

Carry forward what the reader was told last time, so a correction reads as a
correction rather than as a fresh opinion.

## The ledger, and when the set is too big for one

**The ledger is the merge's audit record**, and it is a named artefact, not a
mood. It is one row per merged claim carrying: the claim, which reports it came
from, **how many independent sources those reports collapse to**, its label,
and the report-and-section pointer that lets a reader return to the argument
under it. Its closing summary — source collapses, contradictions, supersessions,
parked items — is what the example prints in italics at the end. Whenever this
file says *"say so in the ledger"*, that row is where it goes. Sourcing a claim
is `human-output`'s rule; what is added here is the source *count* beside it,
because that is the number a single-report writer never had to produce.

**Beyond roughly a dozen inputs the ledger is itself a wall**, and you must
choose tiering or refusal rather than letting it grow. The criterion is whether
the set **partitions cleanly by decision**:

- **Tier it** when the inputs fall into groups that each bear on one decision,
  with few claims crossing a group boundary. Merge each group, then merge the
  merges, keeping pointers and source counts through both passes.
- **Refuse and say the set needs splitting** when the groups do not separate —
  when the same claims are load-bearing in several groups at once, so any
  partition you draw cuts through a relation. Tiering there hides the crossing
  relation inside a pass nobody reads, which is worse than the wall.

A twenty-line ledger reproduces the problem in a smaller font.

## When they do not combine

**This is a legitimate deliverable, not a softer merge.** A merge with zero
combined claims is a valid output. Never manufacture a joint sentence to
justify the skill having run.

The shape is exact:

1. **The refusal**, first line, stated plainly.
2. **One named reason per parked item** — not one reason for the set.
3. **What would make it combinable**, per item.
4. **Then each finding in full**, in decision order, with its own verdict, its
   own grade, and its own back-pointer.

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
> non-renewal was reported on 2026-06-30, so the submission was filed two
> months before the fact that breaks it was known, and the live document still
> counts money Finance says is gone. That is the verdict of this merge — and
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
> **Both capital figures rest on one costing note, so this comparison is an
> estimate.** R2's EUR 610,000 and EUR 90,000 both come from the same 2025
> outline pricing note — a primary record R2 did not produce but does name, so
> confirmed is reachable on access alone. Two figures from one document
> are one source, not two, so the merged cost conclusion is capped at
> estimate whatever its arithmetic. (R2.)
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

## Checking

Run `tools/human-output-check.mjs` on the merged draft. It grades the
mechanical half: printable characters and width inside figures, bar arithmetic,
percentage sums, sentence length, acronym expansion, one marked recommendation.

It cannot grade whether independence was established, whether a conflict was
classified honestly, or whether a dropped claim was superseded rather than
merely inconvenient. Nor can it tell an invented figure from a traced one —
that limit and its remedy are the checker contract,
`human-spec/human-contract.md` section 3. So do the one check that catches the
worst defect: **freeze the inputs, then compare every numeral in the merge
against them one at a time**, and print the trace where the reader can see it.
A merge with no trace should be read as a merge whose losses were not counted.

Then three checks the numeral pass does not cover, because each has caught a
merge that had already passed it:

1. **Every non-numeric claim gets the same pass.** Numerals are the easy half.
   Run the sentences too: *"still the live document"*, *"no longer exists"*,
   *"has never been entered"* carry no digit and are exactly where an
   unsourced fact hides. Point each at the line of the frozen input that says
   it. If no line says it, it is an inference — label it or cut it.
2. **Every fact in the verdict carries a figure or appears in the gap list.**
   Walk the verdict sentence clause by clause against the pooled gaps.
3. **The trace's own guarantee is true as written.** "Nothing else carries a
   number" is a claim about the merge, and it is false the moment a year, a
   chosen horizon or a tally appears untraced. A trace that overclaims
   completeness is worse than no trace, because it spends the reader's trust
   on the pass it did not run. State the guarantee you actually met.

## Boundary

This skill is one member of the `human-` family. The routing table — which
member handles which material — is `human-spec/human-contract.md` section 1.

- Not `/human-output` — the contract for writing one piece. A merge is written
  to it and adds only the cross-report layer. Every style rule stays there.
- Not `/human-rewrite` — that repairs one existing text and **explicitly
  refuses several separate reports**, because it reads nothing beyond the one
  text it was handed. When it refuses, this skill is where the work goes. Call
  it first on any single input too broken to read into the merge.
- Not `/human-draw` — that owns what is inside the fence. Hand off when the
  source structure or the joint figure is relational or proportional; the prose
  around it stays this merge's output.
- Not `/extract-signal` — that gathers and vets signal from noisy *sources*.
  Merge is handed finished reports and reads nothing beyond them.
- Not `/double-check` or `/verify` — merge never re-verifies a claim against the
  world. It grades and traces what it was given, and names the check that would
  settle a conflict for someone else to run.
- Not an aggregator. Concatenating reports under headings, or averaging their
  conclusions, is the problem this skill was written against.
- Not a substitute for the underlying work. Weak reports merged cleanly produce
  a confident wrong answer faster.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol
> (`next-skills/SKILL.md`): surface the `next-skills` recommendations from
> front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol
> (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-
> recurring weakness in this skill, propose a specific fix for the handler to
> approve. Conservative — silent otherwise. Never auto-apply.
