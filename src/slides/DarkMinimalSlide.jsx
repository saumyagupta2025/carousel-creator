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
const GRADIENT = 'linear-gradient(90deg, #6ee7b7, #3b82f6)';
const GRADIENT_H = 20;

const s = {
  bg: '#111111',
  border: '1px solid #222222',
  muted: '#444444',
  tagBorder: '#1d4ed8',
  tagText: '#6ee7b7',
  heading: '#ffffff',
  body: '#888888',
  headingFont: 'Fraunces, Georgia, serif',
  bodyFont: '"DM Sans", system-ui, sans-serif',
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
    <pre style={{ margin: 0, borderRadius: 12, overflow: 'hidden', background: '#1a1a2e', border: '1px solid #2a2a4a' }}>
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

/* Instagram-style CTA shown in the bottom bar */
function InstagramCTA({ authorName, profileImage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {/* Profile pic */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
          border: '2px solid #333',
        }}
      >
        {profileImage && (
          <img
            src={profileImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }}
          />
        )}
      </div>

      {/* Handle + follow for more */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: '#ffffff', fontFamily: s.bodyFont, fontSize: 22, fontWeight: 500, lineHeight: 1 }}>
          {authorName || '@yourhandle'}
        </span>
        <span style={{ color: s.body, fontFamily: s.bodyFont, fontSize: 18, fontWeight: 300, lineHeight: 1 }}>
          Follow for more
        </span>
      </div>

      {/* Follow button */}
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
          marginLeft: 8,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h1 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 88, lineHeight: 1.1, color: s.heading, letterSpacing: '-2px' }}>
            {parseItalics(slide.heading)}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 36, lineHeight: 1.5, color: s.body, fontWeight: 300 }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: s.heading, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.65, color: s.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: s.heading, letterSpacing: '-1.5px' }}>
            {parseItalics(slide.heading)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {slide.bullets.slice(0, 5).map((bullet, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.5, color: s.body }}>
                <span style={{ color: '#6ee7b7', fontWeight: 600, flexShrink: 0, fontSize: 36, lineHeight: 1.5 }}>{BULLETS[i]}</span>
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
            <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 56, lineHeight: 1.15, color: s.heading, letterSpacing: '-1px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <CodeBlock code={slide.code} language={slide.language} />
          {slide.body && (
            <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 30, lineHeight: 1.7, color: s.body, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
      );

    case 'longtext':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: s.headingFont, fontWeight: 700, fontSize: 60, lineHeight: 1.15, color: s.heading, letterSpacing: '-1.5px' }}>
              {parseItalics(slide.heading)}
            </h2>
          )}
          <p style={{ margin: 0, fontFamily: s.bodyFont, fontSize: 32, lineHeight: 1.8, color: s.body, fontWeight: 400 }}>
            {slide.body}
          </p>
        </div>
      );

    default:
      return null;
  }
}

export default function DarkMinimalSlide({ slide, slideNum, authorName, profileImage }) {
  if (slide.type === 'screenshot') {
    return (
      <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden', fontFamily: s.bodyFont }}>
        {/* Full-bleed image */}
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 40 }}>
            Upload an image
          </div>
        )}

        {/* Text above — gradient overlay at top */}
        {slide.textAbove && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(rgba(0,0,0,0.82), transparent)', padding: '56px 60px 80px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 500 }}>
              {slide.textAbove}
            </p>
          </div>
        )}

        {/* Text below (caption) — gradient overlay at bottom */}
        {slide.caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.88))', padding: '80px 60px 50px' }}>
            <p style={{ margin: 0, color: '#fff', fontFamily: s.bodyFont, fontSize: 34, lineHeight: 1.5, fontWeight: 400 }}>
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
    <div style={{ width: W, height: H, background: s.bg, boxShadow: '0 0 0 1px #222222', position: 'relative', overflow: 'hidden', fontFamily: s.bodyFont }}>
      {/* Gradient accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: GRADIENT_H, background: GRADIENT }} />

      {/* Slide number */}
      <div style={{ position: 'absolute', top: PAD, left: PAD, color: s.muted, fontSize: 26, fontFamily: s.bodyFont, fontWeight: 400, letterSpacing: '0.05em' }}>
        {String(slideNum).padStart(2, '0')}
      </div>

      {/* Main content */}
      <div style={{ position: 'absolute', top: PAD + 60, left: PAD, right: PAD, bottom: PAD + 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <SlideContent slide={slide} />
      </div>

      {/* Bottom bar: tag left | Instagram CTA right */}
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {slide.tag ? (
          <div style={{ border: `1px solid ${s.tagBorder}`, color: s.tagText, borderRadius: 999, padding: '9px 24px', fontSize: 22, fontFamily: s.bodyFont, fontWeight: 400, letterSpacing: '0.02em' }}>
            {slide.tag}
          </div>
        ) : (
          <div />
        )}
        <InstagramCTA authorName={authorName} profileImage={profileImage} />
      </div>
    </div>
  );
}
