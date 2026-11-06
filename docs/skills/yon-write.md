# yon-write

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a workflow or set of rules that needs a structured YON record for another agent to read. The writer selects a kind, format and profile, then encodes the supplied meaning while preserving uncertainty, sequence and exact links instead of resolving ambiguity on the author's behalf.

The local field table and profile guidance are version-specific. Extended tags require the referenced reader tables; field review, actual parser acceptance and broader conformance are separate claims. If needed authority is missing or conflicting, stop the dependent extended conformance claim.

## Where it fits

Use yon-write to create or convert records, and yon-read to interpret existing records. Simple data or short messages may be better served by a simpler format.

**Family:** YON. **Subagents:** No subagent step prescribed.

## When to use it

- Convert a workflow to YON
- Create an agent instruction record

## When not to use it

- Simple configuration, API data or short messages better served by other formats

## How to use it

Start with a concrete request. For example:

```text
/yon-write Encode the supplied approval workflow as YON 2.0, preserving its uncertain conditions and exact links; report the selected profile and validation limits.
```

## Flow

1. Choose profile, format and kind under the explicit YON 2.0 field and reference-validator 2.0.2 profile contract.
2. For extended tags load the required v2.0 yon-read field references; missing or conflicting authority stops dependent conformance. No automatic acquisition.
3. Treat size thresholds as scoped heuristics unless exact payload/tokenizer measurements support them.
4. Encode the source without resolving its uncertainty
5. Validate required fields, references, blocks and separators
6. Present pure records in a file or explain choices in conversation

## Common questions

**Should an ambiguous source become a mandatory rule?**

Only if its normative scope and severity are supported. Otherwise preserve the unresolved wording in a note or block, or clarify it.

**Does a successful parser check establish all-version conformance?**

No. Report the selected parser version and profile separately from field review and any unverified external specification or runtime claim.

## It is working when

- The resulting records preserve the source's meaning, uncertainty and exact references while meeting the selected field and profile requirements.
- The report distinguishes checks actually performed from parser or conformance claims not established.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Authored YON records with separate field-review, parser/version and unverified-conformance limits.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/yon-write/SKILL.md](../../skills/yon-write/SKILL.md)
- [skills/yon-write/references/write-card.txt](../../skills/yon-write/references/write-card.txt)
- [skills/yon-write/references/domains-card.txt](../../skills/yon-write/references/domains-card.txt)
- [skills/yon-write/references/generation-guide.md](../../skills/yon-write/references/generation-guide.md)
- [skills/yon-read/references/tag-registry.md](../../skills/yon-read/references/tag-registry.md)
- [skills/yon-read/references/read-card.txt](../../skills/yon-read/references/read-card.txt)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
