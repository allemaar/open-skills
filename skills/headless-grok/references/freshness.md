<!-- headless-family:projection -->
# Model evidence freshness

Read the bundled model-state.json before every headless invocation, including explicit model selections and resume. The policy's `reminderDays` is the single interval source, currently 30 days by user choice. This is a reminder preference, not a TTL proving evidence correct.

Each source records `sourcePublishedAt` (null when the publisher provides none), `lastVerifiedAt`, `lastAttemptedAt`, `lastAttemptOutcome`, `invalidated`, and coverage/gaps. Missing, invalid or future dates; a failed/partial attempt; explicit invalidation; or age at least the reminder interval makes the family due. A future publication date is invalid too. Publication age alone does not invalidate a successfully checked historical benchmark. Checking that no newer release exists may advance lastVerifiedAt while retaining the old publication date.

Run the bundled read-only check-model-freshness.mjs with the absolute state path when Node is available. Exit 0 means not due; 2 means an offer is due; 1 means invalid state, also requiring an offer. It writes nothing and calls no network or model. Without Node, apply the same rules directly.

The outer supervising session owns the offer: “Model guidance was last verified on <date>; <reason>. Update all headless model guidance now, or continue with the dated snapshot?” Ask once for the same snapshot/reasons in the current session, across all provider invocations. Remember the answer in conversation state. A changed snapshot or new invalidator can justify another offer. Do not create cross-session tracking files implicitly.

An explicit update request already answers the question. On update, invoke headless-update-models and consume its partial/success report. On decline, continue the authorized task with labeled dated evidence, live capability checks and explicit model preserved. Silence is not approval to update. In a noninteractive worker, return freshness status to the parent and do not prompt or recursively invoke the updater. A parent can supply its already-resolved freshness decision to children.

Age does not override actual errors. A missing model, changed billing route, invalid permission boundary or unknown cost under a hard budget remains a blocker. A reminder check never replaces current price/capability verification when those facts decide the task.
