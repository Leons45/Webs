// The programme. Two things live here: the shape of a single day, and the
// thirteen-week route from A2 to the level CLB 7 asks for.
//
// The day is deliberately speaking-heavy: just under half the minutes are
// spent producing speech. That ratio is the whole design argument — at A2,
// comprehension improves on its own from exposure, production does not.

import * as store from './store.js';

/* ── the day ───────────────────────────────────────────────────── */

export const BLOCKS = [
  { id:'echauffement', min:10, fr:'Échauffement',          en:'Warm-up',
    desc:'Dix phrases prêtes à l’emploi, dites à voix haute.',
    descEn:'Ten ready-made phrases, said aloud.', route:'#/phrases?drill=1', speaking:true },

  { id:'vocab', min:25, fr:'Vocabulaire',                  en:'Vocabulary',
    desc:'Les chunks du thème de la semaine, en révision espacée.',
    descEn:'This week’s themed chunks, spaced repetition.', route:'#/vocab?drill=1' },

  { id:'grammaire', min:30, fr:'Grammaire du jour',        en:'Grammar',
    desc:'Une leçon courte, puis les exercices.',
    descEn:'One short lesson, then the drills.', route:'#/grammaire' },

  { id:'shadowing', min:20, fr:'Shadowing',                en:'Shadowing',
    desc:'Tu écoutes, tu répètes immédiatement, tu compares.',
    descEn:'Listen, repeat at once, compare.', route:'#/parler?mode=shadow', speaking:true },

  { id:'questions', min:20, fr:'Questions éclair',         en:'Rapid questions',
    desc:'Section A : tu vois l’anglais, tu dis la question en français.',
    descEn:'Section A: you see English, you say the French question.', route:'#/parler?mode=questions', speaking:true },

  { id:'sectionA', min:15, fr:'Simulation — Section A',    en:'Section A simulation',
    desc:'Cinq minutes au chronomètre. Tu poses, tu ne donnes pas ton avis.',
    descEn:'Five minutes on the clock. You ask; you don’t give opinions.', route:'#/parler?mode=sectionA', speaking:true },

  { id:'sectionB', min:25, fr:'Simulation — Section B',    en:'Section B simulation',
    desc:'Dix minutes. L’examinateur t’objecte à voix haute ; tu réponds.',
    descEn:'Ten minutes. The examiner objects aloud; you respond.', route:'#/parler?mode=sectionB', speaking:true },

  { id:'monologue', min:15, fr:'Monologue 60 secondes',    en:'60-second monologue',
    desc:'Un sujet, une minute, sans préparation. Ne pas s’arrêter.',
    descEn:'One topic, one minute, no prep. Don’t stop.', route:'#/parler?mode=monologue', speaking:true },

  { id:'ecrire', min:30, fr:'Écriture',                    en:'Writing',
    desc:'Une tâche courte, chronométrée.',
    descEn:'One short task, timed.', route:'#/ecrire' },

  { id:'bilan', min:10, fr:'Bilan',                        en:'Review',
    desc:'Ce qui a résisté aujourd’hui, et où tu en es.',
    descEn:'What gave trouble today, and where you stand.', route:'#/progres' },
];

const BASE_MINUTES = BLOCKS.reduce((s, b) => s + b.min, 0);

/** Today's schedule, scaled to the hours you set, with clock times. */
export function todaySchedule(startHour = 7) {
  const target = store.settings().dailyHours * 60;
  const factor = target / BASE_MINUTES;
  let cursor = startHour * 60;

  return BLOCKS.map(b => {
    const min = Math.max(5, Math.round((b.min * factor) / 5) * 5);
    const from = cursor;
    cursor += min;
    return {
      ...b, min,
      from: fmt(from), to: fmt(cursor),
      done: store.blockDone(b.id),
    };
  });
}

const fmt = (mins) => {
  const h = Math.floor(mins / 60) % 24, m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
};

export function dayProgress() {
  const sched = todaySchedule();
  const done = sched.filter(b => b.done);
  return {
    done: done.length,
    total: sched.length,
    minutesDone: done.reduce((s, b) => s + b.min, 0),
    minutesTotal: sched.reduce((s, b) => s + b.min, 0),
    speakingTarget: Math.round(sched.filter(b => b.speaking).reduce((s, b) => s + b.min, 0) * 0.6),
  };
}

/* ── the thirteen weeks ────────────────────────────────────────── */
// Each week names what you work on and, more importantly, what you should
// be able to DO by Sunday. A target you can test is worth more than a topic
// you can cover.

export const WEEKS = [
  { n:1,  level:'A2', fr:'Les bases qui débloquent la parole', en:'The basics that unblock speech',
    lessons:['g01','g02'], themes:['logement'], focus:'questions',
    goal:'Poser dix questions différentes sur une annonce, sans préparation.',
    goalEn:'Ask ten different questions about an advert, with no preparation.' },
  { n:2,  level:'A2', fr:'Interroger et raconter', en:'Asking and recounting',
    lessons:['g03','g04'], themes:['travail'], focus:'questions',
    goal:'Raconter ta journée d’hier en huit phrases au passé composé.',
    goalEn:'Recount yesterday in eight sentences in the perfect tense.' },
  { n:3,  level:'A2', fr:'Le passé qui tient debout', en:'A past tense that holds up',
    lessons:['g05','g06'], themes:['demarches'], focus:'monologue',
    goal:'Une minute de récit au passé en alternant passé composé et imparfait.',
    goalEn:'One minute of past narrative alternating perfect and imperfect.' },
  { n:4,  level:'A2', fr:'Dire non correctement', en:'Saying no correctly',
    lessons:['g07'], themes:['sante'], focus:'sectionA',
    goal:'Cinq minutes de Section A complètes, sans « ne » oublié.',
    goalEn:'A full five-minute Section A with no dropped "ne".' },
  { n:5,  level:'A2', fr:'Projeter et préciser', en:'Projecting and specifying',
    lessons:['g08','g09'], themes:['transport'], focus:'sectionA',
    goal:'Parler de tes projets pendant une minute sans hésiter plus de 3 s.',
    goalEn:'Talk about your plans for a minute with no pause over 3 s.' },
  { n:6,  level:'B1', fr:'Décrire avec précision', en:'Describing precisely',
    lessons:['g10'], themes:['etudes'], focus:'monologue',
    goal:'Décrire un lieu et une personne pendant 90 secondes.',
    goalEn:'Describe a place and a person for 90 seconds.' },
  { n:7,  level:'B1', fr:'Arrêter de répéter les noms', en:'Stop repeating the nouns',
    lessons:['g11'], themes:['argent'], focus:'sectionB',
    goal:'Une Section B de dix minutes avec au moins six pronoms objets.',
    goalEn:'A ten-minute Section B using at least six object pronouns.' },
  { n:8,  level:'B1', fr:'Y, en, et la fluidité', en:'Y, en, and flow',
    lessons:['g12'], themes:['alimentation'], focus:'sectionB',
    goal:'Répondre à cinq objections sans jamais t’arrêter net.',
    goalEn:'Answer five objections without ever stopping dead.' },
  { n:9,  level:'B1', fr:'La politesse et l’hypothèse', en:'Politeness and hypothesis',
    lessons:['g13'], themes:['societe'], focus:'sectionA',
    goal:'Toute une Section A au conditionnel de politesse.',
    goalEn:'An entire Section A in the polite conditional.' },
  { n:10, level:'B1', fr:'Le subjonctif, dix cas', en:'The subjunctive, ten cases',
    lessons:['g14'], themes:['environnement'], focus:'sectionB',
    goal:'Placer trois subjonctifs corrects dans une argumentation.',
    goalEn:'Land three correct subjunctives in an argument.' },
  { n:11, level:'B2', fr:'Des phrases longues', en:'Long sentences',
    lessons:['g15'], themes:['technologie'], focus:'monologue',
    goal:'Trois phrases de plus de vingt mots, correctes, dans un monologue.',
    goalEn:'Three correct sentences over twenty words in one monologue.' },
  { n:12, level:'B2', fr:'Articuler un raisonnement', en:'Structuring an argument',
    lessons:['g16'], themes:['quebec'], focus:'sectionB',
    goal:'Une concession suivie d’une réfutation, à l’oral, sans notes.',
    goalEn:'A concession followed by a rebuttal, spoken, without notes.' },
  { n:13, level:'B2', fr:'Simulation et rodage', en:'Full simulation',
    lessons:['g02','g07','g14','g16'], themes:['logement','travail','societe'], focus:'sectionB',
    goal:'Une Section A et une Section B complètes le même jour, notées.',
    goalEn:'A full Section A and Section B on the same day, both marked.' },
];

export function currentWeek() {
  const n = store.weekNumber();
  return WEEKS[Math.min(n, WEEKS.length) - 1];
}

/** The grammar lesson for today — rotates through the week's lessons. */
export function todayLesson() {
  const w = currentWeek();
  const dayOfWeek = new Date().getDay();
  return w.lessons[dayOfWeek % w.lessons.length];
}

export const todayThemes = () => currentWeek().themes;
