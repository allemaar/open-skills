---
name: headless-models
description: >
  Compare providers, models and effort against task quality, cost, latency and local
  availability. Trigger on /headless-models, "which model should I use", or "update all
  model maps". Read-only selection. Use headless-update-models to refresh the family.
visibility: public
triggers:
  - "/headless-models"
  - "which model should I use"
  - "compare models and effort"
next-skills: []
self-improvable: true
---

# /headless-models

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Maintain one evidence-based model selection matrix across providers and project its guidance into the installed headless skills. Select for the requested output and budget, rather than promoting one provider or always choosing its largest model. Explicit caller choices remain authoritative.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. Update both when their contract changes and refresh the `@STAMP` date.

## Read-only selection and freshness

Use this skill to compare providers or recommend a setup. It does not launch inference, edit the matrix, install software or change the current conversation's model. An update request routes to the separately invoked `headless-update-models` skill after reading it.

Before selection, read [model-state.json](references/model-state.json) and apply [freshness.md](references/freshness.md). The reminder interval comes from `policy.reminderDays`. Run `node <skill-dir>/scripts/check-model-freshness.mjs <absolute-state-file>` when Node is available; otherwise apply the same documented timestamp checks. This is a local check, not an API call. Due evidence prompts one parent-owned offer to refresh all headless guidance or continue with the dated snapshot. Never ask inside a worker or silently refresh. An explicit model choice does not skip this check.

The provider set is open: include all providers in relevant sources, mark unavailable routes comparison-only, and report actual coverage. The initial coding snapshot covers 28 models from nine families, not every available model or every task family.

## Establish what the output needs

Record the requested artifact, task family, minimum acceptance checks, failure consequence, input size/modalities, required tools, privacy/destination constraints, latency limit, and monetary or subscription-quota budget. Infer ordinary choices from the task and label them. Ask only for a missing constraint that would materially change the recommendation.

Use the task-fit matrix in [selection.md](references/selection.md). DeepSWE supports long-horizon coding comparisons. It does not rank prose, research accuracy, translation, image generation, speech, or short extraction. For those, obtain task-relevant primary evaluations and provider capability documentation, or state that model-specific quality is unmeasured. Do not transfer a coding score into a universal quality score.

## Gather three distinct evidence layers

1. **Execution availability:** for each relevant installed harness, inspect version/help and its actual model/effort catalog using supported read-only commands. Start with `codex debug models`, `agy models`, `grok models`, and Claude help plus current model configuration documentation. Filter Codex hidden models; print only catalog identity/effort fields, never embedded instructions or credentials. Claude aliases require provider-aware resolution and account access remains unknown until independently observed. Missing CLI means unavailable locally, not an instruction to install it. Additional provider adapters must establish their own supported discovery commands.
2. **Capabilities and price:** consult current primary provider documentation for exact versioned IDs, aliases, effort support, context/output limits, modalities, tools and billing. Track runtime, endpoint/provider and model separately. Subscription limits are not API dollar costs. Include cache, reasoning, tool, long-context and credit charges when applicable; unknown components stay unknown. Do not expose keys or inspect credential stores.
3. **Task performance:** fetch current primary benchmark data and its methodology, recording source, date/version, exact model/effort/harness, metric, uncertainty, sample count, cost basis and latency. Use the full effort ladder rather than only each model's best row. Missing effort/version measurements stay missing, never zero or extrapolated. Benchmark evaluation cost is not a quote for the caller's workload, and pass rate is not that workload's probability of success.

Use the separate updater for bounded evidence collection and projection. The downloadable JSON and displayed board have disagreed on price; compare both and the changelog before calling any price current. Preserve conflicting values and provenance, then either reconcile with current provider pricing or mark cost unknown. Never silently select the lowest figure.

Exact model identity matters. A Fable 5 result does not measure a Fable 5.1 alias. Gemini Pro Preview does not establish a result for every Pro endpoint. CLI catalog membership, documented capability, benchmark score and successful local execution are independent fields.

## Build a cost-aware recommendation

First filter out candidates that cannot satisfy the mandatory output, tool, privacy, context, availability or hard-budget constraints. Compare only relevant, sufficiently current evidence. Among feasible candidates, show a compact matrix with provider/model/effort, task-fit evidence, quality, cost basis or estimated range, latency and material gaps. Distinguish observed values from inferred task suitability.

Recommend one setup. When useful, offer one lower-cost/lower-effort option and one higher-quality option, each with the expected saving or gain, evidence, and reversal condition. Lower effort is not necessarily cheaper overall: failure, retries and review can erase token savings. Higher effort is not necessarily more accurate. Overlapping confidence intervals do not prove a ranking; tiny point differences are not grounds for automatic escalation.

For an API estimate, use the actual expected input/output/cache/reasoning/tool quantities and current applicable rates, with a range where uncertain. Label it estimated. For subscriptions, report the known quota/usage trade-off without converting benchmark dollars into included-account charges. Unknown cost cannot satisfy a hard monetary ceiling. Prefer bounded trials only when the caller authorizes the synthetic task, model, budget, deadline and supervision; never rerun an entire benchmark by default.

Propose an **upgrade** when the requested output or observed failure exceeds the current setup's supported capabilities and the expected benefit justifies the additional cost/latency. Propose a **downgrade** when a cheaper feasible setup has enough evidence to meet the same acceptance criteria. Preserve an explicit user model/effort until they accept a change; never silently switch provider, billing route, credits or model. If no model was selected, choose within existing authorization and disclose the choice. Do not claim this skill can change the parent conversation's model.

## One source, provider-specific execution

The canonical matrix is [selection.md](references/selection.md); state and freshness policy live beside it. Read the [shared run contract](references/run-contract.md) before dispatching through a provider skill. The selector recommends; each provider skill owns its exact flags, permissions and output parser. An uninstalled or unverified route is not executable merely because its benchmark score is high.

Changes belong to `headless-update-models`. Do not hand-edit bundled copies or claim an update from a source check alone.

Read [family validation](references/validation.md) for the tested routes and remaining boundaries.

## Finish

Return the selected setup, one useful up/down alternative when justified, cost/quality trade-off, evidence dates, checked providers and runtimes, unresolved gaps and local availability. Name unsupported task families or missing cost data that could change the decision. Avoid presenting the whole catalog unless requested.

**Self-improvement.** Propose a repair only when a concrete recurring or blocking weakness appears. Otherwise remain silent. Never auto-apply. No sibling skill is required.

For current account quota and reset times, use headless-usage. It attempts live reads independently of model-map freshness and labels unavailable or cached provider data explicitly.
