# Changelog — open-skills

All notable changes to this skill pack will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

**SemVer for a skill pack.** **MAJOR** = a skill removed or renamed, or a breaking
trigger/interface change. **MINOR** = a new skill or skill family. **PATCH** = fixes, docs,
or guard changes that neither add nor remove a skill.

---

## [Unreleased]

### Added

- **`agent-mailbox` now exposes a layered, lazy operating model without making its working base protocol conditional.** CORE and FULL still establish the collaboration. After establishment, a Handler can select a bounded Collab Window (Work-or-Listen), native Scheduled Collab when the host can prove a bounded scheduler, or ordinary Standard Exchange; a reported miss or cursor inconsistency trigger-loads the recovery overlay. Optional capability failure falls back to `PARKED` or `DEGRADED` and leaves the base thread usable. New operating-mode, connection, and field guides keep the choice small and make transport, detection, task wake, re-arm, cancellation, and cleanup separate claims.

### Changed

- **Agent Mailbox handling evidence is now disposition-first.** Every valid addressed message is a call to action recorded as append-only transitions with one current effective state, including explicit `no-reply-required`, pending Handler decisions, post-refusal scope rejection, deferment, and historical-debt states. Participant-local state stays outside mailbox and provider-synchronized roots by default, while the shared primer uses only opaque or root-relative topology. The consumed-UUID cursor is a compact checkpoint/index rather than sole proof of consumption. Recovery distinguishes terminal, transitional, and quarantined states; it can reconstruct exact local causal outcomes or independently verified prior effects without repeating them, while ambiguous or unavailable history degrades readiness instead of being executed again.
- **Public transport claims and validation are capability-specific and sanitized.** Local folders, Git, free Lyt vaults, and sync-share folders such as OneDrive remain first-class routes with no mailbox server, daemon, database, or SDK. OneDrive materialization evidence is kept distinct from listener lifecycle and autonomous wake, which remain host-runtime concerns. Public examples and validation omit private participants, paths, operational identifiers, exact private timestamps/hashes, raw logs, and task content.

### Fixed

- **Agent Mailbox sync-share path validation now admits only the Handler-selected Microsoft Cloud Files placeholder family when canonical containment still holds.** Unknown reparse tags, name surrogates, traversal, overwrite, and other escaping paths remain fail-closed; accepting a cloud placeholder is not evidence of delivery, detection, consumption, or wake.

## [1.6.1] — 2026-07-21

### Fixed

- **Removed an unsatisfiable rule pair introduced late in `1.6.0`.** A last-minute amendment added `rule:atomic-capability`, requiring a runtime with no rename primitive to declare reduced publication atomicity — while `rule:atomic-publish` still required staged atomic rename unconditionally. A runtime lacking that primitive could satisfy neither, so the amendment created an impossible obligation rather than the usable fallback it claimed. It is withdrawn from both documents; `rule:atomic-publish` and its fail-closed path stand unchanged. The underlying limitation — that some harnesses expose no primitive able to rename a staged file into place — is real and is recorded as known work rather than answered by a contradictory rule.

## [1.6.0] — 2026-07-21

### Added

- **`agent-mailbox` gains the contracts that make an unattended exchange survivable — every one of them written from a failure that actually happened, not from a design session.** Four sub-agents ran the CORE handshake blind and four more ran FULL with two agents deliberately competing for the same artifact; the exchanges surfaced defects no amount of re-reading had. **Establishment now separates delivery from consent:** two messages establish a CORE thread *only* when the `welcome` amends nothing, and any material counter holds the thread `establishing` until the initiator causally accepts it — because a `welcome` that counters proves the bytes crossed and proves nothing about agreement. Materiality is decided by effect, not by label: a change to what a participant may, must, or must not do is material even when it presents itself as a clarification, and an unclear difference counts as material. A counter touching a term the agent has no authority to trade transitions to **`blocked: handler-decision`** with one causal message naming the disputed term and the exact decision required, rather than stalling a thread forever while both sides behave correctly. **Listening is rebuilt around a consumed-UUID cursor:** a listener's start time, a directory listing and a filename order are not records of consumption, and treating them as one produced three distinct disappearing-message bugs that each looked like a different defect. Arming order is fixed — load cursor, arm channels, reconcile the whole inbox age-independently, *then* declare readiness — and readiness must carry evidence rather than assert itself, since a false "armed" is indistinguishable from a true one. A message stays unconsumed until both the causal response and the primer write are durable, and recovery matches already-published responses by exact `reply_to` plus `request_id` so a crash cannot become two answers to one question. Outbound preflight validates the complete canonical envelope before publication and **fails closed** where no parser exists: the model that wrote a malformed envelope is not a reliable judge of it, which argues for refusing to publish rather than publishing with a caveat.

### Fixed

- **`install.mjs` could be redirected by a junction, and could delete through one.** Two gaps, both on the hazard this pack names as its own worst case. On a **fresh install** the parent chain was never checked: a junction at a runtime skills directory would silently redirect the copy outside it. Under **`--force`** the existing checks proved the delete *root* was real but never enumerated reparse points **nested inside** the tree, so a junction one level down was traversed by the recursive removal. Both are now guarded before the write and before the delete, with a `realpath` comparison as the version-robust backstop, and both refuse rather than follow. Verified against real Windows junctions created with `mklink /J` — including the two controls that matter, since a guard which refuses a legitimate install is a broken installer rather than a safe one, and a sentinel file outside the delete root that survived the run.

### Changed

- **Creator-first provenance across the pack.** 100 `@STAMP` records over 52 files now name **Alexandru Mares | allemaar.com** as the source. `method` is untouched byte-for-byte — 51 `generated`, 37 `manual`, 2 `merged`, 1 `str` — because `src` answers *whose work this is* and `method` answers *how the bytes were produced*, and collapsing them would trade a true statement for a flattering one. The tag registry now states that contract explicitly, along with the rule that multiple stamps are ordered provenance records read within their declared `scope`, where recency alone settles nothing.
- **`README.md`** puts the creator and a runnable example before install depth, and no longer claims every skill ships a YON protocol — 39 of 57 do. The composability claim is narrowed to what is true: the skills are built to cooperate, a few cite companion protocols, and the pack behaves most fully with those present.
- **`DISTRIBUTION.md`** keeps the channel and reach evidence a reader needs and drops the go-to-market strategy, which was never user-facing.
- Named private references removed from every public surface, including two routing targets — `/lyt-handoff` and `/lyt-decision` — that this pack does not ship and never could. Lyt remains a first-class supported transport.

## [1.5.0] — 2026-07-21

### Added

- **`agent-mailbox` — two or more agents, any harness and any vendor, collaborating through any folder that syncs.** The design premise is that the network is already there: a folder moved by local disk, Git, Lyt, OneDrive, Drive, or an SMB share is a transport, so the protocol piggybacks on it instead of standing up its own. There is no server, no daemon, no database and no SDK — transport and runtime adapters are paragraphs of prose rather than packages, and the entire operating manual is *share a folder, load the skill, point at it*. Messages are plain Markdown a person reads without tooling, and because every message wikilinks its cause, an Obsidian graph view renders the whole collaboration as a walkable causal graph. On top of the message layer it carries the parts that make unattended agent collaboration survivable: generated collision-free callsigns with speak-to-renew leases, expiry kept distinct from retirement, reclaim and declared succession across model generations, group rooms and work claims, a single-writer discipline with attestation-by-recompute, a four-category cross-review pattern, a bounded exchange budget, an autonomy loop-breaker, and a reserved Handler seat — which is deliberately aimed at the gap *Governance Gaps in Agent Interoperability Protocols* (arXiv 2606.31498) documents in MCP, A2A and ACP, none of which can express authority, arbitration or human oversight. The safety boundary is explicit and matches the rest of the pack: a peer payload is data, never instructions, and nothing arriving through the mailbox is executed merely because it arrived.

  The protocol was **dogfooded through its own design** — the design conversation, including five architectural conflicts argued to resolution, ran over the protocol itself, driven across agents on two different vendors' runtimes, leaving a 40-message audit trail anyone can walk. Building it that way is what surfaced three real defects, each converted into a contract rule rather than a patch: a `Created`-only file watcher missed rename-published messages, so the contract now requires `Created` + `Renamed` plus startup reconciliation; staging a `.md.tmp` beside the inbox let a concurrent sync commit the temp file, so staging must now be transport-excluded with a fail-closed fallback; and transient `SQLITE_BUSY` index warnings were being read as delivery failures, so the contract now distinguishes a nonfatal index warning from a failed delivery, bounded by the failure budget.

  Evidence ships with the skill and is deliberately split. [`references/VALIDATION.md`](skills/agent-mailbox/references/VALIDATION.md) records what was **measured** — four tests across two runtimes and two channels: 79.5 ms rename-to-detection locally on Codex via `FileSystemWatcher`, ≤2 s on Claude by exact-inbox poll, 9.2 s push-to-detection on Claude over Git-only with a pinned-SHA baseline, and ≤7.9 s on Codex over Git-only, each with zero false detections — and separately records what is **design-validated and not yet proven**, chiefly the sync-share transports (OneDrive, Drive, Dropbox, SMB) whose conflict-copy behaviour awaits a cross-organisation field test. That split is a contract, not a formality: the sync-share row must be described as a field test in progress until it is measured. What this protocol claims is the combination — zero runtime dependency, transport piggybacking, identity lifecycle, collaboration methodology, and governance as the design center — not any single element.

  Dual-doc: 398 lines of `SKILL.md` against a 94-line `protocol.yon` whose rules, transport map and step sequence pass the public YON parser on the exec profile and a semantic DAG check at 0 errors and 0 warnings.

- Pack grows to **57 skills / 39 with a `protocol.yon`** (18 Markdown-only).

### Fixed

- **`verify` declared `self-improvable: true` while its `protocol.yon` carried no `step:sip`, so the Self-Improvement Protocol never ran for the pack's own verification gate.** Both documents said to run it — the frontmatter flag and the `SKILL.md` footer — and only the execution spec disagreed, which is the precise shape of drift the dual-doc contract exists to prevent. `verify` was the sole skill in the pack with a `protocol.yon` in that state; the other 37 declaring the flag all carry the step. Added the missing `@SEC name="Self-improvement"` block with `step:sip` at the pack's dominant `n:int=100`, and refreshed both `@STAMP` dates, which were identical and stale.

## [1.4.0] — 2026-07-19

### Added

- **`domain-check` — a precedence policy for domain availability, because the layer everyone queries is the layer that lies.** A GoDaddy-backed availability tool reported seven names as available that were all registered and parked on broker nameservers (`afternic.com`, `namefind.com`, `domainmarket.com`); `rdap.verisign.com` returned HTTP 200 for one of them while a genuinely free name and a control both returned 404. The registrar layer was wrong and RDAP and DNS were both right, so the fix is not another lookup client — mature keyless servers already do RDAP with WHOIS fallback, and a DNS-then-RDAP hybrid ships too. What none of them carry is aftermarket detection and a written precedence order, so that is the whole skill: RDAP through the IANA bootstrap is authoritative (never a hardcoded registry URL — a misroute returns 404 for the wrong reason, and a wrong-reason 404 reads as availability), DNS from two resolvers corroborates, a broker nameserver match overrides any registrar "available", and the registrar is consulted for price context only. The failure modes are named rather than assumed away: an RDAP 404 is *probably registrable*, not purchasable, because reserved strings, sunrise restrictions and registry-premium pricing still block it; redemption and pending-delete look taken and are also not yours; a registered domain with no delegated nameservers looks empty to DNS, which is why DNS never outranks RDAP; roughly 189 country-code top-level domains have no RDAP at all and fall back to parse-fragile WHOIS; and RFC 2308 negative caching can keep an NXDOMAIN alive past a real registration. The likely cause of the original false positives — GoDaddy's `checkType` defaulting to `FAST` over `FULL` — is carried as an evidence-backed hypothesis and a `MUST_NOT` forbids stating it as the diagnosis. Bulk sweeps run serially against the registry-direct endpoint with backoff, because WHOIS bans are punitive and inheritable on a shared address. Dual-doc; the skill reports a verdict, the sources that agreed, and the residual uncertainty, and it never registers anything.

- Pack grows to **56 skills / 38 with a `protocol.yon`** (18 Markdown-only).

### Changed

- **`cold-review` briefs now supply primary-source pointers instead of a curated evidence set.** The reviewer template opened with "review only the supplied artifacts" above a lead-filled `Artifacts/evidence to inspect:` line, so the agent whose bias the review exists to correct was choosing which artifacts existed for every reviewer. Fresh context and one-lens-each decorrelate reviewers from each other; neither decorrelates them from the lead's reading of the work, and reviewers confined to that list can only audit the selection they were given. The brief now names where the sources are, states that the list is a starting point rather than a boundary, and requires each reviewer to open them. Reachability is the operative property: an unreachable source is where checking actually fails, so the fix is to make the source reachable rather than to add another instruction about diligence. `rule:narrow-evidence-brief` updated to match; the conclusions-are-not-ground-truth and claims-as-questions clauses are unchanged.

---

## [1.3.1] — 2026-07-19

### Changed

- **The human-output contract now reaches every skill that writes for a person — 36 of 55.** It shipped governing six. The footer cites the contract rather than restating it, so there is one rulebook and no drift between copies. Nineteen skills are deliberately excluded and the exclusion is the point rather than an oversight: the four `orient-*` and `diff-recap` carry their own machine-checked render and value contracts; `skills-help`, `next-skills` and `caller-options` have a choice set as their deliverable, which the contract exempts by name; and `yon-*`, `obsidian-*`, `json-canvas`, `defuddle` and the `prime-*` family have no human reader to serve.

- **`human-spec/` is machine-checked instead of documentation.** It holds the family roster, the routing table and the contract; every member defers to it as the authority; and no tool read it. `orient-spec/` is read live by `orient-validate.mjs` so the schema and the code cannot drift apart — `human-spec/` had no equivalent, which is how `human-merge` shipped and was released while three siblings and the routing table all still said "not yet shipped". Two checks now run in `consistency-guard`, both proven by `gate-fires` (23 → 28 scenarios) and by hand-tamper. **ROSTER** reads the routing table live and compares it to `skills/human-*/` in both directions: a phantom member fails, and so does a shipped member the table never names. **FOOTER** requires the verbatim blockquote in any skill citing the contract. As first written that check was self-nullifying — for 32 of the 36 carriers the footer is the only place the contract is named, so deleting it deletes the trigger and the check passes silently; it is now gated on a declared coverage number the spec states and the guard recomputes.

- **The README carries the family.** The 1.3.0 release shipped four skills the front page never mentioned — counts updated, family invisible. Adds a section matching the `orient-` precedent, links `human-spec/` alongside `orient-spec/`, and puts the family in the browse line.

---

## [1.3.0] — 2026-07-19

### Added

- **A `human-*` family: the contract for output a person actually reads.** Four Markdown-only skills. `human-output` is the contract itself — five policeable rules (verdict first, including anything that would reverse it; say what it costs, not what it is; label every claim confirmed/judgement/estimate; say what you did not check; no shorthand the reader must decode) over a craft layer of defaults, on the principle that a contract with twenty rules is a contract with none. `human-rewrite` is the repair pass on text that already exists, narrowed to what only exists because there is a source: fidelity guarantees, foreign-input handling, inventory-then-reconcile. `human-draw` decides whether the material wants a picture and builds it, defaulting to DRAW and downgrading to a simpler shape rather than refusing — a refusal hands a text-fatigued reader back the wall of text that caused the problem. Figures are printable ASCII only (`0x20–0x7E`): box-drawing and block glyphs are East Asian *Ambiguous* and render double-width under some locales, shearing every column below. `human-merge` owns the pass across *many* reports, which is the case the other three each refuse: it collapses reports sharing an upstream source into the single source they are, names what is superseded and whether a live decision rests on the dead figure, classifies conflicts instead of averaging them away, and pools coverage so a gap no single report had becomes visible. `human-rewrite` reads nothing beyond the one text it was handed, so the pile now routes here rather than being merged by reflex.

- **`tools/human-output-check.mjs`** — the mechanical half of the contract, since a rule with no gate drifts silently while everything else stays green. Checks acronym expansion at first use, one marked recommendation, sentence length, ASCII inside fences, and figure arithmetic. Rules 1, 3 and 4 are judgement and the file says so rather than pretending to grade them. Self-tests with `--self-test`.

- **The eight loudest skills now cite the contract** rather than restating it, each gaining a `human-*` next-skills edge: `insight-retro`, `cold-review`, `insight-cross-examine`, `plan-create`, `improve-codebase-architecture`, `investigate`, `extract-signal`, and `insight-adversarial` — each chosen for a long or decision-bearing mandated report template.

### Fixed

- **The `orient-*` skills printed a YON record at a human, and the rule that caused it is now gated.** All four carried an unconditional `MUST emit a record conformant to orient-record.yon` two lines above a *consumer-conditional* visual rule. Facing one unconditional MUST and one conditional one, an emitter obeys the unconditional one — so the machine face reached the person, contradicting `orient-contract.md` §1 ("No raw record fields or node-ids surfaced to the human") and `family-behaviors.md` §6. The MUST is now conditioned on `handler_type = agent`, a companion MUST NOT forbids any record field, node-id, gate enum, `@CFG` or `@MAP` line in a human reply, and the "Record emission" headings and step 6 emission instructions name the consumer explicitly. Mirrored into each `protocol.yon` (`rule:render-face`, `step:emit`). Nothing about the record, the schema, or the widget kit changed — only who receives which face.

### Changed

- **The four `orient-*` descriptions lead with the question they answer**, and each `SKILL.md` opens with a four-line card stating what it answers, what it does not (naming the sibling that does), and what it owns for the family. Sections 2–8 were near-identical boilerplate across the four, so the ~10% that differed was buried behind a shared preamble and a reader comparing two files saw the same document twice.

- Pack grows to **55 skills / 37 with a `protocol.yon`** (18 Markdown-only).

---

## [1.2.1] — 2026-07-18

### Changed

- **Every `gate-fires` rejection is now proven by its message, not just a non-zero exit.** The `mustSay` assertion — added so a crash (a missing fixture, a broken import) cannot score as "the gate fired" while grading nothing — covered only the three newest guards. The eight older reject scenarios (the YON parser, `yon-dag`'s two dataflow checks, and the orient and diff-recap value gates) judged on exit code alone, so a file-not-found would have passed as a rejection. Each now pins the guard's actual rejection wording, captured by running it. Verified by tampering: pointing a scenario at a missing fixture now reports `PROOF BROKEN`.

- **Cold-review cleanup: the last private-skill references the scrub missed, and three guards tightened to match their prose.** A multi-POV review found references the earlier commits did not reach — `skills-help`'s Boundary line pointed at a private-only skill (below the menu guard's window) and `new-skill-creator`'s `CRITERION.md` still used private-only skills as examples — both now use skills that ship. The DCO guard no longer rejects a valid sign-off whose email host has no dot (git's own default `user@hostname`); the menu-roster guard now catches a marker-less phantom entry, not only marked ones; and `tools/lint.mjs`'s header now documents its bare-name and anchored-ref limits alongside GAP 3. A stale `## [Unreleased]` line that a later commit had already falsified was removed.

- **The `skills-help` menu lists the skills this pack actually ships, and a guard keeps it that way.** Exported from a larger private library, the public menu advertised ~18 skills a reader could never have — several private-only skill families — while omitting six that do ship (`budget-check`, `diff-recap`, and the four `orient-*`). The snapshot is now curated to the 51 public skills, and `tools/consistency-guard.mjs` fails the build if the menu ever again names a skill with no directory — a gate-fires scenario proves it rejects a phantom entry and accepts the real menu. The reverse case, a shipped skill not yet in the menu, stays with the skill's own render-time self-heal by design.

- **`tools/lint.mjs` now sees the reference class it was built to catch.** It was written after a review found ~16 references to files that don't exist here, yet two blind spots let exactly that class through: it never scanned the companion markdown under `skills/*/` (`references/`, `personas/`, `profiles/`, `examples/` — only each skill's `SKILL.md` and the 5 root docs), and its path check resolved only `tools/`- and `skills/`-shaped tokens, so a `docs/…` leftover was skipped. Both are closed: companions are scanned (tracked files, via `git ls-files`), and the check resolves repo-root dirs (including `docs/`, whose absence *is* the defect) and the pack's own `skill-name/SKILL.md` shorthand — targeted, not "any slash is a path", which floods on npm scopes and URLs. A gate-fires scenario proves it rejects a broken `docs/` ref and accepts a clean one. Known limit, documented in the header: a path inside a backticked shell command is still skipped.

- **The COP register and three skills stop citing skills the public pack does not ship.** The export dropped private files and skills but kept the pointers, so `caller-options`'s register cited `docs/nsp-cop-audit.md` and `MAYBE.md` — including a `MUST` to agree with a file no reader can open — and four skills named `skills-audit`, `paper-check`, and the old `yon-writer` (renamed to `yon-write` and never swept). The register now resolves a disagreement by the self-orchestrator exclusion test alone, which is self-contained; the dangling citations became plain statements of the verdict they cited; the renamed skill is corrected everywhere; the two absent skills are dropped from the boundary map and criterion examples. The substance — the exclusion test, the verdicts, the rename sweep — is unchanged.

- **README leads with the install, and the read-first path is labelled as the default.** Install now follows the pitch directly; the two-files-per-skill philosophy moved below it, after first value. The choice is stated as two paths — clone-and-copy (the default) and the plugin marketplace — each with its trade named once, rather than the page arguing the reader out of the faster one; the remaining fetchers moved into a subordinate *Other ways to fetch*, and the Vercel CLI's mode-selection behaviour is restated as the one composite condition [`DISTRIBUTION.md`](DISTRIBUTION.md) sources it to. *Start here* gains starter prompts you can type.
- **`install.mjs` no longer prints `Done` above a validation failure.** The failure is reported first: a run that copied something nobody could validate is not a success, and the word "Done" above it read as reassurance. The close message now says copies stay frozen until you re-copy them, and points at *README > Updating* for the diff command that makes a re-copy something you read first.

- **`new-skill-creator` says which side of the trust line it is on.** It shipped a `MUST` telling agents to symlink skills into all three runtimes — sound advice for an author, and the exact topology [`README.md`](README.md) and [`THREAT-MODEL.md`](THREAT-MODEL.md) argue against for anyone *installing* this pack. Nothing marked which case it was, so a public skill read as a hard rule contradicting the rest of the repo. It is now scoped, in the description, the body, the rules and `protocol.yon`, to what it always was: a maintainer's loop over a skills repo you own. The drift a link carries is not absent there, only accepted on README's terms. Installing skills you did not write is still a copy.

- **`new-skill-creator`'s rename checklist pointed at tooling this repo does not ship.** [`references/RENAME-CHECKLIST.md`](skills/new-skill-creator/references/RENAME-CHECKLIST.md) told you to run `python tools/lint_skills.py --check-symlinks`, and to sweep `VISIBILITY.md` and `docs/` — all three are the private library's, carried over on export and never re-pointed. The lint is `node tools/lint.mjs`, it takes no flags, and it does not check symlinks: nothing shipped here does, so the checklist now says the snapshot diff is what verifies them rather than naming a command that cannot run.

### Added

- **`tools/dco-guard.mjs` — the sign-off [`CONTRIBUTING.md`](CONTRIBUTING.md) already requires is now checked in CI.** The DCO was stated as a rule and run by nothing, so it drifted against our own history: 7 of the 29 non-merge commits between v1.1.0 and `075a7e5` carry no `Signed-off-by`. Checked, not prevented — `git commit -s` is still what stops an unsigned commit being written. It grades the trailer's shape, not that the name is real and not against the commit author: the DCO is a certification you make, not an identity we can authenticate. Trailers come from `git interpret-trailers`, not a scan of the message, so a commit that merely *quotes* a sign-off is rejected — that message is a fixture in [`GATE-FIRES.md`](GATE-FIRES.md). One layout still passes: a fenced sign-off that *is* the last paragraph, which git reads as a real trailer — a limit taken deliberately, and reasoned out in the guard. Forward-only from `075a7e5`: the 7 stay unsigned and uncertified, and no remediation commit has landed.

---

## [1.2.0] — 2026-07-17

### Added

- **Three new skills:**
  - **`budget-check`** — a fail-closed pre-wave usage gate. Wraps `ccusage blocks --json` into go / no-go / unknown against a 95% threshold, exiting 0/1/2 so a dispatch script can gate on it. It never emits a fabricated "go": a missing, non-numeric, or unreadable figure fails closed to `unknown`, and an inferred ceiling is labelled as what it is rather than passed off as a real budget.
  - **`diff-recap`** — turns a git diff into a PR-pasteable recap: one row per changed file, whose path, status, and line counts are transcribed verbatim from `git diff --numstat` (true by construction — the model writes only the labels), emitted as an inline annotated widget plus a mandatory ASCII twin. Ships `tools/diff-recap-check.mjs`, the value gate that holds the record to its arithmetic: the totals must equal the sum of the rows, and no row may hide.
  - **`orient-roadmap`** — the multi-horizon read, joining the `orient-` family over the same `orient-record` schema: the increment arc (built → current → next), what shipped, the gates, the next increment's clusters, and the runway of stage boxes, plus the deferred lanes.
- **Claude Code plugin marketplace** — `/plugin marketplace add allemaar/open-skills` then `/plugin install open-skills@open-skills` installs the pack and namespaces the skills (`/open-skills:cold-review`, …). Updates in place with `/plugin marketplace update open-skills`.
- **A visual face for the `orient-` family** — `orient-status`, `orient-map` and `orient-gaps` each render their record as an inline widget, with a **mandatory ASCII twin** so the read survives anywhere the widget doesn't, plus a family-wide "you are here" breadcrumb. The render face is a contract in `orient-spec/`, not per-skill decoration.
- **`install.mjs` now stamps provenance into the copy it makes.** The installed `SKILL.md` gains a `metadata:` block recording the repo, ref, and tree SHA it came from — the same keys `gh skill` writes, so `gh skill list` / `gh skill update --dry-run` work on copies this installer made (verified against gh v2.96.0). **This means the installed file is no longer byte-identical to the repo's.** When this clone can't honestly back the claim — no origin, detached HEAD, local edits, or unpushed commits — it records a plain `local-path` instead. `--no-stamp` copies byte-for-byte and records nothing.
- **[`DISTRIBUTION.md`](DISTRIBUTION.md)** — the distribution ledger: where the pack is published and how to get it, with the reach evidence for each channel. It also records the measurement cost it accepts: the read-first install paths are untelemetered by design, so any install count undercounts.
- **`insight-angles`** gains a Cartography/Representation lens family (17-family roster).
- Pack grows to **51 skills / 37 with a `protocol.yon`** (14 Markdown-only).

### Changed

- **`verify` and `cold-review` now re-check claims against source rather than trusting a report.** `verify` gained an active per-claim source re-check — an agent's self-report of having checked is not evidence, so the claim is re-derived from the artifact that actually ships (the committed blob, the built output, the served route), not the working tree. `cold-review` gained a self-verify pass over its own synthesis: evidence is re-opened, findings are posed as questions, and anything that doesn't survive a fresh read is dropped.
- **CI hardened** — `leak-guard` and `consistency-guard` join the workflow, alongside the orient **value gate** (`tools/orient-validate.mjs`), which enforces what the parser structurally cannot: enum membership, required fields, and the fail-closed cross-field gate, checked against the schema read live so the rules can't drift from it.
- **`handoff-execute`'s scope-expansion halt now fires less often.** `rule:no-scope-expansion` is a `MUST_NOT` that used to halt execution whenever it needed a source the brief did not list. It now halts only when the *agent itself* decides, on its own judgment, that it needs an unlisted source. A file the brief's own prose cites as an edit target, or a fact it names without saying where it lives, is read on demand and recorded in `@DELTA_FROM_BRIEF` rather than halted on.
- **`extract-signal`** is now model-invocable (it is read-only, so the invocation flag bought nothing).
- README leads with the plugin-marketplace install, states the "composable, not a framework" position, and surfaces the `orient-` family and its spec.

### Fixed

- **False and misleading statements on the install surface.** The runtime-dir table named the wrong runtimes for `~/.agents/skills` (Cursor, Copilot and OpenCode use their own dirs; Codex reads `.agents` as its current location, with `~/.codex/skills` still read for backward compatibility). The symlink recipe sold repo-tracking as a feature while warning only about deletes, never drift — and its POSIX `ln -s` line silently makes a *copy* under Git-Bash/MSYS. `install.mjs` copying into **every** runtime dir it finds was undocumented, as was `--runtime`. The Vercel CLI's symlink-by-default behaviour and its telemetry are now disclosed.
- **THREAT-MODEL step 5 had no procedure for the copy default** — the pack's own default. It prescribed reviewing a diff for symlinked skills, the one topology the same document rejects. It now gives the copy path a real command. The "Silent drift" bullet no longer frames symlinking as the norm.

---

## [1.1.0] — 2026-06-22

### Added

- **The `orient-` family** — orientation skills that compute a fresh, honest read of where work stands, over one shared, validatable confidence layer:
  - **`orient-status`** — quick "where are we": current position, what's left, and a banded ETA, computed fresh via a bounded read-only subagent. `--resume` rebuilds context after a gap (one next move + counter-case).
  - **`orient-map`** — delta-first "show me the shape": what changed since your last look, plus done → here → next as a path on the trunk or a **tree on a branch**.
  - **`orient-gaps`** — the stall surface: blockers, open forks, and loose ends; `--audit` adds the anti-Goodhart disclosure (signals inflated past their evidence).
  - **`orient-spec/`** — the shared `orient-record` schema (`schema_version = orient-record/1`) every orient- skill emits a slice of, plus `family-behaviors.md` (the shared footer + staleness short-circuit, neutral re-look signal, and handoff-feeder contract).
- Pack grows to **48 skills / 34 with a `protocol.yon`** (14 Markdown-only).

### Changed

- **CI hardened** — `tools/orient-roundtrip.mjs` is now wired into the conformance workflow (the orient-record worked example must survive a parse → format → parse round-trip on every push), joining the existing validation, lint, YON-DAG, spine-sync, and gate-fires checks.
- README "start here" + category list now surface the orientation skills; added this changelog.

## [1.0.0] — 2026-06-16

Initial public release of the **open-skills** pack — reusable skills for AI coding agents (Claude Code, Codex, and any runtime that reads the open Agent Skills format), each a readable `SKILL.md` plus a declarative, validatable `protocol.yon`. Ships:

- the dual-doc format (Markdown explains; YON makes rules and gates inspectable and enforceable);
- a zero-dependency `install.mjs` (copy-default, never symlink; validates each `protocol.yon` on install; refuses to delete through a junction);
- the machine catalog (`catalog.yon` / `catalog.json` / `llms.txt`) for agent and registry discovery;
- CI conformance — YON validation, a cross-reference/structural lint, a YON-DAG semantic check, spine-manifest sync, and a `gate-fires` proof that the guards actually reject broken input;
- Apache-2.0 license, NOTICE, THREAT-MODEL, CONTRIBUTING (DCO), and SECURITY policy.

[1.6.1]: https://github.com/allemaar/open-skills/releases/tag/v1.6.1
[1.6.0]: https://github.com/allemaar/open-skills/releases/tag/v1.6.0
[1.5.0]: https://github.com/allemaar/open-skills/releases/tag/v1.5.0
[1.4.0]: https://github.com/allemaar/open-skills/releases/tag/v1.4.0
[1.3.1]: https://github.com/allemaar/open-skills/releases/tag/v1.3.1
[1.3.0]: https://github.com/allemaar/open-skills/releases/tag/v1.3.0
[1.2.1]: https://github.com/allemaar/open-skills/releases/tag/v1.2.1
[1.2.0]: https://github.com/allemaar/open-skills/releases/tag/v1.2.0
[1.1.0]: https://github.com/allemaar/open-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/allemaar/open-skills/releases/tag/v1.0.0
