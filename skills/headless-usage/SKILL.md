---
name: headless-usage
description: >
  Read current quota, usage and reset times across Codex, Claude Code, Antigravity
  and Grok Build. Use /headless-usage, "show my quotas", or "how much usage is left".
  Returns a dated result for every requested harness, including unavailable data.
visibility: public
triggers:
  - "/headless-usage"
  - "show my quotas"
  - "how much usage is left"
next-skills: []
self-improvable: true
---

# /headless-usage

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Get a fresh, bounded account-usage report whenever requested. Default to Codex, Claude Code, Antigravity and Grok Build; honor a narrower request. This is a read-only account query using existing authentication, with private diagnostic files. Never launch model inference, read credential stores, copy login tokens, consume reset credits, enable paid overage, change settings or install a collector to obtain a reading.

**Structured execution spec:** [protocol.yon](protocol.yon). This document is sufficient to execute the workflow.

1. Discover the caller's available usage tools and installed native executable paths. Read [providers.md](references/providers.md) before querying. Prefer Codex desktop's `get_usage_limits` when available; otherwise use the bundled direct reader. A missing runtime or authentication is an unavailable result, not a reason to install or log in automatically.
2. Query each requested provider now, independently. Model-selection evidence and its configured reminder interval do not gate live quota reads. Keep each provider's observation time, source and freshness separate. A failed provider must not suppress successful readings from the others.
3. For direct Codex and Antigravity queries on Windows, create a private JSON spec as described in [reader.md](references/reader.md), then run `node <skill-directory>/scripts/usage.mjs <absolute-spec-path>`. Resolve installed skill links to their canonical source when authoring files. Use a new output directory every time. The reader verifies CLI version/help, retains raw diagnostics privately and returns a normalized report. Observe completion and process cleanup. Non-Windows callers use verified native usage surfaces or report that the bundled reader is unsupported.
4. For Claude Code, use an existing terminal session's **/usage** screen when terminal control is available. Alternatively start a supervised Claude TUI in a known trusted directory, with a finite deadline (60 seconds recommended), issue **/usage**, wait for its loading/refresh state to finish, record the bars and reset times, then exit and verify process termination. Handle startup prompts explicitly; never send a work prompt or change permission defaults. The direct JSON reader deliberately reports Claude unavailable because no supported standalone headless quota endpoint was verified. Supplement that result with the terminal observation in the final report, naming its source and timestamp. Do not claim the JSON contains this separate observation.
5. For Grok Build consumer usage, use an existing authenticated Grok Build surface and read **/usage** or Settings -> Usage interactively when terminal/browser control is available. Record the displayed shared Chat/Imagine/Voice/Build weekly pool and reset information with the observation timestamp. This is a live interactive observation only when the surface reports current data; a previously captured/manual UI reading is cached and must include its capture time and age. No standalone machine-readable Grok quota API or direct-reader implementation is verified, so without an existing authenticated surface report Grok as unavailable and give the concrete manual action: open Grok Build and run **/usage** or open Settings -> Usage. Never use API Console billing/rate data as consumer quota, and never infer API credits from X Premium or a Grok subscription.
6. A Claude or Antigravity status-line capture may be used only if already configured and available. Label it cached, show capture time and age, and retain any provider freshness warning. A new capture timestamp does not prove a new quota fetch. Missing fields are unknown. If the Claude UI says “Showing last-known usage”, label it cached; at most one bounded retry is useful. Without terminal control or a usable capture, return unavailable with the concrete manual action: open the harness and run **/usage**. Never use a model request to populate missing status-line fields.
7. Present one compact table: harness/bucket, remaining percentage, reset time in the user's timezone, observed time and live/cached/unavailable status. Include five-hour, weekly and family-specific windows only when actually returned. Calculate remaining as `clamp(100 - usedPercent, 0, 100)` where needed; null is unknown, not zero usage. Preserve separately named buckets. Antigravity's Claude/GPT pool is not the native Claude or Codex account allowance, and Grok's consumer weekly Build pool is not xAI API Console billing or rate limits.
8. Add useful insights only when sourced: the tightest returned window, overlapping quotas, optional provider-reported activity or credit metadata. Percentages do not establish remaining tokens, requests or purchasable value. Session tokens, context occupancy, list-price cost estimates and local activity are different from account allowance. Never silently switch models/providers or spend credits based on this report. Return partial results and exact access gaps when necessary.

Every invocation attempts current reads. There is no daemon, scheduled job or promise that every provider exposes data at every moment. On schema changes, retain private diagnostics and report an error rather than guess. Explicit maintenance can update these provider adapters through headless-update-models; quota values themselves never become model-map evidence.

**Self-improvement.** Propose a concrete repair only for a recurring or blocking weakness. Otherwise remain silent; never auto-apply.
