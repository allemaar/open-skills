# synthesize-init

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Installs, updates or removes a managed synthesize route in existing directives.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You explicitly want a standing route changed.
- You want to remove a managed route.

## When not to use it

- You only want to use synthesize or create a directive file.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/synthesize-init Install the route in my selected directive file.
```

## Flow

1. Resolve eligible runtimes and classify existing targets.
2. Show exact operations, diffs and preimage and replacement hashes.
3. Obtain approval bound to exact targets and bytes.
4. Check target, backup and staging leaves and ancestors without following redirects; back up, stage, atomically replace and verify eligible targets. Keep durable backups outside runtime discovery when directory contents could be loaded as instructions.

## Subagents

The installer does not prescribe subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Verified changes and backup details, or a stop.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/synthesize-init/SKILL.md](../../skills/synthesize-init/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
