// Sujets — the real Expression Écrite prompts, grouped by theme, each with
// its own phrase/vocabulary deck and a checklist of the actual exam prompts
// reported for that theme. The exam never repeats a prompt, so the unit of
// preparation here is the theme's vocabulary, not the story itself.

import { esc, acts, $, icon } from '../ui.js';
import { hide, bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import * as speech from '../speech.js';
import * as fx from '../fx.js';
import { CATS, TOPICS, CHUNKS, PHRASES, topicsByCat, chunksByCat, phrasesByCat } from '../data/sujets.js';

export default function sujets(el, { params, go }) {
  const cat = params.get('cat');
  if (params.get('drill')) return drill(el, go, cat);
  if (cat) return category(el, go, cat);
  return index(el, go);
}

/* ── colour per deck — decorative, independent of the page accent ──── */
const DECK = {
  structureA:'var(--bleu)', enfants:'var(--jaune)', famille:'var(--rose)',
  animaux:'var(--vert)', police:'var(--rouge)', voyage:'var(--orange)', exploits:'var(--violet)',
  structureB:'var(--bleu)', techno:'var(--rose)', education:'var(--jaune)',
  environnement:'var(--vert)', sante:'var(--orange)', societe:'var(--violet)',
};

function poolOf(cat) {
  return cat ? [...chunksByCat(cat), ...phrasesByCat(cat)] : [...CHUNKS, ...PHRASES];
}

/* ── index: two rows of decks, Section A then Section B ─────────────── */

function index(el, go) {
  const a = store.assist();
  const prepared = TOPICS.filter(x => store.topicPrepared(x.id)).length;
  const c = srs.counts([...CHUNKS, ...PHRASES]);

  const deck = (key) => {
    const meta = CATS[key];
    const topics = topicsByCat(key);
    const items = poolOf(key);
    const learned = items.filter(x => srs.isLearned(x.id)).length;
    const share = items.length ? Math.round((learned / items.length) * 100) : 0;
    return `
    <button class="sheet" data-act="open" data-cat="${esc(key)}"
            style="text-align:left;display:grid;gap:.7rem;cursor:pointer;
                   --accent:${DECK[key]};padding-top:1.1rem;border-top:10px solid ${DECK[key]}">
      <div class="row row--split" style="align-items:flex-start;gap:.6rem">
        <b style="font:800 var(--t-md)/1.2 var(--ff-ui);letter-spacing:-.025em">
          ${esc(meta.fr)}${a ? `<span class="gloss">${esc(meta.en)}</span>` : ''}</b>
        ${topics.length ? `<span class="phrase__lv u-num" style="background:${DECK[key]};flex:0 0 auto">${topics.length}</span>` : ''}
      </div>
      <span style="font-size:var(--t-sm);line-height:1.5;color:var(--ink-soft)">${esc(meta.note)}</span>
      ${items.length ? `
        <span class="meter__track" style="height:10px">
          <span class="meter__fill" style="display:block;width:${share}%" ${learned === items.length ? 'data-met="1"' : ''}></span>
        </span>
        <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">${learned} / ${items.length} consolidés</span>` : ''}
    </button>`;
  };

  const A = Object.keys(CATS).filter(k => CATS[k].section === 'A');
  const B = Object.keys(CATS).filter(k => CATS[k].section === 'B');

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Sujets${a ? '<span class="gloss" style="font-size:var(--t-base)">Writing topics</span>' : ''}</h1>
      <p class="ph__sub">Les vrais sujets d’Expression écrite, rapportés par des candidats, classés
        par thème. L’examen ne répète jamais un sujet mot pour mot — mais il répète ses thèmes.
        Apprends le vocabulaire d’un thème, pas une histoire par cœur.
        ${a ? '<span class="gloss">The real Expression Écrite prompts, as reported by candidates, grouped by theme. The exam never repeats a prompt word for word — but it repeats its themes. Learn a theme’s vocabulary, not one story by heart.</span>' : ''}</p>
    </div>

    <div class="row row--split" style="margin-bottom:1.5rem;flex-wrap:wrap;gap:.75rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${c.learned} / ${c.total} consolidés · ${prepared} / ${TOPICS.length} sujets préparés</span>
      <button class="btn" data-act="drillall">Tout mélanger et s’entraîner${a ? ' · Drill everything' : ''}</button>
    </div>

    <section style="margin-bottom:2.25rem">
      <h2 style="font-size:var(--t-md);margin-bottom:.9rem">Section A — continuer un récit
        ${a ? '<span class="gloss">continue a narrative</span>' : ''}</h2>
      <div class="grid2">${A.map(deck).join('')}</div>
    </section>

    <section>
      <h2 style="font-size:var(--t-md);margin-bottom:.9rem">Section B — défendre un avis
        ${a ? '<span class="gloss">defend an opinion</span>' : ''}</h2>
      <div class="grid2">${B.map(deck).join('')}</div>
    </section>
  </div>`;

  acts(el, {
    open: (b) => go('#/sujets?cat=' + b.dataset.cat),
    drillall: () => go('#/sujets?drill=1'),
  });
}

/* ── one category: real prompts + its phrase/vocab deck ─────────────── */

function category(el, go, cat) {
  const meta = CATS[cat];
  if (!meta) return index(el, go);
  const a = store.assist();
  const topics = topicsByCat(cat);
  const chunks = chunksByCat(cat);
  const phrases = phrasesByCat(cat);
  const pool = [...chunks, ...phrases];
  const c = srs.counts(pool);

  el.innerHTML = `
  <div class="view">
    <div class="row" style="margin-bottom:1.25rem">
      <a class="btn btn--plain" href="#/sujets">Tous les thèmes</a>
    </div>

    <div class="ph">
      <h1 style="font-size:var(--t-xl)">${esc(meta.fr)}
        ${a ? `<span class="gloss" style="font-size:var(--t-sm)">${esc(meta.en)}</span>` : ''}</h1>
      <p class="ph__sub">${esc(meta.note)}</p>
    </div>

    ${pool.length ? `
    <div class="row row--split" style="margin-bottom:1.75rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${c.learned} / ${c.total} consolidés · ${c.due} à revoir</span>
      <button class="btn" data-act="drill">S’entraîner à voix haute${a ? ' · Drill aloud' : ''}</button>
    </div>` : ''}

    ${topics.length ? `
    <section style="margin-bottom:2rem">
      <h2 style="font-size:var(--t-base);margin-bottom:.6rem">Sujets réels
        ${a ? '<span class="gloss">real exam prompts</span>' : ''}</h2>
      <div class="sheet sheet--flush">
        ${topics.map(x => `
          <div class="phrase">
            <div class="row row--split" style="align-items:flex-start;gap:.75rem">
              <span class="phrase__fr">${esc(x.fr)}</span>
              <button class="phrase__lv" data-act="prep" data-id="${esc(x.id)}"
                      style="cursor:pointer;border:none;flex:0 0 auto;${store.topicPrepared(x.id) ? 'background:var(--vert);color:#fff;border-color:var(--vert)' : ''}">
                ${store.topicPrepared(x.id) ? 'préparé' : 'à préparer'}</button>
            </div>
            ${a ? `<span class="phrase__en">${esc(x.en)}</span>` : ''}
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${phrases.length ? `
    <section style="margin-bottom:2rem">
      <h2 style="font-size:var(--t-base);margin-bottom:.6rem">Phrases${a ? '<span class="gloss">connectors</span>' : ''}</h2>
      <div class="sheet sheet--flush">
        ${phrases.map(p => `
          <div class="phrase">
            <div class="row row--split" style="align-items:flex-start;gap:.75rem">
              <span class="phrase__fr">${esc(p.fr)}</span>
              <button class="audiobtn" data-act="say" data-fr="${esc(p.fr)}" aria-label="Écouter">${icon.speak}</button>
            </div>
            <span class="phrase__en">${esc(p.en)}</span>
            <span class="phrase__use">${esc(p.use)}</span>
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${chunks.length ? `
    <section>
      <h2 style="font-size:var(--t-base);margin-bottom:.6rem">Vocabulaire${a ? '<span class="gloss">vocabulary</span>' : ''}</h2>
      <div class="sheet sheet--flush">
        ${chunks.map(v => `
          <div class="phrase">
            <div class="row row--split" style="align-items:flex-start;gap:.75rem">
              <span class="phrase__fr">${esc(v.fr)}</span>
              <button class="audiobtn" data-act="say" data-fr="${esc(v.ex)}" aria-label="Écouter">${icon.speak}</button>
            </div>
            <span class="phrase__en">${esc(v.en)}</span>
            <div class="ex" style="margin-top:.3rem">
              <span class="ex__fr">${esc(v.ex)}</span>
              ${a ? `<span class="ex__en">${esc(v.exEn)}</span>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </section>` : ''}
  </div>`;

  acts(el, {
    say: (b) => { speech.resetCancel(); speech.say(b.dataset.fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    drill: () => go('#/sujets?drill=1&cat=' + cat),
    prep: (b) => {
      const on = store.toggleTopicPrep(b.dataset.id);
      b.textContent = on ? 'préparé' : 'à préparer';
      b.style.background = on ? 'var(--vert)' : '';
      b.style.color = on ? '#fff' : '';
      b.style.borderColor = on ? 'var(--vert)' : '';
      on ? fx.sndRight() : null;
    },
  });
}

/* ── drill: phrases and vocab chunks, same SM-2 flow as elsewhere ───── */

function drill(el, go, cat) {
  const pool = poolOf(cat);
  const queued = srs.queue(pool, 14);
  const items = queued.length ? queued : [...pool].sort(() => Math.random() - 0.5).slice(0, 14);
  let i = 0, shown = false;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= items.length) return done();
    const it = items[i];
    shown = false;

    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.25rem">
        <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
          Sujets · ${i + 1} / ${items.length}</span>
        <a class="btn btn--plain" href="#/sujets${cat ? '?cat=' + cat : ''}">Quitter</a>
      </div>

      <div class="say">
        <p class="say__cue say__cue--en">${esc(it.en)}</p>
        <p style="font-size:var(--t-sm);color:var(--ink-faint);max-width:32ch">
          Dis-le en français, à voix haute, avant de regarder.</p>
        <button class="btn btn--ghost" data-act="reveal">Voir et écouter</button>
      </div>
      <div id="after"></div>`;
  }

  function reveal() {
    if (shown) return;
    shown = true;
    const it = items[i];
    const speakText = it.ex || it.fr;
    speech.resetCancel();
    speech.say(speakText, { rate: store.settings().rate, voiceName: store.settings().voice });
    const a = store.assist();
    $('#after', frame).innerHTML = it.ex ? `
      <div class="say" style="margin-top:1.25rem">
        <p class="say__model">${esc(it.fr)}</p>
        <div class="ex" style="max-width:38rem;width:100%">
          <div class="row row--split" style="gap:.75rem;align-items:flex-start">
            <span class="ex__fr">${esc(it.ex)}</span>
            <button class="audiobtn" data-act="replay" aria-label="Réécouter">${icon.speak}</button>
          </div>
          ${a ? `<span class="ex__en">${esc(it.exEn)}</span>` : hide(it.exEn, 'anglais')}
        </div>
      </div>
      <div class="grades" style="margin-top:1.25rem">
        <button class="grade" data-act="g" data-g="0"><b>Inconnu</b><small>revient vite</small></button>
        <button class="grade" data-act="g" data-g="1"><b>Vaguement</b><small>court</small></button>
        <button class="grade" data-act="g" data-g="2"><b>Connu</b><small>normal</small></button>
        <button class="grade" data-act="g" data-g="3"><b>Évident</b><small>long</small></button>
      </div>` : `
      <div class="say" style="margin-top:1.25rem">
        <p class="say__model">${esc(it.fr)}</p>
        <p class="say__use">${esc(it.use)}</p>
        <button class="btn btn--plain" data-act="replay">Réécouter</button>
      </div>
      <div class="grades" style="margin-top:1.25rem">
        <button class="grade" data-act="g" data-g="0"><b>Rien</b><small>revient vite</small></button>
        <button class="grade" data-act="g" data-g="1"><b>Hésitant</b><small>court</small></button>
        <button class="grade" data-act="g" data-g="2"><b>Dit juste</b><small>normal</small></button>
        <button class="grade" data-act="g" data-g="3"><b>Immédiat</b><small>long</small></button>
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
        <p class="score__l">blocs revus pour l’écrit. Ceux que tu as ratés reviennent dans
          quelques minutes ; les autres dans quelques jours.</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Une autre série</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
  }

  acts(frame, {
    reveal,
    replay: () => { const it = items[i]; speech.resetCancel(); speech.say(it.ex || it.fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    g: (b) => {
      const g = Number(b.dataset.g);
      srs.grade(items[i].id, g, ['sujets', items[i].category]);
      g >= 2 ? fx.sndRight() : fx.sndWrong();
      i += 1; draw();
    },
    again: () => go('#/sujets?drill=1' + (cat ? '&cat=' + cat : '')),
  });

  draw();
  return () => speech.stopAll();
}
