// Writing — the secondary track. One short task, timed, with a connector
// bank and a mechanical pass that catches the habits that are cheap to
// detect and expensive to leave in.

import { esc, acts, $, $$, words, mmss, countdown, toast } from '../ui.js';
import * as store from '../store.js';
import * as fx from '../fx.js';
import { WRITING } from '../data/writing.js';
import { PHRASES, byGroup } from '../data/phrases.js';

const BANK = [
  { fr:'Annoncer sa position', en:'State your position', list:['Il me semble que…','Je suis d’avis que…','Force est de constater que…'] },
  { fr:'Ajouter', en:'Add', list:['Par ailleurs,','En outre,','Qui plus est,','D’autant plus que…'] },
  { fr:'Opposer', en:'Contrast', list:['En revanche,','Toutefois,','Néanmoins,','Or,'] },
  { fr:'Concéder', en:'Concede', list:['Certes…, mais…','Il n’en demeure pas moins que…','On peut l’admettre ; reste que…'] },
  { fr:'Cause', en:'Cause', list:['Étant donné que…','Dans la mesure où…','En raison de…'] },
  { fr:'Conséquence', en:'Consequence', list:['Par conséquent,','C’est pourquoi…','Dès lors,'] },
  { fr:'Conclure', en:'Conclude', list:['En définitive,','En somme,','Tout bien considéré,'] },
  { fr:'Lettre', en:'Letter', list:['Madame, Monsieur,','Je me permets de vous écrire afin de…','Veuillez agréer mes salutations distinguées.'] },
];

export default function ecrire(el, { params, go }) {
  const id = params.get('p');
  const item = WRITING.find(w => w.id === id);
  return item ? compose(el, item) : index(el, go);
}

function index(el, go) {
  const a = store.assist();
  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Écrire${a ? '<span class="gloss" style="font-size:var(--t-base)">Writing</span>' : ''}</h1>
      <p class="ph__sub">Une tâche par jour, pas plus. L’écrit progresse vite une fois que la
        grammaire tient, et il te sert surtout à fixer ce que tu diras ensuite à l’oral.
        ${a ? '<span class="gloss">One task a day, no more. Writing improves quickly once the grammar holds, and mainly serves to fix what you will later say aloud.</span>' : ''}</p>
    </div>

    <!-- Formules shortcut -->
    <div class="sheet" style="margin-bottom:2rem;display:flex;align-items:center;
         justify-content:space-between;gap:1rem;flex-wrap:wrap">
      <div>
        <b style="font:600 var(--t-base)/1.3 var(--ff-ui)">
          Formules à mémoriser${a ? '<span class="gloss" style="font-weight:400"> · Writing chunks</span>' : ''}
        </b>
        <p style="font-size:var(--t-sm);color:var(--ink-faint);margin:.2rem 0 0">
          50 phrases fixes pour Section A et B${a ? ' · 50 fixed phrases for Sections A and B' : ''}
        </p>
      </div>
      <a class="btn" href="#/chunks" style="white-space:nowrap;flex-shrink:0">
        Étudier →${a ? '<span class="gloss">Study</span>' : ''}
      </a>
    </div>

    ${['A', 'B'].map(sec => `
      <section style="margin-bottom:2rem">
        <h2 style="font-size:var(--t-md);margin-bottom:.3rem">
          Section ${sec} — ${sec === 'A' ? 'continuer un récit au passé' : 'défendre un avis'}
          ${a ? `<span class="gloss">${sec === 'A' ? 'continue a past-tense narrative' : 'defend an opinion'}</span>` : ''}</h2>
        <div class="grid2" style="margin-top:.9rem">
          ${WRITING.filter(w => w.section === sec).map(w => {
            const d = store.draft(w.id);
            return `
            <button class="sheet" data-act="open" data-id="${esc(w.id)}"
                    style="text-align:left;display:grid;gap:.5rem;cursor:pointer">
              <b style="font:500 var(--t-base)/1.25 var(--ff-text)">${esc(w.title)}
                ${a ? `<span class="gloss">${esc(w.titleEn)}</span>` : ''}</b>
              <span class="u-ui u-num" style="font-size:var(--t-xs);color:var(--ink-faint)">
                ${w.minWords} mots · ${w.minutes} min${d && d.text ? ' · brouillon' : ''}</span>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('')}
  </div>`;

  acts(el, { open: (b) => go('#/ecrire?p=' + b.dataset.id) });
}

function compose(el, item) {
  const a = store.assist();
  const saved = store.draft(item.id) || {};
  let stopClock = null, running = false, marked = false;

  el.innerHTML = `
  <div class="view view--wide">
    <div class="row row--split" style="margin-bottom:1.25rem">
      <span class="u-ui" style="font-size:var(--t-sm);color:var(--ink-faint)">
        Écrire · section ${item.section}</span>
      <div class="row" style="gap:.9rem">
        <span class="timer" id="clock"><span class="u-num" id="t">${mmss(item.minutes * 60)}</span></span>
        <a class="btn btn--plain" href="#/ecrire">Quitter</a>
      </div>
    </div>

    <div class="ph" style="margin-bottom:1.25rem">
      <h1 style="font-size:var(--t-xl)">${esc(item.title)}
        ${a ? `<span class="gloss" style="font-size:var(--t-sm)">${esc(item.titleEn)}</span>` : ''}</h1>
    </div>

    <div class="passage prose" style="max-width:58ch;margin-bottom:1.25rem">
      <p>${esc(item.lead)}</p>
      ${a ? `<p class="gloss">${esc(item.leadEn)}</p>` : ''}
      <p style="margin-bottom:0"><strong>Consigne.</strong> ${esc(item.task)}
        ${a ? `<span class="gloss">${esc(item.taskEn)}</span>` : ''}</p>
    </div>

    <div class="compose">
      <div>
        <div class="row row--split" style="margin-bottom:.6rem">
          <span class="wordcount" id="wc" data-met="0">
            <b class="u-num">0</b><span class="u-ui">/ ${item.minWords} mots</span>
          </span>
          <button class="btn btn--plain" data-act="start" id="startbtn">Lancer le chronomètre</button>
        </div>
        <textarea class="area area--ruled" id="draft" rows="14" spellcheck="false"
          placeholder="${item.section === 'A' ? 'Commence par un complément de temps : « Quelques minutes plus tard, … »' : 'Commence par la formule d’appel, puis annonce ta position dès la première phrase.'}">${esc(saved.text || '')}</textarea>
        <div class="row" style="margin-top:1rem">
          <button class="btn btn--lg" data-act="finish">Terminer et relire</button>
          <span class="u-ui" id="savedat" style="font-size:var(--t-xs);color:var(--ink-faint)"></span>
        </div>
      </div>

      <aside class="stack">
        <div class="sheet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.6rem">
            Avant de rendre${a ? ' · Before you submit' : ''}</div>
          <div class="checklist">
            ${item.checks.map((c, ci) => `
              <label class="check">
                <input type="checkbox" data-ci="${ci}">
                <span>${esc(c.fr)}${a ? `<span class="gloss">${esc(c.en)}</span>` : ''}</span>
              </label>`).join('')}
          </div>
        </div>

        <div class="sheet">
          <div class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint);margin-bottom:.6rem">
            Connecteurs — clique pour insérer</div>
          <div class="bank">
            ${BANK.map(g => `
              <div class="bank__g">
                <b>${esc(g.fr)}${a ? ` · ${esc(g.en)}` : ''}</b>
                ${g.list.map(p => `<button class="bank__p" data-act="insert" data-p="${esc(p)}">${esc(p)}</button>`).join('')}
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
      const s = $('#savedat', el); if (s) s.textContent = 'brouillon enregistré';
    }, 600);
  });
  updateCount();

  function startClock() {
    if (running) return;
    running = true;
    const b = $('#startbtn', el);
    b.textContent = 'Chronomètre en marche';
    b.disabled = true;
    stopClock = countdown(item.minutes * 60, (s) => {
      const t = $('#t', el); if (t) t.textContent = mmss(s);
      if (s <= 120) { const c = $('#clock', el); if (c) c.dataset.low = '1'; }
    }, () => { toast('Temps écoulé.'); finish(); });
  }

  function finish() {
    if (marked) return;
    marked = true;
    if (stopClock) { stopClock(); stopClock = null; }
    const text = area.value;
    const n = words(text);
    store.saveDraft(item.id, { text });
    store.logMinutes(item.minutes);
    area.readOnly = true;
    $('[data-act="finish"]', el).disabled = true;

    try {
      const raw = sessionStorage.getItem('atelier.block');
      if (raw) {
        store.completeBlock(JSON.parse(raw).id, 0);
        sessionStorage.removeItem('atelier.block');
      }
    } catch {}

    fx.celebrate('Rendu');
    const flags = selfCheck(text, item);
    $('#review', el).innerHTML = `
      <hr class="hair">
      <h2 style="font-size:var(--t-md);margin-bottom:.4rem">Relecture${a ? '<span class="gloss">Review</span>' : ''}</h2>
      <p style="font-size:var(--t-sm);color:var(--ink-soft);max-width:56ch;margin-bottom:1.25rem">
        ${n >= item.minWords
          ? `${n} mots : la longueur est atteinte.`
          : `${n} mots : en dessous de ${item.minWords}, la note plafonne quelle que soit la qualité.`}
        Relis une fois pour les accords, une fois à voix haute pour le rythme —
        et cette seconde lecture compte aussi comme de la parole.
      </p>
      ${flags.length
        ? `<div class="stack">${flags.map(f => `
            <div class="verdict" data-ok="0"><b>${esc(f.fr)}</b><p>${esc(f.detail)}</p></div>`).join('')}</div>`
        : `<div class="verdict" data-ok="1"><b>Rien de mécanique à signaler</b>
             <p>Ce qui ne remplace pas ton œil sur les accords et les auxiliaires.</p></div>`}
      <div class="row" style="margin-top:1.5rem">
        <a class="btn" href="#/ecrire">Autre sujet</a>
        <a class="btn btn--ghost" href="#/">Retour au programme</a>
      </div>`;
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
  });

  return () => { if (stopClock) stopClock(); };
}

function selfCheck(text, item) {
  const flags = [];
  const t = ' ' + text.toLowerCase().replace(/[’]/g, "'") + ' ';

  const oral = ['du coup', 'genre', 'super ', 'hyper ', 'y a ', 'bah ', 'ben '];
  const found = oral.filter(o => t.includes(o));
  if (found.length) flags.push({
    fr: 'Tournures orales détectées',
    detail: `« ${found.join(' », « ')} » appartiennent à l’oral. du coup → par conséquent ; y a → il y a.`,
  });

  if (/\b(je|tu|il|elle|on|nous|vous|ils|elles)\s+\w+\s+pas\b/.test(t) && !/\bn[e']/.test(t)) {
    flags.push({
      fr: 'Négation peut-être incomplète',
      detail: 'À l’écrit le « ne » ne tombe jamais : « je ne pense pas ». Vérifie chaque pas, jamais, plus, rien.',
    });
  }

  const paras = text.trim().split(/\n\s*\n/).filter(Boolean);
  if (item.section === 'B' && paras.length < 3) flags.push({
    fr: 'Un seul bloc de texte',
    detail: 'Le correcteur attend des paragraphes : position, argument, concession, conclusion.',
  });

  if (item.section === 'B' && !/(certes|il est vrai que|sans doute|on peut l'admettre)/.test(t)) flags.push({
    fr: 'Aucune concession repérée',
    detail: 'Une argumentation qui n’admet rien plafonne. Ajoute « Certes… », puis réfute.',
  });

  const mais = (t.match(/\bmais\b/g) || []).length;
  if (mais >= 3) flags.push({
    fr: `« mais » employé ${mais} fois`,
    detail: 'Varie : en revanche, toutefois, néanmoins, or. La variété des connecteurs est notée.',
  });

  if (item.section === 'B' && !/(madame|monsieur|salutations|agréer|cordialement)/.test(t)) flags.push({
    fr: 'Formule d’appel ou de clôture absente',
    detail: 'Une lettre sans « Madame, Monsieur, » ni formule finale perd des points sur la tâche.',
  });

  return flags;
}
