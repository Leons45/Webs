// Compréhension orale. No audio files: the browser's French voice reads
// original scripts, so this works offline and at any speed you choose.
// Replays are capped at two — the exam gives you one.

import { esc, acts, $, $$, LETTERS, icon } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import { LISTENING } from '../data/listening.js';
import { estimateScore, nclcFor } from '../scoring.js';

const SECTION_NOTE = {
  A: 'Échanges courts et situations concrètes. Une information précise par question.',
  B: 'Dialogues plus longs. Note qui veut quoi, et sur quel point les deux parties s’opposent.',
  C: 'Monologues et annonces. Le piège est le chiffre : dates, durées, montants, numéros.',
};

export default function ecouter(el, { params, go }) {
  const id = params.get('p');
  const item = LISTENING.find(l => l.id === id);
  return item ? session(el, item) : index(el, go);
}

/* ── index ─────────────────────────────────────────────────────── */

function index(el, go) {
  const results = store.get().results.co;
  const voices = speech.frenchVoices();

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Compréhension orale</h1>
      <p class="ph__sub">Notée sur 360. Les scripts sont lus par la voix française de ton navigateur :
        tu peux ralentir pour comprendre, puis remonter à vitesse normale pour t’entraîner vraiment.</p>
    </div>

    ${!voices.length ? `
      <div class="verdict" data-ok="0" style="margin-bottom:1.75rem">
        <b>Aucune voix française détectée</b>
        <p>Ce navigateur n’expose pas de voix française, donc la lecture sera muette ou anglaise.
        Chrome, Edge et Safari en proposent une ; sous Windows, ajoute le français dans
        Paramètres → Heure et langue → Voix. La dictée et les transcriptions restent utilisables.</p>
      </div>` : ''}

    ${['A', 'B', 'C'].map(sec => {
      const items = LISTENING.filter(l => l.section === sec);
      if (!items.length) return '';
      return `
      <section style="margin-bottom:2rem">
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">Section ${sec}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1rem">
          ${esc(SECTION_NOTE[sec])}</p>
        <div class="grid2">
          ${items.map(it => {
            const past = results.filter(r => r.id === it.id);
            const best = past.length ? Math.max(...past.map(p => Math.round((p.score / p.total) * 100))) : null;
            return `
            <button class="sheet" data-act="open" data-id="${esc(it.id)}"
                    style="text-align:left;display:grid;gap:.55rem;cursor:pointer">
              <b style="font:500 var(--t-base)/1.3 var(--ff-text)">${esc(it.title)}</b>
              <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
                ${it.questions.length} questions · ${esc(it.level)}${best != null ? ` · déjà fait : ${best} %` : ''}
              </span>
            </button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}

    <hr class="hair">
    <div class="row">
      <a class="btn btn--ghost" href="#/dictee">Passer à la dictée</a>
      <a class="btn btn--plain" href="#/">Retour</a>
    </div>
  </div>`;

  acts(el, { open: (b) => go('#/ecouter?p=' + b.dataset.id) });
}

/* ── one listening item ────────────────────────────────────────── */

function session(el, item) {
  const MAX_PLAYS = 2;
  let plays = 0, playing = false, marked = false, current = -1;
  const answers = new Array(item.questions.length).fill(null);
  let rate = store.settings().rate;

  el.innerHTML = `
  <div class="view">
    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
        Compréhension orale · section ${item.section}</span>
      <a class="btn btn--plain" href="#/ecouter">Quitter</a>
    </div>

    <div class="ph" style="margin-bottom:1.5rem">
      <h1 style="font-size:var(--t-xl)">${esc(item.title)}</h1>
      <p class="ph__sub">${esc(item.context)}</p>
    </div>

    <div class="player">
      <div class="player__row">
        <button class="player__play" data-act="play" aria-label="Écouter">${icon.play}</button>
        <div class="player__meta">
          <b id="plabel">Écouter l’enregistrement</b>
          <small id="pcount">deux écoutes au maximum — comme à l’examen, ou presque</small>
        </div>
        <div class="bars" id="bars" data-on="0" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="player__row" style="justify-content:space-between">
        <div class="speedrow" role="group" aria-label="Vitesse de lecture">
          ${[0.75, 0.85, 0.95, 1.05].map(r => `
            <button class="chip" data-act="rate" data-r="${r}" aria-pressed="${r === rate}">${r}×</button>`).join('')}
        </div>
        <button class="btn btn--plain" data-act="stop">Arrêter</button>
      </div>
    </div>

    <hr class="hair">

    <div class="qlist" id="qlist">
      ${item.questions.map((q, qi) => `
        <div class="qblock" data-qi="${qi}">
          <div class="qblock__q"><span>${esc(q.q)}</span></div>
          <div class="opts" style="max-width:38rem">
            ${q.options.map((o, oi) => `
              <button class="opt" data-act="pick" data-qi="${qi}" data-oi="${oi}">
                <span class="opt__k">${LETTERS[oi]}</span><span>${esc(o)}</span>
              </button>`).join('')}
          </div>
          <div class="qwhy"></div>
        </div>`).join('')}
    </div>

    <div class="row" style="margin-top:2rem" id="footer">
      <button class="btn btn--lg" data-act="mark" disabled>Corriger</button>
      <span class="u-ui u-num" id="prog" style="font-size:var(--t-sm);color:var(--ink-faint)">
        0 / ${item.questions.length} répondu</span>
    </div>
    <div id="result"></div>
  </div>`;

  function setPlaying(on) {
    playing = on;
    $('#bars', el).dataset.on = on ? '1' : '0';
    $('[data-act="play"]', el).innerHTML = on ? icon.pause : icon.play;
    $('#plabel', el).textContent = on ? 'Lecture en cours…'
      : plays === 0 ? 'Écouter l’enregistrement'
      : plays >= MAX_PLAYS ? 'Écoutes épuisées' : 'Réécouter une dernière fois';
    $('#pcount', el).textContent = plays === 0
      ? 'deux écoutes au maximum — comme à l’examen, ou presque'
      : `${plays} écoute${plays > 1 ? 's' : ''} sur ${MAX_PLAYS}`;
    $('[data-act="play"]', el).disabled = !on && plays >= MAX_PLAYS && !marked;
  }

  async function play() {
    if (playing) { speech.stopAll(); setPlaying(false); return; }
    if (plays >= MAX_PLAYS && !marked) return;
    plays += 1;
    speech.resetCancel();
    setPlaying(true);
    await speech.sayLines(item.lines, {
      rate,
      voiceName: store.settings().voice,
      onLine: (i) => {
        current = i;
        $$('.tline', el).forEach((t, k) => { t.dataset.active = k === i ? '1' : '0'; });
      },
    });
    setPlaying(false);
  }

  acts(el, {
    play,
    stop: () => { speech.stopAll(); setPlaying(false); },
    rate: (b) => {
      rate = Number(b.dataset.r);
      store.setSetting('rate', rate);
      $$('[data-act="rate"]', el).forEach(c => c.setAttribute('aria-pressed', String(Number(c.dataset.r) === rate)));
    },
    pick: (b) => {
      if (marked) return;
      const qi = Number(b.dataset.qi), oi = Number(b.dataset.oi);
      answers[qi] = oi;
      $$(`.opt[data-qi="${qi}"]`, el).forEach(x => {
        x.dataset.state = Number(x.dataset.oi) === oi ? 'chosen' : '';
      });
      const done = answers.filter(a => a !== null).length;
      $('#prog', el).textContent = `${done} / ${item.questions.length} répondu`;
      $('[data-act="mark"]', el).disabled = done < item.questions.length;
    },
    mark: () => {
      if (marked) return;
      marked = true;
      speech.stopAll();
      setPlaying(false);
      let right = 0;

      item.questions.forEach((q, qi) => {
        const ok = answers[qi] === q.answer;
        if (ok) right += 1;
        const block = $(`.qblock[data-qi="${qi}"]`, el);
        $$('.opt', block).forEach(x => {
          const oi = Number(x.dataset.oi);
          x.disabled = true;
          x.dataset.state = oi === q.answer ? 'right' : oi === answers[qi] ? 'wrong' : 'muted';
        });
        block.querySelector('.qwhy').innerHTML = `
          <div class="verdict" data-ok="${ok ? 1 : 0}">
            <b>${ok ? 'Juste.' : 'Non.'}</b><p>${esc(q.why)}</p>
          </div>`;
      });

      store.logResult('co', { id: item.id, section: item.section, score: right, total: item.questions.length });
      store.logMinutes(4, 'ecouter');

      const share = right / item.questions.length;
      const est = estimateScore('co', share);
      $('#footer', el).remove();
      $('#result', el).innerHTML = `
        <hr class="hair">
        <div class="score">
          <div class="score__n u-num">${right} / ${item.questions.length}</div>
          <p class="score__l">${esc(advice(share, plays))}</p>
          <span class="score__band u-ui u-num">cette série seule : ${est} / 360 · NCLC ${nclcFor('co', est)}</span>
        </div>

        <hr class="hair">
        <h2 style="font-size:var(--t-md);margin-bottom:.9rem">Transcription</h2>
        <div class="sheet transcript">
          ${item.lines.map(l => `
            <div class="tline">
              <span>${l.who === 'B' ? 'B' : 'A'}</span>
              <p style="margin:0">${esc(l.text)}</p>
            </div>`).join('')}
        </div>
        <div class="row" style="margin-top:1.25rem">
          <button class="btn btn--ghost" data-act="play">Réécouter en lisant</button>
          <a class="btn btn--ghost" href="#/ecouter">Autre enregistrement</a>
        </div>`;
      $('#result', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });

  setPlaying(false);
  return () => speech.stopAll();
}

function advice(share, plays) {
  if (share === 1) return plays === 1
    ? 'Tout juste en une seule écoute : c’est exactement la condition de l’examen. Monte la vitesse à 1,05×.'
    : 'Tout juste. Refais-en un en t’interdisant la seconde écoute.';
  if (share >= 0.75) return 'Bon résultat. Les erreurs en compréhension orale portent presque toujours sur un chiffre ou une négation : écoute la transcription en suivant du doigt les passages ratés.';
  if (share >= 0.5) return 'Le fil général passe mais le détail s’échappe. Réécoute en lisant la transcription, puis une troisième fois sans la lire.';
  return 'Ralentis à 0,75×, écoute en lisant la transcription, puis reviens demain sans elle. Ce n’est pas un problème de vocabulaire mais de débit.';
}
