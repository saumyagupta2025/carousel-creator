#!/usr/bin/env node
/**
 * AI/ML Carousel Content Generator
 *
 * Fetches the latest AI/ML news from HackerNews, arXiv, and Reddit,
 * then uses Claude to generate ready-to-import Instagram carousel JSON.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   node scripts/generate-carousels.js
 *   npm run generate
 *
 * Output: generated-carousels/YYYY-MM-DD-N-topic-slug.json
 *         generated-carousels/YYYY-MM-DD-all.json   (all in one, for bulk import)
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'generated-carousels');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set.');
  console.error('Run: export ANTHROPIC_API_KEY=sk-ant-...');
  process.exit(1);
}

const client = new Anthropic();

// ── Tool: fetch any URL ─────────────────────────────────────────────────────

async function fetchUrl(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'carousel-creator/1.0', Accept: '*/*' },
      signal: AbortSignal.timeout(12000),
    });
    const text = await res.text();
    return text.length > 8000 ? text.slice(0, 8000) + '\n...[truncated]' : text;
  } catch (e) {
    return `Fetch error for ${url}: ${e.message}`;
  }
}

const TOOLS = [
  {
    name: 'fetch_url',
    description:
      'Fetch the raw content of any URL — JSON APIs, RSS/Atom feeds, Reddit JSON, etc.',
    input_schema: {
      type: 'object',
      properties: { url: { type: 'string', description: 'Full URL to fetch' } },
      required: ['url'],
    },
  },
];

// ── Prompts ─────────────────────────────────────────────────────────────────

const SYSTEM = `You are a senior content strategist for @hiddenlayer.ai, an Instagram account that makes AI/ML research accessible and engaging for a technical audience.

Your carousels are known for:
- Opening with a punchy, curiosity-inducing cover slide
- Building understanding step by step (text, list, code slides)
- Using real code examples when explaining techniques
- Closing with a concrete, actionable takeaway`;

const USER_PROMPT = `
Research the latest AI/ML news and generate 3 carousel posts.

── Step 1: Gather news ──────────────────────────────────────────────────────
Fetch from these free sources:

HackerNews — get top 20 story IDs then fetch each story item:
  IDs:  https://hacker-news.firebaseio.com/v0/topstories.json
  Item: https://hacker-news.firebaseio.com/v0/item/{id}.json
  (only fetch AI/ML/LLM relevant ones — filter by title)

arXiv recent AI papers:
  https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=8

Reddit r/MachineLearning (hot):
  https://www.reddit.com/r/MachineLearning/hot.json?limit=8

── Step 2: Pick 3 topics ────────────────────────────────────────────────────
Choose topics that are:
- Grounded in something real from Step 1 (cite the source in your own knowledge)
- Educational (teach a concept, not just summarise headlines)
- Opinionated (have a clear, defensible point of view)

── Step 3: Generate slides ──────────────────────────────────────────────────
For each topic, generate 6–8 slides using these types:

  "cover"    → { heading, subtitle, tag }
               heading: max 8 words, punchy hook. Wrap *word* in asterisks for italic.
               subtitle: 1-sentence teaser
               tag: short topic label (e.g. "LLMs", "RL", "Vision")

  "text"     → { heading, body, tag }
               body: 2–4 clear sentences. Conversational but precise.

  "list"     → { heading, bullets, tag }
               bullets: array of 3–5 short strings (no trailing period)

  "code"     → { heading, code, language, body, tag }
               code: real working snippet (not pseudocode), max ~15 lines
               body: 1-sentence explanation of what the code does (optional)

  "longtext" → { heading, body, tag }
               body: 4–6 sentences, deeper dive

Rules:
- Every slide MUST have a "tag" field
- Last slide: use "text" type, heading = "Key Takeaway", give one concrete insight
- Code slides: prefer Python. Always set "language" (python/javascript/bash/etc.)
- Bullets must be plain strings (no markdown inside)

── Output format ────────────────────────────────────────────────────────────
Return ONLY a raw JSON array. No markdown fences, no explanation, no preamble.

[
  {
    "title": "Short descriptive title (used as filename)",
    "slides": [
      { "type": "cover", "heading": "...", "subtitle": "...", "tag": "..." },
      { "type": "text", "heading": "...", "body": "...", "tag": "..." },
      ...
    ]
  },
  ...
]
`.trim();

// ── Agentic loop ─────────────────────────────────────────────────────────────

async function runAgent() {
  const messages = [{ role: 'user', content: USER_PROMPT }];
  let round = 0;

  while (true) {
    round++;
    const res = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 8192,
      system: SYSTEM,
      tools: TOOLS,
      messages,
    });

    if (res.stop_reason !== 'tool_use') {
      return res.content.find((b) => b.type === 'text')?.text ?? '';
    }

    messages.push({ role: 'assistant', content: res.content });

    const results = [];
    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      const url = block.input.url;
      process.stdout.write(`  [round ${round}] ↓ ${url.slice(0, 100)}\n`);
      results.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: await fetchUrl(url),
      });
    }
    messages.push({ role: 'user', content: results });
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🤖  Researching latest AI/ML news...\n');

  const raw = await runAgent();

  // Strip accidental markdown code fences
  const json = raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  let carousels;
  try {
    carousels = JSON.parse(json);
  } catch {
    console.error('\n⚠️  Could not parse response as JSON. Saving raw output for inspection.');
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(join(OUT_DIR, 'raw-output.txt'), raw);
    console.error(`Raw output → ${join(OUT_DIR, 'raw-output.txt')}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);

  console.log('\n📝  Generated carousels:\n');

  carousels.forEach((carousel, i) => {
    const slug = carousel.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const file = join(OUT_DIR, `${date}-${i + 1}-${slug}.json`);
    writeFileSync(file, JSON.stringify(carousel, null, 2));
    console.log(`  ${i + 1}. "${carousel.title}"  (${carousel.slides.length} slides)`);
    console.log(`     → ${file}`);
  });

  const allFile = join(OUT_DIR, `${date}-all.json`);
  writeFileSync(allFile, JSON.stringify(carousels, null, 2));
  console.log(`\n📦  All carousels combined → ${allFile}`);
  console.log('\n✅  Done! Open the app and click "Import JSON" to load any file.\n');
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
