# Evaluation cases

Run these as bounded drafting exercises after substantive recipe changes. Compare output with the assertions. Structural checks do not establish persuasive effectiveness or replace a listening test.

| Case | Input | Required behaviour | Failure |
|---|---|---|---|
| Missing occurrence | Programme supplied; no date, venue or event link | Draft evergreen copy, mark unknown occurrence fields; ask only material questions | Inventing a date, borrowing an old date, or calling the pack publication-ready |
| Syllabus versus outcome | Programme says instructor demonstrates a workflow | Promise seeing/understanding the demonstration, subject to actual facts | "Leave with a completed workflow" without evidence |
| Unknown voice model | Request ElevenLabs script without model/voice | Clean text, separate directions and pronunciation map; mark selections unknown | Invented IDs/settings, tags or SSML in input |
| Confirmed v3 | v3 selected; request dramatic pauses | Sparse supported tags only if justified and verified; normal punctuation; no SSML break | `<break>` in v3 input or an unsupported freeform stage instruction |
| New model | New model named without capabilities | Check current documentation or use plain-text fallback | Assuming all non-v3 models accept SSML |
| Competing asks | Draft says follow, comment, register and visit site | Select one primary action matching the approved goal; caption/overlay support it | Keeping four competing actions as a "single CTA" |
| Repetition | Two successive lines say AI saves time in different words | Cut one unless it supplies proof or deliberate recall; explain intentional repetition | Padding the script with paraphrases |
| Expired occurrence | Reuse last month's master for a new event | Recheck programme fit, date, time/timezone, location/access, status, price if used, availability, exact link; isolate changed insert | Treating a date substitution as release verification |
| Unavailable link | Instagram placement supplied; profile link unknown | Label access path pending and provide an actionable setup need | Claiming "link in bio" is live |
| Nonintroductory course | Advanced prerequisites supplied | Describe fit accurately without calling it a first step for beginners | Overriding the programme to fit the recipe |
| Duration pressure | 120 words requested in 30 seconds | Count, estimate with explicit pace/pauses, shorten or flag mismatch | Declaring exact timing without audition or forcing unnaturally fast delivery |
| Locale boundary | Local-language channel and future English channel | Produce current requested language only; natural separate adaptation if requested | Mixing languages automatically |
| Invitation energy | Caller wants an intriguing event invitation; draft is a how-to lesson | Give a concrete reason to attend and progression from useful possibility to action; preserve simple language | Tutorial drift, generic motivational hype, or bland slogans |
| Scoped preferences | Informal address requested for local campaign; no CTA requested earlier for profile bio | Preserve the campaign's chosen form of address and primary invitation; record scope | Applying profile-bio preferences to event advertising or globalising one locale |
| Frugal coherent handoff | Reusable local motion preferred; paid generation only for flair; prior 3D/card disconnect rejected | Record budget/asset and visual-continuity constraints for later design; no generation | Ignoring the rejection reason, promising free labour, or starting paid rendering |
| Three means three | Full default copy request with independent workers available | Three leaf writers, each one complete spoken/screen variant from distinct perspective; fourth after review | Nine drafts, three hooks only, or a fourth before review |
| Independence and slots | Only one free worker slot | Queue isolated writers against the same frozen brief; withhold sibling drafts | Calling role-play independent agents or copying one writer's wording into the next brief |
| Leaf recursion | Worker sees WRITE-COPY-WRITER-RESOLVED | Return only assigned candidate and stop | Worker spawning three more writers or invoking review engine |
| Actual review dependency | Cross-examine missing from installation | Report missing dependency; drafts explicitly unreviewed | Simulating a review and claiming the named skill ran |
| Coherent fourth | Each initial variant has a strong but incompatible opening | Choose/refine one coherent line, explain discarded parts, preserve word budget and original drafts | Concatenating openings or forcing every variant into the hybrid |
| Scan clarity | Four full variants ready | Check offering, benefit and action discernible on skim; short native wording retains facts | Child-directed tone, unsupported reading-age guarantee or omitted qualifiers |
| Review depth guard | Adequate three-candidate set ready | Actual inline cross-examine with its real inline siblings and CX-RESOLVED; one bounded invocation | Three extra review agents, copied engine, hidden deep loops or new full-copy fan-out |

## Selective voice delivery cases

| Case | Input | Required behaviour | Failure |
|---|---|---|---|
| Selective energy | Approved full script; caller rejects uniformly expressive delivery | Full spoken script / Delivery table with sparse exact emphasis spans, intent, regular lines and release to baseline | Every phrase stressed, louder global style presented as local control, or missing CTA |
| Four-variant parity | Three independent candidates and a fourth synthesis | Each full candidate and V4 has complete ordered delivery table and separate clean master | Only the winner has direction or table replaces the speakable master |
| Flow and pauses | Long benefit sentence should flow into a reassuring line | Light accents with intentional continuous flow; pauses only at useful locations, durations estimated if given | Mandatory pause after every phrase or exact timing claimed before audio |
| Payload separation | Review table uses bold, pace notes and estimated pauses; model unknown | Plain spoken payload without bold/notes/tags, supported-control limitation explicit | Table copied into synthesis or invented emphasis/SSML controls |
| Clearly spoken domain | Written domain supplied with caller-approved spoken form | Preserve written domain in overlays/link; use approved spoken form in clean narration and payload; require listening check | Rewrite exact URL, omit domain ending, or assume a brand-specific pronunciation globally |
| Casting versus full take | Only a short audition was generated | Label casting excerpt and included span; full approved-script coverage and delivery still pending | Claim full narration ready or evaluate whole-script flow from excerpt |
| Adaptable arc | Advanced event or solemn subject supplied | Adapt intent and stress to topic, preserving factual fit | Forcing introductory reassurance or excited CTA into every subject |

## Review record

For each exercised case record input, output excerpt, pass/fail with the discriminating observation, version, date, and limitations. Do not claim these cases passed merely because they are listed here. Keep actual run records in the working project, not inside this reusable specification unless intentionally maintaining fixtures.
