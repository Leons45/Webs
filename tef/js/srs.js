// Spaced repetition over anything with an id: a phrase, a vocabulary chunk,
// a grammar drill. Wrong answers come back inside the same session; right
// ones drift out to weeks.

import * as store from './store.js';

const DAY = 86400000;
const MIN_EASE = 1.3;
const fresh = () => ({ ease: 2.5, interval: 0, reps: 0, due: 0, seen: 0 });

export const stateOf = (id) => store.srsOf(id) || fresh();

/** grade: 0 again · 1 hard · 2 good · 3 easy */
export function grade(id, g, tags = []) {
  const s = { ...stateOf(id) };
  s.seen += 1;
  const now = Date.now();

  if (g === 0) {
    s.reps = 0;
    s.interval = 0;
    s.ease = Math.max(MIN_EASE, s.ease - 0.2);
    s.due = now + 5 * 60000;
  } else {
    if (g === 1) s.ease = Math.max(MIN_EASE, s.ease - 0.15);
    if (g === 3) s.ease += 0.1;
    s.reps += 1;
    if (s.reps === 1)      s.interval = g === 1 ? 0.5 : 1;
    else if (s.reps === 2) s.interval = g === 1 ? 2 : 3;
    else                   s.interval = Math.round(s.interval * s.ease * (g === 1 ? 0.7 : 1) * 10) / 10;
    if (g === 3) s.interval = Math.round(s.interval * 1.3 * 10) / 10;
    s.interval = Math.min(s.interval, 365);
    s.due = now + s.interval * DAY;
  }

  store.putSrs(id, s);
  store.logAnswer({ tags, correct: g >= 2 });
  return s;
}

/** Due items first, then unseen, capped. */
export function queue(items, cap = 20) {
  const now = Date.now();
  const due = [], unseen = [];
  for (const it of items) {
    const s = store.srsOf(it.id);
    if (!s) unseen.push(it);
    else if (s.due <= now) due.push(it);
  }
  due.sort((a, b) => store.srsOf(a.id).due - store.srsOf(b.id).due);
  return [...due, ...unseen].slice(0, Math.max(cap, due.length));
}

export function counts(items) {
  const now = Date.now();
  let neu = 0, due = 0, learned = 0;
  for (const it of items) {
    const s = store.srsOf(it.id);
    if (!s) { neu += 1; continue; }
    if (s.due <= now) due += 1;
    if (s.interval >= 21) learned += 1;
  }
  return { new: neu, due, learned, total: items.length };
}

export const isLearned = (id) => (store.srsOf(id)?.interval || 0) >= 21;
