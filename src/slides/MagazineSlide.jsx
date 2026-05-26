/**
 * MagazineSlide — faithful copy of the "Lessons From Burnout" editorial template
 *
 * Slide types handled:
 *   cover      — large serif title + right-indented subtitle + arrow bottom
 *   text       — series label + intro body above bold serif heading (reversed hierarchy)
 *   longtext   — series label + very large single statement
 *   list       — series label + ordinal word + heading + bullet list
 *   doublelist — two numbered sections on one slide
 *   imagetext  — full-width photo top + ordinal + heading + bullets below
 *   textimage  — ordinal + heading + bullets left, image right
 *   cta        — big serif CTA text + follow line + arrow bottom (no label)
 */

const W = 1080;
const H = 1350;
const PAD = 80;

const BG = '#faf8f5';
const BLACK = '#0f0f0f';
const GRAY = '#888888';
const RULE = '#e0dcd8';

const SERIF = 'Fraunces, Georgia, serif';
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";

/* ─── shared atoms ─────────────────────────────────────── */

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
      padding: '10px 22px', gap: 8, flexShrink: 0,
    }}>
      <Arrow />
    </div>
  );
}

/** "LESSONS FROM\nBURNOUT" — split at last word so it stacks like the reference */
function SeriesLabel({ label }) {
  if (!label) return null;
  const words = label.toUpperCase().split(' ');
  const line1 = words.slice(0, -1).join(' ');
  const line2 = words[words.length - 1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {line1 && (
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: '0.18em', lineHeight: 1.25 }}>
          {line1}
        </span>
      )}
      <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: '0.18em', lineHeight: 1.25 }}>
        {line2}
      </span>
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

function Bullets({ items, compact = false }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 16 }}>
      {items.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, fontFamily: SANS, fontSize: compact ? 23 : 26, lineHeight: 1.52, color: '#3a3a3a' }}>
          <span style={{ color: BLACK, flexShrink: 0, fontSize: compact ? 14 : 16, marginTop: compact ? 5 : 6, fontWeight: 600 }}>•</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );
}

function BottomBar({ authorName, slideNum, showNum = true, showArrow = false }) {
  const brand = (authorName || 'Your Brand').replace('@', '');
  const parts = brand.split(' ');
  const name = parts[0];
  const rest = parts.slice(1).join(' ') || 'Company';
  return (
    <div style={{ borderTop: `1px solid ${RULE}`, paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: BLACK, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.2 }}>
          {name}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 400, color: GRAY, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.2 }}>
          {rest}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {showNum && (
          <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 300, color: GRAY }}>
            {slideNum}
          </span>
        )}
        {showArrow && <ArrowPill />}
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────── */

export default function MagazineSlide({ slide, slideNum, authorName }) {
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
          <BottomBar authorName={authorName} slideNum={slideNum} showNum={false} showArrow />
        </div>
      </div>
    );
  }

  /* ── QUOTE / TEXT ───────────────────────────────────────── */
  /* body (lighter) appears ABOVE heading (bold) — reversed hierarchy */
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── SINGLE NUMBERED SECTION / LIST ────────────────────── */
  if (slide.type === 'list') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>

        <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 26 }}>
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── DOUBLE SECTION / DOUBLELIST ────────────────────────── */
  if (slide.type === 'doublelist') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD }}>
          <SeriesLabel label={series} />
        </div>

        <div style={{ position: 'absolute', top: PAD + 68, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 36 }}>
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── PHOTO TOP + TEXT BELOW / IMAGETEXT ─────────────────── */
  if (slide.type === 'imagetext') {
    const imgH = 510;
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        {/* Series label floats above photo */}
        <div style={{ position: 'absolute', top: PAD, left: PAD, zIndex: 2 }}>
          <SeriesLabel label={series} />
        </div>

        {/* Full-width photo */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: imgH, background: '#ccc8c2', overflow: 'hidden' }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
                <svg width="52" height="40" viewBox="0 0 52 40" fill="none"><rect x="1" y="1" width="50" height="38" rx="4" stroke="#999" strokeWidth="1.5"/><circle cx="14" cy="13" r="5" stroke="#999" strokeWidth="1.5"/><path d="M1 28l13-10 9 7 9-11 19 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ color: '#999', fontSize: 17, fontFamily: SANS, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Upload Photo</span>
              </div>
          }
        </div>

        {/* Text below photo */}
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── TEXT LEFT + SIDE IMAGE / TEXTIMAGE ─────────────────── */
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

          {/* Two-column: bullets left, image right */}
          <div style={{ display: 'flex', gap: 32, flex: 1, minHeight: 0 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
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
          <BottomBar authorName={authorName} slideNum={slideNum} showNum={false} showArrow />
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
          <BottomBar authorName={authorName} slideNum={slideNum} />
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
        <BottomBar authorName={authorName} slideNum={slideNum} />
      </div>
    </div>
  );
}
