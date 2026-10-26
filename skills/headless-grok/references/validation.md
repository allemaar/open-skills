# Grok Build headless validation

Last researched: 2026-09-17 from xAI primary documentation. No `grok`, `grok-cli`, or `xai` executable was found on this host. No login, model call, permission change, inference, quota read, or paid action was performed.

## Documented, not locally tested

The official coding-agent CLI supports Windows, `grok -p`, `plain`, `json`, and `streaming-json` output, `grok models`, OIDC browser/device authentication, `XAI_API_KEY`, explicit permission/tool flags, session IDs and resume. The documented current coding/API model is Grok 4.6 with a 500k context window and configurable reasoning. Current xAI API list rates, reviewed 2026-09-17, are tiered by prompt length: below 200k prompt tokens, $2/M input, $0.50/M cached input, and $6/M output; at or above 200k prompt tokens, $4/M input, $1/M cached input, and $12/M output. These API rates are separate from consumer subscription usage.

Consumer paid plans use a shared weekly Chat/Imagine/Voice/Build pool visible in Settings -> Usage. API credits and billing are separate. X Premium or a Grok subscription does not prove API entitlement.

## Unproved boundaries

- CLI installation, version, exact local flag spelling, auth precedence and account model access.
- Windows sandbox containment, exact read-only enforcement, tool isolation and process-tree cancellation.
- Stable machine-readable output and quota schemas, hard native timeout, exact public subscription quota matrix.
- Resume behavior, write correctness, nested agents, web access and API-key billing on this host.
- On 2026-10-26, grok 1.0.70 rejected `--add-dir` with "additionalDirectories is not supported: a session works only in its cwd". Multi-root reviews need a single bundled cwd. The same run, with Grok 4.7 in plan mode, `--tools read_file,search_tool` and `--prompt-file`, succeeded by absolute executable path while the parent PATH was stale.

Recheck [headless scripting](https://docs.x.ai/build/cli/headless-scripting), [CLI reference](https://docs.x.ai/build/cli/reference), [permissions](https://docs.x.ai/build/features/permissions), [sandbox](https://docs.x.ai/build/features/sandbox), [sessions](https://docs.x.ai/build/features/sessions), [models](https://docs.x.ai/developers/models), [Grok 4.6](https://docs.x.ai/developers/grok-4-6), [API pricing](https://x.ai/api), [rate limits](https://docs.x.ai/developers/rate-limits), and [FAQ](https://docs.x.ai/grok/faq) before a material release or first live run.
