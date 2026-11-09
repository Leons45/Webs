import { esc, acts, pct } from '../ui.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import { MODULES, profile, weakestSkill } from '../scoring.js';
import { TAGS } from '../data/cards.js';

const ACT_LABEL = {
  review: 'Révision', dictee: 'Dictée', lire: 'Compréhension écrite',
  ecouter: 'Compréhension orale', parler: 'Expression orale', ecrire: 'Expression écrite',
};

export default function progres(el, { go }) {
  const prof = profile(store);
  const weakest = weakestSkill(prof);
  const target = store.settings().target;
  const acc = store.tagAccuracy();
  const c = srs.counts();
  const days = store.daysUntilExam();

  const last30 = store.lastDays(30);
  const activeDays = last30.filter(d => d.cards > 0 || d.minutes > 0).length;
  const totalQs = last30.reduce((s, d) => s + d.cards, 0);
  const totalMin = last30.reduce((s, d) => s + d.minutes, 0);

  const actTotals = {};
  for (const d of store.lastDays(90)) {
    for (const [k, v] of Object.entries(d.acts || {})) actTotals[k] = (actTotals[k] || 0) + v;
  }
  const actMax = Math.max(1, ...Object.values(actTotals));

  const weeks = 18;
  const cells = store.lastDays(weeks * 7);
  const goal = store.settings().dailyGoal;
  const todayKey = store.today();
  const level = (n) => (n === 0 ? 0 : n < goal * 0.4 ? 1 : n < goal * 0.8 ? 2 : n < goal * 1.5 ? 3 : 4);

  el.innerHTML = `
  <div class="view view--wide">
    <div class="ph">
      <h1>Progrès</h1>
      <p class="ph__sub">Les scores sont des estimations calculées sur ta réussite en entraînement,
        placées sur les barèmes officiels. Ils servent à décider où travailler, pas à prédire ta note.</p>
    </div>

    ${weakest ? `
      <section class="today" style="margin-bottom:2rem">
        <div class="today__date u-ui">niveau retenu${days != null && days >= 0 ? ` · examen dans ${days} jour${days === 1 ? '' : 's'}` : ''}</div>
        <h2 class="today__line" style="font-size:var(--t-xl)">
          <b>NCLC ${weakest.nclc}</b> — fixé par <em>${esc(weakest.label.toLowerCase())}</em>${weakest.nclc < target
            ? `, soit ${target - weakest.nclc} niveau${target - weakest.nclc > 1 ? 'x' : ''} sous ton objectif.`
            : `, ton objectif est atteint sur cette compétence.`}
        </h2>
        <p class="today__note">Pour l’admissibilité, c’est toujours la compétence la plus faible qui
          détermine le niveau retenu : un excellent score ailleurs ne la compense pas.</p>
      </section>` : `
      <div class="empty" style="margin-bottom:2rem">
        Fais une série dans chacune des quatre épreuves et cette page se remplira.
      </div>`}

    <h2 style="font-size:var(--t-md);margin-bottom:1.75rem">Les quatre compétences</h2>
    <div class="ladder" style="margin-bottom:2.5rem">
      ${prof.map(p => {
        const max = MODULES[p.module].max;
        const width = p.score == null ? 0 : Math.min(100, (p.score / max) * 100);
        const tpos = Math.min(100, (p.targetFloor / max) * 100);
        const cls = p.score == null ? '' : p.met ? 'lad__fill--met' : 'lad__fill--short';
        return `
        <div class="lad">
          <span class="lad__name">${esc(p.label)}</span>
          <div class="lad__track">
            <div class="lad__fill ${cls}" style="width:${width}%"></div>
            <div class="lad__target" style="left:${tpos}%" data-label="NCLC ${target}"></div>
          </div>
          <span class="lad__val u-num">
            ${p.score == null ? '—' : `${p.score} / ${max}`}
            <small>${p.score == null ? `${p.attempts} série${p.attempts === 1 ? '' : 's'}`
              : p.met ? `NCLC ${p.nclc} · atteint` : `NCLC ${p.nclc} · ${p.gap} pts à gagner`}</small>
          </span>
        </div>`;
      }).join('')}
    </div>

    <hr class="hair">

    <div class="grid3" style="margin-bottom:2.5rem">
      <div class="read">
        <span class="read__n u-num">${activeDays}<span style="color:var(--ink-faint);font-size:.55em"> / 30</span></span>
        <span class="read__l">jours travaillés sur les 30 derniers</span>
      </div>
      <div class="read">
        <span class="read__n u-num">${totalQs}</span>
        <span class="read__l">questions répondues ce mois-ci</span>
      </div>
      <div class="read">
        <span class="read__n u-num">${Math.round(totalMin / 60)} h ${totalMin % 60} min</span>
        <span class="read__l">temps mesuré ce mois-ci</span>
      </div>
    </div>

    <h2 style="font-size:var(--t-md);margin-bottom:1rem">Régularité</h2>
    <div class="cahier__wrap" style="margin-bottom:.9rem">
      <div class="cahier" role="img" aria-label="Régularité sur dix-huit semaines">
        ${cells.map(d => `<div class="cahier__sq" data-l="${level(d.cards)}"
          ${d.key === todayKey ? 'data-today="1"' : ''}
          title="${d.key} — ${d.cards} question${d.cards === 1 ? '' : 's'}, ${d.minutes} min"></div>`).join('')}
      </div>
    </div>
    <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:2.5rem">
      Série actuelle : ${store.liveStreak()} jour${store.liveStreak() === 1 ? '' : 's'} ·
      record ${store.get().streak.best} · ${c.learned} des ${c.total} points sont consolidés,
      c’est-à-dire revus à plus de trois semaines d’intervalle sans erreur.
    </p>

    <hr class="hair">

    <div class="grid2" style="align-items:start">
      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:1rem">Tous tes points, du plus fragile au plus solide</h2>
        ${acc.length ? `<div class="weak">${acc.map(w => `
          <div class="weakrow">
            <span class="weakrow__n">${esc(TAGS[w.tag]?.label || w.tag)}</span>
            <span class="weakrow__bar"><i style="width:${Math.round(w.acc * 100)}%" ${w.acc >= 0.85 ? 'data-ok="1"' : ''}></i></span>
            <span class="weakrow__p">${pct(w.acc)}</span>
          </div>`).join('')}</div>
          <button class="btn btn--ghost" style="margin-top:1.1rem" data-act="drill">Atelier sur les trois plus fragiles</button>`
        : `<div class="empty">Pas encore assez de réponses. Il faut au moins trois réponses sur un thème
             pour qu’il apparaisse ici.</div>`}
      </div>

      <div>
        <h2 style="font-size:var(--t-md);margin-bottom:1rem">Où passe ton temps</h2>
        ${Object.keys(actTotals).length ? `
          <div class="weak">
            ${Object.entries(actTotals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
              <div class="weakrow">
                <span class="weakrow__n">${esc(ACT_LABEL[k] || k)}</span>
                <span class="weakrow__bar"><i style="width:${Math.round((v / actMax) * 100)}%" data-ok="1"></i></span>
                <span class="weakrow__p u-num">${v}</span>
              </div>`).join('')}
          </div>
          <p style="margin-top:1rem;font-size:var(--t-sm);color:var(--ink-soft)">
            Si une épreuve manque dans cette liste, c’est celle qui te coûtera le plus cher le jour J —
            le niveau retenu étant celui de la compétence la plus faible.
          </p>`
        : `<div class="empty">Rien à montrer encore.</div>`}
      </div>
    </div>

    <hr class="hair">

    <details class="sheet sheet--quiet">
      <summary style="cursor:pointer;font:500 var(--t-base)/1.3 var(--ff-text)">Comment ces scores sont calculés</summary>
      <div style="margin-top:1rem;font-size:var(--t-sm);line-height:1.7;color:var(--ink-soft)">
        <p>Les échelles sont celles du TEF Canada : compréhension de l’oral sur 360, compréhension de
        l’écrit sur 300, expression écrite et expression orale sur 450. Les paliers NCLC utilisés sont
        ceux publiés par IRCC pour les examens passés à partir du 11 décembre 2023 — par exemple,
        NCLC 7 commence à 249 en compréhension orale, 207 en compréhension écrite et 310 pour
        chaque épreuve d’expression.</p>
        <p>Ta position sur l’échelle est déduite de ton taux de réussite sur tes six dernières séries.
        Pour les deux épreuves d’expression, ce taux vient de ton auto-évaluation : il vaut exactement
        ce que vaut ta sévérité envers toi-même.</p>
        <p>Vérifie les barèmes en vigueur sur le site d’IRCC avant toute décision liée à un dossier :
        ils peuvent changer, et seule la grille officielle compte.</p>
      </div>
    </details>

    <div class="row" style="margin-top:1.5rem">
      <a class="btn btn--plain" href="#/">Retour</a>
      <a class="btn btn--plain" href="#/reglages">Réglages et sauvegarde</a>
    </div>
  </div>`;

  acts(el, {
    drill: () => go('#/atelier?tags=' + acc.slice(0, 3).map(a => a.tag).join(',')),
  });
}
