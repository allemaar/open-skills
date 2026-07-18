# human-spec — the shared contract for the `human-` family

> Apache-2.0. Shared doctrine (not a skill). This folder ships no `SKILL.md`,
> installs nothing, and is not part of the skill count — exactly like
> [`orient-spec/`](../orient-spec/). It exists so the `human-` skills agree on
> one rulebook instead of each carrying a copy of it.

## What `human-` is

A family about the **last mile**: work has been done, and now a person has to
read it and act. Each member owns one shape that material can take.

| Member | Owns |
|---|---|
| [`human-output`](../skills/human-output/SKILL.md) | The contract for text you are about to write. Five rules, then the craft. |
| [`human-rewrite`](../skills/human-rewrite/SKILL.md) | The repair pass on text that already exists, without changing what it claims. |
| [`human-draw`](../skills/human-draw/SKILL.md) | The picture: seven shapes in printable ASCII on a monospace grid. |
| [`human-merge`](../skills/human-merge/SKILL.md) | Several separate reports into one surface a person can decide from. |

## The files here

| File | What it is |
|---|---|
| [`human-contract.md`](human-contract.md) | The roster and routing table (which member handles which material), the stopping-point doctrine, the checker contract and its limits, and the shared footer. |

There is **no machine record** in this family — no schema, nothing emitted. The
contract is prose plus one checker, [`tools/human-output-check.mjs`](../tools/human-output-check.mjs),
which grades the mechanical half only.

## Check it yourself

```bash
# run from the open-skills/ repo root
node tools/human-output-check.mjs skills/human-draw/SKILL.md
node tools/human-output-check.mjs --self-test
```
