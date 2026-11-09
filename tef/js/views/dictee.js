// Dictée. You hear a sentence and write it. Then the two versions are compared
// word by word, so a silent error — a missing agreement, the wrong auxiliary,
// a negation in the wrong place — becomes visible instead of staying plausible.

import { esc, acts, $, $$, icon, shuffle } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import { DICTEE } from '../data/dictee.js';
import { TAGS } from '../data/cards.js';

const clean = (s) => String(s || '')
  .replace(/[’‘`´]/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const key = (w) => w.toLowerCase().replace(/^[«"(]+|[»",.;:!?)]+$/g, '');

/** Word-level diff over the longest common subsequence. */
function diff(expected, got) {
  const a = clean(expected).split(' ');
  const b = clean(got).split(' ');
  const n = a.length, m = b.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i][j] = key(a[i]) === key(b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (key(a[i]) === key(b[j])) {
      // Same word, but check the exact spelling: accents and case matter.
      out.push({ t: a[i] === b[j] ? 'same' : 'near', exp: a[i], got: b[j] });
      i++; j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) {
      out.push({ t: 'missing', exp: a[i] }); i++;
    } else {
      out.push({ t: 'extra', got: b[j] }); j++;
    }
  }
  while (i < n) out.push({ t: 'missing', exp: a[i++] });
  while (j < m) out.push({ t: 'extra',   got: b[j++] });
  return out;
}

const scoreOf = (parts) => {
  const total = parts.filter(p => p.t !== 'extra').length || 1;
  const good = parts.filter(p => p.t === 'same').length;
  return good / total;
};

export default function dictee(el) {
  const settings = store.settings();
  let order = shuffle(DICTEE);
  let idx = 0;
  let plays = 0, playing = false, checked = false;
  let rate = Math.min(settings.rate, 0.9);
  let correct = 0, done = 0;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    const item = order[idx % order.length];
    plays = 0; checked = false;

    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.5rem">
        <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
          Dictée · ${done} écrite${done === 1 ? '' : 's'}${done ? ` · ${Math.round((correct / done) * 100)} % de mots exacts` : ''}</span>
        <a class="btn btn--plain" href="#/">Quitter</a>
      </div>

      <div class="ph" style="margin-bottom:1.5rem">
        <h1 style="font-size:var(--t-xl)">Dictée</h1>
        <p class="ph__sub">Écoute, écris, compare. Les fautes que la dictée révèle sont celles
          que l’oreille ne corrige pas : accords du participe, choix de l’auxiliaire, place de la négation.</p>
      </div>

      <div class="player">
        <div class="player__row">
          <button class="player__play" data-act="play" aria-label="Écouter la phrase">${icon.play}</button>
          <div class="player__meta">
            <b id="plabel">Écouter la phrase</b>
            <small id="pcount">autant de fois que nécessaire</small>
          </div>
          <div class="bars" id="bars" data-on="0" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="player__row">
          <div class="speedrow" role="group" aria-label="Vitesse">
            ${[0.6, 0.75, 0.9].map(r => `
              <button class="chip" data-act="rate" data-r="${r}" aria-pressed="${r === rate}">${r}×</button>`).join('')}
          </div>
          <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-left:auto">
            ${item.tags.map(t => esc(TAGS[t]?.label || t)).join(' · ')}
          </span>
        </div>
      </div>

      <form id="form" style="margin-top:1.25rem;display:grid;gap:1rem">
        <label class="field">
          <span>Ce que tu entends</span>
          <textarea class="area area--ruled" id="ans" rows="3" autocomplete="off"
            autocapitalize="sentences" spellcheck="false"
            placeholder="Écris la phrase complète, ponctuation comprise."></textarea>
        </label>
        <div class="row">
          <button class="btn" type="submit">Comparer</button>
          <button class="btn btn--plain" type="button" data-act="skip">Passer</button>
        </div>
      </form>

      <div id="out"></div>`;

    $('#form', frame).addEventListener('submit', (e) => { e.preventDefault(); check(item); });
    setPlaying(false);
  }

  function setPlaying(on) {
    playing = on;
    const bars = $('#bars', frame); if (bars) bars.dataset.on = on ? '1' : '0';
    const btn = $('[data-act="play"]', frame); if (btn) btn.innerHTML = on ? icon.pause : icon.play;
    const lab = $('#plabel', frame);
    if (lab) lab.textContent = on ? 'Lecture…' : plays === 0 ? 'Écouter la phrase' : 'Réécouter';
    const cnt = $('#pcount', frame);
    if (cnt) cnt.textContent = plays === 0 ? 'autant de fois que nécessaire'
      : `${plays} écoute${plays > 1 ? 's' : ''}`;
  }

  async function play(item) {
    if (playing) { speech.stopAll(); setPlaying(false); return; }
    plays += 1;
    speech.resetCancel();
    setPlaying(true);
    await speech.say(item.text, { rate, voiceName: store.settings().voice });
    setPlaying(false);
  }

  function check(item) {
    if (checked) return;
    checked = true;
    speech.stopAll();
    const got = $('#ans', frame).value;
    const parts = diff(item.text, got);
    const share = scoreOf(parts);
    const perfect = parts.every(p => p.t === 'same');

    done += 1;
    correct += share;
    store.logAnswer({ tags: item.tags, correct: perfect, activity: 'dictee' });
    store.logMinutes(1, 'dictee');

    $('#form', frame).querySelector('button[type="submit"]').disabled = true;
    $('#ans', frame).readOnly = true;

    $('#out', frame).innerHTML = `
      <hr class="hair">
      <div class="stack">
        <div class="verdict" data-ok="${perfect ? 1 : 0}">
          <b>${perfect ? 'Mot pour mot.' : `${Math.round(share * 100)} % des mots exacts`}</b>
          <p>${esc(item.trap)}</p>
        </div>

        <div class="sheet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.7rem">
            Ta version, corrigée</div>
          <p class="diff" style="margin:0">${render(parts)}</p>
        </div>

        <div class="sheet sheet--quiet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.5rem">
            La phrase attendue</div>
          <p style="margin:0;font-size:var(--t-md)">${esc(item.text)}</p>
        </div>

        <div class="row">
          <button class="btn" data-act="next">Phrase suivante</button>
          <button class="btn btn--ghost" data-act="replay">Réécouter</button>
          <a class="btn btn--plain" href="#/atelier?tags=${esc(item.tags[0])}">Travailler ce point</a>
        </div>
      </div>`;
    $('#out', frame).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function render(parts) {
    return parts.map(p => {
      if (p.t === 'same')    return `<mark>${esc(p.got)}</mark>`;
      if (p.t === 'near')    return `<del>${esc(p.got)}</del> <ins>${esc(p.exp)}</ins>`;
      if (p.t === 'missing') return `<ins>${esc(p.exp)}</ins>`;
      return `<del>${esc(p.got)}</del>`;
    }).join(' ');
  }

  acts(frame, {
    play:   () => play(order[idx % order.length]),
    replay: () => play(order[idx % order.length]),
    rate:   (b) => {
      rate = Number(b.dataset.r);
      $$('[data-act="rate"]', frame).forEach(c =>
        c.setAttribute('aria-pressed', String(Number(c.dataset.r) === rate)));
    },
    next: () => { idx += 1; draw(); scrollTo({ top: 0, behavior: 'smooth' }); },
    skip: () => { idx += 1; draw(); },
  });

  draw();
  return () => speech.stopAll();
}
