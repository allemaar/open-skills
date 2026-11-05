# Describe a useful workflow

Use this recipe to turn a recurring activity into a specification someone can implement or follow. It produces a description, not automation, an installed service or a schedule.

## Prerequisites and selected install set

Selected skill install set: **none**. Read this recipe directly and supply notes or one recent occurrence of the activity. A person or assistant capable of asking questions and returning text can use it. No account, external service, parser or subagent is required or prescribed.

A missing activity permits bounded discovery: ask about one recurring delay, repeated decision or troublesome handoff, then select one useful activity. Stay within the supplied subject. File saving additionally requires an exact authorized destination and supported safe writer; otherwise return the description as text.

## Describe one activity

Reuse a complete brief; otherwise start from a recent occurrence and ask consequential questions about trigger, input, actor, output and completion. Ground recommendations in evidence and clear tradeoffs.

Describe the ordinary path in the actors' language. Include inputs, outputs, ownership, meaningful states and steps. Distinguish an event trigger from a calendar trigger. A weekly habit need not become a scheduled job. Check whether a manual checklist already solves the need before proposing AI or automation.

Follow an example from start to finish and test the exceptions that could change the next implementation decision:
- missing or invalid input;
- duplicate arrival and how it is recognized;
- a failed step, retry permission and stopping condition;
- an unresolved human choice or escalation;
- private information and who may receive or change it.

Include relevant states/checkpoints without mandatory dashboards or approval layers. Before retrying an external effect, specify how to detect prior completion.

Separate established facts, chosen rules and open options. An unknown owner or privacy rule is a visible gap, not a guessed default. Stop questioning when the description supports the next useful implementation choice, or the person stops. It need not eliminate every conceivable future question.

Return a readable description with objective, trigger, inputs, ordinary path, roles, completion and material exceptions. Use the existing document form and destination when supplied. Saving requires actual authorization, no-follow target/ancestor checks, a retained recoverable preimage and supported revision protection or enforceable single-writer access. Reread and merge only selected changes under that protection. An overlapping edit or unsupported writer blocks the save; preserve the proposed description as text. Stop on write failure and report completed versus unsaved work. Preserve existing records and user edits. Describe what remains undecided.

Do not install services, send messages, create schedules, connect accounts or implement the workflow by implication.

## Small example

A neighborhood association sorts supplier invoices each Friday. The secretary checks the shared folder, labels each invoice reviewed, records amount and due date in the existing ledger, and flags unreadable or duplicate documents for the treasurer. Completion means every newly received invoice is recorded or has an explicit exception. A manual checklist is the first design; no AI or scheduler is required. Whether invoices may leave the shared folder remains a separate privacy choice.

## Reusable prompt

“Help describe our recurring activity using this context. Reuse what is known, ask only consequential missing questions, include relevant duplicates/failures and a way to recognize completion. Keep manual operation available and identify unresolved ownership or privacy. Return a workflow description without building or scheduling it.”

## Expected output and non-use

Expect a description usable for the next manual or implementation decision, plus assumptions, open gaps and exact saved-versus-text-only status. Read the ordinary path and one realistic exception against the completion condition. If a changed description fails either walkthrough, revise only the affected part; this is a source walkthrough, not evidence the workflow ran. This recipe does not carry out an existing workflow or authorize its effects. No temporary workspace or cleanup is required.

[Workflow recipes](README.md) · [Skill guides](../README.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
