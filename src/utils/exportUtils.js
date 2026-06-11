import { toJpeg, toPng } from 'html-to-image';
import JSZip from 'jszip';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import SlideRenderer from '../slides/SlideRenderer';
import PostRenderer from '../posts/PostRenderer';
import { FONTS } from './fonts';

// Preload every registered font (a couple of weights each) so html-to-image
// embeds whichever heading font the user picked before capture.
async function preloadFonts() {
  await document.fonts.ready;
  const families = ['DM Sans', 'Plus Jakarta Sans', ...FONTS.map((f) => f.name)];
  const jobs = [];
  for (const fam of families) {
    jobs.push(document.fonts.load(`400 32px "${fam}"`));
    jobs.push(document.fonts.load(`700 32px "${fam}"`));
  }
  await Promise.allSettled(jobs);
  await new Promise((r) => setTimeout(r, 300));
}

// Render any React element into a fixed 1080×1350 container and rasterize to a
// downsampled JPEG data URL.
async function renderElementToDataUrl(element) {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:0;left:0;width:1080px;height:1350px;overflow:hidden;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(container);

  const root = createRoot(container);
  flushSync(() => { root.render(element); });

  await preloadFonts();

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

  // Downsample the 2× render back to 1080×1350.
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  canvas.getContext('2d').drawImage(img, 0, 0, 1080, 1350);
  return canvas.toDataURL('image/jpeg', 0.93);
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// ─── Carousel slides ──────────────────────────────────────────────────────────

function slideElement(slide, index, template, authorName, profileImage, headingFont) {
  return createElement(SlideRenderer, { slide, index, template, authorName, profileImage, headingFont });
}

export async function exportSingleSlide(slide, index, template, authorName, profileImage, headingFont) {
  const dataUrl = await renderElementToDataUrl(slideElement(slide, index, template, authorName, profileImage, headingFont));
  downloadDataUrl(dataUrl, `slide-${String(index + 1).padStart(2, '0')}.jpg`);
}

export async function exportAllSlides(slides, template, authorName, profileImage, headingFont) {
  const zip = new JSZip();
  for (let i = 0; i < slides.length; i++) {
    const dataUrl = await renderElementToDataUrl(slideElement(slides[i], i, template, authorName, profileImage, headingFont));
    zip.file(`slide-${String(i + 1).padStart(2, '0')}.jpg`, dataUrl.split(',')[1], { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, 'carousel.zip');
  URL.revokeObjectURL(url);
}

// ─── Posts ────────────────────────────────────────────────────────────────────

// Grab a still frame from a video so exports are clean static JPEGs even when
// the live preview is a playing video.
async function captureVideoFrame(videoUrl) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    const grab = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1080;
        canvas.height = video.videoHeight || 1350;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch {
        resolve(null);
      }
    };
    video.onloadeddata = () => { video.currentTime = Math.min(0.1, (video.duration || 1) / 2); };
    video.onseeked = grab;
    video.onerror = () => resolve(null);
  });
}

export async function exportPost(post, authorName, profileImage, headingFont) {
  let exportPostData = post;
  // If a video has no explicit poster image, bake a frame so the export isn't blank.
  if (post.videoUrl && !post.imageUrl) {
    const frame = await captureVideoFrame(post.videoUrl);
    if (frame) exportPostData = { ...post, imageUrl: frame };
  }
  exportPostData = { ...exportPostData, videoUrl: null }; // never render live video into the still
  const dataUrl = await renderElementToDataUrl(
    createElement(PostRenderer, { post: exportPostData, authorName, profileImage, headingFont })
  );
  downloadDataUrl(dataUrl, 'post.jpg');
}

// ─── Post video export ──────────────────────────────────────────────────────
// Composites the live video frames with a pre-rendered transparent overlay
// (scrim + headline + follow) and records the canvas to a WebM file.

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Render the post overlay (no media, transparent background) to a PNG data URL.
async function renderOverlayPng(post, authorName, profileImage, headingFont) {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:0;left:0;width:1080px;height:1350px;overflow:hidden;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(container);
  const root = createRoot(container);
  flushSync(() => {
    root.render(
      createElement(PostRenderer, {
        post: { ...post, imageUrl: null, videoUrl: null },
        authorName, profileImage, headingFont, overlayOnly: true,
      })
    );
  });
  await preloadFonts();
  const dataUrl = await toPng(container, { width: 1080, height: 1350, pixelRatio: 2, skipFonts: false, cacheBust: true });
  root.unmount();
  document.body.removeChild(container);
  return dataUrl;
}

export async function exportPostVideo(post, authorName, profileImage, headingFont) {
  if (!post.videoUrl) throw new Error('No video to export');

  const overlay = await loadImage(await renderOverlayPng(post, authorName, profileImage, headingFont));

  // Offscreen video source.
  const video = document.createElement('video');
  video.src = post.videoUrl;
  video.crossOrigin = 'anonymous';
  video.playsInline = true;
  video.loop = false;
  video.muted = false; // try to keep audio; fall back to muted if blocked
  await new Promise((res, rej) => { video.onloadedmetadata = res; video.onerror = () => rej(new Error('Could not load video')); });

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  // cover-fit the source into 1080×1350.
  const scale = Math.max(1080 / video.videoWidth, 1350 / video.videoHeight);
  const dw = video.videoWidth * scale;
  const dh = video.videoHeight * scale;
  const dx = (1080 - dw) / 2;
  const dy = (1350 - dh) / 2;

  const stream = canvas.captureStream(30);
  // Best-effort: attach the video's audio track.
  try {
    const vstream = video.captureStream?.() ?? video.mozCaptureStream?.();
    const audio = vstream?.getAudioTracks?.()[0];
    if (audio) stream.addTrack(audio);
  } catch { /* no audio */ }

  const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    .find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const finished = new Promise((resolve) => { recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' })); });

  function draw() {
    ctx.clearRect(0, 0, 1080, 1350);
    ctx.drawImage(video, dx, dy, dw, dh);
    ctx.drawImage(overlay, 0, 0, 1080, 1350);
    if (!video.ended) requestAnimationFrame(draw);
  }

  video.currentTime = 0;
  try {
    await video.play();
  } catch {
    video.muted = true;
    await video.play();
  }
  recorder.start();
  draw();
  video.onended = () => setTimeout(() => recorder.stop(), 150);

  const blob = await finished;
  video.pause();
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, 'post.webm');
  URL.revokeObjectURL(url);
}
