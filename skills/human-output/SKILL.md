---
name: human-output
description: >
  The contract for writing anything a person will read and decide from — a report, a finding, an answer, a request for a decision. Works on any subject: research, legal, finance, operations, planning, code. Referenced by other skills and invocable directly before a long piece of work. Trigger phrases: "/human-output", "remember I am a person not a machine", "write this for a human", "keep the reader in mind". Not /human-rewrite (repairs text that already exists) or /human-draw (builds a picture) — human-output governs writing as it happens.
visibility: public
self-improvable: true
triggers:
  - "/human-output"
  - "remember I am a person not a machine"
  - "write this for a human"
  - "keep the reader in mind"
  - "before you write the report"
next-skills:
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "The text already exists and needs repair rather than authoring."
  - skill: human-draw
    phrase: "/human-draw"
    why: "The material is relational, positional, or proportional — it wants a figure. Runs alongside this skill, which keeps the prose around it."
---

# /human-output

Five rules, then the craft behind them. The five are the contract. Everything
after is reference you consult while writing, not rules to memorise.

## The five

1. **First sentence is the verdict — and anything that would reverse it is in
   that sentence.** Not the context, not the method. The outcome.
2. **Say what it costs, not what it is.** Compute the consequence. "1x
   participating preference" is a fact; "costs you EUR 1.0M in a EUR 10M exit"
   is a decision.
3. **Label every claim: confirmed, judgement, or estimate.** A confirmed claim
   carries its source. A judgement with no basis is a guess — say so.
4. **Say what you did not check.** Every time. "Nothing material" is a valid
   and welcome answer.
5. **No shorthand the reader must decode. No picture that does no work.**

A reader can police these in fifteen seconds without re-reading. That is why
there are five and not twenty. A contract with twenty rules is a contract with
none — it gets applied by sampling, and inconsistency the reader cannot predict
is worse than no contract at all.

## Why the first rule is first

Because the reader's stopping point is the disclosure control, and you cannot
predict it. The doctrine and its test are stated once for the whole family in
`human-spec/human-contract.md` §2 — read it there. Its consequence here: a
reversing caveat is part of the verdict sentence, never a footnote.

## The shape

```
verdict  ->  the ask  ->  what it means  ->  detail  ->  ---  ->  reference
```

- **Verdict** — one sentence, including any caveat that could reverse it.
- **The ask** — the single decision or next action, with its deadline. Or
  "nothing needed".
- **What it means** — what changed, what is affected, what is now uncertain.
- **Detail** — claim first, then evidence. Headings state claims
  ("Sync drops on deep paths"), never labels ("Sync").
- **Reference**, below the divider — paths, commands, raw figures, and what
  was not checked. Nothing here may change the verdict.
- **Close by naming** what you did not expand, at most two items. Naming depth
  is inventory; listing choices is a menu.

Order by decision-relevance. Never by the order the work happened.

Under about sixty words, drop the scaffolding and just answer. A three-line
reply wearing full ceremony is worse than three bare lines.

## Length

**Fidelity is a floor. Length is a target. A floor never yields to a target.**

Write as short as fidelity allows, and no shorter. If a length limit would
require dropping a number, a scope boundary, an uncertainty, or a stated gap,
report the conflict instead of resolving it by cutting: *"Under 150 words the
exclusion criteria have to go — tell me which you want."*

Length limits are suspended entirely when the subject is irreversible or
destructive, security or credentials, money, legal or intellectual-property
exposure, a production deploy, or a migration. There, state the blast radius
and whether it can be undone. Brevity that conceals a one-way door is a
failure, not a service.

## Show me

**Bad** — method first, verdict buried, shorthand undefined:

> I reviewed the term sheet against our cap table and the comparable rounds.
> Valuation at EUR 6M pre is broadly in line for our stage. The preference is
> 1x participating, and there is a 20% ESOP top-up taken pre-money. Governance
> is a 2-of-3 board. Anti-dilution is broad-based weighted average, which is
> normal. On balance the terms appear market-standard subject to negotiation
> on a few points.

**Good** — same facts, decidable in two lines:

> **The valuation is fine; two clauses under it cost you about EUR 2.2M in a
> EUR 10M exit. Do not sign as drafted.**
>
> **Decision needed by day 10:** push back on the participating preference and
> the pre-money employee option pool, or accept and know the number.
>
> **The preference is "1x participating"** — the investor takes their EUR 1.2M
> back *and* their share of the rest. EUR 1.2M into a EUR 6M pre-money is
> 16.7% of the EUR 7.2M post-money company. On a EUR 10M exit that pays them
> EUR 2.67M, against EUR 1.67M if it were non-participating. **Costs you
> EUR 1.0M.** (Confirmed, §4.1.)
>
> **The option pool comes out of your side.** A 20% pool carved before the
> investment means you are selling at an effective EUR 4.8M pre-money, not
> EUR 6M — **EUR 1.2M of headline valuation, borne entirely by you** rather
> than shared with the incoming investor. (Confirmed, §2.)
>
> Valuation, anti-dilution and governance are genuinely standard. Not worth
> spending negotiating capital on. (Judgement.)
>
> **Not checked:** whether this investor has conceded participating preference
> before. That decides whether the pushback is cheap or a dealbreaker.

Three things happened that formatting alone cannot do. The EUR 1.0M was
*computed*, not implied by naming the clause. The claims are *labelled*, so the
reader knows which to trust. And the one unchecked thing that governs the
negotiation is *named* rather than silently absent.

The shorthand went too. The bad version says "ESOP" — employee share option
pool — and leaves the reader to decode it; the good version writes it out and
loses nothing. That abbreviation is left unexpanded above **on purpose**: it is
the defect being illustrated. `tools/human-output-check.mjs` flags it there,
correctly, which is the check working rather than the example failing.

## The craft layer

Consulted while writing. These are strong defaults, not gates.

**Words.** Expand every acronym, code name and internal term at first use, as
`Expanded name (SHORT)`. If you cannot expand it, do not use it. Write the
plain claim first and let the identifier trail it: *"Sync fails on paths over
260 characters (commit `a3f91c2`)."* Identifiers are anchors; they never carry
the point.

**Paragraphs.** Three sentences by default. A single connected argument may run
longer where breaking it would break the logic — but never two ideas in one
paragraph. Comparable items become a table; steps become a numbered list.

**Items.** A reader holds about four new things at once. That is a limit per
level, not per report: nine findings become three groups of three, not five
findings dropped. If the grouping is invented rather than natural, say so — a
false grouping costs the reader more than a long list.

**Numbers.** Put the figure beside the claim it supports; never "see above".
Give the exact value when a different value would change the action, and round
when it would not.

**Recommendations.** One per decision, with a one-line counter-case and the
cost of being wrong: *"Recommend A; if that is wrong we lose three weeks and
EUR 40k."* Two genuinely independent decisions are two asks, numbered — that is
not a menu. Exempt: a protocol whose deliverable *is* a choice set
(`next-skills`, `caller-options`, `ask-gate`) presents options by design.

**Honesty.** Never simplify substance — the reader is not a novice. Never
repeat content across layers; layers differ in resolution, not wording. And
when the thing that determines the decision is unchecked, say the decision is
not ready: *"You should not decide this yet — X is unverified and it governs
the answer."* That is a legitimate deliverable, not a failure.

**Conditionals.** When the honest answer depends, say so: *"Ship it if the
migration window holds; hold otherwise — and right now it holds."* Inventing
certainty to satisfy the one-sentence shape breaks rule 1 rather than
satisfying it.

## Two audiences

Write for the person by default. Emit a machine-readable block only when the
consumer is an agent or a tool that parses it. When both are present, the
person's section comes first and stands alone — a reader who never reaches the
machine block must still be able to decide.

## Checking

From the `open-skills` repository root, run
`node tools/human-output-check.mjs <draft-path>` on drafted text before sending.
From this skill directory, the equivalent command is
`node ../../tools/human-output-check.mjs <draft-path>`. What it
grades, and the far longer list of what no script can grade — including the
fact that nothing verifies a number in your prose against a number in your
source — is the family checker contract, `human-spec/human-contract.md` §3.

## How other skills use this

Add a footer rather than restating the rules:

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

Inline the five rules into any worker or subagent brief. A subagent does not
inherit the harness's response guidance, and unbriefed workers are where
verbose reporting accumulates.

## Boundary

This skill is one member of the `human-` family. The routing table — which
member handles which material — is `human-spec/human-contract.md` §1.

- Not `/human-rewrite` — the repair pass on text that already exists.
- Not `/human-draw` — that owns what is inside the fence; this owns the words
  around it. They **run together** on any output carrying a figure; neither
  precedes nor replaces the other.
- Not `/human-merge` — several separate reports into one. A merge is *written*
  to this contract and adds only the cross-report layer on top of it, so route
  the pile there first and return here to write the result. See
  `human-spec/human-contract.md` §1.
- Not `/ask-gate` — that decides *whether* to ask the handler; this governs how
  the asking is written.
- Not a substitute for having something to say. A well-shaped report of a
  badly-done investigation is a faster route to a bad decision.

> **Next skills.** On completion, run the Next Skills protocol
> (`next-skills/SKILL.md`): surface the `next-skills` recommendations from
> front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol
> (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-
> recurring weakness in this skill, propose a specific fix for the handler to
> approve. Conservative — silent otherwise. Never auto-apply.
