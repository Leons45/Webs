// Compréhension écrite. You answer the whole set, then it is marked at once —
// the way the exam works, and the only way the score estimate means anything.

import { esc, acts, $, $$, passageHTML, LETTERS, mmss, stopwatch } from '../ui.js';
import * as store from '../store.js';
import { READING } from '../data/reading.js';
import { estimateScore, nclcFor, MODULES } from '../scoring.js';

const SECTION_NOTE = {
  A: 'Annonces, messages, documents courts. On cherche une information précise, pas le sens général.',
  B: 'Textes informatifs. Les questions suivent l’ordre du texte ; la dernière porte souvent sur l’intention de l’auteur.',
  C: 'Deux textes à confronter. Repère d’abord le point d’accord, puis le point de désaccord.',
  D: 'Texte à compléter. Grammaire et cohérence : c’est ici que se jouent la négation, les accords et les connecteurs.',
};

export default function lire(el, { params, go }) {
  const id = params.get('p');
  const item = READING.find(r => r.id === id);
  return item ? passage(el, item, go) : index(el, go);
}

/* ── index ─────────────────────────────────────────────────────── */

function index(el, go) {
  const results = store.get().results.ce;

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Compréhension écrite</h1>
      <p class="ph__sub">Quatre formats, notés sur 300. Travaille la section D si les accords et la
        négation te coûtent encore des points : c’est la section qui les sanctionne le plus directement.</p>
    </div>

    ${['A', 'B', 'C', 'D'].map(sec => {
      const items = READING.filter(r => r.section === sec);
      if (!items.length) return '';
      return `
      <section style="margin-bottom:2rem">
        <div class="row row--split" style="margin-bottom:.3rem">
          <h2 style="font-size:var(--t-md)">Section ${sec}</h2>
        </div>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1rem">
          ${esc(SECTION_NOTE[sec])}</p>
        <div class="grid2">
          ${items.map(it => {
            const past = results.filter(r => r.id === it.id);
            const best = past.length ? Math.max(...past.map(p => Math.round((p.score / p.total) * 100))) : null;
            const count = it.questions?.length || it.blanks?.length || 0;
            return `
            <button class="sheet" data-act="open" data-id="${esc(it.id)}"
                    style="text-align:left;display:grid;gap:.55rem;cursor:pointer">
              <b style="font:500 var(--t-base)/1.3 var(--ff-text)">${esc(it.title)}</b>
              <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
                ${count} question${count > 1 ? 's' : ''} · ${it.minutes} min
                ${best != null ? ` · déjà fait : ${best} %` : ''}
              </span>
            </button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}

    ${results.length ? summary(results) : ''}
    <div class="row"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  acts(el, { open: (b) => go('#/lire?p=' + b.dataset.id) });
}

function summary(results) {
  const slice = results.slice(-6);
  const acc = slice.reduce((s, r) => s + r.score, 0) / slice.reduce((s, r) => s + r.total, 0);
  const score = estimateScore('ce', acc);
  return `
  <hr class="hair">
  <div class="row row--split" style="align-items:baseline">
    <div>
      <div class="read__n u-num">${score} <span style="font-size:.5em;color:var(--ink-faint)">/ 300</span></div>
      <div class="read__l">estimation sur tes ${slice.length} dernières séries · NCLC ${nclcFor('ce', score)}</div>
    </div>
    <a class="btn btn--ghost" href="#/progres">Voir les progrès</a>
  </div>
  <hr class="hair">`;
}

/* ── one passage ───────────────────────────────────────────────── */

function passage(el, item, go) {
  const isGapFill = !!item.blanks;
  const questions = isGapFill ? item.blanks : item.questions;
  const answers = new Array(questions.length).fill(null);
  let marked = false;

  const textHTML = isGapFill
    ? passageHTML(item.text).replace(/⟨(\d+)⟩/g, (_, n) =>
        `<span class="blank" id="bk${n}" data-n="${n}">${n}</span>`)
    : passageHTML(item.text);

  el.innerHTML = `
  <div class="view">
    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
        Compréhension écrite · section ${item.section}</span>
      <div class="row" style="gap:.75rem">
        <span class="timer" id="clock"><span class="u-num">0:00</span><small>/ ${item.minutes} min</small></span>
        <a class="btn btn--plain" href="#/lire">Quitter</a>
      </div>
    </div>

    <div class="ph" style="margin-bottom:1.5rem">
      <h1 style="font-size:var(--t-xl)">${esc(item.title)}</h1>
      <p class="ph__sub">${esc(item.intro)}</p>
    </div>

    <article class="passage prose">${textHTML}</article>

    <hr class="hair">

    <div class="qlist" id="qlist">
      ${questions.map((q, qi) => `
        <div class="qblock" data-qi="${qi}">
          <div class="qblock__q"><span>${isGapFill ? `Trou ${q.n} — choisis la forme correcte.` : esc(q.q)}</span></div>
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
      <button class="btn btn--lg" data-act="mark" disabled>Corriger la série</button>
      <span class="u-ui u-num" id="prog" style="font-size:var(--t-sm);color:var(--ink-faint)">
        0 / ${questions.length} répondu</span>
    </div>
    <div id="result"></div>
  </div>`;

  const watch = stopwatch((s) => {
    const c = $('#clock .u-num', el);
    if (c) c.textContent = mmss(s);
    if (s > item.minutes * 60) $('#clock', el).dataset.low = '1';
  });

  acts(el, {
    pick: (btn) => {
      if (marked) return;
      const qi = Number(btn.dataset.qi), oi = Number(btn.dataset.oi);
      answers[qi] = oi;
      // Until the series is marked, a selection is only a selection:
      // no right/wrong colour is revealed.
      $$(`.opt[data-qi="${qi}"]`, el).forEach(b => {
        b.dataset.state = Number(b.dataset.oi) === oi ? 'chosen' : '';
      });

      if (isGapFill) {
        const bk = $(`#bk${questions[qi].n}`, el);
        if (bk) bk.dataset.filled = '1';
      }
      const done = answers.filter(a => a !== null).length;
      $('#prog', el).textContent = `${done} / ${questions.length} répondu`;
      $('[data-act="mark"]', el).disabled = done < questions.length;
    },

    mark: () => {
      if (marked) return;
      marked = true;
      watch.stop();
      let right = 0;

      questions.forEach((q, qi) => {
        const ok = answers[qi] === q.answer;
        if (ok) right += 1;
        const block = $(`.qblock[data-qi="${qi}"]`, el);
        $$('.opt', block).forEach(b => {
          const oi = Number(b.dataset.oi);
          b.disabled = true;
          b.dataset.state = oi === q.answer ? 'right' : oi === answers[qi] ? 'wrong' : 'muted';
        });
        block.querySelector('.qwhy').innerHTML = `
          <div class="verdict" data-ok="${ok ? 1 : 0}">
            <b>${ok ? 'Juste.' : 'Non.'}</b><p>${esc(q.why)}</p>
          </div>`;
      });

      store.logResult('ce', { id: item.id, section: item.section, score: right, total: questions.length });
      store.logMinutes(Math.max(1, Math.round(watch.elapsed() / 60)), 'lire');

      const share = right / questions.length;
      $('#footer', el).remove();
      $('#result', el).innerHTML = `
        <hr class="hair">
        <div class="score">
          <div class="score__n u-num">${right} / ${questions.length}</div>
          <p class="score__l">${esc(advice(share, item.section))}</p>
          <span class="score__band u-ui u-num">temps : ${mmss(watch.elapsed())} · barème indicatif ${item.minutes} min</span>
        </div>
        <div class="row" style="margin-top:1.5rem;justify-content:center">
          <a class="btn" href="#/lire">Autre texte</a>
          <a class="btn btn--ghost" href="#/">Retour à aujourd’hui</a>
        </div>`;
      $('#result', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });

  return () => watch.stop();
}

function advice(share, section) {
  if (share === 1) return 'Série parfaite. Passe à un texte plus long ou à la section C, qui demande de confronter deux points de vue.';
  if (share >= 0.8) return 'Solide. Relis les explications des questions manquées : l’erreur porte presque toujours sur un mot de nuance, pas sur le sens global.';
  if (share >= 0.6) return section === 'D'
    ? 'Les trous ratés indiquent exactement quoi travailler à l’Atelier. Note les thèmes et lance une série ciblée.'
    : 'Le sens général passe, le détail résiste. Au prochain texte, souligne la phrase qui répond avant de choisir.';
  return 'Reprends le texte sans chronomètre et cherche, pour chaque question, la phrase exacte qui justifie la réponse. La vitesse viendra après la méthode.';
}
