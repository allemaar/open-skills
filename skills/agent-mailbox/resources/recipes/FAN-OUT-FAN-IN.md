# Bounded Fan-Out/Fan-In

Status: **active**.

Use this for independent, parallel slices that a coordinator can consolidate safely.

## Before dispatch

- name each distinct slice and why it is independent;
- give every worker scope, sources, stop condition, timeout, no-mutation limits, and required evidence;
- set total and concurrency bounds plus monitoring and cancellation;
- keep workers blind to one another when anchoring would weaken the result.

## Fan-in

1. Record returned, timed-out, cancelled, and failed workers.
2. Separate retrieved claims from coordinator-confirmed claims.
3. Reopen primary sources and recompute every load-bearing number before relaying it.
4. Compare convergence, complements, conflicts, and uncovered gaps.
5. State the evidence boundary: blind workers may still share the same mistaken source or assumption.
6. Stop at the declared bound and release every worker or process.

The coordinator owns the synthesis. A worker report and its confidence are inputs, not proof.

Grounding: [AWS Scatter-Gather pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/scatter-gather.html) and [Microsoft AI orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns).
