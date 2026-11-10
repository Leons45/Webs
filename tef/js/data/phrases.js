// The phrase bank. At A2 the fastest route to fluent-sounding speech is not
// more words — it is a stock of ready-made chunks you can produce without
// assembling them. Everything here is meant to be said aloud until automatic.
//
// fr = what you say · en = what it means · use = when to reach for it

export const GROUPS = {
  survie:     { fr:'Survie',               en:'Survival',              note:'The sentences that stop a conversation from collapsing. Learn these first — they buy you time and keep the examiner on your side.' },
  fluidite:   { fr:'Gagner du temps',      en:'Buying time & repairing',note:'The single highest-value group for you. A B2 speaker is not someone who never hesitates — it is someone who hesitates in French.' },
  questionsA: { fr:'Section A — demander', en:'Section A — asking',    note:'Section A is nothing but questions. These are the openings; memorise them until you can start a question without thinking.' },
  argumenterB:{ fr:'Section B — convaincre',en:'Section B — persuading',note:'Section B is a negotiation with someone who resists. You need to concede, push back and close.' },
  opinion:    { fr:'Donner son avis',      en:'Giving an opinion',     note:'Rotate these. Saying "je pense que" eight times is what keeps a candidate at B1.' },
  reagir:     { fr:'Réagir',               en:'Reacting',              note:'Short responses that keep an exchange alive and show you are listening.' },
  politesse:  { fr:'Registre poli',        en:'Polite register',       note:'Vouvoiement and softeners. In Section A you are talking to a stranger — the register is marked.' },
};

const P = [];
let n = 0;
const p = (group, fr, en, use, level = 'A2') => {
  P.push({ id: 'p' + (++n).toString().padStart(3, '0'), group, fr, en, use, level });
};

/* ───────────────────────── Survie ───────────────────────── */

p('survie', 'Pourriez-vous répéter, s'il vous plaît ?', 'Could you repeat that, please?', 'Always this, never "répétez". The conditional keeps it polite.');
p('survie', 'Pourriez-vous parler un peu plus lentement ?', 'Could you speak a little more slowly?', 'Ask once, early. It is allowed and it is not penalised.');
p('survie', 'Je n'ai pas bien compris la question.', 'I didn't quite catch the question.', 'Better than silence. "Pas bien" softens it — you understood something.');
p('survie', 'Qu'est-ce que ça veut dire, exactement ?', 'What does that mean, exactly?', 'Asking about a word is normal behaviour, not a failure.');
p('survie', 'Je ne suis pas sûr d'avoir compris.', 'I'm not sure I've understood.', 'Buys a reformulation without admitting total loss.');
p('survie', 'Si j'ai bien compris, vous voulez dire que…', 'If I've understood correctly, you mean that…', 'Checks meaning AND shows the examiner you can reformulate. High value.');
p('survie', 'Excusez-moi, je cherche mes mots.', 'Sorry, I'm looking for the words.', 'Says out loud what is happening. Far better than a long silence.');
p('survie', 'Je vous écoute.', 'I'm listening. / Go ahead.', 'Hands the turn back cleanly.');
p('survie', 'Ça fait bientôt un an que j'apprends le français.', 'I've been learning French for almost a year.', 'The structure "ça fait … que" is worth owning — it comes up constantly.');
p('survie', 'Je travaille comme concepteur multimédia.', 'I work as a multimedia designer.', 'Have your own job sentence ready and automatic.');

/* ─────────────────── Gagner du temps ─────────────────── */

p('fluidite', 'Alors…', 'So… / Right…', 'The standard French thinking noise. Use it instead of "um".');
p('fluidite', 'Eh bien, écoutez…', 'Well, look…', 'Buys a full second and sounds native.', 'B1');
p('fluidite', 'Comment dire…', 'How can I put it…', 'Perfect when the word is missing. Sounds thoughtful, not lost.');
p('fluidite', 'Disons que…', 'Let's say that…', 'Lets you start a sentence before you know how it ends.', 'B1');
p('fluidite', 'En fait,…', 'Actually, / In fact,', 'Also a pure filler. Natural at the start of almost any clause.');
p('fluidite', 'C'est-à-dire que…', 'That is to say…', 'Use it to restart a sentence that went wrong, without apologising.', 'B1');
p('fluidite', 'Attendez, je reformule.', 'Hold on, let me rephrase.', 'Open repair. Examiners reward this — it is a B2 strategy, not a weakness.', 'B1');
p('fluidite', 'Je ne connais pas le mot exact, mais c'est quelque chose comme…', 'I don't know the exact word, but it's something like…', 'The single most useful sentence at A2. It turns a gap into a paraphrase.');
p('fluidite', 'Comment on dit déjà… ?', 'What's the word again…?', 'Informal, for Section B where you are talking to someone close.');
p('fluidite', 'Enfin, bref…', 'Anyway… / In short…', 'Closes a sentence that has run away from you.', 'B1');
p('fluidite', 'Ce que je veux dire, c'est que…', 'What I mean is…', 'The cleanest restart in French. Learn it cold.', 'B1');
p('fluidite', 'Pardon, j'ai dit « le », je voulais dire « la ».', 'Sorry, I said "le", I meant "la".', 'Correcting yourself out loud scores better than leaving the error.');
p('fluidite', 'Comment dirais-je…', 'How shall I put it…', 'A notch more formal than "comment dire".', 'B2');
p('fluidite', 'Si vous voulez,…', 'If you like, / In a sense,', 'Softener that costs nothing and fills a gap.', 'B2');

/* ─────────────── Section A — demander ─────────────── */

p('questionsA', 'Je vous appelle au sujet de l'annonce.', 'I'm calling about the advertisement.', 'Your opening line. Say it without thinking.');
p('questionsA', 'J'aurais quelques questions à vous poser.', 'I have a few questions for you.', 'Announces the task you were given. Sets the frame.');
p('questionsA', 'Pourriez-vous me préciser… ?', 'Could you specify…?', 'The workhorse. Works before any noun: le tarif, les horaires, les conditions.');
p('questionsA', 'Pourriez-vous me dire si… ?', 'Could you tell me whether…?', 'For yes/no information. Note: si, never "est-ce que" after this.');
p('questionsA', 'J'aimerais savoir combien coûte… ', 'I'd like to know how much … costs.', 'Indirect question: the verb does NOT invert after "je voudrais savoir".');
p('questionsA', 'Est-ce qu'il serait possible de… ?', 'Would it be possible to…?', 'Conditional + possible = the politest way to ask for something.');
p('questionsA', 'Qu'en est-il de… ?', 'What about…? / Where do things stand on…?', 'Sounds advanced and covers any topic you have not asked about yet.', 'B2');
p('questionsA', 'En quoi consiste exactement… ?', 'What exactly does … involve?', 'For asking what something actually is. Very strong in Section A.', 'B1');
p('questionsA', 'Quelles sont les conditions pour… ?', 'What are the conditions for…?', 'Opens a whole area: eligibility, cancellation, payment.', 'B1');
p('questionsA', 'Que se passe-t-il si… ?', 'What happens if…?', 'Hypothetical questions show range. Ask at least one.', 'B1');
p('questionsA', 'Dans quel cas… ?', 'In which case…? / Under what circumstances…?', 'A variant that avoids repeating "si".', 'B2');
p('questionsA', 'Y a-t-il des frais supplémentaires ?', 'Are there any extra charges?', 'Have one money question always ready.');
p('questionsA', 'À partir de quand… ?', 'From when…? / Starting when…?', 'Availability questions. Pairs with "jusqu'à quand".');
p('questionsA', 'Combien de temps faut-il compter pour… ?', 'How long should one allow for…?', '"Faut-il compter" is a chunk worth owning.', 'B1');
p('questionsA', 'Faut-il prévoir quelque chose de particulier ?', 'Is there anything in particular I should plan for?', 'An open question that often produces a lot of information.', 'B1');
p('questionsA', 'Serait-il envisageable de… ?', 'Would it be conceivable to…?', 'One step above "possible". Use it once, for effect.', 'B2');
p('questionsA', 'Auriez-vous l'amabilité de me dire… ?', 'Would you be so kind as to tell me…?', 'Very formal. One per conversation, not three.', 'B2');
p('questionsA', 'Pour être sûr de bien comprendre : … , c'est bien ça ?', 'Just to be sure I've understood: …, is that right?', 'Reformulation. Shows comprehension and gives you thinking time.', 'B1');
p('questionsA', 'Une dernière question, si vous permettez.', 'One last question, if I may.', 'Signals structure. Examiners notice candidates who organise their turn.', 'B1');
p('questionsA', 'Je vous remercie pour toutes ces précisions.', 'Thank you for all these details.', 'Your closing line. Never end a Section A abruptly.');

/* ────────────── Section B — convaincre ────────────── */

p('argumenterB', 'Écoute, j'y ai réfléchi et je pense que…', 'Listen, I've thought about it and I think that…', 'Opening. Note the tutoiement — Section B is someone close to you.');
p('argumenterB', 'Ce qui me semble décisif, c'est…', 'What seems decisive to me is…', 'Cleft sentence. Instantly lifts the register.', 'B1');
p('argumenterB', 'Prends un exemple concret : …', 'Take a concrete example: …', 'Never argue abstractly for ten minutes. Examples carry the grade.');
p('argumenterB', 'Imagine que tu sois à ma place.', 'Imagine you were in my position.', 'Also drills the subjunctive after "imagine que".', 'B1');
p('argumenterB', 'Je comprends ton hésitation, mais…', 'I understand your hesitation, but…', 'Concede first. Always. A flat contradiction loses points.');
p('argumenterB', 'Tu as raison sur ce point ; cela dit,…', 'You're right on that point; that said,…', 'The concession-reversal pattern in one line.', 'B1');
p('argumenterB', 'Admettons que tu aies raison. Il n'empêche que…', 'Let's grant you're right. Even so…', 'The strongest concession in the exam. Subjunctive after "admettons que".', 'B2');
p('argumenterB', 'Justement, c'est précisément pour ça que…', 'Exactly — that's precisely why…', 'Turns their objection into your argument. Very high value.', 'B1');
p('argumenterB', 'Le vrai problème, ce n'est pas… , c'est…', 'The real problem isn't … , it's …', 'Reframes the discussion on your terms.', 'B1');
p('argumenterB', 'Qu'est-ce qui te retient exactement ?', 'What's actually holding you back?', 'Ask THEM a question. A monologue is not a negotiation.');
p('argumenterB', 'Et si on essayait pendant un mois ?', 'What if we tried for a month?', 'The trial offer. Nearly always the move that closes.');
p('argumenterB', 'On peut toujours revenir en arrière si ça ne marche pas.', 'We can always go back if it doesn't work.', 'Removes the risk from their side.');
p('argumenterB', 'Qu'est-ce que tu risques, franchement ?', 'What have you got to lose, honestly?', 'Rhetorical question. Use near the end.');
p('argumenterB', 'Je te propose un compromis : …', 'Let me propose a compromise: …', 'Offering a compromise is explicitly rewarded in the Section B criteria.', 'B1');
p('argumenterB', 'Si ça peut te rassurer, …', 'If it reassures you, …', 'Addresses the emotion, not just the argument.', 'B1');
p('argumenterB', 'Soyons réalistes : …', 'Let's be realistic: …', 'Changes register and signals you are closing.', 'B1');
p('argumenterB', 'Alors, qu'est-ce que tu en dis ?', 'So, what do you say?', 'You must ask for the decision. Many candidates forget and lose the task point.');
p('argumenterB', 'Alors c'est d'accord ? On fait comme ça ?', 'So we're agreed? We'll do it that way?', 'The closing line. End on a yes/no question.');

/* ─────────────── Donner son avis ─────────────── */

p('opinion', 'À mon avis,…', 'In my opinion,…', 'Simplest. Fine, but do not use it more than twice.');
p('opinion', 'Je trouve que…', 'I find that…', 'More natural than "je pense que" for subjective judgements.');
p('opinion', 'Il me semble que…', 'It seems to me that…', 'Slightly hedged. Useful when you are not certain.', 'B1');
p('opinion', 'J'ai tendance à penser que…', 'I tend to think that…', 'Nuanced. Signals you can hold a position lightly.', 'B2');
p('opinion', 'Je suis convaincu que…', 'I'm convinced that…', 'Strong. Save it for your main argument.', 'B1');
p('opinion', 'Personnellement, je dirais que…', 'Personally, I'd say that…', 'Conditional softens the claim.', 'B1');
p('opinion', 'Ça dépend vraiment de…', 'It really depends on…', 'A legitimate answer, not a dodge — provided you then say what it depends on.');
p('opinion', 'D'un côté… , de l'autre…', 'On one hand… , on the other…', 'Structures a balanced answer in two moves.');
p('opinion', 'Force est de constater que…', 'One cannot but note that…', 'Very formal. Writing and Section B only, once.', 'B2');

/* ───────────────────── Réagir ───────────────────── */

p('reagir', 'Tout à fait.', 'Absolutely.', 'Short agreement. Keeps the rhythm.');
p('reagir', 'Je vois ce que vous voulez dire.', 'I see what you mean.', 'Shows comprehension without agreeing.');
p('reagir', 'Ah bon ? Pourquoi ?', 'Really? Why?', 'Two words that hand the turn back and buy you ten seconds.');
p('reagir', 'C'est vrai, mais…', 'That's true, but…', 'Minimum viable concession.');
p('reagir', 'Je ne suis pas tout à fait d'accord.', 'I don't entirely agree.', 'Softened disagreement — more mature than "je ne suis pas d'accord".', 'B1');
p('reagir', 'C'est un bon argument.', 'That's a good point.', 'Costs nothing, earns goodwill, buys time.');
p('reagir', 'Effectivement.', 'Indeed. / That's right.', 'One word, sounds advanced, useful everywhere.', 'B1');
p('reagir', 'Je n'avais pas vu les choses sous cet angle.', 'I hadn't looked at it that way.', 'Graceful concession before you push back.', 'B2');

/* ──────────────── Registre poli ──────────────── */

p('politesse', 'Bonjour, excusez-moi de vous déranger.', 'Hello, sorry to bother you.', 'Standard opening to a stranger. Automatic.');
p('politesse', 'Je me permets de vous contacter au sujet de…', 'I'm taking the liberty of contacting you about…', 'Formal opening, spoken or written.', 'B1');
p('politesse', 'Ce serait possible ?', 'Would that be possible?', 'Short, conditional, polite. Ends a request neatly.');
p('politesse', 'Je vous en prie.', 'You're welcome. / Please, go ahead.', 'Two meanings. In Québec you will also hear "Bienvenue".');
p('politesse', 'Avec plaisir.', 'With pleasure.', 'Warmer than "de rien".');
p('politesse', 'Je vous remercie d'avance.', 'Thank you in advance.', 'Closing a request.', 'B1');
p('politesse', 'Bonne journée, au revoir.', 'Have a good day, goodbye.', 'Never hang up on an examiner without this.');

export const PHRASES = P;

export const byGroup = (g) => P.filter(x => x.group === g);
export const PHRASE_COUNT = P.length;
