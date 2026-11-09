// Seed card bank. Every card carries tags so the Atelier can build
// targeted drills from your weakest tags.
//
// type: 'recall'  — front/back flip card
//       'choice'  — front + options, one correct
//       'cloze'   — sentence with ___ ; answer typed or chosen

export const TAGS = {
  negation:    { label: 'Négation',            skill: 'grammaire' },
  auxiliaire:  { label: 'Auxiliaire être/avoir', skill: 'grammaire' },
  accord:      { label: 'Accord et genre',     skill: 'grammaire' },
  subjonctif:  { label: 'Subjonctif',          skill: 'grammaire' },
  pronoms:     { label: 'Pronoms',             skill: 'grammaire' },
  temps:       { label: 'Temps et modes',      skill: 'grammaire' },
  prepositions:{ label: 'Prépositions',        skill: 'grammaire' },
  connecteurs: { label: 'Connecteurs logiques',skill: 'expression' },
  registre:    { label: 'Registre soutenu',    skill: 'expression' },
  logement:    { label: 'Logement',            skill: 'lexique' },
  travail:     { label: 'Travail et emploi',   skill: 'lexique' },
  admin:       { label: 'Démarches',           skill: 'lexique' },
  sante:       { label: 'Santé',               skill: 'lexique' },
  societe:     { label: 'Société et actualité',skill: 'lexique' },
  quebec:      { label: 'Français du Québec',  skill: 'lexique' },
};

const C = [];
let n = 0;
const card = (o) => { C.push({ id: 'c' + (++n).toString().padStart(3, '0'), ...o }); };

/* ───────────────────────── Négation ───────────────────────── */

card({ type:'cloze', tags:['negation'], prompt:'Je ___ ai ___ compris. (rien)',
  answer:"n'ai rien", display:"Je n'ai rien compris.",
  note:'Au passé composé, rien se place entre l’auxiliaire et le participe : ne + aux. + rien + participe.' });

card({ type:'cloze', tags:['negation'], prompt:'Je ___ vois ___. (personne)',
  answer:'ne vois personne', display:'Je ne vois personne.',
  note:'Au présent, personne suit le verbe. En COD, personne reste après le verbe conjugué.' });

card({ type:'cloze', tags:['negation'], prompt:'___ ___ m’a appelé hier soir. (personne, sujet)',
  answer:"Personne ne", display:"Personne ne m'a appelé hier soir.",
  note:'Quand personne est sujet, il passe devant et ne reste obligatoire : Personne ne…' });

card({ type:'choice', tags:['negation'], prompt:'Elle habitait ici, mais elle a déménagé. Elle…',
  options:["n'habite plus ici","n'habite pas encore ici","n'habite jamais ici","n'habite rien ici"],
  answer:0, note:'ne… plus marque l’arrêt d’une situation. ne… pas encore marque ce qui n’a pas commencé.' });

card({ type:'choice', tags:['negation'], prompt:'Il a 19 ans : il ___ voter aux élections provinciales.',
  options:["n'a jamais pu","ne peut plus","ne peut pas encore","ne peut rien"],
  answer:2, note:'À 18 ans on peut voter ; à 19 ans la phrase serait fausse — attention au sens de pas encore (ce qui viendra).' });

card({ type:'cloze', tags:['negation'], prompt:'Je ne bois ___ thé ___ café. (deux éléments niés)',
  answer:'ni ni', display:'Je ne bois ni thé ni café.',
  note:'ne… ni… ni… fait tomber l’article : ni thé ni café, et non ni du thé ni du café.' });

card({ type:'cloze', tags:['negation'], prompt:'Il n’y a ___ problème. (aucun / pas de)',
  answer:'aucun', display:"Il n'y a aucun problème.",
  note:'aucun insiste davantage que pas de et s’accorde : aucune difficulté, aucun problème. Toujours au singulier.' });

card({ type:'choice', tags:['negation'], prompt:'« Je n’ai qu’une question. » signifie :',
  options:['Je n’ai pas de question','Je n’ai plus de question','J’ai seulement une question','J’ai beaucoup de questions'],
  answer:2, note:'ne… que est restrictif, pas négatif : il équivaut à seulement.' });

card({ type:'cloze', tags:['negation','temps'], prompt:'Il m’a dit de ___ ___ venir avant midi. (infinitif nié)',
  answer:'ne pas', display:"Il m'a dit de ne pas venir avant midi.",
  note:'Devant un infinitif, les deux éléments se collent avant le verbe : ne pas venir, ne rien dire, ne jamais oublier.' });

card({ type:'cloze', tags:['negation','pronoms'], prompt:'Ce film ? Je ___ ___ ___ vu. (ne, l’, jamais)',
  answer:"ne l'ai jamais", display:"Ce film ? Je ne l'ai jamais vu.",
  note:'Ordre au passé composé : ne + pronom + auxiliaire + jamais + participe.' });

card({ type:'choice', tags:['negation','accord'], prompt:'J’ai une voiture. → À la forme négative :',
  options:["Je n'ai pas une voiture","Je n'ai pas de voiture","Je n'ai pas la voiture","Je n'ai aucun voiture"],
  answer:1, note:'Après une négation, un/une/du/de la/des deviennent de : pas de voiture, pas de pain, pas d’amis.' });

card({ type:'recall', tags:['negation'], prompt:'Comment dire « me neither » en français ?',
  answer:'Moi non plus.', note:'Accord affirmatif : Moi aussi. Accord négatif : Moi non plus. On entend souvent la faute « moi aussi » après une phrase négative.' });

card({ type:'choice', tags:['negation'], prompt:'Dans quelle phrase la négation est-elle correcte ?',
  options:["Je n'ai pas vu personne","Je n'ai vu personne","Je n'ai pas vu rien","J'ai ne vu personne"],
  answer:1, note:'personne, rien, jamais, plus remplacent pas : on ne les cumule pas avec pas.' });

card({ type:'cloze', tags:['negation'], prompt:'Elle n’a ___ fini son dossier : il lui reste deux pages. (encore)',
  answer:'pas encore', display:"Elle n'a pas encore fini son dossier.",
  note:'pas encore s’intercale entre l’auxiliaire et le participe.' });

card({ type:'recall', tags:['negation','registre'], prompt:'À l’écrit soutenu, comment nier sans « pas » : « Il ne sait ___ que faire. »',
  answer:'Il ne sait que faire.', note:'Avec savoir, pouvoir, oser, cesser, le ne seul suffit en registre soigné : Je ne saurais vous dire.' });

/* ───────────────── Auxiliaire être / avoir ───────────────── */

card({ type:'choice', tags:['auxiliaire'], prompt:'Hier, elle ___ sortie vers huit heures.',
  options:['a','est','était','avait'], answer:1,
  note:'sortir sans complément d’objet = déplacement → être. Elle est sortie.' });

card({ type:'choice', tags:['auxiliaire'], prompt:'Elle ___ sorti les poubelles avant de partir.',
  options:['est','a','était','soit'], answer:1,
  note:'Ici sortir a un COD (les poubelles) : il devient transitif → avoir, sans accord. C’est le piège classique du TEF.' });

card({ type:'choice', tags:['auxiliaire'], prompt:'Nous ___ descendus par l’escalier de secours.',
  options:['avons','sommes','étions','ayons'], answer:1,
  note:'descendre intransitif → être, avec accord : nous sommes descendus.' });

card({ type:'choice', tags:['auxiliaire','accord'], prompt:'Elle ___ descendu ses valises au rez-de-chaussée.',
  options:['est','a','était','soit'], answer:1,
  note:'descendre + COD → avoir, et pas d’accord car le COD suit le verbe : elle a descendu ses valises.' });

card({ type:'cloze', tags:['auxiliaire'], prompt:'Il ___ ___ un examen difficile la semaine dernière. (passer)',
  answer:'a passé', display:'Il a passé un examen difficile la semaine dernière.',
  note:'passer un examen = avoir. Mais : il est passé chez moi (déplacement) = être.' });

card({ type:'cloze', tags:['auxiliaire','accord'], prompt:'Elle ___ ___ ___ à sept heures. (se lever)',
  answer:"s'est levée", display:"Elle s'est levée à sept heures.",
  note:'Tous les verbes pronominaux prennent être. Accord avec le sujet quand le pronom est COD.' });

card({ type:'choice', tags:['auxiliaire','accord'], prompt:'Marie et Paul se sont ___ au téléphone.',
  options:['parlés','parlé','parlée','parlées'], answer:1,
  note:'parler à quelqu’un : se est COI, donc aucun accord. Ils se sont parlé.' });

card({ type:'choice', tags:['auxiliaire','accord'], prompt:'Elle s’est ___ les mains avant de cuisiner.',
  options:['lavée','lavé','lavées','lavés'], answer:1,
  note:'Le COD (les mains) suit le verbe, donc pas d’accord : elle s’est lavé les mains. Comparez : elle s’est lavée.' });

card({ type:'recall', tags:['auxiliaire'], prompt:'Cite six verbes de déplacement ou d’état qui exigent être au passé composé.',
  answer:'aller, venir, arriver, partir, entrer, sortir, monter, descendre, rester, tomber, naître, mourir, devenir, revenir, retourner, passer (déplacement)',
  note:'Règle de contrôle : si on peut ajouter un COD juste après, l’auxiliaire redevient avoir.' });

card({ type:'cloze', tags:['auxiliaire'], prompt:'Mon grand-père ___ ___ en 1952 à Lyon. (naître)',
  answer:'est né', display:'Mon grand-père est né en 1952 à Lyon.',
  note:'naître et mourir sont toujours avec être : il est né, elle est morte.' });

card({ type:'choice', tags:['auxiliaire'], prompt:'Il ___ rentré la voiture dans le garage.',
  options:['est','a','était','soit'], answer:1,
  note:'rentrer quelque chose → avoir. Il est rentré tard (lui-même) → être.' });

card({ type:'choice', tags:['auxiliaire'], prompt:'Les prix ___ beaucoup augmenté cette année.',
  options:['sont','ont','étaient','soient'], answer:1,
  note:'augmenter, baisser, changer, vieillir, grandir prennent avoir même quand ils expriment une évolution.' });

card({ type:'cloze', tags:['auxiliaire','accord'], prompt:'Elles ___ ___ ___ compte de leur erreur. (se rendre)',
  answer:'se sont rendu', display:'Elles se sont rendu compte de leur erreur.',
  note:'se rendre compte est invariable : rendu ne s’accorde jamais dans cette locution.' });

card({ type:'choice', tags:['auxiliaire'], prompt:'Quelle phrase est correcte ?',
  options:['J’ai allé au marché','Je suis allé au marché','J’ai été allé au marché','Je me suis allé au marché'],
  answer:1, note:'aller est toujours avec être. « J’ai été » existe mais signifie j’ai été présent / j’ai été malade.' });

/* ──────────────── Accord, genre, participes ──────────────── */

card({ type:'choice', tags:['accord'], prompt:'Les lettres que j’ai ___ sont parties ce matin.',
  options:['écrit','écrite','écrites','écrits'], answer:2,
  note:'Avec avoir, accord seulement si le COD précède : que = les lettres, féminin pluriel → écrites.' });

card({ type:'choice', tags:['accord'], prompt:'J’ai ___ ces documents au service des ressources humaines.',
  options:['envoyés','envoyé','envoyée','envoyées'], answer:1,
  note:'Le COD suit le verbe → aucun accord avec avoir : j’ai envoyé ces documents.' });

card({ type:'recall', tags:['accord'], prompt:'Quel est le genre des noms en -tion, -sion, -té, -ude, -ance ?',
  answer:'Féminin : la situation, la décision, la société, l’habitude, la connaissance.',
  note:'Exceptions utiles à retenir : un côté, un comté, un été.' });

card({ type:'recall', tags:['accord'], prompt:'Quel est le genre des noms en -ment, -age, -eau, -isme ?',
  answer:'Masculin : un logement, un stage, un bureau, le tourisme.',
  note:'Exceptions : une page, une plage, une image, une cage, l’eau, la peau.' });

card({ type:'choice', tags:['accord'], prompt:'Choisis la forme correcte.',
  options:['une problème','un problème','la problème','des problème'], answer:1,
  note:'Les mots d’origine grecque en -ème sont masculins : un problème, un système, un thème, un programme.' });

card({ type:'choice', tags:['accord'], prompt:'Je cherche un appartement avec ___ grande cuisine.',
  options:['un','une','de la','du'], answer:1,
  note:'cuisine est féminin. Pièges de genre fréquents : une annonce, un emploi, une entreprise, un salaire, une facture, un impôt.' });

card({ type:'recall', tags:['accord'], prompt:'Féminin de : neuf, cher, gentil, blanc, heureux, public, sec, faux, doux ?',
  answer:'neuve, chère, gentille, blanche, heureuse, publique, sèche, fausse, douce',
  note:'À l’oral, c’est la consonne finale qui réapparaît : c’est l’indice qui révèle le féminin.' });

card({ type:'choice', tags:['accord'], prompt:'Elle porte une ___ veste.',
  options:['nouvel','nouveau','nouvelle','nouveaux'], answer:2,
  note:'nouveau / nouvelle ; nouvel seulement devant un nom masculin à initiale vocalique : un nouvel emploi.' });

card({ type:'cloze', tags:['accord'], prompt:'Je travaille ___ ___ journée du samedi. (tout)',
  answer:'toute la', display:'Je travaille toute la journée du samedi.',
  note:'tout s’accorde : tout le jour, toute la journée, tous les jours, toutes les semaines.' });

card({ type:'choice', tags:['accord'], prompt:'___ des candidats ont déjà déposé leur dossier.',
  options:['La plupart','Le plupart','Les plupart','La plupart de'], answer:0,
  note:'la plupart est féminin, mais le verbe s’accorde avec le complément : la plupart des candidats ont…' });

card({ type:'choice', tags:['accord'], prompt:'Les deux heures que j’ai ___ à réviser ont été utiles.',
  options:['passées','passé','passés','passée'], answer:0,
  note:'que reprend les deux heures (COD antéposé, féminin pluriel) → passées.' });

card({ type:'recall', tags:['accord'], prompt:'« demi » dans : deux heures et ___ / une ___-heure ?',
  answer:'deux heures et demie ; une demi-heure',
  note:'Placé après, demi s’accorde en genre seulement. Placé avant avec trait d’union, il est invariable.' });

/* ──────────────────────── Subjonctif ──────────────────────── */

card({ type:'cloze', tags:['subjonctif'], prompt:'Il faut que tu ___ ton dossier avant vendredi. (finir)',
  answer:'finisses', display:'Il faut que tu finisses ton dossier avant vendredi.',
  note:'il faut que déclenche toujours le subjonctif.' });

card({ type:'cloze', tags:['subjonctif'], prompt:'Bien qu’il ___ fatigué, il a terminé la réunion. (être)',
  answer:'soit', display:'Bien qu’il soit fatigué, il a terminé la réunion.',
  note:'bien que, quoique → subjonctif. Alternative indicative : même s’il était fatigué.' });

card({ type:'choice', tags:['subjonctif'], prompt:'Quelle locution ne demande PAS le subjonctif ?',
  options:['avant que','pour que','après que','à condition que'], answer:2,
  note:'après que demande l’indicatif, même si l’usage oral hésite. avant que → subjonctif.' });

card({ type:'cloze', tags:['subjonctif'], prompt:'Je voudrais que vous ___ présent à la signature du bail. (être)',
  answer:'soyez', display:'Je voudrais que vous soyez présent à la signature du bail.',
  note:'vouloir que, souhaiter que, aimer que → subjonctif. Mais espérer que → indicatif : j’espère que vous serez là.' });

card({ type:'choice', tags:['subjonctif'], prompt:'Je pense qu’il ___ raison.',
  options:['ait','a','soit','aura eu'], answer:1,
  note:'penser que affirmatif → indicatif. À la forme négative ou interrogative, le subjonctif devient possible : je ne pense pas qu’il ait raison.' });

card({ type:'cloze', tags:['subjonctif'], prompt:'Nous attendrons jusqu’à ce qu’elle ___. (venir)',
  answer:'vienne', display:'Nous attendrons jusqu’à ce qu’elle vienne.',
  note:'jusqu’à ce que → subjonctif. Formes irrégulières à savoir : aille, fasse, puisse, sache, veuille, vienne, prenne.' });

card({ type:'recall', tags:['subjonctif'], prompt:'Subjonctif présent de : aller, faire, pouvoir, savoir, vouloir, valoir ?',
  answer:'que j’aille, que je fasse, que je puisse, que je sache, que je veuille, qu’il vaille',
  note:'Ces six verbes couvrent la grande majorité des subjonctifs irréguliers rencontrés au TEF.' });

card({ type:'choice', tags:['subjonctif','registre'], prompt:'Formule la plus soutenue pour une lettre de réclamation :',
  options:['Je veux que vous me remboursiez','Il faudrait que vous me remboursez','Je souhaiterais que vous procédiez au remboursement','Vous devez me rembourser'],
  answer:2, note:'Conditionnel de politesse + subjonctif + nominalisation : c’est le registre attendu en expression écrite section B.' });

/* ───────────────────────── Pronoms ───────────────────────── */

card({ type:'cloze', tags:['pronoms'], prompt:'Tu as parlé du projet à Marc ? — Oui, je ___ ___ ai parlé.',
  answer:'lui en', display:'Oui, je lui en ai parlé.',
  note:'Ordre : me/te/nous/vous → le/la/les → lui/leur → y → en.' });

card({ type:'choice', tags:['pronoms'], prompt:'Je vais au Québec l’été prochain. → J’___ vais l’été prochain.',
  options:['en','y','le','lui'], answer:1,
  note:'y remplace un lieu introduit par à, en, dans, sur. en remplace de + lieu ou une quantité.' });

card({ type:'cloze', tags:['pronoms'], prompt:'Des justificatifs ? J’___ ai apporté trois.',
  answer:'en', display:"J'en ai apporté trois.",
  note:'en reprend une quantité ; le nombre reste exprimé après le verbe.' });

card({ type:'choice', tags:['pronoms'], prompt:'La ville ___ je viens est au bord du fleuve.',
  options:['que','dont','où','laquelle'], answer:1,
  note:'venir de → dont. Comparez : la ville où j’habite (habiter à).' });

card({ type:'choice', tags:['pronoms'], prompt:'C’est le collègue ___ je t’ai parlé hier.',
  options:['que','qui','dont','où'], answer:2,
  note:'parler de quelqu’un → dont. L’erreur fréquente est « que je t’ai parlé ».' });

card({ type:'choice', tags:['pronoms'], prompt:'___ m’inquiète, c’est le délai de traitement.',
  options:['Ce que','Ce qui','Qu’est-ce que','Ce dont'], answer:1,
  note:'ce qui est sujet du verbe qui suit ; ce que en est l’objet : ce que je crains, c’est le délai.' });

card({ type:'cloze', tags:['pronoms'], prompt:'Donne-___-___ demain matin, s’il te plaît. (le / moi)',
  answer:'le moi', display:'Donne-le-moi demain matin, s’il te plaît.',
  note:'À l’impératif affirmatif, l’ordre s’inverse : COD puis COI, avec traits d’union.' });

card({ type:'choice', tags:['pronoms'], prompt:'Ne ___ dis rien pour le moment.',
  options:['lui','le lui','leur le','lui le'], answer:0,
  note:'À l’impératif négatif, on retrouve l’ordre normal devant le verbe : ne lui dis rien.' });

/* ───────────────────── Temps et modes ───────────────────── */

card({ type:'choice', tags:['temps'], prompt:'Quand je suis arrivé, la réunion ___ déjà ___.',
  options:['a / commencé','avait / commencé','est / commencée','était / commencée'], answer:1,
  note:'Plus-que-parfait pour une action antérieure à un autre passé.' });

card({ type:'cloze', tags:['temps'], prompt:'Si j’avais plus de temps, je ___ un cours du soir. (suivre)',
  answer:'suivrais', display:'Si j’avais plus de temps, je suivrais un cours du soir.',
  note:'Hypothèse irréelle du présent : si + imparfait → conditionnel présent. Jamais « si je suivrais ».' });

card({ type:'cloze', tags:['temps'], prompt:'Si j’avais su, je ne ___ ___ ___ venu. (venir)',
  answer:'serais pas', display:'Si j’avais su, je ne serais pas venu.',
  note:'Irréel du passé : si + plus-que-parfait → conditionnel passé.' });

card({ type:'choice', tags:['temps'], prompt:'Hier, il pleuvait et les rues ___ désertes. Choisis l’emploi correct de l’imparfait.',
  options:['ont été','étaient','furent','auront été'], answer:1,
  note:'Décor et description au passé → imparfait. Les actions ponctuelles prennent le passé composé.' });

card({ type:'cloze', tags:['temps'], prompt:'Dès que j’___ reçu la réponse, je t’appellerai. (avoir)',
  answer:'aurai', display:'Dès que j’aurai reçu la réponse, je t’appellerai.',
  note:'Futur antérieur après dès que, quand, lorsque, après que, pour marquer l’antériorité dans le futur.' });

card({ type:'choice', tags:['temps','registre'], prompt:'À l’écrit, pour rapporter une information non confirmée :',
  options:['Le loyer a augmenté de 8 %','Le loyer aurait augmenté de 8 %','Le loyer augmentait de 8 %','Le loyer aura augmenté de 8 %'],
  answer:1, note:'Le conditionnel journalistique marque l’information rapportée et non vérifiée. Très utile en expression écrite.' });

/* ─────────────────────── Prépositions ─────────────────────── */

card({ type:'cloze', tags:['prepositions'], prompt:'Je travaille ___ Toronto, ___ Ontario, ___ Canada.',
  answer:'à en au', display:'Je travaille à Toronto, en Ontario, au Canada.',
  note:'Villes : à. Provinces et pays féminins : en. Pays masculins : au. Pluriels : aux États-Unis.' });

card({ type:'choice', tags:['prepositions'], prompt:'Je m’intéresse ___ design d’interface.',
  options:['de','au','pour','sur'], answer:1,
  note:'s’intéresser à. Mais : être intéressé par, avoir besoin de, se souvenir de, s’occuper de.' });

card({ type:'choice', tags:['prepositions'], prompt:'J’ai réussi ___ obtenir un rendez-vous.',
  options:['de','pour','à','en'], answer:2,
  note:'réussir à faire. Comparez : essayer de, décider de, accepter de, commencer à, arriver à.' });

card({ type:'cloze', tags:['prepositions'], prompt:'Le dossier doit être déposé ___ le 15 mars. (date limite)',
  answer:'avant', display:'Le dossier doit être déposé avant le 15 mars.',
  note:'avant = date limite. d’ici le 15 mars est aussi correct. pour le 15 mars insiste sur l’échéance.' });

card({ type:'choice', tags:['prepositions'], prompt:'J’habite ici ___ trois ans.',
  options:['pendant','depuis','pour','dans'], answer:1,
  note:'depuis = début dans le passé qui continue. pendant = durée achevée. dans = moment futur. pour = durée prévue.' });

/* ─────────────────── Connecteurs logiques ─────────────────── */

card({ type:'recall', tags:['connecteurs'], prompt:'Trois connecteurs d’opposition de registre soutenu ?',
  answer:'en revanche, toutefois, néanmoins (aussi : cependant, or, il n’en demeure pas moins que)',
  note:'Évite « mais » répété en expression écrite section B : c’est le premier signe d’un niveau faible.' });

card({ type:'recall', tags:['connecteurs'], prompt:'Comment ajouter un argument sans dire « aussi » ?',
  answer:'par ailleurs, en outre, de plus, qui plus est, d’autant plus que',
  note:'Place-les en tête de paragraphe, suivis d’une virgule.' });

card({ type:'recall', tags:['connecteurs'], prompt:'Exprimer la cause en registre écrit, trois façons ?',
  answer:'étant donné que, dans la mesure où, compte tenu de (+ nom), en raison de (+ nom)',
  note:'parce que est correct mais oral. car se place après la proposition principale.' });

card({ type:'choice', tags:['connecteurs'], prompt:'Quelle formule concède un point avant de le réfuter ?',
  options:['Certes…, mais…','Donc…, ainsi…','D’abord…, ensuite…','En somme…, enfin…'], answer:0,
  note:'La concession est l’outil qui fait monter la note en argumentation : Certes, le loyer est élevé ; il n’en demeure pas moins que…' });

card({ type:'recall', tags:['connecteurs'], prompt:'Conclure sans écrire « pour conclure » ?',
  answer:'en définitive, en somme, tout bien considéré, il ressort de ce qui précède que',
  note:'Garde une conclusion de deux phrases : bilan de ton argument, puis ouverture ou recommandation.' });

/* ──────────────── Registre et formules utiles ──────────────── */

card({ type:'recall', tags:['registre'], prompt:'Ouvrir une lettre formelle de demande ?',
  answer:'Je me permets de vous écrire afin de… / Je vous écris au sujet de…',
  note:'Évite « Je voudrais juste savoir ». La nominalisation (afin d’obtenir des précisions) élève immédiatement le registre.' });

card({ type:'recall', tags:['registre'], prompt:'Clore une lettre formelle à un destinataire inconnu ?',
  answer:'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.',
  note:'Variante plus courte et sûre : Veuillez agréer mes salutations distinguées.' });

card({ type:'recall', tags:['registre'], prompt:'Quatre façons polies de demander une information à l’oral (section A) ?',
  answer:'Pourriez-vous me préciser… / Auriez-vous l’amabilité de… / Je voudrais savoir si… / Qu’en est-il de… ?',
  note:'En expression orale A, tu dois poser des questions : prépare cinq amorces et fais-les tourner.' });

card({ type:'recall', tags:['registre'], prompt:'Reformuler « c’est trop cher » en registre neutre à soutenu ?',
  answer:'Le tarif me paraît élevé / Ce montant dépasse mon budget / Le prix demandé semble excessif',
  note:'La reformulation vers le haut est exactement ce que l’examinateur évalue en expression orale B.' });

card({ type:'recall', tags:['registre'], prompt:'Nuancer une opinion sans dire « je pense que » ?',
  answer:'Il me semble que… / J’ai tendance à croire que… / On peut légitimement s’interroger sur… / Force est de constater que…',
  note:'Alterner les amorces d’opinion est l’un des gains de note les plus rapides à l’écrit.' });

/* ────────────────────── Lexique : logement ────────────────── */

card({ type:'recall', tags:['logement'], prompt:'le bail', answer:'le contrat de location signé entre propriétaire et locataire',
  note:'Pluriel irrégulier : des baux. Verbe : résilier un bail.' });
card({ type:'recall', tags:['logement'], prompt:'les charges comprises', answer:'loyer incluant eau, chauffage ou entretien',
  note:'Dans une annonce : « 1 200 $ c.c. ». Question d’oral utile : « Les charges sont-elles comprises ? »' });
card({ type:'recall', tags:['logement'], prompt:'le préavis', answer:'le délai à respecter avant de quitter un logement',
  note:'Donner son préavis = annoncer son départ. Au Québec, on parle d’avis de non-renouvellement.' });
card({ type:'recall', tags:['logement'], prompt:'l’état des lieux', answer:'le constat écrit de l’état du logement à l’entrée et à la sortie',
  note:'Masculin. Sert à récupérer le dépôt de garantie.' });
card({ type:'recall', tags:['logement'], prompt:'un logement meublé', answer:'un logement loué avec son mobilier',
  note:'Opposé : un logement vide ou non meublé. Au Québec : un trois et demi (3½) décrit la taille.' });
card({ type:'choice', tags:['logement'], prompt:'Dans une annonce, « libre dès le 1er juillet » signifie :',
  options:['déjà occupé','disponible à partir du 1er juillet','gratuit en juillet','à visiter le 1er juillet'],
  answer:1, note:'libre = disponible. Formule fréquente en compréhension écrite section A.' });

/* ─────────────────── Lexique : travail ─────────────────── */

card({ type:'recall', tags:['travail'], prompt:'un entretien d’embauche', answer:'une rencontre pour obtenir un poste',
  note:'Au Québec, on dit aussi une entrevue. Verbe : passer un entretien.' });
card({ type:'recall', tags:['travail'], prompt:'le salaire brut / net', answer:'avant / après déductions et impôts',
  note:'Question d’oral : « S’agit-il du salaire brut ou net ? »' });
card({ type:'recall', tags:['travail'], prompt:'un poste à temps plein / partiel', answer:'un emploi à horaire complet / réduit',
  note:'Aussi : un contrat à durée indéterminée (CDI), déterminée (CDD), un poste permanent (usage canadien).' });
card({ type:'recall', tags:['travail'], prompt:'les congés payés', answer:'les jours de vacances rémunérés',
  note:'Au Québec : les vacances. Prendre un congé sans solde = non rémunéré.' });
card({ type:'recall', tags:['travail'], prompt:'démissionner / être licencié', answer:'partir de son plein gré / être renvoyé par l’employeur',
  note:'Au Québec : être mis à pied (licenciement temporaire). Nuance souvent testée en écoute.' });
card({ type:'recall', tags:['travail'], prompt:'le télétravail', answer:'le travail à distance, depuis le domicile',
  note:'Thème récurrent en expression écrite B : avantages, isolement, productivité, frais.' });
card({ type:'recall', tags:['travail'], prompt:'une lettre de motivation', answer:'la lettre qui accompagne le CV et argumente la candidature',
  note:'Au Québec : une lettre de présentation.' });
card({ type:'choice', tags:['travail'], prompt:'« Le poste est à pourvoir immédiatement » signifie :',
  options:['le poste est supprimé','le poste doit être rempli tout de suite','le poste est déjà pris','le poste est provisoire'],
  answer:1, note:'à pourvoir = à remplir. Formule systématique dans les offres d’emploi.' });

/* ─────────────────── Lexique : démarches ─────────────────── */

card({ type:'recall', tags:['admin'], prompt:'un justificatif de domicile', answer:'un document prouvant où l’on habite',
  note:'Facture d’électricité, bail, relevé bancaire. Vocabulaire quasi certain en section A du TEF.' });
card({ type:'recall', tags:['admin'], prompt:'une pièce jointe', answer:'un document attaché à un courriel',
  note:'Formule : « veuillez trouver ci-joint… » (invariable avant le nom).' });
card({ type:'recall', tags:['admin'], prompt:'un délai de traitement', answer:'le temps nécessaire pour qu’une demande soit étudiée',
  note:'Aussi : dans un délai de dix jours ouvrables (= hors week-end et jours fériés).' });
card({ type:'recall', tags:['admin'], prompt:'une attestation', answer:'un document officiel qui certifie un fait',
  note:'Distinguer : un certificat (médical), une attestation (d’emploi), un relevé (de notes, bancaire).' });
card({ type:'recall', tags:['admin'], prompt:'effectuer une démarche', answer:'accomplir une formalité administrative',
  note:'Collocations : entamer, effectuer, finaliser une démarche.' });
card({ type:'choice', tags:['admin'], prompt:'« Veuillez vous présenter au guichet 4 muni de votre pièce d’identité. »',
  options:['Apportez votre pièce d’identité','Laissez votre pièce d’identité','Montrez-la plus tard','Aucune pièce nécessaire'],
  answer:0, note:'muni de = en possession de. Registre d’annonce administrative, fréquent en compréhension orale.' });

/* ─────────────────── Lexique : santé et société ─────────── */

card({ type:'recall', tags:['sante'], prompt:'une ordonnance', answer:'le document du médecin pour obtenir des médicaments',
  note:'Au Québec : une prescription. Renouveler une ordonnance.' });
card({ type:'recall', tags:['sante'], prompt:'prendre rendez-vous chez le médecin', answer:'fixer une consultation',
  note:'Aussi : annuler, décaler, avancer un rendez-vous — verbes utiles en expression orale A.' });
card({ type:'recall', tags:['sante'], prompt:'les urgences', answer:'le service hospitalier pour les cas graves et immédiats',
  note:'Toujours pluriel. Aller aux urgences.' });
card({ type:'recall', tags:['societe'], prompt:'le coût de la vie', answer:'le niveau général des prix pour se loger, manger, se déplacer',
  note:'Sujet d’expression écrite très probable : logement, transports, inflation.' });
card({ type:'recall', tags:['societe'], prompt:'le covoiturage', answer:'le partage d’une voiture entre plusieurs personnes pour un trajet',
  note:'Famille utile : les transports en commun, la circulation, les embouteillages, l’empreinte carbone.' });
card({ type:'recall', tags:['societe'], prompt:'la pénurie de main-d’œuvre', answer:'le manque de travailleurs disponibles',
  note:'Thème canadien récurrent en compréhension écrite section B.' });
card({ type:'recall', tags:['societe'], prompt:'le tri sélectif', answer:'la séparation des déchets pour le recyclage',
  note:'Famille : les déchets, le compost, le gaspillage alimentaire, le vrac, consigner une bouteille.' });

/* ──────────────── Français du Québec (TEF Canada) ──────────── */

card({ type:'choice', tags:['quebec'], prompt:'« Je vais magasiner en fin de semaine. »',
  options:['Je vais travailler','Je vais faire des achats','Je vais déménager','Je vais me reposer'],
  answer:1, note:'magasiner = faire du shopping ; la fin de semaine = le week-end.' });
card({ type:'recall', tags:['quebec'], prompt:'un dépanneur', answer:'une petite épicerie de quartier ouverte tard',
  note:'Rien à voir avec la réparation automobile — piège classique en compréhension orale.' });
card({ type:'recall', tags:['quebec'], prompt:'le cégep', answer:'l’établissement d’études collégiales entre le secondaire et l’université, au Québec',
  note:'Deux ans en préuniversitaire, trois ans en technique.' });
card({ type:'choice', tags:['quebec'], prompt:'Au Québec, le repas du soir s’appelle :',
  options:['le dîner','le souper','le déjeuner','le goûter'], answer:1,
  note:'déjeuner = matin, dîner = midi, souper = soir. Décalage par rapport à la France, souvent testé.' });
card({ type:'recall', tags:['quebec'], prompt:'un courriel / un stationnement / un traversier', answer:'un e-mail / un parking / un ferry',
  note:'L’usage québécois préfère les équivalents français aux anglicismes.' });
card({ type:'choice', tags:['quebec'], prompt:'Au Québec, « Bienvenue ! » répond souvent à :',
  options:['Bonjour','Merci','Au revoir','Pardon'], answer:1,
  note:'Bienvenue = de rien, je vous en prie. Détail d’écoute qui surprend les candidats.' });
card({ type:'recall', tags:['quebec'], prompt:'la poudrerie', answer:'la neige soulevée et transportée par le vent',
  note:'Vocabulaire météo canadien : verglas, bordée de neige, refroidissement éolien, déneigement.' });

export const CARDS = C;
export const CARD_COUNT = C.length;
