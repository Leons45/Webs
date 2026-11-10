// Speaking. Five modes, one shared recorder. Everything here logs seconds
// spoken, because that is the number the whole programme is built on.

import { esc, acts, $, $$, mmss, icon, pick, shuffle, countdown, stopwatch, toast } from '../ui.js';
import { hide, bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import * as srs from '../srs.js';
import * as fx from '../fx.js';
import { SHADOW, QUESTION_DRILL, QUICK, SECTION_A, SECTION_B, MONOLOGUE } from '../data/speaking.js';
import { currentWeek } from '../plan.js';

/* Mark the programme block done, if we arrived from the timetable. */
function finishBlock() {
  try {
    const raw = sessionStorage.getItem('atelier.block');
    if (!raw) { fx.sndDone(); return; }
    const { id, min } = JSON.parse(raw);
    store.completeBlock(id, 0);
    sessionStorage.removeItem('atelier.block');
    fx.celebrate('Bloc fait');
    toast(`Bloc terminé · ${min} min`);
  } catch { fx.sndDone(); }
}

export default function parler(el, { params, go }) {
  const mode = params.get('mode');
  const run = {
    shadow: shadowMode,
    questions: questionMode,
    quick: quickMode,
    sectionA: sectionAMode,
    sectionB: sectionBMode,
    monologue: monologueMode,
  }[mode];
  return run ? run(el, go) : hub(el);
}

/* ── hub ───────────────────────────────────────────────────────── */

function hub(el) {
  const a = store.assist();
  const { weekMinutes, allMinutes } = store.speakingTotals();
  const MODES = [
    { m:'shadow',    fr:'Shadowing',          en:'Shadowing',        d:'Tu écoutes une phrase, tu la répètes aussitôt, tu compares. Le chemin le plus court entre « je comprends » et « je sais dire ».', dEn:'Hear a sentence, repeat it immediately, compare. The shortest route from understanding to producing.' },
    { m:'questions', fr:'Questions éclair',   en:'Rapid questions',  d:'Tu vois l’anglais, tu dis la question en français. C’est exactement la compétence de la Section A.', dEn:'See the English, say the French question. This is precisely the Section A skill.' },
    { m:'quick',     fr:'Réponses rapides',   en:'Quick answers',    d:'Une question, trente secondes, sans préparation. C’est ici que l’hésitation se travaille.', dEn:'One question, thirty seconds, no prep. This is where hesitation gets trained out.' },
    { m:'sectionA',  fr:'Simulation Section A',en:'Section A',       d:'Cinq minutes chronométrées. Tu poses des questions ; tu ne donnes jamais ton avis.', dEn:'Five timed minutes. You ask questions; you never give an opinion.' },
    { m:'sectionB',  fr:'Simulation Section B',en:'Section B',       d:'Dix minutes. L’examinateur t’objecte à voix haute et tu dois répondre sur le moment.', dEn:'Ten minutes. The examiner objects aloud and you must respond on the spot.' },
    { m:'monologue', fr:'Monologue 60 s',     en:'60-second monologue', d:'Un sujet, une minute, sans notes. L’objectif n’est pas d’être brillant : c’est de ne pas s’arrêter.', dEn:'One topic, one minute, no notes. The aim isn’t brilliance, it’s not stopping.' },
  ];

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Parler${a ? '<span class="gloss" style="font-size:var(--t-base)">Speaking</span>' : ''}</h1>
      <p class="ph__sub">Presque la moitié de ton temps d’étude passe ici, et c’est volontaire.
        À A2, la compréhension progresse toute seule avec l’exposition ; la production, non.
        ${a ? '<span class="gloss">Nearly half your study time goes here, deliberately. At A2, comprehension improves on its own from exposure. Production does not.</span>' : ''}</p>
    </div>

    <div class="grid2" style="margin-bottom:1.75rem">
      <div class="meter">
        <div class="meter__row"><span class="meter__n">${weekMinutes}</span>
          <span class="meter__unit">min cette semaine${a ? ' · this week' : ''}</span></div>
      </div>
      <div class="meter">
        <div class="meter__row"><span class="meter__n">${(allMinutes / 60).toFixed(1)}</span>
          <span class="meter__unit">h au total${a ? ' · total hours spoken' : ''}</span></div>
      </div>
    </div>

    <div class="grid2">
      ${MODES.map(x => `
        <a class="sheet" href="#/parler?mode=${x.m}" style="text-decoration:none;display:grid;gap:.5rem">
          <b style="font:500 var(--t-md)/1.25 var(--ff-text)">${esc(x.fr)}</b>
          <span style="font-size:var(--t-sm);line-height:1.55;color:var(--ink-soft)">
            ${esc(x.d)}${a ? `<span class="gloss">${esc(x.dEn)}</span>` : ''}</span>
        </a>`).join('')}
    </div>
  </div>`;
}

/* ── a reusable recorder panel ─────────────────────────────────── */
/**
 * Renders a mic block into `mount` and returns handles.
 * onDone(url, seconds) fires when the user stops.
 */
function recorderPanel(mount, { label = 'Appuie et parle', max = 0, onDone, autoStart = false }) {
  let rec = null, url = null, watch = null, stopTimer = null, running = false;
  let killWave = null;

  mount.innerHTML = `
    <div class="mic">
      <button class="mic__btn" data-act="rec" aria-label="Enregistrer">${icon.mic}</button>
      <span class="mic__time u-num" id="micT">0:00</span>
      <canvas class="wave" id="micWave" hidden aria-hidden="true"></canvas>
      <span class="mic__label" id="micL">${esc(label)}</span>
    </div>
    <div id="micOut"></div>`;

  const btn = $('[data-act="rec"]', mount);
  const tEl = $('#micT', mount);
  const lEl = $('#micL', mount);
  const wave = $('#micWave', mount);

  async function start() {
    if (running) return;
    running = true;
    btn.dataset.on = '1';
    btn.innerHTML = icon.stop;
    lEl.textContent = 'Parle… appuie pour arrêter';
    fx.sndStart();
    try {
      rec = await speech.recorder();
      rec.start();
      // The waveform is the proof that the mic is live — without it the
      // whole speaking practice feels like talking into a dead form.
      wave.hidden = false;
      killWave = fx.waveform(wave, rec.stream);
    } catch {
      rec = null;
      lEl.textContent = 'Micro indisponible — le chronomètre tourne quand même';
    }
    watch = stopwatch((s) => { tEl.textContent = mmss(s); });
    if (max) stopTimer = setTimeout(stop, max * 1000);
  }

  async function stop() {
    if (!running) return;
    running = false;
    clearTimeout(stopTimer);
    btn.dataset.on = '0';
    btn.innerHTML = icon.mic;
    if (killWave) { killWave(); killWave = null; }
    wave.hidden = true;
    const seconds = watch ? watch.elapsed() : 0;
    if (watch) watch.stop();
    if (rec) { try { url = await rec.stop(); } catch {} rec = null; }
    lEl.textContent = 'Réécoute-toi, puis continue';
    if (url) {
      $('#micOut', mount).innerHTML = `<audio controls src="${url}" style="margin-top:.9rem"></audio>`;
    }
    onDone && onDone(url, seconds);
  }

  btn.addEventListener('click', () => (running ? stop() : start()));
  if (autoStart) start();

  return {
    stop,
    isRunning: () => running,
    cleanup: () => {
      clearTimeout(stopTimer);
      if (killWave) killWave();
      if (watch) watch.stop();
      if (rec) { try { rec.stop(); } catch {} }
      if (url) URL.revokeObjectURL(url);
    },
  };
}

const head = (fr, en, back = '#/parler') => `
  <div class="row row--split" style="margin-bottom:1.25rem">
    <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
      ${esc(fr)}${store.assist() ? ` · ${esc(en)}` : ''}</span>
    <a class="btn btn--plain" href="${back}">Quitter</a>
  </div>`;

/* ── 1. Shadowing ──────────────────────────────────────────────── */

function shadowMode(el, go) {
  const week = currentWeek();
  const levelPref = week.level === 'A2' ? ['A2', 'B1'] : week.level === 'B1' ? ['A2', 'B1', 'B2'] : ['B1', 'B2'];
  const pool = srs.queue(SHADOW.filter(s => levelPref.includes(s.level)), 12);
  const list = pool.length ? pool : shuffle(SHADOW).slice(0, 12);

  let i = 0, spoken = 0, panel = null;
  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= list.length) return done();
    const item = list[i];
    const a = store.assist();

    frame.innerHTML = `${head('Shadowing', 'Shadowing')}
      <div class="say">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
          ${i + 1} / ${list.length} · niveau ${item.level}</span>
        <p class="say__cue">${esc(item.fr)}</p>
        ${a ? `<p class="gloss" style="font-size:var(--t-sm);max-width:34ch">${esc(item.en)}</p>`
            : hide(item.en, 'voir l’anglais')}
        <div class="row" style="justify-content:center">
          <button class="btn btn--ghost" data-act="listen">Écouter${a ? ' · Listen' : ''}</button>
          <button class="btn btn--plain" data-act="slow">Au ralenti</button>
        </div>
      </div>
      <div id="mic" style="margin-top:1.25rem"></div>
      <div class="row" style="margin-top:1.25rem">
        <button class="btn" data-act="next">Suivant${a ? ' · Next' : ''}</button>
        <button class="btn btn--ghost" data-act="hard">À refaire</button>
      </div>
      <p style="margin-top:1.25rem;font-size:var(--t-sm);color:var(--ink-soft);max-width:54ch">
        Écoute une fois, répète immédiatement sans lire, puis réécoute-toi.
        Ce que tu cherches n’est pas la perfection : c’est le rythme et la liaison.
        ${a ? '<span class="gloss">Listen once, repeat at once without reading, then listen back. You’re after rhythm and liaison, not perfection.</span>' : ''}
      </p>`;

    bindPeeks(frame);
    if (panel) panel.cleanup();
    panel = recorderPanel($('#mic', frame), {
      label: 'Appuie, répète la phrase',
      max: 30,
      onDone: (url, s) => { spoken += s; store.logSpeaking(s, { mode: 'shadow', id: item.id }); },
    });
  }

  function advance(grade) {
    const item = list[i];
    srs.grade(item.id, grade, ['shadowing']);
    grade >= 2 ? fx.sndRight() : fx.sndWrong();
    i += 1;
    draw();
  }

  function done() {
    if (panel) panel.cleanup();
    finishBlock();
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${Math.round(spoken / 60)} min</div>
        <p class="score__l">de parole produite dans cette série.
          ${store.assist() ? '<span class="gloss">of speech produced in this set.</span>' : ''}</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Une autre série</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
  }

  acts(frame, {
    listen: () => { speech.resetCancel(); speech.say(list[i].fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    slow:   () => { speech.resetCancel(); speech.say(list[i].fr, { rate: 0.65, voiceName: store.settings().voice }); },
    next:   () => advance(2),
    hard:   () => advance(0),
    again:  () => go('#/parler?mode=shadow'),
  });

  draw();
  return () => { if (panel) panel.cleanup(); speech.stopAll(); };
}

/* ── 2. Rapid questions (Section A skill) ──────────────────────── */

function questionMode(el, go) {
  const list = srs.queue(QUESTION_DRILL, 15);
  const items = list.length ? list : shuffle(QUESTION_DRILL).slice(0, 15);
  let i = 0, shown = false, spoken = 0, panel = null;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= items.length) return done();
    const q = items[i];
    shown = false;

    frame.innerHTML = `${head('Questions éclair', 'Rapid questions')}
      <div class="say">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">${i + 1} / ${items.length}</span>
        <p class="say__cue say__cue--en">${esc(q.en)}</p>
        <p style="font-size:var(--t-sm);color:var(--ink-faint);max-width:30ch">
          Dis la question en français, à voix haute, maintenant.</p>
      </div>
      <div id="mic" style="margin-top:1.25rem"></div>
      <div class="row" style="margin-top:1.25rem">
        <button class="btn" data-act="reveal">Voir le modèle</button>
      </div>
      <div id="model"></div>`;

    if (panel) panel.cleanup();
    panel = recorderPanel($('#mic', frame), {
      label: 'Appuie et dis la question',
      max: 20,
      onDone: (url, s) => { spoken += s; store.logSpeaking(s, { mode: 'questions', id: q.id }); },
    });
  }

  function reveal() {
    if (shown) return;
    shown = true;
    const q = items[i];
    speech.resetCancel();
    speech.say(q.fr, { rate: store.settings().rate, voiceName: store.settings().voice });
    $('#model', frame).innerHTML = `
      <div class="say" style="margin-top:1.25rem">
        <p class="say__model">${esc(q.fr)}</p>
        ${q.alt ? `<p class="say__alt">Ou : ${esc(q.alt)}</p>` : ''}
        <button class="btn btn--plain" data-act="replay">Réécouter</button>
      </div>
      <p style="margin:1.25rem 0 .75rem;font-size:var(--t-sm);color:var(--ink-soft)">
        Compare avec ce que tu viens de dire, puis note-toi honnêtement.</p>
      <div class="grades">
        <button class="grade" data-act="g" data-g="0"><b>Rien dit</b><small>revient vite</small></button>
        <button class="grade" data-act="g" data-g="1"><b>Approchant</b><small>court délai</small></button>
        <button class="grade" data-act="g" data-g="2"><b>Juste</b><small>normal</small></button>
        <button class="grade" data-act="g" data-g="3"><b>Immédiat</b><small>long délai</small></button>
      </div>`;
  }

  function done() {
    if (panel) panel.cleanup();
    finishBlock();
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${items.length}</div>
        <p class="score__l">questions produites à voix haute.
          En Section A, l’examinateur compte le nombre de questions distinctes et bien formées.
          ${store.assist() ? '<span class="gloss">questions produced aloud. In Section A the examiner counts how many distinct, well-formed questions you produce.</span>' : ''}</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Encore</button>
        <a class="btn btn--ghost" href="#/parler?mode=sectionA">Passer à la simulation</a>
      </div>`;
  }

  acts(frame, {
    reveal,
    replay: () => { speech.resetCancel(); speech.say(items[i].fr, { rate: store.settings().rate, voiceName: store.settings().voice }); },
    g: (b) => {
      const g = Number(b.dataset.g);
      srs.grade(items[i].id, g, ['questions']);
      g >= 2 ? fx.sndRight() : fx.sndWrong();
      i += 1; draw();
    },
    again: () => go('#/parler?mode=questions'),
  });

  draw();
  return () => { if (panel) panel.cleanup(); speech.stopAll(); };
}

/* ── 3. Quick answers ──────────────────────────────────────────── */

function quickMode(el, go) {
  const items = shuffle(QUICK).slice(0, 8);
  let i = 0, spoken = 0, panel = null;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    if (i >= items.length) return done();
    const q = items[i];
    const a = store.assist();

    frame.innerHTML = `${head('Réponses rapides', 'Quick answers')}
      <div class="say">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">${i + 1} / ${items.length}</span>
        <p class="say__cue">${esc(q.fr)}</p>
        ${a ? `<p class="gloss" style="font-size:var(--t-sm)">${esc(q.en)}</p>` : hide(q.en, 'anglais')}
        <p style="font-size:var(--t-sm);color:var(--ink-faint);max-width:32ch">
          Trente secondes. Pas de préparation, pas de notes. Si tu bloques, reformule à voix haute.</p>
      </div>
      <div id="mic" style="margin-top:1.25rem"></div>
      <div class="row" style="margin-top:1.25rem">
        <button class="btn" data-act="next">Question suivante</button>
      </div>`;

    bindPeeks(frame);
    if (panel) panel.cleanup();
    panel = recorderPanel($('#mic', frame), {
      label: 'Appuie et réponds',
      max: 45,
      onDone: (url, s) => { spoken += s; store.logSpeaking(s, { mode: 'quick', id: q.id }); },
    });
  }

  function done() {
    if (panel) panel.cleanup();
    finishBlock();
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${Math.round(spoken / 60)} min</div>
        <p class="score__l">de parole spontanée. C’est le format le plus proche de ce que
          l’examinateur te demandera sans prévenir.</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Encore</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
  }

  acts(frame, { next: () => { i += 1; draw(); }, again: () => go('#/parler?mode=quick') });
  draw();
  return () => { if (panel) panel.cleanup(); speech.stopAll(); };
}

/* ── 4. Section A simulation ───────────────────────────────────── */

function sectionAMode(el, go) {
  const task = pick(SECTION_A);
  const a = store.assist();
  const covered = new Set();
  let panel = null, stopClock = null, started = false;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  frame.innerHTML = `${head('Simulation — Section A', 'Section A simulation')}
    <div class="ph" style="margin-bottom:1.25rem">
      <h1 style="font-size:var(--t-xl)">${esc(task.title)}
        ${a ? `<span class="gloss" style="font-size:var(--t-sm)">${esc(task.titleEn)}</span>` : ''}</h1>
      <p class="ph__sub">Cinq minutes. Tu poses des questions pour obtenir un maximum d’informations.
        Tu ne donnes aucun avis — une seule opinion et la tâche est manquée.
        ${a ? '<span class="gloss">Five minutes. You ask questions to extract as much information as possible. You give no opinions — one opinion and the task is failed.</span>' : ''}</p>
    </div>

    <div class="passage prose" style="max-width:52ch">
      <p style="margin:0;font-style:italic">${esc(task.doc)}</p>
      ${a ? `<p class="gloss" style="margin:.6rem 0 0">${esc(task.docEn)}</p>` : ''}
    </div>

    <div class="grid2" style="margin-top:1.5rem;align-items:start">
      <div>
        <h2 style="font-size:var(--t-base);margin-bottom:.6rem">À couvrir
          ${a ? '<span class="gloss">To cover</span>' : ''}</h2>
        <div class="musts">
          ${task.musts.map((m, k) => `
            <button class="must" data-act="must" data-k="${k}" data-on="0">
              <span class="must__box"></span>
              <span>${esc(m.fr)}${a ? `<span class="gloss">${esc(m.en)}</span>` : ''}</span>
            </button>`).join('')}
        </div>
        <p style="margin-top:.75rem;font-size:var(--t-xs);color:var(--ink-faint)">
          Coche au fur et à mesure que tu poses la question.</p>
      </div>
      <div>
        <div class="score" style="padding:1.5rem 1rem">
          <div class="timer" id="clock" style="font-size:var(--t-2xl)">
            <span class="u-num" id="t">${mmss(task.minutes * 60)}</span></div>
          <p class="score__l" style="font-size:var(--t-sm)">temps restant</p>
        </div>
        <div id="mic" style="margin-top:1rem"></div>
      </div>
    </div>

    <div id="after"></div>`;

  panel = recorderPanel($('#mic', frame), {
    label: 'Appuie pour commencer les 5 minutes',
    max: task.minutes * 60 + 15,
    onDone: (url, s) => {
      if (stopClock) { stopClock(); stopClock = null; }
      store.logSpeaking(s, { mode: 'sectionA', id: task.id });
      review(s);
    },
  });

  // Start the countdown the moment recording starts.
  $('[data-act="rec"]', frame).addEventListener('click', () => {
    if (started) return;
    started = true;
    stopClock = countdown(task.minutes * 60, (s) => {
      const t = $('#t', frame); if (t) t.textContent = mmss(s);
      if (s <= 60) { const c = $('#clock', frame); if (c) c.dataset.low = '1'; }
    }, () => { if (panel.isRunning()) panel.stop(); });
  }, { once: true });

  function review(seconds) {
    finishBlock();
    const missed = task.musts.filter((_, k) => !covered.has(k));
    $('#after', frame).innerHTML = `
      <hr class="hair">
      <div class="score">
        <div class="score__n u-num">${covered.size} / ${task.musts.length}</div>
        <p class="score__l">points couverts en ${mmss(seconds)}.
          ${missed.length
            ? `Non demandé : ${missed.map(m => esc(m.fr)).join(', ')}.`
            : 'Tout a été demandé — c’est exactement ce qu’attend l’examinateur.'}</p>
      </div>
      <div class="sheet" style="margin-top:1.25rem">
        <b style="font:500 var(--t-base)/1.3 var(--ff-text)">En te réécoutant, compte :</b>
        <ul style="margin:.7rem 0 0;padding-left:1.1rem;font-size:var(--t-sm);line-height:1.8;color:var(--ink-soft)">
          <li>combien de questions différentes tu as posées${a ? '<span class="gloss">how many different questions you asked</span>' : ''}</li>
          <li>combien commencent par « est-ce que » (si c’est plus de la moitié, varie)${a ? '<span class="gloss">how many start with "est-ce que" — if more than half, vary them</span>' : ''}</li>
          <li>combien de fois tu t’es arrêté plus de trois secondes${a ? '<span class="gloss">how often you stopped for more than three seconds</span>' : ''}</li>
          <li>si tu as dit une opinion (c’est hors tâche)${a ? '<span class="gloss">whether you gave an opinion — that is off-task</span>' : ''}</li>
        </ul>
      </div>
      <div class="row" style="margin-top:1.5rem">
        <button class="btn" data-act="again">Un autre sujet</button>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
    $('#after', frame).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  acts(frame, {
    must: (b) => {
      const k = Number(b.dataset.k);
      if (covered.has(k)) { covered.delete(k); b.dataset.on = '0'; }
      else { covered.add(k); b.dataset.on = '1'; }
    },
    again: () => go('#/parler?mode=sectionA'),
  });

  return () => { if (panel) panel.cleanup(); if (stopClock) stopClock(); speech.stopAll(); };
}

/* ── 5. Section B simulation, with spoken objections ───────────── */

function sectionBMode(el, go) {
  const task = pick(SECTION_B);
  const a = store.assist();
  let panel = null, stopClock = null, started = false;
  let objIndex = 0;
  const timers = [];

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  frame.innerHTML = `${head('Simulation — Section B', 'Section B simulation')}
    <div class="ph" style="margin-bottom:1.25rem">
      <h1 style="font-size:var(--t-xl)">${esc(task.title)}
        ${a ? `<span class="gloss" style="font-size:var(--t-sm)">${esc(task.titleEn)}</span>` : ''}</h1>
      <p class="ph__sub">${esc(task.task)}
        ${a ? `<span class="gloss">${esc(task.taskEn)}</span>` : ''}</p>
    </div>

    <div class="why" style="margin-bottom:1.5rem">
      L’examinateur va t’objecter cinq fois, à voix haute, pendant que tu parles.
      Ne récite pas un discours : concède d’abord, puis retourne l’objection.
      Et termine en demandant une réponse — beaucoup de candidats oublient de conclure.
      ${a ? '<span class="gloss">The examiner will object five times, aloud, while you speak. Don’t recite a speech: concede first, then turn the objection around. And finish by asking for a decision — many candidates forget to close.</span>' : ''}
    </div>

    <div class="grid2" style="align-items:start">
      <div>
        <div id="objections"><div class="empty">Les objections apparaîtront ici.</div></div>
      </div>
      <div>
        <div class="score" style="padding:1.5rem 1rem">
          <div class="timer" id="clock" style="font-size:var(--t-2xl)">
            <span class="u-num" id="t">${mmss(task.minutes * 60)}</span></div>
          <p class="score__l" style="font-size:var(--t-sm)">temps restant</p>
        </div>
        <div id="mic" style="margin-top:1rem"></div>
      </div>
    </div>

    <div id="after"></div>`;

  panel = recorderPanel($('#mic', frame), {
    label: 'Appuie pour commencer les 10 minutes',
    max: task.minutes * 60 + 15,
    onDone: (url, s) => {
      if (stopClock) { stopClock(); stopClock = null; }
      timers.forEach(clearTimeout);
      store.logSpeaking(s, { mode: 'sectionB', id: task.id });
      review(s);
    },
  });

  function showObjection() {
    const o = task.objections[objIndex];
    if (!o) return;
    objIndex += 1;
    speech.resetCancel();
    speech.say(o.fr, { rate: store.settings().rate, voiceName: store.settings().voice, pitch: 1.12 });
    const box = $('#objections', frame);
    if (box.querySelector('.empty')) box.innerHTML = '';
    box.insertAdjacentHTML('afterbegin', `
      <div class="objection" style="margin-bottom:.75rem">
        <span class="objection__who">L’examinateur · objection ${objIndex}</span>
        <span class="objection__fr">${esc(o.fr)}</span>
        ${a ? `<span class="objection__en">${esc(o.en)}</span>` : ''}
      </div>`);
  }

  $('[data-act="rec"]', frame).addEventListener('click', () => {
    if (started) return;
    started = true;
    const total = task.minutes * 60;
    // Spread the five objections across the task, first one after 75 s.
    task.objections.forEach((_, k) => {
      timers.push(setTimeout(showObjection, (75 + k * ((total - 120) / task.objections.length)) * 1000));
    });
    stopClock = countdown(total, (s) => {
      const t = $('#t', frame); if (t) t.textContent = mmss(s);
      if (s <= 60) { const c = $('#clock', frame); if (c) c.dataset.low = '1'; }
    }, () => { if (panel.isRunning()) panel.stop(); });
  }, { once: true });

  function review(seconds) {
    finishBlock();
    $('#after', frame).innerHTML = `
      <hr class="hair">
      <div class="score">
        <div class="score__n u-num">${mmss(seconds)}</div>
        <p class="score__l">de parole argumentée, face à ${objIndex} objection${objIndex > 1 ? 's' : ''}.</p>
      </div>
      <div class="sheet" style="margin-top:1.25rem">
        <b style="font:500 var(--t-base)/1.3 var(--ff-text)">En te réécoutant, vérifie :</b>
        <ul style="margin:.7rem 0 0;padding-left:1.1rem;font-size:var(--t-sm);line-height:1.8;color:var(--ink-soft)">
          <li>as-tu concédé avant de contredire, à chaque objection ?${a ? '<span class="gloss">did you concede before contradicting, each time?</span>' : ''}</li>
          <li>as-tu donné au moins un exemple concret ?${a ? '<span class="gloss">did you give at least one concrete example?</span>' : ''}</li>
          <li>as-tu posé une question à ton interlocuteur ?${a ? '<span class="gloss">did you ask your interlocutor a question?</span>' : ''}</li>
          <li>as-tu proposé un compromis ou un essai limité ?${a ? '<span class="gloss">did you offer a compromise or a limited trial?</span>' : ''}</li>
          <li>as-tu demandé une décision à la fin ?${a ? '<span class="gloss">did you ask for a decision at the end?</span>' : ''}</li>
        </ul>
      </div>
      <div class="row" style="margin-top:1.5rem">
        <button class="btn" data-act="again">Un autre sujet</button>
        <a class="btn btn--ghost" href="#/phrases?group=argumenterB">Revoir les formules</a>
      </div>`;
    $('#after', frame).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  acts(frame, { again: () => go('#/parler?mode=sectionB') });

  return () => {
    if (panel) panel.cleanup();
    if (stopClock) stopClock();
    timers.forEach(clearTimeout);
    speech.stopAll();
  };
}

/* ── 6. Monologue ──────────────────────────────────────────────── */

function monologueMode(el, go) {
  let topic = pick(MONOLOGUE);
  let panel = null, spoken = 0, rounds = 0;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function draw() {
    const a = store.assist();
    frame.innerHTML = `${head('Monologue 60 secondes', '60-second monologue')}
      <div class="say">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
          une minute · sans préparation${rounds ? ` · ${rounds} fait${rounds > 1 ? 's' : ''}` : ''}</span>
        <p class="say__cue">${esc(topic.fr)}</p>
        ${a ? `<p class="gloss" style="font-size:var(--t-sm)">${esc(topic.en)}</p>` : hide(topic.en, 'anglais')}
        <p class="say__use">
          L’objectif n’est pas d’être brillant, c’est de ne pas s’arrêter. Si le mot manque,
          dis « comment dire… » ou « c’est quelque chose comme… » et continue.
          ${a ? '<span class="gloss">The aim is not brilliance, it is not stopping. If a word is missing, say "comment dire…" and keep going.</span>' : ''}
        </p>
      </div>
      <div id="mic" style="margin-top:1.25rem"></div>
      <div class="row" style="margin-top:1.25rem">
        <button class="btn" data-act="new">Autre sujet</button>
        <a class="btn btn--ghost" href="#/">Terminer</a>
      </div>`;

    bindPeeks(frame);
    if (panel) panel.cleanup();
    panel = recorderPanel($('#mic', frame), {
      label: 'Appuie et parle une minute',
      max: 75,
      onDone: (url, s) => {
        spoken += s; rounds += 1;
        store.logSpeaking(s, { mode: 'monologue', topic: topic.fr });
        if (rounds >= 3) finishBlock();
      },
    });
  }

  acts(frame, { new: () => { topic = pick(MONOLOGUE); draw(); } });
  draw();
  return () => { if (panel) panel.cleanup(); speech.stopAll(); };
}
