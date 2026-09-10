---
name: map-init
description: Install or remove the MYK directive route on selected agent surfaces. Detect first, show exact diffs, require scoped approval, write atomically, and report each result.
disable-model-invocation: true
visibility: public
self-improvable: true
requires-skills:
  - map-rules
  - map-this
triggers:
  - "/map-init"
  - "install map your knowledge"
  - "set up myk"
  - "make mapping my agents' default"
next-skills:
  - skill: map-this
    phrase: "/map-this"
    why: "Map a bounded scope after installation."
  - skill: map-rules
    phrase: "/map-rules"
    why: "Inspect the rules installed directives route into."
---

# /map-init

Install or remove the Map Your Knowledge (MYK) route on explicitly selected directive surfaces. Never touch vault content.

## Managed block

Use these marker strings exactly. Adapt placement only.

```markdown
<!-- map-init:begin -->
Before reasoning about whether Markdown is organized, unstructured, or a candidate for organization, or assessing, planning, creating, editing, naming, moving, linking, mapping, checking, or maintaining it, load `map-rules` and every reference it selects. Use `map-this` for bounded organization and zero-write assessment. If either skill or required content is unavailable, stop. Never reconstruct it from memory.
<!-- map-init:end -->
```

Parse only exact marker-only lines outside fenced code. One begin followed by one end, without nesting, is managed. Zero marker lines means absent. Every other marker arrangement is `MALFORMED` and stops.

## State model

Classify each selected existing directive file before proposing a change:

- `INSTALL`: install requested; no markers, legacy clause, or untagged equivalent exists.
- `UPDATE`: install requested; exactly one well-formed managed block is stale, or exactly one legacy `[myk.routing]` clause is present.
- `REMOVE`: removal requested; exactly one well-formed managed block or one legacy clause is present.
- `NO-OP`: the requested end state already matches exactly.
- `CONFLICT`: an untagged equivalent, competing route, unsupported placement, missing directive file, or unresolved target authority prevents exclusive management.
- `MALFORMED`: marker count, order, nesting, or fenced-code parsing is invalid.

Never create a directive file. A selected surface without an existing directive file is `CONFLICT`; provide manual placement instructions only.

## Install

1. Detect directive surfaces supported by the active runtime, repository instructions, or explicit user input. Do not guess unfamiliar formats. Report detected surfaces; note that unselected or unconfigured surfaces remain unaffected.
2. Offer detected targets and their supported scope, such as global or project-local. Do not force an every-platform sweep.
3. For each selected target, verify that its agent can resolve both required skills, `map-rules` and `map-this`. If either is unavailable, stop for that target and state the prerequisite.
4. Read each target, apply the marker parser, and report its state. An exact body is `NO-OP`. An existing `[myk.routing]` clause with zero markers is legacy-tagged and may be `UPDATE`; show its exact replacement. Never treat an untagged paraphrase as managed.
5. Build the complete candidate from the current source bytes. Show its exact per-file diff, including every changed byte. Record SHA-256 and byte count for both source and candidate. Obtain approval bound to those bytes, hashes, byte counts, named files, operation, and scope. Approval for one pair or target does not cover another.
6. Before any write, create a run-specific durable backup of the approved source with exclusive creation, flush it, re-read it, and verify its source hash and byte count. If a backup cannot be created and verified, stop. Retain it through verification and any rollback decision.
7. Inspect the target leaf and full parent chain without following links. Do the same for the exact backup and staging leaves and their parent chains before creating or replacing them. Reject symlinks, junctions, mount points, name-surrogate reparse points, unknown reparse points, or path drift.
8. Create the candidate with exclusive creation at a unique same-directory staging path. Flush, re-read, and validate it. Immediately before atomic replacement, repeat the no-follow checks and byte-compare the live source and staged candidate with the approved pair. Any drift requires a new diff and approval. If same-directory atomic replacement is unavailable, stop.
9. Re-read every target and classify the verified outcome as `installed`, `updated`, `removed`, `unchanged`, or `failed`. Report mixed state explicitly. For inaccessible surfaces, provide the exact block, placement instructions, and this check: ask the target agent what it loads before any governed Markdown organization operation; its answer must name `map-rules` and `map-this`.

## Remove or undo

- Show the exact removal diff and obtain file-specific approval.
- Require exactly one managed block, then remove it. Duplicates stop. A legacy `[myk.routing]` clause requires its own shown removal diff. Never remove an untagged equivalent.
- Apply and verify with the install write discipline.
- After a partial failure, offer rollback from the verified backup. Roll back only when the live target still matches the exact failed-run result and the backup still matches the approved source; otherwise stop on drift. Never roll back a successful target silently.

## Guards

- An exact block makes the operation idempotent.
- Never touch an unselected directive or vault file.
- Existing directives remain authoritative house style outside the block.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
