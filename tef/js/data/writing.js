// Writing is the secondary track here: one task a day, deliberately short.
// Section A is a past-tense narrative; Section B is a reasoned letter.

export const WRITING = [
  { id:'w1', section:'A', minutes:20, minWords:80, title:'Un sac oublié dans l'autobus', titleEn:'A bag left on the bus',
    lead:'Mardi matin, peu avant huit heures, une passagère est montée dans l'autobus 97. Pressée, elle a posé son sac sur le siège voisin et s'est endormie quelques minutes. À son arrêt, elle est descendue précipitamment…',
    leadEn:'Tuesday morning, just before eight, a passenger boarded the 97 bus. In a hurry, she put her bag on the next seat and dozed off for a few minutes. At her stop she got off in a rush…',
    task:'Continuez le fait divers au passé, en quatre-vingts mots environ.',
    taskEn:'Continue the news item in the past tense, in about eighty words.',
    checks:[
      { fr:'passé composé et imparfait alternés', en:'alternate perfect and imperfect' },
      { fr:'un complément de temps au moins', en:'at least one time expression' },
      { fr:'troisième personne, pas de « je »', en:'third person, no "je"' },
      { fr:'une fin explicite', en:'an explicit ending' },
    ] },

  { id:'w2', section:'A', minutes:20, minWords:80, title:'Une panne dans l'immeuble', titleEn:'A power cut in the building',
    lead:'Samedi soir, vers vingt heures, tout l'immeuble du 1420 rue Dupont s'est retrouvé dans le noir. Les locataires sont sortis dans le couloir, une lampe de téléphone à la main…',
    leadEn:'Saturday evening, around eight, the whole building at 1420 Dupont Street went dark. Tenants came out into the corridor, phone torches in hand…',
    task:'Poursuivez le récit au passé en quatre-vingts mots environ.',
    taskEn:'Continue the story in the past, in about eighty words.',
    checks:[
      { fr:'récit chronologique', en:'chronological order' },
      { fr:'une parole rapportée', en:'one piece of reported speech' },
      { fr:'vocabulaire du logement', en:'housing vocabulary' },
      { fr:'une conclusion', en:'a conclusion' },
    ] },

  { id:'w3', section:'A', minutes:20, minWords:80, title:'Un chien retrouvé au parc', titleEn:'A dog found in the park',
    lead:'Dimanche après-midi, un homme promenait son enfant au parc lorsqu'il a remarqué un petit chien seul près de la fontaine, le collier arraché et visiblement effrayé…',
    leadEn:'Sunday afternoon, a man was walking with his child in the park when he noticed a small dog alone by the fountain, its collar torn and clearly frightened…',
    task:'Continuez au passé, environ quatre-vingts mots.',
    taskEn:'Continue in the past, about eighty words.',
    checks:[
      { fr:'passé composé dominant', en:'perfect tense dominant' },
      { fr:'imparfait pour le décor', en:'imperfect for the background' },
      { fr:'un détail précis (heure, lieu)', en:'one precise detail (time, place)' },
      { fr:'une fin résolue', en:'a resolved ending' },
    ] },

  { id:'w4', section:'B', minutes:30, minWords:160, title:'Les téléphones à l'école', titleEn:'Phones in schools',
    lead:'Votre municipalité consulte les résidents sur l'interdiction complète des téléphones portables dans les écoles secondaires.',
    leadEn:'Your municipality is consulting residents on a total ban on mobile phones in secondary schools.',
    task:'Rédigez une lettre d'environ cent soixante mots au conseil municipal. Position, deux arguments, une objection traitée.',
    taskEn:'Write a letter of about 160 words to the council. A position, two arguments, one objection addressed.',
    checks:[
      { fr:'formule d'appel et de clôture', en:'opening and closing formulas' },
      { fr:'thèse dès le premier paragraphe', en:'thesis in the first paragraph' },
      { fr:'deux arguments développés', en:'two developed arguments' },
      { fr:'une concession (« Certes… »)', en:'one concession ("Certes…")' },
      { fr:'connecteurs variés', en:'varied connectors' },
    ] },

  { id:'w5', section:'B', minutes:30, minWords:160, title:'Le retour au bureau', titleEn:'Returning to the office',
    lead:'Votre employeur envisage un retour obligatoire au bureau cinq jours par semaine. Le comité du personnel recueille les avis écrits.',
    leadEn:'Your employer is considering a mandatory return to the office five days a week. The staff committee is collecting written views.',
    task:'Rédigez un avis argumenté d'environ cent soixante mots, avec une proposition concrète en conclusion.',
    taskEn:'Write a reasoned opinion of about 160 words, with a concrete proposal in the conclusion.',
    checks:[
      { fr:'thèse claire', en:'clear thesis' },
      { fr:'un argument de productivité, un argument humain', en:'one productivity argument, one human argument' },
      { fr:'le point de vue de l'employeur pris en compte', en:'the employer's view acknowledged' },
      { fr:'une proposition concrète', en:'a concrete proposal' },
    ] },

  { id:'w6', section:'B', minutes:30, minWords:160, title:'La gratuité des transports', titleEn:'Free public transport',
    lead:'Un journal local publie un dossier sur la gratuité des transports en commun et sollicite des lettres de lecteurs.',
    leadEn:'A local paper is running a feature on free public transport and is inviting readers' letters.',
    task:'Rédigez une lettre d'environ cent soixante mots, en anticipant l'objection du financement.',
    taskEn:'Write a letter of about 160 words, anticipating the funding objection.',
    checks:[
      { fr:'position explicite', en:'explicit position' },
      { fr:'un argument économique, un argument social', en:'one economic, one social argument' },
      { fr:'l'objection du coût réfutée', en:'the cost objection refuted' },
      { fr:'une recommandation finale', en:'a closing recommendation' },
    ] },
];
