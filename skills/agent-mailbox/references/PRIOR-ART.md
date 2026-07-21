# Prior art — what else exists, and where this differs

Companion to [`VALIDATION.md`](VALIDATION.md). That file separates what was *measured*
from what is *designed*. This one separates what is *already built by others* from what
this protocol actually claims as new.

**Landscape swept 2026-07-19/20.** The space is moving fast enough that this file will
age; entries carry the date and the verification level they were checked at.

## Verification levels

| Level | Meaning |
|---|---|
| **source-verified** | Repository tree and implementation files read directly; metrics pulled from the GitHub API on the stated date |
| **doc-verified** | README, spec, or published docs read; implementation not inspected |
| **named-only** | Surfaced in community discussion or a vendor page; not independently checked. **Treat every claim about these as unverified.** |

## The axis that actually separates these

Not features. **What you must install before two agents can exchange a message.**

| You install | Examples |
|---|---|
| A network protocol + endpoints | MCP, A2A, ACP |
| A server process + a database | MCP Agent Mail, codor |
| An application or IDE fork | grome, jinn, Agent Nest, herdr |
| **A document, into a folder that already syncs** | **`agent-mailbox`** |

Everything below is measured against that column, because it is the only one that
changes what a user has to do before the first message moves.

## The close relatives

### codor — `rjx18/codor` · source-verified 2026-07-20

Created 2026-07-19; **44 stars, 10 forks within roughly two hours of release.** A pnpm
TypeScript monorepo: a `protocol` package (zod schemas), a `switchboard` server (router,
SQLite store, ledger, crypto, push), adapters for claude-code / codex / copilot / gemini /
opencode, Slack and Telegram bridges, a CLI, and two web UI generations.

Genuinely close, and better than this protocol in several places: a real-time web UI
reachable from a phone, five shipped code adapters, a delivery state machine
(`queued` / `delivering` / `consumed` / `held`) with a crash-reconciliation write-ahead
record bound *before* a turn spawns, and mention spans stored as resolved member ids so
renames never break historical routing. It also documents an invariant close to this
one's: *"A recipient receives the full message it was mentioned in, plus that message's
refs, and nothing else — never ambient channel history."*

**Why it isn't this:** it is a server. A room's messages, deliveries, members and rounds
are rows in one shared SQLite file keyed by a room id across nine tables, with no
per-room export — moving a room to another machine means hand-rolling a database
migration. Its own design needed a *second*, separate markdown store for durable
decisions, because rows are not human-legible or diff-friendly. This protocol starts
where that second store ended up, and has no first one.

### MCP Agent Mail — `Dicklesworthstone/mcp_agent_mail` · doc-verified

Inboxes, threads, and leases for coding agents — "gmail for coding agents". A FastMCP
server plus SQLite plus Git. Mature and further along on lease semantics than this
protocol is.

**Why it isn't this:** you install and run infrastructure. Here you install a document.

### agent-message-queue — `avivsinai` · doc-verified

The closest relative in *shape*: file-based Maildir-style queue, JSON-frontmatter
markdown, git-versioned, with threading and receipts.

**Why it isn't this:** scoped to local coding-agent repo queues. No transport
generalization beyond git, no identity lifecycle, no governance layer.

## The interop protocols

### MCP · A2A · ACP (Linux Foundation) — doc-verified

Enterprise agent-interoperability network protocols: HTTP/JSON-RPC, agent cards, servers.
Different layer, and largely complementary rather than competing — an agent can speak MCP
to its tools and use this to talk to another agent.

**Where the gap is:** per *Governance Gaps in Agent Interoperability Protocols*
(arXiv 2606.31498), these protocols cannot express authority, arbitration, or human
oversight. That gap is this protocol's design center, not an afterthought.

## Adjacent — will be named in any discussion, but solves something else

| Project | What it is | Level |
|---|---|---|
| `PiLastDigit/TRIP-workflow` | Plan → Implement → Release workflow skills, with `ARCHI.md` as cross-session memory. 543 stars, 10 commits. A *workflow*, not a comms channel. | source-verified 2026-07-19 |
| `rjx18/harn` | Assumption ledger anchored to code, with a git-diff pre-commit gate. Governs code changes, not agent messages. | source-verified 2026-07-20 |
| `MnemeHQ/mneme` | Machine-checkable ADRs enforced through a Claude Code `PreToolUse` hook. Governs architecture conformance. | source-verified 2026-07-20 |
| AgenticMail | Real email / SMS / voice rails for agents. Different medium. | doc-verified |
| `AGENTS.md` | Context-file convention. A sibling convention, not comms. | doc-verified |
| FIPA-ACL (1990s) | Speech-act agent communication language. The honourable ancestor — its performatives map closely onto this protocol's message kinds. | doc-verified |

## Named-only — surfaced in community discussion, not verified

**No claim is made about any of these.** They are listed so the landscape is not
presented as thinner than it is: **herdr.dev**, **jinn.run**, **getgrome.com**,
**paperclip**, **pi**, **Superset**, **Traycer**, **Agent Nest**, **agent-teams-ai**,
**Omnigent**, **Claude Octopus**, **Repo Prompt**.

Most appear to be harnesses, IDE forks, or hosted apps rather than protocols — but that
is an impression from discussion, not a finding. **If you are comparing seriously, check
them yourself.**

## What the landscape actually shows

**Convergent discovery is happening now, and faster than "a couple of close relatives".**
Roughly twenty distinct tools addressing agent-to-agent coordination surfaced in a single
community thread in July 2026, one of them released two days before this sweep. A
commenter in that thread put it plainly: *"a lot of people reaching the same solution."*

Two honest readings follow, and both are true:

1. **The need is real.** Independent convergence at this density is the strongest
   available evidence that the problem is not invented.
2. **The relay layer is crowded.** "Agents can talk to each other" is not a
   differentiator in 2026. It is table stakes.

## What this protocol actually claims

Narrowly, so the claim can be checked:

1. **Zero runtime dependency.** No server, no daemon, no database, no SDK. Transport
   adapters are paragraphs of prose, not packages.
2. **Transport piggybacking as the core principle.** Any folder-mover is the network —
   local, Git, Lyt, OneDrive, Drive, SMB — with per-transport conflict, latency, and
   staging semantics specified rather than assumed.
3. **Identity lifecycle.** Generated callsigns, speak-to-renew leases, expiry distinct
   from retirement, reclaim, and declared succession across model generations.
4. **Collaboration methodology, not just message transport.** Independent-then-merge,
   four-category cross-review, attestation-with-recompute, single-writer, exchange budget.
5. **Governance and human-auditability as the design center.** A wikilinked causal graph
   a person can walk, a reserved Handler seat, arbitration, and an autonomy loop-breaker —
   sitting on the documented gap in the interop protocols above.

**The combination is what is unclaimed. No single element is.**

## What this protocol does not have

Stated here rather than discovered by a reader:

- **No UI.** codor has a web app you can reach from a phone; this has files in a folder.
- **No real-time push.** Delivery latency is a property of whatever moves the folder.
- **No code adapters.** Runtime adapters are described, not packaged.
- **No fanout economics.** Group rooms over a synced folder mean every participant
  replicates every message.
- **Fewer eyes.** The mature alternatives have more users, more issues filed, and more
  edge cases already hit.

See [`VALIDATION.md`](VALIDATION.md) for what has been measured versus designed. The
sync-share transports are design-validated and the field test is still open; that row
should not be described as proven until it is.
