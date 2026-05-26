import StandardSlide, { THEMES } from './StandardSlide';
import TealCardSlide from './TealCardSlide';
import MagazineSlide from './MagazineSlide';

export default function SlideRenderer({ slide, index, template, authorName, profileImage }) {
  const slideNum = index + 1;
  const props = { slide, slideNum, authorName, profileImage };

  if (template === 'tealcard') return <TealCardSlide {...props} />;
  if (template === 'magazine') return <MagazineSlide {...props} />;

  // dark / warm / editorial all go through StandardSlide with a theme config
  const theme = THEMES[template] ?? THEMES.dark;
  return <StandardSlide {...props} theme={theme} />;
}
