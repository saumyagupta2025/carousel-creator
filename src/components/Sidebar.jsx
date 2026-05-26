import { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createSlide, SLIDE_TYPES } from '../utils/slideData';

const TYPE_COLORS = {
  cover: '#6ee7b7',
  text: '#93c5fd',
  list: '#fbbf24',
  code: '#c084fc',
  longtext: '#fb923c',
  screenshot: '#f472b6',
  framed: '#38bdf8',
};

function SortableItem({ slide, index, isSelected, onSelect, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const typeLabel = SLIDE_TYPES.find((t) => t.value === slide.type)?.label ?? slide.type;
  const tagColor = TYPE_COLORS[slide.type] ?? '#888';

  return (
    <div ref={setNodeRef} style={style}>
      <div
        onClick={() => onSelect(slide.id)}
        className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-white/10 border border-white/15'
            : 'hover:bg-white/5 border border-transparent'
        }`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-white/25 hover:text-white/60 cursor-grab active:cursor-grabbing flex-shrink-0 p-0.5"
          title="Drag to reorder"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="9" cy="3" r="1.5" />
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="9" cy="8" r="1.5" />
            <circle cx="3" cy="13" r="1.5" />
            <circle cx="9" cy="13" r="1.5" />
          </svg>
        </button>

        {/* Number */}
        <span className="text-white/30 text-xs font-mono w-5 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Type badge */}
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{
            color: tagColor,
            background: tagColor + '22',
            border: `1px solid ${tagColor}44`,
          }}
        >
          {typeLabel}
        </span>

        {/* Heading preview */}
        <span className="text-white/60 text-xs truncate flex-1 min-w-0">
          {slide.heading || slide.caption || '—'}
        </span>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(slide.id);
          }}
          className="text-white/0 group-hover:text-white/30 hover:!text-red-400 transition-colors flex-shrink-0 text-base leading-none"
          title="Delete slide"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  template,
  setTemplate,
  slides,
  setSlides,
  selectedId,
  setSelectedId,
  authorName,
  setAuthorName,
  profileImage,
  setProfileImage,
}) {
  const [addType, setAddType] = useState('text');
  const profileInputRef = useRef(null);
  const importRef = useRef(null);

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const carousel = Array.isArray(data) ? data[0] : data;
        if (!carousel?.slides?.length) throw new Error('No slides found in file');
        const imported = carousel.slides.map((s) => ({
          ...createSlide(s.type ?? 'text'),
          ...s,
          id: crypto.randomUUID(),
        }));
        setSlides(imported);
        setSelectedId(imported[0]?.id ?? null);
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  function handleProfileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSlides((prev) => {
        const oldIdx = prev.findIndex((s) => s.id === active.id);
        const newIdx = prev.findIndex((s) => s.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  function addSlide() {
    const slide = createSlide(addType);
    setSlides((prev) => [...prev, slide]);
    setSelectedId(slide.id);
  }

  function deleteSlide(id) {
    setSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (selectedId === id) {
        setSelectedId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/8 bg-black/30 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-semibold text-sm tracking-wide">Carousel Creator</h1>
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg px-3 py-1.5 text-white/80 text-xs font-medium transition-colors"
            title="Import carousel from generated JSON"
          >
            ↑ Import JSON
          </button>
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>

        {/* Template toggle */}
        <div className="mb-4">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Template</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTemplate('dark')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'dark'
                  ? 'bg-white/12 text-white border border-white/20'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTemplate('warm')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'warm'
                  ? 'bg-amber-50/15 text-amber-100 border border-amber-200/25'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Warm Cream
            </button>
            <button
              onClick={() => setTemplate('teal')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'teal'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-400/30'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Teal
            </button>
            <button
              onClick={() => setTemplate('bold')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'bold'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-400/30'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Bold
            </button>
            <button
              onClick={() => setTemplate('coral')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'coral'
                  ? 'bg-orange-500/12 text-orange-300 border border-orange-400/25'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Coral
            </button>
            <button
              onClick={() => setTemplate('editorial')}
              className={`col-span-2 py-2 rounded-lg text-xs font-medium transition-all ${
                template === 'editorial'
                  ? 'bg-stone-100/10 text-stone-200 border border-stone-300/20'
                  : 'text-white/40 border border-white/8 hover:border-white/15 hover:text-white/60'
              }`}
            >
              Editorial
            </button>
          </div>
        </div>

        {/* Author name */}
        <div className="mb-3">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Author handle</p>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="@yourhandle"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-xs placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>

        {/* Profile image */}
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Profile photo</p>
          <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileUpload} />
          <button
            onClick={() => profileInputRef.current?.click()}
            className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 transition-colors"
          >
            {profileImage ? (
              <img src={profileImage} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/20" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/40 to-blue-500/40 flex-shrink-0" />
            )}
            <span className="text-white/50 text-xs truncate">
              {profileImage ? 'Click to replace photo' : 'Upload profile photo'}
            </span>
          </button>
        </div>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-white/40 text-[10px] uppercase tracking-widest px-1 mb-2">
          Slides ({slides.length})
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1">
              {slides.map((slide, i) => (
                <SortableItem
                  key={slide.id}
                  slide={slide}
                  index={i}
                  isSelected={slide.id === selectedId}
                  onSelect={setSelectedId}
                  onDelete={deleteSlide}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add slide */}
      <div className="px-3 pb-4 pt-2 border-t border-white/8">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Add slide</p>
        <div className="flex gap-2">
          <select
            value={addType}
            onChange={(e) => setAddType(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white/70 text-xs focus:outline-none focus:border-white/25 cursor-pointer"
          >
            {SLIDE_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-gray-900">
                {t.label}
              </option>
            ))}
          </select>
          <button
            onClick={addSlide}
            className="bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </aside>
  );
}
