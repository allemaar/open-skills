---
name: yon-write
description: >
  YON Writing & Compilation Mode. Use when creating, generating, converting, or writing YON content. Triggers on: "write YON", "convert to YON", "create a .yon file", "encode this as YON", "YON format", or any request where the expected output is YON records. Also triggers when unstructured content should be structured into YON even without explicit keyword — e.g., working in a YON project. Use yon-read instead when reading, interpreting, explaining, or summarizing existing YON.
visibility: public
triggers:
  - "write YON"
  - "convert to YON"
  - "create a .yon file"
  - "encode this as YON"
  - "YON format"
next-skills:
  - skill: yon-read
    phrase: "/yon-read"
    why: "Read back the authored YON to confirm it parses and means what was intended — the family round-trip."
  - skill: double-check
    phrase: "/double-check"
    why: "Targeted re-verification that the newly written YON is syntactically and semantically correct before relying on it."
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push the new .yon file once it is written and validated."
---

# /yon-write

YON Writing & Compilation Mode — create, generate, or convert content into YON (YounndAI Object Notation), a line-oriented, stream-first Cognitive Architecture for AI systems.

## The Encoding Principle

**Foundational contract: YON preserves what the emitter wants to send. An encoder preserves what was said. A translator decides what was meant. YON is an encoder.**

- `"probably purple"` stays `"probably purple"` — do not resolve to `confidence: 0.6`
- `"like everyone else does"` stays verbatim — do not interpret vague social references
- Hedging, uncertainty, and conversational nuance are preserved exactly
- Links, paths, URLs are preserved byte-for-byte. Never alias, shorten, or rewrite.
- The human's intent is sovereign. The encoding layer is faithful to the source. Interpretation is downstream.

## When NOT to Generate YON

YON is a Cognitive Architecture for AI pipelines, not a universal data format. Do not use it for:

- **API responses** — YON adds +54–185% size vs JSON minified for pure data payloads
- **Config files** — TOML or YAML are better for human-edited configuration
- **Short messages under ~340 tokens** — plain text is cheaper at small context sizes
- **Database records** — use JSON, Protobuf, or native formats
- **Simple key-value data** — YON's structural baseline adds no benefit for flat data

YON belongs in: system prompts, agent instructions, multi-hop pipelines, rules/policies, workflows, cognitive traces, provenance tracking, and anywhere intent + data + audit travel together.

## Decision Gate — Before You Write

### 1. Choose Profile

| Profile   | Use When                                             |
|-----------|------------------------------------------------------|
| `core`    | Basic structure (docs, notes)                        |
| `decl`    | Rules and schemas (policies, configs)                |
| `exec`    | Workflows (steps, checks, error handling)            |
| `audit`   | Provenance tracking                                  |
| `cognitive` | AI thought chains                                  |
| `agent`   | Multi-agent systems                                  |

### 2. Choose Format

| Format  | Use Case                                  |
|---------|-------------------------------------------|
| `canon` | Human docs, reference material            |
| `min`   | LLM pipelines, agents (recommended default) |
| `ultra` | Cost-critical transport                   |

### 3. Choose Kind

`doc`, `rule`, `workflow`, `skill`, `sidecar`, `spec`, `context`, `memory`, `note`, `prompt`

## Output Rules

**When writing to a `.yon` file:** Output YON records ONLY. No markdown, no fenced blocks, no commentary. Pure YON.

**When showing YON in conversation:** Use a fenced code block and briefly explain your choices (profile, kind, key decisions made during encoding).

**Always:**
- First non-comment line MUST be `@DOC`
- Separator: ALWAYS ` | ` (space, pipe, space)
- Bare values when matching `[A-Za-z0-9_./:@+#-]+`, otherwise double-quote
- Values containing `|` MUST be quoted: `regex="a|b|c"`
- Typed keys for non-strings: `n:int=3`, `active:bool=true`, `ts:ts=2026-01-01T00:00:00Z`
- `@MAP` pairs: BOTH sides quoted: `pairs=["key"->"value"]`
- `@BEGIN`/`@END` blocks: `mime=` required, `boundary=` 8+ chars, `id=` required when multiple blocks or referenced
- Self-describing docs: add `guide="https://yon.younndai.com/yon-guide.txt"` when the document targets LLMs without YON knowledge

## Required Fields Per Tag

| Tag          | Required Fields                                                               |
|--------------|-------------------------------------------------------------------------------|
| `@DOC`       | `ver`, `id`, `title`                                                         |
| `@SEC`       | `name`                                                                        |
| `@NOTE`      | `text`                                                                        |
| `@STAMP`     | `ts`, `src`                                                                   |
| `@RULE`      | `lvl` (MUST/MUST_NOT/SHOULD/SHOULD_NOT/MAY), `when`, `then`                 |
| `@MAP`       | `name`, `pairs`                                                               |
| `@CFG`       | `id`, `set`                                                                   |
| `@INTENT`    | `goal`                                                                        |
| `@CHECK`     | `rid`, `assert`, `fail` (ABORT/WARN/SKIP), `msg`                            |
| `@STEP`      | `rid`, `n:int`, `op`                                                         |
| `@CATCH`     | `target`, `on`, `do`                                                         |
| `@RETRY`     | `target`, `max`                                                               |
| `@PATCH`     | `ts`, `target`, `set`                                                        |
| `@VOID`      | `ts`, `target`                                                                |
| `@REDACTION` | `target`, `reason`                                                            |
| `@CONSENT`   | `party`, `scope`                                                              |

## Conversion Patterns

### Prose → Rules
- `"Always"` / `"Must"` → `lvl=MUST`
- `"Never"` / `"Must not"` → `lvl=MUST_NOT`
- `"Prefer"` / `"Should"` → `lvl=SHOULD`
- `"Optional"` / `"May"` → `lvl=MAY`

### Tables → Schema / Map / Cfg
- Enum/Choices → `@SCHEMA key=severity | opts=[low,med,high] | default=med`
- Condition→Outcome → `@MAP pairs=["input"->"output"]`
- Multi-setting → `@CFG id=X | set=[k=v]` then `@MAP pairs=["ctx"->"cfg:X"]`

### Code/JSON/Logs → Blocks
```
@BEGIN CODE | id=handler | mime="text/x-python" | boundary="bnd_py_001"
def hello():
    return "world"
@END CODE | boundary="bnd_py_001"
```

### List Constraints
- `in`/`out`: reference tokens ONLY (`block:`, `rid:`, `cfg:`, `ref:`, `file:`, `url:`, `agent:`, etc.)
- `args`/`set`: field items ONLY (`key=value`, `key:type=value`)
- `pairs`: map pairs ONLY (`"k"->"v"`)
- Depth limit = 1. No nested lists.

## Worked Example: Prose → YON

**Input (user's messy prose):**
> "ok so we need an api rate limiting thing. all calls must have auth tokens. standard users get 100/min, premium 500. if they hit the limit they should probably back off exponentially. never expose internal errors in responses."

**Output:**
```
@DOC ver=2.0 | id=api-rate-policy | title="API Rate Limiting Policy" | kind=rule | profile=decl | fmt=min
@INTENT goal="Define authentication and rate limiting standards for public API"

@SEC name="Authentication"
@RULE rid=rule:auth | lvl=MUST | when="calling any API endpoint" | then="include valid auth token"

@SEC name="Rate Limits"
@MAP name=TierLimits | pairs=["standard"->"100/min","premium"->"500/min"]
@RULE rid=rule:backoff | lvl=SHOULD | when="rate limit exceeded" | then="probably back off exponentially"

@SEC name="Error Handling"
@RULE rid=rule:errors | lvl=MUST_NOT | when="returning API response" | then="expose internal error details"

@STAMP ts:ts=2026-03-30T12:00:00Z | src=human
```

**What the encoding did:** Detected section boundaries from topic shifts. `"must"` → MUST, `"never"` → MUST_NOT, `"should probably"` → SHOULD. Preserved `"probably back off exponentially"` verbatim (hedging preserved). Dropped `"ok so"` and `"thing"` (zero semantic content).

**What the encoding did NOT do:** Did not resolve `"probably"` into a confidence level. Did not reorder the user's sequence. Did not add fields the user didn't mention.

## Handling Ambiguous Input

When the input doesn't map cleanly to YON:

- **Unclear when/then split:** Use a broad `when` (e.g., `when="in all contexts"`) and put the action in `then`. Don't fabricate conditions.
- **Mixed intent and data:** Put purpose in `@INTENT`, constraints in `@RULE`, factual descriptions in `@NOTE`. When unsure, `@NOTE` is the safe default.
- **Vague severity:** Default to `SHOULD` and flag with `note="severity inferred — confirm with author"`
- **Nested/complex structures:** Flatten. Use `@CFG` for grouped settings, `@BEGIN`/`@END` blocks for verbatim payloads. Depth limit is 1.

## Validation Checklist

After writing, verify:

- [ ] Exactly one `@DOC`, first non-comment record
- [ ] All `@BEGIN` have matching `@END` with same TAG and boundary
- [ ] All `@BEGIN` include `mime=`
- [ ] No duplicate keys within a single record
- [ ] `@MAP` uses `pairs=[...]` with both sides quoted
- [ ] Canonical separator ` | ` used consistently
- [ ] All required fields present for each tag
- [ ] `@RULE` with `lvl=MUST` or `MUST_NOT` are individual records (never merged/summarized)

## Record Order (Recommended)

`@DOC` → `@STAMP` → `@META` → `@DEF` → `@REF` → `@INTENT` → `@SCOPE` → `@SEC` sections → `@BEGIN`/`@END` blocks

## Detailed References

For edge cases, extended syntax, and complete examples:

- [references/write-card.txt](references/write-card.txt) — Complete compilation reference card with one-shot examples
- [references/domains-card.txt](references/domains-card.txt) — All profiles, formats, kinds, and official domain list
- [references/generation-guide.md](references/generation-guide.md) — Comprehensive examples: rules, workflows, cognitive traces, multi-agent, prose encoding

Full spec: https://yon.younndai.com
