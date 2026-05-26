import { useState } from 'react';
import SlideRenderer from '../slides/SlideRenderer';
import { exportSingleSlide, exportAllSlides } from '../utils/exportUtils';

const PREVIEW_SCALE = 0.40; // 1080×0.4 = 432px, 1350×0.4 = 540px (integer)
const THUMB_SCALE = 0.13;   // 1080×0.13 ≈ 140px, 1350×0.13 ≈ 176px

function ScaledSlide({ slide, index, template, authorName, profileImage, scale }) {
  const w = Math.round(1080 * scale);
  const h = Math.round(1350 * scale);
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          width: 1080,
          height: 1350,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <SlideRenderer
          slide={slide}
          index={index}
          template={template}
          authorName={authorName}
          profileImage={profileImage}
        />
      </div>
    </div>
  );
}

export default function PreviewPanel({
  slides,
  selectedId,
  setSelectedId,
  template,
  authorName,
  profileImage,
}) {
  const [exporting, setExporting] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);

  const selectedIndex = slides.findIndex((s) => s.id === selectedId);
  const selectedSlide = slides[selectedIndex];

  async function handleExportOne() {
    if (!selectedSlide) return;
    setExporting(true);
    try {
      await exportSingleSlide(selectedSlide, selectedIndex, template, authorName, profileImage);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportAll() {
    if (!slides.length) return;
    setExportingAll(true);
    try {
      await exportAllSlides(slides, template, authorName, profileImage);
    } finally {
      setExportingAll(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Main preview */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden p-6 gap-4">
        {selectedSlide ? (
          <>
            <div className="flex items-center gap-3 self-stretch justify-between mb-1">
              <p className="text-white/30 text-xs">
                Slide {selectedIndex + 1} of {slides.length}
              </p>
              <button
                onClick={handleExportOne}
                disabled={exporting}
                className="flex items-center gap-1.5 bg-white/8 hover:bg-white/12 disabled:opacity-40 border border-white/12 rounded-lg px-3 py-1.5 text-white/70 text-xs font-medium transition-colors"
              >
                {exporting ? (
                  <><span className="animate-spin">⟳</span> Exporting…</>
                ) : (
                  <>↓ Export JPEG</>
                )}
              </button>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ flexShrink: 0 }}>
              <ScaledSlide
                slide={selectedSlide}
                index={selectedIndex}
                template={template}
                authorName={authorName}
                profileImage={profileImage}
                scale={PREVIEW_SCALE}
              />
            </div>
          </>
        ) : (
          <p className="text-white/20 text-sm">No slide selected</p>
        )}
      </div>

      {/* Thumbnail strip + export all */}
      <div className="border-t border-white/8 bg-black/20">
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-white/30 text-[10px] uppercase tracking-widest">All slides</p>
          <button
            onClick={handleExportAll}
            disabled={exportingAll || !slides.length}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600/70 to-blue-600/70 hover:from-emerald-500/80 hover:to-blue-500/80 disabled:opacity-40 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-all"
          >
            {exportingAll ? (
              <><span className="animate-spin">⟳</span> Building ZIP…</>
            ) : (
              <>↓ Export all as ZIP</>
            )}
          </button>
        </div>

        <div className="flex gap-3 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setSelectedId(slide.id)}
              className="flex-shrink-0 relative"
              title={`Slide ${i + 1}`}
            >
              <div
                className={`rounded-lg overflow-hidden transition-all ${
                  slide.id === selectedId
                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black/50'
                    : 'ring-1 ring-white/10 hover:ring-white/25'
                }`}
              >
                <ScaledSlide
                  slide={slide}
                  index={i}
                  template={template}
                  authorName={authorName}
                  profileImage={profileImage}
                  scale={THUMB_SCALE}
                />
              </div>
              <span className="absolute bottom-1 right-1 text-[8px] text-white/60 bg-black/60 rounded px-1">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
