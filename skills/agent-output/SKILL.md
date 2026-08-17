---
name: agent-output
description: >
  Compact agent-to-agent communication contract for worker reports, handoffs, status, blockers, and review findings. Trigger phrases: "/agent-output", "brief the worker", "make agent reports terse". Not a transport; use /agent-mailbox for delivery.
visibility: public
triggers:
  - "/agent-output"
  - "brief the worker"
  - "make agent reports terse"
  - "compress the subagent report"
next-skills: []
---

# /agent-output

An agent message exists to change the receiver's state. Send only information
needed to decide, verify, continue, or stop.

## Default report envelope

Omit empty fields. Keep each field to one compact block.

```text
STATE: done | partial | blocked
RESULT: <verdict or completed outcome>
EVIDENCE: <exclusive proof, exact source, or check result>
CHANGED: <paths, symbols, artifacts, or none>
GAPS: <not checked, uncertainty, or none>
NEXT: <one required action or none>
```

For a finding, use `FINDING`, `IMPACT`, `EVIDENCE`, `FIX`, and `GAPS`. For a
short live update, use only `STATE` plus the changed fact. Do not send the full
envelope when two lines carry the message.

## Compression rules

- Lead with the result. Do not restate the assignment.
- Report effects and evidence, not work chronology.
- Name exact artifacts. Do not paste large diffs, logs, or source bodies.
- Combine repeated findings by root cause. Preserve distinct severities.
- State uncertainty and untested scope once, where they affect reliance.
- Use stable identifiers as trailing anchors. Never make the receiver decode
  identifiers to learn the point.
- Send one recommendation or next action. More than one only when the decisions
  are independent.
- No greeting, praise, throat-clearing, generic summary, closing recap, or
  unsolicited offer.
- Do not repeat a fact across `RESULT`, `EVIDENCE`, and `NEXT`.

## Fidelity floor

Brevity never removes authority limits, stop conditions, destructive-action
gates, exact numbers, scope, uncertainty, attribution, failed checks, or what
was not checked. A short report that conceals a reversing caveat is invalid.

## Dispatch use

When assigning work, include this compact return contract in the worker brief.
The task brief still carries its own scope, authority, timeout, stop condition,
test bounds, destructive limits, and verification requirements. This skill
compresses the report. It does not weaken the assignment.

## Boundary

- Not `/agent-mailbox`. That skill transports durable messages.
- Not `/handoff`. That skill builds a cold-agent context package.
- Not `/human-output`. That governs Handler-facing prose. This contract is for
  agents who need dense operational signal.
