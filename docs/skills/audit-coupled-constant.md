# audit-coupled-constant

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A retry budget has been raised, but the same duration may also appear as milliseconds, a multiplication, a test fixture or a comment in another package. This audit lists those forms before searching and classifies each hit so the team can tell a deliberate difference from a missed change.

Classify hits as already aligned, missed or intentionally different. Cross-reference comments are useful leads, not enforcement: an authorized repair also updates the trail in both directions. An audit alone reports proposed fixes and does not authorize edits.

## Where it fits

Use this for a known coupled invariant. Improve-codebase-architecture addresses broader structural opportunities, including extracting a shared constant; cold-review can independently examine the resulting change.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- A timeout or threshold changes
- Comments require values to stay synchronized

## When not to use it

- A single imported constant is compiler-enforced

## How to use it

Start with a concrete request. For example:

```text
/audit-coupled-constant Audit the retry budget changed from 60 seconds to 180 seconds across this repository, including comments, tests and scripts; report repairs without editing.
```

## Flow

1. List all representations and units
2. Search each representation across the justified scope; record actual commands, scope, exits and hits, including failures. A completed no-hit search is evidence; unavailable or unrun searches remain coverage gaps and prevent a complete-audit claim.
3. Classify hits; audit-only reports proposed repairs, while already-authorized repair updates missed sites and bidirectional references
4. Report evidence and intentional differences

## Common questions

**Why search beyond the SEE ALSO comments?**

A real site may never have been added to that trail, so following the references alone can miss drift.

**What if a search was not run or a hit cannot be classified?**

Report the unrun search as a coverage gap. Do not declare the audit complete, and halt an edit when a hit cannot be classified confidently.

## It is working when

- Each listed representation has an actual search command, scope, result and classification, or an explicit coverage gap.
- Missed sites and intentional differences are identifiable, and any authorized cross-reference repair is bidirectional.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A classified audit report and any authorized repairs.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/audit-coupled-constant/SKILL.md](../../skills/audit-coupled-constant/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
