# headless-grok

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Run a bounded Grok Build CLI task using selected permissions.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a focused CLI task
- Run a restricted analysis

## When not to use it

- Assuming subscription access grants API entitlement

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/headless-grok inspect this module for error handling
```

## Flow

1. Check installed CLI, authentication and model access.
2. Choose a minimal approved tool and path scope; Windows containment is unestablished, so stop if enforced read-only or exact isolation is required without independent proof.
3. Otherwise disclose that monitoring detects actions after dispatch, then launch and supervise the retained process.
4. Inspect tool use and validate the result.
5. Check route-variable presence and scope without revealing or clearing values; unexpected routing stops the dependent run.

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Captured output and a report of identity, limits and gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-grok/SKILL.md](../../skills/headless-grok/SKILL.md)
- [skills/headless-grok/protocol.yon](../../skills/headless-grok/protocol.yon)
- [skills/headless-grok/references/validation.md](../../skills/headless-grok/references/validation.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
