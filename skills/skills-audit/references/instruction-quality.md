# Instruction quality

Use for semantic value and compression.

## Establish the contract

Identify the skill's goal, authority, inputs, outputs, stop conditions, and observable completion. Label inferred intent. Where useful, state:

- `Goal`: result the skill exists to produce.
- `Good`: observable result that satisfies it.
- `Bad`: plausible result the skill must prevent.

Do not force this framing when it adds no decision value.

## Inspect every instruction

Ask what changes if the instruction disappears.

- Keep unique constraints, decisions, evidence requirements, permissions, gates, fallbacks, and routing.
- Cut filler, restated purpose, repeated conclusions, generic competence advice, decorative structure, and examples that only paraphrase a rule.
- Rewrite vague qualities such as "be thorough" into observable requirements, or cut them when the task already supplies the objective.
- Move history, rationale, edge cases, and domain detail out of the hot path when they are conditionally useful.
- Flag contradictions, incompatible defaults, ambiguous precedence, and rules whose examples reverse the stated contract.
- Count token or word load only when measured. Distinguish source size from per-invocation load.

## Guardrails

Never compress away authority, safety, authorization, scope, negation, numbers, units, exact syntax, stop conditions, reversing caveats, uncertainty, provenance, or failure behavior.

Prefer direct constraints. Retain rationale only when it disambiguates application, prevents a predictable misread, or records why an unusual safeguard exists.

Use a do/don't matrix only when behavior genuinely differs by use case. Universal rules stay direct. A matrix that repeats prose is token burn.

Positive guidance is justified when it defines a concrete output, decision rule, or observable success state. Generic aspiration is not operational guidance.

[load.complete] skills-audit.instruction-quality

