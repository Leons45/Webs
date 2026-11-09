// Expression orale. The exam has no transcript and no second take, so the
// only honest practice is: prepare briefly, speak once against the clock,
// listen back, and grade yourself on the five things the examiner weighs.

import { esc, acts, $, $$, mmss, countdown, icon } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import { ORAL } from '../data/prompts.js';
import { estimateScore, nclcFor } from '../scoring.js';

const RUBRIC = [
  { k:'tache',   label:'Tâche accomplie',       hint:'Section A : des questions variées, pas trois fois la même. Section B : une position tenue jusqu’au bout.' },
  { k:'fluidite',label:'Fluidité et débit',     hint:'Peu d’hésitations longues, pas de phrases abandonnées en cours de route.' },
  { k:'lexique', label:'Richesse du lexique',   hint:'Mots précis plutôt que « truc », « faire », « chose ». Reformulations vers le haut.' },
  { k:'grammaire',label:'Correction grammaticale',hint:'Accords, auxiliaires, négation, temps. Compte les fautes que tu entends.' },
  { k:'registre',label:'Registre et interaction',hint:'Vouvoiement tenu, formules de politesse, relances naturelles.' },
];

export default function parler(el, { params, go }) {
  const id = params.get('p');
  const item = ORAL.find(o => o.id === id);
  return item ? session(el, item, go) : index(el, go);
}

function index(el, go) {
  const past = store.get().results.eo;

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Expression orale</h1>
      <p class="ph__sub">Notée sur 450. Deux tâches très différentes : en section A tu ne donnes aucun avis,
        tu poses des questions ; en section B tu dois convaincre et tenir ta position face aux objections.</p>
    </div>

    ${['A', 'B'].map(sec => {
      const items = ORAL.filter(o => o.section === sec);
      return `
      <section style="margin-bottom:2rem">
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">Section ${sec} — ${sec === 'A' ? 'obtenir des informations' : 'convaincre'}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1rem">
          ${sec === 'A'
            ? 'Cinq minutes. Tu as un document et tu dois en tirer le maximum d’informations par des questions. Une seule affirmation d’opinion et la tâche est manquée.'
            : 'Dix minutes. Tu veux obtenir un accord de quelqu’un qui résiste. L’examinateur objecte : il faut concéder puis réfuter, pas répéter.'}</p>
        <div class="grid2">
          ${items.map(it => {
            const tries = past.filter(p => p.id === it.id).length;
            return `
            <button class="sheet" data-act="open" data-id="${esc(it.id)}"
                    style="text-align:left;display:grid;gap:.55rem;cursor:pointer">
              <b style="font:500 var(--t-base)/1.3 var(--ff-text)">${esc(it.title)}</b>
              <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
                ${it.minutes} min${tries ? ` · ${tries} passage${tries > 1 ? 's' : ''}` : ''}
              </span>
            </button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}

    ${past.length ? `
      <hr class="hair">
      <div class="row row--split" style="align-items:baseline">
        <div>
          ${(() => {
            const slice = past.slice(-6);
            const acc = slice.reduce((s, r) => s + r.score, 0) / slice.reduce((s, r) => s + r.total, 0);
            const est = estimateScore('eo', acc);
            return `<div class="read__n u-num">${est} <span style="font-size:.5em;color:var(--ink-faint)">/ 450</span></div>
                    <div class="read__l">auto-évaluation sur ${slice.length} passages · NCLC ${nclcFor('eo', est)}</div>`;
          })()}
        </div>
        <a class="btn btn--ghost" href="#/progres">Progrès</a>
      </div>` : ''}

    <hr class="hair">
    <div class="row"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  acts(el, { open: (b) => go('#/parler?p=' + b.dataset.id) });
}

/* ── one speaking task ─────────────────────────────────────────── */

function session(el, item, go) {
  let phase = 'brief';      // brief → prep → live → review
  let stopClock = null;
  let rec = null, audioURL = null, elapsed = 0;
  let transcript = '';
  let listener = null;
  const marks = {};

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  const head = () => `
    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
        Expression orale · section ${item.section}</span>
      <a class="btn btn--plain" href="#/parler">Quitter</a>
    </div>`;

  function drawBrief() {
    frame.innerHTML = `${head()}
      <div class="ph" style="margin-bottom:1.5rem">
        <h1 style="font-size:var(--t-xl)">${esc(item.title)}</h1>
        <p class="ph__sub">${esc(item.brief)}</p>
      </div>

      <div class="passage prose" style="max-width:52ch">
        <p style="margin:0;font-style:italic">${esc(item.doc)}</p>
      </div>

      <hr class="hair">

      <div class="grid2" style="align-items:start">
        <div>
          <h2 style="font-size:var(--t-base);margin-bottom:.7rem">À couvrir absolument</h2>
          <ul style="margin:0;padding-left:1.1rem;font-size:var(--t-sm);line-height:1.8;color:var(--ink-soft)">
            ${item.musts.map(m => `<li>${esc(m)}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h2 style="font-size:var(--t-base);margin-bottom:.7rem">Amorces à réutiliser</h2>
          <div class="bank__g">
            ${item.starters.map(s => `<span class="bank__p">${esc(s)}</span>`).join('')}
          </div>
        </div>
      </div>

      <hr class="hair">

      <div class="row">
        <button class="btn btn--lg" data-act="prep">Une minute de préparation</button>
        <button class="btn btn--ghost btn--lg" data-act="live">Commencer tout de suite</button>
      </div>
      <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-faint);max-width:50ch">
        L’enregistrement sert à te réécouter ; il reste sur cet appareil et n’est jamais envoyé nulle part.
      </p>`;
  }

  function drawPrep() {
    phase = 'prep';
    frame.innerHTML = `${head()}
      <div class="score">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">Préparation</span>
        <div class="timer" style="font-size:var(--t-3xl)"><span class="u-num" id="t">1:00</span></div>
        <p class="score__l">Note mentalement tes trois premières phrases. Ne rédige pas :
          à l’examen tu n’auras pas le temps de lire.</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="live">Je suis prêt</button>
      </div>`;
    stopClock = countdown(60, (s) => {
      const t = $('#t', frame); if (t) t.textContent = mmss(s);
    }, () => drawLive());
  }

  async function drawLive() {
    if (stopClock) { stopClock(); stopClock = null; }
    phase = 'live';
    const seconds = item.minutes * 60;

    frame.innerHTML = `${head()}
      <div class="score">
        <div class="recdot" id="dot" data-on="1" aria-hidden="true">${icon.mic}</div>
        <div class="timer" id="clock" style="font-size:var(--t-3xl)"><span class="u-num" id="t">${mmss(seconds)}</span></div>
        <p class="score__l">Parle sans t’arrêter. Si tu bloques, reformule à voix haute plutôt que de te taire.</p>
        <span class="score__band u-ui" id="recstate">enregistrement en cours</span>
      </div>

      <div class="sheet" style="margin-top:1.5rem">
        <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.6rem">Rappel</div>
        <p style="margin:0;font-size:var(--t-sm);line-height:1.7">${esc(item.goal)}
          ${item.musts.slice(0, 4).map(m => esc(m)).join(' · ')}</p>
      </div>

      <div id="live" style="margin-top:1rem"></div>

      <div class="row" style="margin-top:1.5rem">
        <button class="btn btn--rouge btn--lg" data-act="done">Terminer</button>
      </div>`;

    try {
      rec = await speech.recorder();
      rec.start();
    } catch {
      rec = null;
      const s = $('#recstate', frame);
      if (s) s.textContent = 'micro indisponible — le minuteur fonctionne quand même';
      const d = $('#dot', frame); if (d) d.dataset.on = '0';
    }

    if (speech.hasRecognition()) {
      listener = speech.listen({
        onPartial: (t) => {
          transcript = t;
          const live = $('#live', frame);
          if (live) live.innerHTML = `
            <div class="sheet sheet--quiet">
              <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.5rem">
                Transcription approximative — pour compter tes mots, pas pour te corriger</div>
              <p style="margin:0;font-size:var(--t-sm);color:var(--ink-soft)">${esc(t.slice(-600))}</p>
            </div>`;
        },
        onFinal: (t) => { transcript = t; },
      });
    }

    const startedAt = Date.now();
    frame._startedAt = startedAt;
    stopClock = countdown(seconds, (s) => {
      const t = $('#t', frame); if (t) t.textContent = mmss(s);
      if (s <= 30) { const c = $('#clock', frame); if (c) c.dataset.low = '1'; }
    }, () => finishLive());
  }

  async function finishLive() {
    if (stopClock) { stopClock(); stopClock = null; }
    if (frame._startedAt) {
      elapsed = Math.min(item.minutes * 60, Math.round((Date.now() - frame._startedAt) / 1000));
      frame._startedAt = null;
    }
    if (listener) { try { listener.stop(); } catch {} listener = null; }
    if (rec) { try { audioURL = await rec.stop(); } catch {} rec = null; }
    drawReview();
  }

  function drawReview() {
    phase = 'review';
    const spokenWords = transcript ? transcript.trim().split(/\s+/).length : null;

    frame.innerHTML = `${head()}
      <div class="ph" style="margin-bottom:1.5rem">
        <h1 style="font-size:var(--t-xl)">Réécoute-toi</h1>
        <p class="ph__sub">C’est l’étape que tout le monde saute et c’est celle qui fait progresser.
          Écoute une fois pour le contenu, une seconde fois en comptant les fautes.</p>
      </div>

      ${audioURL ? `<audio controls src="${audioURL}"></audio>`
        : `<div class="empty">Aucun enregistrement : le micro n’était pas disponible.
             Tu peux tout de même t’auto-évaluer de mémoire.</div>`}

      <div class="row" style="margin-top:1rem;gap:1.25rem">
        <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
          durée : ${mmss(elapsed || item.minutes * 60)} / ${item.minutes} min</span>
        ${spokenWords ? `<span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
          environ ${spokenWords} mots · ${Math.round(spokenWords / Math.max(1, (elapsed || item.minutes * 60) / 60))} mots/min</span>` : ''}
      </div>

      <hr class="hair">

      <h2 style="font-size:var(--t-md);margin-bottom:.4rem">Auto-évaluation</h2>
      <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:54ch;margin-bottom:1.25rem">
        Note chaque critère de 0 à 3. Sois sévère : une note gonflée fausse l’estimation
        et t’enlève l’information dont tu as besoin.</p>

      <div class="stack">
        ${RUBRIC.map(r => `
          <div class="sheet" style="display:grid;gap:.7rem">
            <div>
              <b style="font:500 var(--t-base)/1.2 var(--ff-text)">${esc(r.label)}</b>
              <p style="margin:.35rem 0 0;font-size:var(--t-sm);color:var(--ink-soft)">${esc(r.hint)}</p>
            </div>
            <div class="grades" role="group" aria-label="${esc(r.label)}">
              ${[0, 1, 2, 3].map(v => `
                <button class="grade" data-act="mark" data-k="${r.k}" data-v="${v}">
                  <b>${v}</b><small>${['insuffisant', 'fragile', 'correct', 'solide'][v]}</small>
                </button>`).join('')}
            </div>
          </div>`).join('')}
      </div>

      <div class="row" style="margin-top:1.75rem" id="savebar">
        <button class="btn btn--lg" data-act="save" disabled>Enregistrer ce passage</button>
        <span class="u-ui u-num" id="mprog" style="font-size:var(--t-sm);color:var(--ink-faint)">
          0 / ${RUBRIC.length} critères notés</span>
      </div>
      <div id="done"></div>`;
  }

  acts(frame, {
    prep: drawPrep,
    live: () => drawLive(),
    done: () => finishLive(),
    leave: () => { cleanup(); },

    mark: (btn) => {
      const k = btn.dataset.k, v = Number(btn.dataset.v);
      marks[k] = v;
      $$(`[data-act="mark"][data-k="${k}"]`, frame).forEach(b => {
        b.style.background = Number(b.dataset.v) === v ? 'var(--ink)' : '';
        b.style.borderColor = Number(b.dataset.v) === v ? 'var(--ink)' : '';
        b.querySelectorAll('b,small').forEach(x => {
          x.style.color = Number(b.dataset.v) === v ? 'var(--paper-2)' : '';
        });
      });
      const n = Object.keys(marks).length;
      $('#mprog', frame).textContent = `${n} / ${RUBRIC.length} critères notés`;
      $('[data-act="save"]', frame).disabled = n < RUBRIC.length;
    },

    save: () => {
      const total = RUBRIC.length * 3;
      const score = RUBRIC.reduce((s, r) => s + (marks[r.k] || 0), 0);
      store.logResult('eo', { id: item.id, section: item.section, score, total });
      store.logOral({ id: item.id, score, total, seconds: elapsed, marks: { ...marks } });
      store.logMinutes(item.minutes, 'parler');

      const est = estimateScore('eo', score / total);
      const lowest = RUBRIC.filter(r => marks[r.k] <= 1);
      $('#savebar', frame).remove();
      $('#done', frame).innerHTML = `
        <hr class="hair">
        <div class="score">
          <div class="score__n u-num">${score} / ${total}</div>
          <p class="score__l">${lowest.length
            ? `À reprendre en priorité : ${lowest.map(r => r.label.toLowerCase()).join(', ')}.`
            : 'Passage équilibré. Refais la même tâche dans une semaine sans relire les amorces.'}</p>
          <span class="score__band u-ui u-num">estimation ${est} / 450 · NCLC ${nclcFor('eo', est)}</span>
        </div>
        <div class="row" style="margin-top:1.5rem;justify-content:center">
          <a class="btn" href="#/parler">Autre sujet</a>
          <a class="btn btn--ghost" href="#/">Retour à aujourd’hui</a>
        </div>`;
      $('#done', frame).scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });

  function cleanup() {
    if (stopClock) stopClock();
    if (listener) { try { listener.stop(); } catch {} }
    if (rec) { try { rec.stop(); } catch {} }
    if (audioURL) URL.revokeObjectURL(audioURL);
  }

  drawBrief();
  return cleanup;
}
