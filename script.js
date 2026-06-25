(function () {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const nav = document.querySelector('.nav');
  const onScroll = () => { if (!nav) return; if (window.scrollY > 24) nav.classList.add('is-scrolled'); else nav.classList.remove('is-scrolled'); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const spot = document.querySelector('.spotlight');
    if (spot) { window.addEventListener('mousemove', (e) => { spot.style.setProperty('--mx', `${e.clientX}px`); spot.style.setProperty('--my', `${e.clientY}px`); }, { passive: true }); }
  }
  const revealEls = document.querySelectorAll('.reveal, .skill, .timeline__item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else { revealEls.forEach((el) => el.classList.add('is-visible')); }
  function animateCount(el, target) {
    const duration = 1600; const start = performance.now(); const isLarge = target > 100;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = isLarge ? value.toLocaleString('en-US') : value;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('.meta__n');
  if (counters.length) {
    if (reduceMotion) { counters.forEach((el) => { const t = parseInt(el.dataset.count, 10) || 0; el.textContent = t > 100 ? t.toLocaleString('en-US') : t; }); }
    else {
      const countObs = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { const t = parseInt(entry.target.dataset.count, 10) || 0; animateCount(entry.target, t); countObs.unobserve(entry.target); } }); }, { threshold: 0.5 });
      counters.forEach((el) => countObs.observe(el));
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero__lines path', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__title', { yPercent: 6, opacity: 0.85, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  }
})();
