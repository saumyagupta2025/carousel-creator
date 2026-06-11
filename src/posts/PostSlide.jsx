/**
 * PostSlide — a single 1080×1350 image/video post for startup & AI-news
 * headlines. Three layout variants, a source chip, a text-colour control, and
 * a follow row that shows the creator's own photo.
 */
import { parseFormatting } from '../slides/StandardSlide';

const W = 1080;
const H = 1350;
const PAD = 80;

export const POST_LAYOUTS = [
  { id: 'bottom',    label: 'Headline bottom' },
  { id: 'center',    label: 'Headline center' },
  { id: 'topSource', label: 'Source top' },
];

function Background({ post }) {
  if (post.videoUrl) {
    return (
      <video
        src={post.videoUrl}
        poster={post.imageUrl || undefined}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  if (post.imageUrl) {
    return <img src={post.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  }
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e1b2e, #0f1020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 38, fontFamily: '"DM Sans", sans-serif' }}>
      Upload an image or video
    </div>
  );
}

function SourceChip({ post }) {
  if (!post.source) return null;
  return (
    <div style={{
      alignSelf: 'flex-start',
      background: post.accentColor,
      color: '#ffffff',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '11px 22px',
      borderRadius: 8,
    }}>{post.source}</div>
  );
}

function Headline({ post, headingFont }) {
  return (
    <h1 style={{
      margin: 0,
      fontFamily: headingFont,
      fontWeight: 800,
      fontSize: 78,
      lineHeight: 1.04,
      letterSpacing: '-1.5px',
      color: post.textColor,
      textAlign: post.align === 'center' ? 'center' : 'left',
      textShadow: '0 2px 24px rgba(0,0,0,0.45)',
    }}>
      {parseFormatting(post.headline, post.accentColor)}
    </h1>
  );
}

function FollowRow({ post, authorName, profileImage, align }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        background: `linear-gradient(135deg, ${post.accentColor}, #ffffff33)`,
        border: '2px solid rgba(255,255,255,0.55)',
      }}>
        {profileImage && (
          <img src={profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.35)', transformOrigin: 'center 20%' }} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ color: post.textColor, fontFamily: '"DM Sans", sans-serif', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{authorName || '@yourhandle'}</span>
        <span style={{ color: post.textColor, opacity: 0.7, fontFamily: '"DM Sans", sans-serif', fontSize: 18, fontWeight: 400, lineHeight: 1 }}>Follow for more</span>
      </div>
      <div style={{
        background: post.accentColor, borderRadius: 999,
        padding: '12px 30px', color: '#ffffff',
        fontFamily: '"DM Sans", sans-serif', fontSize: 21, fontWeight: 700, marginLeft: 8, whiteSpace: 'nowrap',
      }}>Follow</div>
    </div>
  );
}

export default function PostSlide({ post, authorName, profileImage, headingFont, overlayOnly = false }) {
  const font = headingFont || "'Plus Jakarta Sans', system-ui, sans-serif";
  const layout = post.layout ?? 'bottom';

  // Scrim direction depends on where the headline sits. Bottom-anchored layouts
  // get a heavy black gradient under the headline for strong contrast.
  const scrim =
    layout === 'center'
      ? 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))'
      : layout === 'topSource'
      ? 'linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.15) 42%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.96))'
      : 'linear-gradient(rgba(0,0,0,0) 22%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.82) 72%, rgba(0,0,0,0.96))';

  // overlayOnly: transparent background + no media — used by the video exporter,
  // which composites this overlay (scrim + text + follow) on top of live frames.
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: overlayOnly ? 'transparent' : '#000' }}>
      {!overlayOnly && <Background post={post} />}
      <div style={{ position: 'absolute', inset: 0, background: scrim }} />

      {/* Content layer */}
      <div style={{
        position: 'absolute', inset: 0, padding: PAD,
        display: 'flex', flexDirection: 'column',
        justifyContent: layout === 'center' ? 'center' : layout === 'topSource' ? 'space-between' : 'flex-end',
        alignItems: post.align === 'center' ? 'center' : 'stretch',
        gap: 30,
      }}>
        {layout === 'topSource' ? (
          <>
            <div style={{ display: 'flex', justifyContent: post.align === 'center' ? 'center' : 'flex-start' }}>
              <SourceChip post={post} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34, width: '100%' }}>
              <Headline post={post} headingFont={font} />
              <FollowRow post={post} authorName={authorName} profileImage={profileImage} align={post.align} />
            </div>
          </>
        ) : (
          <>
            {layout === 'center' && <SourceChip post={post} />}
            {layout === 'bottom' && <SourceChip post={post} />}
            <Headline post={post} headingFont={font} />
            <FollowRow post={post} authorName={authorName} profileImage={profileImage} align={post.align} />
          </>
        )}
      </div>
    </div>
  );
}
