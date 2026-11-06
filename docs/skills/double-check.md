# double-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A migration report says all records are preserved, but that claim will drive a release decision. Double-check goes back to the actual migration and supporting evidence, identifies assumptions and tries to disprove the claim before giving a cited verdict.

The result is a cited verdict: SOLID when the target withstands scrutiny, IMPROVED when issues and proposed fixes are identified, or RETHINK when the problem is fundamental. A proposed fix is distinct from applying it.

## Where it fits

Choose double-check for a bounded re-examination; verify is the formal gate against intent, plan and execution, while insight-critique provides an advisory review.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- A claim needs a targeted re-check.
- You want assumptions challenged before relying on an output.

## When not to use it

- You need a formal phase gate.

## How to use it

Start with a concrete request. For example:

```text
/double-check Recheck the claim that the approved migration preserves all customer records; inspect the migration and its verification evidence.
```

## Flow

1. Identify a clear target and reread it.
2. Challenge assumptions and cross-check sources.
3. Iterate on issues and report a verdict with evidence and uncertainty.

## Common questions

**Can prior analysis stand in for rereading the source?**

No. The check returns to the actual files, code or other sources and cites evidence for its conclusions.

**Does an IMPROVED verdict mean fixes were applied?**

No. It identifies issues and proposed fixes, with an offer to apply them and check again.

## It is working when

- A concrete target and its assumptions are checked against current source evidence.
- The report gives one supported verdict and identifies any consequential issues or uncertainty.

## Subagents

Caller Options can select inline or delegated checking.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A targeted verdict and corrections.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/double-check/SKILL.md](../../skills/double-check/SKILL.md)
- [skills/double-check/protocol.yon](../../skills/double-check/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
