import type { Difficulty, Domain, ExerciseType, Topic } from './types'

export const topics: Topic[] = [
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
]

export const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic])) as Record<string, Topic>
export const algebraTopics = topics.filter((topic) => topic.domain === 'algèbre')
export const geometryTopics = topics.filter((topic) => topic.domain === 'géométrie')
export const lectureTopics = topics.filter((topic) => topic.domain === 'lecture')

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

  t('expressions-lire', 'expressions', 'Lire une expression', 'Traduire « le double de x plus 3 ».', 'Écrivez l’expression ou sa lecture.', 'texte', { preferredColumns: 2 }),
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

  t('figures-nommer', 'figures', 'Nommer la figure', 'Reconnaître carré, triangle, cercle…', 'Nommez chaque figure.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('figures-proprietes', 'figures', 'Propriétés', 'Côtés, sommets, angles droits.', 'Complétez la propriété.', 'geo', { figure: 'square', preferredColumns: 2 }),

  t('conversions-longueur', 'conversions', 'Longueurs', 'm, km, cm, mm.', 'Convertissez.', 'ligne'),
  t('conversions-aire', 'conversions', 'Aires', 'm², cm², km².', 'Convertissez.', 'ligne'),
  t('conversions-volume', 'conversions', 'Volumes', 'm³, cm³, dm³.', 'Convertissez.', 'ligne'),
  t('conversions-capacite', 'conversions', 'Capacités', 'L, cL, mL.', 'Convertissez.', 'ligne'),
  t('conversions-masse', 'conversions', 'Masses', 'kg, g, t.', 'Convertissez.', 'ligne'),
  t('conversions-temps', 'conversions', 'Temps', 'h, min, s.', 'Convertissez.', 'ligne'),

  t('perimetres-carre', 'perimetres', 'Carré', 'Périmètre d’un carré.', 'Calculez le périmètre.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('perimetres-rectangle', 'perimetres', 'Rectangle', 'Périmètre d’un rectangle.', 'Calculez le périmètre.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('perimetres-triangle', 'perimetres', 'Triangle', 'Périmètre d’un triangle (tous types).', 'Calculez le périmètre.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('perimetres-parallelogramme', 'perimetres', 'Parallélogramme', 'Périmètre d’un parallélogramme.', 'Calculez le périmètre.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('perimetres-trapeze', 'perimetres', 'Trapèze', 'Périmètre d’un trapèze.', 'Calculez le périmètre.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('perimetres-cercle', 'perimetres', 'Cercle', 'Périmètre = 2πr. Prenez π = 3,14.', 'Calculez le périmètre. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),

  t('aires-carre', 'aires', 'Carré', 'Aire d’un carré.', 'Calculez l’aire.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('aires-rectangle', 'aires', 'Rectangle', 'Aire d’un rectangle.', 'Calculez l’aire.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('aires-triangle', 'aires', 'Triangle', 'Aire = (b × h) / 2 (tous types).', 'Calculez l’aire.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('aires-parallelogramme', 'aires', 'Parallélogramme', 'Aire = b × h.', 'Calculez l’aire.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('aires-trapeze', 'aires', 'Trapèze', 'Aire = (B + b) × h / 2.', 'Calculez l’aire.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('aires-disque', 'aires', 'Disque', 'Aire = πr². Prenez π = 3,14.', 'Calculez l’aire. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),

  t('volumes-cube', 'volumes', 'Cube', 'Volume d’un cube.', 'Calculez le volume.', 'geo', { figure: 'cube', preferredColumns: 2 }),
  t('volumes-pave', 'volumes', 'Pavé droit', 'Volume L × l × h.', 'Calculez le volume.', 'geo', { figure: 'cuboid', preferredColumns: 2 }),
  t('volumes-cylindre', 'volumes', 'Cylindre', 'Volume = πr²h. Prenez π = 3,14.', 'Calculez le volume. Prenez π = 3,14.', 'geo', { figure: 'cylinder', preferredColumns: 2 }),

  t('reperage-lire', 'reperage', 'Lire des coordonnées', 'Lire les coordonnées de formes sur un tableau.', 'Écrivez les coordonnées de chaque forme.', 'geo', { preferredColumns: 1 }),
  t('reperage-placer', 'reperage', 'Placer des formes', 'Dessiner les formes sur un tableau vide à partir des coordonnées.', 'Dessinez chaque forme à l’emplacement indiqué.', 'geo', { preferredColumns: 1 }),
  t('reperage-abscisse', 'reperage', 'Abscisse et ordonnée', 'Identifier x ou y.', 'Complétez.', 'ligne', { preferredColumns: 1 }),

  t('transformations-axiale', 'transformations', 'Symétrie axiale', 'Image d’un point par une symétrie.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-centrale', 'transformations', 'Symétrie centrale', 'Symétrie par rapport à l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-translation', 'transformations', 'Translation', 'Translater un point d’un vecteur.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-rotation', 'transformations', 'Rotation', 'Rotation de 90° autour de l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),

  // —— Lecture (français / FLE voyelles) ——
  t('alphabet-classer', 'alphabet', 'Classer les lettres', 'Ranger des lettres dans l’ordre alphabétique.', 'Classez les lettres par ordre alphabétique.', 'suite', { preferredColumns: 1 }),
  t('alphabet-suivant', 'alphabet', 'Lettre suivante', 'Trouver la lettre qui suit immédiatement.', 'Coloriez la pastille de la lettre qui suit.', 'ligne', { preferredColumns: 2 }),
  t('alphabet-initiale', 'alphabet', 'Mot d’initiale', 'Proposer un mot qui commence par une lettre donnée.', 'Écrivez un mot qui commence par la lettre demandée.', 'texte', { preferredColumns: 1 }),
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

export const exerciseTypeById = Object.fromEntries(exerciseTypes.map((type) => [type.id, type])) as Record<string, ExerciseType>

export function typesForTopic(topic: string): ExerciseType[] {
  return exerciseTypes.filter((type) => type.topic === topic)
}

export function firstTypeFor(domain: Domain, topic?: string): ExerciseType {
  if (topic) {
    const list = typesForTopic(topic)
    if (list[0]) return list[0]
  }
  const fallbackTopic =
    domain === 'algèbre' ? 'addition' : domain === 'géométrie' ? 'aires' : 'voyelle-a'
  return typesForTopic(fallbackTopic)[0]!
}

export function defaultPage(domain: Domain = 'algèbre'): {
  domain: Domain
  topic: string
  exerciseType: string
  difficulty: Difficulty
  count: number
  columns: number
  problemDraftGrids?: boolean[]
} {
  const type = firstTypeFor(domain)
  const count = domain === 'lecture' ? 6 : 8
  return {
    domain,
    topic: type.topic,
    exerciseType: type.id,
    difficulty: 'moyen',
    count,
    columns: type.preferredColumns ?? 2,
    problemDraftGrids: type.id.includes('problemes') || type.id.startsWith('equations-')
      ? Array.from({ length: count }, () => true)
      : undefined,
  }
}
