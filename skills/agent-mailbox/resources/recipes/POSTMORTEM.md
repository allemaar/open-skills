# Postmortem and After-Action learning

Status: **active**.

Use after a meaningful phase, miss, recovery, or failure when the result could change future behavior. Do not run it after every ordinary exchange.

1. Reconstruct what was expected and what actually happened from messages, dispositions, artifacts, and runtime evidence.
2. Separate confirmed facts from inference and unknowns.
3. Identify the first observable divergence, the mechanism that allowed it to propagate, and the recovery that worked or failed.
4. Record positive signals, negative signals, unproven boundaries, and the next recovery action.
5. Choose at most one or two concrete changes: repair an active recipe, add a bounded experiment, or change no source when the existing guidance was sufficient.
6. Give each action an owner, evidence target, and revisit trigger.
7. At the next review, check whether the previous action visibly changed behavior.

The characteristic failure is **Agile Theatre**: the ceremony runs, observations accumulate, and nothing changes. If the previous action has no observable effect, repair ownership or stop repeating the ritual.

Postmortems do not retroactively authorize work, rewrite messages, erase debt, or convert silence into success.

Grounding: [Google SRE, *Postmortem Culture: Learning from Failure*](https://sre.google/sre-book/postmortem-culture/) and the [Scrum Guide's inspect-and-adapt rule](https://scrumguides.org/scrum-guide.html).
