// Compréhension écrite — original passages in the four TEF Canada formats.
// A: petites annonces et messages courts   B: textes informatifs
// C: deux textes à confronter              D: texte à compléter (grammaire / lexique)

export const READING = [

/* ═════════════════ SECTION A ═════════════════ */
{
  id:'ceA1', section:'A', minutes:4,
  title:'Quatre annonces de logement',
  intro:'Lisez les quatre annonces, puis répondez.',
  text:
`**Annonce 1 — Villeray**
3½ lumineux au 2ᵉ étage, 1 050 $/mois, chauffage et eau chauds inclus. Libre dès le 1ᵉʳ août. Non meublé. À dix minutes à pied du métro Jean-Talon. Animaux non admis.

**Annonce 2 — Rosemont**
Grand 4½ entièrement meublé, 1 480 $/mois, électricité en sus. Stationnement intérieur disponible contre supplément de 75 $. Bail minimum de douze mois. Petit chien ou chat accepté.

**Annonce 3 — Centre-ville**
Studio meublé de 28 m², 1 320 $/mois tout compris, buanderie commune au sous-sol. Idéal pour étudiant ou personne seule. Location courte durée possible à partir de trois mois.

**Annonce 4 — Hochelaga**
Colocation : chambre dans un 5½ partagé avec deux colocataires, 690 $/mois charges comprises. Cuisine et salon communs. Disponible immédiatement. Non-fumeur exigé.`,
  questions:[
    { q:'Vous cherchez un logement pour quatre mois seulement. Quelle annonce retenez-vous ?',
      options:['Annonce 1','Annonce 2','Annonce 3','Annonce 4'], answer:2,
      why:'Seule l’annonce 3 mentionne une location courte durée à partir de trois mois.' },
    { q:'Vous avez un chat et un budget maximal de 1 500 $ électricité incluse. Quelle annonce convient ?',
      options:['Annonce 1','Annonce 2','Annonce 3','Annonce 4'], answer:3,
      why:'L’annonce 2 accepte le chat mais l’électricité est en sus, ce qui dépasse le budget tout compris ; l’annonce 4 est à 690 $ charges comprises et ne refuse pas les animaux, seulement le tabac. L’annonce 1 refuse les animaux.' },
    { q:'Quelle annonce impose une durée d’engagement précise ?',
      options:['Annonce 1','Annonce 2','Annonce 3','Annonce 4'], answer:1,
      why:'« Bail minimum de douze mois » n’apparaît que dans l’annonce 2.' },
    { q:'Dans l’annonce 2, « électricité en sus » veut dire que l’électricité :',
      options:['est incluse dans le loyer','est à payer en plus du loyer','est fournie gratuitement','est coupée l’hiver'], answer:1,
      why:'en sus = en plus. L’opposé de « inclus » ou « compris ».' },
  ]
},

{
  id:'ceA2', section:'A', minutes:4,
  title:'Trois messages au travail',
  intro:'Lisez les trois courriels internes, puis répondez.',
  text:
`**Message 1 — de : Direction des ressources humaines**
Objet : fermeture du bureau le 14 mai
En raison de travaux de ventilation, les locaux seront inaccessibles le mercredi 14 mai. Le télétravail est obligatoire ce jour-là. Les personnes dont la présence sur place est indispensable doivent en informer leur gestionnaire avant le 9 mai.

**Message 2 — de : Service informatique**
Objet : changement de mot de passe
Votre mot de passe expire dans sept jours. Vous pouvez le renouveler dès maintenant depuis le portail interne. Passé ce délai, l’accès à votre boîte sera suspendu jusqu’à réinitialisation par notre équipe.

**Message 3 — de : Comité social**
Objet : dîner d’équipe
Le dîner annuel aura lieu le vendredi 23 mai à midi au restaurant du troisième étage. Merci de confirmer votre présence et de signaler toute restriction alimentaire au plus tard le 16 mai.`,
  questions:[
    { q:'Que devez-vous faire si vous devez absolument venir au bureau le 14 mai ?',
      options:['Rien de particulier','Avertir votre gestionnaire avant le 9 mai','Écrire au service informatique','Attendre la fin des travaux'], answer:1,
      why:'Le message 1 demande d’informer le gestionnaire avant le 9 mai.' },
    { q:'Qu’arrive-t-il si vous ignorez le message 2 ?',
      options:['Votre mot de passe est prolongé','Vous perdez l’accès à votre boîte','Vous recevez une amende','Votre poste est supprimé'], answer:1,
      why:'L’accès est suspendu jusqu’à réinitialisation par l’équipe informatique.' },
    { q:'Quelle est la seule date limite liée à un repas ?',
      options:['le 9 mai','le 14 mai','le 16 mai','le 23 mai'], answer:2,
      why:'Le 16 mai est la date limite de confirmation ; le 23 mai est la date du dîner lui-même.' },
    { q:'Quel message concerne une obligation de travailler à distance ?',
      options:['Message 1','Message 2','Message 3','Aucun'], answer:0,
      why:'« Le télétravail est obligatoire ce jour-là. »' },
  ]
},

/* ═════════════════ SECTION B ═════════════════ */
{
  id:'ceB1', section:'B', minutes:7,
  title:'Le retour des bibliothèques de quartier',
  intro:'Lisez le texte, puis répondez aux questions.',
  text:
`Pendant une quinzaine d’années, on a prédit la disparition des bibliothèques municipales. Le raisonnement semblait solide : si les livres, les journaux et les encyclopédies se consultent sur un écran, à quoi bon conserver des bâtiments remplis de rayonnages ? Les chiffres de fréquentation des années 2010 paraissaient confirmer ce diagnostic.

Or la tendance s’est inversée, et pour une raison que peu d’urbanistes avaient anticipée. Ce que les usagers viennent chercher aujourd’hui, ce n’est plus d’abord l’accès à l’information — ils l’ont dans leur poche — mais un lieu. Un lieu chauffé, silencieux, gratuit, où personne n’est obligé de consommer pour s’asseoir. Dans les villes où le coût du logement contraint les habitants à vivre dans de petits appartements, la bibliothèque est devenue le bureau, la salle d’étude et le salon que l’on n’a pas chez soi.

Les municipalités qui ont compris ce déplacement ont transformé leurs équipements en conséquence. On y trouve désormais des salles de travail que l’on réserve à l’heure, des ateliers de couture ou d’impression, des cours de langue pour les personnes nouvellement arrivées, parfois des outils que l’on emprunte comme on emprunte un roman. À Montréal comme à Toronto, certaines succursales prêtent des instruments de musique ou des appareils de mesure de la qualité de l’air.

Cette mutation n’est pas sans tension. Le personnel, formé à la documentation, se retrouve à gérer des situations sociales qui relèvent du travail communautaire : précarité, isolement, parfois détresse. Plusieurs syndicats réclament des effectifs spécialisés plutôt qu’un simple élargissement des missions à budget constant. La question n’est donc plus de savoir si la bibliothèque survivra, mais qui paiera ce qu’elle est devenue.`,
  questions:[
    { q:'Quelle prédiction le texte rappelle-t-il au premier paragraphe ?',
      options:['Les bibliothèques allaient se multiplier','Les bibliothèques allaient disparaître','Les livres papier allaient coûter plus cher','Les villes allaient construire plus de bâtiments'], answer:1,
      why:'« on a prédit la disparition des bibliothèques municipales ».' },
    { q:'Selon le texte, qu’est-ce que les usagers recherchent avant tout aujourd’hui ?',
      options:['Un accès à l’information','Un espace disponible et gratuit','Des conseils de lecture','Une connexion Internet rapide'], answer:1,
      why:'« ce n’est plus d’abord l’accès à l’information […] mais un lieu ».' },
    { q:'Le texte lie cette évolution au :',
      options:['vieillissement de la population','coût du logement','déclin de la lecture','manque d’écoles'], answer:1,
      why:'« Dans les villes où le coût du logement contraint les habitants à vivre dans de petits appartements… »' },
    { q:'Que reprochent les syndicats aux municipalités ?',
      options:['De fermer des succursales','D’élargir les missions sans moyens supplémentaires','De prêter trop d’objets','De supprimer les cours de langue'], answer:1,
      why:'Ils réclament « des effectifs spécialisés plutôt qu’un simple élargissement des missions à budget constant ».' },
    { q:'Quelle phrase résume le mieux la conclusion de l’auteur ?',
      options:['La bibliothèque est condamnée','La bibliothèque a changé de fonction et son financement reste à régler','Les bibliothèques devraient redevenir de simples dépôts de livres','Le numérique a sauvé les bibliothèques'], answer:1,
      why:'« La question n’est donc plus de savoir si la bibliothèque survivra, mais qui paiera ce qu’elle est devenue. »' },
    { q:'Dans « Or la tendance s’est inversée », le mot « or » introduit :',
      options:['une conséquence','une opposition avec ce qui précède','un exemple','une cause'], answer:1,
      why:'or marque une rupture argumentative. C’est un connecteur à réutiliser en expression écrite.' },
  ]
},

{
  id:'ceB2', section:'B', minutes:7,
  title:'Quatre jours, vraiment ?',
  intro:'Lisez le texte, puis répondez aux questions.',
  text:
`Les expériences de semaine de quatre jours se multiplient, et les comptes rendus qui en sont tirés méritent d’être lus avec prudence. La plupart reposent sur des entreprises volontaires, souvent de petite taille, dans des secteurs où le travail se mesure en projets plutôt qu’en heures de présence. Autrement dit, sur les cas les plus favorables.

Là où le dispositif fonctionne, il repose rarement sur la seule suppression d’une journée. Les équipes gagnantes ont d’abord taillé dans les réunions, limité les canaux de communication et accepté que certaines demandes attendent le lundi. La réduction du temps de travail n’a pas créé l’efficacité : elle a rendu visible le gaspillage qui existait déjà.

Les obstacles, eux, se concentrent dans les métiers de service continu. Un hôpital, une garderie, un service de transport ne peuvent pas décider que le vendredi n’existe plus. Pour ces secteurs, la quatrième journée ne se libère qu’en embauchant, ce qui déplace la question du confort des salariés vers celle du financement public.

Reste un effet que les employeurs mentionnent plus volontiers que les chercheurs : la rétention. Dans un marché où le recrutement coûte cher, une organisation capable d’offrir un vendredi libre conserve son personnel plus longtemps. L’argument est économique avant d’être social, et c’est probablement pour cette raison qu’il progresse.`,
  questions:[
    { q:'Pourquoi faut-il lire les comptes rendus avec prudence ?',
      options:['Ils sont rédigés par des syndicats','Ils portent sur des entreprises volontaires et peu représentatives','Ils sont trop anciens','Ils ne donnent aucun chiffre'], answer:1,
      why:'« La plupart reposent sur des entreprises volontaires, souvent de petite taille […] sur les cas les plus favorables. »' },
    { q:'Selon le texte, qu’a surtout révélé la réduction du temps de travail ?',
      options:['Un manque de personnel','Le gaspillage déjà présent dans l’organisation','Une baisse de la motivation','Le besoin de plus de réunions'], answer:1,
      why:'« elle a rendu visible le gaspillage qui existait déjà ».' },
    { q:'Quel secteur le texte présente-t-il comme difficilement compatible avec le dispositif ?',
      options:['Le conseil','Le design','Les services continus comme la santé','La publicité'], answer:2,
      why:'« Un hôpital, une garderie, un service de transport ne peuvent pas décider que le vendredi n’existe plus. »' },
    { q:'Pour ces secteurs, la quatrième journée suppose :',
      options:['de réduire les salaires','de recruter du personnel supplémentaire','de supprimer des services','d’allonger les autres journées'], answer:1,
      why:'« la quatrième journée ne se libère qu’en embauchant ».' },
    { q:'Quel argument, selon l’auteur, explique le mieux la progression du dispositif ?',
      options:['Le bien-être des salariés','La pression des gouvernements','La fidélisation du personnel, donc un gain économique','La baisse de la demande'], answer:2,
      why:'« L’argument est économique avant d’être social, et c’est probablement pour cette raison qu’il progresse. »' },
  ]
},

/* ═════════════════ SECTION C ═════════════════ */
{
  id:'ceC1', section:'C', minutes:6,
  title:'Deux avis sur la gratuité des transports',
  intro:'Deux personnes réagissent au même projet municipal. Comparez-les.',
  text:
`**Texte 1 — Farida, conseillère municipale**
La gratuité des transports collectifs n’est pas une dépense, c’est un transfert. L’argent que nous ne percevons plus au guichet, nous le récupérons en circulation apaisée, en entretien de voirie évité et en temps rendu aux gens. Les villes qui ont franchi le pas constatent une hausse immédiate de la fréquentation, en particulier chez les personnes âgées et les familles qui renonçaient à certains déplacements. On m’objecte le coût. Je réponds que nous finançons déjà gratuitement l’automobile : les rues, les feux, le déneigement ne sont pas payants à l’usage.

**Texte 2 — Thomas, ingénieur en mobilité**
Je soutiens le développement du réseau, mais la gratuité me paraît une mauvaise priorité. Ce qui décourage l’usager, ce n’est pas le prix du billet, c’est l’attente : une ligne toutes les vingt minutes restera délaissée, gratuite ou non. En supprimant la recette, on se prive justement du budget qui permettrait d’augmenter la fréquence. Je préfère un tarif modeste, fortement réduit pour les faibles revenus, et des autobus toutes les six minutes. Offrir l’accès à un service insuffisant, c’est offrir une promesse vide.`,
  questions:[
    { q:'Sur quel point les deux auteurs sont-ils d’accord ?',
      options:['Il faut supprimer le prix du billet','Il faut développer les transports collectifs','Il faut taxer l’automobile','Il faut réduire la fréquence des lignes'], answer:1,
      why:'Thomas écrit « Je soutiens le développement du réseau » ; Farida défend le même objectif par un autre moyen.' },
    { q:'Quel est le principal désaccord ?',
      options:['L’utilité des transports collectifs','La priorité à donner : gratuité ou fréquence','Le rôle des personnes âgées','Le coût du déneigement'], answer:1,
      why:'Farida défend la gratuité ; Thomas préfère investir la recette dans la fréquence.' },
    { q:'Quel argument Farida utilise-t-elle pour répondre à l’objection du coût ?',
      options:['Les billets rapportent peu','L’automobile bénéficie déjà d’infrastructures gratuites à l’usage','Les usagers paieront plus tard','L’État remboursera la ville'], answer:1,
      why:'« nous finançons déjà gratuitement l’automobile : les rues, les feux, le déneigement ne sont pas payants à l’usage ».' },
    { q:'Selon Thomas, qu’est-ce qui décourage réellement l’usager ?',
      options:['Le prix','L’attente','Le confort','La sécurité'], answer:1,
      why:'« Ce qui décourage l’usager, ce n’est pas le prix du billet, c’est l’attente. »' },
    { q:'Quelle solution Thomas propose-t-il ?',
      options:['La gratuité totale','Un tarif modeste avec réduction selon le revenu et une fréquence accrue','La suppression de certaines lignes','Le péage urbain'], answer:1,
      why:'« un tarif modeste, fortement réduit pour les faibles revenus, et des autobus toutes les six minutes ».' },
  ]
},

/* ═════════════════ SECTION D ═════════════════ */
{
  id:'ceD1', section:'D', minutes:5,
  title:'Texte à compléter — courriel de réclamation',
  intro:'Choisissez la forme correcte pour chaque trou.',
  text:
`Madame, Monsieur,

Je me permets de vous écrire ⟨1⟩ d’un colis commandé le 3 avril et qui ne m’est ⟨2⟩ parvenu. Le suivi indique une livraison effectuée, ⟨3⟩ je n’ai rien reçu et aucun avis de passage n’a été laissé.

J’ai contacté votre service téléphonique à deux reprises. On m’a assuré qu’une enquête ⟨4⟩ ouverte, mais je n’ai ⟨5⟩ nouvelle depuis douze jours. ⟨6⟩ que le délai annoncé était de cinq jours ouvrables, je considère ce retard comme excessif.

Je souhaiterais que vous ⟨7⟩ au remboursement intégral de la commande. Les justificatifs que je vous ai ⟨8⟩ par courriel le 18 avril restent à votre disposition.

Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.`,
  blanks:[
    { n:1, options:['au sujet','au sujet de','à propos','concernant de'], answer:1, why:'au sujet de + nom. « à propos » exigerait aussi « de ».' },
    { n:2, options:['pas','jamais','toujours pas','rien'], answer:2, why:'« ne m’est toujours pas parvenu » : la négation encadre le verbe et toujours renforce la durée.' },
    { n:3, options:['donc','or','car','ainsi'], answer:1, why:'or introduit la contradiction entre le suivi et la réalité.' },
    { n:4, options:['est','était','soit','serait'], answer:1, why:'Discours rapporté au passé : on m’a assuré qu’une enquête était ouverte.' },
    { n:5, options:['pas de','aucune','rien','plus aucune'], answer:1, why:'« je n’ai aucune nouvelle » : aucune s’accorde avec nouvelle et renforce la négation.' },
    { n:6, options:['Étant donné','Malgré','À cause','Pour'], answer:0, why:'Étant donné que + proposition exprime la cause en registre écrit.' },
    { n:7, options:['procédez','procédiez','procéderez','procéder'], answer:1, why:'souhaiter que → subjonctif : que vous procédiez.' },
    { n:8, options:['transmis','transmise','transmises','transmit'], answer:0,
      why:'Le COD « les justificatifs » est antéposé par « que » : accord au masculin pluriel → transmis. Si le nom avait été « les pièces », on écrirait transmises.' },
  ],
},

];

export const READING_BY_SECTION = ['A','B','C','D'].map(s => ({
  section: s,
  items: READING.filter(r => r.section === s),
}));
