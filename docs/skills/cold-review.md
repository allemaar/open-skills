# cold-review

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A change is ready to inspect and its authors may be too close to see its gaps. Cold-review starts from the actual artifact and objectives, selects review lenses and uses fresh reviewers when supported. The lead reopens evidence behind material findings before returning one report.

For code, identify whether the candidate is the working tree, staged content or a commit. Repository standards and the approved specification are separate review bases. If fresh reviewers are unavailable, the same-session review is labeled degraded.

## Where it fits

Use it for an outside view of concrete work. Verify is the formal self-gate; double-check reexamines one claim.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- Completed work needs outside review.
- You need evidence-backed findings before acceptance.

## When not to use it

- You need a quick check of one claim.

## How to use it

Start with a concrete request. For example:

```text
/cold-review Review the current working-tree changes against the approved import spec and repository standards; identify unexamined files.
```

## Flow

1. Classify the work and choose review breadth.
2. For code, identify the actual selected candidate and distinguish repository standards from the approved specification, naming each source or unknown.
3. Brief fresh reviewers on objectives and artifacts when available, keeping them read-only; otherwise label the same-session review degraded.
4. Reopen evidence when synthesizing and verify findings.
5. Report coverage, findings, score and threshold verdict.
6. Bundle the required lenses within the existing reviewer budget and name any coverage gap.

## Common questions

**Does a high score mean the tests passed?**

No. A review score does not replace required tests, builds or verification.

## It is working when

- The report identifies the candidate and objectives, groups evidence-backed findings by severity, states coverage gaps and gives a threshold verdict.

## Subagents

Use fresh reviewers when supported and appropriate; if unavailable, perform and label a degraded same-session review. More than three reviewers requires confirmation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An independent evidence-backed review.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/cold-review/SKILL.md](../../skills/cold-review/SKILL.md)
- [skills/cold-review/protocol.yon](../../skills/cold-review/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
