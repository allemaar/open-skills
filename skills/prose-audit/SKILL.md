---
name: prose-audit
description: >
  Diagnose semantic repetition, filler, fake structure, stock AI rhetoric, and avoidable reading load in existing text. Trigger phrases: "/prose-audit", "find the AI filler", "audit this for bloat". Not for rewriting text; use /human-rewrite after diagnosis.
visibility: public
companions:
  - path: references/pattern-catalog.md
    optional: false
    why: "The grouped pattern taxonomy used during diagnosis."
  - path: references/pattern-index.md
    optional: false
    why: "The complete 258-item coverage index from the originating discussion."
triggers:
  - "/prose-audit"
  - "find the AI filler"
  - "audit this for bloat"
  - "identify repetition and token padding"
next-skills:
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "Remove the diagnosed load while preserving every claim and caveat."
---

# /prose-audit

Find text that consumes attention without changing meaning, action, confidence,
or evidence. Diagnose only. Do not rewrite unless the Handler also asks for it.

Read [`references/pattern-catalog.md`](references/pattern-catalog.md) and the
complete [`references/pattern-index.md`](references/pattern-index.md) before
grading. Treat them as search surfaces, not checklists that must appear in the
report. The index is the coverage contract. Every discussed pattern has one
stable ID from P001 through P258.

## Unit of analysis

Classify each sentence or structural element by the unique job it performs:

- verdict or answer;
- claim or distinction;
- evidence or example;
- consequence or decision impact;
- necessary uncertainty, scope, or attribution;
- instruction or next action;
- navigation required by a genuinely long artifact.

If an element performs none of these jobs, it is removable. If another element
already performs the same job at the same resolution, it is redundant. A style
habit is not a defect when it carries deliberate tone or meaning.

## Severity

- **High:** hides the verdict, repeats a claim, obscures evidence, creates false
  balance, or makes the reader process a structure that carries no distinction.
- **Medium:** inflates a sentence or section without changing its claim.
- **Low:** stock texture such as an unnecessary triad, litotes, generic
  transition, or polished-sounding abstraction.

Do not call text AI-generated. Report only observed patterns. One pattern is
weak evidence of authorship. Dense, repeated clusters are stronger evidence of
a writing habit, still not proof of origin.

## Output

Lead with one verdict and the practical compression opportunity. Then report
only the findings that account for most of the load:

```text
VERDICT: <one sentence>

HIGH  <pattern> -> <short quoted or located example> -> <why it adds no value>
MED   <pattern> -> <example> -> <cost>
LOW   <pattern> -> <example> -> <cost>

KEEP: <density or structure that is justified>
UNCHECKED: <material not inspected, or none>
```

Combine repeated instances under one finding. Give counts only when actually
counted. Do not reproduce the whole source. If the Handler asks for every hit,
append a compact occurrence inventory after the verdict.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol
> (`next-skills/SKILL.md`): surface the `next-skills` recommendations from
> frontmatter for the caller to pick. Offer only. Never auto-invoke.
