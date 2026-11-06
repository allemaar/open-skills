# Working on open-skills

These instructions apply to this repository. Read [scope](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before changing skills or documentation.

- [open-skills.source] SKILL.md and its selected resources own skill behavior. Keep any protocol.yon aligned with that behavior; structural validity does not establish runtime obedience.
- [open-skills.scope] Make the smallest complete selected change. Preserve invocation policy, safeguards, dependencies and unrelated work; a recipe or conditional route can be enough without another skill.
- [open-skills.docs] Every public skill needs a source-grounded guide. Edit docs/skill-guides.json after reading its cited sources; tools/skill-docs.mjs defines the editorial model. Explain the reader's situation, mechanism, role, practical questions and recognizable result without inventing experience or behavior.
- [open-skills.generated] tools/spine.mjs owns catalogs, taxonomy projections, SKILLS.md, skills.sh.json and generated guides. tools/conformance.mjs owns CONFORMANCE.md. Do not hand-edit emitted files or refresh a source fingerprint without reconciling its guide.
- [open-skills.discovery] Add, rename or retire a skill together with its taxonomy assignment, guide disposition, README entry points and changelog. Counts and release versions move through their existing owners.
- [open-skills.installation] docs/installation.md owns shared installation/update wording. Keep source checks, installed bytes, runtime pickup and directory visibility as separate evidence claims. Existing links, editable copies and managed installs have different update owners.
- [open-skills.verification] Inspect command effects, then use proportionate checks for the actual candidate. Preserve recovery material outside public/discovery output and report failed or unrun checks. Do not turn optional examples or review into hidden dependencies.
- [open-skills.release] Follow the maintainer closeout in CONTRIBUTING.md. Record the exact intended scope and DCO identity before a commit. Editing does not itself authorize installation, deletion, Git publication or outreach.

[Glossary](GLOSSARY.md) · [Guides](docs/README.md) · [Workflow recipes](docs/workflows/README.md)
