---
name: headless-update-models
description: >
  Refresh provider models, effort, cost and benchmark evidence across all supported
  headless skills. Use /headless-update-models or "update headless models".
  For read-only selection use headless-models.
disable-model-invocation: true
visibility: public
triggers:
  - "/headless-update-models"
  - "update headless models"
  - "refresh all headless model guidance"
next-skills: []
self-improvable: true
---

# /headless-update-models

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Refresh one canonical provider-wide dataset, update affected guidance, and verify its projections into every supported headless consumer. This skill updates documentation on explicit request. It does not upgrade CLIs, change runtime defaults, credentials, billing or permissions, buy credits, schedule work, publish, or launch benchmark inference.

**Structured execution spec:** [protocol.yon](protocol.yon). Keep it and this execution-sufficient document synchronized.

1. Resolve the canonical source repository and read headless-models plus its current matrix, state, freshness policy and shared run contract. Discover headless consumers and their actual installed locations. Name the exact write cohort before editing. Do not write through installed junctions. Check no-follow metadata and retain preimages outside the public repository. Missing canonical source permits a private evidence candidate only; report applying/installing as blocked and never overwrite an unrelated installed copy.
2. Read primary current provider capability/model/pricing documents and relevant benchmarks. Discover all providers in selected sources, including comparison-only providers without a local harness. Inspect supported local version/help/catalog commands without credentials or inference. Filter Codex catalog exactly to visibility=list. Keep exact model version, provider endpoint, effort, harness, task family, metric, uncertainty, sample count, latency and cost basis separate. See [refresh.md](references/refresh.md).
3. Use the bounded DeepSWE fetcher only after verifying that its endpoint is still the current official version. It creates a private candidate, not recommendations. Compare displayed prices and changelog against raw data; known conflicts require reconciliation or unknown cost. Never transfer a coding score to writing, research or media. Current API rates and estimated workload quantities are required for actual dollar estimates; subscription quota is separate. Missing costs cannot satisfy a hard ceiling.
4. Update the canonical selection reference under headless-models with dated evidence and useful recommended/lower/higher choices. Preserve explicit caller selections and all provider permission/supervision rules. Correct contradictory model paragraphs and their paired protocols; do not broadly rewrite unrelated skills. New providers may enter the comparison matrix without gaining a verified execution route.
5. Update each source's state separately: record the actual attempt time and outcome; advance lastVerifiedAt only after that source was successfully checked, even when its content did not change. Keep sourcePublishedAt unchanged unless publication changed. Failed/partial checks retain the old successful timestamp and record gaps; never stamp the entire family fresh after partial success. Use UTC ISO timestamps; historical date-only evidence is conservatively normalized to midnight with timestampPrecision=day. The reminder interval comes from policy.reminderDays, not repeated constants.
6. Run the projector in check, apply, then check mode. It distributes the matrix, state, freshness policy/checker and shared run contract to every registered consumer. Its model-guidance cohort is headless-codex, headless-claude, headless-gemini and headless-grok plus the updater's own copy. The shared file-backed runner and fixed dispatcher, with their references, are projected to the four provider skills. Their canonical copies are maintained under headless-models. The access reference/checker also reach headless-usage, which does not consume model freshness projections. Discover any additional headless execution skills and report them unprojected until their exact targets are added to the reviewed projector. Adding a target is authorized by an explicit family-wide update only after verifying it belongs to this repository and contract.
7. Check changed protocols, links, generator output and projection hashes. Inspect actual runtime targets and bytes before claiming installation currency. Refresh established copied/plugin installations included in the family update through their verified installer flow, retaining preimages; source parity alone is insufficient. See [installation.md](references/installation.md). Creating a new runtime installation still requires a separate request. New skill discovery may require a fresh session.
8. Return changed recommendations, evidence dates, sources checked/failed, providers covered, source/installed parity, unresolved costs/capabilities and next reminder status. On failure preserve backups, report completed and pending targets and stop; do not silently roll back concurrent changes or mark the cohort complete.

The outer parent may invoke this skill after a freshness offer is accepted. An explicit update request already grants this scoped update, so do not ask again. Noninteractive children report freshness to their parent and do not recursively refresh. Selection lives in headless-models.

**Self-improvement.** Propose a concrete repair only for a recurring or blocking weakness. Otherwise remain silent; never auto-apply.

The maintained installation family also includes headless-usage. Refresh its provider capability references when affected, preserving actual research dates and testing changed readers without inference. Live quota values are never catalog evidence; headless-usage does not consume the model-map projections or inherit their reminder gate.
