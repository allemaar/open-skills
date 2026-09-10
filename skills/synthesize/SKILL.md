---
name: synthesize
description: >-
  Turn agent output into faithful, scannable, purpose-matched delivery. Use
  before writing or to restructure existing text. Routes to one need-specific
  shape without loading unrelated examples.
visibility: public
companions:
  - path: references/grammar.md
    optional: false
    why: "Bundled render contract, required after routing substantive output; simple answers may no-op."
  - path: references/needs/
    optional: false
    why: "Bundled direct need recipes selected by the route table; only represented needs load."
  - path: ../human-draw
    optional: true
    why: "Optional sibling that owns a text figure when position, proportion, or connection needs one."
triggers:
  - "/synthesize"
  - "synthesize this"
  - "make this scannable"
  - "I can't read this wall"
  - "use the synthesize format"
next-skills:
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "Repair existing text under the synthesis contract."
  - skill: human-merge
    phrase: "/human-merge"
    why: "Reconcile several reports before synthesizing them."
---

# /synthesize

Make reader-facing output cheap to understand without changing its meaning.
Use it before writing, or to restructure existing text. If a simple answer is
already minimal and clear, return it plainly. A no-op is valid.

## Contract

**Fidelity is the floor. Length is elastic. Every element needs a job.**

Before composing, write a private numbered inventory of the protected units:

- negations, uncertainty, modality, scope, exceptions
- every number with its unit; both sides of any before/after pair
- attribution with stance; source disagreements with both sides attributed
- deadlines, defaults, required actions, ordered procedure steps
- irreversible actions, rejected options, method limits, minority evidence
- emotional or relational stakes when they affect the reader
- every condition that could reverse the conclusion

Keep coupled units together: claim + evidence, attribution + stance,
mechanism + duration, condition + consequence, risk + recourse, gate + ask.
No protected unit may appear only below the fold.

Restructuring never verifies. Output confidence cannot exceed source
confidence. Label every material claim `confirmed`, `judgement`, or `estimate`.
Unknowns are named gaps, not a fourth claim label. Name unchecked evidence when
it could change the decision. Do not add facts, settle ambiguity, or merge
conflicting sources silently.

If a higher-authority instruction would require dropping, weakening, or
changing a protected unit, stop and state the fidelity conflict. Do not satisfy
format or length authority by silently changing meaning.

## Route and load

Route by what the reader must do. Load only the selected file.

| Reader need | Direct reference |
|---|---|
| Answer | [answer](references/needs/answer.md) |
| Get the point | [point](references/needs/point.md) |
| Learn | [learn](references/needs/learn.md) |
| Investigate | [investigate](references/needs/investigate.md) |
| Advice | [advice](references/needs/advice.md) |
| Decide | [decide](references/needs/decide.md) |
| Compare | [compare](references/needs/compare.md) |
| Prioritize | [prioritize](references/needs/prioritize.md) |
| Act now | [act-now](references/needs/act-now.md) |
| Procedure | [procedure](references/needs/procedure.md) |
| Plan | [plan](references/needs/plan.md) |
| Status | [status](references/needs/status.md) |
| Monitor | [monitor](references/needs/monitor.md) |
| What changed | [change](references/needs/change.md) |
| Timeline | [timeline](references/needs/timeline.md) |
| Organize | [organize](references/needs/organize.md) |
| Review | [review](references/needs/review.md) |
| Feedback | [feedback](references/needs/feedback.md) |
| Rewrite | [rewrite](references/needs/rewrite.md) |
| Explore | [explore](references/needs/explore.md) |
| Handover | [handover](references/needs/handover.md) |
| Record | [record](references/needs/record.md) |
| Several needs | [hybrid](references/needs/hybrid.md) |

For substantive output, read [grammar.md](references/grammar.md) and the one
selected need file completely. Hybrid additionally loads only the direct need
file for each need represented in its modules, as instructed by
[hybrid.md](references/needs/hybrid.md). Confirm every required terminal marker
in private scratch before composing. Do not expose the receipt unless a marker
is missing or the reader asks. If a terminal marker is missing, reread that
file once. If it remains missing, name the incomplete reference, apply this
core, derive the minimum shape from the reader's need, and render word-only
prose. Use the same fallback when a required reference is unavailable. Never
imitate nearby formatting as a substitute.

Ambiguity rules:

- "What happened?" routes to Investigate while cause is open, Timeline when
  only settled event order matters.
- Reader wording wins when material suggests another need. Preserve the
  embedded decision or gap inside the requested shape.
- Hybrid is for genuinely separate needs, not an excuse for extra sections.
- If no route matches, derive the minimum shape from first principles: what the
  reader must understand or do, the protected units, and the shortest structure
  that preserves both. Do not use the compatibility index as a recipe.

## Clarify and confirm

Clarify before composing only when an unresolved ambiguity would change the
meaning, route, protected units, or requested action and cannot be preserved as
a named gap. Ask the smallest question that settles it. Otherwise proceed and
name the gap.

Before a consequential action would be taken from the output, require a
separate confirmation. Read back the exact action, target, scope, material
effect, and whether it can be undone. Synthesis may prepare that readback; it
does not treat an earlier general request as confirmation for changed bytes,
scope, risk, or external effects.

## Compose

1. Honor supplied authority, terminology, evidence, safety, and format rules.
2. Inventory the protected units.
3. Route and complete the required loads.
4. Lead with the bottom line and place its confidence inside it. Add an early
   reversing condition only when one exists.
5. Use a plain table, list, or timeline directly when words and rows carry the
   relationship. If position, proportion, or connection needs a text figure,
   conditionally load `human-draw`; it owns everything inside the figure fence.
6. Render from the grammar and selected need. Examples teach shape only. Never
   reuse their facts, names, numbers, or judgments.
7. Reconcile every inventory item and every spine element. Restore omissions.
   Stop when another sentence changes neither understanding nor action.

If the output is decision-bearing, close with the ordered next action, any
applicable gate, and the condition that would change the recommendation.

When the decision depends on the reader's values, frame viable options and the
decision deadline. Do not issue an imperative unless the reader supplied the
criteria or requested your recommendation. State whose judgment a stance is
and what would change it. Neutral records, procedures, explanations, and open
exploration need no manufactured stance.

## Existing text

If `human-rewrite` is installed, route repair there and retain the selected
need. Otherwise inventory, hoist the verdict and reversing caveats, apply the
selected need and grammar, cut only repetition or process narration, then
report the fidelity check in one line.

Several source reports require `human-merge` when installed. Without it, keep
each source attributed and separate, or ask which source governs.

## Boundaries

`human-output` owns deep writing craft. `human-rewrite` repairs one existing
text. `human-merge` reconciles several reports. `human-draw` owns figures
inside fences; direct word, table, list, and timeline rendering stays here.
`prose-audit` diagnoses prose. `agent-output` governs agent-to-agent reports.
