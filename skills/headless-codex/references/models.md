# Codex headless model availability

This page explains model evidence. The machine-readable freshness source is `model-state.json`, checked before every run by `../scripts/check-model-freshness.mjs` when Node is available or by the identical `policy.reminderDays` logic in `SKILL.md`. Missing, future-dated, failed, or invalidated evidence is due immediately. A due snapshot is never refreshed automatically, and an explicit Handler selection is never replaced by a recommendation.

**Written:** 2026-09-10  
**Last verified:** 2026-10-14

Model availability is runtime-, account-, workspace-, and client-specific. Discover it immediately before a consequential run:

```text
codex debug models
```

Use only entries whose local catalog reports `visibility: "list"`. Treat hidden or other visibility values as implementation detail, not selectable evidence. Do not use the OpenAI API model catalog as a Codex CLI allowlist.

## Local CLI observation

In Codex CLI 0.160.0 on 2026-10-14, the exposed local catalog contained:

| Local choice | Supported efforts observed |
| --- | --- |
| `gpt-6.1-sol`, `gpt-6-sol`, `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra` | low, medium, high, xhigh, max, ultra |
| `gpt-6-luna`, `gpt-5.6-luna` | low, medium, high, xhigh, max |

Hidden: `gpt-reserve`, `codex-auto-review`; not selectable. There is no GPT-6 Terra. `gpt-5.5` was retired from ChatGPT-login Codex on 2026-10-14. `ultra` splits a divisible task across subagents; it is not deeper single-run reasoning.

## Official documentation, kept separate

Official OpenAI documentation current on 2026-10-14 ([Codex models](https://learn.chatgpt.com/docs/models)) documents GPT-6 Astra, GPT-6.1 Sol, GPT-6 Sol, GPT-6 Luna and the GPT-5.6 Sol, Terra, and Luna family. These pages describe model capabilities and supported reasoning efforts for OpenAI products and APIs. They do not guarantee Codex CLI availability for any particular account.

- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) documents non-interactive `codex exec`, model and permission selection, and CLI use in repeatable workflows.
- [Build skills](https://learn.chatgpt.com/docs/build-skills) documents literal `$skill-name` invocation and progressive skill loading.
- [GPT-6 Astra](https://developers.openai.com/api/docs/guides/latest-model) is the current official model guidance entry point; it explicitly notes that supported reasoning settings vary by model.
- [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol), [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra), and [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) document those API model variants.

The local CLI catalog is authoritative for a headless run. Documentation is authoritative for documented behavior, but not for account entitlement or local selection.
