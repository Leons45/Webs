// All state, in localStorage. No account, no server.
// The one number this app is built around is speakingSeconds.

const KEY = 'atelier.tef.v2';

const dayKey = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

const blank = () => ({
  version: 2,
  created: dayKey(),
  settings: {
    dailyHours: 3.5,
    startHour: 7,
    examDate: '2027-02-15',
    startDate: dayKey(),
    targetCLB: 7,
    assist: true,        // show English alongside French
    voice: '',
    rate: 0.9,
    theme: 'auto',
  },
  srs: {},               // itemId -> { ease, interval, reps, due, seen }
  tags: {},              // tag -> { seen, right }
  days: {},              // '2026-11-09' -> { minutes, speakingSeconds, items, right, blocks:{} }
  lessons: {},           // grammar lesson id -> { done, score, at }
  speaking: [],          // every spoken task logged
  drafts: {},
  streak: { current: 0, best: 0, last: '' },
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    const base = blank();
    return { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) } };
  } catch { return blank(); }
}

let timer;
function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Storage unavailable — progress will not persist.', e); }
  }, 120);
}

/* ── reads ─────────────────────────────────────────────────────── */

export const get = () => state;
export const settings = () => state.settings;
export const today = () => dayKey();
export const assist = () => state.settings.assist;

export function day(k = dayKey()) {
  return state.days[k] || { minutes: 0, speakingSeconds: 0, items: 0, right: 0, blocks: {} };
}

export function lastDays(count) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    out.push({ key: k, date: d, ...day(k) });
  }
  return out;
}

export function daysUntilExam() {
  const e = state.settings.examDate;
  if (!e) return null;
  return Math.round((new Date(e + 'T00:00:00') - new Date(dayKey() + 'T00:00:00')) / 86400000);
}

/** Which week of the programme you are in, 1-based. */
export function weekNumber() {
  const start = state.settings.startDate || state.created;
  const diff = Math.floor((new Date(dayKey()) - new Date(start)) / 86400000);
  return Math.max(1, Math.floor(diff / 7) + 1);
}

export function tagAccuracy() {
  return Object.entries(state.tags)
    .filter(([, v]) => v.seen >= 3)
    .map(([tag, v]) => ({ tag, ...v, acc: v.right / v.seen }))
    .sort((a, b) => a.acc - b.acc);
}

export const lesson = (id) => state.lessons[id] || null;
export const draft = (id) => state.drafts[id] || null;

/** Total minutes spoken, all time and over the last seven days. */
export function speakingTotals() {
  const all = Object.values(state.days).reduce((s, d) => s + (d.speakingSeconds || 0), 0);
  const week = lastDays(7).reduce((s, d) => s + (d.speakingSeconds || 0), 0);
  return { allMinutes: Math.round(all / 60), weekMinutes: Math.round(week / 60) };
}

export function totalHours() {
  const mins = Object.values(state.days).reduce((s, d) => s + (d.minutes || 0), 0);
  return mins / 60;
}

/* ── writes ────────────────────────────────────────────────────── */

export function setSetting(k, v) { state.settings[k] = v; save(); }
export function toggleAssist() { state.settings.assist = !state.settings.assist; save(); return state.settings.assist; }

function dayRef() {
  const k = dayKey();
  return state.days[k] || (state.days[k] = { minutes: 0, speakingSeconds: 0, items: 0, right: 0, blocks: {} });
}

export function putSrs(id, s) { state.srs[id] = s; save(); }
export const srsOf = (id) => state.srs[id] || null;

export function logAnswer({ tags = [], correct }) {
  const d = dayRef();
  d.items += 1;
  if (correct) d.right += 1;
  for (const t of tags) {
    const e = state.tags[t] || (state.tags[t] = { seen: 0, right: 0 });
    e.seen += 1;
    if (correct) e.right += 1;
  }
  touchStreak();
  save();
}

export function logMinutes(min) {
  dayRef().minutes += min;
  touchStreak();
  save();
}

/** The number that matters. Call it whenever a recording or drill ends. */
export function logSpeaking(seconds, entry) {
  const d = dayRef();
  d.speakingSeconds += Math.max(0, Math.round(seconds));
  d.minutes += Math.round(seconds / 60);
  if (entry) {
    state.speaking.push({ ...entry, seconds: Math.round(seconds), at: new Date().toISOString() });
    if (state.speaking.length > 200) state.speaking.shift();
  }
  touchStreak();
  save();
}

export function completeBlock(blockId, minutes) {
  const d = dayRef();
  d.blocks[blockId] = true;
  if (minutes) d.minutes += minutes;
  touchStreak();
  save();
}

export const blockDone = (id) => !!day().blocks[id];

export function saveLesson(id, score, total) {
  state.lessons[id] = { done: true, score, total, at: new Date().toISOString() };
  touchStreak();
  save();
}

export function saveDraft(id, patch) {
  state.drafts[id] = { ...(state.drafts[id] || {}), ...patch, at: new Date().toISOString() };
  save();
}

function touchStreak() {
  const k = dayKey();
  const s = state.streak;
  if (s.last === k) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  s.current = s.last === dayKey(y) ? s.current + 1 : 1;
  s.last = k;
  s.best = Math.max(s.best, s.current);
}

export function liveStreak() {
  const s = state.streak;
  if (!s.last) return 0;
  const y = new Date(); y.setDate(y.getDate() - 1);
  return (s.last === dayKey() || s.last === dayKey(y)) ? s.current : 0;
}

/* ── backup ────────────────────────────────────────────────────── */

export const exportJSON = () => JSON.stringify(state, null, 2);

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || !('srs' in parsed)) {
    throw new Error('Not an Atelier backup.');
  }
  const base = blank();
  state = { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) } };
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function reset() {
  state = blank();
  localStorage.setItem(KEY, JSON.stringify(state));
}
