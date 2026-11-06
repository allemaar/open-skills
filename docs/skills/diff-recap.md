# diff-recap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A reviewer wants to see what a branch changes, file by file, without reconstructing the diff. The skill captures statuses and line counts from the same Git range, groups the rows by area and calculates totals from those rows; it authors labels rather than guessing the numbers.

The bundled value gate checks row and total consistency and can compare paths and counts with a numstat capture. It does not prove capture origin, freshness or status transcription. Human-facing output includes a complete text recap; the agent branch returns the structured record.

## Where it fits

Use diff-recap for a concrete change-set summary. Orient-map describes trajectory, orient-status describes position, and cold-review examines correctness separately.

**Family:** Git & sync. **Subagents:** No subagent step prescribed.

## When to use it

- Prepare a pull request summary
- Explain file-level changes

## When not to use it

- A substitute for reviewing correctness
- Rename/copy or two-path input: the current single-path format returns an unsupported-input diagnostic.

## How to use it

Start with a concrete request. For example:

```text
/diff-recap Summarize the diff from main to this branch for a pull request; group the changed files and preserve Git's counts.
```

## Flow

1. Capture file status and counts directly from Git for the selected diff
2. Rename/copy statuses including scores or two-path forms return UNSUPPORTED INPUT before emission; never collapse paths or label this NO DIFF.
3. Group and label rows without inventing intent
4. Validate unique file paths, required status, rows and totals with the bundled value gate; fail closed if the diff is empty or unavailable
5. Render the appropriate human or agent output

## Common questions

**Why does a rename stop instead of appearing as one file row?**

The current record has one path per row and cannot represent both old and new paths faithfully. It reports unsupported input rather than dropping information.

**Does passing the value gate prove the captured diff is current?**

No. The emitter must bind and capture the correct Git source and transcribe statuses; the checker verifies only its stated value and optional numstat comparisons.

## It is working when

- Every supported file row and total is reconciled against the selected capture, with any unsupported input or barren source reported honestly.
- The selected human or agent rendering preserves its required information and does not claim code review.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An evidence-backed recap with file rows and totals.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/diff-recap/SKILL.md](../../skills/diff-recap/SKILL.md)
- [skills/diff-recap/protocol.yon](../../skills/diff-recap/protocol.yon)
- [skills/diff-recap/references/tools/diff-recap-check.mjs](../../skills/diff-recap/references/tools/diff-recap-check.mjs)
- [skills/diff-recap/references/render-face-contract.md](../../skills/diff-recap/references/render-face-contract.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
