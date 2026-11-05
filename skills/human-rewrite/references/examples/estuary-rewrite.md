Companion to [human-rewrite](../../SKILL.md). These panels are illustrative; the parent procedure and its final checks remain controlling.

## Worked example — an estuary water-quality report

Deliberately not software. Three panels: the source, the naive rewrite that
loses fidelity, and the faithful one.

### Panel 1 — the source

> Sampling was carried out at 14 of the 19 designated bathing-water points along
> the Aldenn estuary between May and September 2024, the remaining 5 points
> being inaccessible for the duration of the works programme. Across the sampled
> points, 3 exceeded the intestinal enterococci threshold on at least one
> occasion. The exceedances at all 3 points occurred within 48 hours of heavy
> rainfall, which is consistent with, though not confirmed as, combined sewer
> overflow discharge; no tracer study was undertaken. Laboratory analysis was
> carried out by the water company's own laboratory. Counts at the worst point,
> Marle Quay, reached 410 colony-forming units per 100 ml against a threshold of
> 200. The council's summer 2023 figures are not directly comparable, a
> different sampling protocol having been used. We would note that the sampling
> season excludes the winter storm period. On the basis of the above the
> authority may wish to consider whether bathing advisory notices are warranted
> at the affected points ahead of the 2025 season.

**The step-1 inventory — 12 items.** (1) 14 of 19 points sampled. (2) 5 points
inaccessible, works programme. (3) May to September 2024. (4) 3 points exceeded
on at least one occasion. (5) Exceedances within 48 hours of heavy rainfall.
(6) "consistent with, though not confirmed as" sewer overflow. (7) No tracer
study. (8) Analysis by the water company's own laboratory. (9) Marle Quay 410
colony-forming units per 100 ml against a threshold of 200. (10) 2023 figures
not comparable, different protocol. (11) Season excludes the winter storm
period. (12) "may wish to consider" advisory notices before the 2025 season.

### Panel 2 — the naive rewrite, and why it fails

> Three bathing sites on the Aldenn estuary failed water-quality standards last
> summer, with Marle Quay at twice the safe limit. Sewer overflows after rain
> are the cause. Advisory notices should go up before the 2025 season.

Fluent, short, scannable, and wrong in six ways. "Three sites failed" with no
denominator reads as three out of the whole estuary, when 5 of the 19 points
were never sampled (items 1, 2). "Are the cause" promotes a stated
non-confirmation to a mechanism, and the missing tracer study vanishes with it
(items 6, 7). "Twice the safe limit" discards 410 and 200 and relabels a
threshold as a safety line (item 9). The water company analysing its own
discharge is gone (item 8). "Should go up" hardens "may wish to consider" into
a recommendation the source declined to make (item 12). And the two limits on
what the survey can say at all — no winter sampling, no comparison with 2023 —
are absent (items 10, 11). The naive panel loses or alters every inventory item: 1–2 lose sampling
coverage and cause of inaccessibility; 3 replaces May–September 2024 with a
relative season; 4 keeps the count but turns an occasional exceedance into
a blanket failure; 5 loses the 48-hour interval; 6–7 promote a hypothesis and
lose the missing tracer study; 8–9 lose laboratory attribution and exact
measurements; 10–11 omit comparison and winter limits; 12 strengthens the
authority’s tentative choice. It retains fragments, not three intact items.

### Panel 3 — the faithful rewrite

> **3 of the 14 sampled bathing points on the Aldenn estuary exceeded the
> intestinal enterococci threshold between May and September 2024; 5 of the
> estuary's 19 points were not
> sampled at all.**
>
> **What the source puts to the authority** — and it puts it no more strongly
> than this: it *may wish to consider* whether bathing advisory notices are
> warranted at the affected points ahead of the 2025 season.
>
> **The exceedances.** 3 of the 14 sampled points went over the intestinal
> enterococci threshold on at least one occasion between May and September 2024.
> The worst, Marle Quay, reached 410 colony-forming units per 100 ml against a
> threshold of 200.
>
> **The cause is suggested, not established.** All 3 exceedances fell within 48
> hours of heavy rainfall. The report calls this consistent with — but not
> confirmed as — combined sewer overflow discharge. No tracer study was done.
>
> **Who ran the analysis:** the water company's own laboratory.
>
> **What this does not cover:** the 5 points inaccessible throughout the works
> programme; the winter storm period, which falls outside the sampling season;
> and any comparison with summer 2023, which used a different sampling protocol.
>
> *Fidelity check: 12 items in the source's fidelity set, 12 carried, 0 dropped.*

Shorter than the source, ordered for a decision, and it makes exactly the same
claims — including the claim that the cause has not been established and that
the count is drawn from a partial survey.

Note what the restructure did that word-cutting could not. The denominator
moved into the verdict, because a reader who stops at line one must not think
three-of-nineteen. The two hedges the source used are the load-bearing content
of two separate blocks rather than subordinate clauses. Nothing below any line
reverses anything above it.

