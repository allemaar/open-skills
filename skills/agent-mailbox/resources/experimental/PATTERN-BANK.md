# Experimental pattern bank

## Incident Command

- **Hypothesis:** explicit incident commander, operations, and communications roles improve response to multi-party mailbox failures.
- **Grounding:** [Google SRE Incident Management Guide](https://sre.google/resources/practices-and-processes/incident-management-guide/).
- **Why banked:** no Agent Mailbox incident has yet required this topology; ordinary two-agent failures do not justify command machinery.
- **Experiment:** simulate one bounded multi-participant incident with role transfer and cleanup.
- **Promote when:** roles reduce ambiguity without persisting after the incident.

## Contract Net

- **Hypothesis:** announce → bid → award → result improves open-task allocation among several capable agents.
- **Grounding:** [Smith, *The Contract Net Protocol*](https://doi.org/10.1109/TC.1980.1675516).
- **Why banked:** FULL claims already cover the simpler case; bidding overhead has not earned itself.
- **Experiment:** compare one real multi-agent allocation against earliest-valid-claim.
- **Promote when:** allocation quality improves enough to justify the extra messages.

## Blackboard coordination

- **Hypothesis:** agents contributing partial solutions to one shared problem state can outperform directed pair exchanges.
- **Grounding:** [Hayes-Roth, *A blackboard architecture for control*](https://doi.org/10.1016/0004-3702(85)90063-3).
- **Why banked:** Agent Mailbox intentionally uses append-only messages and single-writer artifacts; a mutable shared blackboard could violate that separation.
- **Experiment:** use immutable contributions plus one coordinator-owned synthesis without shared mutation.
- **Promote when:** the topology helps a real problem without creating competing writers.

## Delphi consultation

- **Hypothesis:** repeated anonymous estimates with controlled feedback improve uncertain forecasting.
- **Grounding:** [RAND methodological guidance for Delphi panels](https://doi.org/10.7249/TLA3082-1).
- **Why banked:** anonymity, iteration, and aggregation machinery are not native mailbox guarantees.
- **Experiment:** run one bounded estimate with sealed first deposits and two rounds maximum.
- **Promote when:** the second round changes calibration rather than merely producing consensus.

## Follow-the-Sun handoff

- **Hypothesis:** acknowledged handoffs across time zones enable continuous progress.
- **Grounding:** [IBM Research, *Follow the sun software development*](https://research.ibm.com/publications/follow-the-sun-software-development-new-perspectives-conceptual-foundation-and-exploratory-field-study).
- **Why banked:** no cross-time-zone mailbox cycle has proven continuity, latency, or ownership behavior.
- **Experiment:** one real two-locus handoff with exact artifacts, receiver synthesis, and no overlap ambiguity.
- **Promote when:** the incoming holder resumes without missing work or duplicating effects.

## Adversarial Collaboration

- **Hypothesis:** participants who disagree can jointly define a test both accept while an independent arbiter evaluates it.
- **Grounding:** [University of Pennsylvania Adversarial Collaboration Project](https://web.sas.upenn.edu/adcollabproject/) and [Mellers, Hertwig, and Kahneman's original exercise](https://doi.org/10.1111/1467-9280.00350).
- **Why banked:** it requires fair-test design and independent adjudication beyond ordinary counsel or review.
- **Experiment:** one material disagreement with preregistered evidence and an arbiter blind to the principals' desired outcome.
- **Promote when:** the test resolves or sharply narrows the disagreement without shifting criteria afterward.

## Redundant Independent Implementation

- **Hypothesis:** multiple implementations of the same full specification expose faults through comparison.
- **Grounding and counter-evidence:** [Knight and Leveson, *An experimental evaluation of the assumption of independence in multiversion programming*](https://doi.org/10.1109/TSE.1986.6312924).
- **Why banked:** independent implementations can still share correlated faults from a common specification misunderstanding.
- **Experiment:** two sealed implementations plus tests derived independently from the implementation teams.
- **Promote when:** the redundancy finds a defect that Parallel Partners or ordinary review would plausibly miss.

## Possible later demotions

An active preset returns here when it produces a material failure its own card did not predict. Record the failure, evidence, and next discriminating experiment before any later re-promotion.
