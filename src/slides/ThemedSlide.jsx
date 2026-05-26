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
const HEADING_FONT = 'Fraunces, Georgia, serif';
const BODY_FONT = '"DM Sans", system-ui, sans-serif';

export const PALETTES = {
  vivid: {
    name: 'Vivid',
    bg: '#0f0a1e',
    gradient: 'linear-gradient(90deg, #c084fc, #f472b6)',
    accent: '#c084fc',
    heading: '#f0e6ff',
    body: '#8a78aa',
    muted: '#3a2a5a',
    tagBg: 'rgba(192,132,252,0.1)',
    tagBorder: 'rgba(192,132,252,0.32)',
    tagText: '#c084fc',
    codeBg: '#0d0818',
    codeBorder: '#231640',
    borderColor: 'rgba(192,132,252,0.12)',
    bulletColor: '#c084fc',
    decorative: 'rings',
  },
  ember: {
    name: 'Ember',
    bg: '#0e0b07',
    gradient: 'linear-gradient(90deg, #fb923c, #f43f5e)',
    accent: '#fb923c',
    heading: '#fff8f0',
    body: '#8a6040',
    muted: '#3a2010',
    tagBg: 'rgba(251,146,60,0.1)',
    tagBorder: 'rgba(251,146,60,0.3)',
    tagText: '#fb923c',
    codeBg: '#080502',
    codeBorder: '#221408',
    borderColor: 'rgba(251,146,60,0.12)',
    bulletColor: '#fb923c',
    decorative: 'bignum',
  },
  ocean: {
    name: 'Ocean',
    bg: '#02101e',
    gradient: 'linear-gradient(90deg, #22d3ee, #0ea5e9)',
    accent: '#22d3ee',
    heading: '#e0f6ff',
    body: '#4a7a96',
    muted: '#0a2535',
    tagBg: 'rgba(34,211,238,0.08)',
    tagBorder: 'rgba(34,211,238,0.28)',
    tagText: '#22d3ee',
    codeBg: '#010c18',
    codeBorder: '#061e30',
    borderColor: 'rgba(34,211,238,0.1)',
    bulletColor: '#22d3ee',
    decorative: 'dotgrid',
  },
};

function parseItalics(text) {
  if (!text) return null;
  const segments = text.split(/(\*[^*]+\*)/);
  return segments.map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*')) {
      return <em key={i} style={{ fontStyle: 'italic' }}>{seg.slice(1, -1)}</em>;
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
    <pre style={{ margin: 0, borderRadius: 12, overflow: 'hidden', background: palette.codeBg, border: `1px solid ${palette.codeBorder}` }}>
      <code
        ref={ref}
        className={`language-${language}`}
        style={{
          display: 'block',
          padding: '40px 44px',
          fontSize: 28,
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
      <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: palette.gradient, border: `2px solid ${palette.borderColor}` }}>
        {profileImage && (
          <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: palette.heading, fontFamily: BODY_FONT, fontSize: 22, fontWeight: 500, lineHeight: 1 }}>
          {authorName || '@yourhandle'}
        </span>
        <span style={{ color: palette.body, fontFamily: BODY_FONT, fontSize: 18, fontWeight: 300, lineHeight: 1 }}>
          Follow for more
        </span>
      </div>
      <div style={{ background: '#3b82f6', borderRadius: 999, padding: '10px 28px', color: '#fff', fontFamily: BODY_FONT, fontSize: 20, fontWeight: 600, letterSpacing: '0.02em', marginLeft: 8, whiteSpace: 'nowrap' }}>
        Follow
      </div>
    </div>
  );
}

/* Cover-only decorative elements per palette */
function CoverDecoratives({ palette, slideNum }) {
  if (palette.decorative === 'rings') {
    return (
      <>
        <div style={{ position: 'absolute', top: -240, right: -240, width: 720, height: 720, borderRadius: '50%', border: '1px solid rgba(192,132,252,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(244,114,182,0.11)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 120, right: 120, width: 160, height: 160, borderRadius: '50%', background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.1)', pointerEvents: 'none' }} />
      </>
    );
  }
  if (palette.decorative === 'bignum') {
    return (
      <div style={{ position: 'absolute', bottom: 60, right: -40, fontSize: 600, lineHeight: 0.85, fontWeight: 900, fontFamily: HEADING_FONT, color: 'rgba(251,146,60,0.07)', userSelect: 'none', letterSpacing: '-20px', pointerEvents: 'none' }}>
        {String(slideNum).padStart(2, '0')}
      </div>
    );
  }
  if (palette.decorative === 'dotgrid') {
    return (
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(34,211,238,0.14) 1.5px, transparent 1.5px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
    );
  }
  return null;
}

function SlideContent({ slide, palette }) {
  switch (slide.type) {
    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {slide.tag && (
            <div style={{ fontFamily: BODY_FONT, fontSize: 20, fontWeight: 500, letterSpacing: '0.22em', color: palette.accent, textTransform: 'uppercase' }}>
              {slide.tag}
            </div>
          )}
          <h1 style={{ margin: 0, fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 88, lineHeight: 1.08, color: palette.heading, letterSpacing: '-2px' }}>
            {parseItalics(slide.heading)}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: BODY_FONT, fontSize: 36, lineHeight: 1.5, color: palette.body, fontWeight: 300 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 style={{ margin: 0, fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: palette.heading, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: BODY_FONT, fontSize: 34, lineHeight: 1.65, color: palette.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h2 style={{ margin: 0, fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: palette.heading, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {slide.bullets.slice(0, 5).map((bullet, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: BODY_FONT, fontSize: 34, lineHeight: 1.5, color: palette.body, paddingBottom: 24, borderBottom: i < slide.bullets.slice(0, 5).length - 1 ? `1px solid ${palette.borderColor}` : 'none' }}>
                <span style={{ color: palette.bulletColor, fontWeight: 600, flexShrink: 0, fontSize: 36, lineHeight: 1.5 }}>{BULLETS[i]}</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'code':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: palette.heading, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <CodeBlock code={slide.code} language={slide.language} palette={palette} />
          {slide.body && (
            <p style={{ margin: 0, fontFamily: BODY_FONT, fontSize: 30, lineHeight: 1.7, color: palette.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'longtext':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: palette.heading, letterSpacing: '-1.5px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <p style={{ margin: 0, fontFamily: BODY_FONT, fontSize: 32, lineHeight: 1.8, color: palette.body, fontWeight: 400 }}>
            {slide.body}
          </p>
        </div>
      );

    default:
      return null;
  }
}

export default function ThemedSlide({ slide, slideNum, authorName, profileImage, palette }) {
  if (slide.type === 'framed') {
    const availableW = W - 2 * PAD;
    const imgW = Math.round(availableW * ((slide.imageSize ?? 75) / 100));

    return (
      <div style={{ width: W, height: H, background: palette.bg, boxShadow: '0 0 0 1px #1a1a1a', position: 'relative', overflow: 'hidden', fontFamily: BODY_FONT }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />
        <div style={{ position: 'absolute', top: PAD, left: PAD, color: palette.muted, fontSize: 26, fontFamily: BODY_FONT, fontWeight: 400, letterSpacing: '0.05em' }}>
          {String(slideNum).padStart(2, '0')}
        </div>
        <div style={{ position: 'absolute', top: PAD + 60, left: PAD, right: PAD, bottom: PAD + 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, width: '100%', fontFamily: HEADING_FONT, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: palette.heading, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          {slide.captionPosition === 'above' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: BODY_FONT, fontSize: 30, lineHeight: 1.65, color: palette.body, fontWeight: 400 }}>{slide.caption}</p>
          )}
          <div style={{ width: imgW, borderRadius: 16, overflow: 'hidden', border: `2px solid ${palette.borderColor}`, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', flexShrink: 0 }}>
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', paddingTop: '62.5%', background: palette.codeBg, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted, fontSize: 36 }}>Upload an image</div>
              </div>
            )}
          </div>
          {(slide.captionPosition ?? 'below') === 'below' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: BODY_FONT, fontSize: 30, lineHeight: 1.65, color: palette.body, fontWeight: 400 }}>{slide.caption}</p>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {slide.tag ? (
            <div style={{ background: palette.tagBg, border: `1px solid ${palette.tagBorder}`, color: palette.tagText, borderRadius: 999, padding: '9px 24px', fontSize: 22, fontFamily: BODY_FONT, fontWeight: 400 }}>
              {slide.tag}
            </div>
          ) : <div />}
          <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
        </div>
      </div>
    );
  }

  if (slide.type === 'screenshot') {
    return (
      <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden', fontFamily: BODY_FONT }}>
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: palette.codeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted, fontSize: 40 }}>
            Upload an image
          </div>
        )}
        {slide.textAbove && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(0,0,0,0.85), transparent)', padding: '56px 60px 80px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: BODY_FONT, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>{slide.textAbove}</p>
          </div>
        )}
        {slide.caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '80px 60px 50px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: BODY_FONT, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>{slide.caption}</p>
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />
      </div>
    );
  }

  return (
    <div style={{ width: W, height: H, background: palette.bg, boxShadow: '0 0 0 1px #1a1a1a', position: 'relative', overflow: 'hidden', fontFamily: BODY_FONT }}>
      {/* Gradient accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />

      {/* Cover decoratives */}
      {slide.type === 'cover' && <CoverDecoratives palette={palette} slideNum={slideNum} />}

      {/* Slide number */}
      <div style={{ position: 'absolute', top: PAD, left: PAD, color: palette.muted, fontSize: 26, fontFamily: BODY_FONT, fontWeight: 400, letterSpacing: '0.05em', zIndex: 1 }}>
        {String(slideNum).padStart(2, '0')}
      </div>

      {/* Main content */}
      <div style={{ position: 'absolute', top: slide.type === 'cover' ? PAD + 40 : PAD + 60, left: PAD, right: PAD, bottom: PAD + 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <SlideContent slide={slide} palette={palette} />
      </div>

      {/* Bottom bar: tag left | CTA right */}
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        {slide.tag && slide.type !== 'cover' ? (
          <div style={{ background: palette.tagBg, border: `1px solid ${palette.tagBorder}`, color: palette.tagText, borderRadius: 999, padding: '9px 24px', fontSize: 22, fontFamily: BODY_FONT, fontWeight: 400, letterSpacing: '0.02em' }}>
            {slide.tag}
          </div>
        ) : <div />}
        <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
      </div>
    </div>
  );
}
