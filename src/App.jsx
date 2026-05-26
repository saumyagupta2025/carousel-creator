import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { createSlide } from './utils/slideData';

const DEFAULT_SLIDES = [
  createSlide('cover'),
  createSlide('text'),
  createSlide('list'),
];

export default function App() {
  const [template, setTemplate] = useState('dark');
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [selectedId, setSelectedId] = useState(DEFAULT_SLIDES[0].id);
  const [authorName, setAuthorName] = useState('@hiddenlayer.ai');
  const [profileImage, setProfileImage] = useState(`${import.meta.env.BASE_URL}profile.jpeg`);

  const selectedIndex = slides.findIndex((s) => s.id === selectedId);
  const selectedSlide = slides[selectedIndex] ?? null;

  function updateSlide(updated) {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar
        template={template}
        setTemplate={setTemplate}
        slides={slides}
        setSlides={setSlides}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        authorName={authorName}
        setAuthorName={setAuthorName}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />
      <EditorPanel slide={selectedSlide} onUpdate={updateSlide} />
      <PreviewPanel
        slides={slides}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        template={template}
        authorName={authorName}
        profileImage={profileImage}
      />
    </div>
  );
}
