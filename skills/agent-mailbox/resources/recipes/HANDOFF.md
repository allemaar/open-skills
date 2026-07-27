# Acknowledged handoff and role switch

Status: **active**.

Use this when a pen, Driver role, or outstanding obligation moves to another participant.

1. Outgoing holder sends a causal `deliver`, `propose`, or `state` naming the exact scope.
2. Include current status, completed work, next actions, uncertainty, contingencies, predecessor artifact path and hash when one exists, and the proposed effective point.
3. Incoming holder independently verifies the named artifact and reconciles its complete addressed inbox.
4. Incoming holder replies with a synthesis of what it received, what it accepts, and what remains unclear.
5. Transfer becomes active only after that acknowledgement. Until then, the outgoing holder remains responsible.
6. Update the optional Working Agreement projection; live causal messages remain authoritative.

When a predecessor artifact exists, the successor writes a new immutable continuation in its own workspace and maps old path/hash to new path/hash. When none exists, acknowledge that fact explicitly. Never inherit or edit a predecessor's workspace.

Grounding: [AHRQ handoff guidance](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/handoff.html) and [I-PASS receiver synthesis](https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html).
