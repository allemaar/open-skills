# headless-gemini

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Run a bounded Gemini or Claude task through Antigravity CLI (agy), using a locally available model and a capable supervisor.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a scoped analysis
- Run an authorized workspace task

## When not to use it

- You need the separate gemini CLI rather than Antigravity CLI (agy).
- You require enforced read-only or exact tool isolation without an independently verified boundary.
- Treating an added directory as an access allowlist.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/headless-gemini summarize the architecture of this project
```

## Flow

1. Check the installed Antigravity CLI, authentication, model access and effective configuration.
2. Set exact authorized tools and paths; stop when required isolation cannot be independently established.
3. Otherwise disclose that monitoring detects actions after dispatch, then launch a bounded supervised task.
4. Validate the output and report limitations and gaps.

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds; disclose when native usage ceilings are unavailable.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A bounded child result with supervision and permission evidence.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-gemini/SKILL.md](../../skills/headless-gemini/SKILL.md)
- [skills/headless-gemini/protocol.yon](../../skills/headless-gemini/protocol.yon)
- [skills/headless-gemini/references/supervision.md](../../skills/headless-gemini/references/supervision.md)
- [skills/headless-gemini/references/validation.md](../../skills/headless-gemini/references/validation.md)
- [skills/headless-gemini/scripts/run-windows.mjs](../../skills/headless-gemini/scripts/run-windows.mjs)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
