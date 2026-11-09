// Spaced repetition, SM-2 with a shorter first step so a card you got wrong
// comes back inside the same session rather than tomorrow.

import { CARDS } from './data/cards.js';
import * as store from './store.js';

const DAY = 86400000;
const MIN_EASE = 1.3;

const fresh = () => ({ ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0, seen: 0 });

export function stateOf(id) {
  return store.get().cards[id] || fresh();
}

/** grade: 0 again · 1 difficile · 2 correct · 3 facile */
export function grade(card, g) {
  const s = { ...stateOf(card.id) };
  s.seen += 1;
  const now = Date.now();

  if (g === 0) {
    s.lapses += 1;
    s.reps = 0;
    s.interval = 0;
    s.ease = Math.max(MIN_EASE, s.ease - 0.2);
    s.due = now + 6 * 60000;                 // back in ~6 minutes
  } else {
    if (g === 1) s.ease = Math.max(MIN_EASE, s.ease - 0.15);
    if (g === 3) s.ease = s.ease + 0.1;

    s.reps += 1;
    if (s.reps === 1)      s.interval = g === 1 ? 0.5 : 1;
    else if (s.reps === 2) s.interval = g === 1 ? 2 : 3;
    else                   s.interval = Math.round(s.interval * s.ease * (g === 1 ? 0.7 : 1) * 10) / 10;

    if (g === 3) s.interval = Math.round(s.interval * 1.3 * 10) / 10;
    s.interval = Math.min(s.interval, 365);
    s.due = now + s.interval * DAY;
  }

  store.putCard(card.id, s);
  store.logAnswer({ tags: card.tags, correct: g >= 2, activity: 'review' });
  return s;
}

export function dueCards(now = Date.now()) {
  return CARDS.filter(c => {
    const s = store.get().cards[c.id];
    return !s || s.due <= now;
  });
}

export function counts() {
  const all = store.get().cards;
  const now = Date.now();
  let neu = 0, due = 0, learned = 0;
  for (const c of CARDS) {
    const s = all[c.id];
    if (!s) { neu += 1; continue; }
    if (s.due <= now) due += 1;
    if (s.interval >= 21) learned += 1;
  }
  return { new: neu, due, learned, total: CARDS.length };
}

/** Today's queue: everything overdue, then new cards up to the daily goal. */
export function queue(limit) {
  const cap = limit || store.settings().dailyGoal;
  const now = Date.now();
  const all = store.get().cards;

  const overdue = CARDS
    .filter(c => all[c.id] && all[c.id].due <= now)
    .sort((a, b) => all[a.id].due - all[b.id].due);

  const unseen = CARDS.filter(c => !all[c.id]);

  // Lead with the tags you are weakest on so the hard material gets the
  // freshest attention, not the tail end of a session.
  const weak = store.tagAccuracy().slice(0, 3).map(t => t.tag);
  const weight = c => (c.tags.some(t => weak.includes(t)) ? 0 : 1);
  unseen.sort((a, b) => weight(a) - weight(b));

  return [...overdue, ...unseen].slice(0, Math.max(cap, overdue.length));
}

/** Atelier: a drill built only from your weakest tags. */
export function drill(tags, size = 15) {
  const pool = CARDS.filter(c => c.tags.some(t => tags.includes(t)));
  const all = store.get().cards;
  // least-known first
  pool.sort((a, b) => {
    const sa = all[a.id], sb = all[b.id];
    return (sa ? sa.interval : -1) - (sb ? sb.interval : -1);
  });
  return pool.slice(0, size);
}

export const allTagsUsed = () => [...new Set(CARDS.flatMap(c => c.tags))];
