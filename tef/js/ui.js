// Small DOM helpers. No framework: the app is a handful of views that each
// render a string and bind their own handlers.

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function on(root, sel, type, fn) {
  $$(sel, root).forEach(el => el.addEventListener(type, fn));
}

/** Delegated click by [data-act]; handlers get (el, event). */
export function acts(root, map) {
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || !root.contains(el)) return;
    const fn = map[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
}

let toastTimer;
export function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.dataset.on = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.dataset.on = '0'; }, 2400);
}

/** Markdown-lite for passage text: **bold** and paragraph breaks. */
export function passageHTML(text) {
  return text.split(/\n{2,}/).map(block => {
    const html = esc(block)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return `<p>${html}</p>`;
  }).join('');
}

export const pct = (x) => (x == null ? '—' : Math.round(x * 100) + ' %');

export function words(text) {
  const t = (text || '').trim();
  return t ? t.split(/\s+/).length : 0;
}

export function mmss(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function dateLine(d = new Date()) {
  return d.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** A countdown that calls tick(secondsLeft) and done() at zero. */
export function countdown(seconds, tick, done) {
  let left = seconds;
  tick(left);
  const id = setInterval(() => {
    left -= 1;
    tick(left);
    if (left <= 0) { clearInterval(id); done && done(); }
  }, 1000);
  return () => clearInterval(id);
}

/** A stopwatch that calls tick(secondsElapsed). */
export function stopwatch(tick) {
  let n = 0;
  tick(0);
  const id = setInterval(() => { n += 1; tick(n); }, 1000);
  return { stop: () => clearInterval(id), elapsed: () => n };
}

export const icon = {
  play:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
  stop:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/></svg>',
  mic:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 1 0-7 0v5A3.5 3.5 0 0 0 12 15zm6-3.5a6 6 0 0 1-5 5.92V20h-2v-2.58A6 6 0 0 1 6 11.5h2a4 4 0 0 0 8 0z"/></svg>',
};

/* Tab-bar glyphs, drawn to read at 20px. */
export const tabIcon = {
  accueil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10.5 12 4l8 6.5V20H4z"/></svg>',
  reviser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M8 9.5h8M8 13h5"/></svg>',
  ecouter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13.5" width="3.5" height="6" rx="1.4"/><rect x="17.5" y="13.5" width="3.5" height="6" rx="1.4"/></svg>',
  lire:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 6.5S10 4.8 4.5 5.4v13C10 17.8 12 19.5 12 19.5s2-1.7 7.5-1.1v-13C14 4.8 12 6.5 12 6.5z"/><path d="M12 6.5v13"/></svg>',
  ecrire:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h16"/><path d="M15.2 4.8 7 13l-1 4 4-1 8.2-8.2a1.7 1.7 0 0 0-2.4-2.4z"/></svg>',
  progres: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V8M10 19V5M16 19v-7M22 19H3"/></svg>',
};
