---
name: write-spec
description: Synthesize a supplied conversation and established evidence into a behavioral specification, preserving decisions, acceptance, exclusions and unresolved matters. Use for a spec draft, not automatic planning or publication.
visibility: public
updated: 2026-10-31
triggers:
  - "/write-spec"
  - "turn this conversation into a spec"
  - "write the spec from our decisions"
  - "capture the agreed behavior as a specification"
next-skills: []
---

# Write a specification

Synthesize supplied discussion and established evidence into a standalone spec. Do not restart an interview, conduct open-ended research or invent decisions to appear ready.

## Reconcile the input

Identify the problem, audience, current behavior, desired behavior and supplied source boundaries. Read the selected material completely. If it is unavailable or too large to read within scope, state coverage and do not claim complete synthesis. An existing repository spec format governs the output when applicable.

Track later corrections against earlier statements. Where current authority clearly supersedes a choice, state the current choice coherently rather than presenting both as active requirements. Retain the older alternative only when needed to explain a consequential tradeoff. If authority or meaning is disputed, preserve the disagreement as unresolved.

Separate observed facts, agreed requirements and proposed choices. A source file can establish what code does; it cannot silently approve what the product should do. Interview answers, prototype observations and suggested defaults retain their actual status. Preserve negations, numbers, units, scope limits, attribution and uncertainty.

## Shape the spec

Use only sections that help this reader act. A typical document includes:

- Problem, audience and present behavior.
- Intended behavior and meaningful examples.
- Acceptance evidence: what observation would distinguish success from failure.
- Established constraints and decisions, with source pointers where useful.
- Non-goals and compatibility requirements.
- Unresolved questions and their consequences for readiness.

Scale detail to the task: refactors need invariants, operations may need actors and exceptions. Invent neither exhaustive stories nor a fixed architecture.

Record testing decisions already made. Do not select new seams or implementation methods by implication. A small exact prototype fragment may be retained when it expresses an established rule more precisely than prose; identify it as modeled evidence and omit irrelevant demo machinery. Paths and snippets belong only where their exact identity helps understand a requirement, rather than as an invented task list.

## Reconcile and return

Reconcile consequential inputs as active, superseded, unresolved or explicitly excluded. Retain rejected alternatives affecting interpretation. The spec must stand without these reconciliation notes.

An incomplete conversation can yield a useful spec draft. State exactly which gaps block implementation or approval and which are harmless detail. Producing a spec does not establish approval of its behavior, an executable plan, or permission to implement it. Do not add tracker labels, create tickets, publish or start execution.

Return the draft in the conversation unless the exact save is authorized. For a save, resolve the intended owner and destination, inspect the target and ancestors without following redirects, read current content and retain recovery before a scoped replacement. Preserve unrelated and concurrent edits; an overlapping change needs reconciliation. Existing exact-save authorization needs no second permission question. Missing destination or unsafe ownership yields proposed text with an honest unsaved status.

Report the saved path or text-only disposition, source coverage, material unresolved matters and readiness limits. Source material remains available; synthesis authorizes no cleanup or deletion.
