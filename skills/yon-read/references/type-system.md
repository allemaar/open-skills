# YON Type System & References — Quick Reference

## Value Types

Types are declared inline: `key:type=value`. No suffix = `str`.

| Type | Format | Examples |
|------|--------|---------|
| `str` | Bare or quoted string | `name=Tokyo`, `title="Hello World"` |
| `bool` | `true` / `false` | `enabled:bool=true` |
| `int` | Base-10 integer | `n:int=3`, `max:int=100` |
| `float` | Base-10 decimal | `lat:float=40.7128`, `confidence:float=0.85` |
| `ts` | ISO-8601 timestamp (UTC) | `ts:ts="2026-01-31T00:00:00Z"` |
| `ref` | Reference token | `target:ref=rid:step:fetch` |
| `bytes` | Non-negative integer | `length:bytes=4096` |
| `stream` | Incremental output handle | `output:stream=vitals-feed` |
| `vector` | Float array | `embedding:vector=[0.1,0.2,0.3]` |

**Key rule:** Parsers MUST NOT infer types. A bare `123` without `:int` is the string `"123"`.

## Reference Token Prefixes

| Prefix | Points To | Example |
|--------|-----------|---------|
| `block:` | `@BEGIN` block by `id` | `block:hotel_options` |
| `rid:` | Record by `rid` field | `rid:step:1` |
| `cfg:` | `@CFG` by `id` | `cfg:DeleteConfirm` |
| `file:` | External file path | `file:src/main.py` |
| `url:` | External URL | `url:https://api.com` |
| `ref:` | Generic cross-reference | `ref:schema:v2` |
| `agent:` | `@AGENT` record | `agent:planner` |
| `group:` | Agent group | `group:analysts` |
| `role:` | Named role | `role:reviewer` |
| `caps:` | `@CAPS` record | `caps:std:ai.*` |
| `stream:` | `@STREAM` record | `stream:vitals-feed` |
| `id:` | `@IDENTITY` record | `id:jane-doe` |
| `loc:` | `@LOCATION` record | `loc:memorial` |

**Disambiguation:** Bare value with recognized prefix = reference token. Quoted = literal string.
```
target=block:data        # Reference token
target="block:data"      # Literal string
```

## Universal Fields (any tag)

| Field | Type | Description |
|-------|------|-------------|
| `rid` | string | Record ID, unique within doc |
| `from` | string | Source/sender |
| `to` | string | Recipient |
| `ts` | ts | Timestamp (ISO-8601 UTC) |
| `note` | string | Human comment |

## Content Fields

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Inline text payload |
| `confidence` | float | Data accuracy [0.0–1.0] |
| `trust` | float | Source reliability [0.0–1.0] |

**Key distinction:** `trust` = source reliability. `confidence` = content certainty. Do not conflate.

## List Constraints

| List Key | Allowed Contents |
|----------|-----------------|
| `in` / `out` | Reference tokens only |
| `args` / `set` | Field items only (`key=value`) |
| `pairs` | Map pairs only (`"key"->"value"`) |
| `rules` | Reference tokens only |

Inline depth limit = 1. No nested lists.
