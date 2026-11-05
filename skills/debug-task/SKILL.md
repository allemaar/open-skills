---
name: debug-task
description: Reproduce and diagnose a specific software defect, then apply and verify a repair only when authorized. Use for executable debugging rather than an analysis-only explanation or general repository survey.
visibility: public
updated: 2026-10-31
triggers:
  - "/debug-task"
  - "debug this failure"
  - "reproduce and fix this bug"
  - "diagnose this regression"
next-skills: []
---

# Debug a task

Produce evidence about one reported symptom and, when requested, its repair. Diagnosis permits only its actual probe scope; an authorized fix needs no second generic approval. Resolve ambiguity that changes effects, intended behavior or acceptance.

## Bind the investigation

Establish the symptom, expected behavior and basis, environment, evidence, work area and effort bound. Inspect callers and instructions before asking for discoverable facts. Separate allegations from observed failures.

Inspect the actual working candidate, including selected staged and uncommitted edits. Record relevant pre-existing changes and preserve concurrent user work. Before any file write, inspect the leaf and every existing ancestor without following links; refuse redirected or ambiguous targets. Reread current content before applying scoped changes, retaining recoverable preimages.

Inspect commands and effects before running them. Use available runtimes and safe fixtures; stop dependent execution if a prerequisite is absent. A debugging request does not implicitly authorize package installation, live-service changes, production instrumentation, external requests, deployment or destructive cleanup. Keep probes and child processes bounded, observable and cancellable.

## Establish a discriminator

Find evidence from an already-run path that distinguishes the exact symptom from expected behavior. Reuse a prior observation only when its candidate, input and environment still match the relevant current state; otherwise rerun a suitable discriminator within scope. If none exists, run the smallest suitable existing test, local fixture command, isolated harness or observed manual path within scope. Record inputs, environment, expected result and actual result. Explain how a substitute scenario relates to the original symptom.

For intermittent behavior, state actual attempts, failures and conditions. No observed failure means reproduction is unresolved; it does not establish a cause or a successful repair. Do not invent reproduction percentages or demand every defect reproduce quickly. For performance, measure a baseline and compare it with the candidate under comparable input, load and environment; distinguish noise from an established change.

Redact secrets and unnecessary personal data from traces, fixtures and reports. Preserve only evidence appropriate to the destination.

## Diagnose through predictions

Reduce the scenario only while the discriminator still fails. Preserve the original scenario for the final check. Trace relevant producers, consumers and shared state rather than stopping at the first failing caller.

Keep plausible explanations separate from observations. For each useful hypothesis, state what result would support it, what would contradict it and the next discriminating probe. Change one relevant variable at a time when practical; otherwise explain the confounding changes. Instrument only within authorized effects, using the minimum necessary data and a clear disposition for run-owned instrumentation.

Revise hypotheses when observations disagree. Hiding the symptom, a narrow passing test or agreeing explanations is not causal proof.

## Repair and verify

Diagnosis-only work returns supported findings and proposed next steps without applying a repair. When a fix is authorized, change the supported mechanism within scope. Do not combine unrelated refactors or broaden public behavior to make a test pass. Preserve useful existing coverage.

Verify a regression at an appropriate observable seam using expectations derived independently of the new implementation. Check other affected callers, rerun the original unminimized scenario and run sanctioned project checks. If a missing seam or unavailable environment prevents a check, name precisely what remains untested. A local simulation is not production evidence.

Remove temporary instrumentation only when that disposition is authorized and its current bytes still belong to this run. Preserve changed, uncertain or user-owned artifacts; destructive cleanup follows its own applicable rules.

## Stop and return

Stop at the effort bound, unavailable capability, conflicting requirements, or an effect outside scope. Preserve partial work and recovery evidence rather than improvising broader access.

Return the symptom and reproduction status; observations and strongest supported explanation; alternatives still open; actual probes and checks with results; repair status; unrun original/project checks; and exact file/effect inventory, including temporary artifacts left behind. Distinguish confirmed observations, inference and unknowns. Do not claim repaired-and-verified when the decisive scenario remains untested.

This workflow never automatically commits, deploys or publishes. Keep analysis-only investigation and read-only discovery separate.
