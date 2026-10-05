// Shows the first few testimonials, with a button to show the rest. Without
// this script they all show.
export function initTestimonials() {
  const list = document.querySelector('[data-testimonials]');
  const more = document.querySelector('[data-testimonials-more]');
  if (!list || !more) return;

  const visible = Number(list.dataset.visible) || 0;
  const extra = [...list.children].slice(visible);
  if (!extra.length) return;

  extra.forEach((item) => { item.hidden = true; });
  more.hidden = false;
  more.querySelector('button').addEventListener('click', () => {
    extra.forEach((item) => { item.hidden = false; });
    more.remove();
    // Move keyboard focus to the first newly shown testimonial.
    extra[0].setAttribute('tabindex', '-1');
    extra[0].focus({ preventScroll: true });
  });
}
