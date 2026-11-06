# map-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a declared Map Your Knowledge scope and want to know whether its ownership and navigation conform to the implemented checks. Map-check runs a bounded, read-only checker and reports inventory, mode, findings and omissions.

A zero-finding result is qualified to the checks and inventory actually covered. Unreadable boundaries, incomplete inventory or an unavailable checker cannot become an unqualified all-clear.

## Where it fits

Use it to inspect a governed scope. Map-this and map-maintain own proposed and selected repairs.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Check a map's health
- Inspect graph conformance

## When not to use it

- Applying repairs or claiming an unqualified all-clear

## How to use it

Start with a concrete request. For example:

```text
/map-check Check the declared project scope at this path and report the checked inventory, findings and omissions.
```

## Flow

1. Identify the scope and load the governing rules
2. Run the bundled checker with the appropriate inventory
3. Inspect findings and operational errors separately
4. Report exactly what was and was not checked
5. If map-rules is absent, keep the compiled checker boundary and report manual rule/provenance review unavailable.
6. In DEGRADED mode, supply the established scope root with a contained relative root-map locator; nested-target walk-up is not promised.
7. Require every governed Markdown entrypoint to be readable, even for a plain link without a fragment. Keep invalid declarations and unreadable or capped resolution distinct from qualified-clean; manual rulings never rewrite the deterministic verdict.

## Common questions

**Can it run without the scope contract?**

A separately declared root map can support degraded mode when the scope root and contained root-map locator are supplied.

## It is working when

- The result states the exact checks, scope, inventory and unchecked areas, or why no verdict is available.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
