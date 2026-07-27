# Bounded representational self-healing

> Status: **provisional field aid, active by Handler direction**. The canonical kernel loop lives in `SKILL.md` and `protocol.yon`; this card adds no rule and may be demoted without changing protocol behavior. Its first real use must promote it to proven or demote the card into the experimental bank through a deliberate source change.

Use only for representation drift: compatible extra fields, optional provenance, body/link/tag drift, stale projections, fresh partial-file parsing, or an exactly evidenced bookkeeping omission.

Do not self-heal identity, addressing, causal parentage, authority, path safety, artifact hashes, or ambiguous effect/idempotency evidence. Those fail closed.

## Repair loop

1. Preserve the original bytes and classify the exact failed check.
2. Reopen the pinned Agent Mailbox skill, protocol, message template, active package, and canonical drift-repair rules. Verify their lease-baseline hashes; this card is optional explanation, not a pinned kernel dependency.
3. Notify the original sender once with the filename, byte hash, failed check, and smallest correction recipe.
4. Ask the sender to reread Agent Mailbox and publish one fresh corrected message. Never edit the peer's message or state.
5. Persist one depth-1 repair transaction keyed by repair-request UUID, expected sender, original filename/hash, and pinned generation. Accept only a sender-authored correction bound to that transaction.
6. Validate the correction normally, preserve the original, and close it as superseded only after the corrected message is valid.
7. Count the request and correction against the exchange budget and absolute per-lease anomaly/reread ceiling. A second malformed correction, identity ambiguity, authority disagreement, or uncertain prior effect stops the loop and goes to the Handler.

Valid traffic continues when the anomaly can be isolated safely. The repair mechanism is bounded assistance, not a permission to normalize malformed authority-bearing content.

## First-use decision

Record whether the recipe repaired one real drift without duplicate effect, authority widening, starvation, or repeated notice. A clean result promotes the card to proven. Any unpredicted material failure demotes it with that failure named as the next experiment.

The bounded shape borrows from [AHRQ's Two-Challenge Rule](https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/rule.html) and the [Circuit Breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker): finite challenge, scoped stop, explicit escalation, and a successful probe before normal operation resumes.
