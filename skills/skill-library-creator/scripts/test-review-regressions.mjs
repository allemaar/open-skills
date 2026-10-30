// Focused product regressions. All fixture trees and recovery evidence are retained.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { initialize, configure, reconcile, importSkill, publishSkill, adoptFinish, adoptRelease, renameSkill, metadata, cli, guide, withMutation, recordRecovery } from './library.mjs';
import { guard, hash, tree, leaf, linkTarget } from './safety.mjs';

const base = path.resolve(process.argv[2] || fs.realpathSync(os.tmpdir()));
guard(base);
fs.mkdirSync(base, { recursive: true });
const root = fs.mkdtempSync(path.join(base, 'review-regressions-'));
console.log(`Retained fixture: ${root}`);
const parent = path.join(root, 'source'); fs.mkdirSync(parent);
const state = path.join(root, 'private');
initialize({ folder: parent, family: 'trial', apply: true });
const library = path.join(parent, 'skills');
const opts = { library, state };
const id = JSON.parse(fs.readFileSync(path.join(library, 'library.json'))).id;
const privateRoot = path.join(state, id);
const installation = path.join(privateRoot, 'installation.json');
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
const text = name => `---\nname: ${name}\ndescription: Return supplied facts.\nfamily: trial\nskill-version: 1.0.0\nupdated: 2026-10-17\n---\nReturn supplied facts.\n`;
function publish(from, name, extra = {}) {
  const options = { ...opts, from, name, 'content-reviewed': true, ...extra };
  const preview = publishSkill(options);
  return publishSkill({ ...options, 'draft-expected': preview.draftDigest, expected: preview.currentDigest, apply: true });
}

for (const description of ['Reports: supplied facts.', 'Reports:']) assert.throws(() => metadata(text('trial-test').replace('Return supplied facts.', description)), /mapping separator/);
for (const description of ['"Reports: supplied facts."', "'Reports: supplied facts.'"]) assert.equal(metadata(text('trial-test').replace('Return supplied facts.', description)).description, 'Reports: supplied facts.');
assert.equal(metadata(text('trial-test').replace('Return supplied facts.', 'Read https://example.test/docs.')).description, 'Read https://example.test/docs.');
for (const inherited of ['toString', 'constructor', '__proto__']) {
  assert.throws(() => cli([inherited]), /Unknown command/);
  assert.throws(() => guide({ topic: inherited }), /Unknown help topic/);
}
console.log('PASS: YAML mapping separators and inherited command/topic names rejected');

const originals = path.join(root, 'caller-root'); fs.mkdirSync(originals);
const original = path.join(originals, 'trial-adopted'); fs.mkdirSync(original);
fs.writeFileSync(path.join(original, 'SKILL.md'), text('upstream'));
const staged = importSkill({ ...opts, name: 'trial-adopted', from: original, mode: 'upstream', origin: 'fixture', revision: 'one', apply: true });
publish(staged.candidate, 'trial-adopted');
const adopt = { ...opts, from: original, name: 'trial-adopted', confirm: original, 'callers-reviewed': true };
const beforeBadAdopt = hash(encode(tree(privateRoot)));
assert.throws(() => adoptFinish({ ...adopt, recovery: path.join(originals, 'recoveries/original'), apply: true }), /caller parent/);
assert.equal(hash(encode(tree(privateRoot))), beforeBadAdopt, 'invalid discovery archive must fail before private writes');
assert.equal(leaf(path.join(originals, 'recoveries')), null);
const archive = path.join(root, 'archives/original');
adoptFinish({ ...adopt, recovery: archive, apply: true });
const local = JSON.parse(fs.readFileSync(installation));
const receipt = local.adoptions[original];
const marker = path.join(library, '.library/adoptions/trial-adopted', `${receipt.id}.json`);
fs.renameSync(marker, path.join(root, 'retained-adoption-marker.json'));
assert.throws(() => renameSkill({ ...opts, name: 'trial-adopted', to: 'trial-renamed', confirm: 'trial-adopted', 'callers-reviewed': true, apply: true }), /adopted caller/);
assert.throws(() => adoptRelease(adopt), /still depends/);
local.adoptions[original].target = path.join(root, 'historical-source/skills/trial-adopted');
fs.writeFileSync(installation, encode(local));
assert.equal(linkTarget(original), path.join(library, 'trial-adopted'));
assert.throws(() => adoptRelease(adopt), /still depends/, 'relocated source remains a live dependency');
console.log('PASS: discovery-root archives rejected before writes; private and relocated adoption dependencies retained');

const target = path.join(root, 'harness/skills');
configure({ ...opts, targets: JSON.stringify([target]), apply: true });
reconcile({ ...opts, apply: true });
const ownedBefore = JSON.parse(fs.readFileSync(installation));
const unregistered = configure({ ...opts, targets: JSON.stringify([target]), unregister: true, confirm: target, apply: true });
const recovery = JSON.parse(fs.readFileSync(unregistered.recoveryReceipt));
assert.deepEqual(recovery.installation, ownedBefore);
assert.equal(Object.keys(JSON.parse(fs.readFileSync(installation)).links).length, 0);
assert.ok(linkTarget(path.join(target, 'trial-skills-manager')));
configure({ ...opts, targets: JSON.stringify([target]), apply: true });
const unknown = path.join(target, 'trial-orphan'); fs.mkdirSync(unknown);
fs.writeFileSync(path.join(unknown, 'retained.txt'), 'Untracked content');
const untracked = reconcile(opts);
assert.equal(untracked.summary.state, 'attention-required');
assert.ok(untracked.plan.some(row => row.destination === unknown && row.state === 'untracked-family-entry'));
assert.throws(() => reconcile({ ...opts, apply: true }), /Reconciliation blocked/);
assert.equal(fs.readFileSync(path.join(unknown, 'retained.txt'), 'utf8'), 'Untracked content');
console.log('PASS: unregister preserves ownership snapshot; unknown family entries block without removal');

if (process.platform !== 'win32') {
  const readonly = path.join(root, 'readonly-source'); fs.mkdirSync(readonly);
  fs.writeFileSync(path.join(readonly, 'SKILL.md'), text('readonly'), { mode: 0o444 });
  fs.chmodSync(readonly, 0o555);
  const imported = importSkill({ ...opts, name: 'trial-readonly', from: readonly, mode: 'upstream', origin: 'fixture', revision: 'one', apply: true });
  assert.equal(fs.lstatSync(imported.candidate).mode & 0o777, 0o555);
  assert.equal(fs.lstatSync(readonly).mode & 0o777, 0o555);
  assert.equal(fs.lstatSync(path.join(imported.candidate, 'SKILL.md')).mode & 0o777, 0o444);
  assert.equal(metadata(fs.readFileSync(path.join(imported.candidate, 'SKILL.md'), 'utf8')).name, 'trial-readonly');
  console.log('PASS: read-only source import restores candidate root mode');
} else console.log('SKIP: POSIX read-only directory mode behavior requires POSIX execution');

const draft = path.join(root, 'late-draft'); fs.mkdirSync(draft);
fs.writeFileSync(path.join(draft, 'SKILL.md'), text('trial-late'));
const destination = path.join(library, 'trial-late');
const preview = publishSkill({ ...opts, from: draft, name: 'trial-late' });
const rename = fs.renameSync;
fs.renameSync = function (from, to) {
  if (String(from).includes('publication-candidates') && to === destination) fs.writeFileSync(path.join(from, 'late.txt'), 'Unreviewed activation change');
  return rename.call(this, from, to);
};
try {
  assert.throws(() => publishSkill({ ...opts, from: draft, name: 'trial-late', 'draft-expected': preview.draftDigest, 'content-reviewed': true, apply: true }), /Partial publish.*retained locks.*Activated publication differs/);
} finally { fs.renameSync = rename; }
assert.ok(leaf(path.join(library, '.library/mutation.lock')));
assert.ok(leaf(path.join(privateRoot, 'mutation.lock')));
assert.equal(fs.readFileSync(path.join(destination, 'late.txt'), 'utf8'), 'Unreviewed activation change');
assert.notEqual(hash(encode(tree(destination))), preview.draftDigest);
console.log('PASS: late activation drift rejects success and retains changed tree, recovery and locks');

const manualParent = path.join(root, 'manual'); fs.mkdirSync(manualParent);
initialize({ folder: manualParent, family: 'manual', apply: true });
const manualOptions = { library: path.join(manualParent, 'skills'), state };
assert.throws(() => recordRecovery(manualOptions, { operation: 'manual' }), /active guarded mutation/);
let manualReceipt;
assert.throws(() => withMutation({ ...manualOptions, apply: true }, 'manual', () => {
  manualReceipt = recordRecovery(manualOptions, { operation: 'manual', reviewedFiles: ['SKILL.md'] });
  throw new Error('deliberate interrupted edit');
}), /Partial manual.*retained locks/);
assert.ok(leaf(manualReceipt));
assert.ok(leaf(path.join(manualOptions.library, '.library/mutation.lock')));
console.log('PASS: manual guarded mutation retains an operation recovery receipt on interruption');
