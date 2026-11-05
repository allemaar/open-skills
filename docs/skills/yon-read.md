# yon-read

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Interpret existing YON records in plain language.

**Family:** YON. **Subagents:** No subagent step prescribed.

## When to use it

- Explain a .yon document
- Understand rules or workflow records

## When not to use it

- Creating new YON or a generic format question without content

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/yon-read explain this YON workflow
```

## Flow

1. Read the document identity and intent
2. Walk sections, records and references in order
3. Explain rule severity and workflow dependencies
4. Flag runtime-dependent agent execution
5. Read complete logical records and block context, preserving source terminology, field meanings and units.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A faithful interpretation of the supplied records.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/yon-read/SKILL.md](../../skills/yon-read/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
