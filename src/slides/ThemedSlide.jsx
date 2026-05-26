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

export const PALETTES = {
  editorial: {
    name: 'Editorial',
    alternating: false,
    noGradientBar: true,
    bg: '#f7f5f2', heading: '#0f0f0f', body: '#5a5a5a', muted: '#adadad',
    tagBg: 'transparent', tagBorder: '#0f0f0f', tagText: '#0f0f0f',
    borderColor: '#ddd9d3', bulletColor: '#0f0f0f', boxShadow: '0 0 0 1px #e0dbd4', accentItalic: '#0f0f0f',
    gradient: 'linear-gradient(90deg, #0f0f0f, #3a3a3a)', accent: '#0f0f0f',
    codeBg: '#0f0f0f', codeBorder: '#1a1a1a',
    headingFont: 'Fraunces, Georgia, serif',
    bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
    headingWeight: 700, coverUppercase: false, followBg: '#0f0f0f', followColor: '#f7f5f2',
  },
};

function resolveColors(palette, slideNum) {
  const inv = palette.alternating && slideNum % 2 === 0;
  if (!inv) return {
    bg: palette.bg, heading: palette.heading, body: palette.body, muted: palette.muted,
    tagBg: palette.tagBg, tagBorder: palette.tagBorder, tagText: palette.tagText,
    borderColor: palette.borderColor, bulletColor: palette.bulletColor,
    boxShadow: palette.boxShadow, accentItalic: palette.accentItalic,
  };
  return {
    bg: palette.bgB, heading: palette.headingB, body: palette.bodyB, muted: palette.mutedB,
    tagBg: palette.tagBgB, tagBorder: palette.tagBorderB, tagText: palette.tagTextB,
    borderColor: palette.borderColorB, bulletColor: palette.bulletColorB,
    boxShadow: palette.boxShadowB, accentItalic: palette.accentItalicB,
  };
}

function parseItalics(text, accentColor) {
  if (!text) return null;
  return text.split(/(\*[^*]+\*)/).map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*'))
      return <em key={i} style={{ fontStyle: 'italic', color: accentColor, fontWeight: 'inherit' }}>{seg.slice(1, -1)}</em>;
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
    <pre style={{ margin: 0, borderRadius: 10, overflow: 'hidden', background: palette.codeBg, border: `1px solid ${palette.codeBorder}` }}>
      <code ref={ref} className={`language-${language}`}
        style={{ display: 'block', padding: '36px 40px', fontSize: 25, lineHeight: 1.7, fontFamily: '"Fira Code", ui-monospace, monospace', overflowX: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} />
    </pre>
  );
}

function InstagramCTA({ authorName, profileImage, palette }) {
  const isEd = palette.name === 'Editorial';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: palette.gradient, border: `2px solid ${palette.borderColor}` }}>
        {profileImage && <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: palette.heading, fontFamily: palette.bodyFont, fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>{authorName || '@yourhandle'}</span>
        <span style={{ color: palette.body, fontFamily: palette.bodyFont, fontSize: 16, fontWeight: 400, lineHeight: 1.1 }}>Follow for more</span>
      </div>
      <div style={{
        background: palette.followBg, borderRadius: isEd ? 4 : 999,
        padding: '9px 22px', color: palette.followColor ?? '#fff',
        fontFamily: palette.bodyFont, fontSize: 17, fontWeight: 700, marginLeft: 8, whiteSpace: 'nowrap',
      }}>Follow</div>
    </div>
  );
}

function TagPill({ tag, palette, c }) {
  if (!tag) return <div />;
  const isEd = palette.name === 'Editorial';
  const isBold = palette.name === 'Bold';
  return (
    <div style={{
      background: c.tagBg, border: `1px solid ${c.tagBorder}`, color: c.tagText,
      borderRadius: isBold ? 4 : isEd ? 0 : 999,
      padding: isBold ? '7px 16px' : isEd ? '5px 0' : '8px 22px',
      fontSize: 18, fontFamily: palette.bodyFont,
      fontWeight: isBold ? 700 : 500,
      letterSpacing: isEd ? '0.16em' : '0.02em',
      textTransform: isEd ? 'uppercase' : 'none',
    }}>{tag}</div>
  );
}

function CoverDecoratives({ palette, slideNum }) {
  const num = String(slideNum).padStart(2, '0');
  if (palette.name === 'Teal') return (
    <div style={{ position: 'absolute', top: PAD - 30, right: PAD - 20, fontFamily: palette.headingFont, fontWeight: 900, fontSize: 200, lineHeight: 1, color: 'rgba(13,148,136,0.06)', letterSpacing: '-8px', userSelect: 'none', pointerEvents: 'none' }}>{num}</div>
  );
  if (palette.name === 'Bold') return (
    <div style={{ position: 'absolute', bottom: 30, right: -50, fontFamily: palette.headingFont, fontWeight: 900, fontSize: 560, lineHeight: 0.88, color: 'rgba(99,102,241,0.05)', letterSpacing: '-24px', userSelect: 'none', pointerEvents: 'none' }}>{num}</div>
  );
  if (palette.name === 'Coral') return (<>
    <div style={{ position: 'absolute', top: PAD + 2, left: PAD, width: 20, height: 20, background: palette.accent, pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: 30, right: -50, fontFamily: palette.headingFont, fontWeight: 900, fontSize: 560, lineHeight: 0.88, color: 'rgba(239,68,68,0.05)', letterSpacing: '-24px', userSelect: 'none', pointerEvents: 'none' }}>{num}</div>
  </>);
  if (palette.name === 'Editorial') return (
    <div style={{ position: 'absolute', top: PAD + 48, left: PAD, right: PAD, height: 1, background: '#0f0f0f', pointerEvents: 'none' }} />
  );
  return null;
}

function SlideNumber({ slideNum, palette, c }) {
  const num = String(slideNum).padStart(2, '0');
  if (palette.name === 'Bold') return (
    <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: palette.headingFont, fontWeight: 800, fontSize: 26, color: palette.accent, letterSpacing: '0.05em', zIndex: 1 }}>{num}</div>
  );
  if (palette.name === 'Coral') return (<>
    <div style={{ position: 'absolute', top: PAD + 2, left: PAD, width: 20, height: 20, background: palette.accent, zIndex: 1 }} />
    <div style={{ position: 'absolute', top: PAD + 2, right: PAD, fontFamily: palette.bodyFont, fontWeight: 500, fontSize: 21, color: c.muted, letterSpacing: '0.08em', zIndex: 1 }}>{num}</div>
  </>);
  if (palette.name === 'Editorial') return (<>
    <div style={{ position: 'absolute', top: PAD, left: PAD, fontFamily: palette.bodyFont, fontWeight: 500, fontSize: 16, color: c.muted, letterSpacing: '0.22em', textTransform: 'uppercase', zIndex: 1 }}>Slide</div>
    <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: palette.bodyFont, fontWeight: 400, fontSize: 19, color: c.muted, zIndex: 1 }}>{num}</div>
  </>);
  return (
    <div style={{ position: 'absolute', top: PAD, left: PAD, fontFamily: palette.bodyFont, fontWeight: 700, fontSize: 21, color: c.muted, letterSpacing: '0.08em', zIndex: 1 }}>{num}</div>
  );
}

function SlideContent({ slide, palette, c }) {
  const hFont = palette.headingFont;
  const bFont = palette.bodyFont;
  const hW = palette.headingWeight || 700;
  const isEd = palette.name === 'Editorial';
  const isUpper = palette.coverUppercase;

  const headingStyle = (size) => ({
    margin: 0, fontFamily: hFont, fontWeight: hW, fontSize: size, lineHeight: isEd ? 1.04 : 1.08,
    color: c.heading, letterSpacing: isUpper ? '-1px' : isEd ? '-3px' : '-2px',
    textTransform: isUpper ? 'uppercase' : 'none',
  });

  switch (slide.type) {
    case 'cover': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {slide.tag && (
          <div style={{
            fontFamily: bFont, fontSize: isEd ? 17 : 19, fontWeight: isEd ? 500 : 600,
            letterSpacing: isEd ? '0.22em' : '0.1em', color: isEd ? c.muted : c.tagText, textTransform: 'uppercase',
            ...(isEd ? {} : {
              display: 'inline-block', background: c.tagBg, border: `1px solid ${c.tagBorder}`,
              borderRadius: palette.name === 'Bold' ? 4 : 999, padding: '7px 20px', alignSelf: 'flex-start',
            }),
          }}>{slide.tag}</div>
        )}
        <h1 style={headingStyle(isEd ? 94 : 84)}>
          {parseItalics(slide.heading, c.accentItalic)}
        </h1>
        {slide.subtitle && (
          <p style={{ margin: 0, fontFamily: bFont, fontSize: isEd ? 30 : 33, lineHeight: 1.55, color: c.body, fontWeight: isEd ? 400 : 300, maxWidth: isEd ? '85%' : '100%' }}>
            {slide.subtitle}
          </p>
        )}
      </div>
    );

    case 'text': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <h2 style={headingStyle(isEd ? 70 : 62)}>{parseItalics(slide.heading, c.accentItalic)}</h2>
        {slide.body && <p style={{ margin: 0, fontFamily: bFont, fontSize: 32, lineHeight: 1.72, color: c.body, fontWeight: 400 }}>{slide.body}</p>}
      </div>
    );

    case 'list': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={headingStyle(isEd ? 64 : 56)}>{parseItalics(slide.heading, c.accentItalic)}</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {slide.bullets.slice(0, 5).map((bullet, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: bFont, fontSize: 30, lineHeight: 1.55, color: c.body, paddingTop: 18, paddingBottom: 18, borderBottom: `1px solid ${c.borderColor}` }}>
              <span style={{ color: c.bulletColor, fontWeight: 700, flexShrink: 0, fontSize: 30, fontFamily: isEd ? hFont : bFont }}>{BULLETS[i]}</span>
              <span style={{ fontWeight: 400 }}>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    );

    case 'code': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {slide.heading && <h2 style={headingStyle(50)}>{parseItalics(slide.heading, c.accentItalic)}</h2>}
        <CodeBlock code={slide.code} language={slide.language} palette={palette} />
        {slide.body && <p style={{ margin: 0, fontFamily: bFont, fontSize: 27, lineHeight: 1.7, color: c.body, fontWeight: 400 }}>{slide.body}</p>}
      </div>
    );

    case 'longtext': return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        {slide.heading && <h2 style={headingStyle(isEd ? 64 : 56)}>{parseItalics(slide.heading, c.accentItalic)}</h2>}
        <p style={{ margin: 0, fontFamily: bFont, fontSize: 30, lineHeight: 1.88, color: c.body, fontWeight: 400 }}>{slide.body}</p>
      </div>
    );

    default: return null;
  }
}

export default function ThemedSlide({ slide, slideNum, authorName, profileImage, palette }) {
  const c = resolveColors(palette, slideNum);
  const isEd = palette.name === 'Editorial';
  const topBar = palette.noGradientBar
    ? <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#0f0f0f' }} />
    : <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: palette.gradient }} />;

  if (slide.type === 'framed') {
    const imgW = Math.round((W - 2 * PAD) * ((slide.imageSize ?? 75) / 100));
    return (
      <div style={{ width: W, height: H, background: c.bg, boxShadow: c.boxShadow, position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
        {topBar}
        <SlideNumber slideNum={slideNum} palette={palette} c={c} />
        <div style={{ position: 'absolute', top: PAD + 64, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          {slide.heading && <h2 style={{ margin: 0, width: '100%', fontFamily: palette.headingFont, fontWeight: palette.headingWeight, fontSize: 50, lineHeight: 1.12, color: c.heading, letterSpacing: '-1px' }}>{parseItalics(slide.heading, c.accentItalic)}</h2>}
          {slide.captionPosition === 'above' && slide.caption && <p style={{ margin: 0, width: '100%', fontFamily: palette.bodyFont, fontSize: 28, lineHeight: 1.65, color: c.body }}>{slide.caption}</p>}
          <div style={{ width: imgW, borderRadius: isEd ? 0 : 12, overflow: 'hidden', border: `2px solid ${c.borderColor}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', flexShrink: 0 }}>
            {slide.imageUrl ? <img src={slide.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
              : <div style={{ width: '100%', paddingTop: '62.5%', background: palette.codeBg, position: 'relative' }}><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: 32 }}>Upload an image</div></div>}
          </div>
          {(slide.captionPosition ?? 'below') === 'below' && slide.caption && <p style={{ margin: 0, width: '100%', fontFamily: palette.bodyFont, fontSize: 28, lineHeight: 1.65, color: c.body }}>{slide.caption}</p>}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${c.borderColor}`, paddingTop: 22 }}>
          <TagPill tag={slide.tag} palette={palette} c={c} />
          <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
        </div>
      </div>
    );
  }

  if (slide.type === 'screenshot') {
    return (
      <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
        {slide.imageUrl ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: palette.codeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.muted, fontSize: 40 }}>Upload an image</div>}
        {slide.textAbove && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(0,0,0,0.85), transparent)', padding: '56px 60px 80px' }}><p style={{ margin: 0, color: '#fff', fontFamily: palette.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>{slide.textAbove}</p></div>}
        {slide.caption && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '80px 60px 50px' }}><p style={{ margin: 0, color: '#fff', fontFamily: palette.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>{slide.caption}</p></div>}
        {topBar}
      </div>
    );
  }

  return (
    <div style={{ width: W, height: H, background: c.bg, boxShadow: c.boxShadow, position: 'relative', overflow: 'hidden', fontFamily: palette.bodyFont }}>
      {topBar}
      {slide.type === 'cover' && <CoverDecoratives palette={palette} slideNum={slideNum} />}
      <SlideNumber slideNum={slideNum} palette={palette} c={c} />
      <div style={{
        position: 'absolute',
        top: slide.type === 'cover' ? (isEd ? PAD + 80 : PAD + 40) : (isEd ? PAD + 80 : PAD + 70),
        left: palette.name === 'Coral' ? PAD + 36 : PAD,
        right: PAD,
        bottom: PAD + 110,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1,
      }}>
        <SlideContent slide={slide} palette={palette} c={c} />
      </div>
      <div style={{
        position: 'absolute', bottom: PAD, left: PAD, right: PAD,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 1, paddingTop: 22,
        borderTop: `1px solid ${slide.type === 'cover' && !isEd ? 'transparent' : c.borderColor}`,
      }}>
        {slide.type !== 'cover' ? <TagPill tag={slide.tag} palette={palette} c={c} /> : <div />}
        <InstagramCTA authorName={authorName} profileImage={profileImage} palette={palette} />
      </div>
    </div>
  );
}
