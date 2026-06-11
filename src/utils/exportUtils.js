import { toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SlideRenderer from '../slides/SlideRenderer';

async function renderToDataUrl(slide, index, template, authorName, profileImage) {
  // Render into a fixed-position container at (0,0) so layout is stable.
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:0;left:0;width:1080px;height:1350px;overflow:hidden;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(container);

  const root = createRoot(container);
  flushSync(() => {
    root.render(
      createElement(SlideRenderer, { slide, index, template, authorName, profileImage })
    );
  });

  // Wait for all fonts to be fully loaded before capturing.
  // font-display:swap can cause document.fonts.ready to resolve early.
  await document.fonts.ready;
  await Promise.allSettled([
    document.fonts.load('400 32px "DM Sans"'),
    document.fonts.load('600 32px "DM Sans"'),
    document.fonts.load('700 32px "Plus Jakarta Sans"'),
  ]);
  await new Promise((r) => setTimeout(r, 300));

  // html-to-image uses SVG foreignObject → browser text renderer, which
  // handles font metrics correctly (no space-glyph advance-width bug like html2canvas).
  // Fonts are served locally via @fontsource (same-origin), so html-to-image can
  // read and embed them without CORS errors.
  // pixelRatio:2 renders at 2160×2700 then we downsample for crisp output.
  const dataUrl = await toJpeg(container, {
    quality: 0.93,
    width: 1080,
    height: 1350,
    pixelRatio: 2,
    skipFonts: false,
    cacheBust: true,
  });

  root.unmount();
  document.body.removeChild(container);

  // Downsample the 2× render back to 1080×1350 for a smaller file.
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = dataUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  canvas.getContext('2d').drawImage(img, 0, 0, 1080, 1350);

  return canvas.toDataURL('image/jpeg', 0.93);
}

export async function exportSingleSlide(slide, index, template, authorName, profileImage) {
  const dataUrl = await renderToDataUrl(slide, index, template, authorName, profileImage);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `slide-${String(index + 1).padStart(2, '0')}.jpg`;
  a.click();
}

export async function exportAllSlides(slides, template, authorName, profileImage) {
  const zip = new JSZip();
  for (let i = 0; i < slides.length; i++) {
    const dataUrl = await renderToDataUrl(slides[i], i, template, authorName, profileImage);
    const base64 = dataUrl.split(',')[1];
    zip.file(`slide-${String(i + 1).padStart(2, '0')}.jpg`, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'carousel.zip';
  a.click();
  URL.revokeObjectURL(url);
}
