# headless-codex

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Run a bounded Codex CLI task with scoped authority.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a focused code task
- Run a bounded analysis

## When not to use it

- Assuming process success proves artifact correctness

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/headless-codex review the test failures in this package
```

## Flow

1. Inspect CLI access, configuration, model and permissions
2. Set explicit scope, deadline and supervision
3. Capture events and monitor the child through completion
4. Verify the requested result independently

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Run evidence, result and access or execution gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-codex/SKILL.md](../../skills/headless-codex/SKILL.md)
- [skills/headless-codex/protocol.yon](../../skills/headless-codex/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
