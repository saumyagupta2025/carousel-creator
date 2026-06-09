import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SlideRenderer from '../slides/SlideRenderer';

async function renderToCanvas(slide, index, template, authorName, profileImage) {
  // Must be at (0,0) — html2canvas crops at getBoundingClientRect(), so
  // position:fixed;left:-9999px produces a blank image (crop origin is off-screen).
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

  // Explicitly wait for DM Sans and Fraunces to be fully available in the
  // browser's FontFaceSet — document.fonts.ready can resolve early when
  // font-display:swap is in use, leaving the canvas with incorrect metrics.
  await document.fonts.ready;
  await Promise.allSettled([
    document.fonts.load('400 32px "DM Sans"'),
    document.fonts.load('600 32px "DM Sans"'),
    document.fonts.load('700 32px Fraunces'),
    document.fonts.load('700 32px "Plus Jakarta Sans"'),
  ]);
  await new Promise((r) => setTimeout(r, 350));

  // Render at 2× scale — html2canvas 1.4.1 miscalculates the advance width of
  // the space glyph in some fonts (DM Sans) at scale:1, causing words to merge.
  // Rendering at 2× corrects the metrics; we then downsample back to 1080×1350.
  const hiDpiCanvas = await html2canvas(container, {
    width: 1080,
    height: 1350,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
  });

  root.unmount();
  document.body.removeChild(container);

  // Downsample to 1080×1350 so file size stays reasonable
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  canvas.getContext('2d').drawImage(hiDpiCanvas, 0, 0, 1080, 1350);

  return canvas;
}

export async function exportSingleSlide(slide, index, template, authorName, profileImage) {
  const canvas = await renderToCanvas(slide, index, template, authorName, profileImage);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.93);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `slide-${String(index + 1).padStart(2, '0')}.jpg`;
  a.click();
}

export async function exportAllSlides(slides, template, authorName, profileImage) {
  const zip = new JSZip();
  for (let i = 0; i < slides.length; i++) {
    const canvas = await renderToCanvas(slides[i], i, template, authorName, profileImage);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.93);
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
