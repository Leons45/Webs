import { $, $$, esc, tabIcon } from './ui.js';
import * as store from './store.js';
import * as srs from './srs.js';
import { loadVoices } from './speech.js';
import { stopAll } from './speech.js';

import home     from './views/home.js';
import reviser  from './views/reviser.js';
import atelier  from './views/atelier.js';
import lire     from './views/lire.js';
import ecouter  from './views/ecouter.js';
import dictee   from './views/dictee.js';
import parler   from './views/parler.js';
import ecrire   from './views/ecrire.js';
import progres  from './views/progres.js';
import reglages from './views/reglages.js';

const ROUTES = {
  '/':         { view: home,     title: 'Accueil' },
  '/reviser':  { view: reviser,  title: 'Réviser' },
  '/atelier':  { view: atelier,  title: 'Atelier' },
  '/ecouter':  { view: ecouter,  title: 'Écouter' },
  '/lire':     { view: lire,     title: 'Lire' },
  '/dictee':   { view: dictee,   title: 'Dictée' },
  '/parler':   { view: parler,   title: 'Parler' },
  '/ecrire':   { view: ecrire,   title: 'Écrire' },
  '/progres':  { view: progres,  title: 'Progrès' },
  '/reglages': { view: reglages, title: 'Réglages' },
};

const NAV = [
  { group: 'Chaque jour' },
  { href: '#/',        label: 'Aujourd’hui', badge: 'due' },
  { href: '#/reviser', label: 'Réviser',     key: 'R' },
  { href: '#/atelier', label: 'Atelier',     key: 'A' },
  { group: 'Les quatre épreuves' },
  { href: '#/ecouter', label: 'Compréhension orale' },
  { href: '#/lire',    label: 'Compréhension écrite' },
  { href: '#/parler',  label: 'Expression orale' },
  { href: '#/ecrire',  label: 'Expression écrite' },
  { group: 'Entraînement ciblé' },
  { href: '#/dictee',  label: 'Dictée' },
  { href: '#/progres', label: 'Progrès' },
];

const TABS = [
  { href: '#/',        label: 'Jour',    icon: 'accueil' },
  { href: '#/reviser', label: 'Réviser', icon: 'reviser' },
  { href: '#/ecouter', label: 'Écouter', icon: 'ecouter' },
  { href: '#/lire',    label: 'Lire',    icon: 'lire' },
  { href: '#/progres', label: 'Progrès', icon: 'progres' },
];

/* ── theme ──────────────────────────────────────────────────────── */

function applyTheme() {
  const pref = store.settings().theme;
  const dark = pref === 'dark' || (pref === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ── chrome ─────────────────────────────────────────────────────── */

function renderNav(path) {
  const { due, new: neu } = srs.counts();
  const pending = due + Math.max(0, Math.min(neu, store.settings().dailyGoal - due));

  $('#nav').innerHTML = NAV.map(item => {
    if (item.group) return `<div class="rail__group">${esc(item.group)}</div>`;
    const active = item.href === '#' + (path === '/' ? '/' : path);
    const badge = item.badge === 'due' && pending > 0
      ? `<span class="navitem__dot">${pending}</span>`
      : item.key ? `<span class="navitem__k">${item.key}</span>` : '';
    return `<a class="navitem" href="${item.href}"${active ? ' aria-current="page"' : ''}>${esc(item.label)}${badge}</a>`;
  }).join('');

  const settingsLink = $('.rail__foot .navitem');
  if (settingsLink) {
    if (path === '/reglages') settingsLink.setAttribute('aria-current', 'page');
    else settingsLink.removeAttribute('aria-current');
  }

  $('#tabbar').innerHTML = TABS.map(t => {
    const active = t.href === '#' + (path === '/' ? '/' : path);
    return `<a class="tab" href="${t.href}"${active ? ' aria-current="page"' : ''}>
      ${tabIcon[t.icon]}<span>${esc(t.label)}</span></a>`;
  }).join('');

  const mh = $('#mhead');
  if (mh) {
    const s = store.liveStreak();
    mh.textContent = pending > 0 ? `${pending} à revoir` : s > 0 ? `série de ${s} j` : '';
  }
}

/* ── routing ────────────────────────────────────────────────────── */

let teardown = null;

async function render() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  const route = ROUTES[path] || ROUTES['/'];

  if (teardown) { try { teardown(); } catch {} teardown = null; }
  stopAll();

  const el = $('#view');
  el.innerHTML = '';
  document.title = `${route.title} — L'Atelier TEF`;
  renderNav(path);

  const params = new URLSearchParams(query || '');
  teardown = await route.view(el, { params, go, refreshChrome: () => renderNav(path) }) || null;

  if (!el.dataset.keepScroll) scrollTo({ top: 0, behavior: 'instant' });
}

function go(hash) {
  if (location.hash === hash) render(); else location.hash = hash;
}

addEventListener('hashchange', render);

/* ── keyboard shortcuts ────────────────────────────────────────── */

addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  const k = e.key.toLowerCase();
  if (k === 'r') go('#/reviser');
  else if (k === 'a') go('#/atelier');
  else if (k === 'g') go('#/progres');
});

/* ── boot ──────────────────────────────────────────────────────── */

applyTheme();
loadVoices().finally(render);
