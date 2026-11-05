# define-terms

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Refines domain language in bounded contexts while separating accepted definitions, observed implementation and proposed changes.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A shared term has conflicting meanings or unclear boundaries.
- An authorized terminology change or consequential decision needs to be recorded.

## When not to use it

- You only need to look up an existing glossary.
- The task is a broad symbol rename, schema migration or general interview capture.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/define-terms Clarify account in billing and security using the current glossary and supplied examples. Return proposed wording; save only where already authorized.
```

## Flow

1. Find the current context, terminology and decision owners, and relevant evidence.
2. Test meanings with concrete examples and preserve deliberate context differences.
3. Separate accepted definitions, observations, proposals and unresolved conflicts.
4. Save only within exact authority using safe paths, current content and supported writer protection; otherwise return text.
5. Capture a decision only when consequential tradeoff, reversal cost and likely future confusion justify it; verify saved wording and return exact status.

## Subagents

No subagent step is prescribed. The skill uses available source-reading and safe-write capabilities; blocked saving still returns useful proposed text.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Context-specific definitions, examples, implementation differences, source basis, conflicts and exact saved-versus-unsaved status, with selected consequential decisions only when authorized.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/define-terms/SKILL.md](../../skills/define-terms/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
