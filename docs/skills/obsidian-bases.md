# obsidian-bases

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have notes with frontmatter properties and want a table of active projects, perhaps with a computed due-date field. A Base selects notes using filters and presents properties through views; formulas and summaries are optional additions to that selection.

Validate the YAML and references before saving, preserve unrelated views and unknown settings during edits, and protect a recoverable preimage. Recheck the current revision immediately before replacement. A concurrent change stops the write and leaves the candidate unsaved; inspect a successfully saved view in Obsidian when available.

## Where it fits

Use obsidian-bases to query note properties, obsidian-markdown to author those notes, and json-canvas for a spatial diagram.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Build a notes table
- Add a formula or filter to a base

## When not to use it

- Editing a Markdown note or Canvas

## How to use it

Start with a concrete request. For example:

```text
/obsidian-bases Create a table of notes in Projects with status and due date, filtering out completed notes; preserve existing views if the base already exists.
```

## Flow

1. Choose the notes and properties to include
2. Define filters, optional formulas and views in YAML
3. Validate syntax and property references
4. Validate the candidate before saving; preserve unrelated content and recovery, then recheck current identity. A changed revision stops replacement and leaves the candidate unsaved. Read back a successful protected write; new files use exclusive creation.
5. Open the base in Obsidian when available

## Common questions

**Why can a formula column be empty or fail despite valid YAML?**

The formula may be undefined, a note property may be missing, or the expression may use the wrong type. Check references and guard missing values.

## It is working when

- The candidate parses as YAML and referenced properties and formulas are accounted for.
- The requested view is preserved in the read-back file, with rendering checked when Obsidian is available.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A .base file with configured views.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/obsidian-bases/SKILL.md](../../skills/obsidian-bases/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
