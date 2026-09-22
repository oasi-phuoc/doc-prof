/**
 * Génère src/math/problem-banks.ts
 * Objectif : 50 frames (structures) distinctes par opération × niveau,
 * puis 100 prompts uniques par cellule (variations acteurs / lieux / contextes).
 *
 * Usage : node scripts/gen-problem-banks.mjs
 */
import fs from 'fs'

const levels = ['facile', 'moyen', 'avance']
const FRAME_COUNT = 50
const BANK_SIZE = 100

const actors = [
  'Lina', 'Noa', 'Yousef', 'Daryna', 'Sofia', 'Ahmed', 'Sara', 'Omar', 'Lea', 'Sam',
  'Amina', 'Bilal', 'Fatima', 'Remi', 'Elsa', 'Khalil', 'Mia', 'Tom', 'Nadia', 'Adam',
  'Ines', 'Marco', 'Giulia', 'Ana', 'Svitlana', 'Amadou', 'Selam', 'Yara', 'Hugo', 'Mariam',
  'Ali', 'Sami', 'Nour', 'Aya', 'Reza', 'Dawit', 'Rita', 'Tiago', 'Chiara', 'Hassan',
  'Farid', 'Zahra', 'Timur', 'Salma', 'Mustafa', 'Iryna', 'Rustam', 'Murat', 'Jalal', 'Olivia',
  'Samuel', 'Meron', 'Eden', 'Joao', 'Beatriz', 'Luca', 'Serena', 'Karim', 'Hana', 'Maya',
  'Tarek', 'Rania', 'Bashir', 'Senait', 'Rui', 'Patricia', 'Davide', 'Laura', 'Hamza', 'Asma',
  'Navid', 'Tesfay', 'Diogo', 'Claudia', 'Matteo', 'Federica', 'Walid', 'Iman', 'Soraya', 'Yohannes',
  'Goncalo', 'Isabel', 'Lorenzo', 'Alessandra', 'Anas', 'Malika', 'Parisa', 'Daniel', 'Paulo', 'Filipa',
  'Francesco', 'Roberta', 'Nabil', 'Zainab', 'Shirin', 'Sipho', 'Nuno', 'Mariana', 'Kofi', 'Aissatou',
]

const feminine = new Set([
  'Lina', 'Daryna', 'Sofia', 'Sara', 'Lea', 'Amina', 'Fatima', 'Elsa', 'Mia', 'Nadia', 'Ines',
  'Giulia', 'Ana', 'Svitlana', 'Selam', 'Yara', 'Mariam', 'Nour', 'Aya', 'Rita', 'Chiara', 'Zahra',
  'Salma', 'Iryna', 'Olivia', 'Meron', 'Eden', 'Beatriz', 'Serena', 'Hana', 'Maya', 'Rania',
  'Senait', 'Patricia', 'Laura', 'Asma', 'Claudia', 'Federica', 'Iman', 'Soraya', 'Isabel',
  'Alessandra', 'Malika', 'Parisa', 'Filipa', 'Roberta', 'Zainab', 'Shirin', 'Mariana', 'Aissatou',
])

const places = [
  'a l’ecole', 'dans la cour', 'au marche', 'a la bibliotheque', 'au parc', 'a la gare',
  'au musee', 'a la piscine', 'dans le jardin', 'au magasin', 'a la boulangerie', 'dans la classe',
  'au gymnase', 'a la ferme', 'au zoo', 'sur le parking', 'dans le bus', 'a la mediatheque',
  'au club de sport', 'dans l’atelier', 'a la cantine', 'au terrain de sport', 'dans le quartier',
  'a la mairie', 'au centre aere', 'dans le preau', 'a la recreation', 'au vestiaire',
  'dans le laboratoire', 'a l’atelier bois',
]

const objects = [
  'billes', 'cartes', 'crayons', 'gommes', 'cahiers', 'stylos', 'livres', 'autocollants',
  'figurines', 'vignettes', 'pommes', 'poires', 'bananes', 'oranges', 'bonbons', 'gateaux',
  'croissants', 'pains', 'oeufs', 'fleurs', 'tulipes', 'roses', 'arbres', 'plants', 'cubes',
  'legos', 'puzzles', 'jeux', 'ballons', 'balles', 'raquettes', 'medailles', 'points', 'tickets',
  'billets', 'passagers', 'eleves', 'enfants', 'oiseaux', 'chiens', 'chats', 'poissons', 'timbres',
  'photos', 'feuilles', 'enveloppes', 'colis', 'articles', 'tablettes', 'boites', 'sacs',
  'paniers', 'cages', 'bouteilles', 'verres', 'assiettes', 'serviettes', 'pinces',
  'vis', 'clous', 'planches', 'briques', 'seaux', 'arrosoirs', 'graines', 'bulbes', 'cailloux',
  'coquillages', 'perles', 'boutons', 'rubans', 'ficelles', 'etiquettes', 'dossiers', 'classeurs',
  'feuilles A4', 'feutres', 'pinceaux', 'pots', 'tubes', 'rouleaux', 'bobines', 'fils', 'aiguilles',
]

const verbsAdd = [
  'gagne', 'recoit', 'achete', 'ajoute', 'trouve', 'recupere', 'ramasse', 'collecte',
  'obtient', 'range', 'recueille', 'rapporte', 'deniche', 'glane', 'amasse',
]
const verbsSub = [
  'perd', 'donne', 'offre', 'vend', 'retire', 'enleve', 'mange', 'depense', 'prete',
  'jette', 'utilise', 'distribue', 'envoie', 'casse', 'oublie',
]

const mulPairs = [
  ['boites', 'crayons'], ['paquets', 'feuilles'], ['rangees', 'chaises'], ['lignes', 'choux'],
  ['equipes', 'joueurs'], ['classes', 'eleves'], ['etageres', 'livres'], ['casiers', 'cahiers'],
  ['sacs', 'pommes'], ['cageots', 'oranges'], ['plateaux', 'verres'], ['cartons', 'bouteilles'],
  ['files', 'voitures'], ['wagons', 'passagers'], ['tours', 'cubes'], ['bouquets', 'roses'],
  ['immeubles', 'appartements'], ['ruches', 'abeilles'], ['tables', 'assiettes'], ['rayons', 'produits'],
  ['albums', 'timbres'], ['pages', 'photos'], ['sachets', 'billes'], ['tiroirs', 'stylos'],
  ['bancs', 'places'], ['groupes', 'enfants'], ['ateliers', 'participants'], ['stands', 'visiteurs'],
  ['bacs', 'livres'], ['caissettes', 'fraises'],
]

const divPairs = [
  ['billes', 'enfants'], ['cartes', 'paquets'], ['feuilles', 'eleves'], ['bonbons', 'sacs'],
  ['livres', 'bacs'], ['oeufs', 'boites'], ['pommes', 'paniers'], ['crayons', 'trousses'],
  ['ballons', 'sachets'], ['timbres', 'pages'], ['photos', 'albums'], ['chaises', 'rangees'],
  ['eleves', 'groupes'], ['joueurs', 'equipes'], ['bouteilles', 'cartons'], ['cahiers', 'piles'],
  ['enveloppes', 'liasses'], ['pieces', 'rouleaux'], ['gommes', 'boites'], ['stylos', 'pots'],
]

function heShe(actor) {
  return feminine.has(actor)
    ? { Il: 'Elle', il: 'elle', a_t_il: 'a-t-elle', lui: 'lui' }
    : { Il: 'Il', il: 'il', a_t_il: 'a-t-il', lui: 'lui' }
}

const months = [
  'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre',
]
const contextSeeds = [
  'la fete de l’ecole', 'le marche de Noel', 'la kermesse', 'le tournoi de printemps', 'la sortie au musee',
  'l’atelier science', 'la semaine du gout', 'la journee portes ouvertes', 'la collecte solidaire', 'le challenge lecture',
  'le projet jardin', 'l’expo photos', 'le concert de fin d’annee', 'la course d’orientation', 'l’atelier cuisine',
  'le vide-grenier', 'le stand de limonade', 'les olympiades sportives', 'le conte musical', 'le rallye maths',
  'la semaine bleue', 'la semaine verte', 'le festival du livre', 'l’atelier robotique', 'le club nature',
  'le marche aux fleurs', 'le parcours sante', 'le defi zero dechet', 'l’atelier bricolage', 'la journee du sport',
]
const contexts = []
for (const month of months) {
  for (const seed of contextSeeds) contexts.push(`${seed} de ${month}`)
}

function withContext(prompt, i) {
  const ctx = contexts[i % contexts.length]
  if (/^Pour /i.test(prompt) || /^Calculez/i.test(prompt)) {
    return prompt.replace(/\?$/, ` — ${ctx} ?`)
  }
  return `Pour ${ctx}, ${prompt.charAt(0).toLowerCase()}${prompt.slice(1)}`
}

function assertUnique(arr, label) {
  const set = new Set(arr)
  if (set.size !== arr.length) {
    const seen = new Map()
    for (const x of arr) seen.set(x, (seen.get(x) || 0) + 1)
    const dups = [...seen.entries()].filter(([, c]) => c > 1).slice(0, 3)
    throw new Error(`${label}: doublons (${arr.length - set.size}) ex: ${dups.map(([k]) => k.slice(0, 80)).join(' || ')}`)
  }
}

function assertFrameCount(frames, label) {
  if (frames.length !== FRAME_COUNT) {
    throw new Error(`${label}: ${frames.length} frames (attendu ${FRAME_COUNT})`)
  }
  assertUnique(frames, `${label} frames`)
}

/** Remplit BANK_SIZE prompts uniques en cyclant sur FRAME_COUNT frames. */
function fillFromFrames(label, frames, makePrompt) {
  assertFrameCount(frames, label)
  const seen = new Set()
  const out = []
  let i = 0
  while (out.length < BANK_SIZE) {
    const frameIdx = out.length % FRAME_COUNT
    const raw = makePrompt(i, frameIdx, frames[frameIdx])
    const prompt = raw ? withContext(raw, i + label.length * 997) : null
    if (prompt && !seen.has(prompt)) {
      seen.add(prompt)
      out.push(prompt)
    }
    i++
    if (i > 200000) throw new Error(`Impossible de generer ${BANK_SIZE} pour ${label} (got ${out.length})`)
  }
  return out
}

/* -------------------------------------------------------------------------- */
/* 50 frames addition                                                          */
/* -------------------------------------------------------------------------- */

function additionFrames(level, actor, obj, place, verb, g) {
  if (level === 'facile') {
    return [
      `${actor} a {a} ${obj}. ${g.Il} en ${verb} {b}. Combien en ${g.a_t_il} ?`,
      `Il y a {a} ${obj} ${place}. On en ajoute {b}. Combien y en a-t-il ?`,
      `Un panier contient {a} ${obj}. On y met {b} ${obj}. Combien y en a-t-il ?`,
      `${actor} compte {a} ${obj} puis encore {b}. Quel est le total ?`,
      `Ce matin : {a} ${obj}. L’apres-midi : {b} de plus. Combien en tout ?`,
      `Dans une boite, il y a {a} ${obj}. ${actor} en ajoute {b}. Combien de ${obj} ?`,
      `${place}, {a} ${obj} sont poses. On en pose {b} de plus. Combien sont poses ?`,
      `Stock initial : {a} ${obj}. Livraison : {b}. Combien en stock ?`,
      `${actor} aligne {a} ${obj} d’un cote et {b} de l’autre. Combien au total ?`,
      `Pour l’activite, on prend {a} ${obj}, puis {b} de plus. Combien en prend-on ?`,
      `${actor} trouve {a} ${obj} dans un tiroir et {b} dans un sac. Combien en a-t-${g.il} ?`,
      `Sur la table, {a} ${obj} puis on apporte {b} ${obj}. Combien y en a-t-il ?`,
      `${actor} recoit {a} ${obj} lundi et {b} mardi. Combien en a-t-${g.il} ?`,
      `Deux piles : {a} ${obj} et {b} ${obj}. Combien de ${obj} en tout ?`,
      `Au depart {a} ${obj}, puis ${actor} en ${verb} {b}. Quel total ?`,
      `La boite bleue a {a} ${obj}, la rouge {b}. Combien ensemble ?`,
      `${place} on voit {a} ${obj}. Plus tard on en voit {b} de plus. Combien ?`,
      `${actor} note {a} puis ajoute {b} ${obj}. Quelle somme ecrit-${g.il} ?`,
      `Premier groupe : {a} ${obj}. Second groupe : {b}. Combien au total ?`,
      `On range {a} ${obj}, puis encore {b}. Combien sont ranges ?`,
      `${actor} colle {a} vignettes, puis {b} autres. Combien de vignettes ?`,
      `Dans le sac : {a} ${obj}. ${actor} y glisse {b}. Combien dans le sac ?`,
      `Le plateau montre {a} ${obj}. On en pose {b} de plus. Combien ?`,
      `${actor} a {a} ${obj} a gauche et {b} a droite. Combien en tout ?`,
      `Avant la recre : {a} ${obj}. Pendant la recre : +{b}. Combien maintenant ?`,
      `Une corbeille a {a} ${obj}. On y verse {b} ${obj}. Combien y a-t-il ?`,
      `${place}, inventaire : {a} puis +{b} ${obj}. Quel total ?`,
      `${actor} dessine {a} ${obj} puis {b} de plus. Combien de dessins ?`,
      `Sur l’etagere du haut : {a} ${obj}. Du bas : {b}. Combien sur l’etagere ?`,
      `Le compteur affiche {a}. On ajoute {b} ${obj}. Quel nouveau total ?`,
      `${actor} gagne {a} ${obj} au premier jeu et {b} au second. Combien gagne-t-${g.il} ?`,
      `Classe A apporte {a} ${obj}, classe B apporte {b}. Combien reunis ?`,
      `Dans le tiroir : {a} ${obj}. ${actor} en ${verb} {b} dehors. Combien dans le tiroir ensuite ?`,
      `On prepare {a} ${obj} pour le matin et {b} pour l’apres-midi. Combien prepares ?`,
      `${place} : debut {a} ${obj}, fin de seance +{b}. Combien a la fin ?`,
      `${actor} lit {a} pages puis {b} pages. Combien de pages lues ?`,
      `Boite 1 : {a} ${obj}. Boite 2 : {b} ${obj}. Total ?`,
      `Le jardinier plante {a} ${obj}, puis {b} de plus. Combien de plants ?`,
      `${actor} collectionne {a} ${obj} et en recoit {b}. Combien en a-t-${g.il} ?`,
      `Au tableau : {a} + {b} ${obj}. Quel est le resultat demande ?`,
      `File d’attente : {a} personnes, puis {b} arrivent. Combien de personnes ?`,
      `${place}, {a} ${obj} sont prets. On en prepare {b} de plus. Combien sont prets ?`,
      `${actor} range {a} ${obj} dans un bac et {b} dans un autre. Combien ranges ?`,
      `Matin {a} ${obj}, soir {b} ${obj} supplementaires. Combien sur la journee ?`,
      `Un sachet contient {a} ${obj}. Un second en contient {b}. Combien en tout ?`,
      `${actor} marque {a} points puis {b} points. Quel score total ?`,
      `Reserve A : {a} ${obj}. Reserve B : {b}. Combien dans les deux reserves ?`,
      `${place} on compte {a} ${obj}, puis on en trouve {b}. Combien compte-t-on ?`,
      `${actor} achete {a} ${obj} et en recoit {b} en cadeau. Combien possede-t-${g.il} ?`,
      `Debut du jeu : {a} ${obj}. Bonus : {b} ${obj}. Combien d’objets au total ?`,
    ]
  }
  if (level === 'moyen') {
    return [
      `${place}, l’equipe a deja {a} ${obj}. Elle en recoit {b}. Combien en a-t-elle ?`,
      `Durant la matinee : {a} ${obj}. L’apres-midi : {b} de plus. Quel est le cumul ?`,
      `${actor} possede {a} ${obj} et en achete {b} au magasin. Combien en tout ?`,
      `Inventaire : {a} ${obj} en rayon + {b} venus de la reserve. Combien en rayon ?`,
      `Commande de {a} ${obj}, puis complement de {b}. Combien ont ete commandes ?`,
      `Le club compte {a} ${obj}, puis encore {b}. Quel total obtient-on ?`,
      `${actor} range {a} ${obj} lundi et {b} mardi. Combien sur deux jours ?`,
      `Le depot part avec {a} ${obj}. Un camion apporte {b}. Combien le depot contient-il ?`,
      `Au stand : {a} ${obj} disponibles + {b} sortis des cartons. Combien de disponibles ?`,
      `Deux classes apportent {a} et {b} ${obj}. Combien reunissent-elles ?`,
      `${place}, on enregistre {a} ${obj} avant midi et {b} apres. Combien en tout ?`,
      `${actor} collecte {a} ${obj} le matin et ${verb} {b} l’apres-midi. Combien au total ?`,
      `Bilan hebdomadaire : {a} ${obj} la premiere moitie, {b} la seconde. Quel cumul ?`,
      `Le service a traite {a} dossiers puis {b} dossiers. Combien de dossiers traites ?`,
      `${actor} prepare {a} ${obj} pour le site nord et {b} pour le site sud. Combien prepares ?`,
      `Reception : {a} colis le matin, {b} l’apres-midi. Combien de colis recus ?`,
      `${place} : stock {a} ${obj}, reappro {b}. Combien apres reapprovisionnement ?`,
      `Tournoi : {a} points avant la pause, {b} apres. Quel score cumule ?`,
      `${actor} inscrit {a} participants puis {b} autres. Combien d’inscriptions ?`,
      `Atelier : {a} pieces terminees, puis {b} pieces. Combien de pieces terminees ?`,
      `La bibliotheque recoit {a} livres neufs et {b} dons. Combien de nouveaux livres ?`,
      `${place}, collecte : {a} ${obj} le samedi, {b} le dimanche. Combien collectes ?`,
      `${actor} ajoute {b} ${obj} a un lot de {a}. Quel est le nouveau lot ?`,
      `Production : {a} unites avant controle, {b} apres. Combien d’unites ?`,
      `Deux livraisons : {a} puis {b} ${obj}. Combien livres au total ?`,
      `Le magasin affiche {a} ventes le matin et {b} l’apres-midi. Combien de ventes ?`,
      `${actor} cumule {a} ${obj} en semaine et {b} le week-end. Combien au total ?`,
      `${place} : premiere seance {a} ${obj}, seconde seance {b}. Combien utilises ?`,
      `Compte rendu : {a} ${obj} deja comptes + {b} trouves ensuite. Quel total ?`,
      `${actor} fusionne un tas de {a} ${obj} avec un tas de {b}. Combien dans le tas final ?`,
      `Reserve centrale : {a} ${obj}. Annexe : +{b}. Combien dans le reseau ?`,
      `Evenement : {a} entrees avant 14 h, {b} apres. Combien d’entrees ?`,
      `${place}, chantier : {a} briques posees, puis {b}. Combien de briques posees ?`,
      `${actor} note {a} ${obj} au premier inventaire et {b} au second. Combien notes ?`,
      `Campagne : {a} tracts distribues le matin, {b} l’apres-midi. Combien au total ?`,
      `Deux rayons : {a} ${obj} et {b} ${obj}. Combien d’articles sur les rayons ?`,
      `${actor} recoit {a} ${obj} d’un partenaire et {b} d’un autre. Combien recoit-il ?`,
      `${place} : stock mort {a} reactive + {b} neufs. Combien disponibles ?`,
      `Semaine 1 : {a} ${obj}. Semaine 2 : {b}. Combien sur les deux semaines ?`,
      `${actor} assemble {a} modules puis {b} modules. Combien de modules ?`,
      `Depot glacial : {a} ${obj} deja stockes, livraison de {b}. Combien stockes ?`,
      `Club lecture : {a} livres lus, plus {b}. Combien de livres lus ?`,
      `${place}, laboratoire : {a} echantillons, puis {b}. Combien d’echantillons ?`,
      `${actor} valide {a} tickets puis {b} tickets. Combien de tickets valides ?`,
      `Matinee sportive : {a} medailles, apres-midi {b}. Combien de medailles ?`,
      `Deux ateliers produisent {a} et {b} ${obj}. Combien produits ensemble ?`,
      `${actor} cumule {a} ${obj} avant correction et {b} apres. Combien apres correction ?`,
      `${place} : premiere livraison {a}, seconde {b} ${obj}. Total livre ?`,
      `Bilan du mois : {a} ${obj} + {b} ${obj}. Quel est le total mensuel ?`,
      `${actor} consolide {a} ${obj} du lot A et {b} du lot B. Combien consolides ?`,
    ]
  }
  return [
    `Pour un projet scolaire, {a} ${obj} sont reserves le matin. L’apres-midi, on ajoute {b}. Combien au total ?`,
    `Une association collecte {a} ${obj}, puis recoit encore {b}. Quel total possede-t-elle ?`,
    `Un entrepot a classe {a} ${obj}. Une livraison de {b} arrive. Combien d’unites a classer ?`,
    `Un club compte {a} inscriptions, puis {b} nouvelles. Combien d’inscriptions y a-t-il ?`,
    `Une entreprise prepare {a} ${obj} lundi et {b} mardi. Combien ont ete prepares ?`,
    `Lors d’un salon, {a} visiteurs avant midi et {b} apres. Combien d’entrees ?`,
    `Un magasin vend {a} articles le matin et {b} l’apres-midi. Combien d’articles vendus ?`,
    `La ville plante {a} ${obj} dans un quartier et {b} dans un parc. Combien plantes ?`,
    `Un musee recoit {a} visiteurs en semaine et {b} le week-end. Combien de visiteurs ?`,
    `Une usine produit {a} pieces avant la pause et {b} apres. Combien de pieces ?`,
    `${place}, un service prepare {a} dossiers puis {b} dossiers supplements. Combien au total ?`,
    `${actor} coordonne {a} ${obj} pour le site A et {b} pour le site B. Combien en tout ?`,
    `Region nord : {a} ${obj} alloues. Region sud : {b}. Combien d’allocations ?`,
    `Trimestre 1 : {a} unites livrees. Trimestre 2 : {b}. Combien d’unites livrees ?`,
    `${actor} consolide {a} ${obj} d’un prestataire et {b} d’un second. Combien consolides ?`,
    `Plateforme logistique : {a} colis traites avant 12 h, {b} apres. Combien traites ?`,
    `Campagne nationale : {a} dons puis {b} dons supplementaires. Combien de dons ?`,
    `${place} : lot principal {a} ${obj}, lot complementaire {b}. Combien au total ?`,
    `Hopital de jour : {a} dossiers le matin, {b} l’apres-midi. Combien de dossiers ?`,
    `${actor} arbitre un total de {a} points puis {b} points de prolongations. Quel total ?`,
    `Marche public : {a} unites commandees, avenant de {b}. Combien d’unites ?`,
    `Federation : {a} licences actives + {b} nouvelles. Combien de licences ?`,
    `${place}, centre de tri : {a} colis, puis arrivage de {b}. Combien de colis ?`,
    `Bilan annuel partiel : {a} ${obj} au S1, {b} au S2. Combien sur l’annee ?`,
    `${actor} mutualise {a} ${obj} d’un service et {b} d’un autre. Combien mutualises ?`,
    `Chaine de production A : {a} pieces. Chaine B : {b}. Combien de pieces ?`,
    `Collectivite : {a} plants en zone urbaine, {b} en zone periurbaine. Combien plantes ?`,
    `${place} : volume initial {a} ${obj}, volume ajoute {b}. Quel volume total ?`,
    `Reseau scolaire : {a} cahiers au cycle 1, {b} au cycle 2. Combien de cahiers ?`,
    `${actor} agrege {a} mesures puis {b} mesures. Combien de mesures agregees ?`,
    `Entrepot regional : {a} palettes, puis {b} palettes. Combien de palettes ?`,
    `Salon professionnel : {a} badges matin, {b} apres-midi. Combien de badges ?`,
    `${place}, hub : {a} expeditions + {b} expeditions. Combien d’expeditions ?`,
    `Programme : {a} places pourvues, puis {b} places. Combien de places pourvues ?`,
    `${actor} consolide les stocks : {a} ${obj} puis {b}. Combien en stock consolide ?`,
    `Ligne budgétaire : {a} CHF deja engages + {b} CHF. Combien engages ?`,
    `Parc machines : {a} heures avant maintenance, {b} apres. Combien d’heures ?`,
    `${place} : flux entrant {a} ${obj} + {b}. Combien d’unites en entree ?`,
    `Consortium : partenaire A livre {a}, partenaire B livre {b} ${obj}. Total ?`,
    `${actor} synthonise {a} dossiers locaux et {b} dossiers centraux. Combien de dossiers ?`,
    `Centre d’appels : {a} appels traites, puis {b}. Combien d’appels traites ?`,
    `Plateforme e-commerce : {a} commandes matin, {b} soir. Combien de commandes ?`,
    `${place}, archive : {a} boites + {b} boites. Combien de boites archivees ?`,
    `Projet intercommunal : {a} ${obj} commune A + {b} commune B. Combien au projet ?`,
    `${actor} consolide un inventaire de {a} ${obj} avec un inventaire de {b}. Total ?`,
    `Semestre scolaire : {a} activites realisees + {b}. Combien d’activites ?`,
    `Usine 1 : {a} lots. Usine 2 : {b} lots. Combien de lots produits ?`,
    `${place} : premiere vague {a} ${obj}, seconde vague {b}. Combien au total ?`,
    `Observatoire : {a} observations puis {b}. Combien d’observations ?`,
    `${actor} finalise {a} ${obj} d’un chantier et {b} d’un second. Combien finalises ?`,
  ]
}

/* -------------------------------------------------------------------------- */
/* 50 frames soustraction                                                      */
/* -------------------------------------------------------------------------- */

function soustractionFrames(level, actor, obj, place, verb, g) {
  if (level === 'facile') {
    return [
      `${actor} a {a} ${obj}. ${g.Il} en ${verb} {b}. Combien lui en reste-t-il ?`,
      `Il y a {a} ${obj} ${place}. On en retire {b}. Combien en reste-t-il ?`,
      `Un panier contient {a} ${obj}. On en enleve {b}. Combien reste-t-il de ${obj} ?`,
      `${actor} devait garder {a} ${obj}, mais ${g.il} en ${verb} {b}. Combien reste-t-il ?`,
      `Au depart, {a} ${obj} sont prets. On en utilise {b}. Combien reste-t-il ?`,
      `La reserve affiche {a} ${obj}. On en sort {b}. Combien reste-t-il en reserve ?`,
      `${place}, {a} ${obj} sont alignes. ${actor} en retire {b}. Combien en reste-t-il ?`,
      `Un stock de {a} ${obj} diminue de {b}. Combien reste-t-il ?`,
      `${actor} partage : sur {a} ${obj}, ${g.il} en donne {b}. Combien lui en reste-t-il ?`,
      `Sur l’etagere, il y avait {a} ${obj}. On en a vendu {b}. Combien en reste-t-il ?`,
      `${actor} enleve {b} ${obj} d’un tas de {a}. Combien restent sur le tas ?`,
      `Avant le jeu : {a} ${obj}. Apres avoir perdu {b} : combien reste-t-il ?`,
      `${actor} possede {a} ${obj} et en prete {b}. Combien lui en reste-t-il ?`,
      `Boite pleine : {a} ${obj}. On en tire {b}. Combien restent dans la boite ?`,
      `${place} : {a} ${obj} disponibles, {b} pris. Combien restent disponibles ?`,
      `Compte : {a} moins {b} ${obj}. Quel reste obtient-on ?`,
      `${actor} casse {b} ${obj} sur un total de {a}. Combien restent intacts ?`,
      `File : {a} personnes, {b} partent. Combien restent dans la file ?`,
      `Le sachet avait {a} ${obj}. Il en manque {b}. Combien reste-t-il ?`,
      `${actor} mange {b} ${obj} parmi {a}. Combien lui en reste-t-il ?`,
      `Depart {a} ${obj}, perte de {b}. Combien reste-t-il ?`,
      `${place}, on comptait {a} ${obj}. On en retire {b} abimes. Combien restent bons ?`,
      `${actor} offre {b} de ses {a} ${obj}. Combien lui en reste-t-il ?`,
      `Pile de {a} ${obj}. On en enleve {b}. Quelle hauteur reste (en nombre) ?`,
      `Au club : {a} ballons, {b} creves. Combien de ballons restent ?`,
      `${actor} utilise {b} crayons sur {a}. Combien de crayons restent ?`,
      `Reserve scolaire : {a} cahiers, {b} distribues. Combien restent en reserve ?`,
      `${place} : debut {a} ${obj}, sortie de {b}. Combien a la fin ?`,
      `${actor} jette {b} ${obj} hors d’un lot de {a}. Combien restent ?`,
      `Tableau : {a} − {b}. Combien reste-t-il de ${obj} ?`,
      `Corbeille : {a} ${obj}, on en retire {b}. Combien dans la corbeille ?`,
      `${actor} envoie {b} messages sur un quota de {a}. Combien de messages restent ?`,
      `Stock magasin : {a} articles, ventes {b}. Combien restent en stock ?`,
      `${place}, {a} tickets, {b} utilises. Combien de tickets restent ?`,
      `${actor} retire {b} cartes d’un jeu de {a}. Combien de cartes restent ?`,
      `Avant : {a} ${obj}. Apres retrait de {b} : combien ?`,
      `Le panier part avec {a} ${obj}. On en mange {b}. Combien restent ?`,
      `${actor} prete {b} livres parmi {a}. Combien lui en reste-t-il ?`,
      `Bac : {a} ${obj}. On en sort {b} pour l’atelier. Combien restent dans le bac ?`,
      `${place} : {a} places libres, {b} prises. Combien de places restent libres ?`,
      `${actor} perd {b} points alors qu’${g.il} en avait {a}. Combien de points reste-t-il ?`,
      `Lot de {a} ${obj}, defaut sur {b}. Combien restent conformes ?`,
      `Depart course : {a} coureurs, {b} abandonnent. Combien restent en course ?`,
      `${actor} distribue {b} ${obj} depuis un stock de {a}. Combien reste-t-il ?`,
      `${place}, inventaire {a} ${obj} moins {b} manquants. Combien trouves ?`,
      `Boite A avait {a} ${obj}. On en deplace {b}. Combien restent dans A ?`,
      `${actor} coupe {b} fleurs d’un bouquet de {a}. Combien restent au bouquet ?`,
      `Compte a rebours : {a} ${obj}, on en retire {b}. Combien reste-t-il ?`,
      `${place} : {a} ${obj} affiches, {b} retires. Combien restent affiches ?`,
      `${actor} solde {b} ${obj} sur un stock de {a}. Combien restent a vendre ?`,
    ]
  }
  if (level === 'moyen') {
    return [
      `${place}, l’equipe dispose de {a} ${obj}. Apres distribution, {b} ont ete donnes. Combien en reste-t-il ?`,
      `${actor} commence avec {a} ${obj}. Avant midi, ${g.il} en ${verb} {b}. Combien lui en reste-t-il ?`,
      `Inventaire : {a} ${obj}. On retire {b} abimes. Combien restent utilisables ?`,
      `La billetterie avait {a} tickets. Elle en vend {b}. Combien de tickets reste-t-il ?`,
      `Un depot part avec {a} ${obj}. Un client en commande {b}. Combien conserve-t-il ?`,
      `${actor} avait {a} points. ${g.Il} en perd {b} au second tour. Quel score reste-t-il ?`,
      `Pour le tournoi, {a} ballons etaient prevus. {b} se degonflent. Combien restent utilisables ?`,
      `Bibliotheque : {a} livres, dont {b} sortent en pret. Combien restent sur place ?`,
      `Au stand, {a} ${obj} exposes. On en retire {b} pour un autre stand. Combien restent ?`,
      `Entre deux controles, le compte baisse de {b} a partir de {a} ${obj}. Combien reste-t-il ?`,
      `${place}, {a} ${obj} sont reserves. On en annule {b}. Combien de reservations restent ?`,
      `${actor} calcule un reste : {a} ${obj} moins {b} utilises. Combien reste-t-il ?`,
      `Service apres-vente : {a} dossiers, {b} clos. Combien restent ouverts ?`,
      `Stock saisonnier : {a} ${obj}, soldes de {b}. Combien restent hors solde ?`,
      `${actor} transferait {b} ${obj} depuis un lot de {a}. Combien restent sur place ?`,
      `${place} : effectif {a}, absences {b}. Combien de presents ?`,
      `Atelier : {a} pieces lancees, {b} rebuts. Combien de pieces bonnes ?`,
      `Campagne : {a} tracts, {b} deja distribues. Combien restent a distribuer ?`,
      `${actor} archive {b} dossiers parmi {a}. Combien restent actifs ?`,
      `Magasin : {a} articles en rayon, {b} retires pour inventaire. Combien restent en rayon ?`,
      `${place}, parking : {a} places, {b} occupees. Combien de places libres ?`,
      `Club : {a} membres, {b} desinscriptions. Combien de membres restent ?`,
      `${actor} consomme {b} unites d’un budget de {a}. Combien restent disponibles ?`,
      `Livraison incomplete : {a} prevus, {b} manquants. Combien sont arrives ?`,
      `Reserve froide : {a} ${obj}, sortie de {b}. Combien restent en reserve ?`,
      `${place} : {a} badges imprimes, {b} distribues a l’ouverture. Combien restent ?`,
      `${actor} corrige : total {a} ${obj}, erreurs {b}. Combien restent corrects ?`,
      `Tournoi : {a} equipes engagees, {b} forfaits. Combien d’equipes restent ?`,
      `Depot : {a} colis, expedition de {b}. Combien de colis restent au depot ?`,
      `${place}, chantier : {a} briques, {b} utilisees. Combien restent disponibles ?`,
      `${actor} preleve {b} echantillons sur {a}. Combien restent non preleves ?`,
      `Caisse : {a} CHF, depense de {b} CHF. Combien reste-t-il en caisse ?`,
      `File d’attente : {a} dossiers, {b} traites. Combien restent en attente ?`,
      `${place} : stock tampon {a} ${obj}, Ponction de {b}. Combien restent ?`,
      `${actor} solde {b} articles d’un inventaire de {a}. Combien restent au tarif normal ?`,
      `Semaine : {a} heures prevues, {b} annulees. Combien d’heures restent ?`,
      `Labo : {a} tubes, {b} utilises. Combien de tubes restent ?`,
      `${actor} retire {b} photos d’un album de {a}. Combien de photos restent ?`,
      `${place}, vestiaire : {a} casiers, {b} attribues. Combien restent libres ?`,
      `Production : {a} lots, {b} non conformes. Combien de lots conformes ?`,
      `${actor} decompte {b} ${obj} d’un total de {a}. Quel reste affiche-t-${g.il} ?`,
      `Evenement : {a} places, {b} annulations. Combien de places restent reservees ?`,
      `Rayon : {a} ${obj}, retrait de {b} pour promo. Combien restent au rayon ?`,
      `${place} : {a} plants, {b} deja plantes ailleurs. Combien restent a planter ici ?`,
      `${actor} clôture {b} tickets sur {a}. Combien de tickets restent ouverts ?`,
      `Bus : {a} places, {b} passagers. Combien de places restent libres ?`,
      `Entrepot : {a} palettes, expedition de {b}. Combien de palettes restent ?`,
      `${place}, salle : {a} chaises, {b} sorties. Combien de chaises restent ?`,
      `${actor} soustrait {b} de {a} ${obj} pour un inventaire. Combien reste-t-il ?`,
      `Bilan : {a} ${obj} initialement, sortie nette de {b}. Combien en stock final ?`,
    ]
  }
  return [
    `Un cinema avait prevu {a} places. Apres annulations, {b} ne sont plus reservees. Combien restent reservees ?`,
    `Une association possede {a} CHF. Elle depense {b} CHF en materiel. Quelle somme reste-t-il ?`,
    `La reserve compte {a} ${obj}. Elle en transfert {b} vers les classes. Combien restent en reserve ?`,
    `Un club avait {a} ballons. Apres un match, {b} sont abimes. Combien restent utilisables ?`,
    `Une entreprise doit livrer {a} colis. Elle en livre {b} le matin. Combien reste-t-il a livrer ?`,
    `Lors d’un salon, {a} badges sont imprimes. On en distribue {b} a l’ouverture. Combien restent-ils ?`,
    `Un magasin avait {a} articles en rayon. Il en vend {b}. Combien restent en rayon ?`,
    `Une ville dispose de {a} plants. Elle en utilise {b} dans un quartier. Combien restent disponibles ?`,
    `Un entrepot contient {a} cahiers. Une ecole en commande {b}. Combien restent dans l’entrepot ?`,
    `Une course comptait {a} inscrits. Avant le depart, {b} se desistent. Combien restent inscrits ?`,
    `${place}, un service avait {a} dossiers. Il en archive {b}. Combien restent actifs ?`,
    `${actor} gere {a} ${obj} au site principal et en deplace {b} vers l’annexe. Combien restent au site principal ?`,
    `Plateforme : {a} commandes ouvertes, {b} expediees. Combien restent a traiter ?`,
    `Hopital : {a} lits, {b} occupes. Combien de lits restent disponibles ?`,
    `Federation : {a} licences, {b} non renouvelees. Combien de licences actives restent ?`,
    `${place} : volume {a} ${obj}, sortie logistique de {b}. Combien restent sur site ?`,
    `${actor} arbitre un budget de {a} CHF moins {b} CHF engages. Combien restent disponibles ?`,
    `Usine : {a} pieces lancees, {b} ecartees au controle. Combien restent validées ?`,
    `Collectivite : {a} places en crèche, {b} attribuees. Combien restent vacantes ?`,
    `Reseau : {a} tickets support, {b} resolus. Combien de tickets restent ouverts ?`,
    `${place}, hub : {a} expeditions planifiees, {b} annulees. Combien restent planifiees ?`,
    `Marche public : {a} unites, avenant reduisant de {b}. Combien d’unites restent ?`,
    `${actor} consolide : stock {a} ${obj} moins transfert de {b}. Combien en stock local ?`,
    `Semestre : {a} heures allouees, {b} consommees. Combien d’heures restent ?`,
    `Entrepot regional : {a} palettes, {b} expediees. Combien de palettes restent ?`,
    `${place} : effectif projet {a}, {b} reaffectes. Combien restent sur le projet ?`,
    `Observatoire : {a} alertes, {b} cloturees. Combien d’alertes restent actives ?`,
    `${actor} decommissionne {b} modules sur un parc de {a}. Combien restent en service ?`,
    `Centre d’appels : {a} dossiers, {b} traites. Combien restent en file ?`,
    `Programme : {a} places, {b} desistements. Combien de places restent pourvues ?`,
    `${place}, archive : {a} boites, {b} transferees. Combien de boites restent ?`,
    `Consortium : stock partage {a} ${obj}, retrait partenaire de {b}. Combien restent ?`,
    `${actor} solde un inventaire de {a} ${obj} apres sortie de {b}. Combien restent ?`,
    `Ligne : {a} CHF budgetes, {b} CHF depenses. Combien restent sur la ligne ?`,
    `Parc : {a} heures machine, {b} heures de panne. Combien d’heures utiles restent ?`,
    `${place} : flux {a} ${obj}, extraction de {b}. Combien restent en flux ?`,
    `Salon : {a} badges, {b} invalides. Combien de badges restent valides ?`,
    `${actor} retranche {b} mesures d’un jeu de {a}. Combien de mesures restent ?`,
    `Usines : production cible {a}, rebuts {b}. Combien d’unites restent bonnes ?`,
    `Intercommunal : {a} ${obj} alloues, {b} reaffectes. Combien restent alloues ?`,
    `${place} : premiere dotation {a} ${obj} moins {b} consommes. Combien restent ?`,
    `Plateforme : {a} missions, {b} annulees. Combien de missions restent ?`,
    `${actor} clôture {b} dossiers sur {a}. Combien de dossiers restent ouverts ?`,
    `Region : {a} kits, distribution de {b}. Combien de kits restent en region ?`,
    `Chaine : {a} lots, {b} bloques. Combien de lots restent liberables ?`,
    `${place}, labo central : {a} echantillons, {b} analyses. Combien restent en attente ?`,
    `${actor} majore un reste : {a} ${obj} moins {b} sortis. Combien reste-t-il ?`,
    `Campagne : {a} contacts, {b} injoignables. Combien de contacts restent joignables ?`,
    `Entrepot tampon : {a} ${obj}, ponction de {b}. Combien restent en tampon ?`,
    `${actor} finalise un inventaire : {a} moins {b} ${obj}. Combien finalises en stock ?`,
  ]
}

/* -------------------------------------------------------------------------- */
/* 50 frames multiplication                                                    */
/* -------------------------------------------------------------------------- */

function mulSingular(group) {
  if (group.endsWith('ies')) return `${group.slice(0, -3)}y`
  if (group.endsWith('s')) return group.slice(0, -1)
  return group
}

function multiplicationFrames(level, actor, group, unit, place) {
  const g1 = mulSingular(group)
  if (level === 'facile') {
    return [
      `Chaque ${g1} contient {a} ${unit}. Combien y a-t-il de ${unit} dans {b} ${group} ?`,
      `${actor} prepare {b} ${group} de {a} ${unit}. Combien de ${unit} cela fait-il ?`,
      `${place}, on aligne {b} rangees de {a} ${unit}. Combien de ${unit} au total ?`,
      `Un carton renferme {a} ${unit}. Combien dans {b} cartons identiques ?`,
      `${actor} achete {b} paquets. Chaque paquet a {a} ${unit}. Combien de ${unit} ?`,
      `Il y a {b} ${group}. Dans chacune : {a} ${unit}. Quel est le total ?`,
      `Pour {b} eleves, on donne {a} ${unit} a chacun. Combien de ${unit} faut-il ?`,
      `${actor} construit {b} tours de {a} cubes. Combien de cubes utilise-t-il ?`,
      `${place} : {b} boites × {a} ${unit}. Combien de ${unit} ?`,
      `${actor} remplit {b} sacs avec {a} ${unit} chacun. Combien de ${unit} en tout ?`,
      `On range {b} tiroirs de {a} ${unit}. Combien de ${unit} ranges ?`,
      `${actor} compte {b} lignes de {a} ${unit}. Combien de ${unit} ?`,
      `Table : {b} assiettes avec {a} ${unit} chacune. Combien de ${unit} ?`,
      `${place}, {b} cageots de {a} ${unit}. Combien au total ?`,
      `${actor} pose {b} etageres de {a} ${unit}. Combien de ${unit} ?`,
      `Classe : {b} eleves × {a} ${unit}. Combien de ${unit} distribues ?`,
      `Jardin : {b} rangees de {a} plants. Combien de plants ?`,
      `${actor} fabrique {b} boites de {a} ${unit}. Combien de ${unit} fabriques ?`,
      `${place} : {b} paniers de {a} ${unit}. Combien de ${unit} ?`,
      `Rayon : {b} casiers de {a} ${unit}. Combien de ${unit} en rayon ?`,
      `${actor} aligne {b} files de {a} ${unit}. Combien de ${unit} alignes ?`,
      `Bus : {b} rangees de {a} sieges. Combien de sieges ?`,
      `Atelier : {b} plateaux de {a} ${unit}. Combien de ${unit} ?`,
      `${actor} remplit {b} albums de {a} ${unit}. Combien de ${unit} ?`,
      `${place}, {b} stands avec {a} ${unit} chacun. Combien de ${unit} ?`,
      `Ecole : {b} classes de {a} eleves. Combien d’eleves ?`,
      `${actor} prepare {b} bouquets de {a} fleurs. Combien de fleurs ?`,
      `Magasin : {b} cartons de {a} ${unit}. Combien de ${unit} ?`,
      `Parking : {b} rangees de {a} places. Combien de places ?`,
      `${actor} compte {b} paquets de {a} ${unit}. Combien de ${unit} ?`,
      `${place} : {b} bacs de {a} ${unit}. Combien de ${unit} ?`,
      `Ferme : {b} cages de {a} animaux. Combien d’animaux ?`,
      `${actor} range {b} boites de {a} ${unit} chacune. Combien au total ?`,
      `Cantine : {b} plateaux de {a} verres. Combien de verres ?`,
      `Bibliotheque : {b} etageres de {a} livres. Combien de livres ?`,
      `${actor} cree {b} piles de {a} ${unit}. Combien de ${unit} ?`,
      `${place}, {b} sacs de {a} ${unit}. Combien de ${unit} transportes ?`,
      `Jeu : {b} equipes de {a} joueurs. Combien de joueurs ?`,
      `${actor} imprime {b} pages de {a} photos. Combien de photos ?`,
      `Depot : {b} cartons de {a} ${unit}. Combien de ${unit} en depot ?`,
      `Marche : {b} cageots de {a} fruits. Combien de fruits ?`,
      `${place} : {b} tables de {a} ${unit}. Combien de ${unit} ?`,
      `${actor} forme {b} groupes de {a} enfants. Combien d’enfants ?`,
      `Sport : {b} equipes de {a} joueurs. Combien d’athletes ?`,
      `Labo : {b} plateaux de {a} tubes. Combien de tubes ?`,
      `${actor} emballe {b} sachets de {a} ${unit}. Combien de ${unit} ?`,
      `${place}, {b} casiers de {a} ${unit}. Combien de ${unit} ?`,
      `Expo : {b} panneaux de {a} photos. Combien de photos ?`,
      `${actor} calcule {b} × {a} ${unit}. Combien de ${unit} obtient-on ?`,
      `Recette : {b} moules de {a} ${unit}. Combien de ${unit} faut-il ?`,
    ]
  }
  if (level === 'moyen') {
    return [
      `${place}, on commande {b} ${group} contenant chacune {a} ${unit}. Combien de ${unit} ?`,
      `${actor} organise {b} equipes de {a} joueurs. Combien de joueurs participent ?`,
      `Livraison : {b} cageots de {a} ${unit}. Combien de ${unit} sont livres ?`,
      `Parking : {b} rangees de {a} places. Combien de places y a-t-il ?`,
      `${actor} imprime {b} planches de {a} photos. Combien de photos ?`,
      `Atelier : {b} plateaux de {a} pieces. Combien de pieces au total ?`,
      `Ecole : achat de {b} boites de {a} feutres. Combien de feutres ?`,
      `${actor} remplit {b} albums avec {a} timbres par album. Combien de timbres ?`,
      `${place}, {b} stands exposent {a} ${unit} chacun. Combien de ${unit} ?`,
      `${actor} prevoyait {b} semaines a {a} seances. Combien de seances ?`,
      `Commande club : {b} cartons de {a} ${unit}. Combien de ${unit} commandes ?`,
      `Stage : {b} groupes de {a} participants. Combien de participants ?`,
      `${place} : {b} files de {a} visiteurs. Combien de visiteurs ?`,
      `${actor} planifie {b} ateliers de {a} eleves. Combien d’eleves ?`,
      `Production : {b} lots de {a} ${unit}. Combien de ${unit} produits ?`,
      `Bibliotheque : {b} bacs de {a} livres. Combien de livres ?`,
      `Festival : {b} stands × {a} brochures. Combien de brochures ?`,
      `${actor} reserve {b} tables de {a} couverts. Combien de couverts ?`,
      `${place}, logistique : {b} palettes de {a} ${unit}. Combien de ${unit} ?`,
      `Camp : {b} tentes de {a} places. Combien de places ?`,
      `${actor} calcule {b} semaines × {a} ${unit} par semaine. Combien au total ?`,
      `Magasin : {b} rayons de {a} articles. Combien d’articles ?`,
      `Gymnase : {b} rangees de {a} bancs. Combien de bancs ?`,
      `${place} : {b} classes × {a} cahiers. Combien de cahiers ?`,
      `${actor} prepare {b} kits de {a} ${unit}. Combien de ${unit} prepares ?`,
      `Usine : {b} cartons de {a} pieces. Combien de pieces ?`,
      `Marche : {b} etals de {a} ${unit}. Combien de ${unit} ?`,
      `${actor} forme {b} binomes de {a} roles (total personnes). Combien de personnes ?`,
      `${place}, depot : {b} casiers de {a} ${unit}. Combien de ${unit} ?`,
      `Club photo : {b} albums de {a} cliches. Combien de cliches ?`,
      `${actor} emballe {b} colis de {a} ${unit}. Combien de ${unit} emballes ?`,
      `Cantine : {b} services de {a} plateaux. Combien de plateaux ?`,
      `Jardinage : {b} planches de {a} plants. Combien de plants ?`,
      `${place} : {b} wagons de {a} passagers. Combien de passagers ?`,
      `${actor} compte {b} immeubles de {a} appartements. Combien d’appartements ?`,
      `Labo : {b} grilles de {a} echantillons. Combien d’echantillons ?`,
      `Sport : {b} poules de {a} equipes. Combien d’equipes ?`,
      `${actor} commande {b} packs de {a} ${unit}. Combien de ${unit} ?`,
      `${place}, atelier : {b} bacs de {a} ${unit}. Combien de ${unit} ?`,
      `Expo : {b} salles de {a} oeuvres. Combien d’oeuvres ?`,
      `Transport : {b} camions de {a} cartons. Combien de cartons ?`,
      `${actor} organise {b} sessions de {a} places. Combien de places ?`,
      `Ecole : {b} casiers de {a} cahiers. Combien de cahiers ?`,
      `${place} : {b} ruches de {a} cadres. Combien de cadres ?`,
      `${actor} calcule {b} × {a} pour un inventaire de ${unit}. Quel total ?`,
      `Reservation : {b} salles de {a} sieges. Combien de sieges ?`,
      `Collecte : {b} sacs de {a} ${unit}. Combien de ${unit} collectes ?`,
      `${place}, production : {b} series de {a} ${unit}. Combien de ${unit} ?`,
      `${actor} prevoyait {b} jours a {a} ${unit} par jour. Combien de ${unit} ?`,
      `Bilan : {b} equipes × {a} ${unit}. Combien de ${unit} au bilan ?`,
    ]
  }
  return [
    `Tournoi ${place} : {b} equipes de {a} joueurs. Combien d’athletes ?`,
    `Usine : {b} cartons de {a} pieces. Combien de pieces emballees ?`,
    `${actor} gere {b} immeubles de {a} appartements. Combien d’appartements ?`,
    `Depot : {b} palettes de {a} ${unit}. Combien de ${unit} partent ?`,
    `Commande scolaire : {b} classes × {a} cahiers. Combien de cahiers ?`,
    `${actor} planifie {b} semaines × {a} seances. Combien de seances au total ?`,
    `Festival : {b} stands × {a} brochures. Combien de brochures a imprimer ?`,
    `Production du mois : {b} lots de {a} unites. Quelle production totale ?`,
    `${place}, logistique : {b} tours de livraison × {a} colis. Combien de colis ?`,
    `${actor} calcule {b} sites × {a} ${unit} par site. Combien de ${unit} faut-il ?`,
    `Region : {b} centres de {a} places. Combien de places regionales ?`,
    `Consortium : {b} partenaires × {a} ${unit}. Combien de ${unit} ?`,
    `${place} : {b} hubs de {a} expeditions. Combien d’expeditions ?`,
    `${actor} dimensionne {b} lignes de {a} postes. Combien de postes ?`,
    `Hopital : {b} unites de {a} lits. Combien de lits ?`,
    `Federation : {b} clubs de {a} licences. Combien de licences ?`,
    `Plateforme : {b} serveurs de {a} instances. Combien d’instances ?`,
    `${place}, usine : {b} chaines de {a} postes. Combien de postes ?`,
    `${actor} alloue {b} budgets de {a} unites. Combien d’unites allouees ?`,
    `Salon : {b} halls de {a} stands. Combien de stands ?`,
    `Reseau scolaire : {b} etablissements × {a} eleves. Combien d’eleves ?`,
    `Campagne : {b} regions × {a} kits. Combien de kits ?`,
    `${place} : {b} entrepots de {a} palettes. Combien de palettes ?`,
    `${actor} consolide {b} sites × {a} ${unit}. Combien de ${unit} ?`,
    `Marche public : {b} lots de {a} unites. Combien d’unites ?`,
    `Observatoire : {b} stations de {a} capteurs. Combien de capteurs ?`,
    `Transport : {b} convois de {a} wagons. Combien de wagons ?`,
    `${place}, archive : {b} salles de {a} boites. Combien de boites ?`,
    `${actor} planifie {b} vagues de {a} participants. Combien de participants ?`,
    `Production annuelle : {b} trimestres × {a} lots. Combien de lots ?`,
    `Centre : {b} batiments de {a} salles. Combien de salles ?`,
    `Logistique : {b} tours × {a} ${unit}. Combien de ${unit} ?`,
    `${place} : {b} zones de {a} emplacements. Combien d’emplacements ?`,
    `${actor} evalue {b} portefeuilles de {a} dossiers. Combien de dossiers ?`,
    `Usines : {b} sites de {a} machines. Combien de machines ?`,
    `Evenement : {b} sessions de {a} places. Combien de places ?`,
    `Collectivite : {b} quartiers × {a} plants. Combien de plants ?`,
    `${place}, labo : {b} plateformes de {a} tests. Combien de tests ?`,
    `${actor} mutualise {b} services × {a} ${unit}. Combien de ${unit} ?`,
    `Programme : {b} cohortes de {a} eleves. Combien d’eleves ?`,
    `Depot national : {b} allees de {a} palettes. Combien de palettes ?`,
    `Reseau : {b} noeuds de {a} connexions. Combien de connexions ?`,
    `${place} : {b} modules de {a} ${unit}. Combien de ${unit} ?`,
    `${actor} dimensionne {b} equipes de {a} agents. Combien d’agents ?`,
    `Campagne nationale : {b} vagues × {a} contacts. Combien de contacts ?`,
    `Infrastructure : {b} blocs de {a} unites. Combien d’unites ?`,
    `Plateforme e-com : {b} entrepots × {a} commandes. Combien de commandes ?`,
    `${place}, projet : {b} lots de {a} ${unit}. Combien de ${unit} ?`,
    `${actor} finalise {b} sites × {a} ${unit} par site. Combien au total ?`,
    `Bilan industriel : {b} lignes × {a} pieces. Combien de pieces ?`,
  ]
}

/* -------------------------------------------------------------------------- */
/* 50 frames division                                                          */
/* -------------------------------------------------------------------------- */

function divisionFrames(level, actor, totalName, perName, place) {
  if (level === 'facile') {
    return [
      `On partage {a} ${totalName} entre {b} ${perName}, equitablement. Combien chacun recoit-il ?`,
      `${actor} range {a} ${totalName} par groupes de {b}. Combien de groupes complets ?`,
      `Il y a {a} ${totalName} a repartir dans des boites de {b}. Combien de boites faut-il ?`,
      `${place}, {a} ${totalName} sont mis en paquets de {b}. Combien de paquets complets ?`,
      `On distribue {a} ${totalName} a {b} eleves egalement. Combien chacun en a-t-il ?`,
      `${actor} forme des piles de {b} avec {a} ${totalName}. Combien de piles completes ?`,
      `On emballe {a} ${totalName} dans des cartons de {b}. Combien de cartons complets ?`,
      `Sur {a} ${totalName}, on fait des lots de {b}. Combien de lots complets ?`,
      `${place} : partager {a} ${totalName} en {b} parts egales. Combien par part ?`,
      `${actor} divise {a} ${totalName} en groupes de {b}. Combien de groupes ?`,
      `Repartir {a} ${totalName} dans {b} paniers egaux. Combien par panier ?`,
      `${actor} met {a} ${totalName} en sachets de {b}. Combien de sachets ?`,
      `${place}, {a} ${totalName} en rangees de {b}. Combien de rangees completes ?`,
      `Partage equitable : {a} ${totalName} pour {b} enfants. Combien chacun ?`,
      `${actor} compte combien de boites de {b} dans {a} ${totalName}. Combien de boites ?`,
      `On range {a} ${totalName} par paquets de {b}. Combien de paquets ?`,
      `Classe : {a} ${totalName} divises en {b} groupes. Combien par groupe ?`,
      `${place} : {a} ${totalName} en files de {b}. Combien de files ?`,
      `${actor} forme des equipes de {b} avec {a} ${totalName}. Combien d’equipes ?`,
      `Cartons de {b} : combien pour ranger {a} ${totalName} ?`,
      `On coupe {a} ${totalName} en parts de {b}. Combien de parts completes ?`,
      `${actor} repartit {a} ${totalName} entre {b} casiers. Combien par casier ?`,
      `${place}, lots de {b} a partir de {a} ${totalName}. Combien de lots ?`,
      `Piles de {b} ${totalName} : combien avec {a} ?`,
      `${actor} partage {a} ${totalName} en {b} parts. Combien dans chaque part ?`,
      `Boites de {b} pour {a} ${totalName}. Combien de boites completes ?`,
      `Groupes de {b} eleves parmi {a} ${totalName}. Combien de groupes ?`,
      `${place} : distribution de {a} ${totalName} a {b} tables. Combien par table ?`,
      `${actor} calcule {a} ÷ {b} pour des ${totalName}. Quel quotient ?`,
      `Sacs de {b} : combien pour {a} ${totalName} ?`,
      `On aligne {a} ${totalName} par {b}. Combien d’alignements complets ?`,
      `${actor} met {a} ${totalName} en tiroirs de {b}. Combien de tiroirs ?`,
      `${place}, {a} ${totalName} partages par {b}. Combien chacun recoit-il ?`,
      `Paquets de {b} ${totalName} : nombre de paquets dans {a} ?`,
      `${actor} range {a} ${totalName} en bacs de {b}. Combien de bacs ?`,
      `Eleves : {a} ${totalName} pour {b} classes egales. Combien par classe ?`,
      `${place} : {a} ${totalName} en paniers de {b}. Combien de paniers ?`,
      `${actor} divise {a} ${totalName} par {b}. Combien obtient-${actor === 'Lina' ? 'elle' : 'il'} ?`,
      `Lots egaux de {b} a partir de {a} ${totalName}. Combien de lots ?`,
      `On forme {b} equipes avec {a} ${totalName} au total. Combien par equipe ?`,
      `${place}, conditionner {a} ${totalName} par {b}. Combien de conditionnements ?`,
      `${actor} compte les groupes de {b} dans {a} ${totalName}. Combien de groupes ?`,
      `Partage : {a} ${totalName} ÷ {b}. Combien par personne ?`,
      `Cartons fills de {b} : combien avec {a} ${totalName} ?`,
      `${actor} prepare des piles de {b} ${totalName} (total {a}). Combien de piles ?`,
      `${place} : {a} ${totalName} en {b} parts egales. Combien dans une part ?`,
      `Rayons de {b} : combien pour {a} ${totalName} ?`,
      `${actor} emballe {a} ${totalName} par paquets de {b}. Combien de paquets ?`,
      `Distribution egale de {a} ${totalName} a {b} eleves. Combien chacun ?`,
      `Combien de groupes de {b} dans {a} ${totalName} ${place} ?`,
    ]
  }
  if (level === 'moyen') {
    return [
      `${place}, ranger {a} ${totalName} dans des casiers de {b}. Combien de casiers complets ?`,
      `${actor} organise {a} ${totalName} en equipes de {b}. Combien d’equipes completes ?`,
      `Livraison de {a} ${totalName} separee en colis de {b}. Combien de colis complets ?`,
      `Le club repartit {a} ${totalName} entre {b} sections egalement. Combien par section ?`,
      `Atelier : {a} ${totalName} partages par groupes de {b} eleves. Combien de groupes ?`,
      `${actor} calcule les boites de {b} a remplir avec {a} ${totalName}. Combien de boites ?`,
      `Depot : {a} ${totalName} en files de {b}. Combien de files completes ?`,
      `Ecole : {a} ${totalName} divises en classes de {b}. Combien de classes completes ?`,
      `${place}, conditionnement de {a} ${totalName} par {b}. Combien de conditionnements ?`,
      `${actor} ventile {a} ${totalName} en rayons de {b}. Combien de rayons complets ?`,
      `Stage : {a} ${totalName} en ateliers de {b}. Combien d’ateliers ?`,
      `Magasin : {a} ${totalName} en lots promo de {b}. Combien de lots ?`,
      `${place} : repartition de {a} ${totalName} sur {b} stands. Combien par stand ?`,
      `${actor} planifie des tours de {b} avec {a} ${totalName}. Combien de tours ?`,
      `Cantine : {a} ${totalName} pour {b} services egaux. Combien par service ?`,
      `Bibliotheque : {a} ${totalName} en bacs de {b}. Combien de bacs ?`,
      `Festival : {a} ${totalName} entre {b} zones. Combien par zone ?`,
      `${actor} constitue des packs de {b} a partir de {a} ${totalName}. Combien de packs ?`,
      `${place}, logistique : {a} ${totalName} en palettes de {b}. Combien de palettes ?`,
      `Club : {a} ${totalName} divises en {b} equipes. Combien par equipe ?`,
      `${actor} etale {a} ${totalName} sur {b} etageres egales. Combien par etagere ?`,
      `Production : {a} ${totalName} en series de {b}. Combien de series ?`,
      `Gymnase : {a} ${totalName} en rangees de {b}. Combien de rangees ?`,
      `${place} : {a} ${totalName} pour {b} classes. Combien par classe ?`,
      `${actor} calcule le nombre de sachets de {b} dans {a} ${totalName}. Combien ?`,
      `Entrepot : {a} ${totalName} en cartons de {b}. Combien de cartons ?`,
      `Marche : {a} ${totalName} en cageots de {b}. Combien de cageots ?`,
      `${actor} repartit {a} ${totalName} entre {b} binomes. Combien par binome ?`,
      `${place}, atelier : {a} ${totalName} en plateaux de {b}. Combien de plateaux ?`,
      `Expo : {a} ${totalName} en salles de {b}. Combien de salles completes ?`,
      `Transport : {a} ${totalName} en camions de {b}. Combien de camions ?`,
      `${actor} organise {a} ${totalName} en sessions de {b}. Combien de sessions ?`,
      `Ecole : {a} ${totalName} en casiers de {b}. Combien de casiers ?`,
      `${place} : {a} ${totalName} en ruches/groupes de {b}. Combien de groupes ?`,
      `${actor} verifie {a} ÷ {b} sur inventaire de ${totalName}. Quel quotient ?`,
      `Reservation : {a} ${totalName} en salles de {b} places. Combien de salles ?`,
      `Collecte : {a} ${totalName} en sacs de {b}. Combien de sacs ?`,
      `${place}, production : {a} ${totalName} en lots de {b}. Combien de lots ?`,
      `${actor} decoupe la commande : {a} ${totalName} par paquets de {b}. Combien ?`,
      `Bilan : {a} ${totalName} repartis en {b} centres. Combien par centre ?`,
      `Labo : {a} ${totalName} en grilles de {b}. Combien de grilles ?`,
      `Sport : {a} ${totalName} en poules de {b}. Combien de poules ?`,
      `${actor} conditionne {a} ${totalName} par {b}. Combien de conditionnements ?`,
      `${place} : ventilation de {a} ${totalName} en {b} rayons. Combien par rayon ?`,
      `Depot froid : {a} ${totalName} en bacs de {b}. Combien de bacs ?`,
      `${actor} forme des cohorts de {b} avec {a} ${totalName}. Combien de cohorts ?`,
      `Centre : {a} ${totalName} en batiments de {b}. Combien de batiments ?`,
      `${place}, projet : {a} ${totalName} en lots de {b}. Combien de lots ?`,
      `${actor} finalise le partage de {a} ${totalName} en {b}. Combien par part ?`,
      `Inventaire : {a} ${totalName} ÷ {b} unites par lot. Combien de lots ?`,
    ]
  }
  return [
    `Festival : {a} ${totalName} en stands de {b}. Combien de stands complets ?`,
    `Usine : {a} ${totalName} en lots de {b}. Combien de lots complets ?`,
    `${actor} gere {a} ${totalName} a ventiler en rayons de {b}. Combien de rayons ?`,
    `Logistique : {a} ${totalName} en palettes de {b}. Combien de palettes completes ?`,
    `Collecte : {a} ${totalName} verses dans des caisses de {b}. Combien de caisses ?`,
    `Centre aere : {a} ${totalName} entre {b} groupes d’age egalement. Combien par groupe ?`,
    `Production : {a} ${totalName} en series de {b}. Combien de series completes ?`,
    `${place} : dossiers de {b} a partir de {a} ${totalName}. Combien de dossiers complets ?`,
    `${actor} planifie le partage de {a} ${totalName} en {b} secteurs. Combien par secteur ?`,
    `Entrepot regional : {a} ${totalName} en conteneurs de {b}. Combien de conteneurs complets ?`,
    `Region : {a} ${totalName} entre {b} centres. Combien par centre ?`,
    `Consortium : {a} ${totalName} en parts de {b} partenaires. Combien par partenaire ?`,
    `${place} : {a} ${totalName} en hubs de {b}. Combien de hubs ?`,
    `${actor} dimensionne des lignes de {b} pour {a} ${totalName}. Combien de lignes ?`,
    `Hopital : {a} ${totalName} en unites de {b} lits. Combien d’unites ?`,
    `Federation : {a} ${totalName} en clubs de {b}. Combien de clubs ?`,
    `Plateforme : {a} ${totalName} en serveurs de {b}. Combien de serveurs ?`,
    `${place}, usine : {a} ${totalName} en chaines de {b}. Combien de chaines ?`,
    `${actor} alloue {a} ${totalName} en budgets de {b}. Combien de budgets ?`,
    `Salon : {a} ${totalName} en halls de {b}. Combien de halls ?`,
    `Reseau : {a} ${totalName} entre {b} etablissements. Combien par etablissement ?`,
    `Campagne : {a} ${totalName} en regions de capacite {b}. Combien de regions ?`,
    `${place} : {a} ${totalName} en entrepots de {b}. Combien d’entrepots ?`,
    `${actor} consolide {a} ${totalName} en sites de {b}. Combien de sites ?`,
    `Marche public : {a} ${totalName} en lots de {b}. Combien de lots ?`,
    `Observatoire : {a} ${totalName} en stations de {b}. Combien de stations ?`,
    `Transport : {a} ${totalName} en convois de {b}. Combien de convois ?`,
    `${place}, archive : {a} ${totalName} en salles de {b}. Combien de salles ?`,
    `${actor} planifie {a} ${totalName} en vagues de {b}. Combien de vagues ?`,
    `Annuel : {a} ${totalName} en trimestres de {b}. Combien de trimestres ?`,
    `Centre : {a} ${totalName} en batiments de {b}. Combien de batiments ?`,
    `Logistique : {a} ${totalName} en tours de {b}. Combien de tours ?`,
    `${place} : {a} ${totalName} en zones de {b}. Combien de zones ?`,
    `${actor} evalue {a} ${totalName} en portefeuilles de {b}. Combien de portefeuilles ?`,
    `Usines : {a} ${totalName} en sites de {b}. Combien de sites ?`,
    `Evenement : {a} ${totalName} en sessions de {b}. Combien de sessions ?`,
    `Collectivite : {a} ${totalName} en quartiers de {b}. Combien de quartiers ?`,
    `${place}, labo : {a} ${totalName} en plateformes de {b}. Combien de plateformes ?`,
    `${actor} mutualise {a} ${totalName} en services de {b}. Combien de services ?`,
    `Programme : {a} ${totalName} en cohortes de {b}. Combien de cohortes ?`,
    `Depot national : {a} ${totalName} en allees de {b}. Combien d’allees ?`,
    `Reseau : {a} ${totalName} en noeuds de {b}. Combien de noeuds ?`,
    `${place} : {a} ${totalName} en modules de {b}. Combien de modules ?`,
    `${actor} dimensionne {a} ${totalName} en equipes de {b}. Combien d’equipes ?`,
    `Campagne nationale : {a} ${totalName} en vagues de {b}. Combien de vagues ?`,
    `Infrastructure : {a} ${totalName} en blocs de {b}. Combien de blocs ?`,
    `E-com : {a} ${totalName} en entrepots de {b}. Combien d’entrepots ?`,
    `${place}, projet : {a} ${totalName} en lots de {b}. Combien de lots ?`,
    `${actor} finalise {a} ${totalName} ÷ {b} par site. Combien par site ?`,
    `Bilan : {a} ${totalName} en lignes de {b}. Combien de lignes ?`,
  ]
}

/* -------------------------------------------------------------------------- */
/* 50 frames add-sub                                                           */
/* -------------------------------------------------------------------------- */

function addSubFrames(level, actor, obj, place, g) {
  const base = [
    `${actor} a {a} ${obj}. ${g.Il} en recoit {b}, puis en donne {c}. Combien lui en reste-t-il ?`,
    `${place}, on compte {a} ${obj}. On en ajoute {b}, puis on en retire {c}. Combien en reste-t-il ?`,
    `Un stock de {a} ${obj} augmente de {b}, puis diminue de {c}. Combien reste-t-il ?`,
    `${actor} commence avec {a} ${obj}, gagne {b}, puis en utilise {c}. Combien lui en reste-t-il ?`,
    `Pour l’activite : {a} ${obj} prets. On en apporte {b}, puis on en distribue {c}. Combien restent disponibles ?`,
    `${actor} ${place} rassemble {a} ${obj}, en trouve {b} de plus, puis en prete {c}. Combien lui en reste-t-il ?`,
    `Caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Combien reste-t-il ?`,
    `Bus : {a} passagers, {b} montent, puis {c} descendent. Combien reste-t-il de passagers ?`,
    `Bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Combien restent disponibles ?`,
    `${actor} marque {a} points, en gagne {b}, puis en perd {c}. Quel score reste-t-il ?`,
    `${actor} a {a} ${obj}, en ${g.il === 'elle' ? 'achete' : 'achete'} {b}, puis en vend {c}. Combien lui en reste-t-il ?`,
    `${place} : debut {a} ${obj}, arrivee de {b}, depart de {c}. Combien restent ?`,
    `Reserve : {a} ${obj}, livraison +{b}, sortie −{c}. Combien en reserve ?`,
    `${actor} collectionne {a} ${obj}, en recoit {b}, puis en offre {c}. Combien reste-t-il ?`,
    `Classe : {a} eleves presents, {b} arrivent, {c} partent. Combien restent ?`,
    `Compte : {a} + {b} − {c} ${obj}. Quel reste ?`,
    `${actor} prepare {a} ${obj}, en ajoute {b}, puis en retire {c} abimes. Combien restent bons ?`,
    `${place}, stock {a}, reappro {b}, vente {c}. Combien reste-t-il ?`,
    `Jeu : score {a}, bonus {b}, malus {c}. Quel score final ?`,
    `${actor} range {a} ${obj}, en trouve {b}, puis en jette {c}. Combien restent ranges ?`,
    `Panier : {a} ${obj}, +{b} du marche, −{c} mangés. Combien dans le panier ?`,
    `File : {a} personnes, {b} arrivent, {c} sont servies. Combien restent en file ?`,
    `${actor} a {a} tickets, en achete {b}, en utilise {c}. Combien de tickets restent ?`,
    `${place} : {a} places, +{b} chaises, −{c} cassees. Combien de places restent ?`,
    `Depot : {a} colis, +{b} recus, −{c} expedies. Combien de colis restent ?`,
    `${actor} note {a} ${obj}, ajoute {b}, retire {c}. Combien note-t-${g.il} a la fin ?`,
    `Atelier : {a} pieces, +{b} produites, −{c} rebuts. Combien de pieces bonnes ?`,
    `Caisse club : {a} CHF, cotisations +{b}, achats −{c}. Combien reste-t-il ?`,
    `${place}, inventaire {a} ${obj}, entree {b}, sortie {c}. Combien en stock ?`,
    `${actor} cumule {a} points, +{b}, puis −{c}. Quel total reste-t-il ?`,
    `Stand : {a} ${obj}, livraison {b}, ventes {c}. Combien restent au stand ?`,
    `Bus scolaire : {a} eleves, {b} montent, {c} descendent. Combien restent ?`,
    `${actor} gere {a} ${obj}, en recoit {b}, en envoie {c}. Combien lui en reste-t-il ?`,
    `${place} : sac de {a} ${obj}, +{b}, −{c}. Combien dans le sac ?`,
    `Magasin : stock {a}, arrivees {b}, ventes {c}. Combien en rayon ?`,
    `${actor} commence a {a}, ajoute {b} ${obj}, retire {c}. Combien reste-t-il ?`,
    `Terrasse : {a} chaises, +{b}, −{c} rangees. Combien de chaises restent ?`,
    `Compte rendu : {a} ${obj}, trouvailles {b}, pertes {c}. Combien restent ?`,
    `${place}, bac {a} ${obj}, remplissage {b}, prelevement {c}. Combien restent ?`,
    `${actor} aligne {a} ${obj}, en pose {b}, en enleve {c}. Combien restent alignes ?`,
    `Club : {a} membres, +{b} inscriptions, −{c} departs. Combien de membres ?`,
    `Etagere : {a} livres, +{b} neufs, −{c} pretes. Combien sur l’etagere ?`,
    `${actor} a {a} ${obj} en poche, en gagne {b}, en depense {c}. Combien reste-t-il ?`,
    `${place} : plateau {a} ${obj}, ajout {b}, retrait {c}. Combien sur le plateau ?`,
    `Jardin : {a} plants, +{b} plantes, −{c} deplaces. Combien restent ici ?`,
    `${actor} suit un solde : {a} + {b} − {c} ${obj}. Quel solde ?`,
    `Vestiaire : {a} casiers libres, +{b}, −{c} pris. Combien restent libres ?`,
    `Labo : {a} tubes, +{b} livrés, −{c} utilises. Combien de tubes restent ?`,
    `${place}, caisse {a} CHF, encaissements {b}, paiements {c}. Combien reste-t-il ?`,
    `${actor} cloture : debut {a} ${obj}, +{b}, −{c}. Combien a la cloture ?`,
  ]
  assertFrameCount(base, `add-sub:${level}:base`)
  if (level === 'facile') return base
  if (level === 'moyen') {
    return base.map((p) =>
      p.replace('Combien', 'Apres ces deux operations, combien').replace('Quel', 'Apres ces deux operations, quel'),
    )
  }
  return base.map((p) => p.replace(/\?$/, ', en tenant compte des deux mouvements ?'))
}

/* -------------------------------------------------------------------------- */
/* 50 frames melange                                                           */
/* -------------------------------------------------------------------------- */

function melangeFrames(level, actor, obj, place, g, u) {
  const frames = [
    { prompt: `${actor} achete {b} ${g} de {a} ${u}, puis en offre {c}. Combien lui en reste-t-il ?`, op: '*-' },
    { prompt: `${place}, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits ?`, op: '*-' },
    { prompt: `${actor} a {a} ${obj}. ${actor} recoit encore {b} paquets de {c} ${obj}. Combien en a-t-il au total ?`, op: '+*' },
    { prompt: `On prepare {a} ${obj}, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets ?`, op: '++/' },
    { prompt: `${actor} paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il ?`, op: '++/' },
    { prompt: `Depot : {a} ${obj}. On envoie {b} cartons de {c} ${obj}. Combien reste-t-il ?`, op: '-*' },
    { prompt: `${place}, {a} rangees de {b} ${obj}, puis on en retire {c}. Combien en reste-t-il ?`, op: '*-' },
    { prompt: `${actor} collectionne {a} ${obj} par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il ?`, op: '*-' },
    { prompt: `Fete : {a} eleves apportent chacun {b} ${obj}. On en utilise {c}. Combien reste-t-il ?`, op: '*-' },
    { prompt: `${actor} ${place} reunit {a} ${obj} et {b} ${obj}, puis partage en {c} lots egaux. Combien par lot ?`, op: '++/' },
    { prompt: `${actor} fabrique {b} boites de {a} ${obj}, puis en casse {c}. Combien de ${obj} restent intacts ?`, op: '*-' },
    { prompt: `Commande : {a} ${obj} unitaires et {b} lots de {c}. Combien d’unites au total ?`, op: '+*' },
    { prompt: `${actor} prepare {b} sacs de {a} ${obj}, puis en prete {c}. Combien lui en reste-t-il ?`, op: '*-' },
    { prompt: `${place} : {b} tables de {a} ${obj}, moins {c} retires. Combien restent ?`, op: '*-' },
    { prompt: `${actor} a {a} ${obj} et achete {b} boites de {c}. Combien en a-t-${heShe(actor).il} ?`, op: '+*' },
    { prompt: `Stock {a} ${obj} + {b}, puis division en {c} parts. Combien par part ?`, op: '++/' },
    { prompt: `Caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun ?`, op: '++/' },
    { prompt: `Reserve {a} ${obj}, sortie de {b} paquets de {c}. Combien reste-t-il ?`, op: '-*' },
    { prompt: `${actor} aligne {b} files de {a} ${obj}, puis enleve {c}. Combien restent ?`, op: '*-' },
    { prompt: `Club : {b} equipes de {a}, puis {c} absents. Combien de presents ?`, op: '*-' },
    { prompt: `${place}, {a} ${obj} deja la, plus {b} cartons de {c}. Combien en tout ?`, op: '+*' },
    { prompt: `${actor} cumule {a} et {b} ${obj}, puis forme des groupes de {c}. Combien de groupes ?`, op: '++/' },
    { prompt: `Atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent ?`, op: '*-' },
    { prompt: `Ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers ?`, op: '+*' },
    { prompt: `${actor} gagne {a} × {b} points, puis en perd {c}. Quel score ?`, op: '*-' },
    { prompt: `${place} : {b} stands de {a} ${obj}, on en retire {c}. Combien restent ?`, op: '*-' },
    { prompt: `Depot {a} ${obj} − {b} × {c}. Combien reste-t-il ?`, op: '-*' },
    { prompt: `${actor} recoit {a} ${obj} + {b} sacs de {c}. Combien au total ?`, op: '+*' },
    { prompt: `Partage : ({a} + {b}) ${obj} en {c} parts. Combien par part ?`, op: '++/' },
    { prompt: `Bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles ?`, op: '*-' },
    { prompt: `${actor} emballe {b} colis de {a} ${obj}, puis en ouvre {c}. Combien restent fermes (en ${obj}) ?`, op: '*-' },
    { prompt: `${place}, inventaire {a} + {b} lots de {c} ${obj}. Combien d’unites ?`, op: '+*' },
    { prompt: `${actor} additionne {a} et {b} CHF, divise par {c}. Combien chacun ?`, op: '++/' },
    { prompt: `Magasin : {a} articles − {b} packs de {c}. Combien restent ?`, op: '-*' },
    { prompt: `Jardin : {b} planches de {a} plants, {c} deplaces. Combien restent ?`, op: '*-' },
    { prompt: `${actor} a {a} ${obj}, plus {b} × {c}. Combien en tout ?`, op: '+*' },
    { prompt: `Collecte ({a} + {b}) ${obj} repartie en {c} bacs. Combien par bac ?`, op: '++/' },
    { prompt: `${place} : {b} cages de {a} animaux, {c} liberés. Combien restent ?`, op: '*-' },
    { prompt: `${actor} produit {b} series de {a} ${obj}, en donne {c}. Combien reste-t-il ?`, op: '*-' },
    { prompt: `Commande mixte : {a} unitaires + {b} × {c}. Combien d’unites ?`, op: '+*' },
    { prompt: `Caisse club : {a} + {b}, partage en {c}. Combien par membre ?`, op: '++/' },
    { prompt: `Entrepot {a} ${obj} moins {b} palettes de {c}. Combien reste-t-il ?`, op: '-*' },
    { prompt: `${actor} forme {b} groupes de {a}, puis {c} se retirent. Combien restent ?`, op: '*-' },
    { prompt: `${place}, {a} ${obj} + {b} boites de {c}. Combien au total ?`, op: '+*' },
    { prompt: `${actor} reunit {a} et {b} ${obj}, divise en {c}. Combien par lot ?`, op: '++/' },
    { prompt: `Usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent ?`, op: '*-' },
    { prompt: `Stock initial {a}, retrait {b} × {c} ${obj}. Combien reste-t-il ?`, op: '-*' },
    { prompt: `${actor} calcule {b} semaines × {a} ${obj}, moins {c}. Combien reste-t-il ?`, op: '*-' },
    { prompt: `${place} : {a} deja stockes + {b} packs de {c}. Combien en stock ?`, op: '+*' },
    { prompt: `${actor} cloture ({a} + {b}) ÷ {c} ${obj}. Combien par part ?`, op: '++/' },
  ]
  assertFrameCount(
    frames.map((f) => f.prompt),
    `melange:${level}:base`,
  )
  return frames.map(({ prompt, op }) => {
    let p = prompt
    if (level === 'moyen') p = `Calculez avec soin. ${p}`
    if (level === 'avance') p = `${p.slice(0, -1)}, en detailant les etapes ?`
    return { prompt: p, op }
  })
}

/* -------------------------------------------------------------------------- */
/* Builders                                                                    */
/* -------------------------------------------------------------------------- */

function buildAddition(level) {
  return fillFromFrames(`addition:${level}`, additionFrames(level, 'Lina', 'billes', 'a l’ecole', 'gagne', heShe('Lina')), (i, _fi, _frame) => {
    const actor = actors[i % actors.length]
    const obj = objects[(i * 3 + level.length) % objects.length]
    const place = places[(i * 7) % places.length]
    const verb = verbsAdd[(i * 5) % verbsAdd.length]
    const g = heShe(actor)
    const frames = additionFrames(level, actor, obj, place, verb, g)
    return frames[_fi]
  }).map((prompt, idx) => ({ id: `addition-${level}-${idx + 1}`, prompt, op: '+' }))
}

function buildSoustraction(level) {
  return fillFromFrames(`soustraction:${level}`, soustractionFrames(level, 'Lina', 'billes', 'a l’ecole', 'perd', heShe('Lina')), (i, _fi) => {
    const actor = actors[(i + 17) % actors.length]
    const obj = objects[(i * 5 + 11) % objects.length]
    const place = places[(i * 9 + 3) % places.length]
    const verb = verbsSub[(i * 4) % verbsSub.length]
    const g = heShe(actor)
    const frames = soustractionFrames(level, actor, obj, place, verb, g)
    return frames[_fi]
  }).map((prompt, idx) => ({ id: `soustraction-${level}-${idx + 1}`, prompt, op: '-' }))
}

function buildMultiplication(level) {
  return fillFromFrames(`multiplication:${level}`, multiplicationFrames(level, 'Lina', 'boites', 'crayons', 'a l’ecole'), (i, _fi) => {
    const actor = actors[(i + 31) % actors.length]
    const [group, unit] = mulPairs[i % mulPairs.length]
    const place = places[(i * 3 + 5) % places.length]
    const frames = multiplicationFrames(level, actor, group, unit, place)
    return frames[_fi]
  }).map((prompt, idx) => ({ id: `multiplication-${level}-${idx + 1}`, prompt, op: '*' }))
}

function buildDivision(level) {
  return fillFromFrames(`division:${level}`, divisionFrames(level, 'Lina', 'billes', 'enfants', 'a l’ecole'), (i, _fi) => {
    const actor = actors[(i + 47) % actors.length]
    const [totalName, perName] = divPairs[i % divPairs.length]
    const place = places[(i * 5 + 2) % places.length]
    const frames = divisionFrames(level, actor, totalName, perName, place)
    return frames[_fi]
  }).map((prompt, idx) => ({ id: `division-${level}-${idx + 1}`, prompt, op: '/', exact: true }))
}

function buildAddSub(level) {
  return fillFromFrames(`add-sub:${level}`, addSubFrames(level, 'Lina', 'billes', 'a l’ecole', heShe('Lina')), (i, _fi) => {
    const actor = actors[(i + 61) % actors.length]
    const obj = objects[(i * 7 + 19) % objects.length]
    const place = places[(i * 11 + 4) % places.length]
    const g = heShe(actor)
    const frames = addSubFrames(level, actor, obj, place, g)
    return frames[_fi]
  }).map((prompt, idx) => ({ id: `add-sub-${level}-${idx + 1}`, prompt, op: '+-' }))
}

function buildMelange(level) {
  const probe = melangeFrames(level, 'Lina', 'billes', 'a l’ecole', 'boites', 'crayons')
  assertFrameCount(
    probe.map((f) => f.prompt),
    `melange:${level}`,
  )
  const seen = new Set()
  const out = []
  let i = 0
  while (out.length < BANK_SIZE) {
    const frameIdx = out.length % FRAME_COUNT
    const actor = actors[(i + 79) % actors.length]
    const obj = objects[(i * 9 + 23) % objects.length]
    const place = places[(i * 13 + 6) % places.length]
    const [g, u] = mulPairs[i % mulPairs.length]
    const frames = melangeFrames(level, actor, obj, place, g, u)
    let { prompt, op } = frames[frameIdx]
    prompt = withContext(prompt, i + 5000 + level.length * 100)
    if (!seen.has(prompt)) {
      seen.add(prompt)
      out.push({ id: `melange-${level}-${out.length + 1}`, prompt, op })
    }
    i++
    if (i > 200000) throw new Error(`melange ${level} stuck at ${out.length}`)
  }
  return out
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

const banks = {}
const frameStats = {}

for (const level of levels) {
  // Probe frame uniqueness with fixed context (structure diversity)
  const probes = {
    addition: additionFrames(level, 'ACTOR', 'OBJETS', 'PLACE', 'VERBE', heShe('Noa')),
    soustraction: soustractionFrames(level, 'ACTOR', 'OBJETS', 'PLACE', 'VERBE', heShe('Noa')),
    multiplication: multiplicationFrames(level, 'ACTOR', 'GROUPES', 'UNITES', 'PLACE'),
    division: divisionFrames(level, 'ACTOR', 'TOTAUX', 'PARTS', 'PLACE'),
    'add-sub': addSubFrames(level, 'ACTOR', 'OBJETS', 'PLACE', heShe('Noa')),
    melange: melangeFrames(level, 'ACTOR', 'OBJETS', 'PLACE', 'GROUPES', 'UNITES').map((f) => f.prompt),
  }
  for (const [op, frames] of Object.entries(probes)) {
    assertFrameCount(frames, `${op}:${level}:probe`)
    frameStats[`${op}:${level}`] = frames.length
  }

  banks[`addition:${level}`] = buildAddition(level)
  banks[`soustraction:${level}`] = buildSoustraction(level)
  banks[`multiplication:${level}`] = buildMultiplication(level)
  banks[`division:${level}`] = buildDivision(level)
  banks[`add-sub:${level}`] = buildAddSub(level)
  banks[`melange:${level}`] = buildMelange(level)
}

const allPrompts = []
for (const [key, arr] of Object.entries(banks)) {
  if (arr.length < BANK_SIZE) throw new Error(`${key} has only ${arr.length}`)
  assertUnique(
    arr.map((x) => x.prompt),
    key,
  )
  console.log(key, 'prompts=', arr.length, 'frames=', frameStats[key] ?? frameStats[key.replace(/:.*/, (m) => m)] ?? FRAME_COUNT)
  for (const e of arr) allPrompts.push(e.prompt)
}
assertUnique(allPrompts, 'GLOBAL')
console.log('TOTAL unique prompts:', allPrompts.length)
console.log('Frames per op×level:', FRAME_COUNT)

const header = `/* eslint-disable */
/** Banques : ${FRAME_COUNT} frames distinctes × ${BANK_SIZE} prompts uniques par theme×niveau (prompts distincts globalement). Genere par scripts/gen-problem-banks.mjs */
export type ProblemOp = '+' | '-' | '*' | '/' | '+-' | '*-' | '+*' | '++/' | '-*'
export type ProblemBankEntry = { id: string; prompt: string; op: ProblemOp; exact?: boolean }

export const PROBLEM_BANKS: Record<string, ProblemBankEntry[]> = `
fs.writeFileSync('src/math/problem-banks.ts', header + JSON.stringify(banks, null, 2) + '\n')
console.log('Wrote src/math/problem-banks.ts')
