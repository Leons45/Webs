// Chunks — fixed phrases to memorise cold for TEF Section A and B.
// Two modes:
//   Study  — browse all phrases by category, hear each one, see usage note.
//   Drill  — flash-card style: see French → recall → reveal English + usage.
//
// Progress is a simple "mastered" toggle per chunk id, stored via store.js.

import { esc, acts, $, $$ } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import { CHUNKS, CONNECTORS, CATS } from '../data/chunks.js';

/* ── helpers ─────────────────────────────────────────────────────── */

const KEY = 'atelier.chunks';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}

function saveProgress(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

function toggleMastered(id) {
  const p = loadProgress();
  p[id] = !p[id];
  saveProgress(p);
  return p[id];
}

function masteredCount() {
  const p = loadProgress();
  return CHUNKS.filter(c => p[c.id]).length;
}

/* ── entry point ─────────────────────────────────────────────────── */

export default function chunks(el, { params, go }) {
  const mode = params.get('mode') || 'study';
  const cat  = params.get('cat')  || 'all';

  speech.loadVoices();   // warm up — fast noop if already loaded

  if (mode === 'drill') return drill(el, { cat, go });
  return study(el, { cat, go });
}

/* ══════════════════════════════════════════════════════════════════
   STUDY MODE
   ══════════════════════════════════════════════════════════════════ */

function study(el, { cat, go }) {
  const a   = store.assist();
  const prog = loadProgress();
  const list = cat === 'all' ? CHUNKS : CHUNKS.filter(c => c.cat === cat);
  const done = list.filter(c => prog[c.id]).length;

  el.innerHTML = `
  <div class="view" id="chunks-view">

    <div class="ph">
      <h1>Formules${a ? '<span class="gloss">Writing Chunks</span>' : ''}</h1>
      <p class="ph__sub">
        Ces phrases se mémorisent telles quelles — mot pour mot, avec l'accentuation.
        ${a ? '<span class="gloss">Memorise these word-for-word with their stress pattern.</span>' : ''}
      </p>
    </div>

    <!-- Progress bar -->
    <div class="chunks-progress" style="margin-bottom:1.5rem">
      <div class="row row--split" style="margin-bottom:.4rem">
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
          ${masteredCount()} / ${CHUNKS.length} maîtrisées
          ${a ? '· mastered' : ''}
        </span>
        <button class="btn btn--sm" data-act="go-drill" data-cat="${esc(cat)}">
          Mémoriser →${a ? ' <span class="gloss">Drill</span>' : ''}
        </button>
      </div>
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width:${Math.round(masteredCount()/CHUNKS.length*100)}%"></div>
      </div>
    </div>

    <!-- Category tabs -->
    <div class="chunks-tabs" role="tablist" style="margin-bottom:1.5rem">
      ${[{ id:'all', label:'Tout', labelEn:'All' }, ...CATS].map(c => `
        <button class="chunks-tab${cat === c.id ? ' chunks-tab--active' : ''}"
                role="tab" aria-selected="${cat === c.id}"
                data-act="set-cat" data-cat="${esc(c.id)}">
          ${esc(c.label)}${a && c.labelEn ? `<span class="gloss">${esc(c.labelEn)}</span>` : ''}
        </button>`).join('')}
    </div>

    <!-- Chunk cards -->
    <div class="chunks-grid" id="chunk-list">
      ${list.map(chunk => chunkCard(chunk, prog[chunk.id], a)).join('')}
    </div>

    <!-- Connector upgrade table -->
    ${cat === 'all' || cat === 'sec-b' ? connectorTable(a) : ''}

  </div>`;

  // wire actions
  acts(el, {
    'set-cat': (btn) => go(`#/chunks?cat=${btn.dataset.cat}`),
    'go-drill': (btn) => go(`#/chunks?mode=drill&cat=${btn.dataset.cat}`),

    speak: (btn) => {
      const text = btn.closest('[data-id]')?.dataset.fr;
      if (text) speech.say(text, { rate: 0.85 });
    },

    master: (btn) => {
      const id  = btn.closest('[data-id]').dataset.id;
      const now = toggleMastered(id);
      btn.textContent = now ? '✓' : '○';
      btn.dataset.on  = now ? '1' : '0';
      btn.setAttribute('aria-label', now ? 'Marqué comme maîtrisé' : 'Marquer comme maîtrisé');
      // Update the global progress bar without a full redraw
      const total = masteredCount();
      const bar = $('#chunks-view .progress-bar__fill');
      if (bar) bar.style.width = Math.round(total / CHUNKS.length * 100) + '%';
      const label = $('#chunks-view .u-ui');
      if (label) label.textContent = `${total} / ${CHUNKS.length} maîtrisées${a ? ' · mastered' : ''}`;
    },
  });
}

function chunkCard(chunk, mastered, a) {
  const catInfo = CATS.find(c => c.id === chunk.cat);
  return `
  <div class="chunk-card sheet${mastered ? ' chunk-card--done' : ''}"
       data-id="${esc(chunk.id)}" data-fr="${esc(chunk.fr)}">
    <div class="chunk-card__header">
      <span class="chunk-badge u-ui"
            style="font-size:var(--t-xs)">${esc(catInfo ? catInfo.label : chunk.cat)}</span>
      <div class="row" style="gap:.5rem">
        <button class="icon-btn" data-act="speak"
                aria-label="Écouter la prononciation" title="Écouter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>
        <button class="icon-btn master-btn" data-act="master"
                data-on="${mastered ? '1' : '0'}"
                aria-label="${mastered ? 'Marqué comme maîtrisé' : 'Marquer comme maîtrisé'}"
                title="${mastered ? 'Maîtrisé' : 'Marquer maîtrisé'}">
          ${mastered ? '✓' : '○'}
        </button>
      </div>
    </div>
    <p class="chunk-card__fr">${esc(chunk.fr)}</p>
    ${a ? `<p class="chunk-card__en gloss">${esc(chunk.en)}</p>` : ''}
    <p class="chunk-card__usage">${esc(chunk.usage)}</p>
  </div>`;
}

function connectorTable(a) {
  return `
  <section style="margin-top:2rem">
    <h2 style="font-size:var(--t-md);margin-bottom:.3rem">
      Connecteurs à améliorer${a ? '<span class="gloss" style="font-size:var(--t-base)"> · Upgrade your connectors</span>' : ''}
    </h2>
    <p class="ph__sub" style="margin-bottom:1rem">
      Ces mots existent mais ils sont trop simples pour viser CLB 7.
      ${a ? '<span class="gloss">These words exist but are too simple for CLB 7.</span>' : ''}
    </p>
    <div class="connector-table">
      <div class="connector-table__head u-ui" style="font-size:var(--t-xs)">
        <span>Fonction${a ? ' · Function' : ''}</span>
        <span>À éviter${a ? ' · Avoid' : ''}</span>
        <span>Utilise plutôt${a ? ' · Use instead' : ''}</span>
      </div>
      ${CONNECTORS.map(r => `
      <div class="connector-table__row">
        <span class="u-ui" style="font-weight:600;font-size:var(--t-sm)">${esc(r.fn)}</span>
        <span class="connector-avoid">${esc(r.avoid)}</span>
        <span class="connector-upgrade">${esc(r.upgrade)}</span>
      </div>`).join('')}
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════════
   DRILL MODE
   ══════════════════════════════════════════════════════════════════ */

function drill(el, { cat, go }) {
  const a    = store.assist();
  const pool = (cat === 'all' ? CHUNKS : CHUNKS.filter(c => c.cat === cat))
                 .slice()
                 .sort(() => Math.random() - 0.5);

  if (!pool.length) {
    el.innerHTML = `<div class="view"><p>Aucune formule dans cette catégorie.</p>
      <a class="btn" href="#/chunks">Retour</a></div>`;
    return;
  }

  let idx = 0, revealed = false;
  const prog = loadProgress();

  function render() {
    const chunk = pool[idx];
    const mastered = prog[chunk.id];

    el.innerHTML = `
    <div class="view" id="drill-view">
      <div class="row row--split" style="margin-bottom:1.25rem">
        <a class="btn btn--plain" href="#/chunks?cat=${esc(cat)}">← Étudier</a>
        <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
          ${idx + 1} / ${pool.length}
          · ${masteredCount()} maîtrisées
        </span>
      </div>

      <!-- Progress -->
      <div class="progress-bar" style="margin-bottom:1.75rem">
        <div class="progress-bar__fill"
             style="width:${Math.round((idx / pool.length) * 100)}%"></div>
      </div>

      <!-- Flashcard -->
      <div class="drill-card sheet" id="drill-card">
        <div class="drill-card__cat u-ui" style="font-size:var(--t-xs);margin-bottom:.6rem">
          ${esc(CATS.find(c => c.id === chunk.cat)?.label || chunk.cat)}
        </div>

        <p class="drill-card__fr">${esc(chunk.fr)}</p>

        <button class="icon-btn" data-act="speak-drill"
                style="margin:.5rem 0 1rem" aria-label="Écouter">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        </button>

        <div id="drill-reveal" style="display:${revealed ? 'block' : 'none'}">
          <hr class="hair">
          <p class="drill-card__en" style="margin-top:.75rem;font-size:var(--t-base);
             color:var(--ink-soft)">${esc(chunk.en)}</p>
          <p class="drill-card__usage" style="font-size:var(--t-sm);color:var(--ink-faint);
             margin-top:.4rem">${esc(chunk.usage)}</p>
        </div>

        ${!revealed ? `
        <button class="btn btn--lg btn--wide" data-act="reveal"
                style="margin-top:1rem">
          Révéler${a ? '<span class="gloss">Reveal</span>' : ''}
        </button>` : `
        <div class="row" style="margin-top:1.25rem;gap:.75rem;flex-wrap:wrap">
          <button class="btn btn--ghost btn--wide" data-act="mark-skip">
            Pas encore${a ? '<span class="gloss">Not yet</span>' : ''}
          </button>
          <button class="btn btn--wide" data-act="mark-got">
            Je l'avais !${a ? '<span class="gloss">Got it!</span>' : ''}
          </button>
        </div>
        <div style="margin-top:.75rem;text-align:center">
          <button class="master-toggle u-ui" data-act="toggle-master"
                  data-on="${mastered ? '1' : '0'}"
                  style="font-size:var(--t-xs);color:var(--ink-faint);
                         background:none;border:none;cursor:pointer;padding:.25rem .5rem">
            ${mastered ? '✓ Maîtrisée' : '○ Marquer maîtrisée'}
          </button>
        </div>`}
      </div>

      <!-- Mini cat legend -->
      <p class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);
         text-align:center;margin-top:1.5rem">
        ${esc(CATS.find(c => c.id === chunk.cat)?.desc || '')}
      </p>
    </div>`;

    acts(el, {
      'speak-drill': () => speech.say(chunk.fr, { rate: 0.85 }),

      reveal: () => {
        revealed = true;
        render();
        speech.say(chunk.fr, { rate: 0.85 });
      },

      'mark-skip': () => {
        revealed = false;
        // push the card to the back of the pool so it comes up again
        pool.push(pool[idx]);
        idx = Math.min(idx + 1, pool.length - 1);
        render();
      },

      'mark-got': () => {
        revealed = false;
        idx++;
        if (idx >= pool.length) {
          // Session complete
          el.innerHTML = drillDone(pool.length, masteredCount(), cat, go);
          acts(el, {
            'done-study': () => go('#/chunks?cat=' + cat),
            'done-again': () => go('#/chunks?mode=drill&cat=' + cat),
          });
        } else {
          render();
        }
      },

      'toggle-master': () => {
        const now = toggleMastered(chunk.id);
        prog[chunk.id] = now;
        const btn = $('[data-act="toggle-master"]', el);
        if (btn) {
          btn.dataset.on = now ? '1' : '0';
          btn.textContent = now ? '✓ Maîtrisée' : '○ Marquer maîtrisée';
        }
      },
    });
  }

  render();
}

function drillDone(total, mastered, cat, go) {
  return `
  <div class="view" style="text-align:center">
    <div class="drill-done">
      <div class="drill-done__icon">🎉</div>
      <h1 style="font-size:var(--t-xl);margin:.5rem 0">Session terminée !</h1>
      <p style="color:var(--ink-soft);max-width:34ch;margin:0 auto 1.5rem">
        Tu as passé en revue ${total} formule${total > 1 ? 's' : ''}.
        ${mastered} / ${CHUNKS.length} sont maîtrisées au total.
      </p>
      <div class="progress-bar" style="margin-bottom:1.5rem">
        <div class="progress-bar__fill"
             style="width:${Math.round(mastered/CHUNKS.length*100)}%"></div>
      </div>
      <div class="row" style="justify-content:center;gap:1rem;flex-wrap:wrap">
        <button class="btn" data-act="done-study">Étudier les formules</button>
        <button class="btn btn--ghost" data-act="done-again">Recommencer</button>
      </div>
    </div>
  </div>`;
}
