import { useState } from 'react';
import PostRenderer from '../posts/PostRenderer';
import { exportPost, exportPostVideo } from '../utils/exportUtils';

const PREVIEW_SCALE = 0.46; // 1080×0.46 ≈ 497px, 1350×0.46 ≈ 621px

export default function PostPreview({ post, authorName, profileImage, headingFont }) {
  const [exporting, setExporting] = useState(false);
  const [exportingVideo, setExportingVideo] = useState(false);
  const w = Math.round(1080 * PREVIEW_SCALE);
  const h = Math.round(1350 * PREVIEW_SCALE);
  const hasVideo = !!post.videoUrl;

  async function handleExportImage() {
    setExporting(true);
    try {
      await exportPost(post, authorName, profileImage, headingFont);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportVideo() {
    setExportingVideo(true);
    try {
      await exportPostVideo(post, authorName, profileImage, headingFont);
    } catch (err) {
      alert(`Video export failed: ${err.message}`);
    } finally {
      setExportingVideo(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden p-6 gap-4">
        <div className="flex items-center gap-2 self-stretch justify-between mb-1">
          <p className="text-white/30 text-xs">Single post · 1080 × 1350</p>
          <div className="flex items-center gap-2">
            {hasVideo && (
              <button
                onClick={handleExportVideo}
                disabled={exportingVideo}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 disabled:opacity-40 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-all"
                title="Export the video with the overlay burned in (WebM)"
              >
                {exportingVideo ? (<><span className="animate-spin">⟳</span> Recording…</>) : (<>↓ Export Video</>)}
              </button>
            )}
            <button
              onClick={handleExportImage}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-white/8 hover:bg-white/12 disabled:opacity-40 border border-white/12 rounded-lg px-3 py-1.5 text-white/70 text-xs font-medium transition-colors"
              title={hasVideo ? 'Export a single still frame (JPEG)' : 'Export as JPEG'}
            >
              {exporting ? (<><span className="animate-spin">⟳</span> Exporting…</>) : (<>↓ {hasVideo ? 'Export Frame' : 'Export JPEG'}</>)}
            </button>
          </div>
        </div>

        {exportingVideo && (
          <p className="text-white/40 text-[11px] self-stretch text-right -mt-2">
            Recording plays through the full clip — keep this tab focused.
          </p>
        )}

        <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ flexShrink: 0 }}>
          <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: 1080, height: 1350, transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
              <PostRenderer post={post} authorName={authorName} profileImage={profileImage} headingFont={headingFont} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
