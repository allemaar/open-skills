# define-terms

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A billing team uses 'account' for the entity billed, while a security team uses it for a login. The skill finds the existing owners and definitions, tests each meaning against examples and exclusions, and can preserve both definitions when their contexts differ.

Keep accepted wording, observed behavior, proposals and disagreements distinct. Saving requires the correct owner, authorization, safe paths, a recoverable preimage and supported protection against concurrent writes; otherwise return the proposed text.

## Where it fits

Use define-terms to agree language within its actual context. A broad code rename or migration is separate work, even if a terminology change exposes that need.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A shared term has conflicting meanings or unclear boundaries.
- An authorized terminology change or consequential decision needs to be recorded.

## When not to use it

- You only need to look up an existing glossary.
- The task is a broad symbol rename, schema migration or general interview capture.

## How to use it

Start with a concrete request. For example:

```text
/define-terms Clarify 'account' for billing and security using the current glossary and the supplied invoice and login examples; return proposed wording without saving.
```

## Flow

1. Find the current context, terminology and decision owners, and relevant evidence.
2. Test meanings with concrete examples and preserve deliberate context differences.
3. Separate accepted definitions, observations, proposals and unresolved conflicts.
4. Save only within exact authority using safe paths, current content and supported writer protection; otherwise return text.
5. Capture a decision only when consequential tradeoff, reversal cost and likely future confusion justify it; verify saved wording and return exact status.

## Common questions

**Must one word have the same definition everywhere?**

No. Different bounded contexts can use the same word differently; describe the relationship without forcing them into one meaning.

**When is a decision record useful?**

Consider one when the choice involves a consequential tradeoff, costly reversal and likely future confusion; routine definitions need not become decision records.

## It is working when

- Definitions identify their contexts, evidence, examples and unresolved disagreements.
- The result clearly states what was saved and reports any authority or concurrency gap.

## Subagents

No subagent step is prescribed. The skill uses available source-reading and safe-write capabilities; blocked saving still returns useful proposed text.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Context-specific definitions, examples, implementation differences, source basis, conflicts and exact saved-versus-unsaved status, with selected consequential decisions only when authorized.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/define-terms/SKILL.md](../../skills/define-terms/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
