# Refresh the map without changing runtime settings

The canonical editorial source is the selection reference in the sibling headless-models source directory. The supported consumer references are projections of it; never maintain their numbers independently. Find the repository from current metadata or the caller's path, not from an assumed home directory. Installed junctions are discovery surfaces, not write paths.

## Evidence refresh

Read the current official [DeepSWE board](https://deepswe.datacurve.ai/) and [changelog](https://deepswe.datacurve.ai/changelog) first. Confirm the benchmark version and the structured endpoint linked by the page. The bundled fetcher currently targets the observed v1.1 endpoint; a newly published version requires a reviewed fetcher change, never a silent version mix.

```text
node <skill-dir>/scripts/fetch-deepswe.mjs <absolute-new-private-candidate-directory>
```

The [fetcher](../scripts/fetch-deepswe.mjs) fetches public benchmark evidence with a finite network timeout and no inference. It never rewrites canonical guidance. Review candidate metrics and methodology, then reconcile price changes against the displayed board and current provider sources. The raw cost field is not automatically current. Do not ingest task prompts, solutions or benchmark fixtures into the skills.

Probe local catalogs separately: `codex --version` and `codex debug models`; `agy --version` and `agy models`; `grok --version`, `grok --help` and `grok models`; Claude version/help and provider-specific model documentation. Use only exposed models. Do not dump Codex's full catalog, which includes large embedded instructions; extract slugs, visibility and supported efforts. Preserve account availability as unknown when it cannot be established without a paid or permission-changing call.

For every changed recommendation, retain the exact compared model/effort/harness, date, relevant task family, quality uncertainty, cost basis, local feasibility and reason to change. The matrix supports nine provider families in its seed, but adding relevant providers is expected. Non-coding tasks need their own primary evaluations before receiving measured quality claims.

## Apply an authorized update

Before edits, name the canonical selection reference, any contradicted model/effort paragraphs and protocols in consumers, and repository-generated catalogs that need refresh. Keep preimages of existing source files outside the public pack. Update only that scope.

After editing canonical `selection.md`, run the [projector](../scripts/project.mjs):

```text
node <skill-dir>/scripts/project.mjs <absolute-source-repository> --check
node <skill-dir>/scripts/project.mjs <absolute-source-repository> --apply <absolute-new-private-backup-directory>
node <skill-dir>/scripts/project.mjs <absolute-source-repository> --check
```

The projector distributes five model-guidance assets (matrix, state, freshness policy, run contract and local freshness checker) to headless-codex, headless-claude, headless-gemini, headless-grok and this updater. Two access assets (access reference and local discovery checker) also reach those five consumers plus headless-usage. Four process assets reach the four execution adapters: 41 projected files in total. Usage remains independent of model-map freshness. Existing targets must carry the projection marker. The script checks path chains and preimages, keeps backups, uses atomic per-file replacements, and stops on the first failure. A cohort update is not one atomic transaction; inspect its completion report and backups on failure. Do not delete recovery evidence or silently roll back concurrent work.

Then run the source repository's structural lint, validate changed YON protocols, and use its catalog generators only when required. Check every installed consumer by target and file hash. Update copied/package installations only through their approved installer flow; a successful source projection is not an installed-state claim.

## Selection output

Use one recommendation and only decision-relevant alternatives:

| Setup | Fit and quality evidence | Cost/quota basis | Latency | Trade-off |
| --- | --- | --- | --- | --- |
| Recommended provider/model/effort/harness | Relevant measured result or labeled inference | Current rate/estimate or unknown | Measured/estimated | Why it meets the artifact's acceptance checks |
| Lower setup, if useful | What remains adequate | Expected saving and uncertainty | Expected change | What would make it insufficient |
| Higher setup, if useful | Expected benefit and evidence | Additional cost/quota and uncertainty | Expected change | When the improvement justifies it |

When the caller already selected a model, phrase a change as a proposal and keep the selected model until accepted. When no choice was made, use existing task authorization, disclose the setup, and preserve all harness permission rules.
