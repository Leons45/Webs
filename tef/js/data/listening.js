// Compréhension orale — original scripts spoken by the browser's French voice.
// lines: [{ who, text }]  — 'A'/'B' alternate pitch so dialogues stay readable by ear.

export const LISTENING = [
{
  id:'coA1', section:'A', title:'Au comptoir de la bibliothèque', level:'facile',
  context:'Vous êtes à l’accueil d’une bibliothèque municipale.',
  lines:[
    { who:'A', text:'Bonjour, je voudrais emprunter cet ouvrage, mais ma carte est expirée depuis le mois dernier.' },
    { who:'B', text:'Ce n’est pas un problème. Le renouvellement est gratuit, il me faut simplement un justificatif de domicile récent.' },
    { who:'A', text:'Je n’ai que mon permis de conduire sur moi. Est-ce que cela suffit ?' },
    { who:'B', text:'Malheureusement non, il nous faut une facture ou un bail de moins de trois mois. Mais vous pouvez consulter sur place en attendant.' },
  ],
  questions:[
    { q:'Pourquoi la personne ne peut-elle pas emprunter le livre ?',
      options:['La bibliothèque est fermée','Sa carte est expirée','Le livre est déjà emprunté','Elle n’est pas inscrite'], answer:1,
      why:'« ma carte est expirée depuis le mois dernier ».' },
    { q:'Quel document l’employé demande-t-il ?',
      options:['Un permis de conduire','Un passeport','Un justificatif de domicile','Une photo d’identité'], answer:2,
      why:'« il me faut simplement un justificatif de domicile récent ».' },
    { q:'Que peut faire la personne en attendant ?',
      options:['Emprunter un seul livre','Consulter l’ouvrage sur place','Payer une amende','Revenir dans trois mois'], answer:1,
      why:'« vous pouvez consulter sur place en attendant ».' },
  ]
},
{
  id:'coA2', section:'A', title:'Un appel pour une visite', level:'facile',
  context:'Vous téléphonez au sujet d’une annonce de logement.',
  lines:[
    { who:'A', text:'Bonjour, j’appelle pour le quatre et demi annoncé sur Villeray. Est-il toujours disponible ?' },
    { who:'B', text:'Oui, il est libre dès le premier du mois prochain. Je fais visiter samedi entre dix heures et midi.' },
    { who:'A', text:'Très bien. Pourriez-vous me préciser si les charges sont comprises dans le loyer ?' },
    { who:'B', text:'Le chauffage et l’eau chaude sont inclus, mais l’électricité reste à votre charge. Comptez une soixantaine de dollars par mois en hiver.' },
    { who:'A', text:'Et le stationnement ?' },
    { who:'B', text:'Il y a une place extérieure, mais elle est déjà prise par le locataire du rez-de-chaussée. Il y a du stationnement de rue avec vignette.' },
  ],
  questions:[
    { q:'Quand le logement sera-t-il libre ?',
      options:['Immédiatement','Samedi','Le premier du mois prochain','Dans six mois'], answer:2, why:'« il est libre dès le premier du mois prochain ».' },
    { q:'Qu’est-ce qui n’est PAS inclus dans le loyer ?',
      options:['Le chauffage','L’eau chaude','L’électricité','Tout est inclus'], answer:2, why:'« l’électricité reste à votre charge ».' },
    { q:'Concernant le stationnement :',
      options:['Une place est réservée au nouveau locataire','La place est déjà occupée','Il n’y a aucun stationnement','Le stationnement est payant dans l’immeuble'], answer:1,
      why:'« elle est déjà prise par le locataire du rez-de-chaussée ».' },
  ]
},
{
  id:'coB1', section:'B', title:'Décaler un rendez-vous médical', level:'moyen',
  context:'Un patient appelle une clinique.',
  lines:[
    { who:'A', text:'Clinique du Parc, bonjour.' },
    { who:'B', text:'Bonjour, je suis monsieur Lemay. J’avais un rendez-vous jeudi quatorze heures avec la docteure Nadeau et je dois malheureusement le décaler.' },
    { who:'A', text:'Je regarde. Jeudi quatorze heures, c’est bien noté. Souhaitez-vous une autre date dans la même semaine ?' },
    { who:'B', text:'Si possible, oui, mais plutôt en fin de journée. Je ne peux pas quitter le bureau avant seize heures trente.' },
    { who:'A', text:'Il me reste vendredi dix-sept heures quinze, ou mardi prochain dix-huit heures. Attention, les annulations de moins de vingt-quatre heures sont facturées.' },
    { who:'B', text:'Je prends vendredi dix-sept heures quinze. Et pour mon ordonnance, dois-je la rapporter ?' },
    { who:'A', text:'Apportez-la, oui, ainsi que les résultats de la prise de sang si vous les avez reçus.' },
  ],
  questions:[
    { q:'Pourquoi monsieur Lemay appelle-t-il ?',
      options:['Pour annuler définitivement','Pour déplacer son rendez-vous','Pour obtenir une ordonnance','Pour contester une facture'], answer:1, why:'« je dois malheureusement le décaler ».' },
    { q:'Quelle contrainte horaire donne-t-il ?',
      options:['Il est libre le matin','Il ne peut pas partir avant 16 h 30','Il ne travaille pas le vendredi','Il préfère le midi'], answer:1,
      why:'« Je ne peux pas quitter le bureau avant seize heures trente. »' },
    { q:'Quel rendez-vous retient-il finalement ?',
      options:['Jeudi 14 h','Vendredi 17 h 15','Mardi 18 h','Il ne choisit pas'], answer:1, why:'« Je prends vendredi dix-sept heures quinze. »' },
    { q:'Que lui demande-t-on d’apporter ?',
      options:['Seulement sa carte','Son ordonnance et les résultats de la prise de sang','Un justificatif de domicile','Rien du tout'], answer:1,
      why:'« Apportez-la, oui, ainsi que les résultats de la prise de sang. »' },
    { q:'Quelle règle la réceptionniste signale-t-elle ?',
      options:['Les retards sont interdits','Les annulations tardives sont facturées','Les rendez-vous durent une heure','Il faut payer d’avance'], answer:1,
      why:'« les annulations de moins de vingt-quatre heures sont facturées ».' },
  ]
},
{
  id:'coB2', section:'B', title:'Un désaccord entre collègues', level:'moyen',
  context:'Deux collègues discutent de l’organisation d’un projet.',
  lines:[
    { who:'A', text:'Je trouve qu’on perd un temps considérable en réunions. Trois heures hier, et aucune décision n’a été prise.' },
    { who:'B', text:'Je ne suis pas tout à fait d’accord. Sans ces réunions, chacun avancerait dans son coin et on refairait le même travail deux fois.' },
    { who:'A', text:'Je comprends, mais on pourrait régler la plupart des points par écrit. Une note partagée, chacun la commente, et on ne se réunit que sur les désaccords.' },
    { who:'B', text:'Sur le principe, ça me va. Ce qui m’inquiète, c’est que les gens ne lisent pas. On se retrouverait à tout réexpliquer en réunion de toute façon.' },
    { who:'A', text:'Alors essayons sur un mois. Si ça ne fonctionne pas, on revient à l’ancien format, je ne m’y opposerai pas.' },
    { who:'B', text:'D’accord pour l’essai. Mais je tiens à garder un point hebdomadaire de trente minutes, pas plus.' },
  ],
  questions:[
    { q:'Que reproche la première personne à l’organisation actuelle ?',
      options:['Le manque de réunions','La durée des réunions sans décision','Le manque de personnel','Les horaires trop tôt'], answer:1,
      why:'« Trois heures hier, et aucune décision n’a été prise. »' },
    { q:'Quel argument la seconde personne avance-t-elle d’abord ?',
      options:['Les réunions évitent le travail en double','Les réunions sont obligatoires','Les réunions plaisent à la direction','Les réunions sont trop courtes'], answer:0,
      why:'« on refairait le même travail deux fois ».' },
    { q:'Quelle inquiétude exprime-t-elle ensuite ?',
      options:['Le coût du changement','Que personne ne lise la note partagée','Que le projet soit annulé','Que l’équipe soit trop petite'], answer:1,
      why:'« Ce qui m’inquiète, c’est que les gens ne lisent pas. »' },
    { q:'Sur quoi finissent-elles par s’entendre ?',
      options:['Supprimer toutes les réunions','Un essai d’un mois avec un point hebdomadaire de 30 minutes','Garder le format actuel','Demander l’avis de la direction'], answer:1,
      why:'« D’accord pour l’essai. Mais je tiens à garder un point hebdomadaire de trente minutes. »' },
    { q:'Le ton de l’échange est :',
      options:['agressif','courtois malgré le désaccord','indifférent','moqueur'], answer:1,
      why:'« Je ne suis pas tout à fait d’accord », « sur le principe, ça me va » : désaccord formulé avec des atténuateurs.' },
  ]
},
{
  id:'coC1', section:'C', title:'Chronique : la pénurie de logements étudiants', level:'difficile',
  context:'Vous écoutez une chronique à la radio.',
  lines:[
    { who:'A', text:'Chaque mois d’août, le même scénario se répète dans les villes universitaires : des milliers d’étudiants cherchent un logement et une partie d’entre eux commencera l’année sans adresse fixe.' },
    { who:'A', text:'Les chiffres de la fédération étudiante évoquent une hausse des loyers de l’ordre de vingt pour cent en trois ans près des campus, alors que les bourses, elles, ont progressé de six pour cent.' },
    { who:'A', text:'Les universités répondent en construisant des résidences, mais les délais sont longs. Un projet annoncé aujourd’hui n’ouvrira pas avant quatre ou cinq ans, ce qui ne règle rien pour la cohorte actuelle.' },
    { who:'A', text:'Certaines municipalités ont donc choisi une voie plus rapide : encadrer la location de courte durée, qui retire du marché des logements entiers. Là où la mesure a été appliquée, on observe une remise en location de plusieurs centaines d’unités en moins d’un an.' },
    { who:'A', text:'Reste que la solution la plus efficace demeure la moins spectaculaire : subventionner la colocation et simplifier la cohabitation intergénérationnelle, c’est-à-dire loger des étudiants chez des personnes âgées qui disposent d’une chambre libre.' },
  ],
  questions:[
    { q:'Quel est le sujet principal de la chronique ?',
      options:['Le coût des études','La difficulté des étudiants à se loger','La construction des universités','Le vieillissement de la population'], answer:1,
      why:'Le fil conducteur est la pénurie de logements étudiants.' },
    { q:'Quel écart la chronique souligne-t-elle ?',
      options:['Entre les loyers (+20 %) et les bourses (+6 %)','Entre les villes et les campagnes','Entre les universités publiques et privées','Entre les étudiants et les travailleurs'], answer:0,
      why:'Hausse des loyers d’environ 20 % contre 6 % pour les bourses.' },
    { q:'Pourquoi la construction de résidences ne résout-elle pas le problème immédiat ?',
      options:['Elle coûte trop cher','Les délais sont de quatre à cinq ans','Les étudiants la refusent','Les terrains manquent'], answer:1,
      why:'« Un projet annoncé aujourd’hui n’ouvrira pas avant quatre ou cinq ans. »' },
    { q:'Quelle mesure municipale est présentée comme plus rapide ?',
      options:['Baisser les impôts','Encadrer la location de courte durée','Construire des tours','Augmenter les bourses'], answer:1,
      why:'Elle remet sur le marché des logements entiers en moins d’un an.' },
    { q:'Quelle solution l’auteur juge la plus efficace ?',
      options:['Les nouvelles résidences','La colocation et la cohabitation intergénérationnelle','La gratuité des transports','Le télétravail'], answer:1,
      why:'« la solution la plus efficace demeure la moins spectaculaire : subventionner la colocation… »' },
    { q:'L’expression « cohabitation intergénérationnelle » désigne :',
      options:['des étudiants entre eux','des étudiants logés chez des personnes âgées','des familles nombreuses','des logements sociaux'], answer:1,
      why:'La chronique l’explique : « loger des étudiants chez des personnes âgées ».' },
  ]
},
{
  id:'coC2', section:'C', title:'Annonces dans une gare', level:'moyen',
  context:'Quatre annonces diffusées dans un hall de gare.',
  lines:[
    { who:'A', text:'Le train à destination de Québec, départ prévu à quatorze heures dix, partira du quai numéro sept et non du quai numéro trois comme indiqué sur les écrans.' },
    { who:'A', text:'En raison d’un incident technique, le train de quinze heures vers Ottawa circulera avec un retard estimé à quarante minutes. Les voyageurs munis d’un billet à tarif réduit pourront le faire valider sur le départ suivant sans supplément.' },
    { who:'A', text:'Il est rappelé aux voyageurs que les bagages ne doivent en aucun cas être laissés sans surveillance. Tout bagage abandonné sera retiré par les services de sécurité.' },
    { who:'A', text:'Le guichet numéro quatre est momentanément fermé. Pour tout échange ou remboursement, veuillez vous présenter au guichet numéro deux, ouvert jusqu’à vingt heures.' },
  ],
  questions:[
    { q:'Quel changement concerne le train vers Québec ?',
      options:['L’heure de départ','Le quai de départ','La destination','Le prix du billet'], answer:1,
      why:'« partira du quai numéro sept et non du quai numéro trois ».' },
    { q:'Quel est le retard annoncé vers Ottawa ?',
      options:['quinze minutes','quarante minutes','une heure','deux heures'], answer:1, why:'« un retard estimé à quarante minutes ».' },
    { q:'Que peuvent faire les voyageurs à tarif réduit ?',
      options:['Obtenir un remboursement total','Prendre le départ suivant sans supplément','Changer de destination','Rien de particulier'], answer:1,
      why:'« pourront le faire valider sur le départ suivant sans supplément ».' },
    { q:'Où faut-il aller pour un remboursement ?',
      options:['Guichet 4','Guichet 2','Quai 7','Au bureau de sécurité'], answer:1, why:'« veuillez vous présenter au guichet numéro deux ».' },
  ]
},
];

export const LISTENING_BY_SECTION = ['A','B','C'].map(s => ({
  section: s, items: LISTENING.filter(l => l.section === s),
}));
