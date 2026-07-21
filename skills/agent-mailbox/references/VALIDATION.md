# Agent Mailbox validation record

This record separates measured transport evidence from design-only coverage. It is not a claim that every provider or runtime has been tested.

## Measured dual-runtime evidence — 2026-07-21

| Test | Detector | Evidence | Verdict |
|---|---|---|---|
| A · Claude local | FABLE exact-folder watcher | SOL local ping detected within 2 seconds of visibility as reported by FABLE; no precise rename timestamp was available | Pass, latency approximate |
| B · Claude Git-only | FABLE pinned `4f0901b2…8bc1`; `git fetch` plus exact range | carrying commit `d7437f07…1ba7`; path `TARS/inbox/2026-07-21-03-32-38-SOL-test-git-ping.md`; 9.2 seconds push-to-detection; 0 false detections/failures | Pass |
| C1 · Codex local | `System.IO.FileSystemWatcher` exact inbox, both `Created` and `Renamed` | rename initiated `00:47:43.218Z`; `Created` detected `00:47:43.2975093Z`; 79.5 ms; envelope and same-locus valid; 0 false detections; file was not yet indexed/synced | Pass |
| C2 · Codex Git-only | pinned `37fede85…91d2`; scoped Lyt sync plus exact Git range; local events disabled | carrying commit `3787c002…87b3`; commit timestamp `00:51:36Z`; detection `00:51:43.8720522Z`; ≤7.9 seconds from commit timestamp; exact FABLE path extracted; envelope valid; 0 false detections | Pass |

## Defects found by dogfood

1. A watcher subscribed only to `Created` missed messages published by rename. The contract now requires both `Created` and `Renamed` plus startup reconciliation.
2. Staging a `.md.tmp` beside the inbox allowed a concurrent Lyt sync to commit the temporary file before rename. The contract now requires transport-excluded staging on the same filesystem, preferably OS-local temp on the mailbox volume. Index/sync only the final inbox file.
3. Concurrent Lyt operations produced transient `SQLITE_BUSY` index warnings. The bounded failure budget and structured sync result handled them: message transport still reached a successful pushed/clean state. A nonfatal index warning must not be confused with delivery failure, but repeated failures still exhaust the declared budget.

## Mechanical gates on the settled draft

- public YON parser, exec profile: valid;
- semantic YON DAG: 0 errors, 0 warnings;
- repository skill lint: 0 errors, 0 warnings;
- full repository conformance before final generation: 39/39 protocols valid; rerun after removing the superseded independent draft and regenerating the spine.

## Design-validated, field-test pending

- OneDrive, Google Drive, Dropbox, SMB/network-share delivery and conflict-copy behavior;
- cross-machine Relay composition in this skill layer;
- simultaneous empty-arena bootstrap and deterministic primer winner;
- generated-name collision, expired-name reclaim, declared succession, and late sync-share claim yield;
- FULL group claims, votes, goodbye, exchange-budget freeze, and closed-thread archival.

These gaps remain explicit until a real provider/runtime scenario supplies consumed-artifact evidence. Do not advertise them as empirically proven.
