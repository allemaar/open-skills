# Active collaboration arrangements and techniques

> Arrangements and techniques never change Handler authority, mailbox validity, dispositions, reconciliation, or cursor semantics. They organize ordinary messages and explicit pen ownership.

Status: **active**. Individual presets remain optional and replaceable by Handler direction.

Structural independence is not effective independence. Shared specifications, prompts, sources, or assumptions can correlate otherwise blind agents. Every challenge technique therefore names the behavior that creates useful independence.

## Arrangements

### Parallel Partners

- **Use when:** divisible work benefits from parallel implementation followed by reciprocal comparison.
- **Roles:** each participant owns a separate artifact or slice; neither edits the other's bytes.
- **Challenge behavior:** compare concrete outputs and review each other's work after deposit.
- **Prevents:** serial bottlenecks and one-agent blind spots.
- **Creates:** duplicated work and correlated mistakes from shared assumptions.
- **Exit:** reconcile the outputs under one declared final pen.
- **Recovery:** use [`recipes/REVIEW.md`](recipes/REVIEW.md) for correlated findings and [`recipes/HANDOFF.md`](recipes/HANDOFF.md) when the final pen changes.
- **Established analogue:** split-and-reconvene pair development. The preset name is local.

### Driver–Counsel

- **Use when:** one participant drives while another advises at important decisions or phase boundaries.
- **Roles:** Driver owns action and pen; Counsel examines assumptions and consequences.
- **Challenge behavior:** Counsel gives advice; Driver weighs it and records the decision.
- **Prevents:** unilateral tunnel vision.
- **Creates:** an authority gradient that is too steep to challenge or too shallow to preserve ownership.
- **Exit:** the decision is recorded or the Handler changes roles.
- **Recovery:** use [`WORKING-AGREEMENT.md`](WORKING-AGREEMENT.md) to clarify authority or [`recipes/HANDOFF.md`](recipes/HANDOFF.md) to switch the Driver.
- **Established analogue:** driver–navigator and advice-process practice.

### Driver–Verifier

- **Use when:** an artifact or claim already exists and needs independent checking.
- **Roles:** Driver authors; Verifier checks current bytes and consumed behavior without editing them.
- **Challenge behavior:** direct observation, recomputation, inspection, or execution beats accepting the Driver's report.
- **Prevents:** self-attestation and rubber-stamp acceptance.
- **Creates:** false independence when the Verifier shares the same evidence boundary.
- **Exit:** findings are accepted, repaired once within scope, or surfaced to the Handler.
- **Recovery:** use [`recipes/REVIEW.md`](recipes/REVIEW.md); unresolved authority or pen changes use [`recipes/HANDOFF.md`](recipes/HANDOFF.md).
- **Established analogue:** author–reviewer with independent verification. Do not call ordinary review IV&V unless its stricter independence conditions hold.

## Challenge techniques

### Break the Convergence

- **Use when:** principal participants agree on an important artifact or decision and shared blindness is plausible.
- **Roles:** a fresh reviewer receives the frozen artifact and acceptance criteria, not the participants' conclusions.
- **Challenge behavior:** independently search for decision-changing defects or assumptions.
- **Prevents:** agreement becoming evidence of correctness.
- **Creates:** review carousel and perfection chasing.
- **Exit:** one bounded fresh review; another pass requires new evidence.
- **Recovery:** use [`recipes/REVIEW.md`](recipes/REVIEW.md) and stop on unchanged evidence.
- **Established analogue:** independent challenge review. The convergence-trigger framing is local.

### Blind Deposit

- **Use when:** peer conclusions could anchor independent judgment.
- **Roles:** each participant deposits a first pass before reading the others.
- **Challenge behavior:** sealed first pass, then reveal and reconcile.
- **Prevents:** information cascades and premature averaging.
- **Creates:** duplicated analysis and superficial independence from shared sources.
- **Exit:** reveal once, compare evidence, then choose a normal arrangement.
- **Recovery:** use [`recipes/REVIEW.md`](recipes/REVIEW.md) for comparison and [`WORKING-AGREEMENT.md`](WORKING-AGREEMENT.md) when roles remain unclear.
- **Established analogue:** simultaneous reveal, blinding, and precommit–reveal–reconcile. It may overlay any arrangement.

## Scale operation

### Bounded Fan-Out/Fan-In

- **Use when:** one coordinator has several independent, well-bounded research or review slices.
- **Roles:** coordinator owns scope and synthesis; workers are not mailbox participants unless separately established.
- **Challenge behavior:** workers use distinct briefs; coordinator verifies load-bearing claims before relaying them.
- **Prevents:** serial gathering and context overload.
- **Creates:** coordinator laundering unverified worker output or dispatching an unbounded swarm.
- **Exit:** every worker returns, times out, or is cancelled; synthesis records evidence and gaps.
- **Recovery:** use [`recipes/FAN-OUT-FAN-IN.md`](recipes/FAN-OUT-FAN-IN.md); decision-changing conflicts route to [`recipes/REVIEW.md`](recipes/REVIEW.md).
- **Established analogue:** scatter-gather and coordinator–worker.

Use [`recipes/REVIEW.md`](recipes/REVIEW.md) and [`recipes/FAN-OUT-FAN-IN.md`](recipes/FAN-OUT-FAN-IN.md) for execution.

## Grounding

- Parallel and driver–navigator practice: [Martin Fowler, *On Pair Programming*](https://martinfowler.com/articles/on-pair-programming.html)
- Counsel and authority gradients: [FAA Crew Resource Management guidance](https://www.faa.gov/documentlibrary/media/advisory_circular/ac120-51e.pdf)
- Independent verification: [NASA IV&V overview](https://www.nasa.gov/ivv-overview/)
- Convergence can overstate reproducibility: [Open Science Collaboration, *Estimating the reproducibility of psychological science*](https://pubmed.ncbi.nlm.nih.gov/26315443/)
- Fan-Out/Fan-In topology: [AWS Scatter-Gather pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/scatter-gather.html)
