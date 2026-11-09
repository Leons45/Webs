// Single source of truth. Everything lives in localStorage so the app works
// offline and keeps no account. Export/import gives you a real backup.

const KEY = 'tef.atelier.v1';

const todayKey = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

const blank = () => ({
  version: 1,
  created: todayKey(),
  settings: {
    dailyGoal: 20,          // cards due to clear per day
    examDate: '',           // ISO date, optional
    target: 7,              // NCLC target per skill
    voice: '',              // preferred speechSynthesis voice name
    rate: 0.95,             // TTS speed
    theme: 'auto',
  },
  // SRS state keyed by card id
  cards: {},
  // per-tag running accuracy  { tag: { seen, right } }
  tags: {},
  // day log  { '2026-11-09': { cards, right, minutes, acts: {...} } }
  days: {},
  // module results  { ce:[{id,score,total,at}], co:[...], ee:[...], eo:[...] }
  results: { ce: [], co: [], ee: [], eo: [] },
  // saved writing drafts  { promptId: { text, at, minutes, selfScore } }
  drafts: {},
  // oral session self-assessments
  oral: [],
  streak: { current: 0, best: 0, last: '' },
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    return { ...blank(), ...parsed, settings: { ...blank().settings, ...(parsed.settings || {}) } };
  } catch {
    return blank();
  }
}

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Storage unavailable — progress will not persist.', e); }
  }, 120);
}

/* ── reads ─────────────────────────────────────────────────────── */

export const get = () => state;
export const settings = () => state.settings;
export const today = () => todayKey();

export function day(key = todayKey()) {
  return state.days[key] || { cards: 0, right: 0, minutes: 0, acts: {} };
}

export function tagAccuracy() {
  return Object.entries(state.tags)
    .filter(([, v]) => v.seen >= 3)
    .map(([tag, v]) => ({ tag, seen: v.seen, right: v.right, acc: v.right / v.seen }))
    .sort((a, b) => a.acc - b.acc);
}

export function lastDays(count) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    out.push({ key: k, date: d, ...day(k) });
  }
  return out;
}

export function daysUntilExam() {
  const e = state.settings.examDate;
  if (!e) return null;
  const ms = new Date(e + 'T00:00:00') - new Date(todayKey() + 'T00:00:00');
  return Math.round(ms / 86400000);
}

/* ── writes ────────────────────────────────────────────────────── */

export function setSetting(k, v) {
  state.settings[k] = v;
  save();
}

export function putCard(id, srs) {
  state.cards[id] = srs;
  save();
}

export function logAnswer({ tags = [], correct, activity = 'review' }) {
  const k = todayKey();
  const d = state.days[k] || (state.days[k] = { cards: 0, right: 0, minutes: 0, acts: {} });
  d.cards += 1;
  if (correct) d.right += 1;
  d.acts[activity] = (d.acts[activity] || 0) + 1;
  for (const t of tags) {
    const e = state.tags[t] || (state.tags[t] = { seen: 0, right: 0 });
    e.seen += 1;
    if (correct) e.right += 1;
  }
  touchStreak();
  save();
}

export function logMinutes(min, activity) {
  const k = todayKey();
  const d = state.days[k] || (state.days[k] = { cards: 0, right: 0, minutes: 0, acts: {} });
  d.minutes += min;
  if (activity) d.acts[activity] = (d.acts[activity] || 0) + 1;
  touchStreak();
  save();
}

export function logResult(module, entry) {
  state.results[module] = state.results[module] || [];
  state.results[module].push({ ...entry, at: new Date().toISOString() });
  if (state.results[module].length > 60) state.results[module].shift();
  touchStreak();
  save();
}

export function saveDraft(promptId, patch) {
  state.drafts[promptId] = { ...(state.drafts[promptId] || {}), ...patch, at: new Date().toISOString() };
  save();
}
export const draft = (id) => state.drafts[id] || null;

export function logOral(entry) {
  state.oral.push({ ...entry, at: new Date().toISOString() });
  if (state.oral.length > 60) state.oral.shift();
  touchStreak();
  save();
}

function touchStreak() {
  const k = todayKey();
  const s = state.streak;
  if (s.last === k) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  s.current = s.last === todayKey(y) ? s.current + 1 : 1;
  s.last = k;
  s.best = Math.max(s.best, s.current);
}

/* Streak shown in the UI must not count a day where nothing happened. */
export function liveStreak() {
  const s = state.streak;
  if (!s.last) return 0;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (s.last === todayKey() || s.last === todayKey(y)) return s.current;
  return 0;
}

/* ── backup ────────────────────────────────────────────────────── */

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !('cards' in parsed)) {
    throw new Error('Ce fichier ne contient pas une sauvegarde de l’Atelier.');
  }
  state = { ...blank(), ...parsed, settings: { ...blank().settings, ...(parsed.settings || {}) } };
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function reset() {
  state = blank();
  localStorage.setItem(KEY, JSON.stringify(state));
}
