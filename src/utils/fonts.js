// Central font registry. Each entry's `stack` is what gets injected as a CSS
// font-family override (heading font) across carousel themes and posts.
// Families are served locally via @fontsource (imported in main.jsx) so
// html-to-image can embed them in exports without CORS issues.

export const FONTS = [
  // ── Sans ──
  { id: 'jakarta', name: 'Plus Jakarta Sans', category: 'Sans', stack: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { id: 'dmsans',  name: 'DM Sans',           category: 'Sans', stack: '"DM Sans", system-ui, sans-serif' },
  { id: 'sora',    name: 'Sora',              category: 'Sans', stack: "'Sora', system-ui, sans-serif" },
  // ── Serif ──
  { id: 'fraunces', name: 'Fraunces',         category: 'Serif', stack: "'Fraunces', Georgia, serif" },
  { id: 'playfair', name: 'Playfair Display', category: 'Serif', stack: "'Playfair Display', Georgia, serif" },
  { id: 'lora',     name: 'Lora',             category: 'Serif', stack: "'Lora', Georgia, serif" },
  // ── Cursive / Script ──
  { id: 'caveat',   name: 'Caveat',           category: 'Cursive', stack: "'Caveat', cursive" },
  { id: 'dancing',  name: 'Dancing Script',   category: 'Cursive', stack: "'Dancing Script', cursive" },
  { id: 'pacifico', name: 'Pacifico',         category: 'Cursive', stack: "'Pacifico', cursive" },
];

export const FONT_CATEGORIES = ['Sans', 'Serif', 'Cursive'];

// Default heading font = the existing carousel look (Plus Jakarta Sans).
export const DEFAULT_FONT_ID = 'jakarta';

export function fontStackById(id) {
  return FONTS.find((f) => f.id === id)?.stack ?? null;
}

// Used by exportUtils to preload the chosen heading font before capture.
export function fontFamilyNameById(id) {
  const name = FONTS.find((f) => f.id === id)?.name;
  if (!name) return null;
  // Strip "Variable" suffix used in stacks; load() wants the family name.
  return name;
}
