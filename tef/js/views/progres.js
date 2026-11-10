// Progress. The ladder is explicit on purpose: a number you cannot
// interrogate is demotivating, and a number that flatters you is worse
// than none at all.

import { esc, acts, pct, dur } from '../ui.js';
import * as store from '../store.js';
import * as level from '../level.js';
import { RUNGS } from '../level.js';
import { WEEKS, currentWeek } from '../plan.js';
import { GRAMMAR } from '../data/grammar.js';
import { PHRASES } from '../data/phrases.js';
import { VOCAB } from '../data/vocab.js';
import * as srs from '../srs.js';

export default function progres(el, { go }) {
  const a = store.assist();
  const { rung, metrics } = level.current();
  const nextRung = level.next();
  const gaps = level.gaps();
  const pace = level.pace();
  const week = currentWeek();
  const days = store.daysUntilExam();

  const last30 = store.lastDays(30);
  const activeDays = last30.filter(d => d.minutes > 0).length;
  const spokenMonth = Math.round(last30.reduce((s, d) => s + d.speakingSeconds, 0) / 60);

  const byMode = {};
  for (const s of store.get().speaking) byMode[s.mode] = (byMode[s.mode] || 0) + s.seconds;
  const modeMax = Math.max(1, ...Object.values(byMode));
  const MODE_LABEL = {
    shadow:'Shadowing', questions:'Questions éclair', quick:'Réponses rapides',
    sectionA:'Section A', sectionB:'Section B', monologue:'Monologue', phrases:'Phrases',
  };

  const weeks = 18;
  const cells = store.lastDays(weeks * 7);
  const todayKey = store.today();
  const lv = (m) => (m === 0 ? 0 : m < 40 ? 1 : m < 100 ? 2 : m < 180 ? 3 : 4);

  const tagAcc = store.tagAccuracy();

  el.innerHTML = `
  <div class="view view--wide">
    <div class="ph">
      <h1>Progrès${a ? '<span class="gloss" style="font-size:var(--t-base)">Progress</span>' : ''}</h1>
      <p class="ph__sub">Trois choses te font monter, et les trois doivent bouger :
        les heures de parole produite, la grammaire réellement réussie, et la précision en exercice.
        ${a ? '<span class="gloss">Three things move you up, and all three must move: hours of speech produced, grammar actually passed, and accuracy under drill conditions.</span>' : ''}</p>
    </div>

    ${pace && pace.started ? `
      <div class="pace" data-track="${pace.onTrack ? 1 : 0}" style="margin-bottom:2rem">
        <div class="pace__head">${pace.onTrack
          ? 'Au rythme actuel, l'objectif de février tient.'
          : 'Au rythme actuel, l'objectif de février ne tient pas.'}</div>
        <div class="pace__body">
          Il reste ${pace.days} jours et ${pace.hoursNeeded.toFixed(0)} heures de parole à produire,
          soit ${pace.minutesPerDayNeeded} minutes par jour. Sur les quatorze derniers jours
          tu en produis ${pace.minutesPerDayActual}.
          ${a ? `<span class="gloss">${pace.days} days left and ${pace.hoursNeeded.toFixed(0)} hours of speech to produce — ${pace.minutesPerDayNeeded} min a day. Over the last fourteen days you are producing ${pace.minutesPerDayActual}.</span>` : ''}
        </div>
      </div>` : `
      <div class="pace" style="margin-bottom:2rem">
        <div class="pace__head">Pas encore assez de données pour juger le rythme.</div>
        <div class="pace__body">Fais quelques blocs de parole et cette estimation apparaîtra.</div>
      </div>`}

    <h2 style="font-size:var(--t-md);margin-bottom:.9rem">
      L'échelle${a ? '<span class="gloss">The ladder</span>' : ''}</h2>
    <div class="rungs" style="margin-bottom:1.25rem">
      ${RUNGS.map(r => {
        const idx = RUNGS.findIndex(x => x.key === r.key);
        const here = RUNGS.findIndex(x => x.key === rung.key);
        const state = idx < here ? 'passed' : idx === here ? 'here' : 'todo';
        return `
        <div class="rung" data-state="${state}">
          <div>
            <div class="rung__k">${esc(r.fr)}${a ? `<span class="gloss">${esc(r.en)}</span>` : ''}</div>
            <div class="rung__says">${esc(r.says)}${a ? `<span class="gloss">${esc(r.saysEn)}</span>` : ''}</div>
            ${idx > here ? `<div class="rung__says" style="color:var(--ink-faint);font-size:var(--t-xs);margin-top:.3rem">
              ${r.speakHours} h de parole · ${r.lessons} leçons · ${Math.round(r.acc * 100)} % de précision</div>` : ''}
          </div>
          <span class="rung__clb">NCLC ${r.clb}</span>
        </div>`;
      }).join('')}
    </div>

    ${nextRung ? `
      <div class="sheet" style="margin-bottom:2rem;display:grid;gap:.85rem">
        <b style="font:500 var(--t-base)/1.3 var(--ff-text)">
          Ce qui bloque ${esc(nextRung.fr)}${a ? `<span class="gloss">What is blocking the next rung</span>` : ''}</b>
        ${gaps.length ? gaps.map(g => `
          <div>
            <div style="font-size:var(--t-sm)">${esc(g.fr)}${a ? `<span class="gloss">${esc(g.en)}</span>` : ''}</div>
            <div style="font-size:var(--t-xs);color:var(--ink-faint);margin-top:.2rem">
              ${esc(g.detail)}${a ? `<span class="gloss">${esc(g.detailEn)}</span>` : ''}</div>
          </div>`).join('')
        : '<div style="font-size:var(--t-sm);color:var(--vert)">Rien — le palier se débloque au prochain exercice.</div>'}
      </div>` : ''}

    <hr class="hair">

    <div class="grid3" style="margin-bottom:2.5rem">
      <div class="read">
        <span class="read__n u-num">${metrics.speakHours.toFixed(1)} h</span>
        <span class="read__l">de parole produite au total${a ? ' · total speech produced' : ''}</span>
      </div>
      <div class="read">
        <span class="read__n u-num">${metrics.lessons}<span style="color:var(--ink-faint);font-size:.55em"> / ${GRAMMAR.length}</span></span>
        <span class="read__l">leçons réussies à 70 %${a ? ' · lessons passed' : ''}</span>
      </div>
      <div class="read">
        <span class="read__n u-num">${metrics.acc == null ? '—' : Math.round(metrics.acc * 100) + ' %'}</span>
        <span class="read__l">de précision en exercice${a ? ' · drill accuracy' : ''}</span>
      </div>
    </div>

    <div class="grid2" style="align-items:start;margin-bottom:2.5rem">
      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:1rem">
          Où passe ta parole${a ? '<span class="gloss">Where your speaking goes</span>' : ''}</h2>
        ${Object.keys(byMode).length ? `
          <div class="weak">
            ${Object.entries(byMode).sort((x, y) => y[1] - x[1]).map(([k, v]) => `
              <div class="weakrow">
                <span class="weakrow__n">${esc(MODE_LABEL[k] || k)}</span>
                <span class="weakrow__bar"><i style="width:${Math.round((v / modeMax) * 100)}%" data-ok="1"></i></span>
                <span class="weakrow__p u-num">${Math.round(v / 60)} min</span>
              </div>`).join('')}
          </div>
          <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-soft)">
            Si Section B est en bas de cette liste, c'est elle qui te coûtera le plus :
            c'est l'épreuve où l'on doit réagir sans script.
            ${a ? '<span class="gloss">If Section B sits at the bottom of this list, that is what will cost you most — it is the task where you must react without a script.</span>' : ''}
          </p>`
        : '<div class="empty">Rien encore. Fais un bloc de parole.</div>'}
      </div>

      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:1rem">
          Ce qui résiste${a ? '<span class="gloss">What is resisting</span>' : ''}</h2>
        ${tagAcc.length ? `<div class="weak">
          ${tagAcc.slice(0, 8).map(t => `
            <div class="weakrow">
              <span class="weakrow__n">${esc(t.tag)}</span>
              <span class="weakrow__bar"><i style="width:${Math.round(t.acc * 100)}%" ${t.acc >= 0.85 ? 'data-ok="1"' : ''}></i></span>
              <span class="weakrow__p">${pct(t.acc)}</span>
            </div>`).join('')}</div>`
        : '<div class="empty">Au moins trois réponses sur un thème pour qu'il apparaisse ici.</div>'}
      </div>
    </div>

    <hr class="hair">

    <h2 style="font-size:var(--t-md);margin-bottom:1rem">
      Régularité${a ? '<span class="gloss">Consistency</span>' : ''}</h2>
    <div class="cahier__wrap" style="margin-bottom:.9rem">
      <div class="cahier" role="img" aria-label="Régularité sur dix-huit semaines">
        ${cells.map(d => `<div class="cahier__sq" data-l="${lv(d.minutes)}"
          ${d.key === todayKey ? 'data-today="1"' : ''}
          title="${d.key} — ${d.minutes} min, dont ${Math.round(d.speakingSeconds / 60)} min parlées"></div>`).join('')}
      </div>
    </div>
    <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:58ch;margin-bottom:2.5rem">
      ${activeDays} jours travaillés sur les 30 derniers · ${spokenMonth} minutes parlées ce mois-ci ·
      série de ${store.liveStreak()} jours, record ${store.get().streak.best} ·
      ${dur(store.totalHours() * 60)} au total.
    </p>

    <hr class="hair">

    <div class="grid3" style="margin-bottom:2rem">
      <div class="read read--tight">
        <span class="read__n u-num">${srs.counts(PHRASES).learned} / ${PHRASES.length}</span>
        <span class="read__l">phrases consolidées</span>
      </div>
      <div class="read read--tight">
        <span class="read__n u-num">${srs.counts(VOCAB).learned} / ${VOCAB.length}</span>
        <span class="read__l">blocs de vocabulaire consolidés</span>
      </div>
      <div class="read read--tight">
        <span class="read__n u-num">${week.n} / ${WEEKS.length}</span>
        <span class="read__l">semaine du programme${days != null && days > 0 ? ` · examen dans ${days} j` : ''}</span>
      </div>
    </div>

    <details class="sheet sheet--quiet">
      <summary style="cursor:pointer;font:500 var(--t-base)/1.3 var(--ff-text)">
        Comment ce niveau est calculé${a ? ' · How this level is worked out' : ''}</summary>
      <div style="margin-top:1rem;font-size:var(--t-sm);line-height:1.7;color:var(--ink-soft)">
        <p>Ce n'est pas un score d'examen. C'est un indicateur à trois conditions, et il ne monte
        que lorsque les trois sont remplies : les heures de parole que tu as réellement produites
        dans l'application, le nombre de leçons de grammaire réussies à 70 % ou plus, et ta
        précision moyenne en exercice.</p>
        <p>Les heures de parole sont volontairement l'élément le plus lent. On peut lire
        une grammaire en un après-midi ; on ne peut pas accélérer les soixante heures de production
        orale qui séparent A2 de B2. C'est pour cette raison que l'application compte les minutes
        plutôt que les leçons.</p>
        <p>Les équivalences NCLC indiquées sont celles d'IRCC, mais seul un vrai TEF Canada
        donne un score officiel. Vérifie les barèmes en vigueur sur le site d'IRCC avant toute
        décision liée à un dossier.</p>
      </div>
    </details>

    <div class="row" style="margin-top:1.5rem">
      <a class="btn btn--plain" href="#/">Retour au programme</a>
      <a class="btn btn--plain" href="#/reglages">Réglages et sauvegarde</a>
    </div>
  </div>`;
}
