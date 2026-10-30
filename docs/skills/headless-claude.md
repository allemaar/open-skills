# headless-claude

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Run a bounded Claude Code CLI task under a supervisor.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a scoped inspection
- Run an authorized file task

## When not to use it

- Unsupervised processes or silent billing changes

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/headless-claude inspect the parser for edge cases
```

## Flow

1. Check CLI access, help, model and required permissions
2. Define exact scope, deadline, tools and cancellation
3. Launch under a retained supervisor and monitor output
4. Validate the result and report limitations

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Captured process evidence and the requested verified result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-claude/SKILL.md](../../skills/headless-claude/SKILL.md)
- [skills/headless-claude/protocol.yon](../../skills/headless-claude/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
