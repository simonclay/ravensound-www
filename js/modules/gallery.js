// Gallery: a strip of photos that scrolls sideways (swipe, trackpad, or the
// arrow buttons), with the photo in the centre in focus. Clicking a photo
// opens it larger in a lightbox, which has its own arrows and closes with
// Esc, the cross or a click outside the photo. Without this script the strip
// still scrolls and each photo links to the image file.
export function initGallery() {
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const track = gallery.querySelector('[data-gallery-track]');
  const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
  const prev = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  const count = gallery.querySelector('[data-gallery-count]');
  if (!track || !slides.length) return;

  let active = 0;
  // Where the arrows last sent the strip, so quick repeated clicks keep
  // counting on while it's still sliding. Cleared once it settles.
  let pending = null;
  let settle = 0;

  // The slide nearest the middle of the strip is the active one.
  const update = () => {
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((slide, i) => {
      const box = slide.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < bestDistance) { best = i; bestDistance = distance; }
    });
    active = best;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    if (count) count.textContent = `${active + 1} / ${slides.length}`;
  };

  // The arrows loop round: next from the last photo goes back to the first.
  const goTo = (i) => {
    pending = (i + slides.length) % slides.length;
    const slide = slides[pending];
    const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  };

  let frame = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
    clearTimeout(settle);
    settle = setTimeout(() => { pending = null; }, 150);
  }, { passive: true });
  window.addEventListener('resize', update);
  prev?.addEventListener('click', () => goTo((pending ?? active) - 1));
  next?.addEventListener('click', () => goTo((pending ?? active) + 1));

  gallery.setAttribute('data-ready', '');
  update();

  // ---------- Lightbox ----------
  const box = gallery.querySelector('[data-lightbox]');
  const img = box?.querySelector('[data-lightbox-img]');
  if (!box || !img || typeof box.showModal !== 'function') return;

  let shown = 0;
  const links = slides.map((slide) => slide.querySelector('[data-gallery-open]'));

  const show = (i) => {
    shown = (i + links.length) % links.length;
    const source = links[shown].querySelector('img');
    img.src = links[shown].href;
    img.alt = source ? source.alt : '';
  };

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      show(i);
      box.showModal();
    });
  });

  box.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(shown - 1));
  box.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(shown + 1));
  box.querySelector('[data-lightbox-close]')?.addEventListener('click', () => box.close());

  // A click on the dark backdrop (the dialog itself, not its contents) closes it.
  box.addEventListener('click', (event) => {
    if (event.target === box) box.close();
  });

  box.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(shown - 1);
    if (event.key === 'ArrowRight') show(shown + 1);
  });

  // Leave the strip showing the photo that was last enlarged.
  box.addEventListener('close', () => goTo(shown));
}
