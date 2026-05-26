/**
 * TealCardSlide — alternating white / teal cards
 * Matches reference image 1: geometric bold sans, divider-line-circle bottom,
 * profile pill left + double-chevron right, large item number on content slides.
 */

const W = 1080;
const H = 1350;
const PAD = 80;
const TEAL = '#45b8c3';
const TEAL_DARK = '#3aa5b0';
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

function getColors(slideNum) {
  const isTeal = slideNum % 2 === 0;
  if (isTeal) {
    return {
      bg: TEAL,
      heading: '#ffffff',
      body: 'rgba(255,255,255,0.88)',
      muted: 'rgba(255,255,255,0.45)',
      line: 'rgba(255,255,255,0.38)',
      circle: '#ffffff',
      chevron: '#ffffff',
      pillBg: 'rgba(0,0,0,0.18)',
      pillBorder: 'rgba(255,255,255,0.2)',
      pillText: '#ffffff',
      pillSub: 'rgba(255,255,255,0.6)',
      numColor: 'rgba(255,255,255,0.88)',
    };
  }
  return {
    bg: '#ffffff',
    heading: TEAL,
    body: '#555555',
    muted: '#bbbbbb',
    line: '#dedede',
    circle: TEAL,
    chevron: TEAL,
    pillBg: '#f3f3f3',
    pillBorder: '#e5e5e5',
    pillText: '#222222',
    pillSub: '#888888',
    numColor: TEAL,
  };
}

function DoubleChevron({ color, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 10L14 22L26 34" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 10L6 22L18 34" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProfilePill({ authorName, profileImage, c }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: c.pillBg, border: `1px solid ${c.pillBorder}`,
      borderRadius: 999, padding: '10px 22px 10px 10px',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%', overflow: 'hidden',
        background: TEAL_DARK, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {profileImage
          ? <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.7)"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
        }
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c.pillSub, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          @{(authorName || 'username').replace('@', '')}
        </span>
        <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: c.pillText, lineHeight: 1.1 }}>
          {authorName || 'Your Name'}
        </span>
      </div>
    </div>
  );
}

function DividerLine({ c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <div style={{ flex: 1, height: 1.5, background: c.line }} />
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: c.circle, flexShrink: 0,
        margin: '0 0',
      }} />
      <div style={{ flex: 1, height: 1.5, background: c.line }} />
    </div>
  );
}

function BottomBar({ authorName, profileImage, c }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
      <ProfilePill authorName={authorName} profileImage={profileImage} c={c} />
      <DoubleChevron color={c.chevron} />
    </div>
  );
}

export default function TealCardSlide({ slide, slideNum, authorName, profileImage }) {
  const c = getColors(slideNum);
  const slideNumStr = String(slideNum).padStart(2, '0');

  /* ── COVER ── */
  if (slide.type === 'cover') {
    return (
      <div style={{ width: W, height: H, background: c.bg, position: 'relative', overflow: 'hidden', fontFamily: FONT }}>
        {/* Slide number top-right */}
        <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: c.muted, letterSpacing: '0.08em' }}>
          {slideNumStr}
        </div>

        {/* Title */}
        <div style={{
          position: 'absolute', top: PAD + 10, left: PAD, right: PAD + 60,
          bottom: PAD + 150,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32,
        }}>
          {slide.tag && (
            <div style={{ fontSize: 18, fontWeight: 600, color: c.muted, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              {slide.tag}
            </div>
          )}
          <h1 style={{
            margin: 0, fontFamily: FONT, fontWeight: 800,
            fontSize: 108, lineHeight: 0.92,
            color: c.heading, textTransform: 'uppercase', letterSpacing: '-3px',
            wordBreak: 'break-word',
          }}>
            {slide.heading || 'YOUR AWESOME CONTENT TITLE'}
          </h1>
          {slide.subtitle && (
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 28, lineHeight: 1.6, color: c.body, fontWeight: 400, maxWidth: '80%' }}>
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Divider + bottom */}
        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <DividerLine c={c} />
          <BottomBar authorName={authorName} profileImage={profileImage} c={c} />
        </div>
      </div>
    );
  }

  /* ── FRAMED (image) ── */
  if (slide.type === 'framed' || slide.type === 'screenshot') {
    const imgH = 460;
    return (
      <div style={{ width: W, height: H, background: c.bg, position: 'relative', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: c.muted, letterSpacing: '0.08em' }}>
          {slideNumStr}
        </div>

        <div style={{ position: 'absolute', top: PAD + 20, left: PAD, right: PAD, bottom: PAD + 150 }}>
          {/* Item number + label */}
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 100, lineHeight: 1, color: c.numColor, letterSpacing: '-3px', marginBottom: -4 }}>
            {slide.tag || slideNumStr}
          </div>
          {slide.heading && (
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.heading, marginBottom: 24 }}>
              {slide.heading}
            </div>
          )}
          {/* Image placeholder */}
          <div style={{
            width: '100%', height: imgH, borderRadius: 8, overflow: 'hidden',
            background: c.pillBg, border: `2px solid ${c.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
          }}>
            {slide.imageUrl
              ? <img src={slide.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <>
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="4" y="10" width="44" height="32" rx="4" stroke={c.muted} strokeWidth="2"/><circle cx="16" cy="20" r="4" stroke={c.muted} strokeWidth="2"/><path d="M4 34l12-8 8 6 8-10 16 12" stroke={c.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ color: c.muted, fontSize: 20, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Insert Image Here</span>
                </>
            }
          </div>
          {slide.caption && (
            <p style={{ margin: '20px 0 0', fontFamily: FONT, fontSize: 26, lineHeight: 1.6, color: c.body }}>{slide.caption}</p>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
          <DividerLine c={c} />
          <BottomBar authorName={authorName} profileImage={profileImage} c={c} />
        </div>
      </div>
    );
  }

  /* ── TEXT / LIST / LONGTEXT (generic content) ── */
  const itemNum = slide.tag || slideNumStr;
  const hasBullets = slide.type === 'list' && slide.bullets?.length > 0;

  return (
    <div style={{ width: W, height: H, background: c.bg, position: 'relative', overflow: 'hidden', fontFamily: FONT }}>
      {/* Slide number top-right */}
      <div style={{ position: 'absolute', top: PAD, right: PAD, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: c.muted, letterSpacing: '0.08em' }}>
        {slideNumStr}
      </div>

      {/* Content area */}
      <div style={{
        position: 'absolute', top: PAD + 16, left: PAD, right: PAD, bottom: PAD + 150,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0,
      }}>
        {/* Large item number */}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, lineHeight: 1, color: c.numColor, letterSpacing: '-4px', marginBottom: -8 }}>
          {itemNum}
        </div>

        {/* Heading / category label */}
        {slide.heading && (
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.heading, marginBottom: hasBullets ? 28 : 32, marginTop: 6 }}>
            {slide.heading}
          </div>
        )}

        {/* Body text */}
        {slide.body && (
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 30, lineHeight: 1.78, color: c.body, fontWeight: 400 }}>
            {slide.body}
          </p>
        )}

        {/* Bullet list */}
        {hasBullets && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {slide.bullets.slice(0, 5).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, fontFamily: FONT, fontSize: 28, lineHeight: 1.55, color: c.body }}>
                <span style={{ color: c.heading, fontWeight: 800, flexShrink: 0, fontSize: 22, marginTop: 4 }}>•</span>
                <span style={{ fontWeight: 400 }}>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider + bottom bar */}
      <div style={{ position: 'absolute', bottom: PAD, left: PAD, right: PAD }}>
        <DividerLine c={c} />
        <BottomBar authorName={authorName} profileImage={profileImage} c={c} />
      </div>
    </div>
  );
}
