// Expression orale and expression écrite prompts, in the real TEF Canada shapes.

/* ── Expression orale ──────────────────────────────────────────────
   Section A (5 min) : you have an ad or notice. You must ASK questions
   to obtain information. You never argue — you interview.
   Section B (10 min) : you must CONVINCE someone close to you.        */

export const ORAL = [
  { id:'eoA1', section:'A', minutes:5, title:'Un local pour un atelier',
    brief:'Vous avez vu cette annonce et vous appelez pour obtenir des précisions.',
    doc:'« À louer : local commercial de 45 m² au rez-de-chaussée, convient à un atelier ou à un studio. Vitrine sur rue. 1 400 $/mois. Visite sur rendez-vous. »',
    goal:'Obtenir le maximum d’informations en posant des questions variées.',
    musts:['durée du bail','ce que comprend le loyer','travaux autorisés ou non','horaires d’accès','dépôt demandé','raison du départ du locataire précédent'],
    starters:['Pourriez-vous me préciser si…','Qu’en est-il de…?','Serait-il possible de…?','J’aimerais savoir combien…','Auriez-vous l’amabilité de me dire…','Une dernière question : …'] },

  { id:'eoA2', section:'A', minutes:5, title:'Une formation du soir',
    brief:'Vous téléphonez au centre de formation après avoir lu cette annonce.',
    doc:'« Formation en graphisme numérique, 12 semaines, cours du soir deux fois par semaine. Places limitées. Attestation remise en fin de parcours. Inscription avant le 30 du mois. »',
    goal:'Clarifier le contenu, le coût, le niveau exigé et la valeur de l’attestation.',
    musts:['prérequis','tarif et modalités de paiement','horaires exacts','matériel à fournir','reconnaissance de l’attestation','nombre de participants'],
    starters:['Je vous appelle au sujet de…','Faut-il un niveau particulier pour…?','Le tarif comprend-il…?','Combien de personnes…?','Est-ce que l’attestation est reconnue par…?'] },

  { id:'eoA3', section:'A', minutes:5, title:'Une annonce de covoiturage régulier',
    brief:'Vous répondez à cette annonce affichée au travail.',
    doc:'« Covoiturage quotidien North York → centre-ville, départ 7 h 30, retour 17 h 45. Participation aux frais : 60 $/semaine. Deux places disponibles. »',
    goal:'Vérifier si l’arrangement vous convient réellement.',
    musts:['point de rendez-vous précis','flexibilité des horaires','ce qui se passe en cas de retard','que couvre la participation','conduite en hiver','essai possible'],
    starters:['Où exactement se fait le…?','Que se passe-t-il si…?','La participation couvre-t-elle…?','Serait-il envisageable d’essayer…?'] },

  { id:'eoA4', section:'A', minutes:5, title:'Un service de garde d’animaux',
    brief:'Vous appelez avant de confier votre chat pendant un déplacement.',
    doc:'« Garde d’animaux à domicile. Visites une ou deux fois par jour. Tarif à partir de 25 $ la visite. Sur réservation. Références disponibles. »',
    goal:'Obtenir toutes les garanties avant de réserver.',
    musts:['durée de chaque visite','ce qui est fait pendant la visite','assurance en cas de problème','comment vous êtes informé','annulation','tarif exact pour votre période'],
    starters:['Combien de temps dure…?','Qui me prévient si…?','Êtes-vous assuré en cas de…?','Quelles sont vos conditions d’annulation…?'] },

  { id:'eoB1', section:'B', minutes:10, title:'Convaincre de passer au vélo d’hiver',
    brief:'Votre interlocuteur trouve l’idée dangereuse et inconfortable. Convainquez-le d’essayer au moins un mois.',
    doc:'Vous voulez persuader un proche d’aller travailler à vélo même de novembre à mars.',
    goal:'Argumenter, répondre aux objections, obtenir un engagement concret.',
    musts:['un bénéfice chiffré','une réponse à l’objection du froid','une réponse à l’objection du danger','une proposition d’essai limité','une conclusion qui demande un oui'],
    starters:['Je comprends ton inquiétude, mais…','Prenons un exemple concret :…','Certes…, il n’en demeure pas moins que…','Et si on essayait simplement…?','Alors, on se dit…?'] },

  { id:'eoB2', section:'B', minutes:10, title:'Convaincre de déménager plus loin du centre',
    brief:'Votre interlocuteur refuse de quitter le centre-ville. Vous voulez un logement plus grand en banlieue.',
    doc:'Vous défendez un déménagement vers un quartier moins central mais plus spacieux.',
    goal:'Faire accepter le principe, puis une visite.',
    musts:['comparaison de loyer','gain d’espace concret','réponse à l’objection du transport','réponse à l’objection de la vie sociale','compromis proposé'],
    starters:['Regarde la différence :…','Ce qui me semble décisif, c’est…','Tu vas me dire que…, et tu as raison sur ce point, mais…','Je te propose un compromis :…'] },

  { id:'eoB3', section:'B', minutes:10, title:'Convaincre de partager un abonnement plutôt que d’acheter',
    brief:'Votre interlocuteur veut acheter du matériel coûteux qu’il utilisera rarement.',
    doc:'Vous défendez la location ou le partage au lieu de l’achat.',
    goal:'Démontrer que l’usage réel justifie le partage.',
    musts:['estimation de l’usage réel','coût total de possession','réponse à l’objection « je veux l’avoir sous la main »','exemple vécu','proposition d’essai'],
    starters:['Combien de fois par an penses-tu réellement…?','Si on fait le calcul…','Je vois l’argument, cependant…','On pourrait commencer par…'] },

  { id:'eoB4', section:'B', minutes:10, title:'Convaincre de suivre un cours de français avec vous',
    brief:'Votre interlocuteur dit qu’il n’a pas le temps et qu’il apprendra « plus tard ».',
    doc:'Vous voulez qu’il s’inscrive avec vous à un cours du soir dès ce trimestre.',
    goal:'Transformer une bonne intention en inscription.',
    musts:['bénéfice professionnel précis','réponse à l’objection du temps','avantage de le faire à deux','date butoir d’inscription','demande d’engagement'],
    starters:['Ce qui change tout, c’est…','Deux heures par semaine, c’est l’équivalent de…','Justement, à deux…','L’inscription ferme le…, donc…'] },
];

/* ── Expression écrite ─────────────────────────────────────────────
   Section A (~80 mots) : continuer un fait divers commencé, au passé.
   Section B (~200 mots) : exprimer et défendre un avis, registre soutenu. */

export const WRITTEN = [
  { id:'eeA1', section:'A', minutes:25, minWords:80, title:'Un sac oublié dans l’autobus',
    lead:'Mardi matin, peu avant huit heures, une passagère est montée dans l’autobus 97 en direction du centre-ville. Pressée, elle a posé son sac sur le siège voisin et s’est endormie quelques minutes. À son arrêt, elle est descendue précipitamment…',
    task:'Continuez le fait divers au passé, en une soixantaine à quatre-vingts mots. Racontez ce qui s’est passé ensuite et comment la situation s’est terminée.',
    checks:['passé composé et imparfait alternés','au moins un complément de temps','pas de « je » : récit à la troisième personne','une fin explicite'] },

  { id:'eeA2', section:'A', minutes:25, minWords:80, title:'Une panne d’électricité dans l’immeuble',
    lead:'Samedi soir, vers vingt heures, tout l’immeuble du 1420 rue Dupont s’est retrouvé plongé dans le noir. Les locataires sont sortis dans le couloir, une lampe de téléphone à la main, et personne ne savait d’où venait la panne…',
    task:'Poursuivez le récit au passé en quatre-vingts mots environ : ce que les habitants ont fait, qui est intervenu, comment cela s’est réglé.',
    checks:['récit chronologique','un dialogue rapporté ou une citation brève','vocabulaire concret du logement','conclusion'] },

  { id:'eeA3', section:'A', minutes:25, minWords:80, title:'Un chien retrouvé au parc',
    lead:'Dimanche après-midi, un homme promenait son enfant au parc Lafontaine lorsqu’il a remarqué un petit chien seul près de la fontaine, le collier arraché et visiblement effrayé…',
    task:'Continuez au passé, environ quatre-vingts mots : ce qu’il a fait, à qui il s’est adressé, l’issue de l’histoire.',
    checks:['passé composé dominant','imparfait pour le décor','un détail précis (heure, lieu, nom)','fin résolue'] },

  { id:'eeB1', section:'B', minutes:35, minWords:200, title:'Faut-il interdire les téléphones à l’école ?',
    lead:'Votre municipalité consulte les résidents sur l’interdiction complète des téléphones portables dans les écoles secondaires, de l’arrivée au départ.',
    task:'Rédigez une lettre d’environ deux cents mots adressée au conseil municipal. Exposez votre position, appuyez-la sur deux ou trois arguments et répondez à une objection prévisible.',
    checks:['formule d’appel et formule de clôture','une thèse annoncée dès le premier paragraphe','deux arguments développés, pas listés','une concession (« Certes… »)','connecteurs variés','registre soutenu, pas d’oral'] },

  { id:'eeB2', section:'B', minutes:35, minWords:200, title:'Le télétravail doit-il rester un droit ?',
    lead:'Votre employeur envisage un retour obligatoire au bureau cinq jours par semaine. Le comité du personnel recueille les avis écrits.',
    task:'Rédigez un avis argumenté d’environ deux cents mots. Prenez position et proposez une solution praticable.',
    checks:['thèse claire','argument de productivité et argument humain','prise en compte du point de vue de l’employeur','proposition concrète en conclusion','vocabulaire du travail précis'] },

  { id:'eeB3', section:'B', minutes:35, minWords:200, title:'Gratuité des transports collectifs',
    lead:'Un journal local publie un dossier sur la gratuité des transports en commun et sollicite des lettres de lecteurs.',
    task:'Rédigez une lettre d’environ deux cents mots exposant votre position, en anticipant l’objection du financement.',
    checks:['adresse au journal','position explicite','un argument économique, un argument social','réfutation de l’objection du coût','conclusion avec recommandation'] },

  { id:'eeB4', section:'B', minutes:35, minWords:200, title:'Faut-il limiter la location de courte durée ?',
    lead:'Votre quartier compte de plus en plus de logements loués à la nuitée. Le conseil de quartier demande l’avis des résidents.',
    task:'Rédigez une contribution d’environ deux cents mots. Défendez une position nuancée.',
    checks:['constat de départ factuel','deux arguments hiérarchisés','nuance (tous les cas ne se valent pas)','proposition de règle précise','registre administratif correct'] },

  { id:'eeB5', section:'B', minutes:35, minWords:200, title:'Semaine de quatre jours dans le secteur public',
    lead:'Une consultation publique porte sur l’adoption de la semaine de quatre jours dans les services municipaux.',
    task:'Rédigez environ deux cents mots : position, arguments, limites du dispositif selon les métiers.',
    checks:['distinction entre types de métiers','un chiffre ou un ordre de grandeur','une objection traitée','conclusion qui tranche'] },
];

/* Phrases you can lean on while writing. Shown as a bank, not as a template. */
export const PHRASE_BANK = {
  'Annoncer sa position': ['Il me semble que…','Je suis d’avis que…','Force est de constater que…','Si l’intention est louable, le moyen me paraît discutable.'],
  'Ajouter un argument': ['Par ailleurs,','En outre,','Qui plus est,','D’autant plus que…'],
  'Opposer': ['En revanche,','Toutefois,','Néanmoins,','Or,','Il n’en demeure pas moins que…'],
  'Concéder puis réfuter': ['Certes…, mais…','On peut l’admettre ; reste que…','Cet argument a sa part de vérité, à condition toutefois de…'],
  'Exprimer la cause': ['Étant donné que…','Dans la mesure où…','Compte tenu de…','En raison de…'],
  'Exprimer la conséquence': ['C’est pourquoi…','Il en résulte que…','Dès lors,','Par conséquent,'],
  'Illustrer': ['À titre d’exemple,','Il suffit de songer à…','Le cas de… est éclairant.'],
  'Conclure': ['En définitive,','En somme,','Tout bien considéré,','Il ressort de ce qui précède que…'],
  'Lettre : ouvrir': ['Madame, Monsieur,','Je me permets de vous écrire afin de…','Je vous écris au sujet de…'],
  'Lettre : clore': ['Dans l’attente de votre réponse, je vous prie d’agréer…','Veuillez agréer, Madame, Monsieur, l’expression de mes salutations distinguées.'],
};
