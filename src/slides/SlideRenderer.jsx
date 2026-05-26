import DarkMinimalSlide from './DarkMinimalSlide';
import WarmCreamSlide from './WarmCreamSlide';

export default function SlideRenderer({ slide, index, template, authorName, profileImage }) {
  const slideNum = index + 1;
  if (template === 'warm') {
    return (
      <WarmCreamSlide
        slide={slide}
        slideNum={slideNum}
        authorName={authorName}
        profileImage={profileImage}
      />
    );
  }
  return (
    <DarkMinimalSlide
      slide={slide}
      slideNum={slideNum}
      authorName={authorName}
      profileImage={profileImage}
    />
  );
}
