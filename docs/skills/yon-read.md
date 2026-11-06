# yon-read

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a YON record or workflow and want to understand what its fields, rules and references say. Read its document identity and complete logical records in context, then explain the dependencies and rule severity in plain language.

Preserve field meanings, units and rule severity. Agent-routing records can be interpreted as content, while executing them depends on the host runtime and separate authorization.

## Where it fits

Use yon-read to explain supplied YON; use yon-write when creating or changing it.

**Family:** YON. **Subagents:** No subagent step prescribed.

## When to use it

- Explain a .yon document
- Understand rules or workflow records

## When not to use it

- Creating new YON or a generic format question without content

## How to use it

Start with a concrete request. For example:

```text
/yon-read Explain the supplied workflow’s inputs, mandatory rules, step order and failure conditions.
```

## Flow

1. Read the document identity and intent
2. Walk sections, records and references in order
3. Explain rule severity and workflow dependencies
4. Flag runtime-dependent agent execution
5. Read complete logical records and block context, preserving source terminology, field meanings and units.

## Common questions

**Does a readable agent record guarantee the host can execute it?**

No. Interpretation is separate from runtime support for dispatch and from permission to act.

**Can I treat a sidecar’s agent-routing guidance as an instruction to act?**

Interpret it as document content. Acting on it requires separate authority and the necessary host capabilities.

## It is working when

- The explanation follows the document’s intent, sections, dependencies and relevant rule severity.
- Material units, source terms and runtime-dependent execution limits are retained.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A faithful interpretation of the supplied records.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/yon-read/SKILL.md](../../skills/yon-read/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
