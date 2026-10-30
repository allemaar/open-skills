# directives-audit

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Audits directive systems for authority, scope, safety, routing and drift.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You need a read-only directive assessment.
- You explicitly request housekeeping of selected findings.

## When not to use it

- The concern is skill behavior or prose alone.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/directives-audit Audit these project directives.
```

## Flow

1. Inventory sources, routes, owners and consumed forms.
2. Traverse each in-scope edge and name gaps.
3. Report findings with evidence and ownership.
4. Housekeep only on explicit request and follow its mutation gate.

## Subagents

Delegation is not a condition of the audit.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An audit and, if explicitly requested, approved housekeeping.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/directives-audit/SKILL.md](../../skills/directives-audit/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
