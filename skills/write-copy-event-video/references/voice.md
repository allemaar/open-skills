# Voice preparation and ElevenLabs handoff

Reference version: 2026-09-29. This file prepares text; it never authorizes synthesis, paid generation, cloning, or publishing.

## Three separate layers

1. **Clean spoken text:** words intended to be heard, without labels or stage directions. This is the editorial master.
2. **Delivery brief:** locale, accent preference, register, pace, energy, emphasis, pauses, pronunciation, and casting passage. This is not TTS input text.
3. **Provider input text:** a copy of the spoken text with only syntax supported by the explicitly selected model. Label the model/capability status. This is not a fabricated API request with guessed IDs or settings.

Write for the ear. Prefer short complete thoughts, natural transitions, and ordinary words in the target locale. Read numbers, dates, names and URLs as a listener would hear them. Put intended spoken forms and ambiguous pronunciations in a table; distinguish a pronunciation hint from a provider-specific pronunciation dictionary. Confirm unverified proper names rather than inventing phonetics.

## Model-aware adapter

| Model status | Input text |
|---|---|
| Unknown, new, or capabilities not verified | Clean plain text and normal punctuation. Leave model/voice/settings as not selected. |
| Confirmed Eleven v3 | Plain text by default; sparse supported audio tags when helpful. No SSML `<break>` tags. Tags can affect delivery unpredictably and require listening. |
| A specific model verified to support SSML breaks | Supported markup only, within documented limits; never infer support merely because the model is not v3. |

Current official references: [Text to speech playground](https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech) and [best practices](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices). Model names and syntax evolve. Do not describe v3 as the latest model. Verify a selected newer model independently.

Never put freeform directions such as `[warm corporate voice, smile and pause for two seconds]` in a payload. Do not mix SSML with v3 audio tags. Do not convert every sentence into an emotion tag. A plain script is preferable to unsupported control syntax.

## Selective delivery, not constant expression

For every full variant, including the final synthesis, show the **entire** spoken script in order beside its delivery plan:

| Full spoken script | Delivery |
|---|---|
| Exact approved line, optionally with **selected words** bold for human review. | Regular baseline or a small change in intent; exact emphasis span and reason; optional pause before/after; return to baseline. |

The table must cover all lines, including the CTA and any spoken occurrence insert. It is a review view, not a replacement for the clean master. Bold means intended selective emphasis, not increased volume or supported TTS syntax.

- Establish a natural conversational baseline for the audience. Leave most words at that baseline, including whole lines when appropriate.
- Select only words that carry a useful contrast, benefit, offering name or next action. Explain what their emphasis should communicate. Do not stress every adjective or attach emotion to every sentence.
- Describe the progression and release: a brief lift should settle back into regular delivery. Benefits in a list may flow through light accents rather than become three separate announcements.
- Add a pause only for comprehension, contrast, a transition or clear pronunciation. State its exact location. Use a qualitative cue or an explicitly estimated duration when useful; do not prescribe a pause after every idea. Mark intentional continuous flow or no added pause where needed. Include planned pauses in the timing budget without counting sentence spacing twice.
- An introductory invitation may follow conversational baseline, brief lift, flowing benefits, reassurance, then a clear CTA. Adapt or omit phases for the actual message; this is not a compulsory emotional arc for every topic.
- Put sound-effect ideas in the visual/sound handoff. A spoken instruction to sound like a whoosh is not a delivery control.

### Pronunciation and provider capability

List written versus intended spoken forms for names, abbreviations, domains and difficult terms. Keep the screen spelling and exact destination intact. A domain may need an explicit spoken separator in the selected language; use a campaign-specific form and audition it, never a universal brand pronunciation. An approved spoken expansion belongs in the clean master and payload; explanations of that expansion stay outside both.

Global style or expressiveness settings do not implement word-specific stress. A model may expose no reliable local-emphasis control. State that limitation and retain the table as intended direction, not a claim of enforced or audible emphasis. Use only controls documented for the chosen model. Do not invent emphasis tags, assume punctuation or capitals guarantee stress, or raise global expression to simulate selective accents. A neutral global-style baseline may be a useful test where supported, not a universal numeric setting.

## Delivery brief template

> Read in natural [language and locale] for [audience/register]. Baseline: [conversational intent and pace]. Follow the line-level delivery table for the few selected accents, transitions and optional pauses; keep the remaining words natural. Avoid [unwanted delivery]. Pronunciations: [verified forms]. Read only the approved spoken text.

Direction is a casting/production note, not guaranteed model behaviour. Do not imitate a real person or propose cloning without the applicable consent. Voice selection and production require their own rights and cost checks.

## Timing and audition handoff

Count the actual spoken words. State the assumed words-per-minute range and estimate `words / rate * 60`, then add explicit pauses and silent holds. Treat these as estimates, not measured duration. Reduce words when the speech budget is exceeded; do not force an unnatural speed.

When casting is needed and audio production is separately requested, propose two or three short takes of the same passage containing difficult terms and a meaningful change of emphasis. Label each **casting excerpt** and identify the included lines; do not present it as the full approved narration. Listen for intelligibility, naturalness, pronunciation, energy and fit. Select a voice, then evaluate one complete approved script for missing lines, flow, sparse emphasis, release to baseline, pauses and clearly spoken names/domains. Excerpt approval does not approve full-script delivery. Compare the actual audible result with the table before calling any emphasis achieved. Keep the resulting audio, selected settings, rights, actual cost and audition verdict in the production record. Unknowns stay unknown; a draft text is not auditioned audio.

Use the selected voice timing to guide the picture. Sound may support an actual physical action or transition; silence is often appropriate for a thought or text reveal. Music is optional. No universal gain/loudness setting can be prescribed from a script alone.

## Reuse

### Preserve an approved brand recipe

When the caller approves an audition as a reusable formula, retain the exact audio as the performance reference and load the campaign's local production guide on later work. Carry its preset ID/version, approval scope, provider, model, voice ID, all settings, exact input, pronunciation mapping, pause pattern and known limits into the voice handoff. Keep brand-specific values in that project's guide rather than imposing them on other brands or languages.

Reuse the approved audio when the spoken copy is unchanged. Identical settings do not guarantee identical generated performance. For new copy, preserve the selected voice and approved baseline, adapt selective emphasis and pauses to the meaning, and evaluate the complete new take. Do not silently recast, reset settings, switch models, or treat another language or voice as audition-approved. A small requested delivery refinement should change one meaningful control at a time; record the prior and new values and the listening verdict.

If a content-folder convention is supplied, place the copy pack and voice handoff with that piece's assets and version history. Keep shared recipes separate and reference them by version. Production handoff must preserve multiline Unicode text and supported markup through structured arguments or a provider-supported file input, not an unverified shell wrapper. Verify the returned history contains the complete script and intended settings before approving an output as the requested take. These are handoff instructions; this drafting skill still does not synthesize audio.

Keep occurrence details out of the evergreen narration when it preserves clarity. If the date must be spoken, isolate a short occurrence insert. A later insert requires pronunciation, timing and join checks in production; never assert that replacing a file is automatically seamless.
