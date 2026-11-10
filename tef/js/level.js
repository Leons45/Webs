// Where you are, and what is still missing. The rungs are deliberately
// explicit: a number you cannot interrogate is demotivating, and a number
// that flatters you is worse than none.
//
// Three things move you up, and all three must move: hours of speech
// produced, grammar actually passed, and accuracy under drill conditions.

import * as store from './store.js';
import { GRAMMAR } from './data/grammar.js';

export const RUNGS = [
  { key:'A2',  clb:4, fr:'A2 — survivre',        en:'A2 — getting by',
    speakHours:0,  lessons:0,  acc:0,
    says:'Tu réponds à des questions simples sur toi, au présent.',
    saysEn:'You answer simple questions about yourself, in the present.' },
  { key:'A2+', clb:5, fr:'A2+ — tenir un échange', en:'A2+ — holding an exchange',
    speakHours:10, lessons:4,  acc:0.70,
    says:'Tu poses des questions correctes et tu racontes au passé.',
    saysEn:'You ask well-formed questions and recount events in the past.' },
  { key:'B1',  clb:6, fr:'B1 — argumenter simplement', en:'B1 — arguing simply',
    speakHours:25, lessons:9,  acc:0.75,
    says:'Tu défends une position et tu réponds à une objection.',
    saysEn:'You defend a position and answer an objection.' },
  { key:'B1+', clb:6, fr:'B1+ — enchaîner sans bloquer', en:'B1+ — keeping going',
    speakHours:40, lessons:13, acc:0.80,
    says:'Tu parles dix minutes sans t'arrêter net, avec des pronoms et des connecteurs.',
    saysEn:'You speak for ten minutes without stopping dead, with pronouns and connectors.' },
  { key:'B2',  clb:7, fr:'B2 — le niveau visé',  en:'B2 — the target',
    speakHours:60, lessons:16, acc:0.85,
    says:'Tu concèdes, tu réfutes, tu nuances, et tu te corriges toi-même.',
    saysEn:'You concede, rebut, qualify, and correct yourself as you go.' },
];

export function metrics() {
  const { allMinutes } = store.speakingTotals();
  const speakHours = allMinutes / 60;

  const lessons = GRAMMAR.filter(g => {
    const r = store.lesson(g.id);
    return r && r.total && r.score / r.total >= 0.7;
  }).length;

  const days = Object.values(store.get().days);
  const items = days.reduce((s, d) => s + (d.items || 0), 0);
  const right = days.reduce((s, d) => s + (d.right || 0), 0);
  const acc = items >= 20 ? right / items : null;

  return { speakHours, lessons, acc, items, totalHours: store.totalHours() };
}

/** The highest rung whose three conditions are all met. */
export function current() {
  const m = metrics();
  let reached = RUNGS[0];
  for (const r of RUNGS) {
    const ok = m.speakHours >= r.speakHours
            && m.lessons >= r.lessons
            && (r.acc === 0 || (m.acc != null && m.acc >= r.acc));
    if (ok) reached = r;
  }
  return { rung: reached, metrics: m };
}

export function next() {
  const { rung } = current();
  const i = RUNGS.findIndex(r => r.key === rung.key);
  return i < RUNGS.length - 1 ? RUNGS[i + 1] : null;
}

/** What is actually blocking the next rung, as plain sentences. */
export function gaps() {
  const n = next();
  if (!n) return [];
  const m = metrics();
  const out = [];

  if (m.speakHours < n.speakHours) {
    const left = n.speakHours - m.speakHours;
    out.push({
      key: 'speak',
      fr: `${left.toFixed(1)} h de parole à produire`,
      en: `${left.toFixed(1)} more hours of speech to produce`,
      detail: 'C'est le facteur le plus lent et le plus déterminant. Rien ne le remplace.',
      detailEn: 'This is the slowest and most decisive factor. Nothing substitutes for it.',
    });
  }
  if (m.lessons < n.lessons) {
    out.push({
      key: 'lessons',
      fr: `${n.lessons - m.lessons} leçon(s) de grammaire à réussir à 70 %`,
      en: `${n.lessons - m.lessons} grammar lesson(s) still to pass at 70%`,
      detail: 'Une leçon compte seulement si tu as réussi ses exercices.',
      detailEn: 'A lesson counts only once you have passed its drills.',
    });
  }
  if (n.acc && (m.acc == null || m.acc < n.acc)) {
    out.push({
      key: 'acc',
      fr: m.acc == null
        ? 'Pas encore assez d'exercices pour mesurer ta précision'
        : `Précision à ${Math.round(m.acc * 100)} %, il en faut ${Math.round(n.acc * 100)} %`,
      en: m.acc == null
        ? 'Not enough drills yet to measure accuracy'
        : `Accuracy at ${Math.round(m.acc * 100)}%, ${Math.round(n.acc * 100)}% needed`,
      detail: 'La précision monte en refaisant les points faibles, pas en avançant.',
      detailEn: 'Accuracy rises by redoing weak points, not by moving on.',
    });
  }
  return out;
}

/** Is the pace enough to reach CLB 7 by the exam date? Honest arithmetic. */
export function pace() {
  const days = store.daysUntilExam();
  const m = metrics();
  const target = RUNGS.at(-1);
  if (days == null || days <= 0) return null;

  const hoursNeeded = Math.max(0, target.speakHours - m.speakHours);
  const perDayNeeded = hoursNeeded / days;

  const last14 = store.lastDays(14);
  const spokenLast14 = last14.reduce((s, d) => s + (d.speakingSeconds || 0), 0) / 3600;
  const actualPerDay = spokenLast14 / 14;

  const onTrack = actualPerDay >= perDayNeeded * 0.9;

  return {
    days, hoursNeeded,
    minutesPerDayNeeded: Math.round(perDayNeeded * 60),
    minutesPerDayActual: Math.round(actualPerDay * 60),
    onTrack,
    // Don't deliver a verdict on a fortnight that has barely started — being
    // told you are behind after four minutes of work is not useful feedback.
    started: spokenLast14 >= 0.25,
  };
}
