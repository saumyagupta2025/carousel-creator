import { useRef } from 'react';
import { SLIDE_TYPES, CODE_LANGUAGES } from '../utils/slideData';

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

const formatBtnCls =
  'text-white/35 hover:text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 rounded px-2 py-0.5 text-xs transition-colors leading-none select-none';

// ⚠️ Must be defined OUTSIDE EditorPanel — defining inside causes re-mount on every render.
function RichTextArea({ value, onChange, rows, placeholder, className }) {
  const ref = useRef(null);

  function applyFormat(e, open, close) {
    e.preventDefault(); // keep textarea focus + selection
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    const newValue = value.slice(0, start) + open + selected + close + value.slice(end);
    onChange({ target: { value: newValue } });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + open.length, start + open.length + selected.length);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button onMouseDown={(e) => applyFormat(e, '**', '**')} className={`${formatBtnCls} font-bold`} title="Bold">B</button>
        <button onMouseDown={(e) => applyFormat(e, '*', '*')} className={`${formatBtnCls} italic`} title="Italic">I</button>
        <button onMouseDown={(e) => applyFormat(e, '__', '__')} className={`${formatBtnCls} underline`} title="Underline">U</button>
      </div>
      <textarea ref={ref} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className={className} />
    </div>
  );
}

function BulletsEditor({ bullets, onUpdate: onB, onAdd, onRemove, label = 'Bullet points (max 5)' }) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {(bullets ?? []).map((bullet, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-white/30 text-sm pt-2.5 flex-shrink-0">
              {['①', '②', '③', '④', '⑤'][i]}
            </span>
            <input
              type="text"
              value={bullet}
              onChange={(e) => onB(i, e.target.value)}
              placeholder={`Point ${i + 1}...`}
              className={inputCls}
            />
            <button
              onClick={() => onRemove(i)}
              className="text-white/20 hover:text-red-400 transition-colors mt-2.5 text-lg leading-none flex-shrink-0"
            >×</button>
          </div>
        ))}
        {(bullets ?? []).length < 5 && (
          <button onClick={onAdd} className="text-white/30 hover:text-white/60 text-sm text-left transition-colors py-1">
            + Add point
          </button>
        )}
      </div>
    </Field>
  );
}

export default function EditorPanel({ slide, onUpdate }) {
  const fileRef = useRef(null);
  const fileRef2 = useRef(null);

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
    const next = [...(slide.bullets ?? [])];
    next[index] = value;
    update('bullets', next);
  }
  function addBullet() {
    if ((slide.bullets ?? []).length < 5) update('bullets', [...(slide.bullets ?? []), '']);
  }
  function removeBullet(index) {
    update('bullets', (slide.bullets ?? []).filter((_, i) => i !== index));
  }

  function updateBullet2(index, value) {
    const next = [...(slide.bullets2 ?? [])];
    next[index] = value;
    update('bullets2', next);
  }
  function addBullet2() {
    if ((slide.bullets2 ?? []).length < 5) update('bullets2', [...(slide.bullets2 ?? []), '']);
  }
  function removeBullet2(index) {
    update('bullets2', (slide.bullets2 ?? []).filter((_, i) => i !== index));
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
            <option key={t.value} value={t.value} className="bg-gray-900">{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

        {/* ── COVER ── */}
        {slide.type === 'cover' && (<>
          <Field label="Title">
            <RichTextArea rows={3} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Your big title..." className={inputCls} />
          </Field>
          <Field label="Subtitle" hint="appears right-indented">
            <RichTextArea rows={3} value={slide.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="A supporting subtitle..." className={inputCls} />
          </Field>
          <Field label="Series label" hint="shown at top-left on all slides">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
        </>)}

        {/* ── QUOTE / TEXT ── */}
        {slide.type === 'text' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <Field label="Intro text" hint="appears lighter, above heading">
            <RichTextArea rows={3} value={slide.body ?? ''} onChange={(e) => update('body', e.target.value)} placeholder="e.g. Burnout taught me one thing:" className={inputCls} />
          </Field>
          <Field label="Bold statement">
            <RichTextArea rows={3} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="e.g. Boundaries aren't optional" className={inputCls} />
          </Field>
        </>)}

        {/* ── BIG STATEMENT / LONGTEXT ── */}
        {slide.type === 'longtext' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <Field label="Statement" hint="will be very large">
            <RichTextArea rows={4} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Here are 5 that changed everything!" className={inputCls} />
          </Field>
        </>)}

        {/* ── NUMBERED LIST ── */}
        {slide.type === 'list' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <Field label="Ordinal word" hint="One, Two, Three…">
            <input type="text" value={slide.subtitle ?? ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. One" className={inputCls} />
          </Field>
          <Field label="Section heading">
            <RichTextArea rows={2} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Define Work Hours" className={inputCls} />
          </Field>
          <BulletsEditor bullets={slide.bullets} onUpdate={updateBullet} onAdd={addBullet} onRemove={removeBullet} />
        </>)}

        {/* ── DOUBLE LIST ── */}
        {slide.type === 'doublelist' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <div className="border border-white/8 rounded-lg p-3 flex flex-col gap-3">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Section 1</p>
            <Field label="Ordinal word">
              <input type="text" value={slide.subtitle ?? ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. Two" className={inputCls} />
            </Field>
            <Field label="Heading">
              <RichTextArea rows={2} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Protect Deep Focus" className={inputCls} />
            </Field>
            <BulletsEditor bullets={slide.bullets} onUpdate={updateBullet} onAdd={addBullet} onRemove={removeBullet} label="Bullets" />
          </div>
          <div className="border border-white/8 rounded-lg p-3 flex flex-col gap-3">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Section 2</p>
            <Field label="Ordinal word">
              <input type="text" value={slide.ordinal2 ?? ''} onChange={(e) => update('ordinal2', e.target.value)} placeholder="e.g. Three" className={inputCls} />
            </Field>
            <Field label="Heading">
              <RichTextArea rows={2} value={slide.heading2 ?? ''} onChange={(e) => update('heading2', e.target.value)} placeholder="Limit Meetings" className={inputCls} />
            </Field>
            <BulletsEditor bullets={slide.bullets2} onUpdate={updateBullet2} onAdd={addBullet2} onRemove={removeBullet2} label="Bullets" />
          </div>
        </>)}

        {/* ── PHOTO + TEXT (imagetext) ── */}
        {slide.type === 'imagetext' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <Field label="Photo">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-6 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
              {slide.imageUrl ? '✓ Photo loaded — click to replace' : 'Click to upload photo'}
            </button>
          </Field>
          <Field label="Ordinal word" hint="Four, Five…">
            <input type="text" value={slide.subtitle ?? ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. Four" className={inputCls} />
          </Field>
          <Field label="Section heading">
            <RichTextArea rows={2} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Build Device-Free Zone" className={inputCls} />
          </Field>
          <BulletsEditor bullets={slide.bullets} onUpdate={updateBullet} onAdd={addBullet} onRemove={removeBullet} />
        </>)}

        {/* ── TEXT + SIDE PHOTO (textimage) ── */}
        {slide.type === 'textimage' && (<>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="e.g. LESSONS FROM BURNOUT" className={inputCls} />
          </Field>
          <Field label="Ordinal word" hint="Five, Six…">
            <input type="text" value={slide.subtitle ?? ''} onChange={(e) => update('subtitle', e.target.value)} placeholder="e.g. Five" className={inputCls} />
          </Field>
          <Field label="Section heading">
            <RichTextArea rows={2} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Recharge Without Guilt" className={inputCls} />
          </Field>
          <BulletsEditor bullets={slide.bullets} onUpdate={updateBullet} onAdd={addBullet} onRemove={removeBullet} />
          <Field label="Side photo">
            <input ref={fileRef2} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileRef2.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-6 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
              {slide.imageUrl ? '✓ Photo loaded — click to replace' : 'Click to upload photo'}
            </button>
          </Field>
        </>)}

        {/* ── CTA ── */}
        {slide.type === 'cta' && (<>
          <Field label="Main CTA text">
            <RichTextArea rows={3} value={slide.heading} onChange={(e) => update('heading', e.target.value)} placeholder="Save this post if it's helpful!" className={inputCls} />
          </Field>
          <Field label="Secondary line">
            <input type="text" value={slide.body ?? ''} onChange={(e) => update('body', e.target.value)} placeholder="Follow for more tips!" className={inputCls} />
          </Field>
        </>)}

        {/* ── FRAMED IMAGE ── */}
        {slide.type === 'framed' && (<>
          <Field label="Heading" hint="optional">
            <RichTextArea rows={2} value={slide.heading ?? ''} onChange={(e) => update('heading', e.target.value)} placeholder="Optional title..." className={inputCls} />
          </Field>
          <Field label="Image">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-6 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
              {slide.imageUrl ? '✓ Image loaded — click to replace' : 'Click to upload image'}
            </button>
          </Field>
          <Field label={`Image size — ${slide.imageSize ?? 75}%`}>
            <input type="range" min={30} max={100} step={5} value={slide.imageSize ?? 75} onChange={(e) => update('imageSize', Number(e.target.value))} className="w-full accent-blue-400" />
          </Field>
          <Field label="Caption" hint="optional">
            <RichTextArea rows={3} value={slide.caption ?? ''} onChange={(e) => update('caption', e.target.value)} placeholder="Caption text..." className={inputCls} />
          </Field>
          <Field label="Series label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="Topic label..." className={inputCls} />
          </Field>
        </>)}

        {/* ── SCREENSHOT ── */}
        {slide.type === 'screenshot' && (<>
          <Field label="Text above image">
            <RichTextArea rows={3} value={slide.textAbove ?? ''} onChange={(e) => update('textAbove', e.target.value)} placeholder="Text overlaid at top..." className={inputCls} />
          </Field>
          <Field label="Image">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="w-full bg-white/5 border border-dashed border-white/15 rounded-lg py-6 text-white/40 text-sm hover:border-white/25 hover:text-white/60 transition-colors">
              {slide.imageUrl ? '✓ Image loaded — click to replace' : 'Click to upload image'}
            </button>
          </Field>
          <Field label="Text below image">
            <RichTextArea rows={3} value={slide.caption ?? ''} onChange={(e) => update('caption', e.target.value)} placeholder="Caption at bottom..." className={inputCls} />
          </Field>
        </>)}

        {/* ── CODE ── */}
        {slide.type === 'code' && (<>
          <Field label="Heading" hint="optional">
            <RichTextArea rows={2} value={slide.heading ?? ''} onChange={(e) => update('heading', e.target.value)} placeholder="Code example title..." className={inputCls} />
          </Field>
          <Field label="Language">
            <select value={slide.language} onChange={(e) => update('language', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-white/25 cursor-pointer">
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
              ))}
            </select>
          </Field>
          <Field label="Code">
            <textarea rows={12} value={slide.code ?? ''} onChange={(e) => update('code', e.target.value)} placeholder="// Your code here..." className={`${inputCls} font-mono text-xs`} spellCheck={false} />
          </Field>
          <Field label="Description" hint="optional — shown below code">
            <RichTextArea rows={3} value={slide.body ?? ''} onChange={(e) => update('body', e.target.value)} placeholder="Explain what this code does..." className={inputCls} />
          </Field>
          <Field label="Tag / label">
            <input type="text" value={slide.tag ?? ''} onChange={(e) => update('tag', e.target.value)} placeholder="Topic label..." className={inputCls} />
          </Field>
        </>)}

      </div>
    </div>
  );
}
