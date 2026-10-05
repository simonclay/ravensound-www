// Top of the page: the background photos fade slowly from one to the next,
// on a loop. Each photo zooms out gently while it shows (see sections.css).
const SHOW_FOR_MS = 7000;
const FADE_MS = 2500;

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('[data-hero-slide]')];
  if (!slides.length) return;

  hero.setAttribute('data-ready', '');
  let current = 0;
  slides[0].classList.add('is-active');

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length < 2 || still) return;

  setInterval(() => {
    if (document.hidden) return;
    const leaving = slides[current];
    current = (current + 1) % slides.length;
    leaving.classList.remove('is-active');
    leaving.classList.add('is-leaving');
    slides[current].classList.add('is-active');
    setTimeout(() => leaving.classList.remove('is-leaving'), FADE_MS);
  }, SHOW_FOR_MS);
}
