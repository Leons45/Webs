// Grammar, taught the way it is useful: a short rule, three examples you
// could actually say, then drills. A lesson only counts as passed at 70%.

import { esc, acts, $, $$, LETTERS, shuffle, icon } from '../ui.js';
import { bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import * as fx from '../fx.js';
import { GRAMMAR, lessonById } from '../data/grammar.js';
import { todayLesson, currentWeek } from '../plan.js';

const normalise = (s) => String(s || '')
  .trim().toLowerCase()
  .replace(/[’‘`´]/g, "'")
  .replace(/\s+/g, ' ')
  .replace(/[.,;!?]+$/, '');

export default function grammaire(el, { params, go }) {
  const id = params.get('id') || (params.get('today') ? todayLesson() : null);
  const lesson = id ? lessonById(id) : null;
  return lesson ? view(el, lesson, go) : index(el, go);
}

/* ── index ─────────────────────────────────────────────────────── */

function index(el, go) {
  const a = store.assist();
  const week = currentWeek();
  const suggested = todayLesson();
  const passed = GRAMMAR.filter(g => {
    const r = store.lesson(g.id);
    return r && r.total && r.score / r.total >= 0.7;
  }).length;

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Grammaire${a ? '<span class="gloss" style="font-size:var(--t-base)">Grammar</span>' : ''}</h1>
      <p class="ph__sub">Seize leçons, dans l’ordre où elles débloquent la parole.
        Chacune existe parce qu’elle empêche quelque chose que tu veux dire.
        ${a ? '<span class="gloss">Sixteen lessons, in the order in which they unblock speech. Each one exists because it stands in the way of something you want to say.</span>' : ''}</p>
    </div>

    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:var(--ink-faint)">
        ${passed} / ${GRAMMAR.length} réussies à 70 %</span>
      <button class="btn" data-act="today">Leçon du jour${a ? ' · Today’s lesson' : ''}</button>
    </div>

    <p class="why" style="margin-bottom:1.5rem">
      Semaine ${week.n} — ${esc(week.fr)} : ${week.lessons.map(id => esc(lessonById(id)?.fr || id)).join(', ')}.
      ${a ? `<span class="gloss">Week ${week.n} — ${esc(week.en)}</span>` : ''}
    </p>

    <div class="sheet sheet--flush">
      ${GRAMMAR.map(g => {
        const r = store.lesson(g.id);
        const pct = r && r.total ? Math.round((r.score / r.total) * 100) : null;
        const ok = pct != null && pct >= 70;
        return `
        <button class="block" data-act="open" data-id="${esc(g.id)}" data-done="${ok ? 1 : 0}"
                style="padding-left:1.15rem;padding-right:1.15rem">
          <span class="block__time">${g.level}</span>
          <span class="block__body">
            <span class="block__name">${esc(g.fr)}</span>
            <span class="block__desc">${esc(g.en)}</span>
          </span>
          <span class="block__meta">
            <span>${pct == null ? `${g.drills.length} exercices` : `${pct} %`}</span>
            ${g.id === suggested ? '<span style="color:var(--ink)">aujourd’hui</span>' : ''}
          </span>
        </button>`;
      }).join('')}
    </div>
  </div>`;

  acts(el, {
    open: (b) => go('#/grammaire?id=' + b.dataset.id),
    today: () => go('#/grammaire?id=' + suggested),
  });
}

/* ── one lesson ────────────────────────────────────────────────── */

function view(el, lesson, go) {
  const a = store.assist();
  const drills = shuffle(lesson.drills);
  const answers = new Array(drills.length).fill(null);
  let phase = 'learn';

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function learn() {
    phase = 'learn';
    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.25rem">
        <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
          Grammaire · niveau ${lesson.level}</span>
        <a class="btn btn--plain" href="#/grammaire">Quitter</a>
      </div>

      <div class="ph" style="margin-bottom:1.25rem">
        <h1 style="font-size:var(--t-xl)">${esc(lesson.fr)}
          ${a ? `<span class="gloss" style="font-size:var(--t-sm)">${esc(lesson.en)}</span>` : ''}</h1>
      </div>

      <div class="why" style="margin-bottom:1.75rem">${esc(lesson.why)}</div>

      <h2 style="font-size:var(--t-md);margin-bottom:.6rem">La règle${a ? '<span class="gloss">The rule</span>' : ''}</h2>
      <div class="sheet" style="margin-bottom:1.75rem">
        ${lesson.points.map(p => `
          <div class="rule">
            <span class="rule__fr">${esc(p.fr)}</span>
            ${a ? `<span class="rule__en">${esc(p.en)}</span>` : ''}
          </div>`).join('')}
      </div>

      <h2 style="font-size:var(--t-md);margin-bottom:.6rem">
        À dire à voix haute${a ? '<span class="gloss">Say these aloud</span>' : ''}</h2>
      <div style="margin-bottom:1.75rem">
        ${lesson.examples.map(x => `
          <div class="ex">
            <div class="row row--split" style="gap:.75rem;align-items:flex-start">
              <span class="ex__fr">${esc(x.fr)}</span>
              <button class="audiobtn" data-act="say" data-fr="${esc(x.fr)}" aria-label="Écouter">${icon.speak}</button>
            </div>
            ${a ? `<span class="ex__en">${esc(x.en)}</span>` : ''}
          </div>`).join('')}
      </div>

      <div class="row">
        <button class="btn btn--lg" data-act="drill">Faire les exercices${a ? ' · Drills' : ''}</button>
        <button class="btn btn--ghost" data-act="sayall">Tout écouter</button>
      </div>`;
  }

  function drill() {
    phase = 'drill';
    frame.innerHTML = `
      <div class="row row--split" style="margin-bottom:1.25rem">
        <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
          ${esc(lesson.fr)} · exercices</span>
        <a class="btn btn--plain" href="#/grammaire">Quitter</a>
      </div>

      <div class="qlist">
        ${drills.map((d, qi) => `
          <div class="qblock" data-qi="${qi}">
            <div class="qblock__q">
              <span>${esc(d.prompt)}
                ${a && d.promptEn ? `<span class="gloss">${esc(d.promptEn)}</span>` : ''}</span>
            </div>
            ${d.type === 'choice' ? `
              <div class="opts" style="max-width:38rem">
                ${d.options.map((o, oi) => `
                  <button class="opt" data-act="pick" data-qi="${qi}" data-oi="${oi}">
                    <span class="opt__k">${LETTERS[oi]}</span><span>${esc(o)}</span>
                  </button>`).join('')}
              </div>`
            : `
              <input class="input" data-act="type" data-qi="${qi}" autocomplete="off"
                     autocapitalize="off" spellcheck="false"
                     placeholder="Écris la forme manquante" style="max-width:24rem">`}
            <div class="qwhy"></div>
          </div>`).join('')}
      </div>

      <div class="row" style="margin-top:2rem" id="footer">
        <button class="btn btn--lg" data-act="mark">Corriger${a ? ' · Check' : ''}</button>
        <span class="u-ui u-num" id="prog" style="font-size:var(--t-sm);color:var(--ink-faint)">
          0 / ${drills.length}</span>
      </div>
      <div id="result"></div>`;

    $$('[data-act="type"]', frame).forEach(inp => {
      inp.addEventListener('input', () => {
        answers[Number(inp.dataset.qi)] = inp.value.trim() || null;
        updateProgress();
      });
    });
  }

  function updateProgress() {
    const n = answers.filter(x => x !== null).length;
    const p = $('#prog', frame);
    if (p) p.textContent = `${n} / ${drills.length}`;
  }

  function mark() {
    let right = 0;
    drills.forEach((d, qi) => {
      const block = $(`.qblock[data-qi="${qi}"]`, frame);
      let ok;
      if (d.type === 'choice') {
        ok = answers[qi] === d.answer;
        $$('.opt', block).forEach(b => {
          const oi = Number(b.dataset.oi);
          b.disabled = true;
          b.dataset.state = oi === d.answer ? 'right' : oi === answers[qi] ? 'wrong' : 'muted';
        });
      } else {
        ok = normalise(answers[qi]) === normalise(d.answer);
        const inp = $(`[data-act="type"][data-qi="${qi}"]`, block);
        if (inp) { inp.readOnly = true; inp.style.borderColor = ok ? 'var(--vert)' : 'var(--rouge)'; }
      }
      if (ok) right += 1;
      block.querySelector('.qwhy').innerHTML = `
        <div class="verdict" data-ok="${ok ? 1 : 0}">
          <b>${ok ? 'Juste.' : `Réponse : ${esc(d.type === 'choice' ? d.options[d.answer] : d.answer)}`}</b>
          <p>${esc(d.note)}</p>
        </div>`;
    });

    const pct = Math.round((right / drills.length) * 100);
    store.saveLesson(lesson.id, right, drills.length);
    store.logMinutes(12);

    try {
      const raw = sessionStorage.getItem('atelier.block');
      if (raw) {
        store.completeBlock(JSON.parse(raw).id, 0);
        sessionStorage.removeItem('atelier.block');
      }
    } catch {}

    if (pct >= 70) fx.celebrate(`${pct} %`); else fx.sndWrong();

    $('#footer', frame).remove();
    $('#result', frame).innerHTML = `
      <hr class="hair">
      <div class="score">
        <div class="score__n u-num">${right} / ${drills.length}</div>
        <p class="score__l">${pct >= 70
          ? 'Leçon validée. Elle compte maintenant dans ton niveau.'
          : 'Sous 70 % : la leçon ne compte pas encore. Relis la règle et refais la série — c’est le but, pas une sanction.'}</p>
        <span class="score__band u-ui u-num">${pct} %</span>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="retry">Refaire</button>
        <button class="btn btn--ghost" data-act="back">Revoir la règle</button>
        <a class="btn btn--plain" href="#/">Retour au programme</a>
      </div>`;
    $('#result', frame).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  acts(frame, {
    say: (b) => { speech.resetCancel(); speech.say(b.dataset.fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    sayall: async () => {
      speech.resetCancel();
      await speech.sayLines(lesson.examples.map(x => ({ who: 'A', text: x.fr })),
        { rate: store.settings().rate, voiceName: store.settings().voice });
    },
    drill,
    back: learn,
    retry: () => { answers.fill(null); drill(); },
    mark,
    pick: (b) => {
      const qi = Number(b.dataset.qi), oi = Number(b.dataset.oi);
      answers[qi] = oi;
      $$(`.opt[data-qi="${qi}"]`, frame).forEach(x => {
        x.dataset.state = Number(x.dataset.oi) === oi ? 'chosen' : '';
      });
      updateProgress();
    },
  });

  learn();
  return () => speech.stopAll();
}
