import { $, esc, tabIcon } from './ui.js';
import * as store from './store.js';
import * as fx from './fx.js';
import { loadVoices, stopAll } from './speech.js';
import { dayProgress } from './plan.js';

import home      from './views/home.js';
import parler    from './views/parler.js';
import phrases   from './views/phrases.js';
import grammaire from './views/grammaire.js';
import vocab     from './views/vocab.js';
import ecrire    from './views/ecrire.js';
import chunks    from './views/chunks.js';
import progres   from './views/progres.js';
import reglages  from './views/reglages.js';

const ROUTES = {
  ‘/’:          { view: home,      title: ‘Aujourd’hui’ },
  ‘/parler’:    { view: parler,    title: ‘Parler’ },
  ‘/phrases’:   { view: phrases,   title: ‘Phrases’ },
  ‘/grammaire’: { view: grammaire, title: ‘Grammaire’ },
  ‘/vocab’:     { view: vocab,     title: ‘Vocabulaire’ },
  ‘/ecrire’:    { view: ecrire,    title: ‘Écrire’ },
  ‘/chunks’:    { view: chunks,    title: ‘Formules’ },
  ‘/progres’:   { view: progres,   title: ‘Progrès’ },
  ‘/reglages’:  { view: reglages,  title: ‘Réglages’ },
};

// Kept deliberately short: the five speaking modes live on the Parler hub,
// where each one is described by what it trains. A rail long enough to push
// items off a laptop screen is worse than one click more.
const NAV = [
  { group: 'Le programme', groupEn: 'The programme' },
  { href: '#/',          fr: 'Aujourd’hui',  en: 'Today', badge: true },
  { group: 'Parler — la priorité', groupEn: 'Speaking — the priority' },
  { href: '#/parler',    fr: 'Parler',       en: 'Speaking' },
  { group: 'Construire', groupEn: 'Building blocks' },
  { href: '#/phrases',   fr: 'Phrases',      en: 'Phrase bank' },
  { href: '#/grammaire', fr: 'Grammaire',    en: 'Grammar' },
  { href: '#/vocab',     fr: 'Vocabulaire',  en: 'Vocabulary' },
  { href: '#/ecrire',    fr: 'Écrire',       en: 'Writing' },
  { href: '#/chunks',    fr: 'Formules',     en: 'Writing chunks' },
  { group: '' },
  { href: '#/progres',   fr: 'Progrès',      en: 'Progress' },
];

const SECTION_OF = {
  '/': 'home', '/parler': 'parler', '/phrases': 'phrases',
  '/grammaire': 'grammaire', '/vocab': 'vocab', '/ecrire': 'ecrire',
  '/chunks': 'ecrire', '/progres': 'progres', '/reglages': 'progres',
};

const TABS = [
  { href: '#/',                   fr: 'Jour',    icon: 'accueil' },
  { href: '#/parler',             fr: 'Parler',  icon: 'parler' },
  { href: '#/phrases',            fr: 'Phrases', icon: 'phrases' },
  { href: '#/grammaire',          fr: 'Gram.',   icon: 'grammaire' },
  { href: '#/progres',            fr: 'Progrès', icon: 'progres' },
];

/* ── theme and assistance ──────────────────────────────────────── */

function applyTheme() {
  const pref = store.settings().theme;
  const dark = pref === 'dark' || (pref === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

function paintAssist() {
  const on = store.assist();
  document.documentElement.dataset.assist = on ? '1' : '0';
  for (const id of ['assist', 'assistM']) {
    const b = $('#' + id);
    if (b) b.setAttribute('aria-pressed', String(on));
  }
  const l = $('#assistLabel'); if (l) l.textContent = on ? 'English on' : 'English off';
  const lm = $('#assistLabelM'); if (lm) lm.textContent = on ? 'EN' : 'FR';
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.assist')) return;
  store.toggleAssist();
  paintAssist();
  render();
});

/* ── chrome ────────────────────────────────────────────────────── */

function renderNav(path, search) {
  const here = '#' + path + (search ? '?' + search : '');
  const prog = dayProgress();
  const left = prog.total - prog.done;

  $('#nav').innerHTML = NAV.map(item => {
    if (item.group !== undefined) {
      if (!item.group) return `<div class="rail__group" aria-hidden="true"></div>`;
      return `<div class="rail__group">${esc(item.group)}${
        store.assist() ? `<span class="gloss">${esc(item.groupEn)}</span>` : ''}</div>`;
    }
    const active = item.href === '#' + path || (item.href === '#/' && path === '/');
    const badge = item.badge && left > 0 ? `<span class="navitem__dot">${left}</span>` : '';
    return `<a class="navitem" href="${item.href}"${active ? ' aria-current="page"' : ''}>
      <span>${esc(item.fr)}${store.assist() ? `<span class="gloss">${esc(item.en)}</span>` : ''}</span>${badge}</a>`;
  }).join('');

  const settingsLink = $('.rail__foot .navitem');
  if (settingsLink) {
    if (path === '/reglages') settingsLink.setAttribute('aria-current', 'page');
    else settingsLink.removeAttribute('aria-current');
  }

  $('#tabbar').innerHTML = TABS.map(t => {
    const active = path === t.href.replace('#', '').split('?')[0];
    return `<a class="tab" href="${t.href}"${active ? ' aria-current="page"' : ''}>
      ${tabIcon[t.icon]}<span>${esc(t.fr)}</span></a>`;
  }).join('');
}

/* ── routing ───────────────────────────────────────────────────── */

let teardown = null;

async function render() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, search] = raw.split('?');
  const route = ROUTES[path] || ROUTES['/'];

  if (teardown) { try { teardown(); } catch {} teardown = null; }
  stopAll();

  const el = $('#view');
  el.innerHTML = '';
  document.title = `${route.title} — L'Atelier`;
  // One colour per section, so the app is navigable by colour before you
  // read a word. Every component picks it up through --accent.
  document.documentElement.dataset.section = SECTION_OF[path] || 'home';
  renderNav(path, search);
  paintAssist();

  const params = new URLSearchParams(search || '');
  teardown = await route.view(el, { params, go, repaint: () => renderNav(path, search) }) || null;

  fx.countAll(el);
  scrollTo({ top: 0, behavior: 'instant' });
}

function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

addEventListener('hashchange', render);

/* ── boot ──────────────────────────────────────────────────────── */

applyTheme();
loadVoices().finally(render);
