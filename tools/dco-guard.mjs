// DCO sign-off guard.
//
// CONTRIBUTING.md states the Developer Certificate of Origin as a requirement.
// Nothing ran it, so the rule drifted against our own history: 7 of the 29 commits
// between v1.1.0 and the floor below carry no sign-off. A stated rule with no gate
// is a wish; this is the gate.
//
// WHAT IT CHECKS, PRECISELY: that a commit carries a `Signed-off-by:` git trailer
// whose value is a non-empty name and an email. It grades the trailer's SHAPE. It
// does NOT verify the name is real, and it does NOT compare the sign-off to the
// commit author — the DCO is a certification you make, not an identity we can
// authenticate. THREAT-MODEL.md's point applies to us too: a plain-text assertion
// nobody authenticates is not provenance.
//
// Trailers are parsed by `git interpret-trailers`, not by scanning the message. A
// regex over the whole message passes a commit that merely QUOTES a sign-off. See
// signoffValues() for what that does and does not cover.
//
// FORWARD-ONLY, by design. Enforcement starts at FLOOR — the commit that was HEAD
// when this guard landed. The unsigned commits before it stay unsigned: they are
// published, and rewriting them would mean a force-push over history other people
// may already have cloned. A DCO remediation commit could record sign-off for them
// without any rewrite, and may still land. Until it does, those commits carry no
// certification: this closes the gap going forward, it does not backfill it.
//
// Merge commits are exempt (`--no-merges`): the forge generates them, so their
// message certifies nothing. The DCO GitHub App skips them by default for the same
// reason. An evil merge (content in a merge commit, in neither parent) is out of
// scope — it requires push access to land.
//
// IF AN UNSIGNED COMMIT REACHES main (a web edit, an edited squash message, an
// admin bypass): push builds grade FLOOR..HEAD, so that commit fails every later
// push build — it never leaves the range. Do NOT reach for the remediation lines
// this guard prints; on published main they mean a force-push, which is the act
// this design refuses. The sanctioned recovery is to move FLOOR forward to that
// commit and say so in the CHANGELOG: the gap is recorded rather than rewritten.
// Pull requests are unaffected (DCO_BASE grades a PR on its own commits).
//
// Usage:  node tools/dco-guard.mjs
//         node tools/dco-guard.mjs --message-file <path>   # grade one message (gate-fires proof)
// Env:    DCO_BASE=<40-hex sha>  grade from this base instead of FLOOR. CI sets it to
//         the PR's base sha so a PR is graded on ITS OWN commits — otherwise one
//         unsigned commit on main red-lines every later PR for a commit its author
//         never wrote.
// Exit:   0 pass · 1 a commit fails / the range cannot be trusted · 2 bad usage.
//         Zero npm deps.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();

// The accepted published baseline for DCO enforcement. Everything after it must
// be signed, except merge commits (see above). It began as the commit where this
// guard landed and advances only through the documented published-main recovery.
const FLOOR = '88d44f0e12c0f889250469c88bbcc3798dd51bd7';

// The trailer VALUE: a non-empty name, then an angle-bracketed email (a local part
// and a host, `@` between). `^\S` rejects "Signed-off-by: <a@b.c>" — no name at all.
// The host is NOT required to be dotted: git's own default sign-off is user@hostname,
// and a dotless host (localhost, a laptop name) is a real sign-off, not a defect.
const VALUE = /^(\S.*?)\s*<([^<>@\s]+@[^<>@\s]+)>$/;

// maxBuffer: a pathological trailer block must not blow past the 1 MB default and
// throw. An uncaught throw here would exit 1 — scoring a CRASH as a rejection, the
// very thing gate-fires' `mustSay` exists to prevent. This guard is not exempt.
const git = (args, opts = {}) =>
  execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });

// Let git decide what a trailer IS; we only grade the value. Git is the authority
// on trailers, so we defer to it rather than re-deciding the question here. This is
// the half a message-wide regex gets wrong: a regex matches a `Signed-off-by:` line
// ANYWHERE, so a commit that merely QUOTES one in its body passes. Git reads only
// the last paragraph, so those are rejected.
//
// KNOWN LIMIT, accepted deliberately. Git's trailer block is the last paragraph,
// taken when >=25% of its lines look like trailers. A message whose LAST paragraph
// is a fenced example —
//   ```
//   Signed-off-by: Jane Dev <jane@example.com>
//   ```
// — is 1-of-3 trailer lines, so git calls it a real trailer and an unsigned commit
// passes. Telling that from a genuine sign-off means parsing CommonMark fences,
// which was tried and rejected: three attempts each closed the shape that failed
// last time and left the class open, and stripping fences swallowed the real
// trailer of anyone whose fence was unclosed — rejecting an honestly-signed commit
// with advice that could not fix it. That trade is backwards. This guard grades
// SHAPE, not identity: anyone can type a valid trailer, so the bypass wins nothing
// that honesty doesn't already give away, while the false reject blocked the exact
// contributor the guard is for. The job here is catching a forgotten `-s`, which is
// how the 7 unsigned commits below happened — not defeating an adversary.
function signoffValues(message) {
  const parsed = git(['interpret-trailers', '--parse'], { input: message });
  return parsed
    .split(/\r?\n/)
    .filter((line) => /^Signed-off-by:/i.test(line))
    .map((line) => line.slice(line.indexOf(':') + 1).trim());
}

const hasSignoff = (message) => signoffValues(message).some((v) => VALUE.test(v));

// --- single-message mode (used by gate-fires to prove the predicate rejects) ---

const flagIndex = process.argv.indexOf('--message-file');
if (flagIndex !== -1) {
  const file = process.argv[flagIndex + 1];
  if (!file) {
    console.error('dco-guard: --message-file needs a path');
    process.exit(2);
  }
  let message;
  try {
    message = readFileSync(file, 'utf8');
  } catch (e) {
    // Exit 2, never 1: a missing fixture must not read as a legitimate rejection.
    console.error(`dco-guard: cannot read ${file} — ${e.code}`);
    process.exit(2);
  }
  let signed;
  try {
    signed = hasSignoff(message);
  } catch (e) {
    console.error(`dco-guard: could not grade ${file} — ${e.message}`);
    process.exit(2);
  }
  if (!signed) {
    console.error(`dco-guard: ${file} has no valid "Signed-off-by: Name <email>" trailer`);
    process.exit(1);
  }
  console.log(`dco-guard: OK — ${file} carries a valid sign-off`);
  process.exit(0);
}

// --- repo mode ---------------------------------------------------------------

// CI passes the PR's base sha so a PR is graded on its own commits. Fall back to
// FLOOR for pushes. Ignore a base that predates the floor — forward-only stands.
const envBase = process.env.DCO_BASE;
let base = FLOOR;
if (envBase && /^[0-9a-f]{40}$/.test(envBase)) {
  try {
    git(['cat-file', '-e', `${envBase}^{commit}`]);
    // Only honour a base at or after the floor, so DCO_BASE can never reach back
    // and grade the 7 published unsigned commits.
    git(['merge-base', '--is-ancestor', FLOOR, envBase]);
    base = envBase;
  } catch {
    base = FLOOR;
  }
}

// Fail closed: if the floor is absent the range is meaningless, and a guard that
// silently grades nothing is worse than no guard at all.
try {
  git(['cat-file', '-e', `${FLOOR}^{commit}`]);
} catch {
  console.error(
    `dco-guard: floor commit ${FLOOR.slice(0, 7)} not found. Either this clone is shallow ` +
      `(CI: set fetch-depth: 0 — locally: git fetch --unshallow), or the floor is no longer in ` +
      `this repo's history because it was rewritten (update FLOOR in tools/dco-guard.mjs).`,
  );
  process.exit(1);
}

let commits = [];
try {
  commits = git(['rev-list', '--no-merges', `${base}..HEAD`]).split(/\r?\n/).filter(Boolean);
} catch {
  console.error('dco-guard: could not list commits (is this a git repo?)');
  process.exit(1);
}

// Exit 2, never 1, if grading itself throws: a crash is not a rejection.
let unsigned = [];
try {
  unsigned = commits.filter((sha) => !hasSignoff(git(['log', '-1', '--format=%B', sha])));
} catch (e) {
  console.error(`dco-guard: could not grade commits — ${e.message}`);
  process.exit(2);
}

if (unsigned.length) {
  console.error(`dco-guard: ${unsigned.length} commit(s) after ${base.slice(0, 7)} without a DCO sign-off`);
  for (const sha of unsigned) {
    console.error(`  ✗ ${sha.slice(0, 7)} ${git(['log', '-1', '--format=%s', sha]).trim()}`);
  }
  console.error('\n  Sign off future commits:  git commit -s');
  console.error('  Fix the tip commit:       git commit --amend -s --no-edit');
  console.error('  Fix several commits:      git rebase --signoff origin/main');
  console.error('  Then re-push your branch: git push --force-with-lease');
  console.error('  See CONTRIBUTING.md > How contributions are licensed.');
  process.exit(1);
}

// Say "nothing in range" rather than "checked and clean" — they are not the same
// claim, and a checkout of an old tag legitimately grades zero commits.
if (!commits.length) {
  console.log(`dco-guard: OK — no commits in range after ${base.slice(0, 7)} (nothing to grade)`);
  process.exit(0);
}
console.log(`dco-guard: OK — ${commits.length} non-merge commit(s) after ${base.slice(0, 7)} all carry a DCO sign-off`);
