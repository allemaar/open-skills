# domain-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reconcile domain availability signals using registration and DNS evidence.

**Family:** Web. **Subagents:** No subagent step prescribed.

## When to use it

- Check a candidate domain
- Investigate disagreement between lookup providers

## When not to use it

- Treating DNS silence as proof of availability

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/domain-check check example.org
```

## Flow

1. Query registration data and relevant DNS resolvers
2. Apply the documented evidence precedence and fallbacks
3. Report uncertainty, coverage gaps and conflicting signals

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A qualified availability assessment with sources.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/domain-check/SKILL.md](../../skills/domain-check/SKILL.md)
- [skills/domain-check/protocol.yon](../../skills/domain-check/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
