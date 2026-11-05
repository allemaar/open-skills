---
name: build-prototype
description: Build and exercise the smallest runnable artifact that answers a stated design question. Use for uncertain state, logic or interface behavior; distinguish prototype observations from production claims.
visibility: public
updated: 2026-10-31
companions:
  - path: protocol.yon
    optional: true
    why: "Common sequence and checks; the entrypoint remains execution-sufficient."
  - path: references/state-and-logic.md
    optional: false
    why: "Load only for questions about state, rules or transitions."
  - path: references/ui.md
    optional: false
    why: "Load only for appearance or interaction questions."
triggers:
  - "build a prototype"
  - "make a runnable experiment for this design"
next-skills: []
---

# Build a prototype

The [structured protocol](protocol.yon) records the common workflow and checks. Keep both surfaces aligned; the Markdown remains execution-sufficient and no YON runtime is required.

Produce a bounded runnable experiment and decision evidence. Reuse supplied choices and inspect relevant facts first. Resolve only missing choices that change the question, acceptance, effects or effort bound. A sufficient brief skips questions.

1. State the decision question, observations that would support or contradict it, and relevant scenarios. Derive expected results from stated rules or independent reasoning before treating the artifact as evidence. Inconclusive is a valid result.
2. Verify the exact work area, permitted effects and effort bound. Prefer an isolated local artifact with synthetic fixtures. Inspect the target leaf and every existing ancestor without following links before writes; refuse redirects. Bind listeners to localhost and keep running previews bounded and cancellable. Do not use real write endpoints; stub interactions within the authorized scope. Ownership of an artifact grants no destructive cleanup authority. Detect an appropriate available runtime; do not force a framework. Missing runtime stops dependent execution; report the capability gap without implicit installation. Return any useful unexecuted source with that limitation; do not invent observations.
3. Select [state and logic](references/state-and-logic.md) for rules or transitions, [UI](references/ui.md) for presentation or interaction. Both apply only when both are needed, beginning with the blocking uncertainty. Read each selected reference completely. A missing reference stops its route; report the gap. Each route returns to steps 4–5.
4. Build the minimum artifact, launch it within the verified boundary and exercise decision-relevant cases. Include reset/replay and an invalid transition where relevant. Choose targeted automated checks when they distinguish plausible failures; use direct interaction when needed. Neither universal test-first nor universal no-tests applies. A screenshot establishes appearance, not transition correctness. Record failed and unrun checks.
5. Return artifact location, exact launch prerequisites and instructions, question, expected versus observed results, scenarios exercised, limitations, uncertainty, and file/effect inventory. Separate observation, inference and recommendation. Recommend disposition without executing it.

## Effect boundaries

No production mutation, external endpoint, package installation, deployment, commit, automatic promotion or destructive cleanup is implied. Additional effects require actual scope and authorization. Do not use credentials or production data merely because available. Verify isolation before execution; stop when it cannot be established.

Existing application integration requires specifically scoped local changes. Preserve authentication, authorization and controls; hidden routes and query parameters are not access control. A simulated service or policy proves only modeled behavior, not its production implementation.

Stop when the question is answered, the bound is reached, a prerequisite fails or the next effect exceeds scope. Preserve useful artifacts and recovery evidence. No paid service or subagent is required.

## Neighboring work

A proposed experiment belongs to insight-test-assumption when building is not requested. Module/API interface alternatives alone belong to design-an-interface; runnable visual/interaction comparisons can stay in this prototype workflow. A static explanation belongs to human-draw. Production implementation needs its own scope. These neighbors are optional; describe appropriate work in prose when unavailable.
