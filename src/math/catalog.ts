import type { Difficulty, Domain, ExerciseType, FrenchTrack, Topic } from './types'

export const FRENCH_TRACKS: Array<{ id: FrenchTrack; label: string }> = [
  { id: 'voc', label: 'Voc' },
  { id: 'gram', label: 'Gram' },
  { id: 'com', label: 'Com' },
]

export const topics: Topic[] = [
  { id: 'fr-presenter', label: 'L’identité', domain: 'français' },
  { id: 'fr-famille', label: 'La famille', domain: 'français' },
  { id: 'fr-description', label: 'La description', domain: 'français' },
  { id: 'fr-logement', label: 'Le logement', domain: 'français' },
  { id: 'fr-achats', label: 'Les achats', domain: 'français' },
  { id: 'fr-vetements', label: 'Les vêtements', domain: 'français' },
  { id: 'fr-nourriture', label: 'La nourriture', domain: 'français' },
  { id: 'fr-sante', label: 'La santé', domain: 'français' },
  { id: 'fr-transports', label: 'Les transports', domain: 'français' },
  { id: 'fr-inviter', label: 'L’invitation', domain: 'français' },
  { id: 'fr-travail', label: 'Le travail', domain: 'français' },
  { id: 'fr-journee', label: 'Le quotidien', domain: 'français' },
  { id: 'fr-loisirs', label: 'Les loisirs', domain: 'français' },
  { id: 'nombres', label: 'Nombres naturels', domain: 'algèbre' },
  { id: 'addition', label: 'Additions', domain: 'algèbre' },
  { id: 'soustraction', label: 'Soustractions', domain: 'algèbre' },
  { id: 'estimation', label: 'Estimation et arrondi', domain: 'algèbre' },
  { id: 'multiplication', label: 'Multiplications', domain: 'algèbre' },
  { id: 'division', label: 'Divisions', domain: 'algèbre' },
  { id: 'problemes', label: 'Problèmes', domain: 'algèbre' },
  { id: 'multiples', label: 'Multiples, PGCD et PPCM', domain: 'algèbre' },
  { id: 'fractions', label: 'Fractions', domain: 'algèbre' },
  { id: 'decimaux', label: 'Nombres décimaux', domain: 'algèbre' },
  { id: 'proportionnalite', label: 'Pourcentages et proportions', domain: 'algèbre' },
  { id: 'relatifs', label: 'Nombres relatifs', domain: 'algèbre' },
  { id: 'puissances', label: 'Puissances et racines', domain: 'algèbre' },
  { id: 'expressions', label: 'Expressions algébriques', domain: 'algèbre' },
  { id: 'equations', label: 'Équations', domain: 'algèbre' },
  { id: 'figures', label: 'Formes', domain: 'géométrie' },
  { id: 'conversions', label: 'Conversions d’unités', domain: 'géométrie' },
  { id: 'perimetres', label: 'Périmètres', domain: 'géométrie' },
  { id: 'aires', label: 'Aires', domain: 'géométrie' },
  { id: 'volumes', label: 'Volumes', domain: 'géométrie' },
  { id: 'reperage', label: 'Repérage dans le plan', domain: 'géométrie' },
  { id: 'transformations', label: 'Transformations géométriques', domain: 'géométrie' },
  { id: 'alphabet', label: 'L’alphabet', domain: 'lecture' },
  { id: 'voyelle-a', label: 'Voyelle A · son /a/', domain: 'lecture' },
  { id: 'voyelle-o', label: 'Voyelle O · son /o/', domain: 'lecture' },
  { id: 'voyelle-i', label: 'Voyelle I · son /i/', domain: 'lecture' },
  { id: 'voyelle-u', label: 'Voyelle U · son /y/', domain: 'lecture' },
  { id: 'voyelle-e', label: 'Voyelle E · son /ə/', domain: 'lecture' },
  { id: 'voyelle-y', label: 'Voyelle Y · son /i/', domain: 'lecture' },
  { id: 'phrase-tableaux', label: 'Tableaux Gattegno', domain: 'phrase' },
  { id: 'phrase-simple', label: 'Simple', domain: 'phrase' },
  { id: 'phrase-negation', label: 'Négation simple', domain: 'phrase' },
  { id: 'phrase-adjectif', label: 'Adjectif', domain: 'phrase' },
  { id: 'phrase-negation-adjectif', label: 'Négation avec adjectif', domain: 'phrase' },
  { id: 'phrase-determinants', label: 'Déterminants', domain: 'phrase' },
  { id: 'phrase-negation-determinants', label: 'Négation déterminants', domain: 'phrase' },
  { id: 'phrase-preposition', label: 'Préposition', domain: 'phrase' },
  { id: 'phrase-negation-preposition', label: 'Négation prépositions', domain: 'phrase' },
  { id: 'phrase-adverbe', label: 'Adverbe', domain: 'phrase' },
  { id: 'phrase-negation-adverbe', label: 'Négation avec adverbe', domain: 'phrase' },
  { id: 'phrase-conjonctions', label: 'Conjonctions', domain: 'phrase' },
]

export const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic])) as Record<string, Topic>
export const frenchTopics = topics.filter((topic) => topic.domain === 'français')
export const algebraTopics = topics.filter((topic) => topic.domain === 'algèbre')
export const geometryTopics = topics.filter((topic) => topic.domain === 'géométrie')
export const lectureTopics = topics.filter((topic) => topic.domain === 'lecture')
export const phraseTopics = topics.filter((topic) => topic.domain === 'phrase')

const t = (
  id: string,
  topic: string,
  label: string,
  description: string,
  instruction: string,
  visual: ExerciseType['visual'],
  extra: Partial<ExerciseType> = {},
): ExerciseType => ({ id, topic, label, description, instruction, visual, ...extra })

export const exerciseTypes: ExerciseType[] = [
  t('nombres-chiffres', 'nombres', 'Écrire en chiffres', 'Le nombre est écrit en lettres, on l’écrit en chiffres.', 'Écrivez chaque nombre en chiffres.', 'texte', { preferredColumns: 1 }),
  t('nombres-lettres', 'nombres', 'Écrire en lettres', 'Le nombre est écrit en chiffres, on l’écrit en lettres (Suisse romande).', 'Écrivez chaque nombre en lettres.', 'texte', { preferredColumns: 1 }),
  t('nombres-position', 'nombres', 'Valeur positionnelle', 'Retrouver le chiffre des unités, dizaines, centaines…', 'Indiquez le chiffre demandé.', 'texte', { preferredColumns: 1 }),
  t('nombres-decompose', 'nombres', 'Décomposer', 'Écrire un nombre en sommes de puissances de 10 (milliers… unités).', 'Décomposez chaque nombre.', 'ligne', { preferredColumns: 1 }),
  t('nombres-comparer', 'nombres', 'Comparer', 'Choisir le symbole correct : <, = ou >.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),
  t('nombres-encadrer-10', 'nombres', 'Encadrer (pas de 10)', 'Encadrer un nombre entre deux dizaines consécutives.', 'Complétez l’encadrement par pas de 10.', 'ligne', { preferredColumns: 2 }),
  t('nombres-encadrer-100', 'nombres', 'Encadrer (pas de 100)', 'Encadrer un nombre entre deux centaines consécutives.', 'Complétez l’encadrement par pas de 100.', 'ligne', { preferredColumns: 2 }),
  t('nombres-pair', 'nombres', 'Pairs et impairs', 'Reconnaître un nombre pair ou impair.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),
  t('nombres-ranger', 'nombres', 'Ranger', 'Ranger cinq nombres dans l’ordre croissant ou décroissant.', 'Rangez les nombres dans l’ordre demandé.', 'suite', { preferredColumns: 1 }),
  t('nombres-suite', 'nombres', 'Suites à trous', 'Compléter une suite numérique.', 'Complétez les termes manquants.', 'suite'),

  t('addition-ligne', 'addition', 'En ligne', 'Calculer 46 + 37 = ?', 'Calculez chaque addition.', 'ligne'),
  t('addition-trou', 'addition', 'En ligne avec des trous', 'Compléter 46 + ? = 83 ou ? + 37 = 83.', 'Complétez le nombre manquant.', 'trou'),
  t('addition-colonne', 'addition', 'En colonnes (nombres posés)', 'Les nombres sont déjà alignés dans le tableau.', 'Effectuez les additions en colonnes. Écrivez le résultat et les retenues.', 'colonne', { preferredColumns: 2 }),
  t('addition-colonne-poser', 'addition', 'En colonnes (à poser)', 'Poser soi-même les nombres dans le tableau.', 'Posez les nombres dans le tableau, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('addition-comparer', 'addition', 'Comparer des sommes', 'Comparer 12 + 8 et 15 + 4.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),

  t('soustraction-ligne', 'soustraction', 'En ligne', 'Calculer 83 − 46 = ?', 'Calculez chaque soustraction.', 'ligne'),
  t('soustraction-trou', 'soustraction', 'En ligne avec des trous', 'Compléter 83 − ? = 46 ou ? − 37 = 46.', 'Complétez le nombre manquant.', 'trou'),
  t('soustraction-colonne', 'soustraction', 'En colonnes (nombres posés)', 'Les nombres sont déjà alignés dans le tableau.', 'Effectuez les soustractions en colonnes. Écrivez le résultat et les emprunts.', 'colonne', { preferredColumns: 2 }),
  t('soustraction-colonne-poser', 'soustraction', 'En colonnes (à poser)', 'Poser soi-même les nombres dans le tableau.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('soustraction-comparer', 'soustraction', 'Comparer des différences', 'Comparer 90 − 12 et 88 − 8.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),

  t('estimation-dizaine', 'estimation', 'Arrondir à la dizaine', 'Arrondir 47 à la dizaine la plus proche.', 'Arrondissez à la dizaine la plus proche.', 'ligne'),
  t('estimation-centaine', 'estimation', 'Arrondir à la centaine', 'Arrondir 382 à la centaine la plus proche.', 'Arrondissez à la centaine la plus proche.', 'ligne'),
  t('estimation-somme', 'estimation', 'Estimer une somme', 'Estimer 48 + 33 à la dizaine.', 'Estimez le résultat à la dizaine la plus proche.', 'ligne'),
  t('estimation-difference', 'estimation', 'Estimer une différence', 'Estimer 91 − 28 à la dizaine.', 'Estimez le résultat à la dizaine la plus proche.', 'ligne'),

  t('multiplication-ligne', 'multiplication', 'En ligne (tables)', 'Calculer 7 × 8 = ?', 'Calculez chaque produit.', 'ligne'),
  t('multiplication-trou', 'multiplication', 'En ligne avec des trous', 'Compléter 7 × ? = 56.', 'Complétez le nombre manquant.', 'trou'),
  t('multiplication-colonne', 'multiplication', 'En colonnes × 1 chiffre', 'Nombres déjà posés, multiplicateur à 1 chiffre.', 'Effectuez les multiplications en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('multiplication-colonne-poser', 'multiplication', 'En colonnes à poser × 1 chiffre', 'Poser le calcul dans le tableau.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('multiplication-2chiffres', 'multiplication', 'En colonnes × 2 chiffres', 'Produits partiels (unités puis dizaines), puis addition.', 'Effectuez les multiplications en colonnes. Écrivez les deux produits partiels, puis additionnez.', 'colonne', { preferredColumns: 1 }),

  t('division-ligne', 'division', 'En ligne', 'Calculer 56 ÷ 7 = ?', 'Calculez chaque quotient.', 'ligne'),
  t('division-trou', 'division', 'En ligne avec des trous', 'Compléter 56 ÷ ? = 8.', 'Complétez le nombre manquant.', 'trou'),
  t('division-colonne', 'division', 'En colonnes (nombres posés)', 'Division posée en grille (dividende, étapes, quotient, reste).', 'Effectuez les divisions en colonnes. Écrivez les étapes, le quotient et le reste.', 'colonne', { preferredColumns: 1 }),
  t('division-colonne-poser', 'division', 'En colonnes (à poser)', 'Poser dividende et diviseur dans la grille, puis diviser.', 'Posez la division, puis calculez le quotient et le reste.', 'colonne-vide', { preferredColumns: 1 }),

  t('problemes-addition', 'problemes', 'Addition', 'Petits problèmes d’addition.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),
  t('problemes-soustraction', 'problemes', 'Soustraction', 'Petits problèmes de soustraction.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),
  t('problemes-add-sub', 'problemes', 'Addition et soustraction', 'Problèmes mêlant additions et soustractions.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),
  t('problemes-multiplication', 'problemes', 'Multiplication', 'Problèmes de multiplication.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),
  t('problemes-division', 'problemes', 'Division', 'Problèmes de division.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),
  t('problemes-melange', 'problemes', 'Tout mélanger', 'Problèmes avec les quatre opérations.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('multiples-reconnaitre', 'multiples', 'Reconnaître un multiple', 'Dire si un nombre est multiple d’un autre.', 'Répondez par oui ou non.', 'ligne'),
  t('multiples-diviseurs', 'multiples', 'Lister les diviseurs', 'Trouver tous les diviseurs d’un nombre.', 'Écrivez tous les diviseurs, du plus petit au plus grand.', 'texte'),
  t('multiples-pgcd', 'multiples', 'PGCD', 'Plus grand commun diviseur de deux nombres.', 'Calculez le PGCD.', 'ligne'),
  t('multiples-ppcm', 'multiples', 'PPCM', 'Plus petit commun multiple de deux nombres.', 'Calculez le PPCM.', 'ligne'),

  t('fractions-identifier', 'fractions', 'Lire une fraction', 'Donner le numérateur ou le dénominateur.', 'Complétez.', 'ligne'),
  t('fractions-equivalentes', 'fractions', 'Fractions équivalentes', 'Compléter 2/5 = ?/10.', 'Complétez la fraction équivalente.', 'ligne'),
  t('fractions-simplifier', 'fractions', 'Simplifier', 'Réduire une fraction.', 'Simplifiez chaque fraction.', 'ligne'),
  t('fractions-comparer', 'fractions', 'Comparer', 'Comparer deux fractions.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),
  t('fractions-add', 'fractions', 'Additionner / soustraire', 'Même dénominateur, puis dénominateurs différents.', 'Calculez et simplifiez si possible.', 'ligne'),
  t('fractions-mul', 'fractions', 'Multiplier', 'Produit de deux fractions.', 'Calculez et simplifiez si possible.', 'ligne'),
  t('fractions-div', 'fractions', 'Diviser', 'Division de deux fractions.', 'Calculez et simplifiez si possible.', 'ligne'),

  t('decimaux-comparer', 'decimaux', 'Comparer', 'Comparer 3,8 et 3,75.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),
  t('decimaux-add-colonne', 'decimaux', 'Addition en colonne (nombres posés)', 'Additions de décimaux déjà alignés.', 'Calculez les additions en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('decimaux-add-colonne-poser', 'decimaux', 'Addition en colonne à poser', 'Poser puis additionner des décimaux.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('decimaux-sub-colonne', 'decimaux', 'Soustraction en colonne (nombres posés)', 'Soustractions de décimaux déjà alignés.', 'Calculez les soustractions en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('decimaux-sub-colonne-poser', 'decimaux', 'Soustraction en colonne à poser', 'Poser puis soustraire des décimaux.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('decimaux-mul-colonne', 'decimaux', 'Multiplication en colonne (nombres posés)', 'Multiplier un décimal par un entier (posé).', 'Calculez les multiplications en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('decimaux-mul-colonne-poser', 'decimaux', 'Multiplication en colonne à poser', 'Poser puis multiplier un décimal par un entier.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('decimaux-div-colonne', 'decimaux', 'Division en colonne (nombres posés)', 'Division posée avec décimaux.', 'Effectuez les divisions en colonnes.', 'colonne', { preferredColumns: 1 }),
  t('decimaux-div-colonne-poser', 'decimaux', 'Division en colonne à poser', 'Poser puis diviser des décimaux.', 'Posez la division, puis calculez.', 'colonne-vide', { preferredColumns: 1 }),
  t('decimaux-mul-ligne', 'decimaux', 'Multiplication en ligne (facteurs)', 'Astuces × 0,5 · 0,25 · 0,2 · 0,1…', 'Calculez.', 'ligne'),
  t('decimaux-div-ligne', 'decimaux', 'Division en ligne (facteurs)', 'Astuces ÷ 0,5 · 0,25 · 0,2 · 0,1…', 'Calculez.', 'ligne'),

  t('proportion-notion', 'proportionnalite', 'Notion de pourcentage', 'Écrire 1/4 = 25 %.', 'Complétez.', 'ligne'),
  t('proportion-de', 'proportionnalite', 'Pourcentage d’un nombre', 'Calculer 20 % de 80.', 'Calculez.', 'ligne'),
  t('proportion-var', 'proportionnalite', 'Augmentation et réduction', 'Augmenter ou diminuer d’un pourcentage.', 'Calculez le nouveau montant.', 'ligne'),
  t('proportion-problemes', 'proportionnalite', 'Problèmes', 'Situations de proportionnalité.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('relatifs-comparer', 'relatifs', 'Comparer', 'Comparer −7 et −3.', 'Coloriez la pastille correcte.', 'ligne', { preferredColumns: 2 }),
  t('relatifs-add', 'relatifs', 'Addition et soustraction', 'Calculer (−8) + 5.', 'Calculez.', 'ligne'),
  t('relatifs-mul', 'relatifs', 'Multiplication et division', 'Calculer (−6) × 3.', 'Calculez.', 'ligne'),

  t('puissances-calcul', 'puissances', 'Calculer une puissance', 'Calculer 3², 2⁴.', 'Calculez.', 'ligne'),
  t('puissances-10', 'puissances', 'Puissances de 10', 'Écrire 10³ ou 0,01.', 'Écrivez le nombre demandé.', 'ligne'),
  t('puissances-racine', 'puissances', 'Racine carrée', 'Calculer √81.', 'Calculez.', 'ligne'),
  t('puissances-priorite', 'puissances', 'Priorité des opérations', 'Calculer 3 + 2 × 4².', 'Calculez en respectant les priorités.', 'ligne'),

  t('expressions-substituer', 'expressions', 'Évaluer (1 variable)', 'Calculer des expressions pour une même valeur, ex. t = 3.', 'Calculez le résultat.', 'ligne', { preferredColumns: 2 }),
  t('expressions-evaluer-2var', 'expressions', 'Évaluer (2 variables)', 'Évaluer cinq expressions avec les mêmes valeurs de deux lettres.', 'Évaluez les expressions avec deux variables. Les expressions utilisent les mêmes valeurs.', 'ligne', { preferredColumns: 2 }),
  t('expressions-evaluer-3var', 'expressions', 'Évaluer (3 variables)', 'Évaluer cinq expressions avec les mêmes valeurs de trois lettres.', 'Évaluez les expressions avec trois variables. Les expressions utilisent les mêmes valeurs.', 'ligne', { preferredColumns: 2 }),
  t('expressions-evaluer-avances', 'expressions', 'Évaluer (puissances et racines)', 'Évaluer avec carrés, cubes et racines carrées.', 'Évaluez les expressions avec puissances et racines. Les expressions utilisent les mêmes valeurs.', 'ligne', { preferredColumns: 2 }),
  t('expressions-produits', 'expressions', 'Simplifier les produits', 'Simplifier m² · 4 · n · 2.', 'Simplifiez les produits.', 'ligne', { preferredColumns: 2 }),
  t('expressions-reduire', 'expressions', 'Réduction', 'Réduire 3x + 5x − 2.', 'Réduisez chaque expression.', 'ligne', { preferredColumns: 2 }),
  t('expressions-developper', 'expressions', 'Développement', 'Développer 3(x + 4).', 'Développez, puis réduisez si besoin.', 'ligne', { preferredColumns: 2 }),
  t('expressions-factoriser', 'expressions', 'Factorisation', 'Factoriser 6x + 9.', 'Factorisez.', 'ligne', { preferredColumns: 2 }),

  t('equations-simple', 'equations', 'Équations simples', 'Résoudre x + 7 = 15.', 'Résolvez l’équation. Écrivez le développement, puis la valeur de x.', 'ligne', { preferredColumns: 1 }),
  t('equations-deux-cotes', 'equations', 'Inconnue des deux côtés', 'Résoudre 3x + 2 = x + 10.', 'Résolvez l’équation. Écrivez le développement, puis la valeur de x.', 'ligne', { preferredColumns: 1 }),
  t('equations-fractions', 'equations', 'Avec fractions', 'Résoudre x/2 + 3 = 7.', 'Résolvez l’équation. Écrivez le développement, puis la valeur de x.', 'ligne', { preferredColumns: 1 }),
  t('equations-systeme', 'equations', 'Systèmes (substitution)', 'Deux équations, deux inconnues.', 'Résolvez le système. Écrivez le développement, puis l’ensemble solution.', 'texte', { preferredColumns: 1 }),
  t('equations-systeme-add', 'equations', 'Systèmes (addition)', 'Combinaison linéaire.', 'Résolvez le système. Écrivez le développement, puis l’ensemble solution.', 'texte', { preferredColumns: 1 }),

  t('figures-nommer', 'figures', 'Nommer la figure', 'Reconnaître carré, rectangle, triangles, trapèzes, cercle, ovale…', 'Nommez chaque figure.', 'geo', { preferredColumns: 2 }),
  t('figures-proprietes', 'figures', 'Propriétés', 'Côtés, angles droits et symétries, y compris les triangles et les trapèzes.', 'Complétez les propriétés.', 'geo', { preferredColumns: 1 }),

  t('conversions-longueur', 'conversions', 'Longueurs', 'km, hm, dam, m, dm, cm, mm.', 'Convertissez.', 'ligne', { preferredColumns: 2 }),
  t('conversions-aire', 'conversions', 'Aires', 'km², hm², dam², m², dm², cm², mm².', 'Convertissez.', 'ligne', { preferredColumns: 2 }),
  t('conversions-volume', 'conversions', 'Volumes', 'km³, hm³, dam³, m³, dm³, cm³, mm³.', 'Convertissez.', 'ligne', { preferredColumns: 2 }),
  t('conversions-capacite', 'conversions', 'Capacités', 'L, dL, cL, mL.', 'Convertissez.', 'ligne', { preferredColumns: 2 }),
  t('conversions-masse', 'conversions', 'Masses', 'kg, g, mg.', 'Convertissez.', 'ligne', { preferredColumns: 2 }),
  t('conversions-temps', 'conversions', 'Temps', 'h, min, s.', 'Convertissez.', 'ligne', { preferredColumns: 2 }),

  t('perimetres-carre', 'perimetres', 'Carré', 'Périmètre d’un carré.', 'Calculez le périmètre.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('perimetres-rectangle', 'perimetres', 'Rectangle', 'Périmètre d’un rectangle.', 'Calculez le périmètre.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('perimetres-triangle', 'perimetres', 'Triangle', 'Périmètre d’un triangle (tous types).', 'Calculez le périmètre.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('perimetres-parallelogramme', 'perimetres', 'Parallélogramme', 'Périmètre d’un parallélogramme.', 'Calculez le périmètre.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('perimetres-losange', 'perimetres', 'Losange', 'Périmètre d’un losange.', 'Calculez le périmètre.', 'geo', { figure: 'rhombus', preferredColumns: 2 }),
  t('perimetres-trapeze', 'perimetres', 'Trapèze', 'Périmètre d’un trapèze.', 'Calculez le périmètre.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('perimetres-quadrilatere', 'perimetres', 'Quadrilatère', 'Périmètre des quadrilatères (sauf le cercle). Hasard ou choix des formes.', 'Calculez le périmètre.', 'geo', { preferredColumns: 2 }),
  t('perimetres-cercle', 'perimetres', 'Cercle', 'Périmètre = 2πr. Prenez π = 3,14.', 'Calculez le périmètre. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),
  t('perimetres-carre-manquant', 'perimetres', 'Côté du carré', 'Retrouver le côté à partir du périmètre.', 'Calculez le côté.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('perimetres-rectangle-manquant', 'perimetres', 'Largeur du rectangle', 'Retrouver une dimension à partir du périmètre.', 'Calculez la largeur.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('perimetres-triangle-manquant', 'perimetres', 'Côté du triangle', 'Retrouver un côté à partir du périmètre.', 'Calculez le côté demandé.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('perimetres-parallelogramme-manquant', 'perimetres', 'Côté du parallélogramme', 'Retrouver un côté à partir du périmètre.', 'Calculez le côté demandé.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('perimetres-losange-manquant', 'perimetres', 'Côté du losange', 'Retrouver le côté à partir du périmètre.', 'Calculez le côté.', 'geo', { figure: 'rhombus', preferredColumns: 2 }),
  t('perimetres-trapeze-manquant', 'perimetres', 'Côté du trapèze', 'Retrouver un côté à partir du périmètre.', 'Calculez le côté demandé.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('perimetres-quadrilatere-manquant', 'perimetres', 'Côté de quadrilatère', 'Retrouver un côté d’un quadrilatère à partir du périmètre.', 'Calculez le côté demandé.', 'geo', { preferredColumns: 2 }),
  t('perimetres-cercle-manquant', 'perimetres', 'Rayon du cercle', 'Retrouver le rayon à partir du périmètre.', 'Calculez le rayon. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),
  t(
    'perimetres-melange',
    'perimetres',
    'Tout mélanger',
    'Toutes les formes, au hasard : périmètre ou côté manquant.',
    'Calculez le périmètre ou la mesure demandée.',
    'geo',
    { preferredColumns: 2 },
  ),
  t(
    'perimetres-composees',
    'perimetres',
    'Figures composées',
    'Périmètre de figures assemblées (polygones, encoches, arcs). Traits égaux et côtés à déduire.',
    'Calculez le périmètre. Les petits traits marquent des longueurs égales. Prenez π = 3,14 si besoin.',
    'geo',
    { preferredColumns: 2 },
  ),

  t('aires-carre', 'aires', 'Carré', 'Aire d’un carré.', 'Calculez l’aire.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('aires-rectangle', 'aires', 'Rectangle', 'Aire d’un rectangle.', 'Calculez l’aire.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('aires-triangle', 'aires', 'Triangle', 'Aire = (b × h) / 2 (tous types).', 'Calculez l’aire.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('aires-parallelogramme', 'aires', 'Parallélogramme', 'Aire = b × h.', 'Calculez l’aire.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('aires-losange', 'aires', 'Losange', 'Aire = c × h.', 'Calculez l’aire.', 'geo', { figure: 'rhombus', preferredColumns: 2 }),
  t('aires-trapeze', 'aires', 'Trapèze', 'Aire = (B + b) × h / 2.', 'Calculez l’aire.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('aires-quadrilatere', 'aires', 'Quadrilatère', 'Aire des quadrilatères (sauf le disque). Hasard ou choix des formes.', 'Calculez l’aire.', 'geo', { preferredColumns: 2 }),
  t('aires-disque', 'aires', 'Disque', 'Aire = πr². Prenez π = 3,14.', 'Calculez l’aire. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),
  t('aires-carre-manquant', 'aires', 'Côté du carré', 'Retrouver le côté à partir de l’aire.', 'Calculez le côté.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('aires-rectangle-manquant', 'aires', 'Largeur du rectangle', 'Retrouver la largeur à partir de l’aire.', 'Calculez la largeur.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('aires-triangle-manquant', 'aires', 'Hauteur du triangle', 'Retrouver la hauteur à partir de l’aire.', 'Calculez la hauteur.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('aires-parallelogramme-manquant', 'aires', 'Hauteur du parallélogramme', 'Retrouver la hauteur à partir de l’aire.', 'Calculez la hauteur.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('aires-losange-manquant', 'aires', 'Hauteur du losange', 'Retrouver la hauteur à partir de l’aire.', 'Calculez la hauteur.', 'geo', { figure: 'rhombus', preferredColumns: 2 }),
  t('aires-trapeze-manquant', 'aires', 'Hauteur du trapèze', 'Retrouver la hauteur à partir de l’aire.', 'Calculez la hauteur.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('aires-quadrilatere-manquant', 'aires', 'Côté de quadrilatère', 'Retrouver une mesure d’un quadrilatère à partir de l’aire.', 'Calculez la mesure demandée.', 'geo', { preferredColumns: 2 }),
  t('aires-disque-manquant', 'aires', 'Rayon du disque', 'Retrouver le rayon à partir de l’aire.', 'Calculez le rayon. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),
  t('aires-melange', 'aires', 'Mélanger', 'Toutes les formes, au hasard : aire ou mesure manquante.', 'Calculez l’aire ou la mesure demandée.', 'geo', { preferredColumns: 2 }),

  t('volumes-cube', 'volumes', 'Cube', 'Volume d’un cube.', 'Calculez le volume.', 'geo', { figure: 'cube', preferredColumns: 2 }),
  t('volumes-pave', 'volumes', 'Pavé droit', 'Volume L × l × h.', 'Calculez le volume.', 'geo', { figure: 'cuboid', preferredColumns: 2 }),
  t('volumes-quadrilatere', 'volumes', 'Quadrilatère', 'Volume des prismes à faces quadrilatères (cube, pavé). Hasard ou choix.', 'Calculez le volume.', 'geo', { preferredColumns: 2 }),
  t('volumes-cylindre', 'volumes', 'Cylindre', 'Volume = πr²h. Prenez π = 3,14.', 'Calculez le volume. Prenez π = 3,14.', 'geo', { figure: 'cylinder', preferredColumns: 2 }),
  t('volumes-cone', 'volumes', 'Cône', 'Volume = πr²h / 3. Prenez π = 3,14.', 'Calculez le volume. Prenez π = 3,14.', 'geo', { figure: 'cone', preferredColumns: 2 }),
  t('volumes-sphere', 'volumes', 'Sphère', 'Volume = 4πr³ / 3. Prenez π = 3,14.', 'Calculez le volume. Prenez π = 3,14.', 'geo', { figure: 'sphere', preferredColumns: 2 }),
  t('volumes-cube-manquant', 'volumes', 'Arête du cube', 'Retrouver l’arête à partir du volume.', 'Calculez l’arête.', 'geo', { figure: 'cube', preferredColumns: 2 }),
  t('volumes-pave-manquant', 'volumes', 'Hauteur du pavé', 'Retrouver la hauteur à partir du volume.', 'Calculez la hauteur.', 'geo', { figure: 'cuboid', preferredColumns: 2 }),
  t('volumes-quadrilatere-manquant', 'volumes', 'Mesure du quadrilatère', 'Retrouver une arête ou une hauteur d’un prisme à faces quadrilatères.', 'Calculez la mesure demandée.', 'geo', { preferredColumns: 2 }),
  t('volumes-cylindre-manquant', 'volumes', 'Hauteur du cylindre', 'Retrouver la hauteur à partir du volume.', 'Calculez la hauteur. Prenez π = 3,14.', 'geo', { figure: 'cylinder', preferredColumns: 2 }),
  t('volumes-cone-manquant', 'volumes', 'Hauteur du cône', 'Retrouver la hauteur à partir du volume.', 'Calculez la hauteur. Prenez π = 3,14.', 'geo', { figure: 'cone', preferredColumns: 2 }),
  t('volumes-melange', 'volumes', 'Mélanger', 'Tous les solides, au hasard.', 'Calculez le volume ou la mesure demandée.', 'geo', { preferredColumns: 2 }),

  t('reperage-lire', 'reperage', 'Lire des coordonnées', 'Lire les coordonnées de formes sur un tableau.', 'Écrivez les coordonnées de chaque forme.', 'geo', { preferredColumns: 2 }),
  t('reperage-placer', 'reperage', 'Placer des formes', 'Dessiner les formes sur un tableau vide à partir des coordonnées.', 'Dessinez chaque forme à l’emplacement indiqué.', 'geo', { preferredColumns: 2 }),
  t('reperage-cadrans-lire', 'reperage', 'Lire les 4 cadrans', 'Lire les coordonnées de points dans le plan (axes et cadrans).', 'Écrivez les coordonnées de chaque point.', 'geo', { preferredColumns: 1 }),
  t('reperage-cadrans-placer', 'reperage', 'Placer dans les 4 cadrans', 'Placer des points sur un repère vide à partir des coordonnées.', 'Placez chaque point à l’emplacement indiqué.', 'geo', { preferredColumns: 1 }),
  t('reperage-cadrans-libre', 'reperage', 'Composer les points', 'Grille sans axes : un point est donné, l’origine est à trouver, les autres points se lisent comme dans les cadrans.', 'Un point est donné avec ses coordonnées. Trouvez l’origine du repère, puis écrivez les coordonnées des autres points.', 'geo', { preferredColumns: 1 }),
  t(
    'reperage-droites',
    'reperage',
    'Lire les droites',
    'Lire intersections, intercepts et positions de droites colorées sur un repère.',
    'Observez les droites du repère. Répondez aux questions.',
    'geo',
    { preferredColumns: 2 },
  ),
  t(
    'reperage-construire',
    'reperage',
    'Construire sur le repère',
    'Grille vide avec deux points donnés : tracer droites, parallèles, figures et symétries.',
    'Placez les points demandés. Tracez les droites et les figures.',
    'geo',
    { preferredColumns: 2 },
  ),

  t('transformations-axiale', 'transformations', 'Symétrie axiale', 'Image d’un point par une symétrie.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-centrale', 'transformations', 'Symétrie centrale', 'Symétrie par rapport à l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-translation', 'transformations', 'Translation', 'Translater un point d’un vecteur.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-rotation', 'transformations', 'Rotation', 'Rotation de 90° autour de l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),

  // —— Lecture (français / FLE voyelles) ——
  t('alphabet-classer', 'alphabet', 'Classer les lettres', 'Ranger des lettres dans l’ordre alphabétique.', 'Classez les lettres par ordre alphabétique.', 'suite', { preferredColumns: 1 }),
  t('alphabet-suivant', 'alphabet', 'Lettre suivante', 'Trouver la lettre qui suit immédiatement.', 'Coloriez la pastille de la lettre qui suit.', 'ligne', { preferredColumns: 2 }),
  t('alphabet-initiale', 'alphabet', 'Mot d’initiale', 'Proposer un mot qui commence par une lettre donnée.', 'Écrivez un mot qui commence par la lettre demandée.', 'texte', { preferredColumns: 1 }),

  // —— Phrase (grammaire en couleur / Gattegno) ——
  t('phrase-tableau-categories', 'phrase-tableaux', 'Tableau des catégories', 'Tableau Gattegno avec les noms de catégories.', 'Repérez les catégories de la grammaire en couleur.', 'texte', { preferredColumns: 1 }),
  t('phrase-tableau-mots', 'phrase-tableaux', 'Tableau des mots', 'Tableau Gattegno avec des exemples de mots.', 'Repérez les mots selon leur catégorie.', 'texte', { preferredColumns: 1 }),
  t('phrase-tableau-vide', 'phrase-tableaux', 'Tableau vide', 'Structure vide du tableau Gattegno.', 'Observez la structure du tableau.', 'texte', { preferredColumns: 1 }),
]

const VOWEL_TOPICS = [
  { topic: 'voyelle-a', letter: 'A', sound: '/a/' },
  { topic: 'voyelle-o', letter: 'O', sound: '/o/' },
  { topic: 'voyelle-i', letter: 'I', sound: '/i/' },
  { topic: 'voyelle-u', letter: 'U', sound: '/y/' },
  { topic: 'voyelle-e', letter: 'E', sound: '/ə/' },
  { topic: 'voyelle-y', letter: 'Y', sound: '/i/' },
] as const

for (const v of VOWEL_TOPICS) {
  const L = v.letter
  const low = L.toLowerCase()
  exerciseTypes.push(
    t(
      `${v.topic}-entourer`,
      v.topic,
      `Entourer ${L} ${low}`,
      `Repérer la lettre ${L} parmi d’autres lettres.`,
      `Entourez toutes les lettres ${L} ${low}.`,
      'ligne',
      { preferredColumns: 1 },
    ),
    t(
      `${v.topic}-cocher`,
      v.topic,
      `Mots avec ${v.sound}`,
      `Repérer les mots où l’on entend le son ${v.sound}.`,
      `Cochez les mots où l’on entend le son ${v.sound}.`,
      'ligne',
      { preferredColumns: 1 },
    ),
    t(
      `${v.topic}-syllabe`,
      v.topic,
      `Syllabe ${v.sound}`,
      `Indiquer quelle syllabe porte le son ${v.sound}.`,
      `Indiquez la syllabe qui contient le son ${v.sound}.`,
      'ligne',
      { preferredColumns: 2 },
    ),
    t(
      `${v.topic}-former`,
      v.topic,
      'Former un mot',
      'Associer deux parties pour former un mot.',
      'Associez les parties et écrivez le mot formé.',
      'texte',
      { preferredColumns: 1 },
    ),
    t(
      `${v.topic}-lettres`,
      v.topic,
      'Lettres mélangées',
      'Remettre des lettres dans l’ordre pour former un mot.',
      'Remettez les lettres dans l’ordre pour former le mot.',
      'texte',
      { preferredColumns: 1 },
    ),
    t(
      `${v.topic}-compter`,
      v.topic,
      `Compter la lettre ${low}`,
      `Compter les occurrences de la lettre ${low} dans un mot.`,
      `Comptez combien de fois apparaît la lettre ${low}.`,
      'texte',
      { preferredColumns: 2 },
    ),
  )
}

const FRENCH_THEMES: Array<{ id: string; grammar: string; vocab: string }> = [
  { id: 'fr-presenter', grammar: 'être, avoir et s’appeler', vocab: 'salutations et identité' },
  { id: 'fr-famille', grammar: 'adjectifs possessifs', vocab: 'liens de parenté' },
  { id: 'fr-description', grammar: 'accord des adjectifs de description', vocab: 'description physique' },
  { id: 'fr-logement', grammar: 'articles définis et indéfinis', vocab: 'pièces et logement' },
  { id: 'fr-achats', grammar: 'place de l’adjectif et quantité', vocab: 'courses et prix' },
  { id: 'fr-vetements', grammar: 'conditionnel de politesse', vocab: 'habits et tailles' },
  { id: 'fr-nourriture', grammar: 'articles partitifs', vocab: 'aliments et restaurant' },
  { id: 'fr-sante', grammar: 'il faut et devoir', vocab: 'corps et symptômes' },
  { id: 'fr-transports', grammar: 'aller au présent', vocab: 'moyens de transport' },
  { id: 'fr-inviter', grammar: 'questions formelles et informelles', vocab: 'invitations et sorties' },
  { id: 'fr-travail', grammar: 'accord des adjectifs', vocab: 'métiers et bureau' },
  { id: 'fr-journee', grammar: 'verbes pronominaux', vocab: 'routine quotidienne' },
  { id: 'fr-loisirs', grammar: 'pronoms COD', vocab: 'activités et hobbies' },
]

const FRENCH_KINDS: Array<{
  suffix: string
  track: FrenchTrack
  label: string
  description: (theme: (typeof FRENCH_THEMES)[number]) => string
  instruction: string
  visual: ExerciseType['visual']
}> = [
  {
    suffix: 'voc-mots',
    track: 'voc',
    label: 'Mots à apprendre',
    description: (theme) => `Tableau image + mot pour mémoriser le lexique (${theme.vocab}).`,
    instruction: 'Observez les images et apprenez les mots.',
    visual: 'texte',
  },
  {
    suffix: 'voc-assoc-image',
    track: 'voc',
    label: 'Association mot–image',
    description: (theme) => `Relier chaque image au mot (${theme.vocab}).`,
    instruction: 'Reliez chaque image au bon mot.',
    visual: 'ligne',
  },
  {
    suffix: 'voc-assoc-def',
    track: 'voc',
    label: 'Association mot–définition',
    description: (theme) => `Relier chaque définition au mot (${theme.vocab}).`,
    instruction: 'Reliez chaque définition au bon mot.',
    visual: 'ligne',
  },
  {
    suffix: 'voc-qcm-def',
    track: 'voc',
    label: 'QCM définition',
    description: (theme) => `Choisir le mot qui correspond à la définition (${theme.vocab}).`,
    instruction: 'Lisez la définition. Choisissez le bon mot.',
    visual: 'ligne',
  },
  {
    suffix: 'voc-trous',
    track: 'voc',
    label: 'Texte à trous',
    description: (theme) => `Compléter la phrase avec le bon mot (${theme.vocab}).`,
    instruction: 'Complétez chaque phrase avec le bon mot.',
    visual: 'trou',
  },
  {
    suffix: 'voc-def-ecrire',
    track: 'voc',
    label: 'Mot d’après la définition',
    description: (theme) => `Écrire le mot correspondant à la définition (${theme.vocab}).`,
    instruction: 'Lisez la définition. Écrivez le mot.',
    visual: 'trou',
  },
  {
    suffix: 'voc-phrase',
    track: 'voc',
    label: 'Utiliser le mot dans une phrase',
    description: (theme) => `Produire une phrase avec chaque mot (${theme.vocab}).`,
    instruction: 'Écrivez une phrase avec chaque mot.',
    visual: 'texte',
  },
  {
    suffix: 'voc-dictee',
    track: 'voc',
    label: 'Dictée',
    description: (theme) => `Écrire le mot ou la phrase dictée (${theme.vocab}).`,
    instruction: 'Écoutez. Écrivez le mot ou la phrase dictée.',
    visual: 'trou',
  },
  {
    suffix: 'voc-syllabes',
    track: 'voc',
    label: 'Syllabes',
    description: (theme) => `Reconstituer le mot à partir des syllabes (${theme.vocab}).`,
    instruction: 'Remettez les syllabes dans l’ordre pour former le mot.',
    visual: 'trou',
  },
  {
    suffix: 'voc-syn-ant',
    track: 'voc',
    label: 'Synonyme / antonyme',
    description: (theme) => `Donner un synonyme ou un antonyme quand c’est possible (${theme.vocab}).`,
    instruction: 'Donnez le synonyme ou l’antonyme demandé.',
    visual: 'trou',
  },
  {
    suffix: 'voc-genre',
    track: 'voc',
    label: 'Masculin / féminin',
    description: (theme) => `Écrire la forme masculine ou féminine quand c’est possible (${theme.vocab}).`,
    instruction: 'Écrivez la forme masculine ou féminine demandée.',
    visual: 'trou',
  },
  {
    suffix: 'gram-trous',
    track: 'gram',
    label: 'Texte à trous',
    description: (theme) => `Compléter la forme grammaticale : ${theme.grammar}.`,
    instruction: 'Complétez la phrase.',
    visual: 'trou',
  },
  {
    suffix: 'gram-conjuguer',
    track: 'gram',
    label: 'Conjuguer',
    description: (theme) => `Conjuguer selon le point de la fiche : ${theme.grammar}.`,
    instruction: 'Conjuguez le verbe entre parenthèses.',
    visual: 'trou',
  },
  {
    suffix: 'gram-choisir',
    track: 'gram',
    label: 'Choisir la forme',
    description: (theme) => `Choisir la forme correcte : ${theme.grammar}.`,
    instruction: 'Choisissez la forme correcte.',
    visual: 'ligne',
  },
  {
    suffix: 'com-orale',
    track: 'com',
    label: 'Compréhension orale',
    description: () =>
      'Écouter un enregistrement du thème (même audios que le soutien scolaire), puis répondre aux QCM. Pastille pour texte libre ou images si disponibles. Transcription au corrigé.',
    instruction: 'Écoutez l’enregistrement. Répondez aux questions.',
    visual: 'ligne',
  },
  {
    suffix: 'com-ecrite',
    track: 'com',
    label: 'Compréhension écrite',
    description: () => 'Lire un texte du thème, puis répondre uniquement aux QCM.',
    instruction: 'Lisez le texte. Répondez aux questions.',
    visual: 'ligne',
  },
  {
    suffix: 'com-dialogue',
    track: 'com',
    label: 'Dialogue à compléter',
    description: () => 'Réemployer le thème dans un échange guidé.',
    instruction: 'Complétez le dialogue.',
    visual: 'trou',
  },
]

for (const theme of FRENCH_THEMES) {
  for (const kind of FRENCH_KINDS) {
    exerciseTypes.push(
      t(`${theme.id}-${kind.suffix}`, theme.id, kind.label, kind.description(theme), kind.instruction, kind.visual, {
        preferredColumns: 1,
        track: kind.track,
      }),
    )
  }
}

const PHRASE_THEMES = [
  { topic: 'phrase-simple', label: 'Simple' },
  { topic: 'phrase-negation', label: 'Négation simple' },
  { topic: 'phrase-adjectif', label: 'Adjectif' },
  { topic: 'phrase-negation-adjectif', label: 'Négation avec adjectif' },
  { topic: 'phrase-determinants', label: 'Déterminants' },
  { topic: 'phrase-negation-determinants', label: 'Négation déterminants' },
  { topic: 'phrase-preposition', label: 'Préposition' },
  { topic: 'phrase-negation-preposition', label: 'Négation prépositions' },
  { topic: 'phrase-adverbe', label: 'Adverbe' },
  { topic: 'phrase-negation-adverbe', label: 'Négation avec adverbe' },
  { topic: 'phrase-conjonctions', label: 'Conjonctions' },
] as const

for (const theme of PHRASE_THEMES) {
  exerciseTypes.push(
    t(
      `${theme.topic}-colorier`,
      theme.topic,
      'Colorier les pastilles',
      'Phrase avec pastilles à colorier selon la catégorie Gattegno.',
      'Coloriez chaque mot selon sa catégorie.',
      'texte',
      { preferredColumns: 1 },
    ),
    t(
      `${theme.topic}-ordre`,
      theme.topic,
      'Remettre dans l’ordre',
      'Mots colorés à remettre dans l’ordre pour former la phrase.',
      'Mettez dans l’ordre les mots. Pensez à la majuscule et au point.',
      'texte',
      { preferredColumns: 1 },
    ),
    t(
      `${theme.topic}-construire`,
      theme.topic,
      'Écrire selon les pastilles',
      'Verbe donné + séquence de pastilles logique pour écrire une phrase.',
      'Écrivez les phrases selon la couleur du mot.',
      'texte',
      { preferredColumns: 1 },
    ),
    t(
      `${theme.topic}-ecrire`,
      theme.topic,
      'Production écrite',
      'Consigne de production avec lignes pour écrire des phrases.',
      'Écrivez des phrases.',
      'texte',
      { preferredColumns: 1 },
    ),
  )
}

export const exerciseTypeById = Object.fromEntries(exerciseTypes.map((type) => [type.id, type])) as Record<string, ExerciseType>

export function typesForTopic(topic: string, track?: FrenchTrack): ExerciseType[] {
  return exerciseTypes.filter((type) => type.topic === topic && (track == null || type.track === track))
}

export function isQuadExercise(typeId: string): boolean {
  return typeId.includes('-quadrilatere')
}

export function isDraftPadExercise(typeId: string): boolean {
  return (
    typeId.includes('problemes') ||
    typeId.startsWith('equations-') ||
    typeId.startsWith('perimetres-') ||
    typeId.startsWith('aires-') ||
    typeId.startsWith('volumes-')
  )
}

export function firstTypeFor(domain: Domain, topic?: string, track?: FrenchTrack): ExerciseType {
  if (topic) {
    const preferred = domain === 'français' ? (track ?? 'voc') : track
    const list = typesForTopic(topic, preferred)
    if (list[0]) return list[0]
    const any = typesForTopic(topic)
    if (any[0]) return any[0]
  }
  const fallbackTopic =
    domain === 'français'
      ? 'fr-presenter'
      : domain === 'algèbre'
        ? 'addition'
        : domain === 'géométrie'
          ? 'aires'
          : domain === 'phrase'
            ? 'phrase-simple'
            : 'voyelle-a'
  return typesForTopic(fallbackTopic)[0]!
}

export function defaultPage(domain: Domain = 'algèbre'): PageConfigLike {
  const type = firstTypeFor(domain)
  const count =
    domain === 'lecture' || domain === 'phrase'
      ? 6
      : domain === 'français'
        ? type.track === 'com'
          ? 4
          : 6
        : isDraftPadExercise(type.id)
          ? 2
          : 8
  return {
    domain,
    topic: type.topic,
    exerciseType: type.id,
    difficulty: 'moyen',
    count,
    columns: type.preferredColumns ?? 2,
    track: type.track,
    problemDraftGrids: isDraftPadExercise(type.id)
      ? Array.from({ length: count }, () => true)
      : undefined,
    oralAnswerModes: type.id.includes('-com-orale')
      ? Array.from({ length: count }, () => 'qcm' as const)
      : undefined,
  }
}

type PageConfigLike = {
  domain: Domain
  topic: string
  exerciseType: string
  difficulty: Difficulty
  count: number
  columns: number
  track?: FrenchTrack
  problemDraftGrids?: boolean[]
  oralAnswerModes?: Array<'qcm' | 'text' | 'images'>
}
