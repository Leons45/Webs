// The phrase bank, and a drill over it. Phrases are learned by saying them,
// so every row has a listen button and the drill makes you produce the French
// from the English before it shows you anything.

import { esc, acts, $, $$, shuffle, icon } from '../ui.js';
import { bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import * as speech from '../speech.js';
import * as fx from '../fx.js';
import { PHRASES, GROUPS, byGroup } from '../data/phrases.js';

export default function phrases(el, { params, go }) {
  if (params.get('drill')) return drill(el, go, params.get('group'));
  return index(el, params.get('group'), go);
}

/* ── browse ────────────────────────────────────────────────────── */

// A colour per deck. Opening one deck at a time beats a single wall of
// 130 phrases — which is unreadable and, worse, discouraging.
const DECK = {
  survie:'var(--vert)', fluidite:'var(--rose)', questionsA:'var(--bleu)',
  argumenterB:'var(--violet)', opinion:'var(--orange)', reagir:'var(--jaune)',
  politesse:'var(--vert)',
};

function index(el, only, go) {
  const a = store.assist();
  const c = srs.counts(PHRASES);
  if (!only) return decks(el, go, a, c);
  const groups = [only];

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Phrases${a ? '<span class="gloss" style="font-size:var(--t-base)">Phrase bank</span>' : ''}</h1>
      <p class="ph__sub">Des blocs tout faits, à dire jusqu'à ce qu'ils sortent sans réfléchir.
        À A2, c'est ce qui fait la différence entre chercher ses mots et paraître fluide.
        ${a ? '<span class="gloss">Ready-made chunks, to be said until they come out without thinking. At A2 this is what separates groping for words from sounding fluent.</span>' : ''}</p>
    </div>

    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${c.learned} / ${c.total} consolidées · ${c.due} à revoir</span>
      <button class="btn" data-act="drill">S'entraîner à voix haute${a ? ' · Drill aloud' : ''}</button>
    </div>

    ${only ? `<div class="row" style="margin-bottom:1.25rem"><a class="btn btn--plain" href="#/phrases">Tous les groupes</a></div>` : ''}

    ${groups.map(g => {
      const meta = GROUPS[g];
      if (!meta) return '';
      const items = byGroup(g);
      return `
      <section style="margin-bottom:2.25rem">
        <div class="row row--split" style="align-items:baseline;margin-bottom:.3rem">
          <h2 style="font-size:var(--t-md)">${esc(meta.fr)}
            ${a ? `<span class="gloss">${esc(meta.en)}</span>` : ''}</h2>
          <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">${items.length}</span>
        </div>
        <p class="why" style="margin-bottom:1rem">${esc(meta.note)}</p>
        <div class="sheet sheet--flush">
          ${items.map(p => `
            <div class="phrase">
              <div class="row row--split" style="align-items:flex-start;gap:.75rem">
                <span class="phrase__fr">${esc(p.fr)}</span>
                <button class="audiobtn" data-act="say" data-fr="${esc(p.fr)}"
                        aria-label="Écouter">${icon.speak}</button>
              </div>
              <span class="phrase__en">${esc(p.en)}</span>
              <span class="phrase__use">${esc(p.use)}</span>
              <span class="phrase__bar">
                <span class="phrase__lv">${p.level}</span>
                ${srs.isLearned(p.id) ? '<span class="phrase__lv" style="color:var(--vert);border-color:var(--vert)">acquise</span>' : ''}
              </span>
            </div>`).join('')}
        </div>
      </section>`;
    }).join('')}
  </div>`;

  acts(el, {
    say: (b) => { speech.resetCancel(); speech.say(b.dataset.fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    drill: () => go('#/phrases?drill=1' + (only ? '&group=' + only : '')),
  });
}

/* ── the decks ─────────────────────────────────────────────────── */

function decks(el, go, a, c) {
  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Phrases${a ? '<span class="gloss" style="font-size:var(--t-base)">Phrase bank</span>' : ''}</h1>
      <p class="ph__sub">Sept paquets de blocs tout faits, à dire jusqu'à ce qu'ils sortent sans
        réfléchir. À A2, c'est ce qui fait la différence entre chercher ses mots et paraître fluide.
        ${a ? '<span class="gloss">Seven decks of ready-made chunks, to be said until they come out without thinking. At A2 this is what separates groping for words from sounding fluent.</span>' : ''}</p>
    </div>

    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${c.learned} / ${c.total} consolidées · ${c.due} à revoir</span>
      <button class="btn" data-act="drillall">Tout mélanger et s'entraîner${a ? ' · Drill all' : ''}</button>
    </div>

    <div class="grid2">
      ${Object.entries(GROUPS).map(([key, meta]) => {
        const items = byGroup(key);
        const learned = items.filter(x => srs.isLearned(x.id)).length;
        const share = Math.round((learned / items.length) * 100);
        return `
        <button class="sheet" data-act="open" data-g="${esc(key)}"
                style="text-align:left;display:grid;gap:.7rem;cursor:pointer;
                       --accent:${DECK[key]};padding-top:1.1rem;
                       border-top:10px solid ${DECK[key]}">
          <div class="row row--split" style="align-items:flex-start;gap:.6rem">
            <b style="font:800 var(--t-md)/1.2 var(--ff-ui);letter-spacing:-.025em">
              ${esc(meta.fr)}${a ? `<span class="gloss">${esc(meta.en)}</span>` : ''}</b>
            <span class="phrase__lv u-num"
                  style="background:${DECK[key]};flex:0 0 auto">${items.length}</span>
          </div>
          <span style="font-size:var(--t-sm);line-height:1.5;color:var(--ink-soft)">${esc(meta.note)}</span>
          <span class="meter__track" style="height:10px">
            <span class="meter__fill" style="display:block;width:${share}%" ${learned === items.length ? 'data-met="1"' : ''}></span>
          </span>
          <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
            ${learned} / ${items.length} consolidées</span>
        </button>`;
      }).join('')}
    </div>
  </div>`;

  acts(el, {
    open: (b) => go('#/phrases?group=' + b.dataset.g),
    drillall: () => go('#/phrases?drill=1'),
  });
}

/* ── drill ─────────────────────────────────────────────────────── */

function drill(el, go, only) {
  const pool = only ? byGroup(only) : PHRASES;
  const queued = srs.queue(pool, 12);
  const items = queued.length ? queued : shuffle(pool).slice(0, 12);
  let i = 0, shown = false;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= items.length) return done();
    const p = items[i];
    shown = false;

    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.25rem">
        <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
          Phrases · ${i + 1} / ${items.length}</span>
        <a class="btn btn--plain" href="#/phrases">Quitter</a>
      </div>

      <div class="say">
        <p class="say__cue say__cue--en">${esc(p.en)}</p>
        <p style="font-size:var(--t-sm);color:var(--ink-faint);max-width:32ch">
          Dis-le en français, à voix haute, avant de regarder.</p>
        <button class="btn btn--ghost" data-act="reveal">Voir et écouter</button>
      </div>
      <div id="after"></div>`;
  }

  function reveal() {
    if (shown) return;
    shown = true;
    const p = items[i];
    speech.resetCancel();
    speech.say(p.fr, { rate: store.settings().rate, voiceName: store.settings().voice });
    $('#after', frame).innerHTML = `
      <div class="say" style="margin-top:1.25rem">
        <p class="say__model">${esc(p.fr)}</p>
        <p class="say__use">${esc(p.use)}</p>
        <button class="btn btn--plain" data-act="replay">Réécouter</button>
      </div>
      <div class="grades" style="margin-top:1.25rem">
        <button class="grade" data-act="g" data-g="0"><b>Rien</b><small>revient vite</small></button>
        <button class="grade" data-act="g" data-g="1"><b>Hésitant</b><small>court</small></button>
        <button class="grade" data-act="g" data-g="2"><b>Dit juste</b><small>normal</small></button>
        <button class="grade" data-act="g" data-g="3"><b>Immédiat</b><small>long</small></button>
      </div>`;
  }

  function done() {
    try {
      const raw = sessionStorage.getItem('atelier.block');
      if (raw) {
        store.completeBlock(JSON.parse(raw).id, 0);
        sessionStorage.removeItem('atelier.block');
      }
    } catch {}
    fx.celebrate('Fait');
    store.logSpeaking(items.length * 6, { mode: 'phrases' });
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${items.length}</div>
        <p class="score__l">phrases dites à voix haute. Celles que tu as ratées reviennent
          dans quelques minutes ; les autres dans quelques jours.</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Une autre série</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
  }

  acts(frame, {
    reveal,
    replay: () => { speech.resetCancel(); speech.say(items[i].fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    g: (b) => {
      const g = Number(b.dataset.g);
      srs.grade(items[i].id, g, ['phrases', items[i].group]);
      g >= 2 ? fx.sndRight() : fx.sndWrong();
      i += 1; draw();
    },
    again: () => go('#/phrases?drill=1' + (only ? '&group=' + only : '')),
  });

  draw();
  return () => speech.stopAll();
}
