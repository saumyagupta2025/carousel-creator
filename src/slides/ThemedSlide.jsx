import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('go', go);
hljs.registerLanguage('sql', sql);

const PAD = 80;
const W = 1080;
const H = 1350;
const BULLETS = ['①', '②', '③', '④', '⑤'];
const GRADIENT_H = 20;

/* ── Palettes ──────────────────────────────────────────────────────────────── */

export const PALETTES = {
  // Clean teal/white alternating — editorial, Image 1 & 4 inspired
  teal: {
    name: 'Teal',
    alternating: true,
    // Odd slides: white bg
    bg: '#ffffff',
    heading: '#0d9488',
    body: '#4b5563',
    muted: '#9ca3af',
    tagBg: 'rgba(13,148,136,0.1)',
    tagBorder: 'rgba(13,148,136,0.28)',
    tagText: '#0d9488',
    borderColor: '#d1faf5',
    bulletColor: '#0d9488',
    boxShadow: '0 0 0 1px #e5e7eb',
    accentItalic: '#0d9488',
    // Even slides: teal bg (inverted)
    bgB: '#0d9488',
    headingB: '#ffffff',
    bodyB: '#ccfbf1',
    mutedB: '#5eead4',
    tagBgB: 'rgba(255,255,255,0.18)',
    tagBorderB: 'rgba(255,255,255,0.35)',
    tagTextB: '#ffffff',
    borderColorB: 'rgba(255,255,255,0.18)',
    bulletColorB: '#a5f3fc',
    boxShadowB: 'none',
    accentItalicB: '#a5f3fc',
    // Shared
    gradient: 'linear-gradient(90deg, #0d9488, #2dd4bf)',
    accent: '#0d9488',
    codeBg: '#0f172a',
    codeBorder: '#1e293b',
    headingFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    headingWeight: 800,
    coverUppercase: true,
    followBg: '#0d9488',
    followColor: '#ffffff',
  },

  // Dark navy + electric lime — bold, Image 2 inspired
  neon: {
    name: 'Neon',
    alternating: false,
    bg: '#0f1117',
    heading: '#ffffff',
    body: '#6b7280',
    muted: '#2d3142',
    tagBg: '#b5ff47',
    tagBorder: '#b5ff47',
    tagText: '#0a0c10',
    borderColor: 'rgba(181,255,71,0.1)',
    bulletColor: '#b5ff47',
    boxShadow: '0 0 0 1px #1a1d28',
    accentItalic: '#b5ff47',
    gradient: 'linear-gradient(90deg, #b5ff47, #22d3ee)',
    accent: '#b5ff47',
    codeBg: '#060810',
    codeBorder: '#151825',
    headingFont: "'Sora', system-ui, sans-serif",
    bodyFont: "'Sora', system-ui, sans-serif",
    headingWeight: 800,
    coverUppercase: false,
    followBg: '#b5ff47',
    followColor: '#0a0c10',
  },

  // Dark near-black + coral-orange — punchy, Image 3 inspired
  coral: {
    name: 'Coral',
    alternating: false,
    bg: '#0d0d0d',
    heading: '#ffffff',
    body: '#888888',
    muted: '#3a3a3a',
    tagBg: 'rgba(255,87,51,0.12)',
    tagBorder: 'rgba(255,87,51,0.3)',
    tagText: '#ff5733',
    borderColor: 'rgba(255,87,51,0.12)',
    bulletColor: '#ff5733',
    boxShadow: '0 0 0 1px #1a1a1a',
    accentItalic: '#ff5733',
    gradient: 'linear-gradient(90deg, #ff5733, #ff8c42)',
    accent: '#ff5733',
    codeBg: '#080808',
    codeBorder: '#1c1c1c',
    headingFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    headingWeight: 800,
    coverUppercase: false,
    followBg: '#ff5733',
    followColor: '#ffffff',
  },
};

/* ── Resolve colors for alternating themes ─────────────────────────────────── */

function resolveColors(palette, slideNum) {
  const inv = palette.alternating && slideNum % 2 === 0;
  if (!inv) {
    return {
      bg: palette.bg,
      heading: palette.heading,
      body: palette.body,
      muted: palette.muted,
      tagBg: palette.tagBg,
      tagBorder: palette.tagBorder,
      tagText: palette.tagText,
      borderColor: palette.borderColor,
      bulletColor: palette.bulletColor,
      boxShadow: palette.boxShadow,
      accentItalic: palette.accentItalic,
    };
  }
  return {
    bg: palette.bgB,
    heading: palette.headingB,
    body: palette.bodyB,
    muted: palette.mutedB,
    tagBg: palette.tagBgB,
    tagBorder: palette.tagBorderB,
    tagText: palette.tagTextB,
    borderColor: palette.borderColorB,
    bulletColor: palette.bulletColorB,
    boxShadow: palette.boxShadowB,
    accentItalic: palette.accentItalicB,
  };
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function parseItalics(text, accentColor) {
  if (!text) return null;
  return text.split(/(\*[^*]+\*)/).map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*')) {
      return (
        <em key={i} style={{ fontStyle: 'italic', color: accentColor, fontWeight: 'inherit' }}>
          {seg.slice(1, -1)}
        </em>
      );
    }
    return seg || null;
  });
}

function CodeBlock({ code, language, palette }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted');
      ref.current.textContent = code;
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <pre style={{ margin: 0, borderRadius: 14, overflow: 'hidden', background: palette.codeBg, border: `1px solid ${palette.codeBorder}` }}>
      <code
        ref={ref}
        className={`language-${language}`}
        style={{
          display: 'block',
          padding: '40px 44px',
          fontSize: 26,
          lineHeight: 1.7,
          fontFamily: '"Fira Code", "Cascadia Code", ui-monospace, monospace',
          overflowX: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      />
    </pre>
  );
}

function InstagramCTA({ authorName, profileImage, palette }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{
        width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        background: palette.gradient, border: `2px solid ${palette.borderColor ?? 'rgba(255,255,255,0.15)'}`,
      }}>
        {profileImage && (
          <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ color: palette.heading, fontFamily: palette.bodyFont, fontSize: 22, fontWeight: 600, lineHeight: 1 }}>
          {authorName || '@yourhandle'}
        </span>
        <span style={{ color: palette.body, fontFamily: palette.bodyFont, fontSize: 18, fontWeight: 400, lineHeight: 1 }}>
          Follow for more
        </span>
      </div>
      <div style={{
        background: palette.followBg,
        borderRadius: 999,
        padding: '10px 28px',
        color: palette.followColor ?? '#fff',
        fontFamily: palette.bodyFont,
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.01em',
        marginLeft: 8,
        whiteSpace: 'nowrap',
      }}>
        Follow
      </div>
    </div>
  );
}

/* ── Cover decoratives ─────────────────────────────────────────────────────── */

function CoverDecoratives({ palette, slideNum }) {
  // Teal: clean — big chapter number, top-right
  if (palette.name === 'Teal') {
    return (
      <div style={{
        position: 'absolute', top: PAD - 10, right: PAD,
        fontFamily: palette.headingFont,
        fontWeight: 900,
        fontSize: 160,
        lineHeight: 1,
        color: 'rgba(13,148,136,0.07)',
        letterSpacing: '-6px',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {String(slideNum).padStart(2, '0')}
      </div>
    );
  }

  // Neon: faint huge number bottom-right watermark
  if (palette.name === 'Neon') {
    return (
      <div style={{
        position: 'absolute', bottom: 40, right: -40,
        fontFamily: palette.headingFont,
        fontWeight: 900,
        fontSize: 560,
        lineHeight: 0.9,
        color: 'rgba(181,255,71,0.04)',
        letterSpacing: '-24px',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {String(slideNum).padStart(2, '0')}
      </div>
    );
  }

  // Coral: small accent square block top-left + faint huge heading echo
  if (palette.name === 'Coral') {
    return (
      <>
        <div style={{
          position: 'absolute', top: PAD, left: PAD,
          width: 18, height: 18,
          background: palette.accent,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 40, right: -30,
          fontFamily: palette.headingFont,
          fontWeight: 900,
          fontSize: 560,
          lineHeight: 0.9,
          color: 'rgba(255,87,51,0.04)',
          letterSpacing: '-24px',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {String(slideNum).padStart(2, '0')}
        </div>
      </>
    );
  }

  return null;
}

/* ── Per-theme slide number decoration ─────────────────────────────────────── */

function SlideNumber({ slideNum, palette, c }) {
  // Neon: big lime number top-right, prominent
  if (palette.name === 'Neon') {
    return (
      <div style={{
        position: 'absolute', top: PAD, right: PAD,
        fontFamily: palette.headingFont,
        fontWeight: 800,
        fontSize: 28,
        color: palette.accent,
        letterSpacing: '0.05em',
        zIndex: 1,
      }}>
        {String(slideNum).padStart(2, '0')}
      </div>
    );
  }

  // Coral: number top-right, accent square stays top-left
  if (palette.name === 'Coral') {
    return (
      <>
        <div style={{ position: 'absolute', top: PAD, left: PAD, width: 18, height: 18, background: palette.accent, zIndex: 1 }} />
        <div style={{ position: 'absolute', top: PAD + 2, right: PAD, fontFamily: palette.bodyFont, fontWeight: 500, fontSize: 24, color: c.muted, letterSpacing: '0.08em', zIndex: 1 }}>
          {String(slideNum).padStart(2, '0')}
        </div>
      </>
    );
  }

  // Teal: number top-left in accent/muted
  return (
    <div style={{
      position: 'absolute', top: PAD, left: PAD,
      fontFamily: palette.bodyFont,
      fontWeight: 700,
      fontSize: 22,
      color: c.muted,
      letterSpacing: '0.08em',
      zIndex: 1,
    }}>
      {String(slideNum).padStart(2, '0')}
    </div>
  );
}

/* ── Slide content ─────────────────────────────────────────────────────────── */

function SlideContent({ slide, palette, c }) {
  const hFont = palette.headingFont;
  const bFont = palette.bodyFont;
  const hW = palette.headingWeight || 700;

  switch (slide.type) {
    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.tag && (
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              background: c.tagBg,
              border: `1px solid ${c.tagBorder}`,
              color: c.tagText,
              borderRadius: palette.name === 'Neon' ? 6 : 999,
              padding: palette.name === 'Neon' ? '8px 20px' : '7px 20px',
              fontFamily: bFont,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: palette.name === 'Teal' ? '0.18em' : '0.08em',
              textTransform: palette.name === 'Teal' ? 'uppercase' : 'none',
            }}>
              {slide.tag}
            </div>
          )}
          <h1 style={{
            margin: 0,
            fontFamily: hFont,
            fontWeight: hW,
            fontSize: palette.coverUppercase ? 82 : 88,
            lineHeight: 1.06,
            color: c.heading,
            letterSpacing: palette.coverUppercase ? '-1px' : '-2.5px',
            textTransform: palette.coverUppercase ? 'uppercase' : 'none',
          }}>
            {parseItalics(slide.heading, c.accentItalic)}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: bFont, fontSize: 34, lineHeight: 1.55, color: c.body, fontWeight: 400 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 style={{ margin: 0, fontFamily: hFont, fontWeight: hW, fontSize: 66, lineHeight: 1.1, color: c.heading, letterSpacing: '-1.5px', textTransform: palette.coverUppercase ? 'uppercase' : 'none' }}>
            {parseItalics(slide.heading, c.accentItalic)}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: bFont, fontSize: 33, lineHeight: 1.7, color: c.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <h2 style={{ margin: 0, fontFamily: hFont, fontWeight: hW, fontSize: 58, lineHeight: 1.12, color: c.heading, letterSpacing: '-1.5px', textTransform: palette.coverUppercase ? 'uppercase' : 'none' }}>
            {parseItalics(slide.heading, c.accentItalic)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {slide.bullets.slice(0, 5).map((bullet, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 22,
                  fontFamily: bFont, fontSize: 32, lineHeight: 1.55, color: c.body,
                  paddingTop: 22, paddingBottom: 22,
                  borderBottom: `1px solid ${c.borderColor}`,
                }}
              >
                <span style={{ color: c.bulletColor, fontWeight: 700, flexShrink: 0, fontSize: 32, lineHeight: 1.55 }}>
                  {BULLETS[i]}
                </span>
                <span style={{ fontWeight: 400 }}>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'code':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: hFont, fontWeight: hW, fontSize: 54, lineHeight: 1.12, color: c.heading, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading, c.accentItalic)}
            </h2>
          )}
          <CodeBlock code={slide.code} language={slide.language} palette={palette} />
          {slide.body && (
            <p style={{ margin: 0, fontFamily: bFont, fontSize: 29, lineHeight: 1.7, color: c.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'longtext':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: hFont, fontWeight: hW, fontSize: 58, lineHeight: 1.12, color: c.heading, letterSpacing: '-1.5px' }}>
              {parseItalics(slide.heading, c.accentItalic)}
            </h2>
          )}
          <p style={{ margin: 0, fontFamily: bFont, fontSize: 32, lineHeight: 1.82, color: c.body, fontWeight: 400 }}>
            {slide.body}
          </p>
        </div>
      );

    default:
      return null;
  }
}

/* ── Tag pill ───────────────────────────────────────────────────────────────── */

function TagPill({ tag, palette, c }) {
  if (!tag) return <div />;
  return (
    <div style={{
      background: c.tagBg,
      border: `1px solid ${c.tagBorder}`,
      color: c.tagText,
      borderRadius: palette.name === 'Neon' ? 6 : 999,
      padding: '9px 24px',
      fontSize: 21,
      fontFamily: palette.bodyFont,
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {tag}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export default function ThemedSlide({ slide, slideNum, authorName, profileImage, palette }) {
  const c = resolveColors(palette, slideNum);

  /* Framed Screenshot */
  if (slide.type === 'framed') {
    const availableW = W - 2 * PAD;
    const imgW = Math.round(availableW * ((slide.imageSize ?? 75) / 100));

    return (
      <div style={{ width: W, height: H, background: c.bg, boxShadow: c.boxShadow, position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />
        <SlideNumber slideNum={slideNum} palette={palette} c={c} />

        <div style={{ position: 'absolute', top: PAD + 60, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, width: '100%', fontFamily: palette.headingFont, fontWeight: palette.headingWeight, fontSize: 54, lineHeight: 1.12, color: c.heading, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading, c.accentItalic)}
            </h2>
          )}
          {slide.captionPosition === 'above' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: palette.bodyFont, fontSize: 29, lineHeight: 1.65, color: c.body }}>{slide.caption}</p>
          )}
          <div style={{ width: imgW, borderRadius: 14, overflow: 'hidden', border: `2px solid ${c.borderColor}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', flexShrink: 0 }}>
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', paddingTop: '62.5%', background: palette.codeBg, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: 34 }}>Upload an image</div>
              </div>
            )}
          </div>
          {(slide.captionPosition ?? 'below') === 'below' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: palette.bodyFont, fontSize: 29, lineHeight: 1.65, color: c.body }}>{slide.caption}</p>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TagPill tag={slide.tag} palette={palette} c={c} />
          <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
        </div>
      </div>
    );
  }

  /* Screenshot */
  if (slide.type === 'screenshot') {
    return (
      <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: palette.codeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: 40 }}>
            Upload an image
          </div>
        )}
        {slide.textAbove && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(0,0,0,0.85), transparent)', padding: '56px 60px 80px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: palette.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>{slide.textAbove}</p>
          </div>
        )}
        {slide.caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '80px 60px 50px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: palette.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>{slide.caption}</p>
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />
      </div>
    );
  }

  /* All other types */
  return (
    <div style={{ width: W, height: H, background: c.bg, boxShadow: c.boxShadow, position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
      {/* Gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />

      {/* Cover decoratives */}
      {slide.type === 'cover' && <CoverDecoratives palette={palette} slideNum={slideNum} />}

      {/* Slide number + decorative accents */}
      <SlideNumber slideNum={slideNum} palette={palette} c={c} />

      {/* Main content — pushed down on non-cover to clear the number */}
      <div style={{
        position: 'absolute',
        top: slide.type === 'cover' ? PAD + 36 : PAD + 70,
        left: palette.name === 'Coral' ? PAD + 36 : PAD,
        right: PAD,
        bottom: PAD + 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        <SlideContent slide={slide} palette={palette} c={c} />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: PAD, left: PAD, right: PAD,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 1,
        paddingTop: 24,
        borderTop: slide.type !== 'cover' ? `1px solid ${c.borderColor}` : 'none',
      }}>
        {slide.type !== 'cover' ? (
          <TagPill tag={slide.tag} palette={palette} c={c} />
        ) : <div />}
        <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
      </div>
    </div>
  );
}
