---
name: improve-codebase-architecture
description: Explore a codebase to find opportunities for architectural improvement by deepening shallow modules (John Ousterhout, "A Philosophy of Software Design"). Use when the user says "improve architecture", "find refactoring opportunities", "make this more testable", "this codebase is hard to navigate", "consolidate these modules", "find coupling problems", "write an RFC for this refactor", or "help me think about module design". Also trigger when the user asks why tests are brittle, why a module is hard to mock, or why changing one thing always breaks another.
visibility: public
self-improvable: true
next-skills:
  - skill: prime-sweep
    phrase: "/prime-sweep"
    why: "When the codebase to refactor spans ≥3 sources or >10k tokens — delegate the surveying to keep your context clean"
triggers:
  - "/improve-codebase-architecture"
  - "improve architecture"
  - "find refactoring opportunities"
  - "make this more testable"
  - "this codebase is hard to navigate"
  - "consolidate these modules"
  - "find coupling problems"
  - "write an RFC for this refactor"
  - "help me think about module design"
---

# /improve-codebase-architecture

Explore a codebase like an AI would, surface architectural friction, and propose module-deepening refactors as GitHub issue RFCs.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

**A deep module has a small interface hiding a large implementation.** Deep modules are more testable, more AI-navigable, and let you test at the boundary instead of inside. (John Ousterhout, *A Philosophy of Software Design*)

**The deepening test:** would merging these modules produce a smaller combined interface than they have separately? If no, it's not a deepening opportunity — it's just reorganization.

## Reference — Dependency Categories

Classify each candidate's dependencies; the category determines the entire testing strategy.

1. **In-process** — pure computation, in-memory state, no I/O. Always deepenable; merge and test directly.
2. **Local-substitutable** — dependencies with local test stand-ins (PGLite for Postgres, memfs for filesystem). Deepenable if the stand-in exists; test the merged module with the stand-in running in the suite.
3. **Remote but owned (Ports & Adapters)** — your own services across a network boundary. Define a port at the boundary; the deep module owns the logic, transport is injected. Tests use an in-memory adapter; production uses the real one.
4. **True external (Mock)** — third-party services you don't control (Stripe, Twilio). Mock at the boundary; the deepened module takes the external dependency as an injected port, tests provide a mock.

## Reference — Testing Strategy

**Replace, don't layer.** Write new tests at the deepened module's interface boundary. Old unit tests on the now-merged shallow modules become redundant — delete them. Tests assert on observable outcomes through the public interface, not internal state, so they survive internal refactors.

## Step 1 — Explore the codebase

Navigate organically. Note where you experience friction: where understanding one concept requires bouncing between many small files; where modules are so shallow the interface is nearly as complex as the implementation; where pure functions were extracted just for testability while the real bugs hide in how they're called; where tightly-coupled modules create integration risk at the seams; which parts are untested or hard to test. **The friction you encounter IS the signal** — don't follow rigid heuristics.

If you find no strong candidates, say so directly. A thin adapter over a stable external API is correct design, not a problem. Don't manufacture candidates — tell the user what you found and why the codebase resists the pattern.

## Step 2 — Present candidates

> ⚠️ **Deepening test:** before listing a candidate, verify merging produces a smaller interface than the modules have separately. If not, it's reorganization — skip it.

For each genuine candidate show: **Cluster** (modules/concepts involved), **Why they're coupled** (shared types, call patterns, co-owned concept), **Dependency category** (one of four, one-sentence rationale), **Test delta** (specific test files that would be deleted, and the new boundary tests that replace them). Then ask: "Which of these would you like to explore?"

## Step 3 — User picks a candidate

## Step 4 — Frame the problem space

Write a user-facing explanation of the chosen candidate: the constraints any new interface must satisfy, the dependencies it must handle (with category), and a rough illustrative code sketch to make the constraints concrete (a grounding device, not a proposal). Show this, then immediately proceed to Step 5 — the user reads while designs are worked.

## Step 5 — Design multiple interfaces

Produce 3–4 radically different interface designs, each under a different constraint:

- **A — Minimal:** 1–3 entry points max. Ruthlessly hide everything.
- **B — Flexible:** support many use cases and extension points; maximize what callers can customize.
- **C — Caller-optimized:** make the most common call site trivial; ergonomics over generality.
- **D — Ports & Adapters** (if applicable): design around injected adapters for cross-boundary dependencies.

Each design produces: (1) interface signature, (2) usage example, (3) what complexity it hides, (4) dependency strategy per category, (5) trade-offs.

> ⚠️ **Don't mistake extraction for deepening.** If a design has the same total interface surface as the original modules combined, it's a rename. The interface must get smaller.

**If sub-agents are available** (Claude Code / Cowork): spawn 3–4 in parallel with the brief template below. Do not share prior designs between agents — isolation is the point. **If not** (Claude.ai): work each constraint sequentially, treating each design as complete and committed before the next — contamination defeats the purpose.

```
## Design Brief

### Context
Codebase: [repo/language]
Candidate: [module cluster name]

### Files involved
[file path] — [one-line summary]

### Coupling description
[Why these modules are tightly coupled — shared types, call patterns, co-owned concepts]

### Dependency category
[In-process / Local-substitutable / Remote but owned / True external] — Rationale: [one sentence]

### What the deepened module should hide
[Internal state, wiring, error handling, retry logic, etc.]

### What it must expose
[The minimum surface callers actually need]

### Your design constraint
[One of: Minimal / Flexible / Caller-optimized / Ports & Adapters]

### Output format required
1. Interface signature  2. Usage example  3. What complexity it hides  4. Dependency strategy  5. Trade-offs
```

After all designs are presented, compare them in prose and give an opinionated recommendation — which is strongest and why, or a hybrid. The user wants a strong read, not a menu.

## Step 6 — User picks an interface (or accepts the recommendation)

## Step 7 — Create GitHub issue

Draft the RFC using the template below. Render the complete draft as a markdown block in the conversation, then ask: **"Should I create this issue now?"** Wait for explicit confirmation before running `gh issue create`. If `gh` is unavailable, print the final draft for manual paste.

```markdown
## Problem
- Which modules are shallow and tightly coupled
- What integration risk exists at the seams
- Why this makes the codebase harder to navigate and maintain

## Proposed Interface
- Interface signature (types, methods, params)
- Usage example showing how callers use it
- What complexity it hides internally

## Dependency Strategy
[Category name] — [one sentence on how deps are handled]
- Production: [real adapter / merged module / mock boundary]
- Tests: [stand-in / in-memory adapter / mock implementation]

## Testing Strategy
- New boundary tests to write: [behaviors to verify at the interface — inputs and expected outcomes]
- Old tests to delete: [specific test file names and why they become redundant]
- Test environment needs: [stand-ins, adapters, or fixtures required]

## Implementation Recommendations
[Durable architectural principles, not file-path instructions.]
- What the module should own (responsibilities)
- What it should hide (implementation details)
- What it should expose (the interface contract)
- How callers should migrate to the new interface
```

> ⚠️ **"Old tests to delete"** must name specific test files. If you cannot, return to Step 2 and find them — a vague entry leaves dead test weight behind.

> ⚠️ **"Implementation Recommendations"** must be file-path-agnostic. Write principles a future engineer can apply even after the codebase is reorganized.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
