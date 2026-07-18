#!/usr/bin/env node
// human-output-check — grades the MECHANICAL half of the human-output contract.
//
//   node tools/human-output-check.mjs <file.md>   # check one drafted text
//   node tools/human-output-check.mjs             # read stdin
//   node tools/human-output-check.mjs --self-test # fixtures must pass/fail
//
// Exit 0 = no errors. Exit 1 = at least one error. Exit 2 = the checker crashed
// (never confuse a crash with a pass).
//
// WHAT THIS CANNOT CHECK, stated so nobody mistakes a green run for compliance:
// whether the first sentence is really the verdict, whether a claim is labelled
// with the right confidence, and whether "what I did not check" is honest.
// Those are rules 1, 3 and 4 of the contract and they are judgement. A green
// result here means the countable rules hold — nothing more.

import { readFileSync } from 'node:fs';

const MAX_FENCE_COLS = 80;
const MAX_SENTENCE_WORDS = 25;
const BAR_RATIO_TOLERANCE = 0.05; // 5% spread across one figure's bars

// Acronyms a general reader is not expected to have expanded for them.
const COMMON = new Set([
  'AM', 'PM', 'UTC', 'AD', 'BC', 'OK', 'ID', 'TV', 'PC', 'USB', 'PDF', 'URL',
  'HTTP', 'HTTPS', 'API', 'CSV', 'JSON', 'HTML', 'CSS', 'USA', 'UK', 'EU',
  'US', 'CEO', 'CFO', 'CTO', 'VAT', 'EUR', 'USD', 'GBP', 'FAQ', 'DIY', 'ASCII',
]);

// Ordinary words that appear capitalised for emphasis or as rule keywords.
// An all-caps rendering of one of these is emphasis, not an acronym.
const ENGLISH = new Set([
  'must', 'not', 'may', 'should', 'never', 'always', 'and', 'or', 'the', 'a',
  'no', 'yes', 'all', 'any', 'one', 'two', 'new', 'old', 'here', 'now', 'you',
  'are', 'is', 'it', 'if', 'so', 'do', 'to', 'in', 'on', 'at', 'by', 'of',
  'skill', 'read', 'write', 'draw', 'stop', 'go', 'done', 'open', 'fog',
  'side', 'lanes', 'uplift', 'built', 'ground', 'bad', 'good', 'before',
  'after', 'error', 'warn', 'pass', 'fail', 'keep', 'cut', 'add', 'this',
]);

const findings = [];
const add = (level, rule, line, msg) =>
  findings.push({ level, rule, line, msg });

/** Split a document into fenced and unfenced regions, keeping line numbers. */
function partition(text) {
  const lines = text.split(/\r?\n/);
  const fences = [];
  const prose = [];
  let open = null;
  lines.forEach((raw, i) => {
    if (/^\s*```/.test(raw)) {
      if (open) { fences.push(open); open = null; }
      else open = { start: i + 1, lines: [] };
      return;
    }
    if (open) open.lines.push({ n: i + 1, text: raw });
    else prose.push({ n: i + 1, text: raw });
  });
  if (open) {
    add('error', 'unclosed-fence', open.start, 'code fence is never closed');
    fences.push(open);
  }
  return { fences, prose };
}

/** Rule: inside a fence, only printable ASCII. */
function checkFenceAscii(fences) {
  for (const f of fences) {
    for (const { n, text } of f.lines) {
      for (const ch of text) {
        const cp = ch.codePointAt(0);
        if (ch === '\t') {
          add('error', 'fence-tab', n, 'tab inside a figure — renders at an unpredictable width');
          break;
        }
        if (cp < 0x20 || cp > 0x7e) {
          add('error', 'fence-non-ascii', n,
            `non-ASCII U+${cp.toString(16).toUpperCase().padStart(4, '0')} (${ch}) inside a figure — ` +
            'box-drawing, arrows and emoji are East Asian Ambiguous and render double-width in some terminals');
          break;
        }
      }
    }
  }
}

/** Rule: figures stay inside the column budget. */
function checkFenceWidth(fences) {
  for (const f of fences) {
    for (const { n, text } of f.lines) {
      if (text.length > MAX_FENCE_COLS) {
        add('error', 'fence-width', n,
          `figure line is ${text.length} columns (limit ${MAX_FENCE_COLS}) — it will wrap and shear the alignment`);
      }
    }
  }
}

/**
 * Rule: a figure's bars must be proportional to the values printed beside them.
 * Looks for lines carrying a run of a repeated block character AND a number.
 * Verifies every bar in one fence shares a cells-per-unit ratio.
 */
function checkBarArithmetic(fences) {
  for (const f of fences) {
    const bars = [];
    for (const { n, text } of f.lines) {
      const run = text.match(/([#=*x@])\1{2,}/);
      if (!run) continue;
      const cells = text.split('').filter((c) => c === run[1]).length;
      // the value is the first number that is not part of the bar run
      const num = text.replace(/([#=*x@])\1{2,}/g, ' ').match(/(\d[\d,]*\.?\d*)/);
      if (!num) continue;
      const value = parseFloat(num[1].replace(/,/g, ''));
      if (!Number.isFinite(value) || value === 0) continue;
      bars.push({ n, cells, value, ratio: cells / value });
    }
    if (bars.length < 2) continue;
    const ratios = bars.map((b) => b.ratio);
    const lo = Math.min(...ratios);
    const hi = Math.max(...ratios);
    if (hi > 0 && (hi - lo) / hi > BAR_RATIO_TOLERANCE) {
      const worst = bars.find((b) => b.ratio === lo || b.ratio === hi);
      add('error', 'bar-arithmetic', worst.n,
        `bars in this figure are not proportional to their labels ` +
        `(cells-per-unit ranges ${lo.toFixed(4)}..${hi.toFixed(4)}) — ` +
        'a reader who measures gets a different number than the one printed');
    }
  }
}

/** Rule: a set of percentages in one figure sums to 100. */
function checkPercentSums(fences) {
  for (const f of fences) {
    const pcts = [];
    for (const { n, text } of f.lines) {
      const m = text.match(/(\d+(?:\.\d+)?)\s?%/g);
      if (m) m.forEach((s) => pcts.push({ n, v: parseFloat(s) }));
    }
    if (pcts.length < 3) continue;
    const sum = pcts.reduce((a, b) => a + b.v, 0);
    if (sum > 90 && sum < 110 && Math.abs(sum - 100) > 0.5) {
      add('error', 'percent-sum', pcts[pcts.length - 1].n,
        `percentages in this figure sum to ${sum.toFixed(1)}, not 100 — use largest-remainder rounding`);
    }
  }
}

/** Rule: sentences stay readable. Prose only. */
function checkSentenceLength(prose) {
  for (const { n, text } of prose) {
    if (/^\s*[|>#\-*\d]/.test(text)) continue; // tables, quotes, headings, lists
    for (const s of text.split(/(?<=[.!?])\s+/)) {
      const words = s.trim().split(/\s+/).filter(Boolean);
      if (words.length > MAX_SENTENCE_WORDS) {
        add('warn', 'sentence-length', n,
          `${words.length}-word sentence (soft limit ${MAX_SENTENCE_WORDS})`);
      }
    }
  }
}

/**
 * Rule: expand an acronym at first use.
 * Heuristic, deliberately conservative — a noisy gate gets ignored. We skip
 * label lines (mostly uppercase, e.g. a figure caption or a banner) and
 * ordinary English words that happen to be capitalised for emphasis.
 */
function checkAcronyms(prose) {
  const seen = new Set();
  for (const { n, text } of prose) {
    const letters = text.replace(/[^A-Za-z]/g, '');
    if (letters.length > 3 && (letters.replace(/[^A-Z]/g, '').length / letters.length) > 0.5) {
      continue; // a label or banner line, not prose
    }
    const bare = text.match(/\b[A-Z]{2,6}\b/g) || [];
    for (const a of bare) {
      if (COMMON.has(a) || seen.has(a)) continue;
      // an all-caps rendering of an ordinary word is emphasis, not an acronym
      if (/^[A-Z][AEIOU]?[A-Z]*$/.test(a) && ENGLISH.has(a.toLowerCase())) continue;
      seen.add(a);
      // expanded if it appears parenthesised right after words, e.g. "Thing (ABC)"
      const expanded = new RegExp(`[a-z]\\s*\\(${a}\\)`).test(text);
      if (!expanded) {
        add('warn', 'unexpanded-acronym', n,
          `"${a}" used without expansion at first use — write "Expanded name (${a})" or drop it`);
      }
    }
  }
}

/** Rule: one marked recommendation per document. */
function checkOneRecommendation(prose) {
  const hits = prose.filter(({ text }) =>
    /^\s*(\*\*)?(decision needed|recommend(ation|ed)?|next)\b/i.test(text));
  if (hits.length > 1) {
    add('warn', 'multiple-recommendations', hits[1].n,
      `${hits.length} recommendation markers — one per decision; number them if the decisions are independent`);
  }
}

function run(text) {
  const { fences, prose } = partition(text);
  checkFenceAscii(fences);
  checkFenceWidth(fences);
  checkBarArithmetic(fences);
  checkPercentSums(fences);
  checkSentenceLength(prose);
  checkAcronyms(prose);
  checkOneRecommendation(prose);
}

const GOOD = `**Water use is dominated by the shower; everything else is noise.**

Next: fit a low-flow head.

\`\`\`
shower   ##################  45 L
laundry  ##############      34 L
kitchen  ###########         27 L
\`\`\`
`;

const BAD = `**Spending is under control.**

\`\`\`
housing  ##################  1420
food     ###############      630
\`\`\`
`;

function selfTest() {
  let ok = true;
  for (const [name, text, wantErrors] of [['good', GOOD, false], ['bad', BAD, true]]) {
    findings.length = 0;
    run(text);
    const errs = findings.filter((f) => f.level === 'error');
    const got = errs.length > 0;
    if (got !== wantErrors) {
      console.error(`self-test FAILED: ${name} fixture expected errors=${wantErrors}, got ${errs.length}`);
      ok = false;
    } else if (wantErrors) {
      const kinds = errs.map((e) => e.rule);
      if (!kinds.includes('bar-arithmetic')) {
        console.error(`self-test FAILED: bad fixture rejected for ${kinds.join(',')}, expected bar-arithmetic`);
        ok = false;
      }
    }
  }
  console.log(ok ? 'human-output-check self-test: OK' : 'human-output-check self-test: BROKEN');
  return ok ? 0 : 1;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();

  const file = args.find((a) => !a.startsWith('-'));
  const text = file ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8');
  run(text);

  const errors = findings.filter((f) => f.level === 'error');
  const warns = findings.filter((f) => f.level === 'warn');
  for (const f of [...errors, ...warns]) {
    console.log(`${f.level === 'error' ? 'ERROR' : ' warn'}  ${f.rule}:${f.line}  ${f.msg}`);
  }
  console.log(
    `human-output-check: ${errors.length} error(s), ${warns.length} warning(s)` +
    ` — judgement rules (verdict-first, confidence labels, what-was-not-checked) are NOT graded here`);
  return errors.length ? 1 : 0;
}

try {
  process.exit(main());
} catch (err) {
  console.error(`human-output-check crashed: ${err.message}`);
  process.exit(2);
}
