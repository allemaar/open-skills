# synthesize-init

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want synthesize to be a standing route in an existing directive file. Synthesize-init discovers eligible targets, checks that each runtime can resolve the skill and classifies the current managed block or related rule.

For a permitted change it shows the exact operation, diff and current and replacement hashes. Approval binds those bytes; a verified backup, staged replacement and readback support recovery and an honest result.

## Where it fits

Use it for an explicit standing-route change. Use synthesize directly for the current response without changing directives.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You explicitly want a standing route changed.
- You want to remove a managed route.

## When not to use it

- You only want to use synthesize or create a directive file.

## How to use it

Start with a concrete request. For example:

```text
/synthesize-init Show the proposed route for my selected existing project directive file, including the exact diff and hashes.
```

## Flow

1. Resolve eligible runtimes and classify existing targets.
2. Show exact operations, diffs and preimage and replacement hashes.
3. Obtain approval bound to exact targets and bytes.
4. Check target, backup and staging leaves and ancestors without following redirects; back up, stage, atomically replace and verify eligible targets. Keep durable backups outside runtime discovery when directory contents could be loaded as instructions.

## Common questions

**Will it create a directive file if none is eligible?**

No. It stops; conflicting or malformed marker states are not silently rewritten.

## It is working when

- Each target is reported as changed, unchanged or failed, with the approved operation and backup details for any mutation.

## Subagents

The installer does not prescribe subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Verified changes and backup details, or a stop.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/synthesize-init/SKILL.md](../../skills/synthesize-init/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
