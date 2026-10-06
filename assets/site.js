(() => {
  'use strict';
  const root = document.documentElement;
  const languageButton = document.querySelector('.language-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const motionButton = document.querySelector('.motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let language = 'es';
  let translations;
  let paused = reducedMotion.matches;
  const labels = {
    es: { play: 'Activar movimiento', pause: 'Pausar movimiento', nav: 'Principal', home: 'Francisco Moya, inicio', menu: 'Menú', close: 'Cerrar', title: 'Francisco Moya · IA aplicada y productos de datos' },
    en: { play: 'Enable motion', pause: 'Pause motion', nav: 'Main', home: 'Francisco Moya, home', menu: 'Menu', close: 'Close', title: 'Francisco Moya · Applied AI & data products' }
  };
  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.querySelector('span').textContent = paused ? labels[language].play : labels[language].pause;
    motionButton.querySelector('path').setAttribute('d', paused ? 'M9 5v14l10-7Z' : 'M9 6v12M15 6v12');
  }
  function setMenu(open, restoreFocus = false) {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? labels[language].close : labels[language].menu;
    if (restoreFocus) menuButton.focus();
  }
  function setLanguage(next) {
    language = next;
    root.lang = next;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = translations[element.dataset.i18n]?.[next];
      if (value) element.textContent = value;
    });
    languageButton.querySelector('span').textContent = next === 'es' ? 'EN' : 'ES';
    languageButton.setAttribute('aria-label', next === 'es' ? 'Switch to English' : 'Cambiar a español');
    nav.setAttribute('aria-label', labels[next].nav);
    document.querySelector('.wordmark').setAttribute('aria-label', labels[next].home);
    document.title = labels[next].title;
    updateMotion();
    setMenu(false);
    try { localStorage.setItem('portfolio-language', next); } catch (_) { /* Storage is optional. */ }
  }
  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });
  window.matchMedia('(min-width: 681px)').addEventListener('change', () => setMenu(false));
  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  updateMotion();
  languageButton.disabled = true;
  fetch('assets/translations.json')
    .then(response => { if (!response.ok) throw new Error('Language data unavailable'); return response.json(); })
    .then(data => {
      translations = data;
      languageButton.disabled = false;
      let saved;
      try { saved = localStorage.getItem('portfolio-language'); } catch (_) { /* Continue in Spanish. */ }
      if (saved === 'en') setLanguage('en');
      languageButton.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
    })
    .catch(() => { languageButton.hidden = true; });
})();
