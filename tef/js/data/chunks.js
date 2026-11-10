// Chunks — the fixed phrases you memorise cold so they come out without
// thinking. Grouped by where they live in the exam. Each item carries a
// category, an English gloss, and a one-line usage note.
//
// Categories
//   universal  — work in any section or section
//   sec-a      — Section A: continuer un récit / fait divers (passé)
//   sec-b      — Section B: défendre un avis (argumentation)
//   letter     — formal letter conventions (most Section B tasks are letters)

export const CHUNKS = [

  /* ── Universal ─────────────────────────────────────────── 8 items */
  { id: 'u1', cat: 'universal', fr: 'Il convient de noter que', en: 'It is worth noting that', usage: 'Opens any observation with authority.' },
  { id: 'u2', cat: 'universal', fr: 'Force est de constater que', en: 'One must acknowledge that', usage: 'Concedes a fact before you pivot.' },
  { id: 'u3', cat: 'universal', fr: 'Dans ce contexte,', en: 'In this context,', usage: 'Bridges your situation to your argument.' },
  { id: 'u4', cat: 'universal', fr: 'À cet égard,', en: 'In this regard,', usage: 'Links back to your previous point cleanly.' },
  { id: 'u5', cat: 'universal', fr: "C\'est dans cette optique que", en: 'It is with this in mind that', usage: 'Announces your intent before the main clause.' },
  { id: 'u6', cat: 'universal', fr: "Quoi qu\'il en soit,", en: 'Be that as it may,', usage: 'Closes a detour and returns to the main point.' },
  { id: 'u7', cat: 'universal', fr: 'Il va sans dire que', en: 'It goes without saying that', usage: 'States something as obvious before elaborating.' },
  { id: 'u8', cat: 'universal', fr: 'Dans une certaine mesure,', en: 'To a certain extent,', usage: 'Qualifies a claim — shows nuance.' },

  /* ── Section A — Fait divers / récit au passé ──────────── 16 items */
  { id: 'a1',  cat: 'sec-a', fr: "C\'est alors que", en: 'It was then that', usage: 'Marks the narrative turning point — use once per story.' },
  { id: 'a2',  cat: 'sec-a', fr: 'Sans crier gare,', en: 'Without warning,', usage: 'Opens the unexpected event.' },
  { id: 'a3',  cat: 'sec-a', fr: 'Quelques instants plus tard,', en: 'A few moments later,', usage: 'Advances time — passive composé follows.' },
  { id: 'a4',  cat: 'sec-a', fr: 'Sur ces entrefaites,', en: 'At that very moment,', usage: 'Literary time marker; examiners recognise it immediately.' },
  { id: 'a5',  cat: 'sec-a', fr: 'Pris(e) de panique,', en: 'Seized with panic,', usage: 'Character reaction; agree the participle with subject.' },
  { id: 'a6',  cat: 'sec-a', fr: 'Fort heureusement,', en: 'Fortunately,', usage: 'Positive turning point — lifts rhythm after tension.' },
  { id: 'a7',  cat: 'sec-a', fr: 'Malheureusement pour lui / elle,', en: 'Unfortunately for him / her,', usage: 'Introduces the complication mid-story.' },
  { id: 'a8',  cat: 'sec-a', fr: 'Aussitôt prévenu(e), il / elle', en: 'Immediately informed, he / she', usage: 'Passsive participle structure; avoids a weak "il a su".' },
  { id: 'a9',  cat: 'sec-a', fr: 'Les secours sont arrivés rapidement sur les lieux.', en: 'Emergency services arrived quickly at the scene.', usage: 'Fait divers closer; works for accidents, fires, crimes.' },
  { id: 'a10', cat: 'sec-a', fr: 'Un bilan provisoire fait état de', en: 'A preliminary toll reports', usage: 'Journalistic register — Section A loves this phrase.' },
  { id: 'a11', cat: 'sec-a', fr: 'Des témoins ont rapporté que', en: 'Witnesses reported that', usage: 'Distanced reporting — imperfect follows.' },
  { id: 'a12', cat: 'sec-a', fr: "L\'enquête est toujours en cours.", en: 'The investigation is still ongoing.', usage: 'Standard press ending — signals you know the register.' },
  { id: 'a13', cat: 'sec-a', fr: 'Sans tarder,', en: 'Without delay,', usage: 'Quickens the pace; passé composé follows.' },
  { id: 'a14', cat: 'sec-a', fr: "Il / Elle n\'en revenait pas.", en: 'He / She could not believe it.', usage: 'Natural reaction sentence — avoids "il était surpris".' },
  { id: 'a15', cat: 'sec-a', fr: 'Nul ne savait encore que', en: 'Nobody yet knew that', usage: 'Creates suspense before the revelation.' },
  { id: 'a16', cat: 'sec-a', fr: "C\'est seulement à ce moment-là que", en: 'It was only then that', usage: 'Delayed revelation structure — strong narrative device.' },

  /* ── Section B — Argumentation ─────────────────────────── 18 items */
  { id: 'b1',  cat: 'sec-b', fr: 'Je suis fermement convaincu(e) que', en: 'I am firmly convinced that', usage: 'Position opener — stronger than "je pense que".' },
  { id: 'b2',  cat: 'sec-b', fr: 'Il me semble indéniable que', en: 'It seems undeniable to me that', usage: 'States a fact as self-evident before arguing it.' },
  { id: 'b3',  cat: 'sec-b', fr: "Certes, on pourrait objecter que… ; il n\'en demeure pas moins que", en: 'Admittedly one could object that… ; nevertheless', usage: 'The core concession pattern — B2 differentiator.' },
  { id: 'b4',  cat: 'sec-b', fr: 'Sans nier les avantages de X, force est de reconnaître que', en: 'Without denying the advantages of X, one must recognise that', usage: 'Concession that pivots immediately — avoids weak "mais".' },
  { id: 'b5',  cat: 'sec-b', fr: 'Par ailleurs,', en: 'Moreover,', usage: 'Adds a second argument on the same side.' },
  { id: 'b6',  cat: 'sec-b', fr: 'En outre,', en: 'Furthermore,', usage: 'Stronger addition than "par ailleurs" — use it second.' },
  { id: 'b7',  cat: 'sec-b', fr: 'Qui plus est,', en: 'What is more,', usage: 'Escalating addition — save it for the strongest point.' },
  { id: 'b8',  cat: 'sec-b', fr: 'En revanche,', en: 'On the other hand,', usage: 'Sharp contrast — not "mais", not "cependant".' },
  { id: 'b9',  cat: 'sec-b', fr: 'Toutefois,', en: 'However,', usage: 'Formal "however" — no comma trap unlike "cependant".' },
  { id: 'b10', cat: 'sec-b', fr: 'Néanmoins,', en: 'Nevertheless,', usage: "After a full concession — signals you\'re holding your ground." },
  { id: 'b11', cat: 'sec-b', fr: 'Dans la mesure où', en: 'In so far as / given that', usage: 'Gives a proportional cause — more precise than "parce que".' },
  { id: 'b12', cat: 'sec-b', fr: 'Étant donné que', en: 'Given that / Since', usage: 'Introduces a premise that you will then argue from.' },
  { id: 'b13', cat: 'sec-b', fr: 'Par conséquent,', en: 'Consequently,', usage: 'Result connector — formal register.' },
  { id: 'b14', cat: 'sec-b', fr: "C\'est pourquoi", en: 'That is why', usage: 'Personal conclusion link — no comma after it.' },
  { id: 'b15', cat: 'sec-b', fr: 'En définitive,', en: 'Ultimately / All things considered,', usage: 'Opens the conclusion paragraph — more precise than "enfin".' },
  { id: 'b16', cat: 'sec-b', fr: 'Tout bien pesé,', en: 'All things weighed,', usage: 'Conclusion opener — literary, signals balance.' },
  { id: 'b17', cat: 'sec-b', fr: 'Il convient donc de', en: 'It is therefore appropriate to', usage: 'Final recommendation — impersonal and authoritative.' },
  { id: 'b18', cat: 'sec-b', fr: 'À la lumière de ce qui précède,', en: 'In light of the foregoing,', usage: 'Formal conclusion — signals you organised your argument.' },

  /* ── Formal letter ─────────────────────────────────────── 8 items */
  { id: 'l1', cat: 'letter', fr: 'Madame, Monsieur,', en: 'Dear Sir or Madam,', usage: "Default opening when you don\'t know the gender." },
  { id: 'l2', cat: 'letter', fr: 'Je me permets de vous écrire afin de', en: 'I am writing to you in order to', usage: 'Polite purpose opener — better than "je vous écris pour".' },
  { id: 'l3', cat: 'letter', fr: 'Je me permets de porter à votre attention', en: 'I would like to bring to your attention', usage: 'Formal complaint or request opener.' },
  { id: 'l4', cat: 'letter', fr: 'Suite à votre annonce / notre entretien,', en: 'Further to your advertisement / our conversation,', usage: 'Contextualises the letter immediately.' },
  { id: 'l5', cat: 'letter', fr: 'Je reste à votre disposition pour tout renseignement complémentaire.', en: 'I remain at your disposal for any further information.', usage: 'Standard penultimate sentence — always works.' },
  { id: 'l6', cat: 'letter', fr: "Dans l\'attente de votre réponse,", en: 'Awaiting your reply,', usage: 'Bridges your last body sentence to the sign-off.' },
  { id: 'l7', cat: 'letter', fr: "Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.", en: 'Please accept, Madam / Sir, the expression of my distinguished greetings.', usage: 'The only fully formal sign-off — memorise it word for word.' },
  { id: 'l8', cat: 'letter', fr: 'Cordialement,', en: 'Kind regards,', usage: 'Semi-formal sign-off when the full formula would feel stiff.' },
];

/** Upgrade connectors — the cheap words to avoid and what to say instead. */
export const CONNECTORS = [
  { fn: 'Adding',     avoid: 'aussi, et, de plus (overused)',           upgrade: 'Par ailleurs · En outre · Qui plus est' },
  { fn: 'Contrasting', avoid: 'mais, cependant (overused)',              upgrade: 'En revanche · Néanmoins · Toutefois · Or,' },
  { fn: 'Conceding',  avoid: 'même si (weak)',                          upgrade: "Certes… ; il n\'en demeure pas moins que · Sans nier que…" },
  { fn: 'Cause',      avoid: 'parce que (oral)',                        upgrade: 'Dans la mesure où · Étant donné que · En raison de' },
  { fn: 'Consequence', avoid: 'alors, donc (oral)',                     upgrade: "Par conséquent, · C\'est pourquoi · Dès lors," },
  { fn: 'Concluding', avoid: 'pour conclure, finalement (cliché)',      upgrade: 'En définitive, · Tout bien pesé, · À la lumière de ce qui précède,' },
  { fn: 'Illustrating', avoid: 'comme, par exemple (keep one max)',     upgrade: "C\'est notamment le cas de · À titre d\'illustration, · On peut citer" },
];

export const CATS = [
  { id: 'universal', label: 'Universel',    labelEn: 'Universal',    desc: 'Any section, any task' },
  { id: 'sec-a',     label: 'Section A',    labelEn: 'Section A',    desc: 'Fait divers · récit au passé' },
  { id: 'sec-b',     label: 'Section B',    labelEn: 'Section B',    desc: 'Argumentation · point de vue' },
  { id: 'letter',    label: 'Lettre',       labelEn: 'Formal letter', desc: 'Opening · closing · sign-off' },
];
