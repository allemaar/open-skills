// Focused comparison and recovery evidence. Fixtures remain for inspection.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { initialize, importSkill, publishSkill as publishReviewed, compareUpstream, guide } from './library.mjs';
import { tree, hash } from './safety.mjs';

const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'skill-library-comparison-'));
console.log(`Retained fixture: ${root}`);
const parent = path.join(root, 'source'); fs.mkdirSync(parent);
initialize({ folder: parent, family: 'demo', apply: true });
const library = path.join(parent, 'skills');
const state = path.join(root, 'private');
const opts = { library, state, name: 'demo-report' };
const upstream = path.join(root, 'upstream'); fs.mkdirSync(upstream);
fs.writeFileSync(path.join(upstream, 'SKILL.md'), '---\nname: report\ndescription: Summarize supplied facts.\n---\nUse only supplied facts.\n');
for (const name of ['local.txt', 'incoming.txt', 'same.txt', 'conflict.txt', 'removed-local.txt', 'removed-upstream.txt']) fs.writeFileSync(path.join(upstream, name), 'baseline');
fs.writeFileSync(path.join(upstream, 'provenance.json'), '{"origin":"older"}\n');
const staged = importSkill({ ...opts, from: upstream, origin: 'fixture', revision: 'v1', mode: 'variant', apply: true });
publishSkill({ ...opts, from: staged.candidate, 'content-reviewed': true, apply: true });
const current = path.join(library, opts.name);
const incoming = path.join(root, 'incoming'); fs.cpSync(upstream, incoming, { recursive: true });
fs.writeFileSync(path.join(current, 'local.txt'), 'local');
fs.writeFileSync(path.join(incoming, 'incoming.txt'), 'upstream');
for (const dir of [current, incoming]) fs.writeFileSync(path.join(dir, 'same.txt'), 'same change');
fs.writeFileSync(path.join(current, 'conflict.txt'), 'local');
fs.writeFileSync(path.join(incoming, 'conflict.txt'), 'different upstream');
// Fixture removals use single regular leaves, never recursive cleanup.
fs.unlinkSync(path.join(current, 'removed-local.txt'));
fs.unlinkSync(path.join(incoming, 'removed-upstream.txt'));
fs.writeFileSync(path.join(current, 'added-local.txt'), 'local addition');
fs.writeFileSync(path.join(incoming, 'added-upstream.txt'), 'upstream addition');
const snapshot = () => JSON.stringify([tree(library), tree(incoming), tree(state)]);
const before = snapshot();
const compared = compareUpstream({ ...opts, from: incoming });
const rows = new Map(compared.files.map(row => [row.path, row]));
for (const [file, expected] of Object.entries({ 'SKILL.md': 'unchanged', 'local.txt': 'local-only', 'incoming.txt': 'upstream-only', 'same.txt': 'same-change', 'conflict.txt': 'conflict', 'provenance.json': 'provenance-review', 'removed-local.txt': 'local-only', 'removed-upstream.txt': 'upstream-only', 'added-local.txt': 'local-only', 'added-upstream.txt': 'upstream-only' })) assert.equal(rows.get(file).state, expected, file);
assert.equal(rows.get('removed-local.txt').localChange, 'removed');
assert.equal(rows.get('added-upstream.txt').upstreamChange, 'added');
assert.notEqual(rows.get('SKILL.md').baseline.sha256, rows.get('SKILL.md').current.sha256, 'raw loader adaptation remains visible');
assert.equal(snapshot(), before, 'comparison writes neither source nor private state');
assert.throws(() => compareUpstream({ ...opts, from: incoming, apply: true }), /read-only/);
const helper = path.join(library, 'demo-skills-manager/scripts/library.mjs');
const standalone = JSON.parse(execFileSync(process.execPath, [helper, 'compare-upstream', '--library', library, '--name', opts.name, '--from', incoming, '--state', path.join(root, 'absent-state')], { encoding: 'utf8', timeout: 60_000, windowsHide: true }));
assert.equal(standalone.counts.conflict, 1);
assert.equal(fs.existsSync(path.join(root, 'absent-state')), false);
for (const topic of ['assess', 'self-improvement', 'recovery', 'compare-upstream']) assert.ok(guide({}).capabilities[topic]);
console.log('PASS offline three-way classification, raw metadata, unchanged inputs and standalone helper');

const provenancePath = path.join(current, 'provenance.json');
const provenanceBytes = fs.readFileSync(provenancePath);
const provenance = JSON.parse(provenanceBytes);
fs.writeFileSync(provenancePath, JSON.stringify({ ...provenance, baseline: '../escape' }));
assert.throws(() => compareUpstream({ ...opts, from: incoming }), /baseline/);
fs.writeFileSync(provenancePath, provenanceBytes);
const baselineFile = path.join(library, provenance.baseline, 'local.txt');
fs.writeFileSync(baselineFile, 'damaged baseline');
assert.throws(() => compareUpstream({ ...opts, from: incoming }), /baseline differs/);
fs.writeFileSync(baselineFile, 'baseline');
fs.appendFileSync(path.join(incoming, 'SKILL.md'), 'Upstream behavior changed.\n');
assert.equal(compareUpstream({ ...opts, from: incoming }).files.find(row => row.path === 'SKILL.md').state, 'upstream-only');
console.log('PASS damaged ancestry/path escape refusals and functional SKILL.md changes');

const draft = path.join(root, 'draft'); fs.cpSync(current, draft, { recursive: true });
const draftMd = path.join(draft, 'SKILL.md');
fs.writeFileSync(draftMd, fs.readFileSync(draftMd, 'utf8').replace('skill-version: 1.0.0', 'skill-version: 1.1.0'));
const expected = hash(`${JSON.stringify(tree(current), null, 2)}\n`);
const nativeRename = fs.renameSync;
fs.renameSync = (from, to) => {
  if (from.includes('publication-candidates') && to === current) throw new Error('fixture interrupted publication');
  return nativeRename(from, to);
};
try { assert.throws(() => publishSkill({ ...opts, from: draft, expected, 'content-reviewed': true, apply: true }), /Partial publish/); }
finally { fs.renameSync = nativeRename; }
const config = JSON.parse(fs.readFileSync(path.join(library, 'library.json')));
const privateRoot = path.join(state, config.id);
const lock = JSON.parse(fs.readFileSync(path.join(privateRoot, 'mutation.lock')));
const shared = JSON.parse(fs.readFileSync(path.join(library, '.library/mutation.lock')));
assert.equal(lock.id, shared.id);
const receipts = fs.readdirSync(path.join(privateRoot, 'recovery')).map(file => JSON.parse(fs.readFileSync(path.join(privateRoot, 'recovery', file))));
const receipt = receipts.find(row => row.receipt.mutationId === lock.id);
assert.equal(receipt.receipt.libraryId, config.id);
assert.equal(receipt.receipt.operation, 'publish');
assert.equal(hash(`${JSON.stringify(tree(current), null, 2)}\n`), expected, 'failed activation restored old complete source');
const retained = snapshot();
compareUpstream({ ...opts, from: incoming });
assert.equal(snapshot(), retained, 'read-only comparison preserves interrupted locks and receipts');
console.log('PASS failed publication correlates locks/receipt, restores original and preserves recovery');

const manager = path.join(library, 'demo-skills-manager');
const authoring = fs.readFileSync(path.join(manager, 'references/authoring.md'), 'utf8');
assert.match(authoring, /ask once whether to enable/i);
assert.match(authoring, /assessment\]\(assessment.md\)/);
const loop = fs.readFileSync(path.join(manager, 'references/self-improvement.md'), 'utf8');
assert.match(loop, /No answer is not approval/);
assert.match(loop, /do not recursively/i);
assert.ok(!fs.readFileSync(path.join(manager, 'templates/skill.md'), 'utf8').includes('self-improvable: true'), 'base template does not opt in silently');
console.log('PASS generated opt-in/assessment/recovery resources; conversational behavior remains unobserved');

// Fixture setup follows the public preview/apply contract. Deliberate stale-draft cases call publishReviewed directly.
function publishSkill(options) {
  if (!options.apply || options['draft-expected']) return publishReviewed(options);
  const preview = publishReviewed({ ...options, apply: false });
  return publishReviewed({ ...options, 'draft-expected': preview.draftDigest });
}
