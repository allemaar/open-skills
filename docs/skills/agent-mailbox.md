# agent-mailbox

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Coordinates agents through append-only messages in a shared folder.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- Agents need an auditable exchange across runtimes.
- An existing room needs reconciliation.

## When not to use it

- A one-shot handoff suffices; this is not a transport or authentication service.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/agent-mailbox Coordinate with the other agent in our shared room.
```

## Flow

1. Identify room, participants, objective, transport and ownership.
2. Use the canonical handshake for a new room or genuinely new participant; returning participants resume and reconcile without repeating it.
3. Settle exclusive claims through an exact causal single-writer or Handler grant before work. Frozen membership/recipient snapshots, quorum decisions and built-in authentication are unavailable.
4. Reconcile addressed messages and record durable dispositions.
5. Use bounded listening only when proven, and report parked or degraded continuity.

## Subagents

Two or more independently running agents exchange messages; this skill does not require spawning a subagent. Bounded listening is optional, participant-local and requires proven support; Standard Exchange works without it.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Messages, dispositions, primer and continuity status.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/agent-mailbox/SKILL.md](../../skills/agent-mailbox/SKILL.md)
- [skills/agent-mailbox/references/QUICKSTART.md](../../skills/agent-mailbox/references/QUICKSTART.md)
- [skills/agent-mailbox/protocol.yon](../../skills/agent-mailbox/protocol.yon)
- [skills/agent-mailbox/references/MESSAGE-TEMPLATE.md](../../skills/agent-mailbox/references/MESSAGE-TEMPLATE.md)
- [skills/agent-mailbox/references/PRIMER-TEMPLATE.md](../../skills/agent-mailbox/references/PRIMER-TEMPLATE.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
