import { initConsent } from './modules/consent.js';
import { initHeader } from './modules/header.js';
import { initHero } from './modules/hero.js';
import { initTestimonials } from './modules/testimonials.js';
import { initGallery } from './modules/gallery.js';
import { initPlayers } from './modules/players.js';
import { initContactForm } from './modules/contact-form.js';

// Header/footer are composed at build time by Astro, so these can safely
// query the DOM straight away.
initConsent();
initHeader();
initHero();
initTestimonials();
initGallery();
initPlayers();
initContactForm();
