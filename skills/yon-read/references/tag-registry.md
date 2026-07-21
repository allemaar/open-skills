# YON Tag Registry — Layer 1-2 Required/Optional Fields

Field-level detail for core tags.
For tag descriptions and Layer 3/4 tags, see `read-card.txt`.

## Structural

### @DOC (Document Header)
Required: `ver`, `id`, `title`
Optional: `kind`, `domain`, `mode`, `profile`, `fmt`, `with`, `without`, `lang`, `region`, `direction`, `classification`, `handling`, `jurisdiction`, `data_residency`, `embargo_until`, `retention`, `retention_authority`, `expires`, `parent`, `audience`, `license`, `redact`, `guide`

### @SEC (Section)
Required: `name`
Optional: `id` (recommended when using `refs` feature)

### @STAMP (Provenance)
Required: `ts` (ISO-8601 UTC), `src`
Optional: `source`, `method` (api|manual|generated|scraped), `confidence` (0.0-1.0), `hash`, `algorithm` (sha256|sha512|blake3), `scope` (full|section|payload), `tokens`, `cost`, `model`, `approver`

**`src` and `method` answer different questions, and both are needed to read a stamp correctly.**
`src` names *who is responsible for the content* — a person, an organisation, a tool, or the
generic `human`. `method` names *how those bytes were produced*. They are independent: a named
author with `method=generated` means that author is responsible for a document a machine emitted
under their direction, not that the author typed it, and not that the machine authored it.
Reading `method` alone as an authorship claim is the common mistake.

Where a document carries more than one `@STAMP`, they are ordered provenance records, earliest
first. **Interpret each within its declared `scope`.** A later stamp does not erase earlier
provenance, and a `scope=section` or `scope=payload` attestation never supersedes a `scope=full`
one or an unrelated scope — recency alone settles nothing across different scopes.

### @META (Metadata)
Required: `key`, `value`

### @NOTE (Annotation)
Required: `text`
Optional: `lvl` (MUST|SHOULD|MAY — controls token reduction survival)

### @REF (Reference) — requires `decl` profile
Required: `name`
Optional: `url`, `target`

### @DEF (Alias)
Required: `$alias="value"` (positional)

## Logic & Constraints

### @INTENT
Required: `goal`
Optional: `audience`

### @SCOPE
Optional: `context`, `region`, `compliance`

### @RULE
Required: `lvl` (MUST|MUST_NOT|SHOULD|SHOULD_NOT|MAY), `when`, `then`
Optional: `rid`, `because`, `op`, `action`, `condition`

### @SCHEMA
Required: `key`
Optional: `opts` (list), `default`

### @CFG
Required: `id`, `set` (field-item list)
Optional: `rid`

### @MAP
Required: `name`, `pairs` (map-pair list: `"key"->"value"`)
Optional: `rid`, `id`

### @CHECK
Required: `rid`, `assert`, `fail` (ABORT|WARN|SKIP), `msg`

## Workflow

### @STEP
Required: `rid`, `n:int`, `op`
Optional: `in` (ref list), `out` (ref list), `args` (field-item list), `rules` (ref list), `use` (ref list), `timeout_ms:int`, `note`

### @INPUT
Required: `rid`, `name`
Optional: `type`, `required:bool`, `default`, `schema:ref`

### @OUTPUT
Required: `rid`, `name`
Optional: `type`, `schema:ref`

### @YIELD
Required: `rid`, `value:ref`
Optional: `step:ref`, `progress:float`

## Error Handling

### @CATCH
Required: `target:ref`, `on` (timeout|error|"timeout|error"), `do:ref`

### @RETRY
Required: `target:ref`, `max:int`
Optional: `delay_ms:int`, `backoff` (none|linear|exponential)

### @ERROR
Required: `code`, `msg`
Optional: `rid`, `severity` (fatal|recoverable), `source`

## Change Control

### @PATCH
Required: `ts:ts`, `target:ref`, `set` (field-item list)

### @VOID
Required: `ts:ts`, `target:ref`
Optional: `because`

## Dialogue

### @TURN
Required: `rid`, `text`
Optional: `from`, `to`, `role`

### @ACK
Required: `ref`
Optional: `status`, `by`

## Sessions

### @SESSION
Required: `rid`
Optional: `durability` (ephemeral|durable), `ttl_hours:int`

### @CHECKPOINT
Required: `rid`, `label`
Optional: `session:ref`, `includes` (ref list)

### @RECOVER
Required: `rid`, `from:ref`
Optional: `reason`

## Privacy

### @REDACTION
Required: `target:ref`, `reason`
Optional: `field`, `method` (mask|strip|hash), `start:int`, `end:int`

### @CONSENT
Required: `party`, `scope`
Optional: `granted:ts`, `method`, `revoked:ts`, `revoke_reason`, `revocable:bool`, `expires:ts`

## Cross-Domain

### @IDENTITY
Required: `rid`, `type` (person|organization|device|service|agent)
Optional: `name`, `email`, `org`, `role`, `verified`, `method`

### @LOCATION
Required: `rid`, `type` (facility|address|region|coordinates|virtual)
Optional: `name`, `lat:float`, `lon:float`, `jurisdiction`, `country`
