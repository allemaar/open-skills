<!-- headless-models:projection -->
# Model and effort selection

Reviewed 2026-10-25. This dated matrix is maintained by the `headless-models` skill and bundled identically in the four provider headless skills. Refresh current availability and price before a consequential choice. Edit the canonical reference in `headless-models`, not a bundled projection.

## Select for the requested output

| Output | Required evidence | Cost-aware starting policy |
| --- | --- | --- |
| Extraction, classification, short summary | Exact output/schema checks on representative input | Try a locally available small model and low effort; verify the output. This is a heuristic, not a DeepSWE result. |
| Small isolated code change | Task tests, tool availability, context fit | Prefer a bounded setup that can satisfy the tests. Do not assume long-horizon benchmark rankings predict every small edit. |
| Long multi-file implementation | Comparable coding benchmark plus repository tests and supervision | Consult the measured effort ladder below; low/medium settings on some small models perform poorly on these tasks. |
| Research or factual synthesis | Retrieval coverage, primary sources, citation accuracy and suitable tools | Choose retrieval capability and verification first. Coding scores do not establish research accuracy. |
| Writing, translation, style matching | Representative rubric/sample and language-specific evidence | Use a task-relevant comparison. No measured winner is established by this map yet. |
| Images, audio, video or mixed modalities | Required modality, output format, rights and current tool support | Exclude unsupported text-only routes. No multimodal quality ranking is established here. |
| High-consequence analysis | Domain evidence, independent review and acceptance checks | Higher effort can be proposed; it is not a substitute for verification or domain expertise. |

Filter hard constraints before ranking: usable provider/harness, actual model access, required tools, data destination, context/output limits, budget and deadline. A benchmark-only provider remains comparison-only until a supported, authorized execution route exists.

Give one recommendation and, when useful, a lower and higher setup. State the saved or additional cost/quota, quality evidence, latency and reversal condition. Preserve an explicit model/effort until the caller accepts a change. Never silently switch provider, credits, subscription/API route or the parent session's model.

## Role roster

Dated candidates for worker, smart-worker, reviewer and special roles. Use each family's newest catalog-visible model and verify it against the target runtime before use.

| Role | Claude Code alias | Codex catalog 2026-10-29 | Gemini (agy) / Grok |
| --- | --- | --- | --- |
| worker | `haiku` (Haiku 5.5) | `gpt-6-luna` | latest model, low effort |
| smart-worker | `sonnet` (Sonnet 5.5) | `gpt-6.1-terra` | latest model, high effort |
| reviewer | `opus` (Opus 5.5) | `gpt-6.1-sol` | latest model, high effort |
| special | `fable` (Fable 5.1) | `gpt-6-astra` | none |

- Newest-generation models are unmeasured on DeepSWE: Haiku/Sonnet/Opus 5.5, Fable 5.1, `gpt-6-luna`, `gpt-6-sol`, `gpt-6.1-sol`, `gpt-6.1-terra`, Grok 4.7, Gemini 4 Argon. The measured ladder below covers their predecessors only.
- Codex `ultra` splits a divisible task across subagents; it is not deeper single-run reasoning. Offered on Sol, Terra and Astra, not Luna. Never use it for a leaf worker.
- Native subagent model choices come from the live worker tool contract, not the CLI catalog. Check them per session.

## Current coding recommendations are provisional

These are inferences for long-horizon coding from measured models, conditioned on usable tools and account access. Newer unmeasured successors may perform differently:

- **Economy candidate:** GPT-5.6 Luna at max. Its measured score is much stronger than its low/medium settings. The displayed benchmark cost is low, but native Codex results and subscription quota consumption need separate evidence.
- **Balanced Codex candidate:** GPT-5.6 Sol at high. It reached 69.4% in 9.9 mean minutes, versus 72.7% in 18.8 minutes at max. Use xhigh/max when the task justifies the extra work, not automatically. Cost at high is currently unverified in this map.
- **Strong Gemini candidate:** Gemini 3.8 Flash at high. It is competitive near the top of this coding board. September 15 scoped allow rules demonstrated reads, file creation and fixed command launch at low; the written artifact had an extra newline and nested inference hit provider capacity errors. Full autonomous implementation is not yet proved. Low remains suitable for the tested trivial smoke only, with no DeepSWE low score.
- **Quality-first comparison:** Astra medium/high/xhigh and Opus 5 high/xhigh/max are close enough that uncertainty, tools and latency matter. Astra medium scored 72.8% in 14.7 minutes; xhigh 74.1% in 18.9 minutes. Opus 5 high scored 72.8% in 19.4 minutes; max 73.6% in 31.9 minutes. This does not establish that max is worth its extra cost on a given task.

API benchmark dollars below are not subscription charges or a request estimate. For actual estimated cost use applicable input, cache, output/reasoning, tool and long-context prices against expected workload quantities. API standard rates reconciled 2026-10-25, USD per million tokens (input / cached input / output); long-context, batch and fast tiers differ:

| Model | Rate | Source |
| --- | --- | --- |
| Haiku 5.5 (prompts ≤100k) | 0.10 / 0.01 / 0.50 | [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Sonnet 5.5 | 2 / 0.10 / 10 | same |
| Opus 5.5 | 4 / 0.20 / 20 | same |
| Fable 5.1 | 10 / 0.25 / 50 | same |
| gpt-6-luna | 0.10 / 0.01 / 0.50 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| gpt-6-sol | 2 / 0.20 / 10 | same |
| gpt-6.1-sol | 2 / 0.10 / 10 | same |
| gpt-6.1-terra | 1 / 0.05 / 5 | same |
| gpt-5.6-terra | 2 / 0.20 / 12 | same |
| gpt-6-astra | 10 / 1 / 50 | same |
| Gemini 3.8 Flash | 0.75 / 0.075 / 3.75, rising to 1.50 / 7.50 on 2027-01-01 | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Gemini 4 Argon | 2 / 0.10 / 10 through 2026-11-30; 4 / 0.20 / 20 from 2026-12-01; implicit caching only | [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Grok 4.7 and 4.6 (<200k prompt) | 2 / 0.50 / 6 | [xAI models](https://docs.x.ai/docs/models) |

Reconciliation uses primary exact-model pages and full pricing tables, not search snippets or a model's answer. OpenAI's [Markdown pricing tables](https://developers.openai.com/api/docs/pricing.md) expose context and processing tiers omitted by the abbreviated rendered page. GPT-6 Sol and GPT-5.6 Terra rates are confirmed by their exact-model pages. These are API list rates, not CLI subscription charges.

- **OpenAI:** standard short context is through 272K input tokens. Above that, input/cache/write rates double and output is 1.5x for the full request. Cache writes are 1.25x input for 30 minutes and 2.5x for 12 hours. Batch/Flex are 0.5x; Fast is 2x. Astra and 6.1 Sol Ultrafast are 6x. Eligible regional/FedRAMP endpoints add 10%. GPT-5.6 Sol standard is 4 / 0.40 / 20; GPT-5.6 Luna is 0.20 / 0.02 / 1.20. Benchmark-era prices are not current workload quotes.
- **Anthropic:** the main table confirms all four listed models. Five-minute cache writes are 1.25x input; one-hour writes are 2x. Haiku 5.5 above 100K input is 0.50 / 0.05 / 2.50. Partner clouds and service tiers have separate billing rules.
- **Google:** Argon uses implicit caching only. Flash storage adds $0.50 per million tokens per hour through 2026-12-31, then $1. Grounding has separate per-query charges and allowances. Introductory-price expiry dates remain explicit above.
- **xAI:** the [Grok 4.7 model page](https://docs.x.ai/developers/models/grok-4.7) and its public pricing data confirm US east/west standard rates of 2 / 0.50 / 6 and long-context rates of 4 / 1 / 12. The page says requests exceeding 200K use the higher tier. US central rates are 10% higher. East/west batch discount is 20%; central advertises none. Grok 4.6 has the same rate fields.

Select tools, region, endpoint, tier and actual token quantities before estimating a workload. This verifies listed rate cards, not every optional service or negotiated contract. Unknown workload charges still prevent a hard spending-ceiling claim.

These API rates do not describe subscription quota, including the consumer shared weekly Chat/Imagine/Voice/Build pool. Unknown cost cannot satisfy a hard spending ceiling. Included subscription access still consumes quota and time.

## Evidence boundary

[DeepSWE v1.1](https://deepswe.datacurve.ai/) reports 113 tasks and a September 22, 2026 update (changelog last entry September 3). Re-fetched 2026-10-29: every score in this map matches the live data; no newer benchmark version or new model was found. The [structured evidence](https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json) has 70 configurations across 28 models; all use `mini-swe-agent`. Results are pass@1 over scored attempts with four whole-benchmark runs per configuration. Timeouts count as failures; some infrastructure/provider errors are excluded. The intervals reflect run-to-run uncertainty, not a guarantee about a user's task.

Model/harness results do not transfer unchanged to Codex, Claude Code, Antigravity, or Grok Build. A newer version or preview alias is not the same measured model. A blank effort entry means no measurement, not zero capability. The [changelog](https://deepswe.datacurve.ai/changelog) records pricing changes; historical raw JSON costs have differed from the rendered board. The Astra xhigh displayed and raw cost now agree at $4.43, replacing the older $6.52; its published token components and current standard rates also reconcile to $4.43 after rounding. All 21 numeric costs below match the rendered board checked on 2026-10-25. The seven default-hidden model rows retain unknown costs rather than importing unverified raw values. Reconciliation of the numeric claims is complete; unknown rows are not priced. Benchmark costs are historical evaluation statistics, not workload quotes.

## Provider-wide coding comparison

Each row below is the highest point estimate among that model's measured efforts, not a default effort recommendation. The full effort ladder follows. Costs are mean dollars per scored benchmark attempt, not per successful task or per million tokens. Durations are benchmark means, not a prediction for the current request.

| Provider family | Exact benchmark model | Best measured effort | Score +/- interval | Mean minutes | Displayed USD |
| --- | --- | --- | --- | --- | --- |
| Anthropic | claude-fable-5 | xhigh | 69.9% +/- 3.2 | 23.5 | 13.41 |
| Anthropic | claude-opus-4-8 | max | 59.0% +/- 1.8 | 58.2 | 13.22 |
| Anthropic | claude-opus-5 | max | 73.6% +/- 3.9 | 31.9 | 11.84 |
| Anthropic | claude-sonnet-4-6 | high | 29.9% +/- 4.1 | 46.9 | unverified |
| Anthropic | claude-sonnet-5 | max | 53.8% +/- 4.2 | 80.1 | 26.40 |
| DeepSeek | deepseek-v4-flash | max | 53.3% +/- 3.6 | 24.0 | 0.46 |
| DeepSeek | deepseek-v4-pro | max | 62.8% +/- 6.3 | 36.9 | 1.67 |
| Google | gemini-3-1-pro-preview | high | 11.7% +/- 1.5 | 14.5 | unverified |
| Google | gemini-3-5-flash | high | 36.1% +/- 4.0 | 18.8 | 3.45 |
| Google | gemini-3-6-flash | high | 46.7% +/- 3.7 | 24.6 | 2.21 |
| Google | gemini-3-7-flash | medium | 65.5% +/- 3.1 | 20.7 | 2.03 |
| Google | gemini-3-8-flash | high | 73.8% +/- 1.4 | 11.4 | 2.36 |
| Z.ai | glm-5-2 | max | 43.8% +/- 1.7 | 43.8 | 3.92 |
| Z.ai | glm-5-3 | max | 69.0% +/- 3.0 | 35.3 | 3.99 |
| Z.ai | glm-5-3-flash | max | 63.4% +/- 4.4 | 25.6 | 0.24 |
| OpenAI | gpt-5-4 | xhigh | 51.8% +/- 1.5 | 22.8 | unverified |
| OpenAI | gpt-5-5 | xhigh | 67.0% +/- 6.5 | 30.1 | 7.23 |
| OpenAI | gpt-5-6-luna | max | 67.2% +/- 4.0 | 18.7 | 0.61 |
| OpenAI | gpt-5-6-sol | max | 72.7% +/- 2.8 | 18.8 | 6.46 |
| OpenAI | gpt-5-6-terra | max | 69.6% +/- 2.6 | 16.9 | unverified |
| OpenAI | gpt-6-astra | xhigh | 74.1% +/- 2.9 | 18.9 | 4.43 |
| xAI | grok-4-5 | high | 53.8% +/- 2.3 | 8.1 | unverified |
| xAI | grok-4-6 | medium | 67.5% +/- 2.3 | 14.9 | 3.45 |
| Moonshot | kimi-k2-7-code | unspecified | 30.5% +/- 0.5 | 36.1 | unverified |
| Moonshot | kimi-k3 | max | 68.5% +/- 4.5 | 75.7 | 4.65 |
| Meta | muse-spark-1-1 | xhigh | 53.3% +/- 3.0 | 15.0 | unverified |
| Meta | muse-spark-1-2 | xhigh | 54.9% +/- 2.1 | 15.5 | 3.70 |
| Alibaba | qwen3-8-max | xhigh | 57.5% +/- 2.7 | 42.8 | 3.73 |

## Measured effort ladder

Values are pass@1 percentages. The column names are source labels, not universal cross-provider compute budgets. Ultra and other unmeasured settings are not inferred from max.

| Exact benchmark model | low | medium | high | xhigh | max |
| --- | --- | --- | --- | --- | --- |
| claude-fable-5 | 59.6 | 65.4 | 68.6 | 69.9 | 69.7 |
| claude-opus-4-8 | 40.8 | 48.7 | 51.8 | 54.4 | 59.0 |
| claude-opus-5 | 58.1 | 68.9 | 72.8 | 73.2 | 73.6 |
| claude-sonnet-4-6 | — | — | 29.9 | — | — |
| claude-sonnet-5 | 30.5 | 39.8 | 48.2 | 49.7 | 53.8 |
| deepseek-v4-flash | — | — | — | — | 53.3 |
| deepseek-v4-pro | — | — | — | — | 62.8 |
| gemini-3-1-pro-preview | — | — | 11.7 | — | — |
| gemini-3-5-flash | — | — | 36.1 | — | — |
| gemini-3-6-flash | — | — | 46.7 | — | — |
| gemini-3-7-flash | 53.8 | 65.5 | 65.3 | — | — |
| gemini-3-8-flash | — | 71.0 | 73.8 | — | — |
| glm-5-2 | — | — | 36.3 | — | 43.8 |
| glm-5-3 | — | — | — | — | 69.0 |
| glm-5-3-flash | — | — | — | — | 63.4 |
| gpt-5-4 | — | — | — | 51.8 | — |
| gpt-5-5 | 27.0 | 54.0 | 64.4 | 67.0 | — |
| gpt-5-6-luna | 1.5 | 11.3 | 44.2 | 56.9 | 67.2 |
| gpt-5-6-sol | 45.4 | 61.1 | 69.4 | 70.7 | 72.7 |
| gpt-5-6-terra | 24.1 | 35.1 | 53.8 | 60.2 | 69.6 |
| gpt-6-astra | 67.0 | 72.8 | 73.2 | 74.1 | 73.2 |
| grok-4-5 | — | — | 53.8 | — | — |
| grok-4-6 | 41.6 | 67.5 | 65.2 | 66.7 | — |
| kimi-k2-7-code | — | — | — | — | — |
| kimi-k3 | — | — | — | — | 68.5 |
| muse-spark-1-1 | — | — | — | 53.3 | — |
| muse-spark-1-2 | — | — | — | 54.9 | — |
| qwen3-8-max | — | — | — | 57.5 | — |

## Locally observed availability, separate from benchmark scores

Catalogs observed 2026-10-29; re-discover after runtime, account, host or workspace changes. Listed means catalog-visible, not inference-tested or entitlement-guaranteed.

| Runtime | Visible model selection | Supported effort observed | Execution evidence |
| --- | --- | --- | --- |
| Codex CLI 0.160.0 | `gpt-6.1-sol`, `gpt-6.1-terra`, `gpt-6-sol`, `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra` | low, medium, high, xhigh, max, ultra | `gpt-6.1-sol` and `gpt-6-astra` high completed read-only review runs 2026-10-14; others catalog-only |
| Codex CLI 0.160.0 | `gpt-6-luna`, `gpt-5.6-luna` | low, medium, high, xhigh, max | `gpt-5.6-luna` low passed earlier prompt/read/write fixtures; others catalog-only |
| Codex CLI 0.160.0 | Hidden: `gpt-reserve`, `codex-auto-review`. Absent: `gpt-5.5` (retired from ChatGPT-login Codex 2026-10-14; API-key sessions unaffected) | — | Not selectable |
| agy 1.4.10 | `gemini-3.8-flash-low`, `gemini-3.8-flash-medium`, `gemini-3.8-flash-high` | Encoded in slug | Earlier low prompt/read, scoped file creation and command launch evidence retained; exact write bytes and nested inference did not pass; medium/high listed only. Gemini 3.7, 3.6 and 3.1 Pro are no longer listed |
| Claude Code 2.1.310 | `haiku`, `sonnet`, `opus`, `fable`, `best` | `--effort` low, medium, high, xhigh, max | Version 2.1.310 and non-inference authentication rechecked; non-inference auth status reports a first-party claude.ai Max login. Per-model entitlement remains unverified |
| Grok Build 1.0.70 | `grok-4.7`, `grok-4.7-build-fast`, `grok-4.6`, `grok-4.5` | Not established by catalog | Catalog reports grok.com login; account entitlement and inference remain unverified. An earlier check reported unauthenticated. |
| Other providers in the table | No local adapter verified in this refresh | Unknown locally | Comparison-only; no installation or account access implied |

The agy 1.4.10 catalog also lists `gemini-4-argon-low`, `gemini-4-argon-medium` and `gemini-4-argon-high`. On 2026-10-25 Argon low completed one authorized arithmetic turn with the expected marker, exit zero, no observed tools and verified root/direct-child absence. Medium/high remain catalog-only; broader file workflows remain unverified. Argon is the latest-model role candidate; Flash remains the lower measured coding candidate, without a measured Argon comparison.

The agy catalog also exposes Claude Opus 5.5 and Sonnet 5.5 (low/medium/high) and GPT-OSS 120B Medium. The headless-gemini skill also supports explicitly selected Opus 5.5 and Sonnet 5.5 through Antigravity, using its Claude/GPT pool rather than native Claude quota. Opus low completed a bounded literal response on 2026-10-25; Sonnet and other Claude effort levels remain catalog-only. Verify the current catalog and use the skill's Claude-specific guidance. GPT-OSS remains catalog-only and outside the bundled supervisor model allowlist. Gemini 4 Argon is now listed locally as well as in the Gemini API.

[Claude's model documentation](https://code.claude.com/docs/en/model-config): on the Anthropic API, `haiku`, `sonnet` and `opus` resolve to the 5.5 models and `fable` to Fable 5.1 (Fable 5 in some gateway sessions); other cloud providers map aliases to older models. Haiku, Sonnet and Opus 5.5 and Fable 5/5.1 support effort low to max; the 5.5 models default to medium. This board measures Fable 5 and Opus 5, not their successors. Fable can bill usage credits; `-p` and SDK sessions bill it without asking, so never recommend or launch that billing path silently.

## Refresh and update contract

Use `headless-models` for selection and `headless-update-models` for an authorized family refresh. On a standalone headless install without it, recheck the linked primary sources and local catalog, label stale or missing fields, and do not pretend the bundled snapshot is live. Updating the matrix never changes executable permissions, authentication, budget authorization or an explicit model selection.

Recheck the source date/version, full effort set, exact IDs, methodology, displayed costs and provider pricing; then update one canonical reference and project it to all supported consumers. Keep the older snapshot's date when a source is unreachable and label it stale. Apply the reminder interval from bundled model-state.json and freshness.md; a reminder is not a guarantee of correctness. Never recompute recommendations from unverified prices.
