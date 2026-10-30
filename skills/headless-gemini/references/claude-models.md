# Claude through Antigravity

Load this reference when selecting Claude through `agy` or comparing execution families. `/headless-gemini` is the Antigravity route for Gemini and the supported Claude selections below. Native Claude Code remains the `/headless-claude` route. Choose the exact model, effort, harness and account pool before launch; never fall back between them automatically.

## Listed selections, 2026-10-25

Antigravity CLI 1.4.7 listed these effort-specific slugs in local `agy models` output:

| Model | Exact slugs | Runtime evidence |
| --- | --- | --- |
| Claude Opus 5.5 | `claude-opus-5-5-low`, `claude-opus-5-5-medium`, `claude-opus-5-5-high` | Low completed generic-runner and bundled-adapter prompt smokes; medium and high are catalog-only |
| Claude Sonnet 5.5 | `claude-sonnet-5-5-low`, `claude-sonnet-5-5-medium`, `claude-sonnet-5-5-high` | Catalog-only; no Sonnet inference was tested |

Verify the selected slug in the current local catalog before every run. A dated listing and adapter acceptance do not establish present account access, backend identity or task capability. An unavailable selection blocks that route. Do not synthesize slugs or substitute a model, effort, provider or billing route.

## Choose the harness and pool

| Requested route | Execution and account pool | Selection requirement |
| --- | --- | --- |
| Gemini through Antigravity | `agy`, existing Antigravity account | Exact locally listed Gemini slug |
| Claude through Antigravity | `agy`, existing Antigravity account | Explicit Claude family and Antigravity route; exact supported and locally listed Claude slug |
| GPT through Antigravity | Outside this adapter's supported model filter | Report unsupported; do not infer a GPT route from other catalog families |
| Native Claude Code | Native Claude Code and its account route via `/headless-claude` | Separate preflight, model/effort selection and supervision contract |

Claude selected through `agy` uses the Antigravity Claude/GPT allowance, separate from native Claude and Codex subscriptions. It uses Antigravity tools, permission handling and stream output. Native Claude Code flags such as `--tools` and `--strict-mcp-config`, native subagents, per-run tool restrictions, login access and quota guarantees do not transfer. A successful response does not prove a subscription tier or remaining quota. Existing Antigravity supervision remains unchanged: observing a tool call detects an action after dispatch and does not sandbox it.

## Bounded runtime evidence

On 2026-10-25, `claude-opus-5-5-low` through Antigravity 1.4.7 returned the exact expected literal marker, one `SUCCESS` result and exit 0, with no observed tool calls. Init echoed the requested model and working directory. Reported usage was 11,265 input tokens, 15 output tokens and 11,280 total tokens. The root and direct children were checked absent afterward. Raw logs remain private.

That first smoke used the generic file-backed process runner. A second smoke through the extended bundled adapter returned its exact expected literal marker in 7.589 seconds, with exit 0, one `SUCCESS` envelope, matched model/CWD and `request-review` mode, no observed tool calls, no parser failures and empty stderr. Reported usage was 6,108 input tokens, 18 output tokens and 6,126 total tokens; the separately reported cache-read field was 5,168 tokens. The supervising host independently checked the root and direct children absent.

These establish existing-login prompt responses and the bundled adapter route for Opus low only. They do not prove Sonnet execution, Opus medium/high execution, file writes, arbitrary tools, strict isolation, quota or independent backend attestation. See [validation](validation.md) for the adapter's broader historical evidence and limits.
