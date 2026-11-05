# Write PR evidence

Draft a pull request description whose claims match the selected candidate and available evidence. Drafting does not publish anything.

## Prepare

Required skill install set: none. Read this recipe directly. You need the actual selected change, intended behavior, repository PR template/contribution requirements and available check artifacts. Missing intent or ambiguous candidate scope needs clarification; missing evidence stays a named gap.

Read the selected working tree, staged comparison, committed range or supplied patch. Include selected untracked files. Do not assume HEAD contains uncommitted changes or make a commit to simplify capture. Preserve unrelated edits. The repository template wins; without one, use the smallest useful description.

A file recap can supplement the description; counts are not behavior proof. The optional [diff-recap guide](../skills/diff-recap.md) describes that narrower job and is not required here.

## Explain and support

Describe the concrete trigger and before/after behavior, then implementation shape only where it helps review. Tie each consequential claim to its actual basis:

- Executed checks support only the behavior and conditions exercised.
- Screenshots support visible appearance in the captured state.
- Manual observations retain their inputs, environment and limitations.
- File totals describe size; review scores and approvals are not tests.

Name the candidate and check state. Later relevant edits invalidate affected earlier evidence; rerun within authorization or label it stale. Do not fabricate command output, screenshots or a historical before-run. Prior behavior inferred from code or reported by an issue must keep that basis.

State affected users/surfaces, external effects and rollback limits. A code revert may leave migrated rows, messages or external configuration unchanged. Describe those residual effects rather than saying only “reversible.” Keep unknown rollout/rollback behavior explicit.

A compact original visual is optional when it clarifies the change. Fit the existing template without adding a mandatory section system. Preserve required legal lines; add no authorship byline or generated-by notice.

## Return and boundaries

Return a complete draft, claim-to-evidence mapping where useful, missing coverage and material effects. An already-clear request needs no interview. For a purely mechanical file recap, use that narrower operation; for independent correctness review, this draft is insufficient.

Do not run new checks, save files, stage, commit, push, open/update a PR or send messages by implication. Requested saving uses authorized destinations, no-follow target/ancestor checks, current-content protection and preservation of user edits. Redact secrets and unnecessary sensitive data before including artifacts. No subagent step is prescribed.

## Example and request

Illustrative wording, not an executed result: “An invalid optional filter previously rejected the whole search; it now identifies that filter's error while preserving valid criteria. The mixed-filter check passed on the selected working tree. No historical before-run is available. No data migration or external action is included.”

Use that check sentence only when the actual run supports it; otherwise say it was not run.

Request: “Draft PR evidence for this exact candidate using our template. Tie claims to actual checks, label missing/stale evidence, state effects surviving a code revert and do not publish.”

Flow: bind candidate/template -> explain behavior -> reconcile evidence -> describe effects/rollback -> return draft.

[Workflow recipes](README.md) · [Skill guides](../README.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
