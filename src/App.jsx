import { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import PostEditor from './components/PostEditor';
import PostPreview from './components/PostPreview';
import { createSlide } from './utils/slideData';
import { DEFAULT_FONT_ID, fontStackById } from './utils/fonts';

const DEFAULT_SLIDES = [
  createSlide('cover'),
  createSlide('text'),
  createSlide('list'),
];

const DEFAULT_POST = {
  headline: 'The startup headline goes *right here*',
  source: 'AI NEWS',
  imageUrl: null,
  videoUrl: null,
  textColor: '#ffffff',
  accentColor: '#2563eb',
  layout: 'bottom',
  align: 'left',
};

export default function App() {
  const [mode, setMode] = useState('carousel'); // 'carousel' | 'post'
  const [template, setTemplate] = useState('dark');
  const [fontId, setFontId] = useState(DEFAULT_FONT_ID);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [selectedId, setSelectedId] = useState(DEFAULT_SLIDES[0].id);
  const [post, setPost] = useState(DEFAULT_POST);
  const [authorName, setAuthorName] = useState('@hiddenlayer.ai');
  const [profileImage, setProfileImage] = useState(`${import.meta.env.BASE_URL}profile.jpeg`);

  const headingFont = fontStackById(fontId);
  const selectedIndex = slides.findIndex((s) => s.id === selectedId);
  const selectedSlide = slides[selectedIndex] ?? null;

  function updateSlide(updated) {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        mode={mode}
        setMode={setMode}
        fontId={fontId}
        setFontId={setFontId}
        authorName={authorName}
        setAuthorName={setAuthorName}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />

      <div className="flex flex-1 overflow-hidden">
        {mode === 'carousel' ? (
          <>
            <Sidebar
              template={template}
              setTemplate={setTemplate}
              slides={slides}
              setSlides={setSlides}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <EditorPanel slide={selectedSlide} onUpdate={updateSlide} />
            <PreviewPanel
              slides={slides}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              template={template}
              authorName={authorName}
              profileImage={profileImage}
              headingFont={headingFont}
            />
          </>
        ) : (
          <>
            <PostEditor post={post} onUpdate={setPost} />
            <PostPreview
              post={post}
              authorName={authorName}
              profileImage={profileImage}
              headingFont={headingFont}
            />
          </>
        )}
      </div>
    </div>
  );
}
