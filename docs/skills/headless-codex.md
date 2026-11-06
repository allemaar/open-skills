# headless-codex

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A focused task can run in a separate non-interactive Codex CLI process while a parent supervises it. Before launch the parent discovers current CLI and account capabilities, binds a working directory and permissions, and records a deadline, output capture and cancellation path.

A successful process exit can still leave an incomplete or incorrect result. The supervisor examines the terminal result and independently checks the artifact or change; unsupported explicit model choices and permission failures stop the run.

## Where it fits

Use this for one bounded Codex CLI task under a capable supervisor. Headless-models compares setups; headless-usage reports available quota information.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a focused code task
- Run a bounded analysis

## When not to use it

- Assuming process success proves artifact correctness

## How to use it

Start with a concrete request. For example:

```text
/headless-codex Review the failing tests in this package read-only; use the selected model, a ten-minute deadline and a retained result file.
```

## Flow

1. Inspect CLI access, configuration, model and permissions
2. Set explicit scope, deadline and supervision
3. Capture events and monitor the child through completion
4. Verify the requested result independently

## Common questions

**Does finding the CLI prove the requested model is available?**

No. Authentication, model access, effective configuration and supervision are separate observations.

## It is working when

- The report records runtime and boundaries, terminal outcome, retained output and independent checks, with failures and gaps visible.

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Run evidence, result and access or execution gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-codex/SKILL.md](../../skills/headless-codex/SKILL.md)
- [skills/headless-codex/protocol.yon](../../skills/headless-codex/protocol.yon)
- [skills/headless-codex/references/access.md](../../skills/headless-codex/references/access.md)
- [skills/headless-codex/references/run-contract.md](../../skills/headless-codex/references/run-contract.md)
- [skills/headless-codex/references/model-selection.md](../../skills/headless-codex/references/model-selection.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
