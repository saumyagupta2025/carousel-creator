import { useRef } from 'react';
import { FONTS, FONT_CATEGORIES } from '../utils/fonts';

// Shared top bar across Carousel and Post modes: mode switch, heading-font
// picker, author handle, and profile photo — all driven by App-level state.
export default function TopBar({
  mode,
  setMode,
  fontId,
  setFontId,
  authorName,
  setAuthorName,
  profileImage,
  setProfileImage,
}) {
  const profileInputRef = useRef(null);

  function handleProfileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <header className="flex items-center gap-5 px-5 h-16 border-b border-white/8 bg-black/30 flex-shrink-0">
      <h1 className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">Content Studio</h1>

      {/* Mode toggle */}
      <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
        {[
          { id: 'carousel', label: 'Carousel' },
          { id: 'post', label: 'Post' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === m.id ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white/70'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Heading font picker */}
      <label className="flex items-center gap-2">
        <span className="text-white/40 text-[10px] uppercase tracking-widest">Font</span>
        <select
          value={fontId}
          onChange={(e) => setFontId(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white/80 text-xs focus:outline-none focus:border-white/25 cursor-pointer"
        >
          {FONT_CATEGORIES.map((cat) => (
            <optgroup key={cat} label={cat} className="bg-gray-900">
              {FONTS.filter((f) => f.category === cat).map((f) => (
                <option key={f.id} value={f.id} className="bg-gray-900">
                  {f.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      {/* Author handle */}
      <input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="@yourhandle"
        className="w-44 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
      />

      {/* Profile photo */}
      <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileUpload} />
      <button
        onClick={() => profileInputRef.current?.click()}
        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg pl-1 pr-3 py-1 hover:border-white/20 transition-colors"
        title="Upload profile photo"
      >
        {profileImage ? (
          <img src={profileImage} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-white/20" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400/40 to-blue-500/40 flex-shrink-0" />
        )}
        <span className="text-white/50 text-xs whitespace-nowrap">Photo</span>
      </button>
    </header>
  );
}
