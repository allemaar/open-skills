# defuddle

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Extract readable Markdown from a web page.

**Family:** Web. **Subagents:** No subagent step prescribed.

## When to use it

- Read an article or blog post
- Extract a documentation page

## When not to use it

- API responses or raw downloads

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/defuddle read https://example.com/article
```

## Flow

1. Supply the URL
2. Run the Markdown extraction and inspect the result
3. Use an available alternative or report a gap if the CLI is missing

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Clean page content or requested metadata.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/defuddle/SKILL.md](../../skills/defuddle/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
