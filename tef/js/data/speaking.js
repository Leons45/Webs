// Everything you say out loud. This is the centre of the app.

/* ── Shadowing ───────────────────────────────────────────────────
   You hear it, you say it back immediately, you compare. Shadowing is the
   fastest route from "I understand this" to "I can produce this", because
   it trains the mouth, not the head. Graded A2 → B2.                    */

export const SHADOW = [
  // A2 — short, high-frequency, exam-shaped
  { id:'s01', level:'A2', fr:'Bonjour, je vous appelle au sujet de l'annonce.', en:'Hello, I'm calling about the advertisement.' },
  { id:'s02', level:'A2', fr:'Est-ce que le logement est toujours disponible ?', en:'Is the flat still available?' },
  { id:'s03', level:'A2', fr:'Pourriez-vous me préciser le montant du loyer ?', en:'Could you tell me the exact rent?' },
  { id:'s04', level:'A2', fr:'Je voudrais savoir si les charges sont comprises.', en:'I'd like to know whether utilities are included.' },
  { id:'s05', level:'A2', fr:'À quelle heure est-ce que vous fermez ?', en:'What time do you close?' },
  { id:'s06', level:'A2', fr:'Je travaille comme concepteur multimédia depuis deux ans.', en:'I've been working as a multimedia designer for two years.' },
  { id:'s07', level:'A2', fr:'Je n'ai pas bien compris, pourriez-vous répéter ?', en:'I didn't quite catch that, could you repeat?' },
  { id:'s08', level:'A2', fr:'Ça fait presque un an que j'apprends le français.', en:'I've been learning French for almost a year.' },
  { id:'s09', level:'A2', fr:'Je suis désolé, je cherche mes mots.', en:'Sorry, I'm looking for the words.' },
  { id:'s10', level:'A2', fr:'Est-ce qu'il faut apporter un justificatif de domicile ?', en:'Do I need to bring proof of address?' },
  { id:'s11', level:'A2', fr:'Je préférerais le matin, si c'est possible.', en:'I'd prefer the morning, if possible.' },
  { id:'s12', level:'A2', fr:'Merci beaucoup pour toutes ces précisions.', en:'Thank you very much for all these details.' },

  // B1 — longer, with subordination
  { id:'s13', level:'B1', fr:'Si j'ai bien compris, le dépôt est remboursé à la fin du bail.', en:'If I've understood, the deposit is refunded at the end of the lease.' },
  { id:'s14', level:'B1', fr:'J'aimerais savoir ce qui se passe si j'annule à la dernière minute.', en:'I'd like to know what happens if I cancel at the last minute.' },
  { id:'s15', level:'B1', fr:'Ce qui m'inquiète, c'est surtout le délai de traitement.', en:'What worries me is mainly the processing time.' },
  { id:'s16', level:'B1', fr:'Je comprends votre position, mais j'avoue que le tarif me paraît élevé.', en:'I understand your position, but I must say the price seems high to me.' },
  { id:'s17', level:'B1', fr:'Est-ce qu'il serait possible de décaler le rendez-vous à la semaine prochaine ?', en:'Would it be possible to move the appointment to next week?' },
  { id:'s18', level:'B1', fr:'Avant de m'engager, je voudrais connaître les conditions d'annulation.', en:'Before committing, I'd like to know the cancellation terms.' },
  { id:'s19', level:'B1', fr:'En quoi consiste exactement la période d'essai ?', en:'What exactly does the probation period involve?' },
  { id:'s20', level:'B1', fr:'Je vous propose un compromis : on essaie pendant un mois.', en:'Let me suggest a compromise: we try it for a month.' },
  { id:'s21', level:'B1', fr:'Quand j'aurai reçu la réponse, je vous recontacterai immédiatement.', en:'Once I've received the answer, I'll get back to you straight away.' },
  { id:'s22', level:'B1', fr:'Il faudrait que je réfléchisse avant de vous donner une réponse définitive.', en:'I'd need to think before giving you a definitive answer.' },

  // B2 — the register that earns the grade
  { id:'s23', level:'B2', fr:'Certes, le loyer est élevé ; il n'en demeure pas moins que l'emplacement est idéal.', en:'Granted, the rent is high; the location is nonetheless ideal.' },
  { id:'s24', level:'B2', fr:'Étant donné que les délais sont serrés, je propose que nous commencions dès lundi.', en:'Given that deadlines are tight, I suggest we start on Monday.' },
  { id:'s25', level:'B2', fr:'Ce que je conteste, ce n'est pas le principe, c'est la façon dont il est appliqué.', en:'What I dispute isn't the principle, it's the way it's applied.' },
  { id:'s26', level:'B2', fr:'Admettons que vous ayez raison sur ce point ; cela ne règle pas la question du financement.', en:'Let's grant you're right on that; it doesn't settle the funding question.' },
  { id:'s27', level:'B2', fr:'Force est de constater que la situation s'est nettement dégradée ces derniers mois.', en:'One cannot but note that the situation has clearly worsened in recent months.' },
  { id:'s28', level:'B2', fr:'Je me permets d'insister, car il s'agit d'un point déterminant pour ma décision.', en:'I'll press the point, as it's decisive for my decision.' },
  { id:'s29', level:'B2', fr:'En revanche, je ne suis pas convaincu que cette solution soit viable à long terme.', en:'On the other hand, I'm not convinced this solution is viable long term.' },
  { id:'s30', level:'B2', fr:'Tout bien considéré, l'investissement me paraît justifié malgré le coût initial.', en:'All things considered, the investment seems justified despite the initial cost.' },
];

/* ── Question drill (Section A) ───────────────────────────────────
   You see the English, you SAY the French question. The point is speed:
   Section A gives you five minutes and the examiner counts how many
   distinct, well-formed questions you produce.                          */

export const QUESTION_DRILL = [
  { id:'q01', en:'Is the flat still available?', fr:'Est-ce que le logement est toujours disponible ?', alt:'Le logement est-il toujours disponible ?' },
  { id:'q02', en:'How much is the rent exactly?', fr:'Quel est le montant exact du loyer ?', alt:'Combien coûte le loyer exactement ?' },
  { id:'q03', en:'Are the utilities included?', fr:'Est-ce que les charges sont comprises ?', alt:'Les charges sont-elles comprises ?' },
  { id:'q04', en:'How long is the lease?', fr:'Quelle est la durée du bail ?', alt:'Le bail est d'une durée de combien ?' },
  { id:'q05', en:'From when is it available?', fr:'À partir de quand est-il disponible ?', alt:'Il est libre à partir de quand ?' },
  { id:'q06', en:'Could you tell me whether parking is included?', fr:'Pourriez-vous me dire si le stationnement est compris ?' },
  { id:'q07', en:'Are there any extra charges?', fr:'Y a-t-il des frais supplémentaires ?', alt:'Est-ce qu'il y a des frais supplémentaires ?' },
  { id:'q08', en:'What documents do I need to bring?', fr:'Quels documents dois-je apporter ?', alt:'Quels sont les documents à fournir ?' },
  { id:'q09', en:'What happens if I cancel?', fr:'Que se passe-t-il si j'annule ?', alt:'Qu'est-ce qui se passe si j'annule ?' },
  { id:'q10', en:'Would it be possible to visit on Saturday?', fr:'Est-ce qu'il serait possible de visiter samedi ?' },
  { id:'q11', en:'What exactly does the training involve?', fr:'En quoi consiste exactement la formation ?' },
  { id:'q12', en:'Are there any prerequisites?', fr:'Y a-t-il des prérequis ?', alt:'Faut-il un niveau particulier ?' },
  { id:'q13', en:'How many people are there per class?', fr:'Combien de personnes y a-t-il par groupe ?' },
  { id:'q14', en:'Is the certificate recognised?', fr:'Est-ce que l'attestation est reconnue ?', alt:'L'attestation est-elle reconnue ?' },
  { id:'q15', en:'Can one pay in instalments?', fr:'Peut-on payer en plusieurs fois ?', alt:'Est-ce qu'on peut payer en plusieurs fois ?' },
  { id:'q16', en:'What are the cancellation conditions?', fr:'Quelles sont les conditions d'annulation ?' },
  { id:'q17', en:'How long should I allow for the procedure?', fr:'Combien de temps faut-il compter pour la démarche ?' },
  { id:'q18', en:'Who should I contact if there's a problem?', fr:'Qui dois-je contacter en cas de problème ?', alt:'À qui faut-il s'adresser en cas de problème ?' },
  { id:'q19', en:'Is there a deadline for registering?', fr:'Y a-t-il une date limite d'inscription ?' },
  { id:'q20', en:'What time do you close?', fr:'À quelle heure fermez-vous ?' },
  { id:'q21', en:'Could you specify the schedule?', fr:'Pourriez-vous me préciser les horaires ?' },
  { id:'q22', en:'What about insurance?', fr:'Qu'en est-il de l'assurance ?' },
  { id:'q23', en:'Is anything in particular to be planned for?', fr:'Faut-il prévoir quelque chose de particulier ?' },
  { id:'q24', en:'Under what circumstances is the deposit kept?', fr:'Dans quel cas le dépôt est-il conservé ?' },
  { id:'q25', en:'Why is the previous tenant leaving?', fr:'Pourquoi le locataire précédent part-il ?', alt:'Pour quelle raison l'ancien locataire s'en va-t-il ?' },
  { id:'q26', en:'Just to be sure I've understood: the deposit is refunded, is that right?', fr:'Pour être sûr de bien comprendre : le dépôt est remboursé, c'est bien ça ?' },
  { id:'q27', en:'Could I visit before deciding?', fr:'Est-ce que je pourrais visiter avant de décider ?' },
  { id:'q28', en:'Is there a trial period?', fr:'Y a-t-il une période d'essai ?' },
  { id:'q29', en:'One last question, if I may.', fr:'Une dernière question, si vous permettez.' },
  { id:'q30', en:'What would you advise in my situation?', fr:'Que me conseilleriez-vous dans ma situation ?' },
];

/* ── Quick answers ───────────────────────────────────────────────
   A question appears; you answer aloud within 30 seconds. No preparation,
   no notes. This is where hesitation gets trained out.                  */

export const QUICK = [
  { id:'k01', fr:'Parlez-moi de votre travail.', en:'Tell me about your job.' },
  { id:'k02', fr:'Qu'est-ce que vous avez fait le week-end dernier ?', en:'What did you do last weekend?' },
  { id:'k03', fr:'Décrivez votre quartier.', en:'Describe your neighbourhood.' },
  { id:'k04', fr:'Pourquoi apprenez-vous le français ?', en:'Why are you learning French?' },
  { id:'k05', fr:'Préférez-vous travailler chez vous ou au bureau ? Pourquoi ?', en:'Do you prefer working from home or at the office? Why?' },
  { id:'k06', fr:'Racontez un problème que vous avez résolu récemment.', en:'Describe a problem you solved recently.' },
  { id:'k07', fr:'Quels sont les avantages de vivre en ville ?', en:'What are the advantages of living in a city?' },
  { id:'k08', fr:'Qu'est-ce qui vous plaît le moins dans votre routine ?', en:'What do you like least about your routine?' },
  { id:'k09', fr:'Comment vous déplacez-vous au quotidien ?', en:'How do you get around day to day?' },
  { id:'k10', fr:'Que feriez-vous avec un mois de congé ?', en:'What would you do with a month off?' },
  { id:'k11', fr:'Décrivez une personne qui vous a influencé.', en:'Describe someone who influenced you.' },
  { id:'k12', fr:'Est-ce que la technologie nous facilite vraiment la vie ?', en:'Does technology really make life easier?' },
  { id:'k13', fr:'Quel conseil donneriez-vous à un nouvel arrivant ?', en:'What advice would you give a newcomer?' },
  { id:'k14', fr:'Préférez-vous les grandes villes ou les petites villes ?', en:'Do you prefer big cities or small towns?' },
  { id:'k15', fr:'Racontez votre dernier déménagement.', en:'Tell me about your last move.' },
  { id:'k16', fr:'Qu'est-ce qui a changé dans votre métier ces dernières années ?', en:'What has changed in your field in recent years?' },
  { id:'k17', fr:'Comment gérez-vous une journée chargée ?', en:'How do you handle a busy day?' },
  { id:'k18', fr:'Faut-il limiter le temps d'écran des enfants ?', en:'Should children's screen time be limited?' },
  { id:'k19', fr:'Décrivez un projet dont vous êtes fier.', en:'Describe a project you're proud of.' },
  { id:'k20', fr:'Qu'est-ce qui vous motive à vous lever le matin ?', en:'What motivates you to get up in the morning?' },
  { id:'k21', fr:'Le télétravail est-il une bonne chose ?', en:'Is remote work a good thing?' },
  { id:'k22', fr:'Comment choisiriez-vous un logement ?', en:'How would you go about choosing a flat?' },
  { id:'k23', fr:'Racontez une fois où vous vous êtes trompé.', en:'Tell me about a time you got something wrong.' },
  { id:'k24', fr:'Qu'est-ce qui rend une ville agréable à vivre ?', en:'What makes a city pleasant to live in?' },
];

/* ── Section A simulations ───────────────────────────────────────
   Five minutes. You have a document. You ask — you never give opinions.  */

export const SECTION_A = [
  { id:'A1', minutes:5, title:'Un local pour un atelier', titleEn:'A unit for a studio',
    doc:'À louer : local commercial de 45 m² au rez-de-chaussée, convient à un atelier ou à un studio. Vitrine sur rue. 1 400 $/mois. Visite sur rendez-vous.',
    docEn:'For rent: 45 m² ground-floor commercial unit, suitable for a studio or workshop. Street-facing window. $1,400/month. Viewings by appointment.',
    musts:[
      { fr:'la durée du bail', en:'lease length' },
      { fr:'ce que comprend le loyer', en:'what the rent covers' },
      { fr:'les travaux autorisés', en:'what alterations are allowed' },
      { fr:'les horaires d'accès', en:'access hours' },
      { fr:'le dépôt demandé', en:'the deposit required' },
      { fr:'pourquoi le local est libre', en:'why the unit is vacant' },
    ] },
  { id:'A2', minutes:5, title:'Une formation du soir', titleEn:'An evening course',
    doc:'Formation en graphisme numérique, 12 semaines, cours du soir deux fois par semaine. Places limitées. Attestation remise en fin de parcours. Inscription avant le 30 du mois.',
    docEn:'Digital design course, 12 weeks, evening classes twice a week. Limited places. Certificate awarded on completion. Register before the 30th.',
    musts:[
      { fr:'les prérequis', en:'prerequisites' },
      { fr:'le tarif et le paiement', en:'price and payment' },
      { fr:'les horaires exacts', en:'exact timetable' },
      { fr:'le matériel à fournir', en:'equipment to bring' },
      { fr:'la reconnaissance de l'attestation', en:'whether the certificate is recognised' },
      { fr:'le nombre de participants', en:'class size' },
    ] },
  { id:'A3', minutes:5, title:'Un covoiturage quotidien', titleEn:'A daily carpool',
    doc:'Covoiturage quotidien North York → centre-ville, départ 7 h 30, retour 17 h 45. Participation aux frais : 60 $/semaine. Deux places disponibles.',
    docEn:'Daily carpool North York → downtown, leaving 7:30, returning 17:45. Cost share: $60/week. Two seats available.',
    musts:[
      { fr:'le point de rendez-vous', en:'the pick-up point' },
      { fr:'la souplesse des horaires', en:'how flexible the times are' },
      { fr:'ce qui se passe en cas de retard', en:'what happens if someone is late' },
      { fr:'ce que couvre la participation', en:'what the payment covers' },
      { fr:'la conduite en hiver', en:'winter driving' },
      { fr:'la possibilité d'essayer', en:'whether a trial is possible' },
    ] },
  { id:'A4', minutes:5, title:'Une garde d'animaux', titleEn:'Pet-sitting',
    doc:'Garde d'animaux à domicile. Visites une ou deux fois par jour. Tarif à partir de 25 $ la visite. Sur réservation. Références disponibles.',
    docEn:'In-home pet sitting. One or two visits a day. From $25 per visit. By reservation. References available.',
    musts:[
      { fr:'la durée d'une visite', en:'how long a visit lasts' },
      { fr:'ce qui est fait pendant la visite', en:'what happens during the visit' },
      { fr:'l'assurance en cas de problème', en:'insurance if something goes wrong' },
      { fr:'comment vous êtes informé', en:'how you are kept informed' },
      { fr:'les conditions d'annulation', en:'cancellation terms' },
      { fr:'le tarif pour votre période', en:'the price for your dates' },
    ] },
  { id:'A5', minutes:5, title:'Un appartement à louer', titleEn:'A flat to rent',
    doc:'4½ lumineux, 1 480 $/mois, électricité en sus. Stationnement intérieur contre supplément. Bail minimum de douze mois. Animaux acceptés. Libre le 1er du mois prochain.',
    docEn:'Bright 4½, $1,480/month, electricity extra. Indoor parking for a supplement. Twelve-month minimum lease. Pets allowed. Available the 1st of next month.',
    musts:[
      { fr:'le coût réel de l'électricité', en:'the real cost of electricity' },
      { fr:'le supplément de stationnement', en:'the parking supplement' },
      { fr:'l'état des lieux et le dépôt', en:'condition report and deposit' },
      { fr:'les voisins et le bruit', en:'neighbours and noise' },
      { fr:'les conditions de résiliation', en:'how to terminate early' },
      { fr:'la possibilité de visiter', en:'arranging a viewing' },
    ] },
  { id:'A6', minutes:5, title:'Un cours de conversation', titleEn:'A conversation class',
    doc:'Atelier de conversation française, petits groupes de six personnes maximum. Samedi matin, 9 h – 11 h. 180 $ pour huit séances. Tous niveaux à partir de A2.',
    docEn:'French conversation workshop, groups of six maximum. Saturday mornings, 9–11. $180 for eight sessions. All levels from A2.',
    musts:[
      { fr:'le niveau des autres participants', en:'the other participants' level' },
      { fr:'ce qu'on fait pendant une séance', en:'what happens in a session' },
      { fr:'la possibilité d'assister à un essai', en:'whether a trial session is possible' },
      { fr:'ce qui se passe si on manque une séance', en:'what if you miss a session' },
      { fr:'la formation de l'animateur', en:'the facilitator's background' },
      { fr:'le remboursement éventuel', en:'any refund policy' },
    ] },
];

/* ── Section B simulations ───────────────────────────────────────
   Ten minutes. You must convince someone close to you who resists.
   The objections below are spoken aloud by the app at intervals, so you
   have to react in real time rather than recite a prepared speech.       */

export const SECTION_B = [
  { id:'B1', minutes:10, title:'Le vélo d'hiver', titleEn:'Cycling through winter',
    task:'Convaincs ton colocataire d'aller travailler à vélo de novembre à mars.',
    taskEn:'Convince your flatmate to cycle to work from November to March.',
    objections:[
      { fr:'Franchement, avec la neige, c'est dangereux. Je ne me vois pas faire ça.', en:'Honestly, with the snow it's dangerous. I can't see myself doing it.' },
      { fr:'Et le froid ? Je vais arriver gelé au bureau.', en:'And the cold? I'll arrive frozen at the office.' },
      { fr:'Ça va me prendre deux fois plus de temps qu'en autobus.', en:'It'll take me twice as long as the bus.' },
      { fr:'Je n'ai même pas le bon équipement, et ça coûte cher.', en:'I don't even have the right gear, and it's expensive.' },
      { fr:'Bon… peut-être. Mais qu'est-ce que tu proposes concrètement ?', en:'All right… maybe. But what exactly are you suggesting?' },
    ] },
  { id:'B2', minutes:10, title:'Déménager en banlieue', titleEn:'Moving to the suburbs',
    task:'Convaincs ton/ta partenaire de quitter le centre-ville pour un logement plus grand en banlieue.',
    taskEn:'Convince your partner to leave the city centre for a bigger place in the suburbs.',
    objections:[
      { fr:'Mais on perd tout : les restaurants, les amis, la vie de quartier.', en:'But we lose everything: restaurants, friends, neighbourhood life.' },
      { fr:'Le trajet va devenir insupportable. Une heure matin et soir.', en:'The commute will be unbearable. An hour each way.' },
      { fr:'On vient juste de s'installer ici. Pourquoi tout recommencer ?', en:'We've only just settled here. Why start over?' },
      { fr:'Tu dis que c'est moins cher, mais il faudra une deuxième voiture.', en:'You say it's cheaper, but we'd need a second car.' },
      { fr:'D'accord, admettons. Qu'est-ce qu'on fait si ça ne nous plaît pas ?', en:'Fine, let's say so. What do we do if we don't like it?' },
    ] },
  { id:'B3', minutes:10, title:'Un cours de français à deux', titleEn:'Taking a French class together',
    task:'Convaincs un ami de s'inscrire avec toi à un cours du soir dès ce trimestre.',
    taskEn:'Convince a friend to enrol with you in an evening class this term.',
    objections:[
      { fr:'Je n'ai vraiment pas le temps en ce moment. Peut-être l'an prochain.', en:'I really don't have time right now. Maybe next year.' },
      { fr:'De toute façon je suis nul en langues, ça ne sert à rien.', en:'Anyway I'm hopeless at languages, there's no point.' },
      { fr:'Deux soirs par semaine, après le travail ? C'est beaucoup.', en:'Two evenings a week, after work? That's a lot.' },
      { fr:'Et si j'abandonne au bout d'un mois, j'aurai payé pour rien.', en:'And if I quit after a month, I'll have paid for nothing.' },
      { fr:'Hmm. Qu'est-ce qui te fait croire que ça marcherait pour moi ?', en:'Hmm. What makes you think it would work for me?' },
    ] },
  { id:'B4', minutes:10, title:'Partager plutôt qu'acheter', titleEn:'Sharing instead of buying',
    task:'Ton frère veut acheter du matériel coûteux qu'il utilisera trois fois par an. Convaincs-le de le louer.',
    taskEn:'Your brother wants to buy expensive equipment he'll use three times a year. Convince him to rent instead.',
    objections:[
      { fr:'Oui mais si je l'achète, il est à moi, je l'ai quand je veux.', en:'Yes but if I buy it, it's mine, I have it whenever I want.' },
      { fr:'Louer, à la longue, ça revient plus cher, non ?', en:'Renting works out more expensive in the long run, doesn't it?' },
      { fr:'Et la qualité ? Le matériel de location est souvent abîmé.', en:'What about quality? Rental gear is often damaged.' },
      { fr:'J'ai déjà mis l'argent de côté, alors autant en profiter.', en:'I've already set the money aside, so I may as well use it.' },
      { fr:'Bon, tu as peut-être raison. Tu ferais quoi à ma place ?', en:'All right, maybe you're right. What would you do in my position?' },
    ] },
  { id:'B5', minutes:10, title:'Moins de réunions', titleEn:'Fewer meetings',
    task:'Convaincs ton collègue de remplacer la moitié des réunions par des notes écrites partagées.',
    taskEn:'Convince your colleague to replace half the meetings with shared written notes.',
    objections:[
      { fr:'Sans réunion, personne ne saura ce que font les autres.', en:'Without meetings nobody will know what the others are doing.' },
      { fr:'Les gens ne lisent pas. On va tout réexpliquer en réunion de toute façon.', en:'People don't read. We'll end up re-explaining it all in a meeting anyway.' },
      { fr:'Écrire prend plus de temps que parler, franchement.', en:'Writing takes more time than talking, honestly.' },
      { fr:'Et la direction ? Elle tient à ces réunions.', en:'And management? They're attached to those meetings.' },
      { fr:'D'accord pour essayer. Mais sur quelle durée, et comment on juge ?', en:'All right, let's try. But for how long, and how do we judge it?' },
    ] },
  { id:'B6', minutes:10, title:'Arrêter la voiture en ville', titleEn:'Giving up the car in town',
    task:'Convaincs un proche de vendre sa deuxième voiture et de passer aux transports en commun.',
    taskEn:'Convince a relative to sell their second car and switch to public transport.',
    objections:[
      { fr:'Avec les enfants, c'est impossible sans voiture.', en:'With the kids it's impossible without a car.' },
      { fr:'Les autobus ne sont jamais à l'heure l'hiver.', en:'The buses are never on time in winter.' },
      { fr:'Et les courses ? Je ne vais pas porter tout ça.', en:'And the shopping? I'm not carrying all that.' },
      { fr:'La voiture est déjà payée, je ne perds rien à la garder.', en:'The car is already paid off, I lose nothing by keeping it.' },
      { fr:'Mettons que j'essaie. Combien je gagnerais vraiment par mois ?', en:'Say I try it. How much would I actually save per month?' },
    ] },
];

/* ── Monologue topics ───────────────────────────────────────────
   Sixty seconds, no preparation. The goal is not brilliance; it is
   not stopping.                                                        */

export const MONOLOGUE = [
  { fr:'Un endroit où vous aimeriez retourner', en:'A place you'd like to go back to' },
  { fr:'Une décision difficile que vous avez prise', en:'A difficult decision you made' },
  { fr:'Ce qui vous agace dans les transports', en:'What annoys you about transport' },
  { fr:'Une habitude que vous voudriez changer', en:'A habit you'd like to change' },
  { fr:'Le meilleur conseil qu'on vous ait donné', en:'The best advice you've been given' },
  { fr:'Votre journée de travail idéale', en:'Your ideal working day' },
  { fr:'Faut-il travailler quatre jours par semaine ?', en:'Should we work four days a week?' },
  { fr:'Un objet dont vous ne pourriez pas vous passer', en:'An object you couldn't do without' },
  { fr:'Ce que vous avez appris cette année', en:'What you've learned this year' },
  { fr:'Vivre en ville ou à la campagne', en:'Living in the city or the countryside' },
  { fr:'Un projet que vous aimeriez lancer', en:'A project you'd like to start' },
  { fr:'Comment vous apprenez le mieux', en:'How you learn best' },
  { fr:'Ce qui a changé depuis votre arrivée au Canada', en:'What has changed since you came to Canada' },
  { fr:'Une personne que vous admirez et pourquoi', en:'Someone you admire and why' },
  { fr:'Le rôle de l'intelligence artificielle dans votre métier', en:'AI's role in your profession' },
  { fr:'Un échec qui vous a servi', en:'A failure that served you well' },
  { fr:'Comment réduire le coût de la vie', en:'How to reduce the cost of living' },
  { fr:'Ce que vous feriez avec une année sabbatique', en:'What you'd do with a sabbatical year' },
  { fr:'Les avantages et les limites du télétravail', en:'The advantages and limits of remote work' },
  { fr:'Un film ou un livre qui vous a marqué', en:'A film or book that stayed with you' },
  { fr:'Ce qui rend un quartier agréable', en:'What makes a neighbourhood pleasant' },
  { fr:'Faut-il limiter les écrans chez les enfants ?', en:'Should children's screens be limited?' },
  { fr:'Votre rapport au temps libre', en:'Your relationship with free time' },
  { fr:'Un changement que vous souhaiteriez dans votre ville', en:'A change you'd like in your city' },
];

export const SHADOW_BY_LEVEL = (lv) => SHADOW.filter(s => s.level === lv);
