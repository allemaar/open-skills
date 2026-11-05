# diff-recap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Summarize an actual Git diff as a reconciled, pasteable recap.

**Family:** Git & sync. **Subagents:** No subagent step prescribed.

## When to use it

- Prepare a pull request summary
- Explain file-level changes

## When not to use it

- A substitute for reviewing correctness
- Rename/copy or two-path input: the current single-path format returns an unsupported-input diagnostic.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/diff-recap summarize the changes on this branch
```

## Flow

1. Capture file status and counts directly from Git for the selected diff
2. Rename/copy statuses including scores or two-path forms return UNSUPPORTED INPUT before emission; never collapse paths or label this NO DIFF.
3. Group and label rows without inventing intent
4. Validate unique file paths, required status, rows and totals with the bundled value gate; fail closed if the diff is empty or unavailable
5. Render the appropriate human or agent output

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
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
