// Sticky header: darkens once the page has scrolled past the top, and
// underlines the link for whichever section is in the middle of the screen.
export function initHeader() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const onScroll = () => {
    const scrolled = (window.scrollY || document.documentElement.scrollTop || 0) > 60;
    header.classList.toggle('is-scrolled', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = new Map();
  header.querySelectorAll('a[href*="#"]').forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) links.set(section, link);
  });
  if (!links.size || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute('aria-current'));
        links.get(entry.target).setAttribute('aria-current', 'true');
      });
    },
    // A section counts as current when it crosses the middle of the screen.
    { rootMargin: '-50% 0px -50% 0px' },
  );
  links.forEach((_, section) => observer.observe(section));

  // Back at the top (the hero), nothing is current.
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) links.forEach((link) => link.removeAttribute('aria-current'));
    }, { rootMargin: '-50% 0px -50% 0px' }).observe(hero);
  }
}
