Generate an Instagram carousel for @hiddenlayer.ai about: $ARGUMENTS

If no topic is given, pick a compelling AI/ML topic from recent trends — LLMs, agents, inference optimization, training tricks, model architecture breakthroughs, or anything you know is currently being discussed in the AI/ML community.

---

## Slide types

Create 6–8 slides. Every slide MUST have a `tag` field (short topic label like "LLMs", "RL", "Attention", "Agents").

**cover** — hook slide, creates curiosity without giving the answer away  
```
{ "type": "cover", "heading": "...", "subtitle": "...", "tag": "..." }
```
- `heading`: max 8 words. Punchy. Wrap *word* in asterisks for italic emphasis.
- `subtitle`: one-sentence teaser

**text** — explanation slide  
```
{ "type": "text", "heading": "...", "body": "...", "tag": "..." }
```
- `body`: 2–4 sentences, conversational but precise

**list** — bullet slide  
```
{ "type": "list", "heading": "...", "bullets": ["...", "..."], "tag": "..." }
```
- `bullets`: array of 3–5 plain strings (no markdown, no trailing period)

**code** — code example  
```
{ "type": "code", "heading": "...", "code": "...", "language": "python", "body": "...", "tag": "..." }
```
- `code`: real working snippet, max 15 lines. Python preferred.
- `body`: one sentence explaining what the code does (optional but helpful)

**longtext** — deep dive  
```
{ "type": "longtext", "heading": "...", "body": "...", "tag": "..." }
```
- `body`: 4–6 sentences for concepts that need more space

---

## Rules

- Cover slide: creates curiosity, does NOT give away the punchline
- Last slide: `type: "text"`, `heading: "Key Takeaway"`, one concrete insight the reader can use today
- Code must be real and runnable — no pseudocode
- Bullets must be plain strings — no markdown or sub-bullets inside them
- Keep the carousel cohesive — one clear thesis from cover to takeaway

---

## Output

Write the carousel as a JSON file using the Write tool to this path relative to the project root:

`generated-carousels/<slug>.json`

Where `<slug>` is a short kebab-case identifier derived from the topic (e.g. `attention-is-all-you-need`, `rlhf-explained`, `moe-architectures`).

The file must be a single JSON object:

```json
{
  "title": "Full readable title",
  "slides": [
    { "type": "cover", "heading": "...", "subtitle": "...", "tag": "..." },
    ...
  ]
}
```

After writing the file, tell me:
1. The carousel title and slide count
2. The exact path you wrote to
3. That they should run `npm run convert` in the carousel app directory, then click **↑ Import** in the sidebar to load it
