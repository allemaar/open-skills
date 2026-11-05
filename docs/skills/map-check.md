# map-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Run a read-only conformance check on a bounded knowledge map.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Check a map's health
- Inspect graph conformance

## When not to use it

- Applying repairs or claiming an unqualified all-clear

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/map-check check this project map
```

## Flow

1. Identify the scope and load the governing rules
2. Run the bundled checker with the appropriate inventory
3. Inspect findings and operational errors separately
4. Report exactly what was and was not checked
5. If map-rules is absent, keep the compiled checker boundary and report manual rule/provenance review unavailable.
6. In DEGRADED mode, supply the established scope root with a contained relative root-map locator; nested-target walk-up is not promised.
7. Require every governed Markdown entrypoint to be readable, even for a plain link without a fragment. Keep invalid declarations and unreadable or capped resolution distinct from qualified-clean; manual rulings never rewrite the deterministic verdict.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A scoped conformance report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-check/SKILL.md](../../skills/map-check/SKILL.md)
- [skills/map-check/references/tools/map-check.mjs](../../skills/map-check/references/tools/map-check.mjs)
- [skills/map-rules/references/ownership.md](../../skills/map-rules/references/ownership.md)
- [skills/map-rules/references/link-resolution.md](../../skills/map-rules/references/link-resolution.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
