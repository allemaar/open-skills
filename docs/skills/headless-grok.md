# headless-grok

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want Grok Build to handle a focused task through its CLI, with the selected identity and permissions preserved. The skill checks the current host and CLI, records the exact task and cost route, and starts an owned process that can be monitored and stopped.

A literal-text profile can reduce exposed tools when verified on the current version, but observed tool absence is not proof of operating-system containment. Capture both streams, inspect actions and terminal output, and independently verify the result and stopped state.

## Where it fits

Use headless-grok for a supervised Grok Build CLI task. Setup and login are separate workflows; headless-usage addresses current quota where an observable surface exists.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a focused CLI task
- Run a restricted analysis

## When not to use it

- You need CLI installation, login or API-key setup; setup is separate from execution through an existing authorized login or API-key route.

## How to use it

Start with a concrete request. For example:

```text
/headless-grok Inspect the error-handling paths in this module using my selected Grok login and model, with a finite deadline and no unapproved writes.
```

## Flow

1. Check route-variable presence and scope without revealing or clearing values; unexpected routing stops the dependent run.
2. Check installed CLI, authentication and model access.
3. Choose a minimal approved tool and path scope; Windows containment is unestablished, so stop if enforced read-only or exact isolation is required without independent proof.
4. Otherwise disclose that monitoring detects actions after dispatch, then launch and supervise the retained process.
5. Inspect tool use and validate the result.

## Common questions

**Does a consumer subscription establish API credits?**

No. Consumer access and API billing are separate routes; an API-key run needs its own authorization and budget.

**Can a zero exit code establish task correctness or cleanup?**

No. Check the complete terminal result, observed actions, requested artifact and process-tree stopped state independently.

## It is working when

- The run uses the approved identity, model, scope and a retained supervisor with a finite deadline and scoped cancellation.
- The report distinguishes process completion from verified output and names unsupported containment, errors or cleanup gaps.

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
- [skills/headless-grok/references/access.md](../../skills/headless-grok/references/access.md)
- [skills/headless-grok/references/run-contract.md](../../skills/headless-grok/references/run-contract.md)
- [skills/headless-grok/references/freshness.md](../../skills/headless-grok/references/freshness.md)
- [skills/headless-grok/references/model-state.json](../../skills/headless-grok/references/model-state.json)
- [skills/headless-grok/references/lean-run.md](../../skills/headless-grok/references/lean-run.md)
- [skills/headless-grok/profiles/lean-text.md](../../skills/headless-grok/profiles/lean-text.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
