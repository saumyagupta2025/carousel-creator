import StandardSlide, { THEMES } from './StandardSlide';
import TealCardSlide from './TealCardSlide';

export default function SlideRenderer({ slide, index, template, authorName, profileImage, headingFont }) {
  const slideNum = index + 1;
  const props = { slide, slideNum, authorName, profileImage };

  if (template === 'tealcard') return <TealCardSlide {...props} />;

  // dark / warm / editorial / mocha / blush / sage / lavender → StandardSlide.
  // A chosen heading font (optional) overrides the theme's default.
  const base = THEMES[template] ?? THEMES.dark;
  const theme = headingFont ? { ...base, headingFont } : base;
  return <StandardSlide {...props} theme={theme} />;
}
