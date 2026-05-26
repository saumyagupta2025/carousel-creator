/**
 * MagazineSlide — editorial magazine style
 * Matches reference image 2: off-white background, bold serif headings (Fraunces),
 * small-caps series label top-left, numbered ordinals, clean bottom bar.
 */

const W = 1080;
const H = 1350;
const PAD = 80;
const BG = '#faf8f5';
const BLACK = '#111111';
const GRAY = '#888888';
const LIGHT = '#e0dcd8';
const SERIF = 'Fraunces, Georgia, serif';
const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";

const ORDINAL_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

function ArrowButton() {
  return (
    <div style={{
      width: 58, height: 58, borderRadius: '50%',
      border: `2px solid ${BLACK}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={BLACK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function SeriesLabel({ label }) {
  if (!label) return null;
  return (
    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: GRAY, letterSpacing: '0.22em', textTransform: 'uppercase', lineHeight: 1 }}>
      {label}
    </div>
  );
}

function BottomBar({ authorName, slideNum }) {
  const numStr = String(slideNum).padStart(2, '0');
  const brand = (authorName || 'YOUR BRAND').toUpperCase();
  return (
    <div style={{ borderTop: `1px solid ${LIGHT}`, paddingTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Brand name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: BLACK, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>
          {brand}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 400, color: GRAY, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
          Company
        </span>
      </div>
      {/* Slide number + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 400, color: GRAY }}>{numStr}</span>
        <ArrowButton />
      </div>
    </div>
  );
}

export default function MagazineSlide({ slide, slideNum, authorName, profileImage }) {
  const seriesLabel = slide.tag || '';
  const slideNumStr = String(slideNum).padStart(2, '0');

  /* ── COVER ── */
  if (slide.type === 'cover') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        {/* Content block */}
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD, bottom: PAD + 110 }}>
          {/* Series label top-left */}
          {seriesLabel && (
            <SeriesLabel label={seriesLabel} />
          )}

          {/* Main title — positioned center-ish, vertically */}
          <div style={{ marginTop: seriesLabel ? 72 : 60 }}>
            <h1 style={{
              margin: 0, fontFamily: SERIF, fontWeight: 700,
              fontSize: 112, lineHeight: 0.94, color: BLACK,
              letterSpacing: '-4px', wordBreak: 'break-word',
            }}>
              {slide.heading || 'Your Content Title'}
            </h1>
          </div>

          {/* Subtitle — indented right, italic sans */}
          {slide.subtitle && (
            <div style={{ marginTop: 56, paddingLeft: 220, borderLeft: `3px solid ${LIGHT}`, marginLeft: 0 }}>
              <p style={{
                margin: 0, fontFamily: SANS, fontSize: 26, lineHeight: 1.65,
                color: GRAY, fontWeight: 400,
              }}>
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── TEXT (quote / statement slide) ── */
  if (slide.type === 'text') {
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        {/* Top area */}
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <SeriesLabel label={seriesLabel} />
        </div>

        {/* Content — vertically centered */}
        <div style={{
          position: 'absolute', top: PAD + 60, left: PAD, right: PAD, bottom: PAD + 110,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36,
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

  /* ── LIST (numbered content slide) ── */
  if (slide.type === 'list') {
    // Derive ordinal word from slideNum offset (cover = 1, so first list = 2 → "One")
    const ordinalIdx = Math.max(0, slideNum - 2);
    const ordinalWord = ORDINAL_WORDS[ordinalIdx] ?? String(ordinalIdx + 1);

    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD }}>
          <SeriesLabel label={seriesLabel} />
        </div>

        <div style={{ position: 'absolute', top: PAD + 70, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Ordinal + heading */}
          <div>
            <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 500, color: GRAY, marginBottom: 10 }}>
              {ordinalWord}
            </div>
            <h2 style={{
              margin: 0, fontFamily: SERIF, fontWeight: 700,
              fontSize: 64, lineHeight: 1.04, color: BLACK, letterSpacing: '-2px',
            }}>
              {slide.heading}
            </h2>
          </div>

          {/* Bullet list */}
          {slide.bullets?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              {slide.bullets.slice(0, 5).map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, fontFamily: SANS, fontSize: 27, lineHeight: 1.58, color: '#444' }}>
                  <span style={{ color: GRAY, flexShrink: 0, marginTop: 2 }}>—</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── FRAMED (image slide) ── */
  if (slide.type === 'framed' || slide.type === 'screenshot') {
    const full = slide.type === 'screenshot';
    if (full) {
      return (
        <div style={{ width: W, height: H, background: '#000', position: 'relative', overflow: 'hidden' }}>
          {slide.imageUrl
            ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY, fontSize: 32, fontFamily: SANS }}>Upload an image</div>
          }
          {slide.caption && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '80px 64px 60px' }}>
              <p style={{ margin: 0, color: '#fff', fontFamily: SANS, fontSize: 32, lineHeight: 1.55 }}>{slide.caption}</p>
            </div>
          )}
        </div>
      );
    }
    return (
      <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
        <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD }}>
          <SeriesLabel label={seriesLabel} />
        </div>
        <div style={{ position: 'absolute', top: PAD + 60, left: PAD, right: PAD, bottom: PAD + 110, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {slide.heading && (
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 58, lineHeight: 1.08, color: BLACK, letterSpacing: '-2px' }}>{slide.heading}</h2>
          )}
          <div style={{ flex: 1, borderRadius: 6, overflow: 'hidden', background: '#ece9e4', border: `1px solid ${LIGHT}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {slide.imageUrl
              ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="4" y="10" width="44" height="32" rx="4" stroke={LIGHT} strokeWidth="2.5"/><circle cx="16" cy="20" r="4" stroke={LIGHT} strokeWidth="2.5"/><path d="M4 34l12-8 8 6 8-10 16 12" stroke={LIGHT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ color: GRAY, fontSize: 20, fontFamily: SANS, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Insert Image Here</span>
                  </div>
                </>
            }
          </div>
          {slide.caption && <p style={{ margin: 0, fontFamily: SANS, fontSize: 27, lineHeight: 1.6, color: GRAY }}>{slide.caption}</p>}
        </div>
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <BottomBar authorName={authorName} slideNum={slideNum} />
        </div>
      </div>
    );
  }

  /* ── LONGTEXT / FALLBACK ── */
  return (
    <div style={{ width: W, height: H, background: BG, position: 'relative', overflow: 'hidden', fontFamily: SANS }}>
      <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD }}>
        <SeriesLabel label={seriesLabel} />
      </div>
      <div style={{
        position: 'absolute', top: PAD + 70, left: PAD, right: PAD, bottom: PAD + 110,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32,
      }}>
        {slide.heading && (
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 72, lineHeight: 1.05, color: BLACK, letterSpacing: '-2.5px' }}>
            {slide.heading}
          </h2>
        )}
        {slide.body && (
          <p style={{ margin: 0, fontFamily: SANS, fontSize: 30, lineHeight: 1.78, color: '#555' }}>
            {slide.body}
          </p>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
        <BottomBar authorName={authorName} slideNum={slideNum} />
      </div>
    </div>
  );
}
