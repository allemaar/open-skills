# obsidian-markdown

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are writing a note in an Obsidian vault and want links, properties, embeds or callouts to work with its conventions. This skill applies the relevant Obsidian Markdown forms to the requested content.

Link targets and syntax need checking in the intended vault. Rendering in Obsidian is useful when available, but cannot be claimed if it was not observed.

## Where it fits

Use this for note content; use the separate application or Bases workflows for live operations or .base files.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Create a vault note
- Add wikilinks or a callout

## When not to use it

- Live application operations or .base editing

## How to use it

Start with a concrete request. For example:

```text
/obsidian-markdown Draft a project note with a status property, a link to the supplied roadmap note and a warning callout for the unresolved deadline.
```

## Flow

1. Establish note content and properties
2. Write Markdown with appropriate vault links and embeds
3. Check syntax and referenced content
4. Inspect rendering in Obsidian when available

## Common questions

**Does writing a wikilink guarantee its target exists?**

No. Check the referenced content and distinguish an intended new target from an existing one.

**When should I use the application workflow instead?**

Use the live application route for actions such as searching or opening Obsidian; use this skill for the note’s Markdown.

## It is working when

- The note contains the requested content and valid applicable Markdown structures.
- Referenced targets and any unobserved rendering are reported accurately.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An Obsidian Markdown note.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/obsidian-markdown/SKILL.md](../../skills/obsidian-markdown/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
