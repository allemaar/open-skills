# The human- family contract

> Apache-2.0. Shared doctrine for the `human-` family (not a skill — this folder
> ships no `SKILL.md` and is not counted in the pack). Companion to
> [the folder overview](README.md). The members are
> [`human-output`](../skills/human-output/SKILL.md),
> [`human-rewrite`](../skills/human-rewrite/SKILL.md) and
> [`human-draw`](../skills/human-draw/SKILL.md).

The family answers one question: **a person has to read this and act on it —
what shape does it take?** Each member owns one answer. This file holds what is
true of all of them, so no member restates another. A rule stated twice drifts;
a rule stated once and linked cannot.

## 1. The roster and the routing table

Given a piece of material, this decides which member handles it. Read the
material's *shape*, not its subject — every member works on any subject.

| The material you are holding | Member | Why |
|---|---|---|
| One fact, one finding, one verdict | `human-output` | A sentence. A figure here would do no work. |
| Several items sharing one attribute set | `human-output` | That is a table, and always was. Not a figure. |
| Relational, positional, proportional, sequential, containing | `human-draw` | Position and length carry meaning that prose has to make the reader reconstruct. |
| Text that already exists and is correct but unreadable | `human-rewrite` | Repair, not authorship. The claims are already made. |
| Several separate reports that must become one | `human-merge` | **Not yet shipped** — see below. |
| You are about to write something new | `human-output` | The default. It governs writing as it happens. |

Two members routinely run **together**, not in sequence: a figure never ships
bare, so `human-draw` owns what is inside the fence while `human-output` owns
the verdict above it and the caption below it. Neither is the other's successor.

`human-rewrite` converges on `human-output` — the rewrite applies that contract
to somebody else's text — and hands off to `human-draw` at its restack step
when the material turns out to be relational.

**`human-merge` is specified but not written.** Nothing in this pack ships it.
Until it does, do **not** merge several reports by reflex, and in particular do
not route the merge to `human-rewrite`: that member reads nothing beyond the one
text it was handed and adds no facts, so combining N sources is outside its
contract and would silently drop whatever it never saw. Meanwhile: say plainly
that the input is several documents rather than one, then either rewrite one
named report at a time, or author a new report under `human-output` and treat
each source as material you are reading — with every number traced back to the
document it came from, per section 3.

## 2. The stopping-point doctrine

**The reader stops at a point you cannot predict, and a transcript has no
collapse control.** Everything you write is visible and nothing can be hidden
behind an expander, so the reader's stopping point *is* the disclosure control.

**Every prefix must therefore leave them correct.** Correct-but-incomplete is
fine. Incomplete in a way that flips a decision is a defect.

Test any sentence: *if they stop immediately before this, are they now wrong?*
If yes, it belongs earlier.

Three consequences, one per member, and they are the same rule:

- **Writing** — a reversing caveat is part of the verdict sentence, not a
  footnote. Disclosure below the stopping point is not disclosure.
- **Repairing** — a caveat placed further down "for completeness" is, for a
  reader who stops early, deleted. Hoist reversing caveats *before* reordering,
  or the reorder strands them beneath the material they qualify.
- **Drawing** — the verdict sits above the figure and the caption below states
  the finding, so a reader who never looks at the picture is still correct.

This is the one doctrine every member depends on and none of them may restate.
Cite it; do not copy it.

## 3. The checker contract

`tools/human-output-check.mjs` grades the **mechanical half** of the contract.
It checks: acronyms expanded at first use, one marked recommendation, sentence
length, printable ASCII inside fences, fence width, whether a drawn figure's
bars are proportional to the labels printed beside them, and whether stated
percentages sum to 100.

Run it on drafted text before sending. A rule with no gate drifts silently
while everything else stays green.

**What it cannot check.** Rules 1, 3 and 4 of the contract — is the first
sentence really the verdict, is each claim labelled with the right confidence,
is "what I did not check" honest — are judgement, and no script grades them.
Neither are `human-draw`'s alignment, node ceiling and honest-encoding checks,
nor `human-rewrite`'s reconciliation and confidence-drift steps. That last pair
is exactly why the rewrite emits a visible fidelity trace: the trace is the
substitute for a gate that cannot exist.

**And the one that matters most: nothing verifies that a number in your prose
traces to a number in your source.** That check — "is this figure invented?" —
catches the most damaging defect there is, and it needs a person, or a separate
reader with the source in hand.

So when the work is a report *about* other material, freeze the inputs, then
compare every numeral in your output against them one at a time. **A
self-report of having verified is not evidence of verification** — a writer who
was warned about fabrication, told to verify, and who says they verified can
still have invented a load-bearing figure, and nothing in the output
distinguishes the two cases. Treat every number as unverified until a second
reader with the source in hand confirms it. A green run
from the checker means the countable rules hold; it says nothing about whether
you made a number up.

## 4. The shared footer

**Every member carries the same two protocol footers**, verbatim, as the last
two blocks of its `SKILL.md`:

- **Next skills** — on completion, run the Next Skills protocol
  (`next-skills/SKILL.md`): surface the front-matter `next-skills`
  recommendations for the caller to pick. Offer only, never auto-invoke.
- **Self-improvement** — on completion, run the Self-Improvement Protocol
  (`self-improve/SKILL.md`): propose a fix only for a concrete,
  blocking-or-recurring weakness. Conservative, never auto-applied.

**A growing set of the pack's other skills carries the family's outward
footer** — currently the six highest-output ones: `cold-review`,
`improve-codebase-architecture`, `insight-cross-examine`, `insight-retro`,
`investigate` and `plan-create`. It is one line, in place of restating any rule
above:

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

Inline the five rules of `human-output` into any worker or subagent brief. A
subagent does not inherit the harness's response guidance, and unbriefed
workers are where verbose reporting accumulates.

## 5. Roster edits

Adding, cutting, or renaming a member is an edit **here** plus the member's own
boundary section — not an N-by-N sweep of every sibling. The routing table above
is the single place that has to know the whole roster. That is the point of a
manifest: N members otherwise need N-squared cross-references, and the pair that
nobody updates is the one that goes stale.
