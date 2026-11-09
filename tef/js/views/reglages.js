import { esc, acts, $, toast } from '../ui.js';
import * as store from '../store.js';
import * as speech from '../speech.js';

export default function reglages(el, { go }) {
  const s = store.settings();
  const voices = speech.frenchVoices();

  el.innerHTML = `
  <div class="view">
    <div class="ph">
      <h1>Réglages</h1>
      <p class="ph__sub">Tout est enregistré sur cet appareil uniquement. Aucun compte, aucun serveur,
        aucune donnée qui sorte du navigateur — ce qui veut dire aussi qu’une sauvegarde manuelle
        est la seule façon de ne rien perdre.</p>
    </div>

    <div class="stack stack--lg">
      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Rythme</h2>
        <label class="field">
          <span>Objectif quotidien — cartes à traiter par jour</span>
          <input class="input u-num" type="number" id="goal" min="5" max="120" step="5" value="${s.dailyGoal}">
        </label>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          Vingt par jour tenus six jours sur sept battent soixante le dimanche : la révision espacée
          ne fonctionne que si les échéances sont respectées à peu près à la bonne date.
        </p>
        <label class="field">
          <span>Niveau NCLC visé sur chaque compétence</span>
          <select class="select" id="target">
            ${[4, 5, 6, 7, 8, 9, 10].map(n => `
              <option value="${n}"${n === s.target ? ' selected' : ''}>NCLC ${n}</option>`).join('')}
          </select>
        </label>
        <label class="field">
          <span>Date de l’examen — facultatif</span>
          <input class="input" type="date" id="exam" value="${esc(s.examDate)}">
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Voix</h2>
        ${voices.length ? `
          <label class="field">
            <span>Voix utilisée pour l’écoute et la dictée</span>
            <select class="select" id="voice">
              <option value="">Automatique — français canadien si disponible</option>
              ${voices.map(v => `
                <option value="${esc(v.name)}"${v.name === s.voice ? ' selected' : ''}>
                  ${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
            </select>
          </label>
          <div class="row">
            <button class="btn btn--ghost" data-act="test">Essayer la voix</button>
          </div>`
        : `<p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
             Aucune voix française n’est installée dans ce navigateur. Chrome, Edge et Safari en
             fournissent une ; sous Windows, ajoute le français dans Paramètres → Heure et langue → Voix,
             puis rouvre cette page.</p>`}
        <label class="field">
          <span>Vitesse de lecture par défaut</span>
          <input class="input u-num" type="number" id="rate" min="0.5" max="1.2" step="0.05" value="${s.rate}">
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Apparence</h2>
        <label class="field">
          <span>Thème</span>
          <select class="select" id="theme">
            <option value="auto"${s.theme === 'auto' ? ' selected' : ''}>Suivre le système</option>
            <option value="light"${s.theme === 'light' ? ' selected' : ''}>Clair</option>
            <option value="dark"${s.theme === 'dark' ? ' selected' : ''}>Sombre</option>
          </select>
        </label>
      </section>

      <section class="sheet stack">
        <h2 style="font-size:var(--t-md)">Sauvegarde</h2>
        <p style="font-size:var(--t-sm);color:var(--ink-soft);margin:0">
          Vider le cache du navigateur efface ta progression. Exporte un fichier de temps en temps,
          surtout avant de changer d’appareil.</p>
        <div class="row">
          <button class="btn btn--ghost" data-act="export">Exporter un fichier</button>
          <button class="btn btn--ghost" data-act="import">Importer un fichier</button>
          <input type="file" id="file" accept="application/json,.json" class="sr">
        </div>
        <hr class="hair" style="margin:.5rem 0">
        <div class="row">
          <button class="btn btn--rouge" data-act="reset">Tout effacer</button>
          <span class="u-ui" style="font-size:var(--t-xs);color:var(--ink-faint)">
            irréversible — demande confirmation</span>
        </div>
      </section>
    </div>

    <div class="row" style="margin-top:2rem"><a class="btn btn--plain" href="#/">Retour</a></div>
  </div>`;

  const bind = (id, key, cast = (v) => v) => {
    const node = $('#' + id, el);
    if (!node) return;
    node.addEventListener('change', () => {
      store.setSetting(key, cast(node.value));
      if (key === 'theme') location.reload();
      else toast('Réglage enregistré');
    });
  };

  bind('goal', 'dailyGoal', (v) => Math.max(5, Math.min(120, Number(v) || 20)));
  bind('target', 'target', Number);
  bind('exam', 'examDate');
  bind('voice', 'voice');
  bind('rate', 'rate', (v) => Math.max(0.5, Math.min(1.2, Number(v) || 0.95)));
  bind('theme', 'theme');

  acts(el, {
    test: () => speech.say(
      'Bonjour. Elle n’est pas encore allée chercher les clés. Voici la voix qui lira les dictées.',
      { rate: store.settings().rate, voiceName: store.settings().voice }),

    export: () => {
      const blob = new Blob([store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `atelier-tef-${store.today()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast('Fichier exporté');
    },

    import: () => $('#file', el).click(),

    reset: () => {
      if (!confirm('Effacer toute la progression : cartes, scores, brouillons et séries ? Cette action est irréversible.')) return;
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
    } catch (err) {
      toast('Fichier illisible');
      console.warn(err);
    }
  });
}
