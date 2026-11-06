# json-canvas

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want to arrange project topics spatially and show how they connect. A Canvas file stores positioned nodes and edges; the skill prepares the diagram, checks unique identifiers and edge references, and then saves the validated candidate through the protected write boundary.

For edits, preserve unknown and unrelated content, validate the complete candidate and protect a recoverable preimage. Recheck the target revision before replacement and read back the result; a new file is created exclusively.

## Where it fits

Use json-canvas for a spatial diagram, obsidian-bases for views over note properties, and obsidian-markdown for the notes themselves.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Build a mind map
- Connect notes in a canvas

## When not to use it

- Editing Markdown notes or Bases

## How to use it

Start with a concrete request. For example:

```text
/json-canvas Create a mind map in a new .canvas file for the supplied project topics, with dependencies connected by labelled edges.
```

## Flow

1. Identify the diagram's content and relationships
2. Create valid nodes and edges with suitable positions
3. Check IDs, references and JSON structure
4. Validate the candidate before saving; preserve unrelated content and recovery, recheck current identity and read back the protected write. New files use exclusive creation.
5. Open the canvas when available to inspect the layout

## Common questions

**Is valid JSON enough to establish a usable canvas?**

No. IDs must be unique, edges must reference existing nodes, and required fields and supported values must also be checked; a visual inspection can assess layout.

## It is working when

- The saved canvas parses and its nodes and edges satisfy the structural checks.
- Unrelated existing content is preserved and the persisted result is read back.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A valid .canvas diagram.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/json-canvas/SKILL.md](../../skills/json-canvas/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
