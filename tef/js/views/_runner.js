// The card session, shared by Réviser and Atelier.

import { esc, acts, $, LETTERS, shuffle } from '../ui.js';
import * as srs from '../srs.js';
import { TAGS } from '../data/cards.js';

/** Apostrophes and spacing are forgiven; accents are not — they are the point. */
export const normalise = (s) => String(s || '')
  .trim().toLowerCase()
  .replace(/[’‘`´]/g, "'")
  .replace(/\s+/g, ' ')
  .replace(/[.,;!?]+$/, '');

export function runner(el, cards, { title, subtitle, onFinish } = {}) {
  if (!cards.length) {
    el.innerHTML = `<div class="view">
      <div class="ph"><h1>${esc(title || 'Session')}</h1></div>
      <div class="empty">Rien à réviser pour le moment. Les cartes reviennent à leur échéance.</div>
      <div class="row" style="margin-top:1.25rem"><a class="btn btn--ghost" href="#/">Retour</a></div>
    </div>`;
    return;
  }

  let queue = [...cards];
  let i = 0;
  let right = 0, answered = 0;
  let revealed = false;
  let chosen = null;

  const frame = document.createElement('div');
  frame.className = 'view';
  el.appendChild(frame);

  function finish() {
    frame.innerHTML = `
      <div class="score">
        <div class="score__n u-num">${right} / ${answered}</div>
        <p class="score__l">${verdictLine(right / Math.max(1, answered))}</p>
      </div>
      <div class="row" style="margin-top:1.5rem;justify-content:center">
        <button class="btn" data-act="again">Une autre série</button>
        <a class="btn btn--ghost" href="#/">Retour à aujourd’hui</a>
      </div>`;
    acts(frame, { again: () => onFinish ? onFinish() : location.reload() });
  }

  function draw() {
    if (i >= queue.length) return finish();
    const card = queue[i];
    revealed = false;
    chosen = null;

    const tagLabel = card.tags.map(t => TAGS[t]?.label || t).join(' · ');
    const head = `
      <span class="card__tag u-ui">${esc(tagLabel)}</span>
      <span class="card__count u-ui u-num">${i + 1} / ${queue.length}</span>`;

    let body = '';
    if (card.type === 'choice') {
      const opts = card._order || (card._order = shuffle(card.options.map((text, idx) => ({ text, idx }))));
      body = `
        <p class="card__prompt">${esc(card.prompt)}</p>
        <div class="opts">${opts.map((o, k) => `
          <button class="opt" data-act="choose" data-i="${o.idx}">
            <span class="opt__k">${LETTERS[k]}</span><span>${esc(o.text)}</span>
          </button>`).join('')}</div>`;
    } else if (card.type === 'cloze') {
      body = `
        <p class="card__prompt">${esc(card.prompt)}</p>
        <form class="opts" data-act="submit-form" style="gap:.6rem">
          <input class="input" id="clz" autocomplete="off" autocapitalize="off" spellcheck="false"
                 placeholder="Écris la forme manquante" style="text-align:center;font-family:var(--ff-text);font-size:var(--t-base)">
          <button class="btn" type="submit">Vérifier</button>
        </form>
        <p class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">Les accents comptent.</p>`;
    } else {
      body = `
        <p class="card__prompt">${esc(card.prompt)}</p>
        <button class="btn btn--ghost" data-act="flip">Voir la réponse</button>`;
    }

    frame.innerHTML = `
      <div class="ph" style="margin-bottom:1.25rem">
        <div class="row row--split">
          <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">${esc(subtitle || title || '')}</span>
          <a class="btn btn--plain" href="#/">Quitter</a>
        </div>
      </div>
      <div class="card" id="card">${head}${body}</div>
      <div id="after" style="margin-top:1.25rem"></div>`;

    // The form element is recreated each draw, so this listener is not shared.
    const form = frame.querySelector('[data-act="submit-form"]');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      resolveCloze(queue[i], $('#clz', frame).value);
    });

    const inp = $('#clz', frame);
    if (inp) inp.focus();
  }

  // Bound once. Handlers read the live card so no stale closure can build up.
  acts(frame, {
    flip:   () => revealRecall(queue[i]),
    choose: (btn) => resolveChoice(queue[i], Number(btn.dataset.i)),
    next:   () => { i += 1; draw(); },
    grade:  (btn) => { srs.grade(queue[i], Number(btn.dataset.g)); i += 1; draw(); },
  });

  function revealRecall(card) {
    if (revealed) return;
    revealed = true;
    const c = $('#card', frame);
    c.querySelector('[data-act="flip"]')?.remove();
    c.insertAdjacentHTML('beforeend', `
      <div class="reveal" style="display:grid;gap:1.25rem;justify-items:center">
        <p class="card__answer">${esc(card.answer)}</p>
        ${card.note ? `<p class="card__note">${esc(card.note)}</p>` : ''}
      </div>`);
    $('#after', frame).innerHTML = `
      <div class="grades">
        <button class="grade" data-act="grade" data-g="0"><b>À revoir</b><small>6 min</small></button>
        <button class="grade" data-act="grade" data-g="1"><b>Difficile</b><small>court</small></button>
        <button class="grade" data-act="grade" data-g="2"><b>Correct</b><small>normal</small></button>
        <button class="grade" data-act="grade" data-g="3"><b>Facile</b><small>long</small></button>
      </div>`;
  }

  function resolveChoice(card, idx) {
    if (chosen !== null) return;
    chosen = idx;
    const ok = idx === card.answer;
    answered += 1; if (ok) right += 1;

    frame.querySelectorAll('.opt').forEach(b => {
      const bi = Number(b.dataset.i);
      b.disabled = true;
      b.dataset.state = bi === card.answer ? 'right' : bi === idx ? 'wrong' : 'muted';
    });
    showVerdict(card, ok, ok ? 'Juste.' : `Réponse : ${card.options[card.answer]}`);
    srs.grade(card, ok ? 2 : 0);
  }

  function resolveCloze(card, value) {
    if (chosen !== null) return;
    chosen = value;
    const ok = normalise(value) === normalise(card.answer);
    answered += 1; if (ok) right += 1;

    const form = frame.querySelector('[data-act="submit-form"]');
    if (form) form.remove();
    const c = $('#card', frame);
    c.insertAdjacentHTML('beforeend', `
      <div class="reveal" style="display:grid;gap:.6rem;justify-items:center">
        ${!ok && value.trim() ? `<p class="u-ui" style="font-size:var(--t-sm);color:var(--rouge)">Tu as écrit : ${esc(value)}</p>` : ''}
        <p class="card__display">${esc(card.display || card.answer)}</p>
      </div>`);
    showVerdict(card, ok, ok ? 'Juste.' : 'Pas encore.');
    srs.grade(card, ok ? 2 : 0);
  }

  function showVerdict(card, ok, headline) {
    $('#after', frame).innerHTML = `
      <div class="verdict" data-ok="${ok ? 1 : 0}">
        <b>${esc(headline)}</b>
        ${card.note ? `<p>${esc(card.note)}</p>` : ''}
      </div>
      <div class="row" style="margin-top:1rem">
        <button class="btn" data-act="next" autofocus>Continuer</button>
      </div>`;
    $('#after [data-act="next"]', frame)?.focus();
  }

  draw();

  const onKey = (e) => {
    if (e.target.tagName === 'INPUT') return;
    const card = queue[i];
    if (!card) return;
    if (e.key === ' ' || e.key === 'Enter') {
      const next = frame.querySelector('[data-act="next"]');
      const flip = frame.querySelector('[data-act="flip"]');
      if (next) { e.preventDefault(); next.click(); }
      else if (flip) { e.preventDefault(); flip.click(); }
    }
    if (/^[1-4]$/.test(e.key)) {
      const g = frame.querySelector(`[data-act="grade"][data-g="${Number(e.key) - 1}"]`);
      if (g) { e.preventDefault(); g.click(); }
    }
    if (/^[a-dA-D]$/.test(e.key)) {
      const k = e.key.toUpperCase().charCodeAt(0) - 65;
      const opts = frame.querySelectorAll('.opt:not([disabled])');
      if (opts[k]) { e.preventDefault(); opts[k].click(); }
    }
  };
  addEventListener('keydown', onKey);
  return () => removeEventListener('keydown', onKey);
}

function verdictLine(acc) {
  if (acc >= 0.9) return 'Série solide. Les cartes réussies reviendront plus tard, celles que tu as ratées dès aujourd’hui.';
  if (acc >= 0.7) return 'Bon rythme. Les points manqués sont replacés en tête de file pour la prochaine session.';
  if (acc >= 0.5) return 'Série difficile — c’est le signe que la file contient enfin le bon matériel. Reprends demain.';
  return 'Beaucoup d’erreurs : réduis l’objectif quotidien dans les réglages et reviens plus souvent. Mieux vaut dix cartes par jour que soixante le samedi.';
}
