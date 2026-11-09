// Vocabulary as chunks, not words. You do not need "loyer" — you need
// "le loyer charges comprises", because that is what comes out of your mouth
// under pressure. Each item carries a sentence you can say as-is.

export const THEMES = {
  logement:    { fr:'Logement',            en:'Housing' },
  travail:     { fr:'Travail et emploi',   en:'Work & employment' },
  demarches:   { fr:'Démarches',           en:'Admin & paperwork' },
  sante:       { fr:'Santé',               en:'Health' },
  transport:   { fr:'Transports',          en:'Transport' },
  etudes:      { fr:'Études et formation', en:'Study & training' },
  argent:      { fr:'Argent',              en:'Money' },
  alimentation:{ fr:'Alimentation',        en:'Food & shopping' },
  societe:     { fr:'Société et actualité',en:'Society & current affairs' },
  environnement:{fr:'Environnement',       en:'Environment' },
  technologie: { fr:'Technologie',         en:'Technology' },
  quebec:      { fr:'Français du Québec',  en:'Quebec French' },
};

const V = [];
let n = 0;
const v = (theme, fr, en, ex, exEn, level = 'A2') => {
  V.push({ id: 'v' + (++n).toString().padStart(3, '0'), theme, fr, en, ex, exEn, level });
};

/* ───────────────────── Logement ───────────────────── */
v('logement','le loyer','the rent','Le loyer est de 1 200 $ par mois.','The rent is $1,200 a month.');
v('logement','charges comprises','utilities included','Est-ce que c’est charges comprises ?','Is that with utilities included?');
v('logement','le bail','the lease','Le bail est d’une durée de douze mois.','The lease runs for twelve months.');
v('logement','le dépôt de garantie','the security deposit','Faut-il verser un dépôt de garantie ?','Is a security deposit required?');
v('logement','l’état des lieux','the inventory / condition report','On fait l’état des lieux à l’entrée et à la sortie.','We do the condition report on moving in and out.','B1');
v('logement','donner son préavis','to give notice','Je dois donner mon préavis deux mois à l’avance.','I have to give notice two months in advance.','B1');
v('logement','un logement meublé','a furnished flat','Je cherche un logement meublé pour six mois.','I’m looking for a furnished flat for six months.');
v('logement','libre dès le 1er juillet','available from 1 July','L’appartement est libre dès le premier juillet.','The flat is available from 1 July.');
v('logement','la colocation','flat-sharing','La colocation revient beaucoup moins cher.','Flat-sharing works out much cheaper.');
v('logement','le propriétaire / le locataire','the landlord / the tenant','Le propriétaire s’occupe des réparations.','The landlord handles repairs.');
v('logement','emménager / déménager','to move in / to move out','On emménage à la fin du mois.','We’re moving in at the end of the month.');
v('logement','un vis-à-vis','a facing building / overlooked view','Il n’y a pas de vis-à-vis, c’est très calme.','Nothing faces it, so it’s very quiet.','B1');
v('logement','les parties communes','the common areas','L’entretien des parties communes est inclus.','Upkeep of the common areas is included.','B1');
v('logement','résilier un bail','to terminate a lease','Dans quelles conditions peut-on résilier le bail ?','Under what conditions can the lease be terminated?','B1');

/* ───────────────────── Travail ───────────────────── */
v('travail','un entretien d’embauche','a job interview','J’ai un entretien d’embauche jeudi.','I have a job interview on Thursday.');
v('travail','le salaire brut / net','gross / net salary','S’agit-il du salaire brut ou net ?','Is that gross or net salary?');
v('travail','un poste à pourvoir','a vacancy to be filled','Le poste est à pourvoir immédiatement.','The position is to be filled immediately.','B1');
v('travail','une lettre de motivation','a cover letter','J’ai joint mon CV et ma lettre de motivation.','I’ve attached my CV and cover letter.');
v('travail','les congés payés','paid leave','Combien de jours de congés payés sont prévus ?','How many days of paid leave are there?');
v('travail','le télétravail','remote work','Le télétravail est possible deux jours par semaine.','Remote work is possible two days a week.');
v('travail','une période d’essai','a probationary period','La période d’essai dure trois mois.','The probation period lasts three months.','B1');
v('travail','démissionner','to resign','Il a démissionné après six mois.','He resigned after six months.');
v('travail','être licencié','to be laid off / dismissed','Elle a été licenciée pour motif économique.','She was laid off for economic reasons.','B1');
v('travail','faire des heures supplémentaires','to work overtime','Je fais des heures supplémentaires en fin de mois.','I work overtime at the end of the month.');
v('travail','une augmentation','a pay rise','Je compte demander une augmentation.','I plan to ask for a raise.');
v('travail','la charge de travail','the workload','La charge de travail a beaucoup augmenté.','The workload has increased a lot.','B1');
v('travail','un collègue de confiance','a colleague you can rely on','C’est une collègue de confiance.','She’s a colleague I can rely on.');
v('travail','la pénurie de main-d’œuvre','the labour shortage','Le secteur connaît une pénurie de main-d’œuvre.','The sector is short of workers.','B2');

/* ─────────────────── Démarches ─────────────────── */
v('demarches','un justificatif de domicile','proof of address','On m’a demandé un justificatif de domicile.','They asked me for proof of address.');
v('demarches','une pièce d’identité','photo ID','Présentez-vous au guichet avec une pièce d’identité.','Come to the counter with photo ID.');
v('demarches','remplir un formulaire','to fill in a form','Il faut remplir ce formulaire en ligne.','You have to fill in this form online.');
v('demarches','le délai de traitement','the processing time','Quel est le délai de traitement du dossier ?','What’s the processing time for the file?','B1');
v('demarches','une attestation','an official certificate','Je dois fournir une attestation d’emploi.','I have to provide proof of employment.','B1');
v('demarches','prendre rendez-vous','to make an appointment','J’aimerais prendre rendez-vous pour mardi.','I’d like to book an appointment for Tuesday.');
v('demarches','des jours ouvrables','working days','Comptez dix jours ouvrables.','Allow ten working days.','B1');
v('demarches','effectuer une démarche','to complete a formality','C’est une démarche à effectuer en ligne.','It’s a procedure to complete online.','B1');
v('demarches','une pièce jointe','an attachment','Veuillez trouver ci-joint mon dossier.','Please find my file attached.','B1');
v('demarches','faire une réclamation','to file a complaint','Je souhaite faire une réclamation.','I’d like to file a complaint.','B1');
v('demarches','un accusé de réception','an acknowledgement of receipt','Je n’ai reçu aucun accusé de réception.','I haven’t received any acknowledgement.','B2');

/* ───────────────────── Santé ───────────────────── */
v('sante','prendre rendez-vous chez le médecin','to see a doctor','J’ai pris rendez-vous chez le médecin.','I’ve made a doctor’s appointment.');
v('sante','une ordonnance','a prescription','Le médecin m’a fait une ordonnance.','The doctor wrote me a prescription.');
v('sante','les urgences','A&E / the emergency room','Il a passé la nuit aux urgences.','He spent the night in A&E.');
v('sante','se sentir fatigué','to feel tired','Je me sens fatigué depuis une semaine.','I’ve been feeling tired for a week.');
v('sante','l’assurance maladie','health insurance','L’assurance maladie couvre la consultation.','Health insurance covers the appointment.','B1');
v('sante','annuler un rendez-vous','to cancel an appointment','Je dois annuler mon rendez-vous de jeudi.','I need to cancel Thursday’s appointment.');
v('sante','prendre soin de soi','to look after oneself','Il faut prendre soin de soi.','You have to look after yourself.');
v('sante','une consultation','an appointment / consultation','La consultation dure vingt minutes.','The appointment lasts twenty minutes.');

/* ─────────────────── Transports ─────────────────── */
v('transport','les transports en commun','public transport','Je prends les transports en commun tous les jours.','I take public transport every day.');
v('transport','un abonnement mensuel','a monthly pass','Un abonnement mensuel coûte combien ?','How much is a monthly pass?');
v('transport','les heures de pointe','rush hour','Aux heures de pointe, c’est bondé.','At rush hour it’s packed.','B1');
v('transport','les embouteillages','traffic jams','Il y a des embouteillages sur l’autoroute.','There are jams on the motorway.');
v('transport','le covoiturage','car-sharing / carpooling','On fait du covoiturage trois fois par semaine.','We carpool three times a week.');
v('transport','rater sa correspondance','to miss one’s connection','J’ai raté ma correspondance.','I missed my connection.','B1');
v('transport','un trajet quotidien','a daily commute','Mon trajet quotidien dure quarante minutes.','My daily commute takes forty minutes.');
v('transport','se garer / le stationnement','to park / parking','Le stationnement est compris ?','Is parking included?');

/* ─────────────── Études et formation ─────────────── */
v('etudes','suivre une formation','to take a course','Je suis une formation du soir.','I’m taking an evening course.');
v('etudes','s’inscrire à un cours','to register for a class','Je voudrais m’inscrire au cours de février.','I’d like to register for the February class.');
v('etudes','les prérequis','the prerequisites','Y a-t-il des prérequis pour cette formation ?','Are there any prerequisites for this course?','B1');
v('etudes','passer un examen','to sit an exam','Je passe mon examen en février.','I’m sitting my exam in February.');
v('etudes','réussir / échouer','to pass / to fail','J’ai réussi l’épreuve écrite.','I passed the written paper.');
v('etudes','une attestation de réussite','a certificate of completion','L’attestation est-elle reconnue ?','Is the certificate recognised?','B1');
v('etudes','faire des progrès','to make progress','Je fais des progrès à l’oral.','I’m making progress in speaking.');
v('etudes','le cégep','Quebec pre-university college','Il est au cégep depuis septembre.','He’s been at cégep since September.','B1');

/* ───────────────────── Argent ───────────────────── */
v('argent','le coût de la vie','the cost of living','Le coût de la vie a beaucoup augmenté.','The cost of living has risen a lot.');
v('argent','faire des économies','to save money','J’essaie de faire des économies.','I’m trying to save money.');
v('argent','rembourser','to pay back / refund','Ils m’ont remboursé la totalité.','They refunded me in full.','B1');
v('argent','des frais supplémentaires','extra charges','Y a-t-il des frais supplémentaires ?','Are there extra charges?');
v('argent','payer en plusieurs fois','to pay in instalments','Peut-on payer en plusieurs fois ?','Can one pay in instalments?','B1');
v('argent','ça revient cher','it works out expensive','À la longue, ça revient cher.','In the long run it works out expensive.','B1');
v('argent','le rapport qualité-prix','value for money','Le rapport qualité-prix est excellent.','The value for money is excellent.','B1');

/* ──────────────── Alimentation ──────────────── */
v('alimentation','faire les courses','to do the shopping','Je fais les courses le samedi.','I do the shopping on Saturdays.');
v('alimentation','un produit local','a local product','Je privilégie les produits locaux.','I go for local products.','B1');
v('alimentation','le gaspillage alimentaire','food waste','Le gaspillage alimentaire reste un problème.','Food waste remains a problem.','B1');
v('alimentation','manger équilibré','to eat a balanced diet','J’essaie de manger équilibré.','I try to eat a balanced diet.');
v('alimentation','commander à emporter','to order takeaway','On a commandé à emporter.','We ordered takeaway.');
v('alimentation','la date de péremption','the expiry date','Vérifie la date de péremption.','Check the expiry date.','B1');

/* ───────────────── Société ───────────────── */
v('societe','la qualité de vie','quality of life','La qualité de vie est meilleure en banlieue.','Quality of life is better in the suburbs.');
v('societe','les inégalités','inequality','Les inégalités se creusent.','Inequality is widening.','B2');
v('societe','le vieillissement de la population','population ageing','Le vieillissement de la population pose problème.','Population ageing is a problem.','B2');
v('societe','l’accès au logement','access to housing','L’accès au logement devient difficile.','Access to housing is becoming difficult.','B1');
v('societe','les nouveaux arrivants','newcomers','Des cours sont offerts aux nouveaux arrivants.','Classes are offered to newcomers.','B1');
v('societe','le bénévolat','volunteering','Je fais du bénévolat le week-end.','I volunteer at weekends.','B1');
v('societe','le vivre-ensemble','community cohesion','Le vivre-ensemble se construit au quotidien.','Community cohesion is built day by day.','B2');

/* ─────────────── Environnement ─────────────── */
v('environnement','le tri sélectif','waste sorting / recycling','Le tri sélectif est obligatoire ici.','Waste sorting is compulsory here.','B1');
v('environnement','réduire son empreinte carbone','to reduce one’s carbon footprint','On cherche à réduire notre empreinte carbone.','We’re trying to reduce our carbon footprint.','B1');
v('environnement','le réchauffement climatique','global warming','Le réchauffement climatique s’accélère.','Global warming is accelerating.','B1');
v('environnement','les énergies renouvelables','renewable energy','Le Québec mise sur les énergies renouvelables.','Quebec is betting on renewables.','B2');
v('environnement','jeter / recycler','to throw away / to recycle','Ça se recycle ou ça se jette ?','Does that get recycled or thrown out?');
v('environnement','consommer moins','to consume less','L’idée, c’est de consommer moins.','The idea is to consume less.');

/* ─────────────── Technologie ─────────────── */
v('technologie','un courriel','an email (Quebec usage)','Je vous envoie ça par courriel.','I’ll send you that by email.');
v('technologie','une application','an app','L’application est gratuite.','The app is free.');
v('technologie','le temps d’écran','screen time','Je limite mon temps d’écran le soir.','I limit my screen time in the evening.','B1');
v('technologie','sauvegarder ses données','to back up one’s data','Pense à sauvegarder tes données.','Remember to back up your data.','B1');
v('technologie','une panne','a breakdown / outage','Il y a eu une panne de réseau.','There was a network outage.');
v('technologie','l’intelligence artificielle','artificial intelligence','L’intelligence artificielle change le métier.','AI is changing the profession.','B1');

/* ───────────── Français du Québec ───────────── */
v('quebec','magasiner','to shop','On va magasiner en fin de semaine.','We’re going shopping this weekend.');
v('quebec','la fin de semaine','the weekend','Qu’est-ce que tu fais en fin de semaine ?','What are you doing this weekend?');
v('quebec','un dépanneur','a corner shop','Je passe au dépanneur en revenant.','I’ll stop at the corner shop on the way back.');
v('quebec','le souper','dinner / the evening meal','On soupe vers sept heures.','We have dinner around seven.');
v('quebec','un char','a car (colloquial)','Il a acheté un char d’occasion.','He bought a used car.','B1');
v('quebec','Bienvenue !','You’re welcome!','— Merci beaucoup. — Bienvenue !','— Thanks a lot. — You’re welcome!');
v('quebec','la poudrerie','blowing snow','Il y a de la poudrerie sur l’autoroute.','There’s blowing snow on the motorway.','B1');
v('quebec','un traversier','a ferry','On prend le traversier à Québec.','We take the ferry in Quebec City.','B1');
v('quebec','être tanné de','to be fed up with','Je suis tanné de l’hiver.','I’m fed up with winter.','B1');

export const VOCAB = V;
export const VOCAB_COUNT = V.length;
export const byTheme = (t) => V.filter(x => x.theme === t);
