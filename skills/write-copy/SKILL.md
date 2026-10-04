---
name: write-copy
description: Route promotional copy to a topic specialization. Use /write-copy, "write campaign copy", or "write event copy". For a known event video use write-copy-event-video directly; for faithful prose repair use human-rewrite.
visibility: public
triggers:
  - "/write-copy"
  - "write campaign copy"
  - "write event copy"
requires-skills:
  - write-copy-event-video
next-skills: []
---

# /write-copy

Write promotional copy from verified facts and a clear audience need. This is the family entry point. Drafting does not authorize publishing, media generation, purchases, or changes to accounts.

## Route by subject and purpose

Use the existing conversation before asking for missing information. Identify the subject being promoted, audience, desired action, language, and delivery medium. Topic and medium are separate: an event is a topic; a video is a medium. Do not turn every writing task into an event advertisement.

| Requested work | Route |
|---|---|
| Course, workshop, session, conference, or other event promoted through a campaign video, including its narration and post caption | Read and follow [write-copy-event-video](../write-copy-event-video/SKILL.md) |
| Event video already has an approved message and needs a copy revision | Same specialist; preserve the approved promise, facts, tone, and scope |
| News, product launch, service campaign, fundraising, or another topic | No specialization is implemented yet. Say so; offer an ordinary copy draft scoped to that topic, without claiming a tested family recipe |
| Prose cleanup with no promotional strategy request | Use [human-rewrite](../human-rewrite/SKILL.md) if installed; otherwise perform the requested faithful edit directly |

If the event specialist is absent, identify the missing dependency. Do not silently invent its workflow. The prose-repair sibling is optional and is not required for event copy.

## Family contract

- Preserve the requested audience, language, register, and commercial intent. Do not infer the output language from the language of the conversation alone.
- Separate facts, promised outcomes, and creative hypotheses. Unknowns remain visible in a draft.
- Deliver usable text with a single primary action, not a catalogue of marketing techniques.
- Keep spoken words, on-screen words, delivery directions, and publishing captions distinguishable.
- Design variations follow an agreed copy direction; drafting does not start production automatically.
- The event-video specialization normally commissions three independent complete copy variants, cross-examines them, then presents a fourth recommended synthesis first. Three means three total initial copies, not three per writer. An explicitly narrower revision may keep its requested scope.

## Extending the family

Add a specialization only when a repeatable topic or purpose requires distinct inputs, evidence, techniques, or output checks. Name it `write-copy-<specialization>`, declare its trigger boundary, and add one explicit route here plus a taxonomy assignment. A medium-specific adapter belongs inside a specialization until it warrants a separate reusable workflow. Do not advertise planned specializations as available.
