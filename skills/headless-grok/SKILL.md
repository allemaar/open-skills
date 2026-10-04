---
name: headless-grok
description: >
  Run bounded Grok Build coding-agent tasks through the official grok CLI. Trigger on
  /headless-grok, "run Grok headlessly", or "supervise grok -p". Not for installation,
  authentication changes, API-key setup, or consumer chat automation.
visibility: public
triggers:
  - "/headless-grok"
  - "run Grok headlessly"
  - "supervise grok -p"
next-skills: []
self-improvable: true
---

# /headless-grok

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` performs filesystem discovery only. A found CLI is not proof of login, subscription quota, API credits, model access, Windows containment, or parent supervision. Missing tools produce explicit route gaps; never install, authenticate, fall back to the API or change configuration automatically.

Run one bounded task through xAI's official Grok Build coding-agent CLI. This skill preserves the Handler's model, authentication route, permissions, directory, deadline, and retry decision. It does not install the CLI, change credentials or settings, enable billing, buy credits, or turn an X Premium/Grok subscription into API entitlement.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync; update both when their contract changes and refresh the `@STAMP` date.

## Preflight

Read the shared [run contract](references/run-contract.md), [freshness policy](references/freshness.md), and [model state](references/model-state.json). Run the bundled freshness checker when Node is available. Due evidence triggers one parent-owned offer to update the complete family or continue with the dated snapshot. A child reports due status and stops for that choice; it never refreshes recursively.

1. Resolve the actual `grok` executable. Run `grok --version`, `grok --help`, and `grok models`; verify every flag against current local help before launch. Determine platform support on the target host. Dated absence or runtime results from the maintainer host belong only to [validation boundaries](references/validation.md) and do not constrain another machine.
2. Record exact working directory, outcome, inputs, read/write scope, tools, model and reasoning choice, authentication route, output destination, timeout, monitoring and cancellation mechanism, and retry limit. Ambiguous writes are read-only. Assign a retained artifact for substantial work.
3. Respect explicit model and authentication choices. The currently documented coding/API model is `grok-4.6`, with a 500k context window and configurable reasoning. Documentation is not local entitlement; use only a model returned by `grok models`. Never silently substitute a model or auth route.
4. Distinguish consumer OIDC login from `XAI_API_KEY`. Existing browser/device login is preferred only when the Handler selects the consumer route. An API key has separate billing and requires explicit authorization plus a budget. Never print keys or inspect credential stores. Verify documented credential precedence and diagnose only variable presence/scope.
5. Current public API list pricing for Grok 4.6, reviewed 2026-09-17 against [xAI API pricing](https://x.ai/api), is tiered by prompt length: below 200k prompt tokens, $2 per million input tokens, $0.50 per million cached input tokens, and $6 per million output tokens; at or above 200k prompt tokens, $4 per million input tokens, $1 per million cached input tokens, and $12 per million output tokens. These are API rates, not a consumer subscription charge. Consumer paid plans share a weekly Chat/Imagine/Voice/Build pool shown in Settings -> Usage. No public exact quota matrix is promised. X Premium or a Grok subscription does not prove API credits.

## Bound authority

For a literal baseline, use `--permission-mode dontAsk`, `--no-subagents`, `--no-memory`, `--disable-web-search`, `--no-auto-update`, and no tools. Add only exact required tools and path rules using locally help-verified `--tools`, `--disallowed-tools`, `--allow`, and `--deny`. A prompt is not a permission boundary. Never broaden settings or remove a denial to make a run pass.

The documentation describes sandboxing, but Windows containment has not been established for this workflow. Do not claim enforced read-only or exact filesystem isolation unless independently verified on the target version. For work requiring that boundary, stop. Otherwise disclose that tool monitoring detects actions after dispatch and use a trusted minimal directory.

Disable subagents by default. Nested delegation requires a separate explicit, bounded, observable and cancellable authorization. Disable memory and web search for literal prompts unless the task explicitly requires and authorizes them. Do not load unrelated instructions, MCP servers, skills, hooks, or repository configuration without review.

## Launch and supervise

Use a foreground child owned by a supervisor that returns control, retains the process handle, captures stdout and stderr concurrently, reports a checkpoint within 60 seconds, enforces an external deadline, and can stop only that process tree. The CLI has no documented hard task timeout, so an external deadline is mandatory. Use the shared file-backed process runner on Windows when direct pipe capture fails.

After verifying current help, a baseline literal run has this shape:

```text
grok -p "<bounded prompt>" --model <listed-model> --output-format streaming-json --permission-mode dontAsk --tools "" --no-subagents --no-memory --disable-web-search --no-auto-update
```

Pass arguments separately with shell execution disabled. Do not interpolate untrusted text into shell syntax. Use `json` or `streaming-json` only after verifying the current output contract; retain raw stdout, stderr, process identity, exit code, session ID when present, and terminal result. Plain output is for short human use, not structured acceptance.

Inspect every observed tool, target, denial, error, auth/billing diagnostic and model identity. Stop on scope drift. On timeout, interrupt through the supervisor and, if necessary, terminate only the retained process tree. Confirm it stopped; never kill by executable name. Preserve partial output and report uncertain cleanup as incomplete.

## Accept, resume, and report

Exit zero means the harness finished, not that the task is correct. Require a complete nonempty terminal result, expected model/auth route, no denial/error/timeout/cancellation/malformed event, and only approved observed actions. Independently verify the requested answer or artifact. A public output format is not assumed to be a stable machine-readable schema across versions; reject unfamiliar structures rather than guessing.

Resume only when requested, using the exact retained session ID and the current help-supported resume command. Repeat preflight, permissions, model, auth route, deadline and supervision. Do not use a latest-session shortcut in automation.

Report CLI version, auth evidence without secrets, selected model/reasoning, permission mode, working-directory category, redacted command shape, deadline, output location, exit/result status, observed actions, verification, and gaps. On authentication, quota, billing, model, permission, malformed-output or cleanup failure, preserve the exact error and stop. Retry at most once only with new evidence, explicit authorization, and remaining budget.

## Official sources

- [Grok Build](https://x.ai/build)
- [Build overview](https://docs.x.ai/build/overview)
- [Headless scripting](https://docs.x.ai/build/cli/headless-scripting)
- [CLI reference](https://docs.x.ai/build/cli/reference)
- [Permissions](https://docs.x.ai/build/features/permissions)
- [Sandbox](https://docs.x.ai/build/features/sandbox)
- [Sessions](https://docs.x.ai/build/features/sessions)
- [Models and Grok 4.6](https://docs.x.ai/developers/grok-4-6)
- [API pricing](https://x.ai/api)
- [API rate limits](https://docs.x.ai/developers/rate-limits)
- [Grok FAQ](https://docs.x.ai/grok/faq)

Read [validation boundaries](references/validation.md) before changing command, parser, permission, authentication, or billing guidance.

**Self-improvement.** If a run exposes a concrete recurring or blocking weakness, propose a specific repair for approval. Otherwise remain silent. Never auto-apply.

For current account quota and reset times, use headless-usage. It reports Grok consumer usage only when a verified native or dated authenticated surface is available; otherwise it returns manual/cached/unavailable with Settings -> Usage guidance.

## Compatible parent route

Use the projected [file-backed process runner](references/process-supervision.md) on Windows when direct capture is unavailable. A successful version probe does not prove login, runtime-state writes, network access, subscription quota, or sandbox containment. The [fixed outer dispatcher](references/fixed-dispatch.md) is available only from an already authorized capable host with one immutable reviewed launcher. Never copy credentials, weaken permissions, or switch billing routes to make a nested launch work.
