// English assistance. At A2 an all-French interface is not immersion, it is
// an obstacle course — so English sits next to the French everywhere, and
// you switch it off block by block as you stop needing it.
//
// The one exception is a drill where the English IS the answer. Those use
// hide() so you have to try before you look.

import * as store from './store.js';
import { esc } from './ui.js';

/** French line with the English underneath when assistance is on. */
export function t(fr, en, { cls = '', enCls = '' } = {}) {
  const f = `<span class="${cls}">${esc(fr)}</span>`;
  if (!store.assist() || !en) return f;
  return `${f}<span class="gloss ${enCls}">${esc(en)}</span>`;
}

/** French with the English on the same line, in brackets. */
export function inline(fr, en) {
  if (!store.assist() || !en) return esc(fr);
  return `${esc(fr)} <span class="gloss gloss--inline">${esc(en)}</span>`;
}

/** Always hidden until tapped — for anything that would give away an answer. */
export function hide(en, label = 'anglais') {
  if (!en) return '';
  return `<button class="peek" data-act="peek" aria-expanded="false">
            <span class="peek__label">${esc(label)}</span>
            <span class="peek__text" hidden>${esc(en)}</span>
          </button>`;
}

/** Wire up every peek button inside a root. Idempotent per element. */
export function bindPeeks(root) {
  root.querySelectorAll('[data-act="peek"]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.querySelector('.peek__text');
      const label = btn.querySelector('.peek__label');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      text.hidden = open;
      label.hidden = !open;
    });
  });
}

/** UI chrome strings, so the interface itself can be read in either language. */
const UI = {
  today:      ['Aujourd’hui', 'Today'],
  programme:  ['Le programme', 'The programme'],
  speak:      ['Parler', 'Speak'],
  phrases:    ['Phrases', 'Phrases'],
  grammar:    ['Grammaire', 'Grammar'],
  vocab:      ['Vocabulaire', 'Vocabulary'],
  write:      ['Écrire', 'Write'],
  progress:   ['Progrès', 'Progress'],
  settings:   ['Réglages', 'Settings'],
  start:      ['Commencer', 'Start'],
  done:       ['Terminé', 'Done'],
  next:       ['Suivant', 'Next'],
  check:      ['Vérifier', 'Check'],
  again:      ['Recommencer', 'Again'],
  record:     ['Enregistrer', 'Record'],
  stop:       ['Arrêter', 'Stop'],
  listen:     ['Écouter', 'Listen'],
  quit:       ['Quitter', 'Quit'],
};

export function ui(key) {
  const pair = UI[key];
  if (!pair) return key;
  return store.assist() ? `${pair[0]}` : pair[0];
}

export const en = (key) => (UI[key] ? UI[key][1] : key);
