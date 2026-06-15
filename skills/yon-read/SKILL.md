---
name: yon-read
description: Read, interpret, or explain existing YON content. Trigger on any .yon file, YON snippet (lines with @TAG|...|... patterns), or when the user says "read this YON", "what does this YON mean", "explain this @DOC/@RULE/@STEP", "summarize this YON", "interpret this record". Do NOT trigger for generic format questions ("what is YON?") with no YON content present — and do not trigger when the user wants to *write* YON (use yon-write).
visibility: public
triggers:
  - "read this YON"
  - "what does this YON mean"
  - "explain this @DOC/@RULE/@STEP"
  - "summarize this YON"
  - "interpret this record"
next-skills:
  - skill: yon-write
    phrase: "/yon-write"
    why: "The natural family complement — after interpreting existing YON, edit, convert, or extend it."
  - skill: double-check
    phrase: "/double-check"
    why: "Re-verify a load-bearing interpretation of the YON before acting on it."
---

# /yon-read

YON Reading & Interpretation Mode — read, analyze, or explain YON (YounndAI Object Notation) content. YON is a line-oriented, stream-first Cognitive Architecture for AI systems — every line is independently parseable.

## Quick Orientation

YON looks like this — each line is a self-contained record:

```
@TAG field1=value1 | field2="quoted value" | key:type=typed_value
```

- Tags start with `@` at column 1 (uppercase): `@DOC`, `@RULE`, `@STEP`, etc.
- Fields are separated by ` | ` (space, pipe, space)
- Comments are lines starting with `#`
- Indented lines continue the previous record
- Values are bare when simple (`kind=workflow`) or quoted when they contain spaces (`title="My Document"`)
- Types are declared inline: `n:int=3`, `active:bool=true`, `ts:ts=2026-01-01T00:00:00Z`

## Interpretation Protocol

### 1. Start with @DOC

The first non-comment line tells you what the document is:
- `ver` — spec version (should be `2.0`)
- `id` / `title` — identity and human-readable name
- `kind` — document type: `doc`, `rule`, `workflow`, `skill`, `sidecar`, `spec`, `context`, `memory`, `note`, `prompt`
- `profile` — which tag families are active: `core`, `decl`, `exec`, `audit`, `cognitive`, `agent`, `full`
- `fmt` — density: `canon` (readable), `min` (compact), `ultra` (maximum density)
- `domain` — industry domain if applicable (e.g., `yon.health`, `yon.fintech`)

### 2. Walk @SEC Sections

Sections are flat — no nesting. Each `@SEC name="..."` marks a boundary; everything after it belongs to that section until the next `@SEC` or end of document.

### 3. Interpret by Tag

**Structure:** `@NOTE` (annotation), `@META` (metadata), `@DEF` (alias), `@REF` (external reference), `@STAMP` (provenance — who, when)

**Intent & Logic:** `@INTENT` (purpose/goal), `@SCOPE` (boundaries), `@RULE` (constraint with `lvl=MUST|SHOULD|MAY`), `@SCHEMA` (validation), `@CFG` (configuration), `@MAP` (key-value routing), `@CHECK` (assertion)

**Workflow:** `@STEP` (operation with order `n`, op code, inputs/outputs), `@INPUT`/`@OUTPUT` (declarations), `@YIELD` (partial results), `@CATCH`/`@RETRY`/`@ERROR` (error handling)

**Change Control:** `@PATCH` (modify prior record), `@VOID` (revoke prior record)

**Blocks:** `@BEGIN`/`@END` — verbatim embedded content (code, JSON, logs). Content inside is raw payload, not YON.

**Privacy:** `@REDACTION` (masking), `@CONSENT` (consent events)

**Cross-Domain:** `@IDENTITY` (actors), `@LOCATION` (spatial references)

### 4. Follow Reference Tokens

Records connect through prefixed tokens:
- `block:config` → `@BEGIN` block with `id=config`
- `rid:step:1` → record with `rid=step:1`
- `cfg:`, `file:`, `url:`, `ref:` → configs, files, URLs, generic references
- `agent:`, `group:`, `role:`, `stream:` → Layer 4 agent references
- `id:`, `loc:` → cross-domain identity/location

### 5. Recognize Layers

- **Layer 1-2 (Core):** Structure, logic, workflows — most documents live here
- **Layer 3 (Cognition):** `@THOUGHT`, `@HYPOTHESIS`, `@DECISION`, `@MEMORY`, `@PULSE`, `@SHARD` — reasoning traces
- **Layer 4 (Agents):** `@AGENT`, `@STREAM`, `@SIGNAL`, `@TENET`, `@ESCALATE` — multi-agent orchestration. Reading these records is always supported; *executing* `@AGENT`-routed dispatch depends on the host runtime's subagent capabilities (Claude Code supports it via the Agent tool; other runtimes vary). When Layer 4 records appear, interpret and explain them, but flag execution as runtime-dependent.

## Worked Example

Given this YON:
```
@DOC ver=2.0 | id=api-rules | title="API Safety Rules" | kind=rule | profile=decl
@INTENT goal="Protect public API endpoints"
@SEC name="Authentication"
@RULE rid=rule:auth | lvl=MUST | when="accessing any endpoint" | then="include valid Bearer token"
@RULE rid=rule:expired | lvl=MUST_NOT | when="token is expired" | then="allow access"
@SEC name="Rate Limits"
@MAP name=TierLimits | pairs=["standard"->"100/min","premium"->"500/min"]
@RULE rid=rule:backoff | lvl=SHOULD | when="rate limit exceeded" | then="retry with exponential backoff"
```

Explain it as:

> This is a **rules document** for API safety (`kind=rule`, `profile=decl`). Its goal is to protect public API endpoints.
>
> **Authentication section** has two mandatory rules: every API call must include a valid Bearer token, and expired tokens must never be allowed through.
>
> **Rate Limits section** defines two tiers — standard users get 100 requests/minute, premium get 500. If the limit is hit, clients are recommended (but not required) to use exponential backoff.

## Reading Sidecar Manifests

When a `.yon` file is colocated with source code, focus on: the Identity section (what the file is/exports), Agent Router section (decision trees — these are instructions to follow), Banned Combos section (anti-patterns to avoid), Dependencies, and Consumers.

## Voice When Explaining YON

When explaining YON content to users:
- Translate records to plain English, grouped by section
- State `@RULE` constraints with severity level prominently
- For workflows, describe execution order and data dependencies
- For `@MAP` records, explain the routing/decision logic
- Call out `@INTENT` and `@SCOPE` first — they frame the whole document
- Use YON's preferred terminology: "structural baseline" (not "overhead"), "operational characteristic" (not "trade-off"), "recoverability budget" (not "cost"). Avoid: "revolutionary", "game-changing", "best-in-class", "leverage", "synergy"

## Detailed References

For edge cases, Layer 3/4 tags, and field-level details — read these only when needed:

- [references/read-card.txt](references/read-card.txt) — Complete syntax card with all 72 tags across all layers
- [references/tag-registry.md](references/tag-registry.md) — Tag tables organized by layer and category
- [references/type-system.md](references/type-system.md) — Value types, reference token prefixes, list constraints
- [references/common-fields.md](references/common-fields.md) — Universal fields, content fields, workflow fields, governance fields
