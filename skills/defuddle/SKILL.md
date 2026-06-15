---
name: defuddle
description: Extract clean markdown from web pages via Defuddle CLI (strips nav/ads/clutter, saves tokens). Trigger whenever the user pastes a URL or says "read this article", "fetch this page", "summarize this blog post", "pull this doc"; use this instead of WebFetch for any standard article, doc, or blog. Skip for APIs/JSON/raw downloads.
visibility: public
triggers:
  - "read this article"
  - "fetch this page"
  - "summarize this blog post"
  - "pull this doc"
next-skills:
  - skill: insight-cross-examine
    phrase: "/insight-cross-examine"
    why: "Deliberate over the extracted article's claims or options now that it is in clean context."
  - skill: prime-sweep
    phrase: "/prime-sweep"
    why: "When one page isn't enough, fan out to the larger source surface and bring back digested signal."
  - skill: obsidian-markdown
    phrase: "/obsidian-markdown"
    why: "Persist the cleaned article as a properly-formatted Obsidian note once it is extracted."
---

# Defuddle

Use Defuddle CLI to extract clean readable content from web pages. Prefer over WebFetch for standard web pages — it removes navigation, ads, and clutter, reducing token usage.

If not installed: `npm install -g defuddle`

## Usage

Always use `--md` for markdown output:

```bash
defuddle parse <url> --md
```

Save to file:

```bash
defuddle parse <url> --md -o content.md
```

Extract specific metadata:

```bash
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain
```

## Output formats

| Flag | Format |
|------|--------|
| `--md` | Markdown (default choice) |
| `--json` | JSON with both HTML and markdown |
| (none) | HTML |
| `-p <name>` | Specific metadata property |
