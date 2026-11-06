# headless-claude

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want a separate Claude Code process to inspect a bounded part of a repository while the parent keeps control of the run. The skill first checks the actual CLI, authentication, model and supported permissions, then specifies the directory, allowed tools, deadline, output capture and cancellation path.

A retained supervisor captures both output streams and startup evidence, monitors the child and can stop its process tree. Restrict tools and permissions to the approved scope, preserve partial output on failure, and independently check the requested result: a zero exit code establishes only process completion.

## Where it fits

Use headless-claude to supervise a specific Claude Code CLI task. Headless-usage checks available quota separately; verify can independently assess the resulting artifact.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a scoped inspection
- Run an authorized file task

## When not to use it

- Unsupervised processes or silent billing changes

## How to use it

Start with a concrete request. For example:

```text
/headless-claude Use the selected Claude model to inspect src/parser for edge cases, read-only, with a two-minute deadline and a retained report.
```

## Flow

1. Check CLI access, help, model, permissions and model-evidence freshness. Resolve due evidence through the parent’s refresh-or-continue-dated choice; reuse that choice only for the same snapshot and reasons. A changed snapshot or new invalidator may require another offer. A child with due evidence and no supplied parent decision stops for that choice and never refreshes automatically.
2. Define exact scope, deadline, tools and cancellation
3. Launch under a retained supervisor and monitor output
4. Validate the result and report limitations

## Common questions

**Does listing a tool automatically authorize it in a noninteractive run?**

No. Tool exposure and permission are separate; use the locally supported scoped authorization and stop on a denial rather than bypassing it.

**What if authentication or the chosen model is unavailable?**

Report the exact blocker and stop. Do not silently change model, credentials, provider or billing route.

## It is working when

- The launch records the approved model, scope, supervision, deadline and cancellation controls before execution.
- The result reports observed scope, terminal state, independent checks and any incomplete capture or cleanup gap.

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Captured process evidence and the requested verified result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-claude/SKILL.md](../../skills/headless-claude/SKILL.md)
- [skills/headless-claude/protocol.yon](../../skills/headless-claude/protocol.yon)
- [skills/headless-claude/references/access.md](../../skills/headless-claude/references/access.md)
- [skills/headless-claude/references/run-contract.md](../../skills/headless-claude/references/run-contract.md)
- [skills/headless-claude/references/permissions.md](../../skills/headless-claude/references/permissions.md)
- [skills/headless-claude/references/process-supervision.md](../../skills/headless-claude/references/process-supervision.md)
- [skills/headless-claude/references/fixed-dispatch.md](../../skills/headless-claude/references/fixed-dispatch.md)
- [skills/headless-claude/references/freshness.md](../../skills/headless-claude/references/freshness.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
