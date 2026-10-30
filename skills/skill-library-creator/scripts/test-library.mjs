// Product behavior only. Fixtures/recovery are retained; no recursive cleanup.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { initialize, configure, reconcile, inventory, importSkill, publishSkill as publishReviewed, adoptFinish, adoptRelease, retire, renameSkill, upgrade, guide, withMutation, summarizeInstallation } from './library.mjs';
import { createLink, leaf, linkTarget, hash } from './safety.mjs';

const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'skill-library-behavior-'));
console.log(`Fixture root (retained): ${root}`);
const state = path.join(root, 'private');
const parent = path.join(root, 'source'); fs.mkdirSync(parent);
const library = path.join(parent, 'skills');
const opts = { library, state };
const target = path.join(root, 'harness/skills');
const init = { folder: parent, family: 'demo' };
assert.equal(initialize(init).operation, 'create');
assert.equal(fs.existsSync(library), false, 'preview must not create a library');
initialize({ ...init, apply: true });
assert.throws(() => initialize({ ...init, apply: true }), /already exists/);
const manager = path.join(library, 'demo-skills-manager');
for (const file of ['scripts/library.mjs', 'scripts/safety.mjs', 'references/authoring.md', 'references/guide.md', 'references/evaluation.md', 'templates/skill.md', 'templates/evaluation.json']) assert.ok(fs.existsSync(path.join(manager, file)));
assert.ok(!fs.readFileSync(path.join(manager, 'SKILL.md'), 'utf8').includes('{{'));
assert.equal(inventory(opts).skills.length, 1);
assert.ok(guide({}).capabilities.adopt);
assert.equal(guide({ topic: 'author' }).topic, 'author');
assert.equal(reconcile(opts).summary.state, 'unconfigured');
assert.equal(summarizeInstallation([{ state: 'unknown-future-state' }], [], true).state, 'attention-required');
configure({ ...opts, targets: JSON.stringify([target]), apply: true });
assert.equal(fs.existsSync(target), false, 'configuration does not create harness roots');
reconcile({ ...opts, apply: true });
assert.equal(linkTarget(path.join(target, 'demo-skills-manager')), manager);
assert.equal(reconcile(opts).plan[0].state, 'correct');
assert.equal(reconcile(opts).summary.state, 'targets-match');
assert.equal(reconcile(opts).summary.linkedBytes, 'not-checked');
const installation = path.join(state, JSON.parse(fs.readFileSync(path.join(library, 'library.json'))).id, 'installation.json');
const alreadyLinked = JSON.parse(fs.readFileSync(installation));
alreadyLinked.links = {};
fs.writeFileSync(installation, JSON.stringify(alreadyLinked));
reconcile({ ...opts, apply: true });
assert.ok(JSON.parse(fs.readFileSync(installation)).links[path.join(target, 'demo-skills-manager')]);
console.log('PASS: walkthrough resources, self-contained creation, preview and direct links');

const helper = path.join(manager, 'scripts/library.mjs');
const standaloneState = path.join(root, 'standalone-private');
const standaloneTarget = path.join(root, 'standalone-harness/skills');
function generated(command, args = []) {
  return JSON.parse(execFileSync(process.execPath, [helper, command, ...args], {
    cwd: root, encoding: 'utf8', timeout: 60_000, windowsHide: true,
  }));
}
assert.ok(generated('help').capabilities.adopt);
assert.equal(generated('list', ['--library', library, '--state', standaloneState]).skills[0].name, 'demo-skills-manager');
generated('configure', ['--library', library, '--state', standaloneState, '--targets', JSON.stringify([standaloneTarget]), '--apply']);
generated('reconcile', ['--library', library, '--state', standaloneState, '--apply']);
assert.equal(linkTarget(path.join(standaloneTarget, 'demo-skills-manager')), manager);
console.log('PASS: generated helper runs help, inventory and explicit-target installation from its bundled resources');

const originals = path.join(root, 'originals'); fs.mkdirSync(originals);
function source(name) {
  const dir = path.join(originals, name); fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: >\n  Produce a dated report from supplied facts.\n---\n\n# Report\n\nUse the supplied facts; stop when their date is unknown.\n`);
  fs.mkdirSync(path.join(dir, 'templates'));
  fs.mkdirSync(path.join(dir, 'empty-assets'));
  fs.writeFileSync(path.join(dir, 'templates/report.txt'), 'Date: DATE\nFacts: FACTS\n');
  if (process.platform !== 'win32') {
    fs.mkdirSync(path.join(dir, 'scripts'));
    fs.writeFileSync(path.join(dir, 'scripts/report.sh'), '#!/bin/sh\nprintf "report\\n"\n', { mode: 0o755 });
  }
  return dir;
}
function activateImport(options) {
  const staged = importSkill({ ...opts, ...options, apply: true });
  assert.equal(leaf(path.join(library, options.name)), null, 'import stages without activation');
  assert.ok(fs.existsSync(staged.candidate));
  publishSkill({ ...opts, from: staged.candidate, name: options.name, 'content-reviewed': true, apply: true });
  return staged;
}
const authoredDraft = source('authored-draft');
const generatedDate = fs.readFileSync(path.join(manager, 'SKILL.md'), 'utf8').match(/^updated: (.+)$/m)[1];
const authoredMarkdown = `---\nname: demo-authored\ndescription: Produce a dated report from supplied facts.\nfamily: demo\nskill-version: 1.0.0\nupdated: ${generatedDate}\n---\n\n# Authored report\n\nUse the supplied facts and report their date.\n`;
fs.writeFileSync(path.join(authoredDraft, 'SKILL.md'), authoredMarkdown);
assert.throws(() => publishSkill({ ...opts, from: authoredDraft, name: 'demo-authored', apply: true }), /review/i);
assert.equal(leaf(path.join(library, 'demo-authored')), null);
assert.throws(() => publishSkill({ ...opts, from: authoredDraft, name: 'demo-mismatch', 'content-reviewed': true, apply: true }), /name|family|metadata/i);
const authorPreview = publishSkill({ ...opts, from: authoredDraft, name: 'demo-authored', 'content-reviewed': true });
assert.equal(leaf(path.join(library, 'demo-authored')), null, 'publish preview does not activate a draft');
publishSkill({ ...opts, from: authoredDraft, name: 'demo-authored', 'content-reviewed': true, apply: true });
assert.equal(fs.readFileSync(path.join(library, 'demo-authored/SKILL.md'), 'utf8'), authoredMarkdown);
assert.ok(fs.statSync(path.join(library, 'demo-authored/empty-assets')).isDirectory());
assert.ok(authorPreview);
const authoredDigest = reconcile(opts).plan.find(row => row.source === path.join(library, 'demo-authored')).digest;
const improvedMarkdown = authoredMarkdown.replace('skill-version: 1.0.0', 'skill-version: 1.1.0') + '\nExplain any missing source date.\n';
fs.writeFileSync(path.join(authoredDraft, 'SKILL.md'), improvedMarkdown);
assert.throws(() => publishSkill({ ...opts, from: authoredDraft, name: 'demo-authored', expected: '0'.repeat(64), 'content-reviewed': true, apply: true }), /expected|digest/i);
assert.equal(fs.readFileSync(path.join(library, 'demo-authored/SKILL.md'), 'utf8'), authoredMarkdown, 'stale expected digest preserves active content');
const improved = publishSkill({ ...opts, from: authoredDraft, name: 'demo-authored', expected: authoredDigest, 'content-reviewed': true, apply: true });
assert.equal(fs.readFileSync(path.join(library, 'demo-authored/SKILL.md'), 'utf8'), improvedMarkdown);
assert.equal(fs.readFileSync(path.join(improved.recovery, 'SKILL.md'), 'utf8'), authoredMarkdown);
console.log('PASS: authored publication requires reviewed matching metadata and retains complete draft contents');
const original = source('original-report');
const originalProvenance = { origin: 'prior-source', revision: 'prior-revision', custom: 'retained' };
fs.writeFileSync(path.join(original, 'provenance.json'), JSON.stringify(originalProvenance));
const originalHash = hash(fs.readFileSync(path.join(original, 'SKILL.md')));
const imp = { ...opts, from: original, name: 'demo-report', mode: 'variant', origin: 'local-original', revision: 'reviewed-content' };
activateImport(imp);
assert.equal(hash(fs.readFileSync(path.join(original, 'SKILL.md'))), originalHash, 'import preserves original');
const imported = path.join(library, 'demo-report');
const provenance = JSON.parse(fs.readFileSync(path.join(imported, 'provenance.json')));
assert.equal(provenance.originalName, 'original-report');
assert.deepEqual(provenance.upstreamProvenance, originalProvenance);
assert.ok(fs.existsSync(path.join(library, provenance.baseline, 'templates/report.txt')));
assert.ok(fs.statSync(path.join(imported, 'empty-assets')).isDirectory());
assert.ok(fs.statSync(path.join(library, provenance.baseline, 'empty-assets')).isDirectory());
if (process.platform !== 'win32') {
  assert.equal(fs.statSync(path.join(imported, 'scripts/report.sh')).mode & 0o777, 0o755);
  assert.equal(fs.statSync(path.join(library, provenance.baseline, 'scripts/report.sh')).mode & 0o777, 0o755);
}
assert.throws(() => adoptFinish({ ...opts, from: original, name: 'demo-report', apply: true }), /confirm/);
const adoptionPreview = adoptFinish({ ...opts, from: original, name: 'demo-report' });
assert.equal(adoptionPreview.recovery, adoptFinish({ ...opts, from: original, name: 'demo-report' }).recovery);
const adopted = adoptFinish({ ...opts, from: original, name: 'demo-report', apply: true, confirm: original, 'callers-reviewed': true });
assert.equal(adopted.recovery, adoptionPreview.recovery);
assert.equal(linkTarget(original), imported);
assert.ok(fs.existsSync(path.join(adopted.recovery, 'templates/report.txt')));
assert.ok(adopted.recovery.startsWith(state + path.sep), 'original recovery stays in private state by default');
assert.throws(() => retire({ ...opts, name: 'demo-report', apply: true, confirm: 'demo-report' }), /adopted/);
const secondMachine = { library, state: path.join(root, 'second-machine-private') };
assert.throws(() => retire({ ...secondMachine, name: 'demo-report', apply: true, confirm: 'demo-report' }), /adopt|dependenc|caller/i);
assert.throws(() => renameSkill({ ...secondMachine, name: 'demo-report', to: 'demo-other-report', apply: true, confirm: 'demo-report', 'callers-reviewed': true }), /adopt|dependenc|caller/i);
assert.throws(() => adoptRelease({ ...opts, from: original, name: 'demo-report', apply: true, confirm: original, 'callers-reviewed': true }), /caller|link|target/i);
// Fixture-only retained alias makes the recorded caller absent. This does not model a safe live caller migration.
fs.renameSync(original, path.join(root, 'unused-fixture-caller-alias'));
adoptRelease({ ...opts, from: original, name: 'demo-report', apply: true, confirm: original, 'callers-reviewed': true });
assert.equal(leaf(original), null);
assert.equal(retire({ ...secondMachine, name: 'demo-report' }).name, 'demo-report');
console.log('PASS: complete import baseline, original preserved, confirmed adoption and caller protection');

const other = source('second-report');
activateImport({ from: other, name: 'demo-second', mode: 'upstream', origin: 'https://example.invalid/selected-skill', revision: 'pinned-example' });
reconcile({ ...opts, apply: true });
const unknown = path.join(target, 'other-unmanaged');
createLink(other, unknown);
const retirePreview = retire({ ...opts, name: 'demo-second' });
assert.equal(retire({ ...opts, name: 'demo-second', apply: true, confirm: 'demo-second' }).recovery, retirePreview.recovery);
reconcile({ ...opts, apply: true });
assert.equal(leaf(path.join(target, 'demo-second')), null);
assert.ok(leaf(unknown), 'unowned similarly named links survive');
assert.ok(fs.existsSync(other), 'unlink cannot delete source');
console.log('PASS: explicit retirement removes only recorded links and preserves unowned sources');

const third = source('third-report');
activateImport({ from: third, name: 'demo-third', mode: 'variant', origin: 'local', revision: 'reviewed' });
const collision = path.join(root, 'collision/skills'); fs.mkdirSync(collision, { recursive: true });
fs.mkdirSync(path.join(collision, 'demo-third'));
configure({ ...opts, targets: JSON.stringify([collision]), apply: true });
assert.throws(() => reconcile({ ...opts, apply: true }), /blocked/);
assert.equal(leaf(path.join(collision, 'demo-skills-manager')), null, 'batch collision prevents earlier planned creates');
assert.doesNotThrow(() => reconcile({ ...opts, targets: JSON.stringify([target]), apply: true }), 'a registered clean subset can be reconciled explicitly');
assert.throws(() => reconcile({ ...opts, targets: JSON.stringify([path.join(root, 'unregistered-target')]), apply: true }), /register|configured|selected/i);
configure({ ...opts, unregister: true, targets: JSON.stringify([collision]), confirm: collision, apply: true });
assert.ok(fs.existsSync(path.join(collision, 'demo-third')), 'unregister preserves existing target content');
assert.ok(!JSON.parse(fs.readFileSync(installation)).targets.includes(collision));
console.log('PASS: ordinary-copy collision blocks the complete batch without replacing content');

const renamePreview = renameSkill({ ...opts, name: 'demo-third', to: 'demo-renamed' });
const rename = renameSkill({ ...opts, name: 'demo-third', to: 'demo-renamed', confirm: 'demo-third', 'callers-reviewed': true, apply: true });
assert.equal(rename.recovery, renamePreview.recovery);
assert.ok(fs.existsSync(rename.recovery));
assert.equal(inventory(opts).skills.find(s => s.name === 'demo-renamed').version, '2.0.0');
assert.ok(inventory(opts).retired.includes('demo-third'));
const renamedProvenance = JSON.parse(fs.readFileSync(path.join(library, 'demo-renamed/provenance.json')));
assert.ok(JSON.stringify(renamedProvenance).includes('demo-third') && JSON.stringify(renamedProvenance).includes('demo-renamed'), 'rename retains original provenance and naming history');
console.log('PASS: reviewed rename retains recovery, records retirement and bumps breaking version');

const custom = path.join(manager, 'references/guide.md');
const customBytes = `${fs.readFileSync(custom, 'utf8')}\nCustom local instructions.\n`;
fs.writeFileSync(custom, customBytes);
const configPath = path.join(library, 'library.json');
const oldRel = 'references/installation.md';
const oldPath = path.join(manager, oldRel);
const incomingBytes = fs.readFileSync(oldPath);
const oldBytes = Buffer.from('# Installation from the older generator\n');
fs.writeFileSync(oldPath, oldBytes);
fs.writeFileSync(path.join(library, '.library/generator-base', oldRel), oldBytes);
const oldConfig = JSON.parse(fs.readFileSync(configPath));
oldConfig.managed[oldRel] = hash(oldBytes);
fs.writeFileSync(configPath, JSON.stringify(oldConfig));
const preview = upgrade(opts);
assert.equal(preview.plan.find(p => p.path === 'references/guide.md').state, 'preserve-custom');
assert.equal(preview.plan.find(p => p.path === oldRel).state, 'update');
const upgraded = upgrade({ ...opts, expected: preview.planDigest, apply: true });
assert.deepEqual(fs.readFileSync(oldPath), incomingBytes);
assert.deepEqual(fs.readFileSync(path.join(upgraded.recovery, oldRel)), oldBytes);
assert.equal(fs.readFileSync(custom, 'utf8'), customBytes);
const config = JSON.parse(fs.readFileSync(configPath));
config.managed['references/guide.md'] = '0'.repeat(64);
fs.writeFileSync(configPath, JSON.stringify(config));
assert.throws(() => upgrade({ ...opts, apply: true }), /reviewed merge/);
assert.equal(fs.readFileSync(custom, 'utf8'), customBytes);
console.log('PASS: upgrade preserves customization and refuses conflicting edits');

const malformed = path.join(library, 'demo-malformed');
fs.mkdirSync(malformed); fs.writeFileSync(path.join(malformed, 'SKILL.md'), 'not valid skill metadata\n');
const tolerant = inventory(opts);
assert.ok(tolerant.invalid.some(row => JSON.stringify(row).includes('demo-malformed')));
assert.ok(tolerant.skills.some(row => row.name === 'demo-renamed'));
assert.ok(tolerant.skills.every(row => !('files' in row) && !('digest' in row)), 'inventory exposes metadata rather than constituent hashes');
assert.throws(() => reconcile({ ...opts, apply: true }), /invalid|frontmatter|metadata/i);
fs.renameSync(malformed, path.join(root, 'retained-invalid-draft'));
const unneededAssets = path.join(library, 'demo-authored/unneeded-assets');
createLink(other, unneededAssets);
assert.ok(inventory(opts).skills.some(row => row.name === 'demo-authored'), 'metadata inventory does not traverse unrelated constituents');
assert.throws(() => reconcile({ ...opts, apply: true }), /redirect|link|physical/i);
fs.renameSync(unneededAssets, path.join(root, 'retained-unneeded-assets-link'));
console.log('PASS: inventory reports an invalid draft without hiding valid skills; mutation refuses it');

withMutation({ ...opts, apply: true }, 'fixture-lock', () => {
  assert.throws(() => configure({ ...opts, targets: JSON.stringify([target]), apply: true }), /lock|busy|mutation/i);
});
assert.doesNotThrow(() => configure({ ...opts, targets: JSON.stringify([target]), apply: true }));
console.log('PASS: overlapping mutation is refused and the lock releases afterward');

if (process.platform === 'win32') {
  const badOriginal = source('original-special-path');
  const badPath = path.join(originals, 'original & special'); fs.renameSync(badOriginal, badPath);
  activateImport({ from: badPath, name: 'demo-special', mode: 'variant', origin: 'local', revision: 'reviewed' });
  assert.throws(() => adoptFinish({ ...opts, from: badPath, name: 'demo-special', apply: true, confirm: badPath, 'callers-reviewed': true }), /unsupported|character/i);
  assert.ok(fs.statSync(badPath).isDirectory(), 'native-link refusal occurs before original is moved');
  assert.equal(linkTarget(badPath), null);
  console.log('PASS: unsupported Windows link path leaves the original physical directory intact');
}

const redirect = path.join(root, 'redirect');
createLink(parent, redirect);
assert.throws(() => initialize({ folder: redirect, family: 'escape', apply: true }));
console.log('PASS: redirected parent rejected');
console.log(`Product behavior complete on ${process.platform}; fixtures retained at ${root}`);

// Fixture setup follows the public preview/apply contract. Deliberate stale-draft cases call publishReviewed directly.
function publishSkill(options) {
  if (!options.apply || options['draft-expected']) return publishReviewed(options);
  const preview = publishReviewed({ ...options, apply: false });
  return publishReviewed({ ...options, 'draft-expected': preview.draftDigest });
}
