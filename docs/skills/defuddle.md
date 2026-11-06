# defuddle

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have an article or documentation URL and want its readable content without page navigation. Defuddle uses its installed CLI to extract Markdown; it can also retrieve a named metadata property.

Inspect the extraction before relying on it. If the CLI is unavailable, the skill reports the gap and can use a suitable route already available in the environment.

## Where it fits

Use it for an ordinary web page. API responses and raw downloads need a different route; prime-sweep covers larger source surfaces.

**Family:** Web. **Subagents:** No subagent step prescribed.

## When to use it

- Read an article or blog post
- Extract a documentation page

## When not to use it

- API responses or raw downloads

## How to use it

Start with a concrete request. For example:

```text
/defuddle Extract https://example.com/article as Markdown and report if the page body is missing.
```

## Flow

1. Supply the URL
2. Run the Markdown extraction and inspect the result
3. Use an available alternative or report a gap if the CLI is missing

## Common questions

**Can I ask for just the title?**

Yes. The CLI supports properties such as title, description and domain.

## It is working when

- The result contains the requested page body or metadata, with an extraction failure or missing capability stated.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Clean page content or requested metadata.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/defuddle/SKILL.md](../../skills/defuddle/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
