import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SlideRenderer from '../slides/SlideRenderer';

async function renderToCanvas(slide, index, template, authorName, profileImage) {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;left:-9999px;top:0;width:1080px;height:1350px;overflow:hidden;';
  document.body.appendChild(container);

  const root = createRoot(container);
  flushSync(() => {
    root.render(
      createElement(SlideRenderer, { slide, index, template, authorName, profileImage })
    );
  });

  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(container, {
    width: 1080,
    height: 1350,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: null,
  });

  root.unmount();
  document.body.removeChild(container);

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
