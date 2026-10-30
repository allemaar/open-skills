# Data lifecycle and reading temperature

Load when the selected recipe handles accumulated data, summaries or history. Return the scoped policy and retrieval/recovery limits to that recipe. This pattern controls selection for reading; it does not grant movement or deletion authority.

## Temperature

Choose a subject-level policy and only useful exceptions. Use existing prose, a map or state metadata; no per-file schema or tier directory is mandatory.

| Tier | Reading behavior |
|---|---|
| Hot | Relevant current working context for the active subject |
| Warm | Indexed or linked material, loaded on demand |
| Cold | Outside routine loading, available for an explicit task or necessary evidence check |

Adaptive placement can follow observed use, cost and task relevance. Always-hot, always-warm and always-cold pin the declared policy until an authorized change; a one-off read does not change it. Pins are scoped: a child's hot material does not preload under every ancestor. Resolve contradictory pins explicitly. No temperature rule can hide a mandatory relevant safeguard or override access/privacy boundaries.

Recency and reading frequency do not establish truth or authority. Keep temperature separate from current/archived state, ownership, privacy and retention. An old active constraint can remain important; a recent summary can be incomplete.

## Summaries, archives and recovery

A rollup names its source links, inclusion/exclusion rule, as-of coverage and unresolved material. It does not silently replace the originals. Before relying on it, show coverage or freshness uncertainty. When retrieved evidence contradicts it, resolve under the declared authority or flag the conflict; do not quietly promote the summary or discard the correction. Unread changes cannot be claimed detected.

Archive selected non-current material only through its owner and authorization. Preserve a finding aid from current navigation, visible archive/supersession context and exact retrieval links. Verify retrieval after a move; ambiguous or unavailable material remains a gap. Use declared lifecycle evidence, not a folder name or age, to claim currentness.

Deletion is a separate retention decision with exact targets and recovery requirements. Neither a completed rollup, reduced reading load, a cold label nor a successful test authorizes it. Failed-case and partial-update evidence stays until disposition is resolved.

[load.complete] skill-smith.pattern.data-lifecycle
