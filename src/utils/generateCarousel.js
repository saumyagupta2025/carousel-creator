import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a carousel content generator. Given a topic, search the web for recent, relevant information, then generate an Instagram carousel as a raw JSON object.

Use web search to find:
- Current examples, recent developments, or real-world context for the topic
- Specific facts, stats, or quotes that make the carousel feel grounded and timely
- Code patterns or techniques that are actually being used today

Slide types available:
- cover: { type, heading (max 8 words, wrap *word* in asterisks for italic emphasis), subtitle (one-sentence teaser), tag }
- text: { type, heading (bold statement), body (2–4 sentences, conversational but precise), tag }
- longtext: { type, heading, body (4–6 sentences for concepts needing more space), tag }
- list: { type, subtitle (ordinal word: "One", "Two", "Three"...), heading, bullets (array of 3–5 plain strings), tag }
- doublelist: { type, subtitle, heading, bullets, ordinal2, heading2, bullets2, tag } — two sections side-by-side, counts as 2 ordinals
- code: { type, heading, code (real runnable snippet, max 15 lines, Python preferred), language, body (one sentence explaining it), tag }
- cta: { type, heading (strong closing line, max 10 words, e.g. "Save this if it clicked for you."), body (one short follow-up line), tag }

Rules:
- 6–8 slides total
- First slide: always type "cover" — creates curiosity, does NOT give away the punchline
- Last slide: always type "cta" — never end on text or list
- list ordinals count sequentially across ALL list/doublelist slides (One, Two, Three...)
- doublelist counts as two ordinals — if previous was "Two", doublelist gets "Three" + "Four"
- Every slide MUST have a "tag" field (short topic label like "React", "RL", "Stoicism")
- Bullets are plain strings — no markdown, no trailing period, no sub-bullets
- Code must be real and runnable, no pseudocode
- One clear thesis from cover to CTA

Return ONLY a raw JSON object — no markdown fences, no explanation, no prose before or after:
{ "title": "Full readable title", "slides": [ ... ] }`;

export async function generateCarousel(topic) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'API key missing. Create .env.local in the project root with:\nVITE_ANTHROPIC_API_KEY=sk-ant-...'
    );
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const messages = [{ role: 'user', content: `Topic: ${topic}` }];

  // Agentic loop — web_search_20250305 is a server-side tool.
  // When the model searches, stop_reason === 'pause_turn'.
  // Add the response back to messages and continue; the model picks up where it left off.
  while (true) {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const raw = response.content.find((b) => b.type === 'text')?.text?.trim() ?? '';
      // Strip markdown fences if the model wraps them anyway
      const json = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

      let carousel;
      try {
        carousel = JSON.parse(json);
      } catch {
        throw new Error('Model returned invalid JSON. Try again.');
      }

      if (!carousel?.slides?.length) {
        throw new Error('No slides found in generated response.');
      }

      return carousel;
    }

    if (response.stop_reason === 'pause_turn') {
      // Server-side web search ran; add assistant turn and continue
      messages.push({ role: 'assistant', content: response.content });
      continue;
    }

    // Unexpected stop (max_tokens, tool_use fallback, etc.)
    throw new Error(`Unexpected stop: ${response.stop_reason}. Try again.`);
  }
}
