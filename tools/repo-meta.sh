#!/usr/bin/env bash
# repo-meta.sh — versioned, reproducible GitHub repository metadata for open-skills.
#
# The repo's "About", homepage, and Topics are the one discovery surface that lives
# OUTSIDE the tree (on GitHub's servers). This script is their single source of truth:
# editing metadata here + re-running `apply` keeps the live repo == this file.
#
# Usage:
#   tools/repo-meta.sh apply    # push the declared metadata to the live repo (gh repo edit)
#   tools/repo-meta.sh check    # diff live metadata against this file; exit 1 on drift
#   tools/repo-meta.sh print    # print the declared metadata as JSON
#
# Requires: gh (authenticated). Uses gh's embedded --jq; no external jq needed.
# NOTE: the 1280x640 social-preview card is uploaded manually via the GitHub web UI
#       (Settings -> Social preview) — there is no gh/API path for it. See assets/social-preview.svg.
#
# Apache-2.0. open-skills is a personal project by Alexandru Mares, separate from the
# YounndAI product portfolio. See NOTICE and TRADEMARK.md.

set -euo pipefail

REPO="allemaar/open-skills"

DESCRIPTION="Readable agent skills with optional declarative YON protocols you can inspect and validate. A personal, field-used pack by Alexandru Mares."
HOMEPAGE="https://allemaar.com"

# ~12-15 on-target topics (plan Phase 4 cap = 15). Keep on-target; do not over-stuff.
TOPICS=(
  agent-protocol
  agent-skills
  agent-workflows
  ai-agents
  anthropic
  claude
  claude-code
  code-review
  codex
  developer-tools
  llm
  llm-agents
  prompt-engineering
  yon
)

# Normalized one-field-per-line form for stable diffing — no external jq.
declared_repr() {
  printf 'description\t%s\n' "$DESCRIPTION"
  printf 'homepage\t%s\n' "$HOMEPAGE"
  for t in $(printf '%s\n' "${TOPICS[@]}" | sort); do printf 'topic\t%s\n' "$t"; done
}

live_repr() {
  printf 'description\t%s\n' "$(gh repo view "$REPO" --json description --jq '.description')"
  printf 'homepage\t%s\n' "$(gh repo view "$REPO" --json homepageUrl --jq '.homepageUrl')"
  gh repo view "$REPO" --json repositoryTopics \
    --jq '.repositoryTopics[].name' | sort | while read -r t; do printf 'topic\t%s\n' "$t"; done
}

cmd="${1:-check}"
case "$cmd" in
  print)
    declared_repr
    ;;
  apply)
    args=( --description "$DESCRIPTION" --homepage "$HOMEPAGE" )
    gh repo edit "$REPO" "${args[@]}"
    topic_args=()
    for t in "${TOPICS[@]}"; do topic_args+=( -f "names[]=$t" ); done
    gh api --method PUT "repos/$REPO/topics" \
      -H "Accept: application/vnd.github+json" \
      "${topic_args[@]}" >/dev/null
    echo "applied: description, homepage, exact ${#TOPICS[@]}-topic set -> $REPO"
    ;;
  check)
    if diff <(declared_repr) <(live_repr) >/dev/null; then
      echo "repo-meta: in sync ($REPO)"
    else
      echo "repo-meta: DRIFT ($REPO)" >&2
      diff <(declared_repr) <(live_repr) || true
      exit 1
    fi
    ;;
  *)
    echo "usage: repo-meta.sh {apply|check|print}" >&2
    exit 2
    ;;
esac
