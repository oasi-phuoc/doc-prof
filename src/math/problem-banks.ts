/* eslint-disable */
/** Banques : 50 frames distinctes × 100 prompts uniques par theme×niveau (prompts distincts globalement). Genere par scripts/gen-problem-banks.mjs */
export type ProblemOp = '+' | '-' | '*' | '/' | '+-' | '*-' | '+*' | '++/' | '-*'
export type ProblemBankEntry = { id: string; prompt: string; op: ProblemOp; exact?: boolean }

export const PROBLEM_BANKS: Record<string, ProblemBankEntry[]> = {
  "addition:facile": [
    {
      "id": "addition-facile-1",
      "prompt": "Pour le vide-grenier de juillet, lina a {a} livres. Elle en gagne {b}. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-facile-2",
      "prompt": "Pour le stand de limonade de juillet, il y a {a} vignettes a la piscine. On en ajoute {b}. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-3",
      "prompt": "Pour les olympiades sportives de juillet, un panier contient {a} bananes. On y met {b} bananes. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-4",
      "prompt": "Pour le conte musical de juillet, daryna compte {a} gateaux puis encore {b}. Quel est le total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-5",
      "prompt": "Pour le rallye maths de juillet, ce matin : {a} oeufs. L’apres-midi : {b} de plus. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-6",
      "prompt": "Pour la semaine bleue de juillet, dans une boite, il y a {a} roses. Ahmed en ajoute {b}. Combien de roses ?",
      "op": "+"
    },
    {
      "id": "addition-facile-7",
      "prompt": "Pour la semaine verte de juillet, au gymnase, {a} cubes sont poses. On en pose {b} de plus. Combien sont poses ?",
      "op": "+"
    },
    {
      "id": "addition-facile-8",
      "prompt": "Pour le festival du livre de juillet, stock initial : {a} jeux. Livraison : {b}. Combien en stock ?",
      "op": "+"
    },
    {
      "id": "addition-facile-9",
      "prompt": "Pour l’atelier robotique de juillet, lea aligne {a} raquettes d’un cote et {b} de l’autre. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-10",
      "prompt": "Pour l’activite, on prend {a} tickets, puis {b} de plus. Combien en prend-on  — le club nature de juillet ?",
      "op": "+"
    },
    {
      "id": "addition-facile-11",
      "prompt": "Pour le marche aux fleurs de juillet, amina trouve {a} eleves dans un tiroir et {b} dans un sac. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-facile-12",
      "prompt": "Pour le parcours sante de juillet, sur la table, {a} chiens puis on apporte {b} chiens. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-13",
      "prompt": "Pour le defi zero dechet de juillet, fatima recoit {a} timbres lundi et {b} mardi. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-facile-14",
      "prompt": "Pour l’atelier bricolage de juillet, deux piles : {a} enveloppes et {b} enveloppes. Combien de enveloppes en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-15",
      "prompt": "Pour la journee du sport de juillet, au depart {a} tablettes, puis Elsa en recueille {b}. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-16",
      "prompt": "Pour la fete de l’ecole de aout, la boite bleue a {a} paniers, la rouge {b}. Combien ensemble ?",
      "op": "+"
    },
    {
      "id": "addition-facile-17",
      "prompt": "Pour le marche de Noel de aout, dans le quartier on voit {a} verres. Plus tard on en voit {b} de plus. Combien ?",
      "op": "+"
    },
    {
      "id": "addition-facile-18",
      "prompt": "Pour la kermesse de aout, tom note {a} puis ajoute {b} pinces. Quelle somme ecrit-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-19",
      "prompt": "Pour le tournoi de printemps de aout, premier groupe : {a} planches. Second groupe : {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-20",
      "prompt": "Pour la sortie au musee de aout, on range {a} arrosoirs, puis encore {b}. Combien sont ranges ?",
      "op": "+"
    },
    {
      "id": "addition-facile-21",
      "prompt": "Pour l’atelier science de aout, ines colle {a} vignettes, puis {b} autres. Combien de vignettes ?",
      "op": "+"
    },
    {
      "id": "addition-facile-22",
      "prompt": "Pour la semaine du gout de aout, dans le sac : {a} boutons. Marco y glisse {b}. Combien dans le sac ?",
      "op": "+"
    },
    {
      "id": "addition-facile-23",
      "prompt": "Pour la journee portes ouvertes de aout, le plateau montre {a} etiquettes. On en pose {b} de plus. Combien ?",
      "op": "+"
    },
    {
      "id": "addition-facile-24",
      "prompt": "Pour la collecte solidaire de aout, ana a {a} feuilles A4 a gauche et {b} a droite. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-25",
      "prompt": "Pour le challenge lecture de aout, avant la recre : {a} pots. Pendant la recre : +{b}. Combien maintenant ?",
      "op": "+"
    },
    {
      "id": "addition-facile-26",
      "prompt": "Pour le projet jardin de aout, une corbeille a {a} bobines. On y verse {b} bobines. Combien y a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-27",
      "prompt": "Pour l’expo photos de aout, au marche, inventaire : {a} puis +{b} billes. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-28",
      "prompt": "Pour le concert de fin d’annee de aout, yara dessine {a} gommes puis {b} de plus. Combien de dessins ?",
      "op": "+"
    },
    {
      "id": "addition-facile-29",
      "prompt": "Pour la course d’orientation de aout, sur l’etagere du haut : {a} livres. Du bas : {b}. Combien sur l’etagere ?",
      "op": "+"
    },
    {
      "id": "addition-facile-30",
      "prompt": "Pour l’atelier cuisine de aout, le compteur affiche {a}. On ajoute {b} vignettes. Quel nouveau total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-31",
      "prompt": "Pour le vide-grenier de aout, ali gagne {a} bananes au premier jeu et {b} au second. Combien gagne-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-32",
      "prompt": "Pour le stand de limonade de aout, classe A apporte {a} gateaux, classe B apporte {b}. Combien reunis ?",
      "op": "+"
    },
    {
      "id": "addition-facile-33",
      "prompt": "Pour les olympiades sportives de aout, dans le tiroir : {a} oeufs. Nour en recueille {b} dehors. Combien dans le tiroir ensuite ?",
      "op": "+"
    },
    {
      "id": "addition-facile-34",
      "prompt": "Pour le conte musical de aout, on prepare {a} roses pour le matin et {b} pour l’apres-midi. Combien prepares ?",
      "op": "+"
    },
    {
      "id": "addition-facile-35",
      "prompt": "Pour le rallye maths de aout, dans le laboratoire : debut {a} cubes, fin de seance +{b}. Combien a la fin ?",
      "op": "+"
    },
    {
      "id": "addition-facile-36",
      "prompt": "Pour la semaine bleue de aout, dawit lit {a} pages puis {b} pages. Combien de pages lues ?",
      "op": "+"
    },
    {
      "id": "addition-facile-37",
      "prompt": "Pour la semaine verte de aout, boite 1 : {a} raquettes. Boite 2 : {b} raquettes. Total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-38",
      "prompt": "Pour le festival du livre de aout, le jardinier plante {a} tickets, puis {b} de plus. Combien de plants ?",
      "op": "+"
    },
    {
      "id": "addition-facile-39",
      "prompt": "Pour l’atelier robotique de aout, chiara collectionne {a} eleves et en recoit {b}. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-facile-40",
      "prompt": "Pour le club nature de aout, au tableau : {a} + {b} chiens. Quel est le resultat demande ?",
      "op": "+"
    },
    {
      "id": "addition-facile-41",
      "prompt": "Pour le marche aux fleurs de aout, file d’attente : {a} personnes, puis {b} arrivent. Combien de personnes ?",
      "op": "+"
    },
    {
      "id": "addition-facile-42",
      "prompt": "Pour le parcours sante de aout, a la mediatheque, {a} enveloppes sont prets. On en prepare {b} de plus. Combien sont prets ?",
      "op": "+"
    },
    {
      "id": "addition-facile-43",
      "prompt": "Pour le defi zero dechet de aout, timur range {a} tablettes dans un bac et {b} dans un autre. Combien ranges ?",
      "op": "+"
    },
    {
      "id": "addition-facile-44",
      "prompt": "Pour l’atelier bricolage de aout, matin {a} paniers, soir {b} paniers supplementaires. Combien sur la journee ?",
      "op": "+"
    },
    {
      "id": "addition-facile-45",
      "prompt": "Pour la journee du sport de aout, un sachet contient {a} verres. Un second en contient {b}. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-46",
      "prompt": "Pour la fete de l’ecole de septembre, iryna marque {a} points puis {b} points. Quel score total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-47",
      "prompt": "Pour le marche de Noel de septembre, reserve A : {a} planches. Reserve B : {b}. Combien dans les deux reserves ?",
      "op": "+"
    },
    {
      "id": "addition-facile-48",
      "prompt": "Pour la kermesse de septembre, a l’atelier bois on compte {a} arrosoirs, puis on en trouve {b}. Combien compte-t-on ?",
      "op": "+"
    },
    {
      "id": "addition-facile-49",
      "prompt": "Pour le tournoi de printemps de septembre, jalal achete {a} cailloux et en recoit {b} en cadeau. Combien possede-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-50",
      "prompt": "Pour la sortie au musee de septembre, debut du jeu : {a} boutons. Bonus : {b} boutons. Combien d’objets au total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-51",
      "prompt": "Pour l’atelier science de septembre, samuel a {a} etiquettes. Il en recueille {b}. Combien en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-52",
      "prompt": "Pour la semaine du gout de septembre, il y a {a} feuilles A4 au vestiaire. On en ajoute {b}. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-53",
      "prompt": "Pour la journee portes ouvertes de septembre, un panier contient {a} pots. On y met {b} pots. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-54",
      "prompt": "Pour la collecte solidaire de septembre, joao compte {a} bobines puis encore {b}. Quel est le total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-55",
      "prompt": "Pour le challenge lecture de septembre, ce matin : {a} billes. L’apres-midi : {b} de plus. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-56",
      "prompt": "Pour le projet jardin de septembre, dans une boite, il y a {a} gommes. Luca en ajoute {b}. Combien de gommes ?",
      "op": "+"
    },
    {
      "id": "addition-facile-57",
      "prompt": "Pour l’expo photos de septembre, au marche, {a} livres sont poses. On en pose {b} de plus. Combien sont poses ?",
      "op": "+"
    },
    {
      "id": "addition-facile-58",
      "prompt": "Pour le concert de fin d’annee de septembre, stock initial : {a} vignettes. Livraison : {b}. Combien en stock ?",
      "op": "+"
    },
    {
      "id": "addition-facile-59",
      "prompt": "Pour la course d’orientation de septembre, hana aligne {a} bananes d’un cote et {b} de l’autre. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-60",
      "prompt": "Pour l’activite, on prend {a} gateaux, puis {b} de plus. Combien en prend-on  — l’atelier cuisine de septembre ?",
      "op": "+"
    },
    {
      "id": "addition-facile-61",
      "prompt": "Pour le vide-grenier de septembre, tarek trouve {a} oeufs dans un tiroir et {b} dans un sac. Combien en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-62",
      "prompt": "Pour le stand de limonade de septembre, sur la table, {a} roses puis on apporte {b} roses. Combien y en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-63",
      "prompt": "Pour les olympiades sportives de septembre, bashir recoit {a} cubes lundi et {b} mardi. Combien en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-64",
      "prompt": "Pour le conte musical de septembre, deux piles : {a} jeux et {b} jeux. Combien de jeux en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-65",
      "prompt": "Pour le rallye maths de septembre, au depart {a} raquettes, puis Rui en recupere {b}. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-66",
      "prompt": "Pour la semaine bleue de septembre, la boite bleue a {a} tickets, la rouge {b}. Combien ensemble ?",
      "op": "+"
    },
    {
      "id": "addition-facile-67",
      "prompt": "Pour la semaine verte de septembre, au gymnase on voit {a} eleves. Plus tard on en voit {b} de plus. Combien ?",
      "op": "+"
    },
    {
      "id": "addition-facile-68",
      "prompt": "Pour le festival du livre de septembre, laura note {a} puis ajoute {b} chiens. Quelle somme ecrit-elle ?",
      "op": "+"
    },
    {
      "id": "addition-facile-69",
      "prompt": "Pour l’atelier robotique de septembre, premier groupe : {a} timbres. Second groupe : {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-70",
      "prompt": "Pour le club nature de septembre, on range {a} enveloppes, puis encore {b}. Combien sont ranges ?",
      "op": "+"
    },
    {
      "id": "addition-facile-71",
      "prompt": "Pour le marche aux fleurs de septembre, navid colle {a} vignettes, puis {b} autres. Combien de vignettes ?",
      "op": "+"
    },
    {
      "id": "addition-facile-72",
      "prompt": "Pour le parcours sante de septembre, dans le sac : {a} paniers. Tesfay y glisse {b}. Combien dans le sac ?",
      "op": "+"
    },
    {
      "id": "addition-facile-73",
      "prompt": "Pour le defi zero dechet de septembre, le plateau montre {a} verres. On en pose {b} de plus. Combien ?",
      "op": "+"
    },
    {
      "id": "addition-facile-74",
      "prompt": "Pour l’atelier bricolage de septembre, claudia a {a} pinces a gauche et {b} a droite. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-75",
      "prompt": "Pour la journee du sport de septembre, avant la recre : {a} planches. Pendant la recre : +{b}. Combien maintenant ?",
      "op": "+"
    },
    {
      "id": "addition-facile-76",
      "prompt": "Pour la fete de l’ecole de octobre, une corbeille a {a} arrosoirs. On y verse {b} arrosoirs. Combien y a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-77",
      "prompt": "Pour le marche de Noel de octobre, dans le quartier, inventaire : {a} puis +{b} cailloux. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-78",
      "prompt": "Pour la kermesse de octobre, iman dessine {a} boutons puis {b} de plus. Combien de dessins ?",
      "op": "+"
    },
    {
      "id": "addition-facile-79",
      "prompt": "Pour le tournoi de printemps de octobre, sur l’etagere du haut : {a} etiquettes. Du bas : {b}. Combien sur l’etagere ?",
      "op": "+"
    },
    {
      "id": "addition-facile-80",
      "prompt": "Pour la sortie au musee de octobre, le compteur affiche {a}. On ajoute {b} feuilles A4. Quel nouveau total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-81",
      "prompt": "Pour l’atelier science de octobre, goncalo gagne {a} pots au premier jeu et {b} au second. Combien gagne-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-82",
      "prompt": "Pour la semaine du gout de octobre, classe A apporte {a} bobines, classe B apporte {b}. Combien reunis ?",
      "op": "+"
    },
    {
      "id": "addition-facile-83",
      "prompt": "Pour la journee portes ouvertes de octobre, dans le tiroir : {a} billes. Lorenzo en recupere {b} dehors. Combien dans le tiroir ensuite ?",
      "op": "+"
    },
    {
      "id": "addition-facile-84",
      "prompt": "Pour la collecte solidaire de octobre, on prepare {a} gommes pour le matin et {b} pour l’apres-midi. Combien prepares ?",
      "op": "+"
    },
    {
      "id": "addition-facile-85",
      "prompt": "Pour le challenge lecture de octobre, au club de sport : debut {a} livres, fin de seance +{b}. Combien a la fin ?",
      "op": "+"
    },
    {
      "id": "addition-facile-86",
      "prompt": "Pour le projet jardin de octobre, malika lit {a} pages puis {b} pages. Combien de pages lues ?",
      "op": "+"
    },
    {
      "id": "addition-facile-87",
      "prompt": "Pour l’expo photos de octobre, boite 1 : {a} bananes. Boite 2 : {b} bananes. Total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-88",
      "prompt": "Pour le concert de fin d’annee de octobre, le jardinier plante {a} gateaux, puis {b} de plus. Combien de plants ?",
      "op": "+"
    },
    {
      "id": "addition-facile-89",
      "prompt": "Pour la course d’orientation de octobre, paulo collectionne {a} oeufs et en recoit {b}. Combien en a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-90",
      "prompt": "Pour l’atelier cuisine de octobre, au tableau : {a} + {b} roses. Quel est le resultat demande ?",
      "op": "+"
    },
    {
      "id": "addition-facile-91",
      "prompt": "Pour le vide-grenier de octobre, file d’attente : {a} personnes, puis {b} arrivent. Combien de personnes ?",
      "op": "+"
    },
    {
      "id": "addition-facile-92",
      "prompt": "Pour le stand de limonade de octobre, a la piscine, {a} jeux sont prets. On en prepare {b} de plus. Combien sont prets ?",
      "op": "+"
    },
    {
      "id": "addition-facile-93",
      "prompt": "Pour les olympiades sportives de octobre, nabil range {a} raquettes dans un bac et {b} dans un autre. Combien ranges ?",
      "op": "+"
    },
    {
      "id": "addition-facile-94",
      "prompt": "Pour le conte musical de octobre, matin {a} tickets, soir {b} tickets supplementaires. Combien sur la journee ?",
      "op": "+"
    },
    {
      "id": "addition-facile-95",
      "prompt": "Pour le rallye maths de octobre, un sachet contient {a} eleves. Un second en contient {b}. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-facile-96",
      "prompt": "Pour la semaine bleue de octobre, sipho marque {a} points puis {b} points. Quel score total ?",
      "op": "+"
    },
    {
      "id": "addition-facile-97",
      "prompt": "Pour la semaine verte de octobre, reserve A : {a} timbres. Reserve B : {b}. Combien dans les deux reserves ?",
      "op": "+"
    },
    {
      "id": "addition-facile-98",
      "prompt": "Pour le festival du livre de octobre, dans l’atelier on compte {a} enveloppes, puis on en trouve {b}. Combien compte-t-on ?",
      "op": "+"
    },
    {
      "id": "addition-facile-99",
      "prompt": "Pour l’atelier robotique de octobre, kofi achete {a} tablettes et en recoit {b} en cadeau. Combien possede-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-facile-100",
      "prompt": "Pour le club nature de octobre, debut du jeu : {a} paniers. Bonus : {b} paniers. Combien d’objets au total ?",
      "op": "+"
    }
  ],
  "soustraction:facile": [
    {
      "id": "soustraction-facile-1",
      "prompt": "Pour la course d’orientation de aout, tom a {a} poires. Il en perd {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-2",
      "prompt": "Pour l’atelier cuisine de aout, il y a {a} croissants au gymnase. On en retire {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-3",
      "prompt": "Pour le vide-grenier de aout, un panier contient {a} roses. On en enleve {b}. Combien reste-t-il de roses ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-4",
      "prompt": "Pour le stand de limonade de aout, ines devait garder {a} puzzles, mais elle en envoie {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-5",
      "prompt": "Pour les olympiades sportives de aout, au depart, {a} medailles sont prets. On en utilise {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-6",
      "prompt": "Pour le conte musical de aout, la reserve affiche {a} eleves. On en sort {b}. Combien reste-t-il en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-7",
      "prompt": "Pour le rallye maths de aout, au vestiaire, {a} poissons sont alignes. Ana en retire {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-8",
      "prompt": "Pour la semaine bleue de aout, un stock de {a} colis diminue de {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-9",
      "prompt": "Pour la semaine verte de aout, amadou partage : sur {a} paniers, il en donne {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-10",
      "prompt": "Pour le festival du livre de aout, sur l’etagere, il y avait {a} serviettes. On en a vendu {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-11",
      "prompt": "Pour l’atelier robotique de aout, yara enleve {b} briques d’un tas de {a}. Combien restent sur le tas ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-12",
      "prompt": "Pour le club nature de aout, avant le jeu : {a} cailloux. Apres avoir perdu {b} : combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-13",
      "prompt": "Pour le marche aux fleurs de aout, mariam possede {a} ficelles et en prete {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-14",
      "prompt": "Pour le parcours sante de aout, boite pleine : {a} feutres. On en tire {b}. Combien restent dans la boite ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-15",
      "prompt": "Pour le defi zero dechet de aout, au magasin : {a} bobines disponibles, {b} pris. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-16",
      "prompt": "Pour l’atelier bricolage de aout, compte : {a} moins {b} crayons. Quel reste obtient-on ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-17",
      "prompt": "Pour la journee du sport de aout, aya casse {b} autocollants sur un total de {a}. Combien restent intacts ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-18",
      "prompt": "Pour la fete de l’ecole de septembre, file : {a} personnes, {b} partent. Combien restent dans la file ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-19",
      "prompt": "Pour le marche de Noel de septembre, le sachet avait {a} pains. Il en manque {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-20",
      "prompt": "Pour la kermesse de septembre, rita mange {b} arbres parmi {a}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-21",
      "prompt": "Pour le tournoi de printemps de septembre, depart {a} jeux, perte de {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-22",
      "prompt": "Pour la sortie au musee de septembre, au gymnase, on comptait {a} points. On en retire {b} abimes. Combien restent bons ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-23",
      "prompt": "Pour l’atelier science de septembre, hassan offre {b} de ses {a} enfants. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-24",
      "prompt": "Pour la semaine du gout de septembre, pile de {a} timbres. On en enleve {b}. Quelle hauteur reste (en nombre) ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-25",
      "prompt": "Pour la journee portes ouvertes de septembre, au club : {a} ballons, {b} creves. Combien de ballons restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-26",
      "prompt": "Pour la collecte solidaire de septembre, timur utilise {b} crayons sur {a}. Combien de crayons restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-27",
      "prompt": "Pour le challenge lecture de septembre, reserve scolaire : {a} cahiers, {b} distribues. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-28",
      "prompt": "Pour le projet jardin de septembre, au musee : debut {a} seaux, sortie de {b}. Combien a la fin ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-29",
      "prompt": "Pour l’expo photos de septembre, iryna jette {b} coquillages hors d’un lot de {a}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-30",
      "prompt": "Pour le concert de fin d’annee de septembre, tableau : {a} − {b}. Combien reste-t-il de etiquettes ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-31",
      "prompt": "Pour la course d’orientation de septembre, corbeille : {a} pinceaux, on en retire {b}. Combien dans la corbeille ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-32",
      "prompt": "Pour l’atelier cuisine de septembre, jalal envoie {b} messages sur un quota de {a}. Combien de messages restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-33",
      "prompt": "Pour le vide-grenier de septembre, stock magasin : {a} articles, ventes {b}. Combien restent en stock ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-34",
      "prompt": "Pour le stand de limonade de septembre, a l’ecole, {a} tickets, {b} utilises. Combien de tickets restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-35",
      "prompt": "Pour les olympiades sportives de septembre, meron retire {b} cartes d’un jeu de {a}. Combien de cartes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-36",
      "prompt": "Pour le conte musical de septembre, avant : {a} oeufs. Apres retrait de {b} : combien ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-37",
      "prompt": "Pour le rallye maths de septembre, le panier part avec {a} plants. On en mange {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-38",
      "prompt": "Pour la semaine bleue de septembre, beatriz prete {b} livres parmi {a}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-39",
      "prompt": "Pour la semaine verte de septembre, bac : {a} tickets. On en sort {b} pour l’atelier. Combien restent dans le bac ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-40",
      "prompt": "Pour le festival du livre de septembre, au centre aere : {a} places libres, {b} prises. Combien de places restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-41",
      "prompt": "Pour l’atelier robotique de septembre, karim perd {b} points alors qu’il en avait {a}. Combien de points reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-42",
      "prompt": "Pour le club nature de septembre, lot de {a} tablettes, defaut sur {b}. Combien restent conformes ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-43",
      "prompt": "Pour le marche aux fleurs de septembre, depart course : {a} coureurs, {b} abandonnent. Combien restent en course ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-44",
      "prompt": "Pour le parcours sante de septembre, tarek distribue {b} vis depuis un stock de {a}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-45",
      "prompt": "Pour le defi zero dechet de septembre, au magasin, inventaire {a} arrosoirs moins {b} manquants. Combien trouves ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-46",
      "prompt": "Pour l’atelier bricolage de septembre, boite A avait {a} perles. On en deplace {b}. Combien restent dans A ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-47",
      "prompt": "Pour la journee du sport de septembre, senait coupe {b} fleurs d’un bouquet de {a}. Combien restent au bouquet ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-48",
      "prompt": "Pour la fete de l’ecole de octobre, compte a rebours : {a} pots, on en retire {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-49",
      "prompt": "Pour le marche de Noel de octobre, sur le parking : {a} aiguilles affiches, {b} retires. Combien restent affiches ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-50",
      "prompt": "Pour la kermesse de octobre, davide solde {b} cahiers sur un stock de {a}. Combien restent a vendre ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-51",
      "prompt": "Pour le tournoi de printemps de octobre, laura a {a} vignettes. Elle en enleve {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-52",
      "prompt": "Pour la sortie au musee de octobre, il y a {a} bonbons au gymnase. On en retire {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-53",
      "prompt": "Pour l’atelier science de octobre, un panier contient {a} fleurs. On en enleve {b}. Combien reste-t-il de fleurs ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-54",
      "prompt": "Pour la semaine du gout de octobre, navid devait garder {a} cubes, mais il en offre {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-55",
      "prompt": "Pour la journee portes ouvertes de octobre, au depart, {a} balles sont prets. On en utilise {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-56",
      "prompt": "Pour la collecte solidaire de octobre, la reserve affiche {a} billets. On en sort {b}. Combien reste-t-il en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-57",
      "prompt": "Pour le challenge lecture de octobre, au vestiaire, {a} chiens sont alignes. Claudia en retire {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-58",
      "prompt": "Pour le projet jardin de octobre, un stock de {a} feuilles diminue de {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-59",
      "prompt": "Pour l’expo photos de octobre, federica partage : sur {a} boites, elle en donne {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-60",
      "prompt": "Pour le concert de fin d’annee de octobre, sur l’etagere, il y avait {a} verres. On en a vendu {b}. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-61",
      "prompt": "Pour la course d’orientation de octobre, iman enleve {b} clous d’un tas de {a}. Combien restent sur le tas ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-62",
      "prompt": "Pour l’atelier cuisine de octobre, avant le jeu : {a} graines. Apres avoir perdu {b} : combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-63",
      "prompt": "Pour le vide-grenier de octobre, yohannes possede {a} boutons et en prete {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-64",
      "prompt": "Pour le stand de limonade de octobre, boite pleine : {a} classeurs. On en tire {b}. Combien restent dans la boite ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-65",
      "prompt": "Pour les olympiades sportives de octobre, au magasin : {a} tubes disponibles, {b} pris. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-66",
      "prompt": "Pour le conte musical de octobre, compte : {a} moins {b} billes. Quel reste obtient-on ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-67",
      "prompt": "Pour le rallye maths de octobre, alessandra casse {b} stylos sur un total de {a}. Combien restent intacts ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-68",
      "prompt": "Pour la semaine bleue de octobre, file : {a} personnes, {b} partent. Combien restent dans la file ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-69",
      "prompt": "Pour la semaine verte de octobre, le sachet avait {a} gateaux. Il en manque {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-70",
      "prompt": "Pour le festival du livre de octobre, parisa mange {b} tulipes parmi {a}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-71",
      "prompt": "Pour l’atelier robotique de octobre, depart {a} legos, perte de {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-72",
      "prompt": "Pour le club nature de octobre, au gymnase, on comptait {a} raquettes. On en retire {b} abimes. Combien restent bons ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-73",
      "prompt": "Pour le marche aux fleurs de octobre, filipa offre {b} de ses {a} passagers. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-74",
      "prompt": "Pour le parcours sante de octobre, pile de {a} chats. On en enleve {b}. Quelle hauteur reste (en nombre) ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-75",
      "prompt": "Pour le defi zero dechet de octobre, au club : {a} ballons, {b} creves. Combien de ballons restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-76",
      "prompt": "Pour l’atelier bricolage de octobre, nabil utilise {b} crayons sur {a}. Combien de crayons restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-77",
      "prompt": "Pour la journee du sport de octobre, reserve scolaire : {a} cahiers, {b} distribues. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-78",
      "prompt": "Pour la fete de l’ecole de novembre, au musee : debut {a} planches, sortie de {b}. Combien a la fin ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-79",
      "prompt": "Pour le marche de Noel de novembre, sipho jette {b} bulbes hors d’un lot de {a}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-80",
      "prompt": "Pour la kermesse de novembre, tableau : {a} − {b}. Combien reste-t-il de rubans ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-81",
      "prompt": "Pour le tournoi de printemps de novembre, corbeille : {a} feuilles A4, on en retire {b}. Combien dans la corbeille ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-82",
      "prompt": "Pour la sortie au musee de novembre, kofi envoie {b} messages sur un quota de {a}. Combien de messages restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-83",
      "prompt": "Pour l’atelier science de novembre, stock magasin : {a} articles, ventes {b}. Combien restent en stock ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-84",
      "prompt": "Pour la semaine du gout de novembre, a l’ecole, {a} tickets, {b} utilises. Combien de tickets restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-85",
      "prompt": "Pour la journee portes ouvertes de novembre, noa retire {b} cartes d’un jeu de {a}. Combien de cartes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-86",
      "prompt": "Pour la collecte solidaire de novembre, avant : {a} croissants. Apres retrait de {b} : combien ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-87",
      "prompt": "Pour le challenge lecture de novembre, le panier part avec {a} roses. On en mange {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-88",
      "prompt": "Pour le projet jardin de novembre, sofia prete {b} livres parmi {a}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-89",
      "prompt": "Pour l’expo photos de novembre, bac : {a} medailles. On en sort {b} pour l’atelier. Combien restent dans le bac ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-90",
      "prompt": "Pour le concert de fin d’annee de novembre, au centre aere : {a} places libres, {b} prises. Combien de places restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-91",
      "prompt": "Pour la course d’orientation de novembre, omar perd {b} points alors qu’il en avait {a}. Combien de points reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-92",
      "prompt": "Pour l’atelier cuisine de novembre, lot de {a} colis, defaut sur {b}. Combien restent conformes ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-93",
      "prompt": "Pour le vide-grenier de novembre, depart course : {a} coureurs, {b} abandonnent. Combien restent en course ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-94",
      "prompt": "Pour le stand de limonade de novembre, amina distribue {b} serviettes depuis un stock de {a}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-95",
      "prompt": "Pour les olympiades sportives de novembre, au magasin, inventaire {a} briques moins {b} manquants. Combien trouves ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-96",
      "prompt": "Pour le conte musical de novembre, boite A avait {a} cailloux. On en deplace {b}. Combien restent dans A ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-97",
      "prompt": "Pour le rallye maths de novembre, remi coupe {b} fleurs d’un bouquet de {a}. Combien restent au bouquet ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-98",
      "prompt": "Pour la semaine bleue de novembre, compte a rebours : {a} feutres, on en retire {b}. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-99",
      "prompt": "Pour la semaine verte de novembre, sur le parking : {a} bobines affiches, {b} retires. Combien restent affiches ?",
      "op": "-"
    },
    {
      "id": "soustraction-facile-100",
      "prompt": "Pour le festival du livre de novembre, mia solde {b} crayons sur un stock de {a}. Combien restent a vendre ?",
      "op": "-"
    }
  ],
  "multiplication:facile": [
    {
      "id": "multiplication-facile-1",
      "prompt": "Pour le defi zero dechet de fevrier, chaque boite contient {a} crayons. Combien y a-t-il de crayons dans {b} boites ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-2",
      "prompt": "Pour l’atelier bricolage de fevrier, nour prepare {b} paquets de {a} feuilles. Combien de feuilles cela fait-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-3",
      "prompt": "Pour la journee du sport de fevrier, dans la classe, on aligne {b} rangees de {a} chaises. Combien de chaises au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-4",
      "prompt": "Pour la fete de l’ecole de mars, un carton renferme {a} choux. Combien dans {b} cartons identiques ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-5",
      "prompt": "Pour le marche de Noel de mars, dawit achete {b} paquets. Chaque paquet a {a} joueurs. Combien de joueurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-6",
      "prompt": "Pour la kermesse de mars, il y a {b} classes. Dans chacune : {a} eleves. Quel est le total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-7",
      "prompt": "Pour {b} eleves, on donne {a} livres a chacun. Combien de livres faut-il  — le tournoi de printemps de mars ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-8",
      "prompt": "Pour la sortie au musee de mars, chiara construit {b} tours de {a} cubes. Combien de cubes utilise-t-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-9",
      "prompt": "Pour l’atelier science de mars, a l’atelier bois : {b} boites × {a} pommes. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-10",
      "prompt": "Pour la semaine du gout de mars, farid remplit {b} sacs avec {a} oranges chacun. Combien de oranges en tout ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-11",
      "prompt": "Pour la journee portes ouvertes de mars, on range {b} tiroirs de {a} verres. Combien de verres ranges ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-12",
      "prompt": "Pour la collecte solidaire de mars, timur compte {b} lignes de {a} bouteilles. Combien de bouteilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-13",
      "prompt": "Pour le challenge lecture de mars, table : {b} assiettes avec {a} voitures chacune. Combien de voitures ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-14",
      "prompt": "Pour le projet jardin de mars, au zoo, {b} cageots de {a} passagers. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-15",
      "prompt": "Pour l’expo photos de mars, iryna pose {b} etageres de {a} cubes. Combien de cubes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-16",
      "prompt": "Pour le concert de fin d’annee de mars, classe : {b} eleves × {a} roses. Combien de roses distribues ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-17",
      "prompt": "Pour la course d’orientation de mars, jardin : {b} rangees de {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-18",
      "prompt": "Pour l’atelier cuisine de mars, jalal fabrique {b} boites de {a} abeilles. Combien de abeilles fabriques ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-19",
      "prompt": "Pour le vide-grenier de mars, a l’atelier bois : {b} paniers de {a} assiettes. Combien de assiettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-20",
      "prompt": "Pour le stand de limonade de mars, rayon : {b} casiers de {a} produits. Combien de produits en rayon ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-21",
      "prompt": "Pour les olympiades sportives de mars, meron aligne {b} files de {a} timbres. Combien de timbres alignes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-22",
      "prompt": "Pour le conte musical de mars, bus : {b} rangees de {a} sieges. Combien de sieges ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-23",
      "prompt": "Pour le rallye maths de mars, atelier : {b} plateaux de {a} billes. Combien de billes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-24",
      "prompt": "Pour la semaine bleue de mars, beatriz remplit {b} albums de {a} stylos. Combien de stylos ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-25",
      "prompt": "Pour la semaine verte de mars, a la mediatheque, {b} stands avec {a} places chacun. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-26",
      "prompt": "Pour le festival du livre de mars, ecole : {b} classes de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-27",
      "prompt": "Pour l’atelier robotique de mars, karim prepare {b} bouquets de {a} fleurs. Combien de fleurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-28",
      "prompt": "Pour le club nature de mars, magasin : {b} cartons de {a} visiteurs. Combien de visiteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-29",
      "prompt": "Pour le marche aux fleurs de mars, parking : {b} rangees de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-30",
      "prompt": "Pour le parcours sante de mars, tarek compte {b} paquets de {a} fraises. Combien de fraises ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-31",
      "prompt": "Pour le defi zero dechet de mars, a la gare : {b} bacs de {a} crayons. Combien de crayons ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-32",
      "prompt": "Pour l’atelier bricolage de mars, ferme : {b} cages de {a} animaux. Combien d’animaux ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-33",
      "prompt": "Pour la journee du sport de mars, senait range {b} boites de {a} chaises chacune. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-34",
      "prompt": "Pour la fete de l’ecole de avril, cantine : {b} plateaux de {a} verres. Combien de verres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-35",
      "prompt": "Pour le marche de Noel de avril, bibliotheque : {b} etageres de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-36",
      "prompt": "Pour la kermesse de avril, davide cree {b} piles de {a} eleves. Combien de eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-37",
      "prompt": "Pour le tournoi de printemps de avril, a la mairie, {b} sacs de {a} livres. Combien de livres transportes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-38",
      "prompt": "Pour la sortie au musee de avril, jeu : {b} equipes de {a} joueurs. Combien de joueurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-39",
      "prompt": "Pour l’atelier science de avril, asma imprime {b} pages de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-40",
      "prompt": "Pour la semaine du gout de avril, depot : {b} cartons de {a} oranges. Combien de oranges en depot ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-41",
      "prompt": "Pour la journee portes ouvertes de avril, marche : {b} cageots de {a} fruits. Combien de fruits ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-42",
      "prompt": "Pour la collecte solidaire de avril, dans le jardin : {b} tables de {a} bouteilles. Combien de bouteilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-43",
      "prompt": "Pour le challenge lecture de avril, claudia forme {b} groupes de {a} enfants. Combien d’enfants ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-44",
      "prompt": "Pour le projet jardin de avril, sport : {b} equipes de {a} joueurs. Combien d’athletes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-45",
      "prompt": "Pour l’expo photos de avril, labo : {b} plateaux de {a} tubes. Combien de tubes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-46",
      "prompt": "Pour le concert de fin d’annee de avril, walid emballe {b} sachets de {a} roses. Combien de roses ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-47",
      "prompt": "Pour la course d’orientation de avril, a la mairie, {b} casiers de {a} appartements. Combien de appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-48",
      "prompt": "Pour l’atelier cuisine de avril, expo : {b} panneaux de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-49",
      "prompt": "Pour le vide-grenier de avril, yohannes calcule {b} × {a} assiettes. Combien de assiettes obtient-on ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-50",
      "prompt": "Pour le stand de limonade de avril, recette : {b} moules de {a} produits. Combien de produits faut-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-51",
      "prompt": "Pour les olympiades sportives de avril, chaque album contient {a} timbres. Combien y a-t-il de timbres dans {b} albums ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-52",
      "prompt": "Pour le conte musical de avril, lorenzo prepare {b} pages de {a} photos. Combien de photos cela fait-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-53",
      "prompt": "Pour le rallye maths de avril, dans la classe, on aligne {b} rangees de {a} billes. Combien de billes au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-54",
      "prompt": "Pour la semaine bleue de avril, un carton renferme {a} stylos. Combien dans {b} cartons identiques ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-55",
      "prompt": "Pour la semaine verte de avril, malika achete {b} paquets. Chaque paquet a {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-56",
      "prompt": "Pour le festival du livre de avril, il y a {b} groupes. Dans chacune : {a} enfants. Quel est le total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-57",
      "prompt": "Pour {b} eleves, on donne {a} participants a chacun. Combien de participants faut-il  — l’atelier robotique de avril ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-58",
      "prompt": "Pour le club nature de avril, paulo construit {b} tours de {a} cubes. Combien de cubes utilise-t-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-59",
      "prompt": "Pour le marche aux fleurs de avril, a l’atelier bois : {b} boites × {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-60",
      "prompt": "Pour le parcours sante de avril, francesco remplit {b} sacs avec {a} fraises chacun. Combien de fraises en tout ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-61",
      "prompt": "Pour le defi zero dechet de avril, on range {b} tiroirs de {a} crayons. Combien de crayons ranges ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-62",
      "prompt": "Pour l’atelier bricolage de avril, nabil compte {b} lignes de {a} feuilles. Combien de feuilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-63",
      "prompt": "Pour la journee du sport de avril, table : {b} assiettes avec {a} chaises chacune. Combien de chaises ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-64",
      "prompt": "Pour la fete de l’ecole de mai, au zoo, {b} cageots de {a} choux. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-65",
      "prompt": "Pour le marche de Noel de mai, sipho pose {b} etageres de {a} joueurs. Combien de joueurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-66",
      "prompt": "Pour la kermesse de mai, classe : {b} eleves × {a} eleves. Combien de eleves distribues ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-67",
      "prompt": "Pour le tournoi de printemps de mai, jardin : {b} rangees de {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-68",
      "prompt": "Pour la sortie au musee de mai, kofi fabrique {b} boites de {a} cahiers. Combien de cahiers fabriques ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-69",
      "prompt": "Pour l’atelier science de mai, a l’atelier bois : {b} paniers de {a} pommes. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-70",
      "prompt": "Pour la semaine du gout de mai, rayon : {b} casiers de {a} oranges. Combien de oranges en rayon ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-71",
      "prompt": "Pour la journee portes ouvertes de mai, noa aligne {b} files de {a} verres. Combien de verres alignes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-72",
      "prompt": "Pour la collecte solidaire de mai, bus : {b} rangees de {a} sieges. Combien de sieges ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-73",
      "prompt": "Pour le challenge lecture de mai, atelier : {b} plateaux de {a} voitures. Combien de voitures ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-74",
      "prompt": "Pour le projet jardin de mai, sofia remplit {b} albums de {a} passagers. Combien de passagers ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-75",
      "prompt": "Pour l’expo photos de mai, a la mediatheque, {b} stands avec {a} cubes chacun. Combien de cubes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-76",
      "prompt": "Pour le concert de fin d’annee de mai, ecole : {b} classes de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-77",
      "prompt": "Pour la course d’orientation de mai, omar prepare {b} bouquets de {a} fleurs. Combien de fleurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-78",
      "prompt": "Pour l’atelier cuisine de mai, magasin : {b} cartons de {a} abeilles. Combien de abeilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-79",
      "prompt": "Pour le vide-grenier de mai, parking : {b} rangees de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-80",
      "prompt": "Pour le stand de limonade de mai, amina compte {b} paquets de {a} produits. Combien de produits ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-81",
      "prompt": "Pour les olympiades sportives de mai, a la gare : {b} bacs de {a} timbres. Combien de timbres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-82",
      "prompt": "Pour le conte musical de mai, ferme : {b} cages de {a} animaux. Combien d’animaux ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-83",
      "prompt": "Pour le rallye maths de mai, remi range {b} boites de {a} billes chacune. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-84",
      "prompt": "Pour la semaine bleue de mai, cantine : {b} plateaux de {a} verres. Combien de verres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-85",
      "prompt": "Pour la semaine verte de mai, bibliotheque : {b} etageres de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-86",
      "prompt": "Pour le festival du livre de mai, mia cree {b} piles de {a} enfants. Combien de enfants ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-87",
      "prompt": "Pour l’atelier robotique de mai, a la mairie, {b} sacs de {a} participants. Combien de participants transportes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-88",
      "prompt": "Pour le club nature de mai, jeu : {b} equipes de {a} joueurs. Combien de joueurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-89",
      "prompt": "Pour le marche aux fleurs de mai, adam imprime {b} pages de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-90",
      "prompt": "Pour le parcours sante de mai, depot : {b} cartons de {a} fraises. Combien de fraises en depot ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-91",
      "prompt": "Pour le defi zero dechet de mai, marche : {b} cageots de {a} fruits. Combien de fruits ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-92",
      "prompt": "Pour l’atelier bricolage de mai, dans le jardin : {b} tables de {a} feuilles. Combien de feuilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-93",
      "prompt": "Pour la journee du sport de mai, ana forme {b} groupes de {a} enfants. Combien d’enfants ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-94",
      "prompt": "Pour la fete de l’ecole de juin, sport : {b} equipes de {a} joueurs. Combien d’athletes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-95",
      "prompt": "Pour le marche de Noel de juin, labo : {b} plateaux de {a} tubes. Combien de tubes ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-96",
      "prompt": "Pour la kermesse de juin, selam emballe {b} sachets de {a} eleves. Combien de eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-97",
      "prompt": "Pour le tournoi de printemps de juin, a la mairie, {b} casiers de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-98",
      "prompt": "Pour la sortie au musee de juin, expo : {b} panneaux de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-99",
      "prompt": "Pour l’atelier science de juin, mariam calcule {b} × {a} pommes. Combien de pommes obtient-on ?",
      "op": "*"
    },
    {
      "id": "multiplication-facile-100",
      "prompt": "Pour la semaine du gout de juin, recette : {b} moules de {a} oranges. Combien de oranges faut-il ?",
      "op": "*"
    }
  ],
  "division:facile": [
    {
      "id": "division-facile-1",
      "prompt": "Pour le vide-grenier de juillet, on partage {a} billes entre {b} enfants, equitablement. Combien chacun recoit-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-2",
      "prompt": "Pour le stand de limonade de juillet, jalal range {a} cartes par groupes de {b}. Combien de groupes complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-3",
      "prompt": "Pour les olympiades sportives de juillet, il y a {a} feuilles a repartir dans des boites de {b}. Combien de boites faut-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-4",
      "prompt": "Pour le conte musical de juillet, a la mediatheque, {a} bonbons sont mis en paquets de {b}. Combien de paquets complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-5",
      "prompt": "Pour le rallye maths de juillet, on distribue {a} livres a {b} eleves egalement. Combien chacun en a-t-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-6",
      "prompt": "Pour la semaine bleue de juillet, eden forme des piles de {b} avec {a} oeufs. Combien de piles completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-7",
      "prompt": "Pour la semaine verte de juillet, on emballe {a} pommes dans des cartons de {b}. Combien de cartons complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-8",
      "prompt": "Pour le festival du livre de juillet, sur {a} crayons, on fait des lots de {b}. Combien de lots complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-9",
      "prompt": "Pour l’atelier robotique de juillet, au gymnase : partager {a} ballons en {b} parts egales. Combien par part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-10",
      "prompt": "Pour le club nature de juillet, serena divise {a} timbres en groupes de {b}. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-11",
      "prompt": "Pour le marche aux fleurs de juillet, repartir {a} photos dans {b} paniers egaux. Combien par panier ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-12",
      "prompt": "Pour le parcours sante de juillet, hana met {a} chaises en sachets de {b}. Combien de sachets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-13",
      "prompt": "Pour le defi zero dechet de juillet, au marche, {a} eleves en rangees de {b}. Combien de rangees completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-14",
      "prompt": "Pour l’atelier bricolage de juillet, partage equitable : {a} joueurs pour {b} enfants. Combien chacun ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-15",
      "prompt": "Pour la journee du sport de juillet, rania compte combien de boites de {b} dans {a} bouteilles. Combien de boites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-16",
      "prompt": "Pour la fete de l’ecole de aout, on range {a} cahiers par paquets de {b}. Combien de paquets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-17",
      "prompt": "Pour le marche de Noel de aout, classe : {a} enveloppes divises en {b} groupes. Combien par groupe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-18",
      "prompt": "Pour la kermesse de aout, au vestiaire : {a} pieces en files de {b}. Combien de files ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-19",
      "prompt": "Pour le tournoi de printemps de aout, patricia forme des equipes de {b} avec {a} gommes. Combien d’equipes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-20",
      "prompt": "Pour la sortie au musee de aout, cartons de {b} : combien pour ranger {a} stylos ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-21",
      "prompt": "Pour l’atelier science de aout, on coupe {a} billes en parts de {b}. Combien de parts completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-22",
      "prompt": "Pour la semaine du gout de aout, hamza repartit {a} cartes entre {b} casiers. Combien par casier ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-23",
      "prompt": "Pour la journee portes ouvertes de aout, dans le quartier, lots de {b} a partir de {a} feuilles. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-24",
      "prompt": "Pour la collecte solidaire de aout, piles de {b} bonbons : combien avec {a} ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-25",
      "prompt": "Pour le challenge lecture de aout, tesfay partage {a} livres en {b} parts. Combien dans chaque part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-26",
      "prompt": "Pour le projet jardin de aout, boites de {b} pour {a} oeufs. Combien de boites completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-27",
      "prompt": "Pour l’expo photos de aout, groupes de {b} eleves parmi {a} pommes. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-28",
      "prompt": "Pour le concert de fin d’annee de aout, a la mediatheque : distribution de {a} crayons a {b} tables. Combien par table ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-29",
      "prompt": "Pour la course d’orientation de aout, federica calcule {a} ÷ {b} pour des ballons. Quel quotient ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-30",
      "prompt": "Pour l’atelier cuisine de aout, sacs de {b} : combien pour {a} timbres ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-31",
      "prompt": "Pour le vide-grenier de aout, on aligne {a} photos par {b}. Combien d’alignements complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-32",
      "prompt": "Pour le stand de limonade de aout, soraya met {a} chaises en tiroirs de {b}. Combien de tiroirs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-33",
      "prompt": "Pour les olympiades sportives de aout, au gymnase, {a} eleves partages par {b}. Combien chacun recoit-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-34",
      "prompt": "Pour le conte musical de aout, paquets de {b} joueurs : nombre de paquets dans {a} ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-35",
      "prompt": "Pour le rallye maths de aout, isabel range {a} bouteilles en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-36",
      "prompt": "Pour la semaine bleue de aout, eleves : {a} cahiers pour {b} classes egales. Combien par classe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-37",
      "prompt": "Pour la semaine verte de aout, au marche : {a} enveloppes en paniers de {b}. Combien de paniers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-38",
      "prompt": "Pour le festival du livre de aout, anas divise {a} pieces par {b}. Combien obtient-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-39",
      "prompt": "Pour l’atelier robotique de aout, lots egaux de {b} a partir de {a} gommes. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-40",
      "prompt": "Pour le club nature de aout, on forme {b} equipes avec {a} stylos au total. Combien par equipe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-41",
      "prompt": "Pour le marche aux fleurs de aout, dans le quartier, conditionner {a} billes par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-42",
      "prompt": "Pour le parcours sante de aout, paulo compte les groupes de {b} dans {a} cartes. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-43",
      "prompt": "Pour le defi zero dechet de aout, partage : {a} feuilles ÷ {b}. Combien par personne ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-44",
      "prompt": "Pour l’atelier bricolage de aout, cartons fills de {b} : combien avec {a} bonbons ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-45",
      "prompt": "Pour la journee du sport de aout, roberta prepare des piles de {b} livres (total {a}). Combien de piles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-46",
      "prompt": "Pour la fete de l’ecole de septembre, a la mediatheque : {a} oeufs en {b} parts egales. Combien dans une part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-47",
      "prompt": "Pour le marche de Noel de septembre, rayons de {b} : combien pour {a} pommes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-48",
      "prompt": "Pour la kermesse de septembre, shirin emballe {a} crayons par paquets de {b}. Combien de paquets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-49",
      "prompt": "Pour le tournoi de printemps de septembre, distribution egale de {a} ballons a {b} eleves. Combien chacun ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-50",
      "prompt": "Pour la sortie au musee de septembre, combien de groupes de {b} dans {a} timbres a la piscine ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-51",
      "prompt": "Pour l’atelier science de septembre, on partage {a} photos entre {b} albums, equitablement. Combien chacun recoit-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-52",
      "prompt": "Pour la semaine du gout de septembre, kofi range {a} chaises par groupes de {b}. Combien de groupes complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-53",
      "prompt": "Pour la journee portes ouvertes de septembre, il y a {a} eleves a repartir dans des boites de {b}. Combien de boites faut-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-54",
      "prompt": "Pour la collecte solidaire de septembre, au vestiaire, {a} joueurs sont mis en paquets de {b}. Combien de paquets complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-55",
      "prompt": "Pour le challenge lecture de septembre, on distribue {a} bouteilles a {b} eleves egalement. Combien chacun en a-t-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-56",
      "prompt": "Pour le projet jardin de septembre, yousef forme des piles de {b} avec {a} cahiers. Combien de piles completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-57",
      "prompt": "Pour l’expo photos de septembre, on emballe {a} enveloppes dans des cartons de {b}. Combien de cartons complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-58",
      "prompt": "Pour le concert de fin d’annee de septembre, sur {a} pieces, on fait des lots de {b}. Combien de lots complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-59",
      "prompt": "Pour la course d’orientation de septembre, dans le quartier : partager {a} gommes en {b} parts egales. Combien par part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-60",
      "prompt": "Pour l’atelier cuisine de septembre, sara divise {a} stylos en groupes de {b}. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-61",
      "prompt": "Pour le vide-grenier de septembre, repartir {a} billes dans {b} paniers egaux. Combien par panier ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-62",
      "prompt": "Pour le stand de limonade de septembre, lea met {a} cartes en sachets de {b}. Combien de sachets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-63",
      "prompt": "Pour les olympiades sportives de septembre, au gymnase, {a} feuilles en rangees de {b}. Combien de rangees completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-64",
      "prompt": "Pour le conte musical de septembre, partage equitable : {a} bonbons pour {b} enfants. Combien chacun ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-65",
      "prompt": "Pour le rallye maths de septembre, bilal compte combien de boites de {b} dans {a} livres. Combien de boites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-66",
      "prompt": "Pour la semaine bleue de septembre, on range {a} oeufs par paquets de {b}. Combien de paquets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-67",
      "prompt": "Pour la semaine verte de septembre, classe : {a} pommes divises en {b} groupes. Combien par groupe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-68",
      "prompt": "Pour le festival du livre de septembre, a la piscine : {a} crayons en files de {b}. Combien de files ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-69",
      "prompt": "Pour l’atelier robotique de septembre, khalil forme des equipes de {b} avec {a} ballons. Combien d’equipes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-70",
      "prompt": "Pour le club nature de septembre, cartons de {b} : combien pour ranger {a} timbres ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-71",
      "prompt": "Pour le marche aux fleurs de septembre, on coupe {a} photos en parts de {b}. Combien de parts completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-72",
      "prompt": "Pour le parcours sante de septembre, nadia repartit {a} chaises entre {b} casiers. Combien par casier ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-73",
      "prompt": "Pour le defi zero dechet de septembre, au marche, lots de {b} a partir de {a} eleves. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-74",
      "prompt": "Pour l’atelier bricolage de septembre, piles de {b} joueurs : combien avec {a} ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-75",
      "prompt": "Pour la journee du sport de septembre, marco partage {a} bouteilles en {b} parts. Combien dans chaque part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-76",
      "prompt": "Pour la fete de l’ecole de octobre, boites de {b} pour {a} cahiers. Combien de boites completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-77",
      "prompt": "Pour le marche de Noel de octobre, groupes de {b} eleves parmi {a} enveloppes. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-78",
      "prompt": "Pour la kermesse de octobre, au vestiaire : distribution de {a} pieces a {b} tables. Combien par table ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-79",
      "prompt": "Pour le tournoi de printemps de octobre, amadou calcule {a} ÷ {b} pour des gommes. Quel quotient ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-80",
      "prompt": "Pour la sortie au musee de octobre, sacs de {b} : combien pour {a} stylos ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-81",
      "prompt": "Pour l’atelier science de octobre, on aligne {a} billes par {b}. Combien d’alignements complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-82",
      "prompt": "Pour la semaine du gout de octobre, hugo met {a} cartes en tiroirs de {b}. Combien de tiroirs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-83",
      "prompt": "Pour la journee portes ouvertes de octobre, dans le quartier, {a} feuilles partages par {b}. Combien chacun recoit-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-84",
      "prompt": "Pour la collecte solidaire de octobre, paquets de {b} bonbons : nombre de paquets dans {a} ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-85",
      "prompt": "Pour le challenge lecture de octobre, sami range {a} livres en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-86",
      "prompt": "Pour le projet jardin de octobre, eleves : {a} oeufs pour {b} classes egales. Combien par classe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-87",
      "prompt": "Pour l’expo photos de octobre, au gymnase : {a} pommes en paniers de {b}. Combien de paniers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-88",
      "prompt": "Pour le concert de fin d’annee de octobre, reza divise {a} crayons par {b}. Combien obtient-il ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-89",
      "prompt": "Pour la course d’orientation de octobre, lots egaux de {b} a partir de {a} ballons. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-90",
      "prompt": "Pour l’atelier cuisine de octobre, on forme {b} equipes avec {a} timbres au total. Combien par equipe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-91",
      "prompt": "Pour le vide-grenier de octobre, au marche, conditionner {a} photos par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-92",
      "prompt": "Pour le stand de limonade de octobre, chiara compte les groupes de {b} dans {a} chaises. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-93",
      "prompt": "Pour les olympiades sportives de octobre, partage : {a} eleves ÷ {b}. Combien par personne ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-94",
      "prompt": "Pour le conte musical de octobre, cartons fills de {b} : combien avec {a} joueurs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-95",
      "prompt": "Pour le rallye maths de octobre, zahra prepare des piles de {b} bouteilles (total {a}). Combien de piles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-96",
      "prompt": "Pour la semaine bleue de octobre, au vestiaire : {a} cahiers en {b} parts egales. Combien dans une part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-97",
      "prompt": "Pour la semaine verte de octobre, rayons de {b} : combien pour {a} enveloppes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-98",
      "prompt": "Pour le festival du livre de octobre, mustafa emballe {a} pieces par paquets de {b}. Combien de paquets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-99",
      "prompt": "Pour l’atelier robotique de octobre, distribution egale de {a} gommes a {b} eleves. Combien chacun ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-facile-100",
      "prompt": "Pour le club nature de octobre, combien de groupes de {b} dans {a} stylos a la mediatheque ?",
      "op": "/",
      "exact": true
    }
  ],
  "add-sub:facile": [
    {
      "id": "add-sub-facile-1",
      "prompt": "Pour la collecte solidaire de octobre, rania a {a} fleurs. Elle en recoit {b}, puis en donne {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-2",
      "prompt": "Pour le challenge lecture de octobre, sur le parking, on compte {a} puzzles. On en ajoute {b}, puis on en retire {c}. Combien en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-3",
      "prompt": "Pour le projet jardin de octobre, un stock de {a} tickets augmente de {b}, puis diminue de {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-4",
      "prompt": "Pour l’expo photos de octobre, rui commence avec {a} chats, gagne {b}, puis en utilise {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-5",
      "prompt": "Pour l’activite : {a} articles prets. On en apporte {b}, puis on en distribue {c}. Combien restent disponibles  — le concert de fin d’annee de octobre ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-6",
      "prompt": "Pour la course d’orientation de octobre, davide a l’atelier bois rassemble {a} verres, en trouve {b} de plus, puis en prete {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-7",
      "prompt": "Pour l’atelier cuisine de octobre, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-8",
      "prompt": "Pour le vide-grenier de octobre, bus : {a} passagers, {b} montent, puis {c} descendent. Combien reste-t-il de passagers ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-9",
      "prompt": "Pour le stand de limonade de octobre, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Combien restent disponibles ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-10",
      "prompt": "Pour les olympiades sportives de octobre, navid marque {a} points, en gagne {b}, puis en perd {c}. Quel score reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-11",
      "prompt": "Pour le conte musical de octobre, tesfay a {a} stylos, en achete {b}, puis en vend {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-12",
      "prompt": "Pour le rallye maths de octobre, a la gare : debut {a} bananes, arrivee de {b}, depart de {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-13",
      "prompt": "Pour la semaine bleue de octobre, reserve : {a} fleurs, livraison +{b}, sortie −{c}. Combien en reserve ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-14",
      "prompt": "Pour la semaine verte de octobre, matteo collectionne {a} puzzles, en recoit {b}, puis en offre {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-15",
      "prompt": "Pour le festival du livre de octobre, classe : {a} eleves presents, {b} arrivent, {c} partent. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-16",
      "prompt": "Pour l’atelier robotique de octobre, compte : {a} + {b} − {c} chats. Quel reste ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-17",
      "prompt": "Pour le club nature de octobre, iman prepare {a} articles, en ajoute {b}, puis en retire {c} abimes. Combien restent bons ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-18",
      "prompt": "Pour le marche aux fleurs de octobre, dans la classe, stock {a}, reappro {b}, vente {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-19",
      "prompt": "Pour le parcours sante de octobre, jeu : score {a}, bonus {b}, malus {c}. Quel score final ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-20",
      "prompt": "Pour le defi zero dechet de octobre, goncalo range {a} perles, en trouve {b}, puis en jette {c}. Combien restent ranges ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-21",
      "prompt": "Pour l’atelier bricolage de octobre, panier : {a} feuilles A4, +{b} du marche, −{c} mangés. Combien dans le panier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-22",
      "prompt": "Pour la journee du sport de octobre, file : {a} personnes, {b} arrivent, {c} sont servies. Combien restent en file ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-23",
      "prompt": "Pour la fete de l’ecole de novembre, alessandra a {a} tickets, en achete {b}, en utilise {c}. Combien de tickets restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-24",
      "prompt": "Pour le marche de Noel de novembre, a la mediatheque : {a} places, +{b} chaises, −{c} cassees. Combien de places restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-25",
      "prompt": "Pour la kermesse de novembre, depot : {a} colis, +{b} recus, −{c} expedies. Combien de colis restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-26",
      "prompt": "Pour le tournoi de printemps de novembre, parisa note {a} puzzles, ajoute {b}, retire {c}. Combien note-t-elle a la fin ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-27",
      "prompt": "Pour la sortie au musee de novembre, atelier : {a} pieces, +{b} produites, −{c} rebuts. Combien de pieces bonnes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-28",
      "prompt": "Pour l’atelier science de novembre, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-29",
      "prompt": "Pour la semaine du gout de novembre, au gymnase, inventaire {a} articles, entree {b}, sortie {c}. Combien en stock ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-30",
      "prompt": "Pour la journee portes ouvertes de novembre, francesco cumule {a} points, +{b}, puis −{c}. Quel total reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-31",
      "prompt": "Pour la collecte solidaire de novembre, stand : {a} briques, livraison {b}, ventes {c}. Combien restent au stand ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-32",
      "prompt": "Pour le challenge lecture de novembre, bus scolaire : {a} eleves, {b} montent, {c} descendent. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-33",
      "prompt": "Pour le projet jardin de novembre, zainab gere {a} feuilles A4, en recoit {b}, en envoie {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-34",
      "prompt": "Pour l’expo photos de novembre, a la piscine : sac de {a} fils, +{b}, −{c}. Combien dans le sac ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-35",
      "prompt": "Pour le concert de fin d’annee de novembre, magasin : stock {a}, arrivees {b}, ventes {c}. Combien en rayon ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-36",
      "prompt": "Pour la course d’orientation de novembre, nuno commence a {a}, ajoute {b} bananes, retire {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-37",
      "prompt": "Pour l’atelier cuisine de novembre, terrasse : {a} chaises, +{b}, −{c} rangees. Combien de chaises restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-38",
      "prompt": "Pour le vide-grenier de novembre, compte rendu : {a} puzzles, trouvailles {b}, pertes {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-39",
      "prompt": "Pour le stand de limonade de novembre, au marche, bac {a} tickets, remplissage {b}, prelevement {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-40",
      "prompt": "Pour les olympiades sportives de novembre, lina aligne {a} chats, en pose {b}, en enleve {c}. Combien restent alignes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-41",
      "prompt": "Pour le conte musical de novembre, club : {a} membres, +{b} inscriptions, −{c} departs. Combien de membres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-42",
      "prompt": "Pour le rallye maths de novembre, etagere : {a} livres, +{b} neufs, −{c} pretes. Combien sur l’etagere ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-43",
      "prompt": "Pour la semaine bleue de novembre, daryna a {a} briques en poche, en gagne {b}, en depense {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-44",
      "prompt": "Pour la semaine verte de novembre, au vestiaire : plateau {a} perles, ajout {b}, retrait {c}. Combien sur le plateau ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-45",
      "prompt": "Pour le festival du livre de novembre, jardin : {a} plants, +{b} plantes, −{c} deplaces. Combien restent ici ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-46",
      "prompt": "Pour l’atelier robotique de novembre, sara suit un solde : {a} + {b} − {c} fils. Quel solde ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-47",
      "prompt": "Pour le club nature de novembre, vestiaire : {a} casiers libres, +{b}, −{c} pris. Combien restent libres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-48",
      "prompt": "Pour le marche aux fleurs de novembre, labo : {a} tubes, +{b} livrés, −{c} utilises. Combien de tubes restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-49",
      "prompt": "Pour le parcours sante de novembre, dans le quartier, caisse {a} CHF, encaissements {b}, paiements {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-50",
      "prompt": "Pour le defi zero dechet de novembre, amina cloture : debut {a} puzzles, +{b}, −{c}. Combien a la cloture ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-51",
      "prompt": "Pour l’atelier bricolage de novembre, bilal a {a} tickets. Il en recoit {b}, puis en donne {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-52",
      "prompt": "Pour la journee du sport de novembre, dans le preau, on compte {a} chats. On en ajoute {b}, puis on en retire {c}. Combien en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-53",
      "prompt": "Pour la fete de l’ecole de decembre, un stock de {a} articles augmente de {b}, puis diminue de {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-54",
      "prompt": "Pour le marche de Noel de decembre, elsa commence avec {a} verres, gagne {b}, puis en utilise {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-55",
      "prompt": "Pour l’activite : {a} briques prets. On en apporte {b}, puis on en distribue {c}. Combien restent disponibles  — la kermesse de decembre ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-56",
      "prompt": "Pour le tournoi de printemps de decembre, mia au magasin rassemble {a} perles, en trouve {b} de plus, puis en prete {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-57",
      "prompt": "Pour la sortie au musee de decembre, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-58",
      "prompt": "Pour l’atelier science de decembre, bus : {a} passagers, {b} montent, puis {c} descendent. Combien reste-t-il de passagers ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-59",
      "prompt": "Pour la semaine du gout de decembre, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Combien restent disponibles ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-60",
      "prompt": "Pour la journee portes ouvertes de decembre, ines marque {a} points, en gagne {b}, puis en perd {c}. Quel score reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-61",
      "prompt": "Pour la collecte solidaire de decembre, marco a {a} fleurs, en achete {b}, puis en vend {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-62",
      "prompt": "Pour le challenge lecture de decembre, sur le parking : debut {a} puzzles, arrivee de {b}, depart de {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-63",
      "prompt": "Pour le projet jardin de decembre, reserve : {a} tickets, livraison +{b}, sortie −{c}. Combien en reserve ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-64",
      "prompt": "Pour l’expo photos de decembre, svitlana collectionne {a} chats, en recoit {b}, puis en offre {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-65",
      "prompt": "Pour le concert de fin d’annee de decembre, classe : {a} eleves presents, {b} arrivent, {c} partent. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-66",
      "prompt": "Pour la course d’orientation de decembre, compte : {a} + {b} − {c} verres. Quel reste ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-67",
      "prompt": "Pour l’atelier cuisine de decembre, yara prepare {a} briques, en ajoute {b}, puis en retire {c} abimes. Combien restent bons ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-68",
      "prompt": "Pour le vide-grenier de decembre, au terrain de sport, stock {a}, reappro {b}, vente {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-69",
      "prompt": "Pour le stand de limonade de decembre, jeu : score {a}, bonus {b}, malus {c}. Quel score final ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-70",
      "prompt": "Pour les olympiades sportives de decembre, ali range {a} fils, en trouve {b}, puis en jette {c}. Combien restent ranges ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-71",
      "prompt": "Pour le conte musical de decembre, panier : {a} stylos, +{b} du marche, −{c} mangés. Combien dans le panier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-72",
      "prompt": "Pour le rallye maths de decembre, file : {a} personnes, {b} arrivent, {c} sont servies. Combien restent en file ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-73",
      "prompt": "Pour la semaine bleue de decembre, aya a {a} tickets, en achete {b}, en utilise {c}. Combien de tickets restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-74",
      "prompt": "Pour la semaine verte de decembre, au vestiaire : {a} places, +{b} chaises, −{c} cassees. Combien de places restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-75",
      "prompt": "Pour le festival du livre de decembre, depot : {a} colis, +{b} recus, −{c} expedies. Combien de colis restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-76",
      "prompt": "Pour l’atelier robotique de decembre, rita note {a} chats, ajoute {b}, retire {c}. Combien note-t-elle a la fin ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-77",
      "prompt": "Pour le club nature de decembre, atelier : {a} pieces, +{b} produites, −{c} rebuts. Combien de pieces bonnes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-78",
      "prompt": "Pour le marche aux fleurs de decembre, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-79",
      "prompt": "Pour le parcours sante de decembre, dans le quartier, inventaire {a} briques, entree {b}, sortie {c}. Combien en stock ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-80",
      "prompt": "Pour le defi zero dechet de decembre, farid cumule {a} points, +{b}, puis −{c}. Quel total reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-81",
      "prompt": "Pour l’atelier bricolage de decembre, stand : {a} feuilles A4, livraison {b}, ventes {c}. Combien restent au stand ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-82",
      "prompt": "Pour la journee du sport de decembre, bus scolaire : {a} eleves, {b} montent, {c} descendent. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-83",
      "prompt": "Pour la fete de l’ecole de janvier, salma gere {a} stylos, en recoit {b}, en envoie {c}. Combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-84",
      "prompt": "Pour le marche de Noel de janvier, a la mediatheque : sac de {a} bananes, +{b}, −{c}. Combien dans le sac ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-85",
      "prompt": "Pour la kermesse de janvier, magasin : stock {a}, arrivees {b}, ventes {c}. Combien en rayon ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-86",
      "prompt": "Pour le tournoi de printemps de janvier, rustam commence a {a}, ajoute {b} puzzles, retire {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-87",
      "prompt": "Pour la sortie au musee de janvier, terrasse : {a} chaises, +{b}, −{c} rangees. Combien de chaises restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-88",
      "prompt": "Pour l’atelier science de janvier, compte rendu : {a} chats, trouvailles {b}, pertes {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-89",
      "prompt": "Pour la semaine du gout de janvier, au gymnase, bac {a} articles, remplissage {b}, prelevement {c}. Combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-90",
      "prompt": "Pour la journee portes ouvertes de janvier, samuel aligne {a} verres, en pose {b}, en enleve {c}. Combien restent alignes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-91",
      "prompt": "Pour la collecte solidaire de janvier, club : {a} membres, +{b} inscriptions, −{c} departs. Combien de membres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-92",
      "prompt": "Pour le challenge lecture de janvier, etagere : {a} livres, +{b} neufs, −{c} pretes. Combien sur l’etagere ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-93",
      "prompt": "Pour le projet jardin de janvier, joao a {a} feuilles A4 en poche, en gagne {b}, en depense {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-94",
      "prompt": "Pour l’expo photos de janvier, a la piscine : plateau {a} fils, ajout {b}, retrait {c}. Combien sur le plateau ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-95",
      "prompt": "Pour le concert de fin d’annee de janvier, jardin : {a} plants, +{b} plantes, −{c} deplaces. Combien restent ici ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-96",
      "prompt": "Pour la course d’orientation de janvier, serena suit un solde : {a} + {b} − {c} bananes. Quel solde ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-97",
      "prompt": "Pour l’atelier cuisine de janvier, vestiaire : {a} casiers libres, +{b}, −{c} pris. Combien restent libres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-98",
      "prompt": "Pour le vide-grenier de janvier, labo : {a} tubes, +{b} livrés, −{c} utilises. Combien de tubes restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-99",
      "prompt": "Pour le stand de limonade de janvier, au marche, caisse {a} CHF, encaissements {b}, paiements {c}. Combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-facile-100",
      "prompt": "Pour les olympiades sportives de janvier, tarek cloture : debut {a} chats, +{b}, −{c}. Combien a la cloture ?",
      "op": "+-"
    }
  ],
  "melange:facile": [
    {
      "id": "melange-facile-1",
      "prompt": "Pour la semaine bleue de juillet, yohannes achete {b} boites de {a} crayons, puis en offre {c}. Combien lui en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-2",
      "prompt": "Pour la semaine verte de juillet, dans l’atelier, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-3",
      "prompt": "Pour le festival du livre de juillet, isabel a {a} poissons. Isabel recoit encore {b} paquets de {c} poissons. Combien en a-t-il au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-4",
      "prompt": "Pour l’atelier robotique de juillet, on prepare {a} sacs, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-5",
      "prompt": "Pour le club nature de juillet, alessandra paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-6",
      "prompt": "Pour le marche aux fleurs de juillet, depot : {a} perles. On envoie {b} cartons de {c} perles. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-7",
      "prompt": "Pour le parcours sante de juillet, au centre aere, {a} rangees de {b} pinceaux, puis on en retire {c}. Combien en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-8",
      "prompt": "Pour le defi zero dechet de juillet, parisa collectionne {a} crayons par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-9",
      "prompt": "Pour l’atelier bricolage de juillet, fete : {a} eleves apportent chacun {b} poires. On en utilise {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-10",
      "prompt": "Pour la journee du sport de juillet, paulo a la bibliotheque reunit {a} tulipes et {b} tulipes, puis partage en {c} lots egaux. Combien par lot ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-11",
      "prompt": "Pour la fete de l’ecole de aout, filipa fabrique {b} boites de {a} balles, puis en casse {c}. Combien de balles restent intacts ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-12",
      "prompt": "Pour le marche de Noel de aout, commande : {a} oiseaux unitaires et {b} lots de {c}. Combien d’unites au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-13",
      "prompt": "Pour la kermesse de aout, roberta prepare {b} sacs de {a} articles, puis en prete {c}. Combien lui en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-14",
      "prompt": "Pour le tournoi de printemps de aout, dans le preau : {b} tables de {a} serviettes, moins {c} retires. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-15",
      "prompt": "Pour la sortie au musee de aout, zainab a {a} bulbes et achete {b} boites de {c}. Combien en a-t-elle ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-16",
      "prompt": "Pour l’atelier science de aout, stock {a} classeurs + {b}, puis division en {c} parts. Combien par part ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-17",
      "prompt": "Pour la semaine du gout de aout, caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-18",
      "prompt": "Pour la journee portes ouvertes de aout, reserve {a} figurines, sortie de {b} paquets de {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-19",
      "prompt": "Pour la collecte solidaire de aout, mariana aligne {b} files de {a} pains, puis enleve {c}. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-20",
      "prompt": "Pour le challenge lecture de aout, club : {b} equipes de {a}, puis {c} absents. Combien de presents ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-21",
      "prompt": "Pour le projet jardin de aout, a la recreation, {a} passagers deja la, plus {b} cartons de {c}. Combien en tout ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-22",
      "prompt": "Pour l’expo photos de aout, lina cumule {a} et {b} feuilles, puis forme des groupes de {c}. Combien de groupes ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-23",
      "prompt": "Pour le concert de fin d’annee de aout, atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-24",
      "prompt": "Pour la course d’orientation de aout, ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-25",
      "prompt": "Pour l’atelier cuisine de aout, daryna gagne {a} × {b} points, puis en perd {c}. Quel score ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-26",
      "prompt": "Pour le vide-grenier de aout, dans la cour : {b} stands de {a} rouleaux, on en retire {c}. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-27",
      "prompt": "Pour le stand de limonade de aout, depot {a} stylos − {b} × {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-28",
      "prompt": "Pour les olympiades sportives de aout, sara recoit {a} bonbons + {b} sacs de {c}. Combien au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-29",
      "prompt": "Pour le conte musical de aout, partage : ({a} + {b}) plants en {c} parts. Combien par part ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-30",
      "prompt": "Pour le rallye maths de aout, bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-31",
      "prompt": "Pour la semaine bleue de aout, sam emballe {b} colis de {a} poissons, puis en ouvre {c}. Combien restent fermes (en poissons) ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-32",
      "prompt": "Pour la semaine verte de aout, dans l’atelier, inventaire {a} + {b} lots de {c} sacs. Combien d’unites ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-33",
      "prompt": "Pour le festival du livre de aout, bilal additionne {a} et {b} CHF, divise par {c}. Combien chacun ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-34",
      "prompt": "Pour l’atelier robotique de aout, magasin : {a} articles − {b} packs de {c}. Combien restent ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-35",
      "prompt": "Pour le club nature de aout, jardin : {b} planches de {a} plants, {c} deplaces. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-36",
      "prompt": "Pour le marche aux fleurs de aout, elsa a {a} crayons, plus {b} × {c}. Combien en tout ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-37",
      "prompt": "Pour le parcours sante de aout, collecte ({a} + {b}) poires repartie en {c} bacs. Combien par bac ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-38",
      "prompt": "Pour le defi zero dechet de aout, a la piscine : {b} cages de {a} animaux, {c} liberés. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-39",
      "prompt": "Pour l’atelier bricolage de aout, tom produit {b} series de {a} balles, en donne {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-40",
      "prompt": "Pour la journee du sport de aout, commande mixte : {a} unitaires + {b} × {c}. Combien d’unites ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-41",
      "prompt": "Pour la fete de l’ecole de septembre, caisse club : {a} + {b}, partage en {c}. Combien par membre ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-42",
      "prompt": "Pour le marche de Noel de septembre, entrepot {a} serviettes moins {b} palettes de {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-43",
      "prompt": "Pour la kermesse de septembre, marco forme {b} groupes de {a}, puis {c} se retirent. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-44",
      "prompt": "Pour le tournoi de printemps de septembre, dans le preau, {a} classeurs + {b} boites de {c}. Combien au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-45",
      "prompt": "Pour la sortie au musee de septembre, ana reunit {a} et {b} aiguilles, divise en {c}. Combien par lot ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-46",
      "prompt": "Pour l’atelier science de septembre, usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-47",
      "prompt": "Pour la semaine du gout de septembre, stock initial {a}, retrait {b} × {c} pains. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-48",
      "prompt": "Pour la journee portes ouvertes de septembre, selam calcule {b} semaines × {a} puzzles, moins {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-49",
      "prompt": "Pour la collecte solidaire de septembre, a l’ecole : {a} deja stockes + {b} packs de {c}. Combien en stock ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-50",
      "prompt": "Pour le challenge lecture de septembre, hugo cloture ({a} + {b}) ÷ {c} feuilles. Combien par part ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-51",
      "prompt": "Pour le projet jardin de septembre, mariam achete {b} albums de {a} timbres, puis en offre {c}. Combien lui en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-52",
      "prompt": "Pour l’expo photos de septembre, au magasin, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-53",
      "prompt": "Pour le concert de fin d’annee de septembre, sami a {a} ficelles. Sami recoit encore {b} paquets de {c} ficelles. Combien en a-t-il au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-54",
      "prompt": "Pour la course d’orientation de septembre, on prepare {a} rouleaux, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-55",
      "prompt": "Pour l’atelier cuisine de septembre, aya paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-56",
      "prompt": "Pour le vide-grenier de septembre, depot : {a} bonbons. On envoie {b} cartons de {c} bonbons. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-57",
      "prompt": "Pour le stand de limonade de septembre, au zoo, {a} rangees de {b} plants, puis on en retire {c}. Combien en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-58",
      "prompt": "Pour les olympiades sportives de septembre, rita collectionne {a} points par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-59",
      "prompt": "Pour le conte musical de septembre, fete : {a} eleves apportent chacun {b} poissons. On en utilise {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-60",
      "prompt": "Pour le rallye maths de septembre, chiara a la mairie reunit {a} sacs et {b} sacs, puis partage en {c} lots egaux. Combien par lot ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-61",
      "prompt": "Pour la semaine bleue de septembre, hassan fabrique {b} boites de {a} clous, puis en casse {c}. Combien de clous restent intacts ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-62",
      "prompt": "Pour la semaine verte de septembre, commande : {a} perles unitaires et {b} lots de {c}. Combien d’unites au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-63",
      "prompt": "Pour le festival du livre de septembre, zahra prepare {b} sacs de {a} pinceaux, puis en prete {c}. Combien lui en reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-64",
      "prompt": "Pour l’atelier robotique de septembre, sur le parking : {b} tables de {a} crayons, moins {c} retires. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-65",
      "prompt": "Pour le club nature de septembre, salma a {a} poires et achete {b} boites de {c}. Combien en a-t-elle ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-66",
      "prompt": "Pour le marche aux fleurs de septembre, stock {a} tulipes + {b}, puis division en {c} parts. Combien par part ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-67",
      "prompt": "Pour le parcours sante de septembre, caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-68",
      "prompt": "Pour le defi zero dechet de septembre, reserve {a} oiseaux, sortie de {b} paquets de {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-69",
      "prompt": "Pour l’atelier bricolage de septembre, murat aligne {b} files de {a} articles, puis enleve {c}. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-70",
      "prompt": "Pour la journee du sport de septembre, club : {b} equipes de {a}, puis {c} absents. Combien de presents ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-71",
      "prompt": "Pour la fete de l’ecole de octobre, dans le bus, {a} bulbes deja la, plus {b} cartons de {c}. Combien en tout ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-72",
      "prompt": "Pour le marche de Noel de octobre, samuel cumule {a} et {b} classeurs, puis forme des groupes de {c}. Combien de groupes ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-73",
      "prompt": "Pour la kermesse de octobre, atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-74",
      "prompt": "Pour le tournoi de printemps de octobre, ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-75",
      "prompt": "Pour la sortie au musee de octobre, joao gagne {a} × {b} points, puis en perd {c}. Quel score ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-76",
      "prompt": "Pour l’atelier science de octobre, au terrain de sport : {b} stands de {a} puzzles, on en retire {c}. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-77",
      "prompt": "Pour la semaine du gout de octobre, depot {a} passagers − {b} × {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-78",
      "prompt": "Pour la journee portes ouvertes de octobre, serena recoit {a} feuilles + {b} sacs de {c}. Combien au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-79",
      "prompt": "Pour la collecte solidaire de octobre, partage : ({a} + {b}) bouteilles en {c} parts. Combien par part ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-80",
      "prompt": "Pour le challenge lecture de octobre, bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-81",
      "prompt": "Pour le projet jardin de octobre, maya emballe {b} colis de {a} ficelles, puis en ouvre {c}. Combien restent fermes (en ficelles) ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-82",
      "prompt": "Pour l’expo photos de octobre, au magasin, inventaire {a} + {b} lots de {c} rouleaux. Combien d’unites ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-83",
      "prompt": "Pour le concert de fin d’annee de octobre, rania additionne {a} et {b} CHF, divise par {c}. Combien chacun ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-84",
      "prompt": "Pour la course d’orientation de octobre, magasin : {a} articles − {b} packs de {c}. Combien restent ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-85",
      "prompt": "Pour l’atelier cuisine de octobre, jardin : {b} planches de {a} plants, {c} deplaces. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-86",
      "prompt": "Pour le vide-grenier de octobre, rui a {a} points, plus {b} × {c}. Combien en tout ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-87",
      "prompt": "Pour le stand de limonade de octobre, collecte ({a} + {b}) poissons repartie en {c} bacs. Combien par bac ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-88",
      "prompt": "Pour les olympiades sportives de octobre, au vestiaire : {b} cages de {a} animaux, {c} liberés. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-89",
      "prompt": "Pour le conte musical de octobre, laura produit {b} series de {a} clous, en donne {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-90",
      "prompt": "Pour le rallye maths de octobre, commande mixte : {a} unitaires + {b} × {c}. Combien d’unites ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-91",
      "prompt": "Pour la semaine bleue de octobre, caisse club : {a} + {b}, partage en {c}. Combien par membre ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-92",
      "prompt": "Pour la semaine verte de octobre, entrepot {a} crayons moins {b} palettes de {c}. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-93",
      "prompt": "Pour le festival du livre de octobre, tesfay forme {b} groupes de {a}, puis {c} se retirent. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-94",
      "prompt": "Pour l’atelier robotique de octobre, sur le parking, {a} tulipes + {b} boites de {c}. Combien au total ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-95",
      "prompt": "Pour le club nature de octobre, claudia reunit {a} et {b} balles, divise en {c}. Combien par lot ?",
      "op": "++/"
    },
    {
      "id": "melange-facile-96",
      "prompt": "Pour le marche aux fleurs de octobre, usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-97",
      "prompt": "Pour le parcours sante de octobre, stock initial {a}, retrait {b} × {c} articles. Combien reste-t-il ?",
      "op": "-*"
    },
    {
      "id": "melange-facile-98",
      "prompt": "Pour le defi zero dechet de octobre, walid calcule {b} semaines × {a} serviettes, moins {c}. Combien reste-t-il ?",
      "op": "*-"
    },
    {
      "id": "melange-facile-99",
      "prompt": "Pour l’atelier bricolage de octobre, a la cantine : {a} deja stockes + {b} packs de {c}. Combien en stock ?",
      "op": "+*"
    },
    {
      "id": "melange-facile-100",
      "prompt": "Pour la journee du sport de octobre, soraya cloture ({a} + {b}) ÷ {c} classeurs. Combien par part ?",
      "op": "++/"
    }
  ],
  "addition:moyen": [
    {
      "id": "addition-moyen-1",
      "prompt": "Pour la collecte solidaire de octobre, a l’ecole, l’equipe a deja {a} stylos. Elle en recoit {b}. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-2",
      "prompt": "Pour le challenge lecture de octobre, durant la matinee : {a} figurines. L’apres-midi : {b} de plus. Quel est le cumul ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-3",
      "prompt": "Pour le projet jardin de octobre, yousef possede {a} poires et en achete {b} au magasin. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-4",
      "prompt": "Pour l’expo photos de octobre, inventaire : {a} bonbons en rayon + {b} venus de la reserve. Combien en rayon ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-5",
      "prompt": "Pour le concert de fin d’annee de octobre, commande de {a} pains, puis complement de {b}. Combien ont ete commandes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-6",
      "prompt": "Pour la course d’orientation de octobre, le club compte {a} tulipes, puis encore {b}. Quel total obtient-on ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-7",
      "prompt": "Pour l’atelier cuisine de octobre, sara range {a} plants lundi et {b} mardi. Combien sur deux jours ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-8",
      "prompt": "Pour le vide-grenier de octobre, le depot part avec {a} puzzles. Un camion apporte {b}. Combien le depot contient-il ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-9",
      "prompt": "Pour le stand de limonade de octobre, au stand : {a} balles disponibles + {b} sortis des cartons. Combien de disponibles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-10",
      "prompt": "Pour les olympiades sportives de octobre, deux classes apportent {a} et {b} points. Combien reunissent-elles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-11",
      "prompt": "Pour le conte musical de octobre, a la boulangerie, on enregistre {a} passagers avant midi et {b} apres. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-12",
      "prompt": "Pour le rallye maths de octobre, bilal collecte {a} oiseaux le matin et recueille {b} l’apres-midi. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-13",
      "prompt": "Pour la semaine bleue de octobre, bilan hebdomadaire : {a} poissons la premiere moitie, {b} la seconde. Quel cumul ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-14",
      "prompt": "Pour la semaine verte de octobre, le service a traite {a} dossiers puis {b} dossiers. Combien de dossiers traites ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-15",
      "prompt": "Pour le festival du livre de octobre, elsa prepare {a} articles pour le site nord et {b} pour le site sud. Combien prepares ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-16",
      "prompt": "Pour l’atelier robotique de octobre, reception : {a} colis le matin, {b} l’apres-midi. Combien de colis recus ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-17",
      "prompt": "Pour le club nature de octobre, dans le quartier : stock {a} bouteilles, reappro {b}. Combien apres reapprovisionnement ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-18",
      "prompt": "Pour le marche aux fleurs de octobre, tournoi : {a} points avant la pause, {b} apres. Quel score cumule ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-19",
      "prompt": "Pour le parcours sante de octobre, nadia inscrit {a} participants puis {b} autres. Combien d’inscriptions ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-20",
      "prompt": "Pour le defi zero dechet de octobre, atelier : {a} pieces terminees, puis {b} pieces. Combien de pieces terminees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-21",
      "prompt": "Pour l’atelier bricolage de octobre, la bibliotheque recoit {a} livres neufs et {b} dons. Combien de nouveaux livres ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-22",
      "prompt": "Pour la journee du sport de octobre, au vestiaire, collecte : {a} perles le samedi, {b} le dimanche. Combien collectes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-23",
      "prompt": "Pour la fete de l’ecole de novembre, giulia ajoute {b} ficelles a un lot de {a}. Quel est le nouveau lot ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-24",
      "prompt": "Pour le marche de Noel de novembre, production : {a} unites avant controle, {b} apres. Combien d’unites ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-25",
      "prompt": "Pour la kermesse de novembre, deux livraisons : {a} puis {b} pinceaux. Combien livres au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-26",
      "prompt": "Pour le tournoi de printemps de novembre, le magasin affiche {a} ventes le matin et {b} l’apres-midi. Combien de ventes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-27",
      "prompt": "Pour la sortie au musee de novembre, selam cumule {a} aiguilles en semaine et {b} le week-end. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-28",
      "prompt": "Pour l’atelier science de novembre, au magasin : premiere seance {a} crayons, seconde seance {b}. Combien utilises ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-29",
      "prompt": "Pour la semaine du gout de novembre, compte rendu : {a} stylos deja comptes + {b} trouves ensuite. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-30",
      "prompt": "Pour la journee portes ouvertes de novembre, mariam fusionne un tas de {a} figurines avec un tas de {b}. Combien dans le tas final ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-31",
      "prompt": "Pour la collecte solidaire de novembre, reserve centrale : {a} poires. Annexe : +{b}. Combien dans le reseau ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-32",
      "prompt": "Pour le challenge lecture de novembre, evenement : {a} entrees avant 14 h, {b} apres. Combien d’entrees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-33",
      "prompt": "Pour le projet jardin de novembre, au zoo, chantier : {a} briques posees, puis {b}. Combien de briques posees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-34",
      "prompt": "Pour l’expo photos de novembre, aya note {a} tulipes au premier inventaire et {b} au second. Combien notes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-35",
      "prompt": "Pour le concert de fin d’annee de novembre, campagne : {a} tracts distribues le matin, {b} l’apres-midi. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-36",
      "prompt": "Pour la course d’orientation de novembre, deux rayons : {a} puzzles et {b} puzzles. Combien d’articles sur les rayons ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-37",
      "prompt": "Pour l’atelier cuisine de novembre, rita recoit {a} balles d’un partenaire et {b} d’un autre. Combien recoit-il ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-38",
      "prompt": "Pour le vide-grenier de novembre, dans l’atelier : stock mort {a} reactive + {b} neufs. Combien disponibles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-39",
      "prompt": "Pour le stand de limonade de novembre, semaine 1 : {a} passagers. Semaine 2 : {b}. Combien sur les deux semaines ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-40",
      "prompt": "Pour les olympiades sportives de novembre, hassan assemble {a} modules puis {b} modules. Combien de modules ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-41",
      "prompt": "Pour le conte musical de novembre, depot glacial : {a} poissons deja stockes, livraison de {b}. Combien stockes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-42",
      "prompt": "Pour le rallye maths de novembre, club lecture : {a} livres lus, plus {b}. Combien de livres lus ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-43",
      "prompt": "Pour la semaine bleue de novembre, au centre aere, laboratoire : {a} echantillons, puis {b}. Combien d’echantillons ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-44",
      "prompt": "Pour la semaine verte de novembre, salma valide {a} tickets puis {b} tickets. Combien de tickets valides ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-45",
      "prompt": "Pour le festival du livre de novembre, matinee sportive : {a} medailles, apres-midi {b}. Combien de medailles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-46",
      "prompt": "Pour l’atelier robotique de novembre, deux ateliers produisent {a} et {b} serviettes. Combien produits ensemble ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-47",
      "prompt": "Pour le club nature de novembre, rustam cumule {a} clous avant correction et {b} apres. Combien apres correction ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-48",
      "prompt": "Pour le marche aux fleurs de novembre, a l’atelier bois : premiere livraison {a}, seconde {b} seaux. Total livre ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-49",
      "prompt": "Pour le parcours sante de novembre, bilan du mois : {a} bulbes + {b} bulbes. Quel est le total mensuel ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-50",
      "prompt": "Pour le defi zero dechet de novembre, olivia consolide {a} perles du lot A et {b} du lot B. Combien consolides ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-51",
      "prompt": "Pour l’atelier bricolage de novembre, a la cantine, l’equipe a deja {a} ficelles. Elle en recoit {b}. Combien en a-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-52",
      "prompt": "Pour la journee du sport de novembre, durant la matinee : {a} classeurs. L’apres-midi : {b} de plus. Quel est le cumul ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-53",
      "prompt": "Pour la fete de l’ecole de decembre, eden possede {a} pinceaux et en achete {b} au magasin. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-54",
      "prompt": "Pour le marche de Noel de decembre, inventaire : {a} rouleaux en rayon + {b} venus de la reserve. Combien en rayon ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-55",
      "prompt": "Pour la kermesse de decembre, commande de {a} aiguilles, puis complement de {b}. Combien ont ete commandes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-56",
      "prompt": "Pour le tournoi de printemps de decembre, le club compte {a} crayons, puis encore {b}. Quel total obtient-on ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-57",
      "prompt": "Pour la sortie au musee de decembre, serena range {a} stylos lundi et {b} mardi. Combien sur deux jours ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-58",
      "prompt": "Pour l’atelier science de decembre, le depot part avec {a} figurines. Un camion apporte {b}. Combien le depot contient-il ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-59",
      "prompt": "Pour la semaine du gout de decembre, au stand : {a} poires disponibles + {b} sortis des cartons. Combien de disponibles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-60",
      "prompt": "Pour la journee portes ouvertes de decembre, deux classes apportent {a} et {b} bonbons. Combien reunissent-elles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-61",
      "prompt": "Pour la collecte solidaire de decembre, a l’ecole, on enregistre {a} pains avant midi et {b} apres. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-62",
      "prompt": "Pour le challenge lecture de decembre, rania collecte {a} tulipes le matin et recupere {b} l’apres-midi. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-63",
      "prompt": "Pour le projet jardin de decembre, bilan hebdomadaire : {a} plants la premiere moitie, {b} la seconde. Quel cumul ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-64",
      "prompt": "Pour l’expo photos de decembre, le service a traite {a} dossiers puis {b} dossiers. Combien de dossiers traites ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-65",
      "prompt": "Pour le concert de fin d’annee de decembre, rui prepare {a} balles pour le site nord et {b} pour le site sud. Combien prepares ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-66",
      "prompt": "Pour la course d’orientation de decembre, reception : {a} colis le matin, {b} l’apres-midi. Combien de colis recus ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-67",
      "prompt": "Pour l’atelier cuisine de decembre, au gymnase : stock {a} passagers, reappro {b}. Combien apres reapprovisionnement ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-68",
      "prompt": "Pour le vide-grenier de decembre, tournoi : {a} points avant la pause, {b} apres. Quel score cumule ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-69",
      "prompt": "Pour le stand de limonade de decembre, hamza inscrit {a} participants puis {b} autres. Combien d’inscriptions ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-70",
      "prompt": "Pour les olympiades sportives de decembre, atelier : {a} pieces terminees, puis {b} pieces. Combien de pieces terminees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-71",
      "prompt": "Pour le conte musical de decembre, la bibliotheque recoit {a} livres neufs et {b} dons. Combien de nouveaux livres ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-72",
      "prompt": "Pour le rallye maths de decembre, a la mediatheque, collecte : {a} sacs le samedi, {b} le dimanche. Combien collectes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-73",
      "prompt": "Pour la semaine bleue de decembre, diogo ajoute {b} bouteilles a un lot de {a}. Quel est le nouveau lot ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-74",
      "prompt": "Pour la semaine verte de decembre, production : {a} unites avant controle, {b} apres. Combien d’unites ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-75",
      "prompt": "Pour le festival du livre de decembre, deux livraisons : {a} puis {b} clous. Combien livres au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-76",
      "prompt": "Pour l’atelier robotique de decembre, le magasin affiche {a} ventes le matin et {b} l’apres-midi. Combien de ventes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-77",
      "prompt": "Pour le club nature de decembre, walid cumule {a} bulbes en semaine et {b} le week-end. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-78",
      "prompt": "Pour le marche aux fleurs de decembre, a l’atelier bois : premiere seance {a} perles, seconde seance {b}. Combien utilises ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-79",
      "prompt": "Pour le parcours sante de decembre, compte rendu : {a} ficelles deja comptes + {b} trouves ensuite. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-80",
      "prompt": "Pour le defi zero dechet de decembre, yohannes fusionne un tas de {a} classeurs avec un tas de {b}. Combien dans le tas final ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-81",
      "prompt": "Pour l’atelier bricolage de decembre, reserve centrale : {a} pinceaux. Annexe : +{b}. Combien dans le reseau ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-82",
      "prompt": "Pour la journee du sport de decembre, evenement : {a} entrees avant 14 h, {b} apres. Combien d’entrees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-83",
      "prompt": "Pour la fete de l’ecole de janvier, au parc, chantier : {a} briques posees, puis {b}. Combien de briques posees ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-84",
      "prompt": "Pour le marche de Noel de janvier, alessandra note {a} crayons au premier inventaire et {b} au second. Combien notes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-85",
      "prompt": "Pour la kermesse de janvier, campagne : {a} tracts distribues le matin, {b} l’apres-midi. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-86",
      "prompt": "Pour le tournoi de printemps de janvier, deux rayons : {a} figurines et {b} figurines. Combien d’articles sur les rayons ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-87",
      "prompt": "Pour la sortie au musee de janvier, parisa recoit {a} poires d’un partenaire et {b} d’un autre. Combien recoit-il ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-88",
      "prompt": "Pour l’atelier science de janvier, au magasin : stock mort {a} reactive + {b} neufs. Combien disponibles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-89",
      "prompt": "Pour la semaine du gout de janvier, semaine 1 : {a} pains. Semaine 2 : {b}. Combien sur les deux semaines ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-90",
      "prompt": "Pour la journee portes ouvertes de janvier, filipa assemble {a} modules puis {b} modules. Combien de modules ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-91",
      "prompt": "Pour la collecte solidaire de janvier, depot glacial : {a} plants deja stockes, livraison de {b}. Combien stockes ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-92",
      "prompt": "Pour le challenge lecture de janvier, club lecture : {a} livres lus, plus {b}. Combien de livres lus ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-93",
      "prompt": "Pour le projet jardin de janvier, au zoo, laboratoire : {a} echantillons, puis {b}. Combien d’echantillons ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-94",
      "prompt": "Pour l’expo photos de janvier, zainab valide {a} tickets puis {b} tickets. Combien de tickets valides ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-95",
      "prompt": "Pour le concert de fin d’annee de janvier, matinee sportive : {a} medailles, apres-midi {b}. Combien de medailles ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-96",
      "prompt": "Pour la course d’orientation de janvier, deux ateliers produisent {a} et {b} oiseaux. Combien produits ensemble ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-97",
      "prompt": "Pour l’atelier cuisine de janvier, nuno cumule {a} poissons avant correction et {b} apres. Combien apres correction ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-98",
      "prompt": "Pour le vide-grenier de janvier, dans l’atelier : premiere livraison {a}, seconde {b} feuilles. Total livre ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-99",
      "prompt": "Pour le stand de limonade de janvier, bilan du mois : {a} articles + {b} articles. Quel est le total mensuel ?",
      "op": "+"
    },
    {
      "id": "addition-moyen-100",
      "prompt": "Pour les olympiades sportives de janvier, aissatou consolide {a} sacs du lot A et {b} du lot B. Combien consolides ?",
      "op": "+"
    }
  ],
  "soustraction:moyen": [
    {
      "id": "soustraction-moyen-1",
      "prompt": "Pour la semaine du gout de novembre, a la bibliotheque, l’equipe dispose de {a} poires. Apres distribution, {b} ont ete donnes. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-2",
      "prompt": "Pour la journee portes ouvertes de novembre, nadia commence avec {a} croissants. Avant midi, elle en retire {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-3",
      "prompt": "Pour la collecte solidaire de novembre, inventaire : {a} roses. On retire {b} abimes. Combien restent utilisables ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-4",
      "prompt": "Pour le challenge lecture de novembre, la billetterie avait {a} tickets. Elle en vend {b}. Combien de tickets reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-5",
      "prompt": "Pour le projet jardin de novembre, un depot part avec {a} medailles. Un client en commande {b}. Combien conserve-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-6",
      "prompt": "Pour l’expo photos de novembre, giulia avait {a} points. Elle en perd {b} au second tour. Quel score reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-7",
      "prompt": "Pour le tournoi, {a} ballons etaient prevus. {b} se degonflent. Combien restent utilisables  — le concert de fin d’annee de novembre ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-8",
      "prompt": "Pour la course d’orientation de novembre, bibliotheque : {a} livres, dont {b} sortent en pret. Combien restent sur place ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-9",
      "prompt": "Pour l’atelier cuisine de novembre, au stand, {a} paniers exposes. On en retire {b} pour un autre stand. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-10",
      "prompt": "Pour le vide-grenier de novembre, entre deux controles, le compte baisse de {b} a partir de {a} serviettes. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-11",
      "prompt": "Pour le stand de limonade de novembre, a la bibliotheque, {a} briques sont reserves. On en annule {b}. Combien de reservations restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-12",
      "prompt": "Pour les olympiades sportives de novembre, hugo calcule un reste : {a} cailloux moins {b} utilises. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-13",
      "prompt": "Pour le conte musical de novembre, service apres-vente : {a} dossiers, {b} clos. Combien restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-14",
      "prompt": "Pour le rallye maths de novembre, stock saisonnier : {a} feutres, soldes de {b}. Combien restent hors solde ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-15",
      "prompt": "Pour la semaine bleue de novembre, sami transferait {b} bobines depuis un lot de {a}. Combien restent sur place ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-16",
      "prompt": "Pour la semaine verte de novembre, au club de sport : effectif {a}, absences {b}. Combien de presents ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-17",
      "prompt": "Pour le festival du livre de novembre, atelier : {a} pieces lancees, {b} rebuts. Combien de pieces bonnes ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-18",
      "prompt": "Pour l’atelier robotique de novembre, campagne : {a} tracts, {b} deja distribues. Combien restent a distribuer ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-19",
      "prompt": "Pour le club nature de novembre, dawit archive {b} dossiers parmi {a}. Combien restent actifs ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-20",
      "prompt": "Pour le marche aux fleurs de novembre, magasin : {a} articles en rayon, {b} retires pour inventaire. Combien restent en rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-21",
      "prompt": "Pour le parcours sante de novembre, a la bibliotheque, parking : {a} places, {b} occupees. Combien de places libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-22",
      "prompt": "Pour le defi zero dechet de novembre, club : {a} membres, {b} desinscriptions. Combien de membres restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-23",
      "prompt": "Pour l’atelier bricolage de novembre, hassan consomme {b} unites d’un budget de {a}. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-24",
      "prompt": "Pour la journee du sport de novembre, livraison incomplete : {a} prevus, {b} manquants. Combien sont arrives ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-25",
      "prompt": "Pour la fete de l’ecole de decembre, reserve froide : {a} articles, sortie de {b}. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-26",
      "prompt": "Pour le marche de Noel de decembre, au club de sport : {a} badges imprimes, {b} distribues a l’ouverture. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-27",
      "prompt": "Pour la kermesse de decembre, salma corrige : total {a} pinces, erreurs {b}. Combien restent corrects ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-28",
      "prompt": "Pour le tournoi de printemps de decembre, tournoi : {a} equipes engagees, {b} forfaits. Combien d’equipes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-29",
      "prompt": "Pour la sortie au musee de decembre, depot : {a} colis, expedition de {b}. Combien de colis restent au depot ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-30",
      "prompt": "Pour l’atelier science de decembre, au centre aere, chantier : {a} briques, {b} utilisees. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-31",
      "prompt": "Pour la semaine du gout de decembre, murat preleve {b} echantillons sur {a}. Combien restent non preleves ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-32",
      "prompt": "Pour la journee portes ouvertes de decembre, caisse : {a} CHF, depense de {b} CHF. Combien reste-t-il en caisse ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-33",
      "prompt": "Pour la collecte solidaire de decembre, file d’attente : {a} dossiers, {b} traites. Combien restent en attente ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-34",
      "prompt": "Pour le challenge lecture de decembre, a l’ecole : stock tampon {a} figurines, Ponction de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-35",
      "prompt": "Pour le projet jardin de decembre, meron solde {b} articles d’un inventaire de {a}. Combien restent au tarif normal ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-36",
      "prompt": "Pour l’expo photos de decembre, semaine : {a} heures prevues, {b} annulees. Combien d’heures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-37",
      "prompt": "Pour le concert de fin d’annee de decembre, labo : {a} tubes, {b} utilises. Combien de tubes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-38",
      "prompt": "Pour la course d’orientation de decembre, beatriz retire {b} photos d’un album de {a}. Combien de photos restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-39",
      "prompt": "Pour l’atelier cuisine de decembre, sur le parking, vestiaire : {a} casiers, {b} attribues. Combien restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-40",
      "prompt": "Pour le vide-grenier de decembre, production : {a} lots, {b} non conformes. Combien de lots conformes ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-41",
      "prompt": "Pour le stand de limonade de decembre, karim decompte {b} photos d’un total de {a}. Quel reste affiche-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-42",
      "prompt": "Pour les olympiades sportives de decembre, evenement : {a} places, {b} annulations. Combien de places restent reservees ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-43",
      "prompt": "Pour le conte musical de decembre, rayon : {a} bouteilles, retrait de {b} pour promo. Combien restent au rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-44",
      "prompt": "Pour le rallye maths de decembre, a l’ecole : {a} plants, {b} deja plantes ailleurs. Combien restent a planter ici ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-45",
      "prompt": "Pour la semaine bleue de decembre, rania clôture {b} tickets sur {a}. Combien de tickets restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-46",
      "prompt": "Pour la semaine verte de decembre, bus : {a} places, {b} passagers. Combien de places restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-47",
      "prompt": "Pour le festival du livre de decembre, entrepot : {a} palettes, expedition de {b}. Combien de palettes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-48",
      "prompt": "Pour l’atelier robotique de decembre, au musee, salle : {a} chaises, {b} sorties. Combien de chaises restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-49",
      "prompt": "Pour le club nature de decembre, patricia soustrait {b} de {a} aiguilles pour un inventaire. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-50",
      "prompt": "Pour le marche aux fleurs de decembre, bilan : {a} cahiers initialement, sortie nette de {b}. Combien en stock final ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-51",
      "prompt": "Pour le parcours sante de decembre, a la bibliotheque, l’equipe dispose de {a} vignettes. Apres distribution, {b} ont ete donnes. Combien en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-52",
      "prompt": "Pour le defi zero dechet de decembre, hamza commence avec {a} bonbons. Avant midi, il en jette {b}. Combien lui en reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-53",
      "prompt": "Pour l’atelier bricolage de decembre, inventaire : {a} fleurs. On retire {b} abimes. Combien restent utilisables ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-54",
      "prompt": "Pour la journee du sport de decembre, la billetterie avait {a} tickets. Elle en vend {b}. Combien de tickets reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-55",
      "prompt": "Pour la fete de l’ecole de janvier, un depot part avec {a} balles. Un client en commande {b}. Combien conserve-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-56",
      "prompt": "Pour le marche de Noel de janvier, diogo avait {a} points. Il en perd {b} au second tour. Quel score reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-57",
      "prompt": "Pour le tournoi, {a} ballons etaient prevus. {b} se degonflent. Combien restent utilisables  — la kermesse de janvier ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-58",
      "prompt": "Pour le tournoi de printemps de janvier, bibliotheque : {a} livres, dont {b} sortent en pret. Combien restent sur place ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-59",
      "prompt": "Pour la sortie au musee de janvier, au stand, {a} boites exposes. On en retire {b} pour un autre stand. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-60",
      "prompt": "Pour l’atelier science de janvier, entre deux controles, le compte baisse de {b} a partir de {a} verres. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-61",
      "prompt": "Pour la semaine du gout de janvier, a la bibliotheque, {a} clous sont reserves. On en annule {b}. Combien de reservations restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-62",
      "prompt": "Pour la journee portes ouvertes de janvier, soraya calcule un reste : {a} graines moins {b} utilises. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-63",
      "prompt": "Pour la collecte solidaire de janvier, service apres-vente : {a} dossiers, {b} clos. Combien restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-64",
      "prompt": "Pour le challenge lecture de janvier, stock saisonnier : {a} classeurs, soldes de {b}. Combien restent hors solde ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-65",
      "prompt": "Pour le projet jardin de janvier, isabel transferait {b} tubes depuis un lot de {a}. Combien restent sur place ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-66",
      "prompt": "Pour l’expo photos de janvier, au club de sport : effectif {a}, absences {b}. Combien de presents ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-67",
      "prompt": "Pour le concert de fin d’annee de janvier, atelier : {a} pieces lancees, {b} rebuts. Combien de pieces bonnes ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-68",
      "prompt": "Pour la course d’orientation de janvier, campagne : {a} tracts, {b} deja distribues. Combien restent a distribuer ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-69",
      "prompt": "Pour l’atelier cuisine de janvier, malika archive {b} dossiers parmi {a}. Combien restent actifs ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-70",
      "prompt": "Pour le vide-grenier de janvier, magasin : {a} articles en rayon, {b} retires pour inventaire. Combien restent en rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-71",
      "prompt": "Pour le stand de limonade de janvier, a la bibliotheque, parking : {a} places, {b} occupees. Combien de places libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-72",
      "prompt": "Pour les olympiades sportives de janvier, club : {a} membres, {b} desinscriptions. Combien de membres restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-73",
      "prompt": "Pour le conte musical de janvier, filipa consomme {b} unites d’un budget de {a}. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-74",
      "prompt": "Pour le rallye maths de janvier, livraison incomplete : {a} prevus, {b} manquants. Combien sont arrives ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-75",
      "prompt": "Pour la semaine bleue de janvier, reserve froide : {a} enveloppes, sortie de {b}. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-76",
      "prompt": "Pour la semaine verte de janvier, au club de sport : {a} badges imprimes, {b} distribues a l’ouverture. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-77",
      "prompt": "Pour le festival du livre de janvier, zainab corrige : total {a} assiettes, erreurs {b}. Combien restent corrects ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-78",
      "prompt": "Pour l’atelier robotique de janvier, tournoi : {a} equipes engagees, {b} forfaits. Combien d’equipes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-79",
      "prompt": "Pour le club nature de janvier, depot : {a} colis, expedition de {b}. Combien de colis restent au depot ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-80",
      "prompt": "Pour le marche aux fleurs de janvier, au centre aere, chantier : {a} briques, {b} utilisees. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-81",
      "prompt": "Pour le parcours sante de janvier, mariana preleve {b} echantillons sur {a}. Combien restent non preleves ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-82",
      "prompt": "Pour le defi zero dechet de janvier, caisse : {a} CHF, depense de {b} CHF. Combien reste-t-il en caisse ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-83",
      "prompt": "Pour l’atelier bricolage de janvier, file d’attente : {a} dossiers, {b} traites. Combien restent en attente ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-84",
      "prompt": "Pour la journee du sport de janvier, a l’ecole : stock tampon {a} livres, Ponction de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-85",
      "prompt": "Pour la fete de l’ecole de fevrier, noa solde {b} articles d’un inventaire de {a}. Combien restent au tarif normal ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-86",
      "prompt": "Pour le marche de Noel de fevrier, semaine : {a} heures prevues, {b} annulees. Combien d’heures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-87",
      "prompt": "Pour la kermesse de fevrier, labo : {a} tubes, {b} utilises. Combien de tubes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-88",
      "prompt": "Pour le tournoi de printemps de fevrier, sofia retire {b} photos d’un album de {a}. Combien de photos restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-89",
      "prompt": "Pour la sortie au musee de fevrier, sur le parking, vestiaire : {a} casiers, {b} attribues. Combien restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-90",
      "prompt": "Pour l’atelier science de fevrier, production : {a} lots, {b} non conformes. Combien de lots conformes ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-91",
      "prompt": "Pour la semaine du gout de fevrier, omar decompte {b} poissons d’un total de {a}. Quel reste affiche-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-92",
      "prompt": "Pour la journee portes ouvertes de fevrier, evenement : {a} places, {b} annulations. Combien de places restent reservees ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-93",
      "prompt": "Pour la collecte solidaire de fevrier, rayon : {a} paniers, retrait de {b} pour promo. Combien restent au rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-94",
      "prompt": "Pour le challenge lecture de fevrier, a l’ecole : {a} plants, {b} deja plantes ailleurs. Combien restent a planter ici ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-95",
      "prompt": "Pour le projet jardin de fevrier, bilal clôture {b} tickets sur {a}. Combien de tickets restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-96",
      "prompt": "Pour l’expo photos de fevrier, bus : {a} places, {b} passagers. Combien de places restent libres ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-97",
      "prompt": "Pour le concert de fin d’annee de fevrier, entrepot : {a} palettes, expedition de {b}. Combien de palettes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-98",
      "prompt": "Pour la course d’orientation de fevrier, au musee, salle : {a} chaises, {b} sorties. Combien de chaises restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-99",
      "prompt": "Pour l’atelier cuisine de fevrier, khalil soustrait {b} de {a} bobines pour un inventaire. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-moyen-100",
      "prompt": "Pour le vide-grenier de fevrier, bilan : {a} crayons initialement, sortie nette de {b}. Combien en stock final ?",
      "op": "-"
    }
  ],
  "multiplication:moyen": [
    {
      "id": "multiplication-moyen-1",
      "prompt": "Pour la semaine bleue de mai, a la gare, on commande {b} boites contenant chacune {a} crayons. Combien de crayons ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-2",
      "prompt": "Pour la semaine verte de mai, nour organise {b} equipes de {a} joueurs. Combien de joueurs participent ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-3",
      "prompt": "Pour le festival du livre de mai, livraison : {b} cageots de {a} chaises. Combien de chaises sont livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-4",
      "prompt": "Pour l’atelier robotique de mai, parking : {b} rangees de {a} places. Combien de places y a-t-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-5",
      "prompt": "Pour le club nature de mai, dawit imprime {b} planches de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-6",
      "prompt": "Pour le marche aux fleurs de mai, atelier : {b} plateaux de {a} pieces. Combien de pieces au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-7",
      "prompt": "Pour le parcours sante de mai, ecole : achat de {b} boites de {a} feutres. Combien de feutres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-8",
      "prompt": "Pour le defi zero dechet de mai, chiara remplit {b} albums avec {a} timbres par album. Combien de timbres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-9",
      "prompt": "Pour l’atelier bricolage de mai, a l’atelier bois, {b} stands exposent {a} pommes chacun. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-10",
      "prompt": "Pour la journee du sport de mai, farid prevoyait {b} semaines a {a} seances. Combien de seances ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-11",
      "prompt": "Pour la fete de l’ecole de juin, commande club : {b} cartons de {a} verres. Combien de verres commandes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-12",
      "prompt": "Pour le marche de Noel de juin, stage : {b} groupes de {a} participants. Combien de participants ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-13",
      "prompt": "Pour la kermesse de juin, dans la classe : {b} files de {a} visiteurs. Combien de visiteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-14",
      "prompt": "Pour le tournoi de printemps de juin, mustafa planifie {b} ateliers de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-15",
      "prompt": "Pour la sortie au musee de juin, production : {b} lots de {a} cubes. Combien de cubes produits ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-16",
      "prompt": "Pour l’atelier science de juin, bibliotheque : {b} bacs de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-17",
      "prompt": "Pour la semaine du gout de juin, festival : {b} stands × {a} brochures. Combien de brochures ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-18",
      "prompt": "Pour la journee portes ouvertes de juin, jalal reserve {b} tables de {a} couverts. Combien de couverts ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-19",
      "prompt": "Pour la collecte solidaire de juin, a l’atelier bois, logistique : {b} palettes de {a} assiettes. Combien de assiettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-20",
      "prompt": "Pour le challenge lecture de juin, camp : {b} tentes de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-21",
      "prompt": "Pour le projet jardin de juin, meron calcule {b} semaines × {a} timbres par semaine. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-22",
      "prompt": "Pour l’expo photos de juin, magasin : {b} rayons de {a} articles. Combien d’articles ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-23",
      "prompt": "Pour le concert de fin d’annee de juin, gymnase : {b} rangees de {a} bancs. Combien de bancs ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-24",
      "prompt": "Pour la course d’orientation de juin, au zoo : {b} classes × {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-25",
      "prompt": "Pour l’atelier cuisine de juin, luca prepare {b} kits de {a} places. Combien de places prepares ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-26",
      "prompt": "Pour le vide-grenier de juin, usine : {b} cartons de {a} pieces. Combien de pieces ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-27",
      "prompt": "Pour le stand de limonade de juin, marche : {b} etals de {a} participants. Combien de participants ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-28",
      "prompt": "Pour les olympiades sportives de juin, hana forme {b} binomes de {a} roles (total personnes). Combien de personnes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-29",
      "prompt": "Pour le conte musical de juin, a l’atelier bois, depot : {b} casiers de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-30",
      "prompt": "Pour le rallye maths de juin, club photo : {b} albums de {a} cliches. Combien de cliches ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-31",
      "prompt": "Pour la semaine bleue de juin, rania emballe {b} colis de {a} crayons. Combien de crayons emballes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-32",
      "prompt": "Pour la semaine verte de juin, cantine : {b} services de {a} plateaux. Combien de plateaux ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-33",
      "prompt": "Pour le festival du livre de juin, jardinage : {b} planches de {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-34",
      "prompt": "Pour l’atelier robotique de juin, au zoo : {b} wagons de {a} passagers. Combien de passagers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-35",
      "prompt": "Pour le club nature de juin, patricia compte {b} immeubles de {a} appartements. Combien d’appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-36",
      "prompt": "Pour le marche aux fleurs de juin, labo : {b} grilles de {a} echantillons. Combien d’echantillons ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-37",
      "prompt": "Pour le parcours sante de juin, sport : {b} poules de {a} equipes. Combien d’equipes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-38",
      "prompt": "Pour le defi zero dechet de juin, hamza commande {b} packs de {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-39",
      "prompt": "Pour l’atelier bricolage de juin, a l’atelier bois, atelier : {b} bacs de {a} pommes. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-40",
      "prompt": "Pour la journee du sport de juin, expo : {b} salles de {a} oeuvres. Combien d’oeuvres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-41",
      "prompt": "Pour la fete de l’ecole de juillet, transport : {b} camions de {a} cartons. Combien de cartons ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-42",
      "prompt": "Pour le marche de Noel de juillet, diogo organise {b} sessions de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-43",
      "prompt": "Pour la kermesse de juillet, ecole : {b} casiers de {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-44",
      "prompt": "Pour le tournoi de printemps de juillet, au zoo : {b} ruches de {a} cadres. Combien de cadres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-45",
      "prompt": "Pour la sortie au musee de juillet, federica calcule {b} × {a} pour un inventaire de cubes. Quel total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-46",
      "prompt": "Pour l’atelier science de juillet, reservation : {b} salles de {a} sieges. Combien de sieges ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-47",
      "prompt": "Pour la semaine du gout de juillet, collecte : {b} sacs de {a} appartements. Combien de appartements collectes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-48",
      "prompt": "Pour la journee portes ouvertes de juillet, a la recreation, production : {b} series de {a} abeilles. Combien de abeilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-49",
      "prompt": "Pour la collecte solidaire de juillet, yohannes prevoyait {b} jours a {a} assiettes par jour. Combien de assiettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-50",
      "prompt": "Pour le challenge lecture de juillet, bilan : {b} equipes × {a} produits. Combien de produits au bilan ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-51",
      "prompt": "Pour le projet jardin de juillet, a la gare, on commande {b} albums contenant chacune {a} timbres. Combien de timbres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-52",
      "prompt": "Pour l’expo photos de juillet, lorenzo organise {b} equipes de {a} joueurs. Combien de joueurs participent ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-53",
      "prompt": "Pour le concert de fin d’annee de juillet, livraison : {b} cageots de {a} billes. Combien de billes sont livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-54",
      "prompt": "Pour la course d’orientation de juillet, parking : {b} rangees de {a} places. Combien de places y a-t-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-55",
      "prompt": "Pour l’atelier cuisine de juillet, malika imprime {b} planches de {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-56",
      "prompt": "Pour le vide-grenier de juillet, atelier : {b} plateaux de {a} pieces. Combien de pieces au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-57",
      "prompt": "Pour le stand de limonade de juillet, ecole : achat de {b} boites de {a} feutres. Combien de feutres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-58",
      "prompt": "Pour les olympiades sportives de juillet, paulo remplit {b} albums avec {a} timbres par album. Combien de timbres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-59",
      "prompt": "Pour le conte musical de juillet, a l’atelier bois, {b} stands exposent {a} livres chacun. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-60",
      "prompt": "Pour le rallye maths de juillet, francesco prevoyait {b} semaines a {a} seances. Combien de seances ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-61",
      "prompt": "Pour la semaine bleue de juillet, commande club : {b} cartons de {a} crayons. Combien de crayons commandes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-62",
      "prompt": "Pour la semaine verte de juillet, stage : {b} groupes de {a} participants. Combien de participants ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-63",
      "prompt": "Pour le festival du livre de juillet, dans la classe : {b} files de {a} visiteurs. Combien de visiteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-64",
      "prompt": "Pour l’atelier robotique de juillet, shirin planifie {b} ateliers de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-65",
      "prompt": "Pour le club nature de juillet, production : {b} lots de {a} joueurs. Combien de joueurs produits ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-66",
      "prompt": "Pour le marche aux fleurs de juillet, bibliotheque : {b} bacs de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-67",
      "prompt": "Pour le parcours sante de juillet, festival : {b} stands × {a} brochures. Combien de brochures ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-68",
      "prompt": "Pour le defi zero dechet de juillet, kofi reserve {b} tables de {a} couverts. Combien de couverts ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-69",
      "prompt": "Pour l’atelier bricolage de juillet, a l’atelier bois, logistique : {b} palettes de {a} pommes. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-70",
      "prompt": "Pour la journee du sport de juillet, camp : {b} tentes de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-71",
      "prompt": "Pour la fete de l’ecole de aout, noa calcule {b} semaines × {a} verres par semaine. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-72",
      "prompt": "Pour le marche de Noel de aout, magasin : {b} rayons de {a} articles. Combien d’articles ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-73",
      "prompt": "Pour la kermesse de aout, gymnase : {b} rangees de {a} bancs. Combien de bancs ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-74",
      "prompt": "Pour le tournoi de printemps de aout, au zoo : {b} classes × {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-75",
      "prompt": "Pour la sortie au musee de aout, ahmed prepare {b} kits de {a} cubes. Combien de cubes prepares ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-76",
      "prompt": "Pour l’atelier science de aout, usine : {b} cartons de {a} pieces. Combien de pieces ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-77",
      "prompt": "Pour la semaine du gout de aout, marche : {b} etals de {a} appartements. Combien de appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-78",
      "prompt": "Pour la journee portes ouvertes de aout, lea forme {b} binomes de {a} roles (total personnes). Combien de personnes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-79",
      "prompt": "Pour la collecte solidaire de aout, a l’atelier bois, depot : {b} casiers de {a} assiettes. Combien de assiettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-80",
      "prompt": "Pour le challenge lecture de aout, club photo : {b} albums de {a} cliches. Combien de cliches ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-81",
      "prompt": "Pour le projet jardin de aout, bilal emballe {b} colis de {a} timbres. Combien de timbres emballes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-82",
      "prompt": "Pour l’expo photos de aout, cantine : {b} services de {a} plateaux. Combien de plateaux ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-83",
      "prompt": "Pour le concert de fin d’annee de aout, jardinage : {b} planches de {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-84",
      "prompt": "Pour la course d’orientation de aout, au zoo : {b} wagons de {a} passagers. Combien de passagers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-85",
      "prompt": "Pour l’atelier cuisine de aout, khalil compte {b} immeubles de {a} appartements. Combien d’appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-86",
      "prompt": "Pour le vide-grenier de aout, labo : {b} grilles de {a} echantillons. Combien d’echantillons ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-87",
      "prompt": "Pour le stand de limonade de aout, sport : {b} poules de {a} equipes. Combien d’equipes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-88",
      "prompt": "Pour les olympiades sportives de aout, nadia commande {b} packs de {a} visiteurs. Combien de visiteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-89",
      "prompt": "Pour le conte musical de aout, a l’atelier bois, atelier : {b} bacs de {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-90",
      "prompt": "Pour le rallye maths de aout, expo : {b} salles de {a} oeuvres. Combien d’oeuvres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-91",
      "prompt": "Pour la semaine bleue de aout, transport : {b} camions de {a} cartons. Combien de cartons ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-92",
      "prompt": "Pour la semaine verte de aout, giulia organise {b} sessions de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-93",
      "prompt": "Pour le festival du livre de aout, ecole : {b} casiers de {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-94",
      "prompt": "Pour l’atelier robotique de aout, au zoo : {b} ruches de {a} cadres. Combien de cadres ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-95",
      "prompt": "Pour le club nature de aout, amadou calcule {b} × {a} pour un inventaire de joueurs. Quel total ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-96",
      "prompt": "Pour le marche aux fleurs de aout, reservation : {b} salles de {a} sieges. Combien de sieges ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-97",
      "prompt": "Pour le parcours sante de aout, collecte : {b} sacs de {a} livres. Combien de livres collectes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-98",
      "prompt": "Pour le defi zero dechet de aout, a la recreation, production : {b} series de {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-99",
      "prompt": "Pour l’atelier bricolage de aout, mariam prevoyait {b} jours a {a} pommes par jour. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-moyen-100",
      "prompt": "Pour la journee du sport de aout, bilan : {b} equipes × {a} oranges. Combien de oranges au bilan ?",
      "op": "*"
    }
  ],
  "division:moyen": [
    {
      "id": "division-moyen-1",
      "prompt": "Pour la collecte solidaire de octobre, au marche, ranger {a} billes dans des casiers de {b}. Combien de casiers complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-2",
      "prompt": "Pour le challenge lecture de octobre, jalal organise {a} cartes en equipes de {b}. Combien d’equipes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-3",
      "prompt": "Pour le projet jardin de octobre, livraison de {a} feuilles separee en colis de {b}. Combien de colis complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-4",
      "prompt": "Pour l’expo photos de octobre, le club repartit {a} bonbons entre {b} sections egalement. Combien par section ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-5",
      "prompt": "Pour le concert de fin d’annee de octobre, atelier : {a} livres partages par groupes de {b} eleves. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-6",
      "prompt": "Pour la course d’orientation de octobre, eden calcule les boites de {b} a remplir avec {a} oeufs. Combien de boites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-7",
      "prompt": "Pour l’atelier cuisine de octobre, depot : {a} pommes en files de {b}. Combien de files completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-8",
      "prompt": "Pour le vide-grenier de octobre, ecole : {a} crayons divises en classes de {b}. Combien de classes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-9",
      "prompt": "Pour le stand de limonade de octobre, au gymnase, conditionnement de {a} ballons par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-10",
      "prompt": "Pour les olympiades sportives de octobre, serena ventile {a} timbres en rayons de {b}. Combien de rayons complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-11",
      "prompt": "Pour le conte musical de octobre, stage : {a} photos en ateliers de {b}. Combien d’ateliers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-12",
      "prompt": "Pour le rallye maths de octobre, magasin : {a} chaises en lots promo de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-13",
      "prompt": "Pour la semaine bleue de octobre, au marche : repartition de {a} eleves sur {b} stands. Combien par stand ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-14",
      "prompt": "Pour la semaine verte de octobre, tarek planifie des tours de {b} avec {a} joueurs. Combien de tours ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-15",
      "prompt": "Pour le festival du livre de octobre, cantine : {a} bouteilles pour {b} services egaux. Combien par service ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-16",
      "prompt": "Pour l’atelier robotique de octobre, bibliotheque : {a} cahiers en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-17",
      "prompt": "Pour le club nature de octobre, festival : {a} enveloppes entre {b} zones. Combien par zone ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-18",
      "prompt": "Pour le marche aux fleurs de octobre, rui constitue des packs de {b} a partir de {a} pieces. Combien de packs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-19",
      "prompt": "Pour le parcours sante de octobre, au marche, logistique : {a} gommes en palettes de {b}. Combien de palettes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-20",
      "prompt": "Pour le defi zero dechet de octobre, club : {a} stylos divises en {b} equipes. Combien par equipe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-21",
      "prompt": "Pour l’atelier bricolage de octobre, laura etale {a} billes sur {b} etageres egales. Combien par etagere ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-22",
      "prompt": "Pour la journee du sport de octobre, production : {a} cartes en series de {b}. Combien de series ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-23",
      "prompt": "Pour la fete de l’ecole de novembre, gymnase : {a} feuilles en rangees de {b}. Combien de rangees ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-24",
      "prompt": "Pour le marche de Noel de novembre, au vestiaire : {a} bonbons pour {b} classes. Combien par classe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-25",
      "prompt": "Pour la kermesse de novembre, tesfay calcule le nombre de sachets de {b} dans {a} livres. Combien ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-26",
      "prompt": "Pour le tournoi de printemps de novembre, entrepot : {a} oeufs en cartons de {b}. Combien de cartons ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-27",
      "prompt": "Pour la sortie au musee de novembre, marche : {a} pommes en cageots de {b}. Combien de cageots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-28",
      "prompt": "Pour l’atelier science de novembre, matteo repartit {a} crayons entre {b} binomes. Combien par binome ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-29",
      "prompt": "Pour la semaine du gout de novembre, dans le quartier, atelier : {a} ballons en plateaux de {b}. Combien de plateaux ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-30",
      "prompt": "Pour la journee portes ouvertes de novembre, expo : {a} timbres en salles de {b}. Combien de salles completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-31",
      "prompt": "Pour la collecte solidaire de novembre, transport : {a} photos en camions de {b}. Combien de camions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-32",
      "prompt": "Pour le challenge lecture de novembre, soraya organise {a} chaises en sessions de {b}. Combien de sessions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-33",
      "prompt": "Pour le projet jardin de novembre, ecole : {a} eleves en casiers de {b}. Combien de casiers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-34",
      "prompt": "Pour l’expo photos de novembre, a la mediatheque : {a} joueurs en ruches/groupes de {b}. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-35",
      "prompt": "Pour le concert de fin d’annee de novembre, isabel verifie {a} ÷ {b} sur inventaire de bouteilles. Quel quotient ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-36",
      "prompt": "Pour la course d’orientation de novembre, reservation : {a} cahiers en salles de {b} places. Combien de salles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-37",
      "prompt": "Pour l’atelier cuisine de novembre, collecte : {a} enveloppes en sacs de {b}. Combien de sacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-38",
      "prompt": "Pour le vide-grenier de novembre, a la piscine, production : {a} pieces en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-39",
      "prompt": "Pour le stand de limonade de novembre, malika decoupe la commande : {a} gommes par paquets de {b}. Combien ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-40",
      "prompt": "Pour les olympiades sportives de novembre, bilan : {a} stylos repartis en {b} centres. Combien par centre ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-41",
      "prompt": "Pour le conte musical de novembre, labo : {a} billes en grilles de {b}. Combien de grilles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-42",
      "prompt": "Pour le rallye maths de novembre, sport : {a} cartes en poules de {b}. Combien de poules ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-43",
      "prompt": "Pour la semaine bleue de novembre, filipa conditionne {a} feuilles par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-44",
      "prompt": "Pour la semaine verte de novembre, a la piscine : ventilation de {a} bonbons en {b} rayons. Combien par rayon ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-45",
      "prompt": "Pour le festival du livre de novembre, depot froid : {a} livres en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-46",
      "prompt": "Pour l’atelier robotique de novembre, nabil forme des cohorts de {b} avec {a} oeufs. Combien de cohorts ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-47",
      "prompt": "Pour le club nature de novembre, centre : {a} pommes en batiments de {b}. Combien de batiments ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-48",
      "prompt": "Pour le marche aux fleurs de novembre, au vestiaire, projet : {a} crayons en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-49",
      "prompt": "Pour le parcours sante de novembre, sipho finalise le partage de {a} ballons en {b}. Combien par part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-50",
      "prompt": "Pour le defi zero dechet de novembre, inventaire : {a} timbres ÷ {b} unites par lot. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-51",
      "prompt": "Pour l’atelier bricolage de novembre, au gymnase, ranger {a} photos dans des casiers de {b}. Combien de casiers complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-52",
      "prompt": "Pour la journee du sport de novembre, kofi organise {a} chaises en equipes de {b}. Combien d’equipes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-53",
      "prompt": "Pour la fete de l’ecole de decembre, livraison de {a} eleves separee en colis de {b}. Combien de colis complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-54",
      "prompt": "Pour le marche de Noel de decembre, le club repartit {a} joueurs entre {b} sections egalement. Combien par section ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-55",
      "prompt": "Pour la kermesse de decembre, atelier : {a} bouteilles partages par groupes de {b} eleves. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-56",
      "prompt": "Pour le tournoi de printemps de decembre, yousef calcule les boites de {b} a remplir avec {a} cahiers. Combien de boites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-57",
      "prompt": "Pour la sortie au musee de decembre, depot : {a} enveloppes en files de {b}. Combien de files completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-58",
      "prompt": "Pour l’atelier science de decembre, ecole : {a} pieces divises en classes de {b}. Combien de classes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-59",
      "prompt": "Pour la semaine du gout de decembre, dans le quartier, conditionnement de {a} gommes par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-60",
      "prompt": "Pour la journee portes ouvertes de decembre, sara ventile {a} stylos en rayons de {b}. Combien de rayons complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-61",
      "prompt": "Pour la collecte solidaire de decembre, stage : {a} billes en ateliers de {b}. Combien d’ateliers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-62",
      "prompt": "Pour le challenge lecture de decembre, magasin : {a} cartes en lots promo de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-63",
      "prompt": "Pour le projet jardin de decembre, au gymnase : repartition de {a} feuilles sur {b} stands. Combien par stand ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-64",
      "prompt": "Pour l’expo photos de decembre, amina planifie des tours de {b} avec {a} bonbons. Combien de tours ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-65",
      "prompt": "Pour le concert de fin d’annee de decembre, cantine : {a} livres pour {b} services egaux. Combien par service ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-66",
      "prompt": "Pour la course d’orientation de decembre, bibliotheque : {a} oeufs en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-67",
      "prompt": "Pour l’atelier cuisine de decembre, festival : {a} pommes entre {b} zones. Combien par zone ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-68",
      "prompt": "Pour le vide-grenier de decembre, elsa constitue des packs de {b} a partir de {a} crayons. Combien de packs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-69",
      "prompt": "Pour le stand de limonade de decembre, au gymnase, logistique : {a} ballons en palettes de {b}. Combien de palettes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-70",
      "prompt": "Pour les olympiades sportives de decembre, club : {a} timbres divises en {b} equipes. Combien par equipe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-71",
      "prompt": "Pour le conte musical de decembre, tom etale {a} photos sur {b} etageres egales. Combien par etagere ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-72",
      "prompt": "Pour le rallye maths de decembre, production : {a} chaises en series de {b}. Combien de series ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-73",
      "prompt": "Pour la semaine bleue de decembre, gymnase : {a} eleves en rangees de {b}. Combien de rangees ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-74",
      "prompt": "Pour la semaine verte de decembre, a la piscine : {a} joueurs pour {b} classes. Combien par classe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-75",
      "prompt": "Pour le festival du livre de decembre, marco calcule le nombre de sachets de {b} dans {a} bouteilles. Combien ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-76",
      "prompt": "Pour l’atelier robotique de decembre, entrepot : {a} cahiers en cartons de {b}. Combien de cartons ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-77",
      "prompt": "Pour le club nature de decembre, marche : {a} enveloppes en cageots de {b}. Combien de cageots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-78",
      "prompt": "Pour le marche aux fleurs de decembre, svitlana repartit {a} pieces entre {b} binomes. Combien par binome ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-79",
      "prompt": "Pour le parcours sante de decembre, au marche, atelier : {a} gommes en plateaux de {b}. Combien de plateaux ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-80",
      "prompt": "Pour le defi zero dechet de decembre, expo : {a} stylos en salles de {b}. Combien de salles completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-81",
      "prompt": "Pour l’atelier bricolage de decembre, transport : {a} billes en camions de {b}. Combien de camions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-82",
      "prompt": "Pour la journee du sport de decembre, hugo organise {a} cartes en sessions de {b}. Combien de sessions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-83",
      "prompt": "Pour la fete de l’ecole de janvier, ecole : {a} feuilles en casiers de {b}. Combien de casiers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-84",
      "prompt": "Pour le marche de Noel de janvier, au vestiaire : {a} bonbons en ruches/groupes de {b}. Combien de groupes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-85",
      "prompt": "Pour la kermesse de janvier, sami verifie {a} ÷ {b} sur inventaire de livres. Quel quotient ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-86",
      "prompt": "Pour le tournoi de printemps de janvier, reservation : {a} oeufs en salles de {b} places. Combien de salles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-87",
      "prompt": "Pour la sortie au musee de janvier, collecte : {a} pommes en sacs de {b}. Combien de sacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-88",
      "prompt": "Pour l’atelier science de janvier, a la mediatheque, production : {a} crayons en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-89",
      "prompt": "Pour la semaine du gout de janvier, dawit decoupe la commande : {a} ballons par paquets de {b}. Combien ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-90",
      "prompt": "Pour la journee portes ouvertes de janvier, bilan : {a} timbres repartis en {b} centres. Combien par centre ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-91",
      "prompt": "Pour la collecte solidaire de janvier, labo : {a} photos en grilles de {b}. Combien de grilles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-92",
      "prompt": "Pour le challenge lecture de janvier, sport : {a} chaises en poules de {b}. Combien de poules ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-93",
      "prompt": "Pour le projet jardin de janvier, hassan conditionne {a} eleves par {b}. Combien de conditionnements ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-94",
      "prompt": "Pour l’expo photos de janvier, a la mediatheque : ventilation de {a} joueurs en {b} rayons. Combien par rayon ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-95",
      "prompt": "Pour le concert de fin d’annee de janvier, depot froid : {a} bouteilles en bacs de {b}. Combien de bacs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-96",
      "prompt": "Pour la course d’orientation de janvier, timur forme des cohorts de {b} avec {a} cahiers. Combien de cohorts ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-97",
      "prompt": "Pour l’atelier cuisine de janvier, centre : {a} enveloppes en batiments de {b}. Combien de batiments ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-98",
      "prompt": "Pour le vide-grenier de janvier, a la piscine, projet : {a} pieces en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-99",
      "prompt": "Pour le stand de limonade de janvier, iryna finalise le partage de {a} gommes en {b}. Combien par part ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-moyen-100",
      "prompt": "Pour les olympiades sportives de janvier, inventaire : {a} stylos ÷ {b} unites par lot. Combien de lots ?",
      "op": "/",
      "exact": true
    }
  ],
  "add-sub:moyen": [
    {
      "id": "add-sub-moyen-1",
      "prompt": "Pour le marche de Noel de janvier, rania a {a} fleurs. Elle en recoit {b}, puis en donne {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-2",
      "prompt": "Pour la kermesse de janvier, sur le parking, on compte {a} puzzles. On en ajoute {b}, puis on en retire {c}. Apres ces deux operations, combien en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-3",
      "prompt": "Pour le tournoi de printemps de janvier, un stock de {a} tickets augmente de {b}, puis diminue de {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-4",
      "prompt": "Pour la sortie au musee de janvier, rui commence avec {a} chats, gagne {b}, puis en utilise {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-5",
      "prompt": "Pour l’activite : {a} articles prets. On en apporte {b}, puis on en distribue {c}. Apres ces deux operations, combien restent disponibles  — l’atelier science de janvier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-6",
      "prompt": "Pour la semaine du gout de janvier, davide a l’atelier bois rassemble {a} verres, en trouve {b} de plus, puis en prete {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-7",
      "prompt": "Pour la journee portes ouvertes de janvier, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-8",
      "prompt": "Pour la collecte solidaire de janvier, bus : {a} passagers, {b} montent, puis {c} descendent. Apres ces deux operations, combien reste-t-il de passagers ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-9",
      "prompt": "Pour le challenge lecture de janvier, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Apres ces deux operations, combien restent disponibles ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-10",
      "prompt": "Pour le projet jardin de janvier, navid marque {a} points, en gagne {b}, puis en perd {c}. Apres ces deux operations, quel score reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-11",
      "prompt": "Pour l’expo photos de janvier, tesfay a {a} stylos, en achete {b}, puis en vend {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-12",
      "prompt": "Pour le concert de fin d’annee de janvier, a la gare : debut {a} bananes, arrivee de {b}, depart de {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-13",
      "prompt": "Pour la course d’orientation de janvier, reserve : {a} fleurs, livraison +{b}, sortie −{c}. Apres ces deux operations, combien en reserve ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-14",
      "prompt": "Pour l’atelier cuisine de janvier, matteo collectionne {a} puzzles, en recoit {b}, puis en offre {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-15",
      "prompt": "Pour le vide-grenier de janvier, classe : {a} eleves presents, {b} arrivent, {c} partent. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-16",
      "prompt": "Pour le stand de limonade de janvier, compte : {a} + {b} − {c} chats. Apres ces deux operations, quel reste ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-17",
      "prompt": "Pour les olympiades sportives de janvier, iman prepare {a} articles, en ajoute {b}, puis en retire {c} abimes. Apres ces deux operations, combien restent bons ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-18",
      "prompt": "Pour le conte musical de janvier, dans la classe, stock {a}, reappro {b}, vente {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-19",
      "prompt": "Pour le rallye maths de janvier, jeu : score {a}, bonus {b}, malus {c}. Apres ces deux operations, quel score final ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-20",
      "prompt": "Pour la semaine bleue de janvier, goncalo range {a} perles, en trouve {b}, puis en jette {c}. Apres ces deux operations, combien restent ranges ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-21",
      "prompt": "Pour la semaine verte de janvier, panier : {a} feuilles A4, +{b} du marche, −{c} mangés. Apres ces deux operations, combien dans le panier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-22",
      "prompt": "Pour le festival du livre de janvier, file : {a} personnes, {b} arrivent, {c} sont servies. Apres ces deux operations, combien restent en file ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-23",
      "prompt": "Pour l’atelier robotique de janvier, alessandra a {a} tickets, en achete {b}, en utilise {c}. Apres ces deux operations, combien de tickets restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-24",
      "prompt": "Pour le club nature de janvier, a la mediatheque : {a} places, +{b} chaises, −{c} cassees. Apres ces deux operations, combien de places restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-25",
      "prompt": "Pour le marche aux fleurs de janvier, depot : {a} colis, +{b} recus, −{c} expedies. Apres ces deux operations, combien de colis restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-26",
      "prompt": "Pour le parcours sante de janvier, parisa note {a} puzzles, ajoute {b}, retire {c}. Apres ces deux operations, combien note-t-elle a la fin ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-27",
      "prompt": "Pour le defi zero dechet de janvier, atelier : {a} pieces, +{b} produites, −{c} rebuts. Apres ces deux operations, combien de pieces bonnes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-28",
      "prompt": "Pour l’atelier bricolage de janvier, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-29",
      "prompt": "Pour la journee du sport de janvier, au gymnase, inventaire {a} articles, entree {b}, sortie {c}. Apres ces deux operations, combien en stock ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-30",
      "prompt": "Pour la fete de l’ecole de fevrier, francesco cumule {a} points, +{b}, puis −{c}. Apres ces deux operations, quel total reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-31",
      "prompt": "Pour le marche de Noel de fevrier, stand : {a} briques, livraison {b}, ventes {c}. Apres ces deux operations, combien restent au stand ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-32",
      "prompt": "Pour la kermesse de fevrier, bus scolaire : {a} eleves, {b} montent, {c} descendent. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-33",
      "prompt": "Pour le tournoi de printemps de fevrier, zainab gere {a} feuilles A4, en recoit {b}, en envoie {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-34",
      "prompt": "Pour la sortie au musee de fevrier, a la piscine : sac de {a} fils, +{b}, −{c}. Apres ces deux operations, combien dans le sac ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-35",
      "prompt": "Pour l’atelier science de fevrier, magasin : stock {a}, arrivees {b}, ventes {c}. Apres ces deux operations, combien en rayon ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-36",
      "prompt": "Pour la semaine du gout de fevrier, nuno commence a {a}, ajoute {b} bananes, retire {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-37",
      "prompt": "Pour la journee portes ouvertes de fevrier, terrasse : {a} chaises, +{b}, −{c} rangees. Apres ces deux operations, combien de chaises restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-38",
      "prompt": "Pour la collecte solidaire de fevrier, compte rendu : {a} puzzles, trouvailles {b}, pertes {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-39",
      "prompt": "Pour le challenge lecture de fevrier, au marche, bac {a} tickets, remplissage {b}, prelevement {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-40",
      "prompt": "Pour le projet jardin de fevrier, lina aligne {a} chats, en pose {b}, en enleve {c}. Apres ces deux operations, combien restent alignes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-41",
      "prompt": "Pour l’expo photos de fevrier, club : {a} membres, +{b} inscriptions, −{c} departs. Apres ces deux operations, combien de membres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-42",
      "prompt": "Pour le concert de fin d’annee de fevrier, etagere : {a} livres, +{b} neufs, −{c} pretes. Apres ces deux operations, combien sur l’etagere ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-43",
      "prompt": "Pour la course d’orientation de fevrier, daryna a {a} briques en poche, en gagne {b}, en depense {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-44",
      "prompt": "Pour l’atelier cuisine de fevrier, au vestiaire : plateau {a} perles, ajout {b}, retrait {c}. Apres ces deux operations, combien sur le plateau ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-45",
      "prompt": "Pour le vide-grenier de fevrier, jardin : {a} plants, +{b} plantes, −{c} deplaces. Apres ces deux operations, combien restent ici ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-46",
      "prompt": "Pour le stand de limonade de fevrier, sara suit un solde : {a} + {b} − {c} fils. Apres ces deux operations, quel solde ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-47",
      "prompt": "Pour les olympiades sportives de fevrier, vestiaire : {a} casiers libres, +{b}, −{c} pris. Apres ces deux operations, combien restent libres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-48",
      "prompt": "Pour le conte musical de fevrier, labo : {a} tubes, +{b} livrés, −{c} utilises. Apres ces deux operations, combien de tubes restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-49",
      "prompt": "Pour le rallye maths de fevrier, dans le quartier, caisse {a} CHF, encaissements {b}, paiements {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-50",
      "prompt": "Pour la semaine bleue de fevrier, amina cloture : debut {a} puzzles, +{b}, −{c}. Apres ces deux operations, combien a la cloture ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-51",
      "prompt": "Pour la semaine verte de fevrier, bilal a {a} tickets. Il en recoit {b}, puis en donne {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-52",
      "prompt": "Pour le festival du livre de fevrier, dans le preau, on compte {a} chats. On en ajoute {b}, puis on en retire {c}. Apres ces deux operations, combien en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-53",
      "prompt": "Pour l’atelier robotique de fevrier, un stock de {a} articles augmente de {b}, puis diminue de {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-54",
      "prompt": "Pour le club nature de fevrier, elsa commence avec {a} verres, gagne {b}, puis en utilise {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-55",
      "prompt": "Pour l’activite : {a} briques prets. On en apporte {b}, puis on en distribue {c}. Apres ces deux operations, combien restent disponibles  — le marche aux fleurs de fevrier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-56",
      "prompt": "Pour le parcours sante de fevrier, mia au magasin rassemble {a} perles, en trouve {b} de plus, puis en prete {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-57",
      "prompt": "Pour le defi zero dechet de fevrier, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-58",
      "prompt": "Pour l’atelier bricolage de fevrier, bus : {a} passagers, {b} montent, puis {c} descendent. Apres ces deux operations, combien reste-t-il de passagers ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-59",
      "prompt": "Pour la journee du sport de fevrier, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Apres ces deux operations, combien restent disponibles ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-60",
      "prompt": "Pour la fete de l’ecole de mars, ines marque {a} points, en gagne {b}, puis en perd {c}. Apres ces deux operations, quel score reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-61",
      "prompt": "Pour le marche de Noel de mars, marco a {a} fleurs, en achete {b}, puis en vend {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-62",
      "prompt": "Pour la kermesse de mars, sur le parking : debut {a} puzzles, arrivee de {b}, depart de {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-63",
      "prompt": "Pour le tournoi de printemps de mars, reserve : {a} tickets, livraison +{b}, sortie −{c}. Apres ces deux operations, combien en reserve ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-64",
      "prompt": "Pour la sortie au musee de mars, svitlana collectionne {a} chats, en recoit {b}, puis en offre {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-65",
      "prompt": "Pour l’atelier science de mars, classe : {a} eleves presents, {b} arrivent, {c} partent. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-66",
      "prompt": "Pour la semaine du gout de mars, compte : {a} + {b} − {c} verres. Apres ces deux operations, quel reste ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-67",
      "prompt": "Pour la journee portes ouvertes de mars, yara prepare {a} briques, en ajoute {b}, puis en retire {c} abimes. Apres ces deux operations, combien restent bons ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-68",
      "prompt": "Pour la collecte solidaire de mars, au terrain de sport, stock {a}, reappro {b}, vente {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-69",
      "prompt": "Pour le challenge lecture de mars, jeu : score {a}, bonus {b}, malus {c}. Apres ces deux operations, quel score final ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-70",
      "prompt": "Pour le projet jardin de mars, ali range {a} fils, en trouve {b}, puis en jette {c}. Apres ces deux operations, combien restent ranges ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-71",
      "prompt": "Pour l’expo photos de mars, panier : {a} stylos, +{b} du marche, −{c} mangés. Apres ces deux operations, combien dans le panier ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-72",
      "prompt": "Pour le concert de fin d’annee de mars, file : {a} personnes, {b} arrivent, {c} sont servies. Apres ces deux operations, combien restent en file ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-73",
      "prompt": "Pour la course d’orientation de mars, aya a {a} tickets, en achete {b}, en utilise {c}. Apres ces deux operations, combien de tickets restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-74",
      "prompt": "Pour l’atelier cuisine de mars, au vestiaire : {a} places, +{b} chaises, −{c} cassees. Apres ces deux operations, combien de places restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-75",
      "prompt": "Pour le vide-grenier de mars, depot : {a} colis, +{b} recus, −{c} expedies. Apres ces deux operations, combien de colis restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-76",
      "prompt": "Pour le stand de limonade de mars, rita note {a} chats, ajoute {b}, retire {c}. Apres ces deux operations, combien note-t-elle a la fin ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-77",
      "prompt": "Pour les olympiades sportives de mars, atelier : {a} pieces, +{b} produites, −{c} rebuts. Apres ces deux operations, combien de pieces bonnes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-78",
      "prompt": "Pour le conte musical de mars, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-79",
      "prompt": "Pour le rallye maths de mars, dans le quartier, inventaire {a} briques, entree {b}, sortie {c}. Apres ces deux operations, combien en stock ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-80",
      "prompt": "Pour la semaine bleue de mars, farid cumule {a} points, +{b}, puis −{c}. Apres ces deux operations, quel total reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-81",
      "prompt": "Pour la semaine verte de mars, stand : {a} feuilles A4, livraison {b}, ventes {c}. Apres ces deux operations, combien restent au stand ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-82",
      "prompt": "Pour le festival du livre de mars, bus scolaire : {a} eleves, {b} montent, {c} descendent. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-83",
      "prompt": "Pour l’atelier robotique de mars, salma gere {a} stylos, en recoit {b}, en envoie {c}. Apres ces deux operations, combien lui en reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-84",
      "prompt": "Pour le club nature de mars, a la mediatheque : sac de {a} bananes, +{b}, −{c}. Apres ces deux operations, combien dans le sac ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-85",
      "prompt": "Pour le marche aux fleurs de mars, magasin : stock {a}, arrivees {b}, ventes {c}. Apres ces deux operations, combien en rayon ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-86",
      "prompt": "Pour le parcours sante de mars, rustam commence a {a}, ajoute {b} puzzles, retire {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-87",
      "prompt": "Pour le defi zero dechet de mars, terrasse : {a} chaises, +{b}, −{c} rangees. Apres ces deux operations, combien de chaises restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-88",
      "prompt": "Pour l’atelier bricolage de mars, compte rendu : {a} chats, trouvailles {b}, pertes {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-89",
      "prompt": "Pour la journee du sport de mars, au gymnase, bac {a} articles, remplissage {b}, prelevement {c}. Apres ces deux operations, combien restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-90",
      "prompt": "Pour la fete de l’ecole de avril, samuel aligne {a} verres, en pose {b}, en enleve {c}. Apres ces deux operations, combien restent alignes ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-91",
      "prompt": "Pour le marche de Noel de avril, club : {a} membres, +{b} inscriptions, −{c} departs. Apres ces deux operations, combien de membres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-92",
      "prompt": "Pour la kermesse de avril, etagere : {a} livres, +{b} neufs, −{c} pretes. Apres ces deux operations, combien sur l’etagere ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-93",
      "prompt": "Pour le tournoi de printemps de avril, joao a {a} feuilles A4 en poche, en gagne {b}, en depense {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-94",
      "prompt": "Pour la sortie au musee de avril, a la piscine : plateau {a} fils, ajout {b}, retrait {c}. Apres ces deux operations, combien sur le plateau ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-95",
      "prompt": "Pour l’atelier science de avril, jardin : {a} plants, +{b} plantes, −{c} deplaces. Apres ces deux operations, combien restent ici ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-96",
      "prompt": "Pour la semaine du gout de avril, serena suit un solde : {a} + {b} − {c} bananes. Apres ces deux operations, quel solde ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-97",
      "prompt": "Pour la journee portes ouvertes de avril, vestiaire : {a} casiers libres, +{b}, −{c} pris. Apres ces deux operations, combien restent libres ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-98",
      "prompt": "Pour la collecte solidaire de avril, labo : {a} tubes, +{b} livrés, −{c} utilises. Apres ces deux operations, combien de tubes restent ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-99",
      "prompt": "Pour le challenge lecture de avril, au marche, caisse {a} CHF, encaissements {b}, paiements {c}. Apres ces deux operations, combien reste-t-il ?",
      "op": "+-"
    },
    {
      "id": "add-sub-moyen-100",
      "prompt": "Pour le projet jardin de avril, tarek cloture : debut {a} chats, +{b}, −{c}. Apres ces deux operations, combien a la cloture ?",
      "op": "+-"
    }
  ],
  "melange:moyen": [
    {
      "id": "melange-moyen-1",
      "prompt": "Calculez avec soin. Yohannes achete {b} boites de {a} crayons, puis en offre {c}. Combien lui en reste-t-il  — le projet jardin de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-2",
      "prompt": "Calculez avec soin. dans l’atelier, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits  — l’expo photos de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-3",
      "prompt": "Calculez avec soin. Isabel a {a} poissons. Isabel recoit encore {b} paquets de {c} poissons. Combien en a-t-il au total  — le concert de fin d’annee de avril ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-4",
      "prompt": "Calculez avec soin. On prepare {a} sacs, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets  — la course d’orientation de avril ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-5",
      "prompt": "Calculez avec soin. Alessandra paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il  — l’atelier cuisine de avril ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-6",
      "prompt": "Calculez avec soin. Depot : {a} perles. On envoie {b} cartons de {c} perles. Combien reste-t-il  — le vide-grenier de avril ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-7",
      "prompt": "Calculez avec soin. au centre aere, {a} rangees de {b} pinceaux, puis on en retire {c}. Combien en reste-t-il  — le stand de limonade de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-8",
      "prompt": "Calculez avec soin. Parisa collectionne {a} crayons par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il  — les olympiades sportives de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-9",
      "prompt": "Calculez avec soin. Fete : {a} eleves apportent chacun {b} poires. On en utilise {c}. Combien reste-t-il  — le conte musical de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-10",
      "prompt": "Calculez avec soin. Paulo a la bibliotheque reunit {a} tulipes et {b} tulipes, puis partage en {c} lots egaux. Combien par lot  — le rallye maths de avril ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-11",
      "prompt": "Calculez avec soin. Filipa fabrique {b} boites de {a} balles, puis en casse {c}. Combien de balles restent intacts  — la semaine bleue de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-12",
      "prompt": "Calculez avec soin. Commande : {a} oiseaux unitaires et {b} lots de {c}. Combien d’unites au total  — la semaine verte de avril ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-13",
      "prompt": "Calculez avec soin. Roberta prepare {b} sacs de {a} articles, puis en prete {c}. Combien lui en reste-t-il  — le festival du livre de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-14",
      "prompt": "Calculez avec soin. dans le preau : {b} tables de {a} serviettes, moins {c} retires. Combien restent  — l’atelier robotique de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-15",
      "prompt": "Calculez avec soin. Zainab a {a} bulbes et achete {b} boites de {c}. Combien en a-t-elle  — le club nature de avril ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-16",
      "prompt": "Calculez avec soin. Stock {a} classeurs + {b}, puis division en {c} parts. Combien par part  — le marche aux fleurs de avril ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-17",
      "prompt": "Calculez avec soin. Caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun  — le parcours sante de avril ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-18",
      "prompt": "Calculez avec soin. Reserve {a} figurines, sortie de {b} paquets de {c}. Combien reste-t-il  — le defi zero dechet de avril ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-19",
      "prompt": "Calculez avec soin. Mariana aligne {b} files de {a} pains, puis enleve {c}. Combien restent  — l’atelier bricolage de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-20",
      "prompt": "Calculez avec soin. Club : {b} equipes de {a}, puis {c} absents. Combien de presents  — la journee du sport de avril ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-21",
      "prompt": "Calculez avec soin. a la recreation, {a} passagers deja la, plus {b} cartons de {c}. Combien en tout  — la fete de l’ecole de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-22",
      "prompt": "Calculez avec soin. Lina cumule {a} et {b} feuilles, puis forme des groupes de {c}. Combien de groupes  — le marche de Noel de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-23",
      "prompt": "Calculez avec soin. Atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent  — la kermesse de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-24",
      "prompt": "Calculez avec soin. Ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers  — le tournoi de printemps de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-25",
      "prompt": "Calculez avec soin. Daryna gagne {a} × {b} points, puis en perd {c}. Quel score  — la sortie au musee de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-26",
      "prompt": "Calculez avec soin. dans la cour : {b} stands de {a} rouleaux, on en retire {c}. Combien restent  — l’atelier science de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-27",
      "prompt": "Calculez avec soin. Depot {a} stylos − {b} × {c}. Combien reste-t-il  — la semaine du gout de mai ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-28",
      "prompt": "Calculez avec soin. Sara recoit {a} bonbons + {b} sacs de {c}. Combien au total  — la journee portes ouvertes de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-29",
      "prompt": "Calculez avec soin. Partage : ({a} + {b}) plants en {c} parts. Combien par part  — la collecte solidaire de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-30",
      "prompt": "Calculez avec soin. Bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles  — le challenge lecture de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-31",
      "prompt": "Calculez avec soin. Sam emballe {b} colis de {a} poissons, puis en ouvre {c}. Combien restent fermes (en poissons)  — le projet jardin de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-32",
      "prompt": "Calculez avec soin. dans l’atelier, inventaire {a} + {b} lots de {c} sacs. Combien d’unites  — l’expo photos de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-33",
      "prompt": "Calculez avec soin. Bilal additionne {a} et {b} CHF, divise par {c}. Combien chacun  — le concert de fin d’annee de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-34",
      "prompt": "Calculez avec soin. Magasin : {a} articles − {b} packs de {c}. Combien restent  — la course d’orientation de mai ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-35",
      "prompt": "Calculez avec soin. Jardin : {b} planches de {a} plants, {c} deplaces. Combien restent  — l’atelier cuisine de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-36",
      "prompt": "Calculez avec soin. Elsa a {a} crayons, plus {b} × {c}. Combien en tout  — le vide-grenier de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-37",
      "prompt": "Calculez avec soin. Collecte ({a} + {b}) poires repartie en {c} bacs. Combien par bac  — le stand de limonade de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-38",
      "prompt": "Calculez avec soin. a la piscine : {b} cages de {a} animaux, {c} liberés. Combien restent  — les olympiades sportives de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-39",
      "prompt": "Calculez avec soin. Tom produit {b} series de {a} balles, en donne {c}. Combien reste-t-il  — le conte musical de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-40",
      "prompt": "Calculez avec soin. Commande mixte : {a} unitaires + {b} × {c}. Combien d’unites  — le rallye maths de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-41",
      "prompt": "Calculez avec soin. Caisse club : {a} + {b}, partage en {c}. Combien par membre  — la semaine bleue de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-42",
      "prompt": "Calculez avec soin. Entrepot {a} serviettes moins {b} palettes de {c}. Combien reste-t-il  — la semaine verte de mai ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-43",
      "prompt": "Calculez avec soin. Marco forme {b} groupes de {a}, puis {c} se retirent. Combien restent  — le festival du livre de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-44",
      "prompt": "Calculez avec soin. dans le preau, {a} classeurs + {b} boites de {c}. Combien au total  — l’atelier robotique de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-45",
      "prompt": "Calculez avec soin. Ana reunit {a} et {b} aiguilles, divise en {c}. Combien par lot  — le club nature de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-46",
      "prompt": "Calculez avec soin. Usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent  — le marche aux fleurs de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-47",
      "prompt": "Calculez avec soin. Stock initial {a}, retrait {b} × {c} pains. Combien reste-t-il  — le parcours sante de mai ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-48",
      "prompt": "Calculez avec soin. Selam calcule {b} semaines × {a} puzzles, moins {c}. Combien reste-t-il  — le defi zero dechet de mai ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-49",
      "prompt": "Calculez avec soin. a l’ecole : {a} deja stockes + {b} packs de {c}. Combien en stock  — l’atelier bricolage de mai ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-50",
      "prompt": "Calculez avec soin. Hugo cloture ({a} + {b}) ÷ {c} feuilles. Combien par part  — la journee du sport de mai ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-51",
      "prompt": "Calculez avec soin. Mariam achete {b} albums de {a} timbres, puis en offre {c}. Combien lui en reste-t-il  — la fete de l’ecole de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-52",
      "prompt": "Calculez avec soin. au magasin, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits  — le marche de Noel de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-53",
      "prompt": "Calculez avec soin. Sami a {a} ficelles. Sami recoit encore {b} paquets de {c} ficelles. Combien en a-t-il au total  — la kermesse de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-54",
      "prompt": "Calculez avec soin. On prepare {a} rouleaux, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets  — le tournoi de printemps de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-55",
      "prompt": "Calculez avec soin. Aya paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il  — la sortie au musee de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-56",
      "prompt": "Calculez avec soin. Depot : {a} bonbons. On envoie {b} cartons de {c} bonbons. Combien reste-t-il  — l’atelier science de juin ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-57",
      "prompt": "Calculez avec soin. au zoo, {a} rangees de {b} plants, puis on en retire {c}. Combien en reste-t-il  — la semaine du gout de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-58",
      "prompt": "Calculez avec soin. Rita collectionne {a} points par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il  — la journee portes ouvertes de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-59",
      "prompt": "Calculez avec soin. Fete : {a} eleves apportent chacun {b} poissons. On en utilise {c}. Combien reste-t-il  — la collecte solidaire de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-60",
      "prompt": "Calculez avec soin. Chiara a la mairie reunit {a} sacs et {b} sacs, puis partage en {c} lots egaux. Combien par lot  — le challenge lecture de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-61",
      "prompt": "Calculez avec soin. Hassan fabrique {b} boites de {a} clous, puis en casse {c}. Combien de clous restent intacts  — le projet jardin de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-62",
      "prompt": "Calculez avec soin. Commande : {a} perles unitaires et {b} lots de {c}. Combien d’unites au total  — l’expo photos de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-63",
      "prompt": "Calculez avec soin. Zahra prepare {b} sacs de {a} pinceaux, puis en prete {c}. Combien lui en reste-t-il  — le concert de fin d’annee de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-64",
      "prompt": "Calculez avec soin. sur le parking : {b} tables de {a} crayons, moins {c} retires. Combien restent  — la course d’orientation de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-65",
      "prompt": "Calculez avec soin. Salma a {a} poires et achete {b} boites de {c}. Combien en a-t-elle  — l’atelier cuisine de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-66",
      "prompt": "Calculez avec soin. Stock {a} tulipes + {b}, puis division en {c} parts. Combien par part  — le vide-grenier de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-67",
      "prompt": "Calculez avec soin. Caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun  — le stand de limonade de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-68",
      "prompt": "Calculez avec soin. Reserve {a} oiseaux, sortie de {b} paquets de {c}. Combien reste-t-il  — les olympiades sportives de juin ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-69",
      "prompt": "Calculez avec soin. Murat aligne {b} files de {a} articles, puis enleve {c}. Combien restent  — le conte musical de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-70",
      "prompt": "Calculez avec soin. Club : {b} equipes de {a}, puis {c} absents. Combien de presents  — le rallye maths de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-71",
      "prompt": "Calculez avec soin. dans le bus, {a} bulbes deja la, plus {b} cartons de {c}. Combien en tout  — la semaine bleue de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-72",
      "prompt": "Calculez avec soin. Samuel cumule {a} et {b} classeurs, puis forme des groupes de {c}. Combien de groupes  — la semaine verte de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-73",
      "prompt": "Calculez avec soin. Atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent  — le festival du livre de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-74",
      "prompt": "Calculez avec soin. Ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers  — l’atelier robotique de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-75",
      "prompt": "Calculez avec soin. Joao gagne {a} × {b} points, puis en perd {c}. Quel score  — le club nature de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-76",
      "prompt": "Calculez avec soin. au terrain de sport : {b} stands de {a} puzzles, on en retire {c}. Combien restent  — le marche aux fleurs de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-77",
      "prompt": "Calculez avec soin. Depot {a} passagers − {b} × {c}. Combien reste-t-il  — le parcours sante de juin ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-78",
      "prompt": "Calculez avec soin. Serena recoit {a} feuilles + {b} sacs de {c}. Combien au total  — le defi zero dechet de juin ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-79",
      "prompt": "Calculez avec soin. Partage : ({a} + {b}) bouteilles en {c} parts. Combien par part  — l’atelier bricolage de juin ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-80",
      "prompt": "Calculez avec soin. Bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles  — la journee du sport de juin ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-81",
      "prompt": "Calculez avec soin. Maya emballe {b} colis de {a} ficelles, puis en ouvre {c}. Combien restent fermes (en ficelles)  — la fete de l’ecole de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-82",
      "prompt": "Calculez avec soin. au magasin, inventaire {a} + {b} lots de {c} rouleaux. Combien d’unites  — le marche de Noel de juillet ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-83",
      "prompt": "Calculez avec soin. Rania additionne {a} et {b} CHF, divise par {c}. Combien chacun  — la kermesse de juillet ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-84",
      "prompt": "Calculez avec soin. Magasin : {a} articles − {b} packs de {c}. Combien restent  — le tournoi de printemps de juillet ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-85",
      "prompt": "Calculez avec soin. Jardin : {b} planches de {a} plants, {c} deplaces. Combien restent  — la sortie au musee de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-86",
      "prompt": "Calculez avec soin. Rui a {a} points, plus {b} × {c}. Combien en tout  — l’atelier science de juillet ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-87",
      "prompt": "Calculez avec soin. Collecte ({a} + {b}) poissons repartie en {c} bacs. Combien par bac  — la semaine du gout de juillet ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-88",
      "prompt": "Calculez avec soin. au vestiaire : {b} cages de {a} animaux, {c} liberés. Combien restent  — la journee portes ouvertes de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-89",
      "prompt": "Calculez avec soin. Laura produit {b} series de {a} clous, en donne {c}. Combien reste-t-il  — la collecte solidaire de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-90",
      "prompt": "Calculez avec soin. Commande mixte : {a} unitaires + {b} × {c}. Combien d’unites  — le challenge lecture de juillet ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-91",
      "prompt": "Calculez avec soin. Caisse club : {a} + {b}, partage en {c}. Combien par membre  — le projet jardin de juillet ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-92",
      "prompt": "Calculez avec soin. Entrepot {a} crayons moins {b} palettes de {c}. Combien reste-t-il  — l’expo photos de juillet ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-93",
      "prompt": "Calculez avec soin. Tesfay forme {b} groupes de {a}, puis {c} se retirent. Combien restent  — le concert de fin d’annee de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-94",
      "prompt": "Calculez avec soin. sur le parking, {a} tulipes + {b} boites de {c}. Combien au total  — la course d’orientation de juillet ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-95",
      "prompt": "Calculez avec soin. Claudia reunit {a} et {b} balles, divise en {c}. Combien par lot  — l’atelier cuisine de juillet ?",
      "op": "++/"
    },
    {
      "id": "melange-moyen-96",
      "prompt": "Calculez avec soin. Usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent  — le vide-grenier de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-97",
      "prompt": "Calculez avec soin. Stock initial {a}, retrait {b} × {c} articles. Combien reste-t-il  — le stand de limonade de juillet ?",
      "op": "-*"
    },
    {
      "id": "melange-moyen-98",
      "prompt": "Calculez avec soin. Walid calcule {b} semaines × {a} serviettes, moins {c}. Combien reste-t-il  — les olympiades sportives de juillet ?",
      "op": "*-"
    },
    {
      "id": "melange-moyen-99",
      "prompt": "Calculez avec soin. a la cantine : {a} deja stockes + {b} packs de {c}. Combien en stock  — le conte musical de juillet ?",
      "op": "+*"
    },
    {
      "id": "melange-moyen-100",
      "prompt": "Calculez avec soin. Soraya cloture ({a} + {b}) ÷ {c} classeurs. Combien par part  — le rallye maths de juillet ?",
      "op": "++/"
    }
  ],
  "addition:avance": [
    {
      "id": "addition-avance-1",
      "prompt": "Pour un projet scolaire, {a} livres sont reserves le matin. L’apres-midi, on ajoute {b}. Combien au total  — le vide-grenier de juillet ?",
      "op": "+"
    },
    {
      "id": "addition-avance-2",
      "prompt": "Pour le stand de limonade de juillet, une association collecte {a} vignettes, puis recoit encore {b}. Quel total possede-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-avance-3",
      "prompt": "Pour les olympiades sportives de juillet, un entrepot a classe {a} bananes. Une livraison de {b} arrive. Combien d’unites a classer ?",
      "op": "+"
    },
    {
      "id": "addition-avance-4",
      "prompt": "Pour le conte musical de juillet, un club compte {a} inscriptions, puis {b} nouvelles. Combien d’inscriptions y a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-avance-5",
      "prompt": "Pour le rallye maths de juillet, une entreprise prepare {a} oeufs lundi et {b} mardi. Combien ont ete prepares ?",
      "op": "+"
    },
    {
      "id": "addition-avance-6",
      "prompt": "Pour la semaine bleue de juillet, lors d’un salon, {a} visiteurs avant midi et {b} apres. Combien d’entrees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-7",
      "prompt": "Pour la semaine verte de juillet, un magasin vend {a} articles le matin et {b} l’apres-midi. Combien d’articles vendus ?",
      "op": "+"
    },
    {
      "id": "addition-avance-8",
      "prompt": "Pour le festival du livre de juillet, la ville plante {a} jeux dans un quartier et {b} dans un parc. Combien plantes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-9",
      "prompt": "Pour l’atelier robotique de juillet, un musee recoit {a} visiteurs en semaine et {b} le week-end. Combien de visiteurs ?",
      "op": "+"
    },
    {
      "id": "addition-avance-10",
      "prompt": "Pour le club nature de juillet, une usine produit {a} pieces avant la pause et {b} apres. Combien de pieces ?",
      "op": "+"
    },
    {
      "id": "addition-avance-11",
      "prompt": "Pour le marche aux fleurs de juillet, a la boulangerie, un service prepare {a} dossiers puis {b} dossiers supplements. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-12",
      "prompt": "Pour le parcours sante de juillet, bilal coordonne {a} chiens pour le site A et {b} pour le site B. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-avance-13",
      "prompt": "Pour le defi zero dechet de juillet, region nord : {a} timbres alloues. Region sud : {b}. Combien d’allocations ?",
      "op": "+"
    },
    {
      "id": "addition-avance-14",
      "prompt": "Pour l’atelier bricolage de juillet, trimestre 1 : {a} unites livrees. Trimestre 2 : {b}. Combien d’unites livrees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-15",
      "prompt": "Pour la journee du sport de juillet, elsa consolide {a} tablettes d’un prestataire et {b} d’un second. Combien consolides ?",
      "op": "+"
    },
    {
      "id": "addition-avance-16",
      "prompt": "Pour la fete de l’ecole de aout, plateforme logistique : {a} colis traites avant 12 h, {b} apres. Combien traites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-17",
      "prompt": "Pour le marche de Noel de aout, campagne nationale : {a} dons puis {b} dons supplementaires. Combien de dons ?",
      "op": "+"
    },
    {
      "id": "addition-avance-18",
      "prompt": "Pour la kermesse de aout, a l’atelier bois : lot principal {a} pinces, lot complementaire {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-19",
      "prompt": "Pour le tournoi de printemps de aout, hopital de jour : {a} dossiers le matin, {b} l’apres-midi. Combien de dossiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-20",
      "prompt": "Pour la sortie au musee de aout, adam arbitre un total de {a} points puis {b} points de prolongations. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-21",
      "prompt": "Pour l’atelier science de aout, marche public : {a} unites commandees, avenant de {b}. Combien d’unites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-22",
      "prompt": "Pour la semaine du gout de aout, federation : {a} licences actives + {b} nouvelles. Combien de licences ?",
      "op": "+"
    },
    {
      "id": "addition-avance-23",
      "prompt": "Pour la journee portes ouvertes de aout, au parc, centre de tri : {a} colis, puis arrivage de {b}. Combien de colis ?",
      "op": "+"
    },
    {
      "id": "addition-avance-24",
      "prompt": "Pour la collecte solidaire de aout, bilan annuel partiel : {a} feuilles A4 au S1, {b} au S2. Combien sur l’annee ?",
      "op": "+"
    },
    {
      "id": "addition-avance-25",
      "prompt": "Pour le challenge lecture de aout, svitlana mutualise {a} pots d’un service et {b} d’un autre. Combien mutualises ?",
      "op": "+"
    },
    {
      "id": "addition-avance-26",
      "prompt": "Pour le projet jardin de aout, chaine de production A : {a} pieces. Chaine B : {b}. Combien de pieces ?",
      "op": "+"
    },
    {
      "id": "addition-avance-27",
      "prompt": "Pour l’expo photos de aout, collectivite : {a} plants en zone urbaine, {b} en zone periurbaine. Combien plantes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-28",
      "prompt": "Pour le concert de fin d’annee de aout, au magasin : volume initial {a} gommes, volume ajoute {b}. Quel volume total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-29",
      "prompt": "Pour la course d’orientation de aout, reseau scolaire : {a} cahiers au cycle 1, {b} au cycle 2. Combien de cahiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-30",
      "prompt": "Pour l’atelier cuisine de aout, mariam agrege {a} mesures puis {b} mesures. Combien de mesures agregees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-31",
      "prompt": "Pour le vide-grenier de aout, entrepot regional : {a} palettes, puis {b} palettes. Combien de palettes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-32",
      "prompt": "Pour le stand de limonade de aout, salon professionnel : {a} badges matin, {b} apres-midi. Combien de badges ?",
      "op": "+"
    },
    {
      "id": "addition-avance-33",
      "prompt": "Pour les olympiades sportives de aout, au zoo, hub : {a} expeditions + {b} expeditions. Combien d’expeditions ?",
      "op": "+"
    },
    {
      "id": "addition-avance-34",
      "prompt": "Pour le conte musical de aout, programme : {a} places pourvues, puis {b} places. Combien de places pourvues ?",
      "op": "+"
    },
    {
      "id": "addition-avance-35",
      "prompt": "Pour le rallye maths de aout, reza consolide les stocks : {a} cubes puis {b}. Combien en stock consolide ?",
      "op": "+"
    },
    {
      "id": "addition-avance-36",
      "prompt": "Pour la semaine bleue de aout, ligne budgétaire : {a} CHF deja engages + {b} CHF. Combien engages ?",
      "op": "+"
    },
    {
      "id": "addition-avance-37",
      "prompt": "Pour la semaine verte de aout, parc machines : {a} heures avant maintenance, {b} apres. Combien d’heures ?",
      "op": "+"
    },
    {
      "id": "addition-avance-38",
      "prompt": "Pour le festival du livre de aout, dans l’atelier : flux entrant {a} tickets + {b}. Combien d’unites en entree ?",
      "op": "+"
    },
    {
      "id": "addition-avance-39",
      "prompt": "Pour l’atelier robotique de aout, consortium : partenaire A livre {a}, partenaire B livre {b} eleves. Total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-40",
      "prompt": "Pour le club nature de aout, hassan synthonise {a} dossiers locaux et {b} dossiers centraux. Combien de dossiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-41",
      "prompt": "Pour le marche aux fleurs de aout, centre d’appels : {a} appels traites, puis {b}. Combien d’appels traites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-42",
      "prompt": "Pour le parcours sante de aout, plateforme e-commerce : {a} commandes matin, {b} soir. Combien de commandes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-43",
      "prompt": "Pour le defi zero dechet de aout, au centre aere, archive : {a} boites + {b} boites. Combien de boites archivees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-44",
      "prompt": "Pour l’atelier bricolage de aout, projet intercommunal : {a} paniers commune A + {b} commune B. Combien au projet ?",
      "op": "+"
    },
    {
      "id": "addition-avance-45",
      "prompt": "Pour la journee du sport de aout, mustafa consolide un inventaire de {a} verres avec un inventaire de {b}. Total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-46",
      "prompt": "Pour la fete de l’ecole de septembre, semestre scolaire : {a} activites realisees + {b}. Combien d’activites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-47",
      "prompt": "Pour le marche de Noel de septembre, usine 1 : {a} lots. Usine 2 : {b} lots. Combien de lots produits ?",
      "op": "+"
    },
    {
      "id": "addition-avance-48",
      "prompt": "Pour la kermesse de septembre, a l’atelier bois : premiere vague {a} arrosoirs, seconde vague {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-49",
      "prompt": "Pour le tournoi de printemps de septembre, observatoire : {a} observations puis {b}. Combien d’observations ?",
      "op": "+"
    },
    {
      "id": "addition-avance-50",
      "prompt": "Pour la sortie au musee de septembre, olivia finalise {a} boutons d’un chantier et {b} d’un second. Combien finalises ?",
      "op": "+"
    },
    {
      "id": "addition-avance-51",
      "prompt": "Pour un projet scolaire, {a} etiquettes sont reserves le matin. L’apres-midi, on ajoute {b}. Combien au total  — l’atelier science de septembre ?",
      "op": "+"
    },
    {
      "id": "addition-avance-52",
      "prompt": "Pour la semaine du gout de septembre, une association collecte {a} feuilles A4, puis recoit encore {b}. Quel total possede-t-elle ?",
      "op": "+"
    },
    {
      "id": "addition-avance-53",
      "prompt": "Pour la journee portes ouvertes de septembre, un entrepot a classe {a} pots. Une livraison de {b} arrive. Combien d’unites a classer ?",
      "op": "+"
    },
    {
      "id": "addition-avance-54",
      "prompt": "Pour la collecte solidaire de septembre, un club compte {a} inscriptions, puis {b} nouvelles. Combien d’inscriptions y a-t-il ?",
      "op": "+"
    },
    {
      "id": "addition-avance-55",
      "prompt": "Pour le challenge lecture de septembre, une entreprise prepare {a} billes lundi et {b} mardi. Combien ont ete prepares ?",
      "op": "+"
    },
    {
      "id": "addition-avance-56",
      "prompt": "Pour le projet jardin de septembre, lors d’un salon, {a} visiteurs avant midi et {b} apres. Combien d’entrees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-57",
      "prompt": "Pour l’expo photos de septembre, un magasin vend {a} articles le matin et {b} l’apres-midi. Combien d’articles vendus ?",
      "op": "+"
    },
    {
      "id": "addition-avance-58",
      "prompt": "Pour le concert de fin d’annee de septembre, la ville plante {a} vignettes dans un quartier et {b} dans un parc. Combien plantes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-59",
      "prompt": "Pour la course d’orientation de septembre, un musee recoit {a} visiteurs en semaine et {b} le week-end. Combien de visiteurs ?",
      "op": "+"
    },
    {
      "id": "addition-avance-60",
      "prompt": "Pour l’atelier cuisine de septembre, une usine produit {a} pieces avant la pause et {b} apres. Combien de pieces ?",
      "op": "+"
    },
    {
      "id": "addition-avance-61",
      "prompt": "Pour le vide-grenier de septembre, a l’ecole, un service prepare {a} dossiers puis {b} dossiers supplements. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-62",
      "prompt": "Pour le stand de limonade de septembre, rania coordonne {a} roses pour le site A et {b} pour le site B. Combien en tout ?",
      "op": "+"
    },
    {
      "id": "addition-avance-63",
      "prompt": "Pour les olympiades sportives de septembre, region nord : {a} cubes alloues. Region sud : {b}. Combien d’allocations ?",
      "op": "+"
    },
    {
      "id": "addition-avance-64",
      "prompt": "Pour le conte musical de septembre, trimestre 1 : {a} unites livrees. Trimestre 2 : {b}. Combien d’unites livrees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-65",
      "prompt": "Pour le rallye maths de septembre, rui consolide {a} raquettes d’un prestataire et {b} d’un second. Combien consolides ?",
      "op": "+"
    },
    {
      "id": "addition-avance-66",
      "prompt": "Pour la semaine bleue de septembre, plateforme logistique : {a} colis traites avant 12 h, {b} apres. Combien traites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-67",
      "prompt": "Pour la semaine verte de septembre, campagne nationale : {a} dons puis {b} dons supplementaires. Combien de dons ?",
      "op": "+"
    },
    {
      "id": "addition-avance-68",
      "prompt": "Pour le festival du livre de septembre, dans l’atelier : lot principal {a} chiens, lot complementaire {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-69",
      "prompt": "Pour l’atelier robotique de septembre, hopital de jour : {a} dossiers le matin, {b} l’apres-midi. Combien de dossiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-70",
      "prompt": "Pour le club nature de septembre, asma arbitre un total de {a} points puis {b} points de prolongations. Quel total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-71",
      "prompt": "Pour le marche aux fleurs de septembre, marche public : {a} unites commandees, avenant de {b}. Combien d’unites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-72",
      "prompt": "Pour le parcours sante de septembre, federation : {a} licences actives + {b} nouvelles. Combien de licences ?",
      "op": "+"
    },
    {
      "id": "addition-avance-73",
      "prompt": "Pour le defi zero dechet de septembre, au centre aere, centre de tri : {a} colis, puis arrivage de {b}. Combien de colis ?",
      "op": "+"
    },
    {
      "id": "addition-avance-74",
      "prompt": "Pour l’atelier bricolage de septembre, bilan annuel partiel : {a} pinces au S1, {b} au S2. Combien sur l’annee ?",
      "op": "+"
    },
    {
      "id": "addition-avance-75",
      "prompt": "Pour la journee du sport de septembre, matteo mutualise {a} planches d’un service et {b} d’un autre. Combien mutualises ?",
      "op": "+"
    },
    {
      "id": "addition-avance-76",
      "prompt": "Pour la fete de l’ecole de octobre, chaine de production A : {a} pieces. Chaine B : {b}. Combien de pieces ?",
      "op": "+"
    },
    {
      "id": "addition-avance-77",
      "prompt": "Pour le marche de Noel de octobre, collectivite : {a} plants en zone urbaine, {b} en zone periurbaine. Combien plantes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-78",
      "prompt": "Pour la kermesse de octobre, a l’atelier bois : volume initial {a} boutons, volume ajoute {b}. Quel volume total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-79",
      "prompt": "Pour le tournoi de printemps de octobre, reseau scolaire : {a} cahiers au cycle 1, {b} au cycle 2. Combien de cahiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-80",
      "prompt": "Pour la sortie au musee de octobre, yohannes agrege {a} mesures puis {b} mesures. Combien de mesures agregees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-81",
      "prompt": "Pour l’atelier science de octobre, entrepot regional : {a} palettes, puis {b} palettes. Combien de palettes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-82",
      "prompt": "Pour la semaine du gout de octobre, salon professionnel : {a} badges matin, {b} apres-midi. Combien de badges ?",
      "op": "+"
    },
    {
      "id": "addition-avance-83",
      "prompt": "Pour la journee portes ouvertes de octobre, au parc, hub : {a} expeditions + {b} expeditions. Combien d’expeditions ?",
      "op": "+"
    },
    {
      "id": "addition-avance-84",
      "prompt": "Pour la collecte solidaire de octobre, programme : {a} places pourvues, puis {b} places. Combien de places pourvues ?",
      "op": "+"
    },
    {
      "id": "addition-avance-85",
      "prompt": "Pour le challenge lecture de octobre, anas consolide les stocks : {a} livres puis {b}. Combien en stock consolide ?",
      "op": "+"
    },
    {
      "id": "addition-avance-86",
      "prompt": "Pour le projet jardin de octobre, ligne budgétaire : {a} CHF deja engages + {b} CHF. Combien engages ?",
      "op": "+"
    },
    {
      "id": "addition-avance-87",
      "prompt": "Pour l’expo photos de octobre, parc machines : {a} heures avant maintenance, {b} apres. Combien d’heures ?",
      "op": "+"
    },
    {
      "id": "addition-avance-88",
      "prompt": "Pour le concert de fin d’annee de octobre, au magasin : flux entrant {a} gateaux + {b}. Combien d’unites en entree ?",
      "op": "+"
    },
    {
      "id": "addition-avance-89",
      "prompt": "Pour la course d’orientation de octobre, consortium : partenaire A livre {a}, partenaire B livre {b} oeufs. Total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-90",
      "prompt": "Pour l’atelier cuisine de octobre, filipa synthonise {a} dossiers locaux et {b} dossiers centraux. Combien de dossiers ?",
      "op": "+"
    },
    {
      "id": "addition-avance-91",
      "prompt": "Pour le vide-grenier de octobre, centre d’appels : {a} appels traites, puis {b}. Combien d’appels traites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-92",
      "prompt": "Pour le stand de limonade de octobre, plateforme e-commerce : {a} commandes matin, {b} soir. Combien de commandes ?",
      "op": "+"
    },
    {
      "id": "addition-avance-93",
      "prompt": "Pour les olympiades sportives de octobre, au zoo, archive : {a} boites + {b} boites. Combien de boites archivees ?",
      "op": "+"
    },
    {
      "id": "addition-avance-94",
      "prompt": "Pour le conte musical de octobre, projet intercommunal : {a} tickets commune A + {b} commune B. Combien au projet ?",
      "op": "+"
    },
    {
      "id": "addition-avance-95",
      "prompt": "Pour le rallye maths de octobre, shirin consolide un inventaire de {a} eleves avec un inventaire de {b}. Total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-96",
      "prompt": "Pour la semaine bleue de octobre, semestre scolaire : {a} activites realisees + {b}. Combien d’activites ?",
      "op": "+"
    },
    {
      "id": "addition-avance-97",
      "prompt": "Pour la semaine verte de octobre, usine 1 : {a} lots. Usine 2 : {b} lots. Combien de lots produits ?",
      "op": "+"
    },
    {
      "id": "addition-avance-98",
      "prompt": "Pour le festival du livre de octobre, dans l’atelier : premiere vague {a} enveloppes, seconde vague {b}. Combien au total ?",
      "op": "+"
    },
    {
      "id": "addition-avance-99",
      "prompt": "Pour l’atelier robotique de octobre, observatoire : {a} observations puis {b}. Combien d’observations ?",
      "op": "+"
    },
    {
      "id": "addition-avance-100",
      "prompt": "Pour le club nature de octobre, aissatou finalise {a} paniers d’un chantier et {b} d’un second. Combien finalises ?",
      "op": "+"
    }
  ],
  "soustraction:avance": [
    {
      "id": "soustraction-avance-1",
      "prompt": "Pour la course d’orientation de aout, un cinema avait prevu {a} places. Apres annulations, {b} ne sont plus reservees. Combien restent reservees ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-2",
      "prompt": "Pour l’atelier cuisine de aout, une association possede {a} CHF. Elle depense {b} CHF en materiel. Quelle somme reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-3",
      "prompt": "Pour le vide-grenier de aout, la reserve compte {a} roses. Elle en transfert {b} vers les classes. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-4",
      "prompt": "Pour le stand de limonade de aout, un club avait {a} ballons. Apres un match, {b} sont abimes. Combien restent utilisables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-5",
      "prompt": "Pour les olympiades sportives de aout, une entreprise doit livrer {a} colis. Elle en livre {b} le matin. Combien reste-t-il a livrer ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-6",
      "prompt": "Pour le conte musical de aout, lors d’un salon, {a} badges sont imprimes. On en distribue {b} a l’ouverture. Combien restent-ils ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-7",
      "prompt": "Pour le rallye maths de aout, un magasin avait {a} articles en rayon. Il en vend {b}. Combien restent en rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-8",
      "prompt": "Pour la semaine bleue de aout, une ville dispose de {a} plants. Elle en utilise {b} dans un quartier. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-9",
      "prompt": "Pour la semaine verte de aout, un entrepot contient {a} cahiers. Une ecole en commande {b}. Combien restent dans l’entrepot ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-10",
      "prompt": "Pour le festival du livre de aout, une course comptait {a} inscrits. Avant le depart, {b} se desistent. Combien restent inscrits ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-11",
      "prompt": "Pour l’atelier robotique de aout, a la bibliotheque, un service avait {a} dossiers. Il en archive {b}. Combien restent actifs ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-12",
      "prompt": "Pour le club nature de aout, hugo gere {a} cailloux au site principal et en deplace {b} vers l’annexe. Combien restent au site principal ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-13",
      "prompt": "Pour le marche aux fleurs de aout, plateforme : {a} commandes ouvertes, {b} expediees. Combien restent a traiter ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-14",
      "prompt": "Pour le parcours sante de aout, hopital : {a} lits, {b} occupes. Combien de lits restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-15",
      "prompt": "Pour le defi zero dechet de aout, federation : {a} licences, {b} non renouvelees. Combien de licences actives restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-16",
      "prompt": "Pour l’atelier bricolage de aout, au club de sport : volume {a} crayons, sortie logistique de {b}. Combien restent sur site ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-17",
      "prompt": "Pour la journee du sport de aout, aya arbitre un budget de {a} CHF moins {b} CHF engages. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-18",
      "prompt": "Pour la fete de l’ecole de septembre, usine : {a} pieces lancees, {b} ecartees au controle. Combien restent validées ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-19",
      "prompt": "Pour le marche de Noel de septembre, collectivite : {a} places en crèche, {b} attribuees. Combien restent vacantes ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-20",
      "prompt": "Pour la kermesse de septembre, reseau : {a} tickets support, {b} resolus. Combien de tickets restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-21",
      "prompt": "Pour le tournoi de printemps de septembre, a la bibliotheque, hub : {a} expeditions planifiees, {b} annulees. Combien restent planifiees ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-22",
      "prompt": "Pour la sortie au musee de septembre, marche public : {a} unites, avenant reduisant de {b}. Combien d’unites restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-23",
      "prompt": "Pour l’atelier science de septembre, hassan consolide : stock {a} enfants moins transfert de {b}. Combien en stock local ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-24",
      "prompt": "Pour la semaine du gout de septembre, semestre : {a} heures allouees, {b} consommees. Combien d’heures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-25",
      "prompt": "Pour la journee portes ouvertes de septembre, entrepot regional : {a} palettes, {b} expediees. Combien de palettes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-26",
      "prompt": "Pour la collecte solidaire de septembre, au club de sport : effectif projet {a}, {b} reaffectes. Combien restent sur le projet ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-27",
      "prompt": "Pour le challenge lecture de septembre, observatoire : {a} alertes, {b} cloturees. Combien d’alertes restent actives ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-28",
      "prompt": "Pour le projet jardin de septembre, mustafa decommissionne {b} modules sur un parc de {a}. Combien restent en service ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-29",
      "prompt": "Pour l’expo photos de septembre, centre d’appels : {a} dossiers, {b} traites. Combien restent en file ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-30",
      "prompt": "Pour le concert de fin d’annee de septembre, programme : {a} places, {b} desistements. Combien de places restent pourvues ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-31",
      "prompt": "Pour la course d’orientation de septembre, a la bibliotheque, archive : {a} boites, {b} transferees. Combien de boites restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-32",
      "prompt": "Pour l’atelier cuisine de septembre, consortium : stock partage {a} fils, retrait partenaire de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-33",
      "prompt": "Pour le vide-grenier de septembre, olivia solde un inventaire de {a} gommes apres sortie de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-34",
      "prompt": "Pour le stand de limonade de septembre, ligne : {a} CHF budgetes, {b} CHF depenses. Combien restent sur la ligne ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-35",
      "prompt": "Pour les olympiades sportives de septembre, parc : {a} heures machine, {b} heures de panne. Combien d’heures utiles restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-36",
      "prompt": "Pour le conte musical de septembre, au club de sport : flux {a} oeufs, extraction de {b}. Combien restent en flux ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-37",
      "prompt": "Pour le rallye maths de septembre, salon : {a} badges, {b} invalides. Combien de badges restent valides ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-38",
      "prompt": "Pour la semaine bleue de septembre, beatriz retranche {b} mesures d’un jeu de {a}. Combien de mesures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-39",
      "prompt": "Pour la semaine verte de septembre, usines : production cible {a}, rebuts {b}. Combien d’unites restent bonnes ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-40",
      "prompt": "Pour le festival du livre de septembre, intercommunal : {a} oiseaux alloues, {b} reaffectes. Combien restent alloues ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-41",
      "prompt": "Pour l’atelier robotique de septembre, a la bibliotheque : premiere dotation {a} photos moins {b} consommes. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-42",
      "prompt": "Pour le club nature de septembre, plateforme : {a} missions, {b} annulees. Combien de missions restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-43",
      "prompt": "Pour le marche aux fleurs de septembre, maya clôture {b} dossiers sur {a}. Combien de dossiers restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-44",
      "prompt": "Pour le parcours sante de septembre, region : {a} kits, distribution de {b}. Combien de kits restent en region ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-45",
      "prompt": "Pour le defi zero dechet de septembre, chaine : {a} lots, {b} bloques. Combien de lots restent liberables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-46",
      "prompt": "Pour l’atelier bricolage de septembre, au club de sport, labo central : {a} echantillons, {b} analyses. Combien restent en attente ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-47",
      "prompt": "Pour la journee du sport de septembre, senait majore un reste : {a} dossiers moins {b} sortis. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-48",
      "prompt": "Pour la fete de l’ecole de octobre, campagne : {a} contacts, {b} injoignables. Combien de contacts restent joignables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-49",
      "prompt": "Pour le marche de Noel de octobre, entrepot tampon : {a} aiguilles, ponction de {b}. Combien restent en tampon ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-50",
      "prompt": "Pour la kermesse de octobre, davide finalise un inventaire : {a} moins {b} cahiers. Combien finalises en stock ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-51",
      "prompt": "Pour le tournoi de printemps de octobre, un cinema avait prevu {a} places. Apres annulations, {b} ne sont plus reservees. Combien restent reservees ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-52",
      "prompt": "Pour la sortie au musee de octobre, une association possede {a} CHF. Elle depense {b} CHF en materiel. Quelle somme reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-53",
      "prompt": "Pour l’atelier science de octobre, la reserve compte {a} fleurs. Elle en transfert {b} vers les classes. Combien restent en reserve ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-54",
      "prompt": "Pour la semaine du gout de octobre, un club avait {a} ballons. Apres un match, {b} sont abimes. Combien restent utilisables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-55",
      "prompt": "Pour la journee portes ouvertes de octobre, une entreprise doit livrer {a} colis. Elle en livre {b} le matin. Combien reste-t-il a livrer ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-56",
      "prompt": "Pour la collecte solidaire de octobre, lors d’un salon, {a} badges sont imprimes. On en distribue {b} a l’ouverture. Combien restent-ils ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-57",
      "prompt": "Pour le challenge lecture de octobre, un magasin avait {a} articles en rayon. Il en vend {b}. Combien restent en rayon ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-58",
      "prompt": "Pour le projet jardin de octobre, une ville dispose de {a} plants. Elle en utilise {b} dans un quartier. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-59",
      "prompt": "Pour l’expo photos de octobre, un entrepot contient {a} cahiers. Une ecole en commande {b}. Combien restent dans l’entrepot ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-60",
      "prompt": "Pour le concert de fin d’annee de octobre, une course comptait {a} inscrits. Avant le depart, {b} se desistent. Combien restent inscrits ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-61",
      "prompt": "Pour la course d’orientation de octobre, a la bibliotheque, un service avait {a} dossiers. Il en archive {b}. Combien restent actifs ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-62",
      "prompt": "Pour l’atelier cuisine de octobre, soraya gere {a} graines au site principal et en deplace {b} vers l’annexe. Combien restent au site principal ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-63",
      "prompt": "Pour le vide-grenier de octobre, plateforme : {a} commandes ouvertes, {b} expediees. Combien restent a traiter ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-64",
      "prompt": "Pour le stand de limonade de octobre, hopital : {a} lits, {b} occupes. Combien de lits restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-65",
      "prompt": "Pour les olympiades sportives de octobre, federation : {a} licences, {b} non renouvelees. Combien de licences actives restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-66",
      "prompt": "Pour le conte musical de octobre, au club de sport : volume {a} billes, sortie logistique de {b}. Combien restent sur site ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-67",
      "prompt": "Pour le rallye maths de octobre, alessandra arbitre un budget de {a} CHF moins {b} CHF engages. Combien restent disponibles ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-68",
      "prompt": "Pour la semaine bleue de octobre, usine : {a} pieces lancees, {b} ecartees au controle. Combien restent validées ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-69",
      "prompt": "Pour la semaine verte de octobre, collectivite : {a} places en crèche, {b} attribuees. Combien restent vacantes ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-70",
      "prompt": "Pour le festival du livre de octobre, reseau : {a} tickets support, {b} resolus. Combien de tickets restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-71",
      "prompt": "Pour l’atelier robotique de octobre, a la bibliotheque, hub : {a} expeditions planifiees, {b} annulees. Combien restent planifiees ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-72",
      "prompt": "Pour le club nature de octobre, marche public : {a} unites, avenant reduisant de {b}. Combien d’unites restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-73",
      "prompt": "Pour le marche aux fleurs de octobre, filipa consolide : stock {a} passagers moins transfert de {b}. Combien en stock local ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-74",
      "prompt": "Pour le parcours sante de octobre, semestre : {a} heures allouees, {b} consommees. Combien d’heures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-75",
      "prompt": "Pour le defi zero dechet de octobre, entrepot regional : {a} palettes, {b} expediees. Combien de palettes restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-76",
      "prompt": "Pour l’atelier bricolage de octobre, au club de sport : effectif projet {a}, {b} reaffectes. Combien restent sur le projet ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-77",
      "prompt": "Pour la journee du sport de octobre, observatoire : {a} alertes, {b} cloturees. Combien d’alertes restent actives ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-78",
      "prompt": "Pour la fete de l’ecole de novembre, shirin decommissionne {b} modules sur un parc de {a}. Combien restent en service ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-79",
      "prompt": "Pour le marche de Noel de novembre, centre d’appels : {a} dossiers, {b} traites. Combien restent en file ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-80",
      "prompt": "Pour la kermesse de novembre, programme : {a} places, {b} desistements. Combien de places restent pourvues ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-81",
      "prompt": "Pour le tournoi de printemps de novembre, a la bibliotheque, archive : {a} boites, {b} transferees. Combien de boites restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-82",
      "prompt": "Pour la sortie au musee de novembre, consortium : stock partage {a} rouleaux, retrait partenaire de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-83",
      "prompt": "Pour l’atelier science de novembre, aissatou solde un inventaire de {a} cartes apres sortie de {b}. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-84",
      "prompt": "Pour la semaine du gout de novembre, ligne : {a} CHF budgetes, {b} CHF depenses. Combien restent sur la ligne ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-85",
      "prompt": "Pour la journee portes ouvertes de novembre, parc : {a} heures machine, {b} heures de panne. Combien d’heures utiles restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-86",
      "prompt": "Pour la collecte solidaire de novembre, au club de sport : flux {a} croissants, extraction de {b}. Combien restent en flux ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-87",
      "prompt": "Pour le challenge lecture de novembre, salon : {a} badges, {b} invalides. Combien de badges restent valides ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-88",
      "prompt": "Pour le projet jardin de novembre, sofia retranche {b} mesures d’un jeu de {a}. Combien de mesures restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-89",
      "prompt": "Pour l’expo photos de novembre, usines : production cible {a}, rebuts {b}. Combien d’unites restent bonnes ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-90",
      "prompt": "Pour le concert de fin d’annee de novembre, intercommunal : {a} eleves alloues, {b} reaffectes. Combien restent alloues ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-91",
      "prompt": "Pour la course d’orientation de novembre, a la bibliotheque : premiere dotation {a} poissons moins {b} consommes. Combien restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-92",
      "prompt": "Pour l’atelier cuisine de novembre, plateforme : {a} missions, {b} annulees. Combien de missions restent ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-93",
      "prompt": "Pour le vide-grenier de novembre, sam clôture {b} dossiers sur {a}. Combien de dossiers restent ouverts ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-94",
      "prompt": "Pour le stand de limonade de novembre, region : {a} kits, distribution de {b}. Combien de kits restent en region ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-95",
      "prompt": "Pour les olympiades sportives de novembre, chaine : {a} lots, {b} bloques. Combien de lots restent liberables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-96",
      "prompt": "Pour le conte musical de novembre, au club de sport, labo central : {a} echantillons, {b} analyses. Combien restent en attente ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-97",
      "prompt": "Pour le rallye maths de novembre, remi majore un reste : {a} ficelles moins {b} sortis. Combien reste-t-il ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-98",
      "prompt": "Pour la semaine bleue de novembre, campagne : {a} contacts, {b} injoignables. Combien de contacts restent joignables ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-99",
      "prompt": "Pour la semaine verte de novembre, entrepot tampon : {a} bobines, ponction de {b}. Combien restent en tampon ?",
      "op": "-"
    },
    {
      "id": "soustraction-avance-100",
      "prompt": "Pour le festival du livre de novembre, mia finalise un inventaire : {a} moins {b} crayons. Combien finalises en stock ?",
      "op": "-"
    }
  ],
  "multiplication:avance": [
    {
      "id": "multiplication-avance-1",
      "prompt": "Pour le defi zero dechet de fevrier, tournoi a la gare : {b} equipes de {a} joueurs. Combien d’athletes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-2",
      "prompt": "Pour l’atelier bricolage de fevrier, usine : {b} cartons de {a} pieces. Combien de pieces emballees ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-3",
      "prompt": "Pour la journee du sport de fevrier, aya gere {b} immeubles de {a} appartements. Combien d’appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-4",
      "prompt": "Pour la fete de l’ecole de mars, depot : {b} palettes de {a} choux. Combien de choux partent ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-5",
      "prompt": "Pour le marche de Noel de mars, commande scolaire : {b} classes × {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-6",
      "prompt": "Pour la kermesse de mars, rita planifie {b} semaines × {a} seances. Combien de seances au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-7",
      "prompt": "Pour le tournoi de printemps de mars, festival : {b} stands × {a} brochures. Combien de brochures a imprimer ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-8",
      "prompt": "Pour la sortie au musee de mars, production du mois : {b} lots de {a} unites. Quelle production totale ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-9",
      "prompt": "Pour l’atelier science de mars, a l’atelier bois, logistique : {b} tours de livraison × {a} colis. Combien de colis ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-10",
      "prompt": "Pour la semaine du gout de mars, farid calcule {b} sites × {a} oranges par site. Combien de oranges faut-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-11",
      "prompt": "Pour la journee portes ouvertes de mars, region : {b} centres de {a} places. Combien de places regionales ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-12",
      "prompt": "Pour la collecte solidaire de mars, consortium : {b} partenaires × {a} bouteilles. Combien de bouteilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-13",
      "prompt": "Pour le challenge lecture de mars, dans la classe : {b} hubs de {a} expeditions. Combien d’expeditions ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-14",
      "prompt": "Pour le projet jardin de mars, mustafa dimensionne {b} lignes de {a} postes. Combien de postes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-15",
      "prompt": "Pour l’expo photos de mars, hopital : {b} unites de {a} lits. Combien de lits ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-16",
      "prompt": "Pour le concert de fin d’annee de mars, federation : {b} clubs de {a} licences. Combien de licences ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-17",
      "prompt": "Pour la course d’orientation de mars, plateforme : {b} serveurs de {a} instances. Combien d’instances ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-18",
      "prompt": "Pour l’atelier cuisine de mars, a la recreation, usine : {b} chaines de {a} postes. Combien de postes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-19",
      "prompt": "Pour le vide-grenier de mars, olivia alloue {b} budgets de {a} unites. Combien d’unites allouees ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-20",
      "prompt": "Pour le stand de limonade de mars, salon : {b} halls de {a} stands. Combien de stands ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-21",
      "prompt": "Pour les olympiades sportives de mars, reseau scolaire : {b} etablissements × {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-22",
      "prompt": "Pour le conte musical de mars, campagne : {b} regions × {a} kits. Combien de kits ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-23",
      "prompt": "Pour le rallye maths de mars, dans la classe : {b} entrepots de {a} palettes. Combien de palettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-24",
      "prompt": "Pour la semaine bleue de mars, beatriz consolide {b} sites × {a} stylos. Combien de stylos ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-25",
      "prompt": "Pour la semaine verte de mars, marche public : {b} lots de {a} unites. Combien d’unites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-26",
      "prompt": "Pour le festival du livre de mars, observatoire : {b} stations de {a} capteurs. Combien de capteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-27",
      "prompt": "Pour l’atelier robotique de mars, transport : {b} convois de {a} wagons. Combien de wagons ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-28",
      "prompt": "Pour le club nature de mars, a la recreation, archive : {b} salles de {a} boites. Combien de boites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-29",
      "prompt": "Pour le marche aux fleurs de mars, maya planifie {b} vagues de {a} participants. Combien de participants ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-30",
      "prompt": "Pour le parcours sante de mars, production annuelle : {b} trimestres × {a} lots. Combien de lots ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-31",
      "prompt": "Pour le defi zero dechet de mars, centre : {b} batiments de {a} salles. Combien de salles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-32",
      "prompt": "Pour l’atelier bricolage de mars, logistique : {b} tours × {a} feuilles. Combien de feuilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-33",
      "prompt": "Pour la journee du sport de mars, dans la classe : {b} zones de {a} emplacements. Combien d’emplacements ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-34",
      "prompt": "Pour la fete de l’ecole de avril, rui evalue {b} portefeuilles de {a} dossiers. Combien de dossiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-35",
      "prompt": "Pour le marche de Noel de avril, usines : {b} sites de {a} machines. Combien de machines ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-36",
      "prompt": "Pour la kermesse de avril, evenement : {b} sessions de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-37",
      "prompt": "Pour le tournoi de printemps de avril, collectivite : {b} quartiers × {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-38",
      "prompt": "Pour la sortie au musee de avril, a la recreation, labo : {b} plateformes de {a} tests. Combien de tests ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-39",
      "prompt": "Pour l’atelier science de avril, asma mutualise {b} services × {a} pommes. Combien de pommes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-40",
      "prompt": "Pour la semaine du gout de avril, programme : {b} cohortes de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-41",
      "prompt": "Pour la journee portes ouvertes de avril, depot national : {b} allees de {a} palettes. Combien de palettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-42",
      "prompt": "Pour la collecte solidaire de avril, reseau : {b} noeuds de {a} connexions. Combien de connexions ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-43",
      "prompt": "Pour le challenge lecture de avril, dans la classe : {b} modules de {a} voitures. Combien de voitures ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-44",
      "prompt": "Pour le projet jardin de avril, matteo dimensionne {b} equipes de {a} agents. Combien d’agents ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-45",
      "prompt": "Pour l’expo photos de avril, campagne nationale : {b} vagues × {a} contacts. Combien de contacts ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-46",
      "prompt": "Pour le concert de fin d’annee de avril, infrastructure : {b} blocs de {a} unites. Combien d’unites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-47",
      "prompt": "Pour la course d’orientation de avril, plateforme e-com : {b} entrepots × {a} commandes. Combien de commandes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-48",
      "prompt": "Pour l’atelier cuisine de avril, a la recreation, projet : {b} lots de {a} abeilles. Combien de abeilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-49",
      "prompt": "Pour le vide-grenier de avril, yohannes finalise {b} sites × {a} assiettes par site. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-50",
      "prompt": "Pour le stand de limonade de avril, bilan industriel : {b} lignes × {a} pieces. Combien de pieces ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-51",
      "prompt": "Pour les olympiades sportives de avril, tournoi a la gare : {b} equipes de {a} joueurs. Combien d’athletes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-52",
      "prompt": "Pour le conte musical de avril, usine : {b} cartons de {a} pieces. Combien de pieces emballees ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-53",
      "prompt": "Pour le rallye maths de avril, alessandra gere {b} immeubles de {a} appartements. Combien d’appartements ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-54",
      "prompt": "Pour la semaine bleue de avril, depot : {b} palettes de {a} stylos. Combien de stylos partent ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-55",
      "prompt": "Pour la semaine verte de avril, commande scolaire : {b} classes × {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-56",
      "prompt": "Pour le festival du livre de avril, parisa planifie {b} semaines × {a} seances. Combien de seances au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-57",
      "prompt": "Pour l’atelier robotique de avril, festival : {b} stands × {a} brochures. Combien de brochures a imprimer ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-58",
      "prompt": "Pour le club nature de avril, production du mois : {b} lots de {a} unites. Quelle production totale ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-59",
      "prompt": "Pour le marche aux fleurs de avril, a l’atelier bois, logistique : {b} tours de livraison × {a} colis. Combien de colis ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-60",
      "prompt": "Pour le parcours sante de avril, francesco calcule {b} sites × {a} fraises par site. Combien de fraises faut-il ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-61",
      "prompt": "Pour le defi zero dechet de avril, region : {b} centres de {a} places. Combien de places regionales ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-62",
      "prompt": "Pour l’atelier bricolage de avril, consortium : {b} partenaires × {a} feuilles. Combien de feuilles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-63",
      "prompt": "Pour la journee du sport de avril, dans la classe : {b} hubs de {a} expeditions. Combien d’expeditions ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-64",
      "prompt": "Pour la fete de l’ecole de mai, shirin dimensionne {b} lignes de {a} postes. Combien de postes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-65",
      "prompt": "Pour le marche de Noel de mai, hopital : {b} unites de {a} lits. Combien de lits ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-66",
      "prompt": "Pour la kermesse de mai, federation : {b} clubs de {a} licences. Combien de licences ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-67",
      "prompt": "Pour le tournoi de printemps de mai, plateforme : {b} serveurs de {a} instances. Combien d’instances ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-68",
      "prompt": "Pour la sortie au musee de mai, a la recreation, usine : {b} chaines de {a} postes. Combien de postes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-69",
      "prompt": "Pour l’atelier science de mai, aissatou alloue {b} budgets de {a} unites. Combien d’unites allouees ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-70",
      "prompt": "Pour la semaine du gout de mai, salon : {b} halls de {a} stands. Combien de stands ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-71",
      "prompt": "Pour la journee portes ouvertes de mai, reseau scolaire : {b} etablissements × {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-72",
      "prompt": "Pour la collecte solidaire de mai, campagne : {b} regions × {a} kits. Combien de kits ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-73",
      "prompt": "Pour le challenge lecture de mai, dans la classe : {b} entrepots de {a} palettes. Combien de palettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-74",
      "prompt": "Pour le projet jardin de mai, sofia consolide {b} sites × {a} passagers. Combien de passagers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-75",
      "prompt": "Pour l’expo photos de mai, marche public : {b} lots de {a} unites. Combien d’unites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-76",
      "prompt": "Pour le concert de fin d’annee de mai, observatoire : {b} stations de {a} capteurs. Combien de capteurs ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-77",
      "prompt": "Pour la course d’orientation de mai, transport : {b} convois de {a} wagons. Combien de wagons ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-78",
      "prompt": "Pour l’atelier cuisine de mai, a la recreation, archive : {b} salles de {a} boites. Combien de boites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-79",
      "prompt": "Pour le vide-grenier de mai, sam planifie {b} vagues de {a} participants. Combien de participants ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-80",
      "prompt": "Pour le stand de limonade de mai, production annuelle : {b} trimestres × {a} lots. Combien de lots ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-81",
      "prompt": "Pour les olympiades sportives de mai, centre : {b} batiments de {a} salles. Combien de salles ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-82",
      "prompt": "Pour le conte musical de mai, logistique : {b} tours × {a} photos. Combien de photos ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-83",
      "prompt": "Pour le rallye maths de mai, dans la classe : {b} zones de {a} emplacements. Combien d’emplacements ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-84",
      "prompt": "Pour la semaine bleue de mai, elsa evalue {b} portefeuilles de {a} dossiers. Combien de dossiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-85",
      "prompt": "Pour la semaine verte de mai, usines : {b} sites de {a} machines. Combien de machines ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-86",
      "prompt": "Pour le festival du livre de mai, evenement : {b} sessions de {a} places. Combien de places ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-87",
      "prompt": "Pour l’atelier robotique de mai, collectivite : {b} quartiers × {a} plants. Combien de plants ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-88",
      "prompt": "Pour le club nature de mai, a la recreation, labo : {b} plateformes de {a} tests. Combien de tests ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-89",
      "prompt": "Pour le marche aux fleurs de mai, adam mutualise {b} services × {a} livres. Combien de livres ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-90",
      "prompt": "Pour le parcours sante de mai, programme : {b} cohortes de {a} eleves. Combien d’eleves ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-91",
      "prompt": "Pour le defi zero dechet de mai, depot national : {b} allees de {a} palettes. Combien de palettes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-92",
      "prompt": "Pour l’atelier bricolage de mai, reseau : {b} noeuds de {a} connexions. Combien de connexions ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-93",
      "prompt": "Pour la journee du sport de mai, dans la classe : {b} modules de {a} chaises. Combien de chaises ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-94",
      "prompt": "Pour la fete de l’ecole de juin, svitlana dimensionne {b} equipes de {a} agents. Combien d’agents ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-95",
      "prompt": "Pour le marche de Noel de juin, campagne nationale : {b} vagues × {a} contacts. Combien de contacts ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-96",
      "prompt": "Pour la kermesse de juin, infrastructure : {b} blocs de {a} unites. Combien d’unites ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-97",
      "prompt": "Pour le tournoi de printemps de juin, plateforme e-com : {b} entrepots × {a} commandes. Combien de commandes ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-98",
      "prompt": "Pour la sortie au musee de juin, a la recreation, projet : {b} lots de {a} cahiers. Combien de cahiers ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-99",
      "prompt": "Pour l’atelier science de juin, mariam finalise {b} sites × {a} pommes par site. Combien au total ?",
      "op": "*"
    },
    {
      "id": "multiplication-avance-100",
      "prompt": "Pour la semaine du gout de juin, bilan industriel : {b} lignes × {a} pieces. Combien de pieces ?",
      "op": "*"
    }
  ],
  "division:avance": [
    {
      "id": "division-avance-1",
      "prompt": "Pour le vide-grenier de juillet, festival : {a} billes en stands de {b}. Combien de stands complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-2",
      "prompt": "Pour le stand de limonade de juillet, usine : {a} cartes en lots de {b}. Combien de lots complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-3",
      "prompt": "Pour les olympiades sportives de juillet, olivia gere {a} feuilles a ventiler en rayons de {b}. Combien de rayons ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-4",
      "prompt": "Pour le conte musical de juillet, logistique : {a} bonbons en palettes de {b}. Combien de palettes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-5",
      "prompt": "Pour le rallye maths de juillet, collecte : {a} livres verses dans des caisses de {b}. Combien de caisses ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-6",
      "prompt": "Pour la semaine bleue de juillet, centre aere : {a} oeufs entre {b} groupes d’age egalement. Combien par groupe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-7",
      "prompt": "Pour la semaine verte de juillet, production : {a} pommes en series de {b}. Combien de series completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-8",
      "prompt": "Pour le festival du livre de juillet, a la piscine : dossiers de {b} a partir de {a} crayons. Combien de dossiers complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-9",
      "prompt": "Pour l’atelier robotique de juillet, luca planifie le partage de {a} ballons en {b} secteurs. Combien par secteur ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-10",
      "prompt": "Pour le club nature de juillet, entrepot regional : {a} timbres en conteneurs de {b}. Combien de conteneurs complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-11",
      "prompt": "Pour le marche aux fleurs de juillet, region : {a} photos entre {b} centres. Combien par centre ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-12",
      "prompt": "Pour le parcours sante de juillet, consortium : {a} chaises en parts de {b} partenaires. Combien par partenaire ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-13",
      "prompt": "Pour le defi zero dechet de juillet, au marche : {a} eleves en hubs de {b}. Combien de hubs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-14",
      "prompt": "Pour l’atelier bricolage de juillet, tarek dimensionne des lignes de {b} pour {a} joueurs. Combien de lignes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-15",
      "prompt": "Pour la journee du sport de juillet, hopital : {a} bouteilles en unites de {b} lits. Combien d’unites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-16",
      "prompt": "Pour la fete de l’ecole de aout, federation : {a} cahiers en clubs de {b}. Combien de clubs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-17",
      "prompt": "Pour le marche de Noel de aout, plateforme : {a} enveloppes en serveurs de {b}. Combien de serveurs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-18",
      "prompt": "Pour la kermesse de aout, au vestiaire, usine : {a} pieces en chaines de {b}. Combien de chaines ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-19",
      "prompt": "Pour le tournoi de printemps de aout, patricia alloue {a} gommes en budgets de {b}. Combien de budgets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-20",
      "prompt": "Pour la sortie au musee de aout, salon : {a} stylos en halls de {b}. Combien de halls ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-21",
      "prompt": "Pour l’atelier science de aout, reseau : {a} billes entre {b} etablissements. Combien par etablissement ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-22",
      "prompt": "Pour la semaine du gout de aout, campagne : {a} cartes en regions de capacite {b}. Combien de regions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-23",
      "prompt": "Pour la journee portes ouvertes de aout, dans le quartier : {a} feuilles en entrepots de {b}. Combien d’entrepots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-24",
      "prompt": "Pour la collecte solidaire de aout, navid consolide {a} bonbons en sites de {b}. Combien de sites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-25",
      "prompt": "Pour le challenge lecture de aout, marche public : {a} livres en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-26",
      "prompt": "Pour le projet jardin de aout, observatoire : {a} oeufs en stations de {b}. Combien de stations ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-27",
      "prompt": "Pour l’expo photos de aout, transport : {a} pommes en convois de {b}. Combien de convois ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-28",
      "prompt": "Pour le concert de fin d’annee de aout, a la mediatheque, archive : {a} crayons en salles de {b}. Combien de salles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-29",
      "prompt": "Pour la course d’orientation de aout, federica planifie {a} ballons en vagues de {b}. Combien de vagues ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-30",
      "prompt": "Pour l’atelier cuisine de aout, annuel : {a} timbres en trimestres de {b}. Combien de trimestres ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-31",
      "prompt": "Pour le vide-grenier de aout, centre : {a} photos en batiments de {b}. Combien de batiments ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-32",
      "prompt": "Pour le stand de limonade de aout, logistique : {a} chaises en tours de {b}. Combien de tours ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-33",
      "prompt": "Pour les olympiades sportives de aout, au gymnase : {a} eleves en zones de {b}. Combien de zones ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-34",
      "prompt": "Pour le conte musical de aout, goncalo evalue {a} joueurs en portefeuilles de {b}. Combien de portefeuilles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-35",
      "prompt": "Pour le rallye maths de aout, usines : {a} bouteilles en sites de {b}. Combien de sites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-36",
      "prompt": "Pour la semaine bleue de aout, evenement : {a} cahiers en sessions de {b}. Combien de sessions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-37",
      "prompt": "Pour la semaine verte de aout, collectivite : {a} enveloppes en quartiers de {b}. Combien de quartiers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-38",
      "prompt": "Pour le festival du livre de aout, a la piscine, labo : {a} pieces en plateformes de {b}. Combien de plateformes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-39",
      "prompt": "Pour l’atelier robotique de aout, malika mutualise {a} gommes en services de {b}. Combien de services ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-40",
      "prompt": "Pour le club nature de aout, programme : {a} stylos en cohortes de {b}. Combien de cohortes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-41",
      "prompt": "Pour le marche aux fleurs de aout, depot national : {a} billes en allees de {b}. Combien d’allees ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-42",
      "prompt": "Pour le parcours sante de aout, reseau : {a} cartes en noeuds de {b}. Combien de noeuds ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-43",
      "prompt": "Pour le defi zero dechet de aout, au marche : {a} feuilles en modules de {b}. Combien de modules ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-44",
      "prompt": "Pour l’atelier bricolage de aout, francesco dimensionne {a} bonbons en equipes de {b}. Combien d’equipes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-45",
      "prompt": "Pour la journee du sport de aout, campagne nationale : {a} livres en vagues de {b}. Combien de vagues ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-46",
      "prompt": "Pour la fete de l’ecole de septembre, infrastructure : {a} oeufs en blocs de {b}. Combien de blocs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-47",
      "prompt": "Pour le marche de Noel de septembre, e-com : {a} pommes en entrepots de {b}. Combien d’entrepots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-48",
      "prompt": "Pour la kermesse de septembre, au vestiaire, projet : {a} crayons en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-49",
      "prompt": "Pour le tournoi de printemps de septembre, sipho finalise {a} ballons ÷ {b} par site. Combien par site ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-50",
      "prompt": "Pour la sortie au musee de septembre, bilan : {a} timbres en lignes de {b}. Combien de lignes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-51",
      "prompt": "Pour l’atelier science de septembre, festival : {a} photos en stands de {b}. Combien de stands complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-52",
      "prompt": "Pour la semaine du gout de septembre, usine : {a} chaises en lots de {b}. Combien de lots complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-53",
      "prompt": "Pour la journee portes ouvertes de septembre, aissatou gere {a} eleves a ventiler en rayons de {b}. Combien de rayons ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-54",
      "prompt": "Pour la collecte solidaire de septembre, logistique : {a} joueurs en palettes de {b}. Combien de palettes completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-55",
      "prompt": "Pour le challenge lecture de septembre, collecte : {a} bouteilles verses dans des caisses de {b}. Combien de caisses ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-56",
      "prompt": "Pour le projet jardin de septembre, centre aere : {a} cahiers entre {b} groupes d’age egalement. Combien par groupe ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-57",
      "prompt": "Pour l’expo photos de septembre, production : {a} enveloppes en series de {b}. Combien de series completes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-58",
      "prompt": "Pour le concert de fin d’annee de septembre, a la mediatheque : dossiers de {b} a partir de {a} pieces. Combien de dossiers complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-59",
      "prompt": "Pour la course d’orientation de septembre, ahmed planifie le partage de {a} gommes en {b} secteurs. Combien par secteur ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-60",
      "prompt": "Pour l’atelier cuisine de septembre, entrepot regional : {a} stylos en conteneurs de {b}. Combien de conteneurs complets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-61",
      "prompt": "Pour le vide-grenier de septembre, region : {a} billes entre {b} centres. Combien par centre ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-62",
      "prompt": "Pour le stand de limonade de septembre, consortium : {a} cartes en parts de {b} partenaires. Combien par partenaire ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-63",
      "prompt": "Pour les olympiades sportives de septembre, au gymnase : {a} feuilles en hubs de {b}. Combien de hubs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-64",
      "prompt": "Pour le conte musical de septembre, amina dimensionne des lignes de {b} pour {a} bonbons. Combien de lignes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-65",
      "prompt": "Pour le rallye maths de septembre, hopital : {a} livres en unites de {b} lits. Combien d’unites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-66",
      "prompt": "Pour la semaine bleue de septembre, federation : {a} oeufs en clubs de {b}. Combien de clubs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-67",
      "prompt": "Pour la semaine verte de septembre, plateforme : {a} pommes en serveurs de {b}. Combien de serveurs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-68",
      "prompt": "Pour le festival du livre de septembre, a la piscine, usine : {a} crayons en chaines de {b}. Combien de chaines ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-69",
      "prompt": "Pour l’atelier robotique de septembre, khalil alloue {a} ballons en budgets de {b}. Combien de budgets ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-70",
      "prompt": "Pour le club nature de septembre, salon : {a} timbres en halls de {b}. Combien de halls ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-71",
      "prompt": "Pour le marche aux fleurs de septembre, reseau : {a} photos entre {b} etablissements. Combien par etablissement ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-72",
      "prompt": "Pour le parcours sante de septembre, campagne : {a} chaises en regions de capacite {b}. Combien de regions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-73",
      "prompt": "Pour le defi zero dechet de septembre, au marche : {a} eleves en entrepots de {b}. Combien d’entrepots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-74",
      "prompt": "Pour l’atelier bricolage de septembre, ines consolide {a} joueurs en sites de {b}. Combien de sites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-75",
      "prompt": "Pour la journee du sport de septembre, marche public : {a} bouteilles en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-76",
      "prompt": "Pour la fete de l’ecole de octobre, observatoire : {a} cahiers en stations de {b}. Combien de stations ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-77",
      "prompt": "Pour le marche de Noel de octobre, transport : {a} enveloppes en convois de {b}. Combien de convois ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-78",
      "prompt": "Pour la kermesse de octobre, au vestiaire, archive : {a} pieces en salles de {b}. Combien de salles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-79",
      "prompt": "Pour le tournoi de printemps de octobre, amadou planifie {a} gommes en vagues de {b}. Combien de vagues ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-80",
      "prompt": "Pour la sortie au musee de octobre, annuel : {a} stylos en trimestres de {b}. Combien de trimestres ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-81",
      "prompt": "Pour l’atelier science de octobre, centre : {a} billes en batiments de {b}. Combien de batiments ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-82",
      "prompt": "Pour la semaine du gout de octobre, logistique : {a} cartes en tours de {b}. Combien de tours ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-83",
      "prompt": "Pour la journee portes ouvertes de octobre, dans le quartier : {a} feuilles en zones de {b}. Combien de zones ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-84",
      "prompt": "Pour la collecte solidaire de octobre, ali evalue {a} bonbons en portefeuilles de {b}. Combien de portefeuilles ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-85",
      "prompt": "Pour le challenge lecture de octobre, usines : {a} livres en sites de {b}. Combien de sites ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-86",
      "prompt": "Pour le projet jardin de octobre, evenement : {a} oeufs en sessions de {b}. Combien de sessions ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-87",
      "prompt": "Pour l’expo photos de octobre, collectivite : {a} pommes en quartiers de {b}. Combien de quartiers ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-88",
      "prompt": "Pour le concert de fin d’annee de octobre, a la mediatheque, labo : {a} crayons en plateformes de {b}. Combien de plateformes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-89",
      "prompt": "Pour la course d’orientation de octobre, dawit mutualise {a} ballons en services de {b}. Combien de services ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-90",
      "prompt": "Pour l’atelier cuisine de octobre, programme : {a} timbres en cohortes de {b}. Combien de cohortes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-91",
      "prompt": "Pour le vide-grenier de octobre, depot national : {a} photos en allees de {b}. Combien d’allees ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-92",
      "prompt": "Pour le stand de limonade de octobre, reseau : {a} chaises en noeuds de {b}. Combien de noeuds ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-93",
      "prompt": "Pour les olympiades sportives de octobre, au gymnase : {a} eleves en modules de {b}. Combien de modules ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-94",
      "prompt": "Pour le conte musical de octobre, farid dimensionne {a} joueurs en equipes de {b}. Combien d’equipes ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-95",
      "prompt": "Pour le rallye maths de octobre, campagne nationale : {a} bouteilles en vagues de {b}. Combien de vagues ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-96",
      "prompt": "Pour la semaine bleue de octobre, infrastructure : {a} cahiers en blocs de {b}. Combien de blocs ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-97",
      "prompt": "Pour la semaine verte de octobre, e-com : {a} enveloppes en entrepots de {b}. Combien d’entrepots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-98",
      "prompt": "Pour le festival du livre de octobre, a la piscine, projet : {a} pieces en lots de {b}. Combien de lots ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-99",
      "prompt": "Pour l’atelier robotique de octobre, iryna finalise {a} gommes ÷ {b} par site. Combien par site ?",
      "op": "/",
      "exact": true
    },
    {
      "id": "division-avance-100",
      "prompt": "Pour le club nature de octobre, bilan : {a} stylos en lignes de {b}. Combien de lignes ?",
      "op": "/",
      "exact": true
    }
  ],
  "add-sub:avance": [
    {
      "id": "add-sub-avance-1",
      "prompt": "Pour la collecte solidaire de octobre, rania a {a} fleurs. Elle en recoit {b}, puis en donne {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-2",
      "prompt": "Pour le challenge lecture de octobre, sur le parking, on compte {a} puzzles. On en ajoute {b}, puis on en retire {c}. Combien en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-3",
      "prompt": "Pour le projet jardin de octobre, un stock de {a} tickets augmente de {b}, puis diminue de {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-4",
      "prompt": "Pour l’expo photos de octobre, rui commence avec {a} chats, gagne {b}, puis en utilise {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-5",
      "prompt": "Pour l’activite : {a} articles prets. On en apporte {b}, puis on en distribue {c}. Combien restent disponibles , en tenant compte des deux mouvements  — le concert de fin d’annee de octobre ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-6",
      "prompt": "Pour la course d’orientation de octobre, davide a l’atelier bois rassemble {a} verres, en trouve {b} de plus, puis en prete {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-7",
      "prompt": "Pour l’atelier cuisine de octobre, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-8",
      "prompt": "Pour le vide-grenier de octobre, bus : {a} passagers, {b} montent, puis {c} descendent. Combien reste-t-il de passagers , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-9",
      "prompt": "Pour le stand de limonade de octobre, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Combien restent disponibles , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-10",
      "prompt": "Pour les olympiades sportives de octobre, navid marque {a} points, en gagne {b}, puis en perd {c}. Quel score reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-11",
      "prompt": "Pour le conte musical de octobre, tesfay a {a} stylos, en achete {b}, puis en vend {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-12",
      "prompt": "Pour le rallye maths de octobre, a la gare : debut {a} bananes, arrivee de {b}, depart de {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-13",
      "prompt": "Pour la semaine bleue de octobre, reserve : {a} fleurs, livraison +{b}, sortie −{c}. Combien en reserve , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-14",
      "prompt": "Pour la semaine verte de octobre, matteo collectionne {a} puzzles, en recoit {b}, puis en offre {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-15",
      "prompt": "Pour le festival du livre de octobre, classe : {a} eleves presents, {b} arrivent, {c} partent. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-16",
      "prompt": "Pour l’atelier robotique de octobre, compte : {a} + {b} − {c} chats. Quel reste , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-17",
      "prompt": "Pour le club nature de octobre, iman prepare {a} articles, en ajoute {b}, puis en retire {c} abimes. Combien restent bons , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-18",
      "prompt": "Pour le marche aux fleurs de octobre, dans la classe, stock {a}, reappro {b}, vente {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-19",
      "prompt": "Pour le parcours sante de octobre, jeu : score {a}, bonus {b}, malus {c}. Quel score final , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-20",
      "prompt": "Pour le defi zero dechet de octobre, goncalo range {a} perles, en trouve {b}, puis en jette {c}. Combien restent ranges , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-21",
      "prompt": "Pour l’atelier bricolage de octobre, panier : {a} feuilles A4, +{b} du marche, −{c} mangés. Combien dans le panier , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-22",
      "prompt": "Pour la journee du sport de octobre, file : {a} personnes, {b} arrivent, {c} sont servies. Combien restent en file , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-23",
      "prompt": "Pour la fete de l’ecole de novembre, alessandra a {a} tickets, en achete {b}, en utilise {c}. Combien de tickets restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-24",
      "prompt": "Pour le marche de Noel de novembre, a la mediatheque : {a} places, +{b} chaises, −{c} cassees. Combien de places restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-25",
      "prompt": "Pour la kermesse de novembre, depot : {a} colis, +{b} recus, −{c} expedies. Combien de colis restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-26",
      "prompt": "Pour le tournoi de printemps de novembre, parisa note {a} puzzles, ajoute {b}, retire {c}. Combien note-t-elle a la fin , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-27",
      "prompt": "Pour la sortie au musee de novembre, atelier : {a} pieces, +{b} produites, −{c} rebuts. Combien de pieces bonnes , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-28",
      "prompt": "Pour l’atelier science de novembre, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-29",
      "prompt": "Pour la semaine du gout de novembre, au gymnase, inventaire {a} articles, entree {b}, sortie {c}. Combien en stock , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-30",
      "prompt": "Pour la journee portes ouvertes de novembre, francesco cumule {a} points, +{b}, puis −{c}. Quel total reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-31",
      "prompt": "Pour la collecte solidaire de novembre, stand : {a} briques, livraison {b}, ventes {c}. Combien restent au stand , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-32",
      "prompt": "Pour le challenge lecture de novembre, bus scolaire : {a} eleves, {b} montent, {c} descendent. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-33",
      "prompt": "Pour le projet jardin de novembre, zainab gere {a} feuilles A4, en recoit {b}, en envoie {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-34",
      "prompt": "Pour l’expo photos de novembre, a la piscine : sac de {a} fils, +{b}, −{c}. Combien dans le sac , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-35",
      "prompt": "Pour le concert de fin d’annee de novembre, magasin : stock {a}, arrivees {b}, ventes {c}. Combien en rayon , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-36",
      "prompt": "Pour la course d’orientation de novembre, nuno commence a {a}, ajoute {b} bananes, retire {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-37",
      "prompt": "Pour l’atelier cuisine de novembre, terrasse : {a} chaises, +{b}, −{c} rangees. Combien de chaises restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-38",
      "prompt": "Pour le vide-grenier de novembre, compte rendu : {a} puzzles, trouvailles {b}, pertes {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-39",
      "prompt": "Pour le stand de limonade de novembre, au marche, bac {a} tickets, remplissage {b}, prelevement {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-40",
      "prompt": "Pour les olympiades sportives de novembre, lina aligne {a} chats, en pose {b}, en enleve {c}. Combien restent alignes , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-41",
      "prompt": "Pour le conte musical de novembre, club : {a} membres, +{b} inscriptions, −{c} departs. Combien de membres , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-42",
      "prompt": "Pour le rallye maths de novembre, etagere : {a} livres, +{b} neufs, −{c} pretes. Combien sur l’etagere , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-43",
      "prompt": "Pour la semaine bleue de novembre, daryna a {a} briques en poche, en gagne {b}, en depense {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-44",
      "prompt": "Pour la semaine verte de novembre, au vestiaire : plateau {a} perles, ajout {b}, retrait {c}. Combien sur le plateau , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-45",
      "prompt": "Pour le festival du livre de novembre, jardin : {a} plants, +{b} plantes, −{c} deplaces. Combien restent ici , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-46",
      "prompt": "Pour l’atelier robotique de novembre, sara suit un solde : {a} + {b} − {c} fils. Quel solde , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-47",
      "prompt": "Pour le club nature de novembre, vestiaire : {a} casiers libres, +{b}, −{c} pris. Combien restent libres , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-48",
      "prompt": "Pour le marche aux fleurs de novembre, labo : {a} tubes, +{b} livrés, −{c} utilises. Combien de tubes restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-49",
      "prompt": "Pour le parcours sante de novembre, dans le quartier, caisse {a} CHF, encaissements {b}, paiements {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-50",
      "prompt": "Pour le defi zero dechet de novembre, amina cloture : debut {a} puzzles, +{b}, −{c}. Combien a la cloture , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-51",
      "prompt": "Pour l’atelier bricolage de novembre, bilal a {a} tickets. Il en recoit {b}, puis en donne {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-52",
      "prompt": "Pour la journee du sport de novembre, dans le preau, on compte {a} chats. On en ajoute {b}, puis on en retire {c}. Combien en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-53",
      "prompt": "Pour la fete de l’ecole de decembre, un stock de {a} articles augmente de {b}, puis diminue de {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-54",
      "prompt": "Pour le marche de Noel de decembre, elsa commence avec {a} verres, gagne {b}, puis en utilise {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-55",
      "prompt": "Pour l’activite : {a} briques prets. On en apporte {b}, puis on en distribue {c}. Combien restent disponibles , en tenant compte des deux mouvements  — la kermesse de decembre ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-56",
      "prompt": "Pour le tournoi de printemps de decembre, mia au magasin rassemble {a} perles, en trouve {b} de plus, puis en prete {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-57",
      "prompt": "Pour la sortie au musee de decembre, caisse : {a} CHF, +{b} CHF, puis depense de {c} CHF. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-58",
      "prompt": "Pour l’atelier science de decembre, bus : {a} passagers, {b} montent, puis {c} descendent. Combien reste-t-il de passagers , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-59",
      "prompt": "Pour la semaine du gout de decembre, bibliotheque : {a} livres, +{b} recus, puis {c} pretes. Combien restent disponibles , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-60",
      "prompt": "Pour la journee portes ouvertes de decembre, ines marque {a} points, en gagne {b}, puis en perd {c}. Quel score reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-61",
      "prompt": "Pour la collecte solidaire de decembre, marco a {a} fleurs, en achete {b}, puis en vend {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-62",
      "prompt": "Pour le challenge lecture de decembre, sur le parking : debut {a} puzzles, arrivee de {b}, depart de {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-63",
      "prompt": "Pour le projet jardin de decembre, reserve : {a} tickets, livraison +{b}, sortie −{c}. Combien en reserve , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-64",
      "prompt": "Pour l’expo photos de decembre, svitlana collectionne {a} chats, en recoit {b}, puis en offre {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-65",
      "prompt": "Pour le concert de fin d’annee de decembre, classe : {a} eleves presents, {b} arrivent, {c} partent. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-66",
      "prompt": "Pour la course d’orientation de decembre, compte : {a} + {b} − {c} verres. Quel reste , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-67",
      "prompt": "Pour l’atelier cuisine de decembre, yara prepare {a} briques, en ajoute {b}, puis en retire {c} abimes. Combien restent bons , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-68",
      "prompt": "Pour le vide-grenier de decembre, au terrain de sport, stock {a}, reappro {b}, vente {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-69",
      "prompt": "Pour le stand de limonade de decembre, jeu : score {a}, bonus {b}, malus {c}. Quel score final , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-70",
      "prompt": "Pour les olympiades sportives de decembre, ali range {a} fils, en trouve {b}, puis en jette {c}. Combien restent ranges , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-71",
      "prompt": "Pour le conte musical de decembre, panier : {a} stylos, +{b} du marche, −{c} mangés. Combien dans le panier , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-72",
      "prompt": "Pour le rallye maths de decembre, file : {a} personnes, {b} arrivent, {c} sont servies. Combien restent en file , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-73",
      "prompt": "Pour la semaine bleue de decembre, aya a {a} tickets, en achete {b}, en utilise {c}. Combien de tickets restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-74",
      "prompt": "Pour la semaine verte de decembre, au vestiaire : {a} places, +{b} chaises, −{c} cassees. Combien de places restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-75",
      "prompt": "Pour le festival du livre de decembre, depot : {a} colis, +{b} recus, −{c} expedies. Combien de colis restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-76",
      "prompt": "Pour l’atelier robotique de decembre, rita note {a} chats, ajoute {b}, retire {c}. Combien note-t-elle a la fin , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-77",
      "prompt": "Pour le club nature de decembre, atelier : {a} pieces, +{b} produites, −{c} rebuts. Combien de pieces bonnes , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-78",
      "prompt": "Pour le marche aux fleurs de decembre, caisse club : {a} CHF, cotisations +{b}, achats −{c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-79",
      "prompt": "Pour le parcours sante de decembre, dans le quartier, inventaire {a} briques, entree {b}, sortie {c}. Combien en stock , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-80",
      "prompt": "Pour le defi zero dechet de decembre, farid cumule {a} points, +{b}, puis −{c}. Quel total reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-81",
      "prompt": "Pour l’atelier bricolage de decembre, stand : {a} feuilles A4, livraison {b}, ventes {c}. Combien restent au stand , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-82",
      "prompt": "Pour la journee du sport de decembre, bus scolaire : {a} eleves, {b} montent, {c} descendent. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-83",
      "prompt": "Pour la fete de l’ecole de janvier, salma gere {a} stylos, en recoit {b}, en envoie {c}. Combien lui en reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-84",
      "prompt": "Pour le marche de Noel de janvier, a la mediatheque : sac de {a} bananes, +{b}, −{c}. Combien dans le sac , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-85",
      "prompt": "Pour la kermesse de janvier, magasin : stock {a}, arrivees {b}, ventes {c}. Combien en rayon , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-86",
      "prompt": "Pour le tournoi de printemps de janvier, rustam commence a {a}, ajoute {b} puzzles, retire {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-87",
      "prompt": "Pour la sortie au musee de janvier, terrasse : {a} chaises, +{b}, −{c} rangees. Combien de chaises restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-88",
      "prompt": "Pour l’atelier science de janvier, compte rendu : {a} chats, trouvailles {b}, pertes {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-89",
      "prompt": "Pour la semaine du gout de janvier, au gymnase, bac {a} articles, remplissage {b}, prelevement {c}. Combien restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-90",
      "prompt": "Pour la journee portes ouvertes de janvier, samuel aligne {a} verres, en pose {b}, en enleve {c}. Combien restent alignes , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-91",
      "prompt": "Pour la collecte solidaire de janvier, club : {a} membres, +{b} inscriptions, −{c} departs. Combien de membres , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-92",
      "prompt": "Pour le challenge lecture de janvier, etagere : {a} livres, +{b} neufs, −{c} pretes. Combien sur l’etagere , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-93",
      "prompt": "Pour le projet jardin de janvier, joao a {a} feuilles A4 en poche, en gagne {b}, en depense {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-94",
      "prompt": "Pour l’expo photos de janvier, a la piscine : plateau {a} fils, ajout {b}, retrait {c}. Combien sur le plateau , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-95",
      "prompt": "Pour le concert de fin d’annee de janvier, jardin : {a} plants, +{b} plantes, −{c} deplaces. Combien restent ici , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-96",
      "prompt": "Pour la course d’orientation de janvier, serena suit un solde : {a} + {b} − {c} bananes. Quel solde , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-97",
      "prompt": "Pour l’atelier cuisine de janvier, vestiaire : {a} casiers libres, +{b}, −{c} pris. Combien restent libres , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-98",
      "prompt": "Pour le vide-grenier de janvier, labo : {a} tubes, +{b} livrés, −{c} utilises. Combien de tubes restent , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-99",
      "prompt": "Pour le stand de limonade de janvier, au marche, caisse {a} CHF, encaissements {b}, paiements {c}. Combien reste-t-il , en tenant compte des deux mouvements ?",
      "op": "+-"
    },
    {
      "id": "add-sub-avance-100",
      "prompt": "Pour les olympiades sportives de janvier, tarek cloture : debut {a} chats, +{b}, −{c}. Combien a la cloture , en tenant compte des deux mouvements ?",
      "op": "+-"
    }
  ],
  "melange:avance": [
    {
      "id": "melange-avance-1",
      "prompt": "Pour la semaine bleue de juillet, yohannes achete {b} boites de {a} crayons, puis en offre {c}. Combien lui en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-2",
      "prompt": "Pour la semaine verte de juillet, dans l’atelier, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-3",
      "prompt": "Pour le festival du livre de juillet, isabel a {a} poissons. Isabel recoit encore {b} paquets de {c} poissons. Combien en a-t-il au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-4",
      "prompt": "Pour l’atelier robotique de juillet, on prepare {a} sacs, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-5",
      "prompt": "Pour le club nature de juillet, alessandra paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-6",
      "prompt": "Pour le marche aux fleurs de juillet, depot : {a} perles. On envoie {b} cartons de {c} perles. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-7",
      "prompt": "Pour le parcours sante de juillet, au centre aere, {a} rangees de {b} pinceaux, puis on en retire {c}. Combien en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-8",
      "prompt": "Pour le defi zero dechet de juillet, parisa collectionne {a} crayons par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-9",
      "prompt": "Pour l’atelier bricolage de juillet, fete : {a} eleves apportent chacun {b} poires. On en utilise {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-10",
      "prompt": "Pour la journee du sport de juillet, paulo a la bibliotheque reunit {a} tulipes et {b} tulipes, puis partage en {c} lots egaux. Combien par lot , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-11",
      "prompt": "Pour la fete de l’ecole de aout, filipa fabrique {b} boites de {a} balles, puis en casse {c}. Combien de balles restent intacts , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-12",
      "prompt": "Pour le marche de Noel de aout, commande : {a} oiseaux unitaires et {b} lots de {c}. Combien d’unites au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-13",
      "prompt": "Pour la kermesse de aout, roberta prepare {b} sacs de {a} articles, puis en prete {c}. Combien lui en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-14",
      "prompt": "Pour le tournoi de printemps de aout, dans le preau : {b} tables de {a} serviettes, moins {c} retires. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-15",
      "prompt": "Pour la sortie au musee de aout, zainab a {a} bulbes et achete {b} boites de {c}. Combien en a-t-elle , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-16",
      "prompt": "Pour l’atelier science de aout, stock {a} classeurs + {b}, puis division en {c} parts. Combien par part , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-17",
      "prompt": "Pour la semaine du gout de aout, caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-18",
      "prompt": "Pour la journee portes ouvertes de aout, reserve {a} figurines, sortie de {b} paquets de {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-19",
      "prompt": "Pour la collecte solidaire de aout, mariana aligne {b} files de {a} pains, puis enleve {c}. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-20",
      "prompt": "Pour le challenge lecture de aout, club : {b} equipes de {a}, puis {c} absents. Combien de presents , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-21",
      "prompt": "Pour le projet jardin de aout, a la recreation, {a} passagers deja la, plus {b} cartons de {c}. Combien en tout , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-22",
      "prompt": "Pour l’expo photos de aout, lina cumule {a} et {b} feuilles, puis forme des groupes de {c}. Combien de groupes , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-23",
      "prompt": "Pour le concert de fin d’annee de aout, atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-24",
      "prompt": "Pour la course d’orientation de aout, ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-25",
      "prompt": "Pour l’atelier cuisine de aout, daryna gagne {a} × {b} points, puis en perd {c}. Quel score , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-26",
      "prompt": "Pour le vide-grenier de aout, dans la cour : {b} stands de {a} rouleaux, on en retire {c}. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-27",
      "prompt": "Pour le stand de limonade de aout, depot {a} stylos − {b} × {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-28",
      "prompt": "Pour les olympiades sportives de aout, sara recoit {a} bonbons + {b} sacs de {c}. Combien au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-29",
      "prompt": "Pour le conte musical de aout, partage : ({a} + {b}) plants en {c} parts. Combien par part , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-30",
      "prompt": "Pour le rallye maths de aout, bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-31",
      "prompt": "Pour la semaine bleue de aout, sam emballe {b} colis de {a} poissons, puis en ouvre {c}. Combien restent fermes (en poissons) , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-32",
      "prompt": "Pour la semaine verte de aout, dans l’atelier, inventaire {a} + {b} lots de {c} sacs. Combien d’unites , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-33",
      "prompt": "Pour le festival du livre de aout, bilal additionne {a} et {b} CHF, divise par {c}. Combien chacun , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-34",
      "prompt": "Pour l’atelier robotique de aout, magasin : {a} articles − {b} packs de {c}. Combien restent , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-35",
      "prompt": "Pour le club nature de aout, jardin : {b} planches de {a} plants, {c} deplaces. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-36",
      "prompt": "Pour le marche aux fleurs de aout, elsa a {a} crayons, plus {b} × {c}. Combien en tout , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-37",
      "prompt": "Pour le parcours sante de aout, collecte ({a} + {b}) poires repartie en {c} bacs. Combien par bac , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-38",
      "prompt": "Pour le defi zero dechet de aout, a la piscine : {b} cages de {a} animaux, {c} liberés. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-39",
      "prompt": "Pour l’atelier bricolage de aout, tom produit {b} series de {a} balles, en donne {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-40",
      "prompt": "Pour la journee du sport de aout, commande mixte : {a} unitaires + {b} × {c}. Combien d’unites , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-41",
      "prompt": "Pour la fete de l’ecole de septembre, caisse club : {a} + {b}, partage en {c}. Combien par membre , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-42",
      "prompt": "Pour le marche de Noel de septembre, entrepot {a} serviettes moins {b} palettes de {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-43",
      "prompt": "Pour la kermesse de septembre, marco forme {b} groupes de {a}, puis {c} se retirent. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-44",
      "prompt": "Pour le tournoi de printemps de septembre, dans le preau, {a} classeurs + {b} boites de {c}. Combien au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-45",
      "prompt": "Pour la sortie au musee de septembre, ana reunit {a} et {b} aiguilles, divise en {c}. Combien par lot , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-46",
      "prompt": "Pour l’atelier science de septembre, usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-47",
      "prompt": "Pour la semaine du gout de septembre, stock initial {a}, retrait {b} × {c} pains. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-48",
      "prompt": "Pour la journee portes ouvertes de septembre, selam calcule {b} semaines × {a} puzzles, moins {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-49",
      "prompt": "Pour la collecte solidaire de septembre, a l’ecole : {a} deja stockes + {b} packs de {c}. Combien en stock , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-50",
      "prompt": "Pour le challenge lecture de septembre, hugo cloture ({a} + {b}) ÷ {c} feuilles. Combien par part , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-51",
      "prompt": "Pour le projet jardin de septembre, mariam achete {b} albums de {a} timbres, puis en offre {c}. Combien lui en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-52",
      "prompt": "Pour l’expo photos de septembre, au magasin, {b} equipes de {a} joueurs s’inscrivent, puis {c} se desistent. Combien de joueurs restent inscrits , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-53",
      "prompt": "Pour le concert de fin d’annee de septembre, sami a {a} ficelles. Sami recoit encore {b} paquets de {c} ficelles. Combien en a-t-il au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-54",
      "prompt": "Pour la course d’orientation de septembre, on prepare {a} rouleaux, on en ajoute {b}, puis on range par groupes de {c}. Combien de groupes complets , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-55",
      "prompt": "Pour l’atelier cuisine de septembre, aya paie {a} CHF puis {b} CHF, et partage le total entre {c} personnes. Combien chacun paie-t-il , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-56",
      "prompt": "Pour le vide-grenier de septembre, depot : {a} bonbons. On envoie {b} cartons de {c} bonbons. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-57",
      "prompt": "Pour le stand de limonade de septembre, au zoo, {a} rangees de {b} plants, puis on en retire {c}. Combien en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-58",
      "prompt": "Pour les olympiades sportives de septembre, rita collectionne {a} points par semaine pendant {b} semaines, puis en donne {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-59",
      "prompt": "Pour le conte musical de septembre, fete : {a} eleves apportent chacun {b} poissons. On en utilise {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-60",
      "prompt": "Pour le rallye maths de septembre, chiara a la mairie reunit {a} sacs et {b} sacs, puis partage en {c} lots egaux. Combien par lot , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-61",
      "prompt": "Pour la semaine bleue de septembre, hassan fabrique {b} boites de {a} clous, puis en casse {c}. Combien de clous restent intacts , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-62",
      "prompt": "Pour la semaine verte de septembre, commande : {a} perles unitaires et {b} lots de {c}. Combien d’unites au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-63",
      "prompt": "Pour le festival du livre de septembre, zahra prepare {b} sacs de {a} pinceaux, puis en prete {c}. Combien lui en reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-64",
      "prompt": "Pour l’atelier robotique de septembre, sur le parking : {b} tables de {a} crayons, moins {c} retires. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-65",
      "prompt": "Pour le club nature de septembre, salma a {a} poires et achete {b} boites de {c}. Combien en a-t-elle , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-66",
      "prompt": "Pour le marche aux fleurs de septembre, stock {a} tulipes + {b}, puis division en {c} parts. Combien par part , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-67",
      "prompt": "Pour le parcours sante de septembre, caisse {a} CHF + {b} CHF, partage entre {c} eleves. Combien chacun , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-68",
      "prompt": "Pour le defi zero dechet de septembre, reserve {a} oiseaux, sortie de {b} paquets de {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-69",
      "prompt": "Pour l’atelier bricolage de septembre, murat aligne {b} files de {a} articles, puis enleve {c}. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-70",
      "prompt": "Pour la journee du sport de septembre, club : {b} equipes de {a}, puis {c} absents. Combien de presents , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-71",
      "prompt": "Pour la fete de l’ecole de octobre, dans le bus, {a} bulbes deja la, plus {b} cartons de {c}. Combien en tout , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-72",
      "prompt": "Pour le marche de Noel de octobre, samuel cumule {a} et {b} classeurs, puis forme des groupes de {c}. Combien de groupes , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-73",
      "prompt": "Pour la kermesse de octobre, atelier : {b} plateaux de {a} pieces, moins {c} rebuts. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-74",
      "prompt": "Pour le tournoi de printemps de octobre, ecole : {a} cahiers + {b} paquets de {c}. Combien de cahiers , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-75",
      "prompt": "Pour la sortie au musee de octobre, joao gagne {a} × {b} points, puis en perd {c}. Quel score , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-76",
      "prompt": "Pour l’atelier science de octobre, au terrain de sport : {b} stands de {a} puzzles, on en retire {c}. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-77",
      "prompt": "Pour la semaine du gout de octobre, depot {a} passagers − {b} × {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-78",
      "prompt": "Pour la journee portes ouvertes de octobre, serena recoit {a} feuilles + {b} sacs de {c}. Combien au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-79",
      "prompt": "Pour la collecte solidaire de octobre, partage : ({a} + {b}) bouteilles en {c} parts. Combien par part , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-80",
      "prompt": "Pour le challenge lecture de octobre, bus : {b} rangees de {a} sieges, {c} hors service. Combien de sieges utiles , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-81",
      "prompt": "Pour le projet jardin de octobre, maya emballe {b} colis de {a} ficelles, puis en ouvre {c}. Combien restent fermes (en ficelles) , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-82",
      "prompt": "Pour l’expo photos de octobre, au magasin, inventaire {a} + {b} lots de {c} rouleaux. Combien d’unites , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-83",
      "prompt": "Pour le concert de fin d’annee de octobre, rania additionne {a} et {b} CHF, divise par {c}. Combien chacun , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-84",
      "prompt": "Pour la course d’orientation de octobre, magasin : {a} articles − {b} packs de {c}. Combien restent , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-85",
      "prompt": "Pour l’atelier cuisine de octobre, jardin : {b} planches de {a} plants, {c} deplaces. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-86",
      "prompt": "Pour le vide-grenier de octobre, rui a {a} points, plus {b} × {c}. Combien en tout , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-87",
      "prompt": "Pour le stand de limonade de octobre, collecte ({a} + {b}) poissons repartie en {c} bacs. Combien par bac , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-88",
      "prompt": "Pour les olympiades sportives de octobre, au vestiaire : {b} cages de {a} animaux, {c} liberés. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-89",
      "prompt": "Pour le conte musical de octobre, laura produit {b} series de {a} clous, en donne {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-90",
      "prompt": "Pour le rallye maths de octobre, commande mixte : {a} unitaires + {b} × {c}. Combien d’unites , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-91",
      "prompt": "Pour la semaine bleue de octobre, caisse club : {a} + {b}, partage en {c}. Combien par membre , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-92",
      "prompt": "Pour la semaine verte de octobre, entrepot {a} crayons moins {b} palettes de {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-93",
      "prompt": "Pour le festival du livre de octobre, tesfay forme {b} groupes de {a}, puis {c} se retirent. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-94",
      "prompt": "Pour l’atelier robotique de octobre, sur le parking, {a} tulipes + {b} boites de {c}. Combien au total , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-95",
      "prompt": "Pour le club nature de octobre, claudia reunit {a} et {b} balles, divise en {c}. Combien par lot , en detailant les etapes ?",
      "op": "++/"
    },
    {
      "id": "melange-avance-96",
      "prompt": "Pour le marche aux fleurs de octobre, usine : {b} cartons de {a} pieces − {c} ecartees. Combien restent , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-97",
      "prompt": "Pour le parcours sante de octobre, stock initial {a}, retrait {b} × {c} articles. Combien reste-t-il , en detailant les etapes ?",
      "op": "-*"
    },
    {
      "id": "melange-avance-98",
      "prompt": "Pour le defi zero dechet de octobre, walid calcule {b} semaines × {a} serviettes, moins {c}. Combien reste-t-il , en detailant les etapes ?",
      "op": "*-"
    },
    {
      "id": "melange-avance-99",
      "prompt": "Pour l’atelier bricolage de octobre, a la cantine : {a} deja stockes + {b} packs de {c}. Combien en stock , en detailant les etapes ?",
      "op": "+*"
    },
    {
      "id": "melange-avance-100",
      "prompt": "Pour la journee du sport de octobre, soraya cloture ({a} + {b}) ÷ {c} classeurs. Combien par part , en detailant les etapes ?",
      "op": "++/"
    }
  ]
}
