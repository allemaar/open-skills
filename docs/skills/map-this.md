# map-this

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A folder or vault has grown hard to navigate, and you want a bounded assessment before deciding what to change. Map-this establishes the environment and permitted inventory, then presents findings and selectable proposals without writing.

Discovery and write rules depend on the environment, including whether a vault is registered and whether its operations are available. A partial inventory cannot support a claim of exhaustive coverage.

## Where it fits

Use map-init to install a directive route; use map-this for one selected scope and map-check for its supported checks.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Map a project
- Organize an unstructured folder

## When not to use it

- Mutating before displaying proposals and receiving selection

## How to use it

Start with a concrete request. For example:

```text
/map-this Assess this project folder for navigation and ownership gaps. Exclude the supplied generated subtree, show proposed changes, and wait for my selection.
```

**Required skills:** [map-rules](map-rules.md). Install these first.

## Flow

1. Resolve the scope and environment branch
2. Perform a zero-write assessment and present proposals
3. Apply only selected changes under the appropriate rules
4. Verify the affected map and report limitations
5. Use exact frontmatter and M3 declarations; malformed policy or unreadable governed entrypoints block dependent healing. Dotted Markdown stems remain eligible. Alias healing needs named consumer/manual evidence; preserve raw missing or ambiguous records.

## Common questions

**Can a search sample prove there are no orphaned notes?**

No. Search-derived coverage is sampled and does not establish an exhaustive denominator or orphan count.

**Can a complete scanner result alone prove the map is clean?**

No. The report also needs the required ledger, covered checks and assessed paths. Scanner candidates are observations, not semantic classifications or authorization.

## It is working when

- The assessment names the scope, discovery basis, findings and proposed changes before mutation.
- Selected changes are verified within available coverage, and residual or unreadable scope remains explicit.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An assessment and, when selected, mapped changes.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-this/SKILL.md](../../skills/map-this/SKILL.md)
- [skills/map-this/references/tools/map-scan.mjs](../../skills/map-this/references/tools/map-scan.mjs)
- [skills/map-rules/references/link-resolution.md](../../skills/map-rules/references/link-resolution.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
