import PostSlide from './PostSlide';

// Thin wrapper so exportUtils can render posts through one stable entry point,
// mirroring SlideRenderer for carousels.
export default function PostRenderer({ post, authorName, profileImage, headingFont, overlayOnly = false }) {
  return (
    <PostSlide
      post={post}
      authorName={authorName}
      profileImage={profileImage}
      headingFont={headingFont}
      overlayOnly={overlayOnly}
    />
  );
}
