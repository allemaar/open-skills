# Skill guides

These guides cover all **92 skills**: what each does, where it fits, when to use it, a request to try, its flow, practical questions and signs of a useful result.

I keep these guides alongside the skills to help you choose what fits. Read a guide first, then its linked source for the complete procedure and safeguards. [Install or update a skill](installation.md) or browse the [compact catalog](../SKILLS.md).

For shared terms and library boundaries, see the [glossary](../GLOSSARY.md) and [scope](../SCOPE.md).

For a task that spans a few steps, start with the [workflow recipes](workflows/README.md). They cover questionnaires, workflow discovery, coauthoring, testing, review evidence, and creating a skill or library. Each names its prerequisites and stopping points.

Subagent labels describe the skill's own workflow: **No subagent step prescribed** means no separate worker step is defined; **Conditional** depends on the task or selected route; **Part of the workflow** means separate workers or model calls are integral to that route. A label does not grant permission or promise runtime support.

## Planning & execution

| Skill | What it does | Subagents |
|---|---|---|
| [ask-me](skills/ask-me.md) | Interviews a person to turn an idea, task or decision into a usable working brief. | No subagent step prescribed |
| [define-terms](skills/define-terms.md) | Refines domain language in bounded contexts while separating accepted definitions, observed implementation and proposed changes. | No subagent step prescribed |
| [freshness-contract](skills/freshness-contract.md) | Determines whether old evidence remains usable for a current decision. | No subagent step prescribed |
| [implement-task](skills/implement-task.md) | Implements one explicitly selected, authorized outcome and verifies it against observable acceptance. | No subagent step prescribed |
| [plan-cleanup](skills/plan-cleanup.md) | Removes confirmed disposable planning leftovers after execution. | No subagent step prescribed |
| [plan-create](skills/plan-create.md) | Designs a phased implementation plan before building. | No subagent step prescribed |
| [plan-deep-dive](skills/plan-deep-dive.md) | Inspects a multi-phase plan one phase at a time. | Conditional |
| [plan-evolve](skills/plan-evolve.md) | Plans a next iteration from a shipped baseline. | No subagent step prescribed |
| [plan-execute](skills/plan-execute.md) | Executes an approved concrete plan without silent drift. | No subagent step prescribed |
| [plan-phases](skills/plan-phases.md) | Restructures an existing plan into phases with verification and safety gates. | No subagent step prescribed |
| [reflect](skills/reflect.md) | Pauses to expose assumptions and uncertainty without a gate. | No subagent step prescribed |
| [verify](skills/verify.md) | Formally gates work against intent, plan and execution using fresh source checks. | No subagent step prescribed |
| [write-spec](skills/write-spec.md) | Synthesizes supplied discussion and established evidence into a behavioral specification with explicit decisions and gaps. | No subagent step prescribed |

## Insight & decision

| Skill | What it does | Subagents |
|---|---|---|
| [cold-review](skills/cold-review.md) | Reviews actual work against objectives using fresh independent perspectives. | Conditional |
| [double-check](skills/double-check.md) | Re-examines a claim, output or decision against fresh evidence. | Conditional |
| [insight-adversarial](skills/insight-adversarial.md) | Stress-tests a plan, design, document, workflow, or system through distinct critic personas and synthesizes findings into a verdict. | Conditional |
| [insight-angles](skills/insight-angles.md) | Finds less-visible frames, connections, assumptions, candidate expansions, and second-order effects around a subject. | Conditional |
| [insight-assess](skills/insight-assess.md) | Evaluates an approach, decision, implementation, or options against relevant criteria and recommends a course. | No subagent step prescribed |
| [insight-critique](skills/insight-critique.md) | Reviews one existing plan, code change, architecture, or UI output and reports strengths, risks, and fixes. | Conditional |
| [insight-cross-examine](skills/insight-cross-examine.md) | Routes a subject or option set through depth-scaled deliberation, discovers angles, critiques and assesses choices, then recommends. | Conditional |
| [insight-explore](skills/insight-explore.md) | Generates distinct approaches to a problem and compares them before a plan is chosen. | No subagent step prescribed |
| [insight-premortem](skills/insight-premortem.md) | Imagines a plan has failed and identifies plausible causes, evidence gaps, and ways to prevent or detect them. | Conditional |
| [insight-reference-class](skills/insight-reference-class.md) | Forecasts an outcome from comparable completed cases and explains differences from the current plan's estimate. | Conditional |
| [insight-retro](skills/insight-retro.md) | Reviews significant completed implementation work to map impact, capture patterns, check documentation, and list follow-up work. | No subagent step prescribed |
| [insight-root-cause](skills/insight-root-cause.md) | Investigates an observed or recurring problem by tracing evidence-linked causes and competing explanations. | Conditional |
| [insight-skill-gap](skills/insight-skill-gap.md) | Compares recent work with the existing skill index to find reusable patterns that are missing or under-covered. | No subagent step prescribed |
| [insight-test-assumption](skills/insight-test-assumption.md) | Designs a bounded test that could support or disprove a decision-critical assumption; it does not run the test. | Conditional |
| [insight-value-of-information](skills/insight-value-of-information.md) | Assesses whether information could improve a pending choice enough to justify research, testing, and delay costs. | Conditional |
| [investigate](skills/investigate.md) | Gathers facts without changing the target. | Conditional |

## Priming

| Skill | What it does | Subagents |
|---|---|---|
| [extract-signal](skills/extract-signal.md) | Turns noisy sources into vetted signal in the requested form. | Conditional |
| [prime-expand](skills/prime-expand.md) | Turns a vague gap into questions and candidate sources via a bounded subagent. | Part of the workflow |
| [prime-fetch](skills/prime-fetch.md) | Delegates one read-only fetch and returns a filtered digest. | Part of the workflow |
| [prime-sweep](skills/prime-sweep.md) | Primes the caller from a large source surface using delegated workers. | Part of the workflow |

## Skill library

| Skill | What it does | Subagents |
|---|---|---|
| [directives-audit](skills/directives-audit.md) | Audits directive systems for authority, scope, safety, routing and drift. | No subagent step prescribed |
| [next-skills](skills/next-skills.md) | Offers declared successor skills without running them automatically. | No subagent step prescribed |
| [self-improve](skills/self-improve.md) | Detects concrete improvement signals and proposes specific skill changes for approval. | No subagent step prescribed |
| [skill-library-creator](skills/skill-library-creator.md) | Creates a portable skill library with its own family manager, guidance, authoring resources, and optional local links into selected harness locations. | No subagent step prescribed |
| [skill-smith](skills/skill-smith.md) | Creates, assesses, diagnoses, updates, or reorganizes skills through a route-specific procedure and selected references. | Conditional |
| [skills-help](skills/skills-help.md) | Shows a live installed-skills menu using the bundled taxonomy. | No subagent step prescribed |
| [update-open-skills](skills/update-open-skills.md) | Checks or updates an existing open-skills installation to a selected stable release while preserving its method and local changes. | No subagent step prescribed |

## Orchestration & dispatch

| Skill | What it does | Subagents |
|---|---|---|
| [agent-mailbox](skills/agent-mailbox.md) | Coordinates agents through append-only messages in a shared folder. | No subagent step prescribed |
| [ask-gate](skills/ask-gate.md) | Triages a pending question and prepares it according to stakes. | No subagent step prescribed |
| [budget-check](skills/budget-check.md) | Checks usage before an expensive agent wave, returning go, no-go or unknown. | No subagent step prescribed |
| [caller-options](skills/caller-options.md) | Routes one skill invocation among viable modes and execution venues. | Conditional |
| [handoff](skills/handoff.md) | Creates a structured brief for a fresh agent or session. | Conditional |
| [handoff-execute](skills/handoff-execute.md) | Executes a structured handoff with source ingestion and acceptance verification. | Conditional |
| [headless-claude](skills/headless-claude.md) | Run a bounded Claude Code CLI task under a supervisor. | Part of the workflow |
| [headless-codex](skills/headless-codex.md) | Run a bounded Codex CLI task with scoped authority. | Part of the workflow |
| [headless-gemini](skills/headless-gemini.md) | Run a bounded Gemini or Claude task through Antigravity CLI (agy), using a locally available model and a capable supervisor. | Part of the workflow |
| [headless-grok](skills/headless-grok.md) | Run a bounded Grok Build CLI task using selected permissions. | Part of the workflow |
| [headless-models](skills/headless-models.md) | Select a headless model using capability, cost and availability evidence. | No subagent step prescribed |
| [headless-update-models](skills/headless-update-models.md) | Refresh canonical headless model evidence and consumer projections. | No subagent step prescribed |
| [headless-usage](skills/headless-usage.md) | Read available account usage and reset information across supported harnesses. | No subagent step prescribed |
| [multi-agent-mode](skills/multi-agent-mode.md) | Activates assisted mode: the lead works directly and delegates useful independent slices. | Conditional |
| [orchestrate-mode](skills/orchestrate-mode.md) | Activates dispatch-only coordination of governed worker tasks. | Conditional |
| [route-task](skills/route-task.md) | Recommends task capability and effort routing using an experimental rubric. | No subagent step prescribed |

## Orientation

| Skill | What it does | Subagents |
|---|---|---|
| [orient-gaps](skills/orient-gaps.md) | Identify blockers, open choices, loose ends and inferred gaps. | Part of the workflow |
| [orient-map](skills/orient-map.md) | Show change since a last look and the shape of the work. | Part of the workflow |
| [orient-roadmap](skills/orient-roadmap.md) | Show upcoming increments, gates and deferred work. | Part of the workflow |
| [orient-status](skills/orient-status.md) | Show current position, remaining work and an estimated completion band. | Part of the workflow |

## Human output

| Skill | What it does | Subagents |
|---|---|---|
| [agent-output](skills/agent-output.md) | Compresses agent-to-agent reports while preserving decision-critical evidence and caveats. | No subagent step prescribed |
| [human-draw](skills/human-draw.md) | Turns relational, positional, or proportional information into a text figure that carries meaning alongside concise prose. | No subagent step prescribed |
| [human-merge](skills/human-merge.md) | Combines reports into one decision-ready account while accounting for shared sources, superseded claims, conflicts, and pooled gaps. | No subagent step prescribed |
| [human-output](skills/human-output.md) | Guides writing as it happens so a reader can understand the decision, consequence, evidence, and unchecked scope. | No subagent step prescribed |
| [human-rewrite](skills/human-rewrite.md) | Repairs existing text so a person can read and act on it while preserving its claims and degree of certainty. | No subagent step prescribed |
| [prose-audit](skills/prose-audit.md) | Diagnoses repetition, filler and avoidable reading load in existing prose. | No subagent step prescribed |
| [synthesize](skills/synthesize.md) | Shapes reader-facing output around its purpose while preserving meaning and caveats. | No subagent step prescribed |
| [synthesize-init](skills/synthesize-init.md) | Installs, updates or removes a managed synthesize route in existing directives. | No subagent step prescribed |
| [teach-topic](skills/teach-topic.md) | Teaches one useful next capability with practice, evidence-based feedback and optional progress capture. | No subagent step prescribed |

## Code & architecture

| Skill | What it does | Subagents |
|---|---|---|
| [audit-coupled-constant](skills/audit-coupled-constant.md) | Audit duplicated constants for drift. | No subagent step prescribed |
| [build-prototype](skills/build-prototype.md) | Builds and exercises a bounded runnable experiment to answer a design question. | No subagent step prescribed |
| [debug-task](skills/debug-task.md) | Reproduces and diagnoses a specific defect through bounded probes and verifies an authorized repair. | No subagent step prescribed |
| [design-an-interface](skills/design-an-interface.md) | Compare concrete module interfaces and synthesize a recommendation. | Conditional |
| [improve-codebase-architecture](skills/improve-codebase-architecture.md) | Find opportunities to deepen modules and reduce coupling. | Conditional |
| [monorepo-deps](skills/monorepo-deps.md) | Coordinate dependency checks, repairs, updates and lockfile maintenance for npm workspaces. | No subagent step prescribed |

## Obsidian & vault

| Skill | What it does | Subagents |
|---|---|---|
| [json-canvas](skills/json-canvas.md) | Create or edit JSON Canvas diagrams with nodes and edges. | No subagent step prescribed |
| [map-check](skills/map-check.md) | Run a read-only conformance check on a bounded knowledge map. | No subagent step prescribed |
| [map-init](skills/map-init.md) | Install or remove the mapping route on selected agent directive surfaces. | No subagent step prescribed |
| [map-maintain](skills/map-maintain.md) | Perform one bounded check, selected repair and recheck cycle. | No subagent step prescribed |
| [map-rules](skills/map-rules.md) | Route Markdown organization work to applicable Map Your Knowledge rules. | No subagent step prescribed |
| [map-this](skills/map-this.md) | Assess and organize one bounded folder, project or vault. | No subagent step prescribed |
| [obsidian-bases](skills/obsidian-bases.md) | Create or edit Obsidian Bases views over note properties. | No subagent step prescribed |
| [obsidian-cli](skills/obsidian-cli.md) | Operate a running Obsidian instance through its CLI. | No subagent step prescribed |
| [obsidian-markdown](skills/obsidian-markdown.md) | Write Obsidian-flavored Markdown with links, embeds, properties and callouts. | No subagent step prescribed |

## YON

| Skill | What it does | Subagents |
|---|---|---|
| [yon-read](skills/yon-read.md) | Interpret existing YON records in plain language. | No subagent step prescribed |
| [yon-write](skills/yon-write.md) | Encode source content as YON while preserving meaning and uncertainty. | No subagent step prescribed |

## Web

| Skill | What it does | Subagents |
|---|---|---|
| [defuddle](skills/defuddle.md) | Extract readable Markdown from a web page. | No subagent step prescribed |
| [domain-check](skills/domain-check.md) | Reconcile domain availability signals using registration and DNS evidence. | No subagent step prescribed |

## Git & sync

| Skill | What it does | Subagents |
|---|---|---|
| [diff-recap](skills/diff-recap.md) | Summarize an actual Git diff as a reconciled, pasteable recap. | No subagent step prescribed |
| [github-sync](skills/github-sync.md) | Reviews session changes, obtains approval for commits, then commits and pushes. | No subagent step prescribed |

## Write copy

| Skill | What it does | Subagents |
|---|---|---|
| [write-copy](skills/write-copy.md) | Route promotional copy requests to the appropriate specialization. | No subagent step prescribed |
| [write-copy-event-video](skills/write-copy-event-video.md) | Develop event-video copy variants, cross-examine them and synthesize a fourth version. | Conditional |

## Keeping the guides current

Edit the relevant entry in `docs/skill-guides.json` after checking its cited sources, then regenerate with `node tools/spine.mjs`. The same command refreshes the catalog. `node tools/spine.mjs --check` checks the inventory, source fingerprints and emitted files. It does not prove that an explanation is accurate; source review remains necessary. See the [maintainer checklist](../CONTRIBUTING.md#maintainer-closeout).

[License](../LICENSE) · [Trademark policy](../TRADEMARK.md)
