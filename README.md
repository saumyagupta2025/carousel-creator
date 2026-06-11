# Content Studio

A browser-based creator for **Instagram carousels** and **single image/video posts**, sized for 1080 × 1350. Built with React + Vite + Tailwind. Exports pixel-perfect JPEGs (and carousels as a ZIP) via `html-to-image`.

## Features

- **Two modes** (top bar toggle):
  - **Carousel** — multi-slide decks with drag-to-reorder, 11 slide types (cover, quote, big statement, lists, photo layouts, code, screenshot, framed image, CTA).
  - **Post** — a single image/video post for startup / AI-news headlines, with a source chip, custom text & accent colours, layout variants, and a follow row showing your own photo.
- **8 templates / palettes**: Dark, Warm Cream, Editorial, Teal Card, plus simple tech themes **Slate** (charcoal/indigo), **Cloud** (cool light/sky), **Carbon** (near-black/blue), and **Frost** (clean SaaS light).
- **Optional image on any text slide** — add one and it sits above the text; leave it empty and the text stays vertically centred.
- **Full inline editing** — every field is editable, and you can change a slide's type on the fly (e.g. Quote → Big Statement) without losing your text.
- **Font picker** — choose a heading font across Sans (Plus Jakarta Sans, DM Sans, Sora), Serif (Fraunces, Playfair Display, Lora), and Cursive (Caveat, Dancing Script, Pacifico).
- **Generate with AI** — describe a topic and Claude drafts a full carousel (requires an API key, see below).
- **Import JSON** — load carousels produced by the generator scripts.

## Getting started

```bash
npm install
npm run dev
```

### AI generation (optional)

Create `.env.local` in the project root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Used only by the in-app "Generate with AI" panel.

## Architecture

- `src/App.jsx` — top-level state (mode, template, font, slides, post, author, profile) and layout.
- `src/components/TopBar.jsx` — shared controls (mode, font, author handle, profile photo).
- `src/components/Sidebar.jsx` — template picker, AI generation, slide list, add slide, import.
- `src/components/EditorPanel.jsx` — per-slide field editor with type switching.
- `src/components/PreviewPanel.jsx` / `PostPreview.jsx` — scaled live preview + export.
- `src/slides/SlideRenderer.jsx` → `StandardSlide.jsx` (theme-driven, all carousel palettes) and `TealCardSlide.jsx`.
- `src/posts/PostRenderer.jsx` → `PostSlide.jsx` — single-post layouts.
- `src/utils/fonts.js` — font registry. `src/utils/exportUtils.js` — render-to-JPEG pipeline.

Add a new palette by adding one entry to `THEMES` in `StandardSlide.jsx` and one to `TEMPLATES` in `Sidebar.jsx` — no layout code changes needed.

## Export

- Carousel: **Export JPEG** (current slide) or **Export all as ZIP**.
- Post: **Export JPEG**. Videos export as a static frame (a baked frame, or the uploaded image if provided).
