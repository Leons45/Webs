// Today. The day arrives as a timetable, not as a menu — at 3–4 hours a day
// the decision of what to do next is itself a cost, so the app makes it.

import { esc, acts, dateLine, dur, icon } from '../ui.js';
import { t, bindPeeks } from '../i18n.js';
import * as store from '../store.js';
import { todaySchedule, dayProgress, currentWeek, WEEKS } from '../plan.js';
import * as level from '../level.js';

export default function home(el, { go }) {
  const sched = todaySchedule(store.settings().startHour || 7);
  const prog = dayProgress();
  const week = currentWeek();
  const { rung, metrics } = level.current();
  const nextRung = level.next();
  const pace = level.pace();
  const d = store.day();
  const spokenMin = Math.round(d.speakingSeconds / 60);
  const spokenPct = Math.min(100, Math.round((spokenMin / Math.max(1, prog.speakingTarget)) * 100));
  const days = store.daysUntilExam();
  const assistOn = store.assist();

  const nextBlock = sched.find(b => !b.done);

  el.innerHTML = `
  <div class="view">

    <!-- The day's instruction -->
    <section class="today">
      <div class="today__date u-ui">
        ${esc(dateLine())} · semaine ${week.n} / ${WEEKS.length}${
          days != null && days > 0 ? ` · examen dans ${days} jours` : ''}
      </div>
      <h1 class="today__line">
        ${nextBlock
          ? `Prochain bloc : <em>${esc(nextBlock.fr)}</em>, <b>${nextBlock.min}</b> minutes.`
          : `Programme terminé. <em>${spokenMin} minutes</em> de parole aujourd’hui.`}
      </h1>
      <p class="today__note">
        ${esc(week.goal)}
        ${assistOn ? `<span class="gloss">${esc(week.goalEn)}</span>` : ''}
      </p>
      <div class="today__acts">
        ${nextBlock
          ? `<button class="btn btn--lg" data-act="startnext">Commencer${assistOn ? ' · Start' : ''}</button>`
          : `<a class="btn btn--lg" href="#/parler?mode=monologue">Encore un monologue</a>`}
        <a class="btn btn--ghost btn--lg" href="#/parler">Parler maintenant</a>
      </div>
    </section>

    <hr class="hair">

    <!-- The number that governs everything -->
    <div class="grid2" style="align-items:start;margin-bottom:.5rem">
      <div class="meter">
        <div class="meter__row">
          <span class="meter__n">${spokenMin}</span>
          <span class="meter__unit">min parlées aujourd’hui${assistOn ? ' · spoken today' : ''}</span>
        </div>
        <div class="meter__track">
          <div class="meter__fill" data-met="${spokenMin >= prog.speakingTarget ? 1 : 0}"
               style="width:${spokenPct}%"></div>
        </div>
        <div class="meter__cap">
          Objectif du jour : ${prog.speakingTarget} min · total ${store.speakingTotals().allMinutes} min
          ${assistOn ? `<span class="gloss">Daily goal ${prog.speakingTarget} min · ${level.metrics().speakHours.toFixed(1)} h of speech all-time</span>` : ''}
        </div>
      </div>

      <div class="meter">
        <div class="meter__row">
          <span class="meter__n">${prog.done}<span style="font-size:.45em;color:var(--ink-faint)"> / ${prog.total}</span></span>
          <span class="meter__unit">blocs faits${assistOn ? ' · blocks done' : ''}</span>
        </div>
        <div class="meter__track">
          <div class="meter__fill" data-met="${prog.done === prog.total ? 1 : 0}"
               style="width:${Math.round((prog.done / prog.total) * 100)}%;background:${prog.done === prog.total ? 'var(--vert)' : 'var(--ink)'}"></div>
        </div>
        <div class="meter__cap">
          ${dur(prog.minutesDone)} sur ${dur(prog.minutesTotal)} · série de ${store.liveStreak()} j
          ${assistOn ? `<span class="gloss">${dur(prog.minutesDone)} of ${dur(prog.minutesTotal)} · ${store.liveStreak()}-day streak</span>` : ''}
        </div>
      </div>
    </div>

    ${pace && pace.started ? paceBanner(pace, assistOn) : ''}

    <hr class="hair">

    <!-- The timetable -->
    <div class="row row--split" style="align-items:baseline;margin-bottom:.9rem">
      <h2 style="font-size:var(--t-md)">Le programme du jour${assistOn ? '<span class="gloss">Today’s schedule</span>' : ''}</h2>
      <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
        ${store.settings().dailyHours} h · départ ${store.settings().startHour || 7}:00</span>
    </div>

    <div class="sched">
      ${sched.map(b => `
        <button class="block" data-act="block" data-id="${esc(b.id)}" data-route="${esc(b.route)}"
                data-min="${b.min}" data-done="${b.done ? 1 : 0}">
          <span class="block__time">${b.from}</span>
          <span class="block__body">
            <span class="block__name">
              ${b.speaking ? `<span class="tagmic" aria-label="bloc de parole">${icon.mic}</span>` : ''}
              ${esc(b.fr)}
            </span>
            <span class="block__desc">
              ${esc(b.desc)}${assistOn ? `<span class="gloss">${esc(b.descEn)}</span>` : ''}
            </span>
          </span>
          <span class="block__meta">
            <span>${b.min} min</span>
            ${b.done ? '' : '<span style="color:var(--ink)">commencer</span>'}
          </span>
        </button>`).join('')}
    </div>

    <hr class="hair">

    <!-- Where you are -->
    <div class="grid2" style="align-items:start">
      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">
          Ton niveau${assistOn ? '<span class="gloss">Your level</span>' : ''}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin-bottom:1rem">
          ${esc(rung.fr)} — ${esc(rung.says)}
          ${assistOn ? `<span class="gloss">${esc(rung.saysEn)}</span>` : ''}
        </p>
        ${nextRung ? `
          <div class="sheet" style="display:grid;gap:.75rem">
            <b style="font:500 var(--t-base)/1.25 var(--ff-text)">
              Pour atteindre ${esc(nextRung.fr)}</b>
            ${level.gaps().map(g => `
              <div>
                <div style="font-size:var(--t-sm)">${esc(g.fr)}
                  ${assistOn ? `<span class="gloss">${esc(g.en)}</span>` : ''}</div>
              </div>`).join('') || '<div style="font-size:var(--t-sm);color:var(--vert)">Tout est atteint — le palier suivant se débloque au prochain exercice.</div>'}
          </div>` : ''}
      </div>

      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">
          Les treize semaines${assistOn ? '<span class="gloss">The thirteen weeks</span>' : ''}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin-bottom:.9rem">
          Semaine ${week.n} : ${esc(week.fr)}
          ${assistOn ? `<span class="gloss">Week ${week.n}: ${esc(week.en)}</span>` : ''}
        </p>
        <div class="weekstrip">
          ${WEEKS.map(w => `
            <span class="weekstrip__w" title="${esc(w.fr)}"
              data-state="${w.n < week.n ? 'past' : w.n === week.n ? 'now' : 'todo'}">${w.n}</span>`).join('')}
        </div>
        <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-soft)">
          Chaque semaine a un objectif que tu peux tester toi-même le dimanche.
          ${assistOn ? '<span class="gloss">Each week ends in something you can test yourself on.</span>' : ''}
        </p>
      </div>
    </div>
  </div>`;

  bindPeeks(el);

  acts(el, {
    block: (btn) => {
      const id = btn.dataset.id;
      sessionStorage.setItem('atelier.block', JSON.stringify({ id, min: Number(btn.dataset.min) }));
      go(btn.dataset.route);
    },
    startnext: () => {
      if (!nextBlock) return;
      sessionStorage.setItem('atelier.block', JSON.stringify({ id: nextBlock.id, min: nextBlock.min }));
      go(nextBlock.route);
    },
  });
}

function paceBanner(p, assistOn) {
  const ok = p.onTrack;
  return `
  <div class="pace" data-track="${ok ? 1 : 0}" style="margin-top:1.5rem">
    <div class="pace__head">
      ${ok
        ? `Au rythme actuel, l’objectif de février tient.`
        : `Au rythme actuel, tu n’y seras pas en février.`}
    </div>
    <div class="pace__body">
      Il te faut environ <b>${p.minutesPerDayNeeded} minutes de parole par jour</b>
      d’ici l’examen ; sur les quatorze derniers jours tu en produis ${p.minutesPerDayActual}.
      ${ok ? 'Tiens ce rythme.' : 'L’écart ne se rattrape pas en lisant — il se rattrape en parlant.'}
      ${assistOn ? `<span class="gloss">You need about ${p.minutesPerDayNeeded} min of speech a day until the exam; over the last fourteen days you are producing ${p.minutesPerDayActual}.</span>` : ''}
    </div>
  </div>`;
}
