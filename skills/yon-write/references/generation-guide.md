# YON LLM Generation Guide

Convert any input into valid YON. Output must be parseable, roundtrip-safe, and usable by diverse LLMs and non-LLM tooling.

## Hedging & Uncertainty Preservation

Hedging language ("probably", "maybe", "might", "I think") MUST be preserved verbatim in text values:

- `"The color is probably purple"` → `@CFG key=color | val="probably purple"`
- Do NOT resolve hedging to confidence levels or separate metadata
- The encoding layer preserves; the downstream consumer interprets

## Block Encoding

When content is long or copy/paste sensitive (code, prompts, JSON, logs, diffs), use `@BEGIN`/`@END` blocks.

Every `@BEGIN` MUST include:
- `mime="..."` — always required
- `boundary="..."` — 8+ chars matching `[A-Za-z0-9_-]{8,}`
- `id="..."` — REQUIRED when multiple blocks exist or when referenced

Multiple blocks need unique IDs:
```
@BEGIN CODE | id=py_handler | mime="text/x-python" | boundary="bnd_py_001"
def hello():
    return "world"
@END CODE | boundary="bnd_py_001"

@BEGIN JSON | id=config_data | mime="application/json" | boundary="bnd_json_001"
{"key": "value", "nested": {"a": 1}}
@END JSON | boundary="bnd_json_001"
```

Without unique `id=` on each block, the second block will fail with a duplicate ID error.

## Operation Versioning

Operations use `@v<N>` suffix:
```
@STEP op=std:fs.read@v1 | ...       # Explicit v1
@STEP op=std:fs.read | ...          # Latest available
@STEP op=custom:my_tool@v3 | ...    # Custom namespace
```

## Complete Document Examples

### Rules Document
```
@DOC ver=2.0 | id=api-policy | title="API Policy" | kind=rule | profile=decl
@INTENT goal="Define authentication and rate limiting standards"

@SEC name="Authentication"
@RULE rid=rule:bearer | lvl=MUST | when="accessing API" | then="include valid Bearer token"
@RULE rid=rule:expired | lvl=MUST_NOT | when="token expired" | then="allow access"

@SEC name="Rate Limits"
@CFG id=ratelimit | set=[requests_per_minute:int=100,burst_limit:int=20]
@MAP name=ErrorActions | pairs=["429"->"backoff","401"->"refresh_token","403"->"escalate"]

@STAMP ts:ts=2026-03-15T12:00:00Z | src=human
```

### Workflow Document
```
@DOC ver=2.0 | id=deploy-pipeline | title="Deploy Pipeline" | kind=workflow | profile=exec
@INTENT goal="Automate build, test, and deploy cycle"

@SEC name="Steps"
@STEP rid=step:build | n:int=1 | op=std:build.compile@v1 | out=[ref:artifact]
@STEP rid=step:test | n:int=2 | op=std:test.run@v1 | in=[ref:artifact] | rules=[rid:rule:coverage]
@STEP rid=step:deploy | n:int=3 | op=std:deploy.push@v1 | in=[ref:artifact] | timeout_ms:int=60000

@SEC name="Rules"
@RULE rid=rule:coverage | lvl=MUST | when="running tests" | then="maintain 80% coverage"

@SEC name="Error Handling"
@CATCH target=rid:step:deploy | on=timeout | do=rid:step:build
@RETRY target=rid:step:deploy | max:int=3 | delay_ms:int=5000 | backoff=exponential

@STAMP ts:ts=2026-03-15T12:00:00Z | src=human
```

### Cognitive Trace
```
@DOC ver=2.0 | id=diagnosis | title="System Diagnosis" | profile=cognitive
@THOUGHT rid=t:1 | type=deliberation | confidence:float=0.7
  | content="Error rate spiked at 14:00. Correlates with deployment."
@HYPOTHESIS rid=h:1 | based_on=rid:t:1 | confidence:float=0.6
  | claim="New deployment introduced a memory leak."
@DECISION rid=d:1 | trace=[rid:t:1,rid:h:1] | selected=rollback | confidence:float=0.8
```

### Multi-Agent Configuration
```
@DOC ver=2.0 | id=review-collab | title="Code Review" | profile=agent
@AGENT rid=agent:reviewer | name="Code Reviewer" | type=ai | model=claude-4
@AGENT rid=agent:author | name="Ada" | type=human
@STREAM rid=stream:review | type=collaboration | agents=[agent:reviewer,agent:author]
@TURN from=agent:reviewer | to=agent:author | rid=turn:1
  | content="Lines 42-67: O(n²) complexity. Consider a hash map."
@ACK from=agent:author | ref=rid:turn:1 | status=accepted
```

## Encoding Human Prose

When converting unstructured human input to YON:

1. Detect section boundaries from topic shifts
2. Recognize constraints ("should be", "must have", "never") → `@RULE`
3. Move purpose statements to `@INTENT`
4. Drop conversational noise ("ok so", "oh and", "wait actually") — zero semantic content
5. Preserve hedging verbatim — `"probably purple"` stays `"probably purple"`
6. Preserve sequence — the emitter's order is the emitter's choice

## Security Note

A YON document describes a PLAN, not a script. Operations in `@STEP` are declarative — they are never executed without explicit, pre-configured Runner permission. See the YON spec for execution model and permissions.
