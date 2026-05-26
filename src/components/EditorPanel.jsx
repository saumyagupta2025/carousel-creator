import { useRef } from 'react';
import { SLIDE_TYPES, CODE_LANGUAGES } from '../utils/slideData';

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-white/50 text-[10px] uppercase tracking-widest">{label}</label>
        {hint && <span className="text-white/25 text-[10px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none';

export default function EditorPanel({ slide, onUpdate }) {
  const fileRef = useRef(null);

  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/20 text-sm border-r border-white/8">
        Select a slide to edit
      </div>
    );
  }

  function update(key, value) {
    onUpdate({ ...slide, [key]: value });
  }

  function updateBullet(index, value) {
    const next = [...slide.bullets];
    next[index] = value;
    update('bullets', next);
  }

  function addBullet() {
    if (slide.bullets.length < 5) {
      update('bullets', [...slide.bullets, '']);
    }
  }

  function removeBullet(index) {
    update('bullets', slide.bullets.filter((_, i) => i !== index));
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('imageUrl', ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/8 overflow-hidden bg-black/20">
      <div className="px-4 pt-4 pb-3 border-b border-white/8">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Slide type</p>
        <select
          value={slide.type}
          onChange={(e) => update('type', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-white/25 cursor-pointer"
        >
          {SLIDE_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-gray-900">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Screenshot */}
        {slide.type === 'screenshot' && (
          <>
            <Field label="Text above image">
              <textarea
                rows={3}
                value={slide.textAbove ?? ''}
                onChange={(e) => update('textAbove', e.target.value)}
                placeholder="Text overlaid at top of image..."
                className={inputCls}
              />
            </Field>
            <Field label="Image">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-6 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors"
              >
                {slide.imageUrl ? '✓ Image loaded — click to replace' : 'Click to upload image'}
              </button>
            </Field>
            <Field label="Text below image">
              <textarea
                rows={3}
                value={slide.caption}
                onChange={(e) => update('caption', e.target.value)}
                placeholder="Caption at bottom of image..."
                className={inputCls}
              />
            </Field>
          </>
        )}

        {/* All non-screenshot slides */}
        {slide.type !== 'screenshot' && (
          <>
            {/* Heading */}
            <Field label="Heading" hint="wrap *word* for italic">
              <textarea
                rows={3}
                value={slide.heading}
                onChange={(e) => update('heading', e.target.value)}
                placeholder="Slide heading..."
                className={inputCls}
              />
            </Field>

            {/* Cover: subtitle */}
            {slide.type === 'cover' && (
              <Field label="Subtitle">
                <textarea
                  rows={3}
                  value={slide.subtitle}
                  onChange={(e) => update('subtitle', e.target.value)}
                  placeholder="A compelling subtitle..."
                  className={inputCls}
                />
              </Field>
            )}

            {/* Tag (all non-screenshot types) */}
            <Field label="Tag / pill label">
              <input
                type="text"
                value={slide.tag}
                onChange={(e) => update('tag', e.target.value)}
                placeholder="Topic label..."
                className={inputCls}
              />
            </Field>

            {/* Text / Long Text: body */}
            {(slide.type === 'text' || slide.type === 'longtext') && (
              <Field label="Body text">
                <textarea
                  rows={6}
                  value={slide.body}
                  onChange={(e) => update('body', e.target.value)}
                  placeholder="Write your content..."
                  className={inputCls}
                />
              </Field>
            )}

            {/* List: bullets */}
            {slide.type === 'list' && (
              <Field label="Bullet points (max 5)">
                <div className="flex flex-col gap-2">
                  {slide.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-white/30 text-sm pt-2.5 flex-shrink-0">
                        {['①', '②', '③', '④', '⑤'][i]}
                      </span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(i, e.target.value)}
                        placeholder={`Point ${i + 1}...`}
                        className={inputCls}
                      />
                      <button
                        onClick={() => removeBullet(i)}
                        className="text-white/20 hover:text-red-400 transition-colors mt-2.5 text-lg leading-none flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {slide.bullets.length < 5 && (
                    <button
                      onClick={addBullet}
                      className="text-white/30 hover:text-white/60 text-sm text-left transition-colors py-1"
                    >
                      + Add point
                    </button>
                  )}
                </div>
              </Field>
            )}

            {/* Code: language + code block + optional description */}
            {slide.type === 'code' && (
              <>
                <Field label="Language">
                  <select
                    value={slide.language}
                    onChange={(e) => update('language', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-white/25 cursor-pointer"
                  >
                    {CODE_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="bg-gray-900">
                        {lang}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Code">
                  <textarea
                    rows={12}
                    value={slide.code}
                    onChange={(e) => update('code', e.target.value)}
                    placeholder="// Your code here..."
                    className={`${inputCls} font-mono text-xs`}
                    spellCheck={false}
                  />
                </Field>
                <Field label="Description" hint="optional — shown below code">
                  <textarea
                    rows={3}
                    value={slide.body}
                    onChange={(e) => update('body', e.target.value)}
                    placeholder="Explain what this code does..."
                    className={inputCls}
                  />
                </Field>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
