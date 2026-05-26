import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

const W = 1080;
const H = 1350;
const PAD = 80;

const BG = '#faf8f5';
const BLACK = '#0f0f0f';
const GRAY = '#888888';
const RULE = '#e0dcd8';

const SERIF = 'Fraunces, Georgia, serif';
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ─── atoms ─────────────────────────────────────────────── */

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M16 10L10 4M16 10L10 16"
        stroke={BLACK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowPill() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: `1.5px solid ${BLACK}`, borderRadius: 999,
      padding: '10px 22px', flexShrink: 0,
    }}>
      <Arrow />
    </div>
  );
}

function SeriesLabel({ label }) {
  if (!label) return null;
  const words = label.toUpperCase().split(' ');
  const line1 = words.slice(0, -1).join(' ');
  const line2 = words[words.length - 1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {line1 && <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: '0.18em', lineHeight: 1.25 }}>{line1}</span>}
      <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: '0.18em', lineHeight: 1.25 }}>{line2}</span>
    </div>
  );
}

function OrdinalWord({ word }) {
  if (!word) return null;
  return (
    <div style={{ fontFamily: SANS, fontSize: 21, fontWeight: 500, color: GRAY, marginBottom: 10, lineHeight: 1 }}>
      {word}
    </div>
  );
}

/** Filters out empty bullets so placeholder items don't render */
function Bullets({ items, compact = false }) {
  const filtered = (items ?? []).filter(b => b && b.trim() !== '');
  if (!filtered.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 16 }}>
      {filtered.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontFamily: SANS, fontSize: compact ? 23 : 26, lineHeight: 1.52, color: '#3a3a3a' }}>
          <span style={{ color: BLACK, flexShrink: 0, fontSize: compact ? 14 : 16, marginTop: compact ? 5 : 6, fontWeight: 600 }}>•</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}

/** macOS-style code window with traffic lights + hljs highlighting */
function MacCodeBlock({ code, language }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && code) {
      ref.current.removeAttribute('data-highlighted');
      ref.current.textContent = code;
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.28)' }}>
      {/* Traffic lights bar */}
      <div style={{ background: '#2d2d2d', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
        {language && (
          <span style={{ marginLeft: 14, fontFamily: SANS, fontSize: 13, color: '#888', letterSpacing: '0.06em' }}>
            {language}
          </span>
        )}
      </div>
      {/* Code */}
      <pre style={{ margin: 0, background: '#1e1e1e', padding: '32px 36px', overflowX: 'hidden' }}>
        <code
          ref={ref}
          className={`language-${language || 'javascript'}`}
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", ui-monospace, monospace',
            fontSize: 24, lineHeight: 1.72,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}
        />
      </pre>
    </div>
  );
}

/** Bottom bar — profile image + author name + (slide number OR follow button) */
function BottomBar({ authorName, profileImage, slideNum, showNum = true, showFollow = false, showArrow = false }) {
  const name = (authorName || 'Your Name').replace('@', '');
  return (
    <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Left: avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%', overflow: 'hidden',
          background: '#d4cfc9', flexShrink: 0, border: `1.5px solid ${RULE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {profileImage
            ? <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.3)', transformOrigin: 'center 20%' }} />
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#aaa"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }
        </div>
        <span style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: BLACK, letterSpacing: '0.01em' }}>
          {name}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {showNum && (
          <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 300, color: GRAY }}>{slideNum}</span>
        )}
        {showFollow && (
          <div style={{
            background: BLACK, borderRadius: 999, padding: '10px 26px',
            color: '#fff', fontFamily: SANS, fontSize: 15, fontWeight: 600, flexShrink: 0,
          }}>
            Follow
          </div>
        )}
        {showArrow && <ArrowPill />}
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────── */

export default function MagazineSlide({ slide, slideNum, authorName, profileImage }) {
  const series = slide.tag || '';

  /* ── COVER ─────────────────────────────────────────────── */
  if (slide.type === 'cover') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD + 10, left: PAD, right: PAD, bottom: PAD + 110 }}>
          <h1 style={{
            margin: 0, fontFamily: SERIF, fontWeight: 700,
            fontSize: 118, lineHeight: 0.91, color: BLACK, letterSpacing: '-4px',
            wordBreak: 'break-word',
          }}>
            {slide.heading || 'Your Title Here'}
          </h1>
          {slide.subtitle && (
            <div style={{ marginTop: 64, display: 'flex', justifyContent: 'flex-end' }}>
              <p style={{
                margin: 0, fontFamily: SANS, fontSize: 24, lineHeight: 1.7,
                color: GRAY, fontWeight: 400, maxWidth: '52%', textAlign: 'right',
              }}>
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} showNum={false} showFollow showArrow />
        </div>
      </div>
    );
  }

  /* ── QUOTE / TEXT ───────────────────────────────────────── */
  if (slide.type === 'text') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{
          position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28,
        }}>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: SANS, fontSize: 32, lineHeight: 1.65, color: GRAY, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
          <h2 style={{
            margin: 0, fontFamily: SERIF, fontWeight: 700,
            fontSize: 76, lineHeight: 1.02, color: BLACK, letterSpacing: '-2.5px',
          }}>
            {slide.heading}
          </h2>
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── BIG STATEMENT / LONGTEXT ───────────────────────────── */
  if (slide.type === 'longtext') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{
          position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110,
          display: 'flex', alignItems: 'center',
        }}>
          <h2 style={{
            margin: 0, fontFamily: SERIF, fontWeight: 700,
            fontSize: 92, lineHeight: 1.03, color: BLACK, letterSpacing: '-3px',
          }}>
            {slide.heading}
          </h2>
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── SINGLE NUMBERED LIST ───────────────────────────────── */
  if (slide.type === 'list') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
          <div>
            <OrdinalWord word={slide.subtitle} />
            <h2 style={{
              margin: 0, fontFamily: SERIF, fontWeight: 700,
              fontSize: 66, lineHeight: 1.04, color: BLACK, letterSpacing: '-2px',
            }}>
              {slide.heading}
            </h2>
          </div>
          <Bullets items={slide.bullets} />
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── DOUBLE SECTION — centrally aligned ─────────────────── */
  if (slide.type === 'doublelist') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        {/* Content: vertically centred between label and bottom bar */}
        <div style={{
          position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40,
        }}>
          {/* Section 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <OrdinalWord word={slide.subtitle} />
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: 1.06, color: BLACK, letterSpacing: '-1.8px' }}>
                {slide.heading}
              </h2>
            </div>
            <Bullets items={slide.bullets} compact />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: RULE, flexShrink: 0 }} />

          {/* Section 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <OrdinalWord word={slide.ordinal2} />
              <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: 1.06, color: BLACK, letterSpacing: '-1.8px' }}>
                {slide.heading2}
              </h2>
            </div>
            <Bullets items={slide.bullets2} compact />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── PHOTO TOP + TEXT BELOW ─────────────────────────────── */
  if (slide.type === 'imagetext') {
    const imgH = 510;
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD, zIndex: 2 }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: imgH, background: '#ccc8c2', overflow: 'hidden' }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
                <svg width="52" height="40" viewBox="0 0 52 40" fill="none"><rect x="1" y="1" width="50" height="38" rx="4" stroke="#999" strokeWidth="1.5"/><circle cx="14" cy="13" r="5" stroke="#999" strokeWidth="1.5"/><path d="M1 28l13-10 9 7 9-11 19 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ color: '#999', fontSize: 17, fontFamily: SANS, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Upload Photo</span>
              </div>
          }
        </div>
        <div style={{ position: 'absolute', top: imgH + 36, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <OrdinalWord word={slide.subtitle} />
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 56, lineHeight: 1.05, color: BLACK, letterSpacing: '-1.8px' }}>
              {slide.heading}
            </h2>
          </div>
          <Bullets items={slide.bullets} compact />
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── TEXT LEFT + SIDE IMAGE ─────────────────────────────── */
  if (slide.type === 'textimage') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <OrdinalWord word={slide.subtitle} />
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 60, lineHeight: 1.04, color: BLACK, letterSpacing: '-2px' }}>
              {slide.heading}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 32, flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1 }}>
              <Bullets items={slide.bullets} compact />
            </div>
            <div style={{ width: 360, borderRadius: 6, overflow: 'hidden', background: '#ccc8c2', flexShrink: 0, alignSelf: 'stretch' }}>
              {slide.imageUrl
                ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                    <svg width="40" height="32" viewBox="0 0 52 40" fill="none"><rect x="1" y="1" width="50" height="38" rx="4" stroke="#999" strokeWidth="1.5"/><circle cx="14" cy="13" r="5" stroke="#999" strokeWidth="1.5"/><path d="M1 28l13-10 9 7 9-11 19 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ color: '#999', fontSize: 14, fontFamily: SANS }}>Upload Photo</span>
                  </div>
              }
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── CTA / OUTRO ────────────────────────────────────────── */
  if (slide.type === 'cta') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{
          position: 'absolute', top: PAD, left: PAD, right: PAD, bottom: PAD + 110,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 28,
        }}>
          <h2 style={{
            margin: 0, fontFamily: SERIF, fontWeight: 700,
            fontSize: 98, lineHeight: 0.95, color: BLACK, letterSpacing: '-3.5px',
          }}>
            {slide.heading || "Save this post if it's helpful!"}
          </h2>
          {slide.body && (
            <p style={{ margin: 0, fontFamily: SANS, fontSize: 30, lineHeight: 1.5, color: GRAY, fontWeight: 400 }}>
              {slide.body}
            </p>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} showNum={false} showFollow showArrow />
        </div>
      </div>
    );
  }

  /* ── CODE — macOS window style ──────────────────────────── */
  if (slide.type === 'code') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>
        <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 56, lineHeight: 1.06, color: BLACK, letterSpacing: '-2px' }}>
              {slide.heading}
            </h2>
          )}
          <MacCodeBlock code={slide.code || '// your code here'} language={slide.language || 'javascript'} />
          {slide.body && (
            <p style={{ margin: 0, fontFamily: SANS, fontSize: 26, lineHeight: 1.7, color: GRAY }}>
              {slide.body}
            </p>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── FRAMED / SCREENSHOT ────────────────────────────────── */
  if (slide.type === 'framed' || slide.type === 'screenshot') {
    const full = slide.type === 'screenshot';
    if (full) {
      return (
        <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden' }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY, fontSize: 30, fontFamily: SANS }}>Upload an image</div>
          }
          {slide.caption && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '80px 64px 60px' }}>
              <p style={{ margin: 0, color: '#fff', fontFamily: SANS, fontSize: 30, lineHeight: 1.55 }}>{slide.caption}</p>
            </div>
          )}
        </div>
      );
    }
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}><SeriesLabel label={series} /></div>
        {slide.heading && (
          <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD }}>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: 1.07, color: BLACK }}>{slide.heading}</h2>
          </div>
        )}
        <div style={{ position: 'absolute', top: slide.heading ? PAD + 200 : PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, borderRadius: 6, overflow: 'hidden', background: '#e0dbd4' }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY, fontSize: 26, fontFamily: SANS }}>Upload image</div>
          }
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── FALLBACK ───────────────────────────────────────────── */
  return (
    <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
      <div style={{ position: 'absolute', top: PAD, left: PAD }}><SeriesLabel label={series} /></div>
      <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        {slide.heading && <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 72, lineHeight: 1.04, color: BLACK, letterSpacing: '-2.5px' }}>{slide.heading}</h2>}
        {slide.body && <p style={{ margin: 0, fontFamily: SANS, fontSize: 30, lineHeight: 1.7, color: '#555' }}>{slide.body}</p>}
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
        <BottomBar authorName={authorName} profileImage={profileImage} slideNum={slideNum} />
      </div>
    </div>
  );
}
