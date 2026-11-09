// Expression écrite. Timed, with a live word count, a phrase bank you can
// click into the text, and a checklist drawn from the task itself.
// Drafts are saved as you type, so a closed tab costs nothing.

import { esc, acts, $, $$, words, mmss, countdown, toast } from '../ui.js';
import * as store from '../store.js';
import { WRITTEN, PHRASE_BANK } from '../data/prompts.js';
import { estimateScore, nclcFor } from '../scoring.js';

const RUBRIC = [
  { k:'tache',    label:'Tâche accomplie',        hint:'Le format demandé est respecté : récit au passé en A, lettre argumentée en B. Le nombre de mots est atteint.' },
  { k:'structure',label:'Structure et connecteurs',hint:'Paragraphes distincts, connecteurs variés, pas de « et puis » en série.' },
  { k:'lexique',  label:'Précision du lexique',   hint:'Mots justes, pas de répétition du même verbe dans trois phrases.' },
  { k:'grammaire',label:'Grammaire et orthographe',hint:'Accords du participe, auxiliaires, négation complète, concordance des temps.' },
  { k:'registre', label:'Registre',               hint:'Pas d’oral à l’écrit : ni « du coup », ni « ça », ni abréviations. Formules d’appel et de clôture en section B.' },
];

export default function ecrire(el, { params, go }) {
  const id = params.get('p');
  const item = WRITTEN.find(w => w.id === id);
  return item ? compose(el, item) : index(el, go);
}

function index(el, go) {
  const past = store.get().results.ee;

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Expression écrite</h1>
      <p class="ph__sub">Notée sur 450. La section A est un récit au passé à continuer ;
        la section B est une lettre argumentée. C’est l’épreuve où tes trois points faibles
        — négation, auxiliaire, accord — coûtent le plus cher, parce qu’ils sont visibles noir sur blanc.</p>
    </div>

    ${['A', 'B'].map(sec => {
      const items = WRITTEN.filter(w => w.section === sec);
      return `
      <section style="margin-bottom:2rem">
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">
          Section ${sec} — ${sec === 'A' ? 'continuer un fait divers' : 'exprimer et défendre un avis'}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1rem">
          ${sec === 'A'
            ? 'Environ 80 mots, à la troisième personne, au passé composé et à l’imparfait. On ne te demande pas ton avis.'
            : 'Environ 200 mots, registre soutenu, avec une concession traitée. C’est la partie qui pèse le plus dans la note.'}</p>
        <div class="grid2">
          ${items.map(it => {
            const d = store.draft(it.id);
            const tries = past.filter(p => p.id === it.id).length;
            return `
            <button class="sheet" data-act="open" data-id="${esc(it.id)}"
                    style="text-align:left;display:grid;gap:.55rem;cursor:pointer">
              <b style="font:500 var(--t-base)/1.3 var(--ff-text)">${esc(it.title)}</b>
              <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
                ${it.minWords} mots · ${it.minutes} min${tries ? ` · ${tries} version${tries > 1 ? 's' : ''}` : ''}
                ${d && d.text && !tries ? ' · brouillon en cours' : ''}
              </span>
            </button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}

    ${past.length ? `
      <hr class="hair">
      <div class="row row--split" style="align-items:baseline">
        <div>
          ${(() => {
            const slice = past.slice(-6);
            const acc = slice.reduce((s, r) => s + r.score, 0) / slice.reduce((s, r) => s + r.total, 0);
            const est = estimateScore('ee', acc);
            return `<div class="read__n u-num">${est} <span style="font-size:.5em;color:var(--ink-faint)">/ 450</span></div>
                    <div class="read__l">auto-évaluation sur ${slice.length} textes · NCLC ${nclcFor('ee', est)}</div>`;
          })()}
        </div>
        <a class="btn btn--ghost" href="#/progres">Progrès</a>
      </div>` : ''}

    <hr class="hair">
    <div class="row"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  acts(el, { open: (b) => go('#/ecrire?p=' + b.dataset.id) });
}

/* ── composing ─────────────────────────────────────────────────── */

function compose(el, item) {
  const saved = store.draft(item.id) || {};
  let stopClock = null;
  let running = false;
  let marked = false;
  const marks = {};

  el.innerHTML = `
  <div class="view view--wide">
    <div class="row row--split" style="margin-bottom:1.5rem">
      <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
        Expression écrite · section ${item.section}</span>
      <div class="row" style="gap:.9rem">
        <span class="timer" id="clock"><span class="u-num" id="t">${mmss(item.minutes * 60)}</span><small>restant</small></span>
        <a class="btn btn--plain" href="#/ecrire">Quitter</a>
      </div>
    </div>

    <div class="ph" style="margin-bottom:1.5rem">
      <h1 style="font-size:var(--t-xl)">${esc(item.title)}</h1>
    </div>

    <div class="passage prose" style="max-width:60ch;margin-bottom:1.25rem">
      ${item.lead ? `<p>${esc(item.lead)}</p>` : ''}
      <p style="margin-bottom:0"><strong>Consigne.</strong> ${esc(item.task)}</p>
    </div>

    <div class="compose">
      <div>
        <div class="row row--split" style="margin-bottom:.6rem">
          <span class="wordcount" id="wc" data-met="0">
            <b class="u-num">0</b><span class="u-ui">/ ${item.minWords} mots</span>
          </span>
          <button class="btn btn--plain" data-act="start" id="startbtn">Lancer le chronomètre</button>
        </div>
        <textarea class="area area--ruled" id="draft" rows="16"
          spellcheck="false" autocomplete="off"
          placeholder="${item.section === 'A' ? 'Commence par un complément de temps : « Quelques minutes plus tard, … »' : 'Commence par la formule d’appel, puis annonce ta position dès la première phrase.'}">${esc(saved.text || '')}</textarea>
        <div class="row" style="margin-top:1rem">
          <button class="btn btn--lg" data-act="finish">Terminer et relire</button>
          <span class="u-ui" id="savedat" style="font-size:var(--t-xs);color:var(--ink-faint)"></span>
        </div>
      </div>

      <aside class="stack">
        <div class="sheet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.6rem">
            Avant de rendre</div>
          <div class="checklist">
            ${item.checks.map((c, ci) => `
              <label class="check">
                <input type="checkbox" data-ci="${ci}">
                <span>${esc(c)}</span>
              </label>`).join('')}
          </div>
        </div>

        <div class="sheet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.6rem">
            Banque de formules — clique pour insérer</div>
          <div class="bank">
            ${Object.entries(PHRASE_BANK).map(([group, list]) => `
              <div class="bank__g">
                <b>${esc(group)}</b>
                ${list.map(p => `<button class="bank__p" data-act="insert" data-p="${esc(p)}">${esc(p)}</button>`).join('')}
              </div>`).join('')}
          </div>
        </div>
      </aside>
    </div>

    <div id="review"></div>
  </div>`;

  const area = $('#draft', el);

  function updateCount() {
    const n = words(area.value);
    const wc = $('#wc', el);
    wc.querySelector('b').textContent = n;
    wc.dataset.met = n >= item.minWords ? '1' : '0';
  }

  let saveTimer;
  area.addEventListener('input', () => {
    updateCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      store.saveDraft(item.id, { text: area.value });
      const s = $('#savedat', el);
      if (s) s.textContent = 'brouillon enregistré';
    }, 600);
  });
  updateCount();

  function startClock() {
    if (running) return;
    running = true;
    $('#startbtn', el).textContent = 'Chronomètre en marche';
    $('#startbtn', el).disabled = true;
    stopClock = countdown(item.minutes * 60, (s) => {
      const t = $('#t', el); if (t) t.textContent = mmss(s);
      if (s <= 120) { const c = $('#clock', el); if (c) c.dataset.low = '1'; }
    }, () => { toast('Temps écoulé — comme à l’examen, on arrête ici.'); finish(); });
  }

  function finish() {
    if (marked) return;
    marked = true;
    if (stopClock) { stopClock(); stopClock = null; }
    const text = area.value;
    const n = words(text);
    store.saveDraft(item.id, { text, minutes: item.minutes });
    area.readOnly = true;
    $('[data-act="finish"]', el).disabled = true;

    const flags = selfCheck(text, item);

    $('#review', el).innerHTML = `
      <hr class="hair">
      <h2 style="font-size:var(--t-md);margin-bottom:.4rem">Relecture</h2>
      <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1.25rem">
        ${n >= item.minWords
          ? `${n} mots : la longueur attendue est atteinte.`
          : `${n} mots seulement : en dessous de ${item.minWords}, la note plafonne quelle que soit la qualité.`}
        Relis d’abord pour les accords, puis une seconde fois à voix haute pour le rythme.</p>

      ${flags.length ? `
        <div class="stack" style="margin-bottom:1.75rem">
          ${flags.map(f => `
            <div class="verdict" data-ok="0">
              <b>${esc(f.title)}</b><p>${esc(f.detail)}</p>
            </div>`).join('')}
        </div>
      ` : `<div class="verdict" data-ok="1" style="margin-bottom:1.75rem">
             <b>Aucun signal automatique</b>
             <p>La relecture mécanique ne trouve rien — ce qui ne remplace pas ton œil sur les accords.</p>
           </div>`}

      <h2 style="font-size:var(--t-md);margin-bottom:.4rem">Auto-évaluation</h2>
      <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:54ch;margin-bottom:1.25rem">
        Note chaque critère de 0 à 3, en te relisant ligne par ligne.</p>

      <div class="stack">
        ${RUBRIC.map(r => `
          <div class="sheet" style="display:grid;gap:.7rem">
            <div>
              <b style="font:500 var(--t-base)/1.2 var(--ff-text)">${esc(r.label)}</b>
              <p style="margin:.35rem 0 0;font-size:var(--t-sm);color:var(--ink-soft)">${esc(r.hint)}</p>
            </div>
            <div class="grades" role="group" aria-label="${esc(r.label)}">
              ${[0, 1, 2, 3].map(v => `
                <button class="grade" data-act="mark" data-k="${r.k}" data-v="${v}">
                  <b>${v}</b><small>${['insuffisant', 'fragile', 'correct', 'solide'][v]}</small>
                </button>`).join('')}
            </div>
          </div>`).join('')}
      </div>

      <div class="row" style="margin-top:1.75rem" id="savebar">
        <button class="btn btn--lg" data-act="save" disabled>Enregistrer ce texte</button>
        <span class="u-ui u-num" id="mprog" style="font-size:var(--t-sm);color:var(--ink-faint)">
          0 / ${RUBRIC.length} critères notés</span>
      </div>
      <div id="done"></div>`;
    $('#review', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  acts(el, {
    start: startClock,
    finish,
    insert: (btn) => {
      const p = btn.dataset.p;
      const at = area.selectionStart ?? area.value.length;
      const before = area.value.slice(0, at);
      const sep = before && !/[\s\n]$/.test(before) ? ' ' : '';
      area.value = before + sep + p + ' ' + area.value.slice(at);
      area.focus();
      const pos = (before + sep + p + ' ').length;
      area.setSelectionRange(pos, pos);
      updateCount();
      store.saveDraft(item.id, { text: area.value });
    },
    mark: (btn) => {
      const k = btn.dataset.k, v = Number(btn.dataset.v);
      marks[k] = v;
      $$(`[data-act="mark"][data-k="${k}"]`, el).forEach(b => {
        const on = Number(b.dataset.v) === v;
        b.style.background = on ? 'var(--ink)' : '';
        b.style.borderColor = on ? 'var(--ink)' : '';
        b.querySelectorAll('b,small').forEach(x => { x.style.color = on ? 'var(--paper-2)' : ''; });
      });
      const n = Object.keys(marks).length;
      $('#mprog', el).textContent = `${n} / ${RUBRIC.length} critères notés`;
      $('[data-act="save"]', el).disabled = n < RUBRIC.length;
    },
    save: () => {
      const total = RUBRIC.length * 3;
      const score = RUBRIC.reduce((s, r) => s + (marks[r.k] || 0), 0);
      store.logResult('ee', { id: item.id, section: item.section, score, total });
      store.saveDraft(item.id, { selfScore: score });
      store.logMinutes(item.minutes, 'ecrire');

      const est = estimateScore('ee', score / total);
      const weak = RUBRIC.filter(r => marks[r.k] <= 1);
      $('#savebar', el).remove();
      $('#done', el).innerHTML = `
        <hr class="hair">
        <div class="score">
          <div class="score__n u-num">${score} / ${total}</div>
          <p class="score__l">${weak.length
            ? `À reprendre en priorité : ${weak.map(r => r.label.toLowerCase()).join(', ')}.`
            : 'Texte équilibré. Reprends le même sujet dans dix jours sans relire ta première version.'}</p>
          <span class="score__band u-ui u-num">estimation ${est} / 450 · NCLC ${nclcFor('ee', est)}</span>
        </div>
        <div class="row" style="margin-top:1.5rem;justify-content:center">
          <a class="btn" href="#/ecrire">Autre sujet</a>
          <a class="btn btn--ghost" href="#/atelier">Atelier ciblé</a>
        </div>`;
      $('#done', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  });

  return () => { if (stopClock) stopClock(); };
}

/* A mechanical pass. It cannot judge your French — it only catches the
   habits that are cheap to detect and expensive to leave in. */
function selfCheck(text, item) {
  const flags = [];
  const t = ' ' + text.toLowerCase().replace(/[’]/g, "'") + ' ';

  const oral = ['du coup', 'genre', 'super ', 'hyper ', 'ça va', 'bah ', 'ben ', 'y a ', 'trop bien'];
  const found = oral.filter(o => t.includes(o));
  if (found.length) flags.push({
    title: 'Tournures orales détectées',
    detail: `« ${found.join(' », « ')} » appartiennent à l’oral. Remplace-les : du coup → par conséquent ; y a → il y a ; super → remarquable.`,
  });

  // A negation written without "ne" is the single most common written slip.
  const missingNe = /\b(je|tu|il|elle|on|nous|vous|ils|elles|c')\s+\w+\s+pas\b/.test(t)
    && !/\bn[e']/.test(t);
  if (missingNe) flags.push({
    title: 'Négation peut-être incomplète',
    detail: 'À l’écrit, le « ne » ne tombe jamais : « je ne pense pas », et non « je pense pas ». Vérifie chaque « pas », « jamais », « plus », « rien ».',
  });

  const paras = text.trim().split(/\n\s*\n/).filter(Boolean);
  if (item.section === 'B' && paras.length < 3) flags.push({
    title: 'Un seul bloc de texte',
    detail: 'En section B, le correcteur attend des paragraphes : position, premier argument, concession et réfutation, conclusion. Sépare-les par une ligne vide.',
  });

  if (item.section === 'B' && !/(certes|il est vrai que|on peut l'admettre|sans doute)/.test(t)) flags.push({
    title: 'Aucune concession repérée',
    detail: 'Une argumentation qui n’admet rien plafonne. Ajoute « Certes… », puis réfute avec « il n’en demeure pas moins que… ».',
  });

  const mais = (t.match(/\bmais\b/g) || []).length;
  if (mais >= 3) flags.push({
    title: `« mais » employé ${mais} fois`,
    detail: 'Varie : en revanche, toutefois, néanmoins, or. La variété des connecteurs est un critère noté à part entière.',
  });

  if (item.section === 'B' && !/(madame|monsieur|salutations|agréer|cordialement)/.test(t)) flags.push({
    title: 'Formule d’appel ou de clôture absente',
    detail: 'Une lettre sans « Madame, Monsieur, » ni formule finale perd des points sur la tâche, même si le contenu est bon.',
  });

  return flags;
}
