import DarkMinimalSlide from './DarkMinimalSlide';
import WarmCreamSlide from './WarmCreamSlide';
import TealCardSlide from './TealCardSlide';
import MagazineSlide from './MagazineSlide';
import ThemedSlide, { PALETTES } from './ThemedSlide';

export default function SlideRenderer({ slide, index, template, authorName, profileImage }) {
  const slideNum = index + 1;

  if (template === 'tealcard') {
    return (
      <TealCardSlide
        slide={slide}
        slideNum={slideNum}
        authorName={authorName}
        profileImage={profileImage}
      />
    );
  }

  if (template === 'magazine') {
    return (
      <MagazineSlide
        slide={slide}
        slideNum={slideNum}
        authorName={authorName}
        profileImage={profileImage}
      />
    );
  }

  if (PALETTES[template]) {
    return (
      <ThemedSlide
        slide={slide}
        slideNum={slideNum}
        authorName={authorName}
        profileImage={profileImage}
        palette={PALETTES[template]}
      />
    );
  }

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
