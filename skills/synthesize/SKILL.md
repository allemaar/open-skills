---
name: synthesize
description: >-
  Synthesize any agent output into a scannable, faithful, purpose-matched
  delivery. Append /synthesize to a brief to govern the pending output, or
  invoke it on an existing wall of text to restructure it. Designed for any
  subject and any reader. Trigger phrases: "synthesize this", "make this
  scannable", "I can't read this wall", "use the synthesize format".
visibility: public
companions:
  - path: references/grammar.md
    optional: false
    why: "The required visual grammar read fresh for every synthesis."
  - path: references/output-map.md
    optional: false
    why: "The required need-to-shape routing map used to select one output recipe."
triggers:
  - "/synthesize"
  - "synthesize this"
  - "make this scannable"
  - "I can't read this wall"
  - "use the synthesize format"
next-skills:
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "An existing text needs repair under this contract — human-rewrite owns the after-writing mode when installed."
  - skill: human-merge
    phrase: "/human-merge"
    why: "Several source reports must be reconciled before one synthesis can honestly stand."
---

# /synthesize

You are about to write something a person will read while tired. This skill makes that reading cheap without losing a single thing that matters.

It works in two positions. **Before writing:** the brief includes /synthesize; produce the output in this contract, and carry it forward for later outputs on a best-effort basis — the contract is guaranteed for the current output; only re-invocation (or a runtime hook) guarantees later turns. **After writing:** the reader invokes /synthesize on an existing text; restructure that text under the same contract without changing what it claims. If the skill `human-rewrite` is installed, hand the after-writing case to it and give it this skill's grammar as the target form; if not, follow the procedure at the end of this file.

## The one law over everything

**Fidelity is the floor. Length is elastic. Every element earns its place.** Never delete meaning to look short. Never add structure to look thorough. If the text is already minimal and well-shaped, say so and change nothing — a no-op is a legal result.

## The procedure — every time, in this order

0. **Take the context, if any.** The caller or an installed domain skill may supply constraints: who holds authority, terms that must appear verbatim, evidence standards, safety rules. Honor them through every later step. Supplied nothing? The default is plain-reader output in the lay register — that absence is a defined state, not a gap.
1. **Route, then extract ONE recipe.** The reader's NEED selects the scaffold — find it in the table below, then search [references/output-map.md](references/output-map.md) for that need's anchor token as LITERAL text (`[need:decide]`, `[need:status]`, … — fixed-string mode, e.g. `grep -F`/`rg -F`; the brackets are not a regex pattern) and read that ONE section IN FULL — its exemplar is the form you copy — and nothing beyond it. Never load the whole map: the other 22 exemplars are noise in your context and a contagion risk near your subject. The RELATIONSHIPS in the material (sequence, comparison, hierarchy, change, evidence, none) select the form within that scaffold — a form exists only when its relationship exists. Purpose breaks ties. Honor the relationship in the RENDER too: a comparison becomes a table, event-order becomes a timeline, several areas become modules — never flatten them all into status rows. **Contagion guard:** the exemplar you extract is teaching fiction — copy its SHAPE, never its names, numbers, or entities; when your subject overlaps its domain, its values are radioactive and everything re-derives from your own source.
2. **Inventory.** WRITE the protected set of the material (next section) as an ATOMIC numbered list before composing anything — one protected fact per item; a coupled unit may share one number only when both named halves are written explicitly. Scratch material, never shown to the reader. A mental inventory is not an inventory, and "vendor terms" is not an item: unwritten and lumped units are the ones that vanish under compression.
3. **Lead and hoist.** Write the bottom line first — and the confidence rides IN it, never demoted to a row: "Probably X, because…", "X, per [the surveyor's report]", "X — unverified". A confident bare verdict over uncertain material is manufactured authority. When the decision turns on the READER'S values (health, family, money, identity), the bottom line frames the options ("Tuesday keeps both open — your call by 17:00"), never an imperative; imperative bottom lines require reader-supplied criteria or an explicit ask for your pick. Add a "Yes, but" ONLY if the inventory contains a genuinely reversing condition — most outputs have none, and inventing one is a defect.
4. **Render — from the grammar, never from ambient context.** READ [references/grammar.md](references/grammar.md) NOW, THIS invocation — not from memory of a past read, and never inferred from the styles around you: the surrounding conversation's formatting is contagion, not contract (an agent that renders in its context's house style instead of this grammar has failed this step, whatever the output looks like). Prove the read the same way the inventory is proven — WRITE, in the same scratch: the register chosen (impersonal or personal, and why the stakes pick it) and the devices this output has EARNED (rail? ladder? table? modules? fold? — each exists only if its condition exists). Unwritten choices are imitation wearing the grammar's clothes. If grammar.md is missing or unreadable, say so to the reader and render as plain word-only prose — words own all meaning; never fill the gap by imitating what is nearby.
5. **Check and stop.** Every row carries one job, briefly. Now RECOUNT: tick every numbered inventory unit against the output, and walk the chosen need's spine — every protected unit present, every coupled pair intact, every spine element served, nothing protected below the fold, and no run of three or more identical-status rows left ungrouped — a column of repeated identical cues is a defect, not emphasis. An unticked unit ENTERS the output — there is no omission exception; if a higher-authority constraint (step 0 context, safety rule, the surface itself) forbids preserving it, stop and surface the conflict to the reader instead of certifying the loss. Say nothing else about this check unless you are restructuring an existing text or the reader asks. Stop when the next sentence would change neither understanding nor action.

## What must survive (the protected set)

Before cutting anything, mark the survivors. These survive by DEFAULT, on syntax alone, before any judgment call:

- negations ("not", "never", "no longer", "except", "unless")
- uncertainty and modality ("probably", "might", "unverified", "estimated")
- every number with its unit, and both halves of any before→after pair
- names attached to positions ("Dr. Ionescu says X") — the name and the stance together
- scope limits and exceptions ("only on weekdays", "not for enterprise accounts")
- disagreement between sources — both sides, attributed
- deadlines, defaults ("if we do nothing by the 25th, X happens"), and required actions
- the mandated ORDER of procedure steps — sequence is content, not layout
- anything irreversible — marked plainly: **one-way — no undoing it**
- any condition that could reverse the conclusion

And one judgment tier beyond syntax: emotional or relational stakes ("she is frightened of the operation"), minority or anomalous data points, options considered and rejected, and stated method limits ("we only asked one branch") survive at least as a pointer above the fold. They rarely trip a syntax rule, and they are exactly what a tired reader needed kept.

**Coupled units live and die together.** A claim with its evidence · an attribution with its stance · a mechanism with its duration · a before with its after · a condition with its consequence · a risk with its recourse (recourse may be reversal, mitigation, professional help, or honestly "no remedy exists") · a gate with its ask. Keeping one half and dropping the other counts as a loss, not a save. And no protected unit may sink below the fold (the `---` line) — if the reader could stop before it, it is in the wrong place.

## The compiler — shown, not described

The worked example below sits inside a fence because it is TEACHING MATERIAL: study its shape, never copy the fence, and note that real output contains no numbering marks and no commentary — only the lines themselves.

```text
(1) Bottom line: hold the launch until Thursday's check passes.
(2) Yes, but — if the partner confirms in writing before then, launch today.
(3) Problem — the consent form is unsigned [deal-breaker]
(4) Watch — two of five reviewers disagree on the wording; Priya wants
    "consent", legal wants "authorization" — settles when both sign off
    before Thursday's print deadline
(5) Good — budget, venue, and printing are all confirmed
(6) Next step — get the form signed today; everything else is ready.
    ---
(7) Full reviewer notes and the form's history below the line.
```

What each line demonstrates — the operations, named for the author only (the reader never sees these words):

1. **Lead** — the decision-changer is sentence one. Rendered as a bold-led blockquote in rich chat.
2. **Hoist** — the reversing condition sits above every stopping point, and it is written as one causal sentence: condition → changed consequence ("if X, then the decision becomes Y"). A bare fact whose implication the reader must derive is not a hoist — say what it flips. A claim that LOWERS perceived risk gets the same causal treatment plus its evidence tag in the line itself: an unverified reassurance is itself a reversing condition. This line exists ONLY because a real reversing condition exists; had there been none, line (2) would be absent, and that absence is correct.
3. **Keep** — each row is one unique job, worst first. Decision-bearing support (or a pointer to it) stays beside its claim; only raw depth goes below the fold.
4. **Keep** — dissent survives with both names and both stances in the row itself.
5. **Group** — three greens collapsed into one row so the serious rows win attention. This is MANDATORY, not stylistic: a run of three or more same-status rows never renders with its cue repeated per row — one cue + word leads the whole group, and a visual anchor repeats ONLY where each repetition marks a genuinely distinct status. Items with individual audit, consent, safety, or handover value stay listed — as plain lines UNDER that single cue'd label, never with the cue stamped on each.
6. The action row — advances the decision, or does not exist.
7. **Layer** — depth goes below the `---` fold; a reader stopping at any earlier line is not wrong. **Stop** — nothing follows the last unit that changes understanding or action. **Cut** (invisible): the meeting chronology, three restated conclusions, and an explanation of what a consent form is were all removed.

## Routing — the need selects the shape

Ask: what does this reader need to DO with this? Find the need in [references/output-map.md](references/output-map.md) — twenty-three recurring needs, each with its minimum spine and a worked exemplar. Common front doors:

| The reader says | Need | | The reader says | Need |
|---|---|---|---|---|
| "what's the answer?" | Direct answer `[need:answer]` | | "make me a plan" | Plan `[need:plan]` |
| "short version?" | Get the point `[need:point]` | | "what do I do right now?" | Act now `[need:act-now]` |
| "explain this" | Learn `[need:learn]` | | "what comes first?" | Prioritize `[need:prioritize]` |
| "help me choose" | Decide `[need:decide]` | | "what changed?" | What changed `[need:change]` |
| "what's the difference?" | Compare `[need:compare]` | | "how did we get here?" | Timeline `[need:timeline]` |
| "where are we?" | Status `[need:status]` | | "how do these fit?" | Organize `[need:organize]` |
| "why is this happening?" | Investigate `[need:investigate]` | | "is this good enough?" | Review `[need:review]` |
| "should I worry?" | Monitor `[need:monitor]` | | "help me improve this" | Feedback `[need:feedback]` |
| "walk me through it" | Procedure `[need:procedure]` | | "say this for my audience" | Rewrite `[need:rewrite]` |
| "your take?" | Advice `[need:advice]` | | "give me directions/ideas" | Explore `[need:explore]` |
| "brief the next person" | Handover `[need:handover]` | | "capture this / receipt" | Record `[need:record]` |

Several needs in one output → Hybrid `[need:hybrid]` (modules under one bottom line). "What happened?" splits: an open cause → Investigate; settled history where only the order matters → Timeline. When the reader's words and the material disagree ("summarize this" over an undecided choice): the reader's words route; the material's decision earns a 👤❓ **Your call** row inside that shape, not a rescaffold.

A hybrid output composes modules under ONE bottom line; the decision layer owns the top and the action row. If no need fits, derive from first principles: what must the reader decide, understand, verify, continue, or stop; which units uniquely serve that; which relationships exist (sequence, comparison, hierarchy, change, evidence); which shape exposes those relationships cheapest; where may the reader safely stop.

## Rendering — pointer, not restatement

All visual rules live in [references/grammar.md](references/grammar.md): the status words and their two registers, symbols and when they may accompany words, progress bars, spacing, modules, the fold, and what degrades where. Two rules are load-bearing enough to repeat here: **words carry the meaning in every mode — symbols only accompany them**, and **contrast is a budget** — every emphasis device dies of overuse.

## Stance — conditional, never manufactured

When the output makes or implies a judgment, state whose judgment it is and what would change it ("My read: X — this flips if Y"). When nothing is being judged — a record, a procedure, a neutral summary, an open exploration — no stance appears, and manufacturing one is a defect. A recommendation is only legitimate when the deciding criteria are known or the reader asked for your take.

## Two modules every need may borrow

- **Clarify (elicitation):** when a missing variable changes the result, halt and ask well — the missing variable, why it changes the answer, ONE answerable question, the valid answer shapes or examples, a free-text/unknown escape, and what happens after the answer. Never speculate around a gap the reader can close in one reply.
- **Confirm (before committing):** before any consequential action — the exact proposed action, the inputs being used, the material consequence, reversibility or the change path, and the explicit authorization point (👤❓ **Your call**). Consumed by Decide, Act now, Procedure, and Hybrid.

Both are modules, not needs: one elicitation shape, two jobs.

## Refusals and edges

- **Restructuring is not verification.** The output's confidence ceiling is the source's. Unverified, single-source, or advocacy material is NAMED in the bottom line ("Per the vendor's brochure: …"); restructuring never upgrades its truth status.
- **Already synthesized:** return it unchanged and say so.
- **Several source reports to merge:** use `human-merge` if installed. Standing alone, do not silently blend them — synthesize each source's claims under its own attribution, or ask which source governs. Self-sufficiency means a defined fallback, not a silent merge.
- **Narrative or emotionally heavy content** (bad news, personal accounts): rows read as cold. Use calm prose — short paragraphs, the bottom line still first, the caveat still early. The grammar serves the reader, never the reverse.
- **The brief demands a specific format** ("give me a table"): the brief wins; apply the law inside it.

## Restructuring an existing text (when human-rewrite is not installed)

1. Inventory the protected set of the source (list it; this is your checklist).
2. Find the bottom line; write it first. Hoist any reversing condition next.
3. Route by the reader's need; render per the grammar.
4. Cut only what changes no meaning, action, confidence, or navigation.
5. Check the inventory: every protected unit present, every coupled pair intact, none below the fold. State the check's result in one line ("Nothing dropped; 3 repeated conclusions and the chronology removed.").

## Boundaries with siblings (when installed)

`human-output` governs writing craft in depth; `human-rewrite` owns repairing existing text (and owns this skill's after-writing mode); `human-draw` builds text figures; `human-merge` reconciles multiple reports; `prose-audit` diagnoses without rewriting; `agent-output` compresses agent-to-agent traffic. /synthesize alone is self-sufficient; with the family present, it is the front door.

## Extending the skill

Three different things extend three different ways. A NEED requires: recurrence across materially different domains, a minimum spine that differs from every existing need's, failed composition from what exists, teachability by one phrase plus one neutral exemplar, and reader evidence. A TERM (word, label, tag) requires: a distinct job no existing term performs, and plain-language recognition. A SYMBOL requires: evidence the reader's own community already uses it that way, a collision check against every existing channel, and an eviction account — one in, name what goes out or why nothing must. The Visual Cue Library is the registry for symbol roles beyond the core; entries ship only with owned, tested when-to-use guidance. Waiver on record: the reader-evidence criterion for THIS version's contents is explicitly deferred to the live field test — nothing in this file is reader-validated yet, and the file says so rather than pretending. Propose; never silently extend.
