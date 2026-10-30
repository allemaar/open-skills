# monorepo-deps

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Coordinate dependency checks, repairs, updates and lockfile maintenance for npm workspaces.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- Check version mismatches
- Update a monorepo within agreed major-version caps

## When not to use it

- A narrow question about one tool's API

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/monorepo-deps check and update this npm workspace
```

## Flow

1. Inspect prerequisites and select check, fix, update, or configuration maintenance
2. Establish permitted changes and update bounds for the chosen operation
3. Run that operation, including lockfile resynchronization when applicable
4. Run the required checks and report results

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Dependency changes and verification results.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/monorepo-deps/SKILL.md](../../skills/monorepo-deps/SKILL.md)
- [skills/monorepo-deps/protocol.yon](../../skills/monorepo-deps/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
