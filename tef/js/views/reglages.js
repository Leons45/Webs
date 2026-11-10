import { esc, acts, $, toast } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';
import * as fx from '../fx.js';

export default function reglages(el, { go }) {
  const s = store.settings();
  const a = store.assist();
  const voices = speech.frenchVoices();

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Réglages${a ? '<span class="gloss" style="font-size:var(--t-base)">Settings</span>' : ''}</h1>
      <p class="ph__sub">Tout est enregistré sur cet appareil. Aucun compte, aucun serveur —
        et donc aucune sauvegarde automatique ailleurs.
        ${a ? '<span class="gloss">Everything is stored on this device. No account, no server — and so no automatic backup anywhere else.</span>' : ''}</p>
    </div>

    <div class="stack stack--lg">
      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Le programme${a ? '<span class="gloss">The programme</span>' : ''}</h2>
        <label class="field">
          <span>Heures d'étude par jour${a ? ' · Study hours per day' : ''}</span>
          <input class="input u-num" type="number" id="hours" min="1" max="8" step="0.5" value="${s.dailyHours}">
        </label>
        <label class="field">
          <span>Heure de départ${a ? ' · Start time' : ''}</span>
          <input class="input u-num" type="number" id="startHour" min="4" max="20" step="1" value="${s.startHour}">
        </label>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          Les durées des blocs s'ajustent automatiquement. La proportion reste la même :
          un peu moins de la moitié du temps passe à parler, et c'est l'essentiel du dispositif.
          ${a ? '<span class="gloss">Block lengths adjust automatically. The proportion stays the same: just under half the time is spent speaking, which is the whole point.</span>' : ''}
        </p>
        <label class="field">
          <span>Date de l'examen${a ? ' · Exam date' : ''}</span>
          <input class="input" type="date" id="exam" value="${esc(s.examDate)}">
        </label>
        <label class="field">
          <span>Date de début du programme${a ? ' · Programme start date' : ''}</span>
          <input class="input" type="date" id="startDate" value="${esc(s.startDate)}">
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Anglais${a ? '<span class="gloss">English</span>' : ''}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          L'anglais est affiché partout par défaut. Coupe-le épreuve par épreuve quand tu n'en
          as plus besoin : c'est le meilleur signe de progrès que tu puisses t'offrir.
          ${a ? '<span class="gloss">English is shown everywhere by default. Switch it off task by task as you stop needing it — it is the clearest progress signal you can give yourself.</span>' : ''}
        </p>
        <div class="row">
          <button class="assist" data-act="toggle" aria-pressed="${a}">
            ${a ? 'English on' : 'English off'}</button>
        </div>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Son et effets${a ? '<span class="gloss">Sound & effects</span>' : ''}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          Petits retours sonores quand une réponse est juste ou fausse, et une estampe
          quand un bloc est terminé. Rien n'est enregistré ni envoyé.
          ${a ? '<span class="gloss">Small tones when an answer is right or wrong, and a stamp when a block is done. Nothing is recorded or sent.</span>' : ''}
        </p>
        <div class="row">
          <button class="assist" data-act="sound" aria-pressed="${s.sound}">
            ${s.sound ? 'Son activé' : 'Son coupé'}</button>
          <button class="btn btn--ghost" data-act="testsound">Essayer</button>
        </div>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Voix${a ? '<span class="gloss">Voice</span>' : ''}</h2>
        ${voices.length ? `
          <label class="field">
            <span>Voix française${a ? ' · French voice' : ''}</span>
            <select class="select" id="voice">
              <option value="">Automatique — français canadien si disponible</option>
              ${voices.map(v => `<option value="${esc(v.name)}"${v.name === s.voice ? ' selected' : ''}>
                ${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
            </select>
          </label>
          <div class="row"><button class="btn btn--ghost" data-act="test">Essayer</button></div>`
        : `<p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
             Aucune voix française détectée. Chrome, Edge et Safari en fournissent une ;
             sous Windows, ajoute le français dans Paramètres → Heure et langue → Voix,
             puis rouvre cette page.
             ${a ? '<span class="gloss">No French voice detected. Chrome, Edge and Safari ship one; on Windows add French under Settings → Time & language → Speech.</span>' : ''}
           </p>`}
        <label class="field">
          <span>Vitesse de lecture${a ? ' · Playback speed' : ''}</span>
          <input class="input u-num" type="number" id="rate" min="0.5" max="1.2" step="0.05" value="${s.rate}">
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Apparence${a ? '<span class="gloss">Appearance</span>' : ''}</h2>
        <label class="field">
          <span>Thème${a ? ' · Theme' : ''}</span>
          <select class="select" id="theme">
            <option value="auto"${s.theme === 'auto' ? ' selected' : ''}>Suivre le système</option>
            <option value="light"${s.theme === 'light' ? ' selected' : ''}>Clair</option>
            <option value="dark"${s.theme === 'dark' ? ' selected' : ''}>Sombre</option>
          </select>
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Sauvegarde${a ? '<span class="gloss">Backup</span>' : ''}</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          Vider le cache du navigateur efface ta progression. Exporte un fichier avant de
          changer d'appareil.
          ${a ? '<span class="gloss">Clearing browser data erases your progress. Export a file before switching devices.</span>' : ''}
        </p>
        <div class="row">
          <button class="btn btn--ghost" data-act="export">Exporter</button>
          <button class="btn btn--ghost" data-act="import">Importer</button>
          <input type="file" id="file" accept="application/json,.json" class="sr">
        </div>
        <hr class="hair" style="margin:.5rem 0">
        <div class="row">
          <button class="btn btn--rouge" data-act="reset">Tout effacer</button>
          <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">irréversible</span>
        </div>
      </section>
    </div>

    <div class="row" style="margin-top:2rem"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  const bind = (id, key, cast = (v) => v, reload = false) => {
    const node = $('#' + id, el);
    if (!node) return;
    node.addEventListener('change', () => {
      store.setSetting(key, cast(node.value));
      if (reload) location.reload(); else toast('Enregistré');
    });
  };

  bind('hours', 'dailyHours', (v) => Math.max(1, Math.min(8, Number(v) || 3.5)));
  bind('startHour', 'startHour', (v) => Math.max(4, Math.min(20, Number(v) || 7)));
  bind('exam', 'examDate');
  bind('startDate', 'startDate');
  bind('voice', 'voice');
  bind('rate', 'rate', (v) => Math.max(0.5, Math.min(1.2, Number(v) || 0.9)));
  bind('theme', 'theme', (v) => v, true);

  acts(el, {
    toggle: () => { store.toggleAssist(); go('#/reglages'); },

    sound: () => {
      store.setSetting('sound', !store.settings().sound);
      if (store.settings().sound) fx.sndRight();
      go('#/reglages');
    },

    testsound: () => fx.celebrate('Bravo'),

    test: () => speech.say(
      'Bonjour. Pourriez-vous me préciser le montant du loyer, s'il vous plaît ?',
      { rate: store.settings().rate, voiceName: store.settings().voice }),

    export: () => {
      const blob = new Blob([store.exportJSON()], { type: 'application/json' });
      const a2 = document.createElement('a');
      a2.href = URL.createObjectURL(blob);
      a2.download = `atelier-${store.today()}.json`;
      a2.click();
      setTimeout(() => URL.revokeObjectURL(a2.href), 1000);
      toast('Fichier exporté');
    },

    import: () => $('#file', el).click(),

    reset: () => {
      if (!confirm('Effacer toute la progression : minutes de parole, leçons, phrases, brouillons ? Irréversible.')) return;
      store.reset();
      toast('Progression effacée');
      go('#/');
    },
  });

  $('#file', el).addEventListener('change', async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      store.importJSON(await f.text());
      toast('Sauvegarde importée');
      setTimeout(() => location.reload(), 600);
    } catch (err) { toast('Fichier illisible'); console.warn(err); }
  });
}
