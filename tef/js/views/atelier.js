// Atelier — a drill built only from the tags you are weakest on, or from
// tags you pick yourself. This is the view that turns a diagnosis into work.

import { esc, acts, pct } from '../ui.js';
import * as store from '../store.js';
import * as srs from '../srs.js';
import { TAGS } from '../data/cards.js';
import { runner } from './_runner.js';

export default function atelier(el, { params, go }) {
  const selected = (params.get('tags') || '').split(',').filter(Boolean);

  if (selected.length) {
    const cards = srs.drill(selected, 18);
    const labels = selected.map(t => TAGS[t]?.label || t).join(' · ');
    return runner(el, cards, {
      title: 'Atelier',
      subtitle: `Atelier : ${labels}`,
      onFinish: () => go('#/atelier?tags=' + selected.join(',')),
    });
  }

  const acc = store.tagAccuracy();
  const byAcc = new Map(acc.map(a => [a.tag, a]));
  const weakThree = acc.filter(a => a.acc < 0.9).slice(0, 3).map(a => a.tag);

  const groups = {};
  for (const [tag, meta] of Object.entries(TAGS)) {
    (groups[meta.skill] ||= []).push({ tag, ...meta, stat: byAcc.get(tag) });
  }
  const GROUP_LABEL = { grammaire: 'Grammaire', expression: 'Expression', lexique: 'Lexique' };

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Atelier</h1>
      <p class="ph__sub">Une série courte, construite uniquement sur les points que tu rates.
        Choisis un thème, ou laisse l’application choisir les trois plus fragiles.</p>
    </div>

    ${weakThree.length ? `
      <section class="sheet" style="display:grid;gap:1.1rem">
        <div>
          <b style="font:500 var(--t-md)/1.2 var(--ff-text)">Tes trois points les plus fragiles</b>
          <p style="margin-top:.4rem;font-size:var(--t-sm);color:var(--ink-soft)">
            ${weakThree.map(t => esc(TAGS[t]?.label || t)).join(', ')}.
          </p>
        </div>
        <div class="row">
          <button class="btn" data-act="auto">Lancer la série ciblée</button>
        </div>
      </section>
      <hr class="hair">` : ''}

    ${Object.entries(groups).map(([skill, items]) => `
      <h2 style="font-size:var(--t-md);margin:0 0 .85rem">${esc(GROUP_LABEL[skill] || skill)}</h2>
      <div class="grid3" style="margin-bottom:1.75rem">
        ${items.map(it => {
          const a = it.stat;
          const tone = !a ? 'var(--ink-faint)' : a.acc < 0.7 ? 'var(--rouge)' : a.acc < 0.9 ? 'var(--ink)' : 'var(--vert)';
          return `
          <button class="sheet" data-act="one" data-tag="${esc(it.tag)}"
                  style="text-align:left;display:grid;gap:.5rem;cursor:pointer">
            <b style="font:500 var(--t-base)/1.25 var(--ff-text)">${esc(it.label)}</b>
            <span class="u-ui u-num" style="font-size:var(--t-xs);color:${tone}">
              ${a ? `${pct(a.acc)} · ${a.seen} réponses` : 'pas encore évalué'}
            </span>
          </button>`;
        }).join('')}
      </div>`).join('')}

    <div class="row"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  acts(el, {
    auto: () => go('#/atelier?tags=' + weakThree.join(',')),
    one: (btn) => go('#/atelier?tags=' + btn.dataset.tag),
  });
}
