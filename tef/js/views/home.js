import { esc, acts, dateLine, pct } from '../ui.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import { MODULES, profile, weakestSkill } from '../scoring.js';
import { TAGS } from '../data/cards.js';

const NUMBERS = ['aucune','une','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
  'onze','douze','treize','quatorze','quinze','seize'];
const spell = (n) => (n <= 16 ? NUMBERS[n] : String(n));

/** The day's instruction, written as a sentence rather than a dashboard. */
function instruction(pending, weak, streak) {
  if (pending === 0 && streak > 0) {
    return `La file est vide. <em>Rien ne presse</em> — reviens demain, ou choisis une épreuve ci-dessous.`;
  }
  if (pending === 0) {
    return `Rien à revoir pour l’instant. <em>Commence par une épreuve</em> et la file se remplira d’elle-même.`;
  }
  const tag = weak ? TAGS[weak.tag]?.label.toLowerCase() : null;
  const count = `<b>${pending}</b> carte${pending > 1 ? 's' : ''}`;
  const verb = pending > 1 ? 'attendent' : 'attend';
  if (tag) {
    // A colon lets the tag stand on its own, so no article has to be guessed.
    return `${count} ${verb} ce matin. Point qui résiste : <em>${esc(tag)}</em>.`;
  }
  return `${count} ${verb} ce matin. <em>Vingt minutes suffisent.</em>`;
}

export default function home(el, { go }) {
  const c = srs.counts();
  const goal = store.settings().dailyGoal;
  const pending = c.due + Math.max(0, Math.min(c.new, goal - c.due));
  const today = store.day();
  const streak = store.liveStreak();
  const weak = store.tagAccuracy().filter(t => t.acc < 0.85);
  const prof = profile(store);
  const weakest = weakestSkill(prof);
  const days = store.daysUntilExam();
  const doneToday = today.cards;
  const goalPct = Math.min(100, Math.round((doneToday / goal) * 100));

  const weeks = 10;
  const cells = store.lastDays(weeks * 7);
  const todayKey = store.today();
  const level = (n) => (n === 0 ? 0 : n < goal * 0.4 ? 1 : n < goal * 0.8 ? 2 : n < goal * 1.5 ? 3 : 4);

  el.innerHTML = `
  <div class="view">
    <section class="today">
      <div class="today__date u-ui">${esc(dateLine())}${days != null && days >= 0
        ? ` · examen dans ${days} jour${days === 1 ? '' : 's'}` : ''}</div>
      <h1 class="today__line">${instruction(pending, weak[0], streak)}</h1>
      ${doneToday > 0 ? `
        <div class="goalbar">
          <div class="goalbar__track">
            <div class="goalbar__fill ${doneToday >= goal ? 'goalbar__fill--done' : ''}" style="width:${goalPct}%"></div>
          </div>
          <div class="goalbar__meta">
            <span>${doneToday} question${doneToday > 1 ? 's' : ''} aujourd’hui</span>
            <span>objectif ${goal}</span>
          </div>
        </div>` : ''}
      <div class="today__acts">
        <button class="btn btn--lg" data-act="go-review">${pending > 0 ? 'Commencer la session' : 'Réviser quand même'}</button>
        ${weak.length ? `<button class="btn btn--ghost btn--lg" data-act="go-atelier">Atelier ciblé</button>` : ''}
      </div>
    </section>

    <hr class="hair">

    <div class="grid3">
      <div class="read">
        <span class="read__n">${streak}</span>
        <span class="read__l">jour${streak === 1 ? '' : 's'} d’affilée · record ${store.get().streak.best}</span>
      </div>
      <div class="read">
        <span class="read__n">${c.learned}<span style="color:var(--ink-faint);font-size:.55em"> / ${c.total}</span></span>
        <span class="read__l">points consolidés (plus de 21 jours)</span>
      </div>
      <div class="read">
        <span class="read__n">${weakest ? 'NCLC ' + weakest.nclc : '—'}</span>
        <span class="read__l">${weakest
          ? `niveau retenu, fixé par ${esc(weakest.short.toLowerCase())}`
          : 'fais une épreuve pour obtenir une estimation'}</span>
      </div>
    </div>

    <hr class="hair">

    <h2 style="font-size:var(--t-md);margin-bottom:.35rem">Les quatre épreuves</h2>
    <p style="color:var(--ink-soft);font-size:var(--t-sm);max-width:52ch;margin-bottom:1.25rem">
      Ton niveau retenu est celui de ta compétence la plus faible : un excellent score en lecture
      ne rattrape pas une expression orale sous le seuil. Travaille la colonne rouge en premier.
    </p>
    <div class="grid-epreuves">
      ${prof.map(p => epreuveCard(p)).join('')}
    </div>

    <hr class="hair">

    <div class="grid2" style="align-items:start">
      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:.9rem">Ce qui résiste</h2>
        ${weak.length ? `<div class="weak">${weak.slice(0, 6).map(w => `
          <div class="weakrow">
            <span class="weakrow__n">${esc(TAGS[w.tag]?.label || w.tag)}</span>
            <span class="weakrow__bar"><i style="width:${Math.round(w.acc * 100)}%" ${w.acc >= 0.85 ? 'data-ok="1"' : ''}></i></span>
            <span class="weakrow__p">${pct(w.acc)}</span>
          </div>`).join('')}</div>
          <button class="btn btn--ghost" style="margin-top:1.1rem" data-act="go-atelier">Travailler ces points</button>`
        : `<div class="empty">Réponds à une quinzaine de questions et tes points faibles apparaîtront ici,
             classés du plus fragile au plus solide.</div>`}
      </div>
      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:.9rem">Les dix dernières semaines</h2>
        <div class="cahier__wrap">
          <div class="cahier" role="img" aria-label="Régularité des dix dernières semaines">
            ${cells.map(d => `<div class="cahier__sq" data-l="${level(d.cards)}"
              ${d.key === todayKey ? 'data-today="1"' : ''}
              title="${d.key} — ${d.cards} question${d.cards === 1 ? '' : 's'}"></div>`).join('')}
          </div>
        </div>
        <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-soft)">
          Une case par jour, remplie à proportion du travail fourni.
          La régularité compte davantage que la durée : vingt minutes tous les jours
          valent mieux que trois heures le dimanche.
        </p>
      </div>
    </div>

    <hr class="hair">

    <div class="row" style="gap:.5rem">
      <a class="btn btn--ghost" href="#/dictee">Dictée</a>
      <a class="btn btn--ghost" href="#/atelier">Atelier</a>
      <a class="btn btn--ghost" href="#/progres">Progrès</a>
      <a class="btn btn--plain" href="#/reglages">Réglages</a>
    </div>
  </div>`;

  acts(el, {
    'go-review':  () => go('#/reviser'),
    'go-atelier': () => go('#/atelier'),
  });
}

const ROUTE_OF = { co: '#/ecouter', ce: '#/lire', eo: '#/parler', ee: '#/ecrire' };

function epreuveCard(p) {
  const max = MODULES[p.module].max;
  const width = p.score == null ? 0 : Math.min(100, (p.score / max) * 100);
  const targetPos = Math.min(100, (p.targetFloor / max) * 100);
  const cls = p.score == null ? '' : p.met ? 'lad__fill--met' : 'lad__fill--short';

  return `
  <a class="sheet" href="${ROUTE_OF[p.module]}" style="text-decoration:none;display:grid;gap:.9rem">
    <div class="row row--split" style="align-items:baseline">
      <b style="font:500 var(--t-base)/1.2 var(--ff-text)">${esc(p.label)}</b>
      <span class="u-ui u-num" style="font-size:var(--t-sm);color:${p.score == null ? 'var(--ink-faint)' : p.met ? 'var(--vert)' : 'var(--rouge)'}">
        ${p.score == null ? 'non évaluée' : `NCLC ${p.nclc}`}
      </span>
    </div>
    <div class="lad__track" style="height:18px">
      <div class="lad__fill ${cls}" style="width:${width}%"></div>
      <div class="lad__target" style="left:${targetPos}%" data-label=""></div>
    </div>
    <div class="row row--split u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
      <span>${p.score == null ? `objectif ${p.targetFloor} / ${max}` : `${p.score} / ${max}`}</span>
      <span>${p.attempts} série${p.attempts === 1 ? '' : 's'}</span>
    </div>
  </a>`;
}
