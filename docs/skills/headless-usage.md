# headless-usage

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Read available account usage and reset information across supported harnesses.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- Check remaining quotas
- Compare returned usage windows

## When not to use it

- Estimating request counts or enabling paid overage

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/headless-usage show my current quotas
```

## Flow

1. Discover available authenticated usage surfaces without inference or credential-store access.
2. Prefer the Codex desktop usage tool when available; otherwise use the Windows direct reader for Codex. Use that reader for Antigravity on Windows, or verified native surfaces on other platforms; report unavailable routes.
3. For Claude or Grok, inspect an existing usage surface or use a bounded supervised terminal session; Grok startup hooks and MCP integrations may run.
4. Distinguish live, cached, unverified and unavailable readings; report timestamps, reset windows and gaps.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A dated quota table with source and freshness labels.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-usage/SKILL.md](../../skills/headless-usage/SKILL.md)
- [skills/headless-usage/protocol.yon](../../skills/headless-usage/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
