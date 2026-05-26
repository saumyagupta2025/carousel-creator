#!/usr/bin/env node
/**
 * Converts a Claude-generated carousel JSON into the exact format
 * the Carousel Creator app expects — adds UUIDs and fills missing fields.
 *
 * Usage:
 *   npm run convert                        # picks the most recent file
 *   npm run convert -- rlhf-explained.json # specific file
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'generated-carousels');

// Same defaults as the app's createSlide()
const DEFAULTS = {
  cover: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
  },
  text: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
  },
  list: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
  },
  code: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'python', imageUrl: null, caption: '', textAbove: '',
  },
  longtext: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
  },
  screenshot: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
  },
  framed: {
    subtitle: '', tag: '', body: '', bullets: [], code: '',
    language: 'javascript', imageUrl: null, caption: '', textAbove: '',
    captionPosition: 'below', imageSize: 75,
  },
};

function normalize(raw) {
  const data = JSON.parse(typeof raw === 'string' ? raw : JSON.stringify(raw));
  // Support both a single carousel object and an array (pick first)
  const carousel = Array.isArray(data) ? data[0] : data;

  const slides = (carousel.slides ?? []).map((s) => {
    const type = s.type ?? 'text';
    const defaults = DEFAULTS[type] ?? DEFAULTS.text;
    return {
      id: crypto.randomUUID(),
      type,
      heading: '',
      ...defaults,
      ...s,
      // Ensure bullets is always an array
      bullets: Array.isArray(s.bullets) ? s.bullets : [],
    };
  });

  return { title: carousel.title ?? 'Untitled', slides };
}

// ── Resolve input file ───────────────────────────────────────────────────────

mkdirSync(DIR, { recursive: true });

let inputPath = process.argv[2];

if (!inputPath) {
  // Auto-pick the most recent non-ready JSON file
  const files = readdirSync(DIR)
    .filter((f) => f.endsWith('.json') && !f.includes('-ready'))
    .sort()
    .reverse();

  if (!files.length) {
    console.error(`\nNo JSON files found in:\n  ${DIR}`);
    console.error('\nUse the /carousel skill in Claude Code to generate one first.\n');
    process.exit(1);
  }

  inputPath = join(DIR, files[0]);
  console.log(`\nUsing: ${files[0]}`);
} else {
  // Allow passing just a filename (resolved relative to DIR)
  if (!inputPath.startsWith('/')) inputPath = join(DIR, inputPath);
}

// ── Convert ──────────────────────────────────────────────────────────────────

let raw;
try {
  raw = readFileSync(inputPath, 'utf-8');
} catch (e) {
  console.error(`Cannot read file: ${inputPath}`);
  process.exit(1);
}

let carousel;
try {
  carousel = normalize(raw);
} catch (e) {
  console.error(`Failed to parse JSON: ${e.message}`);
  process.exit(1);
}

const outPath = join(DIR, `${basename(inputPath, '.json')}-ready.json`);
writeFileSync(outPath, JSON.stringify(carousel, null, 2));

console.log(`\n✅  "${carousel.title}"`);
console.log(`    ${carousel.slides.length} slides`);
console.log(`    → ${outPath}`);
console.log('\n→  Open the carousel app and click "↑ Import" in the sidebar to load it.\n');
