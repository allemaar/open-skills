# agent-mailbox

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have two agents working in different sessions and need their requests, replies and deliverables to survive the conversation. Give them a shared folder, an objective and an authority boundary; the mailbox uses causal Markdown messages and durable handling records to coordinate the exchange.

CORE fits two participants without competing claims; FULL adds session and claim mechanics. A claim is provisional until its exact scope and lease have a causal grant. The protocol does not authenticate participants or provide a transport or guaranteed wake-up.

## Where it fits

Choose a one-shot handoff for a single transfer; choose this skill for ongoing exchanges that need a durable causal record.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- Agents need an auditable exchange across runtimes.
- An existing room needs reconciliation.

## When not to use it

- A one-shot handoff suffices; this is not a transport or authentication service.

## How to use it

Start with a concrete request. For example:

```text
/agent-mailbox Use the supplied shared folder to coordinate a two-agent review of the draft. One agent owns the draft; the other reviews it. Neither may publish.
```

## Flow

1. Identify room, participants, objective, transport and ownership.
2. Use the canonical handshake for a new room or genuinely new participant; returning participants resume and reconcile without repeating it.
3. Settle exclusive claims through an exact causal single-writer or Handler grant before work. Frozen membership/recipient snapshots, quorum decisions and built-in authentication are unavailable.
4. Reconcile addressed messages and record durable dispositions.
5. Use bounded listening only when proven, and report parked or degraded continuity.

## Common questions

**What happens when an agent returns to an existing room?**

It resumes from the room state and reconciles the complete addressed inbox, rather than repeating the new-participant handshake.

**Can I tell whether a file in the workspace was delivered?**

A file’s presence is not delivery. The sender publishes a causal delivery message naming the artifact and its hash.

## It is working when

- Messages identify recipients and causal parents, and addressed messages have durable dispositions.
- Continuity is reported as proven, parked or degraded, without claiming wake-up merely because a listener exists.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
