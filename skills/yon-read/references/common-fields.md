# YON Common Fields — Quick Reference

## Universal Fields (any tag)

| Field | Type | Description |
|-------|------|-------------|
| `rid` | string | Record ID, unique within doc. Convention: `rid=<type>:<name>` (e.g., `rid=step:fetch`, `rid=rule:validate`) |
| `from` | string | Source/sender: `user`, `assistant`, `system`, `agent:<name>`, `runner:<name>/<version>` |
| `to` | string | Recipient: role names, `agent:<name>`, `group:<name>` |
| `ts` | ts | ISO-8601 timestamp, prefer UTC with `Z` suffix |
| `note` | string | Human-readable annotation, not processed semantically |

## Content Fields

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Inline text payload. For large content, use `@BEGIN`/`@END` blocks. |
| `confidence` | float | Data accuracy [0.0–1.0]. Used in cognition tags and memory pipeline. |
| `trust` | float | Source reliability [0.0–1.0]. Measures reliability of the producing source. Required on `@IMPRINT`, optional on `@MEMORY`/`@SHARD`. |

**Key distinction:** `trust` is about the *source* (how reliable is who produced this?). `confidence` is about the *content* (how certain is this data?). They must not be conflated.

## Workflow Fields

| Field | Type | Description |
|-------|------|-------------|
| `n` | int | Sequence number for `@STEP` execution order |
| `op` | string | Operation ID: `namespace:category.action@version` (e.g., `std:fs.read@v1`) |
| `in` | list | Input references (reference tokens only) |
| `out` | list | Output references (reference tokens only) |
| `args` | list | Operation arguments (field items: `key=value`) |
| `set` | list | Patch fields for `@PATCH` updates (field items) |
| `rules` | list | Associated `@RULE` references |
| `use` | list | Configuration references to `@CFG` blocks |
| `timeout_ms` | int | Max operation duration. `0` = no timeout. |

## Target & Scope Fields

| Field | Type | Description |
|-------|------|-------------|
| `target` | string/ref | Record being modified, caught, retried, or acknowledged |
| `scope` | string | Area of effect boundary |
| `status` | string | Current status: `received`, `active`, `complete`, `rejected` |

## @DOC Governance Fields

| Field | Type | Description |
|-------|------|-------------|
| `classification` | string | `public`, `internal`, `confidential`, `restricted` |
| `jurisdiction` | string | Governing legal jurisdiction (e.g., `EU`, `US-CA`) |
| `data_residency` | string | Where data MUST be stored |
| `retention` | string | Data retention period (e.g., `7y`, `90d`, `indefinite`) |
| `expires` | ts | Content staleness timestamp |
| `redact` | bool | Enable active redaction mode |
| `guide` | string | URL to YON generation guide for self-bootstrapping |
