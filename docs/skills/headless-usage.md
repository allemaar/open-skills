# headless-usage

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are deciding which available harness to use and want to see the actual remaining windows. The skill queries each requested account through its supported existing surface and reports the source, observation time and freshness for each bucket independently.

Keep each account pool and time window separate. Distinguish fresh backend evidence from cached or freshness-unverified observations, preserve rounding bounds and unknown values, and retain completed results if another provider fails.

## Where it fits

Use headless-usage for remaining account windows and reset information. Session token accounting, model selection and API billing answer different questions.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- Check remaining quotas
- Compare returned usage windows

## When not to use it

- Estimating request counts or enabling paid overage

## How to use it

Start with a concrete request. For example:

```text
/headless-usage Show the current Codex and Claude quota windows and reset times; label unavailable or cached readings.
```

## Flow

1. Discover available authenticated usage surfaces without inference or credential-store access.
2. Prefer the Codex desktop usage tool when available; otherwise use the Windows direct reader for Codex. Use that reader for Antigravity on Windows, or verified native surfaces on other platforms; report unavailable routes.
3. For Claude or Grok, inspect an existing usage surface or use a bounded supervised terminal session; Grok startup hooks and MCP integrations may run.
4. Distinguish live, cached, unverified and unavailable readings; report timestamps, reset windows and gaps.
5. On timeout or interruption, stop only owned readers within the cleanup bound; retain completed readings and report partial or unverified cleanup honestly.

## Common questions

**Can a displayed percentage be converted into remaining requests?**

No. The percentage does not establish a request or token count; preserve the reported window and its precision.

**Does opening an interactive usage screen prove a fresh backend result?**

No. It can initially display cached data; use a live label only when a fresh response is established, otherwise state the freshness limit.

## It is working when

- Each requested provider has a dated source and a result or a concrete access gap, without conflating separate quota pools.
- Timeout, partial output and unverified process cleanup are reported rather than presented as a complete live read.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A dated quota table with source and freshness labels.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-usage/SKILL.md](../../skills/headless-usage/SKILL.md)
- [skills/headless-usage/protocol.yon](../../skills/headless-usage/protocol.yon)
- [skills/headless-usage/references/reader.md](../../skills/headless-usage/references/reader.md)
- [skills/headless-usage/scripts/usage.mjs](../../skills/headless-usage/scripts/usage.mjs)
- [skills/headless-usage/scripts/direct.mjs](../../skills/headless-usage/scripts/direct.mjs)
- [skills/headless-usage/references/providers.md](../../skills/headless-usage/references/providers.md)
- [skills/headless-usage/references/access.md](../../skills/headless-usage/references/access.md)
- [skills/headless-usage/references/grok-interactive.md](../../skills/headless-usage/references/grok-interactive.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
