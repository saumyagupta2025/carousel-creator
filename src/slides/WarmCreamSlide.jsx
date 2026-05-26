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
import 'highlight.js/styles/github.css';

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
const GRADIENT = 'linear-gradient(90deg, #6ee7b7, #3b82f6)';
const GRADIENT_H = 20;

const s = {
  bg: '#faf6f0',
  squareBg: '#000000',
  squareSize: 80,
  labelColor: '#999999',
  headingColor: '#111111',
  bodyColor: '#555555',
  borderColor: '#e8e0d4',
  headingFont: 'Fraunces, Georgia, serif',
  bodyFont: '"DM Sans", system-ui, sans-serif',
};

function parseItalics(text) {
  if (!text) return null;
  const segments = text.split(/(\*[^*]+\*)/);
  return segments.map((seg, i) => {
    if (seg.startsWith('*') && seg.endsWith('*')) {
      return <em key={i} style={{ fontStyle: 'italic', color: '#7c6f5b' }}>{seg.slice(1, -1)}</em>;
    }
    return seg || null;
  });
}

function CodeBlock({ code, language }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted');
      ref.current.textContent = code;
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <pre style={{ margin: 0, borderRadius: 12, overflow: 'hidden', background: '#1e1e2e', border: '1px solid #ddd0c0' }}>
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
          background: '#1e1e2e',
          color: '#cdd6f4',
        }}
      />
    </pre>
  );
}

/* Instagram-style CTA shown in the bottom bar */
function InstagramCTA({ authorName, profileImage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%', justifyContent: 'space-between' }}>
      {/* Left: profile pic + handle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            background: GRADIENT,
            border: '2px solid #d4c5b0',
          }}
        >
          {profileImage && (
            <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: s.headingColor, fontFamily: s.bodyFont, fontSize: 22, fontWeight: 600, lineHeight: 1 }}>
            {authorName || '@yourhandle'}
          </span>
          <span style={{ color: s.bodyColor, fontFamily: s.bodyFont, fontSize: 18, fontWeight: 300, lineHeight: 1 }}>
            Follow for more
          </span>
        </div>
      </div>

      {/* Right: Follow button */}
      <div
        style={{
          background: '#3b82f6',
          borderRadius: 999,
          padding: '10px 28px',
          color: '#fff',
          fontFamily: s.bodyFont,
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        Follow
      </div>
    </div>
  );
}

function SlideContent({ slide }) {
  switch (slide.type) {
    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.tag && (
            <div style={{ fontFamily: s.bodyFont, fontSize: 22, fontWeight: 500, letterSpacing: '0.2em', color: s.labelColor, textTransform: 'uppercase' }}>
              {slide.tag}
            </div>
          )}
          <h1 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 90, lineHeight: 1.08, color: s.headingColor, letterSpacing: '-2.5px' }}>
            {parseItalics(slide.heading)}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.6, color: s.bodyColor, fontWeight: 300 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 68, lineHeight: 1.12, color: s.headingColor, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.7, color: s.bodyColor, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: s.headingColor, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {slide.bullets.slice(0, 5).map((bullet, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  fontFamily: s.bodyFont,
                  fontSize: 33,
                  lineHeight: 1.55,
                  color: s.bodyColor,
                  paddingBottom: 22,
                  borderBottom: i < slide.bullets.slice(0, 5).length - 1 ? `1px solid ${s.borderColor}` : 'none',
                }}
              >
                <span style={{ color: '#7c6f5b', fontWeight: 600, flexShrink: 0, fontSize: 34, lineHeight: 1.55, fontFamily: s.headingFont }}>
                  {BULLETS[i]}
                </span>
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
            <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: s.headingColor, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <CodeBlock code={slide.code} language={slide.language} />
          {slide.body && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 30, lineHeight: 1.7, color: s.bodyColor, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'longtext':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: s.headingColor, letterSpacing: '-1.5px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 32, lineHeight: 1.8, color: s.bodyColor, fontWeight: 400 }}>
            {slide.body}
          </p>
        </div>
      );

    default:
      return null;
  }
}

export default function WarmCreamSlide({ slide, slideNum, authorName, profileImage }) {
  if (slide.type === 'framed') {
    const availableW = W - 2 * PAD;
    const imgW = Math.round(availableW * ((slide.imageSize ?? 75) / 100));

    return (
      <div style={{ width: W, height: H, background: s.bg, position: 'relative', overflow: 'hidden', fontFamily: s.bodyFont }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: GRADIENT }} />
        <div style={{ position: 'absolute', top: PAD, right: PAD, width: s.squareSize, height: s.squareSize, background: s.squareBg, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <span style={{ color: '#fff', fontFamily: s.headingFont, fontWeight: 700, fontSize: 32, lineHeight: 1 }}>
            {String(slideNum).padStart(2, '0')}
          </span>
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, width: '100%', fontFamily: s.headingFont, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: s.headingColor, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          {slide.captionPosition === 'above' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: s.bodyFont, fontSize: 30, lineHeight: 1.65, color: s.bodyColor, fontWeight: 400 }}>
              {slide.caption}
            </p>
          )}
          <div style={{ width: imgW, borderRadius: 16, overflow: 'hidden', border: '3px solid #c8b99a', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', flexShrink: 0 }}>
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', paddingTop: '62.5%', background: '#ede8e0', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 36 }}>Upload an image</div>
              </div>
            )}
          </div>
          {(slide.captionPosition ?? 'below') === 'below' && slide.caption && (
            <p style={{ margin: 0, width: '100%', fontFamily: s.bodyFont, fontSize: 30, lineHeight: 1.65, color: s.bodyColor, fontWeight: 400 }}>
              {slide.caption}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, borderTop: `1px solid ${s.borderColor}`, paddingTop: 24 }}>
          <InstagramCTA authorName={authorName} profileImage={profileImage} />
        </div>
      </div>
    );
  }

  if (slide.type === 'screenshot') {
    return (
      <div style={{ width: W, height: H, background: s.bg, position: 'relative', overflow: 'hidden', fontFamily: s.bodyFont }}>
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#ede8e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 40, fontFamily: s.bodyFont }}>
            Upload an image
          </div>
        )}

        {/* Text above — warm overlay at top */}
        {slide.textAbove && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(250,246,240,0.92), transparent)', padding: '56px 60px 80px' }}>
            <p style={{ margin: 0, color: s.headingColor, fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>
              {slide.textAbove}
            </p>
          </div>
        )}

        {/* Text below (caption) — warm overlay at bottom */}
        {slide.caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(250,246,240,0.92)', padding: '40px 60px 50px', borderTop: `2px solid ${s.borderColor}` }}>
            <p style={{ margin: 0, color: s.headingColor, fontFamily: s.bodyFont, fontSize: 33, lineHeight: 1.5, fontWeight: 400 }}>
              {slide.caption}
            </p>
          </div>
        )}

        {/* Gradient bar at very top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: GRADIENT }} />
      </div>
    );
  }

  return (
    <div style={{ width: W, height: H, background: s.bg, position: 'relative', overflow: 'hidden', fontFamily: s.bodyFont }}>
      {/* Gradient accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: GRADIENT }} />

      {/* Top-right corner square */}
      <div
        style={{
          position: 'absolute',
          top: PAD,
          right: PAD,
          width: s.squareSize,
          height: s.squareSize,
          background: s.squareBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <span style={{ color: '#fff', fontFamily: s.headingFont, fontWeight: 700, fontSize: 32, lineHeight: 1 }}>
          {String(slideNum).padStart(2, '0')}
        </span>
      </div>

      {/* Main content — full width, centered vertically */}
      <div
        style={{
          position: 'absolute',
          top: PAD,
          left: PAD,
          right: PAD,
          bottom: PAD + 110,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <SlideContent slide={slide} />
      </div>

      {/* Bottom bar: Instagram CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: PAD,
          left: PAD,
          right: PAD,
          borderTop: `1px solid ${s.borderColor}`,
          paddingTop: 24,
        }}
      >
        <InstagramCTA authorName={authorName} profileImage={profileImage} />
      </div>
    </div>
  );
}
