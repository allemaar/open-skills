# directives-audit

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A project has accumulated standing instructions and you need to know whether their authority and routing still make sense. This audit inventories selected entrypoints, conditional routes, managed projections and consumed forms, then traces the in-scope edges.

Findings separate what to do with a rule from its severity and any conflict. Source-to-consumed parity for checked surfaces does not by itself prove runtime behavior.

## Where it fits

Use it for directive authority, safety and routing. Skill-smith owns skill behavior; prose-audit owns reader-facing wording.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You need a read-only directive assessment.
- You explicitly request housekeeping of selected findings.

## When not to use it

- The concern is skill behavior or prose alone.

## How to use it

Start with a concrete request. For example:

```text
/directives-audit Audit the project entrypoint and the conditional files it routes to; report unreachable paths and consumed-form gaps.
```

## Flow

1. Inventory sources, routes, owners and consumed forms.
2. Traverse each in-scope edge and name gaps.
3. Report findings with evidence and ownership.
4. Housekeep only on explicit request and follow its mutation gate.

## Common questions

**Does the audit automatically repair the directives?**

No. It is read-only by default; selected housekeeping is a separate explicitly requested operation.

## It is working when

- The report names its inventory and unchecked edges, and gives each material finding a disposition, conflict and severity with a source location.

## Subagents

Delegation is not a condition of the audit.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An audit and, if explicitly requested, approved housekeeping.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/directives-audit/SKILL.md](../../skills/directives-audit/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
