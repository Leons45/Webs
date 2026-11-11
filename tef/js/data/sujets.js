// Sujets — the real Expression Écrite prompts candidates have reported after
// sitting the exam, grouped into the handful of themes they keep coming
// from. The exam does not repeat a prompt, but it recycles its *subjects* —
// so the useful unit of preparation is not "memorise this story" but "own
// the vocabulary and connectors this family of topics needs."
//
// Each category carries: the real prompts that belong to it (so you can see
// exactly what you are preparing for), a set of topic-specific chunks with a
// full example sentence, and — for the two "Structurer" decks — the
// connectors that hold together ANY Section A narrative or ANY Section B
// argument, regardless of which prompt you draw on exam day.

export const CATS = {
  structureA: { section:'A', fr:'Structurer le récit',            en:'Structuring the narrative',
    note:'These hold together any Section A story, whichever of the prompts below you draw. Learn these before the topic vocabulary — they are what makes a story read as one piece instead of four disconnected sentences.' },
  enfants:    { section:'A', fr:'Enfants & jeunes héros',          en:'Children & young heroes',
    note:'A child does something unexpected — runs off, digs up a surprise, saves the day. Precision matters: the age, what exactly happened, who stepped in.' },
  famille:    { section:'A', fr:'Famille & couple',                en:'Family & couples',
    note:'A relationship with a hidden layer — a secret, a sudden decision, a celebration that turns. The vocabulary here is about feeling and family roles, not just events.' },
  animaux:    { section:'A', fr:'Animaux insolites',               en:'Unusual animal stories',
    note:'A small but recurring family — a zoo, a pet, an animal behaving in a way nobody expected. Short category, worth owning completely.' },
  police:     { section:'A', fr:'Police, mystère & disparitions',  en:'Police, mystery & disappearances',
    note:'An investigation, a strange discovery, a culprit found. The highest-frequency Section A family — this vocabulary earns back its study time.' },
  voyage:     { section:'A', fr:'Voyages & lieux',                 en:'Travel & places',
    note:'Somewhere unfamiliar, a journey interrupted, officials reacting to something. Needs vocabulary for places and for the people in charge of them.' },
  exploits:   { section:'A', fr:'Exploits & records inattendus',   en:'Unexpected feats & records',
    note:'A late-life achievement, a record, a secret revealed after decades. Smaller category — learn it quickly and move on.' },

  structureB: { section:'B', fr:'Structurer l’argumentation',      en:'Structuring the argument',
    note:'The connectors that make an opinion letter sound reasoned rather than listed. Different from the récit connectors above — here you concede, qualify and conclude.' },
  techno:     { section:'B', fr:'Technologie, écrans & réseaux',   en:'Technology, screens & social media',
    note:'By far the most frequent Section B family. Phones, social media, screen time, targeted ads — own this vocabulary first.' },
  education:  { section:'B', fr:'École & éducation',               en:'School & education',
    note:'Grades, discipline, distance learning, time spent at school. A close second in frequency — these topics reward the same half-dozen chunks reused differently.' },
  environnement:{ section:'B', fr:'Environnement & consommation', en:'Environment & consumption',
    note:'Consumption, plastic, pollution, cars and planes. Pairs well with the environment vocabulary already in Vocabulaire.' },
  sante:      { section:'B', fr:'Santé & mode de vie',             en:'Health & lifestyle',
    note:'Diet, cooking, vegetarianism. A small family, but it recurs almost every sitting.' },
  societe:    { section:'B', fr:'Société & valeurs',                en:'Society & values',
    note:'Adulthood, fame and talent, surveillance, who we surround ourselves with. The most abstract family — concrete examples carry the grade here.' },
};

/* ───────────────────────── real exam prompts ─────────────────────────
   Reported by candidates after sitting the exam. Kept close to the
   original wording; translated for study, not reworded into something
   smoother than what you will actually face. */

const T = [];
let tn = 0;
const t = (section, category, fr, en) => {
  T.push({ id: (section === 'A' ? 'tA' : 'tB') + (++tn).toString().padStart(2, '0'), section, category, fr, en });
};

// Section A — continue the narrative
t('A','enfants',  'Un garçon curieux de deux ans s’est échappé du jardin d’enfants.',
                  'A curious two-year-old boy escaped from daycare.');
t('A','famille',  'Une grand-mère de 80 ans vit en parfaite complicité avec sa petite-fille, très protectrice, jusqu’au jour où elle décide de prendre sa liberté.',
                  'An 80-year-old grandmother lives in perfect closeness with her very protective granddaughter — until the day she decides to claim her independence.');
t('A','enfants',  'Deux écoliers ont creusé dans un jardin, puis ont trouvé quelque chose d’inattendu…',
                  'Two schoolchildren dug in a garden, then found something unexpected…');
t('A','famille',  'Un couple fête son anniversaire de mariage au bord de la mer, mais la météo devient capricieuse…',
                  'A couple is celebrating their wedding anniversary by the sea, but the weather turns unpredictable…');
t('A','exploits', 'Une femme de 79 ans est devenue athlète, bien qu’elle n’ait jamais fait de sport avant l’âge de 59 ans.',
                  'A 79-year-old woman became an athlete, despite never having done sport before the age of 59.');
t('A','voyage',   'Un homme de 80 ans se rend en ville pour la première fois.',
                  'An 80-year-old man goes into the city for the first time.');
t('A','police',   'Un homme a été retrouvé coincé à l’intérieur d’un magasin de sport.',
                  'A man was found trapped inside a sports shop.');
t('A','police',   'Un policier japonais de Kanagawa découvre plus de 24 000 lettres à son domicile. Une enquête est ouverte.',
                  'A Japanese police officer in Kanagawa discovers over 24,000 letters at his home. An investigation is opened.');
t('A','police',   'Un criminel en Australie : quelle surprise quand la police découvre le coupable !',
                  'A criminal in Australia: what a surprise when police discover the culprit!');
t('A','police',   'Un motard roulait à 210 km/h, une seule main sur le guidon — et dans l’autre, il tenait quelque chose de surprenant.',
                  'A biker was riding at 210 km/h with one hand on the handlebar — and in the other, he held something surprising.');
t('A','famille',  'Après avoir découvert que son mari lui cachait une vérité, la femme a décidé de se venger.',
                  'After discovering that her husband had been hiding a truth from her, the woman decided to take revenge.');
t('A','voyage',   'Une jeune architecte a fait construire une maison dans un village magnifique. Les voisins et le maire de la commune n’attendaient pas ça…',
                  'A young architect had a house built in a beautiful village. The neighbours and the mayor did not expect that…');
t('A','animaux',  'Un zoo a adopté cinq perroquets. Un jour, après vingt minutes de spectacle, ils ont commencé à insulter les visiteurs…',
                  'A zoo took in five parrots. One day, after twenty minutes of a show, they started insulting visitors…');
t('A','enfants',  'Un enfant de six ans a appelé le numéro d’urgence pour se plaindre de ses cadeaux de Noël. Les autorités ont décidé de lui rendre visite…',
                  'A six-year-old called the emergency number to complain about his Christmas presents. The authorities decided to visit him…');
t('A','enfants',  'Walid, un garçon de 13 ans, a sauvé ses camarades en remplaçant le chauffeur du bus.',
                  'Walid, a 13-year-old boy, saved his classmates by taking over from the bus driver.');
t('A','voyage',   'Le vol a fait demi-tour après qu’une passagère s’est sentie mal.',
                  'The flight turned back after a passenger felt unwell.');
t('A','enfants',  'Un petit garçon est tombé dans la rivière quand, soudain…',
                  'A little boy fell into the river when, suddenly…');
t('A','exploits', 'Un couple de 105 et 106 ans est entré dans le livre des records comme le couple marié le plus âgé. Jusqu’à aujourd’hui, ils gardaient un secret…',
                  'A couple aged 105 and 106 made it into the record books as the oldest married couple. Until today, they had kept a secret…');
t('A','police',   'Quelqu’un a volé un vélo ; le lendemain, l’homme a vu quelqu’un d’autre avec le même vélo.',
                  'Someone stole a bicycle; the next day, the man saw someone else with the same bicycle.');
t('A','animaux',  'Un peintre célèbre a eu un accident au zoo. Quand les pompiers sont arrivés, ils ont été très surpris de voir un animal de compagnie plutôt ordinaire.',
                  'A famous painter had an accident at the zoo. When the firefighters arrived, they were very surprised to see a rather ordinary pet.');
t('A','police',   'Sur les rives du Congo, deux jeunes filles ont trouvé une bouteille contenant un message. Elles ont répondu aussitôt et ont remis la bouteille à l’eau, sans se douter que ce petit geste allait déclencher quelque chose…',
                  'On the banks of the Congo, two young girls found a bottle containing a message. They replied at once and put the bottle back in the water, with no idea that this small gesture would set off something…');
t('A','voyage',   'Un voyageur avait l’habitude de photographier des sites touristiques. Cependant, un jour, les autorités municipales sont soudainement intervenues.',
                  'A traveller used to photograph tourist sites. However, one day, the municipal authorities suddenly intervened.');

// Section B — defend an opinion
t('B','societe',  'L’art, c’est beau, mais inutile.',
                  'Art is beautiful, but useless.');
t('B','societe',  'Pour être un adulte responsable, il faut vivre seul.',
                  'To be a responsible adult, one must live alone.');
t('B','environnement','Acheter trop de vêtements de nos jours devient irresponsable.',
                  'Buying too many clothes nowadays is becoming irresponsible.');
t('B','societe',  'Pour être une star, il n’est pas nécessaire d’avoir du talent.',
                  'To be a star, talent isn’t necessary.');
t('B','societe',  'Il faut installer des caméras de surveillance dans les rues et à la maison.',
                  'Surveillance cameras should be installed in the streets and at home.');
t('B','techno',   'À cause des téléphones, nous sommes devenus paresseux.',
                  'Because of phones, we have become lazy.');
t('B','environnement','« On ne devrait utiliser sa voiture que pendant les vacances. »',
                  '"One should only use one’s car during the holidays."');
t('B','societe',  'Les personnes âgées ne devraient pas regarder la télévision.',
                  'Older people shouldn’t watch television.');
t('B','techno',   'Il faudrait limiter l’usage des réseaux sociaux à une heure par jour.',
                  'Social media use should be limited to one hour a day.');
t('B','sante',    'Apprendre à faire la cuisine, c’est une perte de temps.',
                  'Learning to cook is a waste of time.');
t('B','techno',   'Avec Internet et les réseaux sociaux, on est devenu des marchandises.',
                  'With the Internet and social media, we have become commodities.');
t('B','education','Les cantines scolaires devraient proposer uniquement des repas végétariens pour tous les élèves.',
                  'School canteens should serve only vegetarian meals to all students.');
t('B','education','Le système scolaire est devenu trop compétitif ; il faudrait supprimer les notes.',
                  'The school system has become too competitive; grades should be abolished.');
t('B','techno',   'Il faut supprimer la publicité sur les chaînes de télévision pour enfants.',
                  'Advertising should be banned on children’s television channels.');
t('B','societe',  'De nos jours, les jeunes ne s’intéressent qu’à leur image.',
                  'Nowadays, young people only care about their image.');
t('B','techno',   'Dans un monde d’écrans, les jeunes ne sauront plus lire.',
                  'In a world of screens, young people will no longer know how to read.');
t('B','education','La discipline s’apprend à la maison, pas à l’école.',
                  'Discipline is learned at home, not at school.');
t('B','education','L’école obligatoire tue la motivation des élèves.',
                  'Compulsory schooling kills students’ motivation.');
t('B','environnement','Il faut interdire les avions.',
                  'Planes should be banned.');
t('B','environnement','Les industries devraient urgemment supprimer les emballages plastiques.',
                  'Industries should urgently get rid of plastic packaging.');
t('B','sante',    'Pour être en bonne santé, il faut être végétarien.',
                  'To be healthy, one must be vegetarian.');
t('B','sante',    'Les gens ne mangent que de l’alimentation malsaine.',
                  'People eat nothing but unhealthy food.');
t('B','societe',  'Pour être heureux, il faut s’entourer de personnes qui nous ressemblent.',
                  'To be happy, one must surround oneself with people like us.');
t('B','environnement','Les gouvernements devraient prendre des mesures pour lutter contre la pollution.',
                  'Governments should take measures to fight pollution.');
t('B','education','La formation à distance est une illusion : rien ne remplace le cours en salle.',
                  'Distance learning is an illusion: nothing replaces the in-person class.');
t('B','education','Les enfants passent beaucoup trop de temps à l’école.',
                  'Children spend far too much time at school.');
t('B','education','Pour rendre les cours plus intéressants, les professeurs devraient utiliser les smartphones en classe.',
                  'To make classes more interesting, teachers should use smartphones in class.');

export const TOPICS = T;
export const topicsByCat = (c) => T.filter(x => x.category === c);

/* ───────────────────────── topic-flavoured chunks ─────────────────────
   Vocabulary built the same way as Vocabulaire: a chunk, not a word, with
   a full sentence drawn straight from the style of these prompts. */

const C = [];
let cn = 0;
const c = (category, fr, en, ex, exEn, level = 'A2') => {
  C.push({ id: 'sc' + (++cn).toString().padStart(3, '0'), category, fr, en, ex, exEn, level });
};

/* enfants */
c('enfants', 's’échapper de quelque part', 'to run off / escape from somewhere',
  'Le petit garçon s’est échappé du jardin d’enfants pendant la récréation.',
  'The little boy ran off from daycare during playtime.');
c('enfants', 'sain et sauf', 'safe and sound',
  'Il a été retrouvé sain et sauf une heure plus tard.',
  'He was found safe and sound an hour later.');
c('enfants', 'faire une bêtise', 'to get up to mischief',
  'Les écoliers ont fait une bêtise en creusant dans le jardin du voisin.',
  'The schoolchildren got up to mischief digging in the neighbour’s garden.');
c('enfants', 'prendre les choses en main', 'to take charge',
  'Walid a pris les choses en main quand le chauffeur s’est senti mal.',
  'Walid took charge when the driver felt unwell.', 'B1');
c('enfants', 'composer le numéro d’urgence', 'to dial the emergency number',
  'L’enfant a composé le numéro d’urgence pour se plaindre de ses cadeaux.',
  'The child dialled the emergency number to complain about his presents.');
c('enfants', 'tomber à l’eau', 'to fall into the water',
  'Le petit garçon est tombé à l’eau sans que personne ne le voie.',
  'The little boy fell into the water without anyone seeing.', 'B1');
c('enfants', 'avoir eu plus de peur que de mal', 'to be more scared than hurt',
  'Finalement, il a eu plus de peur que de mal.',
  'In the end he was more scared than hurt.', 'B1');

/* famille */
c('famille', 'une grande complicité', 'a close, easy bond',
  'La grand-mère et sa petite-fille vivaient dans une grande complicité.',
  'The grandmother and her granddaughter lived in a close, easy bond.');
c('famille', 'prendre sa liberté', 'to claim one’s independence',
  'Un jour, la grand-mère a décidé de prendre sa liberté.',
  'One day the grandmother decided to claim her independence.');
c('famille', 'fêter un anniversaire de mariage', 'to celebrate a wedding anniversary',
  'Ils fêtaient leur anniversaire de mariage au bord de la mer.',
  'They were celebrating their wedding anniversary by the sea.');
c('famille', 'la météo devient capricieuse', 'the weather turns unpredictable',
  'La météo est devenue capricieuse en plein après-midi.',
  'The weather turned unpredictable in the middle of the afternoon.', 'B1');
c('famille', 'cacher une vérité à quelqu’un', 'to hide a truth from someone',
  'Elle a découvert que son mari lui cachait une vérité depuis des années.',
  'She discovered her husband had been hiding a truth from her for years.', 'B1');
c('famille', 'se venger', 'to take revenge',
  'Elle a décidé de se venger discrètement.',
  'She decided to take quiet revenge.', 'B1');
c('famille', 'garder un secret', 'to keep a secret',
  'Le couple a gardé un secret pendant soixante ans de mariage.',
  'The couple kept a secret for sixty years of marriage.');

/* animaux */
c('animaux', 'adopter un animal', 'to take in / adopt an animal',
  'Le zoo a adopté cinq perroquets abandonnés.',
  'The zoo took in five abandoned parrots.');
c('animaux', 'se mettre à faire quelque chose', 'to suddenly start doing something',
  'Les perroquets se sont mis à insulter les visiteurs.',
  'The parrots suddenly started insulting visitors.');
c('animaux', 'un animal de compagnie', 'a pet',
  'Les pompiers ont découvert un animal de compagnie bien ordinaire.',
  'The firefighters found quite an ordinary pet.');
c('animaux', 'provoquer un fou rire', 'to cause fits of laughter',
  'La scène a provoqué un fou rire général.',
  'The scene caused general fits of laughter.', 'B1');
c('animaux', 'être dressé / apprivoisé', 'to be trained / tamed',
  'Personne ne savait que les perroquets avaient été dressés à parler ainsi.',
  'No one knew the parrots had been trained to talk like that.', 'B1');

/* police */
c('police', 'ouvrir une enquête', 'to open an investigation',
  'Une enquête a été ouverte après la découverte des lettres.',
  'An investigation was opened after the letters were discovered.');
c('police', 'être retrouvé coincé', 'to be found stuck / trapped',
  'L’homme a été retrouvé coincé dans le magasin fermé.',
  'The man was found trapped in the closed shop.');
c('police', 'interpeller un suspect', 'to apprehend a suspect',
  'La police a fini par interpeller le coupable.',
  'The police eventually apprehended the culprit.', 'B1');
c('police', 'rouler à toute vitesse', 'to drive at full speed',
  'Le motard roulait à plus de 200 km/h sans tenir son guidon.',
  'The biker was riding at over 200 km/h without holding the handlebar.');
c('police', 'un témoin', 'a witness',
  'Un témoin a reconnu le vélo volé dès le lendemain.',
  'A witness recognised the stolen bike the very next day.');
c('police', 'remettre quelque chose à l’eau', 'to put something back in the water',
  'Les filles ont remis la bouteille à l’eau sans se douter de rien.',
  'The girls put the bottle back in the water, suspecting nothing.', 'B1');
c('police', 'déclencher quelque chose', 'to set off / trigger something',
  'Ce petit geste a déclenché une enquête inattendue.',
  'That small gesture triggered an unexpected investigation.', 'B1');

/* voyage */
c('voyage', 'se rendre quelque part pour la première fois', 'to go somewhere for the first time',
  'L’homme de 80 ans se rendait en ville pour la première fois.',
  'The 80-year-old was going into the city for the first time.');
c('voyage', 'faire demi-tour', 'to turn back',
  'Le vol a fait demi-tour en plein ciel.',
  'The flight turned back mid-air.');
c('voyage', 'se sentir mal', 'to feel unwell',
  'Une passagère s’est sentie mal juste après le décollage.',
  'A passenger felt unwell right after take-off.');
c('voyage', 'les autorités municipales', 'the local/municipal authorities',
  'Les autorités municipales sont intervenues sans prévenir.',
  'The municipal authorities stepped in without warning.', 'B1');
c('voyage', 'un village pittoresque', 'a picturesque village',
  'L’architecte a fait construire une maison moderne dans un village pittoresque.',
  'The architect had a modern house built in a picturesque village.');
c('voyage', 'ne pas s’attendre à quelque chose', 'to not expect something',
  'Les voisins ne s’attendaient pas à une maison aussi moderne.',
  'The neighbours didn’t expect such a modern house.');

/* exploits */
c('exploits', 'se mettre au sport sur le tard', 'to take up sport late in life',
  'Elle s’est mise au sport sur le tard, à cinquante-neuf ans.',
  'She took up sport late, at fifty-nine.', 'B1');
c('exploits', 'battre un record', 'to break a record',
  'Le couple a battu le record du monde de longévité conjugale.',
  'The couple broke the world record for marriage longevity.', 'B1');
c('exploits', 'entrer dans le livre des records', 'to make it into the record books',
  'Ils sont entrés dans le livre des records à cent cinq et cent six ans.',
  'They made it into the record books at a hundred and five and a hundred and six.', 'B1');
c('exploits', 'révéler un secret', 'to reveal a secret',
  'Ce jour-là, ils ont enfin révélé leur secret.',
  'That day, they finally revealed their secret.');

/* techno */
c('techno', 'être accro à son téléphone', 'to be hooked on one’s phone',
  'De plus en plus de jeunes sont accros à leur téléphone.',
  'More and more young people are hooked on their phones.', 'B1');
c('techno', 'une dépendance aux écrans', 'a screen addiction',
  'La dépendance aux écrans touche toutes les générations.',
  'Screen addiction affects every generation.', 'B1');
c('techno', 'faire défiler les réseaux sociaux', 'to scroll through social media',
  'On passe des heures à faire défiler les réseaux sociaux.',
  'We spend hours scrolling through social media.');
c('techno', 'se soucier de son image', 'to worry about one’s image',
  'Les jeunes se soucient trop de leur image en ligne.',
  'Young people worry too much about their online image.', 'B1');
c('techno', 'nuire à la concentration', 'to harm concentration',
  'Les écrans nuisent à la concentration des enfants.',
  'Screens harm children’s concentration.', 'B1');
c('techno', 'limiter le temps d’écran', 'to limit screen time',
  'Il faudrait limiter le temps d’écran dès le plus jeune âge.',
  'Screen time should be limited from a very young age.');
c('techno', 'une publicité ciblée', 'targeted advertising',
  'La publicité ciblée s’adresse même aux enfants.',
  'Targeted advertising even targets children.', 'B2');

/* education */
c('education', 'supprimer les notes', 'to abolish grades',
  'Certains proposent de supprimer les notes à l’école.',
  'Some propose abolishing grades at school.', 'B1');
c('education', 'un système scolaire compétitif', 'a competitive school system',
  'Le système scolaire devient de plus en plus compétitif.',
  'The school system is becoming increasingly competitive.', 'B1');
c('education', 'la formation à distance', 'distance learning',
  'La formation à distance ne remplace pas le contact humain.',
  'Distance learning doesn’t replace human contact.');
c('education', 's’épanouir à l’école', 'to thrive at school',
  'Un enfant doit pouvoir s’épanouir à l’école, pas seulement réussir.',
  'A child should be able to thrive at school, not just succeed.', 'B2');
c('education', 'la pression scolaire', 'academic / school pressure',
  'La pression scolaire pèse sur les plus jeunes.',
  'Academic pressure weighs on the youngest.', 'B1');
c('education', 'un repas équilibré', 'a balanced meal',
  'Les cantines pourraient proposer davantage de repas équilibrés.',
  'Canteens could offer more balanced meals.');

/* environnement */
c('environnement', 'réduire sa consommation', 'to cut down on consumption',
  'Il faudrait réduire sa consommation de vêtements neufs.',
  'People should cut down on buying new clothes.', 'B1');
c('environnement', 'les emballages plastiques', 'plastic packaging',
  'Les industries devraient supprimer les emballages plastiques.',
  'Industries should get rid of plastic packaging.');
c('environnement', 'lutter contre la pollution', 'to fight pollution',
  'Les gouvernements doivent lutter contre la pollution de l’air.',
  'Governments must fight air pollution.');
c('environnement', 'augmenter son empreinte carbone', 'to increase one’s carbon footprint',
  'Prendre l’avion augmente fortement l’empreinte carbone.',
  'Flying greatly increases one’s carbon footprint.', 'B1');
c('environnement', 'une mode éphémère', 'fast / disposable fashion',
  'La mode éphémère pousse à acheter sans réfléchir.',
  'Fast fashion pushes people to buy without thinking.', 'B2');

/* sante */
c('sante', 'une alimentation malsaine', 'an unhealthy diet',
  'Beaucoup de gens ont une alimentation malsaine par manque de temps.',
  'Many people have an unhealthy diet for lack of time.', 'B1');
c('sante', 'adopter un régime végétarien', 'to adopt a vegetarian diet',
  'Adopter un régime végétarien n’est pas obligatoire pour être en bonne santé.',
  'Adopting a vegetarian diet isn’t required to be healthy.', 'B1');
c('sante', 'une perte de temps', 'a waste of time',
  'Apprendre à cuisiner n’est jamais une perte de temps.',
  'Learning to cook is never a waste of time.');
c('sante', 'prendre soin de sa santé', 'to take care of one’s health',
  'Cuisiner soi-même aide à prendre soin de sa santé.',
  'Cooking for yourself helps you look after your health.');

/* societe */
c('societe', 'vivre en autonomie', 'to live independently',
  'Vivre seul n’est pas la seule preuve de maturité.',
  'Living alone isn’t the only proof of maturity.', 'B1');
c('societe', 'être livré à soi-même', 'to be left to one’s own devices',
  'Les personnes âgées ne devraient pas être livrées à elles-mêmes devant la télévision.',
  'Older people shouldn’t be left to their own devices in front of the TV.', 'B2');
c('societe', 'une caméra de surveillance', 'a surveillance camera',
  'Installer des caméras partout pose la question de la vie privée.',
  'Installing cameras everywhere raises the question of privacy.');
c('societe', 's’entourer de gens différents', 'to surround oneself with different people',
  'S’entourer de gens différents nous fait grandir.',
  'Surrounding ourselves with different people helps us grow.', 'B1');
c('societe', 'réussir sans talent', 'to succeed without talent',
  'De nos jours, on peut devenir une star sans avoir de réel talent.',
  'Nowadays, you can become a star without any real talent.', 'B1');
c('societe', 'avoir de la valeur sans être utile', 'to have worth without being useful',
  'L’art n’a pas besoin d’être utile pour avoir de la valeur.',
  'Art doesn’t need to be useful to have value.', 'B2');

export const CHUNKS = C;
export const chunksByCat = (cat) => C.filter(x => x.category === cat);

/* ───────────────────────── structure decks ───────────────────────────
   Phrase-style — no example sentence of their own, since they attach to
   whatever story or argument you are building. */

const P = [];
let pn = 0;
const p = (category, fr, en, use) => {
  P.push({ id: 'sp' + (++pn).toString().padStart(3, '0'), category, fr, en, use });
};

p('structureA', 'Tout a commencé quand…', 'It all started when…', 'Opens the continuation — ties it back to the lead paragraph.');
p('structureA', 'C’est alors que…', 'That’s when…', 'Marks the turning point. Use once, at the pivot.');
p('structureA', 'Personne n’aurait pu imaginer que…', 'No one could have imagined that…', 'Builds suspense before the surprise.');
p('structureA', 'Ce qui s’est passé ensuite a surpris tout le monde.', 'What happened next surprised everyone.', 'A clean transition into the resolution.');
p('structureA', 'Quelques minutes plus tard,…', 'A few minutes later,…', 'Any time-marker keeps the récit moving — vary it across the four sentences.');
p('structureA', 'Sans que personne ne s’y attende,…', 'Without anyone expecting it,…', 'A more advanced way to say "suddenly".', 'B1');
p('structureA', 'Finalement, tout s’est bien terminé.', 'In the end, everything turned out fine.', 'A safe, neutral closing line when you are unsure how to resolve the story.');
p('structureA', 'On n’a jamais vraiment su pourquoi…', 'No one ever really knew why…', 'A good alternative ending when the prompt invites mystery rather than resolution.', 'B1');

p('structureB', 'Ce sujet divise énormément l’opinion publique.', 'This topic really divides public opinion.', 'A strong opening line for almost any Section B prompt.', 'B1');
p('structureB', 'Beaucoup de gens seraient tentés de dire que…, et pourtant…', 'Many people would be tempted to say that…, and yet…', 'States the opposing view before dismantling it — examiners reward this structure.', 'B1');
p('structureB', 'Il convient de nuancer cette affirmation.', 'This claim deserves to be qualified.', 'Signals you are not answering with a flat yes or no.', 'B2');
p('structureB', 'Tout dépend du contexte et des personnes concernées.', 'It all depends on the context and the people involved.', 'A legitimate, mature position — provided you then develop it.', 'B1');
p('structureB', 'On pourrait objecter que…, mais cet argument ne tient pas face à…', 'One could object that…, but that argument doesn’t hold up against…', 'The strongest concession-and-rebuttal pattern for the letter.', 'B2');
p('structureB', 'En conclusion, la solution se situe sans doute entre les deux extrêmes.', 'In conclusion, the solution probably lies between the two extremes.', 'A closing line that works even when you have argued one side throughout.', 'B1');

export const PHRASES = P;
export const phrasesByCat = (cat) => P.filter(x => x.category === cat);

export const SUJET_COUNT = T.length;
