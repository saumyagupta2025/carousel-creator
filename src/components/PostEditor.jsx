import { useRef } from 'react';
import { POST_LAYOUTS } from '../posts/PostSlide';

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-white/50 text-xs uppercase tracking-widest">{label}</label>
        {hint && <span className="text-white/25 text-[10px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-[15px] placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none';

const TEXT_SWATCHES = ['#ffffff', '#000000', '#fbe8a6', '#a5d8ff', '#ffd6e0', '#c3fae8'];
const ACCENT_SWATCHES = ['#2563eb', '#6366f1', '#0284c7', '#0d9488', '#64748b', '#f43f5e'];

export default function PostEditor({ post, onUpdate }) {
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  function update(key, value) {
    onUpdate({ ...post, [key]: value });
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('imageUrl', ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleVideoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    update('videoUrl', URL.createObjectURL(file));
  }

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/8 overflow-hidden bg-black/20">
      <div className="px-4 pt-4 pb-3 border-b border-white/8">
        <p className="text-white/40 text-[10px] uppercase tracking-widest">Post</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <Field label="Headline" hint="**bold** · *accent*">
          <textarea rows={3} value={post.headline} onChange={(e) => update('headline', e.target.value)} placeholder="Startup / AI news headline…" className={inputCls} />
        </Field>

        <Field label="Source chip" hint="optional">
          <input type="text" value={post.source ?? ''} onChange={(e) => update('source', e.target.value)} placeholder="e.g. AI NEWS · TECHCRUNCH" className={inputCls} />
        </Field>

        <Field label="Image">
          <input ref={imgRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <button onClick={() => imgRef.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-5 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
            {post.imageUrl ? '✓ Image loaded — click to replace' : 'Click to upload image'}
          </button>
          {post.imageUrl && (
            <button onClick={() => update('imageUrl', null)} className="mt-1.5 text-white/30 hover:text-red-400 text-xs transition-colors self-start">× Remove image</button>
          )}
        </Field>

        <Field label="Video" hint="exports as a still frame">
          <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
          <button onClick={() => videoRef.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-5 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
            {post.videoUrl ? '✓ Video loaded — click to replace' : 'Click to upload video'}
          </button>
          {post.videoUrl && (
            <button onClick={() => update('videoUrl', null)} className="mt-1.5 text-white/30 hover:text-red-400 text-xs transition-colors self-start">× Remove video</button>
          )}
          {post.videoUrl && !post.imageUrl && (
            <p className="text-white/25 text-[10px] mt-1">Tip: also add an image to control the exported frame.</p>
          )}
        </Field>

        <Field label="Layout">
          <select value={post.layout} onChange={(e) => update('layout', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-white/25 cursor-pointer">
            {POST_LAYOUTS.map((l) => (
              <option key={l.id} value={l.id} className="bg-gray-900">{l.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Alignment">
          <div className="grid grid-cols-2 gap-2">
            {['left', 'center'].map((a) => (
              <button
                key={a}
                onClick={() => update('align', a)}
                className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  post.align === a ? 'bg-white/12 text-white border border-white/25' : 'text-white/45 border border-white/8 hover:border-white/15'
                }`}
              >{a}</button>
            ))}
          </div>
        </Field>

        <Field label="Text color">
          <div className="flex items-center gap-2 flex-wrap">
            {TEXT_SWATCHES.map((c) => (
              <button key={c} onClick={() => update('textColor', c)} title={c}
                className={`w-7 h-7 rounded-full ring-2 transition-all ${post.textColor === c ? 'ring-white' : 'ring-white/15'}`}
                style={{ background: c }} />
            ))}
            <input type="color" value={post.textColor} onChange={(e) => update('textColor', e.target.value)} className="w-9 h-9 rounded cursor-pointer bg-transparent border border-white/15" />
          </div>
        </Field>

        <Field label="Accent color" hint="chip · follow button">
          <div className="flex items-center gap-2 flex-wrap">
            {ACCENT_SWATCHES.map((c) => (
              <button key={c} onClick={() => update('accentColor', c)} title={c}
                className={`w-7 h-7 rounded-full ring-2 transition-all ${post.accentColor === c ? 'ring-white' : 'ring-white/15'}`}
                style={{ background: c }} />
            ))}
            <input type="color" value={post.accentColor} onChange={(e) => update('accentColor', e.target.value)} className="w-9 h-9 rounded cursor-pointer bg-transparent border border-white/15" />
          </div>
        </Field>
      </div>
    </div>
  );
}
