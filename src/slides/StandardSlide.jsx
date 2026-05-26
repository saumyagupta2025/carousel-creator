/**
 * StandardSlide — one component, three themes (dark / warm / editorial)
 * All layout code lives here once. Theme configs drive every visual difference.
 * TealCardSlide and MagazineSlide remain separate (genuinely unique chrome).
 */

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

// ─── THEME CONFIGS ────────────────────────────────────────────────────────────
// Add a new theme: just add an entry here. No layout code changes needed.

export const THEMES = {
  dark: {
    name: 'dark',
    // Core palette
    bg: '#111111',
    heading: '#ffffff',
    body: '#888888',
    muted: '#444444',
    accent: '#6ee7b7',      // bullet dots, italic tint
    accentAlt: '#3b82f6',   // follow btn, circled numbers
    border: '#222222',
    // Typography
    headingFont: 'Fraunces, Georgia, serif',
    bodyFont: '"DM Sans", system-ui, sans-serif',
    headingWeight: 700,
    // Top bar
    topBarBg: 'linear-gradient(90deg, #6ee7b7, #3b82f6)',
    topBarH: 20,
    // Slide number chrome  ('left' | 'square-right' | 'editorial')
    numStyle: 'left',
    contentTop: PAD + 60,
    // Bottom bar
    bottomBorder: false,
    coverHideTag: false,    // show tag pill in bottom bar even on cover
    // Tag pill
    tagBg: 'transparent',
    tagBorderColor: '#1d4ed8',
    tagColor: '#6ee7b7',
    tagRadius: 999,
    tagPad: '9px 24px',
    tagLetterSpacing: '0.02em',
    tagUppercase: false,
    // Follow button
    followBg: '#3b82f6',
    followColor: '#ffffff',
    followRadius: 999,
    // Image / code areas
    imagePlaceholderBg: '#1a1a2e',
    imageBorderColor: 'rgba(255,255,255,0.14)',
    imageRadius: 16,
    codeBg: '#1a1a2e',
    codeBorder: '#2a2a4a',
  },

  warm: {
    name: 'warm',
    bg: '#faf6f0',
    heading: '#111111',
    body: '#555555',
    muted: '#999999',
    accent: '#7c6f5b',
    accentAlt: '#3b82f6',
    border: '#e8e0d4',
    headingFont: 'Fraunces, Georgia, serif',
    bodyFont: '"DM Sans", system-ui, sans-serif',
    headingWeight: 700,
    topBarBg: 'linear-gradient(90deg, #6ee7b7, #3b82f6)',
    topBarH: 20,
    numStyle: 'square-right',
    contentTop: PAD,
    bottomBorder: true,
    coverHideTag: true,
    tagBg: 'rgba(124,111,91,0.1)',
    tagBorderColor: 'rgba(124,111,91,0.28)',
    tagColor: '#7c6f5b',
    tagRadius: 999,
    tagPad: '9px 24px',
    tagLetterSpacing: '0.02em',
    tagUppercase: false,
    followBg: '#3b82f6',
    followColor: '#ffffff',
    followRadius: 999,
    imagePlaceholderBg: '#ede8e0',
    imageBorderColor: '#c8b99a',
    imageRadius: 16,
    codeBg: '#1e1e2e',
    codeBorder: '#ddd0c0',
  },

  editorial: {
    name: 'editorial',
    bg: '#f7f5f2',
    heading: '#0f0f0f',
    body: '#5a5a5a',
    muted: '#adadad',
    accent: '#0f0f0f',
    accentAlt: '#0f0f0f',
    border: '#ddd9d3',
    headingFont: 'Fraunces, Georgia, serif',
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    headingWeight: 700,
    topBarBg: '#0f0f0f',
    topBarH: 4,
    numStyle: 'editorial',  // "Slide" label left + num right + decorative line
    contentTop: PAD + 80,
    bottomBorder: true,
    coverHideTag: true,
    tagBg: 'transparent',
    tagBorderColor: '#0f0f0f',
    tagColor: '#0f0f0f',
    tagRadius: 0,
    tagPad: '5px 0',
    tagLetterSpacing: '0.16em',
    tagUppercase: true,
    followBg: '#0f0f0f',
    followColor: '#f7f5f2',
    followRadius: 4,
    imagePlaceholderBg: '#0f0f0f',
    imageBorderColor: '#ddd9d3',
    imageRadius: 0,
    codeBg: '#0f0f0f',
    codeBorder: '#1a1a1a',
  },
};

// ─── SHARED UTILITIES ─────────────────────────────────────────────────────────

function parseItalics(text, color) {
  if (!text) return null;
  return text.split(/(\*[^*]+\*)/).map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*'))
      return <em key={i} style={{ fontStyle: 'italic', color }}>{seg.slice(1, -1)}</em>;
    return seg || null;
  });
}

function CodeBlock({ code, language, theme }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && code) {
      ref.current.removeAttribute('data-highlighted');
      ref.current.textContent = code;
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);
  return (
    <pre style={{ margin: 0, borderRadius: 12, overflow: 'hidden', background: theme.codeBg, border: `1px solid ${theme.codeBorder}` }}>
      <code
        ref={ref}
        className={`language-${language || 'javascript'}`}
        style={{
          display: 'block', padding: '38px 42px', fontSize: 27, lineHeight: 1.72,
          fontFamily: '"Fira Code", "Cascadia Code", ui-monospace, monospace',
          overflowX: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}
      />
    </pre>
  );
}

function Bullets({ items, theme, fontSize = 30, gap = 14 }) {
  const filtered = (items ?? []).filter(b => b?.trim());
  if (!filtered.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {filtered.map((b, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, fontSize, lineHeight: 1.52, color: theme.body, fontFamily: theme.bodyFont }}>
          <span style={{ color: theme.accent, flexShrink: 0, fontWeight: 700 }}>•</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CHROME COMPONENTS ────────────────────────────────────────────────────────

function TopBar({ theme }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: theme.topBarH, background: theme.topBarBg }} />
  );
}

function SlideNum({ slideNum, theme }) {
  const num = String(slideNum).padStart(2, '0');

  if (theme.numStyle === 'square-right') {
    return (
      <div style={{ position: 'absolute', top: PAD, right: PAD, width: 80, height: 80, background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <span style={{ color: '#ffffff', fontFamily: theme.headingFont, fontWeight: 700, fontSize: 32, lineHeight: 1 }}>{num}</span>
      </div>
    );
  }

  if (theme.numStyle === 'editorial') {
    return (
      <>
        <div style={{ position: 'absolute', top: PAD, left: PAD, fontFamily: theme.bodyFont, fontWeight: 500, fontSize: 15, color: theme.muted, letterSpacing: '0.22em', textTransform: 'uppercase', zIndex: 1 }}>Slide</div>
        <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: theme.bodyFont, fontWeight: 400, fontSize: 19, color: theme.muted, zIndex: 1 }}>{num}</div>
        <div style={{ position: 'absolute', top: PAD + 46, left: PAD, right: PAD, height: 1, background: theme.heading }} />
      </>
    );
  }

  // default: top-left small text
  return (
    <div style={{ position: 'absolute', top: PAD, left: PAD, color: theme.muted, fontSize: 26, fontFamily: theme.bodyFont, fontWeight: 400, letterSpacing: '0.05em' }}>{num}</div>
  );
}

function TagPill({ tag, theme }) {
  if (!tag) return <div />;
  return (
    <div style={{
      background: theme.tagBg,
      border: `1px solid ${theme.tagBorderColor}`,
      color: theme.tagColor,
      borderRadius: theme.tagRadius,
      padding: theme.tagPad,
      fontSize: 18,
      fontFamily: theme.bodyFont,
      fontWeight: 500,
      letterSpacing: theme.tagLetterSpacing,
      textTransform: theme.tagUppercase ? 'uppercase' : 'none',
    }}>{tag}</div>
  );
}

function ProfileCTA({ authorName, profileImage, theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
        border: `2px solid ${theme.border}`,
      }}>
        {profileImage && (
          <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: theme.heading, fontFamily: theme.bodyFont, fontSize: 21, fontWeight: 600, lineHeight: 1 }}>{authorName || '@yourhandle'}</span>
        <span style={{ color: theme.body, fontFamily: theme.bodyFont, fontSize: 17, fontWeight: 300, lineHeight: 1 }}>Follow for more</span>
      </div>
      <div style={{
        background: theme.followBg, borderRadius: theme.followRadius,
        padding: '10px 26px', color: theme.followColor,
        fontFamily: theme.bodyFont, fontSize: 19, fontWeight: 600, marginLeft: 6, whiteSpace: 'nowrap',
      }}>Follow</div>
    </div>
  );
}

// ─── SLIDE CONTENT (inner layouts) ────────────────────────────────────────────

function SlideContent({ slide, theme }) {
  const H1 = (size, extra = {}) => ({
    margin: 0,
    fontFamily: theme.headingFont,
    fontWeight: theme.headingWeight,
    fontSize: size,
    lineHeight: 1.06,
    color: theme.heading,
    letterSpacing: '-2px',
    ...extra,
  });

  switch (slide.type) {
    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {slide.tag && (
            <div style={{ fontFamily: theme.bodyFont, fontSize: 18, fontWeight: 500, letterSpacing: '0.18em', color: theme.muted, textTransform: 'uppercase' }}>
              {slide.tag}
            </div>
          )}
          <h1 style={H1(90, { letterSpacing: '-2.5px', lineHeight: 1.03 })}>
            {parseItalics(slide.heading, theme.accent)}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: theme.bodyFont, fontSize: 33, lineHeight: 1.56, color: theme.body, fontWeight: 300 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <h2 style={H1(68)}>{parseItalics(slide.heading, theme.accent)}</h2>
          {slide.body && <p style={{ margin: 0, fontFamily: theme.bodyFont, fontSize: 33, lineHeight: 1.7, color: theme.body, fontWeight: 400 }}>{slide.body}</p>}
        </div>
      );

    case 'longtext':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          {slide.heading && <h2 style={H1(60)}>{parseItalics(slide.heading, theme.accent)}</h2>}
          <p style={{ margin: 0, fontFamily: theme.bodyFont, fontSize: 32, lineHeight: 1.84, color: theme.body, fontWeight: 400 }}>{slide.body}</p>
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <h2 style={H1(60)}>{parseItalics(slide.heading, theme.accent)}</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(slide.bullets ?? []).slice(0, 5).map((bullet, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                fontFamily: theme.bodyFont, fontSize: 32, lineHeight: 1.55, color: theme.body,
                paddingTop: 17, paddingBottom: 17, borderBottom: `1px solid ${theme.border}`,
              }}>
                <span style={{ color: theme.accent, fontWeight: 700, flexShrink: 0, fontSize: 32 }}>{BULLETS[i]}</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'doublelist':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {slide.subtitle && <div style={{ color: theme.muted, fontSize: 20, fontFamily: theme.bodyFont }}>{slide.subtitle}</div>}
            <h2 style={H1(52)}>{parseItalics(slide.heading, theme.accent)}</h2>
            <Bullets items={slide.bullets} theme={theme} fontSize={28} gap={12} />
          </div>
          <div style={{ height: 1, background: theme.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {slide.ordinal2 && <div style={{ color: theme.muted, fontSize: 20, fontFamily: theme.bodyFont }}>{slide.ordinal2}</div>}
            <h2 style={H1(52)}>{parseItalics(slide.heading2 || '', theme.accent)}</h2>
            <Bullets items={slide.bullets2} theme={theme} fontSize={28} gap={12} />
          </div>
        </div>
      );

    case 'code':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {slide.heading && <h2 style={H1(54)}>{parseItalics(slide.heading, theme.accent)}</h2>}
          <CodeBlock code={slide.code} language={slide.language} theme={theme} />
          {slide.body && <p style={{ margin: 0, fontFamily: theme.bodyFont, fontSize: 29, lineHeight: 1.7, color: theme.body }}>{slide.body}</p>}
        </div>
      );

    case 'cta':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, alignItems: 'center', textAlign: 'center' }}>
          <h2 style={H1(84, { letterSpacing: '-2.5px', lineHeight: 1.0 })}>
            {parseItalics(slide.heading || "Save this post if it's helpful!", theme.accent)}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: theme.bodyFont, fontSize: 33, lineHeight: 1.5, color: theme.body, fontWeight: 300 }}>{slide.body}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ─── FULL-BLEED SPECIAL LAYOUTS ───────────────────────────────────────────────

function ScreenshotSlide({ slide, theme }) {
  return (
    <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden' }}>
      {slide.imageUrl
        ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', background: theme.imagePlaceholderBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted, fontSize: 40, fontFamily: theme.bodyFont }}>Upload an image</div>
      }
      {slide.textAbove && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(0,0,0,0.82), transparent)', padding: '56px 60px 80px' }}>
          <p style={{ margin: 0, color: '#fff', fontFamily: theme.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>{slide.textAbove}</p>
        </div>
      )}
      {slide.caption && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.88))', padding: '80px 60px 50px' }}>
          <p style={{ margin: 0, color: '#fff', fontFamily: theme.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>{slide.caption}</p>
        </div>
      )}
      <TopBar theme={theme} />
    </div>
  );
}

function ImageTextSlide({ slide, authorName, profileImage, theme }) {
  const imgH = 510;
  const bottomStyle = theme.bottomBorder ? { borderTop: `1px solid ${theme.border}`, paddingTop: 22 } : {};
  return (
    <div style={{ width: W, height: H, background: theme.bg, position: 'relative', overflow: 'hidden', fontFamily: theme.bodyFont }}>
      <TopBar theme={theme} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: imgH, background: theme.imagePlaceholderBg, overflow: 'hidden' }}>
        {slide.imageUrl
          ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted, fontSize: 28, fontFamily: theme.bodyFont }}>Upload Photo</div>}
      </div>
      <div style={{ position: 'absolute', top: imgH + 30, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {slide.subtitle && <div style={{ color: theme.muted, fontSize: 20, fontFamily: theme.bodyFont }}>{slide.subtitle}</div>}
        <h2 style={{ margin: 0, fontFamily: theme.headingFont, fontWeight: theme.headingWeight, fontSize: 56, lineHeight: 1.08, color: theme.heading, letterSpacing: '-1.5px' }}>
          {parseItalics(slide.heading, theme.accent)}
        </h2>
        <Bullets items={slide.bullets} theme={theme} fontSize={28} gap={12} />
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', ...bottomStyle }}>
        <ProfileCTA authorName={authorName} profileImage={profileImage} theme={theme} />
      </div>
    </div>
  );
}

function TextImageSlide({ slide, slideNum, authorName, profileImage, theme }) {
  const bottomStyle = theme.bottomBorder ? { borderTop: `1px solid ${theme.border}`, paddingTop: 22 } : {};
  return (
    <div style={{ width: W, height: H, background: theme.bg, position: 'relative', overflow: 'hidden', fontFamily: theme.bodyFont }}>
      <TopBar theme={theme} />
      <SlideNum slideNum={slideNum} theme={theme} />
      <div style={{ position: 'absolute', top: theme.contentTop, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {slide.subtitle && <div style={{ color: theme.muted, fontSize: 20, fontFamily: theme.bodyFont }}>{slide.subtitle}</div>}
        <h2 style={{ margin: 0, fontFamily: theme.headingFont, fontWeight: theme.headingWeight, fontSize: 58, lineHeight: 1.08, color: theme.heading, letterSpacing: '-1.5px' }}>
          {parseItalics(slide.heading, theme.accent)}
        </h2>
        <div style={{ display: 'flex', gap: 28, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1 }}>
            <Bullets items={slide.bullets} theme={theme} fontSize={28} gap={14} />
          </div>
          <div style={{ width: 350, borderRadius: theme.imageRadius, overflow: 'hidden', background: theme.imagePlaceholderBg, flexShrink: 0, alignSelf: 'stretch', border: `1px solid ${theme.border}` }}>
            {slide.imageUrl
              ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted, fontSize: 22, fontFamily: theme.bodyFont }}>Upload Photo</div>}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...bottomStyle }}>
        <TagPill tag={slide.tag} theme={theme} />
        <ProfileCTA authorName={authorName} profileImage={profileImage} theme={theme} />
      </div>
    </div>
  );
}

function FramedSlide({ slide, slideNum, authorName, profileImage, theme }) {
  const availableW = W - 2 * PAD;
  const imgW = Math.round(availableW * ((slide.imageSize ?? 75) / 100));
  const bottomStyle = theme.bottomBorder ? { borderTop: `1px solid ${theme.border}`, paddingTop: 22 } : {};
  return (
    <div style={{ width: W, height: H, background: theme.bg, position: 'relative', overflow: 'hidden', fontFamily: theme.bodyFont }}>
      <TopBar theme={theme} />
      <SlideNum slideNum={slideNum} theme={theme} />
      <div style={{ position: 'absolute', top: theme.contentTop, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        {slide.heading && (
          <h2 style={{ margin: 0, width: '100%', fontFamily: theme.headingFont, fontWeight: theme.headingWeight, fontSize: 54, lineHeight: 1.12, color: theme.heading, letterSpacing: '-1px' }}>
            {parseItalics(slide.heading, theme.accent)}
          </h2>
        )}
        {slide.captionPosition === 'above' && slide.caption && (
          <p style={{ margin: 0, width: '100%', fontFamily: theme.bodyFont, fontSize: 29, lineHeight: 1.65, color: theme.body }}>{slide.caption}</p>
        )}
        <div style={{ width: imgW, borderRadius: theme.imageRadius, overflow: 'hidden', border: `2px solid ${theme.imageBorderColor}`, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', flexShrink: 0 }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
            : <div style={{ width: '100%', paddingTop: '62.5%', background: theme.imagePlaceholderBg, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted, fontSize: 36 }}>Upload an image</div>
              </div>}
        </div>
        {(slide.captionPosition ?? 'below') === 'below' && slide.caption && (
          <p style={{ margin: 0, width: '100%', fontFamily: theme.bodyFont, fontSize: 29, lineHeight: 1.65, color: theme.body }}>{slide.caption}</p>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...bottomStyle }}>
        <TagPill tag={slide.tag} theme={theme} />
        <ProfileCTA authorName={authorName} profileImage={profileImage} theme={theme} />
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function StandardSlide({ slide, slideNum, authorName, profileImage, theme }) {
  // Full-bleed / special layouts handled first
  if (slide.type === 'screenshot') return <ScreenshotSlide slide={slide} theme={theme} />;
  if (slide.type === 'imagetext')  return <ImageTextSlide  slide={slide} slideNum={slideNum} authorName={authorName} profileImage={profileImage} theme={theme} />;
  if (slide.type === 'textimage')  return <TextImageSlide  slide={slide} slideNum={slideNum} authorName={authorName} profileImage={profileImage} theme={theme} />;
  if (slide.type === 'framed')     return <FramedSlide     slide={slide} slideNum={slideNum} authorName={authorName} profileImage={profileImage} theme={theme} />;

  // Standard shell: top bar + slide num + centered content + bottom bar
  const showTagPill = !(slide.type === 'cover' && theme.coverHideTag);
  const bottomStyle = theme.bottomBorder ? { borderTop: `1px solid ${theme.border}`, paddingTop: 22 } : {};

  return (
    <div style={{ width: W, height: H, background: theme.bg, position: 'relative', overflow: 'hidden', fontFamily: theme.bodyFont }}>
      <TopBar theme={theme} />
      <SlideNum slideNum={slideNum} theme={theme} />
      <div style={{
        position: 'absolute',
        top: theme.contentTop,
        left: PAD,
        right: PAD,
        bottom: PAD + 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <SlideContent slide={slide} theme={theme} />
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...bottomStyle }}>
        {showTagPill ? <TagPill tag={slide.tag} theme={theme} /> : <div />}
        <ProfileCTA authorName={authorName} profileImage={profileImage} theme={theme} />
      </div>
    </div>
  );
}
