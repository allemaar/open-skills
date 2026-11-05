---
name: human-merge
description: >
  Takes several separate reports — from several agents, several sources, or several documents — and returns one surface a person can decide from. Each report may be individually fine; the pile is what defeats the reader, and the relations between reports are invisible to every author who wrote one. Collapses reports that share an upstream source into the single source they are, names what is now superseded and whether a live decision rests on the dead figure, classifies conflicts instead of averaging them away, and pools coverage so a gap no single report had becomes visible. Works on any subject: research, legal, finance, operations, conservation, code. Trigger phrases: "/human-merge", "merge these reports", "combine what the agents found", "what do all of these add up to", "the sub-agents all came back", "did anything here contradict anything else". Not /human-output (the writing contract, which this skill links to rather than restates) or /human-rewrite (repairs one existing text and explicitly refuses several) — human-merge governs the pass across many.
visibility: public
self-improvable: true
companions:
  - path: references/human-contract.md
    optional: false
    why: "The required portable family doctrine and style floor; bundled inside this skill."
  - path: references/tools/human-output-check.mjs
    optional: false
    why: "The required mechanical merged-output checker; bundled inside this skill."
  - path: references/examples/museum-archive.md
    optional: false
    why: "Bundled worked example; read only for the conditions in the worked-example section."
  - path: ../human-output
    optional: true
    why: "Optional sibling with the full prose layer; the bundled style floor is the fallback."
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

> **The complete style layer lives in `human-output` when that skill is
> installed.** Otherwise apply the portable style floor, stopping-point rule,
> and checker contract in
> [`references/human-contract.md`](references/human-contract.md). This file
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
evidence.** Read supplied briefs before the reports; if unavailable, use the unknown-independence fallback below. Two workers sent the same
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
parked items — is illustrated at the end of the [museum example](references/examples/museum-archive.md). Whenever this
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

The [museum example and numeral trace](references/examples/museum-archive.md)
are bundled separately. Read them for an explicit onboarding or demonstration
request, or when a procedural ambiguity remains after reading the core rules.
Ordinary merges skip the example. It illustrates this procedure and supplies
no evidence about the current inputs.

Keep the example's frame discipline on every route: a chosen analysis frame,
such as a time horizon, is a choice rather than a source finding. Label it where
first used and expose any decision-reversing alternative alongside it.

Resolve the reference relative to this installed skill directory. If it is
missing or unreadable, report that gap and use the core procedure; do not
reconstruct the example or resolve unknown input facts from it. Report any
remaining procedural limitation. Return to **Checking** after the example;
the ordered procedure, ledger and complete numeral trace remain mandatory.

## Checking

Resolve this installed skill's directory and run `node <skill-dir>/references/tools/human-output-check.mjs <draft-path>` on the merged draft. The bundled checker grades the
mechanical half: printable characters and width inside figures, bar arithmetic,
percentage sums, sentence length, acronym expansion, one marked recommendation.

It cannot grade whether independence was established, whether a conflict was
classified honestly, or whether a dropped claim was superseded rather than
merely inconvenient. Nor can it tell an invented figure from a traced one —
that limit and its remedy are the checker contract,
`references/human-contract.md` section 3. So do the one check that catches the
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
member handles which material — is `references/human-contract.md` section 1.

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
  Merge reads the supplied finished reports and accompanying provenance briefs; it does not retrieve new source material.
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

> **Self-improvement.** Run the Self-Improvement Protocol only when its installed owner is available. Preserve its qualification, vetting and approval rules. If absent, skip that optional hook without claiming it ran, surfacing an unvetted fix or auto-editing; substantive work may complete.
> (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this
> run; surface any surviving proposal for handler approval. Conservative —
> silent otherwise. Never auto-apply.
