// Vocabulary as chunks. The drill shows the English, you say the French
// chunk aloud, then you see the whole sentence it lives in — because an
// isolated word is a word you will not retrieve under pressure.

import { esc, acts, $, shuffle, icon } from '../ui.js';
import { hide, bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import * as speech from '../speech.js';
import * as fx from '../fx.js';
import { VOCAB, THEMES, byTheme } from '../data/vocab.js';
import { todayThemes, currentWeek } from '../plan.js';

export default function vocab(el, { params, go }) {
  if (params.get('drill')) return drill(el, go, params.get('theme'));
  return index(el, go);
}

function index(el, go) {
  const a = store.assist();
  const week = currentWeek();
  const weekThemes = todayThemes();
  const c = srs.counts(VOCAB);

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Vocabulaire${a ? '<span class="gloss" style="font-size:var(--t-base)">Vocabulary</span>' : ''}</h1>
      <p class="ph__sub">Des blocs, pas des mots isolés. Tu n’as pas besoin de « loyer » :
        tu as besoin de « le loyer charges comprises », parce que c’est ça qui sort de la bouche.
        ${a ? '<span class="gloss">Chunks, not isolated words. You don’t need "loyer" — you need "le loyer charges comprises", because that is what actually comes out.</span>' : ''}</p>
    </div>

    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${c.learned} / ${c.total} consolidés · ${c.due} à revoir</span>
      <button class="btn" data-act="week">Thème de la semaine${a ? ' · This week’s theme' : ''}</button>
    </div>

    <p class="why" style="margin-bottom:1.75rem">
      Semaine ${week.n} : ${weekThemes.map(t => esc(THEMES[t].fr)).join(', ')}.
      Commence par là — le reste est disponible quand tu veux.
      ${a ? `<span class="gloss">Week ${week.n}: start with this theme; the rest is available any time.</span>` : ''}
    </p>

    <div class="grid2">
      ${Object.entries(THEMES).map(([key, meta]) => {
        const items = byTheme(key);
        const learned = items.filter(x => srs.isLearned(x.id)).length;
        const isWeek = weekThemes.includes(key);
        return `
        <button class="sheet" data-act="theme" data-t="${esc(key)}"
                style="text-align:left;display:grid;gap:.5rem;cursor:pointer${isWeek ? ';border-color:var(--ink)' : ''}">
          <b style="font:500 var(--t-base)/1.25 var(--ff-text)">${esc(meta.fr)}
            ${a ? `<span class="gloss">${esc(meta.en)}</span>` : ''}</b>
          <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
            ${learned} / ${items.length} consolidés${isWeek ? ' · cette semaine' : ''}</span>
        </button>`;
      }).join('')}
    </div>
  </div>`;

  acts(el, {
    theme: (b) => go('#/vocab?drill=1&theme=' + b.dataset.t),
    week: () => go('#/vocab?drill=1&theme=' + todayThemes()[0]),
  });
}

function drill(el, go, theme) {
  const pool = theme ? byTheme(theme) : VOCAB;
  const queued = srs.queue(pool, 14);
  const items = queued.length ? queued : shuffle(pool).slice(0, 14);
  let i = 0, shown = false;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= items.length) return done();
    const v = items[i];
    shown = false;

    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.25rem">
        <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
          ${esc(THEMES[v.theme].fr)} · ${i + 1} / ${items.length}</span>
        <a class="btn btn--plain" href="#/vocab">Quitter</a>
      </div>

      <div class="say">
        <p class="say__cue say__cue--en">${esc(v.en)}</p>
        <p style="font-size:var(--t-sm);color:var(--ink-faint);max-width:30ch">
          Dis le bloc français à voix haute, puis vérifie.</p>
        <button class="btn btn--ghost" data-act="reveal">Vérifier</button>
      </div>
      <div id="after"></div>`;
  }

  function reveal() {
    if (shown) return;
    shown = true;
    const v = items[i];
    speech.resetCancel();
    speech.say(v.ex, { rate: store.settings().rate, voiceName: store.settings().voice });
    const a = store.assist();
    $('#after', frame).innerHTML = `
      <div class="say" style="margin-top:1.25rem">
        <p class="say__model">${esc(v.fr)}</p>
        <div class="ex" style="max-width:38rem;width:100%">
          <div class="row row--split" style="gap:.75rem;align-items:flex-start">
            <span class="ex__fr">${esc(v.ex)}</span>
            <button class="audiobtn" data-act="replay" aria-label="Réécouter">${icon.speak}</button>
          </div>
          ${a ? `<span class="ex__en">${esc(v.exEn)}</span>` : hide(v.exEn, 'anglais')}
        </div>
      </div>
      <div class="grades" style="margin-top:1.25rem">
        <button class="grade" data-act="g" data-g="0"><b>Inconnu</b><small>revient vite</small></button>
        <button class="grade" data-act="g" data-g="1"><b>Vaguement</b><small>court</small></button>
        <button class="grade" data-act="g" data-g="2"><b>Connu</b><small>normal</small></button>
        <button class="grade" data-act="g" data-g="3"><b>Évident</b><small>long</small></button>
      </div>`;
    bindPeeks(frame);
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
    store.logMinutes(15);
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${items.length}</div>
        <p class="score__l">blocs revus. Les mots que tu as ratés reviennent dans quelques minutes.</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Encore</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
  }

  acts(frame, {
    reveal,
    replay: () => { speech.resetCancel(); speech.say(items[i].ex, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    g: (b) => {
      const g = Number(b.dataset.g);
      srs.grade(items[i].id, g, ['vocab', items[i].theme]);
      g >= 2 ? fx.sndRight() : fx.sndWrong();
      i += 1; draw();
    },
    again: () => go('#/vocab?drill=1' + (theme ? '&theme=' + theme : '')),
  });

  draw();
  return () => speech.stopAll();
}
